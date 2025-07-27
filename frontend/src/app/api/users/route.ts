import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Pegar token do header Authorization
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Token de autorização necessário' }, { status: 401 })
    }

    // Fazer chamada para o backend
    const backendUrl = 'http://localhost:3001/api/users'
    
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const errorData = await response.text()
      return NextResponse.json(
        { error: 'Erro ao buscar usuários', details: errorData }, 
        { status: response.status }
      )
    }

    const data = await response.json()
    
    // Retornar apenas a lista de usuários para o componente
    return NextResponse.json(data.users || [])
    
  } catch (error) {
    console.error('Erro na API de usuários:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' }, 
      { status: 500 }
    )
  }
} 