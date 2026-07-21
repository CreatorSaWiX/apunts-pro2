import React from 'react';
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';

export const CodeBlockComponent = ({ node }: any) => {
    const currentLanguage = node.attrs.language || 'text';

    return (
        <NodeViewWrapper className="my-6 first:mt-0 last:mb-0">
            <div className="rounded-2xl overflow-hidden bg-[#0d1117] border border-white/10 shadow-sm">
                <pre className="!m-0 !bg-transparent p-5 custom-scrollbar overflow-x-auto text-[14px] leading-relaxed font-mono">
                    <NodeViewContent as={"code" as any} className={`language-${currentLanguage}`} />
                </pre>
            </div>
        </NodeViewWrapper>
    );
};
