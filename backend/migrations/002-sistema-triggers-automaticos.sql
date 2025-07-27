-- Migração para Sistema de Triggers Automáticos
-- Adiciona suporte para processamento assíncrono de orçamentos e notificações

-- 1. Extensões necessárias para UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Adicionar colunas na tabela briefings para rastreamento de orçamento
ALTER TABLE briefings 
ADD COLUMN IF NOT EXISTS orcamento_gerado BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS orcamento_id UUID REFERENCES orcamentos(id),
ADD COLUMN IF NOT EXISTS orcamento_em_processamento BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS dados_extraidos JSONB,
ADD COLUMN IF NOT EXISTS ultima_analise TIMESTAMP,
ADD COLUMN IF NOT EXISTS ultimo_erro_orcamento TEXT;

-- 3. Tabela para logs de triggers (auditoria)
CREATE TABLE IF NOT EXISTS trigger_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type VARCHAR(50) NOT NULL,
  briefing_id UUID REFERENCES briefings(id),
  orcamento_id UUID REFERENCES orcamentos(id),
  user_id UUID REFERENCES users(id),
  escritorio_id UUID REFERENCES escritorios(id),
  action VARCHAR(100) NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

-- 4. Tabela para notificações
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  data JSONB DEFAULT '{}',
  priority VARCHAR(20) DEFAULT 'normal',
  read BOOLEAN DEFAULT FALSE,
  sent BOOLEAN DEFAULT FALSE,
  processing BOOLEAN DEFAULT FALSE,
  scheduled_for TIMESTAMP,
  sent_at TIMESTAMP,
  error_message TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 5. Adicionar colunas na tabela orcamentos para rastreamento
ALTER TABLE orcamentos 
ADD COLUMN IF NOT EXISTS gerado_automaticamente BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS job_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS dados_calculo JSONB,
ADD COLUMN IF NOT EXISTS versao INTEGER DEFAULT 1;

-- 6. Índices para performance
CREATE INDEX IF NOT EXISTS idx_briefings_orcamento_status ON briefings(orcamento_gerado, status);
CREATE INDEX IF NOT EXISTS idx_briefings_orcamento_processamento ON briefings(orcamento_em_processamento);
CREATE INDEX IF NOT EXISTS idx_briefings_escritorio_status ON briefings(escritorio_id, status);
CREATE INDEX IF NOT EXISTS idx_orcamentos_briefing_id ON orcamentos(briefing_id);
CREATE INDEX IF NOT EXISTS idx_orcamentos_gerado_automaticamente ON orcamentos(gerado_automaticamente);
CREATE INDEX IF NOT EXISTS idx_trigger_logs_type_created ON trigger_logs(type, created_at);
CREATE INDEX IF NOT EXISTS idx_trigger_logs_briefing_id ON trigger_logs(briefing_id);
CREATE INDEX IF NOT EXISTS idx_trigger_logs_escritorio_id ON trigger_logs(escritorio_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_sent ON notifications(user_id, sent);
CREATE INDEX IF NOT EXISTS idx_notifications_scheduled ON notifications(scheduled_for) WHERE scheduled_for IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_notifications_processing ON notifications(processing) WHERE processing = true;

-- 7. Função para atualizar timestamp de última modificação
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 8. Triggers para atualizar updated_at automaticamente
CREATE TRIGGER update_briefings_updated_at 
    BEFORE UPDATE ON briefings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orcamentos_updated_at 
    BEFORE UPDATE ON orcamentos 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 9. Função para limpeza automática de logs antigos
CREATE OR REPLACE FUNCTION cleanup_old_logs()
RETURNS void AS $$
BEGIN
    -- Remove logs de trigger com mais de 90 dias
    DELETE FROM trigger_logs 
    WHERE created_at < NOW() - INTERVAL '90 days';
    
    -- Remove notificações lidas com mais de 30 dias
    DELETE FROM notifications 
    WHERE read = true AND created_at < NOW() - INTERVAL '30 days';
    
    -- Remove notificações não enviadas com mais de 7 dias (provavelmente com erro)
    DELETE FROM notifications 
    WHERE sent = false AND created_at < NOW() - INTERVAL '7 days';
    
    RAISE NOTICE 'Limpeza de logs antigos executada';
END;
$$ LANGUAGE plpgsql;

-- 10. Configurar limpeza automática (executar manualmente quando necessário)
-- SELECT cleanup_old_logs();

-- 11. Inserir configurações padrão se não existirem
INSERT INTO configuracoes_orcamento (escritorio_id, tabela_precos, multiplicadores_tipologia, parametros_complexidade)
SELECT 
    e.id,
    '{
        "valorHoraArquiteto": 150,
        "valorHoraEngenheiro": 140,
        "valorHoraDesigner": 80,
        "valorHoraTecnico": 60,
        "valorHoraEstagiario": 30
    }'::jsonb,
    '{
        "residencial": 1.0,
        "comercial": 1.2,
        "industrial": 1.5,
        "institucional": 1.3,
        "urbanistico": 1.8
    }'::jsonb,
    '{
        "baixa": 0.8,
        "media": 1.0,
        "alta": 1.3,
        "muito_alta": 1.6
    }'::jsonb
