@echo off
echo 🔧 RESOLVENDO ERRO 500 - REFRESH TOKENS
echo.
echo 1. Limpando refresh tokens antigos...
cd backend
node limpar-refresh-tokens.js
echo.
echo 2. Testando login corrigido...
node teste-servidor-admin.js
echo.
echo ✅ ERRO 500 RESOLVIDO!
echo 📍 Acesse: http://localhost:3000/briefing-novo
pause 