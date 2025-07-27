// 🏠 BRIEFING ESTÁTICO: CASA UNIFAMILIAR - SISTEMA COMPLETO
// 157 perguntas | 170 min estimado | Baseado em especificações detalhadas
// ✅ TODOS OS TIPOS DE CAMPO COMPATÍVEIS E VALIDADOS

import { BriefingEstatico } from '../types';

export const CASA_SIMPLES: BriefingEstatico = {
  id: 'RES_CASA_SIMPLES',
  nome: 'Casa Unifamiliar - Sistema Completo',
  area: 'RESIDENCIAL',
  tipologia: 'CASA_UNIFAMILIAR',
  padrao: 'SIMPLES',
  totalPerguntas: 159,
  tempoEstimado: 170,
  categoria: 'residencial-casa',
  versao: '7.0',

  perguntas: [
    // ===== 1. DADOS GERAIS DO CLIENTE E FAMÍLIA =====
    
    // 1.1 - NÚMERO DE MORADORES
    {
      id: 'CLIENTE_01_A',
      texto: 'Quantas pessoas moram na casa atualmente?',
      tipo: 'numero',
      obrigatoria: true,
      placeholder: 'Ex: 4',
      min: 1,
      max: 20,
      secao: 'DADOS GERAIS DO CLIENTE E FAMÍLIA',
      ajuda: 'Considere apenas moradores permanentes'
    },
    
    // 1.2 - IDADES DOS MORADORES - OTIMIZADO PARA MÚLTIPLA ESCOLHA
    {
      id: 'CLIENTE_01_B',
      texto: 'Selecione as faixas etárias dos moradores:',
      tipo: 'multiple',
      opcoes: [
        'Bebês (0-2 anos)',
        'Crianças pequenas (3-6 anos)', 
        'Crianças (7-12 anos)',
        'Adolescentes (13-17 anos)',
        'Jovens adultos (18-25 anos)',
        'Adultos jovens (26-35 anos)',
        'Adultos (36-50 anos)',
        'Adultos maduros (51-65 anos)',
        'Idosos (acima de 65 anos)'
      ],
      obrigatoria: true,
      secao: 'DADOS GERAIS DO CLIENTE E FAMÍLIA',
      ajuda: 'Marque todas as faixas etárias presentes na família'
    },
    
    // 1.3 - FAIXA ETÁRIA PREDOMINANTE
    {
      id: 'CLIENTE_01_C',
      texto: 'Qual a faixa etária predominante na casa?',
      tipo: 'select',
      opcoes: [
        'Casal jovem (até 35 anos)',
        'Casal adulto (36-55 anos)', 
        'Casal maduro (acima de 55 anos)',
        'Família com crianças pequenas (0-10 anos)',
        'Família com adolescentes (11-17 anos)',
        'Família com jovens adultos (18-25 anos)',
        'Multi-geracional (várias faixas etárias)'
      ],
      obrigatoria: true,
      secao: 'DADOS GERAIS DO CLIENTE E FAMÍLIA'
    },
    
    // 1.4 - PREVISÕES FUTURAS
    {
      id: 'CLIENTE_01_D',
      texto: 'Há previsão de mudanças na composição familiar nos próximos 5 anos?',
      tipo: 'select',
      opcoes: [
        'Não, família estável',
        'Sim, planejamos ter filhos',
        'Sim, filhos saindo de casa',
        'Sim, parentes vindo morar',
        'Sim, outras mudanças'
      ],
      obrigatoria: true,
      secao: 'DADOS GERAIS DO CLIENTE E FAMÍLIA'
    },
    
    // 1.5 - DETALHES DAS PREVISÕES (CONDICIONAL)
    {
      id: 'CLIENTE_01_D_DETALHES',
      texto: 'Especifique as mudanças previstas:',
      tipo: 'texto_longo',
      obrigatoria: false,
      placeholder: 'Descreva as mudanças previstas: quando, quantas pessoas, idades aproximadas, necessidades especiais',
      maxLength: 400,
      dependeDe: 'CLIENTE_01_D',
      secao: 'DADOS GERAIS DO CLIENTE E FAMÍLIA'
    },
    
    // 1.6 - DEPENDENTES EXTERNOS
    {
      id: 'CLIENTE_01_E',
      texto: 'Há dependentes que não moram na casa mas frequentam regularmente?',
      tipo: 'select',
      opcoes: [
        'Não',
        'Sim, pais/sogros (visitas regulares)',
        'Sim, filhos em guarda compartilhada',
        'Sim, netos ou sobrinhos',
        'Sim, cuidadores/empregados',
        'Sim, outros dependentes'
      ],
      obrigatoria: true,
      secao: 'DADOS GERAIS DO CLIENTE E FAMÍLIA'
    },
    
    // 1.7 - ANIMAIS DE ESTIMAÇÃO
    {
      id: 'CLIENTE_01_F',
      texto: 'Há animais de estimação na família?',
      tipo: 'select',
      opcoes: [
        'Não temos animais',
        'Sim, 1 cão pequeno',
        'Sim, 1 cão médio/grande', 
        'Sim, múltiplos cães',
        'Sim, gatos',
        'Sim, cães e gatos',
        'Sim, outros animais (pássaros, peixes, etc.)',
        'Planejamos ter no futuro'
      ],
      obrigatoria: true,
      secao: 'DADOS GERAIS DO CLIENTE E FAMÍLIA',
      ajuda: 'Importante para dimensionar espaços específicos e áreas externas'
    },
    {
      id: 'CLIENTE_02',
      texto: 'Há membros com necessidades especiais, limitações físicas ou futuras previsões nesse sentido?',
      tipo: 'select',
      opcoes: ['Não', 'Sim, atualmente', 'Sim, previsão futura'],
      obrigatoria: true,
      secao: 'DADOS GERAIS DO CLIENTE E FAMÍLIA'
    },
    {
      id: 'CLIENTE_02_DETALHES',
      texto: 'Especifique as necessidades e limitações:',
      tipo: 'texto_longo',
      obrigatoria: false,
      placeholder: 'Descreva as necessidades especiais e limitações físicas (mínimo 10 caracteres)',
      maxLength: 500,
      dependeDe: 'CLIENTE_02',
      secao: 'DADOS GERAIS DO CLIENTE E FAMÍLIA'
    },
    {
      id: 'CLIENTE_03',
      texto: 'Experiência prévia com arquitetura, construção, gestão de obras ou projetos',
      tipo: 'select',
      opcoes: ['Nenhuma experiência', 'Experiência positiva', 'Experiência negativa', 'Experiência mista'],
      obrigatoria: true,
      secao: 'DADOS GERAIS DO CLIENTE E FAMÍLIA'
    },
    {
      id: 'CLIENTE_03_DETALHES',
      texto: 'Como foi a experiência?',
      tipo: 'texto_longo',
      obrigatoria: false,
      placeholder: 'Descreva sua experiência prévia (importante para alinhar expectativas)',
      maxLength: 500,
      dependeDe: 'CLIENTE_03',
      secao: 'DADOS GERAIS DO CLIENTE E FAMÍLIA'
    },
    {
      id: 'CLIENTE_04',
      texto: 'Já trabalhou com arquitetos? Como foi a experiência?',
      tipo: 'select',
      opcoes: ['Não', 'Sim, experiência excelente', 'Sim, experiência boa', 'Sim, experiência regular', 'Sim, experiência ruim'],
      obrigatoria: true,
      secao: 'DADOS GERAIS DO CLIENTE E FAMÍLIA'
    },
    {
      id: 'CLIENTE_04_DETALHES',
      texto: 'Detalhes da experiência com arquitetos:',
      tipo: 'texto_longo',
      obrigatoria: false,
      placeholder: 'Descreva sua experiência anterior com arquitetos',
      maxLength: 500,
      dependeDe: 'CLIENTE_04',
      secao: 'DADOS GERAIS DO CLIENTE E FAMÍLIA'
    },
    {
      id: 'CLIENTE_05',
      texto: 'Qual é o seu nível de conhecimento sobre processos construtivos?',
      tipo: 'select',
      opcoes: ['Nenhum', 'Básico', 'Intermediário', 'Avançado', 'Sou profissional da área'],
      obrigatoria: true,
      secao: 'DADOS GERAIS DO CLIENTE E FAMÍLIA',
      ajuda: 'Ajuda a definir o nível de detalhamento na comunicação técnica'
    },
    {
      id: 'CLIENTE_06',
      texto: 'Qual o seu nível de envolvimento desejado no processo de projeto e obra?',
      tipo: 'select',
      opcoes: [
        'Mínimo (apenas aprovações chave)',
        'Baixo (reuniões periódicas)',
        'Médio (acompanhamento regular)',
        'Alto (participação ativa nas decisões)',
        'Total (envolvimento em todos os detalhes)'
      ],
      obrigatoria: true,
      secao: 'DADOS GERAIS DO CLIENTE E FAMÍLIA'
    },
    {
      id: 'CLIENTE_07',
      texto: 'Como funciona a tomada de decisão na família?',
      tipo: 'select',
      opcoes: [
        'Decisor único (uma pessoa decide)',
        'Casal decide em conjunto (consenso)',
        'Casal com um líder principal',
        'Decisão familiar (todos participam)',
        'Decisão familiar com consultoria externa',
        'Múltiplos decisores (complicado)',
        'Depende do tipo de decisão'
      ],
      obrigatoria: true,
      secao: 'DADOS GERAIS DO CLIENTE E FAMÍLIA',
      ajuda: 'Fundamental para entender a dinâmica de aprovações'
    },
    {
      id: 'CLIENTE_08',
      texto: 'Existe histórico de conflitos nas tomadas de decisão familiar?',
      tipo: 'select',
      opcoes: ['Não, geralmente há consenso', 'Sim, ocasionalmente', 'Sim, frequentemente'],
      obrigatoria: true,
      secao: 'DADOS GERAIS DO CLIENTE E FAMÍLIA'
    },
    {
      id: 'CLIENTE_09',
      texto: 'Há influências externas nas decisões (parentes, amigos)?',
      tipo: 'select',
      opcoes: ['Não, as decisões são internas', 'Sim, pouca influência', 'Sim, influência considerável'],
      obrigatoria: true,
      secao: 'DADOS GERAIS DO CLIENTE E FAMÍLIA'
    },
    {
      id: 'CLIENTE_09_DETALHES',
      texto: 'Quem são e qual o tipo de influência?',
      tipo: 'texto_longo',
      obrigatoria: false,
      placeholder: 'Especifique quem influencia e como (importante para mapear stakeholders)',
      maxLength: 400,
      dependeDe: 'CLIENTE_09',
      secao: 'DADOS GERAIS DO CLIENTE E FAMÍLIA'
    },
    {
      id: 'CLIENTE_10',
      texto: 'Qual a expectativa sobre comunicação durante o projeto?',
      tipo: 'select',
      opcoes: [
        'Comunicação mínima (apenas marcos importantes)',
        'Comunicação semanal (reuniões regulares)',
        'Comunicação constante (contato direto frequente)',
        'Comunicação técnica detalhada (nível profissional)',
        'Comunicação visual (foco em imagens e plantas)',
        'Comunicação por WhatsApp/informal',
        'Comunicação formal (reuniões agendadas)'
      ],
      obrigatoria: true,
      secao: 'DADOS GERAIS DO CLIENTE E FAMÍLIA',
      ajuda: 'Alinha as expectativas de comunicação e acompanhamento'
    },
    {
      id: 'CLIENTE_11',
      texto: 'Entende os prazos realistas do processo de projeto, licenciamento e obra?',
      tipo: 'select',
      opcoes: [
        'Sim, tenho boa noção',
        'Parcialmente, tenho algumas dúvidas',
        'Não, preciso de esclarecimentos detalhados'
      ],
      obrigatoria: true,
      secao: 'DADOS GERAIS DO CLIENTE E FAMÍLIA',
      ajuda: 'Projeto: 2-4 meses | Licenciamento: 2-6 meses | Obra: 8-18 meses'
    },

    // ===== 2. VIABILIDADE FINANCEIRA E PLANEJAMENTO ORÇAMENTÁRIO =====
    {
      id: 'FINANCEIRO_01',
      texto: 'Qual o orçamento total disponível (terreno, projeto, obra, mobiliário)?',
      tipo: 'moeda',
      obrigatoria: true,
      placeholder: 'R$ 0,00',
      secao: 'VIABILIDADE FINANCEIRA E PLANEJAMENTO ORÇAMENTÁRIO',
      ajuda: 'Campo central para todo o planejamento'
    },
    {
      id: 'FINANCEIRO_02',
      texto: 'Este orçamento inclui:',
      tipo: 'multiple',
      opcoes: [
        'Terreno (se aplicável)',
        'Projeto arquitetônico',
        'Projetos complementares (estrutural, elétrico, etc.)',
        'Obra civil (construção/reforma bruta)',
        'Acabamentos (pisos, revestimentos, pintura, etc.)',
        'Mobiliário e decoração',
        'Sistemas (automação, energia solar, segurança, etc.)',
        'Paisagismo',
        'Taxas e impostos',
        'Documentação e aprovações'
      ],
      obrigatoria: true,
      secao: 'VIABILIDADE FINANCEIRA E PLANEJAMENTO ORÇAMENTÁRIO'
    },
    {
      id: 'FINANCEIRO_03',
      texto: 'Existe reserva para contingências (mínimo recomendado 20%)?',
      tipo: 'select',
      opcoes: [
        'Sim, 20% ou mais',
        'Sim, entre 10% e 19%',
        'Sim, menos de 10%',
        'Sim, valor específico',
        'Não, não há reserva para contingências'
      ],
      obrigatoria: true,
      secao: 'VIABILIDADE FINANCEIRA E PLANEJAMENTO ORÇAMENTÁRIO',
      ajuda: 'Educativo sobre a importância da reserva'
    },
    {
      id: 'FINANCEIRO_04',
      texto: 'Quais são as prioridades: menor custo inicial, menor custo operacional ou equilíbrio?',
      tipo: 'select',
      opcoes: [
        'Menor custo inicial (mesmo que a manutenção seja maior)',
        'Menor custo operacional (mesmo que o investimento inicial seja maior)',
        'Equilíbrio entre custo inicial e operacional',
        'Qualidade e durabilidade, independente do custo'
      ],
      obrigatoria: true,
      secao: 'VIABILIDADE FINANCEIRA E PLANEJAMENTO ORÇAMENTÁRIO'
    },
    {
      id: 'FINANCEIRO_05',
      texto: 'Como será o financiamento do projeto?',
      tipo: 'select',
      opcoes: [
        'Recursos próprios (sem financiamento)',
        'Financiamento bancário habitacional (SFH)',
        'Financiamento bancário imobiliário (SFI)',
        'FGTS (Fundo de Garantia)',
        'Consórcio imobiliário',
        'Financiamento privado/particular',
        'Misto (recursos próprios + financiamento)',
        'Ainda não definido'
      ],
      obrigatoria: true,
      secao: 'VIABILIDADE FINANCEIRA E PLANEJAMENTO ORÇAMENTÁRIO'
    },
    {
      id: 'FINANCEIRO_06',
      texto: 'Há garantias disponíveis para financiamento?',
      tipo: 'select',
      opcoes: [
        'Sim, imóvel próprio',
        'Sim, fiador',
        'Sim, outras garantias (especificar)',
        'Não há garantias / Não aplicável'
      ],
      obrigatoria: true,
      secao: 'VIABILIDADE FINANCEIRA E PLANEJAMENTO ORÇAMENTÁRIO'
    },
    {
      id: 'FINANCEIRO_07',
      texto: 'Qual é a capacidade de pagamento mensal máxima?',
      tipo: 'moeda',
      obrigatoria: false,
      placeholder: 'R$ 0,00 (se aplicável)',
      secao: 'VIABILIDADE FINANCEIRA E PLANEJAMENTO ORÇAMENTÁRIO'
    },
    {
      id: 'FINANCEIRO_08',
      texto: 'Existe planejamento para despesas pós-obra (mudança, mobiliário, manutenção)?',
      tipo: 'select',
      opcoes: [
        'Sim, já incluído no orçamento total',
        'Sim, há um orçamento separado para isso',
        'Não, ainda não planejado'
      ],
      obrigatoria: true,
      secao: 'VIABILIDADE FINANCEIRA E PLANEJAMENTO ORÇAMENTÁRIO'
    },
    {
      id: 'FINANCEIRO_09',
      texto: 'Interesse em tecnologias e sustentabilidade:',
      tipo: 'multiple',
      opcoes: [
        'Energia solar fotovoltaica',
        'Automação residencial básica',
        'Automação residencial avançada',
        'Reuso de água da chuva',
        'Reuso de águas cinzas',
        'Isolamento térmico avançado',
        'Sistemas de ventilação natural',
        'Paisagismo sustentável',
        'Materiais ecológicos/sustentáveis',
        'Não tenho interesse',
        'Tenho interesse mas sem orçamento específico',
        'Tenho orçamento separado para isso'
      ],
      obrigatoria: true,
      secao: 'VIABILIDADE FINANCEIRA E PLANEJAMENTO ORÇAMENTÁRIO'
    },
    {
      id: 'FINANCEIRO_10',
      texto: 'Existe orçamento específico para futuras manutenções, upgrades ou expansões?',
      tipo: 'select',
      opcoes: [
        'Sim, há um planejamento financeiro para isso',
        'Não, mas há intenção de planejar',
        'Não, não foi considerado'
      ],
      obrigatoria: true,
      secao: 'VIABILIDADE FINANCEIRA E PLANEJAMENTO ORÇAMENTÁRIO'
    },

    // ===== 3. TERRENO E CONTEXTO URBANO =====
    {
      id: 'TERRENO_01',
      texto: 'Localização completa do terreno',
      tipo: 'texto_longo',
      obrigatoria: true,
      placeholder: 'Rua, Número, Bairro, Cidade, Estado, CEP',
      maxLength: 250,
      secao: 'TERRENO E CONTEXTO URBANO'
    },
    // 3.1 - ÁREA DO TERRENO
    {
      id: 'TERRENO_02_A',
      texto: 'Área total do terreno:',
      tipo: 'select',
      opcoes: [
        'Até 200m² (terreno pequeno)',
        '200m² a 360m² (terreno padrão)',
        '360m² a 500m² (terreno médio)',
        '500m² a 1.000m² (terreno grande)',
        'Acima de 1.000m² (terreno muito grande)',
        'Não sei a área exata'
      ],
      obrigatoria: true,
      secao: 'TERRENO E CONTEXTO URBANO'
    },
    
    // 3.2 - FORMATO DO TERRENO
    {
      id: 'TERRENO_02_B',
      texto: 'Formato do terreno:',
      tipo: 'select',
      opcoes: [
        'Retangular regular (frente similar ao fundo)',
        'Retangular estreito (frente menor que fundo)',
        'Retangular largo (frente maior que fundo)', 
        'Quadrado ou próximo ao quadrado',
        'Triangular ou formato irregular',
        'Em esquina (duas frentes)',
        'Em formato de "L" ou similar'
      ],
      obrigatoria: true,
      secao: 'TERRENO E CONTEXTO URBANO'
    },
    {
      id: 'TERRENO_03',
      texto: 'Topografia do terreno:',
      tipo: 'select',
      opcoes: [
        'Plano (sem inclinação significativa)',
        'Aclive leve (subida suave até 5%)',
        'Aclive acentuado (subida forte acima de 5%)',
        'Declive leve (descida suave até 5%)',
        'Declive acentuado (descida forte acima de 5%)',
        'Misto (parte plana e parte inclinada)',
        'Muito irregular (múltiplas variações)',
        'Não sei avaliar a topografia'
      ],
      obrigatoria: true,
      secao: 'TERRENO E CONTEXTO URBANO'
    },
    {
      id: 'TERRENO_04',
      texto: 'Solo: tipo, qualidade, histórico de sondagem, existência de nascentes, lençol freático ou restrições ambientais',
      tipo: 'texto_longo',
      obrigatoria: true,
      placeholder: 'Descreva: tipo de solo (argiloso, arenoso, rochoso, misto), qualidade, possui sondagem?, nascentes?, nível lençol freático, restrições ambientais',
      maxLength: 600,
      secao: 'TERRENO E CONTEXTO URBANO'
    },
    {
      id: 'TERRENO_05',
      texto: 'Condições climáticas: orientação solar, direção dos ventos predominantes, ruídos externos',
      tipo: 'texto_longo',
      obrigatoria: true,
      placeholder: 'Descreva: orientação solar da fachada principal (N, S, L, O, NE, NO, SE, SO), direção ventos, ruídos externos significativos',
      maxLength: 400,
      secao: 'TERRENO E CONTEXTO URBANO'
    },
    {
      id: 'TERRENO_06',
      texto: 'Construções vizinhas: alturas, afastamentos, janelas, sombreamento, privacidade',
      tipo: 'texto_longo',
      obrigatoria: true,
      placeholder: 'Descreva as construções vizinhas (altura, proximidade, janelas voltadas para o terreno, impacto no sol/privacidade)',
      maxLength: 1000,
      secao: 'TERRENO E CONTEXTO URBANO'
    },
    {
      id: 'TERRENO_07',
      texto: 'Vegetação existente: há árvores a serem preservadas?',
      tipo: 'select',
      opcoes: [
        'Não há vegetação significativa',
        'Sim, árvores de pequeno porte',
        'Sim, árvores de médio/grande porte a preservar',
        'Sim, vegetação nativa a preservar'
      ],
      obrigatoria: true,
      secao: 'TERRENO E CONTEXTO URBANO'
    },
    {
      id: 'TERRENO_07_DETALHES',
      texto: 'Quais espécies e localização aproximada?',
      tipo: 'texto_longo',
      obrigatoria: false,
      placeholder: 'Especifique espécies e localização das árvores a preservar',
      maxLength: 500,
      dependeDe: 'TERRENO_07',
      secao: 'TERRENO E CONTEXTO URBANO'
    },
    {
      id: 'TERRENO_08',
      texto: 'Infraestrutura disponível: água, luz, esgoto, gás, telecomunicações, internet',
      tipo: 'multiple',
      opcoes: [
        'Rede pública de água',
        'Rede pública de energia elétrica (monofásica)',
        'Rede pública de energia elétrica (bifásica)',
        'Rede pública de energia elétrica (trifásica)',
        'Rede pública de esgoto sanitário',
        'Rede de gás natural encanado',
        'Telefonia fixa cabeada',
        'Internet fibra óptica',
        'Internet via rádio/satélite',
        'Nenhuma/infraestrutura precária (especificar)'
      ],
      obrigatoria: true,
      secao: 'TERRENO E CONTEXTO URBANO'
    },
    {
      id: 'TERRENO_09',
      texto: 'Há histórico de enchentes, deslizamentos, restrições ambientais?',
      tipo: 'select',
      opcoes: [
        'Não, nenhum histórico conhecido',
        'Sim, histórico de enchentes/alagamentos',
        'Sim, área com risco de deslizamentos',
        'Sim, outras restrições ambientais (APP, etc.)'
      ],
      obrigatoria: true,
      secao: 'TERRENO E CONTEXTO URBANO'
    },
    {
      id: 'TERRENO_09_DETALHES',
      texto: 'Detalhes sobre o histórico/restrições:',
      tipo: 'texto_longo',
      obrigatoria: false,
      placeholder: 'Descreva detalhes sobre histórico de problemas ou restrições ambientais',
      maxLength: 500,
      dependeDe: 'TERRENO_09',
      secao: 'TERRENO E CONTEXTO URBANO'
    },
    {
      id: 'TERRENO_10',
      texto: 'Restrições legais: zoneamento, recuos, coeficiente de aproveitamento, taxa de ocupação, gabarito, condomínio, loteamento ou legislação específica',
      tipo: 'texto_longo',
      obrigatoria: true,
      placeholder: 'Descreva todas as restrições legais conhecidas (zoneamento, recuos, C.A., T.O., gabarito, normas de condomínio, etc.). Se possuir a guia amarela ou certidão de diretrizes, anexe abaixo.',
      maxLength: 1000,
      secao: 'TERRENO E CONTEXTO URBANO'
    },
    {
      id: 'TERRENO_11',
      texto: 'Interferências de concessionárias ou servidões existentes',
      tipo: 'select',
      opcoes: [
        'Não há interferências conhecidas',
        'Sim, postes/redes elétricas/telefonia',
        'Sim, tubulações subterrâneas (água, esgoto, gás)',
        'Sim, servidão de passagem (pedestres, veículos, infraestrutura)',
        'Sim, outras (especificar)'
      ],
      obrigatoria: true,
      secao: 'TERRENO E CONTEXTO URBANO'
    },
    {
      id: 'TERRENO_11_DETALHES',
      texto: 'Detalhes sobre as interferências:',
      tipo: 'texto_longo',
      obrigatoria: false,
      placeholder: 'Especifique detalhes sobre interferências de concessionárias ou servidões',
      maxLength: 400,
      dependeDe: 'TERRENO_11',
      secao: 'TERRENO E CONTEXTO URBANO'
    },
    {
      id: 'TERRENO_12',
      texto: 'Qualidade da região: segurança, criminalidade, mobilidade, vizinhança, desenvolvimento urbano, potencial de valorização',
      tipo: 'texto_longo',
      obrigatoria: true,
      placeholder: 'Descreva sua percepção sobre a segurança, vizinhança, acesso a serviços, transporte, e potencial de valorização da região.',
      maxLength: 1000,
      secao: 'TERRENO E CONTEXTO URBANO'
    },
    {
      id: 'TERRENO_13',
      texto: 'Há restrições operacionais (horário de obra, acessos difíceis)?',
      tipo: 'select',
      opcoes: [
        'Não há restrições operacionais conhecidas',
        'Sim, restrições de horário para obra (condomínio, prefeitura)',
        'Sim, acesso difícil para caminhões/maquinário',
        'Sim, outras restrições (especificar)'
      ],
      obrigatoria: true,
      secao: 'TERRENO E CONTEXTO URBANO'
    },
    {
      id: 'TERRENO_13_DETALHES',
      texto: 'Detalhes sobre as restrições operacionais:',
      tipo: 'texto_longo',
      obrigatoria: false,
      placeholder: 'Especifique detalhes sobre restrições operacionais para a obra',
      maxLength: 400,
      dependeDe: 'TERRENO_13',
      secao: 'TERRENO E CONTEXTO URBANO'
    },

    // ===== 4. PROGRAMA DE NECESSIDADES (PROGRAMAÇÃO ARQUITETÔNICA) =====
    // AMBIENTES SOCIAIS
    {
      id: 'PROGRAMA_01',
      texto: 'Sala de estar',
      tipo: 'select',
      opcoes: ['Não necessário', 'Sim, uma sala de estar', 'Sim, múltiplas salas de estar'],
      obrigatoria: true,
      secao: 'PROGRAMA DE NECESSIDADES'
    },
    {
      id: 'PROGRAMA_02',
      texto: 'Sala de jantar:',
      tipo: 'select',
      opcoes: [
        'Não necessário (refeições na cozinha)',
        'Integrada com sala de estar (ambiente único)',
        'Separada da sala de estar (ambiente próprio)',
        'Copa/sala de jantar informal (próxima à cozinha)',
        'Sala de jantar formal + copa informal',
        'Múltiplas salas de jantar'
      ],
      obrigatoria: true,
      secao: 'PROGRAMA DE NECESSIDADES'
    },
    {
      id: 'PROGRAMA_03',
      texto: 'Sala de TV/família',
      tipo: 'texto_longo',
      obrigatoria: true,
      placeholder: 'Descreva necessidade e características: integrada, separada, múltiplas, home theater, área de jogos, espaço para crianças',
      maxLength: 400,
      secao: 'PROGRAMA DE NECESSIDADES'
    },
    {
      id: 'PROGRAMA_04',
      texto: 'Varanda/terraço',
      tipo: 'texto_longo',
      obrigatoria: true,
      placeholder: 'Descreva: não necessário, varanda pequena/ampla, múltiplas varandas, características (churrasqueira, área gourmet, jardim, área de estar externa)',
      maxLength: 400,
      secao: 'PROGRAMA DE NECESSIDADES'
    },
    {
      id: 'PROGRAMA_05',
      texto: 'Área gourmet/churrasqueira',
      tipo: 'texto_longo',
      obrigatoria: true,
      placeholder: 'Descreva: não necessário, área gourmet simples/completa, apenas churrasqueira. Equipamentos: churrasqueira carvão/gás, forno pizza, bancada/pia, geladeira/frigobar, som ambiente',
      maxLength: 500,
      secao: 'PROGRAMA DE NECESSIDADES'
    },
    {
      id: 'PROGRAMA_06',
      texto: 'Piscina',
      tipo: 'texto_longo',
      obrigatoria: true,
      placeholder: 'Descreva: não necessário, piscina pequena/média/grande (até 20m², 20-40m², acima 40m²). Tipo: alvenaria, fibra, vinil, natural. Aquecimento: não, solar, elétrico, gás, bomba calor. Tratamento: cloro, sal, ozônio, UV',
      maxLength: 600,
      secao: 'PROGRAMA DE NECESSIDADES'
    },
    {
      id: 'PROGRAMA_07',
      texto: 'Jardim',
      tipo: 'texto_longo',
      obrigatoria: true,
      placeholder: 'Descreva: não necessário, jardim simples/elaborado, projeto paisagístico completo. Características: horta, pomar, jardim zen, playground, área para animais, sistema irrigação',
      maxLength: 500,
      secao: 'PROGRAMA DE NECESSIDADES'
    },
    {
      id: 'PROGRAMA_08',
      texto: 'Recepção ou hall',
      tipo: 'select',
      opcoes: ['Não necessário', 'Sim, hall simples', 'Sim, hall elaborado/imponente'],
      obrigatoria: true,
      secao: 'PROGRAMA DE NECESSIDADES'
    },

    // AMBIENTES DE SERVIÇO
    {
      id: 'PROGRAMA_09',
      texto: 'Tipo de cozinha desejada:',
      tipo: 'select',
      opcoes: [
        'Cozinha americana (integrada à sala)',
        'Cozinha separada tradicional (fechada)',
        'Cozinha gourmet (ampla e equipada)',
        'Cozinha integrada com área gourmet',
        'Cozinha com ilha central',
        'Cozinha com bancada americana',
        'Cozinha com despensa integrada',
        'Cozinha compacta (otimizada)'
      ],
      obrigatoria: true,
      secao: 'PROGRAMA DE NECESSIDADES'
    },
    {
      id: 'PROGRAMA_10',
      texto: 'Área de serviço',
      tipo: 'texto_longo',
      obrigatoria: true,
      placeholder: 'Descreva: área de serviço simples, lavanderia completa, lavanderia + área passar roupa, múltiplas áreas. Equipamentos: tanque, máquina lavar/secar, varal/estender, armários produtos limpeza',
      maxLength: 500,
      secao: 'PROGRAMA DE NECESSIDADES'
    },
    {
      id: 'PROGRAMA_11',
      texto: 'Despensa',
      tipo: 'texto_longo',
      obrigatoria: true,
      placeholder: 'Descreva: não necessário, despensa pequena/ampla, walk-in. Localização: integrada à cozinha, próxima à cozinha, na área de serviço, independente',
      maxLength: 400,
      secao: 'PROGRAMA DE NECESSIDADES'
    },
    {
      id: 'PROGRAMA_12',
      texto: 'Quarto e banheiro de serviço (empregada/cuidador)',
      tipo: 'texto_longo',
      obrigatoria: true,
      placeholder: 'Descreva: não necessário, quarto simples, suíte completa, apartamento independente. Características: entrada independente, cozinha/copa própria, área estar própria',
      maxLength: 500,
      secao: 'PROGRAMA DE NECESSIDADES'
    },
    {
      id: 'PROGRAMA_13',
      texto: 'Depósito / armazenamento',
      tipo: 'texto_longo',
      obrigatoria: true,
      placeholder: 'Descreva tipos e quantidades: depósito geral, storage individual por dormitório, depósito equipamentos/ferramentas, decoração sazonal, arquivo/documentos',
      maxLength: 400,
      secao: 'PROGRAMA DE NECESSIDADES'
    },
    {
      id: 'PROGRAMA_14',
      texto: 'Lavabo',
      tipo: 'select',
      opcoes: ['Não necessário', 'Sim, um lavabo', 'Sim, múltiplos lavabos'],
      obrigatoria: true,
      secao: 'PROGRAMA DE NECESSIDADES'
    },
    // 4.1 - QUANTIDADE DE VEÍCULOS NA GARAGEM
    {
      id: 'PROGRAMA_15_A',
      texto: 'Quantos veículos na garagem?',
      tipo: 'select',
      opcoes: [
        'Nenhum (sem garagem)',
        '1 veículo',
        '2 veículos', 
        '3 veículos',
        '4 veículos',
        '5 ou mais veículos'
      ],
      obrigatoria: true,
      secao: 'PROGRAMA DE NECESSIDADES'
    },
    
    // 4.2 - TIPO DE GARAGEM
    {
      id: 'PROGRAMA_15_B',
      texto: 'Tipo de garagem:',
      tipo: 'select',
      opcoes: [
        'Coberta e fechada (proteção total)',
        'Coberta e aberta (proteção chuva/sol)',
        'Descoberta (apenas demarcação)',
        'Mista (parte coberta, parte descoberta)',
        'Garagem subterrânea',
        'Garagem com portão automático',
        'Garagem com área para lavagem'
      ],
      obrigatoria: true,
      secao: 'PROGRAMA DE NECESSIDADES'
    },

    // AMBIENTES ÍNTIMOS
    {
      id: 'PROGRAMA_16',
      texto: 'Quantas suítes são necessárias?',
      tipo: 'select',
      opcoes: [
        'Nenhuma suíte (apenas quartos simples)',
        '1 suíte (casal)',
        '2 suítes (casal + 1 filho/hóspede)',
        '3 suítes (casal + 2 filhos/hóspedes)',
        '4 suítes (família numerosa)',
        '5 ou mais suítes (casa ampla)'
      ],
      obrigatoria: true,
      secao: 'PROGRAMA DE NECESSIDADES'
    },
    {
      id: 'PROGRAMA_17',
      texto: 'Quantos quartos simples (sem banheiro próprio)?',
      tipo: 'select',
      opcoes: [
        'Nenhum quarto simples',
        '1 quarto simples',
        '2 quartos simples', 
        '3 quartos simples',
        '4 quartos simples',
        '5 ou mais quartos simples'
      ],
            obrigatoria: true,
        secao: 'PROGRAMA DE NECESSIDADES'
    },
    {
      id: 'PROGRAMA_18',
      texto: 'Banheiros (quantos, com ou sem circulação compartilhada)',
      tipo: 'texto_longo',
      obrigatoria: true,
      placeholder: 'Descreva: total de banheiros (incluindo suítes) (1-15), banheiros sociais/compartilhados (0-10), características dos sociais (banheira, box ducha, dupla pia, acessibilidade)',
      maxLength: 500,
      secao: 'PROGRAMA DE NECESSIDADES'
    },
    {
      id: 'PROGRAMA_19',
      texto: 'Closet (para quais suítes/quartos)',
      tipo: 'texto_longo',
      obrigatoria: true,
      placeholder: 'Descreva: necessita closet? Em quais ambientes (suíte master, outras suítes, quartos simples, closet independente/compartilhado)? Tamanho (pequeno, médio, grande, walk-in)',
      maxLength: 400,
      secao: 'PROGRAMA DE NECESSIDADES'
    },

    // AMBIENTES ESPECÍFICOS
    {
      id: 'PROGRAMA_20',
      texto: 'Escritório / Home Office',
      tipo: 'texto_longo',
      obrigatoria: true,
      placeholder: 'Descreva: não necessário, integrado a dormitório, ambiente separado pequeno/amplo, múltiplos espaços trabalho. Características: sala reuniões integrada, biblioteca integrada, entrada independente, banheiro próprio',
      maxLength: 500,
      secao: 'PROGRAMA DE NECESSIDADES'
    },
    {
      id: 'PROGRAMA_21',
      texto: 'Biblioteca',
      tipo: 'texto_longo',
      obrigatoria: true,
      placeholder: 'Descreva: não necessário, cantinho leitura, biblioteca dedicada, integrada ao escritório. Características: estantes até teto, área estudo/mesa, poltrona leitura, lareira/ambiente aconchegante',
      maxLength: 400,
      secao: 'PROGRAMA DE NECESSIDADES'
    },
    {
      id: 'PROGRAMA_22',
      texto: 'Atelier / Hobby room',
      tipo: 'select',
      opcoes: ['Não necessário', 'Sim, espaço para hobbies', 'Sim, ateliê profissional', 'Sim, múltiplos espaços criativos'],
      obrigatoria: true,
      secao: 'PROGRAMA DE NECESSIDADES'
    },
    {
      id: 'PROGRAMA_22_DETALHES',
      texto: 'Especificar atividades/hobbies:',
      tipo: 'texto_longo',
      obrigatoria: false,
      placeholder: 'Descreva as atividades específicas que serão realizadas no espaço',
      maxLength: 300,
      dependeDe: 'PROGRAMA_22',
      secao: 'PROGRAMA DE NECESSIDADES'
    },
    {
      id: 'PROGRAMA_23',
      texto: 'Academia',
      tipo: 'texto_longo',
      obrigatoria: true,
      placeholder: 'Descreva: não necessário, espaço básico exercícios, academia completa, integrada com área lazer. Características: espelhos, som ambiente, ar condicionado, vestiário/ducha, sauna',
      maxLength: 400,
      secao: 'PROGRAMA DE NECESSIDADES'
    },
    {
      id: 'PROGRAMA_24',
      texto: 'Sala de jogos',
      tipo: 'texto_longo',
      obrigatoria: true,
      placeholder: 'Descreva: não necessário, sala jogos infantil/adulto/mista. Características: mesa sinuca/bilhar, mesa ping-pong, videogame/TV, jogos tabuleiro, bar integrado',
      maxLength: 400,
      secao: 'PROGRAMA DE NECESSIDADES'
    },
    {
      id: 'PROGRAMA_25',
      texto: 'Adega',
      tipo: 'texto_longo',
      obrigatoria: true,
      placeholder: 'Descreva: não necessário, adega simples/climatizada, adega com área degustação. Capacidade: até 50, 50-200, 200-500, acima 500 garrafas. Localização: subsolo, térreo, integrada à sala, área gourmet',
      maxLength: 500,
      secao: 'PROGRAMA DE NECESSIDADES'
    },
    {
      id: 'PROGRAMA_26',
      texto: 'Sala de cinema',
      tipo: 'texto_longo',
      obrigatoria: true,
      placeholder: 'Descreva: não necessário, home theater simples, sala cinema dedicada, cinema múltiplas fileiras. Características: isolamento acústico, projetor/tela, som surround, poltronas reclináveis, bar/pipoca integrado, controle iluminação',
      maxLength: 500,
      secao: 'PROGRAMA DE NECESSIDADES'
    },
    {
      id: 'PROGRAMA_27',
      texto: 'Sala de música',
      tipo: 'texto_longo',
      obrigatoria: true,
      placeholder: 'Descreva: não necessário, espaço prática musical, estúdio gravação, sala ensaio. Características: isolamento acústico profissional, tratamento acústico interno, instalações elétricas especiais, ar condicionado silencioso',
      maxLength: 500,
      secao: 'PROGRAMA DE NECESSIDADES'
    },
    {
      id: 'PROGRAMA_28',
      texto: 'Espaço pet',
      tipo: 'texto_longo',
      obrigatoria: true,
      placeholder: 'Descreva: não necessário, área externa/interna para pets, canil/gatil. Características: área banho pets, depósito ração/acessórios, cerca/delimitação, sombra/abrigo',
      maxLength: 400,
      secao: 'PROGRAMA DE NECESSIDADES'
    },
    {
      id: 'PROGRAMA_29',
      texto: 'Outros ambientes específicos',
      tipo: 'texto_longo',
      obrigatoria: false,
      placeholder: 'Descreva outros ambientes específicos não mencionados (observatório, capela, oficina, etc.)',
      maxLength: 1000,
      secao: 'PROGRAMA DE NECESSIDADES'
    },

    // INFORMAÇÕES COMPLEMENTARES DO PROGRAMA
    {
      id: 'PROGRAMA_30',
      texto: 'Uso atual dos espaços (como funciona hoje)',
      tipo: 'texto_longo',
      obrigatoria: true,
      placeholder: 'Descreva como vocês usam os espaços atualmente, rotinas diárias, fluxos de circulação, problemas enfrentados.',
      maxLength: 1000,
      secao: 'PROGRAMA DE NECESSIDADES'
    },
    {
      id: 'PROGRAMA_31',
      texto: 'Frequência de visitas e hóspedes',
      tipo: 'texto_longo',
      obrigatoria: true,
      placeholder: 'Descreva: raramente, ocasionais (fins semana), frequentes (semanais), muito frequentes (diárias). Quantidade média pessoas, hóspedes que pernoitam (frequência mensal)',
      maxLength: 400,
      secao: 'PROGRAMA DE NECESSIDADES'
    },
    {
      id: 'PROGRAMA_32',
      texto: 'Atividades específicas da família (trabalho remoto, hobbies, rituais familiares)',
      tipo: 'texto_longo',
      obrigatoria: true,
      placeholder: 'Descreva atividades específicas da família que devem ser consideradas no projeto (trabalho em casa, hobbies, práticas religiosas, tradições familiares, etc.)',
      maxLength: 800,
      secao: 'PROGRAMA DE NECESSIDADES'
    },
    {
      id: 'PROGRAMA_33',
      texto: 'Expectativa de integração ou segregação dos ambientes',
      tipo: 'select',
      opcoes: [
        'Ambientes totalmente integrados (conceito aberto)',
        'Integração parcial (alguns ambientes conectados)',
        'Segregação parcial (alguns ambientes separados)',
        'Ambientes totalmente segregados (compartimentados)'
      ],
      obrigatoria: true,
      secao: 'PROGRAMA DE NECESSIDADES'
    },
    {
      id: 'PROGRAMA_33_DETALHES',
      texto: 'Especificar quais ambientes devem ser integrados/segregados:',
      tipo: 'texto_longo',
      obrigatoria: true,
      placeholder: 'Especifique quais ambientes devem ser integrados ou segregados',
      maxLength: 400,
      secao: 'PROGRAMA DE NECESSIDADES'
    },
    {
      id: 'PROGRAMA_34',
      texto: 'Existe previsão de cuidadores ou empregados residentes?',
      tipo: 'select',
      opcoes: ['Não', 'Sim, cuidador de idoso', 'Sim, babá/cuidador de crianças', 'Sim, empregada doméstica', 'Sim, múltiplos funcionários'],
      obrigatoria: true,
      secao: 'PROGRAMA DE NECESSIDADES'
    },
    {
      id: 'PROGRAMA_34_DETALHES',
      texto: 'Especificar necessidades e horários:',
      tipo: 'texto_longo',
      obrigatoria: false,
      placeholder: 'Especifique necessidades específicas e horários de trabalho',
      maxLength: 400,
      dependeDe: 'PROGRAMA_34',
      secao: 'PROGRAMA DE NECESSIDADES'
    },
    {
      id: 'PROGRAMA_35',
      texto: 'Prioridades: privacidade, integração, flexibilidade, espaços multiuso',
      tipo: 'texto_longo',
      obrigatoria: true,
      placeholder: 'Ordene por prioridade (1=mais importante): Privacidade, Integração familiar, Flexibilidade para mudanças futuras, Espaços multiuso, Funcionalidade, Estética. Aspectos importantes adicionais: Facilidade manutenção, Eficiência energética, Segurança, Acessibilidade',
      maxLength: 600,
      secao: 'PROGRAMA DE NECESSIDADES'
    },

    // ===== 5. FUNCIONALIDADE, CONFORTO E ERGONOMIA =====
    {
      id: 'FUNCIONALIDADE_01',
      texto: 'Rotina diária da família e dos moradores',
      tipo: 'texto_longo',
      obrigatoria: true,
      placeholder: 'Descreva detalhadamente a rotina diária da família: horários de acordar, trabalho, refeições, lazer, sono. Como os espaços são utilizados ao longo do dia?',
      maxLength: 1500,
      secao: 'FUNCIONALIDADE, CONFORTO E ERGONOMIA'
    },
    {
      id: 'FUNCIONALIDADE_02',
      texto: 'Preferência por ambientes sociais, privados ou equilíbrio?',
      tipo: 'select',
      opcoes: [
        'Preferência por ambientes privados/reservados',
        'Equilíbrio entre privacidade e socialização',
        'Preferência por ambientes sociais/integrados'
      ],
      obrigatoria: true,
      secao: 'FUNCIONALIDADE, CONFORTO E ERGONOMIA'
    },
    {
      id: 'FUNCIONALIDADE_03',
      texto: 'Pé-direito preferido (alto, padrão, duplo)',
      tipo: 'texto_longo',
      obrigatoria: true,
      placeholder: 'Descreva: Padrão (2,70m a 3,00m), Alto (3,00m a 4,00m), Muito alto (acima 4,00m), Duplo pé-direito em alguns ambientes, Variado conforme ambiente. Se duplo/variado, especifique onde (sala estar, jantar, hall, escada, outros)',
      maxLength: 400,
      secao: 'FUNCIONALIDADE, CONFORTO E ERGONOMIA'
    },
    {
      id: 'FUNCIONALIDADE_04',
      texto: 'Prioridade para: Ventilação natural, Iluminação natural, Isolamento acústico, Privacidade visual dos vizinhos, Conforto térmico',
      tipo: 'texto_longo',
      obrigatoria: true,
      placeholder: 'Ordene por prioridade (1=mais importante): Ventilação natural abundante, Iluminação natural abundante, Isolamento acústico (ruídos externos), Privacidade visual dos vizinhos, Conforto térmico (controle temperatura). Para cada item, indique importância (Baixa/Alta)',
      maxLength: 600,
      secao: 'FUNCIONALIDADE, CONFORTO E ERGONOMIA'
    },
    {
      id: 'FUNCIONALIDADE_05',
      texto: 'Controle de temperatura: necessidade de climatização (natural, ar-condicionado, piso aquecido, etc.)',
      tipo: 'texto_longo',
      obrigatoria: true,
      placeholder: 'Marque sistemas desejados: Ventilação natural otimizada, Ar condicionado (Split/Central/VRF), Aquecimento (Lareira/Piso radiante/Aquecedores), Controle umidade, Isolamento térmico especial. Ambientes prioritários para climatização.',
      maxLength: 600,
      secao: 'FUNCIONALIDADE, CONFORTO E ERGONOMIA'
    },
    {
      id: 'FUNCIONALIDADE_06',
      texto: 'Necessidade de acessibilidade total, parcial ou futura?',
      tipo: 'select',
      opcoes: [
        'Não há necessidade atual ou futura',
        'Acessibilidade básica (NBR 9050 mínima)',
        'Acessibilidade parcial (alguns ambientes)',
        'Acessibilidade total (todos os ambientes)',
        'Preparação para acessibilidade futura'
      ],
      obrigatoria: true,
      secao: 'FUNCIONALIDADE, CONFORTO E ERGONOMIA'
    },
    {
      id: 'FUNCIONALIDADE_06_DETALHES',
      texto: 'Especificar necessidades de acessibilidade:',
      tipo: 'texto_longo',
      obrigatoria: false,
      placeholder: 'Marque necessidades: Rampas acesso, Elevador/preparação, Portas largas (80cm mínimo), Banheiro acessível, Barras apoio, Pisos antiderrapantes, Sinalização tátil, Automação facilitar uso',
      maxLength: 400,
      dependeDe: 'FUNCIONALIDADE_06',
      secao: 'FUNCIONALIDADE, CONFORTO E ERGONOMIA'
    },
    {
      id: 'FUNCIONALIDADE_07',
      texto: 'Altura média dos usuários principais (customização ergonômica)',
      tipo: 'texto_longo',
      obrigatoria: true,
      placeholder: 'Há pessoas muito altas ou baixas na família? Se sim: altura pessoa mais alta (cm), altura pessoa mais baixa (cm). Adaptações necessárias: bancadas cozinha customizadas, altura interruptores/tomadas, altura armários, altura chuveiros',
      maxLength: 400,
      secao: 'FUNCIONALIDADE, CONFORTO E ERGONOMIA'
    },
    {
      id: 'FUNCIONALIDADE_08',
      texto: 'Alergias ou sensibilidades a materiais (químicos, biológicos)',
      tipo: 'select',
      opcoes: [
        'Não há alergias ou sensibilidades conhecidas',
        'Sim, alergias a materiais específicos',
        'Sim, sensibilidades químicas',
        'Sim, problemas respiratórios'
      ],
      obrigatoria: true,
      secao: 'FUNCIONALIDADE, CONFORTO E ERGONOMIA'
    },
    {
      id: 'FUNCIONALIDADE_08_DETALHES',
      texto: 'Especificar alergias/sensibilidades e materiais a evitar:',
      tipo: 'texto_longo',
      obrigatoria: false,
      placeholder: 'Especifique alergias/sensibilidades e materiais que devem ser evitados',
      maxLength: 500,
      dependeDe: 'FUNCIONALIDADE_08',
      secao: 'FUNCIONALIDADE, CONFORTO E ERGONOMIA'
    },
    {
      id: 'FUNCIONALIDADE_09',
      texto: 'Necessidade de diferenciação de circulação (social, íntima, serviço)',
      tipo: 'select',
      opcoes: [
        'Não, circulação integrada',
        'Sim, circulação parcialmente separada',
        'Sim, circulação totalmente separada'
      ],
      obrigatoria: true,
      secao: 'FUNCIONALIDADE, CONFORTO E ERGONOMIA'
    },
    {
      id: 'FUNCIONALIDADE_09_DETALHES',
      texto: 'Especificar separação de circulações:',
      tipo: 'texto_longo',
      obrigatoria: false,
      placeholder: 'Marque necessidades: Entrada social independente, Entrada serviço independente, Circulação íntima separada, Elevador social/serviço separados',
      maxLength: 400,
      dependeDe: 'FUNCIONALIDADE_09',
      secao: 'FUNCIONALIDADE, CONFORTO E ERGONOMIA'
    },
    {
      id: 'FUNCIONALIDADE_10',
      texto: 'Necessidade de depósitos e armazenamento',
      tipo: 'texto_longo',
      obrigatoria: true,
      placeholder: 'Marque necessidades: Depósitos gerais, Armazenamento sazonal (decoração, roupas), Arquivo documentos, Depósito equipamentos/ferramentas, Armazenamento alimentos (despensa ampla), Armazenamento produtos limpeza. Especificar outros tipos.',
      maxLength: 400,
      secao: 'FUNCIONALIDADE, CONFORTO E ERGONOMIA'
    },
    {
      id: 'FUNCIONALIDADE_11',
      texto: 'Flexibilidade para mudanças futuras nos ambientes',
      tipo: 'select',
      opcoes: [
        'Não é importante, projeto fixo',
        'Flexibilidade básica (móveis, decoração)',
        'Flexibilidade moderada (algumas paredes removíveis)',
        'Flexibilidade alta (estrutura adaptável)'
      ],
      obrigatoria: true,
      secao: 'FUNCIONALIDADE, CONFORTO E ERGONOMIA'
    },
    {
      id: 'FUNCIONALIDADE_11_DETALHES',
      texto: 'Especificar flexibilidade desejada:',
      tipo: 'texto_longo',
      obrigatoria: false,
      placeholder: 'Marque necessidades: Paredes removíveis/divisórias, Instalações preparadas para mudanças, Estrutura que permita ampliações, Ambientes multiuso',
      maxLength: 400,
      dependeDe: 'FUNCIONALIDADE_11',
      secao: 'FUNCIONALIDADE, CONFORTO E ERGONOMIA'
    },

    // ===== 6. ESTILO, ESTÉTICA E DIRECIONAMENTO VISUAL =====
    {
      id: 'ESTETICA_01',
      texto: 'Estilo arquitetônico preferido (moderno, contemporâneo, clássico, rústico, industrial, minimalista, etc.)',
      tipo: 'multiple',
      opcoes: [
        'Moderno',
        'Contemporâneo',
        'Minimalista',
        'Clássico/Tradicional',
        'Rústico/Country',
        'Industrial',
        'Eclético',
        'Tropical/Brasileiro',
        'Mediterrâneo',
        'Outros estilos (especificar)'
      ],
      obrigatoria: true,
      secao: 'ESTILO, ESTÉTICA E DIRECIONAMENTO VISUAL'
    },
    {
      id: 'ESTETICA_02',
      texto: 'Tem referências visuais (Pinterest, Instagram, projetos específicos)?',
      tipo: 'texto_longo',
      obrigatoria: true,
      placeholder: 'Descreva: não tenho referências, tenho fotos/imagens salvas, conheço projetos específicos, tenho perfis Pinterest/Instagram. Inclua links ou descrição de projetos conhecidos.',
      maxLength: 500,
      secao: 'ESTILO, ESTÉTICA E DIRECIONAMENTO VISUAL'
    },
    {
      id: 'ESTETICA_03',
      texto: 'Preferência por: Linhas retas, curvas ou mistas; Ambientes integrados ou compartimentados; Fachadas (impactantes, discretas, atemporais, marcantes)',
      tipo: 'texto_longo',
      obrigatoria: true,
      placeholder: 'Linhas predominantes: Retas/Curvas/Mistas. Organização espacial: Integrados/Compartimentados/Misto. Caráter da fachada: Discreta/elegante, Impactante/marcante, Atemporal/clássica, Acolhedora/convidativa',
      maxLength: 400,
      secao: 'ESTILO, ESTÉTICA E DIRECIONAMENTO VISUAL'
    },
    {
      id: 'ESTETICA_04',
      texto: 'Paleta de cores preferida',
      tipo: 'texto_longo',
      obrigatoria: true,
      placeholder: 'Estilo de cores: Neutras/Quentes/Frias/Contrastantes/Monocromáticas/Coloridas. Cores principais (até 3), cores de destaque (até 2). Cores a evitar: muito escuras/claras/vibrantes/frias/quentes',
      maxLength: 400,
      secao: 'ESTILO, ESTÉTICA E DIRECIONAMENTO VISUAL'
    },
    {
      id: 'ESTETICA_05',
      texto: 'Preferência por materiais na: Fachada, Pisos, Paredes, Tetos, Esquadrias',
      tipo: 'texto_longo',
      obrigatoria: true,
      placeholder: 'Fachada: tijolo aparente, concreto aparente, madeira, pedra natural, revestimento cerâmico, vidro, metal, pintura. Pisos: porcelanato, madeira, pedra natural, cimento queimado, cerâmica, vinílico, carpete. Paredes: pintura, papel parede, revestimento cerâmico, madeira, pedra, tijolo aparente. Tetos: laje aparente, gesso liso/detalhes, madeira, PVC. Esquadrias: PVC, alumínio, madeira, ferro, mistas',
      maxLength: 800,
      secao: 'ESTILO, ESTÉTICA E DIRECIONAMENTO VISUAL'
    },
    {
      id: 'ESTETICA_06',
      texto: 'Elementos desejados: madeira, pedra, concreto aparente, metal, vidro, vegetação integrada',
      tipo: 'texto_longo',
      obrigatoria: true,
      placeholder: 'Marque elementos desejados: Madeira, Pedra natural, Concreto aparente, Metal (ferro/aço/alumínio), Vidro, Vegetação integrada (jardins verticais), Elementos de água (fontes/espelhos água), Nenhum elemento específico. Para cada elemento, especifique onde aplicar.',
      maxLength: 500,
      secao: 'ESTILO, ESTÉTICA E DIRECIONAMENTO VISUAL'
    },
    {
      id: 'ESTETICA_07',
      texto: 'Preferência por iluminação natural abundante ou controlada',
      tipo: 'texto_longo',
      obrigatoria: true,
      placeholder: 'Preferência geral: Iluminação natural controlada ←→ abundante. Iluminação natural prioritária por ambiente: salas sociais, cozinha, dormitórios, banheiros, escritório, outros ambientes específicos',
      maxLength: 400,
      secao: 'ESTILO, ESTÉTICA E DIRECIONAMENTO VISUAL'
    },
    {
      id: 'ESTETICA_08',
      texto: 'Influência de tendências, redes sociais ou cultura específica',
      tipo: 'select',
      opcoes: [
        'Não há influências específicas',
        'Sim, tendências atuais de decoração/arquitetura',
        'Sim, influência de redes sociais (Instagram, Pinterest)',
        'Sim, influência cultural específica (especificar)'
      ],
      obrigatoria: true,
      secao: 'ESTILO, ESTÉTICA E DIRECIONAMENTO VISUAL'
    },
    {
      id: 'ESTETICA_08_DETALHES',
      texto: 'Especificar influências:',
      tipo: 'texto_longo',
      obrigatoria: false,
      placeholder: 'Especifique as influências culturais ou de tendências que impactam suas preferências',
      maxLength: 400,
      dependeDe: 'ESTETICA_08',
      secao: 'ESTILO, ESTÉTICA E DIRECIONAMENTO VISUAL'
    },
    {
      id: 'ESTETICA_09',
      texto: 'Preocupação com valor de revenda vs. personalização extrema',
      tipo: 'select',
      opcoes: [
        'Prioridade total para personalização, sem preocupação com revenda',
        'Personalização com algumas considerações sobre revenda',
        'Equilíbrio entre personalização e valor de revenda',
        'Prioridade para valor de revenda, personalização moderada'
      ],
      obrigatoria: true,
      secao: 'ESTILO, ESTÉTICA E DIRECIONAMENTO VISUAL'
    },
    {
      id: 'ESTETICA_10',
      texto: 'Tolerância para mudanças estéticas futuras',
      tipo: 'select',
      opcoes: [
        'Alta tolerância, gosto de mudanças frequentes',
        'Tolerância moderada, mudanças ocasionais',
        'Baixa tolerância, prefiro estabilidade estética',
        'Nenhuma tolerância, projeto definitivo'
      ],
      obrigatoria: true,
      secao: 'ESTILO, ESTÉTICA E DIRECIONAMENTO VISUAL'
    },
    {
      id: 'ESTETICA_11',
      texto: 'Importância da integração com o entorno, natureza ou paisagem',
      tipo: 'select',
      opcoes: ['Muito importante', 'Importante', 'Moderadamente importante', 'Pouco importante'],
      obrigatoria: true,
      secao: 'ESTILO, ESTÉTICA E DIRECIONAMENTO VISUAL'
    },
    {
      id: 'ESTETICA_11_DETALHES',
      texto: 'Especificar integração desejada:',
      tipo: 'texto_longo',
      obrigatoria: false,
      placeholder: 'Marque aspectos importantes: Integração vegetação existente, Harmonia construções vizinhas, Aproveitamento vistas naturais, Uso materiais regionais, Respeito topografia natural',
      maxLength: 400,
      dependeDe: 'ESTETICA_11',
      secao: 'ESTILO, ESTÉTICA E DIRECIONAMENTO VISUAL'
    },

    // ===== 7. TECNOLOGIA, SISTEMAS E CONFORTO OPERACIONAL =====
    {
      id: 'TECNOLOGIA_01',
      texto: 'Sistemas desejados: Automação residencial, Climatização, Aquecimento de água, Energia solar, Captação/reuso água, Outros sistemas',
      tipo: 'texto_longo',
      obrigatoria: true,
      placeholder: 'AUTOMAÇÃO: Não desejo/Básica/Intermediária/Avançada/Casa inteligente completa. Funções: iluminação automatizada, cortinas automáticas, climatização inteligente, som ambiente, segurança integrada, irrigação automática, controle smartphone. CLIMATIZAÇÃO: ar condicionado central/split, aquecimento, ventilação forçada. AQUECIMENTO ÁGUA: Solar/Elétrico/Gás/Híbrido/Instantâneo. ENERGIA SOLAR: Sim agora/Preparar estrutura/Não há interesse. ÁGUA: Captação chuva, reuso águas cinzas. OUTROS: Aspiração central, irrigação automatizada, som ambiente, iluminação cênica. SEGURANÇA: alarme perimetral, câmeras, sensores movimento, controle acesso, monitoramento 24h',
      maxLength: 1000,
      secao: 'TECNOLOGIA, SISTEMAS E CONFORTO OPERACIONAL'
    },
    {
      id: 'TECNOLOGIA_02',
      texto: 'Nível de integração desejada (total, parcial, manual)',
      tipo: 'select',
      opcoes: [
        'Integração total (todos os sistemas conectados)',
        'Integração parcial (alguns sistemas conectados)',
        'Sistemas independentes (controle manual)',
        'Não sei, preciso de orientação'
      ],
      obrigatoria: true,
      secao: 'TECNOLOGIA, SISTEMAS E CONFORTO OPERACIONAL'
    },
    {
      id: 'TECNOLOGIA_02_DETALHES',
      texto: 'Especificar quais sistemas devem ser integrados:',
      tipo: 'texto_longo',
      obrigatoria: false,
      placeholder: 'Especifique quais sistemas devem ser conectados entre si',
      maxLength: 400,
      dependeDe: 'TECNOLOGIA_02',
      secao: 'TECNOLOGIA, SISTEMAS E CONFORTO OPERACIONAL'
    },
    {
      id: 'TECNOLOGIA_03',
      texto: 'Preocupação com obsolescência tecnológica',
      tipo: 'select',
      opcoes: [
        'Muito preocupado, prefiro tecnologias consolidadas',
        'Preocupado, mas aceito algumas inovações',
        'Pouco preocupado, gosto de tecnologias novas',
        'Não preocupado, quero o mais avançado disponível'
      ],
      obrigatoria: true,
      secao: 'TECNOLOGIA, SISTEMAS E CONFORTO OPERACIONAL'
    },
    {
      id: 'TECNOLOGIA_03_DETALHES',
      texto: 'Especificar preferências tecnológicas:',
      tipo: 'texto_longo',
      obrigatoria: false,
      placeholder: 'Marque preferências: marcas consolidadas, sistemas com upgrade possível, tecnologias com suporte garantido, padrões abertos (não proprietários)',
      maxLength: 400,
      dependeDe: 'TECNOLOGIA_03',
      secao: 'TECNOLOGIA, SISTEMAS E CONFORTO OPERACIONAL'
    },
    {
      id: 'TECNOLOGIA_04',
      texto: 'Orçamento previsto para implantação e manutenção dos sistemas',
      tipo: 'texto_longo',
      obrigatoria: true,
      placeholder: 'Orçamento para sistemas (R$), Orçamento anual manutenção (R$). Prioridade: Menor custo inicial/Menor custo operacional/Equilíbrio/Qualidade independente do custo',
      maxLength: 400,
      secao: 'TECNOLOGIA, SISTEMAS E CONFORTO OPERACIONAL'
    },
    {
      id: 'TECNOLOGIA_05',
      texto: 'Interesse em redundância (backup de energia, segurança, etc.)',
      tipo: 'texto_longo',
      obrigatoria: true,
      placeholder: 'Marque interesses: Backup energia (gerador/nobreak), Backup internet (múltiplos provedores), Backup segurança (múltiplos sistemas), Backup água (reserva extra/poço), Não há interesse em redundância. Especificar outras necessidades de backup.',
      maxLength: 400,
      secao: 'TECNOLOGIA, SISTEMAS E CONFORTO OPERACIONAL'
    },
    {
      id: 'TECNOLOGIA_06',
      texto: 'Prioridade: menor custo inicial ou maior eficiência operacional?',
      tipo: 'select',
      opcoes: [
        'Prioridade total para menor custo inicial',
        'Preferência por menor custo, mas aceito eficiência',
        'Equilíbrio entre custo inicial e eficiência',
        'Preferência por eficiência, mesmo com custo maior',
        'Prioridade total para eficiência operacional'
      ],
      obrigatoria: true,
      secao: 'TECNOLOGIA, SISTEMAS E CONFORTO OPERACIONAL'
    },

    // ===== 8. SUSTENTABILIDADE E EFICIÊNCIA =====
    {
      id: 'SUSTENTABILIDADE_01',
      texto: 'Grau de interesse: Materiais ecológicos, Certificações ambientais, Eficiência energética, Telhado verde, Captação/reuso água, Energia renovável, Neutralidade carbono',
      tipo: 'texto_longo',
      obrigatoria: true,
      placeholder: 'Para cada item, indique interesse (Nenhum ←→ Muito): Materiais ecológicos/sustentáveis, Certificações ambientais (LEED/AQUA/Casa Azul), Eficiência energética máxima, Telhado verde/jardins verticais, Captação e reuso água, Energia renovável (solar/eólica), Neutralidade carbono, Gestão resíduos construção',
      maxLength: 600,
      secao: 'SUSTENTABILIDADE E EFICIÊNCIA'
    },
    {
      id: 'SUSTENTABILIDADE_02',
      texto: 'Existe orçamento específico para soluções sustentáveis?',
      tipo: 'select',
      opcoes: [
        'Sim, orçamento específico definido',
        'Sim, mas sem valor definido ainda',
        'Não, deve estar incluído no orçamento geral',
        'Não há orçamento para sustentabilidade'
      ],
      obrigatoria: true,
      secao: 'SUSTENTABILIDADE E EFICIÊNCIA'
    },
    {
      id: 'SUSTENTABILIDADE_03',
      texto: 'Conhecimento sobre manutenção desses sistemas',
      tipo: 'select',
      opcoes: [
        'Tenho conhecimento e experiência',
        'Conhecimento básico, mas disposto a aprender',
        'Pouco conhecimento, preciso de orientação',
        'Nenhum conhecimento, prefiro sistemas simples'
      ],
      obrigatoria: true,
      secao: 'SUSTENTABILIDADE E EFICIÊNCIA'
    },
    {
      id: 'SUSTENTABILIDADE_04',
      texto: 'Preocupação com impacto ambiental da construção e operação',
      tipo: 'select',
      opcoes: [
        'Muito preocupado, é prioridade máxima',
        'Preocupado, mas com limitações orçamentárias',
        'Moderadamente preocupado',
        'Pouco preocupado'
      ],
      obrigatoria: true,
      secao: 'SUSTENTABILIDADE E EFICIÊNCIA'
    },
    {
      id: 'SUSTENTABILIDADE_04_DETALHES',
      texto: 'Especificar preocupações ambientais:',
      tipo: 'texto_longo',
      obrigatoria: false,
      placeholder: 'Marque preocupações: Materiais baixa pegada carbono, Fornecedores locais/regionais, Gestão resíduos obra, Compensação ambiental, Certificação ambiental',
      maxLength: 400,
      dependeDe: 'SUSTENTABILIDADE_04',
      secao: 'SUSTENTABILIDADE E EFICIÊNCIA'
    },
    {
      id: 'SUSTENTABILIDADE_05',
      texto: 'Expectativa de retorno sobre investimento sustentável (financeiro ou ambiental)',
      tipo: 'texto_longo',
      obrigatoria: true,
      placeholder: 'Tipo de retorno: financeiro importante (economia energia/água), retorno ambiental mais importante, ambos importantes, não espero retorno (questão de valores). Se retorno financeiro importante, prazo esperado (anos)',
      maxLength: 400,
      secao: 'SUSTENTABILIDADE E EFICIÊNCIA'
    },

    // ===== 9. GESTÃO DO PROCESSO, LICENÇAS E RISCOS =====
    {
      id: 'GESTAO_01',
      texto: 'Frequência desejada de reuniões e forma (presencial, online)',
      tipo: 'texto_longo',
      obrigatoria: true,
      placeholder: 'Frequência: Semanal/Quinzenal/Mensal/Conforme necessidade/Apenas marcos importantes. Modalidade: Presencial/Videochamada/Telefone/WhatsApp/E-mail. Duração: 30min/1h/1,5h/2h/Flexível. Horário: Manhã/Tarde/Noite/Fins semana/Flexível',
      maxLength: 400,
      secao: 'GESTÃO DO PROCESSO, LICENÇAS E RISCOS'
    },
    {
      id: 'GESTAO_02',
      texto: 'Quem será o interlocutor principal?',
      tipo: 'texto_longo',
      obrigatoria: true,
      placeholder: 'Nome do interlocutor principal. Características: tem autoridade decisões técnicas/financeiras, precisa consultar outros, disponível horário comercial/fora horário, conhecimento técnico construção',
      maxLength: 300,
      secao: 'GESTÃO DO PROCESSO, LICENÇAS E RISCOS'
    },
    {
      id: 'GESTAO_03',
      texto: 'Processo interno de validação familiar (necessário consenso? veto?)',
      tipo: 'select',
      opcoes: [
        'Decisões são tomadas pelo interlocutor principal',
        'Necessário consenso familiar para decisões importantes',
        'Algumas pessoas têm poder de veto',
        'Processo democrático (votação familiar)'
      ],
      obrigatoria: true,
      secao: 'GESTÃO DO PROCESSO, LICENÇAS E RISCOS'
    },
    {
      id: 'GESTAO_03_DETALHES',
      texto: 'Especificar como funciona o processo:',
      tipo: 'texto_longo',
      obrigatoria: false,
      placeholder: 'Descreva como funciona o processo de tomada de decisão familiar',
      maxLength: 400,
      dependeDe: 'GESTAO_03',
      secao: 'GESTÃO DO PROCESSO, LICENÇAS E RISCOS'
    },
    {
      id: 'GESTAO_04',
      texto: 'Expectativa sobre: Comunicação (formal, informal, detalhada, resumida); Apresentações (renderizações, maquetes, 3D, plantas técnicas)',
      tipo: 'texto_longo',
      obrigatoria: true,
      placeholder: 'Estilo comunicação: Formal/técnica, Informal/amigável, Mista. Nível detalhamento: Resumido/principais pontos, Padrão/equilibrado, Detalhado/completo. Tipo apresentação: Plantas técnicas, Renderizações 3D, Maquetes físicas/eletrônicas, Realidade virtual, Apenas plantas básicas',
      maxLength: 500,
      secao: 'GESTÃO DO PROCESSO, LICENÇAS E RISCOS'
    },
    {
      id: 'GESTAO_05',
      texto: 'Já há consulta prévia na prefeitura? Documentação do terreno regularizada?',
      tipo: 'texto_longo',
      obrigatoria: true,
      placeholder: 'Consulta prévia prefeitura: Sim já feita/Não mas pretendo fazer/Não sei se necessário. Documentação terreno: Totalmente regularizada/Parcialmente/Não regularizada/Não sei. Documentos disponíveis: Escritura, Matrícula atualizada, IPTU em dia, Certidões negativas, Guia amarela/diretrizes, Outros',
      maxLength: 500,
      secao: 'GESTÃO DO PROCESSO, LICENÇAS E RISCOS'
    },
    {
      id: 'GESTAO_06',
      texto: 'Necessita apoio para: Aprovação na prefeitura; Aprovação em bombeiros; Estudos ambientais, impacto de vizinhança ou outros órgãos',
      tipo: 'texto_longo',
      obrigatoria: true,
      placeholder: 'Apoio necessário: Aprovação prefeitura (alvará construção), Aprovação bombeiros (PPCI/AVCB), Estudos ambientais, Estudo impacto vizinhança, Aprovação concessionárias, Outros órgãos, Não necessito apoio. Tipo apoio: Orientação apenas/Acompanhamento/Gestão completa',
      maxLength: 500,
      secao: 'GESTÃO DO PROCESSO, LICENÇAS E RISCOS'
    },
    {
      id: 'GESTAO_07',
      texto: 'Expectativas de cronograma: Entrega do projeto; Início da obra; Conclusão da obra',
      tipo: 'texto_longo',
      obrigatoria: true,
      placeholder: 'Há prazo limite para: entrega projeto (data), início obra (data), conclusão obra (data)? Motivo dos prazos (se houver)',
      maxLength: 400,
      secao: 'GESTÃO DO PROCESSO, LICENÇAS E RISCOS'
    },
    {
      id: 'GESTAO_08',
      texto: 'Tolerância a: Atrasos; Mudanças de escopo; Variações de custo',
      tipo: 'texto_longo',
      obrigatoria: true,
      placeholder: 'Tolerância atrasos: Nenhuma ←→ Alta + atraso máximo aceitável (dias). Tolerância mudanças escopo: Escopo fixo ←→ flexível. Tolerância variações custo: Orçamento fixo ←→ flexível + variação máxima aceitável (%)',
      maxLength: 400,
      secao: 'GESTÃO DO PROCESSO, LICENÇAS E RISCOS'
    },
    {
      id: 'GESTAO_09',
      texto: 'Seguro obra, plano de contingência, gestão de imprevistos',
      tipo: 'texto_longo',
      obrigatoria: true,
      placeholder: 'Marque interesses: Seguro obra (incêndio/roubo/danos), Seguro responsabilidade civil, Plano contingência atrasos, Reserva financeira imprevistos, Fornecedores alternativos mapeados, Não há interesse seguros/contingências. Especificar outras preocupações.',
      maxLength: 500,
      secao: 'GESTÃO DO PROCESSO, LICENÇAS E RISCOS'
    },
    {
      id: 'GESTAO_10',
      texto: 'Histórico de problemas na região com licenciamento, fornecimento, mão de obra',
      tipo: 'select',
      opcoes: [
        'Não há histórico de problemas conhecidos',
        'Sim, problemas com licenciamento/aprovações',
        'Sim, problemas com fornecimento de materiais',
        'Sim, problemas com mão de obra qualificada',
        'Sim, outros problemas (especificar)'
      ],
      obrigatoria: true,
      secao: 'GESTÃO DO PROCESSO, LICENÇAS E RISCOS'
    },
    {
      id: 'GESTAO_10_DETALHES',
      texto: 'Detalhes sobre os problemas conhecidos:',
      tipo: 'texto_longo',
      obrigatoria: false,
      placeholder: 'Descreva os problemas conhecidos na região',
      maxLength: 500,
      dependeDe: 'GESTAO_10',
      secao: 'GESTÃO DO PROCESSO, LICENÇAS E RISCOS'
    },

    // ===== 10. ACABAMENTOS, MATERIAIS E SEGURANÇA =====
    {
      id: 'ACABAMENTOS_01',
      texto: 'Padrão de acabamento desejado: Pisos; Paredes; Tetos; Louças e metais; Esquadrias',
      tipo: 'texto_longo',
      obrigatoria: true,
      placeholder: 'Padrão geral: Simples/econômico, Médio/padrão, Alto/premium, Luxo/importado, Misto por ambiente. Se misto, especificar padrão por categoria: Pisos, Paredes, Tetos, Louças e metais, Esquadrias (Econômico/Padrão/Premium/Luxo para cada)',
      maxLength: 500,
      secao: 'ACABAMENTOS, MATERIAIS E SEGURANÇA'
    },
    {
      id: 'ACABAMENTOS_02',
      texto: 'Preferência por marcas, fornecedores ou materiais específicos',
      tipo: 'texto_longo',
      obrigatoria: true,
      placeholder: 'Tem preferências por marcas específicas? Se sim, especificar marcas e produtos preferidos. Critérios escolha importantes: Marca reconhecida, Garantia estendida, Assistência técnica local, Sustentabilidade, Preço competitivo, Disponibilidade rápida',
      maxLength: 600,
      secao: 'ACABAMENTOS, MATERIAIS E SEGURANÇA'
    },
    {
      id: 'ACABAMENTOS_03',
      texto: 'Materiais a serem evitados',
      tipo: 'texto_longo',
      obrigatoria: true,
      placeholder: 'Marque materiais a evitar: Madeira (manutenção), Vidro (segurança/limpeza), Metais (oxidação), Pedras claras (manchas), Materiais porosos, Materiais importados, Materiais com VOC, Não há restrições específicas. Especificar outros materiais a evitar e motivos.',
      maxLength: 500,
      secao: 'ACABAMENTOS, MATERIAIS E SEGURANÇA'
    },
    {
      id: 'ACABAMENTOS_04',
      texto: 'Prioridade: Durabilidade; Manutenção fácil; Sustentabilidade; Rastreabilidade',
      tipo: 'texto_longo',
      obrigatoria: true,
      placeholder: 'Ordene por prioridade (1=mais importante): Durabilidade/vida útil longa, Manutenção fácil/baixo custo, Sustentabilidade/impacto ambiental, Rastreabilidade/origem conhecida, Estética/beleza, Custo/preço acessível',
      maxLength: 400,
      secao: 'ACABAMENTOS, MATERIAIS E SEGURANÇA'
    },
    {
      id: 'ACABAMENTOS_05',
      texto: 'Necessidade de garantia estendida',
      tipo: 'select',
      opcoes: ['Sim, garantia estendida é importante', 'Depende do item/sistema', 'Não é prioridade'],
      obrigatoria: true,
      secao: 'ACABAMENTOS, MATERIAIS E SEGURANÇA'
    },
    {
      id: 'ACABAMENTOS_05_DETALHES',
      texto: 'Especificar necessidades de garantia:',
      tipo: 'texto_longo',
      obrigatoria: false,
      placeholder: 'Marque itens importantes para garantia estendida: Estrutura e impermeabilização, Sistemas elétricos e hidráulicos, Esquadrias e vidros, Equipamentos (ar condicionado/automação), Acabamentos (pisos/revestimentos)',
      maxLength: 400,
      dependeDe: 'ACABAMENTOS_05',
      secao: 'ACABAMENTOS, MATERIAIS E SEGURANÇA'
    },
    {
      id: 'ACABAMENTOS_06',
      texto: 'Sistemas de segurança necessários: Alarmes; Câmeras; Portões automáticos; Cerca elétrica; Interfone/vídeo porteiro; Detecção e combate a incêndio; Controle de acesso',
      tipo: 'texto_longo',
      obrigatoria: true,
      placeholder: 'Marque sistemas desejados: Alarme perimetral, Câmeras segurança, Portões automáticos, Cerca elétrica, Interfone/vídeo porteiro, Detecção incêndio, Combate incêndio (sprinklers), Controle acesso (biometria/cartão), Iluminação segurança, Não necessário. Para cada sistema, especificar nível: Básico/Intermediário/Avançado',
      maxLength: 600,
      secao: 'ACABAMENTOS, MATERIAIS E SEGURANÇA'
    },
    {
      id: 'ACABAMENTOS_07',
      texto: 'Necessidades específicas de acessibilidade presentes ou futuras',
      tipo: 'select',
      opcoes: [
        'Não há necessidades atuais ou futuras',
        'Necessidades atuais específicas',
        'Preparação para necessidades futuras',
        'Acessibilidade universal (NBR 9050 completa)'
      ],
      obrigatoria: true,
      secao: 'ACABAMENTOS, MATERIAIS E SEGURANÇA'
    },
    {
      id: 'ACABAMENTOS_07_DETALHES',
      texto: 'Especificar necessidades de acessibilidade:',
      tipo: 'texto_longo',
      obrigatoria: false,
      placeholder: 'Marque necessidades: Rampas acesso, Elevador/preparação, Portas largas (80cm mínimo), Banheiro acessível, Barras apoio, Pisos antiderrapantes, Sinalização tátil, Automação facilitar uso',
      maxLength: 400,
      dependeDe: 'ACABAMENTOS_07',
      secao: 'ACABAMENTOS, MATERIAIS E SEGURANÇA'
    },

    // ===== 11. INFORMAÇÕES COMPLEMENTARES E ESPECIAIS =====
    {
      id: 'COMPLEMENTARES_01',
      texto: 'Restrições específicas',
      tipo: 'texto_longo',
      obrigatoria: false,
      placeholder: 'Descreva qualquer restrição específica não mencionada anteriormente (religiosas, culturais, pessoais, técnicas, etc.)',
      maxLength: 1000,
      secao: 'INFORMAÇÕES COMPLEMENTARES E ESPECIAIS'
    },
    {
      id: 'COMPLEMENTARES_02',
      texto: 'Prioridades absolutas no projeto',
      tipo: 'texto_longo',
      obrigatoria: true,
      placeholder: 'Descreva as prioridades absolutas que não podem ser comprometidas. Ordene as prioridades gerais: Funcionalidade, Estética, Conforto, Economia, Sustentabilidade, Tecnologia, Segurança, Privacidade',
      maxLength: 800,
      secao: 'INFORMAÇÕES COMPLEMENTARES E ESPECIAIS'
    },
    {
      id: 'COMPLEMENTARES_03',
      texto: 'Ambientes que podem ser eliminados, se necessário',
      tipo: 'texto_longo',
      obrigatoria: true,
      placeholder: 'Liste ambientes que podem ser eliminados se necessário. Em caso de restrição orçamentária: Eliminar ambientes/Reduzir padrão acabamento/Reduzir área ambientes/Não aceito eliminações',
      maxLength: 400,
      secao: 'INFORMAÇÕES COMPLEMENTARES E ESPECIAIS'
    },
    {
      id: 'COMPLEMENTARES_04',
      texto: 'Interesse por profissionais ou construtoras específicas',
      tipo: 'select',
      opcoes: [
        'Não tenho preferências específicas',
        'Sim, tenho indicações/preferências',
        'Sim, já trabalhei com profissionais específicos',
        'Preciso de indicações'
      ],
      obrigatoria: true,
      secao: 'INFORMAÇÕES COMPLEMENTARES E ESPECIAIS'
    },
    {
      id: 'COMPLEMENTARES_04_DETALHES',
      texto: 'Especificar profissionais/empresas ou critérios de escolha:',
      tipo: 'texto_longo',
      obrigatoria: false,
      placeholder: 'Especifique profissionais/empresas preferidos ou critérios de escolha',
      maxLength: 500,
      dependeDe: 'COMPLEMENTARES_04',
      secao: 'INFORMAÇÕES COMPLEMENTARES E ESPECIAIS'
    },
    {
      id: 'COMPLEMENTARES_05',
      texto: 'Já possui projetos preliminares ou estudos anteriores?',
      tipo: 'select',
      opcoes: [
        'Não, este é o primeiro estudo',
        'Sim, tenho esboços/croquis próprios',
        'Sim, tenho projeto preliminar de outro profissional',
        'Sim, tenho projeto completo anterior'
      ],
      obrigatoria: true,
      secao: 'INFORMAÇÕES COMPLEMENTARES E ESPECIAIS'
    },
    {
      id: 'COMPLEMENTARES_06',
      texto: 'Hobbies, rituais, costumes, tradições que impactam o projeto',
      tipo: 'texto_longo',
      obrigatoria: false,
      placeholder: 'Descreva hobbies, rituais familiares, tradições culturais ou religiosas, costumes específicos que devem ser considerados no projeto.',
      maxLength: 1000,
      secao: 'INFORMAÇÕES COMPLEMENTARES E ESPECIAIS'
    },
    {
      id: 'COMPLEMENTARES_07',
      texto: 'Qualquer outra informação relevante para o desenvolvimento do projeto',
      tipo: 'texto_longo',
      obrigatoria: false,
      placeholder: 'Inclua qualquer informação adicional que considere importante para o desenvolvimento do projeto (sonhos, inspirações, preocupações, experiências passadas, etc.)',
      maxLength: 1500,
      secao: 'INFORMAÇÕES COMPLEMENTARES E ESPECIAIS'
    }
  ],

  secoes: [
    {
      id: 'dados_cliente',
      nome: 'DADOS GERAIS DO CLIENTE E FAMÍLIA',
      icone: '👥',
      descricao: 'Informações sobre a família e experiências anteriores',
      ordem: 1
    },
    {
      id: 'financeiro',
      nome: 'VIABILIDADE FINANCEIRA E PLANEJAMENTO ORÇAMENTÁRIO',
      icone: '💰',
      descricao: 'Orçamento, financiamento e planejamento financeiro',
      ordem: 2
    },
    {
      id: 'terreno',
      nome: 'TERRENO E CONTEXTO URBANO',
      icone: '📍',
      descricao: 'Características do terreno e contexto urbano',
      ordem: 3
    },
    {
      id: 'programa',
      nome: 'PROGRAMA DE NECESSIDADES',
      icone: '🏠',
      descricao: 'Ambientes e necessidades espaciais',
      ordem: 4
    },
    {
      id: 'funcionalidade',
      nome: 'FUNCIONALIDADE, CONFORTO E ERGONOMIA',
      icone: '⚡',
      descricao: 'Rotinas, funcionalidade e ergonomia',
      ordem: 5
    },
    {
      id: 'estetica',
      nome: 'ESTILO, ESTÉTICA E DIRECIONAMENTO VISUAL',
      icone: '🎨',
      descricao: 'Preferências visuais e direcionamento estético',
      ordem: 6
    },
    {
      id: 'tecnologia',
      nome: 'TECNOLOGIA, SISTEMAS E CONFORTO OPERACIONAL',
      icone: '🔧',
      descricao: 'Automação, sistemas e tecnologias',
      ordem: 7
    },
    {
      id: 'sustentabilidade',
      nome: 'SUSTENTABILIDADE E EFICIÊNCIA',
      icone: '🌱',
      descricao: 'Práticas sustentáveis e eficiência',
      ordem: 8
    },
    {
      id: 'gestao',
      nome: 'GESTÃO DO PROCESSO, LICENÇAS E RISCOS',
      icone: '📋',
      descricao: 'Processo, licenças e gestão de riscos',
      ordem: 9
    },
    {
      id: 'acabamentos',
      nome: 'ACABAMENTOS, MATERIAIS E SEGURANÇA',
      icone: '🛡️',
      descricao: 'Materiais, acabamentos e segurança',
      ordem: 10
    },
    {
      id: 'complementares',
      nome: 'INFORMAÇÕES COMPLEMENTARES E ESPECIAIS',
      icone: '📝',
      descricao: 'Informações adicionais e específicas',
      ordem: 11
    }
  ],

  metadados: {
    criadoEm: '2024-12-19',
    atualizadoEm: '2024-12-19',
    baseadoEm: 'Especificações detalhadas do sistema completo de briefing arquitetônico',
    tags: ['residencial', 'casa', 'unifamiliar', 'sistema-completo', '151-perguntas', 'especificacao-detalhada'],
    status: 'ativo',
    melhorias: [
      '✅ 157 perguntas organizadas em 11 seções lógicas',
      '✅ Composição familiar desmembrada em 7 perguntas específicas',
      '✅ Todos os tipos de campo compatíveis com o sistema',
      '✅ Validações apropriadas e campos condicionais',
      '✅ Placeholders informativos e ajuda contextual',
      '✅ Estrutura baseada em especificações detalhadas',
      '✅ Sistema completo de briefing arquitetônico',
      '✅ Compatibilidade total com frontend existente'
    ]
  }
}; 