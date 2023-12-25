'use client';
import React, { useEffect } from 'react';
import { annotate } from 'rough-notation';

export default async function Page() {
  useEffect(() => {
    const e = document.querySelector<HTMLElement>('#myElement');
    if (e) {
      const annotation = annotate(e, { type: 'highlight', color: '#f9d423' });
      annotation.show();
    }
  }, []);

  return (
    <div className="w-full h-96 mx-auto">
      <span id="myElement">hello notation</span>
    </div>
  );
}
