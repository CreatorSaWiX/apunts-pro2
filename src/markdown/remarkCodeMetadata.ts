import { visit } from 'unist-util-visit';

export function remarkCodeMetadata() {
    return (tree: any) => {
        visit(tree, 'code', (node: any) => {
            if (node.meta) {
                node.data = node.data || {};
                node.data.hProperties = node.data.hProperties || {};
                node.data.hProperties.metadata = node.meta;
            }
        });
    };
}
