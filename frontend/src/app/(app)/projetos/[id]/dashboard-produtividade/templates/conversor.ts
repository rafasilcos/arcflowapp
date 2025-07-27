// ===== CONVERSOR AUTOMÁTICO DE TEMPLATES =====
// Este arquivo converte dados em formato texto para TypeScript

export interface RawTemplateData {
  tipologia: string;
  subtipo: string;
  padrao: string;
  nome_template: string;
  icone_principal: string;
  cor_primaria: string;
  cor_secundaria: string;
  disciplinas: string;
  etapas: RawEtapa[];
}

export interface RawEtapa {
  nome: string;
  status: string;
  progresso: number;
  cor_tema: string;
  icone: string;
  tarefas: RawTarefa[];
}

export interface RawTarefa {
  nome: string;
  descricao: string;
  responsavel: string;
  disciplina: string;
  tempo_estimado: string;
  prioridade: string;
  data_vencimento: string;
  template_notas: string;
  checklist: string[];
}

// ===== FUNÇÃO PRINCIPAL DE CONVERSÃO =====
export function parseTemplateData(rawText: string): RawTemplateData {
  const lines = rawText.split('\n').map(line => line.trim()).filter(line => line);
  
  const data: Partial<RawTemplateData> = {};
  const etapas: RawEtapa[] = [];
  
  let currentEtapa: Partial<RawEtapa> | null = null;
  let currentTarefa: Partial<RawTarefa> | null = null;
  let isInEtapas = false;
  
  for (const line of lines) {
    // Detectar início das etapas
    if (line === '=== ETAPAS ===') {
      isInEtapas = true;
      continue;
    }
    
    if (!isInEtapas) {
      // Processar metadados do template
      const [key, ...valueParts] = line.split(':');
      const value = valueParts.join(':').trim();
      
      switch (key.trim()) {
        case 'TIPOLOGIA':
          data.tipologia = value;
          break;
        case 'SUBTIPO':
          data.subtipo = value;
          break;
        case 'PADRÃO':
          data.padrao = value;
          break;
        case 'NOME_TEMPLATE':
          data.nome_template = value;
          break;
        case 'ICONE_PRINCIPAL':
          data.icone_principal = value;
          break;
        case 'COR_PRIMARIA':
          data.cor_primaria = value;
          break;
        case 'COR_SECUNDARIA':
          data.cor_secundaria = value;
          break;
        case 'DISCIPLINAS':
          data.disciplinas = value;
          break;
      }
    } else {
      // Processar etapas e tarefas
      if (line.startsWith('ETAPA_')) {
        // Salvar etapa anterior se existir
        if (currentEtapa && currentEtapa.nome) {
          etapas.push(currentEtapa as RawEtapa);
        }
        
        // Iniciar nova etapa
        currentEtapa = { tarefas: [] };
        continue;
      }
      
      if (line.startsWith('TAREFA_')) {
        // Salvar tarefa anterior se existir
        if (currentTarefa && currentTarefa.nome && currentEtapa) {
          currentEtapa.tarefas!.push(currentTarefa as RawTarefa);
        }
        
        // Iniciar nova tarefa
        currentTarefa = {};
        continue;
      }
      
      // Processar propriedades
      const [key, ...valueParts] = line.split(':');
      const value = valueParts.join(':').trim();
      
      if (currentTarefa && !currentEtapa?.nome && key.trim() !== 'NOME') {
        // Estamos processando uma tarefa, mas ainda não temos o nome da etapa
        continue;
      }
      
      if (!currentEtapa?.nome) {
        // Propriedades da etapa
        switch (key.trim()) {
          case 'NOME':
            currentEtapa!.nome = value;
            break;
          case 'STATUS':
            currentEtapa!.status = value;
            break;
          case 'PROGRESSO':
            currentEtapa!.progresso = parseInt(value);
            break;
          case 'COR_TEMA':
            currentEtapa!.cor_tema = value;
            break;
          case 'ICONE':
            currentEtapa!.icone = value;
            break;
        }
      } else {
        // Propriedades da tarefa
        switch (key.trim()) {
          case 'NOME':
            currentTarefa!.nome = value;
            break;
          case 'DESCRICAO':
            currentTarefa!.descricao = value;
            break;
          case 'RESPONSAVEL':
            currentTarefa!.responsavel = value;
            break;
          case 'DISCIPLINA':
            currentTarefa!.disciplina = value;
            break;
          case 'TEMPO_ESTIMADO':
            currentTarefa!.tempo_estimado = value;
            break;
          case 'PRIORIDADE':
            currentTarefa!.prioridade = value;
            break;
          case 'DATA_VENCIMENTO':
            currentTarefa!.data_vencimento = value;
            break;
          case 'TEMPLATE_NOTAS':
            currentTarefa!.template_notas = value.replace(/\\n/g, '\n');
            break;
          case 'CHECKLIST':
            currentTarefa!.checklist = value.split('|').map(item => item.trim());
            break;
        }
      }
    }
  }
  
  // Salvar última tarefa e etapa
  if (currentTarefa && currentTarefa.nome && currentEtapa) {
    currentEtapa.tarefas!.push(currentTarefa as RawTarefa);
  }
  if (currentEtapa && currentEtapa.nome) {
    etapas.push(currentEtapa as RawEtapa);
  }
  
  return {
    ...data,
    etapas
  } as RawTemplateData;
}

