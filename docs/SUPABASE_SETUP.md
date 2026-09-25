# 🗄 RoktoSheba — Supabase Backend & Database Setup Guide

> **Production Database Blueprint, Row-Level Security (RLS), Storage Policies, and Email Auth Configuration**  
> Companion document to [`README.md`](../README.md) for the **RoktoSheba** Emergency Blood Donation Platform.

---

## 📌 Overview

RoktoSheba utilizes **Supabase** (PostgreSQL, Supabase Auth, Storage, and Realtime Engine) as its serverless backend. This guide details the complete database setup, including tables, enums, triggers, Row-Level Security (RLS) policies, storage bucket configurations, and responsive HTML email templates for 8-digit numeric OTP authentication.

---

## 1. Database Schema & Triggers (SQL Editor)

Execute the following complete SQL script in the **Supabase Dashboard $\rightarrow$ SQL Editor**:

```sql
-- =============================================================================
-- 1. EXTENSIONS & PREREQUISITES
-- =============================================================================
create extension if not exists "uuid-ossp";

-- =============================================================================
-- 2. CUSTOM ENUM TYPES
-- =============================================================================
create type user_role as enum ('user', 'admin');
create type blood_group_type as enum ('A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-');
create type urgency_level as enum ('normal', 'urgent', 'critical');
create type request_status as enum ('active', 'fulfilled', 'cancelled', 'expired');
create type response_status as enum ('pending', 'accepted', 'declined', 'cancelled');
create type report_status as enum ('pending', 'reviewed', 'dismissed');

-- =============================================================================
-- 3. PROFILES TABLE (1-to-1 with auth.users)
-- =============================================================================
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  role user_role not null default 'user',
  full_name text,
  phone text,
  blood_group blood_group_type,
  date_of_birth date,
  division text,
  district text,
  area text,
  address_detail text,
  avatar_url text,
  is_available_to_donate boolean not null default false,
  last_donation_date date,
  onboarding_completed boolean not null default false,
  is_active boolean not null default true,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- =============================================================================
-- 4. AUTOMATIC PROFILE CREATION TRIGGER
-- =============================================================================
-- Automatically provision a public.profiles entry whenever a user registers in auth.users
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =============================================================================
-- 5. BLOOD REQUESTS TABLE
-- =============================================================================
create table public.blood_requests (
  id uuid default uuid_generate_v4() primary key,
  created_by uuid references public.profiles(id) on delete cascade not null,
  patient_name text not null,
  blood_group blood_group_type not null,
  hospital_name text not null,
  division text not null,
  district text not null,
  area text not null,
  needed_date_time timestamp with time zone not null,
  urgency urgency_level not null default 'normal',
  contact_number text not null,
  document_image_url text,
  latitude double precision,
  longitude double precision,
  status request_status not null default 'active',
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- =============================================================================
-- 6. DONATION RESPONSES TABLE
-- =============================================================================
create table public.donation_responses (
  id uuid default uuid_generate_v4() primary key,
  request_id uuid references public.blood_requests(id) on delete cascade not null,
  donor_id uuid references public.profiles(id) on delete cascade not null,
  message text,
  status response_status not null default 'pending',
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null,
  constraint unique_donor_per_request unique (request_id, donor_id)
);

-- =============================================================================
-- 7. DONATION FEEDBACK / RATING TABLE
-- =============================================================================
create table public.donation_feedback (
  id uuid default uuid_generate_v4() primary key,
  response_id uuid references public.donation_responses(id) on delete cascade not null,
  author_id uuid references public.profiles(id) on delete cascade not null,
  recipient_id uuid references public.profiles(id) on delete cascade not null,
  rating smallint check (rating >= 1 and rating <= 5) not null,
  comment text,
  created_at timestamp with time zone default now() not null
);

-- =============================================================================
-- 8. NOTIFICATIONS TABLE
-- =============================================================================
create table public.notifications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  body text not null,
  type text not null,
  entity_id uuid,
  is_read boolean not null default false,
  created_at timestamp with time zone default now() not null
);

-- =============================================================================
-- 9. MODERATION REPORTS TABLE
-- =============================================================================
create table public.reports (
  id uuid default uuid_generate_v4() primary key,
  reporter_id uuid references public.profiles(id) on delete cascade not null,
  target_type text not null check (target_type in ('user', 'request')),
  target_id uuid not null,
  reason text not null,
  status report_status not null default 'pending',
  reviewed_by uuid references public.profiles(id),
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);
```

---

## 2. Row Level Security (RLS) Policies

Enable Row-Level Security across all tables to enforce strict authorization boundaries at the database engine level.

