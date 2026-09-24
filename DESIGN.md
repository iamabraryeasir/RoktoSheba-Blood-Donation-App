# RoktoSheba — Mobile UI/UX Design Specification

> **Design philosophy:** Warm, trustworthy, and urgency-aware.  
> **Visual direction:** Modern, clean, image-rich with raster-based iconography (PNG/WebP). Minimal SVG icon usage.  
> **Platform:** Android-first (React Native / Expo), dark & light themes  
> **Designer:** Senior UI/UX specification for developer handoff

---

## Part 1 — Design System

### 1.1 Brand Identity

| Attribute       | Value                                                                |
| --------------- | -------------------------------------------------------------------- |
| App name        | **RoktoSheba** (রক্তসেবা)                                            |
| Tagline         | _"Every Drop Saves a Life"_                                          |
| Logo concept    | Stylised blood drop forming a caring hand — rendered as PNG/WebP     |
| Tone            | Compassionate, urgent when needed, always trustworthy                |
| Visual language | Photography-forward, soft gradients, generous whitespace, soft depth |

### 1.2 Color Tokens

All colors are defined as CSS-style hex values and mapped to NativeWind/Tailwind classes.

#### Light Theme

| Token              | Hex         | Tailwind class | Usage                                      |
| ------------------ | ----------- | -------------- | ------------------------------------------ |
| `primary`          | `#DC2626`   | `red-600`      | Primary buttons, active states, brand      |
| `primary-hover`    | `#B91C1C`   | `red-700`      | Button press/hover state                   |
| `primary-light`    | `#FEF2F2`   | `red-50`       | Tinted backgrounds, selected cards         |
| `primary-surface`  | `#FEE2E2`   | `red-100`      | Badge backgrounds, tag fills               |
| `secondary`        | `#FB7185`   | `rose-400`     | Accent illustrations, secondary highlights |
| `success`          | `#16A34A`   | `green-600`    | Available badge, fulfilled status          |
| `warning`          | `#F59E0B`   | `amber-500`    | Urgent badge, caution states               |
| `critical`         | `#DC2626`   | `red-600`      | Critical urgency badge (same as primary)   |
| `info`             | `#2563EB`   | `blue-600`     | Info badges, links                         |
| `background`       | `#FFFFFF`   | `white`        | Screen background                          |
| `surface`          | `#F9FAFB`   | `gray-50`      | Card backgrounds, input fields             |
| `surface-elevated` | `#FFFFFF`   | `white`        | Elevated cards with shadow                 |
| `border`           | `#E5E7EB`   | `gray-200`     | Input borders, dividers                    |
| `border-focus`     | `#DC2626`   | `red-600`      | Focused input border                       |
| `text-primary`     | `#111827`   | `gray-900`     | Headings, body text                        |
| `text-secondary`   | `#6B7280`   | `gray-500`     | Captions, placeholders, metadata           |
| `text-tertiary`    | `#9CA3AF`   | `gray-400`     | Disabled text, timestamps                  |
| `text-on-primary`  | `#FFFFFF`   | `white`        | Text on primary-colored backgrounds        |
| `overlay`          | `#00000066` | `black/40`     | Modal/bottom-sheet backdrop                |

#### Dark Theme

| Token              | Hex         | Tailwind class | Usage                                  |
| ------------------ | ----------- | -------------- | -------------------------------------- |
| `primary`          | `#EF4444`   | `red-500`      | Slightly brighter for dark backgrounds |
| `primary-hover`    | `#DC2626`   | `red-600`      | Press state                            |
| `primary-light`    | `#450A0A`   | `red-950`      | Tinted surface on dark                 |
| `primary-surface`  | `#7F1D1D`   | `red-900`      | Badge/tag fills                        |
| `background`       | `#0F172A`   | `slate-900`    | Screen background                      |
| `surface`          | `#1E293B`   | `slate-800`    | Card backgrounds                       |
| `surface-elevated` | `#334155`   | `slate-700`    | Elevated cards                         |
| `border`           | `#334155`   | `slate-700`    | Borders, dividers                      |
| `text-primary`     | `#F1F5F9`   | `slate-100`    | Body text                              |
| `text-secondary`   | `#94A3B8`   | `slate-400`    | Captions, metadata                     |
| `text-tertiary`    | `#64748B`   | `slate-500`    | Disabled, timestamps                   |
| `overlay`          | `#000000B3` | `black/70`     | Modal backdrop                         |

### 1.3 Typography

**Font family:** `Inter` (Google Fonts, bundled with the app via `expo-font`)

| Style            | Weight        | Size (px) | Line Height | Letter Spacing | Usage                         |
| ---------------- | ------------- | --------- | ----------- | -------------- | ----------------------------- |
| `display`        | Bold (700)    | 28        | 34          | -0.5           | Splash/hero titles            |
| `h1`             | Bold (700)    | 24        | 30          | -0.3           | Screen titles                 |
| `h2`             | SemiBold(600) | 20        | 26          | -0.2           | Section headings              |
| `h3`             | SemiBold(600) | 17        | 22          | 0              | Card titles, dialog titles    |
| `body`           | Regular (400) | 15        | 22          | 0              | Body text, descriptions       |
| `body-medium`    | Medium (500)  | 15        | 22          | 0              | Emphasized body               |
| `caption`        | Regular (400) | 13        | 18          | 0.1            | Metadata, timestamps, labels  |
| `caption-medium` | Medium (500)  | 13        | 18          | 0.1            | Badge text, tab labels        |
| `overline`       | SemiBold(600) | 11        | 16          | 0.8            | Section overlines, all-caps   |
| `button`         | SemiBold(600) | 15        | 20          | 0.3            | Button labels                 |
| `button-small`   | SemiBold(600) | 13        | 18          | 0.3            | Small/secondary button labels |

### 1.4 Spacing Scale

Based on a 4px grid. Use consistently throughout all screens.

| Token  | Value | Usage examples                       |
| ------ | ----- | ------------------------------------ |
| `xs`   | 4px   | Inline icon-to-text gap              |
| `sm`   | 8px   | Tight padding, list item inner gap   |
| `md`   | 12px  | Input inner padding, card inner gap  |
| `base` | 16px  | Standard padding, section gaps       |
| `lg`   | 20px  | Card padding, screen horizontal edge |
| `xl`   | 24px  | Section vertical spacing             |
| `2xl`  | 32px  | Major section breaks                 |
| `3xl`  | 40px  | Screen top/bottom safe area padding  |
| `4xl`  | 48px  | Hero spacing                         |

### 1.5 Border Radius

| Token  | Value | Usage                            |
| ------ | ----- | -------------------------------- |
| `sm`   | 6px   | Small badges, chips              |
| `md`   | 10px  | Input fields, small cards        |
| `lg`   | 14px  | Cards, modals                    |
| `xl`   | 20px  | Feature cards, bottom sheets     |
| `full` | 9999  | Avatars, circular buttons, pills |

### 1.6 Elevation & Shadows

| Level    | Shadow (Android elevation)        | Usage                          |
| -------- | --------------------------------- | ------------------------------ |
| `none`   | 0                                 | Flat elements                  |
| `low`    | 2 — `0 1px 3px rgba(0,0,0,0.08)`  | Cards at rest                  |
| `medium` | 4 — `0 2px 8px rgba(0,0,0,0.12)`  | Floating action, elevated card |
| `high`   | 8 — `0 4px 16px rgba(0,0,0,0.16)` | Bottom sheet, modal            |

### 1.7 Iconography Strategy — Image-First

> **Core principle:** Use raster PNG/WebP images instead of SVG icon libraries wherever possible.

