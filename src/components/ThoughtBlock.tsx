import React, { useState } from 'react';
import { Search, Server, AlertCircle, XCircle, Brain, Terminal, ChevronRight } from 'lucide-react';

export const getIcon = (emoji: string) => {
    switch(emoji) {
        case '🔍': return <Search size={14} className="text-blue-400" />;
        case '📡': return <Server size={14} className="text-emerald-400" />;
        case '⚠️': return <AlertCircle size={14} className="text-amber-400" />;
        case '❌': return <XCircle size={14} className="text-rose-400" />;
        case '🧠': return <Brain size={14} className="text-purple-400" />;
        default: return <Terminal size={14} className="text-slate-400" />;
    }
};

const translateText = (text: string, t?: any) => {
    if (!t || !text) return text;
    
    const trimmed = text.trim();
    if (trimmed.startsWith('i18n:')) {
        const parts = trimmed.substring(5).split(':');
        const key = parts[0];
        const args = parts.slice(1);
        
        let translated = text;
        switch (key) {
            case 'analyzingIntent': translated = t('chat.process.analyzingIntent'); break;
            case 'searchDetected': translated = t('chat.process.searchDetected'); break;
            case 'searchNotNeeded': translated = t('chat.process.searchNotNeeded'); break;
            case 'searchFailed': translated = t('chat.process.searchFailed'); break;
            case 'requestingModel': translated = t('chat.process.requestingModel', { model: args[0] }); break;
            case 'modelNoSearch': translated = t('chat.process.modelNoSearch', { model: args[0] }); break;
            case 'modelDenied': 
                const reasonKey = args[1];
                const translatedReason = t(`chat.process.${reasonKey}`, { defaultValue: reasonKey });
                translated = t('chat.process.modelDenied', { model: args[0], reason: translatedReason }); 
                break;
        }
        
        // Preserve original whitespace (e.g., indentation for raw thoughts)
        return text.replace(trimmed, translated);
    }
    return text;
};

export const parseThoughtText = (text: string, t?: any) => {
    const blocks: any[] = [];
    const lines = text.split('\n');
    let currentBlock: any = null;
    
    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();
        if (!trimmed && !currentBlock) continue;
        
        const emojiMatch = trimmed.match(/^(🔍|📡|❌|⚠️|🧠)\s*(.*)/);
        
        if (emojiMatch) {
            if (currentBlock) blocks.push(currentBlock);
            currentBlock = {
                icon: emojiMatch[1],
                title: translateText(emojiMatch[2] || (t ? t('chat.process.defaultTitle') : 'Procés'), t),
                content: ''
            };
        } else {
            if (!currentBlock) {
                currentBlock = {
                    icon: '🧠',
                    title: t ? t('chat.process.thoughtTitle') : 'Pensament de l\'IA',
                    content: ''
                };
            }
            currentBlock.content += (currentBlock.content ? '\n' : '') + translateText(line, t);
        }
    }
    if (currentBlock) blocks.push(currentBlock);
    
    blocks.forEach(b => { b.content = b.content.trim(); });
    return blocks;
};

export const ThoughtBlock = ({ block }: { block: any }) => {
    const hasContent = block.content.length > 0;
    
    return (
        <div className="flex flex-col mb-1 font-mono">
            <div className="flex items-center gap-2 py-1 px-2 text-slate-300">
                <div className="w-4 h-4 flex items-center justify-center shrink-0">
                    {getIcon(block.icon)}
                </div>
                <span className="flex-1 text-[13px] font-medium tracking-tight truncate select-none">{block.title}</span>
            </div>
            
            {hasContent && (
                <div className="flex mt-0.5 mb-1">
                    <div className="flex-1 pl-8 pr-4 py-0.5 text-[12px] text-slate-400/90 whitespace-pre-wrap leading-relaxed">
                        {block.content}
                    </div>
                </div>
            )}
        </div>
    );
};
