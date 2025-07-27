const { prisma } = require('./dist/config/database-simple.js');

console.log('🧪 TESTE COMPLETO DO SISTEMA ARCFLOW');

async function testComplete() {
  try {
    console.log('1️⃣ Testando conexão banco...');
    await prisma.$connect();
    console.log('✅ Banco conectado');

    console.log('2️⃣ Criando escritório teste...');
    const escritorio = await prisma.escritorio.create({
      data: {
        nome: 'Escritório Teste ArcFlow',
        email: 'teste@arcflow.com',
        plano: 'BASIC'
      }
    });
    console.log('✅ Escritório criado:', escritorio.id);

    console.log('3️⃣ Criando usuário teste...');
    const user = await prisma.user.create({
      data: {
        name: 'Rafael Teste',
        email: 'rafael@teste.com',
        password: 'senha123',
        role: 'OWNER',
        escritorioId: escritorio.id
      }
    });
    console.log('✅ Usuário criado:', user.id);

    console.log('4️⃣ Criando cliente teste...');
    const cliente = await prisma.cliente.create({
      data: {
        nome: 'Cliente Teste',
        email: 'cliente@teste.com',
        telefone: '11999999999',
        escritorioId: escritorio.id
      }
    });
    console.log('✅ Cliente criado:', cliente.id);

    console.log('5️⃣ Criando projeto teste...');
    const projeto = await prisma.projeto.create({
      data: {
        nome: 'Projeto Teste ArcFlow',
        descricao: 'Projeto de teste do sistema',
        tipologia: 'RESIDENCIAL',
        status: 'BRIEFING',
        prioridade: 'MEDIA',
        escritorioId: escritorio.id,
        clienteId: cliente.id
      }
    });
    console.log('✅ Projeto criado:', projeto.id);

    console.log('6️⃣ Testando consulta com relacionamentos...');
    const projetoCompleto = await prisma.projeto.findFirst({
      where: { id: projeto.id },
      include: {
        cliente: true,
        escritorio: true
      }
    });
    console.log('✅ Consulta com relacionamentos funcionando');
    console.log('📊 Projeto:', projetoCompleto.nome);
    console.log('👤 Cliente:', projetoCompleto.cliente.nome);
    console.log('🏢 Escritório:', projetoCompleto.escritorio.nome);

    console.log('7️⃣ Limpando dados de teste...');
    await prisma.projeto.delete({ where: { id: projeto.id } });
    await prisma.cliente.delete({ where: { id: cliente.id } });
    await prisma.user.delete({ where: { id: user.id } });
    await prisma.escritorio.delete({ where: { id: escritorio.id } });
    console.log('✅ Limpeza concluída');

    await prisma.$disconnect();
    console.log('🎉 TESTE COMPLETO: TUDO FUNCIONANDO 100%!');
    
  } catch (error) {
    console.error('❌ ERRO NO TESTE:', error.message);
    process.exit(1);
  }
}

testComplete(); 