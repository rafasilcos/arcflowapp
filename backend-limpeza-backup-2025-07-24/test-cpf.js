function validarCPF(cpf) {
  const cpfLimpo = cpf.replace(/\D/g, '');
  
  console.log('CPF original:', cpf);
  console.log('CPF limpo:', cpfLimpo);
  console.log('Tem 11 dígitos:', cpfLimpo.length === 11);
  
  if (cpfLimpo.length !== 11) return false;
  
  // Verificar se todos os dígitos são iguais
  const todosIguais = /^(\d)\1{10}$/.test(cpfLimpo);
  console.log('Todos dígitos iguais:', todosIguais);
  if (todosIguais) return false;
  
  // Calcular primeiro dígito verificador
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpfLimpo.charAt(i)) * (10 - i);
  }
  let resto = 11 - (soma % 11);
  if (resto === 10 || resto === 11) resto = 0;
  
  console.log('Primeiro dígito calculado:', resto, 'esperado:', cpfLimpo.charAt(9));
  if (resto !== parseInt(cpfLimpo.charAt(9))) return false;
  
  // Calcular segundo dígito verificador
  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpfLimpo.charAt(i)) * (11 - i);
  }
  resto = 11 - (soma % 11);
  if (resto === 10 || resto === 11) resto = 0;
  
  console.log('Segundo dígito calculado:', resto, 'esperado:', cpfLimpo.charAt(10));
  if (resto !== parseInt(cpfLimpo.charAt(10))) return false;
  
  return true;
}

// Testar o CPF usado
const cpfTeste = '069.633.278-92';
console.log('=== TESTE DO CPF ===');
const resultado = validarCPF(cpfTeste);
console.log('CPF válido:', resultado); 