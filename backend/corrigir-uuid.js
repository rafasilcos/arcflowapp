const { Client } = require("pg");
const { v4: uuidv4 } = require("uuid");

const client = new Client({
  connectionString: process.env.DATABASE_URL || "postgresql://postgres.bcnlqpctqnxhfxactvod:ArcFlow2024!@aws-0-sa-east-1.pooler.supabase.com:6543/postgres",
  ssl: { rejectUnauthorized: false }
});

async function corrigirUUID() {
  try {
    await client.connect();
    console.log(" Verificando usuário admin...");
    
    const result = await client.query("SELECT id, email FROM users WHERE email = \"admin@arcflow.com\"");
    if (result.rows.length === 0) {
      console.log(" Usuário não encontrado");
      return;
    }
    
    const user = result.rows[0];
    console.log(" Usuário atual:", user);
    
    if (user.id === "user_admin_teste") {
      const novoId = uuidv4();
      console.log(" Novo UUID:", novoId);
      
      await client.query("UPDATE users SET id = $1 WHERE email = \"admin@arcflow.com\"", [novoId]);
      console.log(" UUID corrigido!");
    } else {
      console.log(" UUID já está correto");
    }
    
  } catch (error) {
    console.error(" Erro:", error);
  } finally {
    await client.end();
  }
}

corrigirUUID();