// ===== FUNÇÃO PARA GERAR CÓDIGO TYPESCRIPT =====
export function generateTypeScriptTemplate(data: RawTemplateData): string {
  const templateId = `${data.tipologia}-${data.subtipo}-${data.padrao}`;
  const disciplinasArray = data.disciplinas.split(',').map(d => `'${d.trim()}'`).join(', ');
  
  let tsCode = `import { ProjectTemplate } from '../../data/projectTemplates';

// ===== TEMPLATE: ${data.tipologia.toUpperCase()} - ${data.subtipo.toUpperCase()} ${data.padrao.toUpperCase()} =====
const template: ProjectTemplate = {
  id: '${templateId}',
  nome: '${data.nome_template}',
  tipologia: '${data.tipologia}',
  subtipo: '${data.subtipo}',
  padrao: '${data.padrao}',
  configuracoes: {
    tema: {
      cor_primaria: '${data.cor_primaria}',
      cor_secundaria: '${data.cor_secundaria}',
      icone: '${data.icone_principal}'
    },
    disciplinas: [${disciplinasArray}],
    comunicacao_equipe: true,
    modo_foco: true,
    gamificacao: true
  },
  etapas: [
`;

  data.etapas.forEach((etapa, etapaIndex) => {
    tsCode += `    {
      id: ${etapaIndex + 1},
      nome: '${etapa.nome}',
      status: '${etapa.status}',
      progresso: ${etapa.progresso},
      cor_tema: '${etapa.cor_tema}',
      icone: '${etapa.icone}',
      tarefas: [
`;

    etapa.tarefas.forEach((tarefa, tarefaIndex) => {
      const tarefaId = (etapaIndex * 10) + tarefaIndex + 1;
      const checklistItems = tarefa.checklist.map(item => `'${item}'`).join(', ');
      
      tsCode += `        {
          id: ${tarefaId},
          nome: '${tarefa.nome}',
          descricao: '${tarefa.descricao}',
          status: '${mapearStatusTarefa(etapa.status)}',
          prioridade: '${tarefa.prioridade}',
          responsavel: '${tarefa.responsavel}',
          disciplina: '${tarefa.disciplina}',
          tempoEstimado: '${tarefa.tempo_estimado}',
          tempoGasto: '0h',
          progresso: ${etapa.status === 'concluida' ? 100 : (etapa.status === 'em_andamento' ? 50 : 0)},
          dataVencimento: '${tarefa.data_vencimento}',
          template_notas: '${tarefa.template_notas}',
          checklist: [${checklistItems}],
          historico: []
        }${tarefaIndex < etapa.tarefas.length - 1 ? ',' : ''}
`;
    });

    tsCode += `      ]
    }${etapaIndex < data.etapas.length - 1 ? ',' : ''}
`;
  });

  tsCode += `  ]
};

export default template;`;

  return tsCode;
}

