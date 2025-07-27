/**
 * 🏢 API ROUTE PARA CONFIGURAÇÕES POR ESCRITÓRIO
 * Sistema multi-tenant com configurações independentes e seguras
 */

import { NextRequest, NextResponse } from 'next/server';
import { Client } from 'pg';

// Configuração do banco
const DATABASE_CONFIG = {
  connectionString: process.env.DATABASE_URL || 
    "postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres",
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
};

// Função para conectar ao banco
async function getDbClient() {
  const client = new Client(DATABASE_CONFIG);
  await client.connect();
  return client;
}

// ✅ CONFIGURAÇÃO PADRÃO ATUALIZADA - VALORES REALISTAS MERCADO BRASILEIRO 2025
const CONFIGURACAO_PADRAO = {
  disciplinas: {
    ARQUITETURA: {
      ativo: true,
      valor_base: 18000,      // R$ 18.000 - projeto arquitetônico completo
      valor_por_m2: 85,       // R$ 85/m² - média nacional atualizada
      valor_por_hora: 180,    // R$ 180/hora - arquiteto sênior
      horas_estimadas: 120,   // 120h para projeto médio
      multiplicador_complexidade_padrao: 1.0
    },
    ESTRUTURAL: {
      ativo: true,
      valor_base: 15000,      // R$ 15.000 - projeto estrutural completo
      valor_por_m2: 55,       // R$ 55/m² - 30-35% do arquitetônico
      valor_por_hora: 220,    // R$ 220/hora - engenheiro estrutural
      horas_estimadas: 80,    // 80h para projeto médio
      multiplicador_complexidade_padrao: 1.0
    },
    INSTALACOES_ELETRICAS: {
      ativo: false,
      valor_base: 8500,       // R$ 8.500 - projeto elétrico completo
      valor_por_m2: 28,       // R$ 28/m² - 15-20% do arquitetônico
      valor_por_hora: 160,    // R$ 160/hora - engenheiro elétrico
      horas_estimadas: 60,    // 60h para projeto médio
      multiplicador_complexidade_padrao: 1.0
    },
    INSTALACOES_HIDRAULICAS: {
      ativo: false,
      valor_base: 9500,       // R$ 9.500 - projeto hidrossanitário
      valor_por_m2: 32,       // R$ 32/m² - 18-22% do arquitetônico
      valor_por_hora: 160,    // R$ 160/hora - engenheiro hidráulico
      horas_estimadas: 65,    // 65h para projeto médio
      multiplicador_complexidade_padrao: 1.0
    },
    CLIMATIZACAO: {
      ativo: false,
      valor_base: 7500,       // R$ 7.500 - projeto de climatização
      valor_por_m2: 22,       // R$ 22/m² - 12-15% do arquitetônico
      valor_por_hora: 150,    // R$ 150/hora - especialista
      horas_estimadas: 50,    // 50h para projeto médio
      multiplicador_complexidade_padrao: 1.0
    },
    PAISAGISMO: {
      ativo: false,
      valor_base: 6500,       // R$ 6.500 - projeto paisagístico
      valor_por_m2: 18,       // R$ 18/m² - 10-12% do arquitetônico
      valor_por_hora: 140,    // R$ 140/hora - paisagista
      horas_estimadas: 45,    // 45h para projeto médio
      multiplicador_complexidade_padrao: 1.0
    },
    INTERIORES: {
      ativo: false,
      valor_base: 12000,      // R$ 12.000 - design de interiores
      valor_por_m2: 45,       // R$ 45/m² - 25-30% do arquitetônico
      valor_por_hora: 160,    // R$ 160/hora - designer
      horas_estimadas: 75,    // 75h para projeto médio
      multiplicador_complexidade_padrao: 1.0
    },
    APROVACAO_LEGAL: {
      ativo: false,
      valor_base: 8000,       // R$ 8.000 - projeto legal + aprovação
      valor_por_m2: 25,       // R$ 25/m² - taxa fixa + acompanhamento
      valor_por_hora: 180,    // R$ 180/hora - tramitação
      horas_estimadas: 40,    // 40h para aprovação
      multiplicador_complexidade_padrao: 1.0
    },
    MODELAGEM_3D: {
      ativo: false,
      valor_base: 5500,       // R$ 5.500 - modelagem + renderizações
      valor_por_m2: 15,       // R$ 15/m² - complementar
      valor_por_hora: 120,    // R$ 120/hora - modelador 3D
      horas_estimadas: 35,    // 35h para modelagem completa
      multiplicador_complexidade_padrao: 1.0
    }
  },
  multiplicadores_regionais: {
    norte: { nome: "Norte", multiplicador: 0.75 },           // AM, RR, AP, PA, TO, AC, RO
    nordeste: { nome: "Nordeste", multiplicador: 0.85 },     // BA, SE, AL, PE, PB, RN, CE, PI, MA
    centro_oeste: { nome: "Centro-Oeste", multiplicador: 0.95 }, // MT, MS, GO, DF
    sudeste: { nome: "Sudeste", multiplicador: 1.25 },       // SP, RJ, MG, ES
    sul: { nome: "Sul", multiplicador: 1.10 }                // RS, SC, PR
  },
  padroes_construcao: {
    economico: { nome: "Econômico", multiplicador: 0.65 },   // Acabamentos básicos
    popular: { nome: "Popular", multiplicador: 0.80 },       // Padrão MCMV
    medio: { nome: "Médio", multiplicador: 1.00 },           // Referência de mercado
    alto: { nome: "Alto Padrão", multiplicador: 1.50 },      // Acabamentos superiores
    luxo: { nome: "Luxo", multiplicador: 2.20 },             // Acabamentos premium
    ultra_luxo: { nome: "Ultra Luxo", multiplicador: 3.50 }  // Projetos únicos
  },
  custos_indiretos: {
    margem_lucro: 28.0,           // 28% - margem líquida desejada
    overhead: 18.0,               // 18% - custos operacionais
    impostos: 16.33,              // 16.33% - Simples Nacional faixa 4
    reserva_contingencia: 8.0,    // 8% - imprevistos e alterações
    comissao_vendas: 5.0,         // 5% - comissão para captação
    marketing: 3.0,               // 3% - investimento em marketing
    capacitacao: 2.0,             // 2% - treinamentos profissionais
    seguros: 1.5                  // 1.5% - seguro profissional
  },
  multiplicadores_complexidade: {
    muito_simples: 0.60,    // Projetos padronizados, repetitivos
    simples: 0.80,          // Projetos convencionais
    normal: 1.00,           // Referência - projetos típicos
    complexo: 1.35,         // Projetos com desafios técnicos
    muito_complexo: 1.75,   // Alta complexidade técnica
    excepcional: 2.50,      // Projetos únicos, P&D
    experimental: 3.20      // Projetos experimentais
  },
  configuracoes_comerciais: {
    desconto_maximo_permitido: 15.0,        // 15% desconto máximo
    valor_minimo_projeto: 8500.0,           // R$ 8.500 valor mínimo
    forma_pagamento_padrao: "30_60_90",     // 30/60/90 dias
    juros_parcelamento: 2.8,                // 2.8% a.m. para parcelamento
    desconto_pagamento_vista: 8.0,          // 8% desconto à vista
    multa_atraso_pagamento: 2.0,            // 2% multa por atraso
    juros_mora: 1.0,                        // 1% a.m. juros de mora
    reajuste_anual: 6.5,                    // 6.5% reajuste anual (INCC)
    prazo_garantia_projeto: 60,             // 60 meses garantia
    prazo_revisao_gratuita: 6               // 6 meses revisões gratuitas
  },
  configuracoes_escritorio: {
    // Dados da empresa (exemplo)
    razao_social: "ArcFlow Projetos e Consultoria Ltda",
    nome_fantasia: "ArcFlow Arquitetura",
    cnpj: "12.345.678/0001-90",
    
    // Configurações técnicas
    regime_tributario: "simples_nacional",
    regiao_principal: "sudeste",
    especialidade: "residencial_comercial",
    nivel_experiencia: "senior",
    ano_fundacao: 2018,
    numero_funcionarios: 8,
    
    // Responsável técnico
    responsavel_tecnico: {
      nome: "Arq. Maria Silva Santos",
      registro_profissional: "CAU A12345-6",
      email: "maria.santos@arcflow.com.br"
    },
    
    // Áreas de atuação
    areas_atuacao: [
      "Projetos Residenciais",
      "Projetos Comerciais", 
      "Projetos Institucionais",
      "Consultoria em Sustentabilidade"
    ]
  }
};

