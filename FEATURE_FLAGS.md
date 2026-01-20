# Remote Feature Flags System

## Overview

The app now uses a remote feature flag system hosted on Firebase that allows you to control features without pushing app updates. Feature flags support token-based overrides for testing.

## Architecture

### Files Created/Modified

1. **`/firebase/public/feature_flags.json`** - Remote feature flag configuration
2. **`/utils/featureFlagService.ts`** - Service for fetching and evaluating flags
3. **`/utils/devTokenDisplay.ts`** - Development utility for displaying expo tokens
4. **`/context/AppDataProvider.tsx`** - Updated to provide feature flags to the app
5. **`/app/schedule/GameCard.tsx`** - Updated to use remote feature flags

## Feature Flag Structure

Each feature flag in `feature_flags.json` has the following structure:

```json
{
  "feature_name": {
    "enabled": true,
    "global_enabled": true,
    "allowed_tokens": [],
    "description": "Description of the feature",
    "last_updated": "2026-01-20",
    "updated_by": "admin"
  }
}
```

### Fields

- **`enabled`**: Whether the feature is enabled for users with tokens in `allowed_tokens`
- **`global_enabled`**: Whether the feature is enabled for all users
- **`allowed_tokens`**: Array of Expo push tokens that can access this feature regardless of `global_enabled`
- **`description`**: Human-readable description
- **`last_updated`**: ISO date of last update
- **`updated_by`**: Who made the last update

## Game Information Feature Flags

The following flags control the Game Information page:

1. **`game_information`** - Master toggle for entire page
2. **`game_info_field_name`** - Show/hide field name
3. **`game_info_image`** - Show/hide field image
4. **`game_info_location`** - Show/hide location
5. **`game_info_weather`** - Show/hide weather information
6. **`game_info_streaming`** - Show/hide streaming/coverage info

## How to Use

### Remote Control (Production)

1. Edit `/firebase/public/feature_flags.json` on your Firebase hosting
2. Deploy changes: `firebase deploy --only hosting`
3. Changes take effect within 5 minutes (cache duration)

### Token-Based Override

To enable a feature for specific devices during testing:

1. Run the app in development mode
2. Check the terminal for the expo token (displayed on startup):
   ```
   ======================================================================
   🔑 EXPO PUSH TOKEN FOR FEATURE FLAG OVERRIDES:
   
      ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]
   
   💡 Add this token to feature_flags.json "allowed_tokens" array
      to enable feature flag overrides for this device.
   ======================================================================
   ```
3. Add the token to the `allowed_tokens` array in `feature_flags.json`
4. Deploy the updated file

### Example: Enable Feature for Testing Device

```json
{
  "game_information": {
    "enabled": true,
    "global_enabled": false,
    "allowed_tokens": [
      "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]"
    ],
    "description": "Master toggle for game information",
    "last_updated": "2026-01-20",
    "updated_by": "admin"
  }
}
```

In this example:
- Feature is disabled for all users (`global_enabled: false`)
- Feature is enabled only for devices with the specified token
- Perfect for testing before public release

## Evaluation Logic

The feature flag service evaluates flags using this logic:

1. If `global_enabled` is `true`, feature is enabled for everyone
2. If user's expo token is in `allowed_tokens`, use the `enabled` value
3. Otherwise, feature requires both `enabled: true` AND `global_enabled: true`

## Caching

- Feature flags are cached for 5 minutes to reduce server load
- Cache is stored in AsyncStorage
- Use `refreshFeatureFlags()` from `useAppData()` to force refresh

## Development

### Display Token Manually

```typescript
import { forceDisplayExpoToken } from '@/utils/devTokenDisplay';

// Call anywhere in development
await forceDisplayExpoToken();
```

### Access Feature Flags in Components

```typescript
import { useAppData } from '@/context/AppDataProvider';

const MyComponent = () => {
  const { featureFlags, loadingFeatureFlags } = useAppData();
  
  if (loadingFeatureFlags) {
    return <Loading />;
  }
  
  if (!featureFlags.my_feature?.enabled) {
    return <FeatureDisabled />;
  }
  
  return <MyFeature />;
};
```

## Deployment Workflow

1. **Test Locally**: Verify changes work with local feature flags
2. **Add Test Token**: Add your device's expo token to `allowed_tokens`
3. **Deploy to Firebase**: `firebase deploy --only hosting`
4. **Test on Device**: Verify feature works as expected
5. **Enable Globally**: Set `global_enabled: true` when ready
6. **Deploy Again**: Push final configuration

## Troubleshooting

### Token Not Displaying

- Ensure you're running in development mode (`__DEV__` is true)
- Check notification permissions are granted
- Token displays once per session to avoid spam

### Feature Not Updating

- Wait 5 minutes for cache to expire
- Call `refreshFeatureFlags()` to force refresh
- Verify Firebase hosting deployment succeeded

### Feature Always Disabled

- Check `global_enabled` is `true` OR your token is in `allowed_tokens`
- Verify JSON syntax is valid in `feature_flags.json`
- Check browser console for fetch errors

## Security Notes

- Expo tokens are not secret - they're used for push notifications
- Feature flags are public (served from Firebase hosting)
- Don't use feature flags for security-critical features
- Use proper backend authentication for sensitive features
