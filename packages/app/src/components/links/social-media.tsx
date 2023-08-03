import Link from 'next/link';
import { BsGithub, BsTwitter } from 'react-icons/bs';

export const SocialMedia = () => (
  <div>
    <Link href={'http://github.com/alfxjx'}>
      <BsGithub />
    </Link>
    <Link href={'http://twitter.com/alfxjx'}>
      <BsTwitter />
    </Link>
  </div>
);
