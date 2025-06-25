# Georgia Tech Lacrosse Team App

- Shop needs to be moved to (tabs) when ready to publish

# GT-Lax-App

Georgia Tech Lacrosse Team Mobile Application built with React Native and Expo.

## Features

- **News & Articles**: Latest team news with automatic RSS feed integration
- **Schedule**: Game schedules with opponent information and locations  
- **Roster**: Player profiles with bios and statistics
- **Shop**: Team merchandise store
- **Push Notifications**: Automatic notifications for new articles and manual notifications
- **Admin Panel**: Administrative controls for team management

## New Article Notification System

The app now automatically sends push notifications when new articles are posted to the team website. This system includes:

### Automatic Notifications
- **Detection**: The app automatically detects new articles when fetching from the RSS feed
- **Smart Filtering**: Only sends notifications for genuinely new articles (not on first install)
- **Random Content**: Each notification uses randomly selected titles (with no consecutive repeats) and dynamic messages using actual article titles

### Notification Options
**Titles (10 options, randomly selected with no back-to-back repeats):**
- 🏆 Georgia Tech Lacrosse News!
- 🥍 Breaking: New GT Lax Update!
- ⚡ Fresh GT Lacrosse Content!
- 🔥 Georgia Tech Lax Alert!
- 📰 Latest from the Yellow Jackets!
- 🎯 GT Lacrosse Update!
- ⭐ Georgia Tech News Flash!
- 🚨 New Buzz from Tech Lacrosse!
- 📢 Yellow Jacket Headlines!
- 💪 Fresh GT Lax News!

**Bodies (dynamically generated using actual article titles):**
- Single article: `New article: "Article Title"`
- Two articles: `New articles: "Title 1" and "Title 2"`
- Three or more: `New articles: "Title 1", "Title 2" and X more`

### How It Works
1. App fetches latest articles from RSS feed
2. **Applies filtering** to exclude commitment/transfer articles and auto-remove list items
3. Compares filtered articles with locally stored articles to detect new ones
4. **Only "notification-worthy" articles** trigger notifications (no spam from commitments)
5. If new articles are found, sends notification with random title/body
6. Users receive notification and can tap to open the news section
7. Notifications are sent to all users who have granted permission

### Smart Filtering
The system automatically filters out articles that shouldn't trigger notifications:
- **Commitment Articles**: "Player commits to Georgia Tech" announcements
- **Transfer Articles**: "Player transfers to Georgia Tech" announcements  
- **Auto-Remove List**: Manually specified articles in Firebase to skip
- **Old Articles**: Articles older than 2 years are automatically excluded

## Feature Flag System

The automatic article notifications feature is controlled by a comprehensive feature flag system that allows for safe testing and gradual rollout.

### Feature Flag Configuration
Located at `https://gt-lax-app.web.app/feature_flags.json`, the system supports:

- **enabled**: Master switch to enable/disable the feature entirely
- **global_enabled**: Controls whether the feature is available to all users or just test users
- **allowed_tokens**: Array of specific push tokens that receive notifications when global_enabled is false
- **description**: Human-readable description of the feature
- **last_updated**: Date of last configuration change
- **updated_by**: Who made the last change

### Current Configuration
```json
{
  "automatic_article_notifications": {
    "enabled": true,
    "global_enabled": false,
    "allowed_tokens": [
      "ExponentPushToken[Y-PL4hKhL-hs7fafAytiZR]"
    ],
    "description": "Controls automatic push notifications when new articles are detected",
    "last_updated": "2025-01-27",
    "updated_by": "admin"
  }
}
```

### How Feature Flags Work
1. **Client-side check**: App checks feature flags before calling notification function
2. **Server-side filtering**: Firebase function filters tokens based on feature flag settings
3. **Testing mode**: When `global_enabled` is false, only `allowed_tokens` receive notifications
4. **Global rollout**: When `global_enabled` is true, all users receive notifications

### Admin Interface
A feature flag management interface is available in the admin panel (`app/more/admin/FeatureFlagManager.tsx`) that provides:
- Real-time feature flag status viewing
- Toggle switches for enabling/disabling features
- Token management for testing mode
- Test notification functionality
- Metadata tracking for changes

### Rollout Strategy
1. **Phase 1 (Current)**: Testing with single admin token
2. **Phase 2**: Add more test users to allowed_tokens array
3. **Phase 3**: Enable global_enabled for all users
4. **Phase 4**: Monitor and adjust as needed

### Testing
Admin users can test the notification system through the admin panel:
- **Manual Notifications**: Send test notifications with fixed content
- **Article Notifications**: Test the article notification system with random content

### Firebase Cloud Functions
Two Cloud Functions power the notification system:
- `sendPushNotification`: Manual notifications with custom title/body
- `sendArticleNotification`: Automatic article notifications with random content

The system respects user notification preferences and only sends to users who have granted permission.

## Development Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. For Firebase Functions development:
```bash
cd firebase/functions
npm install
npm run build
firebase deploy --only functions
```

## Tech Stack

- **Frontend**: React Native, Expo
- **Backend**: Firebase (Firestore, Cloud Functions, Hosting)
- **Notifications**: Expo Push Notifications
- **State Management**: React Context
- **Styling**: React Native StyleSheet
- **Data Sources**: RSS feeds, Firebase Firestore
