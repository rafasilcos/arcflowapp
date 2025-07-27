/**
 * 🔐 API ROUTE: LOGIN AUTOMÁTICO
 * 
 * Proxy para o backend que faz login e retorna tokens
 */

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;
    
    console.log('🔐 [LOGIN-ROUTE] Tentativa de login:', email);
    
    // Fazer chamada para o backend real
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const response = await fetch(`${backendUrl}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('❌ [LOGIN-ROUTE] Erro do backend:', response.status, errorData);
      
      return NextResponse.json(
        { 
          success: false, 
          message: errorData.message || `Erro HTTP: ${response.status}`,
          error: errorData.error || 'LOGIN_ERROR'
        },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    
    console.log('✅ [LOGIN-ROUTE] Login realizado com sucesso:', email);
    
    // Retornar dados no formato esperado pelo frontend
    return NextResponse.json({
      success: true,
      message: 'Login realizado com sucesso',
      token: data.token,
      tokens: {
        accessToken: data.tokens?.accessToken || data.token,
        refreshToken: data.tokens?.refreshToken,
        expiresIn: data.tokens?.expiresIn || '4h'
      },
      user: data.user,
      escritorio: data.escritorio
    });
    
  } catch (error) {
    console.error('❌ [LOGIN-ROUTE] Erro interno:', error);
    
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