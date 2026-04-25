import './globals.css';
import { Footer } from '@/components/layouts/Footer';
import { Header } from '@/components/layouts/Header';
import { TailwindIndicator } from '@/components/dev/tailwind-indicator';
import { ThemeProvider } from '@/components/theme/theme-provider';
import { inter, serif, mono, caveat } from '@/components/layouts/fonts';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: "Alfr3d's Blog",
    template: "%s | Alfr3d's Blog",
  },
  description:
    'Standing at the crossroads of technology and humanity. Writing about code, life, and everything in between.',
  keywords: ['blog', 'technology', 'programming', 'life', '前端', 'Next.js'],
  authors: [{ name: 'Alfr3d', url: 'https://alfxjx.github.io' }],
  creator: 'Alfr3d',
  metadataBase: new URL('https://alfxjx.github.io'),
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: 'https://alfxjx.github.io',
    siteName: "Alfr3d's Blog",
    title: "Alfr3d's Blog",
    description:
      'Standing at the crossroads of technology and humanity. Writing about code, life, and everything in between.',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Alfr3d's Blog",
    description:
      'Standing at the crossroads of technology and humanity. Writing about code, life, and everything in between.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${serif.variable} ${mono.variable} ${caveat.variable}`}
    >
      <body className="flex min-h-screen flex-col bg-[var(--bg)] text-[var(--fg)] font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Header />
          <main className="mx-auto w-full max-w-5xl flex-1 px-4 pt-24">
            {children}
          </main>
          <Footer />
          <TailwindIndicator />
        </ThemeProvider>
      </body>
    </html>
  );
}
