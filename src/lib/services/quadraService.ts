import { prisma } from '@/lib/prisma'
import { CreateQuadraInput, UpdateQuadraInput } from '@/lib/validations/quadra'
import type { Quadra } from '@/types'

export class QuadraService {
  static async findAll(): Promise<Quadra[]> {
    return await prisma.quadra.findMany({
      orderBy: { quadra_name: 'asc' }
    })
  }

  static async findById(id: number): Promise<Quadra | null> {
    return await prisma.quadra.findUnique({
      where: { quadra_id: id }
    })
  }

  static async findByName(name: string): Promise<Quadra | null> {
    return await prisma.quadra.findUnique({
      where: { quadra_name: name.toUpperCase() }
    })
  }

  static async create(data: CreateQuadraInput): Promise<Quadra> {
    return await prisma.quadra.create({
      data: {
        quadra_name: data.quadra_name
      }
    })
  }

  static async update(id: number, data: UpdateQuadraInput): Promise<Quadra> {
    return await prisma.quadra.update({
      where: { quadra_id: id },
      data: {
        ...(data.quadra_name && { quadra_name: data.quadra_name })
      }
    })
  }

  static async delete(id: number): Promise<void> {
    await prisma.quadra.delete({
      where: { quadra_id: id }
    })
  }

  static async createOrFind(data: CreateQuadraInput): Promise<Quadra> {
    const existing = await this.findByName(data.quadra_name)
    if (existing) {
      return existing
    }
    return await this.create(data)
  }
}
