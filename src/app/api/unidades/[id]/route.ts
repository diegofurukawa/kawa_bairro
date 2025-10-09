import { NextRequest, NextResponse } from 'next/server'
import { UnidadeService } from '@/lib/services/unidadeService'
import { UpdateUnidadeSchema } from '@/lib/validations/unidade'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID inválido', success: false },
        { status: 400 }
      )
    }

    const body = await request.json()
    const validatedData = UpdateUnidadeSchema.parse(body)
    
    const unidade = await UnidadeService.update(id, validatedData)
    
    return NextResponse.json({ 
      data: unidade, 
      success: true,
      message: 'Unidade atualizada com sucesso'
    })
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
