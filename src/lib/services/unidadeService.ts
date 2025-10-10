import { prisma } from '@/lib/prisma'
import { CreateUnidadeInput, UpdateUnidadeInput } from '@/lib/validations/unidade'
import type { Unidade } from '@/types'
import { parseJsonArray } from '@/lib/utils/data'

// Função para transformar dados do Prisma para o formato Unidade
function transformUnidade(data: any): Unidade {
  return {
    ...data,
    mora: data.mora ? parseJsonArray(data.mora) : null,
    contato: data.contato ? parseJsonArray(data.contato) : null
  }
}

export class UnidadeService {
  static async findAll(): Promise<Unidade[]> {
    const unidades = await prisma.unidade.findMany({
      include: {
        quadra: true
      },
      orderBy: [
        { quadra: { quadra_name: 'asc' } },
        { unidade_numero: 'asc' }
      ]
    })
    return unidades.map(transformUnidade)
  }

  static async findById(id: number): Promise<Unidade | null> {
    const unidade = await prisma.unidade.findUnique({
      where: { unidade_id: id },
      include: {
        quadra: true
      }
    })
    return unidade ? transformUnidade(unidade) : null
  }

  static async findByNumero(numero: string): Promise<Unidade | null> {
    const unidade = await prisma.unidade.findUnique({
      where: { unidade_numero: numero },
      include: {
        quadra: true
      }
    })
    return unidade ? transformUnidade(unidade) : null
  }

  static async findByQuadra(quadraId: number): Promise<Unidade[]> {
    const unidades = await prisma.unidade.findMany({
      where: { quadra_id: quadraId },
      include: {
        quadra: true
      },
      orderBy: { unidade_numero: 'asc' }
    })
    return unidades.map(transformUnidade)
  }

  static async create(data: CreateUnidadeInput): Promise<Unidade> {
    const unidade = await prisma.unidade.create({
      data: {
        unidade_numero: data.unidade_numero,
        quadra_id: data.quadra_id,
        mora: JSON.stringify(data.mora),
        contato: data.contato ? JSON.stringify(data.contato) : null
      },
      include: {
        quadra: true
      }
    })
    return transformUnidade(unidade)
  }

  static async update(id: number, data: UpdateUnidadeInput): Promise<Unidade> {
    const updateData: any = {}
    
    if (data.unidade_numero) updateData.unidade_numero = data.unidade_numero
    if (data.quadra_id) updateData.quadra_id = data.quadra_id
    if (data.mora) updateData.mora = JSON.stringify(data.mora)
    if (data.contato !== undefined) {
      updateData.contato = data.contato ? JSON.stringify(data.contato) : null
    }

    const unidade = await prisma.unidade.update({
      where: { unidade_id: id },
      data: updateData,
      include: {
        quadra: true
      }
    })
    return transformUnidade(unidade)
  }

  static async delete(id: number): Promise<void> {
    await prisma.unidade.delete({
      where: { unidade_id: id }
    })
  }

  static async existsByNumero(numero: string): Promise<boolean> {
    const unidade = await prisma.unidade.findUnique({
      where: { unidade_numero: numero },
      select: { unidade_id: true }
    })
    return !!unidade
  }
}
