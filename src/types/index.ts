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

export type VistoriaStatus = 'agendado' | 'realizado' | 'remarcado' | 'pendente'

export interface Unidade {
  unidade_id: number
  unidade_numero: string
  quadra_id: number
  mora: string[] | null
  contato: string[] | null
  vistoria: VistoriaStatus | null
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
  vistoria?: VistoriaStatus | null
}

export interface UpdateUnidadeInput {
  unidade_numero?: string
  mora?: string[]
  contato?: string[]
  vistoria?: VistoriaStatus | null
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

export interface UrlMetadata {
  title?: string
  description?: string
  image?: string
  logo?: string
  url?: string
}

export interface Aviso {
  aviso_id: number
  titulo: string
  corpo: string
  url?: string | null
  url_metadata?: UrlMetadata | null
  autor?: string | null
  ativo: boolean
  fixado: boolean
  createdAt: Date
  updatedAt: Date
}

export interface CreateAvisoInput {
  titulo: string
  corpo: string
  url?: string
  autor?: string
  fixado?: boolean
}

export interface UpdateAvisoInput {
  titulo?: string
  corpo?: string
  url?: string
  autor?: string
  fixado?: boolean
}
