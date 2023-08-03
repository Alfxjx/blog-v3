import './globals.css';
import { Footer } from '@/components/layouts/Footer';
import { Header } from '@/components/layouts/Header';
import { TailwindIndicator } from '@/components/dev/tailwind-indicator';
import { ThemeProvider } from '@/components/theme/theme-provider';
import { cn } from '@/utils';
import { noto } from '@/components/layouts/fonts';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn('min-h-screen flex flex-col font-mono', noto.variable)}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Header></Header>
          <main className="flex-1">{children}</main>
          <Footer />
          <TailwindIndicator />
        </ThemeProvider>
      </body>
    </html>
  );
}
