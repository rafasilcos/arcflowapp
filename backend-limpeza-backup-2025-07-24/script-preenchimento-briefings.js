#!/usr/bin/env node

// SCRIPT DE PREENCHIMENTO AUTOMÁTICO DE BRIEFINGS
// Sistema para criar briefings de teste com dados realistas para geração de orçamentos

const { Client } = require('pg');
require('dotenv').config();
const MAPEAMENTO_BRIEFINGS = require('./mapeamento-briefings-orcamento');
const DADOS_REALISTAS = require('./dados-realistas-briefings');

// Configuração do banco de dados
const DATABASE_URL = "postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres";

const DB_CONFIG = {
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false }
};

class PreenchimentoBriefings {
  constructor() {
    this.client = null;
    this.estatisticas = {
      briefings_criados: 0,
      briefings_falharam: 0,
      tempo_inicio: null,
      tempo_fim: null,
      categorias_processadas: []
    };
  }

  // Conectar ao banco de dados
  async conectarBanco() {
    try {
      this.client = new Client(DB_CONFIG);
      await this.client.connect();
      console.log('✅ Conectado ao banco de dados PostgreSQL');
      return true;
    } catch (error) {
      console.error('❌ Erro ao conectar ao banco:', error.message);
      return false;
    }
  }

  // Desconectar do banco
  async desconectarBanco() {
    if (this.client) {
      await this.client.end();
      console.log('🔌 Desconectado do banco de dados');
    }
  }

  // Buscar dados necessários (cliente, usuário, escritório)
  async buscarDadosBase() {
    try {
      // Buscar usuário com UUID válido no escritório correto
      const usuarioQuery = `
        SELECT u.id, u.nome, u.email, u.escritorio_id, e.nome as escritorio_nome
        FROM users u
        LEFT JOIN escritorios e ON u.escritorio_id = e.id
        WHERE u.escritorio_id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479'
        AND u.id ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
        ORDER BY 
          CASE 
            WHEN u.role IN ('OWNER', 'ADMIN') THEN 1
            WHEN u.role = 'MANAGER' THEN 2
            ELSE 3
          END
        LIMIT 1
      `;
      const usuarioResult = await this.client.query(usuarioQuery);
      
      if (usuarioResult.rows.length === 0) {
        throw new Error('Usuário admin@arcflow.com não encontrado');
      }
      
      const usuario = usuarioResult.rows[0];
      console.log(`👤 Usuário encontrado: ${usuario.nome} (${usuario.email})`);
      
      // Buscar o escritório do usuário
      const escritorioQuery = `
        SELECT id, nome, email FROM escritorios 
        WHERE id = $1
      `;
      const escritorioResult = await this.client.query(escritorioQuery, [usuario.escritorio_id]);
      
      if (escritorioResult.rows.length === 0) {
        throw new Error('Escritório do usuário admin não encontrado');
      }
      
      const escritorio = escritorioResult.rows[0];
      console.log(`📋 Escritório encontrado: ${escritorio.nome} (${escritorio.id})`);

      // Buscar ou criar cliente de teste
      let cliente = await this.buscarOuCriarCliente(escritorio.id, usuario.id);
      
      return {
        escritorio,
        usuario,
        cliente
      };
    } catch (error) {
      console.error('❌ Erro ao buscar dados base:', error.message);
      throw error;
    }
  }

  // Buscar ou criar cliente de teste
  async buscarOuCriarCliente(escritorioId, usuarioId) {
    try {
      // Tentar buscar cliente existente do escritório correto
      const clienteQuery = `
        SELECT id, nome, email FROM clientes 
        WHERE escritorio_id = $1 AND status = 'ativo'
        ORDER BY created_at DESC
        LIMIT 1
      `;
      const clienteResult = await this.client.query(clienteQuery, [escritorioId]);
      
      if (clienteResult.rows.length > 0) {
        const cliente = clienteResult.rows[0];
        console.log(`👥 Cliente existente encontrado: ${cliente.nome}`);
        return cliente;
      }

      // Criar novo cliente de teste
      const novoClienteQuery = `
        INSERT INTO clientes (id, nome, email, telefone, tipo_pessoa, escritorio_id, created_by, status, created_at)
        VALUES (gen_random_uuid()::text, $1, $2, $3, $4, $5, $6, $7, NOW())
        RETURNING id, nome, email
      `;
      
      const novoClienteValues = [
        'Cliente Teste - Briefings Automáticos',
        'cliente.teste@arcflow.com.br',
        '(11) 99999-9999',
        'pessoa_juridica',
        escritorioId,
        usuarioId,
        'ativo'
      ];
      
      const novoClienteResult = await this.client.query(novoClienteQuery, novoClienteValues);
      const novoCliente = novoClienteResult.rows[0];
      
      console.log(`✨ Novo cliente criado: ${novoCliente.nome}`);
      return novoCliente;
      
    } catch (error) {
      console.error('❌ Erro ao buscar/criar cliente:', error.message);
      throw error;
    }
  }

