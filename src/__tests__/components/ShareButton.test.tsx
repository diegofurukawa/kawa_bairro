import { render, screen, fireEvent } from '@testing-library/react'
import { ShareButton } from '@/components/ShareButton'

// Mock do navigator.share
const mockShare = jest.fn()
Object.defineProperty(navigator, 'share', {
  value: mockShare,
  writable: true,
})

// Mock do navigator.clipboard
const mockWriteText = jest.fn()
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: mockWriteText,
  },
  writable: true,
})

describe('ShareButton', () => {
  beforeEach(() => {
    mockShare.mockClear()
    mockWriteText.mockClear()
  })

  it('deve renderizar o botão corretamente', () => {
    render(<ShareButton />)
    expect(screen.getByText('Compartilhar')).toBeInTheDocument()
  })

  it('deve mostrar "Copiar Link" quando Web Share API não estiver disponível', () => {
    // Simular navegador sem Web Share API
    Object.defineProperty(navigator, 'share', {
      value: undefined,
      writable: true,
    })

    render(<ShareButton />)
    expect(screen.getByText('Copiar Link')).toBeInTheDocument()
  })

  it('deve chamar navigator.share quando disponível', async () => {
    mockShare.mockResolvedValue(undefined)
    
    render(<ShareButton />)
    
    const button = screen.getByText('Compartilhar')
    fireEvent.click(button)

    expect(mockShare).toHaveBeenCalledWith({
      title: 'MeuBairro - Jd Das Oliveiras',
      text: 'Cadastre sua unidade no MeuBairro!',
      url: expect.any(String),
    })
  })

  it('deve copiar para clipboard quando Web Share API não estiver disponível', async () => {
    Object.defineProperty(navigator, 'share', {
      value: undefined,
      writable: true,
    })
    
    mockWriteText.mockResolvedValue(undefined)

    render(<ShareButton />)
    
    const button = screen.getByText('Copiar Link')
    fireEvent.click(button)

    await new Promise(resolve => setTimeout(resolve, 100))

    expect(mockWriteText).toHaveBeenCalled()
  })
})
