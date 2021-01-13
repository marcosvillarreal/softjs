call del C:\pm.build\*.* /Q
md C:\pm.build

copy C:\users\marco\documents\githuh\softjs\proyectos\movil\platforms\android\build\outputs\apk\release\android-release-unsigned.apk c:\pm.build\pm.apk
call "C:\Program Files\Java\jdk-15.0.1\bin\jarsigner" -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore C:\users\documents\github\softjs\proyectos\pm\keystore\intap.keystore -storepass preventa11 -keypass preventa11 c:\pm.build\pm.apk intap
call "C:\Program Files\Android\sdk\build-tools\30.0.3\zipalign" -v 4 c:\pm.build\pm.apk c:\pm.build\pm-final.apk

pause