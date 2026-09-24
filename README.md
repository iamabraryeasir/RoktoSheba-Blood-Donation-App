# 🩸 RoktoSheba — Emergency Blood Donation Coordination Platform

> **"Every Drop Saves a Life"**  
> RoktoSheba is a production-grade, multi-role mobile application designed to connect blood recipients and donors across Bangladesh swiftly during medical emergencies. Built with React Native (Expo SDK 54), TypeScript, NativeWind v4, Zustand v5, TanStack Query v5, and Supabase.

---

## 📌 Executive Summary & Core Value Proposition

RoktoSheba eliminates friction in emergency blood procurement. Instead of fragmented social media posts, RoktoSheba provides a structured, location-aware network:

- **Zero-Role Barrier**: A single user account can post a blood request today and respond as a donor tomorrow. Donor discovery is managed dynamically via `is_available_to_donate`.
- **Localized for Bangladesh**: Searchable division, district, and upazila/area selection covering all 8 divisions and 64 districts.
- **Privacy & Safety**: Donor precise coordinates are never published publicly. Contact details are disclosed only after a requester accepts a donor's response.
- **Self-Contained Auth**: 8-digit Email OTP verification eliminates external browser magic links or third-party OAuth redirect vulnerabilities.

---

## 🛠 Tech Stack Architecture

| Layer / Concern        | Technology                          | Technical Standard & Version Rules                                                             |
| :--------------------- | :---------------------------------- | :--------------------------------------------------------------------------------------------- |
| **Mobile Runtime**     | **Expo SDK 54 / React Native**      | Expo Router v4 (File-based navigation with strict route guards).                               |
| **Type Safety**        | **TypeScript 5.9**                  | Strict typing (`noImplicitAny: true`, Zod inferred types, Supabase DB schemas).                |
| **Styling & Design**   | **NativeWind v4 (Tailwind CSS)**    | Design tokens specified in `DESIGN.md` (`#DC2626` primary, Inter typography).                  |
| **Client Local State** | **Zustand v5**                      | Atomic client stores (`useAuthStore`, filters, UI state) with zero context re-render cascades. |
| **Server Data State**  | **TanStack Query (React Query v5)** | Strict query key factory pattern with automatic cache invalidation.                            |
| **Backend & Database** | **Supabase (PostgreSQL + RLS)**     | `@supabase/supabase-js` v2 with `AsyncStorage` session persistence.                            |
| **Forms & Validation** | **React Hook Form + Zod**           | Controlled inputs with `@hookform/resolvers/zod`. Zero unvalidated form submissions.           |
| **Native Components**  | **Expo Modules**                    | `@react-native-community/datetimepicker`, `expo-location`, `expo-haptics`, `expo-image`.       |

---

## 📁 Codebase Directory Structure

