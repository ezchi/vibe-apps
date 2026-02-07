export const getMockResponse = async (model: string, prompt: string, delay: number = 500): Promise<string> => {
  await new Promise(resolve => setTimeout(resolve, delay));
  
  const responses: Record<string, string> = {
    'ChatGPT': `[ChatGPT] This is a mocked response to your prompt: "${prompt}". I am simulating how ChatGPT would respond to this input.`,
    'Gemini': `[Gemini] Processing your request for "${prompt}"... As a mocked AI, I can say that this side-by-side view is looking great!`,
    'DeepSeek': `[DeepSeek] Analysis of "${prompt}" is complete. From a technical standpoint, the integration appears to be working exactly as expected.`,
  };

  return responses[model] || `[${model}] I am a mocked model. You sent: "${prompt}"`;
};
