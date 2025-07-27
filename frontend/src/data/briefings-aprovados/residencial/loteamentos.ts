import { BriefingCompleto } from '../../../types/briefing';

export const briefingLoteamentos: BriefingCompleto = {
  id: 'residencial-loteamentos-completo',
  nome: 'Loteamentos e Parcelamentos',
  categoria: 'residencial',
  subcategoria: 'loteamentos',
  versao: '1.0',
  descricao: 'Briefing especializado para projetos de loteamentos, parcelamentos urbanos e desenvolvimento imobiliário',
  tags: ['residencial', 'loteamentos', 'parcelamento', 'urbanismo', 'incorporacao', 'desenvolvimento', 'imobiliario', 'infraestrutura'],
  
  estimativaTempo: '120-180 minutos',
  complexidade: 'muito_alta',
  
  especialização: {
    area: 'Loteamentos e Parcelamentos Urbanos',
    mercado: 'Desenvolvimento imobiliário, incorporação, urbanização',
    publico: 'Incorporadoras, construtoras, urbanistas, investidores',
    aplicacao: 'Loteamentos residenciais, parcelamentos urbanos, condomínios horizontais'
  },

  // Seção 1: Identificação e Viabilidade (25 perguntas)
  secoes: [
    {
      id: 'identificacao-viabilidade',
      nome: '📊 Identificação e Viabilidade',
      descricao: 'Dados básicos do empreendimento e análise de viabilidade técnica, legal e econômica',
      icon: '📊',
      obrigatoria: true,
      perguntas: [
        // 1.1 Dados do Empreendimento
        {
          id: 'nome-empreendimento',
          pergunta: 'Qual o nome preliminar do empreendimento?',
          tipo: 'text',
          obrigatoria: true,
          placeholder: 'Ex: Residencial Vale Verde, Jardim das Águas...'
        },
        {
          id: 'localizacao-gleba',
          pergunta: 'Qual a localização exata da gleba (endereço completo, coordenadas geográficas)?',
          tipo: 'textarea',
          obrigatoria: true,
          placeholder: 'Endereço completo, município, coordenadas GPS...'
        },
        {
          id: 'area-total',
          pergunta: 'Qual a área total da gleba em m² ou hectares?',
          tipo: 'numero',
          obrigatoria: true,
          placeholder: 'Ex: 150.000 m² ou 15 hectares'
        },
        {
          id: 'proprietarios-investidores',
          pergunta: 'Quem são os proprietários e investidores envolvidos?',
          tipo: 'textarea',
          obrigatoria: true,
          placeholder: 'Nome dos proprietários, investidores, participação societária...'
        },
        {
          id: 'publico-alvo',
          pergunta: 'Qual o público-alvo do empreendimento (classe social, faixa etária, perfil familiar)?',
          tipo: 'textarea',
          obrigatoria: true,
          placeholder: 'Perfil demográfico, socioeconômico, familiar...'
        },
        
        // 1.2 Viabilidade Técnica e Legal
        {
          id: 'levantamento-planialti',
          pergunta: 'Existe levantamento planialtimétrico cadastral da área?',
          tipo: 'select',
          obrigatoria: true,
          opcoes: ['Sim, completo', 'Sim, parcial', 'Não existe', 'Em andamento']
        },
        {
          id: 'situacao-legal',
          pergunta: 'Qual a situação legal do terreno (matrícula, CCIR, CAR, ITR)?',
          tipo: 'textarea',
          obrigatoria: true,
          placeholder: 'Situação da matrícula, documentos, regularização...'
        },
        {
          id: 'restricoes-ambientais',
          pergunta: 'Existem restrições ambientais conhecidas (APP, reserva legal, corpos d\'água)?',
          tipo: 'textarea',
          obrigatoria: true,
          placeholder: 'Áreas de preservação, restrições ambientais...'
        },
        {
          id: 'zoneamento-indices',
          pergunta: 'Qual o zoneamento e índices urbanísticos aplicáveis à área?',
          tipo: 'textarea',
          obrigatoria: true,
          placeholder: 'Zoneamento municipal, índices de ocupação...'
        },
        {
          id: 'diretrizes-municipais',
          pergunta: 'Existem diretrizes municipais específicas para parcelamento na região?',
          tipo: 'textarea',
          obrigatoria: true,
          placeholder: 'Diretrizes específicas, regulamentações locais...'
        },
        {
          id: 'infraestrutura-entorno',
          pergunta: 'Há infraestrutura urbana disponível no entorno (água, esgoto, energia, drenagem)?',
          tipo: 'multiple',
          obrigatoria: true,
          opcoes: ['Água potável', 'Esgoto sanitário', 'Energia elétrica', 'Drenagem pluvial', 'Gás canalizado', 'Telecomunicações', 'Iluminação pública']
        },
        {
          id: 'servidoes-restricoes',
          pergunta: 'Existem servidões, faixas de domínio ou restrições na gleba?',
          tipo: 'textarea',
          obrigatoria: true,
          placeholder: 'Servidões, faixas de domínio, restrições...'
        },
        {
          id: 'estudos-geotecnicos',
          pergunta: 'Há estudos geotécnicos preliminares da área?',
          tipo: 'select',
          obrigatoria: true,
          opcoes: ['Sim, completos', 'Sim, parciais', 'Não existem', 'Em andamento']
        },
        {
          id: 'regularizacao-fundiaria',
          pergunta: 'Existem processos de regularização fundiária em andamento?',
          tipo: 'select',
          obrigatoria: true,
          opcoes: ['Sim', 'Não', 'Não sei', 'Em análise']
        },
        {
          id: 'impedimentos-legais',
          pergunta: 'Há algum impedimento legal conhecido para o parcelamento?',
          tipo: 'textarea',
          obrigatoria: true,
          placeholder: 'Impedimentos, processos, restrições legais...'
        },

        // 1.3 Viabilidade Econômica
        {
          id: 'investimento-estimado',
          pergunta: 'Qual o valor estimado de investimento disponível para o empreendimento?',
          tipo: 'moeda',
          obrigatoria: true,
          placeholder: 'R$ 0,00'
        },
        {
          id: 'vgv-esperado',
          pergunta: 'Qual o valor geral de vendas (VGV) esperado?',
          tipo: 'moeda',
          obrigatoria: true,
          placeholder: 'R$ 0,00'
        },
        {
          id: 'prazo-aprovacao',
          pergunta: 'Qual o prazo estimado para desenvolvimento e aprovação do projeto?',
          tipo: 'select',
          obrigatoria: true,
          opcoes: ['6 meses', '12 meses', '18 meses', '24 meses', 'Mais de 24 meses']
        },
        {
          id: 'prazo-implantacao',
          pergunta: 'Qual o prazo estimado para implantação da infraestrutura?',
          tipo: 'select',
          obrigatoria: true,
          opcoes: ['12 meses', '18 meses', '24 meses', '36 meses', 'Mais de 36 meses']
        },
        {
          id: 'roi-expectativa',
          pergunta: 'Qual a expectativa de retorno sobre o investimento (ROI)?',
          tipo: 'select',
          obrigatoria: true,
          opcoes: ['15-20%', '20-25%', '25-30%', '30-40%', 'Acima de 40%']
        },
        {
          id: 'estudo-mercado',
          pergunta: 'Existe estudo de mercado para a região?',
          tipo: 'select',
          obrigatoria: true,
          opcoes: ['Sim, completo', 'Sim, parcial', 'Não existe', 'Em desenvolvimento']
        },
        {
          id: 'valor-m2-regiao',
          pergunta: 'Qual o valor médio do m² na região?',
          tipo: 'moeda',
          obrigatoria: true,
          placeholder: 'R$ 0,00'
        },
        {
          id: 'concorrentes',
          pergunta: 'Quais os principais concorrentes na região?',
          tipo: 'textarea',
          obrigatoria: true,
          placeholder: 'Empreendimentos concorrentes, características...'
        },
        {
          id: 'velocidade-vendas',
          pergunta: 'Qual a velocidade de vendas esperada?',
          tipo: 'select',
          obrigatoria: true,
          opcoes: ['5-10 lotes/mês', '10-20 lotes/mês', '20-30 lotes/mês', '30-50 lotes/mês', 'Mais de 50 lotes/mês']
        },
        {
          id: 'financiamento-previsto',
          pergunta: 'Existe financiamento previsto para o empreendimento?',
          tipo: 'textarea',
          obrigatoria: true,
          placeholder: 'Tipo de financiamento, instituições, condições...'
        }
      ]
    },

    // Seção 2: Conceito e Posicionamento (20 perguntas)
    {
      id: 'conceito-posicionamento',
      nome: '🎯 Conceito e Posicionamento',
      descricao: 'Conceito do empreendimento, posicionamento de mercado e estratégia de branding',
      icon: '🎯',
      obrigatoria: true,
      perguntas: [
        // 2.1 Conceito do Empreendimento
        {
          id: 'conceito-central',
          pergunta: 'Qual o conceito central do loteamento (ex: sustentável, tecnológico, exclusivo)?',
          tipo: 'textarea',
          obrigatoria: true,
          placeholder: 'Conceito principal, tema, identidade...'
        },
        {
          id: 'diferenciais-competitivos',
          pergunta: 'Quais os principais diferenciais competitivos pretendidos?',
          tipo: 'textarea',
          obrigatoria: true,
          placeholder: 'Diferenciais únicos, vantagens competitivas...'
        },
        {
          id: 'identidade-visual',
          pergunta: 'Existe algum tema ou identidade visual já definida?',
          tipo: 'textarea',
          obrigatoria: false,
          placeholder: 'Tema, cores, estilo visual...'
        },
        {
          id: 'referencias-inspiracao',
          pergunta: 'Há referências de outros empreendimentos que sirvam de inspiração?',
          tipo: 'textarea',
          obrigatoria: false,
          placeholder: 'Empreendimentos de referência, características...'
        },
        {
          id: 'nivel-exclusividade',
          pergunta: 'Qual o nível de exclusividade pretendido?',
          tipo: 'select',
          obrigatoria: true,
          opcoes: ['Popular', 'Médio padrão', 'Alto padrão', 'Luxo', 'Ultra luxo']
        },

        // 2.2 Posicionamento de Mercado
        {
          id: 'posicionamento-mercado',
          pergunta: 'Como o empreendimento se posicionará no mercado local?',
          tipo: 'textarea',
          obrigatoria: true,
          placeholder: 'Posicionamento estratégico, nicho de mercado...'
        },
        {
          id: 'vantagens-localizacao',
          pergunta: 'Quais as principais vantagens competitivas da localização?',
          tipo: 'textarea',
          obrigatoria: true,
          placeholder: 'Vantagens da localização, proximidades, acessos...'
        },
        {
          id: 'proposta-valor',
          pergunta: 'Qual a proposta de valor única do empreendimento?',
          tipo: 'textarea',
          obrigatoria: true,
          placeholder: 'Proposta de valor, benefícios únicos...'
        },
        {
          id: 'amenidades-exclusivas',
          pergunta: 'Quais amenidades exclusivas serão oferecidas?',
          tipo: 'textarea',
          obrigatoria: true,
          placeholder: 'Amenidades, serviços exclusivos, diferenciais...'
        },
        {
          id: 'perfil-compradores',
          pergunta: 'Qual o perfil socioeconômico dos compradores-alvo?',
          tipo: 'textarea',
          obrigatoria: true,
          placeholder: 'Perfil demográfico, renda, estilo de vida...'
        },

        // 2.3 Branding e Marketing
        {
          id: 'estrategia-marca',
          pergunta: 'Existe uma estratégia de marca já definida?',
          tipo: 'select',
          obrigatoria: true,
          opcoes: ['Sim, completa', 'Sim, parcial', 'Não existe', 'Em desenvolvimento']
        },
        {
          id: 'valores-marca',
          pergunta: 'Quais valores a marca do empreendimento deve transmitir?',
          tipo: 'textarea',
          obrigatoria: true,
          placeholder: 'Valores, conceitos, mensagens da marca...'
        },
        {
          id: 'elementos-visuais',
          pergunta: 'Há preferências por cores, estilos ou elementos visuais específicos?',
          tipo: 'textarea',
          obrigatoria: false,
          placeholder: 'Cores, estilos, elementos visuais preferidos...'
        },
        {
          id: 'integracao-marketing',
          pergunta: 'Como o projeto se integrará à estratégia de marketing?',
          tipo: 'textarea',
          obrigatoria: true,
          placeholder: 'Integração com marketing, comunicação...'
        },
        {
          id: 'elementos-arquitetonicos',
          pergunta: 'Quais elementos arquitetônicos e urbanísticos devem reforçar a identidade da marca?',
          tipo: 'textarea',
          obrigatoria: true,
          placeholder: 'Elementos arquitetônicos, urbanísticos, paisagísticos...'
        },
        {
          id: 'slogan-posicionamento',
          pergunta: 'Existe algum slogan ou posicionamento já definido?',
          tipo: 'textarea',
          obrigatoria: false,
          placeholder: 'Slogan, tagline, posicionamento...'
        },
        {
          id: 'canais-venda',
          pergunta: 'Quais canais de venda serão utilizados?',
          tipo: 'multiple',
          obrigatoria: true,
          opcoes: ['Stand de vendas', 'Corretores', 'Online', 'Telefone', 'Indicação', 'Eventos']
        },
        {
          id: 'stand-vendas',
          pergunta: 'Haverá stand de vendas no local? Com quais características?',
          tipo: 'textarea',
          obrigatoria: true,
          placeholder: 'Características do stand, localização, estrutura...'
        },
        {
          id: 'materiais-promocionais',
          pergunta: 'Quais materiais promocionais serão desenvolvidos?',
          tipo: 'multiple',
          obrigatoria: true,
          opcoes: ['Folder', 'Maquete', 'Vídeo', 'Site', 'App', 'Realidade virtual', 'Plantas decoradas']
        },
        {
          id: 'estrategia-lancamento',
          pergunta: 'Como será a estratégia de lançamento?',
          tipo: 'textarea',
          obrigatoria: true,
          placeholder: 'Estratégia de lançamento, eventos, cronograma...'
        }
      ]
    },

    // Seção 3: Análise do Terreno e Contexto (25 perguntas)
    {
      id: 'analise-terreno-contexto',
      nome: '🏞️ Análise do Terreno e Contexto',
      descricao: 'Características físicas do terreno, contexto urbano e aspectos ambientais',
      icon: '🏞️',
      obrigatoria: true,
      perguntas: [
        // 3.1 Características Físicas
        {
          id: 'topografia-terreno',
          pergunta: 'Qual a topografia predominante do terreno (plano, ondulado, acidentado)?',
          tipo: 'select',
          obrigatoria: true,
          opcoes: ['Plano', 'Levemente ondulado', 'Ondulado', 'Acidentado', 'Muito acidentado']
        },
        {
          id: 'corpos-agua',
          pergunta: 'Existem corpos d\'água na gleba ou no entorno imediato?',
          tipo: 'textarea',
          obrigatoria: true,
          placeholder: 'Rios, córregos, lagos, nascentes...'
        },
        {
          id: 'caracteristicas-solo',
          pergunta: 'Quais as características do solo (tipo, resistência, permeabilidade)?',
          tipo: 'textarea',
          obrigatoria: true,
          placeholder: 'Tipo de solo, características geotécnicas...'
        },
        {
          id: 'areas-alagadicas',
          pergunta: 'Há áreas alagadiças ou sujeitas a inundações?',
          tipo: 'select',
          obrigatoria: true,
          opcoes: ['Não', 'Sim, poucas áreas', 'Sim, áreas significativas', 'Sim, grande parte', 'Não sei']
        },
        {
          id: 'formacoes-rochosas',
          pergunta: 'Existem formações rochosas ou outros elementos geológicos relevantes?',
          tipo: 'textarea',
          obrigatoria: true,
          placeholder: 'Rochas, afloramentos, elementos geológicos...'
        },
        {
          id: 'cobertura-vegetal',
          pergunta: 'Qual a cobertura vegetal existente (mata nativa, reflorestamento, campo)?',
          tipo: 'textarea',
          obrigatoria: true,
          placeholder: 'Tipo de vegetação, densidade, área coberta...'
        },
        {
          id: 'especies-protegidas',
          pergunta: 'Há espécies arbóreas protegidas ou de interesse para preservação?',
          tipo: 'textarea',
          obrigatoria: true,
          placeholder: 'Espécies protegidas, árvores de interesse...'
        },
        {
          id: 'nascentes-agua',
          pergunta: 'Existem nascentes ou olhos d\'água na propriedade?',
          tipo: 'select',
          obrigatoria: true,
          opcoes: ['Não', 'Sim, 1-2 nascentes', 'Sim, 3-5 nascentes', 'Sim, mais de 5', 'Não sei']
        },
        {
          id: 'declividade-terreno',
          pergunta: 'Qual a declividade média e máxima do terreno?',
          tipo: 'textarea',
          obrigatoria: true,
          placeholder: 'Declividade média e máxima em percentual...'
        },
        {
          id: 'areas-risco-geotecnico',
          pergunta: 'Há áreas de risco geotécnico identificadas?',
          tipo: 'textarea',
          obrigatoria: true,
          placeholder: 'Áreas de risco, instabilidade, erosão...'
        },

        // 3.2 Contexto Urbano
        {
          id: 'vias-acesso',
          pergunta: 'Quais as principais vias de acesso ao terreno?',
          tipo: 'textarea',
          obrigatoria: true,
          placeholder: 'Vias de acesso, rodovias, ruas principais...'
        },
        {
          id: 'distancia-centro',
          pergunta: 'Qual a distância e tempo até o centro da cidade?',
          tipo: 'text',
          obrigatoria: true,
          placeholder: 'Ex: 15 km, 20 minutos de carro'
        },
        {
          id: 'equipamentos-urbanos',
          pergunta: 'Quais equipamentos urbanos existem no entorno (escolas, hospitais, comércio)?',
          tipo: 'textarea',
          obrigatoria: true,
          placeholder: 'Escolas, hospitais, comércio, serviços...'
        },
        {
          id: 'transporte-publico',
          pergunta: 'Há transporte público disponível? De que tipo e com qual frequência?',
          tipo: 'textarea',
          obrigatoria: true,
          placeholder: 'Tipo de transporte, linhas, frequência...'
        },
        {
          id: 'polos-trafego',
          pergunta: 'Quais os principais polos geradores de tráfego no entorno?',
          tipo: 'textarea',
          obrigatoria: true,
          placeholder: 'Shopping, universidades, empresas, indústrias...'
        },
        {
          id: 'planejamento-municipal',
          pergunta: 'Existe planejamento municipal para novas infraestruturas na região?',
          tipo: 'textarea',
          obrigatoria: true,
          placeholder: 'Obras planejadas, melhorias, expansões...'
        },
        {
          id: 'padroes-ocupacao',
          pergunta: 'Quais os padrões de ocupação predominantes no entorno?',
          tipo: 'multiple',
          obrigatoria: true,
          opcoes: ['Residencial horizontal', 'Residencial vertical', 'Comercial', 'Industrial', 'Misto', 'Rural']
        },
        {
          id: 'loteamentos-proximos',
          pergunta: 'Há outros loteamentos ou condomínios próximos? De que padrão?',
          tipo: 'textarea',
          obrigatoria: true,
          placeholder: 'Empreendimentos próximos, padrão, características...'
        },
        {
          id: 'interesse-paisagistico',
          pergunta: 'Existem elementos de interesse paisagístico ou vistas privilegiadas?',
          tipo: 'textarea',
          obrigatoria: true,
          placeholder: 'Vistas, paisagens, elementos de interesse...'
        },
        {
          id: 'pontos-referencia',
          pergunta: 'Quais os principais pontos de referência da região?',
          tipo: 'textarea',
          obrigatoria: true,
          placeholder: 'Marcos, monumentos, edificações conhecidas...'
        },

        // 3.3 Aspectos Ambientais
        {
          id: 'vegetacao-nativa',
          pergunta: 'Existe vegetação nativa significativa a ser preservada?',
          tipo: 'textarea',
          obrigatoria: true,
          placeholder: 'Área de vegetação nativa, importância, preservação...'
        },
        {
          id: 'fauna-silvestre',
          pergunta: 'Há fauna silvestre relevante na área?',
          tipo: 'textarea',
          obrigatoria: true,
          placeholder: 'Espécies de fauna, importância ecológica...'
        },
        {
          id: 'reserva-legal',
          pergunta: 'Qual a situação da reserva legal da propriedade?',
          tipo: 'select',
          obrigatoria: true,
          opcoes: ['Averbada', 'Não averbada', 'Inexistente', 'Em processo', 'Não sei']
        },
        {
          id: 'app-delimitadas',
          pergunta: 'Existem áreas de preservação permanente (APP) delimitadas?',
          tipo: 'textarea',
          obrigatoria: true,
          placeholder: 'Localização e características das APPs...'
        },
        {
          id: 'estudos-ambientais',
          pergunta: 'Há estudos ambientais já realizados (EIA/RIMA, RAP)?',
          tipo: 'select',
          obrigatoria: true,
          opcoes: ['Sim, EIA/RIMA', 'Sim, RAP', 'Sim, outros estudos', 'Não existem', 'Em andamento']
        }
      ]
    },

    // Seção 4: Programa Urbanístico (30 perguntas)
    {
      id: 'programa-urbanistico',
      nome: '🏗️ Programa Urbanístico',
      descricao: 'Parcelamento do solo, sistema viário e áreas comuns do empreendimento',
      icon: '🏗️',
      obrigatoria: true,
      perguntas: [
        // 4.1 Parcelamento do Solo
        {
          id: 'numero-lotes',
          pergunta: 'Qual o número total de lotes pretendido?',
          tipo: 'numero',
          obrigatoria: true,
          placeholder: 'Ex: 150, 300, 500...'
        },
        {
          id: 'dimensoes-lotes',
          pergunta: 'Quais as dimensões mínimas dos lotes (frente e área)?',
          tipo: 'text',
          obrigatoria: true,
          placeholder: 'Ex: 12m x 30m, 360m²'
        },
        {
          id: 'tipologias-lotes',
          pergunta: 'Haverá diferentes tipologias de lotes? Quais?',
          tipo: 'textarea',
          obrigatoria: true,
          placeholder: 'Diferentes tamanhos, tipos, características...'
        },
        {
          id: 'proporcao-areas',
          pergunta: 'Qual a proporção desejada entre áreas privativas e áreas públicas?',
          tipo: 'text',
          obrigatoria: true,
          placeholder: 'Ex: 70% privativo, 30% público'
        },
        {
          id: 'percentual-areas-verdes',
          pergunta: 'Qual o percentual pretendido para áreas verdes e institucionais?',
          tipo: 'text',
          obrigatoria: true,
          placeholder: 'Ex: 35% mínimo legal, 40% pretendido'
        },
        {
          id: 'lotes-comerciais',
          pergunta: 'Haverá lotes comerciais ou de uso misto? Em que proporção?',
          tipo: 'textarea',
          obrigatoria: true,
          placeholder: 'Quantidade e localização dos lotes comerciais...'
        },
        {
          id: 'formato-quadras',
          pergunta: 'Existe preferência por formato específico de quadras?',
          tipo: 'select',
          obrigatoria: true,
          opcoes: ['Retangular', 'Quadrada', 'Orgânica', 'Mista', 'Sem preferência']
        },
        {
          id: 'densidade-populacional',
          pergunta: 'Qual a densidade populacional estimada para o empreendimento?',
          tipo: 'text',
          obrigatoria: true,
          placeholder: 'Ex: 25 hab/ha, 3.500 habitantes total'
        },
        {
          id: 'faseamento-implantacao',
          pergunta: 'Haverá faseamento na implantação? Como será dividido?',
          tipo: 'textarea',
          obrigatoria: true,
          placeholder: 'Número de fases, critérios, cronograma...'
        },
        {
          id: 'padrao-ocupacao',
          pergunta: 'Existe preferência por algum padrão de ocupação específico?',
          tipo: 'textarea',
          obrigatoria: true,
          placeholder: 'Padrão urbanístico, conceito de ocupação...'
        },

        // 4.2 Sistema Viário
        {
          id: 'hierarquia-viaria',
          pergunta: 'Qual a hierarquia viária pretendida (vias principais, secundárias, locais)?',
          tipo: 'textarea',
          obrigatoria: true,
          placeholder: 'Classificação das vias, hierarquia...'
        },
        {
          id: 'larguras-vias',
          pergunta: 'Quais as larguras mínimas desejadas para as vias?',
          tipo: 'text',
          obrigatoria: true,
          placeholder: 'Ex: Principal 12m, Local 9m'
        },
        {
          id: 'ciclovias',
          pergunta: 'Haverá ciclovias ou ciclofaixas? Com quais características?',
          tipo: 'textarea',
          obrigatoria: true,
          placeholder: 'Extensão, localização, tipo de ciclovia...'
        },
        {
          id: 'calcadas-pedestres',
          pergunta: 'Como serão tratadas as calçadas e áreas de pedestres?',
          tipo: 'textarea',
          obrigatoria: true,
          placeholder: 'Largura, material, acessibilidade...'
        },
        {
          id: 'pavimentacao-vias',
          pergunta: 'Qual o padrão de pavimentação desejado para as vias?',
          tipo: 'select',
          obrigatoria: true,
          opcoes: ['Asfalto', 'Concreto', 'Paralelepípedo', 'Paver', 'Misto']
        },
        {
          id: 'vias-acesso-exclusivo',
          pergunta: 'Haverá vias de acesso exclusivo a determinadas áreas?',
          tipo: 'textarea',
          obrigatoria: true,
          placeholder: 'Acessos exclusivos, áreas especiais...'
        },
        {
          id: 'acessibilidade-universal',
          pergunta: 'Como será tratada a acessibilidade universal no sistema viário?',
          tipo: 'textarea',
          obrigatoria: true,
          placeholder: 'Rampas, pisos táteis, sinalizações...'
        },
        {
          id: 'tracado-viario',
          pergunta: 'Existem preferências quanto ao traçado viário (orgânico, ortogonal, misto)?',
          tipo: 'select',
          obrigatoria: true,
          opcoes: ['Orgânico', 'Ortogonal', 'Misto', 'Radial', 'Sem preferência']
        },
        {
          id: 'conexao-sistema-existente',
          pergunta: 'Como será a conexão com o sistema viário existente?',
          tipo: 'textarea',
          obrigatoria: true,
          placeholder: 'Pontos de conexão, adequações necessárias...'
        },
        {
          id: 'transporte-publico-interno',
          pergunta: 'Haverá previsão para transporte público interno?',
          tipo: 'select',
          obrigatoria: true,
          opcoes: ['Sim, ônibus', 'Sim, van/micro-ônibus', 'Não', 'A definir']
        },

        // 4.3 Áreas Comuns e Equipamentos
        {
          id: 'equipamentos-lazer',
          pergunta: 'Quais equipamentos de lazer serão oferecidos (clube, praças, quadras)?',
          tipo: 'multiple',
          obrigatoria: true,
          opcoes: ['Clube/centro de lazer', 'Praças', 'Quadras esportivas', 'Playground', 'Academia ao ar livre', 'Piscina', 'Salão de festas', 'Churrasqueiras']
        },
        {
          id: 'areas-institucionais',
          pergunta: 'Haverá áreas institucionais além do mínimo legal? Com qual finalidade?',
          tipo: 'textarea',
          obrigatoria: true,
          placeholder: 'Finalidade das áreas institucionais adicionais...'
        },
        {
          id: 'portaria-caracteristicas',
          pergunta: 'Está prevista a construção de portaria? Com quais características?',
          tipo: 'textarea',
          obrigatoria: true,
          placeholder: 'Tipo, tamanho, equipamentos da portaria...'
        },
        {
          id: 'sede-administrativa',
          pergunta: 'Haverá sede administrativa ou centro comunitário?',
          tipo: 'select',
          obrigatoria: true,
          opcoes: ['Sim, sede administrativa', 'Sim, centro comunitário', 'Sim, ambos', 'Não']
        },
        {
          id: 'equipamentos-esportivos',
          pergunta: 'Quais equipamentos esportivos serão implementados?',
          tipo: 'multiple',
          obrigatoria: true,
          opcoes: ['Quadra poliesportiva', 'Campo de futebol', 'Quadra de tênis', 'Pista de caminhada', 'Academia', 'Piscina', 'Quadra de vôlei de areia']
        },
        {
          id: 'areas-convivencia',
          pergunta: 'Haverá áreas de convivência temáticas? Quais?',
          tipo: 'textarea',
          obrigatoria: true,
          placeholder: 'Temas, características das áreas de convivência...'
        },
        {
          id: 'mirantes-contemplativas',
          pergunta: 'Está prevista a implantação de mirantes ou áreas contemplativas?',
          tipo: 'select',
          obrigatoria: true,
          opcoes: ['Sim, mirantes', 'Sim, áreas contemplativas', 'Sim, ambos', 'Não']
        },
        {
          id: 'espacos-eventos',
          pergunta: 'Haverá espaços para eventos ao ar livre?',
          tipo: 'textarea',
          obrigatoria: true,
          placeholder: 'Tipo de espaços, capacidade, equipamentos...'
        },
        {
          id: 'quiosques-piquenique',
          pergunta: 'Está prevista a construção de quiosques ou áreas de piquenique?',
          tipo: 'select',
          obrigatoria: true,
          opcoes: ['Sim, quiosques', 'Sim, áreas de piquenique', 'Sim, ambos', 'Não']
        },
        {
          id: 'trilhas-circuitos',
          pergunta: 'Haverá trilhas ou circuitos para caminhada e corrida?',
          tipo: 'textarea',
          obrigatoria: true,
          placeholder: 'Extensão, tipo, características das trilhas...'
        }
      ]
    },

    // Seção 5: Infraestrutura e Tecnologia (25 perguntas)
    {
      id: 'infraestrutura-tecnologia',
      nome: '⚡ Infraestrutura e Tecnologia',
      descricao: 'Sistemas de infraestrutura básica e tecnologias inovadoras',
      icon: '⚡',
      obrigatoria: true,
      perguntas: [
        // 5.1 Infraestrutura Básica
        {
          id: 'sistema-abastecimento-agua',
          pergunta: 'Como será o sistema de abastecimento de água (rede pública, poços, misto)?',
          tipo: 'select',
          obrigatoria: true,
          opcoes: ['Rede pública', 'Poços artesianos', 'Sistema misto', 'A definir']
        },
        {
          id: 'sistema-esgoto',
          pergunta: 'Qual o sistema de coleta e tratamento de esgoto previsto?',
          tipo: 'select',
          obrigatoria: true,
          opcoes: ['Rede pública', 'Estação tratamento própria', 'Sistemas individuais', 'A definir']
        },
        {
          id: 'sistema-drenagem',
          pergunta: 'Como será o sistema de drenagem pluvial?',
          tipo: 'textarea',
          obrigatoria: true,
          placeholder: 'Micro drenagem, macro drenagem, sistemas sustentáveis...'
        },
        {
          id: 'sistema-energia',
          pergunta: 'Qual o sistema de distribuição de energia elétrica (aéreo, subterrâneo)?',
          tipo: 'select',
          obrigatoria: true,
          opcoes: ['Aéreo', 'Subterrâneo', 'Misto', 'A definir']
        },
        {
          id: 'rede-gas',
          pergunta: 'Haverá rede de gás canalizado?',
          tipo: 'select',
          obrigatoria: true,
          opcoes: ['Sim, completa', 'Sim, parcial', 'Não', 'A definir']
        },
        {
          id: 'iluminacao-publica',
          pergunta: 'Como será o sistema de iluminação pública?',
          tipo: 'select',
          obrigatoria: true,
          opcoes: ['LED convencional', 'LED inteligente', 'Solar', 'Misto']
        },
        {
          id: 'pavimentacao-vias-detalhes',
          pergunta: 'Qual o padrão de pavimentação das vias?',
          tipo: 'textarea',
          obrigatoria: true,
          placeholder: 'Especificações técnicas, materiais, acabamentos...'
        },
        {
          id: 'coleta-residuos',
          pergunta: 'Haverá sistema de coleta seletiva de resíduos?',
          tipo: 'select',
          obrigatoria: true,
          opcoes: ['Sim, completo', 'Sim, básico', 'Não', 'A definir']
        },
        {
          id: 'telecomunicacoes',
          pergunta: 'Como será o sistema de telecomunicações (internet, TV, telefonia)?',
          tipo: 'textarea',
          obrigatoria: true,
          placeholder: 'Fibra óptica, cabeamento, provedores...'
        },
        {
          id: 'veiculos-eletricos',
          pergunta: 'Está prevista infraestrutura para recarga de veículos elétricos?',
          tipo: 'select',
          obrigatoria: true,
          opcoes: ['Sim, completa', 'Sim, preparação', 'Não', 'A definir']
        },

        // 5.2 Tecnologia e Inovação
        {
          id: 'sistema-seguranca',
          pergunta: 'Haverá sistema de monitoramento e segurança integrado?',
          tipo: 'select',
          obrigatoria: true,
          opcoes: ['Sim, completo', 'Sim, básico', 'Não', 'A definir']
        },
        {
          id: 'smart-city',
          pergunta: 'Está prevista a implementação de conceitos de "smart city"?',
          tipo: 'textarea',
          obrigatoria: true,
          placeholder: 'Tecnologias inteligentes, automação, IoT...'
        },
        {
          id: 'fibra-optica',
          pergunta: 'Haverá rede de fibra óptica disponível para todos os lotes?',
          tipo: 'select',
          obrigatoria: true,
          opcoes: ['Sim, todos os lotes', 'Sim, áreas comuns', 'Não', 'A definir']
        },
        {
          id: 'automacao-equipamentos',
          pergunta: 'Está previsto sistema de automação para equipamentos comuns?',
          tipo: 'select',
          obrigatoria: true,
          opcoes: ['Sim, completo', 'Sim, básico', 'Não', 'A definir']
        },
        {
          id: 'aplicativo-gestao',
          pergunta: 'Haverá aplicativo próprio para gestão do loteamento?',
          tipo: 'select',
          obrigatoria: true,
          opcoes: ['Sim, completo', 'Sim, básico', 'Não', 'A definir']
        },
        {
          id: 'eficiencia-energetica',
          pergunta: 'Quais tecnologias serão aplicadas para eficiência energética?',
          tipo: 'textarea',
          obrigatoria: true,
          placeholder: 'Iluminação LED, sensores, energia solar...'
        },
        {
          id: 'gestao-recursos-hidricos',
          pergunta: 'Haverá sistema de gestão inteligente de recursos hídricos?',
          tipo: 'select',
          obrigatoria: true,
          opcoes: ['Sim, completo', 'Sim, básico', 'Não', 'A definir']
        },
        {
          id: 'wifi-areas-comuns',
          pergunta: 'Está prevista a implementação de wi-fi em áreas comuns?',
          tipo: 'select',
          obrigatoria: true,
          opcoes: ['Sim, completo', 'Sim, pontos específicos', 'Não', 'A definir']
        },
        {
          id: 'controle-acesso-automatizado',
          pergunta: 'Haverá sistema de controle de acesso automatizado?',
          tipo: 'select',
          obrigatoria: true,
          opcoes: ['Sim, completo', 'Sim, básico', 'Não', 'A definir']
        },
        {
          id: 'inovacoes-tecnologicas',
          pergunta: 'Quais inovações tecnológicas serão diferenciais do empreendimento?',
          tipo: 'textarea',
          obrigatoria: true,
          placeholder: 'Tecnologias exclusivas, inovações específicas...'
        },

        // 5.3 Sustentabilidade
        {
          id: 'estrategias-sustentabilidade',
          pergunta: 'Quais estratégias de sustentabilidade serão implementadas?',
          tipo: 'textarea',
          obrigatoria: true,
          placeholder: 'Práticas sustentáveis, tecnologias verdes...'
        },
        {
          id: 'certificacao-ambiental',
          pergunta: 'Haverá certificação ambiental para o empreendimento?',
          tipo: 'select',
          obrigatoria: true,
          opcoes: ['Sim, internacional', 'Sim, nacional', 'Não', 'A definir']
        },
        {
          id: 'captacao-agua-pluvial',
          pergunta: 'Está previsto sistema de captação e reuso de água pluvial?',
          tipo: 'select',
          obrigatoria: true,
          opcoes: ['Sim, completo', 'Sim, parcial', 'Não', 'A definir']
        },
        {
          id: 'energia-renovavel',
          pergunta: 'Haverá geração de energia renovável nas áreas comuns?',
          tipo: 'select',
          obrigatoria: true,
          opcoes: ['Sim, solar', 'Sim, outras fontes', 'Não', 'A definir']
        },
        {
          id: 'gestao-residuos-implantacao',
          pergunta: 'Como será feita a gestão de resíduos durante a implantação?',
          tipo: 'textarea',
          obrigatoria: true,
          placeholder: 'Plano de gestão, reciclagem, destinação...'
        }
      ]
    },

    // Seção 6: Paisagismo e Áreas Verdes (25 perguntas)
    {
      id: 'paisagismo-areas-verdes',
      nome: '🌿 Paisagismo e Áreas Verdes',
      descricao: 'Conceito paisagístico, vegetação e elementos aquáticos',
      icon: '🌿',
      obrigatoria: true,
      perguntas: [
        // 6.1 Conceito Paisagístico
        {
          id: 'conceito-paisagistico',
          pergunta: 'Qual o conceito paisagístico geral do empreendimento?',
          tipo: 'textarea',
          obrigatoria: true,
          placeholder: 'Conceito, tema, inspiração paisagística...'
        },
        {
          id: 'tema-paisagismo',
          pergunta: 'Haverá um tema ou identidade específica para o paisagismo?',
          tipo: 'textarea',
          obrigatoria: true,
          placeholder: 'Tema botânico, regional, contemporâneo...'
        },
        {
          id: 'referencias-paisagisticas',
          pergunta: 'Quais referências de projetos paisagísticos servem de inspiração?',
          tipo: 'textarea',
          obrigatoria: false,
          placeholder: 'Projetos de referência, estilos, conceitos...'
        },
        {
          id: 'proporcao-areas-verdes',
          pergunta: 'Qual a proporção desejada entre áreas pavimentadas e áreas verdes?',
          tipo: 'text',
          obrigatoria: true,
          placeholder: 'Ex: 60% verde, 40% pavimentado'
        },
        {
          id: 'estilo-jardim',
          pergunta: 'Existe preferência por determinado estilo de jardim (tropical, contemporâneo, clássico)?',
          tipo: 'select',
          obrigatoria: true,
          opcoes: ['Tropical', 'Contemporâneo', 'Clássico', 'Minimalista', 'Misto']
        },

        // 6.2 Vegetação e Tratamento Paisagístico
        {
          id: 'vegetacao-existente',
          pergunta: 'Qual a abordagem para preservação da vegetação existente?',
          tipo: 'textarea',
          obrigatoria: true,
          placeholder: 'Estratégia de preservação, transplante, aproveitamento...'
        },
        {
          id: 'especies-vegetais',
          pergunta: 'Há preferência por espécies nativas ou exóticas?',
          tipo: 'select',
          obrigatoria: true,
          opcoes: ['Prioritariamente nativas', 'Misto com nativas', 'Sem restrição', 'Exóticas específicas']
        },
        {
          id: 'arborizacao-urbana',
          pergunta: 'Haverá arborização urbana nas vias? Com qual padrão?',
          tipo: 'textarea',
          obrigatoria: true,
          placeholder: 'Espécies, espaçamento, padrão de plantio...'
        },
        {
          id: 'bosques-mata',
          pergunta: 'Está prevista a criação de bosques ou áreas de mata?',
          tipo: 'select',
          obrigatoria: true,
          opcoes: ['Sim, bosques', 'Sim, mata nativa', 'Sim, ambos', 'Não']
        },
        {
          id: 'jardins-tematicos',
          pergunta: 'Haverá jardins temáticos ou sensoriais?',
          tipo: 'textarea',
          obrigatoria: true,
          placeholder: 'Temas específicos, jardins sensoriais...'
        },
        {
          id: 'areas-preservacao',
          pergunta: 'Como será o tratamento paisagístico das áreas de preservação?',
          tipo: 'textarea',
          obrigatoria: true,
          placeholder: 'Integração, trilhas, observação...'
        },
        {
          id: 'hortas-pomares',
          pergunta: 'Haverá pomares ou hortas comunitárias?',
          tipo: 'select',
          obrigatoria: true,
          opcoes: ['Sim, pomares', 'Sim, hortas', 'Sim, ambos', 'Não']
        },
        {
          id: 'paisagismo-entradas',
          pergunta: 'Qual o tratamento paisagístico previsto para as entradas e acessos?',
          tipo: 'textarea',
          obrigatoria: true,
          placeholder: 'Portais verdes, marcos paisagísticos...'
        },
        {
          id: 'jardins-chuva',
          pergunta: 'Haverá jardins de chuva ou outras soluções de infraestrutura verde?',
          tipo: 'select',
          obrigatoria: true,
          opcoes: ['Sim, jardins de chuva', 'Sim, outras soluções', 'Não', 'A definir']
        },
        {
          id: 'paisagismo-lazer',
          pergunta: 'Como será o paisagismo das áreas de lazer e convivência?',
          tipo: 'textarea',
          obrigatoria: true,
          placeholder: 'Conceito, espécies, integração com equipamentos...'
        },

        // 6.3 Recursos Hídricos e Elementos Aquáticos
        {
          id: 'lagos-espelhos-agua',
          pergunta: 'Haverá lagos ou espelhos d\'água artificiais?',
          tipo: 'select',
          obrigatoria: true,
          opcoes: ['Sim, lagos', 'Sim, espelhos d\'água', 'Sim, ambos', 'Não']
        },
        {
          id: 'corpos-agua-naturais',
          pergunta: 'Como serão tratados os corpos d\'água naturais existentes?',
          tipo: 'textarea',
          obrigatoria: true,
          placeholder: 'Preservação, integração, tratamento paisagístico...'
        },
        {
          id: 'fontes-cascatas',
          pergunta: 'Está prevista a implementação de fontes ou cascatas?',
          tipo: 'select',
          obrigatoria: true,
          opcoes: ['Sim, fontes', 'Sim, cascatas', 'Sim, ambos', 'Não']
        },
        {
          id: 'irrigacao-automatizada',
          pergunta: 'Haverá sistema de irrigação automatizado para áreas verdes?',
          tipo: 'select',
          obrigatoria: true,
          opcoes: ['Sim, completo', 'Sim, áreas específicas', 'Não', 'A definir']
        },
        {
          id: 'gestao-recursos-hidricos-paisagismo',
          pergunta: 'Como será feita a gestão sustentável dos recursos hídricos no paisagismo?',
          tipo: 'textarea',
          obrigatoria: true,
          placeholder: 'Reuso, captação, sistemas eficientes...'
        },
        {
          id: 'paisagismo-drenagem',
          pergunta: 'Haverá tratamento paisagístico especial para áreas de drenagem?',
          tipo: 'select',
          obrigatoria: true,
          opcoes: ['Sim, biovaletas', 'Sim, jardins de chuva', 'Sim, outros', 'Não']
        },
        {
          id: 'wetlands-construidas',
          pergunta: 'Está prevista a criação de wetlands ou áreas úmidas construídas?',
          tipo: 'select',
          obrigatoria: true,
          opcoes: ['Sim, wetlands', 'Sim, áreas úmidas', 'Não', 'A definir']
        },
        {
          id: 'aguas-pluviais-paisagismo',
          pergunta: 'Haverá aproveitamento de águas pluviais para paisagismo?',
          tipo: 'select',
          obrigatoria: true,
          opcoes: ['Sim, irrigação', 'Sim, lagos', 'Sim, ambos', 'Não']
        },
        {
          id: 'margens-corpos-agua',
          pergunta: 'Como será o tratamento das margens de corpos d\'água?',
          tipo: 'textarea',
          obrigatoria: true,
          placeholder: 'Vegetação ciliar, contenção, integração...'
        },
        {
          id: 'elementos-aquaticos-interativos',
          pergunta: 'Haverá elementos aquáticos interativos (praças d\'água, etc.)?',
          tipo: 'select',
          obrigatoria: true,
          opcoes: ['Sim, praças d\'água', 'Sim, outros elementos', 'Não', 'A definir']
        }
      ]
    }
  ]
}; 