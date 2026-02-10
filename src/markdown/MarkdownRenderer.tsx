import { visit } from "unist-util-visit";
import React, { type HTMLAttributes } from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkDirective from "remark-directive";
import { remarkDirectiveRehype } from "./remarkDirectiveRehype";
import CodeBlock from "../components/ui/CodeBlock";
import { isLanguageName } from "../utils/languages";

type MarkdownRendererProps = {
    content: string;
    components?: React.ComponentProps<typeof ReactMarkdown>["components"];
};

// This plugin grabs the 'meta' from the markdown node 
// and puts it where the HTML renderer can see it.
function remarkCodeMeta() {
  return (tree: any) => {
    visit(tree, 'code', (node: any) => {
      if (node.meta) {
        node.data = node.data || {};
        node.data.hProperties = node.data.hProperties || {};
        node.data.hProperties.metadata = node.meta; // "metadata" is a safe custom prop
        console.log(node)
      }
    });
  };
}

export function MarkdownRenderer({ content, components }: MarkdownRendererProps) {
    return (
        <ReactMarkdown
            rehypePlugins={[rehypeRaw]}
            remarkPlugins={[remarkDirective, remarkCodeMeta, remarkDirectiveRehype]}
            components={{
                // Evitem dos tags pre anidats
                pre({children}) {
                    return children;
                },
                code(props) {
                    const { children, className, node, ...rest } = props
                    const lang = /language-(\w+)/.exec(className || '')?.[1]
                    if (lang !== undefined && !isLanguageName(lang)) {
                        throw new Error("Unknown language");
                    }


                    const meta = node?.properties.metadata as string;
                    console.log(node)

                    const title = /\[(.*?)\]/.exec(meta)?.[1];
                    return lang ? (
                        <div className="not-prose my-8 -mx-4 md:mx-0">
                            <CodeBlock
                                code={String(children).replace(/\n$/, '')}
                                title={title}
                                language={lang}
                            />
                        </div>
                    ) : (
                        <code {...rest}
                            className="px-1.5 py-0.5 rounded-md bg-white/10 text-sky-300 font-mono text-[0.9em] border border-white/5">
                            {children}
                        </code>
                    )
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
                    <ul className="space-y-2 my-6 list-disc pl-6 marker:text-slate-500" {...props} />
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
                ), ...components
            }}
        >
            {content}
        </ReactMarkdown>
    );
}