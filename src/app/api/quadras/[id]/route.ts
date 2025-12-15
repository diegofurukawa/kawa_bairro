import { NextRequest, NextResponse } from 'next/server'
import { QuadraService } from '@/lib/services/quadraService'
import { UpdateQuadraSchema } from '@/lib/validations/quadra'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const id = parseInt(resolvedParams.id)
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID inválido', success: false },
        { status: 400 }
      )
    }

    const quadra = await QuadraService.findById(id)
    
    if (!quadra) {
      return NextResponse.json(
        { error: 'Quadra não encontrada', success: false },
        { status: 404 }
      )
    }

    return NextResponse.json({ 
      data: quadra, 
      success: true 
    })
  } catch (error) {
    console.error('❌ [API] Erro ao buscar quadra:', error)
    return NextResponse.json(
      { error: 'Internal Server Error', success: false },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const id = parseInt(resolvedParams.id)
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID inválido', success: false },
        { status: 400 }
      )
    }

    const body = await request.json()
    const validatedData = UpdateQuadraSchema.parse(body)
    
    const quadra = await QuadraService.update(id, validatedData)
    
    return NextResponse.json({ 
      data: quadra, 
      success: true,
      message: 'Quadra atualizada com sucesso'
    })
  } catch (error) {
    console.error('❌ [API] Erro ao atualizar quadra:', error)
    
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params
    const id = parseInt(resolvedParams.id)
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID inválido', success: false },
        { status: 400 }
      )
    }

    // Verificar se a quadra existe
    const quadra = await QuadraService.findById(id)
    if (!quadra) {
      return NextResponse.json(
        { error: 'Quadra não encontrada', success: false },
        { status: 404 }
      )
    }

    await QuadraService.delete(id)
    
    return NextResponse.json({ 
      success: true,
      message: 'Quadra deletada com sucesso'
    })
  } catch (error) {
    console.error('❌ [API] Erro ao deletar quadra:', error)
    
    return NextResponse.json(
      { error: 'Internal Server Error', success: false },
      { status: 500 }
    )
  }
}
