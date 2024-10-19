@echo off

REM Navigate to the android directory
cd android

REM Clean the project
call gradlew.bat clean

REM Generate a signed App Bundle
call gradlew.bat bundleRelease

REM Navigate back to the project root
cd ..

echo Build process completed!
echo Please find your release artifacts in the following directory:
echo android\app\build\outputs\
echo AAB: android\app\build\outputs\bundle\release\app-release.aab

pause