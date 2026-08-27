import React from "react";
import { useTranslation } from "react-i18next";

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
const BSTVisualizer = React.lazy(() => import("../components/ui/visualizers/BSTVisualizer"));
const ListGraphVisualizer = React.lazy(() => import("../components/ui/visualizers/ListGraphVisualizer"));
const BinTreeVisualizer = React.lazy(() => import("../components/ui/visualizers/BinTreeVisualizer"));
const MafsVisualizer = React.lazy(() => import("../components/ui/visualizers/MafsVisualizer"));
const VectorVisualizer = React.lazy(() => import("../components/ui/visualizers/VectorVisualizer"));
const ListVisualizer = React.lazy(() => import("../components/ui/visualizers/ListVisualizer"));
const PointerVisualizer = React.lazy(() => import("../components/ui/visualizers/PointerVisualizer"));
const LinkedInEmbed = React.lazy(() => import("../components/ui/embeds/LinkedInEmbed"));
const YoutubeEmbed = React.lazy(() => import("../components/ui/embeds/YoutubeEmbed"));
const Accordion = React.lazy(() => import("../components/ui/Accordion"));
const ThreeFallback = () => {
    const { t } = useTranslation();
    return (
        <div className="w-full h-64 bg-slate-950 rounded-2xl border border-amber-500/30 my-8 flex flex-col items-center justify-center gap-3 p-8">
            <div className="text-3xl">🧊</div>
            <p className="text-amber-400 font-semibold text-sm text-center">{t('markdown.threeUnavailableTitle')}</p>
            <p className="text-slate-500 text-xs text-center max-w-xs">
                {t('markdown.threeUnavailableDesc')}
            </p>
        </div>
    );
};

const ThreeVisualizer = React.lazy(() =>
    import("../components/ui/visualizers/ThreeVisualizer").catch(() => ({
        default: ThreeFallback
    }))
);


const VizFallback = () => {
    const { t } = useTranslation();
    return (
        <div className="h-64 animate-pulse bg-slate-900/40 border border-white/5 rounded-2xl w-full my-12 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <Spinner size="lg" variant="emerald" />
                <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">{t('markdown.loadingEngine')}</span>
            </div>
        </div>
    );
};

const VizErrorDisplay = ({ error }: { error: Error | null }) => {
    const { t } = useTranslation();
    return (
        <div className="w-full h-48 bg-slate-950 rounded-2xl border border-red-500/30 my-8 flex flex-col items-center justify-center gap-3 p-8">
            <p className="text-red-400 font-semibold text-sm text-center">{t('markdown.componentError')}</p>
            <p className="text-slate-500 text-xs text-center max-w-xs font-mono">
                {error?.message || t('markdown.unknownError')}
            </p>
        </div>
    );
};

/**
 * ErrorBoundary — Catches rendering errors in lazy-loaded visualizers
 * so a single broken component doesn't crash the entire markdown page.
 */
class VizErrorBoundary extends React.Component<
    { children: React.ReactNode },
    { hasError: boolean; error: Error | null }
> {
    constructor(props: { children: React.ReactNode }) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        if (import.meta.env.DEV) {
            console.error('[MarkdownRenderer] Component error:', error, errorInfo);
        }
    }

    render() {
        if (this.state.hasError) {
            return <VizErrorDisplay error={this.state.error} />;
        }
        return this.props.children;
    }
}

/** Suspense + ErrorBoundary wrapper for all lazy-loaded visualizers */
const SafeSuspense = ({ children }: { children: React.ReactNode }) => (
    <VizErrorBoundary>
        <React.Suspense fallback={<VizFallback />}>
            {children}
        </React.Suspense>
    </VizErrorBoundary>
);

type MarkdownRendererProps = {
    content: string;
    components?: React.ComponentProps<typeof ReactMarkdown>["components"];
};

type MarkdownComponentProps = Record<string, unknown>;

