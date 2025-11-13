import { NextRequest, NextResponse } from 'next/server'
import { AvisoService } from '@/lib/services/avisoService'
import { UpdateAvisoSchema } from '@/lib/validations/aviso'

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

    const aviso = await AvisoService.findById(id)

    if (!aviso) {
      return NextResponse.json(
        { error: 'Aviso não encontrado', success: false },
        { status: 404 }
      )
    }

    return NextResponse.json({ data: aviso, success: true })
  } catch (error) {
    console.error('❌ [API /avisos/[id] GET] Erro ao buscar aviso:', error)
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
    console.log(`📥 [API /avisos/${id} PUT] Body recebido:`, body)

    const validatedData = UpdateAvisoSchema.parse(body)

    const aviso = await AvisoService.update(id, validatedData)

    return NextResponse.json({
      data: aviso,
      success: true,
      message: 'Aviso atualizado com sucesso'
    })
  } catch (error: any) {
    console.error('❌ [API /avisos/[id] PUT] Erro ao atualizar aviso:', error)

    if (error?.name === 'ZodError') {
      return NextResponse.json(
        {
          error: 'Dados inválidos',
          details: error.errors,
          success: false
        },
        { status: 400 }
      )
    }

    if (error?.code === 'P2025') {
      return NextResponse.json(
        { error: 'Aviso não encontrado', success: false },
        { status: 404 }
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

    const aviso = await AvisoService.findById(id)
    if (!aviso) {
      return NextResponse.json(
        { error: 'Aviso não encontrado', success: false },
        { status: 404 }
      )
    }

    await AvisoService.delete(id)

    return NextResponse.json({
      success: true,
      message: 'Aviso deletado com sucesso'
    })
  } catch (error) {
    console.error('❌ [API /avisos/[id] DELETE] Erro ao deletar aviso:', error)

    return NextResponse.json(
      { error: 'Internal Server Error', success: false },
      { status: 500 }
    )
  }
}
