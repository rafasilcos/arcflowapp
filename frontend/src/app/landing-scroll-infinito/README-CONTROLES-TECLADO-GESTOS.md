# Controles de Teclado e Gestos - Scroll Infinito ArcFlow

## 📋 Visão Geral

Este documento descreve a implementação dos controles de teclado e gestos para o sistema de scroll infinito da landing page do ArcFlow. A funcionalidade permite navegação intuitiva através de múltiplas formas de interação.

## 🎮 Funcionalidades Implementadas

### ⌨️ Controles de Teclado

#### Navegação Básica
- **↑ / ↓** - Navegar para seção anterior/próxima
- **Page Up / Page Down** - Navegar para seção anterior/próxima
- **Espaço** - Ir para próxima seção
- **Home** - Ir para primeira seção (Hero)
- **End** - Ir para última seção (CTA)

#### Navegação Direta
- **1-8** - Ir diretamente para seção específica:
  - 1 = Hero
  - 2 = About
  - 3 = Features
  - 4 = Results
  - 5 = Testimonials
  - 6 = Pricing
  - 7 = FAQ
  - 8 = CTA

#### Características
- **Throttling**: Previne navegação muito rápida (300ms entre comandos)
- **Feedback Visual**: Indicadores de navegação ativa
- **Prevenção de Conflitos**: Desabilita durante transições automáticas

### 🖱️ Controles de Mouse

#### Scroll Inteligente
- **Scroll Suave**: Controle manual das transições
- **Scroll Rápido**: Navegação automática quando velocidade > 1000 unidades
- **Detecção de Velocidade**: Média móvel das últimas 5 medições
- **Aceleração Adaptativa**: Transições mais rápidas para scrolls rápidos

#### Métricas Monitoradas
- Velocidade instantânea e média
- Direção do scroll (up/down)
- Aceleração
- Histórico de velocidade

### 👆 Controles Touch (Mobile)

#### Gestos de Swipe
- **Swipe Vertical**: Navegação entre seções
- **Swipe para Cima**: Próxima seção
- **Swipe para Baixo**: Seção anterior
- **Swipe Rápido**: Navegação acelerada

#### Configurações
- **Sensibilidade**: 50px mínimo para ativar swipe
- **Velocidade Mínima**: 0.5 unidades para validar gesto
- **Detecção de Direção**: Prioriza movimento vertical
- **Prevenção de Scroll**: Bloqueia scroll nativo durante gestos

## 🔧 Implementação Técnica

### Hook Principal: `useKeyboardGestureControls`

```typescript
const keyboardGestureControls = useKeyboardGestureControls(
  goToSection,           // Função de navegação
  scrollState.currentSection, // Seção atual
  8                      // Total de seções
)
```

### Interfaces de Configuração

#### ControlsConfig
```typescript
interface ControlsConfig {
  enableKeyboard: boolean        // Ativar controles de teclado
  enableGestures: boolean        // Ativar gestos touch
  enableScrollVelocity: boolean  // Ativar controle por velocidade
  keyboardSensitivity: number    // Sensibilidade do teclado
  swipeSensitivity: number       // Distância mínima para swipe
  velocityThreshold: number      // Limite para scroll rápido
}
```

#### GestureState
```typescript
interface GestureState {
  isActive: boolean              // Gesto em andamento
  startX: number                 // Posição inicial X
  startY: number                 // Posição inicial Y
  currentX: number               // Posição atual X
  currentY: number               // Posição atual Y
  deltaX: number                 // Diferença X
  deltaY: number                 // Diferença Y
  velocity: number               // Velocidade do gesto
  direction: 'up' | 'down' | 'left' | 'right' | null
}
```

### Event Listeners

#### Teclado
```typescript
document.addEventListener('keydown', handleKeyboardNavigation)
```

#### Mouse
```typescript
document.addEventListener('wheel', handleScrollVelocity, { passive: false })
```

#### Touch
```typescript
document.addEventListener('touchstart', handleTouchStart, { passive: false })
document.addEventListener('touchmove', handleTouchMove, { passive: false })
document.addEventListener('touchend', handleTouchEnd, { passive: false })
```

