const fetch = require('node-fetch');

async function testarDadosReaisFrontend() {
  try {
    console.log('🔍 Testando com dados exatos do frontend...');
    
    // Dados como o frontend das fases 1, 2 e 3 enviaria
    const dadosReais = {
      nome: 'João Silva',
      email: 'joao.silva@email.com',
      telefone: '(11) 99999-8888',
      tipoPessoa: 'fisica',
      cpf: '123.456.789-00',
      
      // Endereço (objeto + campos separados)
      endereco: {
        cep: '01310-100',
        logradouro: 'Avenida Paulista',
        numero: '1000',
        complemento: 'Apto 101',
        bairro: 'Bela Vista',
        cidade: 'São Paulo',
        uf: 'SP',
        pais: 'Brasil'
      },
      endereco_cep: '01310-100',
      endereco_logradouro: 'Avenida Paulista',
      endereco_numero: '1000',
      endereco_complemento: 'Apto 101',
      endereco_bairro: 'Bela Vista',
      endereco_cidade: 'São Paulo',
      endereco_uf: 'SP',
      endereco_pais: 'Brasil',
      
      observacoes: 'Cliente criado via sistema',
      status: 'ativo',
      profissao: 'Arquiteto',
      dataNascimento: '1985-03-15',
      
      // FASE 1: Família
      familia: {
        conjuge: {
          nome: 'Maria Silva',
          idade: 32
        },
        filhos: [
          {
            nome: 'Pedro Silva',
            idade: 8,
            necessidadesEspeciais: 'Nenhuma'
          }
        ],
        pets: [
          {
            tipo: 'Cachorro',
            quantidade: 1
          }
        ]
      },
      
      // FASE 1: Histórico de Projetos
      historicoProjetos: [
        {
          tipologia: 'residencial',
          ano: 2022,
          valorInvestido: 250000,
          satisfacao: 5
        }
      ],
      
      // FASE 2: Preferências (múltiplos estilos)
      preferencias: {
        estilos: ['contemporaneo', 'moderno', 'minimalista'],
        orcamento: {
          min: 200000,
          max: 400000
        },
        prazo: '12 meses',
        observacoes: 'Prefere materiais sustentáveis'
      },
      
      // FASE 1: Origem
      origem: {
        fonte: 'Site',
        campanha: 'Google Ads',
        detalhes: 'Busca por arquiteto residencial'
      }
    };
    
    console.log('📤 Dados sendo enviados:');
    console.log(JSON.stringify(dadosReais, null, 2));
    
    console.log('\n🌐 Fazendo requisição para http://localhost:3001/api/clientes...');
    
    const response = await fetch('http://localhost:3001/api/clientes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dadosReais)
    });
    
    console.log(`📊 Status da resposta: ${response.status}`);
    
    const responseText = await response.text();
    console.log('📄 Resposta completa:');
    console.log(responseText);
    
    if (response.status === 500) {
      console.log('\n🚨 ERRO 500 DETECTADO!');
      console.log('🔍 Analisando resposta de erro...');
      
      try {
        const errorData = JSON.parse(responseText);
        console.log('❌ Erro estruturado:', errorData);
        
        if (errorData.error) {
          console.log('💡 Mensagem de erro:', errorData.error);
        }
      } catch (e) {
        console.log('❌ Erro não estruturado:', responseText);
      }
    } else if (response.ok) {
      console.log('✅ Cliente criado com sucesso!');
      const data = JSON.parse(responseText);
      console.log('🆔 ID do cliente:', data.cliente?.id);
    }
    
  } catch (error) {
    console.error('❌ Erro na requisição:', error.message);
    console.error('🔍 Stack trace:', error.stack);
  }
}

testarDadosReaisFrontend(); 