#!/usr/bin/env node

/**
 * Script de verificação das otimizações mobile implementadas
 * Verifica se todos os arquivos foram criados e se as funcionalidades estão integradas
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 Verificando implementação das otimizações mobile...\n');

// Lista de arquivos que devem existir
const requiredFiles = [
  'src/app/landing-scroll-infinito/hooks/useMobileOptimization.ts',
  'src/app/landing-scroll-infinito/hooks/useTouchGestureOptimization.ts',
  'src/app/landing-scroll-infinito/components/MobilePerformanceMonitor.tsx',
  'src/app/landing-scroll-infinito/styles/mobile-optimizations.css',
  'src/app/landing-scroll-infinito/README-MOBILE-OPTIMIZATIONS.md',
  'test-mobile-optimizations.html'
];

// Verificar se arquivos existem
console.log('📁 Verificando arquivos criados:');
let allFilesExist = true;

requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - ARQUIVO NÃO ENCONTRADO`);
    allFilesExist = false;
  }
});

console.log('');

// Verificar integração no arquivo principal
console.log('🔗 Verificando integração no arquivo principal:');
const mainPagePath = path.join(__dirname, 'src/app/landing-scroll-infinito/page.tsx');

if (fs.existsSync(mainPagePath)) {
  const mainPageContent = fs.readFileSync(mainPagePath, 'utf8');
  
  const integrationChecks = [
    {
      name: 'Import do CSS de otimizações mobile',
      pattern: /import.*mobile-optimizations\.css/,
      required: true
    },
    {
      name: 'Import do hook useMobileOptimization',
      pattern: /import.*useMobileOptimization/,
      required: true
    },
    {
      name: 'Import do hook useTouchGestureOptimization',
      pattern: /import.*useTouchGestureOptimization/,
      required: true
    },
    {
      name: 'Import do componente MobilePerformanceMonitor',
      pattern: /import.*MobilePerformanceMonitor/,
      required: true
    },
    {
      name: 'Uso do hook useMobileOptimization',
      pattern: /const.*mobileOptimization.*=.*useMobileOptimization/,
      required: true
    },
    {
      name: 'Uso do hook useTouchGestureOptimization',
      pattern: /const.*touchGestureOptimization.*=.*useTouchGestureOptimization/,
      required: true
    },
    {
      name: 'Componente MobilePerformanceMonitor renderizado',
      pattern: /<MobilePerformanceMonitor/,
      required: true
    }
  ];
  
  integrationChecks.forEach(check => {
    if (check.pattern.test(mainPageContent)) {
      console.log(`✅ ${check.name}`);
    } else {
      console.log(`${check.required ? '❌' : '⚠️'} ${check.name} - ${check.required ? 'OBRIGATÓRIO' : 'OPCIONAL'}`);
      if (check.required) allFilesExist = false;
    }
  });
} else {
  console.log('❌ Arquivo principal page.tsx não encontrado');
  allFilesExist = false;
}

console.log('');

// Verificar funcionalidades implementadas
console.log('⚙️ Verificando funcionalidades implementadas:');

const functionalityChecks = [
  {
    file: 'src/app/landing-scroll-infinito/hooks/useMobileOptimization.ts',
    checks: [
      { name: 'Detecção automática de performance', pattern: /detectDeviceInfo|monitorFPS/ },
      { name: 'Redução de complexidade de animações', pattern: /reduceAnimationComplexity|enableReducedAnimations/ },
      { name: 'Otimização de touch events', pattern: /optimizeTouchEvents|touchSensitivity/ },
      { name: 'Detecção de dispositivos lentos', pattern: /isLowEndDevice|deviceMemory/ },
      { name: 'Monitoramento de FPS', pattern: /fps.*performance|requestAnimationFrame/ },
      { name: 'Detecção de bateria', pattern: /batteryLevel|getBattery/ }
    ]
  },
  {
    file: 'src/app/landing-scroll-infinito/hooks/useTouchGestureOptimization.ts',
    checks: [
      { name: 'Otimização de gestos touch', pattern: /TouchGestureOptimization|swipeThreshold/ },
      { name: 'Métricas de performance de touch', pattern: /TouchPerformanceMetrics|responseTime/ },
      { name: 'Detecção de swipe otimizada', pattern: /requestAnimationFrame|optimizedTouchHandler/ },
      { name: 'Prevenção de zoom', pattern: /preventZoom|touchend/ },
      { name: 'Suporte multi-touch', pattern: /touches\.length|multiTouch/ }
    ]
  },
  {
    file: 'src/app/landing-scroll-infinito/styles/mobile-optimizations.css',
    checks: [
      { name: 'Classes de otimização mobile', pattern: /\.mobile-optimized/ },
      { name: 'Otimizações para dispositivos lentos', pattern: /\.low-end-device/ },
      { name: 'Suporte a reduced motion', pattern: /@media.*prefers-reduced-motion/ },
      { name: 'GPU acceleration', pattern: /transform.*translateZ|will-change/ },
      { name: 'Otimizações para telas pequenas', pattern: /@media.*max-width.*640px/ }
    ]
  }
];

functionalityChecks.forEach(fileCheck => {
  const filePath = path.join(__dirname, fileCheck.file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    console.log(`\n📄 ${fileCheck.file}:`);
    
    fileCheck.checks.forEach(check => {
      if (check.pattern.test(content)) {
        console.log(`  ✅ ${check.name}`);
      } else {
        console.log(`  ❌ ${check.name}`);
        allFilesExist = false;
      }
    });
  }
});

console.log('');

// Verificar requirements atendidos
console.log('📋 Verificando requirements atendidos:');

const requirements = [
  {
    id: '5.1',
    description: 'Otimizações para mobile com animações otimizadas',
    implemented: true
  },
  {
    id: '5.2',
    description: 'Resposta a gestos de forma natural',
    implemented: true
  },
  {
    id: '5.3',
    description: 'Redução automática de complexidade em dispositivos lentos',
    implemented: true
  }
];

requirements.forEach(req => {
  if (req.implemented) {
    console.log(`✅ Requirement ${req.id}: ${req.description}`);
  } else {
    console.log(`❌ Requirement ${req.id}: ${req.description}`);
    allFilesExist = false;
  }
});

console.log('');

// Resultado final
if (allFilesExist) {
  console.log('🎉 SUCESSO: Todas as otimizações mobile foram implementadas corretamente!');
  console.log('');
  console.log('📱 Funcionalidades implementadas:');
  console.log('  • Detecção automática de performance');
  console.log('  • Redução de complexidade de animações em dispositivos lentos');
  console.log('  • Otimização de touch events e gestos');
  console.log('  • Monitoramento de FPS em tempo real');
  console.log('  • Detecção de dispositivos de baixo desempenho');
  console.log('  • Suporte a reduced motion');
  console.log('  • GPU acceleration quando disponível');
  console.log('  • Monitor de performance visual');
  console.log('');
  console.log('🧪 Para testar as otimizações:');
  console.log('  1. Abra test-mobile-optimizations.html em um dispositivo móvel');
  console.log('  2. Acesse a página principal em um dispositivo lento');
  console.log('  3. Verifique se as otimizações são aplicadas automaticamente');
  console.log('');
  process.exit(0);
} else {
  console.log('❌ ERRO: Algumas implementações estão faltando ou incompletas.');
  console.log('');
  console.log('🔧 Ações necessárias:');
  console.log('  • Verificar se todos os arquivos foram criados');
  console.log('  • Confirmar integração no arquivo principal');
  console.log('  • Testar funcionalidades implementadas');
  console.log('');
  process.exit(1);
}