| Category            | Asset format          | Source / approach                                         |
| ------------------- | --------------------- | --------------------------------------------------------- |
| Tab bar icons       | PNG (1x/2x/3x)        | Custom pixel-perfect icons exported from Figma at 24×24dp |
| Blood group badges  | PNG with transparency | Pre-rendered styled badges per blood type                 |
| Urgency indicators  | PNG                   | Color-coded urgency dot/flame images                      |
| Onboarding art      | PNG/WebP              | Illustrations: blood donation scenes, community imagery   |
| Empty states        | PNG/WebP              | Friendly illustrated empty-state artwork                  |
| Status indicators   | PNG                   | Check marks, clocks, warning icons as images              |
| Category images     | PNG/WebP              | Feature category cards use photo backgrounds              |
| Profile placeholder | PNG                   | Default avatar image (person silhouette)                  |

**Allowed SVG exceptions (minimal):**

- Simple UI affordance glyphs where an image asset would be overkill (e.g., a chevron `>` for list navigation, a small `×` close button)
- These should use inline SVG via `react-native-svg`, not an icon library

### 1.8 Image Assets Directory

```
assets/
├── images/
│   ├── logo/
│   │   ├── logo-full.png           # Full logo with text
│   │   ├── logo-mark.png           # Blood drop mark only
│   │   └── logo-splash.png         # Splash screen version
│   ├── onboarding/
│   │   ├── onboarding-welcome.png  # Welcome illustration
│   │   ├── onboarding-donor.png    # Become a donor illustration
│   │   └── onboarding-save.png     # Save lives illustration
│   ├── tabs/
│   │   ├── tab-home.png
│   │   ├── tab-home-active.png
│   │   ├── tab-requests.png
│   │   ├── tab-requests-active.png
│   │   ├── tab-create.png          # FAB icon
│   │   ├── tab-donors.png
│   │   ├── tab-donors-active.png
│   │   ├── tab-profile.png
│   │   └── tab-profile-active.png
│   ├── blood-groups/
│   │   ├── badge-a-pos.png
│   │   ├── badge-a-neg.png
│   │   ├── badge-b-pos.png
│   │   ├── badge-b-neg.png
│   │   ├── badge-o-pos.png
│   │   ├── badge-o-neg.png
│   │   ├── badge-ab-pos.png
│   │   └── badge-ab-neg.png
│   ├── empty-states/
│   │   ├── empty-requests.png
│   │   ├── empty-donors.png
│   │   ├── empty-notifications.png
│   │   └── empty-search.png
│   ├── status/
│   │   ├── status-active.png
│   │   ├── status-fulfilled.png
│   │   ├── status-cancelled.png
│   │   └── status-expired.png
│   ├── urgency/
│   │   ├── urgency-normal.png
│   │   ├── urgency-urgent.png
│   │   └── urgency-critical.png
│   ├── misc/
│   │   ├── avatar-placeholder.png
│   │   ├── hospital-placeholder.png
│   │   ├── google-logo.png
│   │   ├── notification-bell.png
│   │   ├── camera-icon.png
│   │   ├── gallery-icon.png
│   │   ├── location-pin.png
│   │   ├── search-icon.png
│   │   ├── filter-icon.png
│   │   ├── heart-filled.png
│   │   ├── star-filled.png
│   │   ├── star-empty.png
│   │   └── calendar-icon.png
│   └── learn/
│       ├── learn-hero.png
│       ├── tip-hydrate.png
│       ├── tip-rest.png
│       └── tip-eligibility.png
```

### 1.9 Component Library

Below are the reusable components that form the building blocks of every screen.

---

#### `<AppButton>`

| Variant    | Appearance                                                                 |
| ---------- | -------------------------------------------------------------------------- |
| `primary`  | Solid `primary` background, white text, `border-radius: full`, full-width  |
| `outline`  | White/surface background, `primary` border and text, `border-radius: full` |
| `ghost`    | Transparent background, `primary` text, no border                          |
| `danger`   | Solid `red-700` background, white text                                     |
| `disabled` | `gray-200` background, `gray-400` text, no interaction                     |

- Height: 48px (standard), 40px (small variant)
- Text style: `button` / `button-small`
- Loading state: Replace label with a white spinner image (PNG), disable press
- Haptic feedback on press (light impact)

---

#### `<AppInput>`

- Height: 52px
- Background: `surface` color
- Border: 1px `border` color, transitions to `border-focus` on focus
- Border radius: `md` (10px)
- Label: `caption-medium`, positioned above the input, `text-secondary`
- Placeholder: `body`, `text-tertiary`
- Error state: border turns `primary` (red), error message in `caption` below in red
- Leading image: Optional PNG icon (24×24) inside input, left-aligned
- Trailing action: Optional eye-toggle image for password, clear-text image

---

#### `<BloodGroupBadge>`

- Displays the pre-rendered blood group PNG image from `assets/images/blood-groups/`
- Size variants: `sm` (28×28), `md` (36×36), `lg` (48×48)
- Used in request cards, donor cards, profile headers, and filter chips

---

#### `<UrgencyTag>`

- Uses urgency PNG images from `assets/images/urgency/`
- Label text alongside the image: "Normal", "Urgent", "Critical"
- Background tint: `green-50`/`amber-50`/`red-50` respectively
- Text color: `green-700`/`amber-700`/`red-700`
- Border radius: `sm` (6px), padding: `xs` vertical, `sm` horizontal

---

#### `<RequestCard>`

A horizontally-aware card used in list and grid layouts:

```
┌─────────────────────────────────────────────┐
│ [BloodGroupBadge]  Patient Name        [UrgencyTag] │
│                    Hospital Name                    │
│                    District, Area                   │
│ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ │
│ 📅 Needed: 28 Aug 2026   ⏰ 2h remaining           │
│ [StatusBadge]              [Respond Button]         │
└─────────────────────────────────────────────┘
```

- Background: `surface-elevated` with `low` shadow
- Border radius: `lg` (14px)
- Padding: `lg` (20px)
- Blood group badge on the left, aligned to top
- Urgency tag top-right
- Date/time row uses `caption` style with calendar and clock PNG images
- Tap → navigates to Request Detail screen

---

#### `<DonorCard>`

```
┌──────────────────────────────────┐
│  ┌──────┐                        │
│  │Avatar│  Donor Name            │
│  │ Photo│  Blood Group Badge     │
│  └──────┘  District, Area        │
│            Last donated: 3 mo ago│
│  [🟢 Available]   [View Profile] │
└──────────────────────────────────┘
```

- Avatar: 56×56 circle, loaded from Supabase Storage, fallback to `avatar-placeholder.png`
- Availability dot: green circle image if available
- Border radius: `lg`, padding: `lg`
- Shadow: `low`

---

#### `<NotificationItem>`

- Left: 40×40 circular image (notification type: blood drop for request, check for accepted, etc.)
- Body: Title in `body-medium`, description in `caption`, timestamp in `caption` + `text-tertiary`
- Unread indicator: small red dot (8×8 PNG image) top-right of icon
- Swipe-to-dismiss optional

---

#### `<StatCard>` (Admin)

- Number in `display` style, bold
- Label in `caption-medium` below
- Subtle background tint matching the stat type
- Border radius: `lg`
- Used in 2-column grid

---

#### `<EmptyState>`

- Centered illustration from `assets/images/empty-states/` (180×180)
- Title in `h3`, centered
- Description in `body` + `text-secondary`, centered, max 2 lines
- Optional CTA button below

---

#### `<BottomSheet>`

