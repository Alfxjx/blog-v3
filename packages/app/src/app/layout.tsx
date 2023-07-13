import './globals.css';
import Link from 'next/link';

const HomeLink = () => <Link href="/">Home</Link>;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <HomeLink></HomeLink>
        <header>{children}</header>
      </body>
    </html>
  );
}
