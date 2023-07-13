'use client';
import { Button } from '@blog-v3/lib';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  return (
    <main className="min-h-screen">
      <h1 className="text-xl font-bold font-mono">Hello.</h1>
      <Button label="slide" onClick={() => router.push('/blogs')}></Button>
    </main>
  );
}