```text
RoktoSheba/
├── app/                              # Expo Router file-based routes (UI Layer)
│   ├── (auth)/                       # Unauthenticated route group
│   │   ├── _layout.tsx
│   │   ├── login.tsx                 # Email & password authentication
│   │   ├── register.tsx              # Account sign-up
│   │   ├── forgot-password.tsx       # Password recovery OTP dispatch
│   │   ├── reset-password.tsx        # 8-Digit OTP recovery & new password setup
│   │   └── verify-email.tsx          # 8-Digit Email OTP verification screen
│   ├── (onboarding)/                 # Profile completion guard route group
│   │   ├── _layout.tsx
│   │   └── index.tsx                 # Personal info, DatePicker, Location & Donor toggle
│   ├── (main)/                       # Authenticated tab navigation
│   │   ├── _layout.tsx
│   │   └── index.tsx                 # Home dashboard & quick actions
│   ├── admin/                        # Admin moderation group
│   │   ├── _layout.tsx
│   │   └── dashboard.tsx             # System statistics & report moderation
│   └── _layout.tsx                   # Root stack layout & authentication guard
├── assets/                           # Image-first static assets & fonts
│   ├── images/                       # App logo, blood group badges, urgency tags
│   └── fonts/                        # Inter font files
├── components/                       # Shared reusable UI primitives
│   ├── ui/
│   │   ├── AppButton.tsx             # Haptic-enabled primary/outline buttons
│   │   ├── AppDatePicker.tsx         # Age-constrained native date picker
│   │   ├── AppInput.tsx              # Controlled form text inputs
│   │   ├── BloodGroupBadge.tsx       # Image-first blood group selector
│   │   ├── OtpInput.tsx              # 8-Box numeric OTP entry component
│   │   └── SelectModal.tsx           # Searchable modal dropdown for locations
├── features/                         # Feature-driven business logic & domain state
│   ├── auth/
│   │   ├── hooks/useAuth.ts          # Reactive authentication hook wrapper
│   │   ├── schemas/authSchema.ts     # Zod validation schemas for auth forms
│   │   ├── services/authService.ts   # Supabase authentication API service
│   │   └── stores/useAuthStore.ts    # Zustand v5 global authentication store
├── lib/
│   ├── supabase/
│   │   └── client.ts                 # Supabase client singleton with AsyncStorage
│   ├── queryClient.ts                # TanStack Query client configuration
│   └── utils/
│       └── bangladeshLocations.ts    # Division, District & Upazila/Area dataset
└── types/                            # Global TypeScript definitions
    └── database.types.ts             # Supabase generated database types
```

---

## ⚡ Key Application Features

### 1. Authentication & Auto-Resend Workflow

- **8-Digit Numeric OTP**: Replaces legacy magic links. OTP codes are delivered directly to the user's email inbox with auto-focus movement and paste support (`components/ui/OtpInput.tsx`).
- **Unconfirmed Email Guard**: Attempting to sign in with an unverified account automatically dispatches a fresh 8-digit OTP code and routes the user to `/(auth)/verify-email`.
- **Password Recovery**: Secure password reset flow using 8-digit recovery codes with real-time password strength indicators.

### 2. Guided Profile Onboarding

- **Custom Age-Constrained DatePicker**: Features an interactive date picker (`components/ui/AppDatePicker.tsx`) that enforces donor age requirements ($\ge 16$ years) and calculates exact age in real-time.
- **Searchable Bangladesh Locations**: Integrated dataset (`lib/utils/bangladeshLocations.ts`) covering all 8 Divisions, 64 Districts, and Upazilas/Areas with searchable modal selection (`SelectModal.tsx`).
- **Blood Group Selection**: Image-first 8-badge selection grid (`A+`, `A-`, `B+`, `B-`, `O+`, `O-`, `AB+`, `AB-`).

### 3. Protection & Navigation Security

- **Zustand Auth Store**: Replaces heavy React Context wrappers, enabling atomic subscriptions (`useAuthStore(s => s.user)`).
- **Navigation Guard**: Root layout (`app/_layout.tsx`) automatically enforces route security based on session initialization, profile completion status, and admin roles.

---

## 🗄 Backend Architecture & Supabase Setup

### 1. Database Schema Execution

Execute the following SQL script in your **Supabase SQL Editor**:

```sql
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Enums
create type user_role as enum ('user', 'admin');
create type blood_group_type as enum ('A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-');
create type urgency_level as enum ('normal', 'urgent', 'critical');
create type request_status as enum ('active', 'fulfilled', 'cancelled', 'expired');
create type response_status as enum ('pending', 'accepted', 'declined', 'cancelled');

-- Profiles Table
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

-- Automatic Profile Creation Trigger
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
```

### 2. Row Level Security (RLS) Policies

```sql
alter table public.profiles enable row level security;

create policy "Public profiles are readable by authenticated users"
  on public.profiles for select to authenticated
  using (is_active = true);

create policy "Users can update their own profile"
  on public.profiles for update to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());
```

### 3. Supabase Email Template Setup (8-Digit OTP)

Go to **Supabase Dashboard** $\rightarrow$ **Authentication** $\rightarrow$ **Email Templates**:

