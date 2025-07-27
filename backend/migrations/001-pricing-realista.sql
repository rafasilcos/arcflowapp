-- MIGRATION: SISTEMA DE PRECIFICAÇÃO REALISTA - ARCFLOW
-- Cria tabelas com valores reais do mercado brasileiro de AEC

-- ===== TABELA DE PREÇOS BASE POR DISCIPLINA E TIPOLOGIA =====
CREATE TABLE IF NOT EXISTS pricing_base (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipologia VARCHAR(50) NOT NULL,
  disciplina VARCHAR(50) NOT NULL,
  complexidade VARCHAR(20) NOT NULL,
  price_min DECIMAL(10,2) NOT NULL,
  price_max DECIMAL(10,2) NOT NULL,
  price_average DECIMAL(10,2) NOT NULL,
  unit VARCHAR(10) DEFAULT 'm2',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT pricing_base_unique UNIQUE (tipologia, disciplina, complexidade),
  CONSTRAINT pricing_base_prices_valid CHECK (price_min > 0 AND price_max >= price_min AND price_average BETWEEN price_min AND price_max)
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_pricing_tipologia_disciplina ON pricing_base(tipologia, disciplina);
CREATE INDEX IF NOT EXISTS idx_pricing_complexidade ON pricing_base(complexidade);
CREATE INDEX IF NOT EXISTS idx_pricing_active ON pricing_base(active);

-- ===== TABELA DE FATORES DE COMPLEXIDADE =====
CREATE TABLE IF NOT EXISTS complexity_factors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  factor_type VARCHAR(50) NOT NULL, -- 'MULTIPLIER' | 'PERCENTAGE'
  value DECIMAL(5,4) NOT NULL,
  description TEXT,
  applies_to VARCHAR(50)[], -- tipologias onde se aplica
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT complexity_factors_name_unique UNIQUE (name),
  CONSTRAINT complexity_factors_type_valid CHECK (factor_type IN ('MULTIPLIER', 'PERCENTAGE')),
  CONSTRAINT complexity_factors_value_valid CHECK (value >= -1.0 AND value <= 5.0)
);

-- Índice para performance
CREATE INDEX IF NOT EXISTS idx_complexity_factors_active ON complexity_factors(active);

-- ===== INSERIR DADOS REALISTAS =====

-- RESIDENCIAL - ARQUITETURA
INSERT INTO pricing_base (tipologia, disciplina, complexidade, price_min, price_max, price_average) VALUES
('RESIDENCIAL', 'ARQUITETURA', 'SIMPLES', 80.00, 150.00, 115.00),
('RESIDENCIAL', 'ARQUITETURA', 'MEDIO', 150.00, 250.00, 200.00),
('RESIDENCIAL', 'ARQUITETURA', 'COMPLEXO', 250.00, 400.00, 325.00);

-- RESIDENCIAL - ESTRUTURAL  
INSERT INTO pricing_base (tipologia, disciplina, complexidade, price_min, price_max, price_average) VALUES
('RESIDENCIAL', 'ESTRUTURAL', 'SIMPLES', 30.00, 50.00, 40.00),
('RESIDENCIAL', 'ESTRUTURAL', 'MEDIO', 50.00, 80.00, 65.00),
('RESIDENCIAL', 'ESTRUTURAL', 'COMPLEXO', 80.00, 120.00, 100.00);

-- RESIDENCIAL - INSTALAÇÕES ELÉTRICAS
INSERT INTO pricing_base (tipologia, disciplina, complexidade, price_min, price_max, price_average) VALUES
('RESIDENCIAL', 'INSTALACOES_ELETRICAS', 'SIMPLES', 15.00, 25.00, 20.00),
('RESIDENCIAL', 'INSTALACOES_ELETRICAS', 'MEDIO', 25.00, 40.00, 32.50),
('RESIDENCIAL', 'INSTALACOES_ELETRICAS', 'COMPLEXO', 40.00, 60.00, 50.00);

-- RESIDENCIAL - INSTALAÇÕES HIDRÁULICAS
INSERT INTO pricing_base (tipologia, disciplina, complexidade, price_min, price_max, price_average) VALUES
('RESIDENCIAL', 'INSTALACOES_HIDRAULICAS', 'SIMPLES', 15.00, 25.00, 20.00),
('RESIDENCIAL', 'INSTALACOES_HIDRAULICAS', 'MEDIO', 25.00, 35.00, 30.00),
('RESIDENCIAL', 'INSTALACOES_HIDRAULICAS', 'COMPLEXO', 35.00, 50.00, 42.50);

