# React Native App for Rn64test

### System

- MacOS Big Sur 11.5.2
- Xcode 13.1
- Targets: iPhones, iPads, Android Phones, Tablets

### Before Getting Started

- Set up react native on your local machine
  - Note: we need to setup both Expo CLI and React Native CLI below because this was initially an Expo project which was ejected to use bare workflow
  - Visit https://reactnative.dev/docs/environment-setup
  - Choose `Expo CLI Quickstart`, perform setup according to instructions
  - Choose `React Native CLI Quickstart`
  - Choose your `Development OS`, and perform setup for Target OS of `Android` and `IOS` (Note: IOS set up requires Xcode, which is only available for MacOS)

### Project Setup

- Only perform the steps below if setup above has been completed
- Download repo into your local machine
  - `git clone https://github.com/rn64test-com/rn64test_buyer_react_native.git`
- Navigate to repo directory and install dependencies
  - `cd rn64test_buyer_react_native`
  - `npm install`
- For MacOS, install CocoaPods dependencies
  - `cd ios && npx pod-install && cd ..`
- Run development server
  - `npm start`
- Start android simulator
  - `npm run android`
  - If you encounter errors, check "Common Problems and Troubleshooting" section below to see if it's been encountered before
- Start ios simulator (only for MacOS)
  - Open `rn64test_buyer_react_native/ios/RN64TEST.xcworkspace` with XCode
  - Build the app with XCode
  - If you encounter errors, check "Common Problems and Troubleshooting" section below to see if it's been encountered before

### Deployment

- **Common steps**

  - Update app version in multiple files
    - `app.json`
    - `package.json`
      -Sync release channels
    - `AndroidManifest.xml` - expo.modules.updates.EXPO_RELEASE_CHANNEL (value = "prod")
    - `Expo.plist` - EXUpdatesReleaseChannel (value = "prod")

- **Deploy to TestFlight for IOS**  
  (Note: Only on MacOS. You need an Apple Developer Account invited to RN64TEST LABS PTE. LTD development team)

  - Update app version in xCode (use the same version as common step above)
    - Navigate: General -> Identity -> Version
  - Set target device (at top bar of XCode)
    - `Any IOS Device`
  - Edit Scheme and Archive
    - Navigate from XCode top menu: Product -> Scheme -> Edit Scheme -> Run (left tab) -> set `Build Configuration: Release`
    - Navigate from XCode top menu: Product -> Archive
  - Follow on-screen instructions to upload build to TestFlight
  - Related youtube video for step-by-step tutorial
    - https://www.youtube.com/watch?v=DLvdZtTAJrE

- **Deploy to PlayStore for Android**  
  (Note: You need a Google Play Console account shared with Rn64test)

  - Update app version in `rn64test_buyer_react_native/android/app/build.gradle` (use the same version as common step above)
  - Add the following to keychain (ssh-agent, used to sign the app during build. Ask Edward for rn64test_android_keystore value)
    - keychain item name: rn64test_android_keystore
    - account name: rn64test_account_name
    - rn64test_android_keystore: (Ask Edward for value)
  - Build .aab (Android App Bundle) file
    - `npm run buildaab`
  - Upload build result to PlayStore Developer site
    - Navigate to https://play.google.com/console/u/0/developers/8465607295942301396/app/4972084747906370193/tracks/open-testing
    - Click on `Edit release`
    - Copy `app-release.aab` in `rn64test_buyer_react_native/android/app/build/outputs/bundle/release/app-release.aab`
    - Add Release name and release the build
    - Updated app version will be available for download in PlayStore after it's been reviewed

- **Generate .apk file for local installation / sharing**  
  (Note: for Android only)

  - Navigate to `rn64test_buyer_react_native` folder,
    - Run `cd android && ./gradlew assembleRelease && cd ..`
    - Copy .apk file in `rn64test_buyer_react_native/android/app/build/outputs/apk/release/app-release.apk` to Android devices for installation

### Common Problems and Troubleshooting

- Some problems found while setting up / running the project in 2021 Macbook Pro (M1 Pro processor) and tested solutions:

  - `IOS -> unable to attach to pid` while building in XCode

    - In XCode, navigate from top menu bar: Product -> Scheme -> Edit Scheme -> Run -> Uncheck Debug Executable
    - Link for more info https://developer.apple.com/forums/thread/120282

  - `Pod Install Error` on M1 Mac

    - Remove `ios/Pods`
    - `sudo arch -x86_64 gem install ffi`
    - `cd ios && arch -x86_64 pod install && cd ..`
    - Link for more info https://github.com/CocoaPods/CocoaPods/issues/10518

  - `Illegal operations on a directory`

    - Stop development server if it's running
    - `react-native start --reset-cache`
    - Link for more info https://github.com/itinance/react-native-fs/issues/991

  - `SDK location not found`
    - Go to `rn64test_buyer_react_native/android`
    - Create a file called `local.properties` with this line (change `USERNAME` to your local machine name):  
      `sdk.dir = /Users/USERNAME/Library/Android/sdk`
    - Link for more info https://stackoverflow.com/questions/32634352/react-native-android-build-failed-sdk-location-not-found

### Over-the-air updates

- see (expo-update for ejected workflow)

- npm run publishprod
- before issuing the publish command, sync the release channels in these files:

  - EXUpdatesReleaseChannel - /RN64TEST/ios/RN64TEST/Supporting/Expo.plist
  - EXPO_RELEASE_CHANNEL - /RN64TEST/android/app/src/main/AndroidManifest.xml

- also make sure to manually update version/build numbers in every build, and ota updates

  - Android: versionCode and name in /RN64TEST/android/app/build.gradle
  - IOS: Version and Build in xcode -> RN64TEST -> General tab (use xcode to manually edit)
  - Android/IOS: version in app.json and package.json

### Navigator/Screens

- paths: ./navigation, "./screens"
- Main/Smart components (wrapper) directly called by react navigation navigators
- Common (slightly reused) components prefixed with "Render" sits here

### Reusable Components

- small and highly reusable components
- path: "./components"
- Based on Styled Components

### Reusable libraries copied from frontend (web)

- ./hooks, ./services, ./stores, ./constants ./utils, ./assets, ./styles (themes)
- uses 2 globalStateObjects for custom global state needs, in passing data and navigation logic

[by RN64TEST](http://rn64test.com)
