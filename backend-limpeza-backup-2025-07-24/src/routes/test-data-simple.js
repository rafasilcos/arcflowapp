
// 🧪 ROTAS DE TESTE SIMPLES - ArcFlow
const express = require('express');
const router = express.Router();

// 📊 Endpoint de teste básico
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Test data routes funcionando',
    timestamp: new Date().toISOString()
  });
});

// 🎯 Dados de teste para desenvolvimento
router.get('/sample-data', (req, res) => {
  res.json({
    briefings: [
      {
        id: 'test-1',
        nome: 'Projeto Teste',
        tipologia: 'residencial',
        status: 'em_andamento'
      }
    ],
    usuarios: [
      {
        id: 'user-test-1',
        email: 'teste@arcflow.com',
        nome: 'Usuário Teste'
      }
    ]
  });
});

module.exports = router;
