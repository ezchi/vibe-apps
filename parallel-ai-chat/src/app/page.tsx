'use client';

import React, { useState } from 'react';
import ChatLayout from '@/components/layout/ChatLayout';
import ChatInput from '@/components/chat/ChatInput';
import ModelResponseCard from '@/components/chat/ModelResponseCard';

export default function Home() {
  const [lastMessage, setLastMessage] = useState<string>('');
  
  const handleSend = (msg: string) => {
    setLastMessage(msg);
    console.log('Sent:', msg);
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-hidden">
        <ChatLayout>
          <ModelResponseCard 
            modelName="ChatGPT" 
            content={lastMessage ? `[ChatGPT Mock]: I received your message: "${lastMessage}". Here is a response demonstrating the card layout.` : "ChatGPT is ready."} 
          />
          <ModelResponseCard 
            modelName="Gemini" 
            content="[Gemini Mock]: I am currently processing..." 
            isLoading={!lastMessage} 
          />
          <ModelResponseCard 
            modelName="DeepSeek" 
            content={lastMessage ? `[DeepSeek Mock]: Analysis of "${lastMessage}" complete.` : "DeepSeek is ready."} 
          />
        </ChatLayout>
      </div>
      <ChatInput onSend={handleSend} />
    </div>
  );
}