Write-Host "DEBUG CONVITES - TESTE SIMPLES" -ForegroundColor Cyan

# Testar se backend está rodando
Write-Host "1. Testando backend..." -ForegroundColor Yellow
$health = Invoke-WebRequest -Uri "http://localhost:3001/api/health" -UseBasicParsing
Write-Host "Status backend: $($health.StatusCode)" -ForegroundColor Green

# Testar rota de convites simples
Write-Host "2. Testando rota convites..." -ForegroundColor Yellow
try {
    $convites = Invoke-WebRequest -Uri "http://localhost:3001/api/convites" -UseBasicParsing
    Write-Host "Rota convites: $($convites.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "Erro na rota convites: $($_.Exception.Message)" -ForegroundColor Red
}

# Testar token específico
Write-Host "3. Testando token específico..." -ForegroundColor Yellow
try {
    $token = Invoke-WebRequest -Uri "http://localhost:3001/api/convites/token_123" -UseBasicParsing
    Write-Host "Token teste: $($token.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "Erro token: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Detalhes: $($_.ErrorDetails.Message)" -ForegroundColor Red
}

Write-Host "Teste concluído!" -ForegroundColor Cyan 