- **Confirm Signup Template**:

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
              style="max-width: 520px; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; border: 1px solid #E5E7EB;"
            >
              <tr>
                <td
                  align="center"
                  style="background-color: #DC2626; padding: 32px 24px; text-align: center;"
                >
                  <h1
                    style="color: #FFFFFF; font-size: 24px; font-weight: 700; margin: 0 0 4px 0;"
                  >
                    RoktoSheba
                  </h1>
                  <p
                    style="color: #FEE2E2; font-size: 13px; margin: 0; text-transform: uppercase; letter-spacing: 1px;"
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
                    style="color: #4B5563; font-size: 15px; margin: 0 0 24px 0;"
                  >
                    Thank you for joining <strong>RoktoSheba</strong>. Please
                    use the 8-digit verification code below:
                  </p>
                  <div
                    style="background-color: #FEF2F2; border: 2px dashed #FCA5A5; border-radius: 12px; padding: 16px 24px; display: inline-block; margin-bottom: 24px;"
                  >
                    <span
                      style="font-family: monospace; color: #DC2626; font-size: 32px; font-weight: 800; letter-spacing: 6px;"
                      >{{ .Token }}</span
                    >
                  </div>
                  <p style="color: #6B7280; font-size: 13px; margin: 0;">
                    Enter this code in the RoktoSheba app. Valid for 15 minutes.
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

- **Reset Password Template**:
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
              style="max-width: 520px; background-color: #FFFFFF; border-radius: 16px; overflow: hidden; border: 1px solid #E5E7EB;"
            >
              <tr>
                <td
                  align="center"
                  style="background-color: #DC2626; padding: 32px 24px; text-align: center;"
                >
                  <h1
                    style="color: #FFFFFF; font-size: 24px; font-weight: 700; margin: 0 0 4px 0;"
                  >
                    Password Reset
                  </h1>
                  <p
                    style="color: #FEE2E2; font-size: 13px; margin: 0; text-transform: uppercase; letter-spacing: 1px;"
                  >
                    RoktoSheba Account Security
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
                    style="color: #4B5563; font-size: 15px; margin: 0 0 24px 0;"
                  >
                    Use the 8-digit recovery code below to choose a new
                    password:
                  </p>
                  <div
                    style="background-color: #FEF2F2; border: 2px dashed #FCA5A5; border-radius: 12px; padding: 16px 24px; display: inline-block; margin-bottom: 24px;"
                  >
                    <span
                      style="font-family: monospace; color: #DC2626; font-size: 32px; font-weight: 800; letter-spacing: 6px;"
                      >{{ .Token }}</span
                    >
                  </div>
                  <p style="color: #6B7280; font-size: 13px; margin: 0;">
                    Enter this code in the RoktoSheba app. Valid for 15 minutes.
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

## 🚀 Environment Setup & Local Development

### 1. Prerequisites

- **Node.js**: v18.x or v20.x
- **Bun** (Recommended) or **npm**
- **Expo Go App** (on Android/iOS device) or **Android Studio Emulator**

### 2. Environment Configuration

Create a `.env.local` or `.env` file in the root directory:

```ini
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. Installation & Local Server

```bash
# 1. Install dependencies
bun install

# 2. Start Expo Development Server
bun start
```

### 4. Running Verification Commands

```bash
# Run TypeScript static type checking
bunx tsc --noEmit

# Run ESLint check
bun run lint
```

---

## 📜 Coding Guidelines & Architecture Rules

- **Zero `any`**: All variables and API responses must be strictly typed using Zod inferred types or Supabase Database interface types.
- **Atomic Local State**: Use `useAuthStore` for client UI states. Avoid global React Context cascade re-renders.
- **NativeWind Stability**: Use solid design token classes (`border-primary`, `bg-primary-surface`) instead of dynamic slash-opacity parsing to avoid runtime interop issues.

---

## 📄 License

Distributed under the **MIT License**.
