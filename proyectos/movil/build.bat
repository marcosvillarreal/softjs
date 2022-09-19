call del J:\softjs\proyectos\movil\dist\*.* /Q
call cordova build android --release
pause
call copy J:\softjs\proyectos\movil\platforms\android\app\build\outputs\apk\release\app-release-unsigned.apk J:\softjs\proyectos\movil\dist\pm.apk
call "C:\Program Files\Android\Android Studio\jre\bin\jarsigner" -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore intap.keystore -storepass preventa11 -keypass preventa11 J:\softjs\proyectos\movil\dist\pm.apk intap
call "C:\Users\Marco\AppData\Local\Android\Sdk\build-tools\28.0.3\zipalign" -v 4 J:\softjs\proyectos\movil\dist\pm.apk J:\softjs\proyectos\movil\dist\pm-final.apk
call del J:\softjs\proyectos\movil\dist\pm.apk
pause