import type { Metadata, Viewport } from 'next';
import ClientLayout from '@/components/client-layout';
import './globals.css';

export const metadata: Metadata = {
  title: 'Interview Simulator',
  description: 'Practice your interview skills with AI-powered simulations',
  generator: 'Next.js',
  applicationName: 'Interview Simulator',
  referrer: 'origin-when-cross-origin',
  keywords: ['Interview', 'Practice', 'AI', 'Simulator', 'Career'],
  authors: [{ name: 'Interview Simulator Team' }],
  creator: 'Interview Simulator Team',
  publisher: 'Interview Simulator',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Interview Simulator',
    description: 'Practice your interview skills with AI-powered simulations',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    siteName: 'Interview Simulator',
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClientLayout>
      {children}
    </ClientLayout>
  );
}
