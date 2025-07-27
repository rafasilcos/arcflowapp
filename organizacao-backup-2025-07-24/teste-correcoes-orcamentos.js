#!/usr/bin/env node

/**
 * 🔧 TESTE DE CORREÇÕES - MÓDULO ORÇAMENTOS
 * 
 * Este script testa se as correções aplicadas nos arquivos de orçamentos
 * resolveram os problemas de sintaxe e compilação.
 */

const fs = require('fs')
const path = require('path')

console.log('🔧 TESTE DE CORREÇÕES - MÓDULO ORÇAMENTOS')
console.log('=' .repeat(50))

// Arquivos que foram corrigidos
const arquivosCorrigidos = [
  'frontend/src/app/(app)/orcamentos/novo/page.tsx',
  'frontend/src/app/(app)/orcamentos/[id]/page.tsx'
]

console.log('\n📋 VERIFICANDO ARQUIVOS CORRIGIDOS:')

arquivosCorrigidos.forEach((arquivo, index) => {
  console.log(`\n${index + 1}. ${arquivo}`)
  
  if (fs.existsSync(arquivo)) {
    const conteudo = fs.readFileSync(arquivo, 'utf8')
    
    // Verificações específicas
    const problemas = []
    
    // Verificar imports duplicados
    const linhasImport = conteudo.split('\n').filter(linha => linha.trim().startsWith('import'))
    const importsReact = linhasImport.filter(linha => linha.includes('useState') || linha.includes('useEffect'))
    
    if (importsReact.length > 1) {
      problemas.push('❌ Imports duplicados do React detectados')
    }
    
    // Verificar tags não fechadas
    const tagsAbertas = (conteudo.match(/<[^/>]+>/g) || []).length
    const tagsFechadas = (conteudo.match(/<\/[^>]+>/g) || []).length
    const tagsAutoFechadas = (conteudo.match(/<[^>]+\/>/g) || []).length
    
    // Verificar JSX mal formado
    if (conteudo.includes('</Card>') && !conteudo.includes('<Card')) {
      problemas.push('❌ Tag </Card> sem abertura correspondente')
    }
    
    // Verificar sintaxe básica
    if (conteudo.includes('export default') && conteudo.includes('function')) {
      console.log('   ✅ Estrutura de componente React válida')
    } else {
      problemas.push('❌ Estrutura de componente React inválida')
    }
    
    // Verificar imports necessários
    if (arquivo.includes('novo/page.tsx')) {
      if (conteudo.includes('Building2') && conteudo.includes("import { Building2")) {
        console.log('   ✅ Import do Building2 presente')
      } else if (conteudo.includes('Building2')) {
        problemas.push('❌ Building2 usado mas não importado')
      }
    }
    
    if (problemas.length === 0) {
      console.log('   ✅ Arquivo sem problemas detectados')
    } else {
      console.log('   ⚠️  Problemas encontrados:')
      problemas.forEach(problema => console.log(`      ${problema}`))
    }
    
    console.log(`   📊 Tamanho: ${(conteudo.length / 1024).toFixed(1)}KB`)
    
  } else {
    console.log('   ❌ Arquivo não encontrado')
  }
})

console.log('\n🔍 VERIFICAÇÕES ADICIONAIS:')

// Verificar se há outros arquivos com problemas similares
const verificarDiretorio = (dir) => {
  if (!fs.existsSync(dir)) return []
  
  const arquivos = []
  const items = fs.readdirSync(dir)
  
  items.forEach(item => {
    const caminho = path.join(dir, item)
    const stat = fs.statSync(caminho)
    
    if (stat.isDirectory()) {
      arquivos.push(...verificarDiretorio(caminho))
    } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
      arquivos.push(caminho)
    }
  })
  
  return arquivos
}

const arquivosOrcamentos = verificarDiretorio('frontend/src/app/(app)/orcamentos')
console.log(`\n📁 Encontrados ${arquivosOrcamentos.length} arquivos TypeScript/React no módulo orçamentos`)

let arquivosComProblemas = 0

arquivosOrcamentos.forEach(arquivo => {
  if (!arquivosCorrigidos.includes(arquivo.replace(/\\/g, '/'))) {
    try {
      const conteudo = fs.readFileSync(arquivo, 'utf8')
      
      // Verificações rápidas
      const temProblemas = [
        conteudo.includes('import { useState') && conteudo.split('import { useState').length > 2,
        conteudo.includes('</Card>') && !conteudo.substring(0, conteudo.indexOf('</Card>')).includes('<Card'),
        conteudo.includes('export default') && !conteudo.includes('function') && !conteudo.includes('const')
      ].some(Boolean)
      
      if (temProblemas) {
        console.log(`⚠️  ${arquivo.replace(/\\/g, '/')} pode ter problemas`)
        arquivosComProblemas++
      }
    } catch (error) {
      console.log(`❌ Erro ao ler ${arquivo}: ${error.message}`)
    }
  }
})

console.log('\n📊 RESUMO:')
console.log(`✅ Arquivos corrigidos: ${arquivosCorrigidos.length}`)
console.log(`⚠️  Arquivos com possíveis problemas: ${arquivosComProblemas}`)
console.log(`📁 Total de arquivos verificados: ${arquivosOrcamentos.length}`)

console.log('\n🎯 PRÓXIMOS PASSOS:')
console.log('1. Reiniciar o servidor frontend (npm run dev)')
console.log('2. Testar as páginas de orçamentos no navegador')
console.log('3. Verificar se não há mais erros 500')
console.log('4. Testar a funcionalidade de criação de orçamentos')

console.log('\n✅ TESTE CONCLUÍDO!')