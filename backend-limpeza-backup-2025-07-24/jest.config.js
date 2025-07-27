/**
 * Configuração do Jest para Testes de Integração
 * Tarefa 12: Desenvolver testes de integração end-to-end
 */

module.exports = {
  // Ambiente de teste
  testEnvironment: 'node',
  
  // Padrões de arquivos de teste
  testMatch: [
    '**/tests/**/*.test.js',
    '**/tests/**/*.spec.js'
  ],
  
  // Diretórios a ignorar
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/build/'
  ],
  
  // Configuração de cobertura
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  collectCoverageFrom: [
    'src/**/*.{js,ts}',
    '!src/**/*.test.{js,ts}',
    '!src/**/*.spec.{js,ts}',
    '!src/types/**',
    '!**/node_modules/**'
  ],
  
  // Limites de cobertura
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  },
  
  // Setup e teardown
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  
  // Timeout para testes longos
  testTimeout: 30000,
  
  // Configurações de performance
  maxWorkers: '50%',
  
  // Configuração de módulos
  moduleFileExtensions: ['js', 'json', 'ts'],
  
  // Transformações
  transform: {
    '^.+\\.ts$': 'ts-jest'
  },
  
  // Variáveis de ambiente para testes
  setupFiles: ['<rootDir>/tests/env.js'],
  
  // Configuração de relatórios
  reporters: [
    'default',
    ['jest-html-reporters', {
      publicPath: './test-reports',
      filename: 'integration-test-report.html',
      expand: true
    }]
  ],
  
  // Configuração para testes de integração
  testSequencer: '<rootDir>/tests/sequencer.js'
};