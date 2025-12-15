import { NextRequest, NextResponse } from 'next/server'
import { UnidadeService } from '@/lib/services/unidadeService'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const numero = searchParams.get('numero')
    
    if (!numero) {
      return NextResponse.json(
        { error: 'Número da unidade é obrigatório', success: false },
        { status: 400 }
      )
    }
    
    const unidade = await UnidadeService.findByNumero(numero)
    
    return NextResponse.json({ 
      exists: !!unidade,
      success: true 
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error', success: false },
      { status: 500 }
    )
  }
}