  // Mapear respostas para formato do briefing
  mapeiarRespostas(dadosTemplate, categoria, subtipo) {
    const respostasFormatadas = {};
    
    // Mapear dados essenciais
    Object.keys(dadosTemplate).forEach(chave => {
      const valor = dadosTemplate[chave];
      
      // Mapear para formato esperado pelo sistema de orçamento
      switch (chave) {
        case 'area_total':
          respostasFormatadas.area_construida = valor;
          respostasFormatadas.area_total = valor;
          respostasFormatadas.metragem_aproximada = valor;
          break;
          
        case 'tipo_escritorio':
        case 'tipo_comercio':
        case 'tipo_residencia':
        case 'uso_galpao':
          respostasFormatadas.tipologia = categoria;
          respostasFormatadas.tipo_imovel = categoria;
          respostasFormatadas.subtipologia = subtipo;
          respostasFormatadas.subtipo_imovel = subtipo;
          break;
          
        case 'padrao_acabamento':
          respostasFormatadas.padrao_acabamento = valor;
          respostasFormatadas.nivel_acabamento = valor;
          respostasFormatadas.qualidade_acabamento = valor;
          break;
          
        default:
          respostasFormatadas[chave] = valor;
      }
    });
    
    // Adicionar dados calculados para complexidade
    respostasFormatadas.complexidade_calculada = this.calcularComplexidade(dadosTemplate);
    
    return respostasFormatadas;
  }

  // Calcular complexidade baseada nos dados
  calcularComplexidade(dados) {
    let pontuacao = 0;
    
    // Área
    if (dados.area_total > 500) pontuacao += 2;
    else if (dados.area_total > 200) pontuacao += 1;
    
    // Pavimentos
    if (dados.pavimentos > 2) pontuacao += 2;
    else if (dados.pavimentos === 2) pontuacao += 1;
    
    // Elementos especiais
    if (dados.piscina === 'sim') pontuacao += 2;
    if (dados.elevador === 'sim') pontuacao += 2;
    if (dados.spa === 'sim') pontuacao += 1;
    if (dados.automacao === 'sim') pontuacao += 1;
    
    if (pontuacao >= 6) return 'alta';
    if (pontuacao >= 3) return 'media';
    return 'baixa';
  }

  // Criar briefing no banco de dados
  async criarBriefing(dadosBase, categoria, subtipo, dadosTemplate) {
    try {
      const respostas = this.mapeiarRespostas(dadosTemplate, categoria, subtipo);
      
      const briefingQuery = `
        INSERT INTO briefings (
          nome_projeto, disciplina, tipologia, status, metadata, dados_extraidos,
          cliente_id, responsavel_id, escritorio_id, created_by, area
        ) VALUES ($1, $2, $3, $4, $5, $6, $7::uuid, $8::uuid, $9::uuid, $10::uuid, $11)
        RETURNING id, nome_projeto
      `;
      
      const metadados = {
        origem: 'preenchimento_automatico',
        template_usado: dadosTemplate.nome || `${categoria}-${subtipo}`,
        data_criacao: new Date().toISOString(),
        versao_script: '1.0',
        dados_para_orcamento: {
          area_total: respostas.area_total,
          tipologia: categoria,
          subtipologia: subtipo,
          padrao: respostas.padrao_acabamento,
          complexidade: respostas.complexidade_calculada,
          localizacao: {
            estado: respostas.estado,
            cidade: respostas.cidade,
            bairro: respostas.bairro
          }
        }
      };
      
      const briefingValues = [
        dadosTemplate.nome_projeto || `Projeto ${categoria} - ${subtipo}`,
        categoria, // disciplina
        `${categoria}-${subtipo}`, // tipologia
        'CONCLUÍDO', // status
        JSON.stringify(metadados), // metadata
        JSON.stringify(respostas), // dados_extraidos - dados para orçamento
        dadosBase.cliente.id,
        dadosBase.usuario.id,
        dadosBase.escritorio.id,
        dadosBase.usuario.id,
        respostas.area_total ? respostas.area_total.toString() : '100' // area como string
      ];
      
      const result = await this.client.query(briefingQuery, briefingValues);
      const briefing = result.rows[0];
      
      console.log(`✅ Briefing criado: ${briefing.nome_projeto} (ID: ${briefing.id})`);
      this.estatisticas.briefings_criados++;
      
      return briefing;
      
    } catch (error) {
      console.error(`❌ Erro ao criar briefing ${categoria}-${subtipo}:`, error.message);
      this.estatisticas.briefings_falharam++;
      throw error;
    }
  }

