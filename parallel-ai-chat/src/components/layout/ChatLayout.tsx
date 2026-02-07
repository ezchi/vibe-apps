import React from 'react';

interface ChatLayoutProps {
  children: React.ReactNode;
}

export default function ChatLayout({ children }: ChatLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 p-4 font-sans">
      <main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-[1920px] mx-auto">
        {children}
      </main>
    </div>
  );
}
