export interface Message {
  id?: string;
  role: 'user' | 'model';
  content: string;
  attachmentName?: string;
  attachmentType?: 'image' | 'pdf';
  addedMemories?: string[];
}

export interface ChatMeta {
  id: string;
  title: string;
  updatedAt: number;
}

export const MARKDOWN_CLS = `text-sm md:text-[15px]
  [&_p]:leading-relaxed [&_p]:mb-4
  [&_pre]:bg-[#0d1117] [&_pre]:border [&_pre]:border-white/5 [&_pre]:rounded-xl [&_pre]:p-4 [&_pre]:my-4 [&_pre]:overflow-x-auto
  [&_code]:text-slate-200 [&_code]:bg-slate-800/80 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-md [&_code]:font-mono [&_code]:text-[13px]
  [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-slate-300
  [&_a]:text-blue-400 [&_a]:no-underline hover:[&_a]:underline
  [&_h1]:text-slate-100 [&_h1]:font-semibold [&_h1]:text-xl [&_h1]:mb-3 [&_h1]:mt-6
  [&_h2]:text-slate-100 [&_h2]:font-semibold [&_h2]:text-lg [&_h2]:mb-3 [&_h2]:mt-6
  [&_h3]:text-slate-100 [&_h3]:font-semibold [&_h3]:text-base [&_h3]:mb-2 [&_h3]:mt-4
  [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-4 [&_ul]:marker:text-slate-500
  [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-4 [&_ol]:marker:text-slate-500
  [&_li]:my-1.5 [&_li>p]:inline
  [&_strong]:text-slate-200 [&_strong]:font-semibold
  [&_blockquote]:border-l-2 [&_blockquote]:border-slate-600 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-slate-400`;
