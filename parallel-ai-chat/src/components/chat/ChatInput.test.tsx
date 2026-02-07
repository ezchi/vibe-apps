import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
// @ts-ignore
import ChatInput from './ChatInput'

describe('ChatInput', () => {
  it('renders input area and send button', () => {
    render(<ChatInput onSend={() => {}} />)
    expect(screen.getByPlaceholderText(/type a message/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument()
  })

  it('calls onSend with input text when button is clicked', () => {
    const handleSend = vi.fn()
    render(<ChatInput onSend={handleSend} />)
    
    const input = screen.getByPlaceholderText(/type a message/i)
    const button = screen.getByRole('button', { name: /send/i })
    
    fireEvent.change(input, { target: { value: 'Hello AI' } })
    fireEvent.click(button)
    
    expect(handleSend).toHaveBeenCalledWith('Hello AI')
    expect(input).toHaveValue('')
  })

  it('calls onSend when Enter key is pressed', () => {
    const handleSend = vi.fn()
    render(<ChatInput onSend={handleSend} />)
    
    const input = screen.getByPlaceholderText(/type a message/i)
    
    fireEvent.change(input, { target: { value: 'Hello AI' } })
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter', charCode: 13 })
    
    expect(handleSend).toHaveBeenCalledWith('Hello AI')
    expect(input).toHaveValue('')
  })
  
  it('does not send on Shift+Enter', () => {
    const handleSend = vi.fn()
    render(<ChatInput onSend={handleSend} />)
    
    const input = screen.getByPlaceholderText(/type a message/i)
    
    fireEvent.change(input, { target: { value: 'Line 1' } })
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter', charCode: 13, shiftKey: true })
    
    expect(handleSend).not.toHaveBeenCalled()
  })

  it('does not send empty message', () => {
    const handleSend = vi.fn()
    render(<ChatInput onSend={handleSend} />)
    
    const button = screen.getByRole('button', { name: /send/i })
    fireEvent.click(button)
    
    expect(handleSend).not.toHaveBeenCalled()
  })

  it('does not send empty message on Enter', () => {
    const handleSend = vi.fn()
    render(<ChatInput onSend={handleSend} />)
    
    const input = screen.getByPlaceholderText(/type a message/i)
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter', charCode: 13 })
    
    expect(handleSend).not.toHaveBeenCalled()
  })
})
