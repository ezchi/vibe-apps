import { renderHook, act, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { useChat } from './useChat'
import * as mockService from '@/lib/chat/mockChatService'

describe('useChat', () => {
  it('starts with default models', () => {
    const { result } = renderHook(() => useChat())
    expect(result.current.activeModels).toEqual(['ChatGPT', 'Gemini', 'DeepSeek'])
  })

  it('can add and remove models', () => {
    const { result } = renderHook(() => useChat())
    
    act(() => {
      result.current.removeModel('Gemini')
    })
    expect(result.current.activeModels).toEqual(['ChatGPT', 'DeepSeek'])
    
    act(() => {
      result.current.addModel('Claude')
    })
    expect(result.current.activeModels).toEqual(['ChatGPT', 'DeepSeek', 'Claude'])
  })

  it('sends message to all active models', async () => {
    const spy = vi.spyOn(mockService, 'getMockResponse')
    const { result } = renderHook(() => useChat())
    
    act(() => {
      result.current.sendMessage('Hello')
    })
    
    await waitFor(() => {
      expect(result.current.responses['ChatGPT'].isLoading).toBe(false)
    }, { timeout: 2000 })
    
    expect(spy).toHaveBeenCalledTimes(3)
    expect(result.current.responses['ChatGPT'].content).toContain('Hello')
    
    spy.mockRestore()
  })
})