// GET - Buscar configurações do escritório
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  let client;
  
  try {
    const { id: escritorioId } = await params;
    
    client = await getDbClient();
    
    const result = await client.query(
      'SELECT configuracoes, versao, updated_at FROM configuracoes_escritorio WHERE escritorio_id = $1 AND ativo = true',
      [escritorioId]
    );

    let configuracoes;
    
    if (result.rows.length > 0) {
      // Configurações encontradas
      const row = result.rows[0];
      configuracoes = {
        ...row.configuracoes,
        metadata: {
          versao: row.versao,
          updated_at: row.updated_at.toISOString()
        }
      };
    } else {
      // Escritório sem configurações - retornar padrão
      configuracoes = {
        ...CONFIGURACAO_PADRAO,
        metadata: {
          versao: '1.0',
          updated_at: new Date().toISOString(),
          is_default: true
        }
      };
    }

    console.log(`📖 Configurações carregadas para escritório ${escritorioId}`);

    return NextResponse.json({
      success: true,
      data: configuracoes
    });

  } catch (error) {
    console.error('Erro ao buscar configurações:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  } finally {
    if (client) {
      await client.end();
    }
  }
}

// PUT - Salvar/Atualizar configurações do escritório
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  let client;
  
  try {
    const { id: escritorioId } = await params;
    const body = await request.json();
    
    // Validações básicas
    if (!body.configuracoes || typeof body.configuracoes !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Configurações inválidas' },
        { status: 400 }
      );
    }

    client = await getDbClient();
    
    // ✅ SOLUÇÃO SIMPLES: Buscar configurações existentes e fazer merge direto
    const existingResult = await client.query(
      'SELECT configuracoes FROM configuracoes_escritorio WHERE escritorio_id = $1',
      [escritorioId]
    );

    let configuracoesFinais;
    
    if (existingResult.rows.length > 0) {
      // Merge simples: usar configurações existentes como base
      const configuracoesExistentes = existingResult.rows[0].configuracoes;
      configuracoesFinais = {
        ...configuracoesExistentes,
        ...body.configuracoes
      };
      
      // Merge profundo apenas para disciplinas e custos_indiretos (principais seções)
      if (body.configuracoes.disciplinas) {
        configuracoesFinais.disciplinas = {
          ...configuracoesExistentes.disciplinas,
          ...body.configuracoes.disciplinas
        };
      }
      
      if (body.configuracoes.custos_indiretos) {
        configuracoesFinais.custos_indiretos = {
          ...configuracoesExistentes.custos_indiretos,
          ...body.configuracoes.custos_indiretos
        };
      }
    } else {
      // Primeira vez - usar configurações fornecidas
      configuracoesFinais = body.configuracoes;
    }
    
    // Salvar no banco
    const result = await client.query(`
      INSERT INTO configuracoes_escritorio (
        escritorio_id, 
        configuracoes,
        versao
      ) VALUES ($1, $2, $3)
      ON CONFLICT (escritorio_id) 
      DO UPDATE SET 
        configuracoes = EXCLUDED.configuracoes,
        versao = EXCLUDED.versao,
        updated_at = NOW()
      RETURNING configuracoes, versao, updated_at;
    `, [
      escritorioId,
      JSON.stringify(configuracoesFinais),
      body.versao || '1.0'
    ]);
    
    const savedRow = result.rows[0];
    const configuracoesSalvas = {
      ...savedRow.configuracoes,
      metadata: {
        versao: savedRow.versao,
        updated_at: savedRow.updated_at.toISOString()
      }
    };

    return NextResponse.json({
      success: true,
      message: 'Configurações salvas com sucesso',
      data: configuracoesSalvas
    });

  } catch (error) {
    console.error('Erro ao salvar configurações:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  } finally {
    if (client) {
      await client.end();
    }
  }
}

