-- ===== MIGRAÇÃO: INTEGRAÇÃO BRIEFING-ORÇAMENTO =====
-- Data: 17/07/2025
-- Descrição: Adiciona estrutura para integração automática entre briefings e orçamentos

-- 1. EXTENSÕES DA TABELA BRIEFINGS
-- Adicionar colunas para rastreamento de orçamento
ALTER TABLE briefings 
ADD COLUMN IF NOT EXISTS orcamento_gerado BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS orcamento_id UUID,
ADD COLUMN IF NOT EXISTS dados_extraidos JSONB,
ADD COLUMN IF NOT EXISTS ultima_analise TIMESTAMP,
ADD COLUMN IF NOT EXISTS complexidade_calculada VARCHAR(20),
ADD COLUMN IF NOT EXISTS disciplinas_identificadas TEXT[];

-- 2. TABELA DE ORÇAMENTOS (se não existir)
CREATE TABLE IF NOT EXISTS orcamentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo VARCHAR(50) UNIQUE NOT NULL,
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  status VARCHAR(50) DEFAULT 'RASCUNHO',
  
  -- Dados técnicos extraídos do briefing
  area_construida DECIMAL(10,2),
  area_terreno DECIMAL(10,2),
  tipologia VARCHAR(100),
  padrao VARCHAR(100),
  complexidade VARCHAR(100),
  localizacao VARCHAR(255),
  
  -- Valores calculados
  valor_total DECIMAL(15,2),
  valor_por_m2 DECIMAL(10,2),
  
  -- Estruturas JSON para dados complexos
  disciplinas JSONB,
  composicao_financeira JSONB,
  cronograma JSONB,
  proposta JSONB,
  dados_tecnicos JSONB,
  
  -- Relacionamentos
  briefing_id UUID,
  cliente_id UUID,
  escritorio_id UUID NOT NULL,
  responsavel_id UUID,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  
  -- Constraints
  CONSTRAINT fk_orcamentos_briefing FOREIGN KEY (briefing_id) REFERENCES briefings(id) ON DELETE SET NULL,
  CONSTRAINT fk_orcamentos_escritorio FOREIGN KEY (escritorio_id) REFERENCES escritorios(id) ON DELETE CASCADE
);

-- 3. TABELA DE CONFIGURAÇÕES DE ORÇAMENTO POR ESCRITÓRIO
CREATE TABLE IF NOT EXISTS configuracoes_orcamento (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  escritorio_id UUID NOT NULL,
  
  -- Tabela de preços por disciplina
  tabela_precos JSONB NOT NULL DEFAULT '{
    "arquitetura": {
      "valor_hora_senior": 180,
      "valor_hora_pleno": 120,
      "valor_hora_junior": 80,
      "valor_hora_estagiario": 40
    },
    "estrutural": {
      "valor_hora_senior": 200,
      "valor_hora_pleno": 140,
      "valor_hora_junior": 90,
      "valor_hora_estagiario": 45
    },
    "instalacoes": {
      "valor_hora_senior": 160,
      "valor_hora_pleno": 110,
      "valor_hora_junior": 70,
      "valor_hora_estagiario": 35
    },
    "paisagismo": {
      "valor_hora_senior": 150,
      "valor_hora_pleno": 100,
      "valor_hora_junior": 65,
      "valor_hora_estagiario": 30
    }
  }',
  
  -- Multiplicadores por tipologia
  multiplicadores_tipologia JSONB NOT NULL DEFAULT '{
    "residencial": {
      "unifamiliar": 1.0,
      "multifamiliar": 1.2,
      "condominio": 1.3
    },
    "comercial": {
      "escritorio": 1.1,
      "loja": 1.0,
      "shopping": 1.5,
      "hotel": 1.4
    },
    "industrial": {
      "fabrica": 1.3,
      "galpao": 1.1,
      "centro_logistico": 1.2
    },
    "institucional": {
      "escola": 1.2,
      "hospital": 1.6,
      "templo": 1.1
    }
  }',
  
  -- Parâmetros de complexidade
  parametros_complexidade JSONB NOT NULL DEFAULT '{
    "baixa": {
      "multiplicador": 0.8,
      "horas_base_m2": 0.5
    },
    "media": {
      "multiplicador": 1.0,
      "horas_base_m2": 0.8
    },
    "alta": {
      "multiplicador": 1.3,
      "horas_base_m2": 1.2
    },
    "muito_alta": {
      "multiplicador": 1.6,
      "horas_base_m2": 1.8
    }
  }',
  
  -- Configurações gerais
  configuracoes_gerais JSONB DEFAULT '{
    "margem_lucro": 0.25,
    "impostos": 0.15,
    "custos_indiretos": 0.10,
    "contingencia": 0.05
  }',
  
  -- Status e controle
  ativo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT fk_config_orcamento_escritorio FOREIGN KEY (escritorio_id) REFERENCES escritorios(id) ON DELETE CASCADE,
  CONSTRAINT unique_config_por_escritorio UNIQUE (escritorio_id)
);