- Backdrop: `overlay` color
- Container: `surface-elevated` background, top border radius `xl` (20px)
- Drag handle: centered 40×4 rounded pill, `gray-300`
- Snap points configurable per usage
- Shadow: `high`

---

#### `<Avatar>`

- Sizes: `sm` (32px), `md` (48px), `lg` (72px), `xl` (96px)
- Shape: Circle (`border-radius: full`)
- Border: 2px `white` (creates lift effect on colored backgrounds)
- Fallback: `avatar-placeholder.png` from assets
- Camera badge overlay (small camera PNG image) on profile edit variant

---

#### `<FilterChip>`

- Pill shape (`border-radius: full`)
- Unselected: `surface` background, `border` border, `text-secondary` text
- Selected: `primary-surface` background, `primary` border, `primary` text
- Height: 36px
- Used in horizontal scrollable row for blood group / district / urgency filters

---

#### `<StarRating>`

- Uses `star-filled.png` and `star-empty.png` from assets
- Star size: 24×24 (input mode), 16×16 (display mode)
- 1–5 scale
- Tap or swipe to rate (input mode)

---

## Part 2 — Screen-by-Screen Design

---

### 2.1 Splash Screen

```
┌─────────────────────────────────┐
│                                 │
│                                 │
│                                 │
│         [logo-splash.png]       │
│            64×64                │
│                                 │
│          RoktoSheba             │
│    "Every Drop Saves a Life"    │
│                                 │
│                                 │
│         [loading spinner]       │
│                                 │
│                                 │
└─────────────────────────────────┘
```

**Specs:**

- Full-screen, `background` color
- Logo: `logo-splash.png`, 64×64dp, centered
- App name: `display` style, `text-primary`
- Tagline: `body`, `text-secondary`, 8px below name
- Subtle fade-in animation (300ms)
- Auto-navigates based on auth state after session check

---

### 2.2 Auth — Login Screen

```
┌─────────────────────────────────┐
│                                 │
│     ┌───────────────────┐       │
│     │  [logo-mark.png]  │       │
│     │     48×48          │       │
│     └───────────────────┘       │
│                                 │
│         RoktoSheba              │
│   "Every Drop Saves a Life"    │
│                                 │
│  ┌─────────────────────────┐    │
│  │ 📧  Email               │    │
│  └─────────────────────────┘    │
│  ┌─────────────────────────┐    │
│  │ 🔒  Password        👁  │    │
│  └─────────────────────────┘    │
│                                 │
│        Forgot Password?         │
│                                 │
│  ┌─────────────────────────┐    │
│  │      Sign In            │    │  ← Primary button
│  └─────────────────────────┘    │
│                                 │
│  Don't have an account?         │
│  Create Account                 │  ← Link text in primary color
│                                 │
└─────────────────────────────────┘
```

**Specs:**

- Scroll view for small screens, keyboard-aware
- Logo mark centered, 48×48
- Email input: leading mail PNG image, keyboard type `email-address`
- Password input: leading lock PNG image, trailing eye-toggle PNG image
- "Forgot Password?" — `caption-medium`, `info` color, right-aligned
- Sign In button: `primary` variant, full-width
- Bottom text: `body`, "Create Account" portion in `primary` color, tappable
- **Authentication Policy:** RoktoSheba uses pure Email & Password + 8-Digit Email OTP verification. No external third-party OAuth.
- **Error state:** Error message appears below the relevant input in `caption` red text; a toast/snackbar slides up for network errors. If login fails due to `Email not confirmed`, the app immediately triggers an automatic OTP resend and transitions the user to the 8-Digit Email Verification Screen (`app/(auth)/verify-email.tsx`).

---

### 2.3 Auth — Registration Screen

```
┌─────────────────────────────────┐
│  ←  Create Account              │  ← Header with back arrow
│                                 │
│  Join RoktoSheba and help       │
│  save lives in your community.  │  ← body, text-secondary
│                                 │
│  ┌─────────────────────────┐    │
│  │ 📧  Email               │    │
│  └─────────────────────────┘    │
│  ┌─────────────────────────┐    │
│  │ 🔒  Password            │    │
│  └─────────────────────────┘    │
│     Password strength bar       │  ← Colored bar: red/amber/green
│  ┌─────────────────────────┐    │
│  │ 🔒  Confirm Password    │    │
│  └─────────────────────────┘    │
│                                 │
│  ┌─────────────────────────┐    │
│  │     Create Account      │    │  ← Primary button
│  └─────────────────────────┘    │
│                                 │
│  Already have an account?       │
│  Sign In                        │  ← Link
│                                 │
└─────────────────────────────────┘
```

**Specs:**

- Clean and minimal — no profile fields here per project plan
- Password strength indicator: 4px-tall bar, colored segments
- Matching password validation in real-time
- On success: Navigate to email verification pending screen

---

### 2.4 Auth — Email Verification (8-Digit OTP)

```
┌─────────────────────────────────┐
│                                 │
│     ┌───────────────────┐       │
│     │  [shield-icon]    │       │  ← 80×80 icon container
│     └───────────────────┘       │
│                                 │
│    Enter Verification Code      │  ← h1, centered
│                                 │
│  We sent an 8-digit code to     │
│  abrar@email.com.               │  ← body, text-secondary
│                                 │
│ ┌─┐ ┌─┐ ┌─┐ ┌─┐ ┌─┐ ┌─┐ ┌─┐ ┌─┐ │
│ │5│ │8│ │2│ │1│ │9│ │0│ │4│ │3│ │  ← OtpInput (8 boxes)
│ └─┘ └─┘ └─┘ └─┘ └─┘ └─┘ └─┘ └─┘ │
│                                 │
│  ┌─────────────────────────┐    │
│  │   Verify & Continue     │    │  ← Primary button
│  └─────────────────────────┘    │
│                                 │
│     Resend Code in 30s          │  ← Countdown timer
│     Back to Sign In             │
│                                 │
└─────────────────────────────────┘
```

---

### 2.5 Auth — Forgot Password & OTP Reset

```
┌─────────────────────────────────┐
│  ←  Reset Password              │
│                                 │
│  Enter the 8-digit recovery     │
│  code sent to your email.       │  ← body, text-secondary
│                                 │
│ ┌─┐ ┌─┐ ┌─┐ ┌─┐ ┌─┐ ┌─┐ ┌─┐ ┌─┐ │
│ │1│ │2│ │3│ │4│ │5│ │6│ │7│ │8│ │  ← OtpInput (8 boxes)
│ └─┘ └─┘ └─┘ └─┘ └─┘ └─┘ └─┘ └─┘ │
│                                 │
│  ┌─────────────────────────┐    │
│  │ 🔒  New Password        │    │
│  └─────────────────────────┘    │
│  ┌─────────────────────────┐    │
│  │ 🔒  Confirm Password    │    │
│  └─────────────────────────┘    │
│                                 │
│  ┌─────────────────────────┐    │
│  │   Update Password       │    │  ← Primary button
│  └─────────────────────────┘    │
│                                 │
└─────────────────────────────────┘
```

---

### 2.6 Onboarding — Profile Setup (Multi-Step)

The onboarding is split into **2 steps** to prevent form fatigue.

#### Step 1 of 2 — Personal Info

