/**
 * Utilitários para manipulação de números de telefone e WhatsApp
 */

/**
 * Detecta se uma string é um número de telefone
 * @param text - Texto para verificar
 * @returns true se for um número de telefone
 */
export function isPhoneNumber(text: string): boolean {
  // Remove todos os caracteres não numéricos
  const cleanNumber = text.replace(/\D/g, '')
  
  // Verifica se tem entre 10 e 15 dígitos (formato brasileiro + internacional)
  return cleanNumber.length >= 10 && cleanNumber.length <= 15
}

/**
 * Limpa um número de telefone removendo caracteres especiais
 * @param phone - Número de telefone
 * @returns Número limpo apenas com dígitos
 */
export function cleanPhoneNumber(phone: string): string {
  return phone.replace(/\D/g, '')
}

/**
 * Formata um número de telefone para exibição
 * @param phone - Número de telefone
 * @returns Número formatado
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = cleanPhoneNumber(phone)
  
  if (cleaned.length === 11) {
    // Formato: (XX) 9XXXX-XXXX
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`
  } else if (cleaned.length === 10) {
    // Formato: (XX) XXXX-XXXX
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`
  }
  
  return phone
}

/**
 * Gera link do WhatsApp para um número de telefone
 * @param phone - Número de telefone
 * @param message - Mensagem opcional
 * @returns Link do WhatsApp
 */
export function generateWhatsAppLink(phone: string, message?: string): string {
  const cleaned = cleanPhoneNumber(phone)
  
  // Adiciona código do país se não tiver (Brasil = 55)
  const phoneWithCountry = cleaned.startsWith('55') ? cleaned : `55${cleaned}`
  
  const baseUrl = `https://wa.me/${phoneWithCountry}`
  
  if (message) {
    const encodedMessage = encodeURIComponent(message)
    return `${baseUrl}?text=${encodedMessage}`
  }
  
  return baseUrl
}

/**
 * Abre o WhatsApp em uma nova aba
 * @param phone - Número de telefone
 * @param message - Mensagem opcional
 */
export function openWhatsApp(phone: string, message?: string): void {
  const link = generateWhatsAppLink(phone, message)
  window.open(link, '_blank', 'noopener,noreferrer')
}

/**
 * Detecta se um contato é um número de telefone e retorna informações
 * @param contact - Contato para verificar
 * @returns Objeto com informações do telefone
 */
export function analyzeContact(contact: string): {
  isPhone: boolean
  formatted: string
  whatsappLink: string
  cleanNumber: string
} {
  const isPhone = isPhoneNumber(contact)
  const cleanNumber = cleanPhoneNumber(contact)
  const formatted = isPhone ? formatPhoneNumber(contact) : contact
  const whatsappLink = isPhone ? generateWhatsAppLink(contact) : ''
  
  return {
    isPhone,
    formatted,
    whatsappLink,
    cleanNumber
  }
}