## 🎯 Componente de Ajuda

### ControlsHelp Component
- **Exibição Automática**: Aparece após 3 segundos na primeira visita
- **Botão Flutuante**: Sempre acessível no canto inferior direito
- **Adaptativo**: Mostra controles relevantes para o dispositivo
- **Persistência**: Lembra se o usuário já viu a ajuda

### Funcionalidades
- Modal responsivo com overlay
- Instruções específicas por tipo de controle
- Diferenciação mobile/desktop
- Armazenamento local da preferência

## 📊 Debug e Monitoramento

### Painel de Debug
Informações em tempo real:
- Controles ativos (⌨️👆🖱️)
- Velocidade de scroll atual
- Estado do gesto ativo
- Direção do movimento
- Status de navegação

### Console Logs
```javascript
// Exemplos de logs gerados
🎮 Keyboard navigation: 2 → 3
👆 Swipe navigation: 1 → 2 (up)
🚀 Rapid scroll navigation: 0 → 1
🖱️ Scroll velocity: 1250 (rapid)
```

## 🧪 Testes

### Arquivo de Teste
`frontend/test-keyboard-gesture-controls.html`

#### Funcionalidades de Teste
- Indicadores visuais para cada tipo de controle
- Painel de debug em tempo real
- Detecção automática de dispositivo
- Feedback visual e sonoro
- Logs detalhados no console

#### Como Testar
1. Abrir o arquivo HTML no navegador
2. Usar diferentes tipos de controle
3. Observar indicadores mudarem de cor
4. Verificar logs no console (F12)
5. Testar em dispositivos móveis

## ⚙️ Configuração e Personalização

### Ajustar Sensibilidade
```typescript
keyboardGestureControls.updateConfig({
  swipeSensitivity: 75,        // Aumentar para gestos mais longos
  velocityThreshold: 800,      // Diminuir para scroll rápido mais sensível
  keyboardSensitivity: 1.5     // Aumentar responsividade do teclado
})
```

### Desabilitar Controles
```typescript
keyboardGestureControls.updateConfig({
  enableKeyboard: false,       // Desabilitar teclado
  enableGestures: false,       // Desabilitar gestos
  enableScrollVelocity: false  // Desabilitar controle por velocidade
})
```

## 🔍 Troubleshooting

### Problemas Comuns

#### Controles não respondem
- Verificar se `scrollState.isInitialized` é `true`
- Confirmar que não há conflitos com outros event listeners
- Checar se o elemento container está presente no DOM

#### Gestos não funcionam no mobile
- Verificar se `passive: false` está configurado
- Confirmar detecção de dispositivo móvel
- Testar em diferentes navegadores móveis

#### Scroll rápido não ativa
- Ajustar `velocityThreshold` para valor menor
- Verificar se o histórico de velocidade está sendo calculado
- Testar com diferentes tipos de mouse/trackpad

### Debug Avançado
```typescript
// Acessar informações de debug
console.log(keyboardGestureControls.debugInfo)
// Output: { lastKeyPress, velocityHistory, currentGesture, scrollVelocity }
```

## 📈 Performance

### Otimizações Implementadas
- **Throttling**: Previne execução excessiva de eventos
- **Cleanup**: Remove listeners automaticamente
- **Debouncing**: Suaviza cálculos de velocidade
- **Conditional Rendering**: Só ativa recursos necessários

### Métricas Monitoradas
- FPS durante navegação
- Tempo de resposta dos controles
- Uso de memória dos event listeners
- Precisão da detecção de gestos

## 🚀 Próximos Passos

### Melhorias Planejadas
- [ ] Controles por voz
- [ ] Gestos de pinch para zoom
- [ ] Atalhos customizáveis
- [ ] Modo acessibilidade avançado
- [ ] Integração com gamepads
- [ ] Controles por movimento (giroscópio)

### Otimizações Futuras
- [ ] Machine learning para padrões de uso
- [ ] Adaptação automática de sensibilidade
- [ ] Previsão de intenção do usuário
- [ ] Cache inteligente de preferências

---

**Desenvolvido para ArcFlow** - Sistema de scroll infinito com controles avançados para máxima usabilidade e acessibilidade.