```sql
-- Enable RLS on all tables
alter table public.profiles enable row level security;
alter table public.blood_requests enable row level security;
alter table public.donation_responses enable row level security;
alter table public.donation_feedback enable row level security;
alter table public.notifications enable row level security;
alter table public.reports enable row level security;

-- =============================================================================
-- HELPER FUNCTION: Check if requesting user is an admin
-- =============================================================================
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer;

-- =============================================================================
-- PROFILES POLICIES
-- =============================================================================
create policy "Public profiles are readable by authenticated users"
  on public.profiles for select
  to authenticated
  using (is_active = true or is_admin());

create policy "Users can update their own profile"
  on public.profiles for update
  to authenticated
  using (id = auth.uid())
  with check (
    id = auth.uid()
    and role = (select role from public.profiles where id = auth.uid()) -- Prevent self role-elevation
  );

create policy "Admins have full control over profiles"
  on public.profiles for all
  to authenticated
  using (is_admin());

-- =============================================================================
-- BLOOD REQUESTS POLICIES
-- =============================================================================
create policy "Active requests readable by all authenticated"
  on public.blood_requests for select
  to authenticated
  using (true);

create policy "Users can insert their own requests"
  on public.blood_requests for insert
  to authenticated
  with check (created_by = auth.uid());

create policy "Users can update their own requests"
  on public.blood_requests for update
  to authenticated
  using (created_by = auth.uid() or is_admin());

create policy "Admins can delete requests"
  on public.blood_requests for delete
  to authenticated
  using (is_admin() or created_by = auth.uid());

-- =============================================================================
-- DONATION RESPONSES POLICIES
-- =============================================================================
create policy "Responders and request owners can view responses"
  on public.donation_responses for select
  to authenticated
  using (
    donor_id = auth.uid()
    or exists (
      select 1 from public.blood_requests
      where id = donation_responses.request_id and created_by = auth.uid()
    )
    or is_admin()
  );

create policy "Available donors can submit responses"
  on public.donation_responses for insert
  to authenticated
  with check (donor_id = auth.uid());

create policy "Participants can update response status"
  on public.donation_responses for update
  to authenticated
  using (
    donor_id = auth.uid()
    or exists (
      select 1 from public.blood_requests
      where id = donation_responses.request_id and created_by = auth.uid()
    )
    or is_admin()
  );

-- =============================================================================
-- NOTIFICATIONS POLICIES
-- =============================================================================
create policy "Users can view their own notifications"
  on public.notifications for select
  to authenticated
  using (user_id = auth.uid());

create policy "Users can mark own notifications read"
  on public.notifications for update
  to authenticated
  using (user_id = auth.uid());

-- =============================================================================
-- REPORTS POLICIES
-- =============================================================================
create policy "Users can create reports"
  on public.reports for insert
  to authenticated
  with check (reporter_id = auth.uid());

create policy "Only admins can view and update reports"
  on public.reports for all
  to authenticated
  using (is_admin());
```

---

## 3. Storage Buckets & Policies

In **Supabase Dashboard $\rightarrow$ Storage**, create the following two public buckets:

### 3.1 `avatars` Bucket

- **Visibility**: Public
- **Max File Size**: 5 MB
- **Allowed MIME Types**: `image/jpeg`, `image/png`, `image/webp`
- **Storage Policies**:

  ```sql
  -- Allow public viewing of avatars
  create policy "Anyone can view avatars"
    on storage.objects for select
    using (bucket_id = 'avatars');

  -- Users can upload and update their own avatar folder
  create policy "Users can upload their own avatar"
    on storage.objects for insert
    to authenticated
    with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

  create policy "Users can update their own avatar"
    on storage.objects for update
    to authenticated
    using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
  ```

### 3.2 `request-documents` Bucket

- **Visibility**: Public (or authenticated restricted)
- **Max File Size**: 10 MB
- **Allowed MIME Types**: `image/jpeg`, `image/png`, `image/webp`
- **Storage Policies**:

  ```sql
  create policy "Authenticated users can view request documents"
    on storage.objects for select
    to authenticated
    using (bucket_id = 'request-documents');

  create policy "Authenticated users can upload request documents"
    on storage.objects for insert
    to authenticated
    with check (bucket_id = 'request-documents');
  ```

---

## 4. Realtime Publication

To enable real-time updates for notifications, donation responses, and active requests:

```sql
begin;
  drop publication if exists supabase_realtime;
  create publication supabase_realtime for table
    public.notifications,
    public.donation_responses,
    public.blood_requests;
commit;
```

---

## 5. Responsive 8-Digit OTP Email Templates

In **Supabase Dashboard $\rightarrow$ Authentication $\rightarrow$ Email Templates**:

### 5.1 Confirm Signup Template

