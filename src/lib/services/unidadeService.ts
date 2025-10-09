import { prisma } from '@/lib/prisma'
import { CreateUnidadeInput, UpdateUnidadeInput } from '@/lib/validations/unidade'
import type { Unidade } from '@/types'

export class UnidadeService {
  static async findAll(): Promise<Unidade[]> {
    return await prisma.unidade.findMany({
      include: {
        quadra: true
      },
      orderBy: [
        { quadra: { quadra_name: 'asc' } },
        { unidade_numero: 'asc' }
      ]
    })
  }

  static async findById(id: number): Promise<Unidade | null> {
    return await prisma.unidade.findUnique({
      where: { unidade_id: id },
      include: {
        quadra: true
      }
    })
  }

  static async findByNumero(numero: string): Promise<Unidade | null> {
    return await prisma.unidade.findUnique({
      where: { unidade_numero: numero },
      include: {
        quadra: true
      }
    })
  }

  static async findByQuadra(quadraId: number): Promise<Unidade[]> {
    return await prisma.unidade.findMany({
      where: { quadra_id: quadraId },
      include: {
        quadra: true
      },
      orderBy: { unidade_numero: 'asc' }
    })
  }

  static async create(data: CreateUnidadeInput): Promise<Unidade> {
    return await prisma.unidade.create({
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
  }

  static async update(id: number, data: UpdateUnidadeInput): Promise<Unidade> {
    const updateData: any = {}
    
    if (data.unidade_numero) updateData.unidade_numero = data.unidade_numero
    if (data.mora) updateData.mora = JSON.stringify(data.mora)
    if (data.contato !== undefined) {
      updateData.contato = data.contato ? JSON.stringify(data.contato) : null
    }

    return await prisma.unidade.update({
      where: { unidade_id: id },
      data: updateData,
      include: {
        quadra: true
      }
    })
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
