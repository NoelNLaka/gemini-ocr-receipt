# Building Android APK for FleetCommand Admin Portal

This guide covers converting the React web application into an Android APK using Capacitor.

## Prerequisites

### Java 21
Android Gradle Plugin requires Java 21. The project is configured to use:
```
C:\Android\jdk-21.0.6+7
```

To install Java 21 manually:
1. Download from: https://aka.ms/download-jdk/microsoft-jdk-21.0.6-windows-x64.zip
2. Extract to `C:\Android\jdk-21.0.6+7`

### Android SDK
The Android SDK is installed at:
```
C:\Android\sdk
```

Required SDK components (already installed):
- platform-tools
- platforms;android-35
- platforms;android-36
- build-tools;35.0.0

To install Android SDK manually using command-line tools:
```bash
# Download command-line tools
curl -L -k -o commandlinetools.zip "https://dl.google.com/android/repository/commandlinetools-win-11076708_latest.zip"

# Extract to C:\Android\sdk\cmdline-tools\latest
unzip commandlinetools.zip
mkdir -p C:\Android\sdk\cmdline-tools
mv cmdline-tools C:\Android\sdk\cmdline-tools\latest

# Install SDK components (requires Java 21)
export JAVA_HOME="C:/Android/jdk-21.0.6+7"
sdkmanager --sdk_root="C:/Android/sdk" "platform-tools" "platforms;android-35" "build-tools;35.0.0"

# Accept licenses
yes | sdkmanager --sdk_root="C:/Android/sdk" --licenses
```

## Project Configuration

### Capacitor Config (`capacitor.config.ts`)
```typescript
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.actuon.fleetcommand',
  appName: 'Actuon Fleet Command',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  android: {
    allowMixedContent: true
  }
};

export default config;
```

### Gradle Properties (`android/gradle.properties`)
The Java home is configured in the Android project:
```properties
org.gradle.java.home=C:\\Android\\jdk-21.0.6+7
```

### Local Properties (`android/local.properties`)
The SDK location is configured (use forward slashes for compatibility):
```properties
sdk.dir=C:/Android/sdk
```

**Note:** Using forward slashes (`/`) instead of escaped backslashes (`\\`) works better across different build environments.

## Building the APK

### First-Time Setup

If setting up from scratch, run these commands:

```bash
# 1. Install Capacitor dependencies
npm install @capacitor/core @capacitor/cli @capacitor/android

# 2. Initialize Capacitor (skip if capacitor.config.ts exists)
npx cap init "Actuon Fleet Command" "com.actuon.fleetcommand" --web-dir dist

# 3. Add Android platform (skip if android/ folder exists)
npx cap add android
```

### Building the APK

```bash
# 1. Build the web application
npm run build

# 2. Sync web assets to Android project
npx cap sync android

# 3. Build the debug APK (set ANDROID_HOME if SDK not found)
cd android
ANDROID_HOME="C:/Android/sdk" ./gradlew assembleDebug
```

**Windows Note:** If using Git Bash and Gradle can't find the SDK, set environment variables:
```bash
ANDROID_HOME="C:/Android/sdk" ANDROID_SDK_ROOT="C:/Android/sdk" ./gradlew assembleDebug
```

### APK Output Location
After a successful build, the APK is located at:
```
android/app/build/outputs/apk/debug/app-debug.apk
```

## Quick Build Commands

For subsequent builds after code changes:

```bash
# One-liner to build everything (with environment variables for Windows)
npm run build && npx cap sync android && cd android && ANDROID_HOME="C:/Android/sdk" ./gradlew assembleDebug && cd ..
```

Or step by step:
```bash
npm run build
npx cap sync android
cd android && ANDROID_HOME="C:/Android/sdk" ./gradlew assembleDebug
```

## Installing on Android Device

### Option 1: USB Transfer
1. Connect your Android device via USB
2. Copy `android/app/build/outputs/apk/debug/app-debug.apk` to your device
3. Open the file manager on your device and tap the APK to install
4. Enable "Install from unknown sources" if prompted

### Option 2: ADB Install
With USB debugging enabled on your device:

