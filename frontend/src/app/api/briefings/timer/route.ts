import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { action, briefingId, timerId } = await request.json()
    
    if (!briefingId) {
      return NextResponse.json({ error: 'briefingId é obrigatório' }, { status: 400 })
    }

    switch (action) {
      case 'start':
        // Iniciar contador de tempo
        const startTime = new Date().toISOString()
        
        // Salvar no localStorage do cliente (via resposta)
        return NextResponse.json({
          success: true,
          action: 'start',
          briefingId,
          startTime,
          message: 'Contador iniciado'
        })
        
      case 'stop':
        // Parar contador de tempo
        const endTime = new Date().toISOString()
        
        return NextResponse.json({
          success: true,
          action: 'stop',
          briefingId,
          endTime,
          message: 'Contador finalizado'
        })
        
      case 'get':
        // Obter tempo atual
        return NextResponse.json({
          success: true,
          action: 'get',
          briefingId,
          currentTime: new Date().toISOString(),
          message: 'Tempo atual obtido'
        })
        
      default:
        return NextResponse.json({ error: 'Ação inválida' }, { status: 400 })
    }
    
  } catch (error) {
    console.error('Erro na API de timer:', error)
    return NextResponse.json({ 
      error: 'Erro interno do servidor', 
      details: error instanceof Error ? error.message : 'Erro desconhecido' 
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const briefingId = searchParams.get('briefingId')
    
    if (!briefingId) {
      return NextResponse.json({ error: 'briefingId é obrigatório' }, { status: 400 })
    }
    
    return NextResponse.json({
      success: true,
      briefingId,
      serverTime: new Date().toISOString(),
      message: 'Timer status obtido'
    })
    
  } catch (error) {
    console.error('Erro ao obter timer:', error)
    return NextResponse.json({ 
      error: 'Erro interno do servidor', 
      details: error instanceof Error ? error.message : 'Erro desconhecido' 
    }, { status: 500 })
  }
} 