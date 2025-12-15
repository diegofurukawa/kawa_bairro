import { NextRequest, NextResponse } from 'next/server'
import { AvisoService } from '@/lib/services/avisoService'
import { CreateAvisoSchema } from '@/lib/validations/aviso'

export async function GET() {
  try {
    const avisos = await AvisoService.findAll()
    return NextResponse.json({ data: avisos, success: true })
  } catch (error) {
    console.error('❌ [API /avisos GET] Erro ao buscar avisos:', error)
    return NextResponse.json(
      { error: 'Internal Server Error', success: false },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('📥 [API /avisos POST] Body recebido:', body)

    const validatedData = CreateAvisoSchema.parse(body)
    console.log('✅ [API /avisos POST] Dados validados:', validatedData)

    const aviso = await AvisoService.create(validatedData)

    return NextResponse.json(
      {
        data: aviso,
        success: true,
        message: 'Aviso criado com sucesso'
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('❌ [API /avisos POST] Erro ao criar aviso:', error)

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

    return NextResponse.json(
      { error: 'Internal Server Error', success: false },
      { status: 500 }
    )
  }
}
