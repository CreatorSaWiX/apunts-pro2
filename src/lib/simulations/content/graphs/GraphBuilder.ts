import { StepBuilder } from '../../engine/StepBuilder';
import type { GraphVisualState } from '../../engine/types';

export class GraphBuilder extends StepBuilder<GraphVisualState> {
    constructor() {
        super();
        this.visual = {
            highlights: {},
            nodeLabels: {},
            links: []
        };
    }

    setHighlight(id: string | number, color: string): this {
        const visual = this.getVisual();
        const highlights = { ...(visual.highlights || {}) };
        highlights[id] = color;
        this.setVisual({ highlights });
        return this;
    }

    removeHighlight(id: string | number): this {
        const visual = this.getVisual();
        const highlights = { ...(visual.highlights || {}) };
        delete highlights[id];
        this.setVisual({ highlights });
        return this;
    }

    clearHighlights(): this {
        const visual = this.getVisual();
        this.setVisual({ ...visual, highlights: {} });
        return this;
    }

    setNodeLabel(id: string | number, label: string): this {
        const visual = this.getVisual();
        const nodeLabels = { ...(visual.nodeLabels || {}) };
        nodeLabels[id] = label;
        this.setVisual({ nodeLabels });
        return this;
    }

    setLinks(links: { source: string | number; target: string | number; label?: string; color?: string; curvature?: number }[]): this {
        this.setVisual({ links });
        return this;
    }
}
