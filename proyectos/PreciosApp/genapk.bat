call build.bat
copy src-cordova\platforms\android\app\build\outputs\apk\release\*.apk *.apk
call firmar.bat
call alinear.bat
call copiarapk.bat
echo APK generada ...





