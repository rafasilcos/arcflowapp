'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// ===== TIPOS DE TEMPLATES =====
export interface ProjectTemplate {
  id: string;
  nome: string;
  tipologia: string;
  subtipo?: string;
  padrao: 'simples' | 'medio' | 'alto_padrao' | 'premium';
  disciplinas: string[];
  etapas: EtapaTemplate[];
  configuracoes: TemplateConfig;
  metadata: TemplateMetadata;
}

export interface EtapaTemplate {
  id: string;
  nome: string;
  descricao: string;
  ordem: number;
  disciplinas: string[];
  prazoEstimado: number; // em dias
  obrigatoria: boolean;
  dependeDe: string[]; // IDs de etapas dependentes
  tarefas: TarefaTemplate[];
  configuracoes?: {
    corPersonalizada?: string;
    iconePersonalizado?: string;
    alertasEspeciais?: boolean;
  };
}

export interface TarefaTemplate {
  id: string;
  nome: string;
  descricao: string;
  disciplina: string;
  estimativaHoras: number;
  prioridade: 'baixa' | 'media' | 'alta' | 'urgente';
  dependeDe: string[];
  obrigatoria: boolean;
  template_notas?: string; // Template de notas pré-definido
  checklist?: string[]; // Lista de verificação
}

export interface TemplateConfig {
  // Configurações visuais
  tema: {
    corPrimaria: string;
    corSecundaria: string;
    iconeTemplate: string;
  };
  
  // Configurações funcionais
  funcionalidades: {
    comunicacaoEquipe: boolean;
    modeFoco: boolean;
    gamificacao: boolean;
    relatorioProdutividade: boolean;
    integracaoCalendario: boolean;
  };
  
  // Configurações de workflow
  workflow: {
    aprovacaoObrigatoria: boolean;
    revisaoAutomatica: boolean;
    notificacoesPush: boolean;
    backupAutomatico: boolean;
  };
  
  // Configurações específicas por disciplina
  disciplinasConfig: Record<string, {
    corIdentificacao: string;
    templateNotas: string;
    checklistPadrao: string[];
  }>;
}

export interface TemplateMetadata {
  versao: string;
  criadoEm: string;
  atualizadoEm: string;
  autor: string;
  categoria: string;
  tags: string[];
  compativel: string[]; // Versões compatíveis
}

