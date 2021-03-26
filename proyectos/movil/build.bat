call del C:\node13\movil\dist\*.* /Q
call cordova build android --release
pause
call copy C:\node13\movil\platforms\android\app\build\outputs\apk\release\app-release-unsigned.apk C:\node13\movil\dist\pm.apk
call "C:\Program Files\Android\Android Studio\jre\bin\jarsigner" -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore intap.keystore -storepass preventa11 -keypass preventa11 C:\node13\movil\dist\pm.apk intap
call "C:\Users\Gabriel\AppData\Local\Android\Sdk\build-tools\28.0.3\zipalign" -v 4 C:\node13\movil\dist\pm.apk C:\node13\movil\dist\pm-final.apk
call del C:\node13\movil\dist\pm.apk
pause