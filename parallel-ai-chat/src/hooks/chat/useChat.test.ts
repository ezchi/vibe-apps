import { renderHook, act, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { useChat } from './useChat'
import * as mockService from '@/lib/chat/mockChatService'
import { extensionService } from '@/lib/chat/ExtensionService'

vi.mock('@/lib/chat/ExtensionService', () => ({
  extensionService: {
    queryModel: vi.fn(),
    checkExtensionStatus: vi.fn(() => false),
    onStatusChange: vi.fn((cb) => {
      cb(false)
      return () => {}
    })
  }
}))

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

  it('tracks history of messages', async () => {
    const { result } = renderHook(() => useChat())
    
    await act(async () => {
      await result.current.sendMessage('Hello')
    })
    
    expect(result.current.history).toHaveLength(1)
    expect(result.current.history[0].prompt).toBe('Hello')
    expect(result.current.history[0].responses['ChatGPT']).toBeDefined()
  })

  it('uses ExtensionService when extension is ready', async () => {
    vi.mocked(extensionService.onStatusChange).mockImplementation((cb) => {
      cb(true)
      return () => {}
    })
    vi.mocked(extensionService.queryModel).mockResolvedValue({
      success: true,
      data: {
        text: 'Response from extension',
        provider: 'ChatGPT',
        timestamp: new Date().toISOString()
      }
    })

    const { result } = renderHook(() => useChat())
    
    await act(async () => {
      await result.current.sendMessage('Hello extension')
    })

    expect(extensionService.queryModel).toHaveBeenCalledWith('ChatGPT', 'Hello extension')
    expect(result.current.responses['ChatGPT'].content).toBe('Response from extension')
  })
})