// ===== TEMPLATES DISPONÍVEIS =====
export const TEMPLATES_PROJETOS: Record<string, ProjectTemplate> = {
  // RESIDENCIAL - CASA SIMPLES
  'residencial-casa-simples': {
    id: 'residencial-casa-simples',
    nome: 'Casa Residencial - Padrão Simples',
    tipologia: 'residencial',
    subtipo: 'casa_unifamiliar',
    padrao: 'simples',
    disciplinas: ['Arquitetura', 'Estrutural', 'Instalações'],
    etapas: [
      {
        id: 'levantamento',
        nome: 'Levantamento e Análise',
        descricao: 'Coleta de dados e análise do terreno',
        ordem: 1,
        disciplinas: ['Arquitetura'],
        prazoEstimado: 5,
        obrigatoria: true,
        dependeDe: [],
        tarefas: [
          {
            id: 'lev-01',
            nome: 'Visita técnica ao terreno',
            descricao: 'Levantamento das características do terreno',
            disciplina: 'Arquitetura',
            estimativaHoras: 4,
            prioridade: 'alta',
            dependeDe: [],
            obrigatoria: true,
            template_notas: 'Medições realizadas:\n- Dimensões: \n- Topografia: \n- Orientação solar: \n- Observações: ',
            checklist: ['Medir dimensões', 'Verificar topografia', 'Analisar orientação solar', 'Fotografar terreno']
          },
          {
            id: 'lev-02',
            nome: 'Análise de viabilidade',
            descricao: 'Verificação de viabilidade técnica e legal',
            disciplina: 'Arquitetura',
            estimativaHoras: 6,
            prioridade: 'alta',
            dependeDe: ['lev-01'],
            obrigatoria: true,
            template_notas: 'Análise de viabilidade:\n- Legislação: \n- Recuos: \n- Taxa de ocupação: \n- Gabarito: ',
            checklist: ['Consultar legislação', 'Calcular recuos', 'Verificar taxa ocupação', 'Analisar gabarito']
          }
        ]
      },
      {
        id: 'estudo_preliminar',
        nome: 'Estudo Preliminar',
        descricao: 'Desenvolvimento das primeiras ideias',
        ordem: 2,
        disciplinas: ['Arquitetura'],
        prazoEstimado: 10,
        obrigatoria: true,
        dependeDe: ['levantamento'],
        tarefas: [
          {
            id: 'ep-01',
            nome: 'Estudo de implantação',
            descricao: 'Definição da implantação da edificação',
            disciplina: 'Arquitetura',
            estimativaHoras: 8,
            prioridade: 'alta',
            dependeDe: [],
            obrigatoria: true,
            template_notas: 'Estudo de implantação:\n- Posicionamento: \n- Orientação: \n- Acessos: \n- Áreas externas: ',
            checklist: ['Definir posicionamento', 'Otimizar orientação', 'Planejar acessos', 'Organizar áreas externas']
          },
          {
            id: 'ep-02',
            nome: 'Plantas baixas preliminares',
            descricao: 'Desenvolvimento das plantas baixas iniciais',
            disciplina: 'Arquitetura',
            estimativaHoras: 16,
            prioridade: 'alta',
            dependeDe: ['ep-01'],
            obrigatoria: true,
            template_notas: 'Plantas baixas:\n- Programa atendido: \n- Circulação: \n- Dimensionamento: \n- Ajustes necessários: ',
            checklist: ['Distribuir ambientes', 'Definir circulação', 'Dimensionar cômodos', 'Revisar programa']
          }
        ]
      },
      {
        id: 'anteprojeto',
        nome: 'Anteprojeto',
        descricao: 'Desenvolvimento do anteprojeto completo',
        ordem: 3,
        disciplinas: ['Arquitetura', 'Estrutural', 'Instalações'],
        prazoEstimado: 20,
        obrigatoria: true,
        dependeDe: ['estudo_preliminar'],
        tarefas: [
          {
            id: 'ap-01',
            nome: 'Plantas baixas definitivas',
            descricao: 'Finalização das plantas baixas',
            disciplina: 'Arquitetura',
            estimativaHoras: 20,
            prioridade: 'alta',
            dependeDe: [],
            obrigatoria: true,
            template_notas: 'Plantas definitivas:\n- Revisões realizadas: \n- Aprovação cliente: \n- Pendências: ',
            checklist: ['Revisar dimensões', 'Ajustar detalhes', 'Validar com cliente', 'Preparar para complementares']
          },
          {
            id: 'ap-02',
            nome: 'Projeto estrutural preliminar',
            descricao: 'Desenvolvimento da estrutura básica',
            disciplina: 'Estrutural',
            estimativaHoras: 24,
            prioridade: 'alta',
            dependeDe: ['ap-01'],
            obrigatoria: true,
            template_notas: 'Estrutura preliminar:\n- Sistema adotado: \n- Dimensionamento: \n- Interferências: ',
            checklist: ['Definir sistema estrutural', 'Dimensionar elementos', 'Verificar interferências', 'Calcular cargas']
          },
          {
            id: 'ap-03',
            nome: 'Instalações preliminares',
            descricao: 'Projeto básico de instalações',
            disciplina: 'Instalações',
            estimativaHoras: 16,
            prioridade: 'media',
            dependeDe: ['ap-01'],
            obrigatoria: true,
            template_notas: 'Instalações preliminares:\n- Pontos elétricos: \n- Pontos hidráulicos: \n- Dimensionamento: ',
            checklist: ['Definir pontos elétricos', 'Localizar pontos hidráulicos', 'Dimensionar instalações', 'Verificar compatibilidade']
          }
        ]
      },
      {
        id: 'projeto_executivo',
        nome: 'Projeto Executivo',
        descricao: 'Detalhamento completo para execução',
        ordem: 4,
        disciplinas: ['Arquitetura', 'Estrutural', 'Instalações'],
        prazoEstimado: 30,
        obrigatoria: true,
        dependeDe: ['anteprojeto'],
        tarefas: [
          {
            id: 'pe-01',
            nome: 'Detalhamento arquitetônico',
            descricao: 'Todos os detalhes construtivos',
            disciplina: 'Arquitetura',
            estimativaHoras: 40,
            prioridade: 'alta',
            dependeDe: [],
            obrigatoria: true,
            template_notas: 'Detalhamento:\n- Detalhes executados: \n- Especificações: \n- Revisões: ',
            checklist: ['Detalhar elementos', 'Especificar materiais', 'Revisar compatibilidade', 'Finalizar pranchas']
          }
        ]
      }
    ],
    configuracoes: {
      tema: {
        corPrimaria: '#3B82F6', // Azul para residencial simples
        corSecundaria: '#EFF6FF',
        iconeTemplate: '🏠'
      },
      funcionalidades: {
        comunicacaoEquipe: true,
        modeFoco: true,
        gamificacao: true,
        relatorioProdutividade: true,
        integracaoCalendario: false // Simples não precisa
      },
      workflow: {
        aprovacaoObrigatoria: false, // Simples é mais direto
        revisaoAutomatica: true,
        notificacoesPush: true,
        backupAutomatico: true
      },
      disciplinasConfig: {
        'Arquitetura': {
          corIdentificacao: '#3B82F6',
          templateNotas: 'Progresso arquitetônico:\n- Desenvolvido: \n- Pendências: \n- Próximos passos: ',
          checklistPadrao: ['Verificar dimensões', 'Validar proporções', 'Conferir especificações']
        },
        'Estrutural': {
          corIdentificacao: '#DC2626',
          templateNotas: 'Progresso estrutural:\n- Cálculos: \n- Verificações: \n- Interferências: ',
          checklistPadrao: ['Verificar cargas', 'Calcular elementos', 'Conferir normas']
        },
        'Instalações': {
          corIdentificacao: '#F59E0B',
          templateNotas: 'Progresso instalações:\n- Sistemas: \n- Dimensionamento: \n- Compatibilização: ',
          checklistPadrao: ['Verificar pontos', 'Calcular cargas', 'Compatibilizar']
        }
      }
    },
    metadata: {
      versao: '1.0',
      criadoEm: '2024-01-01',
      atualizadoEm: '2024-12-19',
      autor: 'ArcFlow System',
      categoria: 'residencial',
      tags: ['casa', 'simples', 'residencial', 'unifamiliar'],
      compativel: ['1.0', '1.1', '1.2']
    }
  },

  // COMERCIAL - ESCRITÓRIO
  'comercial-escritorio': {
    id: 'comercial-escritorio',
    nome: 'Escritório Comercial',
    tipologia: 'comercial',
    subtipo: 'escritorio',
    padrao: 'medio',
    disciplinas: ['Arquitetura', 'Instalações', 'Design', 'Sustentabilidade'],
    etapas: [
      {
        id: 'briefing_comercial',
        nome: 'Briefing e Análise Comercial',
        descricao: 'Levantamento específico para ambiente corporativo',
        ordem: 1,
        disciplinas: ['Arquitetura', 'Design'],
        prazoEstimado: 7,
        obrigatoria: true,
        dependeDe: [],
        tarefas: [
          {
            id: 'bc-01',
            nome: 'Análise do negócio',
            descricao: 'Compreensão da atividade e necessidades',
            disciplina: 'Arquitetura',
            estimativaHoras: 6,
            prioridade: 'alta',
            dependeDe: [],
            obrigatoria: true,
            template_notas: 'Análise do negócio:\n- Atividade principal: \n- Fluxo de trabalho: \n- Necessidades específicas: \n- Crescimento previsto: ',
            checklist: ['Entender atividade', 'Mapear fluxos', 'Identificar necessidades', 'Prever crescimento']
          },
          {
            id: 'bc-02',
            nome: 'Programa de necessidades comercial',
            descricao: 'Definição detalhada dos ambientes',
            disciplina: 'Arquitetura',
            estimativaHoras: 8,
            prioridade: 'alta',
            dependeDe: ['bc-01'],
            obrigatoria: true,
            template_notas: 'Programa comercial:\n- Ambientes necessários: \n- Dimensionamento: \n- Relações funcionais: \n- Requisitos especiais: ',
            checklist: ['Listar ambientes', 'Dimensionar espaços', 'Definir relações', 'Especificar requisitos']
          }
        ]
      },
      {
        id: 'conceito_corporativo',
        nome: 'Conceito e Layout Corporativo',
        descricao: 'Desenvolvimento do conceito e layout',
        ordem: 2,
        disciplinas: ['Arquitetura', 'Design'],
        prazoEstimado: 12,
        obrigatoria: true,
        dependeDe: ['briefing_comercial'],
        tarefas: [
          {
            id: 'cc-01',
            nome: 'Conceito arquitetônico corporativo',
            descricao: 'Definição do conceito e identidade',
            disciplina: 'Design',
            estimativaHoras: 12,
            prioridade: 'alta',
            dependeDe: [],
            obrigatoria: true,
            template_notas: 'Conceito corporativo:\n- Identidade da marca: \n- Conceito espacial: \n- Materiais conceituais: \n- Aprovação cliente: ',
            checklist: ['Definir identidade', 'Criar conceito', 'Selecionar materiais', 'Apresentar cliente']
          },
          {
            id: 'cc-02',
            nome: 'Layout funcional',
            descricao: 'Organização espacial otimizada',
            disciplina: 'Arquitetura',
            estimativaHoras: 16,
            prioridade: 'alta',
            dependeDe: ['cc-01'],
            obrigatoria: true,
            template_notas: 'Layout funcional:\n- Distribuição otimizada: \n- Fluxos de circulação: \n- Áreas de apoio: \n- Flexibilidade: ',
            checklist: ['Otimizar distribuição', 'Definir circulação', 'Posicionar apoios', 'Garantir flexibilidade']
          }
        ]
      },
      {
        id: 'projeto_comercial',
        nome: 'Projeto Comercial Completo',
        descricao: 'Desenvolvimento completo do projeto',
        ordem: 3,
        disciplinas: ['Arquitetura', 'Instalações', 'Design', 'Sustentabilidade'],
        prazoEstimado: 25,
        obrigatoria: true,
        dependeDe: ['conceito_corporativo'],
        tarefas: [
          {
            id: 'pc-01',
            nome: 'Projeto arquitetônico comercial',
            descricao: 'Plantas, cortes e fachadas',
            disciplina: 'Arquitetura',
            estimativaHoras: 30,
            prioridade: 'alta',
            dependeDe: [],
            obrigatoria: true,
            template_notas: 'Projeto arquitetônico:\n- Plantas desenvolvidas: \n- Cortes e fachadas: \n- Detalhes específicos: \n- Compatibilização: ',
            checklist: ['Desenvolver plantas', 'Criar cortes/fachadas', 'Detalhar elementos', 'Compatibilizar projeto']
          },
          {
            id: 'pc-02',
            nome: 'Instalações comerciais',
            descricao: 'Projeto de instalações especializadas',
            disciplina: 'Instalações',
            estimativaHoras: 24,
            prioridade: 'alta',
            dependeDe: ['pc-01'],
            obrigatoria: true,
            template_notas: 'Instalações comerciais:\n- Elétrica/dados: \n- Ar condicionado: \n- Segurança: \n- Automação: ',
            checklist: ['Projetar elétrica/dados', 'Dimensionar ar condicionado', 'Planejar segurança', 'Integrar automação']
          },
          {
            id: 'pc-03',
            nome: 'Design de interiores',
            descricao: 'Projeto de interiores corporativo',
            disciplina: 'Design',
            estimativaHoras: 28,
            prioridade: 'media',
            dependeDe: ['pc-01'],
            obrigatoria: false,
            template_notas: 'Design de interiores:\n- Especificações: \n- Mobiliário: \n- Iluminação: \n- Identidade visual: ',
            checklist: ['Especificar acabamentos', 'Definir mobiliário', 'Projetar iluminação', 'Aplicar identidade']
          },
          {
            id: 'pc-04',
            nome: 'Sustentabilidade e eficiência',
            descricao: 'Estratégias sustentáveis',
            disciplina: 'Sustentabilidade',
            estimativaHoras: 16,
            prioridade: 'media',
            dependeDe: ['pc-02'],
            obrigatoria: false,
            template_notas: 'Sustentabilidade:\n- Eficiência energética: \n- Uso de água: \n- Materiais sustentáveis: \n- Certificações: ',
            checklist: ['Otimizar energia', 'Reduzir água', 'Especificar materiais', 'Buscar certificações']
          }
        ]
      }
    ],
    configuracoes: {
      tema: {
        corPrimaria: '#059669', // Verde para comercial
        corSecundaria: '#ECFDF5',
        iconeTemplate: '🏢'
      },
      funcionalidades: {
        comunicacaoEquipe: true,
        modeFoco: true,
        gamificacao: true,
        relatorioProdutividade: true,
        integracaoCalendario: true // Comercial precisa de integração
      },
      workflow: {
        aprovacaoObrigatoria: true, // Comercial precisa de mais controle
        revisaoAutomatica: true,
        notificacoesPush: true,
        backupAutomatico: true
      },
      disciplinasConfig: {
        'Arquitetura': {
          corIdentificacao: '#059669',
          templateNotas: 'Progresso arquitetônico comercial:\n- Funcionalidade: \n- Fluxos: \n- Normas: \n- Aprovações: ',
          checklistPadrao: ['Verificar normas comerciais', 'Validar fluxos', 'Conferir acessibilidade']
        },
        'Instalações': {
          corIdentificacao: '#DC2626',
          templateNotas: 'Instalações comerciais:\n- Cargas especiais: \n- Automação: \n- Segurança: \n- Eficiência: ',
          checklistPadrao: ['Calcular cargas comerciais', 'Planejar automação', 'Integrar segurança']
        },
        'Design': {
          corIdentificacao: '#7C3AED',
          templateNotas: 'Design corporativo:\n- Identidade: \n- Funcionalidade: \n- Conforto: \n- Produtividade: ',
          checklistPadrao: ['Aplicar identidade', 'Otimizar funcionalidade', 'Garantir conforto']
        },
        'Sustentabilidade': {
          corIdentificacao: '#059669',
          templateNotas: 'Sustentabilidade:\n- Eficiência energética: \n- Recursos naturais: \n- Certificações: ',
          checklistPadrao: ['Otimizar energia', 'Reduzir recursos', 'Buscar certificações']
        }
      }
    },
    metadata: {
      versao: '1.0',
      criadoEm: '2024-01-01',
      atualizadoEm: '2024-12-19',
      autor: 'ArcFlow System',
      categoria: 'comercial',
      tags: ['escritorio', 'comercial', 'corporativo', 'sustentavel'],
      compativel: ['1.0', '1.1', '1.2']
    }
  }
};

