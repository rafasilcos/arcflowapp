/**
 * 🔍 API ROUTE: BUSCAR ORÇAMENTO POR ID
 * 
 * Proxy para o backend que busca dados reais do banco de dados
 */

import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    console.log('🔍 [API-ROUTE] Buscando orçamento:', id);
    
    // Obter token de autorização
    const authorization = request.headers.get('authorization');
    
    if (!authorization) {
      return NextResponse.json(
        { success: false, message: 'Token de autorização necessário' },
        { status: 401 }
      );
    }
    
    // Fazer chamada para o backend real
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const response = await fetch(`${backendUrl}/api/orcamentos/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': authorization,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ [API-ROUTE] Erro do backend:', response.status, errorData);
      
      return NextResponse.json(
        { 
          success: false, 
          message: errorData.message || `Erro HTTP: ${response.status}`,
          error: errorData.error || 'BACKEND_ERROR'
        },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    
    console.log('✅ [API-ROUTE] Orçamento encontrado:', {
      id: data.data?.id,
      codigo: data.data?.codigo,
      valorTotal: data.data?.valor_total,
      fonte: 'BANCO_DE_DADOS_REAL'
    });
    
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('❌ [API-ROUTE] Erro interno:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Erro interno do servidor',
        error: 'INTERNAL_SERVER_ERROR'
      },
      { status: 500 }
    );
  }
}