import Link from 'next/link';

type ILink = { href: string; label: string };

const LinkButton = ({ href, label }: ILink) => (
  <Link className="mx-2" href={href}>
    {label}
  </Link>
);

export { LinkButton, type ILink };
