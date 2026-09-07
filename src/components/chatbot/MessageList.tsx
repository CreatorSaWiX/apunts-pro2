import React from 'react';
import { m as motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import { type Message, MARKDOWN_CLS } from './constants';
import AIStreamingIndicator, { type StreamPhase } from '../AIStreamingIndicator';
import { ThoughtAccordion } from './ThoughtAccordion';
import { GroundingAccordion } from './GroundingAccordion';
import { markdownComponents } from './markdownComponents';

const remarkPluginsConfig = [remarkGfm, remarkMath];
const rehypePluginsConfig = [rehypeKatex];

interface MemoizedMessageItemProps {
  msg: Message;
  user: any;
  renderAIAvatar: (size: number, cls: string) => React.ReactNode;
  t: TFunction;
}

const MemoizedMessageItem = React.memo<MemoizedMessageItemProps>(({ msg, user, renderAIAvatar, t }) => {
  return (
    <div className={`flex w-full items-start gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
      {msg.role === 'model' && (
        <div className="w-6 h-6 rounded-md bg-slate-800/80 border border-white/5 flex items-center justify-center shrink-0 mt-1 overflow-hidden">
          {renderAIAvatar(14, 'text-slate-400')}
        </div>
      )}
      <div
        className={`${
          msg.role === 'user'
            ? 'max-w-[85%] bg-white/5 border border-white/10 text-slate-100 px-5 py-3 rounded-2xl backdrop-blur-md shadow-lg'
            : 'text-slate-300 flex-1 min-w-0 max-w-[calc(100%-2.25rem)]'
        }`}
      >
        {msg.role === 'user' ? (
          <div className="space-y-2">
            {msg.attachmentName && (
              <div
                className={`flex items-center gap-1.5 text-xs rounded-lg px-2 py-1 w-fit ${
                  msg.attachmentType === 'image'
                    ? 'bg-blue-500/15 border border-blue-400/20 text-blue-300'
                    : 'bg-orange-500/15 border border-orange-400/20 text-orange-300'
                }`}
              >
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
          onError={(e) => {
            (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/initials/svg?seed=${user.username}`;
          }}
        />
      )}
    </div>
  );
});

MemoizedMessageItem.displayName = 'MemoizedMessageItem';

interface MessagesOnlyProps {
  messages: Message[];
  user: { avatar?: string; username?: string } | null;
  renderAIAvatar: (size: number, cls: string) => React.ReactNode;
}

export const MessagesOnly = React.memo<MessagesOnlyProps>(({ messages, user, renderAIAvatar }) => {
  const { t } = useTranslation();

  return (
    <>
      {messages.length === 0 && (
        <div className="flex-1 flex flex-col items-center justify-center opacity-50 min-h-[50vh]">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center overflow-hidden mb-4 opacity-70">
            {renderAIAvatar(40, 'text-slate-600')}
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

export const ActiveStreamingMessage = React.memo<ActiveStreamingMessageProps>(
  ({ streamPhase, thoughtText, streamingText, renderAIAvatar }) => {
    if (streamPhase === 'idle' || streamPhase === 'done') return null;

    return (
      <>
        {(streamPhase === 'connecting' || streamPhase === 'thinking') && (
          <AIStreamingIndicator phase={streamPhase} thoughtText={thoughtText} renderAvatar={renderAIAvatar} />
        )}
        {streamPhase === 'writing' && streamingText && (
          <div className="flex w-full items-start gap-3 justify-start">
            <div className="w-6 h-6 rounded-md bg-slate-800/80 border border-white/5 flex items-center justify-center shrink-0 mt-1 overflow-hidden">
              {renderAIAvatar(14, 'text-slate-400')}
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
  }
);

ActiveStreamingMessage.displayName = 'ActiveStreamingMessage';
