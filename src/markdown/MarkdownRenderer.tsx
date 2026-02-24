import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkDirective from "remark-directive";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import "katex/dist/katex.min.css"; // Import katex styles

import { remarkDirectiveRehype } from "./remarkDirectiveRehype";
import { remarkCodeMetadata } from "./remarkCodeMetadata";
import CodeBlock from "../components/ui/CodeBlock";
import GraphVisualizer from "../components/ui/GraphVisualizer";
import Callout from "../components/ui/Callout";
import AlgoPlayer from "../components/ui/AlgoPlayer";
import OOPPlayer from "../components/ui/OOPPlayer";

type MarkdownRendererProps = {
    content: string;
    components?: React.ComponentProps<typeof ReactMarkdown>["components"];
};

const defaultComponents: any = {
    // Custom directive for graphs: ::graph
    graph: (props: any) => {
        return <GraphVisualizer {...props} />;
    },
    // Callouts from ::note, ::tip, etc.
    callout: (props: any) => {
        return <Callout {...props} />;
    },
    algoviz: (props: any) => {
        return <AlgoPlayer algorithm={props.algorithm} />;
    },
    oopviz: (props: any) => {
        return <OOPPlayer simulation={props.simulation} />;
    },
    pre: ({ children }: any) => <>{children}</>,
    code(props: any) {
        const { children, className, ...rest } = props;
        const match = /language-(\w+)/.exec(className || '');

        // Access metadata passed by remarkCodeMetadata via hProperties -> props
        const metadata = (rest as any).metadata || '';
        const titleMatch = metadata.match(/\[(.*?)\]/);
        const title = titleMatch ? titleMatch[1] : undefined;

        return match ? (
            <div className="not-prose my-8 -mx-4 md:mx-0">
                <CodeBlock
                    code={String(children).replace(/\n$/, '')}
                    language={match[1]}
                    title={title}
                />
            </div>
        ) : (
            <code {...rest}
                className="px-1.5 py-0.5 rounded-md bg-white/10 text-sky-300 font-mono text-[0.9em] border border-white/5">
                {children}
            </code>
        );
    },
    h2: ({ ...props }) => (
        <h2 className="text-2xl md:text-3xl font-bold text-slate-100 mt-16 mb-6 scroll-mt-28 tracking-tight" {...props} />
    ),
    h3: ({ ...props }) => (
        <h3 className="text-xl font-semibold text-white mt-10 mb-4 scroll-mt-28" {...props} />
    ),
    p: ({ ...props }) => (
        <p className="text-slate-300 leading-8 mb-6 text-lg" {...props} />
    ),
    ul: ({ ...props }) => (
        <ul className="space-y-2 my-6 list-disc pl-6 marker:text-slate-500 [&_ul]:my-2 [&_ul]:list-[circle] [&_ul]:marker:text-slate-600" {...props} />
    ),
    ol: ({ ...props }) => (
        <ol className="space-y-2 my-6 list-decimal pl-6 marker:text-slate-500 marker:font-bold" {...props} />
    ),
    li: ({ ...props }) => (
        <li className="text-slate-300 pl-2 leading-relaxed" {...props} />
    ),
    strong: ({ ...props }) => (
        <strong className="font-bold text-white" {...props} />
    ),
    blockquote: ({ ...props }) => (
        <blockquote
            className="border-l-4 border-sky-500/50 bg-sky-500/5 px-6 py-4 rounded-r-xl my-8 text-slate-300 italic not-prose" {...props} />
    ),
    table: ({ ...props }) => (
        <div className="overflow-x-auto my-8 border border-white/10 rounded-xl bg-slate-900/40 not-prose">
            <table className="w-full text-left text-sm whitespace-nowrap" {...props} />
        </div>
    ),
    thead: ({ ...props }) => (
        <thead className="bg-slate-800/80 border-b border-white/10 text-slate-200 font-bold" {...props} />
    ),
    th: ({ ...props }) => (
        <th className="px-4 py-3 border-r border-white/10 last:border-r-0" {...props} />
    ),
    td: ({ ...props }) => (
        <td className="px-4 py-3 border-b text-slate-300 border-r border-white/10 last:border-r-0 group-last:border-b-0" {...props} />
    ),
    tr: ({ ...props }) => (
        <tr className="group" {...props} />
    )
};

export function MarkdownRenderer({ content, components: customComponents }: MarkdownRendererProps) {
    const mergedComponents = React.useMemo(() => {
        return {
            ...defaultComponents,
            ...customComponents,
        };
    }, [customComponents]);

    return (
        <ReactMarkdown
            rehypePlugins={[rehypeRaw, rehypeKatex]}
            remarkPlugins={[remarkDirective, remarkDirectiveRehype, remarkCodeMetadata, remarkGfm, remarkMath]}
            components={mergedComponents as any}
        >
            {content}
        </ReactMarkdown>
    );
}