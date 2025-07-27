// Script para verificar dados reais no banco PostgreSQL
require('dotenv').config(); // Carregar variáveis de ambiente
const { PrismaClient } = require('@prisma/client');

console.log('🔧 DATABASE_URL carregada:', process.env.DATABASE_URL ? 'SIM' : 'NÃO');

const prisma = new PrismaClient();

const verificarDadosReais = async () => {
  try {
    console.log('🔍 Verificando dados reais no PostgreSQL...');
    
    // 1. Verificar conexão com banco
    await prisma.$connect();
    console.log('✅ Conectado ao PostgreSQL!');
    
    // 2. Verificar usuários
    const usuarios = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        escritorioId: true
      }
    });
    console.log('👥 Usuários encontrados:', usuarios.length);
    
    // 3. Verificar escritórios
    const escritorios = await prisma.escritorio.findMany({
      select: {
        id: true,
        nome: true
      }
    });
    console.log('🏢 Escritórios encontrados:', escritorios.length);
    
    // 4. Verificar briefings TOTAL (sem filtro)
    const totalBriefings = await prisma.briefing.count();
    console.log('📋 Total de briefings no banco:', totalBriefings);
    
    // 5. Verificar briefings por escritório
    for (const escritorio of escritorios) {
      const briefingsEscritorio = await prisma.briefing.count({
        where: { escritorioId: escritorio.id }
      });
      console.log(`📊 Escritório "${escritorio.nome}" (${escritorio.id}): ${briefingsEscritorio} briefings`);
    }
    
    // 6. Verificar briefings NÃO deletados
    const briefingsAtivos = await prisma.briefing.count({
      where: { deletedAt: null }
    });
    console.log('✅ Briefings ativos (não deletados):', briefingsAtivos);
    
    // 7. Listar alguns briefings com detalhes
    const briefingsSample = await prisma.briefing.findMany({
      take: 5,
      include: {
        cliente: {
          select: { nome: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    console.log('\n📋 Últimos 5 briefings:');
    briefingsSample.forEach((briefing, index) => {
      console.log(`${index + 1}. ${briefing.nomeProjeto} - Cliente: ${briefing.cliente?.nome || 'N/A'} - Status: ${briefing.status}`);
    });
    
    // 8. Verificar token de autenticação específico
    const tokenTest = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJhMWIyYzNkNC1lNWY2LTc4OTAtMTIzNC01Njc4OTBhYmNkZWYiLCJlc2NyaXRvcmlvSWQiOiJmNDdhYzEwYi01OGNjLTQzNzItYTU2Ny0wZTAyYjJjM2Q0NzkiLCJpYXQiOjE3MzU2NDA1OTZ9.DgHaGuU5G_7DqfVUYhcOBSDFoX9zVByKi5RgItG-Osk';
    
    // Decodificar token (sem verificar assinatura - só para debug)
    const payload = JSON.parse(Buffer.from(tokenTest.split('.')[1], 'base64').toString());
    console.log('\n🔑 Token payload:', payload);
    
    // Verificar se usuário e escritório do token existem
    const usuarioToken = await prisma.user.findUnique({
      where: { id: payload.userId }
    });
    console.log('👤 Usuário do token existe:', usuarioToken ? '✅ SIM' : '❌ NÃO');
    
    const escritorioToken = await prisma.escritorio.findUnique({
      where: { id: payload.escritorioId }
    });
    console.log('🏢 Escritório do token existe:', escritorioToken ? '✅ SIM' : '❌ NÃO');
    
    // Verificar briefings específicos para esse escritório
    const briefingsEscritorioToken = await prisma.briefing.findMany({
      where: { 
        escritorioId: payload.escritorioId,
        deletedAt: null 
      },
      include: {
        cliente: { select: { nome: true } }
      }
    });
    console.log(`📋 Briefings para escritório ${payload.escritorioId}:`, briefingsEscritorioToken.length);
    
    if (briefingsEscritorioToken.length > 0) {
      console.log('📝 Detalhes dos briefings:');
      briefingsEscritorioToken.forEach((b, i) => {
        console.log(`  ${i+1}. ID: ${b.id} | Nome: ${b.nomeProjeto} | Status: ${b.status} | Cliente: ${b.cliente?.nome || 'N/A'}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Erro ao verificar dados:', error);
  } finally {
    await prisma.$disconnect();
  }
};

verificarDadosReais(); 