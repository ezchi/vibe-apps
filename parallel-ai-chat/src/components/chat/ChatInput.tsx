import React, { useState, KeyboardEvent } from 'react';

interface ChatInputProps {
  onSend: (message: string) => void;
}

export default function ChatInput({ onSend }: ChatInputProps) {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      onSend(input);
      setInput('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="relative flex items-end gap-2 bg-white/30 dark:bg-black/30 backdrop-blur-md rounded-2xl p-2 border border-white/20 shadow-lg">
        <textarea
          className="w-full bg-transparent border-none focus:ring-0 resize-none p-3 text-slate-800 dark:text-slate-100 placeholder-slate-500 dark:placeholder-slate-400 max-h-32 focus:outline-none"
          placeholder="Type a message..."
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim()}
          className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-1 cursor-pointer"
          aria-label="Send"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M3.478 2.404a.75.75 0 00-.926.941l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.404z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
