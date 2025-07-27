// BRIEFINGS DESIGN DE INTERIORES - ARCFLOW
// Briefing especializado com 200 perguntas para projetos de design de interiores e decoração

import { BriefingCompleto } from '../../types/briefing';

export const BRIEFINGS_DESIGN: Record<string, BriefingCompleto> = {
  // DESIGN RESIDENCIAL ÚNICO
  'design-residencial-unico': {
    id: 'design-residencial-unico',
    tipologia: 'design',
    subtipo: 'residencial',
    padrao: 'unico',
    nome: 'Design de Interiores Residencial Completo',
    descricao: 'Briefing completo com 200 perguntas para projetos de design de interiores residencial',
    totalPerguntas: 200,
    tempoEstimado: '150-180 min',
    versao: '1.0',
    criadoEm: '2024-01-01',
    atualizadoEm: '2024-01-01',
    metadata: {
      tags: ['design', 'interiores', 'residencial', 'decoracao'],
      categoria: 'especializado',
      complexidade: 'muito_alta',
      publico: ['designers', 'arquitetos', 'decoradores']
    },
    secoes: [
      {
        id: 'identificacao-viabilidade',
        nome: '🏗️ Identificação e Viabilidade do Projeto',
        descricao: 'Dados básicos e viabilidade técnica do projeto de interiores',
        icon: '🏗️',
        obrigatoria: true,
        perguntas: [
          {
            id: 1,
            tipo: 'radio',
            pergunta: 'Que tipo de projeto de interiores deseja?',
            opcoes: ['Residencial', 'Comercial', 'Corporativo', 'Institucional'],
            obrigatoria: true
          },
          {
            id: 2,
            tipo: 'valor',
            pergunta: 'Qual seu investimento total disponível? (Incluindo projeto + execução + mobiliário)',
            obrigatoria: true,
            placeholder: 'R$ 200.000',
            formatacao: 'moeda'
          },
          {
            id: 3,
            tipo: 'radio',
            pergunta: 'Como será o financiamento?',
            opcoes: ['Recursos próprios', 'Financiamento', 'Parcelado'],
            obrigatoria: true
          },
          {
            id: 4,
            tipo: 'radio',
            pergunta: 'Qual a prioridade?',
            opcoes: ['Prazo', 'Custo', 'Qualidade', 'Sustentabilidade'],
            obrigatoria: true
          },
          {
            id: 5,
            tipo: 'radio',
            pergunta: 'Há projeto arquitetônico pronto?',
            opcoes: ['Sim', 'Em desenvolvimento', 'Reforma'],
            obrigatoria: true
          },
          {
            id: 6,
            tipo: 'radio',
            pergunta: 'Fase da obra principal:',
            opcoes: ['Projeto', 'Execução', 'Acabamento', 'Concluída'],
            obrigatoria: true
          },
          {
            id: 7,
            tipo: 'radio',
            pergunta: 'Situação do imóvel:',
            opcoes: ['Próprio', 'Alugado', 'Financiado'],
            obrigatoria: true
          },
          {
            id: 8,
            tipo: 'textarea',
            pergunta: 'Há restrições condominiais? (Horários/Ruído/Materiais)',
            obrigatoria: false,
            placeholder: 'Descreva as restrições conhecidas...'
          },
          {
            id: 9,
            tipo: 'radio',
            pergunta: 'Estrutura pode ser alterada?',
            opcoes: ['Sim', 'Limitações', 'Não'],
            obrigatoria: true
          },
          {
            id: 10,
            tipo: 'checkbox',
            pergunta: 'Instalações podem ser alteradas:',
            opcoes: ['Elétrica', 'Hidráulica', 'Ar condicionado', 'Nenhuma'],
            obrigatoria: true
          },
          {
            id: 11,
            tipo: 'textarea',
            pergunta: 'Pé-direito (altura/limitações):',
            obrigatoria: false,
            placeholder: 'Ex: 2,70m, sem limitações'
          },
          {
            id: 12,
            tipo: 'radio',
            pergunta: 'Acesso para móveis grandes:',
            opcoes: ['Elevador', 'Escada', 'Limitações'],
            obrigatoria: true
          },
          {
            id: 13,
            tipo: 'radio',
            pergunta: 'Prazo para entrega:',
            opcoes: ['Flexível', 'Rígido', 'Data específica'],
            obrigatoria: true
          },
          {
            id: 14,
            tipo: 'radio',
            pergunta: 'Moradia durante execução:',
            opcoes: ['Sim', 'Não', 'Parcial'],
            obrigatoria: true
          },
          {
            id: 15,
            tipo: 'radio',
            pergunta: 'Interferência com vizinhos:',
            opcoes: ['Permitida', 'Limitada', 'Não'],
            obrigatoria: true
          }
        ]
      },
      {
        id: 'perfil-usuarios',
        nome: '👥 Perfil dos Moradores/Usuários',
        descricao: 'Composição familiar e estilo de vida dos usuários',
        icon: '👥',
        obrigatoria: true,
        perguntas: [
          {
            id: 16,
            tipo: 'number',
            pergunta: 'Quantas pessoas moram/usarão o espaço?',
            obrigatoria: true,
            min: 1,
            max: 20,
            placeholder: '4'
          },
          {
            id: 17,
            tipo: 'textarea',
            pergunta: 'Idades dos moradores (faixas etárias):',
            obrigatoria: true,
            placeholder: 'Ex: 2 adultos (30-40 anos), 2 crianças (5-10 anos)'
          },
          {
            id: 18,
            tipo: 'radio',
            pergunta: 'Há crianças?',
            opcoes: ['Sim', 'Não'],
            obrigatoria: true
          },
          {
            id: 19,
            tipo: 'radio',
            pergunta: 'Há idosos?',
            opcoes: ['Sim', 'Não'],
            obrigatoria: true
          },
          {
            id: 20,
            tipo: 'radio',
            pergunta: 'Há pessoas com deficiência?',
            opcoes: ['Sim', 'Não'],
            obrigatoria: true
          },
          {
            id: 21,
            tipo: 'radio',
            pergunta: 'Animais domésticos:',
            opcoes: ['Cães', 'Gatos', 'Outros', 'Não'],
            obrigatoria: true
          },
          {
            id: 22,
            tipo: 'radio',
            pergunta: 'Frequência de visitas:',
            opcoes: ['Diária', 'Semanal', 'Esporádica'],
            obrigatoria: true
          },
          {
            id: 23,
            tipo: 'radio',
            pergunta: 'Recebe muitas pessoas?',
            opcoes: ['Sim', 'Não', 'Ocasiões especiais'],
            obrigatoria: true
          },
          {
            id: 24,
            tipo: 'radio',
            pergunta: 'Trabalha em casa?',
            opcoes: ['Sim', 'Não', 'Ocasionalmente'],
            obrigatoria: true
          },
          {
            id: 25,
            tipo: 'textarea',
            pergunta: 'Previsão de mudanças familiares:',
            obrigatoria: false,
            placeholder: 'Ex: Planejam ter filhos, filhos saindo de casa...'
          },
          {
            id: 26,
            tipo: 'radio',
            pergunta: 'Rotina diária:',
            opcoes: ['Matutina', 'Vespertina', 'Noturna', 'Mista'],
            obrigatoria: true
          },
          {
            id: 27,
            tipo: 'radio',
            pergunta: 'Tempo em casa:',
            opcoes: ['Muito', 'Médio', 'Pouco'],
            obrigatoria: true
          },
          {
            id: 28,
            tipo: 'checkbox',
            pergunta: 'Atividades preferidas em casa:',
            opcoes: ['Descanso', 'Entretenimento', 'Trabalho', 'Cozinhar', 'Exercícios'],
            obrigatoria: true
          },
          {
            id: 29,
            tipo: 'radio',
            pergunta: 'Gosta de cozinhar?',
            opcoes: ['Muito', 'Médio', 'Pouco', 'Não'],
            obrigatoria: true
          },
          {
            id: 30,
            tipo: 'radio',
            pergunta: 'Recebe para refeições?',
            opcoes: ['Frequentemente', 'Ocasionalmente', 'Raramente'],
            obrigatoria: true
          },
          {
            id: 31,
            tipo: 'radio',
            pergunta: 'Pratica exercícios em casa?',
            opcoes: ['Sim', 'Não'],
            obrigatoria: true
          },
          {
            id: 32,
            tipo: 'textarea',
            pergunta: 'Hobbies/coleções (quais/espaço necessário):',
            obrigatoria: false,
            placeholder: 'Ex: Leitura, música, coleção de arte...'
          },
          {
            id: 33,
            tipo: 'radio',
            pergunta: 'Leitura:',
            opcoes: ['Muito', 'Médio', 'Pouco'],
            obrigatoria: true
          },
          {
            id: 34,
            tipo: 'radio',
            pergunta: 'Música:',
            opcoes: ['Muito importante', 'Importante', 'Pouco importante'],
            obrigatoria: true
          },
          {
            id: 35,
            tipo: 'radio',
            pergunta: 'Tecnologia:',
            opcoes: ['Avançada', 'Básica', 'Mínima'],
            obrigatoria: true
          },
          {
            id: 36,
            tipo: 'radio',
            pergunta: 'Organização:',
            opcoes: ['Muito organizado', 'Médio', 'Desorganizado'],
            obrigatoria: true
          },
          {
            id: 37,
            tipo: 'radio',
            pergunta: 'Limpeza:',
            opcoes: ['Própria', 'Diarista', 'Empregada'],
            obrigatoria: true
          },
          {
            id: 38,
            tipo: 'radio',
            pergunta: 'Manutenção:',
            opcoes: ['Própria', 'Terceirizada'],
            obrigatoria: true
          },
          {
            id: 39,
            tipo: 'radio',
            pergunta: 'Privacidade:',
            opcoes: ['Muito importante', 'Importante', 'Pouco importante'],
            obrigatoria: true
          },
          {
            id: 40,
            tipo: 'radio',
            pergunta: 'Sustentabilidade:',
            opcoes: ['Prioridade', 'Importante', 'Indiferente'],
            obrigatoria: true
          }
        ]
      },
      {
        id: 'programa-ambientes',
        nome: '🏠 Programa de Necessidades por Ambiente',
        descricao: 'Necessidades específicas de cada ambiente',
        icon: '🏠',
        obrigatoria: true,
        perguntas: [
          {
            id: 41,
            tipo: 'radio',
            pergunta: 'Sala de estar - uso principal:',
            opcoes: ['TV', 'Conversa', 'Leitura', 'Múltiplo'],
            obrigatoria: true
          },
          {
            id: 42,
            tipo: 'number',
            pergunta: 'Sala de estar - capacidade usual de pessoas:',
            obrigatoria: true,
            min: 2,
            max: 20,
            placeholder: '6'
          },
          {
            id: 43,
            tipo: 'checkbox',
            pergunta: 'Sala de estar - móveis essenciais:',
            opcoes: ['Sofá', 'Poltronas', 'Mesa centro', 'Estante', 'TV', 'Piano'],
            obrigatoria: true
          },
          {
            id: 44,
            tipo: 'radio',
            pergunta: 'Sala de estar - estilo preferido:',
            opcoes: ['Formal', 'Casual', 'Misto'],
            obrigatoria: true
          },
          {
            id: 45,
            tipo: 'checkbox',
            pergunta: 'Sala de estar - iluminação:',
            opcoes: ['Natural', 'Artificial', 'Dimmer', 'Automação'],
            obrigatoria: true
          },
          {
            id: 46,
            tipo: 'radio',
            pergunta: 'Sala de estar - acústica:',
            opcoes: ['Muito importante', 'Importante', 'Não importante'],
            obrigatoria: true
          },
          {
            id: 47,
            tipo: 'checkbox',
            pergunta: 'Sala de estar - integração com outros ambientes:',
            opcoes: ['Cozinha', 'Jantar', 'Varanda', 'Separada'],
            obrigatoria: true
          },
          {
            id: 48,
            tipo: 'checkbox',
            pergunta: 'Sala de estar - elementos especiais:',
            opcoes: ['Lareira', 'Piano', 'Arte', 'Plantas', 'Nenhum'],
            obrigatoria: true
          },
          {
            id: 49,
            tipo: 'radio',
            pergunta: 'Sala de jantar - uso:',
            opcoes: ['Diário', 'Ocasional', 'Especial'],
            obrigatoria: true
          },
          {
            id: 50,
            tipo: 'number',
            pergunta: 'Sala de jantar - capacidade máxima:',
            obrigatoria: true,
            min: 2,
            max: 20,
            placeholder: '8'
          },
          {
            id: 51,
            tipo: 'radio',
            pergunta: 'Sala de jantar - estilo de refeições:',
            opcoes: ['Formal', 'Informal', 'Misto'],
            obrigatoria: true
          },
          {
            id: 52,
            tipo: 'checkbox',
            pergunta: 'Sala de jantar - móveis necessários:',
            opcoes: ['Mesa', 'Cadeiras', 'Buffet', 'Cristaleira', 'Aparador'],
            obrigatoria: true
          },
          {
            id: 53,
            tipo: 'checkbox',
            pergunta: 'Sala de jantar - iluminação:',
            opcoes: ['Lustre', 'Pendente', 'Spots', 'Dimmer'],
            obrigatoria: true
          },
          {
            id: 54,
            tipo: 'radio',
            pergunta: 'Sala de jantar - integração:',
            opcoes: ['Com cozinha', 'Com sala', 'Separada'],
            obrigatoria: true
          },
          {
            id: 55,
            tipo: 'radio',
            pergunta: 'Cozinha - uso principal:',
            opcoes: ['Cozinhar', 'Aquecer', 'Social', 'Gourmet'],
            obrigatoria: true
          },
          {
            id: 56,
            tipo: 'radio',
            pergunta: 'Cozinha - frequência de uso:',
            opcoes: ['Diária', 'Ocasional', 'Raramente'],
            obrigatoria: true
          },
          {
            id: 57,
            tipo: 'radio',
            pergunta: 'Cozinha - quantas pessoas cozinham:',
            opcoes: ['1', '2', 'Mais'],
            obrigatoria: true
          },
          {
            id: 58,
            tipo: 'radio',
            pergunta: 'Cozinha - estilo:',
            opcoes: ['Americana', 'Integrada', 'Fechada'],
            obrigatoria: true
          },
          {
            id: 59,
            tipo: 'radio',
            pergunta: 'Cozinha - eletrodomésticos:',
            opcoes: ['Básicos', 'Completos', 'Profissionais'],
            obrigatoria: true
          },
          {
            id: 60,
            tipo: 'radio',
            pergunta: 'Cozinha - ilha/bancada:',
            opcoes: ['Sim', 'Não'],
            obrigatoria: true
          },
          {
            id: 61,
            tipo: 'radio',
            pergunta: 'Cozinha - despensa:',
            opcoes: ['Necessária', 'Desejável', 'Não'],
            obrigatoria: true
          },
          {
            id: 62,
            tipo: 'radio',
            pergunta: 'Cozinha - área de apoio:',
            opcoes: ['Copa', 'Lavanderia integrada', 'Separada'],
            obrigatoria: true
          },
          {
            id: 63,
            tipo: 'number',
            pergunta: 'Quantos quartos?',
            obrigatoria: true,
            min: 1,
            max: 10,
            placeholder: '3'
          },
          {
            id: 64,
            tipo: 'radio',
            pergunta: 'Quarto principal - tamanho da cama:',
            opcoes: ['Solteiro', 'Casal', 'Queen', 'King'],
            obrigatoria: true
          },
          {
            id: 65,
            tipo: 'radio',
            pergunta: 'Quarto principal - closet/guarda-roupa:',
            opcoes: ['Closet', 'Armário embutido', 'Móvel'],
            obrigatoria: true
          },
          {
            id: 66,
            tipo: 'radio',
            pergunta: 'Quarto principal - home office:',
            opcoes: ['Sim', 'Não', 'Ocasional'],
            obrigatoria: true
          },
          {
            id: 67,
            tipo: 'radio',
            pergunta: 'Quarto principal - TV:',
            opcoes: ['Sim', 'Não'],
            obrigatoria: true
          },
          {
            id: 68,
            tipo: 'radio',
            pergunta: 'Quarto principal - banheiro integrado:',
            opcoes: ['Sim', 'Não'],
            obrigatoria: true
          },
          {
            id: 69,
            tipo: 'radio',
            pergunta: 'Quarto principal - varanda/sacada:',
            opcoes: ['Sim', 'Não'],
            obrigatoria: true
          },
          {
            id: 70,
            tipo: 'radio',
            pergunta: 'Quartos de hóspedes - frequência de uso:',
            opcoes: ['Frequente', 'Ocasional', 'Dupla função'],
            obrigatoria: false
          },
          {
            id: 71,
            tipo: 'number',
            pergunta: 'Quantos banheiros?',
            obrigatoria: true,
            min: 1,
            max: 10,
            placeholder: '2'
          },
          {
            id: 72,
            tipo: 'radio',
            pergunta: 'Banheiro - banheira:',
            opcoes: ['Sim', 'Não', 'Hidromassagem'],
            obrigatoria: true
          },
          {
            id: 73,
            tipo: 'radio',
            pergunta: 'Banheiro - box:',
            opcoes: ['Simples', 'Duplo', 'Walk-in'],
            obrigatoria: true
          },
          {
            id: 74,
            tipo: 'radio',
            pergunta: 'Banheiro - bancada:',
            opcoes: ['Simples', 'Dupla'],
            obrigatoria: true
          },
          {
            id: 75,
            tipo: 'radio',
            pergunta: 'Banheiro - acessórios:',
            opcoes: ['Básicos', 'Completos', 'Luxo'],
            obrigatoria: true
          }
        ]
      },
      {
        id: 'conceito-estilo',
        nome: '🎨 Conceito e Estilo',
        descricao: 'Definição do estilo, cores e atmosfera desejada',
        icon: '🎨',
        obrigatoria: true,
        perguntas: [
          {
            id: 76,
            tipo: 'radio',
            pergunta: 'Estilo preferido:',
            opcoes: ['Moderno', 'Clássico', 'Contemporâneo', 'Rústico', 'Industrial', 'Minimalista'],
            obrigatoria: true
          },
          {
            id: 77,
            tipo: 'textarea',
            pergunta: 'Referências visuais (descreva ambientes admirados):',
            obrigatoria: false,
            placeholder: 'Descreva ambientes que admira ou anexe fotos...'
          },
          {
            id: 78,
            tipo: 'radio',
            pergunta: 'Cores preferidas:',
            opcoes: ['Neutras', 'Vibrantes', 'Escuras', 'Claras'],
            obrigatoria: true
          },
          {
            id: 79,
            tipo: 'textarea',
            pergunta: 'Cores que não gosta (quais/por quê):',
            obrigatoria: false,
            placeholder: 'Ex: Evito vermelho porque acho muito forte...'
          },
          {
            id: 80,
            tipo: 'radio',
            pergunta: 'Padrões:',
            opcoes: ['Lisos', 'Estampados', 'Texturas', 'Misto'],
            obrigatoria: true
          },
          {
            id: 81,
            tipo: 'checkbox',
            pergunta: 'Materiais preferidos:',
            opcoes: ['Madeira', 'Metal', 'Vidro', 'Pedra', 'Tecido', 'Couro'],
            obrigatoria: true
          },
          {
            id: 82,
            tipo: 'radio',
            pergunta: 'Acabamentos:',
            opcoes: ['Fosco', 'Brilhante', 'Texturizado', 'Misto'],
            obrigatoria: true
          },
          {
            id: 83,
            tipo: 'radio',
            pergunta: 'Móveis:',
            opcoes: ['Novos', 'Antigos', 'Misto', 'Sob medida'],
            obrigatoria: true
          },
          {
            id: 84,
            tipo: 'radio',
            pergunta: 'Objetos decorativos:',
            opcoes: ['Muitos', 'Poucos', 'Específicos'],
            obrigatoria: true
          },
          {
            id: 85,
            tipo: 'radio',
            pergunta: 'Arte:',
            opcoes: ['Muito importante', 'Importante', 'Pouco importante'],
            obrigatoria: true
          },
          {
            id: 86,
            tipo: 'radio',
            pergunta: 'Plantas:',
            opcoes: ['Muitas', 'Algumas', 'Poucas', 'Nenhuma'],
            obrigatoria: true
          },
          {
            id: 87,
            tipo: 'radio',
            pergunta: 'Espelhos:',
            opcoes: ['Gosta', 'Indiferente', 'Evita'],
            obrigatoria: true
          },
          {
            id: 88,
            tipo: 'radio',
            pergunta: 'Tapetes:',
            opcoes: ['Sim', 'Não'],
            obrigatoria: true
          },
          {
            id: 89,
            tipo: 'radio',
            pergunta: 'Almofadas:',
            opcoes: ['Muitas', 'Poucas'],
            obrigatoria: true
          },
          {
            id: 90,
            tipo: 'radio',
            pergunta: 'Cortinas/persianas:',
            opcoes: ['Cortinas', 'Persianas', 'Ambas', 'Nenhuma'],
            obrigatoria: true
          },
          {
            id: 91,
            tipo: 'radio',
            pergunta: 'Atmosfera desejada:',
            opcoes: ['Aconchegante', 'Sofisticada', 'Descontraída', 'Elegante'],
            obrigatoria: true
          },
          {
            id: 92,
            tipo: 'radio',
            pergunta: 'Sensação ao entrar:',
            opcoes: ['Calma', 'Energia', 'Acolhimento', 'Imponência'],
            obrigatoria: true
          },
          {
            id: 93,
            tipo: 'radio',
            pergunta: 'Iluminação geral:',
            opcoes: ['Clara', 'Meia-luz', 'Variável', 'Automática'],
            obrigatoria: true
          },
          {
            id: 94,
            tipo: 'radio',
            pergunta: 'Temperatura:',
            opcoes: ['Fresca', 'Morna', 'Variável'],
            obrigatoria: true
          },
          {
            id: 95,
            tipo: 'radio',
            pergunta: 'Aromas:',
            opcoes: ['Importantes', 'Indiferentes', 'Evitar'],
            obrigatoria: true
          },
          {
            id: 96,
            tipo: 'radio',
            pergunta: 'Ruídos:',
            opcoes: ['Silêncio', 'Som ambiente', 'Música', 'Indiferente'],
            obrigatoria: true
          },
          {
            id: 97,
            tipo: 'radio',
            pergunta: 'Privacidade visual:',
            opcoes: ['Muito importante', 'Importante', 'Pouco importante'],
            obrigatoria: true
          },
          {
            id: 98,
            tipo: 'radio',
            pergunta: 'Conexão com exterior:',
            opcoes: ['Muito importante', 'Importante', 'Pouco importante'],
            obrigatoria: true
          },
          {
            id: 99,
            tipo: 'radio',
            pergunta: 'Formalidade:',
            opcoes: ['Formal', 'Informal', 'Misto'],
            obrigatoria: true
          },
          {
            id: 100,
            tipo: 'radio',
            pergunta: 'Personalidade do espaço:',
            opcoes: ['Única', 'Clássica', 'Tendência'],
            obrigatoria: true
          }
        ]
      }
    ]
  },

  // DESIGN COMERCIAL ÚNICO
  'design-comercial-unico': {
    id: 'design-comercial-unico',
    tipologia: 'design',
    subtipo: 'comercial',
    padrao: 'unico',
    nome: 'Design de Interiores Comercial Completo',
    descricao: 'Briefing completo para projetos de design de interiores comercial',
    totalPerguntas: 180,
    tempoEstimado: '130-160 min',
    versao: '1.0',
    criadoEm: '2024-01-01',
    atualizadoEm: '2024-01-01',
    metadata: {
      tags: ['design', 'interiores', 'comercial', 'branding'],
      categoria: 'especializado',
      complexidade: 'alta',
      publico: ['designers', 'empresarios', 'arquitetos']
    },
    secoes: []
  },

  // DESIGN CORPORATIVO ÚNICO
  'design-corporativo-unico': {
    id: 'design-corporativo-unico',
    tipologia: 'design',
    subtipo: 'corporativo',
    padrao: 'unico',
    nome: 'Design de Interiores Corporativo Completo',
    descricao: 'Briefing completo para projetos de design de interiores corporativo',
    totalPerguntas: 170,
    tempoEstimado: '120-150 min',
    versao: '1.0',
    criadoEm: '2024-01-01',
    atualizadoEm: '2024-01-01',
    metadata: {
      tags: ['design', 'interiores', 'corporativo', 'produtividade'],
      categoria: 'especializado',
      complexidade: 'alta',
      publico: ['designers', 'empresas', 'rh']
    },
    secoes: []
  },

  // DESIGN HOSPITALITY ÚNICO
  'design-hospitality-unico': {
    id: 'design-hospitality-unico',
    tipologia: 'design',
    subtipo: 'hospitality',
    padrao: 'unico',
    nome: 'Design de Interiores Hospitality Completo',
    descricao: 'Briefing completo para projetos de design de interiores para hotéis e hospitalidade',
    totalPerguntas: 160,
    tempoEstimado: '110-140 min',
    versao: '1.0',
    criadoEm: '2024-01-01',
    atualizadoEm: '2024-01-01',
    metadata: {
      tags: ['design', 'interiores', 'hospitality', 'hotel'],
      categoria: 'especializado',
      complexidade: 'alta',
      publico: ['designers', 'hoteleiros', 'arquitetos']
    },
    secoes: []
  }
};

// Função auxiliar para obter briefings de design
export function obterBriefingsDesign() {
  return Object.values(BRIEFINGS_DESIGN);
}

// Função para obter briefing específico de design
export function obterBriefingDesign(subtipo: string, padrao: string) {
  const chave = `design-${subtipo}-${padrao}`;
  return BRIEFINGS_DESIGN[chave] || null;
} 