**Step 1: Authorize the device**
```bash
# Check if device is connected
C:/Android/sdk/platform-tools/adb devices
```
If device shows as `unauthorized`, unlock your phone and accept the "Allow USB debugging" prompt.

**Step 2: Install the APK**
```bash
# Using full path (if adb is not in PATH)
C:/Android/sdk/platform-tools/adb install android/app/build/outputs/apk/debug/app-debug.apk

# Or if adb is in your PATH
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

To reinstall (replace existing):
```bash
C:/Android/sdk/platform-tools/adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```

**Troubleshooting Device Authorization:**
- If device stays `unauthorized`, disconnect USB and reconnect
- Run `adb kill-server` then `adb devices` to restart the ADB daemon
- Ensure "USB debugging" is enabled in Developer Options on the phone

## Building a Release APK

For production releases:

### 1. Generate a Keystore (one-time)
```bash
keytool -genkey -v -keystore my-release-key.jks -keyalg RSA -keysize 2048 -validity 10000 -alias my-key-alias
```

### 2. Configure Signing in `android/app/build.gradle`
Add signing configuration to the android block:
```gradle
android {
    signingConfigs {
        release {
            storeFile file('my-release-key.jks')
            storePassword 'your-store-password'
            keyAlias 'my-key-alias'
            keyPassword 'your-key-password'
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

### 3. Build Release APK
```bash
cd android
./gradlew assembleRelease
```

Release APK location:
```
android/app/build/outputs/apk/release/app-release.apk
```

## Troubleshooting

### Java Version Error
If you see "invalid source release: 21":
- Ensure Java 21 is installed at `C:\Android\jdk-21.0.6+7`
- Verify `android/gradle.properties` has the correct `org.gradle.java.home` path

### SDK Not Found
If you see "SDK location not found":
1. Ensure `android/local.properties` contains `sdk.dir=C:/Android/sdk` (use forward slashes)
2. Verify the SDK is installed at that location
3. Set environment variables when running Gradle:
   ```bash
   ANDROID_HOME="C:/Android/sdk" ANDROID_SDK_ROOT="C:/Android/sdk" ./gradlew assembleDebug
   ```
4. Check that `local.properties` is saved with UTF-8 encoding (not UTF-16)

### License Not Accepted
Run:
```bash
export JAVA_HOME="C:/Android/jdk-21.0.6+7"
yes | C:/Android/sdk/cmdline-tools/latest/bin/sdkmanager.bat --sdk_root="C:/Android/sdk" --licenses
```

### Build Cache Issues
If builds fail unexpectedly, clean the build:
```bash
cd android
./gradlew clean
./gradlew assembleDebug
```

## Updating the App

When you make changes to the web application:

1. Make your code changes
2. Run `npm run build` to rebuild the web app
3. Run `npx cap sync android` to copy changes to Android
4. Run the Gradle build to create a new APK

## App Configuration

### Changing App Name
Edit `capacitor.config.ts`:
```typescript
appName: 'Your New App Name',
```

Then sync: `npx cap sync android`

### Changing Package ID
Edit `capacitor.config.ts`:
```typescript
appId: 'com.yourcompany.yourapp',
```

Note: Changing the package ID requires removing and re-adding the Android platform:
```bash
rm -rf android
npx cap add android
```

### App Icons
Place your app icons in:
```
android/app/src/main/res/mipmap-*/
```

Icon sizes:
- mipmap-mdpi: 48x48
- mipmap-hdpi: 72x72
- mipmap-xhdpi: 96x96
- mipmap-xxhdpi: 144x144
- mipmap-xxxhdpi: 192x192

### Splash Screen
Configure in `capacitor.config.ts`:
```typescript
plugins: {
  SplashScreen: {
    launchShowDuration: 2000,
    backgroundColor: "#137fec"
  }
}
```

## Environment Details

| Component | Version/Path |
|-----------|--------------|
| Java | 21.0.6 (`C:\Android\jdk-21.0.6+7`) |
| Android SDK | API 35-36 (`C:\Android\sdk`) |
| Capacitor | Latest |
| Gradle | 8.14.3 (via wrapper) |
| Build Tools | 35.0.0 |
| Min SDK | 22 (Android 5.1) |
| Target SDK | 35 (Android 15) |
