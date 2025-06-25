'use client';

import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import MainNav from '@/components/main-nav';
import ErrorBoundary from '@/components/error-boundary';
import { AuthProvider } from '@/components/auth-provider';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-background font-sans antialiased`}>
        <ErrorBoundary showNavigation>
          <AuthProvider>
            <ThemeProvider>
              <div className="flex min-h-screen flex-col">
                <header className="border-b bg-background sticky top-0 z-50">
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
                <Toaster position="top-center" />
              </div>
            </ThemeProvider>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
