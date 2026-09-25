# 🚀 RoktoSheba — Local Running & EAS Build Instructions

> **Complete Developer Guide for Running, Testing, and Building Production Android Standalone APKs**  
> Companion document to [`README.md`](../README.md) for the **RoktoSheba** Emergency Blood Donation Platform.

---

## 📌 Prerequisites

Before running or building RoktoSheba, ensure your environment meets the following specifications:

- **Node.js**: `v18.x` or `v20.x` LTS
- **Package Manager**: [Bun](https://bun.sh) (recommended for fastest installs) or `npm` / `yarn`
- **Expo CLI & EAS CLI**:
  ```bash
  npm install -g eas-cli
  ```
- **Physical Device or Emulator**:
  - **Physical Android Phone**: With USB Debugging enabled or Expo Go installed.
  - **Android Studio Emulator**: Running Android 12+ (API 31+).

---

## 🔑 Environment Configuration

RoktoSheba requires two public Supabase configuration parameters:

1. Create a `.env` or `.env.local` file in the project root:
   ```ini
   EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   EXPO_PUBLIC_SUPABASE_KEY=your-supabase-publishable-or-anon-key
   ```
2. A template file is available in [`.env.example`](../.env.example):
   ```bash
   cp .env.example .env
   ```

> [!NOTE]
> The codebase in [`lib/supabase/client.ts`](../lib/supabase/client.ts) includes built-in fallback constants (`DEFAULT_SUPABASE_URL` and `DEFAULT_SUPABASE_KEY`). Even if an environment variable injection is omitted during a cloud build, the application will initialize gracefully without throwing runtime startup errors.

---

## 💻 Local Development Workflow

### 1. Install Dependencies

```bash
bun install
# or
npm install
```

### 2. Start Expo Metro Development Server

```bash
bun start
# or
npx expo start
```

### 3. Running on Target Platforms

- **Physical Android Device (Expo Go)**:
  Scan the terminal QR code using the **Expo Go** camera scanner.
- **Android Emulator**:
  Press <kbd>a</kbd> in the terminal or run:
  ```bash
  bun run android
  ```
- **Web Browser**:
  Press <kbd>w</kbd> in the terminal or run:
  ```bash
  bun run web
  ```

---

## 🔍 Codebase Diagnostics & Verification

Always run these four automated checks before pushing or building to ensure zero regressions:

### 1. Expo Doctor (Configuration & Version Audit)

```bash
bun run doctor
```

_Expected Result:_ `18/18 checks passed. No issues detected!`

### 2. TypeScript Static Analysis

```bash
bunx tsc --noEmit
```

_Expected Result:_ Clean exit with 0 errors across all routes, features, and components.

### 3. ESLint Verification

```bash
bun run lint
```

_Expected Result:_ 0 lint warnings or errors.

### 4. Production Metro Bundle Simulation

Test the release bundler locally without deploying:

```bash
bunx expo export --platform android
```

_Expected Result:_ Successfully compiles 1,600+ modules and generates the optimized production JavaScript bundle into `dist/`.

---

## 📱 Building the Standalone Release APK with EAS Build

Expo Application Services (EAS) is configured in [`eas.json`](../eas.json) to produce installable, standalone `.apk` files directly without requiring Android Studio build environments.

### 1. Log In to EAS

```bash
eas login
```

### 2. Build the Standalone APK (Recommended)

Run either of the following commands:

```bash
# Preview profile (Outputs direct standalone .apk file)
eas build --platform android --profile preview
```

```bash
# Production APK profile
eas build --platform android
```

### 3. What Happens During the Build:

1. EAS CLI uploads your project code (respecting `.gitignore`).
2. The environment variables in `eas.json` (`EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_KEY`) are injected into the build environment.
3. Gradle executes the native Android assemble task with architecture filtering (`arm64-v8a` and `armeabi-v7a`).
4. Upon completion (~5–10 minutes), EAS provides a download URL and a terminal QR code to install the APK directly on your Android phone.

---

## 📦 Building a Google Play Store App Bundle (.aab)

When ready to submit to the Google Play Console:

```bash
eas build --platform android --profile production-aab
```

This compiles an Android App Bundle (`.aab`) with Play Asset Delivery and Google dynamic device splitting.

---

## ⚡ Performance & APK Size Optimization Architecture

### 1. ABI Architecture Filtering (~60% Size Reduction)

Standard universal APKs include 4 native architectures:

- `arm64-v8a` (Modern 64-bit Android smartphones)
- `armeabi-v7a` (Legacy 32-bit Android smartphones)
- `x86` (PC emulators)
- `x86_64` (64-bit PC emulators)

The emulator binaries alone account for more than 50% of an APK's size. In [`app.json`](../app.json), `expo-build-properties` restricts native compilation to physical devices:

```json
[
  "expo-build-properties",
  {
    "android": {
      "buildArchs": ["arm64-v8a", "armeabi-v7a"]
    }
  }
]
```

This reduces the final standalone APK to **~30–40 MB**.

### 2. Runtime Stability & Reanimated 4 Protection

In React Native 0.81 + Reanimated 4, enabling aggressive R8 / ProGuard code obfuscation (`enableMinifyInReleaseBuilds: true`) removes dynamic JNI bindings and TurboModule reflection classes needed during startup. To avoid runtime crashes (_"RoktoSheba keeps stopping"_), R8 bytecode minification is safely disabled while preserving ABI architecture splitting.

---

## 🛠 Troubleshooting & Common Issues

| Issue / Error                                 | Root Cause                                              | Solution                                                                                                                           |
| :-------------------------------------------- | :------------------------------------------------------ | :--------------------------------------------------------------------------------------------------------------------------------- |
| **"RoktoSheba keeps stopping" on launch**     | Native JNI mismatch or missing Supabase env at startup. | Ensure latest build has fallback constants in `lib/supabase/client.ts` and `enableMinifyInReleaseBuilds` is omitted in `app.json`. |
| **EAS Build builds `.aab` instead of `.apk`** | Default profile set to app-bundle.                      | Run with `--profile preview` or verify `buildType: "apk"` in `eas.json`.                                                           |
| **Metro cache conflict or stale assets**      | Stale local bundle cache.                               | Run `bunx expo start -c` to start Metro with a clean cache.                                                                        |
| **Camera or Location permission denied**      | Android OS permission restriction.                      | Tap "Grant Permission" or open Android Settings $\rightarrow$ Apps $\rightarrow$ RoktoSheba $\rightarrow$ Permissions.             |
