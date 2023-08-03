'use client';
import { Button } from '@/components/buttons/slide-button';
import { caveat } from '@/components/layouts/fonts';
import { useRouter } from 'next/navigation';
import WordTree from '@/components/word-tree';

export default function Home() {
  const router = useRouter();
  return (
    <main className="flex flex-col items-center relative">
      <h1
        className={`text-[4rem] mt-24 flex justify-center ${caveat.className}`}
      >
        Alfr3d's Blog
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
