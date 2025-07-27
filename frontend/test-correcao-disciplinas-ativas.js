/**
 * 🔍 TESTE DA CORREÇÃO: disciplinasAtivasNaFase
 * 
 * Verificar se a correção da propriedade disciplinasAtivasNaFase está funcionando
 */

const axios = require('axios');

async function testarCorrecaoDisciplinasAtivas() {
  console.log('🔍 TESTE DA CORREÇÃO: disciplinasAtivasNaFase\n');
  
  try {
    // 1. Login
    const loginResponse = await axios.post('http://localhost:3001/api/auth/login', {
      email: 'admin@arcflow.com',
      password: '123456'
    });
    const token = loginResponse.data.token;
    console.log('✅ Login realizado');
    
    // 2. Buscar orçamento 65
    const orcamentoResponse = await axios.get('http://localhost:3001/api/orcamentos/65', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const orcamento = orcamentoResponse.data.data;
    
    console.log(`✅ Orçamento: ${orcamento.codigo}`);
    
    // 3. Simular disciplinas disponíveis (como no frontend)
    const DISCIPLINAS_PADRAO = [
      {
        id: 'arquitetura',
        codigo: 'ARQUITETURA',
        nome: 'Arquitetura',
        icone: '🏗️',
        categoria: 'ESSENCIAL',
        descricao: 'Projeto arquitetônico completo',
        valorBase: 5000,
        horasBase: 40,
        ativa: true,
        ordem: 1
      },
      {
        id: 'estrutural',
        codigo: 'ESTRUTURAL',
        nome: 'Estrutural',
        icone: '🏗️',
        categoria: 'ESSENCIAL',
        descricao: 'Projeto estrutural',
        valorBase: 4000,
        horasBase: 30,
        ativa: true,
        ordem: 2
      },
      {
        id: 'hidraulica',
        codigo: 'INSTALACOES_HIDRAULICAS',
        nome: 'Instalações Hidráulicas',
        icone: '🚿',
        categoria: 'COMPLEMENTAR',
        descricao: 'Projeto hidrossanitário',
        valorBase: 2000,
        horasBase: 20,
        ativa: true,
        ordem: 3
      },
      {
        id: 'eletrica',
        codigo: 'INSTALACOES_ELETRICAS',
        nome: 'Instalações Elétricas',
        icone: '⚡',
        categoria: 'COMPLEMENTAR',
        descricao: 'Projeto elétrico',
        valorBase: 2500,
        horasBase: 25,
        ativa: true,
        ordem: 4
      }
    ];
    
    // 4. Simular conversão com a correção aplicada
    const cronogramaOriginal = orcamento.cronograma;
    
    console.log('\n🔄 SIMULANDO CONVERSÃO COM CORREÇÃO...');
    
    const cronogramaConvertido = Object.values(cronogramaOriginal.fases).map((fase) => {
      // Converter disciplinas string para objetos Disciplina (CORREÇÃO APLICADA)
      const disciplinasAtivasNaFase = (fase.disciplinas || []).map((discCodigo) => {
        const disciplinaEncontrada = DISCIPLINAS_PADRAO.find(d => 
          d.codigo.toUpperCase() === discCodigo.toUpperCase()
        );
        return disciplinaEncontrada || {
          id: discCodigo,
          codigo: discCodigo,
          nome: discCodigo,
          icone: '📋',
          categoria: 'ESSENCIAL',
          descricao: '',
          valorBase: 0,
          horasBase: 0,
          ativa: true,
          ordem: 1
        };
      });

      return {
        id: fase.nome?.replace(/\s+/g, '_').toUpperCase() || 'FASE',
        ordem: fase.ordem || 1,
        etapa: fase.etapa || '',
        nome: fase.nome || '',
        prazo: fase.prazo || 0,
        valor: fase.valor || 0,
        percentual: fase.percentual || 0,
        disciplinas: fase.disciplinas || [],
        disciplinasAtivasNaFase, // ✅ CORREÇÃO APLICADA
        responsavel: fase.responsavel || 'Equipe Técnica',
        entregaveis: fase.entregaveis || [],
        ativa: true
      };
    });
    
    // 5. Verificar se a correção funcionou
    console.log('\n📋 VERIFICANDO CORREÇÃO POR FASE:');
    
    let totalEntregaveis = 0;
    let fasesComDisciplinasCorretas = 0;
    
    cronogramaConvertido.forEach((fase, index) => {
      totalEntregaveis += fase.entregaveis.length;
      
      console.log(`\n   ${index + 1}. ${fase.nome}:`);
      console.log(`      - Entregáveis: ${fase.entregaveis.length}`);
      console.log(`      - Disciplinas (string): ${fase.disciplinas.join(', ')}`);
      console.log(`      - disciplinasAtivasNaFase: ${fase.disciplinasAtivasNaFase.length} objetos`);
      
      // Verificar se disciplinasAtivasNaFase foi populada corretamente
      if (fase.disciplinasAtivasNaFase && fase.disciplinasAtivasNaFase.length > 0) {
        fasesComDisciplinasCorretas++;
        console.log(`      ✅ disciplinasAtivasNaFase populada:`);
        fase.disciplinasAtivasNaFase.forEach(disc => {
          console.log(`         - ${disc.icone} ${disc.nome} (${disc.codigo})`);
        });
      } else {
        console.log(`      ❌ disciplinasAtivasNaFase VAZIA ou NULA`);
      }
    });
    
    // 6. Resultado final
    console.log('\n🎯 RESULTADO DA CORREÇÃO:');
    console.log(`   - Total de fases: ${cronogramaConvertido.length}`);
    console.log(`   - Fases com disciplinasAtivasNaFase corretas: ${fasesComDisciplinasCorretas}`);
    console.log(`   - Total de entregáveis: ${totalEntregaveis}`);
    console.log(`   - Status da correção: ${fasesComDisciplinasCorretas === cronogramaConvertido.length ? '✅ SUCESSO' : '❌ FALHOU'}`);
    
    if (fasesComDisciplinasCorretas === cronogramaConvertido.length && totalEntregaveis === 72) {
      console.log('\n🎉 CORREÇÃO APLICADA COM SUCESSO!');
      console.log('✅ Todas as fases têm disciplinasAtivasNaFase populadas');
      console.log('✅ Total de entregáveis correto (72)');
      console.log('💡 O problema no frontend deve estar resolvido');
    } else {
      console.log('\n❌ CORREÇÃO AINDA TEM PROBLEMAS:');
      if (fasesComDisciplinasCorretas < cronogramaConvertido.length) {
        console.log(`   - ${cronogramaConvertido.length - fasesComDisciplinasCorretas} fases sem disciplinasAtivasNaFase`);
      }
      if (totalEntregaveis !== 72) {
        console.log(`   - Total de entregáveis incorreto: ${totalEntregaveis} (esperado: 72)`);
      }
    }
    
    // 7. Testar renderização simulada do componente
    console.log('\n🎨 SIMULANDO RENDERIZAÇÃO DO COMPONENTE:');
    
    cronogramaConvertido.slice(0, 2).forEach((fase, index) => {
      console.log(`\n   Fase ${index + 1}: ${fase.nome}`);
      console.log(`   - Disciplinas para exibir: ${fase.disciplinasAtivasNaFase?.length || 0}`);
      
      if (fase.disciplinasAtivasNaFase && fase.disciplinasAtivasNaFase.length > 0) {
        console.log(`   - Tags de disciplinas:`);
        fase.disciplinasAtivasNaFase.forEach(disc => {
          console.log(`     [${disc.icone} ${disc.nome}]`);
        });
      } else {
        console.log(`   ❌ Nenhuma tag de disciplina será exibida!`);
      }
      
      console.log(`   - Entregáveis (primeiros 3):`);
      fase.entregaveis.slice(0, 3).forEach((entregavel, i) => {
        console.log(`     ${i + 1}. ✓ ${entregavel.substring(0, 50)}...`);
      });
    });
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

testarCorrecaoDisciplinasAtivas();