import 'server-only'

import { prisma } from '@/lib/prisma'
import { CreateAvisoInput, UpdateAvisoInput } from '@/lib/validations/aviso'
import type { Aviso } from '@/types'
import type { Prisma } from '@prisma/client'

// Extended type that includes tipo (for IDE compatibility)
type AvisoPrisma = Prisma.AvisoGetPayload<{}> & { tipo: 'Aviso' | 'Publi' }

// Função para transformar dados do Prisma para o formato Aviso
function transformAviso(data: AvisoPrisma): Aviso {
  return {
    aviso_id: data.aviso_id,
    titulo: data.titulo,
    corpo: data.corpo,
    url: data.url,
    url_metadata: null,
    autor: data.autor,
    ativo: data.ativo,
    fixado: data.fixado,
    tipo: data.tipo,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  }
}

export class AvisoService {
  static async findAll(): Promise<Aviso[]> {
    const avisos = await prisma.aviso.findMany({
      where: { ativo: true },
      orderBy: [
        { fixado: 'desc' },
        { createdAt: 'desc' }
      ]
    })

    return avisos.map((a) => transformAviso(a as AvisoPrisma))
  }

  static async findById(id: number): Promise<Aviso | null> {
    const aviso = await prisma.aviso.findUnique({
      where: { aviso_id: id }
    })
    return aviso ? transformAviso(aviso as AvisoPrisma) : null
  }

  static async create(data: CreateAvisoInput): Promise<Aviso> {
    const createData = {
      titulo: data.titulo,
      corpo: data.corpo,
      url: data.url && data.url.trim() !== '' ? data.url : null,
      url_metadata: null,
      autor: data.autor && data.autor.trim() !== '' ? data.autor : null,
      fixado: data.fixado || false,
      tipo: data.tipo || 'Publi',
    }

    const aviso = await prisma.aviso.create({
      data: createData as any
    })

    return transformAviso(aviso as AvisoPrisma)
  }

  static async update(id: number, data: UpdateAvisoInput): Promise<Aviso> {
    const updateData: Prisma.AvisoUpdateInput = {
      ...(data.titulo && { titulo: data.titulo }),
      ...(data.corpo && { corpo: data.corpo }),
      ...(data.url !== undefined && { url: data.url && data.url.trim() !== '' ? data.url : null }),
      ...(data.autor !== undefined && { autor: data.autor && data.autor.trim() !== '' ? data.autor : null }),
      ...(data.fixado !== undefined && { fixado: data.fixado }),
      ...(data.tipo !== undefined && { tipo: data.tipo as any }),
    }

    const aviso = await prisma.aviso.update({
      where: { aviso_id: id },
      data: updateData
    })

    return transformAviso(aviso as AvisoPrisma)
  }

  static async delete(id: number): Promise<Aviso> {
    const aviso = await prisma.aviso.update({
      where: { aviso_id: id },
      data: { ativo: false }
    })

    return transformAviso(aviso as AvisoPrisma)
  }

  static async toggleFixado(id: number): Promise<Aviso> {
    const aviso = await this.findById(id)
    if (!aviso) {
      throw new Error('Aviso não encontrado')
    }

    const updatedAviso = await prisma.aviso.update({
      where: { aviso_id: id },
      data: { fixado: !aviso.fixado }
    })

    return transformAviso(updatedAviso as AvisoPrisma)
  }
}
