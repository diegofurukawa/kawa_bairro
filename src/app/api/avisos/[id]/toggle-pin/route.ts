import { NextRequest, NextResponse } from 'next/server'
import { AvisoService } from '@/lib/services/avisoService'

export async function PATCH(
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

    const aviso = await AvisoService.toggleFixado(id)

    return NextResponse.json({
      data: aviso,
      success: true,
      message: aviso.fixado ? 'Aviso fixado' : 'Aviso desafixado'
    })
  } catch (error: any) {
    console.error('❌ [API /avisos/[id]/toggle-pin PATCH] Erro:', error)

    if (error.message === 'Aviso não encontrado') {
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