-- RESIDENCIAL - PAISAGISMO
INSERT INTO pricing_base (tipologia, disciplina, complexidade, price_min, price_max, price_average) VALUES
('RESIDENCIAL', 'PAISAGISMO', 'SIMPLES', 20.00, 40.00, 30.00),
('RESIDENCIAL', 'PAISAGISMO', 'MEDIO', 40.00, 70.00, 55.00),
('RESIDENCIAL', 'PAISAGISMO', 'COMPLEXO', 70.00, 120.00, 95.00);

-- COMERCIAL - ARQUITETURA
INSERT INTO pricing_base (tipologia, disciplina, complexidade, price_min, price_max, price_average) VALUES
('COMERCIAL', 'ARQUITETURA', 'SIMPLES', 90.00, 150.00, 120.00),
('COMERCIAL', 'ARQUITETURA', 'MEDIO', 150.00, 250.00, 200.00),
('COMERCIAL', 'ARQUITETURA', 'COMPLEXO', 250.00, 400.00, 325.00);

-- COMERCIAL - ESTRUTURAL
INSERT INTO pricing_base (tipologia, disciplina, complexidade, price_min, price_max, price_average) VALUES
('COMERCIAL', 'ESTRUTURAL', 'SIMPLES', 40.00, 70.00, 55.00),
('COMERCIAL', 'ESTRUTURAL', 'MEDIO', 70.00, 100.00, 85.00),
('COMERCIAL', 'ESTRUTURAL', 'COMPLEXO', 100.00, 150.00, 125.00);

-- COMERCIAL - INSTALAÇÕES
INSERT INTO pricing_base (tipologia, disciplina, complexidade, price_min, price_max, price_average) VALUES
('COMERCIAL', 'INSTALACOES_ELETRICAS', 'SIMPLES', 20.00, 35.00, 27.50),
('COMERCIAL', 'INSTALACOES_ELETRICAS', 'MEDIO', 35.00, 55.00, 45.00),
('COMERCIAL', 'INSTALACOES_ELETRICAS', 'COMPLEXO', 55.00, 80.00, 67.50),
('COMERCIAL', 'INSTALACOES_HIDRAULICAS', 'SIMPLES', 20.00, 30.00, 25.00),
('COMERCIAL', 'INSTALACOES_HIDRAULICAS', 'MEDIO', 30.00, 45.00, 37.50),
('COMERCIAL', 'INSTALACOES_HIDRAULICAS', 'COMPLEXO', 45.00, 65.00, 55.00);

-- INDUSTRIAL - ARQUITETURA
INSERT INTO pricing_base (tipologia, disciplina, complexidade, price_min, price_max, price_average) VALUES
('INDUSTRIAL', 'ARQUITETURA', 'SIMPLES', 40.00, 80.00, 60.00),
('INDUSTRIAL', 'ARQUITETURA', 'MEDIO', 80.00, 120.00, 100.00),
('INDUSTRIAL', 'ARQUITETURA', 'COMPLEXO', 120.00, 200.00, 160.00);

-- INDUSTRIAL - ESTRUTURAL
INSERT INTO pricing_base (tipologia, disciplina, complexidade, price_min, price_max, price_average) VALUES
('INDUSTRIAL', 'ESTRUTURAL', 'SIMPLES', 50.00, 80.00, 65.00),
('INDUSTRIAL', 'ESTRUTURAL', 'MEDIO', 80.00, 120.00, 100.00),
('INDUSTRIAL', 'ESTRUTURAL', 'COMPLEXO', 120.00, 180.00, 150.00);