Configure Subject: `Verify Your Email — RoktoSheba`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Verify Your Email — RoktoSheba</title>
  </head>
  <body
    style="margin: 0; padding: 0; background-color: #F3F4F6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;"
  >
    <table
      role="presentation"
      border="0"
      cellpadding="0"
      cellspacing="0"
      width="100%"
      style="background-color: #F3F4F6; padding: 24px 12px;"
    >
      <tr>
        <td align="center">
          <table
            role="presentation"
            border="0"
            cellpadding="0"
            cellspacing="0"
            width="100%"
            style="max-width: 520px; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); border: 1px solid #E5E7EB;"
          >
            <tr>
              <td
                align="center"
                style="background-color: #DC2626; padding: 32px 24px; text-align: center;"
              >
                <h1
                  style="color: #FFFFFF; font-size: 24px; font-weight: 700; margin: 0 0 4px 0; letter-spacing: -0.5px;"
                >
                  RoktoSheba
                </h1>
                <p
                  style="color: #FEE2E2; font-size: 13px; font-weight: 500; margin: 0; text-transform: uppercase; letter-spacing: 1px;"
                >
                  Every Drop Saves a Life
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding: 32px 24px; text-align: center;">
                <h2
                  style="color: #111827; font-size: 20px; font-weight: 700; margin: 0 0 12px 0;"
                >
                  Verify Your Email Address
                </h2>
                <p
                  style="color: #4B5563; font-size: 15px; line-height: 1.5; margin: 0 0 24px 0;"
                >
                  Thank you for joining <strong>RoktoSheba</strong>. Please use
                  the 8-digit verification code below to confirm your account
                  and complete registration.
                </p>
                <div
                  style="background-color: #FEF2F2; border: 2px dashed #FCA5A5; border-radius: 12px; padding: 16px 24px; display: inline-block; margin-bottom: 24px;"
                >
                  <span
                    style="font-family: 'Courier New', Courier, monospace; color: #DC2626; font-size: 32px; font-weight: 800; letter-spacing: 6px;"
                    >{{ .Token }}</span
                  >
                </div>
                <p
                  style="color: #6B7280; font-size: 13px; line-height: 1.5; margin: 0 0 16px 0;"
                >
                  Enter this code in the RoktoSheba app. This code will expire
                  in <strong>15 minutes</strong>.
                </p>
                <p style="color: #9CA3AF; font-size: 12px; margin: 0;">
                  If you did not request this account registration, please
                  safely ignore this email.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
```

### 5.2 Reset Password Template

Configure Subject: `Reset Your Password — RoktoSheba`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Reset Your Password — RoktoSheba</title>
  </head>
  <body
    style="margin: 0; padding: 0; background-color: #F3F4F6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;"
  >
    <table
      role="presentation"
      border="0"
      cellpadding="0"
      cellspacing="0"
      width="100%"
      style="background-color: #F3F4F6; padding: 24px 12px;"
    >
      <tr>
        <td align="center">
          <table
            role="presentation"
            border="0"
            cellpadding="0"
            cellspacing="0"
            width="100%"
            style="max-width: 520px; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); border: 1px solid #E5E7EB;"
          >
            <tr>
              <td
                align="center"
                style="background-color: #DC2626; padding: 32px 24px; text-align: center;"
              >
                <h1
                  style="color: #FFFFFF; font-size: 24px; font-weight: 700; margin: 0 0 4px 0; letter-spacing: -0.5px;"
                >
                  RoktoSheba
                </h1>
                <p
                  style="color: #FEE2E2; font-size: 13px; font-weight: 500; margin: 0; text-transform: uppercase; letter-spacing: 1px;"
                >
                  Security & Password Recovery
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding: 32px 24px; text-align: center;">
                <h2
                  style="color: #111827; font-size: 20px; font-weight: 700; margin: 0 0 12px 0;"
                >
                  Password Recovery Code
                </h2>
                <p
                  style="color: #4B5563; font-size: 15px; line-height: 1.5; margin: 0 0 24px 0;"
                >
                  We received a request to reset your password. Use the 8-digit
                  verification code below to authorize your new password:
                </p>
                <div
                  style="background-color: #FEF2F2; border: 2px dashed #FCA5A5; border-radius: 12px; padding: 16px 24px; display: inline-block; margin-bottom: 24px;"
                >
                  <span
                    style="font-family: 'Courier New', Courier, monospace; color: #DC2626; font-size: 32px; font-weight: 800; letter-spacing: 6px;"
                    >{{ .Token }}</span
                  >
                </div>
                <p
                  style="color: #6B7280; font-size: 13px; line-height: 1.5; margin: 0 0 16px 0;"
                >
                  Enter this code on the password reset screen in the RoktoSheba
                  app. Valid for <strong>15 minutes</strong>.
                </p>
                <p style="color: #9CA3AF; font-size: 12px; margin: 0;">
                  If you did not request a password reset, your account is
                  secure and you can disregard this email.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
```

---

## 6. Creating Your First Admin Account

1. Register normally through the mobile app using your preferred admin email.
2. Confirm the 8-digit OTP to activate the account.
3. In **Supabase SQL Editor**, elevate your role to `admin`:
   ```sql
   update public.profiles
   set role = 'admin'
   where id = (
     select id from auth.users where email = 'your-admin-email@example.com'
   );
   ```
4. On next launch or profile reload, the mobile app will detect `role === 'admin'` and grant full access to `/admin` routes.
