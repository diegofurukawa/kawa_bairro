import { NextRequest, NextResponse } from 'next/server'
import { UnidadeService } from '@/lib/services/unidadeService'
import { CreateUnidadeSchema } from '@/lib/validations/unidade'

export async function GET() {
  try {
    const unidades = await UnidadeService.findAll()
    
    return NextResponse.json({ 
      data: unidades, 
      success: true 
    })
  } catch (error) {
    console.error('Erro ao buscar unidades:', error)
    return NextResponse.json(
      { error: 'Internal Server Error', success: false },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = CreateUnidadeSchema.parse(body)
    
    // Verificar se a unidade já existe
    const exists = await UnidadeService.existsByNumero(validatedData.unidade_numero)
    if (exists) {
      return NextResponse.json(
        { error: 'Unidade já existe', success: false },
        { status: 409 }
      )
    }
    
    const unidade = await UnidadeService.create(validatedData)
    
    return NextResponse.json({ 
      data: unidade, 
      success: true,
      message: 'Unidade criada com sucesso'
    }, { status: 201 })
  } catch (error) {
    console.error('API Error:', error)
    
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Dados inválidos', success: false },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal Server Error', success: false },
      { status: 500 }
    )
  }
}
