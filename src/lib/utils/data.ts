/**
 * Converte dados JSON armazenados como string para array
 * @param data - Dados que podem ser string JSON ou array
 * @returns Array de strings
 */
export function parseJsonArray(data: string | string[] | null | undefined): string[] {
  if (!data) return []
  if (Array.isArray(data)) return data
  try {
    return JSON.parse(data)
  } catch {
    return []
  }
}

/**
 * Converte array para string JSON para armazenamento
 * @param data - Array de strings
 * @returns String JSON
 */
export function stringifyJsonArray(data: string[]): string {
  return JSON.stringify(data)
}
