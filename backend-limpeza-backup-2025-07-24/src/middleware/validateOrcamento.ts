import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

// 📋 Schema de validação para orçamento
const orcamentoSchema = Joi.object({
  nome: Joi.string().min(3).max(200).optional(),
  descricao: Joi.string().max(500).optional(),
  
  // Dados técnicos
  areaConstruida: Joi.number().positive().optional(),
  areaTerreno: Joi.number().positive().optional(),
  tipologia: Joi.string().valid('Residencial', 'Comercial', 'Industrial', 'Institucional', 'Urbanístico').optional(),
  padrao: Joi.string().valid('Simples', 'Médio', 'Alto', 'Luxo', 'Premium').optional(),
  complexidade: Joi.string().valid('Baixa', 'Média', 'Alta', 'Muito Alta').optional(),
  
  // Localização
  localizacao: Joi.object({
    cidade: Joi.string().optional(),
    estado: Joi.string().length(2).optional(),
    regiao: Joi.string().optional()
  }).optional(),
  
  // Disciplinas
  disciplinas: Joi.array().items(Joi.string()).optional(),
  
  // Valores
  valorTotal: Joi.number().positive().optional(),
  valorPorM2: Joi.number().positive().optional(),
  
  // Dados estruturados
  composicaoFinanceira: Joi.object().optional(),
  cronograma: Joi.object().optional(),
  proposta: Joi.object().optional(),
  
  // Status
  status: Joi.string().valid(
    'RASCUNHO', 
    'PENDENTE_ENVIO', 
    'ENVIADO', 
    'EM_ANALISE', 
    'APROVADO', 
    'REJEITADO', 
    'NEGOCIACAO', 
    'VENCIDO', 
    'CANCELADO'
  ).optional(),
  
  // Observações
  observacoes: Joi.string().max(1000).optional(),
  motivoRejeicao: Joi.string().max(500).optional(),
  motivoAlteracao: Joi.string().max(500).optional(),
  
  // Datas
  dataVencimento: Joi.date().optional(),
  validadeOferta: Joi.date().optional()
});

// 🔍 Middleware de validação
export const validateOrcamentoData = (req: Request, res: Response, next: NextFunction) => {
  const { error, value } = orcamentoSchema.validate(req.body, {
    abortEarly: false,
    allowUnknown: false,
    stripUnknown: true
  });

  if (error) {
    const errorMessages = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));

    return res.status(400).json({
      error: 'Dados inválidos',
      validation: errorMessages
    });
  }

  req.body = value;
  next();
};

// 📊 Validação específica para gerar orçamento
export const validateGerarOrcamento = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    observacoes: Joi.string().max(500).optional(),
    incluirDisciplinas: Joi.array().items(Joi.string()).optional(),
    ajustarValores: Joi.boolean().optional(),
    configuracaoPersonalizada: Joi.object({
      margemLucro: Joi.number().min(0).max(100).optional(),
      prazoEntrega: Joi.number().positive().optional(),
      formaPagamento: Joi.object({
        entrada: Joi.number().min(0).max(100).optional(),
        parcelas: Joi.number().min(1).max(12).optional()
      }).optional()
    }).optional()
  });

  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    allowUnknown: false,
    stripUnknown: true
  });

  if (error) {
    const errorMessages = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));

    return res.status(400).json({
      error: 'Dados inválidos para geração de orçamento',
      validation: errorMessages
    });
  }

  req.body = value;
  next();
};

// 📤 Validação para envio de orçamento
export const validateEnviarOrcamento = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    observacoes: Joi.string().max(1000).optional(),
    prazoResposta: Joi.number().min(1).max(365).default(30),
    emailPersonalizado: Joi.string().email().optional(),
    incluirAnexos: Joi.boolean().default(false),
    mensagemPersonalizada: Joi.string().max(2000).optional()
  });

  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    allowUnknown: false,
    stripUnknown: true
  });

  if (error) {
    const errorMessages = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));

    return res.status(400).json({
      error: 'Dados inválidos para envio de orçamento',
      validation: errorMessages
    });
  }

  req.body = value;
  next();
};

// ✅ Validação para aprovação/rejeição
export const validateAprovarRejeitar = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    observacoes: Joi.string().max(1000).optional(),
    motivoRejeicao: Joi.string().max(500).when('acao', {
      is: 'rejeitar',
      then: Joi.required(),
      otherwise: Joi.optional()
    }),
    acao: Joi.string().valid('aprovar', 'rejeitar').required(),
    criarProjeto: Joi.boolean().default(true).when('acao', {
      is: 'aprovar',
      then: Joi.optional(),
      otherwise: Joi.forbidden()
    })
  });

  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    allowUnknown: false,
    stripUnknown: true
  });

  if (error) {
    const errorMessages = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));

    return res.status(400).json({
      error: 'Dados inválidos para aprovação/rejeição',
      validation: errorMessages
    });
  }

  req.body = value;
  next();
}; 
import Joi from 'joi';

