Write-Host "🔍 === DEBUG SISTEMA DE CONVITES ===" -ForegroundColor Cyan
Write-Host ""

# 1. Testar backend
Write-Host "1. Testando conexão com backend..." -ForegroundColor Yellow
try {
    $healthResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/health" -Method GET
    Write-Host "✅ Backend funcionando: $($healthResponse.status)" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend não está funcionando: $($_.Exception.Message)" -ForegroundColor Red
    exit
}

# 2. Fazer login
Write-Host ""
Write-Host "2. Fazendo login..." -ForegroundColor Yellow
try {
    $loginBody = @{
        email = "admin@arcflow.com"
        password = "123456"
    } | ConvertTo-Json

    $loginResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
    $token = $loginResponse.tokens.accessToken
    Write-Host "✅ Login realizado com sucesso" -ForegroundColor Green
    Write-Host "🔑 Token: $($token.Substring(0, 20))..." -ForegroundColor Blue
} catch {
    Write-Host "❌ Erro no login: $($_.Exception.Message)" -ForegroundColor Red
    exit
}

# 3. Criar convite
Write-Host ""
Write-Host "3. Criando convite..." -ForegroundColor Yellow
try {
    $conviteBody = @{
        email = "colaborador@teste.com"
        nome = "João Silva Debug"
        cargo = "Arquiteto"
        role = "ARCHITECT"
    } | ConvertTo-Json

    $headers = @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    }

    $conviteResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/convites" -Method POST -Body $conviteBody -Headers $headers
    $conviteToken = $conviteResponse.convite.linkConvite.Split('/convite/')[1]
    
    Write-Host "✅ Convite criado com sucesso" -ForegroundColor Green
    Write-Host "🔗 Link: $($conviteResponse.convite.linkConvite)" -ForegroundColor Blue
    Write-Host "🎫 Token do convite: $conviteToken" -ForegroundColor Blue
} catch {
    Write-Host "❌ Erro ao criar convite: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        Write-Host "📋 Detalhes: $($_.ErrorDetails.Message)" -ForegroundColor Red
    }
    exit
}

# 4. Verificar convite
Write-Host ""
Write-Host "4. Verificando convite criado..." -ForegroundColor Yellow
try {
    $verificarResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/convites/$conviteToken" -Method GET
    Write-Host "✅ Convite encontrado: $($verificarResponse.convite.nome)" -ForegroundColor Green
    Write-Host "📧 Email: $($verificarResponse.convite.email)" -ForegroundColor Blue
    Write-Host "📊 Status: PENDENTE" -ForegroundColor Blue
} catch {
    Write-Host "❌ Convite não encontrado: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        Write-Host "📋 Detalhes: $($_.ErrorDetails.Message)" -ForegroundColor Red
    }
    Write-Host "🔍 Vamos verificar o que tem no servidor..." -ForegroundColor Yellow
    
    # Listar todos os convites para debug
    try {
        $todosConvites = Invoke-RestMethod -Uri "http://localhost:3001/api/convites" -Method GET -Headers $headers
        Write-Host "📋 Total de convites no servidor: $($todosConvites.convites.Count)" -ForegroundColor Blue
        if ($todosConvites.convites.Count -gt 0) {
            foreach ($c in $todosConvites.convites) {
                Write-Host "   - Token: $($c.token), Email: $($c.email)" -ForegroundColor Gray
            }
        }
    } catch {
        Write-Host "⚠️ Não foi possível listar convites" -ForegroundColor Yellow
    }
    exit
}

# 5. Aceitar convite
Write-Host ""
Write-Host "5. Aceitando convite..." -ForegroundColor Yellow
try {
    $aceitarBody = @{
        password = "123456"
        confirmarPassword = "123456"
    } | ConvertTo-Json

    $aceitarResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/convites/$conviteToken/aceitar" -Method POST -Body $aceitarBody -ContentType "application/json"
    
    Write-Host "✅ Convite aceito com sucesso!" -ForegroundColor Green
    Write-Host "👤 Usuário criado: $($aceitarResponse.user.nome)" -ForegroundColor Blue
    Write-Host "🏢 Escritório: $($aceitarResponse.user.escritorioId)" -ForegroundColor Blue
} catch {
    Write-Host "❌ Erro ao aceitar convite: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        Write-Host "📋 Detalhes: $($_.ErrorDetails.Message)" -ForegroundColor Red
    }
    exit
}

# 6. Verificar usuário na lista
Write-Host ""
Write-Host "6. Verificando se usuário aparece na lista..." -ForegroundColor Yellow
try {
    $usersResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/users" -Method GET -Headers $headers
    $colaborador = $usersResponse.users | Where-Object { $_.email -eq "colaborador@teste.com" }
    
    if ($colaborador) {
        Write-Host "✅ Colaborador encontrado na lista de usuários!" -ForegroundColor Green
        Write-Host "👤 Nome: $($colaborador.name)" -ForegroundColor Blue
        Write-Host "📧 Email: $($colaborador.email)" -ForegroundColor Blue
        Write-Host "🎭 Role: $($colaborador.role)" -ForegroundColor Blue
    } else {
        Write-Host "❌ Colaborador NÃO encontrado na lista de usuários" -ForegroundColor Red
        Write-Host "📋 Total de usuários: $($usersResponse.users.Count)" -ForegroundColor Blue
    }
} catch {
    Write-Host "❌ Erro ao listar usuários: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "🎯 === FIM DO DEBUG ===" -ForegroundColor Cyan 