-- INDUSTRIAL - INSTALAÇÕES
INSERT INTO pricing_base (tipologia, disciplina, complexidade, price_min, price_max, price_average) VALUES
('INDUSTRIAL', 'INSTALACOES_ELETRICAS', 'SIMPLES', 25.00, 40.00, 32.50),
('INDUSTRIAL', 'INSTALACOES_ELETRICAS', 'MEDIO', 40.00, 65.00, 52.50),
('INDUSTRIAL', 'INSTALACOES_ELETRICAS', 'COMPLEXO', 65.00, 100.00, 82.50),
('INDUSTRIAL', 'INSTALACOES_HIDRAULICAS', 'SIMPLES', 20.00, 35.00, 27.50),
('INDUSTRIAL', 'INSTALACOES_HIDRAULICAS', 'MEDIO', 35.00, 50.00, 42.50),
('INDUSTRIAL', 'INSTALACOES_HIDRAULICAS', 'COMPLEXO', 50.00, 75.00, 62.50);

-- INSTITUCIONAL - ARQUITETURA
INSERT INTO pricing_base (tipologia, disciplina, complexidade, price_min, price_max, price_average) VALUES
('INSTITUCIONAL', 'ARQUITETURA', 'SIMPLES', 100.00, 180.00, 140.00),
('INSTITUCIONAL', 'ARQUITETURA', 'MEDIO', 180.00, 280.00, 230.00),
('INSTITUCIONAL', 'ARQUITETURA', 'COMPLEXO', 280.00, 400.00, 340.00);

-- INSTITUCIONAL - ESTRUTURAL
INSERT INTO pricing_base (tipologia, disciplina, complexidade, price_min, price_max, price_average) VALUES
('INSTITUCIONAL', 'ESTRUTURAL', 'SIMPLES', 60.00, 90.00, 75.00),
('INSTITUCIONAL', 'ESTRUTURAL', 'MEDIO', 90.00, 130.00, 110.00),
('INSTITUCIONAL', 'ESTRUTURAL', 'COMPLEXO', 130.00, 180.00, 155.00);

-- INSTITUCIONAL - INSTALAÇÕES
INSERT INTO pricing_base (tipologia, disciplina, complexidade, price_min, price_max, price_average) VALUES
('INSTITUCIONAL', 'INSTALACOES_ELETRICAS', 'SIMPLES', 30.00, 50.00, 40.00),
('INSTITUCIONAL', 'INSTALACOES_ELETRICAS', 'MEDIO', 50.00, 75.00, 62.50),
('INSTITUCIONAL', 'INSTALACOES_ELETRICAS', 'COMPLEXO', 75.00, 110.00, 92.50),
('INSTITUCIONAL', 'INSTALACOES_HIDRAULICAS', 'SIMPLES', 25.00, 40.00, 32.50),
('INSTITUCIONAL', 'INSTALACOES_HIDRAULICAS', 'MEDIO', 40.00, 60.00, 50.00),
('INSTITUCIONAL', 'INSTALACOES_HIDRAULICAS', 'COMPLEXO', 60.00, 85.00, 72.50);

-- URBANÍSTICO - PAISAGISMO
INSERT INTO pricing_base (tipologia, disciplina, complexidade, price_min, price_max, price_average) VALUES
('URBANISTICO', 'PAISAGISMO', 'SIMPLES', 15.00, 30.00, 22.50),
('URBANISTICO', 'PAISAGISMO', 'MEDIO', 30.00, 50.00, 40.00),
('URBANISTICO', 'PAISAGISMO', 'COMPLEXO', 50.00, 80.00, 65.00);

-- URBANÍSTICO - ARQUITETURA
INSERT INTO pricing_base (tipologia, disciplina, complexidade, price_min, price_max, price_average) VALUES
('URBANISTICO', 'ARQUITETURA', 'SIMPLES', 25.00, 45.00, 35.00),
('URBANISTICO', 'ARQUITETURA', 'MEDIO', 45.00, 75.00, 60.00),
('URBANISTICO', 'ARQUITETURA', 'COMPLEXO', 75.00, 120.00, 97.50);

