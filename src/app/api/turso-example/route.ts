import { NextRequest, NextResponse } from 'next/server';
import { tursoClient, executeQuery } from '@/lib/turso';

export async function GET() {
  try {
    // Exemplo de consulta simples
    const result = await executeQuery('SELECT * FROM quadra LIMIT 5');
    
    return NextResponse.json({
      success: true,
      data: result.rows,
      message: 'Dados obtidos com sucesso do Turso'
    });
  } catch (error) {
    console.error('Erro na API Turso:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro ao consultar banco de dados',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { quadra_name } = body;

    if (!quadra_name) {
      return NextResponse.json(
        { success: false, error: 'Nome da quadra é obrigatório' },
        { status: 400 }
      );
    }

    // Inserir nova quadra
    const result = await executeQuery(
      'INSERT INTO quadra (quadra_name) VALUES (?)',
      [quadra_name]
    );

    return NextResponse.json({
      success: true,
      data: { id: result.lastInsertRowid },
      message: 'Quadra criada com sucesso no Turso'
    });
  } catch (error) {
    console.error('Erro ao criar quadra:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro ao criar quadra',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    );
  }
}
