@echo off
echo 🛑 Parando todos os servidores Node.js...
taskkill /f /im node.exe >nul 2>&1
echo ✅ Servidores parados!
pause 