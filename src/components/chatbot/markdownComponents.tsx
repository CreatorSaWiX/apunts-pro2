import React from 'react';
import type { Components } from 'react-markdown';
import { PublishedCodeBlock } from '../ui/extensions/PublishedCodeBlock';

export const markdownComponents: Components = {
  table: ({ children, node: _node, ...props }) => (
    <div className="my-5 w-full overflow-x-auto rounded-2xl border border-white/10 bg-slate-900/40 backdrop-blur-sm shadow-sm custom-scrollbar">
      <table className="w-full text-left text-[13px] md:text-[13.5px] border-collapse" {...props}>
        {children}
      </table>
    </div>
  ),
  thead: ({ children, node: _node, ...props }) => (
    <thead className="bg-white/[0.06] border-b border-white/10 text-slate-200" {...props}>
      {children}
    </thead>
  ),
  th: ({ children, node: _node, ...props }) => (
    <th className="px-3.5 py-2.5 text-[11px] md:text-xs uppercase tracking-wider font-semibold text-slate-200 whitespace-nowrap" {...props}>
      {children}
    </th>
  ),
  tr: ({ children, node: _node, ...props }) => (
    <tr className="border-b border-white/[0.06] last:border-b-0 hover:bg-white/[0.03] transition-colors" {...props}>
      {children}
    </tr>
  ),
  td: ({ children, node: _node, ...props }) => (
    <td className="px-3.5 py-2.5 text-slate-300 align-middle whitespace-normal leading-relaxed" {...props}>
      {children}
    </td>
  ),
  pre: ({ children, node: _node, ..._props }) => <>{children}</>,
  a: ({ href, children, node: _node, ...props }) => {
    const isExternal = typeof href === 'string' && (href.startsWith('http://') || href.startsWith('https://'));
    return (
      <a
        href={href}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        className="text-sky-400 hover:text-sky-300 underline underline-offset-2 transition-colors"
        {...props}
      >
        {children}
      </a>
    );
  },
  code: ({ className, children, node: _node, ...props }) => {
    const match = /language-(\w+)/.exec(className || '');
    const codeString = String(children).replace(/\n$/, '');

    if (match || codeString.includes('\n')) {
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
