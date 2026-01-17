# Camera Setup Guide for React Native CLI

The `CustomCamera.tsx` component has been refactored to work with React Native CLI compatible libraries. Follow these steps to complete the setup:

## Required Dependencies

### 1. Install React Native Vision Camera (Recommended)

```bash
npm install react-native-vision-camera
cd ios && pod install && cd ..
```

**Android Setup:**
Add to `android/app/src/main/AndroidManifest.xml`:
```xml
<uses-permission android:name="android.permission.CAMERA" />
```

**iOS Setup:**
Add to `ios/KwikCheck/Info.plist`:
```xml
<key>NSCameraUsageDescription</key>
<string>KwikCheck needs access to your camera to capture vehicle photos</string>
```

### 2. Install Geolocation

```bash
npm install @react-native-community/geolocation
```

**Android Setup:**
Add to `android/app/src/main/AndroidManifest.xml`:
```xml
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
```

**iOS Setup:**
Add to `ios/KwikCheck/Info.plist`:
```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>KwikCheck needs your location to tag photos</string>
```

### 3. Install File System

```bash
npm install react-native-fs
cd ios && pod install && cd ..
```

### 4. Install Keep Awake

```bash
npm install react-native-keep-awake
cd ios && pod install && cd ..
```

### 5. Install Image Resizer (Optional - for image compression)

```bash
npm install react-native-image-resizer
cd ios && pod install && cd ..
```

## Code Updates Required

After installing the dependencies, uncomment the import statements in `CustomCamera.tsx`:

```typescript
// Line 15-16: Uncomment these
import { Camera, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';

// Line 19-20: Uncomment this
import Geolocation from '@react-native-community/geolocation';

// Line 23-24: Uncomment this
import RNFS from 'react-native-fs';

// Line 27-28: Uncomment this
import KeepAwake from 'react-native-keep-awake';
```

Then replace the `PlaceholderCamera` component with actual Camera implementation:

```typescript
// Remove PlaceholderCamera and use:
const device = useCameraDevice(facing);

<Camera
  ref={cameraRef}
  style={styles.camera}
  device={device}
  isActive={true}
  photo={true}
>
  <View style={styles.buttonContainer}>
    <TouchableOpacity
      style={styles.button}
      onPress={handlePreview}
      disabled={isCameraDisabled}
    >
      <View style={[styles.buttonBg, isCameraDisabled && styles.disabledCameraButton]}>
        <AntDesign name="camera" size={30} color="white" />
      </View>
    </TouchableOpacity>
  </View>
</Camera>
```

Update the `handlePreview` function to use Vision Camera's API:

```typescript
async function handlePreview() {
  try {
    setIsCameraDisabled(true);

    const photo = await cameraRef.current?.takePhoto({
      qualityPrioritization: 'balanced',
      flash: 'off',
      enableShutterSound: true,
    });

    if (!photo?.path) {
      throw new Error("Camera returned empty path");
    }

    const photoPath = `file://${photo.path}`;
    setPreview(photoPath);
  } catch (error) {
    console.error("Camera error:", error);
    ToastAndroid.show("Camera error. Please retry", ToastAndroid.SHORT);
    setIsCameraDisabled(false);
  }
}
```

## Testing

1. Rebuild the app:
```bash
# Android
npm run android

# iOS
npm run ios
```

2. Test camera permissions
3. Test photo capture
4. Test image preview and proceed flow
5. Test on different device sizes (phone/tablet)

## Documentation

- [React Native Vision Camera](https://react-native-vision-camera.com/)
- [RN Community Geolocation](https://github.com/react-native-geolocation/react-native-geolocation)
- [React Native FS](https://github.com/itinance/react-native-fs)
- [React Native Keep Awake](https://github.com/corbt/react-native-keep-awake)

## Benefits of This Migration

✅ **Pure React Native CLI** - No Expo dependencies  
✅ **Better Performance** - Native camera APIs  
✅ **Responsive Design** - Adapts to all device sizes  
✅ **Modern Icons** - Using react-native-vector-icons  
✅ **Better Permissions** - Android/iOS native permission handling  
✅ **Production Ready** - Industry-standard camera library  

## Troubleshooting

**Camera not showing:**
- Check permissions in device settings
- Verify AndroidManifest.xml / Info.plist entries
- Rebuild the app after installing libraries

**Build errors:**
- Run `cd android && ./gradlew clean && cd ..`
- Delete `node_modules` and `package-lock.json`, then `npm install`
- For iOS: `cd ios && pod deintegrate && pod install && cd ..`

**Photo capture failing:**
- Check storage permissions (Android)
- Verify camera device is detected: `console.log(device)`
- Test on physical device (emulator cameras can be unreliable)
