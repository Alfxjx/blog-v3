'use client';
import { Button } from '@blog-v3/lib';
import { useRouter } from 'next/navigation';
import { SpotlightLink } from '@/components';

export default function Home() {
  const router = useRouter();
  return (
    <main className="min-h-screen flex flex-col items-center justify-around">
      <h1 className='text-[2rem]'>
        <SpotlightLink label="Hello, World"></SpotlightLink>
      </h1>
      <Button label="slide" onClick={() => router.push('/blogs')}></Button>
    </main>
  );
}