-- 4. TABELA DE HISTÓRICO DE ORÇAMENTOS
CREATE TABLE IF NOT EXISTS historico_orcamentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  orcamento_id UUID NOT NULL,
  briefing_id UUID NOT NULL,
  versao INTEGER NOT NULL,
  
  -- Dados da versão
  dados_versao JSONB NOT NULL,
  valores_anteriores JSONB,
  alteracoes JSONB,
  
  -- Motivo e contexto
  motivo_alteracao TEXT,
  tipo_alteracao VARCHAR(50), -- 'regeneracao', 'ajuste_manual', 'mudanca_briefing'
  
  -- Auditoria
  created_at TIMESTAMP DEFAULT NOW(),
  created_by UUID,
  
  -- Constraints
  CONSTRAINT fk_historico_orcamento FOREIGN KEY (orcamento_id) REFERENCES orcamentos(id) ON DELETE CASCADE,
  CONSTRAINT fk_historico_briefing FOREIGN KEY (briefing_id) REFERENCES briefings(id) ON DELETE CASCADE
);

-- 5. TABELA DE TEMPLATES DE ORÇAMENTO
CREATE TABLE IF NOT EXISTS templates_orcamento (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome VARCHAR(255) NOT NULL,
  descricao TEXT,
  tipologia VARCHAR(100),
  padrao VARCHAR(100),
  
  -- Estrutura do template
  estrutura_template JSONB NOT NULL,
  parametros_calculo JSONB,
  
  -- Configurações
  escritorio_id UUID,
  is_publico BOOLEAN DEFAULT FALSE,
  is_ativo BOOLEAN DEFAULT TRUE,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT fk_template_orcamento_escritorio FOREIGN KEY (escritorio_id) REFERENCES escritorios(id) ON DELETE CASCADE
);

-- 6. TABELA DE LOGS DE PROCESSAMENTO
CREATE TABLE IF NOT EXISTS logs_processamento_orcamento (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  briefing_id UUID NOT NULL,
  orcamento_id UUID,
  
  -- Dados do processamento
  tipo_processamento VARCHAR(50), -- 'geracao', 'regeneracao', 'analise'
  status VARCHAR(50), -- 'iniciado', 'processando', 'concluido', 'erro'
  
  -- Dados técnicos
  dados_entrada JSONB,
  dados_saida JSONB,
  tempo_processamento INTEGER, -- em milissegundos
  
  -- Erros e debugging
  erro_detalhes TEXT,
  stack_trace TEXT,
  
  -- Timestamps
  iniciado_em TIMESTAMP DEFAULT NOW(),
  concluido_em TIMESTAMP,
  
  -- Constraints
  CONSTRAINT fk_log_briefing FOREIGN KEY (briefing_id) REFERENCES briefings(id) ON DELETE CASCADE,
  CONSTRAINT fk_log_orcamento FOREIGN KEY (orcamento_id) REFERENCES orcamentos(id) ON DELETE SET NULL
);