-- ===== FATORES DE COMPLEXIDADE =====
INSERT INTO complexity_factors (name, factor_type, value, description, applies_to) VALUES
('Piscina', 'PERCENTAGE', 0.1000, 'Projeto com piscina aumenta 10%', ARRAY['RESIDENCIAL']),
('Elevador', 'PERCENTAGE', 0.1500, 'Projeto com elevador aumenta 15%', ARRAY['RESIDENCIAL', 'COMERCIAL']),
('Automação Residencial', 'PERCENTAGE', 0.2000, 'Casa inteligente aumenta 20%', ARRAY['RESIDENCIAL']),
('Estrutura Especial', 'PERCENTAGE', 0.2500, 'Estrutura complexa aumenta 25%', ARRAY['RESIDENCIAL', 'COMERCIAL', 'INDUSTRIAL']),
('Terreno Irregular', 'PERCENTAGE', 0.1500, 'Terreno com desnível aumenta 15%', ARRAY['RESIDENCIAL']),
('Certificação Sustentável', 'PERCENTAGE', 0.3000, 'Certificação LEED/AQUA aumenta 30%', ARRAY['RESIDENCIAL', 'COMERCIAL', 'INSTITUCIONAL']),
('Projeto Padronizado', 'PERCENTAGE', -0.1000, 'Projeto repetitivo reduz 10%', ARRAY['RESIDENCIAL', 'COMERCIAL']),
('Terreno Plano', 'PERCENTAGE', -0.0500, 'Terreno sem desnível reduz 5%', ARRAY['RESIDENCIAL']),
('Ponte Rolante', 'PERCENTAGE', 0.2000, 'Galpão com ponte rolante aumenta 20%', ARRAY['INDUSTRIAL']),
('Sala Limpa', 'PERCENTAGE', 0.4000, 'Ambiente controlado aumenta 40%', ARRAY['INDUSTRIAL', 'INSTITUCIONAL']),
('Normas Especiais', 'PERCENTAGE', 0.2500, 'Normas específicas (hospitalar, etc) aumenta 25%', ARRAY['INSTITUCIONAL']),
('Acessibilidade Completa', 'PERCENTAGE', 0.1000, 'NBR 9050 completa aumenta 10%', ARRAY['RESIDENCIAL', 'COMERCIAL', 'INSTITUCIONAL']);

-- ===== COMENTÁRIOS E DOCUMENTAÇÃO =====
COMMENT ON TABLE pricing_base IS 'Tabela de preços base por tipologia, disciplina e complexidade - valores em R$/m²';
COMMENT ON TABLE complexity_factors IS 'Fatores que modificam o preço base conforme características especiais do projeto';

COMMENT ON COLUMN pricing_base.tipologia IS 'Tipo de projeto: RESIDENCIAL, COMERCIAL, INDUSTRIAL, INSTITUCIONAL, URBANISTICO';
COMMENT ON COLUMN pricing_base.disciplina IS 'Disciplina: ARQUITETURA, ESTRUTURAL, INSTALACOES_ELETRICAS, INSTALACOES_HIDRAULICAS, PAISAGISMO';
COMMENT ON COLUMN pricing_base.complexidade IS 'Nível de complexidade: SIMPLES, MEDIO, COMPLEXO';
COMMENT ON COLUMN pricing_base.price_min IS 'Preço mínimo em R$/m²';
COMMENT ON COLUMN pricing_base.price_max IS 'Preço máximo em R$/m²';
COMMENT ON COLUMN pricing_base.price_average IS 'Preço médio em R$/m²';

COMMENT ON COLUMN complexity_factors.factor_type IS 'Tipo do fator: MULTIPLIER (ex: 1.2) ou PERCENTAGE (ex: 0.2 = +20%)';
COMMENT ON COLUMN complexity_factors.value IS 'Valor do fator - para PERCENTAGE: 0.1 = +10%, -0.1 = -10%';
COMMENT ON COLUMN complexity_factors.applies_to IS 'Array de tipologias onde o fator se aplica';

-- ===== VERIFICAÇÕES FINAIS =====
-- Verificar se os dados foram inseridos corretamente
DO $$
DECLARE
    total_pricing_records INTEGER;
    total_complexity_records INTEGER;
BEGIN
    SELECT COUNT(*) INTO total_pricing_records FROM pricing_base;
    SELECT COUNT(*) INTO total_complexity_records FROM complexity_factors;
    
    RAISE NOTICE 'Migration concluída com sucesso!';
    RAISE NOTICE 'Registros de preços inseridos: %', total_pricing_records;
    RAISE NOTICE 'Fatores de complexidade inseridos: %', total_complexity_records;
    
    IF total_pricing_records < 30 THEN
        RAISE WARNING 'Poucos registros de preços inseridos. Verificar dados.';
    END IF;
    
    IF total_complexity_records < 10 THEN
        RAISE WARNING 'Poucos fatores de complexidade inseridos. Verificar dados.';
    END IF;
END $$;