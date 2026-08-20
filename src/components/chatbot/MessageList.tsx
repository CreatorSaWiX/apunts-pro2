import React from 'react';
import { m as motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Globe, ChevronDown, Brain } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { type Message, MARKDOWN_CLS } from './constants';
import AIStreamingIndicator, { type StreamPhase } from '../AIStreamingIndicator';
import { ThoughtBlock, parseThoughtText } from '../ThoughtBlock';

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
  
  if (!thoughtText || !thoughtText.trim()) return null;
  const blocks = React.useMemo(() => parseThoughtText(thoughtText, t), [thoughtText, t]);
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
  const validChunks = chunks.filter((c: any) => c.web?.uri && c.web?.title);
  if (validChunks.length === 0) return null;

  const topChunks = validChunks.slice(0, 3);
  const extraCount = validChunks.length - 3;

  /** Extracts favicon and display domains from a grounding chunk. */
  const parseDomain = (chunk: any): { favicon: string; display: string } => {
    let hostname = '';
    try { hostname = new URL(chunk.web.uri).hostname.replace('www.', ''); } catch {}
    const isRedirect = hostname.includes('vertexaisearch') || hostname.includes('google');
    const domain = isRedirect ? '' : hostname;
    const isTitleDomain = !chunk.web.title.includes(' ') && chunk.web.title.includes('.');
    const favicon = domain || (isTitleDomain ? chunk.web.title : '');
    // Hide display domain if it's the same as the title
    const display = (domain && chunk.web.title.toLowerCase() !== domain.toLowerCase()) ? domain : '';
    return { favicon, display };
  };

  return (
    <div className="mb-6 w-full max-w-2xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full flex items-center gap-2 px-4 py-3 text-slate-300 hover:bg-white/[0.04] transition-colors focus:outline-none"
      >
        <Globe size={16} className="text-slate-400 shrink-0" />
        <span className="text-sm font-medium text-slate-200">{t('chat.searchedWeb', 'Ha cercat a internet')}</span>
        
        <div className="flex items-center gap-1.5 ml-auto">
          {topChunks.map((chunk, i) => {
            const { favicon } = parseDomain(chunk);
            return (
              <div key={i} className="w-5 h-5 rounded-full overflow-hidden shrink-0 bg-white/10 flex items-center justify-center shadow-sm">
                {favicon ? <img src={`https://www.google.com/s2/favicons?domain=${favicon}&sz=32`} alt="" className="w-full h-full object-cover" /> : <Globe size={10} className="text-slate-400" />}
              </div>
            );
          })}
          {extraCount > 0 && (
            <span className="text-[10px] font-medium bg-white/10 text-slate-300 px-1.5 py-0.5 rounded-full shadow-sm">
              +{extraCount}
            </span>
          )}
          <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 ml-1 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </button>

      {isOpen && (
        <div className="flex flex-col border-t border-white/5 overflow-y-auto custom-scrollbar max-h-[220px] divide-y divide-white/5">
          {validChunks.map((chunk: any, i: number) => {
            const { favicon, display } = parseDomain(chunk);

            return (
              <a
                key={i}
                href={chunk.web.uri}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.07] transition-colors group"
                title={chunk.web.title}
              >
                <div className="w-5 h-5 rounded overflow-hidden shrink-0 bg-white/10 flex items-center justify-center">
                   {favicon ? <img src={`https://www.google.com/s2/favicons?domain=${favicon}&sz=32`} alt="" className="w-full h-full object-cover" /> : <Globe size={12} className="text-slate-400" />}
                </div>
                <span className="text-[13px] text-slate-300 font-medium truncate group-hover:text-slate-200 transition-colors flex-1">{chunk.web.title}</span>
                {display && <span className="text-[11px] text-slate-500 shrink-0 ml-4 max-w-[120px] truncate">{display}</span>}
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
});

const MemoizedMessageItem = React.memo(({ msg, user, renderAIAvatar, t }: { msg: Message, user: any, renderAIAvatar: any, t: any }) => {
  return (
    <div className={`flex w-full items-start gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
      {msg.role === 'model' && (
        <div className="w-6 h-6 rounded-md bg-slate-800/80 border border-white/5 flex items-center justify-center shrink-0 mt-1 overflow-hidden">
          {renderAIAvatar(14, "text-slate-400")}
        </div>
      )}
      <div className={`max-w-[85%] ${msg.role === 'user' ? 'bg-white/5 border border-white/10 text-slate-100 px-5 py-3 rounded-2xl backdrop-blur-md shadow-lg' : 'text-slate-300'}`}>
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
              <ReactMarkdown remarkPlugins={remarkPluginsConfig as any} rehypePlugins={rehypePluginsConfig as any}>{msg.content}</ReactMarkdown>
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
          <div className="max-w-[85%] text-slate-300">
            <div className={`${MARKDOWN_CLS} ai-cursor-blink`}>
              <ReactMarkdown remarkPlugins={remarkPluginsConfig as any} rehypePlugins={rehypePluginsConfig as any}>{streamingText}</ReactMarkdown>
            </div>
          </div>
        </div>
      )}
    </>
  );
});

ActiveStreamingMessage.displayName = 'ActiveStreamingMessage';

