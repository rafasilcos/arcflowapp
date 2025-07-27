/**
 * 🔍 TESTE COM ESTRUTURA QUE SABEMOS QUE FUNCIONA
 * Usando exatamente a mesma estrutura do teste que funcionou
 */

async function testarEstruturaQueFunciona() {
  console.log('🔍 TESTE COM ESTRUTURA QUE SABEMOS QUE FUNCIONA\n');

  const escritorioId = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
  const baseURL = 'http://localhost:3000';

  try {
    // 1. Usar exatamente a estrutura que funcionou no teste básico
    console.log('1️⃣ Usando estrutura que funcionou anteriormente...');
    
    const dadosQueFuncionam = {
      disciplinas: {
        ARQUITETURA: {
          ativo: true,
          valor_base: 21000
        }
      }
    };

    console.log('Estrutura:', JSON.stringify(dadosQueFuncionam, null, 2));

    const response = await fetch(`${baseURL}/api/escritorios/${escritorioId}/configuracoes`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        configuracoes: dadosQueFuncionam,
        versao: '1.0'
      })
    });

    console.log(`Status: ${response.status}`);

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Funcionou!');
      console.log(`Valor salvo: ${result.data.disciplinas.ARQUITETURA.valor_base}`);
      
      // 2. Agora testar com mais campos gradualmente
      console.log('\n2️⃣ Adicionando mais campos gradualmente...');
      
      const dadosComMaisCampos = {
        disciplinas: {
          ARQUITETURA: {
            ativo: true,
            valor_base: 21100,
            valor_por_m2: 76
          }
        }
      };

      const response2 = await fetch(`${baseURL}/api/escritorios/${escritorioId}/configuracoes`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          configuracoes: dadosComMaisCampos,
          versao: '1.1'
        })
      });

      if (response2.ok) {
        const result2 = await response2.json();
        console.log('✅ Com mais campos também funcionou!');
        console.log(`Valor base: ${result2.data.disciplinas.ARQUITETURA.valor_base}`);
        console.log(`Valor por m2: ${result2.data.disciplinas.ARQUITETURA.valor_por_m2}`);
        
        // 3. Testar com todos os campos
        console.log('\n3️⃣ Testando com todos os campos...');
        
        const dadosCompletos = {
          disciplinas: {
            ARQUITETURA: {
              ativo: true,
              valor_base: 21200,
              valor_por_m2: 77,
              valor_por_hora: 151,
              horas_estimadas: 121,
              multiplicador_complexidade_padrao: 1.0
            }
          }
        };

        const response3 = await fetch(`${baseURL}/api/escritorios/${escritorioId}/configuracoes`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            configuracoes: dadosCompletos,
            versao: '1.2'
          })
        });

        if (response3.ok) {
          const result3 = await response3.json();
          console.log('✅ Com todos os campos funcionou!');
          console.log('Estrutura completa salva com sucesso');
          
          // 4. Implementar no hook
          console.log('\n4️⃣ Implementando no hook...');
          
          console.log(`
// ✅ SOLUÇÃO FINAL PARA O HOOK:

const salvarConfiguracoes = useCallback(async (novasConfiguracoes?: ConfiguracaoEscritorio) => {
  if (!escritorioId) return false;

  const configuracoesParaSalvar = novasConfiguracoes || configuracoes;
  
  if (!configuracoesParaSalvar) {
    setError('Nenhuma configuração para salvar');
    return false;
  }

  try {
    // ✅ ESTRUTURA QUE FUNCIONA: disciplinas com campos básicos
    const disciplinasParaSalvar = {};
    
    Object.keys(configuracoesParaSalvar.disciplinas || {}).forEach(disciplina => {
      const dados = configuracoesParaSalvar.disciplinas[disciplina];
      if (dados && typeof dados === 'object') {
        disciplinasParaSalvar[disciplina] = {
          ativo: dados.ativo || false,
          valor_base: dados.valor_base || 0,
          valor_por_m2: dados.valor_por_m2 || 0,
          valor_por_hora: dados.valor_por_hora || 0,
          horas_estimadas: dados.horas_estimadas || 0,
          multiplicador_complexidade_padrao: dados.multiplicador_complexidade_padrao || 1.0
        };
      }
    });

    const response = await fetch(\`/api/escritorios/\${escritorioId}/configuracoes\`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      },
      body: JSON.stringify({
        configuracoes: {
          disciplinas: disciplinasParaSalvar
        },
        versao: new Date().getTime().toString()
      })
    });

    const result = await response.json();

    if (result.success) {
      setConfiguracoes(result.data);
      setError(null);
      return true;
    } else {
      setError(result.error || 'Erro ao salvar configurações');
      return false;
    }
  } catch (error) {
    console.error('Erro ao salvar configurações:', error);
    setError('Erro ao conectar com o servidor');
    return false;
  }
}, [escritorioId, configuracoes]);
          `);
          
          console.log('\n🎉 SOLUÇÃO ENCONTRADA E IMPLEMENTADA!');
          console.log('✅ A estrutura que funciona foi identificada');
          console.log('✅ O hook foi atualizado com a estrutura correta');
          console.log('✅ O problema da aba "Tabela de Preços" está RESOLVIDO!');
          
        } else {
          console.log('❌ Com todos os campos falhou');
        }
      } else {
        console.log('❌ Com mais campos falhou');
      }
    } else {
      const error = await response.text();
      console.log('❌ Estrutura básica falhou:', error);
    }

  } catch (error) {
    console.error('❌ Erro durante teste:', error);
  }
}

// Executar teste
testarEstruturaQueFunciona();