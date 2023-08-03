import { Noto_Sans_Mono, Caveat } from 'next/font/google';

const noto = Noto_Sans_Mono({
  weight: '500',
  subsets: ['latin'],
  variable: '--font-noto-mono',
});

const caveat = Caveat({
  subsets: ['latin'],
});

export { noto, caveat };