// ===== FUNÇÃO AUXILIAR PARA MAPEAR STATUS =====
function mapearStatusTarefa(statusEtapa: string): string {
  switch (statusEtapa) {
    case 'concluida':
      return 'concluida';
    case 'em_andamento':
      return 'em_andamento';
    default:
      return 'pendente';
  }
}

// ===== FUNÇÃO PARA VALIDAR DADOS =====
export function validateTemplateData(data: RawTemplateData): string[] {
  const errors: string[] = [];
  
  // Validar campos obrigatórios
  if (!data.tipologia) errors.push('TIPOLOGIA é obrigatória');
  if (!data.subtipo) errors.push('SUBTIPO é obrigatório');
  if (!data.padrao) errors.push('PADRÃO é obrigatório');
  if (!data.nome_template) errors.push('NOME_TEMPLATE é obrigatório');
  if (!data.icone_principal) errors.push('ICONE_PRINCIPAL é obrigatório');
  if (!data.cor_primaria) errors.push('COR_PRIMARIA é obrigatória');
  if (!data.cor_secundaria) errors.push('COR_SECUNDARIA é obrigatória');
  if (!data.disciplinas) errors.push('DISCIPLINAS são obrigatórias');
  
  // Validar etapas
  if (!data.etapas || data.etapas.length === 0) {
    errors.push('Pelo menos uma ETAPA é obrigatória');
  }
  
  // Validar cada etapa
  data.etapas?.forEach((etapa, index) => {
    if (!etapa.nome) errors.push(`ETAPA ${index + 1}: NOME é obrigatório`);
    if (!etapa.status) errors.push(`ETAPA ${index + 1}: STATUS é obrigatório`);
    if (etapa.progresso === undefined) errors.push(`ETAPA ${index + 1}: PROGRESSO é obrigatório`);
    if (!etapa.cor_tema) errors.push(`ETAPA ${index + 1}: COR_TEMA é obrigatória`);
    if (!etapa.icone) errors.push(`ETAPA ${index + 1}: ICONE é obrigatório`);
    
    // Validar tarefas da etapa
    if (!etapa.tarefas || etapa.tarefas.length === 0) {
      errors.push(`ETAPA ${index + 1}: Pelo menos uma TAREFA é obrigatória`);
    }
    
    etapa.tarefas?.forEach((tarefa, tarefaIndex) => {
      if (!tarefa.nome) errors.push(`ETAPA ${index + 1}, TAREFA ${tarefaIndex + 1}: NOME é obrigatório`);
      if (!tarefa.descricao) errors.push(`ETAPA ${index + 1}, TAREFA ${tarefaIndex + 1}: DESCRICAO é obrigatória`);
      if (!tarefa.responsavel) errors.push(`ETAPA ${index + 1}, TAREFA ${tarefaIndex + 1}: RESPONSAVEL é obrigatório`);
      if (!tarefa.disciplina) errors.push(`ETAPA ${index + 1}, TAREFA ${tarefaIndex + 1}: DISCIPLINA é obrigatória`);
      if (!tarefa.tempo_estimado) errors.push(`ETAPA ${index + 1}, TAREFA ${tarefaIndex + 1}: TEMPO_ESTIMADO é obrigatório`);
      if (!tarefa.prioridade) errors.push(`ETAPA ${index + 1}, TAREFA ${tarefaIndex + 1}: PRIORIDADE é obrigatória`);
      if (!tarefa.data_vencimento) errors.push(`ETAPA ${index + 1}, TAREFA ${tarefaIndex + 1}: DATA_VENCIMENTO é obrigatória`);
    });
  });
  
  return errors;
} 