FROM escritorios e
WHERE NOT EXISTS (
    SELECT 1 FROM configuracoes_orcamento co 
    WHERE co.escritorio_id = e.id
);

-- 12. Comentários para documentação
COMMENT ON TABLE trigger_logs IS 'Log de eventos de triggers automáticos para auditoria';
COMMENT ON TABLE notifications IS 'Sistema de notificações para usuários';
COMMENT ON COLUMN briefings.orcamento_gerado IS 'Indica se o briefing já teve orçamento gerado';
COMMENT ON COLUMN briefings.orcamento_em_processamento IS 'Indica se o orçamento está sendo processado';
COMMENT ON COLUMN briefings.dados_extraidos IS 'Dados extraídos do briefing para orçamentação';
COMMENT ON COLUMN orcamentos.gerado_automaticamente IS 'Indica se o orçamento foi gerado automaticamente';
COMMENT ON COLUMN orcamentos.dados_calculo IS 'Dados utilizados no cálculo do orçamento';

-- 13. Tabela de Auditoria de Orçamentos
CREATE TABLE IF NOT EXISTS auditoria_orcamentos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entidade VARCHAR(50) NOT NULL,
  entidade_id UUID NOT NULL,
  acao VARCHAR(20) NOT NULL,
  dados_anteriores JSONB,
  dados_novos JSONB,
  user_id UUID REFERENCES users(id),
  escritorio_id UUID REFERENCES escritorios(id),
  metadata JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 14. Índices adicionais para auditoria
CREATE INDEX IF NOT EXISTS idx_auditoria_entidade_id ON auditoria_orcamentos(entidade, entidade_id);
CREATE INDEX IF NOT EXISTS idx_auditoria_user_created ON auditoria_orcamentos(user_id, created_at);
CREATE INDEX IF NOT EXISTS idx_auditoria_escritorio_created ON auditoria_orcamentos(escritorio_id, created_at);
CREATE INDEX IF NOT EXISTS idx_historico_orcamento_versao ON historico_orcamentos(orcamento_id, versao);

-- 15. Verificação final
DO $$
BEGIN
    -- Verifica se as tabelas foram criadas
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'trigger_logs') THEN
        RAISE EXCEPTION 'Tabela trigger_logs não foi criada';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'notifications') THEN
        RAISE EXCEPTION 'Tabela notifications não foi criada';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'auditoria_orcamentos') THEN
        RAISE EXCEPTION 'Tabela auditoria_orcamentos não foi criada';
    END IF;
    
    -- Verifica se as colunas foram adicionadas
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'briefings' AND column_name = 'orcamento_gerado') THEN
        RAISE EXCEPTION 'Coluna orcamento_gerado não foi adicionada à tabela briefings';
    END IF;
    
    RAISE NOTICE 'Migração 002-sistema-triggers-automaticos executada com sucesso!';
END
$$;