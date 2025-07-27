# Script para corrigir incompatibilidades no casa-simples-final.ts
$content = Get-Content casa-simples-final-backup.ts -Raw

# Substituir tipos incompatíveis
$content = $content -replace "tipo: 'radio_condicional'", "tipo: 'select'"
$content = $content -replace "tipo: 'componente_customizado'", "tipo: 'texto_longo'"
$content = $content -replace "tipo: 'telefone'", "tipo: 'texto'"
$content = $content -replace "tipo: 'email'", "tipo: 'texto'"

# Remover propriedades incompatíveis (regex mais robusta)
$content = $content -replace ",\s*validacao:\s*\{[^}]*\}", ""
$content = $content -replace ",\s*mascara:\s*'[^']*'", ""
$content = $content -replace ",\s*rows:\s*\d+", ""
$content = $content -replace ",\s*tooltip:\s*'[^']*'", ""
$content = $content -replace ",\s*integracaoAPI:\s*'[^']*'", ""
$content = $content -replace ",\s*pattern:\s*'[^']*'", ""
$content = $content -replace ",\s*min:\s*\d+", ""
$content = $content -replace ",\s*max:\s*\d+", ""

# Remover estruturas complexas (multi-line)
$content = $content -replace ",\s*estrutura:\s*\{[\s\S]*?\},", ","
$content = $content -replace ",\s*campoCondicional:\s*\{[\s\S]*?\},", ","
$content = $content -replace ",\s*camposCondicionais:\s*\{[\s\S]*?\},", ","

# Limpar vírgulas duplas e espaços extras
$content = $content -replace ",,", ","
$content = $content -replace ",\s*\}", "}"
$content = $content -replace "{\s*,", "{"

# Salvar arquivo corrigido
$content | Set-Content casa-simples-final-fixed.ts

Write-Host "Arquivo corrigido salvo como: casa-simples-final-fixed.ts" 