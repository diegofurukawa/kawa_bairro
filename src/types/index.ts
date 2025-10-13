export interface Quadra {
  quadra_id: number
  quadra_name: string
  cep?: string | null
  numero?: string | null
  endereco?: string | null
  complemento?: string | null
  bairro?: string | null
  cidade?: string | null
  estado?: string | null
  estado_codigo?: string | null
  pais?: string | null
  pais_iso?: string | null
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
  cep?: string
  numero?: string
  endereco?: string
  complemento?: string
  bairro?: string
  cidade?: string
  estado?: string
  estado_codigo?: string
  pais?: string
  pais_iso?: string
}

export interface UpdateQuadraInput {
  quadra_name?: string
  cep?: string
  numero?: string
  endereco?: string
  complemento?: string
  bairro?: string
  cidade?: string
  estado?: string
  estado_codigo?: string
  pais?: string
  pais_iso?: string
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
