import type { Task } from '../../../types/tasks';

/**
 * Configuració de la regla temporal de Gantt segons el nivell de zoom (píxels per minut)
 */
export function getRulerConfig(zoomLevel: number): { intervalMins: number; label: string } {
    if (zoomLevel >= 15) return { intervalMins: 5, label: 'HH:mm' };
    if (zoomLevel >= 8) return { intervalMins: 10, label: 'HH:mm' };
    if (zoomLevel >= 4) return { intervalMins: 15, label: 'HH:mm' };
    if (zoomLevel >= 2) return { intervalMins: 30, label: 'HH:mm' };
    if (zoomLevel >= 1) return { intervalMins: 60, label: 'HH:mm' };
    if (zoomLevel >= 0.5) return { intervalMins: 60 * 3, label: 'dd MMM HH:mm' };
    if (zoomLevel >= 0.2) return { intervalMins: 60 * 6, label: 'dd MMM HH:mm' };
    if (zoomLevel >= 0.05) return { intervalMins: 60 * 24, label: 'dd MMM' };
    return { intervalMins: 60 * 24 * 7, label: 'dd MMM' };
}

export interface TrackSlot {
    trackIndex: number;
    endTime: number;
}

/**
 * Min-Heap d'alta eficiència per a la cua de prioritat d'Interval Partitioning.
 * Garanteix temps d'assignació de pistes O(N log K) i espai O(K).
 */
export class TrackMinHeap {
    private heap: TrackSlot[] = [];

    get size(): number {
        return this.heap.length;
    }

    peek(): TrackSlot | undefined {
        return this.heap[0];
    }

    push(item: TrackSlot): void {
        this.heap.push(item);
        this.siftUp(this.heap.length - 1);
    }

    pop(): TrackSlot | undefined {
        if (this.heap.length === 0) return undefined;
        const top = this.heap[0];
        const bottom = this.heap.pop()!;
        if (this.heap.length > 0) {
            this.heap[0] = bottom;
            this.siftDown(0);
        }
        return top;
    }

    private siftUp(idx: number): void {
        while (idx > 0) {
            const parent = (idx - 1) >> 1;
            if (this.heap[idx].endTime < this.heap[parent].endTime) {
                const tmp = this.heap[idx];
                this.heap[idx] = this.heap[parent];
                this.heap[parent] = tmp;
                idx = parent;
            } else {
                break;
            }
        }
    }

    private siftDown(idx: number): void {
        const length = this.heap.length;
        const halfLength = length >> 1;
        while (idx < halfLength) {
            const left = (idx << 1) + 1;
            const right = left + 1;
            let smallest = idx;

            if (this.heap[left].endTime < this.heap[smallest].endTime) {
                smallest = left;
            }
            if (right < length && this.heap[right].endTime < this.heap[smallest].endTime) {
                smallest = right;
            }
            if (smallest !== idx) {
                const tmp = this.heap[idx];
                this.heap[idx] = this.heap[smallest];
                this.heap[smallest] = tmp;
                idx = smallest;
            } else {
                break;
            }
        }
    }
}

export type LayoutTask = Task & { 
    start: Date; 
    end: Date; 
    durationMins: number; 
    leftMins: number; 
    trackIndex: number; 
};
