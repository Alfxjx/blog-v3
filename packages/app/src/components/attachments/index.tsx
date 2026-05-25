import type { Attachment } from '@/core/markdown-getter';

interface AttachmentsProps {
  attachments: Attachment[];
}

export const Attachments = ({ attachments }: AttachmentsProps) => {
  if (!attachments || attachments.length === 0) {
    return null;
  }

  return (
    <section className="mt-8 rounded-xl border border-stone-200 bg-stone-50 p-6 dark:border-stone-800 dark:bg-stone-900/50">
      <h3 className="mb-4 text-lg font-medium text-stone-700 dark:text-stone-200">
        附件
      </h3>
      <ul className="space-y-3">
        {attachments.map((attachment, index) => (
          <li key={index}>
            <a
              href={attachment.path}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-lg border border-stone-200 bg-white px-4 py-3 text-sm text-stone-600 transition-colors hover:border-accent hover:text-accent dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300 dark:hover:border-accent-dark dark:hover:text-accent-dark"
            >
              <span className="rounded bg-red-100 px-1.5 py-0.5 text-xs font-medium text-red-600 dark:bg-red-900/30 dark:text-red-400">
                PDF
              </span>
              <span className="font-medium">{attachment.name}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
};
