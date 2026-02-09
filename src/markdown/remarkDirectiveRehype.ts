import {visit} from "unist-util-visit";
import type {Node} from "unist";
import type {DirectiveNode} from "./directives.ts";
import {directiveHandlers} from "./directives.ts";
import type {Root} from "mdast";

function isDirectiveNode(node: Node): node is DirectiveNode {
    return (
        node.type === "containerDirective" ||
        node.type === "leafDirective" ||
        node.type === "textDirective"
    );
}

export function remarkDirectiveRehype() {
    return (tree: Root) => {
        visit(tree, (node: Node) => {
            if (!isDirectiveNode(node)) return;

            const name = node.name;
            if (!name) return;
            if (name in directiveHandlers) {
                const handler = directiveHandlers[name as keyof typeof directiveHandlers];
                handler(node);
            } else {
                console.error(`Missing handler for directive: ${name}`);
                node.data = {
                    hName: 'div',
                    hProperties: {
                        className: 'bg-red-900/20 border border-red-500 text-red-500 p-2 rounded',
                        title: `Unknown directive: ${name}`
                    }
                };
            }
        });
    };
}