```
┌─────────────────────────────────┐
│  Complete Your Profile          │  ← h1
│  Step 1 of 2                    │  ← caption, text-secondary
│                                 │
│  ┌──────┐                       │
│  │Avatar│  Tap to add photo     │  ← 96px circle, camera overlay
│  │ area │  (Optional)           │
│  └──────┘                       │
│                                 │
│  ┌─────────────────────────┐    │
│  │  Full Name *            │    │
│  └─────────────────────────┘    │
│  ┌─────────────────────────┐    │
│  │  Phone Number *         │    │  ← +880 prefix, numeric keyboard
│  └─────────────────────────┘    │
│  ┌─────────────────────────┐    │
│  │  Date of Birth *        │    │  ← Tappable, opens date picker
│  └─────────────────────────┘    │
│  ┌─────────────────────────┐    │
│  │  Blood Group *      ▼   │    │  ← Dropdown/bottom sheet selector
│  └─────────────────────────┘    │
│                                 │
│  ── ── ── Progress ── ── ──    │  ← Progress bar: 50%
│                                 │
│  ┌─────────────────────────┐    │
│  │       Next →            │    │  ← Primary button
│  └─────────────────────────┘    │
│                                 │
└─────────────────────────────────┘
```

**Blood Group Selector (Bottom Sheet):**

```
┌─────────────────────────────────┐
│         ── drag handle ──       │
│                                 │
│  Select Your Blood Group        │  ← h3
│                                 │
│  ┌──────┐  ┌──────┐  ┌──────┐  │
│  │ A+   │  │ A−   │  │ B+   │  │  ← Grid of BloodGroupBadge
│  │[img] │  │[img] │  │[img] │  │    images, 2 rows × 4 cols
│  └──────┘  └──────┘  └──────┘  │
│  ┌──────┐  ┌──────┐  ┌──────┐  │
│  │ B−   │  │ O+   │  │ O−   │  │
│  │[img] │  │[img] │  │[img] │  │
│  └──────┘  └──────┘  └──────┘  │
│  ┌──────┐  ┌──────┐            │
│  │ AB+  │  │ AB−  │            │
│  │[img] │  │[img] │            │
│  └──────┘  └──────┘            │
│                                 │
│  ┌─────────────────────────┐    │
│  │      Confirm            │    │
│  └─────────────────────────┘    │
└─────────────────────────────────┘
```

- Each blood group is a tappable card with the PNG badge image centered
- Selected item gets `primary-light` background + `primary` border
- Haptic feedback on selection

#### Step 2 of 2 — Location

```
┌─────────────────────────────────┐
│  Complete Your Profile          │
│  Step 2 of 2                    │
│                                 │
│  ┌─────────────────────────┐    │
│  │  Division *         ▼   │    │  ← Dropdown: 8 Bangladesh divisions
│  └─────────────────────────┘    │
│  ┌─────────────────────────┐    │
│  │  District *         ▼   │    │  ← Filtered by selected division
│  └─────────────────────────┘    │
│  ┌─────────────────────────┐    │
│  │  Area / Upazila *   ▼   │    │  ← Filtered by selected district
│  └─────────────────────────┘    │
│  ┌─────────────────────────┐    │
│  │  Address Detail         │    │  ← Optional, multiline
│  └─────────────────────────┘    │
│  ┌─────────────────────────┐    │
│  │  Last Donation Date     │    │  ← Optional, date picker
│  └─────────────────────────┘    │
│                                 │
│  ── ── ── Progress ── ── ──    │  ← Progress bar: 100%
│                                 │
│  ┌─────────────────────────┐    │
│  │     Complete Setup      │    │  ← Primary button
│  └─────────────────────────┘    │
│                                 │
└─────────────────────────────────┘
```

**Specs:**

- Cascading dropdowns: Division → District → Area (each renders as a searchable bottom sheet)
- Division/District/Area data is a local JSON bundled with the app
- Progress bar: 4px-tall, `primary` color, animated width
- On "Complete Setup" → navigates to main app Home screen

---

### 2.7 Main App — Tab Bar Layout

```
┌─────────────────────────────────┐
│                                 │
│         [Screen Content]        │
│                                 │
│                                 │
├─────────────────────────────────┤
│                                 │
│  🏠    📋    [+]    👥    👤   │  ← Tab bar with PNG images
│ Home  Requests Create Donors Profile │
│                                 │
└─────────────────────────────────┘
```

**Tab Bar Specs:**

- Background: `surface-elevated` with `medium` shadow (upward)
- Height: 60px + safe area bottom
- Each tab: PNG image (24×24) from `assets/images/tabs/`
- Active tab: uses `*-active.png` image variant + `primary` color label
- Inactive tab: uses default PNG + `text-tertiary` label
- Center tab (Create): Elevated red circular button (56×56), `primary` background, white plus PNG image, positioned -12px above tab bar
- Label style: `caption-medium`

---

### 2.8 Home Screen

```
┌─────────────────────────────────┐
│  Hello, Abrar 👋                │  ← h2 + hand emoji
│  Let's save lives today         │  ← caption, text-secondary
│                          [🔔]   │  ← notification-bell.png, badge dot
│                                 │
│ ┌─────────────────────────────┐ │
│ │ ░░░░░░░░░░░░░░░░░░░░░░░░░░ │ │  ← Hero card with gradient
│ │ ░  Find Blood Now      ░░░ │ │     background (red → rose)
│ │ ░  Search for donors    ░░ │ │
│ │ ░  near you             ░░ │ │
│ │ ░  ┌──────────────┐    ░░░ │ │
│ │ ░  │ Search Donors │    ░░ │ │  ← White outline button
│ │ ░  └──────────────┘    ░░░ │ │
│ │ ░░░░░░░░░░░░░░░░░░░░░░░░░░ │ │
│ └─────────────────────────────┘ │
│                                 │
│  🔥 Urgent Requests             │  ← h3 + urgency PNG
│                    See All →    │
│                                 │
│  ┌─────────┐ ┌─────────┐       │  ← Horizontal scroll
│  │Request  │ │Request  │       │     RequestCard (compact)
│  │Card 1   │ │Card 2   │ ...   │
│  └─────────┘ └─────────┘       │
│                                 │
│  🩸 Recent Requests             │  ← h3 + blood drop PNG
│                    See All →    │
│                                 │
│  ┌─────────────────────────┐    │
│  │  RequestCard (full)      │   │  ← Vertical list
│  └─────────────────────────┘    │
│  ┌─────────────────────────┐    │
│  │  RequestCard (full)      │   │
│  └─────────────────────────┘    │
│                                 │
│  👥 Available Donors Nearby     │  ← h3
│                    See All →    │
│                                 │
│  ○ ○ ○ ○ ○ ○                   │  ← Circular avatar row
│  Name Name Name Name            │     horizontal scroll
│                                 │
└─────────────────────────────────┘
```

**Specs:**

- ScrollView, pull-to-refresh enabled
- Greeting row: `h2` with emoji, notification bell PNG image with unread red dot
- Hero card: linear gradient `primary` → `secondary`, border radius `xl`, padding `lg`
- Urgent Requests: Horizontal `FlatList`, compact `RequestCard` variant (width: 280px)
- Recent Requests: Vertical list, last 5 requests
- Donor avatars: 56px circles in horizontal scroll, name below in `caption`
- All "See All →" links navigate to the relevant full-list tab

---

### 2.9 Blood Requests Tab — List View

```
┌─────────────────────────────────┐
│  Blood Requests                 │  ← h1
│                                 │
│  ┌─────────────────────────┐    │
│  │ 🔍 Search requests...   │    │  ← Search input with search-icon.png
│  └─────────────────────────┘    │
│                                 │
│  [All] [A+] [B+] [O+] [AB+]...│  ← FilterChip row, horizontal scroll
│  [Critical] [Urgent] [Normal]  │  ← Second filter row (urgency)
│                                 │
│  Sort: Newest ▼                │  ← Dropdown: Newest, Urgency, Nearest
│                                 │
│  ┌─────────────────────────┐    │
│  │  RequestCard             │   │
│  └─────────────────────────┘    │
│  ┌─────────────────────────┐    │
│  │  RequestCard             │   │
│  └─────────────────────────┘    │
│  ┌─────────────────────────┐    │
│  │  RequestCard             │   │
│  └─────────────────────────┘    │
│        ...                      │
│                                 │
│  ── No more requests ──        │  ← End-of-list indicator
│                                 │
└─────────────────────────────────┘
```

