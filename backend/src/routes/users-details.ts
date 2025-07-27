import { Router } from 'express'
import { supabase } from '../config/database-simple'
import { authMiddleware } from '../middleware/auth'

const router = Router()

// GET /api/users/:id - Buscar detalhes do usuário responsável
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params
    
    if (!id) {
      return res.status(400).json({ 
        error: 'ID do usuário é obrigatório' 
      })
    }

    const { data: user, error } = await supabase
      .from('users')
      .select(`
        id,
        nome,
        email,
        telefone,
        cargo,
        especializacao,
        empresa,
        created_at,
        updated_at
      `)
      .eq('id', id)
      .single()

    if (error) {
      console.error('Erro ao buscar usuário:', error)
      return res.status(404).json({ 
        error: 'Usuário não encontrado',
        details: error.message 
      })
    }

    if (!user) {
      return res.status(404).json({ 
        error: 'Usuário não encontrado' 
      })
    }

    // Converter snake_case para camelCase
    const userFormatted = {
      id: user.id,
      nome: user.nome,
      email: user.email,
      telefone: user.telefone,
      cargo: user.cargo,
      especializacao: user.especializacao,
      empresa: user.empresa,
      createdAt: user.created_at,
      updatedAt: user.updated_at
    }

    res.json({
      success: true,
      data: userFormatted
    })

  } catch (error) {
    console.error('Erro interno ao buscar usuário:', error)
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    })
  }
})

export default router 