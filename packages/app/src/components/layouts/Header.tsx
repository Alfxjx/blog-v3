import localFont from "next/font/local";
import { LinkButton } from "../links/base";

const CaveatFont = localFont({
    src: './Caveat.ttf',
  });
  
  const HomeLink = () => <LinkButton href="/" label="Home"></LinkButton>;
  const BlogLink = () => <LinkButton href="/blogs" label="Blog"></LinkButton>;
  const AboutLink = () => <LinkButton href="/about" label="About"></LinkButton>;

export function Header() {
  return (
    <section className="flex-0 flex justify-start item-center box-border p-2 border-b-[1px]">
      <div className="mr-2">
        <p className={`${CaveatFont.className}`}>Alfr3d</p>
      </div>
      <HomeLink></HomeLink>
      <BlogLink></BlogLink>
      <AboutLink></AboutLink>
    </section>
  );
}
