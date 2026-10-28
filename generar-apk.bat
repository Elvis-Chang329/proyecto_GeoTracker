@echo off
echo ===================================================
echo   GENERANDO APK OFICIAL PARA GEOTRACKER
echo ===================================================
echo.

call gradlew.bat assembleDebug

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] La compilacion del APK ha fallado. Revisa los errores arriba.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo ===================================================
echo   COPIANDO APK A LA CARPETA DE SALIDA...
echo ===================================================

if not exist "APK" mkdir "APK"

copy "app\build\outputs\apk\debug\app-debug.apk" "APK\geotracker-app.apk" /Y

echo.
echo  ¡EXITO! Tu APK esta listo en la carpeta: APK\geotracker-app.apk
echo.
pause
