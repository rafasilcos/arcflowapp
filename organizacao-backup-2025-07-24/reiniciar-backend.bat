@echo off
echo 🔄 REINICIANDO BACKEND COM CORREÇÕES...
echo.
echo 1. Parando servidores Node.js...
taskkill /f /im node.exe >nul 2>&1
echo    ✅ Servidores parados
echo.
echo 2. Limpando refresh tokens...
cd backend
node limpar-refresh-tokens.js
echo.
echo 3. Iniciando backend corrigido...
echo    🚀 Servidor será iniciado na porta 3001
echo    📍 Para parar: Ctrl+C
echo.
node server-simple.js 