import { z } from 'zod'

export const CreateQuadraSchema = z.object({
  quadra_name: z
    .string()
    .min(1, 'Nome da quadra é obrigatório')
    .max(100, 'Nome da quadra deve ter no máximo 100 caracteres')
    .transform((val) => val.toUpperCase().trim()),
  cep: z
    .string()
    .regex(/^\d{5}-?\d{3}$/, 'CEP deve ter o formato 00000-000')
    .optional()
    .or(z.literal('')),
  numero: z
    .string()
    .max(20, 'Número deve ter no máximo 20 caracteres')
    .optional()
    .or(z.literal('')),
  endereco: z
    .string()
    .max(200, 'Endereço deve ter no máximo 200 caracteres')
    .optional()
    .or(z.literal('')),
  complemento: z
    .string()
    .max(100, 'Complemento deve ter no máximo 100 caracteres')
    .optional()
    .or(z.literal('')),
  bairro: z
    .string()
    .max(100, 'Bairro deve ter no máximo 100 caracteres')
    .optional()
    .or(z.literal('')),
  cidade: z
    .string()
    .max(100, 'Cidade deve ter no máximo 100 caracteres')
    .optional()
    .or(z.literal('')),
  estado: z
    .string()
    .max(50, 'Estado deve ter no máximo 50 caracteres')
    .optional()
    .or(z.literal('')),
  estado_codigo: z
    .string()
    .length(2, 'Código do estado deve ter 2 caracteres')
    .optional()
    .or(z.literal('')),
  pais: z
    .string()
    .max(50, 'País deve ter no máximo 50 caracteres')
    .optional()
    .or(z.literal('')),
  pais_iso: z
    .string()
    .length(2, 'Código ISO do país deve ter 2 caracteres')
    .optional()
    .or(z.literal('')),
})

export const UpdateQuadraSchema = z.object({
  quadra_name: z
    .string()
    .min(1, 'Nome da quadra é obrigatório')
    .max(100, 'Nome da quadra deve ter no máximo 100 caracteres')
    .transform((val) => val.toUpperCase().trim())
    .optional(),
  cep: z
    .string()
    .regex(/^\d{5}-?\d{3}$/, 'CEP deve ter o formato 00000-000')
    .optional()
    .or(z.literal('')),
  numero: z
    .string()
    .max(20, 'Número deve ter no máximo 20 caracteres')
    .optional()
    .or(z.literal('')),
  endereco: z
    .string()
    .max(200, 'Endereço deve ter no máximo 200 caracteres')
    .optional()
    .or(z.literal('')),
  complemento: z
    .string()
    .max(100, 'Complemento deve ter no máximo 100 caracteres')
    .optional()
    .or(z.literal('')),
  bairro: z
    .string()
    .max(100, 'Bairro deve ter no máximo 100 caracteres')
    .optional()
    .or(z.literal('')),
  cidade: z
    .string()
    .max(100, 'Cidade deve ter no máximo 100 caracteres')
    .optional()
    .or(z.literal('')),
  estado: z
    .string()
    .max(50, 'Estado deve ter no máximo 50 caracteres')
    .optional()
    .or(z.literal('')),
  estado_codigo: z
    .string()
    .length(2, 'Código do estado deve ter 2 caracteres')
    .optional()
    .or(z.literal('')),
  pais: z
    .string()
    .max(50, 'País deve ter no máximo 50 caracteres')
    .optional()
    .or(z.literal('')),
  pais_iso: z
    .string()
    .length(2, 'Código ISO do país deve ter 2 caracteres')
    .optional()
    .or(z.literal('')),
})

export type CreateQuadraInput = z.infer<typeof CreateQuadraSchema>
export type UpdateQuadraInput = z.infer<typeof UpdateQuadraSchema>