  // Processar uma categoria de briefings
  async processarCategoria(dadosBase, categoria, subtipos) {
    console.log(`\n📂 Processando categoria: ${categoria.toUpperCase()}`);
    
    for (const subtipo of subtipos) {
      try {
        console.log(`  🔄 Criando briefing: ${categoria}-${subtipo}`);
        
        // Obter template de dados realistas
        const dadosTemplate = DADOS_REALISTAS.obterTemplateAleatorio(categoria, subtipo);
        
        if (!dadosTemplate) {
          console.log(`  ⚠️  Template não encontrado para ${categoria}-${subtipo}`);
          continue;
        }
        
        // Validar dados essenciais
        if (!DADOS_REALISTAS.validarDadosEssenciais(dadosTemplate)) {
          console.log(`  ⚠️  Dados essenciais faltando para ${categoria}-${subtipo}`);
          continue;
        }
        
        // Criar briefing
        await this.criarBriefing(dadosBase, categoria, subtipo, dadosTemplate);
        
        // Pequena pausa entre criações
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        console.error(`  ❌ Falha ao processar ${categoria}-${subtipo}:`, error.message);
      }
    }
    
    this.estatisticas.categorias_processadas.push(categoria);
  }

  // Executar preenchimento completo
  async executar() {
    console.log('🚀 INICIANDO PREENCHIMENTO AUTOMÁTICO DE BRIEFINGS');
    console.log('=' .repeat(60));
    
    this.estatisticas.tempo_inicio = new Date();
    
    try {
      // Conectar ao banco
      const conectado = await this.conectarBanco();
      if (!conectado) {
        throw new Error('Não foi possível conectar ao banco de dados');
      }
      
      // Buscar dados base
      console.log('\n📋 Buscando dados base...');
      const dadosBase = await this.buscarDadosBase();
      
      // Processar cada categoria
      const categorias = MAPEAMENTO_BRIEFINGS.categorias;
      
      for (const [categoria, info] of Object.entries(categorias)) {
        if (info.status === 'ativo' && info.briefings.length > 0) {
          await this.processarCategoria(dadosBase, categoria, info.briefings);
        }
      }
      
      // Finalizar
      this.estatisticas.tempo_fim = new Date();
      this.exibirEstatisticas();
      
    } catch (error) {
      console.error('\n💥 ERRO CRÍTICO:', error.message);
      process.exit(1);
    } finally {
      await this.desconectarBanco();
    }
  }

  // Exibir estatísticas finais
  exibirEstatisticas() {
    const duracao = this.estatisticas.tempo_fim - this.estatisticas.tempo_inicio;
    const duracaoSegundos = Math.round(duracao / 1000);
    
    console.log('\n' + '=' .repeat(60));
    console.log('📊 ESTATÍSTICAS FINAIS');
    console.log('=' .repeat(60));
    console.log(`✅ Briefings criados com sucesso: ${this.estatisticas.briefings_criados}`);
    console.log(`❌ Briefings que falharam: ${this.estatisticas.briefings_falharam}`);
    console.log(`📂 Categorias processadas: ${this.estatisticas.categorias_processadas.join(', ')}`);
    console.log(`⏱️  Tempo total de execução: ${duracaoSegundos}s`);
    console.log(`🎯 Taxa de sucesso: ${Math.round((this.estatisticas.briefings_criados / (this.estatisticas.briefings_criados + this.estatisticas.briefings_falharam)) * 100)}%`);
    
    if (this.estatisticas.briefings_criados > 0) {
      console.log('\n🎉 PREENCHIMENTO CONCLUÍDO COM SUCESSO!');
      console.log('💡 Os briefings criados podem ser usados para testar a geração de orçamentos.');
      console.log('🔗 Acesse o sistema para visualizar os briefings na dashboard.');
    } else {
      console.log('\n⚠️  NENHUM BRIEFING FOI CRIADO');
      console.log('🔍 Verifique os logs acima para identificar problemas.');
    }
  }

  // Método para limpeza (remover briefings de teste)
  async limparBriefingsTeste() {
    try {
      console.log('🧹 Removendo briefings de teste...');
      
      const deleteQuery = `
        DELETE FROM briefings 
        WHERE metadata->>'origem' = 'preenchimento_automatico'
        RETURNING id, nome_projeto
      `;
      
      const result = await this.client.query(deleteQuery);
      
      console.log(`🗑️  ${result.rows.length} briefings de teste removidos`);
      
      result.rows.forEach(briefing => {
        console.log(`  - ${briefing.nome_projeto} (ID: ${briefing.id})`);
      });
      
    } catch (error) {
      console.error('❌ Erro ao limpar briefings de teste:', error.message);
    }
  }
}

// Função principal
async function main() {
  const args = process.argv.slice(2);
  const preenchimento = new PreenchimentoBriefings();
  
  // Conectar ao banco
  const conectado = await preenchimento.conectarBanco();
  if (!conectado) {
    process.exit(1);
  }
  
  try {
    if (args.includes('--limpar') || args.includes('--clean')) {
      await preenchimento.limparBriefingsTeste();
    } else {
      await preenchimento.executar();
    }
  } finally {
    await preenchimento.desconectarBanco();
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  main().catch(error => {
    console.error('💥 Erro fatal:', error);
    process.exit(1);
  });
}

module.exports = PreenchimentoBriefings;