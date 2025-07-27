import api from '../lib/api-client';

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

export async function detectarNecessidades(input: TemplateDinamicoInput): Promise<TemplateDinamico> {
  const { briefingId, dadosBriefing } = input;
  try {
    const response = await api.post(`/api/templates-dinamicos/detectar`, {
      briefingId,
      dadosBriefing,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Erro ao detectar necessidades do template dinâmico.');
  }
}

export async function gerarProjetoComposto(briefingId: string): Promise<TemplateDinamico> {
  try {
    const response = await api.post(`/api/templates-dinamicos/gerar-projeto-composto`, { briefingId });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Erro ao gerar projeto composto.');
  }
}

export async function gerarCronograma(briefingId: string): Promise<any> {
  try {
    const response = await api.post(`/api/templates-dinamicos/gerar-cronograma`, { briefingId });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Erro ao gerar cronograma.');
  }
}

export async function gerarOrcamento(briefingId: string): Promise<any> {
  try {
    const response = await api.post(`/api/templates-dinamicos/gerar-orcamento`, { briefingId });
    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || 'Erro ao gerar orçamento.');
  }
} 