import React from 'react';
import parse, { type DOMNode, Element, Text, domToReact } from 'html-react-parser';
import DOMPurify from 'isomorphic-dompurify';
import { PublishedCodeBlock } from '../extensions/PublishedCodeBlock';

interface HtmlRendererProps {
    content: string;
    className?: string;
}

export const HtmlRenderer = ({ content, className = '' }: HtmlRendererProps) => {
    if (!content) return null;

    // Sanitize with custom relaxed attributes if needed
    const sanitizedHtml = DOMPurify.sanitize(content, {
        ADD_ATTR: ['target', 'rel']
    });

    const options = {
        replace: (domNode: DOMNode) => {
            if (domNode instanceof Element && domNode.name === 'pre') {
                const codeNode = domNode.children.find(
                    (child) => child instanceof Element && child.name === 'code'
                ) as Element | undefined;

                if (codeNode) {
                    let languageClass = codeNode.attribs.class || '';
                    
                    // Force C++ for Jutge statements if no language is specified
                    if (!languageClass && className.includes('jutge-content')) {
                        languageClass = 'language-cpp';
                    }
                    
                    const extractText = (node: DOMNode): string => {
                        if (node instanceof Text) return node.data;
                        if (node instanceof Element && node.children) return (node.children as DOMNode[]).map(extractText).join('');
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
