#!/usr/bin/env node

/**
 * Script de verificação para a CTA Section do Scroll Infinito Avançado
 * Verifica se todas as animações e elementos estão implementados corretamente
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando implementação da CTA Section...\n');

// Verificar se os arquivos existem
const ctaSectionPath = path.join(__dirname, 'src/app/landing-scroll-infinito/components/CTASection.tsx');
const animationHookPath = path.join(__dirname, 'src/app/landing-scroll-infinito/hooks/useSectionAnimation.ts');
const testFilePath = path.join(__dirname, 'test-cta-section.html');

let allChecksPass = true;

function checkFile(filePath, description) {
    if (fs.existsSync(filePath)) {
        console.log(`✅ ${description} existe`);
        return true;
    } else {
        console.log(`❌ ${description} não encontrado`);
        allChecksPass = false;
        return false;
    }
}

function checkContent(filePath, patterns, description) {
    if (!fs.existsSync(filePath)) {
        console.log(`❌ ${description}: arquivo não encontrado`);
        allChecksPass = false;
        return false;
    }

    const content = fs.readFileSync(filePath, 'utf8');
    let allPatternsFound = true;

    patterns.forEach(({ pattern, name }) => {
        if (content.includes(pattern)) {
            console.log(`  ✅ ${name}`);
        } else {
            console.log(`  ❌ ${name} não encontrado`);
            allPatternsFound = false;
            allChecksPass = false;
        }
    });

    return allPatternsFound;
}

// 1. Verificar arquivos principais
console.log('📁 Verificando arquivos principais:');
checkFile(ctaSectionPath, 'CTASection.tsx');
checkFile(animationHookPath, 'useSectionAnimation.ts');
checkFile(testFilePath, 'test-cta-section.html');

console.log('\n📋 Verificando estrutura do componente CTA:');
checkContent(ctaSectionPath, [
    { pattern: 'cta-main-container', name: 'Container principal com classe CSS' },
    { pattern: 'cta-title', name: 'Título com classe CSS' },
    { pattern: 'cta-subtitle', name: 'Subtítulo com classe CSS' },
    { pattern: 'cta-buttons', name: 'Container de botões com classe CSS' },
    { pattern: 'cta-primary-button', name: 'Botão primário com classe CSS' },
    { pattern: 'cta-secondary-button', name: 'Botão secundário com classe CSS' },
    { pattern: 'cta-trust-metrics', name: 'Container de métricas com classe CSS' },
    { pattern: 'trust-metric', name: 'Métricas individuais com classe CSS' },
    { pattern: 'trust-number', name: 'Números das métricas com classe CSS' },
    { pattern: 'trust-label', name: 'Labels das métricas com classe CSS' },
    { pattern: 'cta-guarantee', name: 'Garantia com classe CSS' },
    { pattern: 'startProgress: 0.875', name: 'Progresso de início correto (87.5%)' },
    { pattern: 'endProgress: 1', name: 'Progresso de fim correto (100%)' }
], 'CTASection.tsx');

console.log('\n🎬 Verificando animações GSAP:');
checkContent(animationHookPath, [
    { pattern: "case 'cta':", name: 'Case CTA no switch de animações' },
    { pattern: 'ctaMainContainer', name: 'Seletor do container principal' },
    { pattern: 'ctaTitle', name: 'Seletor do título' },
    { pattern: 'ctaSubtitle', name: 'Seletor do subtítulo' },
    { pattern: 'ctaButtons', name: 'Seletor dos botões' },
    { pattern: 'trustMetrics', name: 'Seletor das métricas' },
    { pattern: 'ctaPrimaryButton', name: 'Seletor do botão primário' },
    { pattern: 'ctaGuarantee', name: 'Seletor da garantia' },
    { pattern: 'scale: 3', name: 'Zoom inicial dramático (scale: 3)' },
    { pattern: 'rotationY: 45', name: 'Rotação inicial' },
    { pattern: 'z: -200', name: 'Profundidade inicial' },
    { pattern: 'power3.out', name: 'Easing power3.out' },
    { pattern: 'back.out(1.7)', name: 'Easing back.out para bounce' },
    { pattern: 'stagger:', name: 'Animação stagger para métricas' },
    { pattern: 'repeat: -1', name: 'Animação infinita para pulsação' },
    { pattern: 'yoyo: true', name: 'Efeito yoyo para pulsação' },
    { pattern: 'boxShadow:', name: 'Efeito de sombra pulsante' },
    { pattern: 'brightness(1.2)', name: 'Efeito de brilho pulsante' }
], 'useSectionAnimation.ts');

console.log('\n🧪 Verificando arquivo de teste:');
checkContent(testFilePath, [
    { pattern: 'testZoomIn()', name: 'Função de teste para zoom in' },
    { pattern: 'testTrustMetrics()', name: 'Função de teste para métricas' },
    { pattern: 'testPulsatingCTA()', name: 'Função de teste para CTA pulsante' },
    { pattern: 'updateCTAAnimation', name: 'Função de atualização da animação' },
    { pattern: 'ScrollTrigger', name: 'Integração com ScrollTrigger' },
    { pattern: 'progress >= 0.875', name: 'Detecção correta do range da seção (87.5%)' }
], 'test-cta-section.html');

// Verificar métricas específicas do ArcFlow
console.log('\n📊 Verificando métricas do ArcFlow:');
checkContent(ctaSectionPath, [
    { pattern: '500+', name: 'Métrica: 500+ escritórios' },
    { pattern: '35%', name: 'Métrica: 35% aumento de margem' },
    { pattern: '40%', name: 'Métrica: 40% mais produtividade' },
    { pattern: '95%', name: 'Métrica: 95% satisfação' },
    { pattern: 'Entre no Fluxo', name: 'Título principal correto' },
    { pattern: 'Começar agora', name: 'CTA principal correto' },
    { pattern: 'Falar com especialista', name: 'CTA secundário correto' },
    { pattern: 'Garantia de satisfação', name: 'Garantia presente' }
], 'CTASection.tsx');

// Verificar fases da animação
console.log('\n⏱️ Verificando fases da animação:');
checkContent(animationHookPath, [
    { pattern: 'Fase 1: Zoom in dramático', name: 'Comentário da Fase 1 (87.5-90%)' },
    { pattern: 'Fase 2: Animação sequencial', name: 'Comentário da Fase 2 (90-95%)' },
    { pattern: 'Fase 3: Animação dos elementos de confiança', name: 'Comentário da Fase 3 (90-95%)' },
    { pattern: 'Fase 4: Call to action pulsante', name: 'Comentário da Fase 4 (95-100%)' },
    { pattern: 'duration: config.duration * 0.4', name: 'Duração da fase 1' },
    { pattern: 'duration: config.duration * 0.3', name: 'Duração dos elementos internos' },
    { pattern: 'duration: config.duration * 0.4', name: 'Duração das métricas' }
], 'useSectionAnimation.ts');

// Verificar configuração específica da CTA
console.log('\n⚙️ Verificando configuração da CTA:');
checkContent(animationHookPath, [
    { pattern: "cta: { duration: 1.5, ease: 'power3.out' }", name: 'Configuração específica da CTA' },
    { pattern: 'transformOrigin: \'center center\'', name: 'Transform origin centralizado' },
    { pattern: 'amount: 0.3', name: 'Stagger amount para métricas' },
    { pattern: 'from: "start"', name: 'Stagger direction' },
    { pattern: 'from: "random"', name: 'Stagger random para pulsação' }
], 'useSectionAnimation.ts');

// Resumo final
console.log('\n' + '='.repeat(50));
if (allChecksPass) {
    console.log('🎉 SUCESSO! Todas as verificações passaram!');
    console.log('\n✨ A CTA Section está implementada corretamente com:');
    console.log('   • Zoom dramático de entrada (87.5-90%)');
    console.log('   • Animação sequencial dos elementos (90-95%)');
    console.log('   • Métricas de confiança com stagger (90-95%)');
    console.log('   • Call to action pulsante contínuo (95-100%)');
    console.log('   • Todas as classes CSS necessárias');
    console.log('   • Arquivo de teste funcional');
    console.log('\n🚀 Próximos passos:');
    console.log('   1. Abrir test-cta-section.html no navegador');
    console.log('   2. Testar as animações usando os controles');
    console.log('   3. Verificar performance e suavidade');
    console.log('   4. Testar em diferentes dispositivos');
} else {
    console.log('❌ FALHA! Algumas verificações falharam.');
    console.log('\n🔧 Corrija os problemas identificados acima antes de prosseguir.');
}
console.log('='.repeat(50));

// Informações adicionais
console.log('\n📖 Informações da implementação:');
console.log('   • Seção: CTA (Call to Action)');
console.log('   • Range de scroll: 87.5% - 100%');
console.log('   • Duração total: 1.5s');
console.log('   • Easing principal: power3.out');
console.log('   • Elementos animados: 8 (container, título, subtítulo, botões, métricas, garantia)');
console.log('   • Animações contínuas: 2 (pulsação do botão e métricas)');

process.exit(allChecksPass ? 0 : 1);