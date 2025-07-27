import { NextRequest, NextResponse } from 'next/server';
import { writeFile, readFile } from 'fs/promises';
import path from 'path';

const ACEITES_PATH = path.resolve(process.cwd(), 'aceites.json');

export async function POST(req: NextRequest) {
  try {
    const { token, nome, email } = await req.json();
    if (!token || !nome || !email) {
      return NextResponse.json({ error: 'Dados incompletos.' }, { status: 400 });
    }
    // Lê aceites existentes
    let aceites: any[] = [];
    try {
      const data = await readFile(ACEITES_PATH, 'utf-8');
      aceites = JSON.parse(data);
    } catch {}
    // Adiciona novo aceite
    aceites.push({
      token,
      nome,
      email,
      dataHora: new Date().toISOString(),
      ip: req.headers.get('x-forwarded-for') || 'desconhecido',
    });
    await writeFile(ACEITES_PATH, JSON.stringify(aceites, null, 2), 'utf-8');
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao registrar aceite', details: String(error) }, { status: 500 });
  }
} 