**Empty State (no requests):**

```
┌─────────────────────────────────┐
│                                 │
│     [empty-requests.png]        │  ← 180×180 illustration
│                                 │
│     No Blood Requests Yet       │  ← h3
│     Be the first to create a    │
│     request or check back soon. │  ← body, text-secondary
│                                 │
│  ┌─────────────────────────┐    │
│  │  Create Request          │   │  ← Primary button
│  └─────────────────────────┘    │
│                                 │
└─────────────────────────────────┘
```

**Specs:**

- FlatList with pagination (infinite scroll, 20 items per page)
- Pull-to-refresh
- Search debounced (300ms)
- Filter chips: horizontal scroll, multi-select for blood group, single-select for urgency
- Sort dropdown opens a small bottom sheet with options
- Skeleton loading: 3 placeholder cards with shimmer animation on initial load

---

### 2.10 Request Detail Screen

```
┌─────────────────────────────────┐
│  ←  Request Details         ⋮   │  ← Header with back + overflow menu
│                                 │
│  ┌─────────────────────────┐    │
│  │  [Hospital Image]        │   │  ← Full-width image if attached
│  │  or Hospital Placeholder │   │     border-radius top: lg
│  └─────────────────────────┘    │
│                                 │
│  [BloodGroupBadge LG]          │
│  B+ Blood Needed                │  ← h1
│  [UrgencyTag: CRITICAL]        │
│                                 │
│  ── Patient Information ──     │  ← overline section header
│  👤 Patient: Mohammad Ali       │
│  🏥 Hospital: Dhaka Medical     │
│  📍 Dhaka › Dhanmondi           │
│  📅 Needed: 28 Aug 2026, 4 PM   │
│  📞 Contact: +880 1712-XXXXXX   │
│                                 │
│  ── Location ──                │
│  ┌─────────────────────────┐    │
│  │     [Map Preview]        │   │  ← Static map image with pin
│  │     Tap to open map      │   │     border-radius: lg
│  └─────────────────────────┘    │
│                                 │
│  ── Responses (3) ──           │  ← Only visible to request owner
│  ┌─────────────────────────┐    │
│  │ ○ Donor Name  B+  ✓Avail│   │
│  │   "I can donate..."      │   │
│  │   [Accept] [Decline]     │   │
│  └─────────────────────────┘    │
│                                 │
│  ┌─────────────────────────┐    │
│  │   Respond to Request     │   │  ← Primary button (for donors)
│  └─────────────────────────┘    │
│                                 │
│  ── OR for owner ──            │
│  ┌──────────┐ ┌──────────┐     │
│  │  Edit    │ │  Cancel  │     │  ← Outline + Danger buttons
│  └──────────┘ └──────────┘     │
│                                 │
└─────────────────────────────────┘
```

**Specs:**

- Scrollable content
- Hospital image: aspect ratio 16:9, fallback to `hospital-placeholder.png`
- Info rows: Each row has a 20×20 PNG icon image + `body` text
- Map preview: Static map image (Google Static Maps API or MapView snapshot), tappable to open full map
- Responses section: Only visible to the request creator
- Response card: Avatar + donor name + blood badge + optional message + Accept/Decline buttons
- Bottom CTA: "Respond to Request" for eligible donors (not own request, available, matching blood group)
- Overflow menu (⋮): Report, Share (for non-owners)

---

### 2.11 Create / Edit Blood Request

```
┌─────────────────────────────────┐
│  ←  New Blood Request           │  ← h1
│                                 │
│  ┌─────────────────────────┐    │
│  │  Blood Group Needed * ▼ │    │  ← Bottom sheet selector
│  └─────────────────────────┘    │
│  ┌─────────────────────────┐    │
│  │  Patient Name *         │    │
│  └─────────────────────────┘    │
│  ┌─────────────────────────┐    │
│  │  Hospital Name *        │    │  ← Autocomplete with geocoding
│  └─────────────────────────┘    │
│                                 │
│  ── Location ──                │
│  ┌─────────────────────────┐    │
│  │  Division *         ▼   │    │
│  └─────────────────────────┘    │
│  ┌─────────────────────────┐    │
│  │  District *         ▼   │    │
│  └─────────────────────────┘    │
│  ┌─────────────────────────┐    │
│  │  Area *             ▼   │    │
│  └─────────────────────────┘    │
│                                 │
│  📍 Pin Hospital on Map        │  ← Tappable row → map picker
│                                 │
│  ── Timing ──                  │
│  ┌────────────┐ ┌────────────┐  │
│  │ Date *   📅│ │ Time *   🕐│  │  ← Date & time pickers
│  └────────────┘ └────────────┘  │
│                                 │
│  ── Urgency ──                 │
│  ┌──────┐ ┌──────┐ ┌────────┐  │
│  │Normal│ │Urgent│ │Critical│  │  ← Selectable cards with
│  │ [img]│ │ [img]│ │  [img] │  │     urgency PNG images
│  └──────┘ └──────┘ └────────┘  │
│                                 │
│  ┌─────────────────────────┐    │
│  │  Contact Number *       │    │  ← Auto-filled from profile
│  └─────────────────────────┘    │
│                                 │
│  📷 Add Hospital/Document Image │  ← Tap → image source sheet
│  ┌─────────────────────────┐    │
│  │  [Image Preview]         │   │  ← Shows after selection
│  │          ✕ Remove        │   │
│  └─────────────────────────┘    │
│                                 │
│  ┌─────────────────────────┐    │
│  │   Post Request           │   │  ← Primary button
│  └─────────────────────────┘    │
│                                 │
└─────────────────────────────────┘
```

**Image Source Bottom Sheet:**

```
┌─────────────────────────────────┐
│         ── drag handle ──       │
│                                 │
│  Add Photo                      │  ← h3
│                                 │
│  ┌─────────┐    ┌─────────┐     │
│  │[camera  ]│    │[gallery]│     │  ← camera-icon.png, gallery-icon.png
│  │  .png   │    │  .png   │     │     Large tappable cards
│  │ Camera  │    │ Gallery │     │
│  └─────────┘    └─────────┘     │
│                                 │
└─────────────────────────────────┘
```

**Specs:**

- KeyboardAwareScrollView
- Hospital name: Integrates geocoding/place search API for autocomplete suggestions
- Map picker: Opens a full-screen map with a draggable pin; confirm button saves coordinates
- Urgency selector: Three cards in a row, selected card has `primary-light` bg + `primary` border
- Image preview: 16:9 aspect ratio, border radius `lg`, remove button overlay
- All inputs validated with Zod on submit
- Loading overlay on submission with spinner

---

### 2.12 Donors Tab — Donor Discovery

```
┌─────────────────────────────────┐
│  Find Donors                    │  ← h1
│                                 │
│  ┌─────────────────────────┐    │
│  │ 🔍 Search by name, area..│    │
│  └─────────────────────────┘    │
│                                 │
│  [All] [A+] [A-] [B+] [B-]... │  ← Blood group filter chips
│  [📍 My District] [Available]  │  ← Location + availability filter
│                                 │
│  ┌─────────────────────────┐    │
│  │  DonorCard               │   │
│  └─────────────────────────┘    │
│  ┌─────────────────────────┐    │
│  │  DonorCard               │   │
│  └─────────────────────────┘    │
│  ┌─────────────────────────┐    │
│  │  DonorCard               │   │
│  └─────────────────────────┘    │
│                                 │
│        ...                      │
│                                 │
└─────────────────────────────────┘
```

