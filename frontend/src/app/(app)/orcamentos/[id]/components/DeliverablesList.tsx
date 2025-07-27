/**
 * 📝 COMPONENTE DE LISTA DE ENTREGÁVEIS
 * 
 * Lista oficial de entregáveis por fase, conforme NBR 13532
 * Mostra apenas entregáveis das disciplinas ativas
 * Inclui paisagismo e interiores nas fases corretas
 */

import React, { useState } from 'react';
import { BudgetData } from '../types/budget';

interface DeliverablesListProps {
  activeDisciplines: string[];
  budgetData: BudgetData;
  classes: any;
}

// 📋 LISTA OFICIAL COMPLETA DE ENTREGÁVEIS POR FASE E DISCIPLINA
const OFFICIAL_DELIVERABLES = {
  'LV_LEVANTAMENTO': {
    'ARQUITETURA': [
      'Levantamento topográfico georreferenciado',
      'Cadastro técnico da edificação existente (quando aplicável)',
      'Levantamento de dados climáticos e orientação solar',
      'Análise do entorno e condicionantes locais',
      'Levantamento fotográfico do terreno'
    ],
    'ESTRUTURAL': [
      'Análise das condições geotécnicas preliminares',
      'Levantamento de estruturas existentes (quando aplicável)'
    ],
    'APROVACAO_LEGAL': [
      'Levantamento da legislação urbanística aplicável',
      'Consulta aos órgãos competentes',
      'Análise de restrições legais e ambientais'
    ]
  },
  'PN_PROGRAMA': {
    'ARQUITETURA': [
      'Programa arquitetônico detalhado',
      'Organograma funcional',
      'Fluxograma de atividades',
      'Definição de áreas e compartimentos',
      'Análise de necessidades específicas do cliente'
    ]
  },
  'EV_VIABILIDADE': {
    'ARQUITETURA': [
      'Estudo de massa arquitetônico (volumetria, implantação, ocupação do solo)',
      'Análise de viabilidade legal e urbanística conforme o plano diretor',
      'Avaliação de custos preliminar com base em índices',
      'Relatório de viabilidade técnica e econômica',
      'Matriz de riscos iniciais e proposição de soluções'
    ],
    'ESTRUTURAL': [
      'Pré-dimensionamento estrutural',
      'Avaliação da solução estrutural adotada',
      'Análise de viabilidade técnica estrutural'
    ],
    'APROVACAO_LEGAL': [
      'Análise de viabilidade legal preliminar',
      'Verificação de parâmetros urbanísticos',
      'Avaliação de impacto ambiental preliminar (quando aplicável)'
    ]
  },
  'EP_PRELIMINAR': {
    'ARQUITETURA': [
      'Plantas baixas preliminares',
      'Cortes e fachadas principais',
      'Implantação e locação',
      'Memorial justificativo',
      'Definição do partido arquitetônico'
    ],
    'MODELAGEM_3D': [
      'Maquete eletrônica volumétrica',
      '2 renderizações conceituais',
      'Vistas tridimensionais principais'
    ]
  },
  'AP_ANTEPROJETO': {
    'ARQUITETURA': [
      'Plantas baixas definitivas cotadas',
      'Cortes e fachadas detalhadas',
      'Planta de cobertura',
      'Detalhes construtivos básicos',
      'Especificações gerais de materiais'
    ],
    'ESTRUTURAL': [
      'Lançamento estrutural (pilares, vigas, lajes)',
      'Pré-dimensionamento dos elementos estruturais',
      'Compatibilização com projeto arquitetônico',
      'Memorial de cálculo preliminar'
    ],
    'INSTALACOES_ELETRICAS': [
      'Esquema vertical elétrico',
      'Pontos principais de instalações elétricas',
      'Dimensionamento preliminar de quadros',
      'Compatibilização com estrutura e arquitetura'
    ],
    'INSTALACOES_HIDRAULICAS': [
      'Esquema vertical hidráulico',
      'Pontos principais de instalações hidrossanitárias',
      'Dimensionamento preliminar de reservatórios',
      'Sistema de esgoto e águas pluviais'
    ],
    'MODELAGEM_3D': [
      'Modelagem 3D detalhada',
      '4 renderizações fotorrealísticas',
      'Vistas aéreas do projeto',
      'Perspectivas internas principais'
    ]
  },
  'PL_LEGAL': {
    'ARQUITETURA': [
      'Plantas para aprovação legal',
      'Memorial descritivo conforme legislação',
      'Quadro de áreas NBR 13531',
      'Documentação técnica para prefeitura'
    ],
    'APROVACAO_LEGAL': [
      'Projeto legal conforme código de obras',
      'Formulários e documentação oficial',
      'ART/RRT de responsabilidade técnica',
      'Acompanhamento do processo de aprovação',
      'Alvará de construção aprovado'
    ]
  },
  'PB_BASICO': {
    'ARQUITETURA': [
      'Projeto arquitetônico básico completo',
      'Definição de materiais e acabamentos',
      'Indicação de acessos e fluxos',
      'Detalhamentos construtivos principais',
      'Memorial descritivo detalhado'
    ],
    'ESTRUTURAL': [
      'Projeto estrutural básico',
      'Dimensionamento preliminar completo',
      'Memorial de cálculo básico',
      'Especificações de materiais estruturais'
    ],
    'INSTALACOES_ELETRICAS': [
      'Projeto elétrico básico',
      'Dimensionamento de quadros e circuitos',
      'Especificações de materiais elétricos',
      'Diagramas unifilares básicos'
    ],
    'INSTALACOES_HIDRAULICAS': [
      'Projeto hidrossanitário básico',
      'Dimensionamento de tubulações e reservatórios',
      'Especificações de materiais hidráulicos',
      'Sistema de tratamento de esgoto (quando aplicável)'
    ],
    'CLIMATIZACAO': [
      'Projeto de climatização básico',
      'Dimensionamento de equipamentos',
      'Especificações técnicas de AVAC',
      'Memorial de cálculo térmico'
    ],
    'PAISAGISMO': [
      'Projeto paisagístico básico',
      'Especificação de espécies vegetais',
      'Sistema de irrigação preliminar',
      'Detalhamento de áreas verdes'
    ],
    'INTERIORES': [
      'Projeto de interiores básico',
      'Especificação de acabamentos',
      'Layout de mobiliário',
      'Paleta de cores e materiais'
    ]
  },
  'PE_EXECUTIVO': {
    'ARQUITETURA': [
      'Projeto arquitetônico executivo completo',
      'Detalhamentos construtivos em escala apropriada',
      'Paginações e acabamentos detalhados',
      'Especificações técnicas completas',
      'Memorial descritivo executivo'
    ],
    'ESTRUTURAL': [
      'Projeto estrutural executivo completo',
      'Detalhamento de armaduras',
      'Projeto de fundações detalhado',
      'Memorial de cálculo completo',
      'Especificações executivas de materiais'
    ],
    'INSTALACOES_ELETRICAS': [
      'Projeto elétrico executivo completo',
      'Detalhamento de instalações especiais',
      'Lista de materiais e componentes',
      'Diagramas unifilares completos',
      'Projeto de automação (quando aplicável)'
    ],
    'INSTALACOES_HIDRAULICAS': [
      'Projeto hidrossanitário executivo',
      'Detalhamento completo de instalações',
      'Especificações executivas de materiais',
      'Projeto de sistemas especiais',
      'Manual de operação e manutenção'
    ],
    'CLIMATIZACAO': [
      'Projeto de climatização executivo',
      'Detalhamento de dutos e equipamentos',
      'Especificações técnicas executivas',
      'Projeto de automação predial',
      'Manual de operação do sistema'
    ],
    'PAISAGISMO': [
      'Projeto paisagístico executivo',
      'Detalhamento de plantios',
      'Projeto de irrigação completo',
      'Especificações técnicas de jardinagem',
      'Manual de manutenção paisagística'
    ],
    'INTERIORES': [
      'Projeto de interiores executivo',
      'Detalhamento completo de acabamentos',
      'Projeto de mobiliário personalizado',
      'Especificações técnicas de materiais',
      'Projeto de iluminação decorativa'
    ],
    'MODELAGEM_3D': [
      'Modelo 3D executivo completo',
      '6 renderizações finais de alta qualidade',
      'Tour virtual 360°',
      'Animações do projeto (quando aplicável)',
      'Documentação visual completa'
    ]
  }
};

