import React, { useMemo } from 'react';
import parse, { type DOMNode, domToReact } from 'html-react-parser';
import DOMPurify from 'isomorphic-dompurify';
import { PublishedCodeBlock } from '../extensions/PublishedCodeBlock';

interface HtmlRendererProps {
    content: string;
    className?: string;
}

export const HtmlRenderer = React.memo(({ content, className = '' }: HtmlRendererProps) => {
    const parsedContent = useMemo(() => {
        if (!content) return null;

        // Sanitize with custom relaxed attributes if needed
        const sanitizedHtml = DOMPurify.sanitize(content, {
            ADD_ATTR: ['target', 'rel']
        });

        const options = {
            replace: (domNode: any) => {
                if (domNode.type === 'tag' && domNode.name === 'pre') {
                    const codeNode = domNode.children.find(
                        (child: any) => child.type === 'tag' && child.name === 'code'
                    );

                    if (codeNode) {
                        let languageClass = codeNode.attribs.class || '';

                        // Force C++ for Jutge statements if no language is specified
                        if (!languageClass && className.includes('jutge-content')) {
                            languageClass = 'language-cpp';
                        }

                        const extractText = (node: any): string => {
                            if (node.type === 'text') return node.data || '';
                            if (node.children) return node.children.map(extractText).join('');
                            return '';
                        };

                        const rawCode = extractText(codeNode);

                        return (
                            <PublishedCodeBlock language={languageClass} code={rawCode}>
                                <code className={languageClass}>
                                    {domToReact(codeNode.children as DOMNode[], options)}
                                </code>
                            </PublishedCodeBlock>
                        );
                    }
                }
            }
        };

        return parse(sanitizedHtml, options);
    }, [content, className]);

    if (!parsedContent) return null;

    return (
        <div className={className}>
            {parsedContent}
        </div>
    );
});

HtmlRenderer.displayName = 'HtmlRenderer';