**Empty State (no donors found):**

```
┌─────────────────────────────────┐
│     [empty-donors.png]          │
│     No Donors Found             │
│     Try adjusting your filters  │
│     or search criteria.         │
└─────────────────────────────────┘
```

**Specs:**

- FlatList with infinite scroll
- Filter chips: blood group (multi-select), "My District" toggle, "Available Only" toggle
- DonorCard tap → Donor Profile screen
- Skeleton loading on initial load

---

### 2.13 Donor Profile Screen (Public View)

```
┌─────────────────────────────────┐
│  ←                          ⋮   │  ← Back + overflow (Report)
│                                 │
│         ┌──────┐                │
│         │Avatar│                │  ← 96px circle
│         │ XL   │                │
│         └──────┘                │
│        Donor Name               │  ← h1, centered
│     [BloodGroupBadge MD]        │  ← Centered below name
│     📍 Dhaka, Dhanmondi         │  ← caption, text-secondary
│                                 │
│  ┌────────────┐ ┌────────────┐  │
│  │ 🟢 Available│ │ 12 Donated │  │  ← Two stat cards
│  └────────────┘ └────────────┘  │
│                                 │
│  ── Details ──                 │
│  Last donated: 3 months ago     │
│  Member since: Jan 2026         │
│                                 │
│  ── Reviews (4) ──             │  ← Star rating average + count
│  ⭐⭐⭐⭐☆ 4.2 (4 reviews)    │
│                                 │
│  ┌─────────────────────────┐    │
│  │ "Very helpful donor,     │   │  ← Review card
│  │  arrived on time"        │   │
│  │  — Requester Name, 2w ago│   │
│  └─────────────────────────┘    │
│                                 │
└─────────────────────────────────┘
```

**Specs:**

- No exact address shown (privacy policy)
- Availability indicator: green/red circle PNG + text
- Stats: donation count, availability — in two-column card grid
- Reviews section: StarRating component + list of review cards
- Overflow menu: "Report User" option

---

### 2.14 Profile Tab (Own Profile)

```
┌─────────────────────────────────┐
│  My Profile                     │  ← h1
│                                 │
│  ┌─────────────────────────────┐│
│  │  ┌──────┐                   ││
│  │  │Avatar│  Abrar Ahmed      ││  ← Name in h2
│  │  │ XL   │  abrar@email.com  ││  ← Email in caption
│  │  │ 📷   │  [Edit Profile]   ││  ← Ghost button
│  │  └──────┘                   ││
│  └─────────────────────────────┘│
│                                 │
│  ── Donor Status ──            │
│  ┌─────────────────────────────┐│
│  │  Available to Donate        ││
│  │  ─────────────────── [🔘]   ││  ← Toggle switch
│  │                             ││
│  │  Blood Group: [B+ badge]    ││
│  │  Last Donated: 15 May 2026  ││
│  │  Location: Dhaka, Dhanmondi ││
│  └─────────────────────────────┘│
│                                 │
│  ── My Requests ──             │
│  ┌─────────────────────────────┐│
│  │ Active Requests        3 →  ││  ← Tappable row
│  ├─────────────────────────────┤│
│  │ Past Requests          12 → ││
│  └─────────────────────────────┘│
│                                 │
│  ── My Responses ──            │
│  ┌─────────────────────────────┐│
│  │ Pending Responses      1 →  ││
│  ├─────────────────────────────┤│
│  │ Completed Donations    8 →  ││
│  └─────────────────────────────┘│
│                                 │
│  ── Settings ──                │
│  ┌─────────────────────────────┐│
│  │ 🌙 Dark Mode          [🔘] ││  ← Theme toggle
│  ├─────────────────────────────┤│
│  │ 🔔 Notifications       →   ││
│  ├─────────────────────────────┤│
│  │ 📖 Learn About Donation →  ││
│  ├─────────────────────────────┤│
│  │ ℹ️  About RoktoSheba    →   ││
│  └─────────────────────────────┘│
│                                 │
│  ┌─────────────────────────────┐│
│  │      Sign Out               ││  ← Danger/outline button
│  └─────────────────────────────┘│
│                                 │
└─────────────────────────────────┘
```

**Specs:**

- Profile header card: avatar with camera overlay for edit, name, email
- Donor status card: Toggle switch for `is_available_to_donate`, immediate API call on toggle
- Menu sections: Grouped list items with PNG icons, right chevron for navigation rows
- Sign Out: `danger` variant button, shows confirmation dialog before executing

---

### 2.15 Edit Profile Screen

```
┌─────────────────────────────────┐
│  ←  Edit Profile        [Save] │  ← Save in primary color
│                                 │
│         ┌──────┐                │
│         │Avatar│                │  ← Tappable, camera overlay
│         │ XL   │                │     Opens image source sheet
│         └──────┘                │
│                                 │
│  ┌─────────────────────────┐    │
│  │  Full Name *            │    │  ← Pre-filled
│  └─────────────────────────┘    │
│  ┌─────────────────────────┐    │
│  │  Phone Number *         │    │
│  └─────────────────────────┘    │
│  ┌─────────────────────────┐    │
│  │  Date of Birth *        │    │
│  └─────────────────────────┘    │
│  ┌─────────────────────────┐    │
│  │  Blood Group *      ▼   │    │  ← Bottom sheet
│  └─────────────────────────┘    │
│  ┌─────────────────────────┐    │
│  │  Division *         ▼   │    │
│  └─────────────────────────┘    │
│  ┌─────────────────────────┐    │
│  │  District *         ▼   │    │
│  └─────────────────────────┘    │
│  ┌─────────────────────────┐    │
│  │  Area *             ▼   │    │
│  └─────────────────────────┘    │
│  ┌─────────────────────────┐    │
│  │  Address Detail         │    │  ← Optional
│  └─────────────────────────┘    │
│  ┌─────────────────────────┐    │
│  │  Last Donation Date     │    │  ← Optional
│  └─────────────────────────┘    │
│                                 │
└─────────────────────────────────┘
```

**Specs:**

- Same field layout as onboarding but single-page, all pre-filled
- Save button in header, disabled until changes are detected
- Unsaved changes: show confirmation dialog on back navigation
- Image change triggers upload to Supabase Storage

---

### 2.16 Respond to Request — Bottom Sheet

```
┌─────────────────────────────────┐
│         ── drag handle ──       │
│                                 │
│  Respond to Blood Request       │  ← h3
│                                 │
│  You're offering to donate      │
│  B+ blood at Dhaka Medical      │  ← body, key info in bold
│  College Hospital.              │
│                                 │
│  ┌─────────────────────────┐    │
│  │  Message (optional)      │   │  ← Multiline input
│  │  "I can come by 3 PM..." │   │     max 200 chars
│  └─────────────────────────┘    │
│                                 │
│  ┌─────────────────────────┐    │
│  │   Confirm Response       │   │  ← Primary button
│  └─────────────────────────┘    │
│  ┌─────────────────────────┐    │
│  │   Cancel                 │   │  ← Ghost button
│  └─────────────────────────┘    │
│                                 │
└─────────────────────────────────┘
```

---

### 2.17 Notifications Screen

