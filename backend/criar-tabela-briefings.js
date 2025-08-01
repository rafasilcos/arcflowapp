const { Client } = require("pg");

console.log(" Verificando/Criando tabela de briefings...\n");

const DATABASE_URL = "postgresql://postgres.lxatittpiiufvubyggzb:obm101264@aws-0-sa-east-1.pooler.supabase.com:6543/postgres";
const client = new Client({ connectionString: DATABASE_URL });

async function criarTabelaBriefings() {
  try {
    await client.connect();
    console.log(" Conectado ao banco de dados");

    const checkTable = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = "public" 
        AND table_name = "briefings"
      );
    `);

    if (checkTable.rows[0].exists) {
      console.log(" Tabela briefings já existe");
    } else {
      console.log(" Tabela briefings não existe. Criando...");
      
      await client.query(`
        CREATE TABLE briefings (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          nome_projeto VARCHAR(255) NOT NULL,
          descricao TEXT,
          objetivos TEXT,
          prazo VARCHAR(100),
          orcamento VARCHAR(100),
          cliente_id UUID,
          responsavel_id UUID,
          escritorio_id UUID NOT NULL,
          created_by UUID NOT NULL,
          disciplina VARCHAR(100) NOT NULL,
          area VARCHAR(100),
          tipologia VARCHAR(100),
          status VARCHAR(50) DEFAULT "RASCUNHO",
          progresso INTEGER DEFAULT 0,
          metadata JSONB,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW(),
          deleted_at TIMESTAMP
        );
      `);
      
      console.log(" Tabela briefings criada com sucesso!");
    }

    const testResult = await client.query(`SELECT COUNT(*) as total FROM briefings;`);
    console.log(` Total de briefings existentes: ${testResult.rows[0].total}`);
    
    console.log("\n Tabela briefings está pronta para uso!");

  } catch (error) {
    console.error(" Erro:", error.message);
  } finally {
    await client.end();
  }
}

criarTabelaBriefings();
