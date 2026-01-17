@echo off
REM Quick build optimization script for KwikCheck Android
REM This script helps you run optimized builds

echo.
echo ==========================================
echo KwikCheck Android Build Optimizer
echo ==========================================
echo.

REM Check if we're in the right directory
if not exist "package.json" (
    echo ERROR: Must run from KwikCheck root directory
    exit /b 1
)

echo Available commands:
echo.
echo 1. Fast Development Build (arm64-v8a only)
echo    Command: npx react-native run-android
echo.
echo 2. Clean and Rebuild
echo    Commands:
echo    - npm install
echo    - cd android ^&^& ./gradlew clean ^&^& cd ..
echo    - npx react-native run-android
echo.
echo 3. Production Build (all architectures)
echo    Note: First edit android/gradle.properties and change:
echo    reactNativeArchitectures=arm64-v8a
echo    TO:
echo    reactNativeArchitectures=armeabi-v7a,arm64-v8a,x86,x86_64
echo.
echo 4. View Build Profile
echo    Commands:
echo    - cd android
echo    - ./gradlew build --profile
echo    - Check build/reports/profile/ folder
echo.
echo 5. Keep Metro bundler running between builds
echo    Terminal 1: npm start
echo    Terminal 2: npx react-native run-android --no-packager
echo.
echo For detailed information, see:
echo - BUILD_OPTIMIZATION_GUIDE.md
echo - BUILD_FIXES_SUMMARY.md
echo.
pause