```
┌─────────────────────────────────┐
│  Notifications                  │  ← h1
│                     Mark All Read│  ← caption link, primary color
│                                 │
│  ── Today ──                   │  ← Section header, overline
│  ┌─────────────────────────┐    │
│  │ 🩸 New blood request      │   │  ← NotificationItem (unread)
│  │   A+ needed at Dhaka...   │   │     Blue/primary left border
│  │   2 minutes ago           │   │
│  └─────────────────────────┘    │
│  ┌─────────────────────────┐    │
│  │ ✅ Response accepted      │   │
│  │   Your response to B+... │   │
│  │   1 hour ago              │   │
│  └─────────────────────────┘    │
│                                 │
│  ── Yesterday ──               │
│  ┌─────────────────────────┐    │
│  │ 👤 New donor response     │   │  ← NotificationItem (read)
│  │   Karim responded to...   │   │     No left border
│  │   Yesterday, 3:45 PM     │   │
│  └─────────────────────────┘    │
│                                 │
│        ...                      │
│                                 │
└─────────────────────────────────┘
```

**Empty State:**

```
┌─────────────────────────────────┐
│   [empty-notifications.png]     │
│   No Notifications Yet          │
│   You'll see updates about      │
│   your requests and responses.  │
└─────────────────────────────────┘
```

**Specs:**

- FlatList grouped by day (Today, Yesterday, Earlier)
- Unread items: 3px left border in `primary`, slightly tinted background
- Tap → navigates to the related entity (request detail, donor profile, etc.)
- Real-time: new notifications pushed via Supabase Realtime, appear at top with subtle slide-in

---

### 2.18 Map View Screen

```
┌─────────────────────────────────┐
│  ←  Nearby Requests             │
│                                 │
│  ┌─────────────────────────────┐│
│  │                             ││
│  │        [Full Map]           ││  ← react-native-maps
│  │                             ││
│  │    📍        📍              ││  ← Request pins with blood
│  │       📍                    ││     group badge overlays
│  │                  📍          ││
│  │          📍                  ││
│  │                             ││
│  │              [◎]            ││  ← "My location" button
│  └─────────────────────────────┘│
│                                 │
│  ┌─────────────────────────────┐│  ← Bottom peek card
│  │ [A+] Dhaka Medical  URGENT  ││     (appears on pin tap)
│  │ Needed: 28 Aug  │ View →    ││
│  └─────────────────────────────┘│
│                                 │
└─────────────────────────────────┘
```

**Specs:**

- Full-screen map with custom markers
- Markers: Blood group badge PNG as custom marker image (smaller, 32×32)
- Cluster markers for dense areas (show count badge)
- "My location" button: bottom-right, uses `expo-location` with permission flow
- Pin tap: Shows peek card at bottom with request summary, "View →" navigates to detail
- Filter button: top-right overlay, opens filter bottom sheet for blood group/urgency

---

### 2.19 Map Pin Picker (for Request Creation)

```
┌─────────────────────────────────┐
│  ←  Pin Hospital Location       │
│                                 │
│  ┌─────────────────────────────┐│
│  │                             ││
│  │        [Full Map]           ││
│  │                             ││
│  │                             ││
│  │          📍                  ││  ← Draggable center pin
│  │     (location-pin.png)      ││
│  │                             ││
│  │                             ││
│  └─────────────────────────────┘│
│                                 │
│  ┌─────────────────────────┐    │
│  │ 🔍 Search location...   │    │  ← Geocoding search bar
│  └─────────────────────────┘    │
│                                 │
│  📍 Dhaka Medical College       │  ← Reverse geocoded address
│     Secretariat Rd, Dhaka       │     Updates on pin drag
│                                 │
│  ┌─────────────────────────┐    │
│  │   Confirm Location       │   │  ← Primary button
│  └─────────────────────────┘    │
│                                 │
└─────────────────────────────────┘
```

---

### 2.20 Post-Donation Feedback Screen

```
┌─────────────────────────────────┐
│  ←  Leave Feedback              │
│                                 │
│         ┌──────┐                │
│         │Avatar│                │  ← Donor/Requester avatar
│         └──────┘                │
│    How was your experience     │  ← h2, centered
│    with [Donor Name]?          │
│                                 │
│    ⭐ ⭐ ⭐ ⭐ ☆              │  ← StarRating (input mode)
│                                 │
│  ┌─────────────────────────┐    │
│  │  Write a comment         │   │  ← Multiline, optional
│  │  (optional)              │   │     max 500 chars
│  │                          │   │
│  └─────────────────────────┘    │
│                                 │
│  ┌─────────────────────────┐    │
│  │   Submit Feedback        │   │  ← Primary button
│  └─────────────────────────┘    │
│  ┌─────────────────────────┐    │
│  │   Skip                   │   │  ← Ghost button
│  └─────────────────────────┘    │
│                                 │
└─────────────────────────────────┘
```

---

### 2.21 Learn Screen

```
┌─────────────────────────────────┐
│  Learn About Donation           │  ← h1
│                                 │
│  ┌─────────────────────────────┐│
│  │ [learn-hero.png]            ││  ← Hero image, full width
│  │ Why Donate Blood?           ││     with text overlay
│  └─────────────────────────────┘│
│                                 │
│  ── Watch & Learn ──           │
│  ┌─────────────────────────────┐│
│  │ ▶ [YouTube Thumbnail]       ││  ← Embedded YouTube video
│  │   Blood Donation Awareness  ││     via WebView or linking
│  └─────────────────────────────┘│
│                                 │
│  ── Tips for Donors ──         │
│  ┌────────────┐ ┌────────────┐  │
│  │[hydrate   ]│ │[rest      ]│  │  ← Tip cards with images
│  │  .png     │ │  .png     │  │     in 2-column grid
│  │ Stay      │ │ Get       │  │
│  │ Hydrated  │ │ Enough    │  │
│  │           │ │ Rest      │  │
│  └────────────┘ └────────────┘  │
│  ┌────────────┐ ┌────────────┐  │
│  │[eligibility│ │[eat       ]│  │
│  │  .png     ]│ │  .png     │  │
│  │ Check     │ │ Eat a     │  │
│  │ Eligibility│ │ Healthy   │  │
│  │           │ │ Meal      │  │
│  └────────────┘ └────────────┘  │
│                                 │
│  ── Did You Know? ──           │
│  • One donation can save up     │
│    to 3 lives                   │
│  • You can donate every 3       │
│    months                       │
│  • Blood cannot be manufactured │
│                                 │
└─────────────────────────────────┘
```

---

### 2.22 Admin — Dashboard

```
┌─────────────────────────────────┐
│  Admin Dashboard                │  ← h1
│                                 │
│  ┌────────────┐ ┌────────────┐  │
│  │    247     │ │     89     │  │  ← StatCard grid
│  │ Total Users│ │Active Req. │  │
│  └────────────┘ └────────────┘  │
│  ┌────────────┐ ┌────────────┐  │
│  │    156     │ │     12     │  │
│  │ Donations  │ │ Reports    │  │
│  └────────────┘ └────────────┘  │
│                                 │
│  ── Quick Actions ──           │
│  ┌─────────────────────────┐    │
│  │ 👥 Manage Users      →  │    │
│  ├─────────────────────────┤    │
│  │ 🩸 Manage Requests   →  │    │
│  ├─────────────────────────┤    │
│  │ ⚠️  Review Reports    →  │    │
│  └─────────────────────────┘    │
│                                 │
│  ── Recent Activity ──         │
│  ┌─────────────────────────┐    │
│  │ New user: Fahim Ahmed    │   │  ← Activity feed
│  │ 5 min ago                │   │
│  └─────────────────────────┘    │
│  ┌─────────────────────────┐    │
│  │ Request #45 fulfilled    │   │
│  │ 1 hour ago               │   │
│  └─────────────────────────┘    │
│                                 │
└─────────────────────────────────┘
```

