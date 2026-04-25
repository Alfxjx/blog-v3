import Link from 'next/link';

type ILink = { href: string; label: string };

const LinkButton = ({ href, label }: ILink) => (
  <Link
    className="relative mx-3 text-sm font-medium tracking-wide text-stone-600 transition-colors hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 group"
    href={href}
  >
    {label}
    <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-accent transition-all duration-300 group-hover:w-full dark:bg-accent-dark" />
  </Link>
);

export { LinkButton, type ILink };
