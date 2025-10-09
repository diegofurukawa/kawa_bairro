export interface Quadra {
  quadra_id: number
  quadra_name: string
  createdAt: Date
  updatedAt: Date
}

export interface Unidade {
  unidade_id: number
  unidade_numero: string
  quadra_id: number
  mora: string[] | null
  contato: string[] | null
  quadra?: Quadra
  createdAt: Date
  updatedAt: Date
}

export interface CreateQuadraInput {
  quadra_name: string
}

export interface CreateUnidadeInput {
  unidade_numero: string
  quadra_id: number
  mora: string[]
  contato: string[]
}

export interface UpdateUnidadeInput {
  unidade_numero?: string
  mora?: string[]
  contato?: string[]
}

export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
}

export interface ApiError {
  error: string
  success: false
}
