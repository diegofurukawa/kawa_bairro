import { z } from 'zod'

const urlRegex = /^https?:\/\/.+\..+/

export const CreateAvisoSchema = z.object({
  titulo: z
    .string()
    .min(3, 'Título deve ter pelo menos 3 caracteres')
    .max(200, 'Título deve ter no máximo 200 caracteres')
    .transform((val) => val.trim()),
  corpo: z
    .string()
    .min(10, 'Corpo deve ter pelo menos 10 caracteres')
    .max(5000, 'Corpo deve ter no máximo 5000 caracteres')
    .transform((val) => val.trim()),
  url: z
    .string()
    .regex(urlRegex, 'URL inválida')
    .optional()
    .or(z.literal('')),
  autor: z
    .string()
    .max(100, 'Nome do autor deve ter no máximo 100 caracteres')
    .optional()
    .or(z.literal('')),
  fixado: z.boolean().optional().default(false),
})

export const UpdateAvisoSchema = CreateAvisoSchema.partial()

export type CreateAvisoInput = z.infer<typeof CreateAvisoSchema>
export type UpdateAvisoInput = z.infer<typeof UpdateAvisoSchema>
