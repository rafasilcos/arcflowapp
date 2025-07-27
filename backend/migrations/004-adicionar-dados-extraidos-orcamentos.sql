-- Migração para adicionar coluna dados_extraidos na tabela orcamentos
-- Esta coluna é necessária para armazenar os dados extraídos do briefing
-- que são usados para gerar o orçamento

-- Adicionar coluna dados_extraidos
ALTER TABLE orcamentos 
ADD COLUMN IF NOT EXISTS dados_extraidos JSONB;

-- Adicionar comentário para documentar a coluna
COMMENT ON COLUMN orcamentos.dados_extraidos IS 'Dados extraídos do briefing usados para gerar o orçamento (JSON)';

-- Criar índice para consultas nos dados extraídos
CREATE INDEX IF NOT EXISTS idx_orcamentos_dados_extraidos 
ON orcamentos USING GIN (dados_extraidos);

-- Verificar se a coluna foi criada
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'orcamentos' AND column_name = 'dados_extraidos';