// ===== FUNÇÃO PARA DETECTAR TEMPLATE BASEADO NO BRIEFING =====
export function detectarTemplatePorBriefing(briefingData: any): ProjectTemplate {
  const tipologia = briefingData.tipologia?.toLowerCase() || 'residencial';
  const subtipo = briefingData.subtipo?.toLowerCase() || 'casa';
  const padrao = briefingData.padrao?.toLowerCase() || 'simples';
  
  // Lógica de detecção baseada nos dados do briefing
  if (tipologia === 'residencial' && subtipo.includes('casa')) {
    return TEMPLATES_PROJETOS['residencial-casa-simples'];
  }
  
  if (tipologia === 'comercial' && subtipo.includes('escritorio')) {
    return TEMPLATES_PROJETOS['comercial-escritorio'];
  }
  
  // Template padrão se não encontrar correspondência
  return TEMPLATES_PROJETOS['residencial-casa-simples'];
}

// ===== FUNÇÃO PARA PERSONALIZAR TEMPLATE =====
export function personalizarTemplate(
  template: ProjectTemplate, 
  briefingData: any
): ProjectTemplate {
  const templatePersonalizado = JSON.parse(JSON.stringify(template)); // Deep clone
  
  // 1. Ajustar disciplinas baseado no briefing
  if (briefingData.disciplinasSelecionadas) {
    templatePersonalizado.disciplinas = briefingData.disciplinasSelecionadas;
  }
  
  // 2. Ajustar prazos baseado na urgência
  if (briefingData.urgencia === 'urgente') {
    templatePersonalizado.etapas.forEach((etapa: any) => {
      etapa.prazoEstimado = Math.ceil(etapa.prazoEstimado * 0.7); // Reduz 30%
    });
  }
  
  // 3. Adicionar etapas específicas baseado nas necessidades
  if (briefingData.necessidadePaisagismo) {
    // Adicionar etapa de paisagismo
    templatePersonalizado.etapas.push({
      id: 'paisagismo',
      nome: 'Projeto Paisagístico',
      descricao: 'Desenvolvimento do projeto de paisagismo',
      ordem: templatePersonalizado.etapas.length + 1,
      disciplinas: ['Paisagismo'],
      prazoEstimado: 15,
      obrigatoria: false,
      dependeDe: ['anteprojeto'],
      tarefas: [
        {
          id: 'pais-01',
          nome: 'Projeto paisagístico',
          descricao: 'Desenvolvimento completo do paisagismo',
          disciplina: 'Paisagismo',
          estimativaHoras: 20,
          prioridade: 'media',
          dependeDe: [],
          obrigatoria: true,
          template_notas: 'Paisagismo:\n- Conceito: \n- Espécies: \n- Irrigação: \n- Manutenção: ',
          checklist: ['Definir conceito', 'Selecionar espécies', 'Projetar irrigação', 'Planejar manutenção']
        }
      ]
    });
  }
  
  // 4. Personalizar configurações baseado no padrão
  if (briefingData.padrao === 'premium') {
    templatePersonalizado.configuracoes.funcionalidades.integracaoCalendario = true;
    templatePersonalizado.configuracoes.workflow.aprovacaoObrigatoria = true;
  }
  
  return templatePersonalizado;
}

// ===== HOOK PARA USAR TEMPLATE =====
export function useProjectTemplate(projetoId: string, briefingData?: any) {
  const [template, setTemplate] = useState<ProjectTemplate | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (briefingData) {
      // Detectar e personalizar template baseado no briefing
      const templateBase = detectarTemplatePorBriefing(briefingData);
      const templatePersonalizado = personalizarTemplate(templateBase, briefingData);
      setTemplate(templatePersonalizado);
    } else {
      // Usar template padrão
      setTemplate(TEMPLATES_PROJETOS['residencial-casa-simples']);
    }
    setLoading(false);
  }, [briefingData]);
  
  return { template, loading };
}

export default function ProjectTemplate({ children, template }: { 
  children: React.ReactNode; 
  template: ProjectTemplate;
}) {
  return (
    <div 
      className="project-template"
      style={{
        '--primary-color': template.configuracoes.tema.corPrimaria,
        '--secondary-color': template.configuracoes.tema.corSecundaria,
      } as React.CSSProperties}
    >
      {children}
    </div>
  );
} 