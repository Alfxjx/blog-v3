'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { FaShareAlt, FaDownload } from 'react-icons/fa';
import { toPng } from 'html-to-image';
import { QRCodeSVG } from 'qrcode.react';

function formatNumber(n: number): string {
  const str = n.toString();
  return str.length > 1 ? str : `0${str}`;
}

function formatDate(inputTime: Date | number, format: string): string {
  let time: Date;
  if (typeof inputTime === 'number') {
    time = String(inputTime).length === 10 ? new Date(inputTime * 1000) : new Date(inputTime);
  } else {
    time = inputTime;
  }
  const yyyy = time.getFullYear();
  const M = time.getMonth() + 1;
  const d = time.getDate();
  const h = time.getHours();
  const m = time.getMinutes();
  const s = time.getSeconds();
  const templates = [
    { reg: 'yyyy', value: yyyy },
    { reg: 'MM', value: formatNumber(M) },
    { reg: 'M', value: M },
    { reg: 'dd', value: formatNumber(d) },
    { reg: 'd', value: d },
    { reg: 'hh', value: formatNumber(h) },
    { reg: 'h', value: h },
    { reg: 'mm', value: formatNumber(m) },
    { reg: 'm', value: m },
    { reg: 'ss', value: formatNumber(s) },
    { reg: 's', value: s },
  ];
  let result = format;
  for (const t of templates) {
    result = result.replace(t.reg, t.value.toString());
  }
  return result;
}

interface ShareCardProps {
  title: string;
  excerpt?: string;
  date: string;
  author?: { name: string; picture?: string };
  tag?: string;
  slug: string;
  coverImage?: string;
}

export function ShareCard({ title, excerpt, date, author, tag, slug, coverImage }: ShareCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setShareUrl(`${window.location.origin}/blogs/${encodeURIComponent(slug)}`);
    }
  }, [slug]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleDownload = useCallback(async () => {
    if (!cardRef.current) return;
    setIsGenerating(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 2,
        cacheBust: true,
      });
      const link = document.createElement('a');
      link.download = `share-${slug}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to generate share image:', err);
    } finally {
      setIsGenerating(false);
    }
  }, [slug]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1.5 text-sm text-stone-500 transition-colors hover:text-accent dark:text-stone-400 dark:hover:text-accent-dark"
        aria-label="生成分享图"
        title="生成分享图"
      >
        <FaShareAlt size={14} />
        <span className="hidden sm:inline">分享</span>
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="flex max-h-[90vh] w-full max-w-2xl flex-col items-center gap-6 overflow-hidden rounded-xl border border-stone-200 bg-[var(--bg)] p-6 shadow-2xl dark:border-stone-700"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-medium text-stone-800 dark:text-stone-100">
              分享这篇文章
            </h3>

            <div className="w-full overflow-auto rounded-lg">
              <div
                ref={cardRef}
                className="relative flex w-[600px] flex-col bg-stone-50"
              >
                <div className="h-1.5 w-full bg-accent" />

                {coverImage && (
                  <div className="h-40 w-full overflow-hidden">
                    <img
                      src={coverImage}
                      alt={title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}

                <div className="flex flex-1 flex-col p-8">
                  <h2 className="font-serif text-2xl font-medium leading-tight text-stone-800">
                    {title}
                  </h2>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-stone-400">
                    <span>{formatDate(new Date(date), 'yyyy-MM-dd')}</span>
                    {author?.name && (
                      <>
                        <span>·</span>
                        <span>{author.name}</span>
                      </>
                    )}
                    {tag && (
                      <>
                        <span>·</span>
                        <span>{tag}</span>
                      </>
                    )}
                  </div>

                  <div className="mt-5 flex flex-1 items-end gap-6">
                    <p className="line-clamp-3 flex-1 text-sm leading-relaxed text-stone-500">
                      {excerpt || '阅读全文，探索更多精彩内容。'}
                    </p>

                    <div className="flex shrink-0 flex-col items-center">
                      {shareUrl ? (
                        <QRCodeSVG
                          value={shareUrl}
                          size={120}
                          level="M"
                          bgColor="#fafaf9"
                          fgColor="#1c1917"
                        />
                      ) : (
                        <div className="h-[120px] w-[120px] animate-pulse rounded bg-stone-200" />
                      )}
                      <span className="mt-2 text-xs text-stone-400">扫码阅读全文</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end px-8 pb-4">
                  <span className="text-xs text-stone-300">Alfr3d&apos;s Blog</span>
                </div>
              </div>
            </div>

            <div className="flex w-full items-center justify-center gap-3">
              <button
                onClick={handleDownload}
                disabled={isGenerating || !shareUrl}
                className="inline-flex items-center gap-2 rounded-full bg-accent px-6 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                <FaDownload size={14} />
                {isGenerating ? '生成中...' : '下载分享图'}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full border border-stone-200 px-6 py-2.5 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-50 dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-800"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
