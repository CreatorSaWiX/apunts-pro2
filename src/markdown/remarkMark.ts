/**
 * remarkMark — Custom remark plugin for ==highlight== syntax.
 * 
 * Replaces the external `remark-mark@0.0.0` dependency (unversioned, unmaintained)
 * with a self-contained, type-safe implementation.
 * 
 * Syntax: ==highlighted text== → <mark>highlighted text</mark>
 * 
 * This avoids the ambiguity with `$...$` (LaTeX math) that was causing
 * confusion for contributors writing solution documents.
 * 
 * @see SYNTAX_GUIDE.md for full syntax documentation
 */

import type { Plugin } from 'unified';
import type { Text, Parent } from 'mdast';
import { visit } from 'unist-util-visit';

const MARK_REGEX = /==(.+?)==/g;

const remarkMark: Plugin = () => {
    return (tree) => {
        visit(tree, 'text', (node: Text, index: number | undefined, parent: Parent | undefined) => {
            if (!parent || index === undefined) return;

            const value = node.value;
            if (!value.includes('==')) return;

            const children: (Text | { type: string; data: { hName: string }; children: Text[] })[] = [];
            let lastIndex = 0;

            // Reset regex state (global flag)
            MARK_REGEX.lastIndex = 0;

            let match: RegExpExecArray | null;
            while ((match = MARK_REGEX.exec(value)) !== null) {
                // Text before the match
                if (match.index > lastIndex) {
                    children.push({
                        type: 'text',
                        value: value.slice(lastIndex, match.index)
                    } as Text);
                }

                // The <mark> element
                children.push({
                    type: 'mark',
                    data: { hName: 'mark' },
                    children: [{ type: 'text', value: match[1] } as Text]
                });

                lastIndex = match.index + match[0].length;
            }

            // If no matches found, skip
            if (children.length === 0) return;

            // Remaining text after last match
            if (lastIndex < value.length) {
                children.push({
                    type: 'text',
                    value: value.slice(lastIndex)
                } as Text);
            }

            // Replace the text node with our new children
            parent.children.splice(index, 1, ...(children as unknown as Parent['children']));
        });
    };
};

export default remarkMark;
