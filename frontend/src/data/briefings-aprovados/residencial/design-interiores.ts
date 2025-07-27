import { BriefingCompleto } from '../../../types/briefing';

export const designInteriores: BriefingCompleto = {
  id: 'residencial-design-interiores-completo',
  tipologia: 'residencial',
  subtipo: 'design-interiores',
  padrao: 'profissional',
  nome: 'Design de Interiores Residencial - Completo',
  descricao: 'Briefing completo para projetos de design de interiores residencial com 200 perguntas especializadas',
  totalPerguntas: 200,
  tempoEstimado: '150-180 minutos',
  versao: '1.0',
  criadoEm: '2024-12-30',
  atualizadoEm: '2024-12-30',
  metadata: {
    tags: ['design-interiores', 'decoracao', 'residencial', 'funcionalidade', 'ergonomia', 'tecnologia', 'sustentabilidade'],
    categoria: 'residencial',
    complexidade: 'muito_alta',
    publico: ['designers-interiores', 'decoradores', 'arquitetos', 'proprietarios']
  },
  
  secoes: [
    {
      id: 'identificacao-viabilidade',
      nome: '📋 Identificação e Viabilidade do Projeto',
      descricao: 'Dados básicos do projeto e análise de viabilidade técnica e financeira',
      icon: '📋',
      obrigatoria: true,
      perguntas: [
        { id: 1, tipo: 'select', pergunta: 'Que tipo de projeto de interiores deseja?', opcoes: ['Residencial completo', 'Residencial parcial', 'Comercial', 'Corporativo', 'Institucional'], obrigatoria: true },
        { id: 2, tipo: 'text', pergunta: 'Qual seu investimento total disponível?', obrigatoria: true, placeholder: 'Ex: R$ 150.000,00 (incluindo projeto + execução + mobiliário)' },
        { id: 3, tipo: 'select', pergunta: 'Como será o financiamento?', opcoes: ['Recursos próprios', 'Financiamento bancário', 'Parcelado com fornecedores', 'Financiamento misto'], obrigatoria: true },
        { id: 4, tipo: 'select', pergunta: 'Qual a prioridade principal?', opcoes: ['Prazo de entrega', 'Controle de custos', 'Qualidade máxima', 'Sustentabilidade'], obrigatoria: true },
        { id: 5, tipo: 'select', pergunta: 'Há projeto arquitetônico pronto?', opcoes: ['Sim, aprovado e atualizado', 'Em desenvolvimento', 'Projeto de reforma', 'Não há projeto'], obrigatoria: true },
        { id: 6, tipo: 'select', pergunta: 'Fase da obra principal:', opcoes: ['Apenas projeto', 'Execução estrutural', 'Fase de acabamento', 'Obra concluída'], obrigatoria: true },
        { id: 7, tipo: 'select', pergunta: 'Situação do imóvel:', opcoes: ['Próprio quitado', 'Alugado', 'Financiado', 'Em processo de compra'], obrigatoria: true },
        { id: 8, tipo: 'textarea', pergunta: 'Há restrições condominiais?', obrigatoria: false, placeholder: 'Descreva restrições de horários, ruído, materiais, etc.' },
        { id: 9, tipo: 'select', pergunta: 'Estrutura pode ser alterada?', opcoes: ['Sim, totalmente', 'Sim, com limitações específicas', 'Não pode ser alterada'], obrigatoria: true },
        { id: 10, tipo: 'checkbox', pergunta: 'Instalações que podem ser alteradas:', opcoes: ['Instalações elétricas', 'Instalações hidráulicas', 'Sistema de ar condicionado', 'Instalações de gás', 'Nenhuma alteração possível'], obrigatoria: true },
        { id: 11, tipo: 'text', pergunta: 'Pé-direito e limitações estruturais:', obrigatoria: true, placeholder: 'Ex: 2,70m - vigas aparentes na sala' },
        { id: 12, tipo: 'textarea', pergunta: 'Condições de acesso para móveis grandes:', obrigatoria: true, placeholder: 'Descreva limitações de elevador, escada, portões' },
        { id: 13, tipo: 'select', pergunta: 'Flexibilidade do prazo de entrega:', opcoes: ['Prazo flexível', 'Prazo rígido definido', 'Data específica obrigatória', 'Projeto urgente'], obrigatoria: true },
        { id: 14, tipo: 'select', pergunta: 'Moradia durante a execução:', opcoes: ['Sim, morando normalmente', 'Não, mudança temporária', 'Parcialmente, por ambientes'], obrigatoria: true },
        { id: 15, tipo: 'select', pergunta: 'Nível de interferência com vizinhos:', opcoes: ['Interferência normal permitida', 'Limitada por horários específicos', 'Mínima interferência necessária', 'Não pode haver interferência'], obrigatoria: true }
      ]
    },
    {
      id: 'perfil-usuarios',
      nome: '👥 Perfil dos Moradores/Usuários',
      descricao: 'Composição familiar, estilo de vida e necessidades específicas dos usuários',
      icon: '👥',
      obrigatoria: true,
      perguntas: [
        // Composição Familiar (10 perguntas)
        { id: 16, tipo: 'number', pergunta: 'Quantas pessoas moram/usarão o espaço?', obrigatoria: true, placeholder: 'Número de moradores' },
        { id: 17, tipo: 'textarea', pergunta: 'Idades dos moradores:', obrigatoria: true, placeholder: 'Ex: 2 adultos (30-40 anos), 2 crianças (5-10 anos)' },
        { id: 18, tipo: 'textarea', pergunta: 'Há crianças? Quais idades e necessidades especiais?', obrigatoria: false, placeholder: 'Idades específicas e cuidados necessários' },
        { id: 19, tipo: 'textarea', pergunta: 'Há idosos? Que limitações ou necessidades de acessibilidade?', obrigatoria: false, placeholder: 'Necessidades específicas de acessibilidade' },
        { id: 20, tipo: 'textarea', pergunta: 'Há pessoas com deficiência? Que adaptações são necessárias?', obrigatoria: false, placeholder: 'Tipo de deficiência e adaptações requeridas' },
        { id: 21, tipo: 'textarea', pergunta: 'Animais domésticos - tipo, quantidade e necessidades:', obrigatoria: false, placeholder: 'Ex: 1 cão de grande porte, precisa de área específica' },
        { id: 22, tipo: 'select', pergunta: 'Frequência de visitas:', opcoes: ['Diariamente', 'Semanalmente', 'Esporadicamente', 'Raramente'], obrigatoria: true },
        { id: 23, tipo: 'textarea', pergunta: 'Costuma receber muitas pessoas? Em que ocasiões?', obrigatoria: true, placeholder: 'Frequência e tipos de eventos sociais' },
        { id: 24, tipo: 'textarea', pergunta: 'Alguém trabalha em casa? Quantas pessoas e com que frequência?', obrigatoria: true, placeholder: 'Necessidades de home office' },
        { id: 25, tipo: 'textarea', pergunta: 'Há previsão de mudanças familiares?', obrigatoria: false, placeholder: 'Crescimento da família, mudanças planejadas' },
        
        // Estilo de Vida (15 perguntas)
        { id: 26, tipo: 'select', pergunta: 'Rotina diária predominante:', opcoes: ['Matutina', 'Vespertina', 'Noturna', 'Rotina mista/variável'], obrigatoria: true },
        { id: 27, tipo: 'select', pergunta: 'Tempo passado em casa:', opcoes: ['Muito tempo (home office/aposentado)', 'Tempo médio', 'Pouco tempo (só à noite/fins de semana)'], obrigatoria: true },
        { id: 28, tipo: 'checkbox', pergunta: 'Atividades preferidas em casa:', opcoes: ['Descanso e relaxamento', 'Entretenimento (TV, jogos)', 'Trabalho/estudo', 'Exercícios físicos', 'Hobbies e criatividade', 'Culinária'], obrigatoria: true },
        { id: 29, tipo: 'select', pergunta: 'Gosta de cozinhar?', opcoes: ['Muito - cozinha é fundamental', 'Médio - cozinha ocasionalmente', 'Pouco - apenas básico', 'Não cozinha'], obrigatoria: true },
        { id: 30, tipo: 'select', pergunta: 'Recebe pessoas para refeições?', opcoes: ['Frequentemente', 'Ocasionalmente', 'Raramente', 'Nunca'], obrigatoria: true },
        { id: 31, tipo: 'textarea', pergunta: 'Pratica exercícios em casa? Que tipo?', obrigatoria: false, placeholder: 'Yoga, musculação, cardio, pilates, etc.' },
        { id: 32, tipo: 'textarea', pergunta: 'Hobbies/coleções - quais e que espaço necessitam?', obrigatoria: false, placeholder: 'Leitura, música, arte, coleções, artesanato' },
        { id: 33, tipo: 'textarea', pergunta: 'Hábito de leitura - frequência e local preferido:', obrigatoria: false, placeholder: 'Muito/médio/pouco e onde gosta de ler' },
        { id: 34, tipo: 'textarea', pergunta: 'Importância da música - que sistema de som deseja?', obrigatoria: false, placeholder: 'Som ambiente, Hi-Fi, sistema integrado' },
        { id: 35, tipo: 'select', pergunta: 'Nível de afinidade com tecnologia:', opcoes: ['Tecnologia avançada', 'Tecnologia básica', 'Mínima tecnologia'], obrigatoria: true },
        { id: 36, tipo: 'select', pergunta: 'Nível de organização pessoal:', opcoes: ['Muito organizado', 'Moderadamente organizado', 'Pouco organizado'], obrigatoria: true },
        { id: 37, tipo: 'select', pergunta: 'Como é feita a limpeza da casa?', opcoes: ['Limpeza própria', 'Diarista regular', 'Empregada doméstica'], obrigatoria: true },
        { id: 38, tipo: 'select', pergunta: 'Como é feita a manutenção da casa?', opcoes: ['Manutenção própria', 'Serviços terceirizados'], obrigatoria: true },
        { id: 39, tipo: 'select', pergunta: 'Importância da privacidade?', opcoes: ['Muito importante', 'Importante', 'Pouco importante'], obrigatoria: true },
        { id: 40, tipo: 'select', pergunta: 'Importância da sustentabilidade:', opcoes: ['Prioridade máxima', 'Importante', 'Indiferente'], obrigatoria: true }
      ]
    },
    {
      id: 'programa-ambientes',
      nome: '🏠 Programa de Necessidades por Ambiente',
      descricao: 'Definição detalhada das necessidades específicas de cada ambiente',
      icon: '🏠',
      obrigatoria: true,
      perguntas: [
        // Sala de Estar/Living (8 perguntas)
        { id: 41, tipo: 'checkbox', pergunta: 'Uso principal da sala de estar:', opcoes: ['Assistir TV', 'Conversas e socialização', 'Leitura', 'Descanso', 'Múltiplas atividades'], obrigatoria: true },
        { id: 42, tipo: 'text', pergunta: 'Capacidade da sala - pessoas usual e máximo:', obrigatoria: true, placeholder: 'Ex: 4 pessoas usual, 8 máximo' },
        { id: 43, tipo: 'checkbox', pergunta: 'Móveis essenciais para a sala:', opcoes: ['Sofá grande', 'Poltronas', 'Mesa de centro', 'Estante/estanteria', 'Painel TV', 'Mesa lateral'], obrigatoria: true },
        { id: 44, tipo: 'select', pergunta: 'Estilo preferido para a sala:', opcoes: ['Formal e elegante', 'Casual e descontraído', 'Misto conforme ocasião'], obrigatoria: true },
        { id: 45, tipo: 'checkbox', pergunta: 'Iluminação desejada na sala:', opcoes: ['Máxima luz natural', 'Iluminação artificial variável', 'Sistema dimmer', 'Automação de iluminação'], obrigatoria: true },
        { id: 46, tipo: 'select', pergunta: 'Importância da acústica na sala:', opcoes: ['Muito importante', 'Importante', 'Pouco importante'], obrigatoria: true },
        { id: 47, tipo: 'checkbox', pergunta: 'Integração da sala com outros ambientes:', opcoes: ['Integrada com cozinha', 'Integrada com sala de jantar', 'Integrada com varanda', 'Ambiente separado'], obrigatoria: true },
        { id: 48, tipo: 'checkbox', pergunta: 'Elementos especiais desejados na sala:', opcoes: ['Lareira', 'Piano/instrumento musical', 'Obras de arte', 'Plantas ornamentais', 'Estante de livros'], obrigatoria: false },
        
        // Sala de Jantar (6 perguntas)  
        { id: 49, tipo: 'select', pergunta: 'Uso da sala de jantar:', opcoes: ['Uso diário', 'Apenas ocasiões especiais', 'Uso misto'], obrigatoria: true },
        { id: 50, tipo: 'text', pergunta: 'Capacidade da mesa - pessoas usual e máximo:', obrigatoria: true, placeholder: 'Ex: 4 pessoas usual, 8 máximo' },
        { id: 51, tipo: 'select', pergunta: 'Estilo de refeições predominante:', opcoes: ['Refeições formais', 'Refeições informais', 'Estilo misto'], obrigatoria: true },
        { id: 52, tipo: 'checkbox', pergunta: 'Móveis necessários na sala de jantar:', opcoes: ['Mesa de jantar', 'Cadeiras', 'Buffet', 'Cristaleira', 'Aparador', 'Banco/banqueta'], obrigatoria: true },
        { id: 53, tipo: 'checkbox', pergunta: 'Iluminação preferida na sala de jantar:', opcoes: ['Lustre central', 'Pendentes sobre mesa', 'Spots direcionais', 'Sistema dimmer'], obrigatoria: true },
        { id: 54, tipo: 'select', pergunta: 'Integração da sala de jantar:', opcoes: ['Integrada com cozinha', 'Integrada com sala de estar', 'Ambiente separado/privativo'], obrigatoria: true },
        
        // Cozinha (8 perguntas)
        { id: 55, tipo: 'checkbox', pergunta: 'Uso principal da cozinha:', opcoes: ['Cozinhar elaboradamente', 'Preparo básico de alimentos', 'Socialização (cozinha gourmet)', 'Apenas aquecer comida'], obrigatoria: true },
        { id: 56, tipo: 'select', pergunta: 'Frequência de uso da cozinha:', opcoes: ['Uso diário intenso', 'Uso diário moderado', 'Uso ocasional', 'Uso raro'], obrigatoria: true },
        { id: 57, tipo: 'select', pergunta: 'Quantas pessoas cozinham simultaneamente?', opcoes: ['1 pessoa', '2 pessoas', 'Mais de 2 pessoas'], obrigatoria: true },
        { id: 58, tipo: 'select', pergunta: 'Estilo de cozinha preferido:', opcoes: ['Cozinha americana (integrada)', 'Cozinha semi-integrada', 'Cozinha fechada/separada'], obrigatoria: true },
        { id: 59, tipo: 'checkbox', pergunta: 'Eletrodomésticos desejados:', opcoes: ['Geladeira duplex', 'Fogão/cooktop', 'Forno elétrico', 'Micro-ondas', 'Lava-louças', 'Freezer', 'Adega climatizada', 'Purificador de água'], obrigatoria: true },
        { id: 60, tipo: 'select', pergunta: 'Ilha/bancada na cozinha:', opcoes: ['Sim, ilha central', 'Sim, península', 'Não necessário'], obrigatoria: true },
        { id: 61, tipo: 'select', pergunta: 'Necessidade de despensa:', opcoes: ['Despensa grande necessária', 'Despensa pequena desejável', 'Não necessário'], obrigatoria: true },
        { id: 62, tipo: 'checkbox', pergunta: 'Área de apoio à cozinha:', opcoes: ['Copa/café da manhã', 'Lavanderia integrada', 'Área de serviço separada', 'Área gourmet'], obrigatoria: false },
        
        // Quartos (8 perguntas)
        { id: 63, tipo: 'text', pergunta: 'Quantos quartos e função de cada um:', obrigatoria: true, placeholder: 'Ex: 1 suíte master, 2 quartos filhos, 1 escritório' },
        { id: 64, tipo: 'select', pergunta: 'Tamanho da cama do quarto principal:', opcoes: ['Cama de solteiro', 'Cama de casal', 'Cama king size'], obrigatoria: true },
        { id: 65, tipo: 'select', pergunta: 'Armazenamento de roupas no quarto principal:', opcoes: ['Closet amplo', 'Armário embutido', 'Guarda-roupa móvel'], obrigatoria: true },
        { id: 66, tipo: 'select', pergunta: 'Home office no quarto:', opcoes: ['Sim, escritório completo', 'Não necessário', 'Apenas área de estudos'], obrigatoria: true },
        { id: 67, tipo: 'select', pergunta: 'TV no quarto:', opcoes: ['Sim, TV grande', 'Sim, TV média', 'Não'], obrigatoria: true },
        { id: 68, tipo: 'select', pergunta: 'Banheiro do quarto principal:', opcoes: ['Banheiro integrado (suíte)', 'Banheiro separado', 'Não há banheiro privativo'], obrigatoria: true },
        { id: 69, tipo: 'textarea', pergunta: 'Varanda/sacada no quarto - como seria usada?', obrigatoria: false, placeholder: 'Leitura, plantas, relaxamento' },
        { id: 70, tipo: 'textarea', pergunta: 'Quartos de hóspedes - frequência de uso e dupla função:', obrigatoria: false, placeholder: 'Frequência de visitas, uso como escritório' },
        
        // Banheiros (5 perguntas)
        { id: 71, tipo: 'text', pergunta: 'Quantos banheiros e tipo de cada um:', obrigatoria: true, placeholder: 'Ex: 1 suíte master, 1 social, 1 lavabo' },
        { id: 72, tipo: 'select', pergunta: 'Banheira no banheiro principal:', opcoes: ['Sim, banheira simples', 'Sim, banheira hidromassagem', 'Não desejo banheira'], obrigatoria: true },
        { id: 73, tipo: 'select', pergunta: 'Tipo de box preferido:', opcoes: ['Box simples', 'Box duplo', 'Walk-in shower (sem box)'], obrigatoria: true },
        { id: 74, tipo: 'select', pergunta: 'Bancada do banheiro:', opcoes: ['Bancada simples', 'Bancada dupla', 'Material específico preferido'], obrigatoria: true },
        { id: 75, tipo: 'select', pergunta: 'Nível de acessórios no banheiro:', opcoes: ['Acessórios básicos essenciais', 'Acessórios completos', 'Acessórios de luxo'], obrigatoria: true }
      ]
    },
    {
      id: 'conceito-estilo',
      nome: '🎨 Conceito e Estilo',
      descricao: 'Definição do estilo, referências visuais, atmosfera e sensações desejadas',
      icon: '🎨',
      obrigatoria: true,
      perguntas: [
        // Estilo e Referências (15 perguntas)
        { id: 76, tipo: 'select', pergunta: 'Estilo preferido:', opcoes: ['Moderno', 'Contemporâneo', 'Clássico', 'Rústico', 'Industrial', 'Minimalista', 'Eclético', 'Escandinavo'], obrigatoria: true },
        { id: 77, tipo: 'textarea', pergunta: 'Referências visuais que admira:', obrigatoria: true, placeholder: 'Descreva ambientes, revistas, sites ou imagens que admira' },
        { id: 78, tipo: 'checkbox', pergunta: 'Cores preferidas:', opcoes: ['Tons neutros', 'Cores vibrantes', 'Tons terrosos', 'Cores escuras', 'Cores claras', 'Tons pastéis'], obrigatoria: true },
        { id: 79, tipo: 'textarea', pergunta: 'Cores que não gosta:', obrigatoria: false, placeholder: 'Cores que deseja evitar e por quê' },
        { id: 80, tipo: 'select', pergunta: 'Padrões e texturas:', opcoes: ['Superfícies lisas', 'Estampados discretos', 'Estampados marcantes', 'Texturas acentuadas', 'Misto'], obrigatoria: true },
        { id: 81, tipo: 'checkbox', pergunta: 'Materiais preferidos:', opcoes: ['Madeira natural', 'Metal', 'Vidro', 'Pedra natural', 'Couro', 'Tecidos naturais', 'Concreto'], obrigatoria: true },
        { id: 82, tipo: 'select', pergunta: 'Acabamentos preferidos:', opcoes: ['Fosco', 'Brilhante', 'Texturizado', 'Misto conforme ambiente'], obrigatoria: true },
        { id: 83, tipo: 'select', pergunta: 'Móveis - preferência:', opcoes: ['Móveis novos', 'Móveis antigos/vintage', 'Misto', 'Móveis sob medida'], obrigatoria: true },
        { id: 84, tipo: 'select', pergunta: 'Quantidade de objetos decorativos:', opcoes: ['Muitos objetos', 'Poucos objetos selecionados', 'Mínimo de objetos', 'Conforme o ambiente'], obrigatoria: true },
        { id: 85, tipo: 'select', pergunta: 'Importância da arte:', opcoes: ['Muito importante', 'Importante', 'Pouco importante', 'Não importante'], obrigatoria: true },
        { id: 86, tipo: 'select', pergunta: 'Plantas na decoração:', opcoes: ['Muitas plantas', 'Algumas plantas', 'Poucas plantas', 'Nenhuma planta'], obrigatoria: true },
        { id: 87, tipo: 'select', pergunta: 'Espelhos na decoração:', opcoes: ['Gosta e quer vários', 'Indiferente', 'Prefere evitar'], obrigatoria: true },
        { id: 88, tipo: 'select', pergunta: 'Tapetes:', opcoes: ['Sim, tapetes grandes', 'Sim, tapetes pequenos', 'Não gosta de tapetes'], obrigatoria: true },
        { id: 89, tipo: 'select', pergunta: 'Almofadas:', opcoes: ['Muitas almofadas', 'Poucas almofadas', 'Cores neutras', 'Cores vibrantes'], obrigatoria: true },
        { id: 90, tipo: 'select', pergunta: 'Cortinas/persianas:', opcoes: ['Cortinas de tecido', 'Persianas', 'Ambas conforme ambiente', 'Mínimo de cortinas'], obrigatoria: true },
        
        // Atmosfera e Sensações (10 perguntas)
        { id: 91, tipo: 'select', pergunta: 'Atmosfera desejada:', opcoes: ['Aconchegante', 'Sofisticada', 'Descontraída', 'Elegante', 'Energizante'], obrigatoria: true },
        { id: 92, tipo: 'select', pergunta: 'Sensação ao entrar em casa:', opcoes: ['Calma e relaxamento', 'Energia e motivação', 'Acolhimento familiar', 'Imponência e elegância'], obrigatoria: true },
        { id: 93, tipo: 'select', pergunta: 'Iluminação geral preferida:', opcoes: ['Ambientes bem claros', 'Meia-luz aconchegante', 'Variável conforme momento', 'Iluminação automática'], obrigatoria: true },
        { id: 94, tipo: 'select', pergunta: 'Sensação térmica:', opcoes: ['Ambientes mais frescos', 'Ambientes mais aquecidos', 'Temperatura variável'], obrigatoria: true },
        { id: 95, tipo: 'select', pergunta: 'Aromas:', opcoes: ['Aromas são importantes', 'Indiferente', 'Prefere sem aromas'], obrigatoria: true },
        { id: 96, tipo: 'select', pergunta: 'Ambiente sonoro:', opcoes: ['Silêncio total', 'Som ambiente suave', 'Música sempre', 'Conforme atividade'], obrigatoria: true },
        { id: 97, tipo: 'select', pergunta: 'Privacidade visual:', opcoes: ['Muito importante', 'Importante', 'Pouco importante'], obrigatoria: true },
        { id: 98, tipo: 'select', pergunta: 'Conexão com exterior:', opcoes: ['Muito importante', 'Importante', 'Pouco importante'], obrigatoria: true },
        { id: 99, tipo: 'select', pergunta: 'Nível de formalidade:', opcoes: ['Formal', 'Informal', 'Misto conforme ambiente'], obrigatoria: true },
        { id: 100, tipo: 'select', pergunta: 'Personalidade do espaço:', opcoes: ['Único e personalizado', 'Clássico e atemporal', 'Seguindo tendências atuais'], obrigatoria: true }
      ]
    },
    {
      id: 'funcionalidade-ergonomia',
      nome: '🔄 Funcionalidade e Ergonomia',
      descricao: 'Circulação, fluxos, armazenamento, organização e acessibilidade',
      icon: '🔄',
      obrigatoria: true,
      perguntas: [
        // Circulação e Fluxos (10 perguntas)
        { id: 101, tipo: 'select', pergunta: 'Fluxo de circulação preferido:', opcoes: ['Fluxo linear', 'Fluxo circular', 'Circulação livre'], obrigatoria: true },
        { id: 102, tipo: 'select', pergunta: 'Áreas de passagem:', opcoes: ['Corredores amplos', 'Corredores compactos', 'Sem corredores definidos'], obrigatoria: true },
        { id: 103, tipo: 'select', pergunta: 'Privacidade entre ambientes:', opcoes: ['Separação total', 'Separação parcial', 'Integração completa'], obrigatoria: true },
        { id: 104, tipo: 'select', pergunta: 'Acesso independente:', opcoes: ['Necessário', 'Desejável', 'Não necessário'], obrigatoria: true },
        { id: 105, tipo: 'select', pergunta: 'Circulação noturna:', opcoes: ['Iluminação automática', 'Iluminação manual', 'Iluminação permanente'], obrigatoria: true },
        { id: 106, tipo: 'select', pergunta: 'Necessidades de acessibilidade:', opcoes: ['Acessibilidade universal', 'Acessibilidade básica', 'Não necessário'], obrigatoria: true },
        { id: 107, tipo: 'select', pergunta: 'Importância da segurança:', opcoes: ['Muito importante', 'Importante', 'Básica'], obrigatoria: true },
        { id: 108, tipo: 'select', pergunta: 'Controle de acesso:', opcoes: ['Sim, em áreas específicas', 'Não necessário'], obrigatoria: true },
        { id: 109, tipo: 'select', pergunta: 'Fluxo de serviços:', opcoes: ['Separado da circulação social', 'Integrado'], obrigatoria: true },
        { id: 110, tipo: 'select', pergunta: 'Expansão futura:', opcoes: ['Prevista', 'Possível', 'Não planejada'], obrigatoria: true },
        
        // Armazenamento e Organização (15 perguntas)
        { id: 111, tipo: 'select', pergunta: 'Necessidade de armazenamento:', opcoes: ['Muito alta', 'Alta', 'Média', 'Baixa'], obrigatoria: true },
        { id: 112, tipo: 'checkbox', pergunta: 'Tipo de objetos para armazenar:', opcoes: ['Roupas', 'Livros', 'Eletrônicos', 'Documentos', 'Objetos decorativos', 'Utensílios domésticos'], obrigatoria: true },
        { id: 113, tipo: 'select', pergunta: 'Armários embutidos:', opcoes: ['Preferência por embutidos', 'Indiferente', 'Prefere móveis soltos'], obrigatoria: true },
        { id: 114, tipo: 'select', pergunta: 'Móveis sob medida:', opcoes: ['Sim, para todos os ambientes', 'Sim, para alguns ambientes', 'Não necessário'], obrigatoria: true },
        { id: 115, tipo: 'select', pergunta: 'Organização visual:', opcoes: ['Tudo escondido', 'Alguns objetos à vista', 'Tudo à vista organizadamente'], obrigatoria: true },
        { id: 116, tipo: 'select', pergunta: 'Facilidade de acesso:', opcoes: ['Muito importante', 'Importante', 'Pouco importante'], obrigatoria: true },
        { id: 117, tipo: 'select', pergunta: 'Armazenamento sazonal:', opcoes: ['Muito necessário', 'Necessário', 'Pouco necessário'], obrigatoria: true },
        { id: 118, tipo: 'textarea', pergunta: 'Coleções para expor:', obrigatoria: false, placeholder: 'Descreva coleções que gostaria de expor' },
        { id: 119, tipo: 'select', pergunta: 'Arquivo de documentos:', opcoes: ['Arquivo completo', 'Arquivo básico', 'Arquivo digital'], obrigatoria: true },
        { id: 120, tipo: 'select', pergunta: 'Armazenamento de limpeza:', opcoes: ['Área específica', 'Distribuído pelos ambientes', 'Mínimo necessário'], obrigatoria: true },
        { id: 121, tipo: 'select', pergunta: 'Manutenção - ferramentas:', opcoes: ['Kit completo', 'Kit básico', 'Terceirizado'], obrigatoria: true },
        { id: 122, tipo: 'select', pergunta: 'Despensa/alimentos:', opcoes: ['Despensa grande', 'Despensa pequena', 'Apenas geladeira'], obrigatoria: true },
        { id: 123, tipo: 'select', pergunta: 'Roupas de cama e banho:', opcoes: ['Estoque grande', 'Estoque médio', 'Estoque mínimo'], obrigatoria: true },
        { id: 124, tipo: 'textarea', pergunta: 'Brinquedos (se houver crianças):', obrigatoria: false, placeholder: 'Quantidade e tipo de organização' },
        { id: 125, tipo: 'textarea', pergunta: 'Equipamentos especiais:', obrigatoria: false, placeholder: 'Esporte, hobby, trabalho' }
      ]
    },
    {
      id: 'tecnologia-automacao',
      nome: '📱 Tecnologia e Automação',
      descricao: 'Sistemas integrados, automação residencial, equipamentos e conectividade',
      icon: '📱',
      obrigatoria: false,
      perguntas: [
        // Sistemas Integrados (10 perguntas)
        { id: 126, tipo: 'select', pergunta: 'Nível de automação residencial:', opcoes: ['Automação completa', 'Automação básica', 'Não desejo automação'], obrigatoria: true },
        { id: 127, tipo: 'select', pergunta: 'Iluminação inteligente:', opcoes: ['Sim, em toda casa', 'Sim, em áreas específicas', 'Não necessário'], obrigatoria: true },
        { id: 128, tipo: 'select', pergunta: 'Climatização automática:', opcoes: ['Sistema automático', 'Controle manual', 'Sistema misto'], obrigatoria: true },
        { id: 129, tipo: 'select', pergunta: 'Som ambiente integrado:', opcoes: ['Som integrado', 'Som portátil', 'Não necessário'], obrigatoria: true },
        { id: 130, tipo: 'select', pergunta: 'Segurança eletrônica:', opcoes: ['Sistema completo', 'Sistema básico', 'Não necessário'], obrigatoria: true },
        { id: 131, tipo: 'select', pergunta: 'Controle por aplicativo:', opcoes: ['Muito importante', 'Desejável', 'Não necessário'], obrigatoria: true },
        { id: 132, tipo: 'select', pergunta: 'Assistente virtual:', opcoes: ['Sim, integrado', 'Sim, portátil', 'Não desejo'], obrigatoria: true },
        { id: 133, tipo: 'select', pergunta: 'Câmeras internas:', opcoes: ['Sim, em várias áreas', 'Sim, em poucas áreas', 'Não desejo'], obrigatoria: true },
        { id: 134, tipo: 'checkbox', pergunta: 'Sensores desejados:', opcoes: ['Sensores de movimento', 'Sensores de presença', 'Sensores de luminosidade', 'Sensores de temperatura'], obrigatoria: false },
        { id: 135, tipo: 'select', pergunta: 'Integração entre sistemas:', opcoes: ['Integração total', 'Integração parcial', 'Sistemas independentes'], obrigatoria: true },
        
        // Equipamentos e Conectividade (10 perguntas)
        { id: 136, tipo: 'text', pergunta: 'TV principal - tamanho e localização:', obrigatoria: true, placeholder: 'Ex: 65 polegadas na sala' },
        { id: 137, tipo: 'text', pergunta: 'TVs secundárias - quantas e onde:', obrigatoria: false, placeholder: 'Quantidade e localizações' },
        { id: 138, tipo: 'select', pergunta: 'Sistema de som:', opcoes: ['Sistema profissional', 'Sistema básico', 'Som portátil'], obrigatoria: true },
        { id: 139, tipo: 'select', pergunta: 'Home theater:', opcoes: ['Sim, sala dedicada', 'Sim, integrado à sala', 'Não necessário'], obrigatoria: true },
        { id: 140, tipo: 'select', pergunta: 'Cobertura Wi-Fi:', opcoes: ['Cobertura total', 'Cobertura básica'], obrigatoria: true },
        { id: 141, tipo: 'select', pergunta: 'Pontos de energia:', opcoes: ['Muitos pontos', 'Pontos suficientes', 'Pontos básicos'], obrigatoria: true },
        { id: 142, tipo: 'select', pergunta: 'Carregadores integrados:', opcoes: ['USB integrado nos móveis', 'Carregadores móveis'], obrigatoria: true },
        { id: 143, tipo: 'select', pergunta: 'Computador fixo:', opcoes: ['Sim, mesa específica', 'Não necessário'], obrigatoria: true },
        { id: 144, tipo: 'select', pergunta: 'Impressora:', opcoes: ['Sim, área específica', 'Não necessário'], obrigatoria: true },
        { id: 145, tipo: 'select', pergunta: 'Backup de energia:', opcoes: ['No-break', 'Gerador', 'Não necessário'], obrigatoria: true }
      ]
    },
    {
      id: 'sustentabilidade-eficiencia',
      nome: '🌱 Sustentabilidade e Eficiência',
      descricao: 'Materiais eco-friendly, eficiência energética e práticas sustentáveis',
      icon: '🌱',
      obrigatoria: false,
      perguntas: [
        // Materiais Sustentáveis (8 perguntas)
        { id: 146, tipo: 'select', pergunta: 'Materiais eco-friendly:', opcoes: ['Prioridade máxima', 'Importante', 'Indiferente'], obrigatoria: true },
        { id: 147, tipo: 'select', pergunta: 'Madeira certificada:', opcoes: ['Essencial', 'Preferível', 'Indiferente'], obrigatoria: true },
        { id: 148, tipo: 'select', pergunta: 'Tintas ecológicas:', opcoes: ['Sim, em toda casa', 'Sim, em áreas específicas', 'Não necessário'], obrigatoria: true },
        { id: 149, tipo: 'select', pergunta: 'Tecidos naturais:', opcoes: ['Preferência por naturais', 'Misto', 'Sintéticos'], obrigatoria: true },
        { id: 150, tipo: 'select', pergunta: 'Móveis reciclados/vintage:', opcoes: ['Sim, alguns móveis', 'Não, móveis novos'], obrigatoria: true },
        { id: 151, tipo: 'select', pergunta: 'Produtos locais:', opcoes: ['Prioridade', 'Preferência', 'Indiferente'], obrigatoria: true },
        { id: 152, tipo: 'select', pergunta: 'Certificações ambientais:', opcoes: ['Importantes', 'Desejáveis', 'Não necessárias'], obrigatoria: true },
        { id: 153, tipo: 'select', pergunta: 'Durabilidade vs. custo:', opcoes: ['Prioridade para durabilidade', 'Custo-benefício', 'Menor custo'], obrigatoria: true },
        
        // Eficiência Energética (7 perguntas)
        { id: 154, tipo: 'select', pergunta: 'Iluminação LED:', opcoes: ['Total', 'Parcial', 'Indiferente'], obrigatoria: true },
        { id: 155, tipo: 'select', pergunta: 'Aproveitamento da luz natural:', opcoes: ['Máximo', 'Médio', 'Pouco'], obrigatoria: true },
        { id: 156, tipo: 'select', pergunta: 'Isolamento térmico:', opcoes: ['Muito importante', 'Importante', 'Básico'], obrigatoria: true },
        { id: 157, tipo: 'select', pergunta: 'Ventilação natural:', opcoes: ['Prioridade', 'Complementar', 'Não importante'], obrigatoria: true },
        { id: 158, tipo: 'select', pergunta: 'Eletrodomésticos eficientes:', opcoes: ['Selo A++', 'Selo A+', 'Básicos'], obrigatoria: true },
        { id: 159, tipo: 'select', pergunta: 'Energia solar:', opcoes: ['Muito interessado', 'Interessado futuro', 'Não interessado'], obrigatoria: true },
        { id: 160, tipo: 'select', pergunta: 'Consumo consciente:', opcoes: ['Muito importante', 'Importante', 'Não prioritário'], obrigatoria: true }
      ]
    },
    {
      id: 'orcamento-investimento',
      nome: '💰 Orçamento e Investimento',
      descricao: 'Distribuição do orçamento, formas de pagamento e prioridades de investimento',
      icon: '💰',
      obrigatoria: true,
      perguntas: [
        // Distribuição do Orçamento (10 perguntas)
        { id: 161, tipo: 'text', pergunta: 'Projeto de interiores (% do orçamento total):', obrigatoria: true, placeholder: 'Ex: 15%' },
        { id: 162, tipo: 'text', pergunta: 'Móveis planejados (% do orçamento):', obrigatoria: true, placeholder: 'Ex: 35%' },
        { id: 163, tipo: 'text', pergunta: 'Móveis soltos (% do orçamento):', obrigatoria: true, placeholder: 'Ex: 25%' },
        { id: 164, tipo: 'text', pergunta: 'Decoração (% do orçamento):', obrigatoria: true, placeholder: 'Ex: 10%' },
        { id: 165, tipo: 'text', pergunta: 'Iluminação (% do orçamento):', obrigatoria: true, placeholder: 'Ex: 8%' },
        { id: 166, tipo: 'text', pergunta: 'Tecidos/cortinas (% do orçamento):', obrigatoria: true, placeholder: 'Ex: 5%' },
        { id: 167, tipo: 'text', pergunta: 'Arte/objetos (% do orçamento):', obrigatoria: true, placeholder: 'Ex: 3%' },
        { id: 168, tipo: 'text', pergunta: 'Plantas/paisagismo interno (% do orçamento):', obrigatoria: true, placeholder: 'Ex: 2%' },
        { id: 169, tipo: 'text', pergunta: 'Tecnologia/automação (% do orçamento):', obrigatoria: true, placeholder: 'Ex: 7%' },
        { id: 170, tipo: 'text', pergunta: 'Reserva para imprevistos (% do orçamento):', obrigatoria: true, placeholder: 'Ex: 10%' },
        
        // Forma de Pagamento (10 perguntas)
        { id: 171, tipo: 'select', pergunta: 'Pagamento do projeto:', opcoes: ['À vista', 'Parcelado'], obrigatoria: true },
        { id: 172, tipo: 'select', pergunta: 'Pagamento da execução:', opcoes: ['À vista', 'Por etapas'], obrigatoria: true },
        { id: 173, tipo: 'select', pergunta: 'Compra de móveis:', opcoes: ['À vista', 'Financiado', 'Parcelado'], obrigatoria: true },
        { id: 174, tipo: 'select', pergunta: 'Prioridade de investimento:', opcoes: ['Móveis', 'Decoração', 'Tecnologia', 'Equilibrado'], obrigatoria: true },
        { id: 175, tipo: 'select', pergunta: 'Compras futuras:', opcoes: ['Tudo agora', 'Planejadas', 'Conforme possibilidade'], obrigatoria: true },
        { id: 176, tipo: 'select', pergunta: 'Peças de investimento:', opcoes: ['Arte', 'Móveis especiais', 'Não planejo'], obrigatoria: true },
        { id: 177, tipo: 'select', pergunta: 'Estratégia de economia:', opcoes: ['DIY', 'Pesquisa de preços', 'Promoções', 'Não necessário'], obrigatoria: true },
        { id: 178, tipo: 'select', pergunta: 'Flexibilidade do orçamento:', opcoes: ['Rígido', 'Flexível 10%', 'Flexível 20%'], obrigatoria: true },
        { id: 179, tipo: 'select', pergunta: 'Forma de financiamento:', opcoes: ['Recursos próprios', 'Cartão de crédito', 'Crediário', 'Financiamento bancário'], obrigatoria: true },
        { id: 180, tipo: 'select', pergunta: 'Cronograma de pagamentos:', opcoes: ['Pagamento rápido', 'Pagamento normal', 'Pagamento estendido'], obrigatoria: true }
      ]
    },
    {
      id: 'cronograma-execucao',
      nome: '📅 Cronograma e Execução',
      descricao: 'Prazos, etapas, gestão do projeto e comunicação',
      icon: '📅',
      obrigatoria: true,
      perguntas: [
        // Prazos e Etapas (8 perguntas)
        { id: 181, tipo: 'text', pergunta: 'Data desejada para início do projeto:', obrigatoria: true, placeholder: 'DD/MM/AAAA' },
        { id: 182, tipo: 'text', pergunta: 'Data desejada para início da execução:', obrigatoria: true, placeholder: 'DD/MM/AAAA' },
        { id: 183, tipo: 'text', pergunta: 'Data limite para conclusão:', obrigatoria: true, placeholder: 'DD/MM/AAAA' },
        { id: 184, tipo: 'select', pergunta: 'Execução em etapas:', opcoes: ['Sim, por ambiente', 'Sim, por tipo de serviço', 'Não, tudo junto'], obrigatoria: true },
        { id: 185, tipo: 'textarea', pergunta: 'Ordem de prioridade dos ambientes:', obrigatoria: true, placeholder: 'Ordem de execução preferida' },
        { id: 186, tipo: 'select', pergunta: 'Tolerância à interferência na rotina:', opcoes: ['Mínima', 'Aceitável', 'Não importa'], obrigatoria: true },
        { id: 187, tipo: 'select', pergunta: 'Possibilidade de mudança temporária:', opcoes: ['Possível', 'Difícil', 'Impossível'], obrigatoria: true },
        { id: 188, tipo: 'select', pergunta: 'Flexibilidade de prazo:', opcoes: ['Prazo rígido', 'Prazo flexível', 'Muito flexível'], obrigatoria: true },
        
        // Gestão e Comunicação (7 perguntas)
        { id: 189, tipo: 'select', pergunta: 'Frequência de reuniões:', opcoes: ['Semanal', 'Quinzenal', 'Mensal'], obrigatoria: true },
        { id: 190, tipo: 'select', pergunta: 'Forma de comunicação preferida:', opcoes: ['WhatsApp', 'E-mail', 'Presencial', 'Videochamada'], obrigatoria: true },
        { id: 191, tipo: 'select', pergunta: 'Acompanhamento da execução:', opcoes: ['Diário', 'Semanal', 'Por etapa'], obrigatoria: true },
        { id: 192, tipo: 'select', pergunta: 'Processo de tomada de decisões:', opcoes: ['Decisão rápida', 'Decisão consultiva', 'Decisão em comitê'], obrigatoria: true },
        { id: 193, tipo: 'select', pergunta: 'Alterações durante execução:', opcoes: ['Aceita alterações', 'Alterações limitadas', 'Não aceita alterações'], obrigatoria: true },
        { id: 194, tipo: 'select', pergunta: 'Relatórios de progresso:', opcoes: ['Detalhados', 'Resumidos', 'Não necessários'], obrigatoria: true },
        { id: 195, tipo: 'select', pergunta: 'Registro fotográfico:', opcoes: ['Muito importante', 'Desejável', 'Não necessário'], obrigatoria: true }
      ]
    },
    {
      id: 'observacoes-finais',
      nome: '📝 Observações Finais',
      descricao: 'Informações complementares, experiências anteriores e considerações especiais',
      icon: '📝',
      obrigatoria: false,
      perguntas: [
        { id: 196, tipo: 'textarea', pergunta: 'Experiências anteriores com projetos de interiores:', obrigatoria: false, placeholder: 'Experiências positivas ou negativas' },
        { id: 197, tipo: 'textarea', pergunta: 'Principais preocupações com este projeto:', obrigatoria: false, placeholder: 'O que mais preocupa neste projeto' },
        { id: 198, tipo: 'textarea', pergunta: 'Sonho/visão para este projeto:', obrigatoria: false, placeholder: 'Como imagina sua casa dos sonhos' },
        { id: 199, tipo: 'textarea', pergunta: 'Inspirações especiais:', obrigatoria: false, placeholder: 'Viagens, lugares, pessoas que inspiram' },
        { id: 200, tipo: 'textarea', pergunta: 'Informações adicionais importantes:', obrigatoria: false, placeholder: 'Qualquer informação relevante não mencionada' }
      ]
    }
  ]
}; 