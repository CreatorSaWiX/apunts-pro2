import { visit } from 'unist-util-visit';
import type { Node } from 'unist';

interface CodeNode extends Node {
    meta?: string | null;
    data?: {
        hProperties?: Record<string, unknown>;
        [key: string]: unknown;
    };
}

export function remarkCodeMetadata() {
    return (tree: Node) => {
        visit(tree, 'code', (node: CodeNode) => {
            if (node.meta) {
                node.data = node.data || {};
                node.data.hProperties = node.data.hProperties || {};
                node.data.hProperties.metadata = node.meta;
            }
        });
    };
}
