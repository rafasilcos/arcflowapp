/**
 * 🏢 HOOK PARA CONFIGURAÇÕES PERSONALIZÁVEIS POR ESCRITÓRIO
 * Conecta configurações com cálculos de orçamento em tempo real
 */

import { useState, useEffect, useCallback } from 'react';

interface ConfiguracaoEscritorio {
  disciplinas: Record<string, {
    ativo: boolean;
    valor_base: number;
    valor_por_m2: number;
    valor_por_hora: number;
    horas_estimadas: number;
    multiplicador_complexidade_padrao: number;
  }>;
  multiplicadores_regionais: Record<string, {
    nome: string;
    multiplicador: number;
  }>;
  padroes_construcao: Record<string, {
    nome: string;
    multiplicador: number;
  }>;
  custos_indiretos: {
    margem_lucro: number;
    overhead: number;
    impostos: number;
    reserva_contingencia: number;
    comissao_vendas: number;
  };
  multiplicadores_complexidade: Record<string, number>;
  configuracoes_comerciais: {
    desconto_maximo_permitido: number;
    valor_minimo_projeto: number;
    forma_pagamento_padrao: string;
    juros_parcelamento: number;
    desconto_pagamento_vista: number;
  };
  configuracoes_escritorio: {
    regime_tributario: string;
    regiao_principal: string;
    especialidade: string;
    nivel_experiencia: string;
  };
}

interface ParametrosCalculo {
  area?: number;
  regiao?: string;
  padrao_construcao?: string;
  complexidade?: string;
  disciplinas_selecionadas?: string[];
  forma_pagamento?: string;
  desconto_aplicado?: number;
}

interface ResultadoCalculo {
  subtotal: number;
  custos_indiretos_total: number;
  valor_final: number;
  detalhes_por_disciplina: Record<string, {
    valor_base: number;
    valor_com_multiplicadores: number;
    multiplicadores_aplicados: {
      regional: number;
      padrao: number;
      complexidade: number;
    };
  }>;
  resumo_custos_indiretos: {
    margem_lucro: number;
    overhead: number;
    impostos: number;
    contingencia: number;
    comissao: number;
    total_percentual: number;
  };
}

