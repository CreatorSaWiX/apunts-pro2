import { StepBuilder } from '../../engine/StepBuilder';

export class GraphBuilder extends StepBuilder {
    setHighlight(id: string | number, color: string) {
        const visual = this.getVisual();
        const highlights = { ...(visual.highlights || {}) };
        highlights[id] = color;
        this.setVisual({ highlights });
    }

    removeHighlight(id: string | number) {
        const visual = this.getVisual();
        const highlights = { ...(visual.highlights || {}) };
        delete highlights[id];
        this.setVisual({ highlights });
    }

    clearHighlights() {
        const visual = this.getVisual();
        this.setVisual({ ...visual, highlights: {} });
    }

    setNodeLabel(id: string | number, label: string) {
        const visual = this.getVisual();
        const nodeLabels = { ...(visual.nodeLabels || {}) };
        nodeLabels[id] = label;
        this.setVisual({ nodeLabels });
    }

    setLinks(links: { source: string | number; target: string | number; label?: string; color?: string; curvature?: number }[]) {
        this.setVisual({ links });
    }
}