---

### 2.23 Admin — User Management

```
┌─────────────────────────────────┐
│  ←  Manage Users                │
│                                 │
│  ┌─────────────────────────┐    │
│  │ 🔍 Search users...      │    │
│  └─────────────────────────┘    │
│                                 │
│  ┌─────────────────────────┐    │
│  │ ○ User Name   [B+]      │   │  ← User row
│  │   user@email.com         │   │
│  │   Dhaka │ Active         │   │     Status badge
│  │              [⋮ Actions] │   │  ← Overflow: Deactivate, View
│  └─────────────────────────┘    │
│  ┌─────────────────────────┐    │
│  │ ○ User Name   [A-]      │   │
│  │   user2@email.com        │   │
│  │   Chittagong │ Active    │   │
│  │              [⋮ Actions] │   │
│  └─────────────────────────┘    │
│        ...                      │
│                                 │
└─────────────────────────────────┘
```

**Admin Actions Bottom Sheet (on ⋮ tap):**

```
┌─────────────────────────────────┐
│         ── drag handle ──       │
│                                 │
│  👤 User Name                   │
│                                 │
│  ┌─────────────────────────┐    │
│  │  View Full Profile    →  │   │
│  ├─────────────────────────┤    │
│  │  ⚠️ Deactivate Account   │   │  ← Warning color
│  ├─────────────────────────┤    │
│  │  🚫 Remove Account       │   │  ← Danger color
│  └─────────────────────────┘    │
│                                 │
└─────────────────────────────────┘
```

---

### 2.24 Admin — Request Management

Similar to the user Requests tab but with admin actions:

- All requests visible (not just own)
- Overflow menu per request: "View Details", "Remove Request", "Contact Creator"
- Removed requests show a `[REMOVED]` badge

---

### 2.25 Admin — Reports Review

```
┌─────────────────────────────────┐
│  ←  Reports                     │
│                                 │
│  [Pending] [Reviewed] [All]    │  ← Segmented control / tabs
│                                 │
│  ┌─────────────────────────┐    │
│  │ ⚠️ Report #12            │   │
│  │ Reported: User "XYZ"     │   │  ← Report card
│  │ Reason: Inappropriate     │   │
│  │ By: Reporter Name         │   │
│  │ 2 hours ago               │   │
│  │                           │   │
│  │ [Review] [Dismiss]       │   │
│  └─────────────────────────┘    │
│                                 │
│        ...                      │
│                                 │
└─────────────────────────────────┘
```

---

## Part 3 — Interaction & Motion Design

### 3.1 Transitions

| Transition         | Animation                             | Duration |
| ------------------ | ------------------------------------- | -------- |
| Screen push        | Slide from right, with slight fade    | 300ms    |
| Screen pop         | Slide to right                        | 250ms    |
| Modal/bottom sheet | Slide from bottom with spring physics | 350ms    |
| Tab switch         | Cross-fade                            | 200ms    |
| Card press         | Scale down to 0.97 + slight opacity   | 100ms    |
| Card release       | Spring back to 1.0                    | 150ms    |
| Toast/snackbar     | Slide up from bottom, auto-dismiss 3s | 250ms    |

### 3.2 Loading States

| State           | Visual                                                     |
| --------------- | ---------------------------------------------------------- |
| Initial load    | Skeleton placeholders with shimmer animation (light sweep) |
| Pull to refresh | Standard pull indicator at top, `primary` color            |
| Button loading  | Label replaced with white spinner PNG, button disabled     |
| Full-page load  | Centered spinner + "Loading..." text                       |
| Image loading   | Gray placeholder with subtle pulse, image fades in on load |

### 3.3 Haptic Feedback

| Action                  | Haptic type          |
| ----------------------- | -------------------- |
| Button press            | Light impact         |
| Toggle switch           | Light impact         |
| Blood group selection   | Selection changed    |
| Pull-to-refresh trigger | Light impact         |
| Error shake             | Error notification   |
| Successful submission   | Success notification |

### 3.4 Error & Confirmation Patterns

**Inline Errors:**

- Field-level: Red text below input, border turns red
- Form-level: Red banner at top of form with error summary

**Toast / Snackbar:**

- Position: Bottom, above tab bar
- Success: Green-tinted background with check image
- Error: Red-tinted background with warning image
- Info: Blue-tinted background
- Auto-dismiss: 3 seconds
- Swipe to dismiss

**Confirmation Dialogs:**

- Centered modal card, `overlay` backdrop
- Title in `h3`, body in `body`
- Two buttons: secondary (Cancel/ghost) + primary (Confirm)
- Used for: Sign out, cancel request, deactivate account, remove content

---

## Part 4 — Responsive & Accessibility

### 4.1 Responsive Layout Rules

- Minimum supported width: 320px (small Android devices)
- Maximum content width: 428px (large phones)
- All horizontal padding: `lg` (20px) from screen edges
- Cards stretch to full width minus padding
- Two-column grids (stat cards, tips) collapse to single column below 360px width

### 4.2 Accessibility

| Requirement    | Implementation                                       |
| -------------- | ---------------------------------------------------- |
| Touch targets  | Minimum 44×44dp for all interactive elements         |
| Color contrast | WCAG AA minimum (4.5:1 text, 3:1 large text)         |
| Image alt text | All PNG images have `accessibilityLabel` props       |
| Screen reader  | Semantic headings, button roles, live region updates |
| Reduced motion | Respect `prefers-reduced-motion`, skip animations    |
| Font scaling   | Support up to 1.3× system font scale                 |

### 4.3 Dark Theme Application

All screens follow the dark theme color token mapping defined in Section 1.2. Key rules:

- **Backgrounds:** `slate-900` replaces white
- **Cards:** `slate-800` with subtle `slate-700` borders instead of shadows
- **Primary red:** Slightly brighter (`red-500`) for better contrast on dark
- **Images:** PNG assets should work on both themes; use transparency where needed
- **Shadows:** Reduced or eliminated on dark theme; use borders instead

---

## Part 5 — Asset Checklist

### Must-Have Before Development

- [ ] Logo: `logo-full.png`, `logo-mark.png`, `logo-splash.png`
- [ ] Tab bar icons: All 10 PNG variants (5 tabs × active/inactive)
- [ ] Blood group badges: All 8 types as styled PNG
- [ ] Avatar placeholder: `avatar-placeholder.png`
- [ ] Empty state illustrations: 4 variants (requests, donors, notifications, search)
- [ ] Urgency images: 3 variants (normal, urgent, critical)
- [ ] Google logo: `google-logo.png`

### Nice-to-Have (Can Use Placeholders Initially)

- [ ] Onboarding illustrations: 3 welcome screens
- [ ] Learn section images: hero + 4 tip cards
- [ ] Hospital placeholder image
- [ ] Misc UI images (camera, gallery, location pin, etc.)
- [ ] Status indicator images (active, fulfilled, cancelled, expired)

### Image Specifications

| Asset type         | Format | Density  | Base size |
| ------------------ | ------ | -------- | --------- |
| Logo               | PNG    | 1x/2x/3x | 48dp mark |
| Tab icons          | PNG    | 1x/2x/3x | 24×24dp   |
| Blood group badges | PNG    | 1x/2x/3x | 36×36dp   |
| Illustrations      | WebP   | 2x       | 180×180dp |
| Empty states       | WebP   | 2x       | 180×180dp |
| Placeholders       | PNG    | 2x       | Varies    |
| Urgency icons      | PNG    | 1x/2x/3x | 20×20dp   |
