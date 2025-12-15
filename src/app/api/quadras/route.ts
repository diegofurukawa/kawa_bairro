import { NextRequest, NextResponse } from 'next/server'
import { QuadraService } from '@/lib/services/quadraService'
import { CreateQuadraSchema } from '@/lib/validations/quadra'

export async function GET() {
  try {
    console.log('🔍 [API] Buscando todas as quadras...')
    const quadras = await QuadraService.findAll()
    console.log(`📊 [API] Encontradas ${quadras.length} quadras:`, quadras.map(q => ({ id: q.quadra_id, nome: q.quadra_name })))
    
    return NextResponse.json({ 
      data: quadras, 
      success: true 
    })
  } catch (error) {
    console.error('❌ [API] Erro ao buscar quadras:', error)
    return NextResponse.json(
      { error: 'Internal Server Error', success: false },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = CreateQuadraSchema.parse(body)
    
    const quadra = await QuadraService.createOrFind(validatedData)
    
    return NextResponse.json({ 
      data: quadra, 
      success: true,
      message: 'Quadra criada/encontrada com sucesso'
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
