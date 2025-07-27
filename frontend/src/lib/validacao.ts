interface ValidacaoResult {
  valido: boolean;
  erros: Record<string, string>;
  avisos?: Record<string, string>;
}

interface DadosCliente {
  nome?: string;
  email?: string;
  telefone?: string;
  tipoPessoa?: 'fisica' | 'juridica';
  cpf?: string;
  cnpj?: string;
  endereco?: {
    cep?: string;
    logradouro?: string;
    numero?: string;
    bairro?: string;
    cidade?: string;
    uf?: string;
  };
  dataNascimento?: string;
  dataFundacao?: string;
}

export class ValidadorCliente {
  
  /**
   * Validação completa de cliente
   */
  static validarCliente(dados: DadosCliente): ValidacaoResult {
    const erros: Record<string, string> = {};
    const avisos: Record<string, string> = {};
    
    // Validações obrigatórias
    this.validarCamposObrigatorios(dados, erros);
    
    // Validações específicas
    this.validarEmail(dados.email, erros);
    this.validarTelefone(dados.telefone, erros);
    this.validarDocumentos(dados, erros);
    this.validarDatas(dados, erros, avisos);
    this.validarEndereco(dados.endereco, erros, avisos);
    
    return {
      valido: Object.keys(erros).length === 0,
      erros,
      avisos: Object.keys(avisos).length > 0 ? avisos : undefined
    };
  }
  
  /**
   * Validar campos obrigatórios
   */
  private static validarCamposObrigatorios(dados: DadosCliente, erros: Record<string, string>) {
    if (!dados.nome?.trim()) {
      erros.nome = 'Nome é obrigatório';
    } else if (dados.nome.trim().length < 2) {
      erros.nome = 'Nome deve ter pelo menos 2 caracteres';
    } else if (dados.nome.trim().length > 100) {
      erros.nome = 'Nome não pode ter mais de 100 caracteres';
    }
    
    if (!dados.email?.trim()) {
      erros.email = 'Email é obrigatório';
    }
    
    if (!dados.telefone?.trim()) {
      erros.telefone = 'Telefone é obrigatório';
    }
  }
  
  /**
   * Validar email
   */
  private static validarEmail(email: string | undefined, erros: Record<string, string>) {
    if (!email) return;
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      erros.email = 'Email inválido';
      return;
    }
    
