/**
 * 🔌 API ROUTE PARA GERENCIAMENTO DE DISCIPLINAS
 * Endpoints para salvar/carregar configurações de disciplinas com persistência no banco
 */

import { NextRequest, NextResponse } from 'next/server';
import { Client } from 'pg';

// Configuração do banco (mesma do backend)
const DATABASE_CONFIG = {
  connectionString: process.env.DATABASE_URL || 
    "postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres",
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
};

// ✅ FUNÇÃO PARA CONECTAR AO BANCO
async function getDbClient() {
  const client = new Client(DATABASE_CONFIG);
  await client.connect();
  return client;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  let client;
  
  try {
    const { id: orcamentoId } = await params;
    
    // ✅ CORREÇÃO: Buscar configurações no banco de dados
    client = await getDbClient();
    
    const result = await client.query(
      'SELECT disciplinas_ativas, configuracoes_por_disciplina, updated_at FROM disciplinas_configuracoes WHERE orcamento_id = $1',
      [orcamentoId]
    );

    let configuracoes;
    
    if (result.rows.length > 0) {
      // Configurações encontradas no banco
      const row = result.rows[0];
      configuracoes = {
        disciplinasAtivas: row.disciplinas_ativas,
        configuracoesPorDisciplina: row.configuracoes_por_disciplina,
        updatedAt: row.updated_at.toISOString()
      };
    } else {
      // ✅ CORREÇÃO: Configurações não encontradas - tentar fallback para configurações globais
      console.log(`🔍 Orçamento ${orcamentoId} não encontrado, tentando fallback global...`);
      
      const globalResult = await client.query(
        'SELECT disciplinas_ativas, configuracoes_por_disciplina, updated_at FROM disciplinas_configuracoes WHERE orcamento_id = $1',
        ['configuracoes-globais']
      );

      if (globalResult.rows.length > 0) {
        // Usar configurações globais
        const globalRow = globalResult.rows[0];
        configuracoes = {
          disciplinasAtivas: globalRow.disciplinas_ativas,
          configuracoesPorDisciplina: globalRow.configuracoes_por_disciplina,
          updatedAt: globalRow.updated_at.toISOString()
        };
        console.log(`✅ Usando configurações globais: ${configuracoes.disciplinasAtivas.length} disciplinas`);
      } else {
        // Fallback final para configuração padrão
        configuracoes = {
          disciplinasAtivas: ['ARQUITETURA'],
          configuracoesPorDisciplina: {},
          updatedAt: new Date().toISOString()
        };
        console.log('⚠️ Usando configuração padrão (apenas ARQUITETURA)');
      }
    }

    console.log(`📖 Configurações carregadas para ${orcamentoId}:`, {
      disciplinasAtivas: configuracoes.disciplinasAtivas.length,
      configuracoes: Object.keys(configuracoes.configuracoesPorDisciplina).length
    });

    return NextResponse.json({
      success: true,
      data: configuracoes
    });

  } catch (error) {
    console.error('Erro ao buscar disciplinas:', error);
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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  let client;
  
  try {
    const { id: orcamentoId } = await params;
    const body = await request.json();
    
    const { disciplinasAtivas, configuracoesPorDisciplina } = body;

    // Validações básicas
    if (!Array.isArray(disciplinasAtivas)) {
      return NextResponse.json(
        { success: false, error: 'disciplinasAtivas deve ser um array' },
        { status: 400 }
      );
    }

    if (typeof configuracoesPorDisciplina !== 'object') {
      return NextResponse.json(
        { success: false, error: 'configuracoesPorDisciplina deve ser um objeto' },
        { status: 400 }
      );
    }

    // ✅ CORREÇÃO: Salvar configurações no banco de dados
    client = await getDbClient();
    
    // Usar UPSERT (INSERT ... ON CONFLICT) para inserir ou atualizar
    const result = await client.query(`
      INSERT INTO disciplinas_configuracoes (
        orcamento_id, 
        disciplinas_ativas, 
        configuracoes_por_disciplina
      ) VALUES ($1, $2, $3)
      ON CONFLICT (orcamento_id) 
      DO UPDATE SET 
        disciplinas_ativas = EXCLUDED.disciplinas_ativas,
        configuracoes_por_disciplina = EXCLUDED.configuracoes_por_disciplina,
        updated_at = NOW()
      RETURNING disciplinas_ativas, configuracoes_por_disciplina, updated_at;
    `, [
      orcamentoId,
      JSON.stringify(disciplinasAtivas),
      JSON.stringify(configuracoesPorDisciplina)
    ]);

    const savedRow = result.rows[0];
    const novaConfiguracao = {
      disciplinasAtivas: savedRow.disciplinas_ativas,
      configuracoesPorDisciplina: savedRow.configuracoes_por_disciplina,
      updatedAt: savedRow.updated_at.toISOString()
    };

    // Log para debug
    console.log(`💾 Disciplinas salvas no banco para ${orcamentoId}:`, {
      disciplinasAtivas: disciplinasAtivas.length,
      totalConfiguracoes: Object.keys(configuracoesPorDisciplina).length,
      timestamp: novaConfiguracao.updatedAt
    });

    return NextResponse.json({
      success: true,
      message: 'Configurações salvas com sucesso no banco de dados',
      data: novaConfiguracao
    });

  } catch (error) {
    console.error('Erro ao salvar disciplinas no banco:', error);
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  let client;
  
  try {
    const { id: orcamentoId } = await params;
    
    // ✅ CORREÇÃO: Remover configurações do banco de dados
    client = await getDbClient();
    
    const result = await client.query(
      'DELETE FROM disciplinas_configuracoes WHERE orcamento_id = $1 RETURNING orcamento_id',
      [orcamentoId]
    );

    const removido = result.rowCount > 0;

    console.log(`🗑️ Configurações ${removido ? 'removidas' : 'não encontradas'} para ${orcamentoId}`);

    return NextResponse.json({
      success: true,
      message: removido 
        ? 'Configurações removidas com sucesso do banco de dados'
        : 'Nenhuma configuração encontrada para remover',
      removed: removido
    });

  } catch (error) {
    console.error('Erro ao remover disciplinas do banco:', error);
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