/**
 * Configuração Jest para Testes de Integração
 * Tarefa 12: Desenvolver testes de integração end-to-end
 */

module.exports = {
  // Ambiente de teste
  testEnvironment: 'node',
  
  // Padrão de arquivos de teste
  testMatch: [
    '**/tests/integration/**/*.test.js',
    '**/tests/performance/**/*.test.js'
  ],
  
  // Configurações de timeout
  testTimeout: 120000, // 2 minutos para testes de integração
  
  // Setup e teardown
  globalSetup: '<rootDir>/tests/setup/globalSetup.js',
  globalTeardown: '<rootDir>/tests/setup/globalTeardown.js',
  setupFilesAfterEnv: ['<rootDir>/tests/setup/setupTests.js'],
  
  // Configurações de cobertura
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,ts}',
    '!src/**/*.test.{js,ts}',
    '!src/**/*.spec.{js,ts}',
    '!src/tests/**',
    '!src/scripts/**'
  ],
  coverageDirectory: 'coverage/integration',
  coverageReporters: ['text', 'lcov', 'html'],
  
  // Thresholds de cobertura para integração
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 75,
      lines: 75,
      statements: 75
    }
  },
  
  // Configurações de execução
  maxWorkers: 1, // Executar testes sequencialmente para evitar conflitos
  forceExit: true,
  detectOpenHandles: true,
  
  // Configurações de relatório
  verbose: true,
  reporters: [
    'default',
    ['jest-html-reporters', {
      publicPath: './coverage/integration/html-report',
      filename: 'integration-test-report.html',
      expand: true,
      hideIcon: false,
      pageTitle: 'Relatório de Testes de Integração - ArcFlow'
    }]
  ],
  
  // Configurações de módulos
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@tests/(.*)$': '<rootDir>/tests/$1'
  },
  
  // Transformações
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest'
  },
  
  // Arquivos a serem ignorados
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/build/'
  ],
  
  // Configurações específicas para integração
  testSequencer: '<rootDir>/tests/setup/testSequencer.js'
};