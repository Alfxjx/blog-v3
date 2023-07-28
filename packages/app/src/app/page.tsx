'use client';
import { Button } from '@blog-v3/lib';
import { useRouter } from 'next/navigation';
import { LinkButton } from '@/components';

export default function Home() {
  const router = useRouter();
  return (
    <main className="flex flex-col items-center">
      <h1 className="text-[2rem] mt-24 flex justify-center">
        <LinkButton label="Alfr3d's Blog" href={'/blog'}></LinkButton>
      </h1>
      <div className="mt-24">
        <Button label="slide" onClick={() => router.push('/blogs')}></Button>
      </div>
    </main>
  );
}
