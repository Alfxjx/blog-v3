import './globals.css';
import { LinkButton } from '@/components';

const HomeLink = () => (
  <LinkButton url='/' label='Home'></LinkButton>
);
const BlogLink = () => (
  <LinkButton url='/blogs' label='Blog'></LinkButton>
);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="w-screen h-screen overflow-hidden font-mono bg-gray-950 text-white">
        <section className="flex justify-start item-center">
          <HomeLink></HomeLink>
          <BlogLink></BlogLink>
        </section>
        <header>{children}</header>
      </body>
    </html>
  );
}