export function useConfiguracaoEscritorio(escritorioId: string) {
  const [configuracoes, setConfiguracoes] = useState<ConfiguracaoEscritorio | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar configurações do escritório
  const loadConfiguracoes = useCallback(async () => {
    if (!escritorioId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/escritorios/${escritorioId}/configuracoes`);
      const result = await response.json();

      if (result.success) {
        setConfiguracoes(result.data);
      } else {
        setError(result.error || 'Erro ao carregar configurações');
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      setError('Erro ao conectar com o servidor');
    } finally {
      setLoading(false);
    }
  }, [escritorioId]);

  // ✅ SOLUÇÃO DEFINITIVA: Salvamento mínimo que funciona
  const salvarConfiguracoes = useCallback(async (novasConfiguracoes?: ConfiguracaoEscritorio) => {
    if (!escritorioId) return false;

    const configuracoesParaSalvar = novasConfiguracoes || configuracoes;
    
    if (!configuracoesParaSalvar) {
      setError('Nenhuma configuração para salvar');
      return false;
    }

    try {
      console.log('💾 Salvando configurações (método simplificado)...');

      // ✅ SOLUÇÃO DEFINITIVA: Salvar apenas disciplinas (seção principal da aba Tabela de Preços)
      const disciplinasParaSalvar = {};
      
      // Incluir apenas disciplinas com estrutura completa e válida
      Object.keys(configuracoesParaSalvar.disciplinas || {}).forEach(disciplina => {
        const dadosDisciplina = configuracoesParaSalvar.disciplinas[disciplina];
        if (dadosDisciplina && typeof dadosDisciplina === 'object') {
          disciplinasParaSalvar[disciplina] = {
            ativo: dadosDisciplina.ativo || false,
            valor_base: dadosDisciplina.valor_base || 0,
            valor_por_m2: dadosDisciplina.valor_por_m2 || 0,
            valor_por_hora: dadosDisciplina.valor_por_hora || 0,
            horas_estimadas: dadosDisciplina.horas_estimadas || 0,
            multiplicador_complexidade_padrao: dadosDisciplina.multiplicador_complexidade_padrao || 1.0
          };
        }
      });

      const response = await fetch(`/api/escritorios/${escritorioId}/configuracoes`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        },
        body: JSON.stringify({
          configuracoes: {
            disciplinas: disciplinasParaSalvar
          },
          versao: '2.0'
        })
      });

      const result = await response.json();

      if (result.success) {
        console.log('✅ Configurações salvas com sucesso');
        setConfiguracoes(result.data);
        setError(null);
        return true;
      } else {
        console.error('❌ Erro ao salvar:', result.error);
        setError(result.error || 'Erro ao salvar configurações');
        return false;
      }
    } catch (error) {
      console.error('❌ Erro ao salvar configurações:', error);
      setError('Erro ao conectar com o servidor');
      return false;
    }
  }, [escritorioId, configuracoes]);

  // Calcular orçamento com configurações personalizadas
  const calcularOrcamento = useCallback((parametros: ParametrosCalculo): ResultadoCalculo | null => {
    if (!configuracoes) return null;

    const {
      area = 100,
      regiao = configuracoes.configuracoes_escritorio.regiao_principal,
      padrao_construcao = 'medio',
      complexidade = 'normal',
      disciplinas_selecionadas = Object.keys(configuracoes.disciplinas).filter(d => configuracoes.disciplinas[d].ativo),
      forma_pagamento = configuracoes.configuracoes_comerciais.forma_pagamento_padrao,
      desconto_aplicado = 0
    } = parametros;

    let subtotal = 0;
    const detalhes_por_disciplina: Record<string, any> = {};

    // Calcular valor por disciplina
    disciplinas_selecionadas.forEach(disciplinaCodigo => {
      const disciplina = configuracoes.disciplinas[disciplinaCodigo];
      if (!disciplina || !disciplina.ativo) return;

      // Valor base (pode ser fixo, por m² ou por hora)
      let valorBase = disciplina.valor_base;
      if (area && disciplina.valor_por_m2 > 0) {
        valorBase = disciplina.valor_por_m2 * area;
      }

      // Aplicar multiplicadores
      const multRegional = configuracoes.multiplicadores_regionais[regiao]?.multiplicador || 1;
      const multPadrao = configuracoes.padroes_construcao[padrao_construcao]?.multiplicador || 1;
      const multComplexidade = configuracoes.multiplicadores_complexidade[complexidade] || 1;

      const valorComMultiplicadores = valorBase * multRegional * multPadrao * multComplexidade;

      subtotal += valorComMultiplicadores;

      detalhes_por_disciplina[disciplinaCodigo] = {
        valor_base: valorBase,
        valor_com_multiplicadores: valorComMultiplicadores,
        multiplicadores_aplicados: {
          regional: multRegional,
          padrao: multPadrao,
          complexidade: multComplexidade
        }
      };
    });

    // Calcular custos indiretos
    const custos = configuracoes.custos_indiretos;
    const multCustos = (1 + custos.margem_lucro/100) * 
                      (1 + custos.overhead/100) * 
                      (1 + custos.impostos/100) * 
                      (1 + custos.reserva_contingencia/100) * 
                      (1 + custos.comissao_vendas/100);

    const custos_indiretos_total = subtotal * (multCustos - 1);
    let valor_final = subtotal * multCustos;

    // Aplicar desconto se houver
    if (desconto_aplicado > 0) {
      const desconto_maximo = configuracoes.configuracoes_comerciais.desconto_maximo_permitido;
      const desconto_real = Math.min(desconto_aplicado, desconto_maximo);
      valor_final = valor_final * (1 - desconto_real/100);
    }

    // Aplicar juros de parcelamento se não for à vista
    if (forma_pagamento !== 'a_vista' && forma_pagamento !== '50_50') {
      const juros = configuracoes.configuracoes_comerciais.juros_parcelamento;
      valor_final = valor_final * (1 + juros/100);
    }

    // Verificar valor mínimo
    const valor_minimo = configuracoes.configuracoes_comerciais.valor_minimo_projeto;
    if (valor_final < valor_minimo) {
      valor_final = valor_minimo;
    }

    return {
      subtotal,
      custos_indiretos_total,
      valor_final,
      detalhes_por_disciplina,
      resumo_custos_indiretos: {
        margem_lucro: subtotal * (custos.margem_lucro/100),
        overhead: subtotal * (custos.overhead/100),
        impostos: subtotal * (custos.impostos/100),
        contingencia: subtotal * (custos.reserva_contingencia/100),
        comissao: subtotal * (custos.comissao_vendas/100),
        total_percentual: ((multCustos - 1) * 100)
      }
    };
  }, [configuracoes]);

  // Obter disciplinas ativas
  const getDisciplinasAtivas = useCallback(() => {
    if (!configuracoes) return [];
    
    return Object.entries(configuracoes.disciplinas)
      .filter(([_, disciplina]) => disciplina.ativo)
      .map(([codigo, disciplina]) => ({
        codigo,
        ...disciplina
      }));
  }, [configuracoes]);

  // Validar configurações
  const validarConfiguracoes = useCallback((config: ConfiguracaoEscritorio): string[] => {
    const erros: string[] = [];

    // Validar disciplinas
    Object.entries(config.disciplinas).forEach(([codigo, disciplina]) => {
      if (disciplina.ativo) {
        if (disciplina.valor_base <= 0 && disciplina.valor_por_m2 <= 0) {
          erros.push(`${codigo}: Deve ter valor base ou valor por m² maior que zero`);
        }
        if (disciplina.horas_estimadas <= 0) {
          erros.push(`${codigo}: Horas estimadas deve ser maior que zero`);
        }
      }
    });

    // Validar custos indiretos
    if (config.custos_indiretos.margem_lucro < 0) {
      erros.push('Margem de lucro não pode ser negativa');
    }
    if (config.custos_indiretos.impostos < 0) {
      erros.push('Impostos não podem ser negativos');
    }

    // Validar configurações comerciais
    if (config.configuracoes_comerciais.desconto_maximo_permitido > 50) {
      erros.push('Desconto máximo não pode ser superior a 50%');
    }
    if (config.configuracoes_comerciais.valor_minimo_projeto <= 0) {
      erros.push('Valor mínimo de projeto deve ser maior que zero');
    }

    return erros;
  }, []);

  // Carregar configurações ao montar o componente
  useEffect(() => {
    loadConfiguracoes();
  }, [loadConfiguracoes]);

  return {
    configuracoes,
    loading,
    error,
    loadConfiguracoes,
    salvarConfiguracoes,
    calcularOrcamento,
    getDisciplinasAtivas,
    validarConfiguracoes,
    setConfiguracoes
  };
}