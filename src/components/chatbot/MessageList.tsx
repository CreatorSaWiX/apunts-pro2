import React from 'react';
import { m as motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Globe, ChevronDown, ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { type Message, MARKDOWN_CLS } from './constants';
import AIStreamingIndicator, { type StreamPhase } from '../AIStreamingIndicator';
import { ThoughtBlock, parseThoughtText } from '../ThoughtBlock';
import { PublishedCodeBlock } from '../ui/extensions/PublishedCodeBlock';

const remarkPluginsConfig = [remarkGfm, remarkMath];
const rehypePluginsConfig = [rehypeKatex];

const formatTime = (ms: number | undefined) => {
  if (!ms) return '';
  const s = Math.floor(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const remainingS = s % 60;
  return remainingS > 0 ? `${m}m ${remainingS}s` : `${m}m`;
};

const ThoughtAccordion = React.memo(({ thoughtText, thoughtTimeMs, t }: { thoughtText: string, thoughtTimeMs?: number, t: any }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const blocks = React.useMemo(() => parseThoughtText(thoughtText || '', t), [thoughtText, t]);
  
  if (!thoughtText || !thoughtText.trim()) return null;
  const timeString = formatTime(thoughtTimeMs);

  return (
    <div className="mb-1 w-full flex flex-col">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 text-slate-400 hover:text-slate-200 transition-colors py-1 w-fit select-none focus:outline-none"
      >
        <span className="text-[14px] font-medium tracking-tight">
          {timeString ? t('chat.process.workedTime', 'Worked for {{time}}', { time: timeString }) : t('chat.process.worked', 'Process')}
        </span>
        <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : '-rotate-90'}`} />
      </button>
      
      {isOpen && (
        <div className="flex flex-col gap-1.5 mt-2 mb-1 pl-1 max-w-2xl">
          {blocks.map((block, idx) => (
             <ThoughtBlock key={idx} block={block} />
          ))}
        </div>
      )}
    </div>
  );
});

const GroundingAccordion = React.memo(({ chunks, t }: { chunks: any[], t: any }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [displayChunks, setDisplayChunks] = React.useState<any[]>(chunks || []);

  React.useEffect(() => {
    setDisplayChunks(chunks || []);

    const needsResolution = (chunks || []).some((c: any) => {
      const uri = c?.web?.uri;
      return typeof uri === 'string' && (uri.includes('vertexaisearch') || uri.includes('grounding-api-redirect'));
    });

    if (needsResolution) {
      fetch('/api/resolve-grounding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chunks }),
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data && Array.isArray(data.chunks)) {
            setDisplayChunks(data.chunks);
          }
        })
        .catch(() => {});
    }
  }, [chunks]);

  const validChunks = React.useMemo(() => {
    return (displayChunks || []).filter((c: any) => c.web?.uri);
  }, [displayChunks]);

  if (validChunks.length === 0) return null;

  /** Extreu el domini net (ex: "fcbarcelona.cat") tolerant redireccions de Google. */
  const extractDomain = (chunk: any): string => {
    let hostname = '';
    try {
      hostname = new URL(chunk.web?.uri || '').hostname.replace(/^www\./, '');
    } catch {}

    const isGoogleRedirect = hostname.includes('vertexaisearch') || hostname.includes('google');
    const rawTitle = (chunk.web?.title || '').trim();

    if (!isGoogleRedirect && hostname) {
      return hostname;
    }
    const match = rawTitle.match(/([a-zA-Z0-9-]+\.[a-zA-Z]{2,})/);
    if (match) return match[1].toLowerCase();
    if (!rawTitle.includes(' ') && rawTitle.includes('.')) return rawTitle.toLowerCase();
    return rawTitle.toLowerCase();
  };

  /** Extreu el nom real de la pàgina i el domini per a la visualització. */
  const parseSourceInfo = (chunk: any) => {
    let hostname = '';
    let pathname = '';
    try {
      const url = new URL(chunk.web?.uri || '');
      hostname = url.hostname.replace(/^www\./, '');
      pathname = decodeURIComponent(url.pathname).replace(/\/$/, '');
    } catch {}

    const isGoogleRedirect = hostname.includes('vertexaisearch') || hostname.includes('google');
    const rawTitle = (chunk.web?.title || '').trim();

    let domain = '';
    if (!isGoogleRedirect && hostname) {
      domain = hostname;
    } else {
      const match = rawTitle.match(/([a-zA-Z0-9-]+\.[a-zA-Z]{2,})/);
      if (match) domain = match[1].toLowerCase();
      else if (!rawTitle.includes(' ') && rawTitle.includes('.')) domain = rawTitle.toLowerCase();
      else domain = rawTitle.toLowerCase();
    }

    let pageTitle = rawTitle;
    const isDomainTitle =
      !rawTitle ||
      rawTitle.toLowerCase() === domain.toLowerCase() ||
      rawTitle.toLowerCase() === `www.${domain}`.toLowerCase();

    // IMPORTANT: Només extraiem la ruta si NO és un redirect de Google
    // (/grounding-api-redirect/... és un token intern de Google, no una secció web!)
    if (!isGoogleRedirect && isDomainTitle && pathname && pathname !== '/') {
      const segments = pathname
        .split('/')
        .filter(Boolean)
        .filter((s) => !['ca', 'es', 'en', 'cat', 'fr', 'de', 'index', 'default', 'home'].includes(s.toLowerCase()))
        .filter((s) => !/^\d+$/.test(s) && !/^[0-9a-f]{16,}$/i.test(s));

      if (segments.length > 0) {
        pageTitle = segments
          .slice(-2)
          .map((s) => s.replace(/[-_]+/g, ' ').replace(/\.[a-zA-Z0-9]+$/, '').trim())
          .filter(Boolean)
          .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
          .join(' › ');
      }
    }

    if (!pageTitle || pageTitle.toLowerCase() === domain.toLowerCase()) {
      pageTitle = domain || 'Pàgina web';
    }

    return {
      domain,
      pageTitle,
      uri: chunk.web?.uri || '#',
    };
  };

  // Favicons únics per a la barra superior resumida
  const uniqueFavicons = React.useMemo(() => {
    const seen = new Set<string>();
    const list: string[] = [];
    for (const c of validChunks) {
      const d = extractDomain(c);
      if (d && !seen.has(d)) {
        seen.add(d);
        list.push(d);
      }
    }
    return list;
  }, [validChunks]);

  return (
    <div className="mb-6 w-full max-w-2xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-sm">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full flex items-center gap-2 px-4 py-3 text-slate-300 hover:bg-white/[0.04] transition-colors focus:outline-none select-none"
      >
        <Globe size={16} className="text-slate-400 shrink-0" />
        <span className="text-sm font-medium text-slate-200">
          {t('chat.searchedWeb', 'Ha cercat a internet')}
        </span>
        
        <div className="flex items-center gap-1.5 ml-auto">
          {uniqueFavicons.slice(0, 3).map((domain, i) => (
            <div key={i} className="w-5 h-5 rounded-full overflow-hidden shrink-0 bg-white/10 flex items-center justify-center shadow-sm">
              <img src={`https://www.google.com/s2/favicons?domain=${domain}&sz=32`} alt="" className="w-full h-full object-cover" />
            </div>
          ))}
          <span className="text-[11px] font-medium bg-white/10 text-slate-300 px-2 py-0.5 rounded-full shadow-sm">
            {validChunks.length === 1 ? '1 font' : `${validChunks.length} fonts`}
          </span>
          <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 ml-1 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {isOpen && (
        <div className="flex flex-col border-t border-white/5 overflow-y-auto custom-scrollbar max-h-[260px] divide-y divide-white/5">
          {validChunks.map((chunk: any, i: number) => {
            const { domain, pageTitle, uri } = parseSourceInfo(chunk);
            const showDomainSubtitle = domain && pageTitle.toLowerCase() !== domain.toLowerCase();

            return (
              <a
                key={i}
                href={uri}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/[0.07] transition-colors group"
                title={`${pageTitle}${domain ? ` (${domain})` : ''}`}
              >
                <div className="w-5 h-5 rounded overflow-hidden shrink-0 bg-white/10 flex items-center justify-center">
                   {domain ? (
                     <img src={`https://www.google.com/s2/favicons?domain=${domain}&sz=32`} alt="" className="w-full h-full object-cover" />
                   ) : (
                     <Globe size={12} className="text-slate-400" />
                   )}
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-[13px] text-slate-200 font-medium truncate group-hover:text-sky-300 transition-colors">
                    {pageTitle}
                  </span>
                  {showDomainSubtitle && (
                    <span className="text-[11px] text-slate-400 truncate">
                      {domain}
                    </span>
                  )}
                </div>
                <ExternalLink size={13} className="text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-1" />
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
});

const markdownComponents = {
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

const MemoizedMessageItem = React.memo(({ msg, user, renderAIAvatar, t }: { msg: Message, user: any, renderAIAvatar: any, t: any }) => {
  return (
    <div className={`flex w-full items-start gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
      {msg.role === 'model' && (
        <div className="w-6 h-6 rounded-md bg-slate-800/80 border border-white/5 flex items-center justify-center shrink-0 mt-1 overflow-hidden">
          {renderAIAvatar(14, "text-slate-400")}
        </div>
      )}
      <div className={`${msg.role === 'user' ? 'max-w-[85%] bg-white/5 border border-white/10 text-slate-100 px-5 py-3 rounded-2xl backdrop-blur-md shadow-lg' : 'text-slate-300 flex-1 min-w-0 max-w-[calc(100%-2.25rem)]'}`}>
        {msg.role === 'user' ? (
          <div className="space-y-2">
            {msg.attachmentName && (
              <div className={`flex items-center gap-1.5 text-xs rounded-lg px-2 py-1 w-fit ${msg.attachmentType === 'image'
                ? 'bg-blue-500/15 border border-blue-400/20 text-blue-300'
                : 'bg-orange-500/15 border border-orange-400/20 text-orange-300'
                }`}>
                <span>{msg.attachmentType === 'image' ? '🖼' : '📄'}</span>
                <span className="truncate max-w-[180px]">{msg.attachmentName}</span>
              </div>
            )}
            {msg.content && <p className="whitespace-pre-wrap text-[15px]">{msg.content}</p>}
          </div>
        ) : (
          <div className="flex flex-col items-start w-full">
            {msg.thoughtText && (
              <ThoughtAccordion thoughtText={msg.thoughtText} thoughtTimeMs={msg.thoughtTimeMs} t={t} />
            )}
            {msg.groundingMetadata?.groundingChunks && (
              <GroundingAccordion chunks={msg.groundingMetadata.groundingChunks} t={t} />
            )}
            <div className={`${MARKDOWN_CLS} w-full`}>
              <ReactMarkdown
                remarkPlugins={remarkPluginsConfig as any}
                rehypePlugins={rehypePluginsConfig as any}
                components={markdownComponents}
              >
                {msg.content}
              </ReactMarkdown>
            </div>
            {msg.addedMemories && msg.addedMemories.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex -mt-1 mb-1 px-2.5 py-1 bg-white/5 border border-white/10 rounded-full text-[11px] font-medium text-slate-400 tracking-wide select-none"
              >
                {t('chat.memoryUpdated', 'Memòria actualitzada')}
              </motion.div>
            )}
          </div>
        )}
      </div>
      {msg.role === 'user' && user && (
        <img
          src={user.avatar}
          alt={user.username}
          className="w-6 h-6 rounded-md shrink-0 mt-1 object-cover border border-white/10"
          onError={(e) => { (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${user.username}`; }}
        />
      )}
    </div>
  );
});

interface MessagesOnlyProps {
  messages: Message[];
  user: { avatar?: string; username?: string } | null;
  renderAIAvatar: (size: number, cls: string) => React.ReactNode;
}

export const MessagesOnly = React.memo<MessagesOnlyProps>(({
  messages,
  user,
  renderAIAvatar,
}) => {
  const { t } = useTranslation();

  return (
    <>
      {messages.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center opacity-50 min-h-[50vh]">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center overflow-hidden mb-4 opacity-70">
            {renderAIAvatar(40, "text-slate-600")}
          </div>
        </div>
      )}
      {messages.map((msg, idx) => (
        <MemoizedMessageItem 
          key={msg.id || `msg-${idx}-${msg.content.substring(0, 10)}`} 
          msg={msg} 
          user={user} 
          renderAIAvatar={renderAIAvatar} 
          t={t} 
        />
      ))}
    </>
  );
});

MessagesOnly.displayName = 'MessagesOnly';

interface ActiveStreamingMessageProps {
  streamPhase: StreamPhase;
  thoughtText: string;
  streamingText: string;
  renderAIAvatar: (size: number, cls: string) => React.ReactNode;
}

export const ActiveStreamingMessage = React.memo<ActiveStreamingMessageProps>(({
  streamPhase,
  thoughtText,
  streamingText,
  renderAIAvatar,
}) => {
  if (streamPhase === 'idle' || streamPhase === 'done') return null;

  return (
    <>
      {(streamPhase === 'connecting' || streamPhase === 'thinking') && (
        <AIStreamingIndicator
          phase={streamPhase}
          thoughtText={thoughtText}
          renderAvatar={renderAIAvatar}
        />
      )}
      {streamPhase === 'writing' && streamingText && (
        <div className="flex w-full items-start gap-3 justify-start">
          <div className="w-6 h-6 rounded-md bg-slate-800/80 border border-white/5 flex items-center justify-center shrink-0 mt-1 overflow-hidden">
            {renderAIAvatar(14, "text-slate-400")}
          </div>
          <div className="text-slate-300 flex-1 min-w-0 max-w-[calc(100%-2.25rem)]">
            <div className={`${MARKDOWN_CLS} ai-cursor-blink`}>
              <ReactMarkdown
                remarkPlugins={remarkPluginsConfig as any}
                rehypePlugins={rehypePluginsConfig as any}
                components={markdownComponents}
              >
                {streamingText}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      )}
    </>
  );
});

ActiveStreamingMessage.displayName = 'ActiveStreamingMessage';

