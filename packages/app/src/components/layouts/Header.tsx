import { LinkButton } from '../links/base';
import { cn } from '@/utils';
import { caveat } from './fonts';
import Link from 'next/link';
import { ThemeToggle } from '../theme/theme-toggle';

const HomeLink = () => <LinkButton href="/" label="Home"></LinkButton>;
const BlogLink = () => <LinkButton href="/blogs" label="Blog"></LinkButton>;
const AboutLink = () => <LinkButton href="/about" label="About"></LinkButton>;
const ShortLink = () => <LinkButton href="/short" label="Short"></LinkButton>;

function Header() {
  return (
    <section className="flex-0 flex justify-between item-center box-border p-2 border-b-[1px]">
      <div className="mr-2">
        <Link href={'/'}>
          <p className={cn(caveat.className)}>Alfr3d</p>
        </Link>
      </div>
      <div className="flex items-center">
        <HomeLink></HomeLink>
        <BlogLink></BlogLink>
        <AboutLink></AboutLink>
        <ShortLink></ShortLink>
        <span className="ml-2">
          <ThemeToggle />
        </span>
      </div>
    </section>
  );
}

export { Header, HomeLink, BlogLink, AboutLink, ShortLink };
