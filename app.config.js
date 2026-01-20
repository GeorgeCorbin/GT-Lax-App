import 'dotenv/config';

export default {
  name: "GT Lacrosse",
  slug: "gt-lax-app",
  version: "1.1.2",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "myapp",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  splash: {
    image: "./assets/images/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff"
  },
  assetBundlePatterns: [
    "**/*"
  ],
  ios: {
    supportsTablet: true,
    googleServicesFile: "./firebase/GoogleService-Info.plist",
    bundleIdentifier: "com.gtlacrosse.gtlacrosse",
    config: {
      usesNonExemptEncryption: false
    },
    infoPlist: {
      NSCameraUsageDescription: "We do not use the camera.",
      ITSAppUsesNonExemptEncryption: false
    }
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff"
    },
    package: "com.gtlacrosse.app"
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png"
  },
  plugins: [
    "expo-router",
    "expo-asset",
    [
      "expo-notifications",
      {
        icon: "./assets/images/notification-icon.png",
        color: "#ffffff"
      }
    ],
    [
      "expo-build-properties",
      {
        ios: {
          useFrameworks: "static",
          jsEngine: "hermes"
        }
      }
    ],
    "expo-video"
  ],
  experiments: {
    typedRoutes: true
  },
  extra: {
    router: {
      origin: false
    },
    api_key: process.env.API_KEY || '',
    eas: {
      projectId: "5083a26f-f6f1-4fef-a42c-67b97e94727b"
    }
  },
  owner: "georgec36",
  runtimeVersion: {
    policy: "appVersion"
  },
  updates: {
    url: "https://u.expo.dev/5083a26f-f6f1-4fef-a42c-67b97e94727b"
  }
};
