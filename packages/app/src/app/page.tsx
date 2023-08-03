'use client';
import { Button } from '@/components/buttons/slide-button';
import { caveat } from '@/components/layouts/fonts';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  return (
    <main className="flex flex-col items-center">
      <h1
        className={`text-[4rem] mt-24 flex justify-center ${caveat.className}`}
      >
        Alfr3d's Blog
      </h1>
      <div className="mt-24">
        <Button label="slide" onClick={() => router.push('/blogs')}></Button>
      </div>
    </main>
  );
}
