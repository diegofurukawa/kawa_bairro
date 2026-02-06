import { prisma } from '@/lib/prisma'
import { CreateQuadraInput, UpdateQuadraInput } from '@/lib/validations/quadra'
import type { Quadra } from '@/types'

export class QuadraService {
  static async findAll(): Promise<Quadra[]> {
    const quadras = await prisma.quadra.findMany({
      orderBy: { quadra_name: 'asc' }
    })
    return quadras
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
        quadra_name: data.quadra_name,
        cep: data.cep || null,
        numero: data.numero || null,
        endereco: data.endereco || null,
        complemento: data.complemento || null,
        bairro: data.bairro || null,
        cidade: data.cidade || null,
        estado: data.estado || null,
        estado_codigo: data.estado_codigo || null,
        pais: data.pais || null,
        pais_iso: data.pais_iso || null,
      }
    })
  }

  static async update(id: number, data: UpdateQuadraInput): Promise<Quadra> {
    return await prisma.quadra.update({
      where: { quadra_id: id },
      data: {
        ...(data.quadra_name && { quadra_name: data.quadra_name }),
        ...(data.cep !== undefined && { cep: data.cep || null }),
        ...(data.numero !== undefined && { numero: data.numero || null }),
        ...(data.endereco !== undefined && { endereco: data.endereco || null }),
        ...(data.complemento !== undefined && { complemento: data.complemento || null }),
        ...(data.bairro !== undefined && { bairro: data.bairro || null }),
        ...(data.cidade !== undefined && { cidade: data.cidade || null }),
        ...(data.estado !== undefined && { estado: data.estado || null }),
        ...(data.estado_codigo !== undefined && { estado_codigo: data.estado_codigo || null }),
        ...(data.pais !== undefined && { pais: data.pais || null }),
        ...(data.pais_iso !== undefined && { pais_iso: data.pais_iso || null }),
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
