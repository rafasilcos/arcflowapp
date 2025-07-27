const https = require('https');
const http = require('http');

async function testarRespostas() {
  console.log('🔍 Testando contagem de respostas...');
  
  // Token JWT (você pode precisar atualizar se expirou)
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImE0NjE0ZWI0LTExMjUtNGMzMy1iMzcyLWE0Zjc3NWUzMmMwZSIsImVtYWlsIjoicmFmYWVsQGFyY2Zsb3cuY29tIiwiZXNjcml0b3Jpb0lkIjoiZjQ3YWMxMGItNThjYy00MzcyLWE1NjctMGUwMmIyYzNkNDc5IiwiaWF0IjoxNzM2NTQyNjQ5LCJleHAiOjE3MzY1NDYyNDl9.U_RJnwLW7-KQWbJtHsqNgaYHjMGJJ_2wJL7GsLJrLBQ';
  
  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/api/briefings',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };

  const req = http.request(options, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const response = JSON.parse(data);
        
        if (response.briefings && response.briefings.length > 0) {
          console.log('✅ Briefings encontrados:', response.briefings.length);
          console.log('\n📊 CONTAGEM DE RESPOSTAS:');
          
          response.briefings.forEach((briefing, index) => {
            const respostas = briefing._count ? briefing._count.respostas : 0;
            console.log(`${index + 1}. ${briefing.nomeProjeto} - ${respostas} respostas`);
          });
          
          // Verificar se há briefings com respostas
          const briefingsComRespostas = response.briefings.filter(b => b._count && b._count.respostas > 0);
          console.log(`\n✅ Briefings com respostas: ${briefingsComRespostas.length}/${response.briefings.length}`);
          
          if (briefingsComRespostas.length > 0) {
            console.log('🎉 SUCESSO! A contagem de respostas está funcionando!');
          } else {
            console.log('⚠️ AVISO: Nenhum briefing mostra respostas');
          }
        } else {
          console.log('❌ Nenhum briefing encontrado');
        }
      } catch (error) {
        console.error('❌ Erro ao parsear resposta:', error.message);
        console.log('Resposta raw:', data);
      }
    });
  });

  req.on('error', (e) => {
    console.error('❌ Erro na requisição:', e.message);
  });

  req.end();
}

// Aguardar um pouco para o servidor inicializar
setTimeout(testarRespostas, 3000); 