// Informações das fases
const PHASE_INFO = {
  'LV_LEVANTAMENTO': { name: 'Levantamento de Dados', icon: '📐', order: 1 },
  'PN_PROGRAMA': { name: 'Programa de Necessidades', icon: '📋', order: 2 },
  'EV_VIABILIDADE': { name: 'Estudo de Viabilidade', icon: '🔍', order: 3 },
  'EP_PRELIMINAR': { name: 'Estudo Preliminar', icon: '✏️', order: 4 },
  'AP_ANTEPROJETO': { name: 'Anteprojeto', icon: '📐', order: 5 },
  'PL_LEGAL': { name: 'Projeto Legal', icon: '⚖️', order: 6 },
  'PB_BASICO': { name: 'Projeto Básico', icon: '📊', order: 7 },
  'PE_EXECUTIVO': { name: 'Projeto Executivo', icon: '🏗️', order: 8 }
};

// Informações das disciplinas
const DISCIPLINE_INFO = {
  'ARQUITETURA': { name: 'Arquitetura', icon: '🏗️', color: 'blue' },
  'ESTRUTURAL': { name: 'Estrutural', icon: '🏢', color: 'gray' },
  'INSTALACOES_ELETRICAS': { name: 'Elétrica', icon: '⚡', color: 'yellow' },
  'INSTALACOES_HIDRAULICAS': { name: 'Hidráulica', icon: '🚿', color: 'blue' },
  'CLIMATIZACAO': { name: 'AVAC', icon: '❄️', color: 'cyan' },
  'PAISAGISMO': { name: 'Paisagismo', icon: '🌿', color: 'green' },
  'INTERIORES': { name: 'Interiores', icon: '🛋️', color: 'purple' },
  'APROVACAO_LEGAL': { name: 'Legal', icon: '📋', color: 'red' },
  'MODELAGEM_3D': { name: '3D', icon: '🎨', color: 'pink' }
};

