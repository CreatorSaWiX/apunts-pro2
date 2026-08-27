import React from "react";

import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import remarkDirective from "remark-directive";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import remarkMark from "./remarkMark";
import "katex/dist/katex.min.css"; // Import katex styles
import "mafs/core.css"; // Mafs core CSS
import "mafs/font.css"; // Mafs fonts 

import { remarkDirectiveRehype } from "./remarkDirectiveRehype";
import { remarkCodeMetadata } from "./remarkCodeMetadata";
import Spinner from "../components/ui/Spinner";

const CodeBlock = React.lazy(() => import("../components/ui/editors/CodeBlock"));
import Callout from "../components/ui/Callout";
import SimulationPlayer from "../components/ui/players/SimulationPlayer";

const GraphVisualizer = React.lazy(() => import("../components/ui/visualizers/GraphVisualizer"));
const StackVisualizer = React.lazy(() => import("../components/ui/visualizers/StackVisualizer"));
const QueueVisualizer = React.lazy(() => import("../components/ui/visualizers/QueueVisualizer"));
const HeapVisualizer = React.lazy(() => import("../components/ui/visualizers/HeapVisualizer"));
const ListGraphVisualizer = React.lazy(() => import("../components/ui/visualizers/ListGraphVisualizer"));
const BinTreeVisualizer = React.lazy(() => import("../components/ui/visualizers/BinTreeVisualizer"));
const MafsVisualizer = React.lazy(() => import("../components/ui/visualizers/MafsVisualizer"));
const VectorVisualizer = React.lazy(() => import("../components/ui/visualizers/VectorVisualizer"));
const ListVisualizer = React.lazy(() => import("../components/ui/visualizers/ListVisualizer"));
const PointerVisualizer = React.lazy(() => import("../components/ui/visualizers/PointerVisualizer"));
const LinkedInEmbed = React.lazy(() => import("../components/ui/embeds/LinkedInEmbed"));
const YoutubeEmbed = React.lazy(() => import("../components/ui/embeds/YoutubeEmbed"));
const Accordion = React.lazy(() => import("../components/ui/Accordion"));
const ThreeVisualizer = React.lazy(() =>
    import("../components/ui/visualizers/ThreeVisualizer").catch(() => ({
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
            <Spinner size="lg" variant="emerald" />
            <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">Carregant motor gràfic...</span>
        </div>
    </div>
);

type MarkdownRendererProps = {
    content: string;
    components?: React.ComponentProps<typeof ReactMarkdown>["components"];
};

type MarkdownComponentProps = Record<string, unknown>;

const defaultComponents: Record<string, React.FC<MarkdownComponentProps>> = {
    // Custom directive for videos: ::videoviz[src="/m2/video.webm" delay="3500"]
    videoviz: (props: MarkdownComponentProps) => {
        return <SimulationPlayer type="video" {...(props as any)} />;
    },
    accordion: (props: MarkdownComponentProps) => {
        return (
            <React.Suspense fallback={<VizFallback />}>
                <Accordion {...(props as unknown as React.ComponentProps<typeof Accordion>)} />
            </React.Suspense>
        );
    },
    // Custom directive for graphs: ::graph
    graph: (props: MarkdownComponentProps) => {
        return (
            <React.Suspense fallback={<VizFallback />}>
                <GraphVisualizer {...(props as unknown as React.ComponentProps<typeof GraphVisualizer>)} />
            </React.Suspense>
        );
    },
    // Callouts from ::note, ::tip, etc.
    callout: (props: MarkdownComponentProps) => {
        return <Callout {...(props as unknown as React.ComponentProps<typeof Callout>)} />;
    },
    algoviz: (props: MarkdownComponentProps) => {
        return <SimulationPlayer type="algo" algorithm={props.algorithm as string} />;
    },
    oopviz: (props: MarkdownComponentProps) => {
        return <SimulationPlayer type="oop" simulation={props.simulation as string} />;
    },
    stackviz: () => {
        return (
            <React.Suspense fallback={<VizFallback />}>
                <StackVisualizer />
            </React.Suspense>
        );
    },
    queueviz: () => {
        return (
            <React.Suspense fallback={<VizFallback />}>
                <QueueVisualizer />
            </React.Suspense>
        );
    },
    heapviz: () => {
        return (
            <React.Suspense fallback={<VizFallback />}>
                <HeapVisualizer />
            </React.Suspense>
        );
    },
    vectorviz: () => {
        return (
            <React.Suspense fallback={<VizFallback />}>
                <VectorVisualizer />
            </React.Suspense>
        );
    },
    linkedlistviz: () => {
        return (
            <React.Suspense fallback={<VizFallback />}>
                <ListVisualizer />
            </React.Suspense>
        );
    },
    pointerviz: () => {
        return (
            <React.Suspense fallback={<VizFallback />}>
                <PointerVisualizer />
            </React.Suspense>
        );
    },
    listviz: (props: MarkdownComponentProps) => {
        return (
            <React.Suspense fallback={<VizFallback />}>
                <ListGraphVisualizer {...(props as unknown as React.ComponentProps<typeof ListGraphVisualizer>)} />
            </React.Suspense>
        );
    },
    bintreeviz: () => {
        return (
            <React.Suspense fallback={<VizFallback />}>
                <BinTreeVisualizer />
            </React.Suspense>
        );
    },
    proofviz: (props: MarkdownComponentProps) => {
        return <SimulationPlayer type="proof" proofId={props.proof as string} />;
    },
    mafs: (props: MarkdownComponentProps) => {
        const { node: _node, ...rest } = props;
        return (
            <React.Suspense fallback={<VizFallback />}>
                <MafsVisualizer {...(rest as unknown as React.ComponentProps<typeof MafsVisualizer>)} />
            </React.Suspense>
        );
    },
    threeviz: (props: MarkdownComponentProps) => {
        const { node: _node, ...rest } = props;
        return (
            <React.Suspense fallback={<VizFallback />}>
                <ThreeVisualizer {...(rest as unknown as React.ComponentProps<typeof ThreeVisualizer>)} />
            </React.Suspense>
        );
    },
    three: (props: MarkdownComponentProps) => {
        const { node: _node, ...rest } = props;
        return (
            <React.Suspense fallback={<VizFallback />}>
                <ThreeVisualizer {...(rest as unknown as React.ComponentProps<typeof ThreeVisualizer>)} />
            </React.Suspense>
        );
    },
    linkedinviz: (props: MarkdownComponentProps) => {
        const { node: _node, ...rest } = props;
        return (
            <React.Suspense fallback={<VizFallback />}>
                <LinkedInEmbed {...(rest as unknown as React.ComponentProps<typeof LinkedInEmbed>)} />
            </React.Suspense>
        );
    },
    youtubeviz: (props: MarkdownComponentProps) => {
        const { node: _node, ...rest } = props;
        return (
            <React.Suspense fallback={<VizFallback />}>
                <YoutubeEmbed {...(rest as unknown as React.ComponentProps<typeof YoutubeEmbed>)} />
            </React.Suspense>
        );
    },
    pre: ({ children }: { children?: React.ReactNode }) => <>{children}</>,
    code(props: React.ComponentPropsWithoutRef<'code'> & { metadata?: string }) {
        const { children, className, ...rest } = props;
        const match = /language-(\w+)/.exec(className || '');

        // Access metadata passed by remarkCodeMetadata via hProperties -> props
        const metadata = props.metadata || '';
        const titleMatch = metadata.match(/\[(.*?)\]/);
        const title = titleMatch ? titleMatch[1] : undefined;

        return match ? (
            <div className="not-prose my-8 -mx-4 md:mx-0">
                <React.Suspense fallback={<VizFallback />}>
                    <CodeBlock
                        code={String(children).replace(/\n$/, '')}
                        language={match[1]}
                        title={title}
                    />
                </React.Suspense>
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
    ),
    mark: ({ ...props }) => (
        <mark className="bg-amber-500/20 text-amber-200 font-medium rounded-sm px-1.5 py-0.5" {...props} />
    )
};

const rehypePluginsConfig = [
    rehypeRaw,
    [rehypeSanitize, {
        ...defaultSchema,
        tagNames: [
            ...(defaultSchema.tagNames || []),
            'videoviz', 'accordion', 'graph', 'callout', 'algoviz', 'oopviz',
            'stackviz', 'queueviz', 'heapviz', 'vectorviz', 'linkedlistviz', 'pointerviz',
            'listviz', 'bintreeviz', 'proofviz', 'mafs', 'threeviz', 'three',
            'linkedinviz', 'youtubeviz', 'object', 'mark'
        ],
        attributes: {
            ...defaultSchema.attributes,
            '*': ['className', 'style'],
            'videoviz': ['src', 'url', 'delay'],
            'oopviz': ['simulation'],
            'algoviz': ['algorithm'],
            'proofviz': ['proof'],
            'youtubeviz': ['src', 'caption'],
            'linkedinviz': ['src'],
            'mafs': ['type'],
            'threeviz': ['type'],
            'three': ['type'],
            'graph': ['edges', 'nodes', 'height', 'directed'],
            'accordion': ['title', 'defaultOpen'],
            'callout': ['type', 'title'],
            'object': ['data', 'type', 'width', 'height'],
        }
    }],
    rehypeKatex
];

const remarkPluginsConfig = [remarkDirective, remarkDirectiveRehype, remarkCodeMetadata, remarkGfm, remarkMark, remarkMath];

export function MarkdownRenderer({ content, components: customComponents }: MarkdownRendererProps) {
    const mergedComponents = React.useMemo(() => {
        return {
            ...defaultComponents,
            ...customComponents,
        };
    }, [customComponents]);

    return (
        <ReactMarkdown
            rehypePlugins={rehypePluginsConfig as any}
            remarkPlugins={remarkPluginsConfig as any}
            components={mergedComponents as unknown as React.ComponentProps<typeof ReactMarkdown>["components"]}
        >
            {content}
        </ReactMarkdown>
    );
}