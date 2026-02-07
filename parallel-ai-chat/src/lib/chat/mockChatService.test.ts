import { describe, it, expect } from 'vitest'
import { getMockResponse } from './mockChatService'

describe('mockChatService', () => {
  it('returns a mock response for ChatGPT', async () => {
    const response = await getMockResponse('ChatGPT', 'Hello')
    expect(response).toContain('[ChatGPT]')
    expect(response).toContain('Hello')
  })

  it('returns a mock response for Gemini', async () => {
    const response = await getMockResponse('Gemini', 'Tell me a joke')
    expect(response).toContain('[Gemini]')
    expect(response).toContain('joke')
  })

  it('returns a mock response for DeepSeek', async () => {
    const response = await getMockResponse('DeepSeek', 'Explain quantum physics')
    expect(response).toContain('[DeepSeek]')
    expect(response).toContain('quantum physics')
  })
  
  it('simulates a delay', async () => {
    const start = Date.now()
    await getMockResponse('ChatGPT', 'Wait', 100)
    const end = Date.now()
    expect(end - start).toBeGreaterThanOrEqual(100)
  })

  it('returns a default response for unknown model', async () => {
    const response = await getMockResponse('UnknownModel', 'Hello')
    expect(response).toContain('[UnknownModel]')
    expect(response).toContain('Hello')
  })
})
