// ============================================================================
// EXEMPLO PRÁTICO - ORÇAMENTO TÉCNICO PROFISSIONAL
// Casa Residencial Unifamiliar - Padrão Médio - 180m²
// ============================================================================

import { 
  OrcamentoTecnicoProfissional, 
  TipologiaProjeto, 
  PadraoConstrutivo, 
  SistemaConstrutivo, 
  ClassificacaoUso, 
  FaseProjeto 
} from '../models/OrcamentoTecnicoProfissional';

export const EXEMPLO_ORCAMENTO_CASA_MEDIA: OrcamentoTecnicoProfissional = {
  // ============================================================================
  // METADADOS
  // ============================================================================
  id: 'ORC-2024-001',
  versao: '1.0',
  dataElaboracao: new Date('2024-06-16'),
  dataUltimaRevisao: new Date('2024-06-16'),
  status: 'em_analise',
  elaboradoPor: {
    nome: 'Arq. João Silva Santos',
    crea: 'CAU/SP 123456-7',
    empresa: 'Silva & Associados Arquitetura',
    assinatura: 'assinatura_digital.pdf'
  },

  // ============================================================================
  // DADOS DO PROJETO
  // ============================================================================
  dadosProjeto: {
    codigo: 'PROJ-2024-RSF-001',
    titulo: 'Residência Unifamiliar - Família Oliveira',
    
    cliente: {
      nome: 'Carlos Eduardo Oliveira',
      cpfCnpj: '123.456.789-00',
      endereco: 'Rua das Flores, 123',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '01234-567',
      telefone: '(11) 99999-9999',
      email: 'carlos.oliveira@email.com',
      responsavelTecnico: 'Eng. Maria Santos (CREA/SP 987654)'
    },
    
    localizacao: {
      endereco: 'Rua dos Ipês, 456 - Lote 15',
      bairro: 'Jardim Residencial',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '01234-890',
      coordenadas: { lat: -23.5505, lng: -46.6333 },
      caracteristicasTerreno: 'Terreno plano, 12x25m, frente norte, declive suave 2%'
    },
    
    dadosTecnicos: {
      areaTerreno: 300,
      areaConstruida: 180,
      areaUtil: 165,
      numeroAndares: 2,
      numeroPavimentos: 2,
      tipologia: TipologiaProjeto.RESIDENCIAL_UNIFAMILIAR,
      padraoConstrutivo: PadraoConstrutivo.MEDIO,
      sistemaConstrutivo: SistemaConstrutivo.CONVENCIONAL_CONCRETO,
      classificacaoUso: ClassificacaoUso.RESIDENCIAL
    }
  },

  // ============================================================================
  // ESCOPO TÉCNICO DETALHADO
  // ============================================================================
  escopoTecnico: {
    projetosBasicos: {
      arquitetonico: {
        incluido: true,
        fases: [
          FaseProjeto.LEVANTAMENTO_DADOS,
          FaseProjeto.ESTUDO_PRELIMINAR,
          FaseProjeto.ANTEPROJETO,
          FaseProjeto.PROJETO_BASICO,
          FaseProjeto.PROJETO_EXECUTIVO
        ],
        observacoes: 'Inclui plantas baixas, cortes, fachadas, detalhamentos construtivos'
      },
      estrutural: {
        incluido: true,
        tipo: 'concreto',
        fases: [
          FaseProjeto.PROJETO_BASICO,
          FaseProjeto.PROJETO_EXECUTIVO,
          FaseProjeto.DETALHAMENTO
        ],
        observacoes: 'Estrutura em concreto armado, fundação em sapatas corridas'
      },
      instalacoes: {
        hidrossanitarias: { 
          incluido: true, 
          fases: [FaseProjeto.PROJETO_BASICO, FaseProjeto.PROJETO_EXECUTIVO] 
        },
        eletricas: { 
          incluido: true, 
          fases: [FaseProjeto.PROJETO_BASICO, FaseProjeto.PROJETO_EXECUTIVO] 
        },
        gasGLP: { 
          incluido: true, 
          fases: [FaseProjeto.PROJETO_BASICO] 
        },
        observacoes: 'Instalações completas conforme NBR 5626, NBR 5410 e NBR 13932'
      }
    },
    
    projetosComplementares: {
      paisagismo: { 
        incluido: true, 
        fases: [FaseProjeto.ANTEPROJETO, FaseProjeto.PROJETO_EXECUTIVO] 
      },
      interiores: { 
        incluido: false, 
        fases: [] 
      },
      luminotecnico: { 
        incluido: true, 
        fases: [FaseProjeto.PROJETO_BASICO] 
      },
      automacao: { 
        incluido: false, 
        fases: [] 
      },
      sustentabilidade: { 
        incluido: true, 
        certificacao: 'AQUA-HQE Residencial' 
      },
      acessibilidade: { 
        incluido: true, 
        norma: 'NBR9050' 
      },
      seguranca: { 
        incluido: true, 
        tipo: 'incendio' 
      }
    },
    
    consultoriaEspecializada: {
      estrutural: { 
        incluido: true, 
        escopo: 'Análise estrutural, dimensionamento, detalhamento' 
      },
      instalacoes: { 
        incluido: true, 
        escopo: 'Dimensionamento hidráulico e elétrico' 
      },
      sustentabilidade: { 
        incluido: true, 
        escopo: 'Consultoria para certificação AQUA-HQE' 
      },
      aprovacoes: { 
        incluido: true, 
        orgaos: ['Prefeitura Municipal', 'CETESB', 'Concessionárias'] 
      },
      acompanhamentoObra: { 
        incluido: true, 
        periodicidade: 'Quinzenal durante execução' 
      }
    },
    
    servicosAdicionais: {
      levantamentoTopografico: true,
      sondagemSolo: true,
      laudoEstruturalExistente: false,
      maqueteEletronica: true,
      renderizacoes: { incluido: true, quantidade: 8 },
      animacoes3D: false,
      realidadeVirtual: false
    }
  },

  // ============================================================================
  // COMPOSIÇÃO DETALHADA DE CUSTOS
  // ============================================================================
  composicaoCustos: {
    custosDirectos: {
      horasTecnicas: {
        arquiteto: { horas: 120, valorHora: 180, total: 21600 },
        engenheiro: { horas: 80, valorHora: 200, total: 16000 },
        desenhista: { horas: 160, valorHora: 85, total: 13600 },
        estagiario: { horas: 40, valorHora: 35, total: 1400 },
        consultor: { horas: 24, valorHora: 250, total: 6000 }
      },
      
      deslocamentos: {
        visitasTecnicas: { quantidade: 8, valorUnitario: 120, total: 960 },
        reunioes: { quantidade: 12, valorUnitario: 80, total: 960 },
        aprovacoes: { quantidade: 6, valorUnitario: 150, total: 900 }
      },
      
      materiaisInsumos: {
        plotagem: { quantidade: 25, valorUnitario: 45, total: 1125 },
        impressoes: { quantidade: 200, valorUnitario: 2.5, total: 500 },
        maquetes: { quantidade: 1, valorUnitario: 2800, total: 2800 },
        software: { licencas: 3, valorMensal: 450, meses: 6, total: 8100 }
      },
      
      terceirizados: {
        topografia: { incluido: true, valor: 3500 },
        sondagem: { incluido: true, valor: 4200 },
        consultores: { incluido: true, valor: 8500 },
        aprovacoes: { incluido: true, valor: 2800 }
      }
    },
    
    custosIndiretos: {
      estruturaEscritorio: {
        percentual: 25,
        valor: 23100, // 25% dos custos diretos
        base: 'custos_diretos'
      },
      
      impostos: {
        issqn: { percentual: 5.0, valor: 5775 },
        pis: { percentual: 0.65, valor: 751.25 },
        cofins: { percentual: 3.0, valor: 3465 },
        irpj: { percentual: 4.8, valor: 5544 },
        csll: { percentual: 2.88, valor: 3326.4 },
        total: 18861.65
      },
      
      seguros: {
        responsabilidadeCivil: { valor: 2310 },
        errosOmissoes: { valor: 1540 },
        total: 3850
      },
      
      contingencia: {
        percentual: 10,
        valor: 11550,
        justificativa: 'Reserva para imprevistos técnicos e alterações de escopo'
      }
    },
    
    margemLucro: {
      percentual: 20,
      valor: 23100,
      base: 'custos_totais'
    },
    
    resumoFinanceiro: {
      subtotalCustosDirectos: 92400,
      subtotalCustosIndiretos: 57361.65,
      subtotalCustos: 149761.65,
      margemLucro: 29952.33,
      valorTotal: 179713.98,
      valorPorM2: 998.41 // R$ 179.713,98 ÷ 180m²
    }
  },

  // ============================================================================
  // CRONOGRAMA FÍSICO-FINANCEIRO
  // ============================================================================
  cronogramaFisicoFinanceiro: {
    fases: [
      {
        id: 'fase-01',
        nome: 'Levantamento e Estudos Preliminares',
        descricao: 'Levantamento de dados, visitas técnicas, estudos de viabilidade',
        prazoInicio: new Date('2024-07-01'),
        prazoFim: new Date('2024-07-21'),
        duracaoDias: 21,
        percentualFinanceiro: 15,
        valorFase: 26957.10,
        entregaveis: [
          'Levantamento topográfico',
          'Sondagem do solo',
          'Estudo de viabilidade',
          'Programa de necessidades'
        ],
        marcosPagamento: [
          {
            id: 'mp-01',
            descricao: 'Assinatura do contrato',
            percentual: 15,
            valor: 26957.10,
            condicoes: ['Contrato assinado', 'Documentação completa'],
            prazoVencimento: 7
          }
        ]
      },
      {
        id: 'fase-02',
        nome: 'Anteprojeto',
        descricao: 'Desenvolvimento do anteprojeto arquitetônico e complementares',
        prazoInicio: new Date('2024-07-22'),
        prazoFim: new Date('2024-08-18'),
        duracaoDias: 28,
        percentualFinanceiro: 25,
        valorFase: 44928.50,
        entregaveis: [
          'Anteprojeto arquitetônico',
          'Anteprojeto paisagístico',
          'Estudo luminotécnico',
          'Memorial descritivo'
        ],
        dependencias: ['fase-01'],
        marcosPagamento: [
          {
            id: 'mp-02',
            descricao: 'Aprovação do anteprojeto',
            percentual: 25,
            valor: 44928.50,
            condicoes: ['Anteprojeto aprovado pelo cliente'],
            prazoVencimento: 10
          }
        ]
      },
      {
        id: 'fase-03',
        nome: 'Projeto Básico',
        descricao: 'Desenvolvimento dos projetos básicos de todas as disciplinas',
        prazoInicio: new Date('2024-08-19'),
        prazoFim: new Date('2024-09-29'),
        duracaoDias: 42,
        percentualFinanceiro: 30,
        valorFase: 53914.19,
        entregaveis: [
          'Projeto básico arquitetônico',
          'Projeto básico estrutural',
          'Projeto básico instalações',
          'Projeto básico paisagismo'
        ],
        dependencias: ['fase-02'],
        marcosPagamento: [
          {
            id: 'mp-03',
            descricao: 'Entrega dos projetos básicos',
            percentual: 30,
            valor: 53914.19,
            condicoes: ['Projetos básicos completos', 'Compatibilização realizada'],
            prazoVencimento: 15
          }
        ]
      },
      {
        id: 'fase-04',
        nome: 'Projeto Executivo',
        descricao: 'Detalhamento executivo e especificações técnicas',
        prazoInicio: new Date('2024-09-30'),
        prazoFim: new Date('2024-11-24'),
        duracaoDias: 56,
        percentualFinanceiro: 25,
        valorFase: 44928.50,
        entregaveis: [
          'Projeto executivo completo',
          'Detalhamentos construtivos',
          'Especificações técnicas',
          'Planilha orçamentária'
        ],
        dependencias: ['fase-03'],
        marcosPagamento: [
          {
            id: 'mp-04',
            descricao: 'Entrega dos projetos executivos',
            percentual: 25,
            valor: 44928.50,
            condicoes: ['Projetos executivos completos', 'Aprovações obtidas'],
            prazoVencimento: 20
          }
        ]
      },
      {
        id: 'fase-05',
        nome: 'Acompanhamento de Obra',
        descricao: 'Acompanhamento técnico durante a execução',
        prazoInicio: new Date('2024-12-01'),
        prazoFim: new Date('2025-05-31'),
        duracaoDias: 180,
        percentualFinanceiro: 5,
        valorFase: 8985.70,
        entregaveis: [
          'Relatórios quinzenais',
          'Esclarecimentos técnicos',
          'Aprovação de materiais',
          'As built final'
        ],
        dependencias: ['fase-04'],
        marcosPagamento: [
          {
            id: 'mp-05',
            descricao: 'Conclusão do acompanhamento',
            percentual: 5,
            valor: 8985.70,
            condicoes: ['Obra concluída', 'As built entregue'],
            prazoVencimento: 30
          }
        ]
      }
    ],
    
    resumoFinanceiro: {
      totalProjeto: 179713.98,
      distribuicaoPagamentos: [
        { fase: 'Assinatura', percentual: 15, valor: 26957.10 },
        { fase: 'Anteprojeto', percentual: 25, valor: 44928.50 },
        { fase: 'Projeto Básico', percentual: 30, valor: 53914.19 },
        { fase: 'Projeto Executivo', percentual: 25, valor: 44928.50 },
        { fase: 'Acompanhamento', percentual: 5, valor: 8985.70 }
      ]
    }
  },

  // ============================================================================
  // CONDIÇÕES CONTRATUAIS
  // ============================================================================
  condicoesContratuais: {
    pagamento: {
      moeda: 'BRL',
      formaPagamento: 'transferencia',
      condicoes: 'Pagamento mediante aprovação de cada etapa conforme cronograma',
      reajuste: {
        indice: 'INCC',
        periodicidade: 'trimestral'
      },
      multa: {
        atraso: 0.033, // 1% ao mês (0,033% ao dia)
        inadimplencia: 2.0 // 2% sobre valor em atraso
      }
    },
    
    prazos: {
      inicioServicos: new Date('2024-07-01'),
      prazoTotal: 327, // dias
      prazosParciais: [
        { fase: 'Estudos Preliminares', prazo: 21 },
        { fase: 'Anteprojeto', prazo: 28 },
        { fase: 'Projeto Básico', prazo: 42 },
        { fase: 'Projeto Executivo', prazo: 56 },
        { fase: 'Acompanhamento', prazo: 180 }
      ],
      condicoesInicioServicos: [
        'Contrato assinado pelas partes',
        'Primeira parcela quitada',
        'Documentação técnica fornecida',
        'Acesso ao terreno liberado'
      ]
    },
    
    garantias: {
      seguroResponsabilidadeCivil: {
        valor: 500000,
        vigencia: 5,
        cobertura: 'Danos materiais e corporais decorrentes da atividade profissional'
      },
      garantiaServicos: {
        prazo: 60,
        escopo: 'Correção de erros de projeto sem ônus adicional'
      },
      caucaoTecnica: {
        percentual: 5,
        valor: 8985.70,
        liberacao: 'Após 60 dias da entrega final sem reclamações'
      }
    },
    
    responsabilidades: {
      contratante: [
        'Fornecer documentação completa do terreno',
        'Garantir acesso ao local para visitas técnicas',
        'Aprovar etapas dentro dos prazos estabelecidos',
        'Efetuar pagamentos conforme cronograma',
        'Fornecer informações adicionais quando solicitadas'
      ],
      contratado: [
        'Elaborar projetos conforme normas técnicas vigentes',
        'Manter sigilo sobre informações do cliente',
        'Cumprir prazos estabelecidos no cronograma',
        'Prestar esclarecimentos técnicos necessários',
        'Manter seguros e garantias em vigor'
      ],
      compartilhadas: [
        'Comunicação eficiente durante todo o processo',
        'Cumprimento das normas de segurança',
        'Preservação do meio ambiente'
      ]
    },
    
    condicoesEspeciais: {
      alteracoesProjeto: 'Alterações solicitadas após aprovação de cada fase serão orçadas separadamente',
      aprovacaoOrgaos: 'Taxas de aprovação por conta do contratante, acompanhamento incluído',
      fornecimentoDocumentos: 'Cliente deve fornecer escritura, levantamento e demais documentos',
      acessoLocal: 'Cliente garante acesso seguro ao terreno para visitas técnicas',
      confidencialidade: 'Informações do projeto são confidenciais por prazo indeterminado'
    },
    
    validadeProposta: {
      dias: 30,
      dataVencimento: new Date('2024-07-16'),
      condicoesRenovacao: 'Valores sujeitos a reajuste após vencimento da proposta'
    }
  },

  // ============================================================================
  // ANEXOS E DOCUMENTOS
  // ============================================================================
  anexos: {
    plantas: [
      'levantamento_topografico.pdf',
      'planta_situacao.pdf'
    ],
    memoriais: [
      'memorial_descritivo_arquitetonico.pdf',
      'memorial_calculo_estrutural.pdf'
    ],
    especificacoes: [
      'especificacoes_tecnicas_gerais.pdf',
      'caderno_encargos.pdf'
    ],
    planilhas: [
      'planilha_orcamentaria.xlsx',
      'cronograma_fisico_financeiro.xlsx'
    ],
    fotos: [
      'foto_terreno_01.jpg',
      'foto_terreno_02.jpg',
      'foto_entorno.jpg'
    ],
    documentos: [
      'escritura_terreno.pdf',
      'certidao_prefeitura.pdf'
    ]
  },

  // ============================================================================
  // OBSERVAÇÕES TÉCNICAS
  // ============================================================================
  observacoesTecnicas: {
    premissas: [
      'Terreno com características geotécnicas favoráveis',
      'Disponibilidade de infraestrutura urbana completa',
      'Cliente com programa de necessidades definido',
      'Aprovação municipal sem restrições especiais',
      'Cronograma sujeito à aprovação tempestiva das etapas'
    ],
    restricoes: [
      'Recuos mínimos conforme legislação municipal',
      'Taxa de ocupação máxima de 60%',
      'Coeficiente de aproveitamento máximo 1,2',
      'Altura máxima de 2 pavimentos',
      'Preservação de árvore existente no lote'
    ],
    riscos: [
      'Alterações na legislação municipal durante o projeto',
      'Descoberta de interferências não previstas no subsolo',
      'Atraso nas aprovações por questões burocráticas',
      'Mudanças significativas no programa pelo cliente',
      'Condições climáticas adversas para visitas técnicas'
    ],
    oportunidades: [
      'Possibilidade de certificação de sustentabilidade',
      'Aproveitamento de incentivos fiscais municipais',
      'Integração com sistemas de automação residencial',
      'Uso de tecnologias construtivas inovadoras',
      'Valorização imobiliária acima da média regional'
    ],
    recomendacoes: [
      'Iniciar processo de aprovação paralelamente ao projeto',
      'Considerar sistemas de captação de água pluvial',
      'Prever instalações para energia solar fotovoltaica',
      'Especificar materiais de fornecedores locais',
      'Manter flexibilidade para futuras ampliações'
    ]
  },

  // ============================================================================
  // CONTROLE DE QUALIDADE
  // ============================================================================
  controleQualidade: {
    revisadoPor: 'Arq. Ana Paula Costa',
    dataRevisao: new Date('2024-06-16'),
    aprovadoPor: 'Eng. Roberto Silva',
    dataAprovacao: new Date('2024-06-16'),
    observacoesQualidade: 'Orçamento revisado e aprovado conforme padrões técnicos da empresa. Valores compatíveis com mercado regional.'
  }
}; 