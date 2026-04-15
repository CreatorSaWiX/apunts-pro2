import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkDirective from "remark-directive";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import "katex/dist/katex.min.css"; // Import katex styles
import "mafs/core.css"; // Mafs core CSS
import "mafs/font.css"; // Mafs fonts 

import { remarkDirectiveRehype } from "./remarkDirectiveRehype";
import { remarkCodeMetadata } from "./remarkCodeMetadata";
import CodeBlock from "../components/ui/CodeBlock";
import Callout from "../components/ui/Callout";

const GraphVisualizer = React.lazy(() => import("../components/ui/GraphVisualizer"));
const AlgoPlayer = React.lazy(() => import("../components/ui/AlgoPlayer"));
const OOPPlayer = React.lazy(() => import("../components/ui/OOPPlayer"));
const StackVisualizer = React.lazy(() => import("../components/ui/StackVisualizer"));
const QueueVisualizer = React.lazy(() => import("../components/ui/QueueVisualizer"));
const ListGraphVisualizer = React.lazy(() => import("../components/ui/ListGraphVisualizer"));
const BinTreeVisualizer = React.lazy(() => import("../components/ui/BinTreeVisualizer"));
const ProofPlayer = React.lazy(() => import("../components/ui/ProofPlayer"));
const MafsVisualizer = React.lazy(() => import("../components/ui/MafsVisualizer"));
const VideoPlayer = React.lazy(() => import("../components/ui/VideoPlayer"));
const ThreeVisualizer = React.lazy(() =>
    import("../components/ui/ThreeVisualizer").catch(() => ({
        default: () => (
            <div className="w-full h-64 bg-slate-950 rounded-2xl border border-amber-500/30 my-8 flex flex-col items-center justify-center gap-3 p-8">
                <div className="text-3xl">🧊</div>
                <p className="text-amber-400 font-semibold text-sm text-center">Visualització 3D no disponible</p>
                <p className="text-slate-500 text-xs text-center max-w-xs">
                    No s'ha pogut carregar el motor 3D (possiblement bloquejat per l'antivirus o sense WebGL). 
                    El contingut dels apunts és complet al text de sota.
                </p>
            </div>
        )
    }))
);


const VizFallback = () => (
    <div className="h-64 animate-pulse bg-slate-900/40 border border-white/5 rounded-2xl w-full my-12 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 rounded-full border-2 border-emerald-500/30 border-t-emerald-500 animate-spin"></div>
            <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">Carregant motor gràfic...</span>
        </div>
    </div>
);

type MarkdownRendererProps = {
    content: string;
    components?: React.ComponentProps<typeof ReactMarkdown>["components"];
};

const defaultComponents: any = {
    // Custom directive for videos: ::videoviz[src="/m2/video.webm" delay="3500"]
    videoviz: (props: any) => {
        return (
            <React.Suspense fallback={<VizFallback />}>
                <VideoPlayer {...props} />
            </React.Suspense>
        );
    },
    // Custom directive for graphs: ::graph
    graph: (props: any) => {
        return (
            <React.Suspense fallback={<VizFallback />}>
                <GraphVisualizer {...props} />
            </React.Suspense>
        );
    },
    // Callouts from ::note, ::tip, etc.
    callout: (props: any) => {
        return <Callout {...props} />;
    },
    algoviz: (props: any) => {
        return (
            <React.Suspense fallback={<VizFallback />}>
                <AlgoPlayer algorithm={props.algorithm} />
            </React.Suspense>
        );
    },
    oopviz: (props: any) => {
        return (
            <React.Suspense fallback={<VizFallback />}>
                <OOPPlayer simulation={props.simulation} />
            </React.Suspense>
        );
    },
    stackviz: (props: any) => {
        return (
            <React.Suspense fallback={<VizFallback />}>
                <StackVisualizer {...props} />
            </React.Suspense>
        );
    },
    queueviz: (props: any) => {
        return (
            <React.Suspense fallback={<VizFallback />}>
                <QueueVisualizer {...props} />
            </React.Suspense>
        );
    },
    listviz: (props: any) => {
        return (
            <React.Suspense fallback={<VizFallback />}>
                <ListGraphVisualizer {...props} />
            </React.Suspense>
        );
    },
    bintreeviz: (props: any) => {
        return (
            <React.Suspense fallback={<VizFallback />}>
                <BinTreeVisualizer {...props} />
            </React.Suspense>
        );
    },
    proofviz: (props: any) => {
        return (
            <React.Suspense fallback={<VizFallback />}>
                <ProofPlayer proofId={props.proof} />
            </React.Suspense>
        );
    },
    mafs: (props: any) => {
        const { node, ...rest } = props;
        return (
            <React.Suspense fallback={<VizFallback />}>
                <MafsVisualizer {...rest} />
            </React.Suspense>
        );
    },
    threeviz: (props: any) => {
        const { node, ...rest } = props;
        return (
            <React.Suspense fallback={<VizFallback />}>
                <ThreeVisualizer {...rest} />
            </React.Suspense>
        );
    },
    three: (props: any) => {
        const { node, ...rest } = props;
        return (
            <React.Suspense fallback={<VizFallback />}>
                <ThreeVisualizer {...rest} />
            </React.Suspense>
        );
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
    h4: ({ ...props }) => (
        <h4 className="text-sm font-bold -mb-4 text-slate-100" {...props} />
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
            <table className="w-full text-left text-sm" {...props} />
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