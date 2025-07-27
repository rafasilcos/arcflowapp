import { Router } from 'express'
import { supabase } from '../config/database-simple'
import { authMiddleware } from '../middleware/auth'

const router = Router()

// GET /api/clientes/:id/detalhes - Buscar detalhes do cliente
router.get('/:id/detalhes', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params
    
    if (!id) {
      return res.status(400).json({ 
        error: 'ID do cliente é obrigatório' 
      })
    }

    const { data: cliente, error } = await supabase
      .from('clientes')
      .select(`
        id,
        nome,
        email,
        telefone,
        endereco,
        cidade,
        estado,
        cep,
        cpf_cnpj,
        tipo_pessoa,
        empresa,
        observacoes,
        created_at,
        updated_at
      `)
      .eq('id', id)
      .single()

    if (error) {
      console.error('Erro ao buscar cliente:', error)
      return res.status(404).json({ 
        error: 'Cliente não encontrado',
        details: error.message 
      })
    }

    if (!cliente) {
      return res.status(404).json({ 
        error: 'Cliente não encontrado' 
      })
    }

    // Converter snake_case para camelCase
    const clienteFormatted = {
      id: cliente.id,
      nome: cliente.nome,
      email: cliente.email,
      telefone: cliente.telefone,
      endereco: cliente.endereco,
      cidade: cliente.cidade,
      estado: cliente.estado,
      cep: cliente.cep,
      cpfCnpj: cliente.cpf_cnpj,
      tipoPessoa: cliente.tipo_pessoa,
      empresa: cliente.empresa,
      observacoes: cliente.observacoes,
      createdAt: cliente.created_at,
      updatedAt: cliente.updated_at
    }

    res.json({
      success: true,
      data: clienteFormatted
    })

  } catch (error) {
    console.error('Erro interno ao buscar cliente:', error)
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    })
  }
})

export default router 