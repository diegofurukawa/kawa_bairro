import { render, screen, fireEvent } from '@testing-library/react'
import { ChipInput } from '@/components/forms/ChipInput'

describe('ChipInput', () => {
  const mockOnChange = jest.fn()

  beforeEach(() => {
    mockOnChange.mockClear()
  })

  it('deve renderizar o input corretamente', () => {
    render(
      <ChipInput
        value={[]}
        onChange={mockOnChange}
        placeholder="Digite algo"
      />
    )

    expect(screen.getByPlaceholderText('Digite algo')).toBeInTheDocument()
  })

  it('deve adicionar chip quando Enter for pressionado', () => {
    render(
      <ChipInput
        value={[]}
        onChange={mockOnChange}
        placeholder="Digite algo"
      />
    )

    const input = screen.getByPlaceholderText('Digite algo')
    fireEvent.change(input, { target: { value: 'Teste' } })
    fireEvent.keyDown(input, { key: 'Enter' })

    expect(mockOnChange).toHaveBeenCalledWith(['Teste'])
  })

  it('deve remover chip quando botão de remoção for clicado', () => {
    render(
      <ChipInput
        value={['Teste1', 'Teste2']}
        onChange={mockOnChange}
        placeholder="Digite algo"
      />
    )

    const removeButtons = screen.getAllByLabelText('Remover')
    fireEvent.click(removeButtons[0])

    expect(mockOnChange).toHaveBeenCalledWith(['Teste2'])
  })

  it('deve mostrar erro quando fornecido', () => {
    render(
      <ChipInput
        value={[]}
        onChange={mockOnChange}
        error="Erro de validação"
      />
    )

    expect(screen.getByText('Erro de validação')).toBeInTheDocument()
  })
})