    // Verificar domínios suspeitos
    const dominiosSuspeitos = ['tempmail', '10minutemail', 'guerrillamail', 'mailinator'];
    const dominio = email.split('@')[1]?.toLowerCase();
    if (dominiosSuspeitos.some(suspeito => dominio?.includes(suspeito))) {
      erros.email = 'Email temporário não é permitido';
    }
  }
  
  /**
   * Validar telefone brasileiro
   */
  private static validarTelefone(telefone: string | undefined, erros: Record<string, string>) {
    if (!telefone) return;
    
    const numeroLimpo = telefone.replace(/\D/g, '');
    
    // Verificar formato brasileiro
    if (numeroLimpo.length < 10 || numeroLimpo.length > 11) {
      erros.telefone = 'Telefone deve ter 10 ou 11 dígitos';
      return;
    }
    
    // Verificar se é celular (11 dígitos começando com 9)
    if (numeroLimpo.length === 11 && !numeroLimpo.startsWith('9', 2)) {
      erros.telefone = 'Celular deve começar com 9 após o DDD';
    }
    
    // Verificar DDD válido
    const ddd = numeroLimpo.substring(0, 2);
    const dddsValidos = ['11', '12', '13', '14', '15', '16', '17', '18', '19', 
                        '21', '22', '24', '27', '28', '31', '32', '33', '34', 
                        '35', '37', '38', '41', '42', '43', '44', '45', '46', 
                        '47', '48', '49', '51', '53', '54', '55', '61', '62', 
                        '63', '64', '65', '66', '67', '68', '69', '71', '73', 
                        '74', '75', '77', '79', '81', '82', '83', '84', '85', 
                        '86', '87', '88', '89', '91', '92', '93', '94', '95', 
                        '96', '97', '98', '99'];
                        
    if (!dddsValidos.includes(ddd)) {
      erros.telefone = 'DDD inválido';
    }
  }
  
  /**
   * Validar CPF/CNPJ
   */
  private static validarDocumentos(dados: DadosCliente, erros: Record<string, string>) {
    const { tipoPessoa, cpf, cnpj } = dados;
    
    if (tipoPessoa === 'fisica') {
      if (!cpf?.trim()) {
        erros.cpf = 'CPF é obrigatório para pessoa física';
      } else if (!this.validarCPF(cpf)) {
        erros.cpf = 'CPF inválido';
      }
      
      if (cnpj?.trim()) {
        erros.cnpj = 'CNPJ não deve ser preenchido para pessoa física';
      }
    } else if (tipoPessoa === 'juridica') {
      if (!cnpj?.trim()) {
        erros.cnpj = 'CNPJ é obrigatório para pessoa jurídica';
      } else if (!this.validarCNPJ(cnpj)) {
        erros.cnpj = 'CNPJ inválido';
      }
      
      if (cpf?.trim()) {
        erros.cpf = 'CPF não deve ser preenchido para pessoa jurídica';
      }
    }
  }
  
  /**
   * Validar datas
   */
  private static validarDatas(dados: DadosCliente, erros: Record<string, string>, avisos: Record<string, string>) {
    const { tipoPessoa, dataNascimento, dataFundacao } = dados;
    
    if (tipoPessoa === 'fisica' && dataNascimento) {
      const idade = this.calcularIdade(dataNascimento);
      if (idade < 0) {
        erros.dataNascimento = 'Data de nascimento não pode ser no futuro';
      } else if (idade > 120) {
        erros.dataNascimento = 'Data de nascimento muito antiga';
      } else if (idade < 18) {
        avisos.dataNascimento = 'Cliente menor de idade';
      }
    }
    
    if (tipoPessoa === 'juridica' && dataFundacao) {
      const anosEmpresa = this.calcularIdade(dataFundacao);
      if (anosEmpresa < 0) {
        erros.dataFundacao = 'Data de fundação não pode ser no futuro';
      } else if (anosEmpresa > 200) {
        erros.dataFundacao = 'Data de fundação muito antiga';
      }
    }
  }
  
  /**
   * Validar endereço
   */
  private static validarEndereco(endereco: DadosCliente['endereco'], erros: Record<string, string>, avisos: Record<string, string>) {
    if (!endereco) return;
    
    const { cep, logradouro, numero, bairro, cidade, uf } = endereco;
    
    if (cep && !this.validarCEP(cep)) {
      erros['endereco.cep'] = 'CEP inválido';
    }
    
    if (logradouro && logradouro.length > 100) {
      erros['endereco.logradouro'] = 'Logradouro muito longo (máximo 100 caracteres)';
    }
    
    if (numero && numero.length > 10) {
      erros['endereco.numero'] = 'Número muito longo (máximo 10 caracteres)';
    }
    
    if (bairro && bairro.length > 50) {
      erros['endereco.bairro'] = 'Bairro muito longo (máximo 50 caracteres)';
    }
    
    if (cidade && cidade.length > 50) {
      erros['endereco.cidade'] = 'Cidade muito longo (máximo 50 caracteres)';
    }
    
    if (uf && uf.length !== 2) {
      erros['endereco.uf'] = 'UF deve ter 2 caracteres';
    }
    
    // Avisos para campos incompletos
    if (cep && (!logradouro || !cidade || !uf)) {
      avisos['endereco.incompleto'] = 'Endereço incompleto - considere preencher todos os campos';
    }
  }
  
  /**
   * Validar CPF
   */
  private static validarCPF(cpf: string): boolean {
    const cpfLimpo = cpf.replace(/\D/g, '');
    
    if (cpfLimpo.length !== 11) return false;
    
    // Verificar se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cpfLimpo)) return false;
    
    // Calcular primeiro dígito verificador
    let soma = 0;
    for (let i = 0; i < 9; i++) {
      soma += parseInt(cpfLimpo.charAt(i)) * (10 - i);
    }
    let resto = 11 - (soma % 11);
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpfLimpo.charAt(9))) return false;
    
    // Calcular segundo dígito verificador
    soma = 0;
    for (let i = 0; i < 10; i++) {
      soma += parseInt(cpfLimpo.charAt(i)) * (11 - i);
    }
    resto = 11 - (soma % 11);
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpfLimpo.charAt(10))) return false;
    
    return true;
  }
  
  /**
   * Validar CNPJ
   */
  private static validarCNPJ(cnpj: string): boolean {
    const cnpjLimpo = cnpj.replace(/\D/g, '');
    
    if (cnpjLimpo.length !== 14) return false;
    
    // Verificar se todos os dígitos são iguais
    if (/^(\d)\1{13}$/.test(cnpjLimpo)) return false;
    
    // Calcular primeiro dígito verificador
    let soma = 0;
    let peso = 2;
    for (let i = 11; i >= 0; i--) {
      soma += parseInt(cnpjLimpo.charAt(i)) * peso;
      peso = peso === 9 ? 2 : peso + 1;
    }
    let resto = soma % 11;
    const digito1 = resto < 2 ? 0 : 11 - resto;
    if (digito1 !== parseInt(cnpjLimpo.charAt(12))) return false;
    
    // Calcular segundo dígito verificador
    soma = 0;
    peso = 2;
    for (let i = 12; i >= 0; i--) {
      soma += parseInt(cnpjLimpo.charAt(i)) * peso;
      peso = peso === 9 ? 2 : peso + 1;
    }
    resto = soma % 11;
    const digito2 = resto < 2 ? 0 : 11 - resto;
    if (digito2 !== parseInt(cnpjLimpo.charAt(13))) return false;
    
    return true;
  }
  
  /**
   * Validar CEP
   */
  private static validarCEP(cep: string): boolean {
    const cepLimpo = cep.replace(/\D/g, '');
    return cepLimpo.length === 8 && /^\d{8}$/.test(cepLimpo);
  }
  
  /**
   * Calcular idade
   */
  private static calcularIdade(data: string): number {
    let dataObj: Date;
    
    // Tentar diferentes formatos de data
    if (data.includes('/')) {
      const [dia, mes, ano] = data.split('/');
      dataObj = new Date(parseInt(ano), parseInt(mes) - 1, parseInt(dia));
    } else if (data.includes('-')) {
      dataObj = new Date(data);
    } else {
      return -1; // Formato inválido
    }
    
    const hoje = new Date();
    const idade = hoje.getFullYear() - dataObj.getFullYear();
    const mesAtual = hoje.getMonth();
    const diaAtual = hoje.getDate();
    
    if (mesAtual < dataObj.getMonth() || (mesAtual === dataObj.getMonth() && diaAtual < dataObj.getDate())) {
      return idade - 1;
    }
    
    return idade;
  }
  
  /**
   * Validação rápida apenas de campos obrigatórios
   */
  static validacaoRapida(dados: DadosCliente): { valido: boolean; erro?: string } {
    if (!dados.nome?.trim()) {
      return { valido: false, erro: 'Nome é obrigatório' };
    }
    
    if (!dados.email?.trim()) {
      return { valido: false, erro: 'Email é obrigatório' };
    }
    
    if (!dados.telefone?.trim()) {
      return { valido: false, erro: 'Telefone é obrigatório' };
    }
    
    return { valido: true };
  }
}

// Funções utilitárias para uso direto
export const validarCPF = (cpf: string) => ValidadorCliente['validarCPF'](cpf);
export const validarCNPJ = (cnpj: string) => ValidadorCliente['validarCNPJ'](cnpj);
export const validarCEP = (cep: string) => ValidadorCliente['validarCEP'](cep);

export default ValidadorCliente; 