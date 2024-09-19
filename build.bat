@echo off

REM Navigate to the android directory
cd android

REM Build the release APK
call gradlew.bat assembleRelease

REM Navigate back to the project root
cd ..

REM Check for connected devices
echo Checking for connected devices...
adb devices

REM Install the APK
echo Installing APK...
adb install -r android\app\build\outputs\apk\release\app-release.apk

echo Installation complete!
pause