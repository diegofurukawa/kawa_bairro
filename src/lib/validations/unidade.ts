import { z } from 'zod'

export const CreateUnidadeSchema = z.object({
  unidade_numero: z
    .string()
    .min(1, 'Número da unidade é obrigatório')
    .max(20, 'Número da unidade deve ter no máximo 20 caracteres')
    .transform((val) => val.trim()),
  quadra_id: z
    .number()
    .int('ID da quadra deve ser um número inteiro')
    .positive('ID da quadra deve ser positivo'),
  mora: z
    .array(z.string().min(1, 'Nome do morador não pode estar vazio'))
    .min(1, 'Deve ter pelo menos um morador')
    .max(10, 'Máximo de 10 moradores por unidade'),
  contato: z
    .array(z.string().min(1, 'Contato não pode estar vazio'))
    .max(5, 'Máximo de 5 contatos por unidade')
    .optional(),
})

export const UpdateUnidadeSchema = z.object({
  unidade_numero: z
    .string()
    .min(1, 'Número da unidade é obrigatório')
    .max(20, 'Número da unidade deve ter no máximo 20 caracteres')
    .transform((val) => val.trim())
    .optional(),
  quadra_id: z
    .number()
    .int('ID da quadra deve ser um número inteiro')
    .positive('ID da quadra deve ser positivo')
    .optional(),
  mora: z
    .array(z.string().min(1, 'Nome do morador não pode estar vazio'))
    .min(1, 'Deve ter pelo menos um morador')
    .max(10, 'Máximo de 10 moradores por unidade')
    .optional(),
  contato: z
    .array(z.string().min(1, 'Contato não pode estar vazio'))
    .max(5, 'Máximo de 5 contatos por unidade')
    .optional(),
})

export type CreateUnidadeInput = z.infer<typeof CreateUnidadeSchema>
export type UpdateUnidadeInput = z.infer<typeof UpdateUnidadeSchema>
