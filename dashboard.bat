@echo off
title QoreChain Bot Control Panel
color 0A
cls
echo ================================================
echo   QoreChain Bot Control Panel
echo ================================================
echo.
echo Starting control panel on port 3000...
echo Control panel will open automatically in your browser
echo.
echo Press Ctrl+C to stop the server
echo ================================================
echo.

REM Change to script directory
cd /d "%~dp0"

REM Check if node_modules exists
if not exist "node_modules" (
    echo [ERROR] Dependencies not installed!
    echo Installing dependencies...
    call npm install
    echo.
)

echo [INFO] Starting http-server...
echo.

REM Start http-server from parent directory, serving control panel
npx --yes http-server . -p 3000 -o /dashboard/control-panel.html

echo.
echo ================================================
echo Server stopped at %date% %time%
echo ================================================
pause
