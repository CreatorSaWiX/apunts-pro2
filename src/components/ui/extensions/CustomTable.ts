import { Table, TableView } from '@tiptap/extension-table';

export class CustomTableView extends TableView {
    constructor(node: any, cellMinWidth: number, view: any, HTMLAttributes: any) {
        super(node, cellMinWidth, view, HTMLAttributes);
        this.applyCustomStyles(node);
    }

    applyCustomStyles(node: any) {
        if (node.attrs.width) {
            this.table.style.setProperty('--custom-table-width', node.attrs.width);
        }
        if (node.attrs.height && node.attrs.height !== 'auto') {
            this.table.style.setProperty('--custom-table-height', node.attrs.height);
        }
    }

    update(node: any) {
        const result = super.update(node);
        if (result) {
            this.applyCustomStyles(node);
        }
        return result;
    }
}

export const CustomTable = Table.extend({
    addOptions() {
        return {
            ...(this.parent?.() as any),
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
