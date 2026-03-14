@echo off
cd /d "%~dp0"

echo ================================================
echo   QoreChain Auto Bot - Loop Mode
echo ================================================
echo.
echo This script runs continuous loop mode.
echo For single-run debug use start-single.bat
echo.

if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    echo.
    echo Installing Playwright browsers...
    call npx playwright install chromium
    echo.
)

if not exist "data" mkdir data
if not exist "screenshots" mkdir screenshots
if not exist "logs" mkdir logs

echo Starting loop...
echo.
call npm run loop

echo.
echo ================================================
echo Loop execution completed!
echo ================================================
echo.
pause
