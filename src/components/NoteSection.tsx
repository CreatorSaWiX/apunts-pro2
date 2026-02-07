import React from 'react';
import { motion } from 'framer-motion';
import type { Section, ContentBlock, CodeBlockData } from '../data/notes';
import CodeBlock from './ui/CodeBlock';
import { Lightbulb, AlertTriangle } from 'lucide-react';

interface NoteSectionProps {
    section: Section;
    index: number;
}

const NoteSection: React.FC<NoteSectionProps> = ({ section, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="w-full mt-4"
        >


            <div className="space-y-6">
                {section.blocks.map((block: ContentBlock, i: number) => {
                    if (block.type === 'text') {
                        return (
                            <p key={i} className="text-slate-300 leading-relaxed text-lg">
                                <span dangerouslySetInnerHTML={{ __html: (block.value as string).replace(/`([^`]+)`/g, '<code class="bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>').replace(/\*\*([^*]+)\*\*/g, '<strong class="text-white font-semibold">$1</strong>') }} />
                            </p>
                        );
                    } else if (block.type === 'list') {
                        return (
                            <ul key={i} className="space-y-3 ml-4 border-l-2 border-indigo-500/30 pl-6">
                                {(block.value as string[]).map((item, j) => (
                                    <li key={j} className="text-slate-300 flex items-start gap-2">
                                        <span className="text-indigo-400 mt-1">•</span>
                                        <span dangerouslySetInnerHTML={{ __html: item.replace(/`([^`]+)`/g, '<code class="bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded text-sm font-mono">$1</code>').replace(/\*\*([^*]+)\*\*/g, '<strong class="text-white font-semibold">$1</strong>') }} />
                                    </li>
                                ))}
                            </ul>
                        );
                    } else if (block.type === 'code') {
                        return (
                            <CodeBlock
                                key={i}
                                code={block.value as string}
                                title={block.title}
                            />
                        );
                    } else if (block.type === 'comparison') {
                        const codeBlocks = block.value as CodeBlockData[];
                        return (
                            <div key={i} className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-8">
                                {codeBlocks.map((codeBlock, j) => (
                                    <div key={j} className="flex flex-col min-w-0">
                                        <CodeBlock
                                            code={codeBlock.code}
                                            language={codeBlock.language}
                                            title={codeBlock.title}
                                        />
                                    </div>
                                ))}
                            </div>
                        );
                    } else if (block.type === 'tip') {
                        return (
                            <div key={i} className="flex gap-4 p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-100 backdrop-blur-sm">
                                <Lightbulb className="flex-shrink-0 mt-1 text-emerald-400" size={20} />
                                <div className="leading-relaxed text-[15px]">
                                    <span dangerouslySetInnerHTML={{ __html: (block.value as string).replace(/`([^`]+)`/g, '<code class="bg-emerald-500/20 px-1.5 py-0.5 rounded-md font-mono text-xs font-semibold text-emerald-300">$1</code>').replace(/\*\*([^*]+)\*\*/g, '<strong class="text-emerald-300 font-bold">$1</strong>') }} />
                                </div>
                            </div>
                        );
                    } else if (block.type === 'warning') {
                        return (
                            <div key={i} className="flex gap-4 p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-100 backdrop-blur-sm">
                                <AlertTriangle className="flex-shrink-0 mt-1 text-amber-400" size={20} />
                                <div className="leading-relaxed text-[15px]">
                                    <span dangerouslySetInnerHTML={{ __html: (block.value as string).replace(/`([^`]+)`/g, '<code class="bg-amber-500/20 px-1.5 py-0.5 rounded-md font-mono text-xs font-semibold text-amber-300">$1</code>').replace(/\*\*([^*]+)\*\*/g, '<strong class="text-amber-300 font-bold">$1</strong>') }} />
                                </div>
                            </div>
                        );
                    }
                    return null;
                })}
            </div>
        </motion.div>
    );
};

export default NoteSection;
