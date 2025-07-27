/**
 * ✅ MIDDLEWARE DE VALIDAÇÃO
 * 
 * Sistema de validação robusto para todas as APIs do ArcFlow
 * Inclui validações específicas para orçamentos e briefings
 */

const { AppError } = require('./errorHandler');

/**
 * 🔍 Validador principal de requisições
 */
const validateRequest = (schema) => {
  return (req, res, next) => {
    try {
      const errors = [];

      // Validar parâmetros da URL
      if (schema.params) {
        const paramErrors = validateObject(req.params, schema.params, 'params');
        errors.push(...paramErrors);
      }

      // Validar query parameters
      if (schema.query) {
        const queryErrors = validateObject(req.query, schema.query, 'query');
        errors.push(...queryErrors);
      }

      // Validar body
      if (schema.body) {
        const bodyErrors = validateObject(req.body, schema.body, 'body');
        errors.push(...bodyErrors);
      }

      // Se há erros, retornar erro de validação
      if (errors.length > 0) {
        throw new AppError(
          'Dados de entrada inválidos',
          400,
          'VALIDATION_ERROR',
          { errors }
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * 📋 Validar objeto contra schema
 */
function validateObject(obj, schema, context) {
  const errors = [];

  // Verificar campos obrigatórios
  for (const [field, rules] of Object.entries(schema)) {
    const value = obj[field];

    // Campo obrigatório
    if (rules.required && (value === undefined || value === null || value === '')) {
      errors.push({
        field,
        context,
        message: `Campo '${field}' é obrigatório`,
        code: 'REQUIRED_FIELD'
      });
      continue;
    }

    // Se campo não é obrigatório e está vazio, aplicar valor padrão
    if (!rules.required && (value === undefined || value === null)) {
      if (rules.default !== undefined) {
        obj[field] = rules.default;
      }
      continue;
    }

    // Validar tipo
    if (value !== undefined && value !== null) {
      const typeError = validateType(value, rules.type, field, context);
      if (typeError) {
        errors.push(typeError);
        continue;
      }

      // Validações específicas por tipo
      const specificErrors = validateSpecificRules(value, rules, field, context);
      errors.push(...specificErrors);
    }
  }

  return errors;
}

/**
 * 🔢 Validar tipo de dados
 */
function validateType(value, expectedType, field, context) {
  let actualType = typeof value;
  
  // Tratamento especial para arrays
  if (Array.isArray(value)) {
    actualType = 'array';
  }

  // Tratamento especial para números
  if (expectedType === 'number') {
    const numValue = Number(value);
    if (isNaN(numValue)) {
      return {
        field,
        context,
        message: `Campo '${field}' deve ser um número`,
        code: 'INVALID_TYPE',
        expected: 'number',
        received: actualType
      };
    }
    // Converter para número se válido
    return null;
  }

  if (actualType !== expectedType) {
    return {
      field,
      context,
      message: `Campo '${field}' deve ser do tipo ${expectedType}`,
      code: 'INVALID_TYPE',
      expected: expectedType,
      received: actualType
    };
  }

  return null;
}

/**
 * 📏 Validar regras específicas
 */
function validateSpecificRules(value, rules, field, context) {
  const errors = [];

  // Validar string
  if (typeof value === 'string') {
    // Comprimento mínimo
    if (rules.minLength && value.length < rules.minLength) {
      errors.push({
        field,
        context,
        message: `Campo '${field}' deve ter pelo menos ${rules.minLength} caracteres`,
        code: 'MIN_LENGTH',
        minLength: rules.minLength,
        actualLength: value.length
      });
    }

    // Comprimento máximo
    if (rules.maxLength && value.length > rules.maxLength) {
      errors.push({
        field,
        context,
        message: `Campo '${field}' deve ter no máximo ${rules.maxLength} caracteres`,
        code: 'MAX_LENGTH',
        maxLength: rules.maxLength,
        actualLength: value.length
      });
    }

    // Formato específico
    if (rules.format) {
      const formatError = validateFormat(value, rules.format, field, context);
      if (formatError) {
        errors.push(formatError);
      }
    }

    // Enum (valores permitidos)
    if (rules.enum && !rules.enum.includes(value)) {
      errors.push({
        field,
        context,
        message: `Campo '${field}' deve ser um dos valores: ${rules.enum.join(', ')}`,
        code: 'INVALID_ENUM',
        allowedValues: rules.enum,
        receivedValue: value
      });
    }
  }

  // Validar número
  if (typeof value === 'number' || !isNaN(Number(value))) {
    const numValue = Number(value);

    // Valor mínimo
    if (rules.min !== undefined && numValue < rules.min) {
      errors.push({
        field,
        context,
        message: `Campo '${field}' deve ser maior ou igual a ${rules.min}`,
        code: 'MIN_VALUE',
        minValue: rules.min,
        actualValue: numValue
      });
    }

    // Valor máximo
    if (rules.max !== undefined && numValue > rules.max) {
      errors.push({
        field,
        context,
        message: `Campo '${field}' deve ser menor ou igual a ${rules.max}`,
        code: 'MAX_VALUE',
        maxValue: rules.max,
        actualValue: numValue
      });
    }
  }

  // Validar array
  if (Array.isArray(value)) {
    // Comprimento mínimo do array
    if (rules.minItems && value.length < rules.minItems) {
      errors.push({
        field,
        context,
        message: `Campo '${field}' deve ter pelo menos ${rules.minItems} itens`,
        code: 'MIN_ITEMS',
        minItems: rules.minItems,
        actualItems: value.length
      });
    }

    // Comprimento máximo do array
    if (rules.maxItems && value.length > rules.maxItems) {
      errors.push({
        field,
        context,
        message: `Campo '${field}' deve ter no máximo ${rules.maxItems} itens`,
        code: 'MAX_ITEMS',
        maxItems: rules.maxItems,
        actualItems: value.length
      });
    }
  }

  return errors;
}

/**
 * 🎯 Validar formatos específicos
 */
function validateFormat(value, format, field, context) {
  const formats = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    uuid: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    phone: /^\(\d{2}\)\s\d{4,5}-\d{4}$/,
    cpf: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
    cnpj: /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/,
    cep: /^\d{5}-\d{3}$/,
    url: /^https?:\/\/.+/,
    date: /^\d{4}-\d{2}-\d{2}$/,
    datetime: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/,
    currency: /^\d+(\.\d{2})?$/
  };

  const regex = formats[format];
  if (!regex) {
    return {
      field,
      context,
      message: `Formato '${format}' não reconhecido para campo '${field}'`,
      code: 'UNKNOWN_FORMAT'
    };
  }

  if (!regex.test(value)) {
    const formatMessages = {
      email: 'deve ser um email válido',
      uuid: 'deve ser um UUID válido',
      phone: 'deve estar no formato (XX) XXXXX-XXXX',
      cpf: 'deve estar no formato XXX.XXX.XXX-XX',
      cnpj: 'deve estar no formato XX.XXX.XXX/XXXX-XX',
      cep: 'deve estar no formato XXXXX-XXX',
      url: 'deve ser uma URL válida',
      date: 'deve estar no formato YYYY-MM-DD',
      datetime: 'deve ser uma data/hora válida',
      currency: 'deve ser um valor monetário válido'
    };

    return {
      field,
      context,
      message: `Campo '${field}' ${formatMessages[format] || 'tem formato inválido'}`,
      code: 'INVALID_FORMAT',
      format,
      value
    };
  }

  return null;
}

// ========================================
// VALIDADORES ESPECÍFICOS PARA ORÇAMENTOS
// ========================================

/**
 * 💰 Schema de validação para geração de orçamento
 */
const schemaGerarOrcamento = {
  body: {
    briefingId: {
      type: 'string',
      required: true,
      format: 'uuid'
    }
  }
};

/**
 * 📊 Schema de validação para listagem de orçamentos
 */
const schemaListarOrcamentos = {
  query: {
    page: {
      type: 'number',
      min: 1,
      default: 1
    },
    limit: {
      type: 'number',
      min: 1,
      max: 100,
      default: 10
    },
    status: {
      type: 'string',
      enum: ['RASCUNHO', 'PENDENTE', 'APROVADO', 'REJEITADO', 'CANCELADO']
    },
    tipologia: {
      type: 'string',
      enum: ['RESIDENCIAL', 'COMERCIAL', 'INDUSTRIAL', 'INSTITUCIONAL']
    },
    ordenacao: {
      type: 'string',
      enum: ['created_at', 'updated_at', 'valor_total', 'nome'],
      default: 'created_at'
    },
    direcao: {
      type: 'string',
      enum: ['ASC', 'DESC'],
      default: 'DESC'
    }
  }
};

/**
 * 🔄 Schema de validação para atualização de status
 */
const schemaAtualizarStatus = {
  params: {
    id: {
      type: 'string',
      required: true,
      format: 'uuid'
    }
  },
  body: {
    status: {
      type: 'string',
      required: true,
      enum: ['RASCUNHO', 'PENDENTE', 'APROVADO', 'REJEITADO', 'CANCELADO']
    },
    observacoes: {
      type: 'string',
      maxLength: 1000
    }
  }
};

/**
 * 🔍 Schema de validação para buscar orçamento
 */
const schemaBuscarOrcamento = {
  params: {
    id: {
      type: 'string',
      required: true,
      format: 'uuid'
    }
  }
};

// ========================================
// VALIDADORES ESPECÍFICOS PARA BRIEFINGS
// ========================================

/**
 * 📝 Schema de validação para criação de briefing
 */
const schemaCriarBriefing = {
  body: {
    nome_projeto: {
      type: 'string',
      required: true,
      minLength: 3,
      maxLength: 200
    },
    cliente_id: {
      type: 'string',
      required: true,
      format: 'uuid'
    },
    tipologia: {
      type: 'string',
      required: true,
      enum: ['RESIDENCIAL', 'COMERCIAL', 'INDUSTRIAL', 'INSTITUCIONAL']
    },
    disciplina: {
      type: 'string',
      required: true,
      enum: ['ARQUITETURA', 'ESTRUTURAL', 'INSTALACOES_ELETRICAS', 'INSTALACOES_HIDRAULICAS', 'AVAC', 'PAISAGISMO']
    },
    descricao: {
      type: 'string',
      maxLength: 2000
    },
    objetivos: {
      type: 'string',
      maxLength: 1000
    },
    orcamento: {
      type: 'string',
      maxLength: 100
    }
  }
};

// ========================================
// VALIDADORES ESPECÍFICOS PARA CLIENTES
// ========================================

/**
 * 👤 Schema de validação para criação de cliente
 */
const schemaCriarCliente = {
  body: {
    nome: {
      type: 'string',
      required: true,
      minLength: 2,
      maxLength: 200
    },
    email: {
      type: 'string',
      required: true,
      format: 'email'
    },
    telefone: {
      type: 'string',
      format: 'phone'
    },
    tipo: {
      type: 'string',
      required: true,
      enum: ['PESSOA_FISICA', 'PESSOA_JURIDICA']
    },
    cpf: {
      type: 'string',
      format: 'cpf'
    },
    cnpj: {
      type: 'string',
      format: 'cnpj'
    },
    endereco: {
      type: 'string',
      maxLength: 500
    },
    cep: {
      type: 'string',
      format: 'cep'
    },
    cidade: {
      type: 'string',
      maxLength: 100
    },
    estado: {
      type: 'string',
      maxLength: 2
    }
  }
};

// ========================================
// MIDDLEWARE DE VALIDAÇÃO CUSTOMIZADA
// ========================================

/**
 * 🔐 Validar se usuário pertence ao escritório
 */
const validateEscritorio = (req, res, next) => {
  if (!req.user || !req.user.escritorioId) {
    return next(new AppError(
      'Usuário deve estar associado a um escritório',
      403,
      'NO_ESCRITORIO'
    ));
  }
  next();
};

/**
 * 👑 Validar se usuário é admin
 */
const validateAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'ADMIN') {
    return next(new AppError(
      'Acesso restrito a administradores',
      403,
      'ADMIN_REQUIRED'
    ));
  }
  next();
};

/**
 * 📊 Validar parâmetros de paginação
 */
const validatePagination = (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;
  
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  
  if (isNaN(pageNum) || pageNum < 1) {
    return next(new AppError(
      'Página deve ser um número maior que 0',
      400,
      'INVALID_PAGE'
    ));
  }
  
  if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
    return next(new AppError(
      'Limit deve ser um número entre 1 e 100',
      400,
      'INVALID_LIMIT'
    ));
  }
  
  req.query.page = pageNum;
  req.query.limit = limitNum;
  
  next();
};

/**
 * 🎯 Validar UUID
 */
const validateUUID = (paramName) => {
  return (req, res, next) => {
    const value = req.params[paramName];
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    
    if (!value || !uuidRegex.test(value)) {
      return next(new AppError(
        `Parâmetro '${paramName}' deve ser um UUID válido`,
        400,
        'INVALID_UUID'
      ));
    }
    
    next();
  };
};

module.exports = {
  validateRequest,
  validateEscritorio,
  validateAdmin,
  validatePagination,
  validateUUID,
  
  // Schemas específicos
  schemaGerarOrcamento,
  schemaListarOrcamentos,
  schemaAtualizarStatus,
  schemaBuscarOrcamento,
  schemaCriarBriefing,
  schemaCriarCliente
};