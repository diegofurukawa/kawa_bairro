import 'server-only'

import { prisma } from '@/lib/prisma'
import { CreateAvisoInput, UpdateAvisoInput } from '@/lib/validations/aviso'
import { fetchUrlMetadata } from '@/lib/utils/url-metadata'
import type { Aviso } from '@/types'

export class AvisoService {
  static async findAll(): Promise<Aviso[]> {
    console.log('🔍 [AvisoService] Executando findAll...')

    const avisos = await prisma.aviso.findMany({
      where: { ativo: true },
      orderBy: [
        { fixado: 'desc' },      // Fixados primeiro
        { createdAt: 'desc' }    // Mais recentes depois
      ]
    })

    console.log(`📊 [AvisoService] Retornando ${avisos.length} avisos ativos`)
    return avisos as Aviso[]
  }

  static async findById(id: number): Promise<Aviso | null> {
    console.log(`🔍 [AvisoService] Buscando aviso com ID ${id}`)
    const aviso = await prisma.aviso.findUnique({
      where: { aviso_id: id }
    })
    return aviso as Aviso | null
  }

  static async create(data: CreateAvisoInput): Promise<Aviso> {
    console.log('✨ [AvisoService] Criando novo aviso:', data.titulo)

    // Extrair metadados se URL fornecida
    let urlMetadata = null
    if (data.url && data.url.trim() !== '') {
      try {
        console.log(`🌐 [AvisoService] Extraindo metadados da URL: ${data.url}`)
        urlMetadata = await fetchUrlMetadata(data.url)
      } catch (error) {
        console.warn('⚠️ [AvisoService] Erro ao extrair metadados, continuando sem metadados:', error)
        // Continua sem metadados
      }
    }

    const aviso = await prisma.aviso.create({
      data: {
        titulo: data.titulo,
        corpo: data.corpo,
        url: data.url && data.url.trim() !== '' ? data.url : null,
        url_metadata: urlMetadata ? (urlMetadata as any) : undefined,
        autor: data.autor && data.autor.trim() !== '' ? data.autor : null,
        fixado: data.fixado || false,
      }
    })

    console.log(`✅ [AvisoService] Aviso criado com sucesso - ID: ${aviso.aviso_id}`)
    return aviso as Aviso
  }

  static async update(id: number, data: UpdateAvisoInput): Promise<Aviso> {
    console.log(`📝 [AvisoService] Atualizando aviso ID ${id}`)

    // Se URL foi alterada, buscar novos metadados
    let urlMetadata = undefined
    if (data.url !== undefined) {
      if (data.url && data.url.trim() !== '') {
        try {
          console.log(`🌐 [AvisoService] Extraindo novos metadados da URL: ${data.url}`)
          urlMetadata = await fetchUrlMetadata(data.url)
        } catch (error) {
          console.warn('⚠️ [AvisoService] Erro ao extrair metadados:', error)
        }
      } else {
        urlMetadata = null
      }
    }

    const aviso = await prisma.aviso.update({
      where: { aviso_id: id },
      data: {
        ...(data.titulo && { titulo: data.titulo }),
        ...(data.corpo && { corpo: data.corpo }),
        ...(data.url !== undefined && { url: data.url && data.url.trim() !== '' ? data.url : null }),
        ...(urlMetadata !== undefined && { url_metadata: urlMetadata as any }),
        ...(data.autor !== undefined && { autor: data.autor && data.autor.trim() !== '' ? data.autor : null }),
        ...(data.fixado !== undefined && { fixado: data.fixado }),
      }
    })

    console.log(`✅ [AvisoService] Aviso ID ${id} atualizado com sucesso`)
    return aviso as Aviso
  }

  static async delete(id: number): Promise<Aviso> {
    console.log(`🗑️ [AvisoService] Deletando (soft delete) aviso ID ${id}`)

    // Soft delete
    const aviso = await prisma.aviso.update({
      where: { aviso_id: id },
      data: { ativo: false }
    })

    console.log(`✅ [AvisoService] Aviso ID ${id} marcado como inativo`)
    return aviso as Aviso
  }

  static async toggleFixado(id: number): Promise<Aviso> {
    console.log(`📌 [AvisoService] Alternando fixado para aviso ID ${id}`)

    const aviso = await this.findById(id)
    if (!aviso) {
      throw new Error('Aviso não encontrado')
    }

    const updatedAviso = await prisma.aviso.update({
      where: { aviso_id: id },
      data: { fixado: !aviso.fixado }
    })

    console.log(`✅ [AvisoService] Aviso ID ${id} agora está ${updatedAviso.fixado ? 'fixado' : 'desafixado'}`)
    return updatedAviso as Aviso
  }
}
