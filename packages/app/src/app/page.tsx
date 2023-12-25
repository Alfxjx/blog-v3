'use client';
import { Button } from '@/components/buttons/slide-button';
import { caveat } from '@/components/layouts/fonts';
import { useRouter } from 'next/navigation';
import WordTree from '@/components/word-tree';
import { RoughNotation } from 'react-rough-notation';

export default function Home() {
  const router = useRouter();
  return (
    <main className="flex flex-col items-center relative">
      <h1
        className={`text-[2rem] md:text-[4rem] leading-normal mt-24 flex flex-col items-center justify-center ${caveat.className}`}
      >
        <p>Alfr3d's Blog:</p>
        <p>
          <span className="mr-2">My own</span>
          <RoughNotation
            type="circle"
            show={true}
            color="green"
            strokeWidth={2}
            animationDelay={250}
          >
            digital garden.
          </RoughNotation>
        </p>
      </h1>
      <div className="mt-24 z-10">
        <Button label="slide" onClick={() => router.push('/blogs')}></Button>
      </div>
      <div className="w-full absolute top-0 left-0">
        <WordTree />
      </div>
    </main>
  );
}
