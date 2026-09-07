import React from 'react';
import { PublishedCodeBlock } from '../ui/extensions/PublishedCodeBlock';

export const markdownComponents = {
  table: ({ node, ...props }: any) => (
    <div className="my-5 w-full overflow-x-auto rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-sm shadow-sm custom-scrollbar">
      <table className="w-full text-left text-[13px] md:text-[13.5px] border-collapse" {...props} />
    </div>
  ),
  thead: ({ node, ...props }: any) => (
    <thead className="bg-white/[0.06] border-b border-white/10 text-slate-200" {...props} />
  ),
  th: ({ node, ...props }: any) => (
    <th className="px-3.5 py-2.5 text-[11px] md:text-xs uppercase tracking-wider font-semibold text-slate-200 whitespace-nowrap" {...props} />
  ),
  tr: ({ node, ...props }: any) => (
    <tr className="border-b border-white/[0.06] last:border-b-0 hover:bg-white/[0.03] transition-colors" {...props} />
  ),
  td: ({ node, ...props }: any) => (
    <td className="px-3.5 py-2.5 text-slate-300 align-middle whitespace-normal leading-relaxed" {...props} />
  ),
  pre: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
  code: ({ node, inline, className, children, ...props }: any) => {
    const match = /language-(\w+)/.exec(className || '');
    const codeString = String(children).replace(/\n$/, '');

    if (!inline && (match || codeString.includes('\n'))) {
      return (
        <PublishedCodeBlock
          language={match ? match[1] : 'auto'}
          code={codeString}
        />
      );
    }

    return (
      <code className="text-slate-200 bg-slate-800/80 px-1.5 py-0.5 rounded-md font-mono text-[13px]" {...props}>
        {children}
      </code>
    );
  },
};
