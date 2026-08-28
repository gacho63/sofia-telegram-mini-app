import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://sofia-latam-academy.ggter545.chatgpt.site'),
  title: 'София — твой наставник в трейдинге',
  description: 'Научись понимать сигналы и подготовься к первой торговой сессии шаг за шагом.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'София — твой наставник в трейдинге',
    description: 'Научись понимать сигналы и подготовься к первой торговой сессии шаг за шагом.',
    images: ['/og.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'София — твой наставник в трейдинге',
    description: 'Научись понимать сигналы и подготовься к первой торговой сессии шаг за шагом.',
    images: ['/og.png'],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#f1f5fb',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
