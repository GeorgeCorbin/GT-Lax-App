# GT Lacrosse App - App Store Deployment Guide

## Pre-Deployment Checklist

1. **Update Version Numbers**
   - Open `app.json`
   - Increment both:
     - `version` (e.g., "1.2.0")
     - `buildNumber` (iOS) and `versionCode` (Android)

2. **Test the App**
   - Run the app locally and verify all features
   - Test on both iOS simulator and physical device
   - Check all API endpoints and data loading
   - Verify notifications are working
   - Test deep links and navigation

3. **Update Firebase Configuration**
   - Verify all Firebase configurations are up to date
   - Check that the auto-remove articles list is current
   - Ensure all player data and images are updated

## Building for App Store

1. Delete ios folder
2. npx expo prebuild --platform ios
3. 

## Uploading to App Store

1. **Using Transporter**
   ```bash
   # Open Transporter from Applications folder
   open -a Transporter
   ```
   - Drag and drop the .ipa file into Transporter
   - Click "Deliver" to upload

2. **Alternative Command Line Upload**
   ```bash
   # Using xcrun (replace PATH_TO_IPA with your .ipa file path)
   xcrun altool --upload-app --type ios --file "PATH_TO_IPA" --username "YOUR_APPLE_ID" --password "YOUR_APP_SPECIFIC_PASSWORD"
   ```

## App Store Connect Setup

1. **Update App Information**
   - Log in to [App Store Connect](https://appstoreconnect.apple.com)
   - Select GT Lacrosse App
   - Update screenshots if UI has changed
   - Update app description if needed
   - Verify app privacy information is current

2. **Submit for Review**
   - Select the new build
   - Answer all review questions
   - Provide test account if needed
   - Submit for review

## Post-Submission Checklist

1. **Monitor Review Status**
   - Check App Store Connect daily for review status
   - Be ready to respond to any reviewer questions

2. **Backup Important Files**
   ```bash
   # Create a tagged backup
   git tag v1.2.0  # Use your version number
   git push origin v1.2.0
   ```

## Common Issues and Solutions

1. **Build Fails**
   - Check EAS build logs
   - Verify all native dependencies are properly linked
   - Check Expo config plugins

2. **Upload Fails**
   - Verify Apple Developer account status
   - Check app-specific password is current
   - Verify bundle identifier matches

3. **Review Rejection**
   - Common causes:
     - Missing privacy declarations
     - Incomplete testing instructions
     - Performance issues
   - Keep documentation of all reviewer communications

4. **CocoaPods Issues**
   - If you see warnings about CocoaPods CDN:
     ```bash
     pod install --verbose --no-repo-update
     ```
   - If CocoaPods is out of date:
     ```bash
     sudo gem update cocoapods
     pod repo update
     ```
   - For M1/M2 Mac issues:
     ```bash
     arch -x86_64 pod install
     ```

## Important Notes

- Always test the production build before uploading
- Keep app-specific password in a secure location
- Document any special instructions for reviewers
- Maintain a deployment log for future reference

## Useful Links

- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [Transporter User Guide](https://apps.apple.com/us/app/transporter/id1450874784) 

npm uninstall expo-image
npx expo install expo-image 

cd ios
rm -rf Pods Podfile.lock
pod install --repo-update 

cd ..
eas build --platform ios --local 