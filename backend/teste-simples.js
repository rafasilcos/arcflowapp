console.log('Teste funcionando');
const { gerarCronogramaCompleto } = require('./utils/cronogramaCompleto');
console.log('Módulo carregado com sucesso');

const cronograma = gerarCronogramaCompleto(18000, ['ARQUITETURA']);
console.log('Cronograma gerado:', Object.keys(cronograma.fases).length, 'fases');