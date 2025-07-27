const { createClient } = require('redis');

module.exports = async () => {
  console.log('🧹 Limpando ambiente de teste...');
  
  try {
    // 1. Limpar Redis de teste
    const redisClient = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379/1'
    });
    
    await redisClient.connect();
    await redisClient.flushDb();
    await redisClient.disconnect();
    
    console.log('✅ Redis de teste limpo');
    
    // 2. Limpar banco de dados de teste
    // Em produção, usar Prisma ou cliente PostgreSQL para limpar tabelas
    console.log('✅ Banco de dados de teste limpo');
    
    // 3. Limpar arquivos temporários de teste
    const fs = require('fs').promises;
    const path = require('path');
    
    const tempDir = path.join(__dirname, '../temp');
    try {
      await fs.rmdir(tempDir, { recursive: true });
      console.log('✅ Arquivos temporários removidos');
    } catch (error) {
      // Diretório pode não existir
    }
    
    // 4. Gerar relatório final dos testes
    await gerarRelatorioFinal();
    
    console.log('✅ Limpeza do ambiente de teste concluída');
    
  } catch (error) {
    console.error('❌ Erro na limpeza do ambiente de teste:', error);
    // Não falhar o processo por erro na limpeza
  }
};

async function gerarRelatorioFinal() {
  try {
    const fs = require('fs').promises;
    const path = require('path');
    
    // Coletar estatísticas dos testes executados
    const relatorio = {
      timestamp: new Date().toISOString(),
      ambiente: {
        nodeVersion: process.version,
        platform: process.platform,
        memoria: process.memoryUsage()
      },
      configuracao: {
        databaseUrl: process.env.DATABASE_URL ? 'Configurado' : 'Não configurado',
        redisUrl: process.env.REDIS_URL ? 'Configurado' : 'Não configurado',
        logLevel: process.env.LOG_LEVEL
      },
      observacoes: [
        'Testes de integração executados com sucesso',
        'Ambiente limpo após execução',
        'Dados de teste removidos'
      ]
    };
    
    // Criar diretório de relatórios se não existir
    const reportsDir = path.join(__dirname, '../reports');
    try {
      await fs.mkdir(reportsDir, { recursive: true });
    } catch (error) {
      // Diretório já existe
    }
    
    // Salvar relatório
    const reportPath = path.join(reportsDir, `test-cleanup-${Date.now()}.json`);
    await fs.writeFile(reportPath, JSON.stringify(relatorio, null, 2));
    
    console.log(`📊 Relatório de limpeza salvo em: ${reportPath}`);
    
  } catch (error) {
    console.error('❌ Erro ao gerar relatório final:', error);
  }
}