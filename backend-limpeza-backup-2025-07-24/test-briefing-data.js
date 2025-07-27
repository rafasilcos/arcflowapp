const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testBriefingData() {
    try {
        console.log('🔍 Verificando dados do briefing...');
        
        const briefing = await prisma.briefing.findUnique({
            where: {
                id: 'c78c3f20-5de2-44c8-821a-0746bf7e20dd'
            },
            include: {
                cliente: true,
                responsavel: true
            }
        });
        
        if (!briefing) {
            console.log('❌ Briefing não encontrado!');
            return;
        }
        
        console.log('✅ Briefing encontrado:');
        console.log('📋 Nome do Projeto:', briefing.nomeProjeto);
        console.log('👤 Cliente ID:', briefing.clienteId);
        console.log('👨‍💼 Responsável ID:', briefing.responsavelId);
        
        if (briefing.cliente) {
            console.log('✅ Dados do Cliente:');
            console.log('  - Nome:', briefing.cliente.nome);
            console.log('  - Email:', briefing.cliente.email);
        } else {
            console.log('❌ Cliente não encontrado para ID:', briefing.clienteId);
        }
        
        if (briefing.responsavel) {
            console.log('✅ Dados do Responsável:');
            console.log('  - Nome:', briefing.responsavel.name);
            console.log('  - Email:', briefing.responsavel.email);
        } else {
            console.log('❌ Responsável não encontrado para ID:', briefing.responsavelId);
        }
        
    } catch (error) {
        console.error('❌ Erro:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

testBriefingData(); 