const defaultComponents: Record<string, React.FC<MarkdownComponentProps>> = {
    download: (props: MarkdownComponentProps) => {
        const href = (props.href || props.url || props.src) as string;
        const label = (props.label || props.title || 'Descarregar') as string;
        const description = props.description as string;
        return (
            <div className="flex flex-wrap items-center gap-3 my-4 not-prose">
                {description && <span className="text-slate-300 text-sm font-semibold">{description}</span>}
                <a
                    href={href}
                    download
                    className="inline-flex items-center justify-center gap-2 px-3.5 py-1.5 text-[11px] font-bold tracking-wider uppercase rounded-xl border transition-all select-none bg-sky-500/10 text-sky-400 border-sky-500/20 hover:bg-sky-500/20 hover:border-sky-500/40 hover:text-sky-300 shadow-md shadow-sky-950/20 group no-underline w-fit"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:scale-110 group-hover:-translate-y-0.5 transition-transform duration-200">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="7 10 12 15 17 10"/>
                        <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    <span>{label}</span>
                </a>
            </div>
        );
    },
    // Custom directive for videos: ::videoviz[src="/m2/video.webm" delay="3500"]
    videoviz: (props: MarkdownComponentProps) => {
        return <SimulationPlayer type="video" {...(props as any)} />;
    },
    accordion: (props: MarkdownComponentProps) => {
        return (
            <SafeSuspense>
                <Accordion {...(props as unknown as React.ComponentProps<typeof Accordion>)} />
            </SafeSuspense>
        );
    },
    // Custom directive for graphs: ::graph
    graph: (props: MarkdownComponentProps) => {
        return (
            <SafeSuspense>
                <GraphVisualizer {...(props as unknown as React.ComponentProps<typeof GraphVisualizer>)} />
            </SafeSuspense>
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
            <SafeSuspense>
                <StackVisualizer />
            </SafeSuspense>
        );
    },
    queueviz: () => {
        return (
            <SafeSuspense>
                <QueueVisualizer />
            </SafeSuspense>
        );
    },
    heapviz: () => {
        return (
            <SafeSuspense>
                <HeapVisualizer />
            </SafeSuspense>
        );
    },
    bstviz: () => {
        return (
            <SafeSuspense>
                <BSTVisualizer />
            </SafeSuspense>
        );
    },
    vectorviz: () => {
        return (
            <SafeSuspense>
                <VectorVisualizer />
            </SafeSuspense>
        );
    },
    linkedlistviz: () => {
        return (
            <SafeSuspense>
                <ListVisualizer />
            </SafeSuspense>
        );
    },
    pointerviz: () => {
        return (
            <SafeSuspense>
                <PointerVisualizer />
            </SafeSuspense>
        );
    },
    listviz: (props: MarkdownComponentProps) => {
        return (
            <SafeSuspense>
                <ListGraphVisualizer {...(props as unknown as React.ComponentProps<typeof ListGraphVisualizer>)} />
            </SafeSuspense>
        );
    },
    bintreeviz: () => {
        return (
            <SafeSuspense>
                <BinTreeVisualizer />
            </SafeSuspense>
        );
    },
    proofviz: (props: MarkdownComponentProps) => {
        return <SimulationPlayer type="proof" proofId={props.proof as string} />;
    },
    mafs: (props: MarkdownComponentProps) => {
        const { node: _node, ...rest } = props;
        return (
            <SafeSuspense>
                <MafsVisualizer {...(rest as unknown as React.ComponentProps<typeof MafsVisualizer>)} />
            </SafeSuspense>
        );
    },
    threeviz: (props: MarkdownComponentProps) => {
        const { node: _node, ...rest } = props;
        return (
            <SafeSuspense>
                <ThreeVisualizer {...(rest as unknown as React.ComponentProps<typeof ThreeVisualizer>)} />
            </SafeSuspense>
        );
    },
    linkedinviz: (props: MarkdownComponentProps) => {
        const { node: _node, ...rest } = props;
        return (
            <SafeSuspense>
                <LinkedInEmbed {...(rest as unknown as React.ComponentProps<typeof LinkedInEmbed>)} />
            </SafeSuspense>
        );
    },
    youtubeviz: (props: MarkdownComponentProps) => {
        const { node: _node, ...rest } = props;
        return (
            <SafeSuspense>
                <YoutubeEmbed {...(rest as unknown as React.ComponentProps<typeof YoutubeEmbed>)} />
            </SafeSuspense>
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
                <SafeSuspense>
                    <CodeBlock
                        code={String(children).replace(/\n$/, '')}
                        language={match[1]}
                        title={title}
                    />
                </SafeSuspense>
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
            'svg', 'path', 'polyline', 'line', 'polygon', 'rect', 'circle', 'g',
            'download', 'videoviz', 'accordion', 'graph', 'callout', 'algoviz', 'oopviz',
            'stackviz', 'queueviz', 'heapviz', 'bstviz', 'vectorviz', 'linkedlistviz', 'pointerviz',
            'listviz', 'bintreeviz', 'proofviz', 'mafs', 'threeviz', 'three',
            'linkedinviz', 'youtubeviz', 'object', 'mark'
        ],
        attributes: {
            ...defaultSchema.attributes,
            '*': ['className', 'class', 'style', 'id'],
            'a': ['href', 'target', 'rel', 'download', 'className', 'class', 'title'],
            'svg': ['xmlns', 'width', 'height', 'viewBox', 'fill', 'stroke', 'strokeWidth', 'strokeLinecap', 'strokeLinejoin', 'className', 'class', 'style'],
            'path': ['d', 'fill', 'stroke', 'strokeWidth', 'strokeLinecap', 'strokeLinejoin', 'className', 'class'],
            'polyline': ['points', 'fill', 'stroke', 'strokeWidth', 'strokeLinecap', 'strokeLinejoin', 'className', 'class'],
            'line': ['x1', 'y1', 'x2', 'y2', 'fill', 'stroke', 'strokeWidth', 'strokeLinecap', 'strokeLinejoin', 'className', 'class'],
            'circle': ['cx', 'cy', 'r', 'fill', 'stroke', 'strokeWidth', 'className', 'class'],
            'rect': ['x', 'y', 'width', 'height', 'rx', 'ry', 'fill', 'stroke', 'strokeWidth', 'className', 'class'],
            'download': ['href', 'url', 'src', 'label', 'title', 'format', 'type', 'description'],
            'videoviz': ['src', 'url', 'delay'],
            'oopviz': ['simulation'],
            'algoviz': ['algorithm'],
            'proofviz': ['proof'],
            'youtubeviz': ['src', 'caption'],
            'linkedinviz': ['src'],
            'mafs': ['type'],
            'threeviz': ['type'],
            'graph': ['edges', 'nodes', 'height', 'directed'],
            'listviz': ['edges', 'nodes', 'height', 'directed'],
            'accordion': ['title', 'defaultOpen'],
            'callout': ['type', 'title'],
            'object': ['data', 'type', 'width', 'height'],
        }
    }],
    rehypeKatex
];

const remarkPluginsConfig = [remarkDirective, remarkDirectiveRehype, remarkCodeMetadata, remarkGfm, remarkMark, remarkMath];

/**
 * MarkdownRenderer — Memoized to prevent the 9-pass AST pipeline
 * from re-executing on every parent re-render (critical for scroll-driven
 * animations in TopicPage that trigger 60fps re-renders).
 */
export const MarkdownRenderer = React.memo(
    function MarkdownRenderer({ content, components: customComponents }: MarkdownRendererProps) {
        const mergedComponents = React.useMemo(() => {
            return {
                ...defaultComponents,
                ...customComponents,
            };
        }, [customComponents]);

        return (
            <VizErrorBoundary>
                <ReactMarkdown
                    rehypePlugins={rehypePluginsConfig as any}
                    remarkPlugins={remarkPluginsConfig as any}
                    components={mergedComponents as unknown as React.ComponentProps<typeof ReactMarkdown>["components"]}
                >
                    {content}
                </ReactMarkdown>
            </VizErrorBoundary>
        );
    },
    (prev, next) => prev.content === next.content && prev.components === next.components
);