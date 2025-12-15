import 'server-only'

import metascraper from 'metascraper'
import metascraperDescription from 'metascraper-description'
import metascraperImage from 'metascraper-image'
import metascraperTitle from 'metascraper-title'
import metascraperUrl from 'metascraper-url'
import metascraperLogo from 'metascraper-logo-favicon'

const scraper = metascraper([
  metascraperDescription(),
  metascraperImage(),
  metascraperTitle(),
  metascraperUrl(),
  metascraperLogo()
])

export interface UrlMetadata {
  title?: string
  description?: string
  image?: string
  logo?: string
  url?: string
}

export async function fetchUrlMetadata(url: string): Promise<UrlMetadata | null> {
  try {
    console.log(`[URL Metadata] Fetching metadata for: ${url}`)

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; MeuBairro/1.0; +http://meubairro.app)'
      },
      signal: AbortSignal.timeout(10000) // 10s timeout
    })

    if (!response.ok) {
      console.warn(`[URL Metadata] HTTP ${response.status} for ${url}`)
      throw new Error(`HTTP ${response.status}`)
    }

    const html = await response.text()
    const metadata = await scraper({ html, url })

    console.log(`[URL Metadata] Successfully extracted metadata for ${url}`)

    return {
      title: metadata.title,
      description: metadata.description,
      image: metadata.image,
      logo: metadata.logo,
      url: metadata.url
    }
  } catch (error) {
    console.error(`[URL Metadata] Error fetching metadata for ${url}:`, error)
    return null
  }
}
