import { Extension } from '@tiptap/core';

export interface LineHeightOptions {
    types: string[];
    lineHeights: string[];
    defaultLineHeight: string;
}

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        lineHeight: {
            setLineHeight: (lineHeight: string) => ReturnType;
            unsetLineHeight: () => ReturnType;
        };
    }
}

export const LineHeight = Extension.create<LineHeightOptions>({
    name: 'lineHeight',

    addOptions() {
        return {
            types: ['paragraph', 'heading', 'listItem'],
            lineHeights: ['1', '1.15', '1.5', '2', '2.5', '3'],
            defaultLineHeight: '1.5',
        };
    },

    addGlobalAttributes() {
        return [
            {
                types: this.options.types,
                attributes: {
                    lineHeight: {
                        default: this.options.defaultLineHeight,
                        parseHTML: element => element.style.lineHeight || this.options.defaultLineHeight,
                        renderHTML: attributes => {
                            if (attributes.lineHeight === this.options.defaultLineHeight) {
                                return {};
                            }
                            return { style: `line-height: ${attributes.lineHeight}` };
                        },
                    },
                },
            },
        ];
    },

    addCommands() {
        return {
            setLineHeight: (lineHeight: string) => ({ tr, state, dispatch }) => {
                const { selection } = state;
                let modified = false;

                tr.doc.nodesBetween(selection.from, selection.to, (node, pos) => {
                    if (this.options.types.includes(node.type.name)) {
                        if (dispatch) {
                            tr.setNodeMarkup(pos, undefined, {
                                ...node.attrs,
                                lineHeight,
                            });
                        }
                        modified = true;
                    }
                });

                return modified;
            },
            unsetLineHeight: () => ({ tr, state, dispatch }) => {
                const { selection } = state;
                let modified = false;

                tr.doc.nodesBetween(selection.from, selection.to, (node, pos) => {
                    if (this.options.types.includes(node.type.name)) {
                        if (dispatch) {
                            const newAttrs = { ...node.attrs };
                            delete newAttrs.lineHeight;
                            tr.setNodeMarkup(pos, undefined, newAttrs);
                        }
                        modified = true;
                    }
                });

                return modified;
            },
        };
    },
});
