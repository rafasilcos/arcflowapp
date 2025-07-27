import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page') || '1'
    const limit = searchParams.get('limit') || '20'
    const status = searchParams.get('status') || ''
    const clienteId = searchParams.get('clienteId') || ''
    
    // Pegar token do header Authorization
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Token de autorização necessário' }, { status: 401 })
    }

    // Construir URL do backend
    const params = new URLSearchParams()
    params.append('page', page)
    params.append('limit', limit)
    if (status) params.append('status', status)
    if (clienteId) params.append('clienteId', clienteId)

    const backendUrl = `http://localhost:3001/api/briefings?${params.toString()}`
    
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
        { error: 'Erro ao buscar briefings', details: errorData }, 
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
    
  } catch (error) {
    console.error('Erro na API de briefings:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' }, 
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Pegar token do header Authorization
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Token de autorização necessário' }, { status: 401 })
    }

    // Pegar dados do corpo da requisição
    const body = await request.json()

    // Fazer chamada para o backend
    const backendUrl = 'http://localhost:3001/api/briefings'
    
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    })

    if (!response.ok) {
      const errorData = await response.text()
      return NextResponse.json(
        { error: 'Erro ao criar briefing', details: errorData }, 
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
    
  } catch (error) {
    console.error('Erro na API de briefings:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' }, 
      { status: 500 }
    )
  }
} 