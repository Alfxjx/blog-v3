import Link from 'next/link';

type ILink = { url: string; label: string };

const LinkButton = ({ url, label }: ILink) => (
  <Link className="mx-2" href={url}>
    {label}
  </Link>
);

export { LinkButton, type ILink };
