import './globals.css';

import { Footer } from '@/components/layouts/Footer';
import { Header } from '@/components/layouts/Header';



export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen font-mono flex flex-col">
        <Header></Header>
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