-- 7. ÍNDICES PARA PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_briefings_orcamento_status ON briefings(orcamento_gerado, status);
CREATE INDEX IF NOT EXISTS idx_briefings_ultima_analise ON briefings(ultima_analise);
CREATE INDEX IF NOT EXISTS idx_briefings_complexidade ON briefings(complexidade_calculada);

CREATE INDEX IF NOT EXISTS idx_orcamentos_briefing_id ON orcamentos(briefing_id);
CREATE INDEX IF NOT EXISTS idx_orcamentos_escritorio_status ON orcamentos(escritorio_id, status);
CREATE INDEX IF NOT EXISTS idx_orcamentos_tipologia ON orcamentos(tipologia, padrao);
CREATE INDEX IF NOT EXISTS idx_orcamentos_created_at ON orcamentos(created_at);

CREATE INDEX IF NOT EXISTS idx_config_orcamento_escritorio ON configuracoes_orcamento(escritorio_id, ativo);

CREATE INDEX IF NOT EXISTS idx_historico_orcamento_id ON historico_orcamentos(orcamento_id);
CREATE INDEX IF NOT EXISTS idx_historico_briefing_id ON historico_orcamentos(briefing_id);
CREATE INDEX IF NOT EXISTS idx_historico_versao ON historico_orcamentos(orcamento_id, versao);

CREATE INDEX IF NOT EXISTS idx_templates_orcamento_tipologia ON templates_orcamento(tipologia, padrao);
CREATE INDEX IF NOT EXISTS idx_templates_orcamento_escritorio ON templates_orcamento(escritorio_id, is_ativo);

CREATE INDEX IF NOT EXISTS idx_logs_processamento_briefing ON logs_processamento_orcamento(briefing_id);
CREATE INDEX IF NOT EXISTS idx_logs_processamento_status ON logs_processamento_orcamento(status, iniciado_em);

-- 8. TRIGGERS PARA ATUALIZAÇÃO AUTOMÁTICA
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para orcamentos
DROP TRIGGER IF EXISTS update_orcamentos_updated_at ON orcamentos;
CREATE TRIGGER update_orcamentos_updated_at 
    BEFORE UPDATE ON orcamentos 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger para configurações
DROP TRIGGER IF EXISTS update_config_orcamento_updated_at ON configuracoes_orcamento;
CREATE TRIGGER update_config_orcamento_updated_at 
    BEFORE UPDATE ON configuracoes_orcamento 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger para templates
DROP TRIGGER IF EXISTS update_templates_orcamento_updated_at ON templates_orcamento;
CREATE TRIGGER update_templates_orcamento_updated_at 
    BEFORE UPDATE ON templates_orcamento 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 9. INSERIR CONFIGURAÇÕES PADRÃO PARA ESCRITÓRIOS EXISTENTES
INSERT INTO configuracoes_orcamento (escritorio_id)
SELECT id FROM escritorios 
WHERE id NOT IN (SELECT escritorio_id FROM configuracoes_orcamento WHERE escritorio_id IS NOT NULL)
ON CONFLICT (escritorio_id) DO NOTHING;

-- 10. COMENTÁRIOS PARA DOCUMENTAÇÃO
COMMENT ON TABLE orcamentos IS 'Tabela principal de orçamentos gerados automaticamente a partir de briefings';
COMMENT ON TABLE configuracoes_orcamento IS 'Configurações personalizadas de orçamento por escritório';
COMMENT ON TABLE historico_orcamentos IS 'Histórico de versões e alterações de orçamentos';
COMMENT ON TABLE templates_orcamento IS 'Templates reutilizáveis para geração de orçamentos';
COMMENT ON TABLE logs_processamento_orcamento IS 'Logs detalhados do processamento de orçamentos para debugging';

COMMENT ON COLUMN briefings.orcamento_gerado IS 'Indica se já foi gerado orçamento para este briefing';
COMMENT ON COLUMN briefings.dados_extraidos IS 'Dados técnicos extraídos automaticamente do briefing';
COMMENT ON COLUMN briefings.ultima_analise IS 'Timestamp da última análise automática do briefing';

-- Finalização
SELECT 'Migração de integração briefing-orçamento executada com sucesso!' as resultado;