// POST - Resetar configurações para o padrão
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  let client;
  
  try {
    const { id: escritorioId } = await params;
    
    client = await getDbClient();
    
    // Resetar para configuração padrão
    const result = await client.query(`
      INSERT INTO configuracoes_escritorio (
        escritorio_id, 
        configuracoes,
        versao
      ) VALUES ($1, $2, '1.0')
      ON CONFLICT (escritorio_id) 
      DO UPDATE SET 
        configuracoes = EXCLUDED.configuracoes,
        versao = '1.0',
        updated_at = NOW()
      RETURNING configuracoes, versao, updated_at;
    `, [
      escritorioId,
      JSON.stringify(CONFIGURACAO_PADRAO)
    ]);

    const resetRow = result.rows[0];
    const configuracaoReset = {
      ...resetRow.configuracoes,
      metadata: {
        versao: resetRow.versao,
        updated_at: resetRow.updated_at.toISOString()
      }
    };

    console.log(`🔄 Configurações resetadas para escritório ${escritorioId}`);

    return NextResponse.json({
      success: true,
      message: 'Configurações resetadas para o padrão',
      data: configuracaoReset
    });

  } catch (error) {
    console.error('Erro ao resetar configurações:', error);
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    );
  } finally {
    if (client) {
      await client.end();
    }
  }
}