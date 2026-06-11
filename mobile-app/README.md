# Bold & Beyond Mobile App

iOS and Android app wrapper for Bold & Beyond, built with Expo.

## Prerequisites

1. **Apple Developer Account** ($99/year) - [developer.apple.com](https://developer.apple.com)
2. **Expo Account** (free) - [expo.dev](https://expo.dev)
3. **Node.js** installed

## Quick Start

### Step 1: Install Dependencies

```bash
cd mobile-app
npm install
npm install -g eas-cli
```

### Step 2: Login to Expo

```bash
eas login
# Create account at expo.dev if needed
```

### Step 3: Configure Your Project

```bash
eas build:configure
```

This will create a project on Expo and update `app.json` with your project ID.

### Step 4: Add App Icons

Place these files in the `assets/` folder:

| File | Size | Purpose |
|------|------|---------|
| `icon.png` | 1024×1024 | App icon |
| `splash.png` | 1284×2778 | Splash/loading screen |
| `adaptive-icon.png` | 1024×1024 | Android icon |

**Quick icon generation:** Use [easyappicon.com](https://easyappicon.com) or [appicon.co](https://appicon.co)

### Step 5: Build iOS App

```bash
# For TestFlight (internal testing)
eas build --platform ios --profile preview

# For App Store
eas build --platform ios --profile production
```

**First time setup:**
- EAS will ask for your Apple Developer credentials
- It handles certificates and provisioning automatically
- Build takes ~15-20 minutes in the cloud

### Step 6: Submit to TestFlight

```bash
eas submit --platform ios
```

Or manually:
1. Download the `.ipa` file from [expo.dev](https://expo.dev) dashboard
2. Upload via [Transporter app](https://apps.apple.com/app/transporter/id1450874784)

### Step 7: Invite Testers

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. My Apps → Bold & Beyond → TestFlight
3. Click **+** next to "External Testing"
4. Create a group (e.g., "Beta Testers")
5. Add tester emails
6. They receive an invite to install via TestFlight app

---

## Android Build

```bash
# Build APK (direct install)
eas build --platform android --profile production

# This gives you an APK file you can send directly
```

---

## Updating the App

Just push changes to your web app! The mobile app loads from:
```
https://bold-beyond.vercel.app/appx
```

No new build needed for web content changes.

Only rebuild when you need to:
- Change the app icon
- Update app version
- Modify native settings

---

## App Features

- **WebView Shell**: Wraps the /appx web app
- **In-App Navigation**: All links stay within the app
- **Native Integrations**: Phone calls, emails, WhatsApp open in native apps
- **Pull to Refresh**: iOS pull-to-refresh gesture
- **Back/Forward Gestures**: Swipe navigation on iOS
- **Offline Caching**: Basic caching for faster loads
- **Auth Persistence**: Session cookies maintained

---

## Configuration

### Changing the App URL

Edit `App.js`:
```javascript
const APP_URL = 'https://bold-beyond.vercel.app/appx';
const APP_DOMAIN = 'bold-beyond.vercel.app';
```

### Changing Colors

Edit `app.json`:
```json
{
  "splash": {
    "backgroundColor": "#1a5f4a"
  }
}
```

And update the loading spinner color in `App.js`.

---

## Files Overview

```
mobile-app/
├── App.js          # Main app with WebView
├── app.json        # Expo configuration
├── eas.json        # Build profiles
├── package.json    # Dependencies
└── assets/
    ├── icon.png         # App icon (1024x1024)
    ├── splash.png       # Splash screen (1284x2778)
    └── adaptive-icon.png # Android icon (1024x1024)
```

---

## Cost Summary

| Item | Cost |
|------|------|
| Apple Developer | $99/year |
| Expo (EAS Build) | Free (30 builds/month) |
| **Total** | **$99/year** |

---

## Troubleshooting

### "Apple Developer account required"
You need a paid Apple Developer account ($99/year) to distribute iOS apps.

### "Build failed"
Check the build logs on [expo.dev](https://expo.dev) dashboard.

### "App rejected"
Common reasons:
- Missing privacy policy URL
- Incomplete app description
- Screenshots don't match functionality

### External links opening in-app
Check `handleShouldStartLoadWithRequest` in `App.js` to control link behavior.

---

## Support

- **Expo/EAS**: [docs.expo.dev](https://docs.expo.dev)
- **App Store Connect**: [developer.apple.com/support](https://developer.apple.com/support)
