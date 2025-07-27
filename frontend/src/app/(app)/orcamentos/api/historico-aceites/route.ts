import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';

const ACEITES_PATH = path.resolve(process.cwd(), 'aceites.json');

export async function GET(req: NextRequest) {
  try {
    let aceites: any[] = [];
    try {
      const data = await readFile(ACEITES_PATH, 'utf-8');
      aceites = JSON.parse(data);
    } catch {}
    return NextResponse.json({ aceites });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar aceites', details: String(error) }, { status: 500 });
  }
} 