export function DeliverablesList({ activeDisciplines, budgetData, classes }: DeliverablesListProps) {
  const [expandedPhases, setExpandedPhases] = useState<Set<string>>(new Set());

  /**
   * 🔄 GERAR ENTREGÁVEIS DINÂMICOS BASEADOS NAS DISCIPLINAS ATIVAS
   */
  const generateDynamicDeliverables = () => {
    const phases = Object.keys(OFFICIAL_DELIVERABLES).map(phaseKey => {
      const phaseDeliverables = OFFICIAL_DELIVERABLES[phaseKey as keyof typeof OFFICIAL_DELIVERABLES];
      const phaseInfo = PHASE_INFO[phaseKey as keyof typeof PHASE_INFO];
      
      // Filtrar entregáveis apenas das disciplinas ativas
      const activeDeliverables: { discipline: string; deliverables: string[] }[] = [];
      let totalDeliverables = 0;

      activeDisciplines.forEach(disciplineCode => {
        const disciplineDeliverables = phaseDeliverables[disciplineCode as keyof typeof phaseDeliverables];
        if (disciplineDeliverables && disciplineDeliverables.length > 0) {
          activeDeliverables.push({
            discipline: disciplineCode,
            deliverables: disciplineDeliverables
          });
          totalDeliverables += disciplineDeliverables.length;
        }
      });

      return {
        id: phaseKey,
        name: phaseInfo.name,
        icon: phaseInfo.icon,
        order: phaseInfo.order,
        activeDeliverables,
        totalDeliverables,
        hasDeliverables: activeDeliverables.length > 0
      };
    }).filter(phase => phase.hasDeliverables);

    return phases.sort((a, b) => a.order - b.order);
  };

  const dynamicPhases = generateDynamicDeliverables();
  const totalDeliverables = dynamicPhases.reduce((sum, phase) => sum + phase.totalDeliverables, 0);

  /**
   * 🔄 TOGGLE EXPANSÃO DA FASE
   */
  const togglePhaseExpansion = (phaseId: string) => {
    const newExpanded = new Set(expandedPhases);
    if (newExpanded.has(phaseId)) {
      newExpanded.delete(phaseId);
    } else {
      newExpanded.add(phaseId);
    }
    setExpandedPhases(newExpanded);
  };

  /**
   * 🎨 OBTER COR DA DISCIPLINA
   */
  const getDisciplineColorClass = (disciplineCode: string) => {
    const disciplineInfo = DISCIPLINE_INFO[disciplineCode as keyof typeof DISCIPLINE_INFO];
    const color = disciplineInfo?.color || 'gray';
    
    return {
      badge: `bg-${color}-100 text-${color}-800 border-${color}-200`,
      header: `bg-${color}-50 border-${color}-200`
    };
  };

  return (
    <div className="mb-8">
      <div className={`rounded-xl p-8 border ${classes.card}`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className={`text-xl font-bold ${classes.text}`}>
            Lista Completa de Entregáveis
          </h3>
          <div className="text-right">
            <div className={`text-2xl font-bold ${classes.textPrimary}`}>
              {totalDeliverables}
            </div>
            <div className={`text-sm ${classes.textSecondary}`}>
              Entregáveis totais
            </div>
          </div>
        </div>

        {/* Resumo Estatístico */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className={`p-4 rounded-lg ${classes.cardSecondary}`}>
            <div className={`text-2xl font-bold ${classes.text}`}>
              {dynamicPhases.length}
            </div>
            <div className={`text-sm ${classes.textSecondary}`}>
              Fases com Entregáveis
            </div>
          </div>
          <div className={`p-4 rounded-lg ${classes.cardSecondary}`}>
            <div className={`text-2xl font-bold ${classes.text}`}>
              {activeDisciplines.length}
            </div>
            <div className={`text-sm ${classes.textSecondary}`}>
              Disciplinas Ativas
            </div>
          </div>
          <div className={`p-4 rounded-lg ${classes.cardSecondary}`}>
            <div className={`text-2xl font-bold ${classes.textPrimary}`}>
              {totalDeliverables}
            </div>
            <div className={`text-sm ${classes.textSecondary}`}>
              Total de Entregáveis
            </div>
          </div>
        </div>

        {/* Lista de Fases e Entregáveis */}
        <div className="space-y-6">
          {dynamicPhases.map(phase => {
            const isExpanded = expandedPhases.has(phase.id);
            
            return (
              <div key={phase.id} className={`border rounded-lg ${classes.cardSecondary}`}>
                {/* Header da Fase */}
                <button
                  onClick={() => togglePhaseExpansion(phase.id)}
                  className={`w-full p-6 text-left transition-all duration-200 hover:bg-opacity-80 ${classes.cardSecondary} rounded-lg`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className="text-2xl">{phase.icon}</span>
                      <div>
                        <h4 className={`text-lg font-semibold ${classes.text}`}>
                          {phase.name}
                        </h4>
                        <p className={`text-sm ${classes.textSecondary}`}>
                          {phase.totalDeliverables} entregáveis • {phase.activeDeliverables.length} disciplinas
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className={`text-lg font-bold ${classes.textPrimary}`}>
                        {phase.totalDeliverables}
                      </div>
                      <svg 
                        className={`w-5 h-5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''} ${classes.textSecondary}`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </button>

                {/* Conteúdo Expandido */}
                {isExpanded && (
                  <div className="px-6 pb-6">
                    <div className="space-y-6">
                      {phase.activeDeliverables.map(({ discipline, deliverables }) => {
                        const disciplineInfo = DISCIPLINE_INFO[discipline as keyof typeof DISCIPLINE_INFO] || {
                          name: discipline,
                          icon: '📋',
                          color: 'gray'
                        };
                        const colorClasses = getDisciplineColorClass(discipline);

                        return (
                          <div key={discipline} className={`border rounded-lg ${colorClasses.header}`}>
                            {/* Header da Disciplina */}
                            <div className="p-4 border-b">
                              <div className="flex items-center gap-3">
                                <span className="text-xl">{disciplineInfo.icon}</span>
                                <div>
                                  <h5 className={`font-semibold ${classes.text}`}>
                                    {disciplineInfo.name}
                                  </h5>
                                  <p className={`text-sm ${classes.textSecondary}`}>
                                    {deliverables.length} entregáveis
                                  </p>
                                </div>
                                <span className={`ml-auto px-3 py-1 text-xs rounded-full font-medium ${colorClasses.badge}`}>
                                  {deliverables.length}
                                </span>
                              </div>
                            </div>

                            {/* Lista de Entregáveis */}
                            <div className="p-4">
                              <div className="grid grid-cols-1 gap-3">
                                {deliverables.map((deliverable, index) => (
                                  <div 
                                    key={index}
                                    className={`flex items-start gap-3 p-3 rounded-lg ${classes.card} transition-all duration-200 hover:shadow-sm`}
                                  >
                                    <div className="flex-shrink-0 mt-1">
                                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${classes.backgroundPrimary}`}>
                                        {index + 1}
                                      </div>
                                    </div>
                                    <div className="flex-1">
                                      <p className={`text-sm ${classes.text} leading-relaxed`}>
                                        {deliverable}
                                      </p>
                                    </div>
                                    <div className="flex-shrink-0">
                                      <span className="text-green-500 text-lg" title="Entregável incluído">
                                        ✓
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Aviso se não há entregáveis */}
        {dynamicPhases.length === 0 && (
          <div className={`text-center py-12 ${classes.textSecondary}`}>
            <div className="text-6xl mb-4">📝</div>
            <h4 className={`text-lg font-semibold mb-2 ${classes.text}`}>
              Nenhum entregável encontrado
            </h4>
            <p className="mb-4">
              Ative disciplinas para ver os entregáveis correspondentes
            </p>
            <a
              href="/orcamentos/configuracoes"
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${classes.buttonPrimary}`}
            >
              Configurar Disciplinas
            </a>
          </div>
        )}

        {/* Observações */}
        <div className={`mt-8 p-4 rounded-lg ${classes.cardTertiary}`}>
          <h5 className={`font-semibold mb-2 ${classes.text}`}>
            📋 Observações sobre os Entregáveis
          </h5>
          <ul className={`text-sm ${classes.textSecondary} space-y-1`}>
            <li>• Lista baseada na NBR 13532 e práticas profissionais</li>
            <li>• Entregáveis podem variar conforme especificidades do projeto</li>
            <li>• Disciplinas especializadas têm entregáveis específicos por fase</li>
            <li>• Paisagismo e interiores aparecem nas fases apropriadas</li>
            <li>• Total de entregáveis: <strong>{totalDeliverables}</strong></li>
          </ul>
        </div>
      </div>
    </div>
  );
}