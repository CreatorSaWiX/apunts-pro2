import React from 'react';
import parse, { type DOMNode, Element, domToReact } from 'html-react-parser';
import DOMPurify from 'dompurify';
import { PublishedCodeBlock } from './extensions/PublishedCodeBlock';

interface HtmlRendererProps {
    content: string;
    className?: string;
}

export const HtmlRenderer = ({ content, className = '' }: HtmlRendererProps) => {
    // We sanitize the HTML first, just like before, but we allow classes (for language-*)
    const sanitizedHtml = DOMPurify.sanitize(content, {
        ADD_ATTR: ['target', 'class'] // Ensuring class attributes are kept
    });

    const options = {
        replace: (domNode: DOMNode) => {
            if (domNode instanceof Element && domNode.name === 'pre') {
                const codeNode = domNode.children.find(
                    (child) => child instanceof Element && child.name === 'code'
                ) as Element | undefined;

                if (codeNode) {
                    const languageClass = codeNode.attribs.class || '';
                    
                    const extractText = (node: any): string => {
                        if (node.type === 'text') return node.data;
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

    return (
        <div className={className}>
            {parse(sanitizedHtml, options)}
        </div>
    );
};