// 📋 Schema de validação para orçamento
const orcamentoSchema = Joi.object({
  nome: Joi.string().min(3).max(200).optional(),
  descricao: Joi.string().max(500).optional(),
  
  // Dados técnicos
  areaConstruida: Joi.number().positive().optional(),
  areaTerreno: Joi.number().positive().optional(),
  tipologia: Joi.string().valid('Residencial', 'Comercial', 'Industrial', 'Institucional', 'Urbanístico').optional(),
  padrao: Joi.string().valid('Simples', 'Médio', 'Alto', 'Luxo', 'Premium').optional(),
  complexidade: Joi.string().valid('Baixa', 'Média', 'Alta', 'Muito Alta').optional(),
  
  // Localização
  localizacao: Joi.object({
    cidade: Joi.string().optional(),
    estado: Joi.string().length(2).optional(),
    regiao: Joi.string().optional()
  }).optional(),
  
  // Disciplinas
  disciplinas: Joi.array().items(Joi.string()).optional(),
  
  // Valores
  valorTotal: Joi.number().positive().optional(),
  valorPorM2: Joi.number().positive().optional(),
  
  // Dados estruturados
  composicaoFinanceira: Joi.object().optional(),
  cronograma: Joi.object().optional(),
  proposta: Joi.object().optional(),
  
  // Status
  status: Joi.string().valid(
    'RASCUNHO', 
    'PENDENTE_ENVIO', 
    'ENVIADO', 
    'EM_ANALISE', 
    'APROVADO', 
    'REJEITADO', 
    'NEGOCIACAO', 
    'VENCIDO', 
    'CANCELADO'
  ).optional(),
  
  // Observações
  observacoes: Joi.string().max(1000).optional(),
  motivoRejeicao: Joi.string().max(500).optional(),
  motivoAlteracao: Joi.string().max(500).optional(),
  
  // Datas
  dataVencimento: Joi.date().optional(),
  validadeOferta: Joi.date().optional()
});

// 🔍 Middleware de validação
export const validateOrcamentoData = (req: Request, res: Response, next: NextFunction) => {
  const { error, value } = orcamentoSchema.validate(req.body, {
    abortEarly: false,
    allowUnknown: false,
    stripUnknown: true
  });

  if (error) {
    const errorMessages = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));

    return res.status(400).json({
      error: 'Dados inválidos',
      validation: errorMessages
    });
  }

  req.body = value;
  next();
};

// 📊 Validação específica para gerar orçamento
export const validateGerarOrcamento = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    observacoes: Joi.string().max(500).optional(),
    incluirDisciplinas: Joi.array().items(Joi.string()).optional(),
    ajustarValores: Joi.boolean().optional(),
    configuracaoPersonalizada: Joi.object({
      margemLucro: Joi.number().min(0).max(100).optional(),
      prazoEntrega: Joi.number().positive().optional(),
      formaPagamento: Joi.object({
        entrada: Joi.number().min(0).max(100).optional(),
        parcelas: Joi.number().min(1).max(12).optional()
      }).optional()
    }).optional()
  });

  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    allowUnknown: false,
    stripUnknown: true
  });

  if (error) {
    const errorMessages = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));

    return res.status(400).json({
      error: 'Dados inválidos para geração de orçamento',
      validation: errorMessages
    });
  }

  req.body = value;
  next();
};

// 📤 Validação para envio de orçamento
export const validateEnviarOrcamento = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    observacoes: Joi.string().max(1000).optional(),
    prazoResposta: Joi.number().min(1).max(365).default(30),
    emailPersonalizado: Joi.string().email().optional(),
    incluirAnexos: Joi.boolean().default(false),
    mensagemPersonalizada: Joi.string().max(2000).optional()
  });

  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    allowUnknown: false,
    stripUnknown: true
  });

  if (error) {
    const errorMessages = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));

    return res.status(400).json({
      error: 'Dados inválidos para envio de orçamento',
      validation: errorMessages
    });
  }

  req.body = value;
  next();
};

// ✅ Validação para aprovação/rejeição
export const validateAprovarRejeitar = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    observacoes: Joi.string().max(1000).optional(),
    motivoRejeicao: Joi.string().max(500).when('acao', {
      is: 'rejeitar',
      then: Joi.required(),
      otherwise: Joi.optional()
    }),
    acao: Joi.string().valid('aprovar', 'rejeitar').required(),
    criarProjeto: Joi.boolean().default(true).when('acao', {
      is: 'aprovar',
      then: Joi.optional(),
      otherwise: Joi.forbidden()
    })
  });

  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    allowUnknown: false,
    stripUnknown: true
  });

  if (error) {
    const errorMessages = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));

    return res.status(400).json({
      error: 'Dados inválidos para aprovação/rejeição',
      validation: errorMessages
    });
  }

  req.body = value;
  next();
}; 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 