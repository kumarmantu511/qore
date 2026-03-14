@echo off
cd /d "%~dp0"

if not exist "logs" mkdir logs

echo Starting QoreChain loop in background...
echo Output: logs\loop_stdout.log
echo Errors: logs\loop_stderr.log

start "qorechain-loop" /min cmd /c "set TIMING_MULTI_ACCOUNT_COUNT=0 && npm run loop 1>logs\loop_stdout.log 2>logs\loop_stderr.log"
