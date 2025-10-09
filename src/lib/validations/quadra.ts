import { z } from 'zod'

export const CreateQuadraSchema = z.object({
  quadra_name: z
    .string()
    .min(1, 'Nome da quadra é obrigatório')
    .max(100, 'Nome da quadra deve ter no máximo 100 caracteres')
    .transform((val) => val.toUpperCase().trim()),
})

export const UpdateQuadraSchema = z.object({
  quadra_name: z
    .string()
    .min(1, 'Nome da quadra é obrigatório')
    .max(100, 'Nome da quadra deve ter no máximo 100 caracteres')
    .transform((val) => val.toUpperCase().trim())
    .optional(),
})

export type CreateQuadraInput = z.infer<typeof CreateQuadraSchema>
export type UpdateQuadraInput = z.infer<typeof UpdateQuadraSchema>
