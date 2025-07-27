# 📝 InputFormatado - Componente Reutilizável

## **🎯 SOLICITAÇÃO RAFAEL - CAMPOS FORMATADOS AUTOMÁTICOS**

**SEMPRE que houver campos de telefone, e-mail, datas, valores, CEP, CPF ou CNPJ, use este componente!**

## **📱 Tipos Suportados**

| Tipo | Formatação | Exemplo |
|------|------------|---------|
| `telefone` | `(xx) xxxxx-xxxx` | (11) 99999-9999 |
| `email` | Validação visual | usuario@email.com |
| `data` | `dd/mm/aaaa` | 25/12/2023 |
| `valor` | `R$ x.xxx,xx` | R$ 1.234,56 |
| `cep` | `xxxxx-xxx` | 12345-678 |
| `cpf` | `xxx.xxx.xxx-xx` | 123.456.789-01 |
| `cnpj` | `xx.xxx.xxx/xxxx-xx` | 12.345.678/0001-90 |
| `text` | Sem formatação | Texto comum |

## **🚀 Como Usar**

### **Exemplo Básico**
```tsx
import InputFormatado from '@/components/ui/InputFormatado'

// Telefone
<InputFormatado
  tipo="telefone"
  value={telefone}
  onChange={(valor) => setTelefone(valor)}
  label="Telefone"
  obrigatoria
/>

// Email
<InputFormatado
  tipo="email"
  value={email}
  onChange={(valor) => setEmail(valor)}
  label="E-mail"
/>

// Data
<InputFormatado
  tipo="data"
  value={data}
  onChange={(valor) => setData(valor)}
  label="Data de Nascimento"
/>

// Valor
<InputFormatado
  tipo="valor"
  value={preco}
  onChange={(valor) => setPreco(valor)}
  label="Preço"
/>
```

### **Props Disponíveis**
```tsx
interface InputFormatadoProps {
  tipo: 'telefone' | 'email' | 'data' | 'valor' | 'cep' | 'cpf' | 'cnpj' | 'text'
  value: string
  onChange: (value: string) => void
  placeholder?: string     // Placeholder personalizado
  label?: string          // Label acima do campo
  obrigatoria?: boolean   // Adiciona * no label
  className?: string      // Classes CSS extras
  temaId?: 'elegante' | 'dark'  // Tema visual
  disabled?: boolean      // Campo desabilitado
}
```

## **🎨 Recursos Visuais**

### **1. Ícones Automáticos**
- 📞 Telefone → Ícone de telefone
- 📧 E-mail → Ícone de envelope
- 📅 Data → Ícone de calendário
- 💰 Valor → Ícone de dólar
- 🏠 CEP → Ícone de localização

### **2. Validação Visual**
- ✅ **Verde**: Campo válido
- ❌ **Vermelho**: Campo com erro
- 💡 **Dicas**: Formato esperado quando vazio

### **3. Estados do Campo**
- **Normal**: Borda cinza
- **Válido**: Borda verde + ícone ✅
- **Erro**: Borda vermelha + ícone ⚠️
- **Foco**: Ring colorido + transição

## **🔧 Exemplos Práticos**

### **1. Cadastro de Cliente**
```tsx
// Telefone principal
<InputFormatado
  tipo="telefone"
  value={cliente.telefone}
  onChange={(valor) => setCliente({...cliente, telefone: valor})}
  label="Telefone Principal"
  obrigatoria
  temaId="elegante"
/>

// Email
<InputFormatado
  tipo="email"
  value={cliente.email}
  onChange={(valor) => setCliente({...cliente, email: valor})}
  label="E-mail"
  obrigatoria
  temaId="elegante"
/>

// CEP
<InputFormatado
  tipo="cep"
  value={cliente.cep}
  onChange={(valor) => setCliente({...cliente, cep: valor})}
  label="CEP"
  temaId="elegante"
/>
```

### **2. Dados Financeiros**
```tsx
// Orçamento
<InputFormatado
  tipo="valor"
  value={projeto.orcamento}
  onChange={(valor) => setProjeto({...projeto, orcamento: valor})}
  label="Orçamento Estimado"
  placeholder="R$ 0,00"
  temaId="elegante"
/>

// Data de entrega
<InputFormatado
  tipo="data"
  value={projeto.prazo}
  onChange={(valor) => setProjeto({...projeto, prazo: valor})}
  label="Prazo de Entrega"
  temaId="elegante"
/>
```

### **3. Documentos**
```tsx
// CPF
<InputFormatado
  tipo="cpf"
  value={pessoa.cpf}
  onChange={(valor) => setPessoa({...pessoa, cpf: valor})}
  label="CPF"
  obrigatoria
  temaId="elegante"
/>

// CNPJ
<InputFormatado
  tipo="cnpj"
  value={empresa.cnpj}
  onChange={(valor) => setEmpresa({...empresa, cnpj: valor})}
  label="CNPJ"
  obrigatoria
  temaId="elegante"
/>
```

## **💡 Dicas de Uso**

### **1. Sempre Mapear Tema**
```tsx
// Converter tema do ArcFlow para InputFormatado
temaId={temaId === 'elegante' ? 'elegante' : 'dark'}
```

### **2. Validação Automática**
O componente já valida automaticamente:
- Telefone: Mínimo 10 dígitos
- E-mail: Formato válido
- Data: Data real existente
- CEP: 8 dígitos
- CPF: 11 dígitos
- CNPJ: 14 dígitos

### **3. Formatação em Tempo Real**
- Usuario digita: `11999999999`
- Exibe formatado: `(11) 99999-9999`
- Salva no estado: `(11) 99999-9999`

### **4. Placeholders Inteligentes**
- Se não informar placeholder, usa o padrão
- Telefone: `(11) 99999-9999`
- E-mail: `exemplo@email.com`
- Data: `dd/mm/aaaa`
- Valor: `R$ 0,00`

## **🚨 REGRA RAFAEL**

**⚡ SEMPRE que encontrar estes campos no ArcFlow:**
- Campo de telefone → `tipo="telefone"`
- Campo de e-mail → `tipo="email"`
- Campo de data → `tipo="data"`
- Campo de valor/preço → `tipo="valor"`
- Campo de CEP → `tipo="cep"`

**🔄 Substitua o input normal por InputFormatado!**

## **📁 Localização**
```
frontend/src/components/ui/InputFormatado.tsx
```

## **✅ Exemplo Aplicado**
✅ **Já aplicado em**: `/briefing/novo` - campos telefone e e-mail  
🔄 **Próximos**: Cadastro de clientes, projetos, financeiro

---

**🎯 COMPONENTE PRONTO PARA USO EM TODO O SISTEMA ARCFLOW!** 