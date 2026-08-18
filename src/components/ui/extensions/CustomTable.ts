import { Table, TableView } from '@tiptap/extension-table';
import type { Node as ProseMirrorNode } from '@tiptap/pm/model';
import type { EditorView } from '@tiptap/pm/view';

class CustomTableView extends TableView {
    constructor(node: ProseMirrorNode, cellMinWidth: number, view: EditorView, HTMLAttributes: Record<string, unknown>) {
        super(node as any, cellMinWidth, view as any, HTMLAttributes as any);
        this.applyCustomStyles(node);
    }

    applyCustomStyles(node: ProseMirrorNode) {
        if (node.attrs.width) {
            this.table.style.setProperty('--custom-table-width', node.attrs.width);
        }
        if (node.attrs.height && node.attrs.height !== 'auto') {
            this.table.style.setProperty('--custom-table-height', node.attrs.height);
        }
    }

    update(node: ProseMirrorNode) {
        const result = super.update(node as any);
        if (result) {
            this.applyCustomStyles(node);
        }
        return result;
    }
}

export const CustomTable = Table.extend({
    addOptions() {
        return {
            ...(this.parent?.() || {}),
            View: CustomTableView,
        } as any;
    },

    addAttributes() {
        return {
            ...this.parent?.(),
            width: {
                default: '100%',
                parseHTML: element => element.style.width || element.getAttribute('width') || '100%',
                renderHTML: attributes => {
                    return {
                        style: `width: ${attributes.width || '100%'};${attributes.height && attributes.height !== 'auto' ? ` height: ${attributes.height};` : ''}`,
                    };
                },
            },
            height: {
                default: 'auto',
                parseHTML: element => element.style.height || element.getAttribute('height') || 'auto',
                renderHTML: () => { return {} } 
            },
        };
    },
});
