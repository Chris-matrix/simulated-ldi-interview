'use client';

import dynamic from 'next/dynamic';

// @ts-ignore
const inter = { className: 'font-sans' };

// Dynamically import MainNav to avoid SSR issues with browser APIs
const MainNav = dynamic(() => import('@/components/main-nav'), { ssr: false });

// @ts-ignore
export default function ClientLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <body className="min-h-screen bg-background">
        <div className="flex min-h-screen flex-col">
          <header className="sticky top-0 z-50 border-b bg-background">
            <div className="container flex h-16 items-center justify-between px-4">
              <a href="/" className="text-lg font-semibold">
                Interview Simulator
              </a>
              <MainNav />
            </div>
          </header>
          <main className="flex-1">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
