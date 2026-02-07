import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
// @ts-ignore
import ModelResponseCard from './ModelResponseCard'

describe('ModelResponseCard', () => {
  it('renders model name and content', () => {
    render(<ModelResponseCard modelName="ChatGPT" content="Hello there!" />)
    expect(screen.getByText('ChatGPT')).toBeInTheDocument()
    expect(screen.getByText('Hello there!')).toBeInTheDocument()
  })

  it('renders loading indicator when isLoading is true', () => {
    render(<ModelResponseCard modelName="Gemini" content="" isLoading={true} />)
    expect(screen.getByText('Gemini')).toBeInTheDocument()
    expect(screen.getByRole('status')).toBeInTheDocument()
  })
})
