'use client';
import React, { useEffect } from 'react';
import { annotate } from 'rough-notation';

export default function Page() {
  useEffect(() => {
    const e = document.querySelector<HTMLElement>('#myElement');
    if (e) {
      const annotation = annotate(e, { type: 'highlight', color: '#f9d423' });
      annotation.show();
    }
  }, []);

  return (
    <div className="mx-auto flex h-96 max-w-3xl items-center justify-center"
    >
      <span id="myElement" className="text-2xl font-serif"
      >hello notation</span>
    </div>
  );
}
