'use client'
import { Button } from '@blog-v3/lib'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Button label='slide' onClick={() => console.log(1)}></Button>
    </main>
  )
}
