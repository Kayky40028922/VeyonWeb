@echo off
cd /d "%~dp0"

start "Servidor VeyonWeb" /min cmd /c "node backend/server.js"

timeout /t 3 /nobreak >nul

start "" http://localhost:3000

exit