export interface TemplateDinamicoInput {
  briefingId: string;
  dadosBriefing: any;
}

export interface TemplateDinamico {
  id: string;
  nome: string;
  descricao: string;
  perguntas: any[];
  sugestoes: any[];
  cronograma: any;
  orcamento: any;
  criadoEm: string;
} 