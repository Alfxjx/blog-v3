import './globals.css';
import { Noto_Sans_Mono } from 'next/font/google';

import { Footer } from '@/components/layouts/Footer';
import { Header } from '@/components/layouts/Header';

const noto = Noto_Sans_Mono({
  weight: "500",
  subsets: ['latin'],
  variable: '--font-noto-mono'
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`min-h-screen flex flex-col ${noto.variable} font-mono`}>
        <Header></Header>
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
