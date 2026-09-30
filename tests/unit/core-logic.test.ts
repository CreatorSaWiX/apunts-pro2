import { TrackMinHeap, getRulerConfig } from '../../src/components/Planner/Gantt/TrackMinHeap';
import { wouldCreateCycle, computeDerivedState, checkPrerequisites, isGradableNode, removeUndefined } from '../../src/contexts/roadmap/roadmapLogic';
import type { Node, Edge } from '@xyflow/react';
import type { SubjectNodeData } from '../../src/contexts/roadmap/types';

// ─── TrackMinHeap ─────────────────────────────────────────────────────────────

describe('TrackMinHeap', () => {
    it('should return items in ascending endTime order', () => {
        const heap = new TrackMinHeap();
        heap.push({ trackIndex: 0, endTime: 100 });
        heap.push({ trackIndex: 1, endTime: 50 });
        heap.push({ trackIndex: 2, endTime: 200 });
        heap.push({ trackIndex: 3, endTime: 75 });

        const results = [];
        while (heap.size > 0) {
            results.push(heap.pop()!.endTime);
        }
        expect(results).toEqual([50, 75, 100, 200]);
    });

    it('should peek without removing', () => {
        const heap = new TrackMinHeap();
        heap.push({ trackIndex: 0, endTime: 30 });
        heap.push({ trackIndex: 1, endTime: 10 });
        
        expect(heap.peek()?.endTime).toBe(10);
        expect(heap.size).toBe(2);
    });

    it('should handle empty heap', () => {
        const heap = new TrackMinHeap();
        expect(heap.pop()).toBeUndefined();
        expect(heap.peek()).toBeUndefined();
        expect(heap.size).toBe(0);
    });

    it('should handle single element', () => {
        const heap = new TrackMinHeap();
        heap.push({ trackIndex: 0, endTime: 42 });
        expect(heap.pop()?.endTime).toBe(42);
        expect(heap.size).toBe(0);
    });

    it('should handle duplicate endTimes', () => {
        const heap = new TrackMinHeap();
        heap.push({ trackIndex: 0, endTime: 100 });
        heap.push({ trackIndex: 1, endTime: 100 });
        heap.push({ trackIndex: 2, endTime: 50 });

        expect(heap.pop()!.endTime).toBe(50);
        expect(heap.pop()!.endTime).toBe(100);
        expect(heap.pop()!.endTime).toBe(100);
    });
});

// ─── wouldCreateCycle ─────────────────────────────────────────────────────────

describe('wouldCreateCycle', () => {
    it('should detect self-loops', () => {
        expect(wouldCreateCycle('A', 'A', [])).toBe(true);
    });

    it('should detect direct cycle', () => {
        const edges = [
            { id: 'e1', source: 'A', target: 'B' }
        ];
        // Adding B->A would create A->B->A cycle
        expect(wouldCreateCycle('B', 'A', edges)).toBe(true);
    });

    it('should detect indirect cycle', () => {
        const edges = [
            { id: 'e1', source: 'A', target: 'B' },
            { id: 'e2', source: 'B', target: 'C' },
            { id: 'e3', source: 'C', target: 'D' }
        ];
        // Adding D->A would create A->B->C->D->A cycle
        expect(wouldCreateCycle('D', 'A', edges)).toBe(true);
    });

    it('should allow valid edges', () => {
        const edges = [
            { id: 'e1', source: 'A', target: 'B' },
            { id: 'e2', source: 'B', target: 'C' }
        ];
        // A->C is fine, no cycle
        expect(wouldCreateCycle('A', 'C', edges)).toBe(false);
        // A->D is fine, new node
        expect(wouldCreateCycle('A', 'D', edges)).toBe(false);
    });

    it('should handle empty edge list', () => {
        expect(wouldCreateCycle('A', 'B', [])).toBe(false);
    });

    it('should handle empty/null source/target', () => {
        expect(wouldCreateCycle('', 'B', [])).toBe(true);
        expect(wouldCreateCycle('A', '', [])).toBe(true);
    });

    it('should handle diamond DAG without false positive', () => {
        //     A
        //    / \
        //   B   C
        //    \ /
        //     D
        const edges = [
            { id: 'e1', source: 'A', target: 'B' },
            { id: 'e2', source: 'A', target: 'C' },
            { id: 'e3', source: 'B', target: 'D' },
            { id: 'e4', source: 'C', target: 'D' }
        ];
        // Adding A->D is fine (just shortcut, no cycle)
        expect(wouldCreateCycle('A', 'D', edges)).toBe(false);
        // Adding D->A WOULD create a cycle
        expect(wouldCreateCycle('D', 'A', edges)).toBe(true);
    });
});

// ─── computeDerivedState ──────────────────────────────────────────────────────

describe('computeDerivedState', () => {
    const makeNode = (id: string, credits: number, status: string, grade?: number | null, type = 'basic'): Node<SubjectNodeData> => ({
        id,
        position: { x: 0, y: 0 },
        data: {
            label: id,
            credits,
            status: status as SubjectNodeData['status'],
            type: type as SubjectNodeData['type'],
            attempts: status === 'passed' ? 1 : 0,
            description: id,
            semester: 1,
            grade: grade ?? null,
        }
    });

    it('should compute totalPassedECTS correctly', () => {
        const nodes = [
            makeNode('M1', 6, 'passed', 7),
            makeNode('M2', 6, 'in_progress'),
            makeNode('PRO2', 6, 'passed', 8),
        ];
        const result = computeDerivedState(nodes, null);
        expect(result.totalPassedECTS).toBe(12);
        expect(result.totalPlannedECTS).toBe(18);
    });

    it('should compute weighted average grade', () => {
        const nodes = [
            makeNode('M1', 6, 'passed', 7.0),
            makeNode('PRO2', 6, 'passed', 9.0),
        ];
        const result = computeDerivedState(nodes, null);
        // Weighted average: (7*6 + 9*6) / (6 + 6) = 96/12 = 8.0
        expect(result.averageGrade).toBe(8.0);
    });

    it('should return null average when no graded courses', () => {
        const nodes = [
            makeNode('M1', 6, 'in_progress'),
        ];
        const result = computeDerivedState(nodes, null);
        expect(result.averageGrade).toBeNull();
    });

    it('should compute canStartMaster at 213 ECTS', () => {
        const nodes = Array.from({ length: 36 }, (_, i) => 
            makeNode(`S${i}`, 6, 'passed', 7)
        ); // 36*6 = 216 ECTS
        const result = computeDerivedState(nodes, null);
        expect(result.canStartMaster).toBe(true);
    });

    it('should not allow master below 213 ECTS', () => {
        const nodes = Array.from({ length: 35 }, (_, i) => 
            makeNode(`S${i}`, 6, 'passed', 7)
        ); // 35*6 = 210 ECTS
        const result = computeDerivedState(nodes, null);
        expect(result.canStartMaster).toBe(false);
    });

    it('should compute requiredAverageGrade for target', () => {
        const nodes = [
            makeNode('M1', 6, 'passed', 7.0),
            makeNode('M2', 6, 'in_progress'), // remaining
        ];
        // Target: 8.0, total gradable ECTS: 12
        // Required: (8*12 - 7*6) / 6 = (96-42)/6 = 54/6 = 9.0
        const result = computeDerivedState(nodes, 8.0);
        expect(result.requiredAverageGrade).toBe(9.0);
    });

    it('should exclude CFGS nodes from GPA computation', () => {
        const nodes = [
            makeNode('M1', 6, 'passed', 7.0),
            makeNode('CFGS_valid', 30, 'passed', undefined, 'optional'),
        ];
        // CFGS_ prefix should be excluded from gradable
        const result = computeDerivedState(nodes, null);
        expect(result.totalPassedECTS).toBe(36); // both count for total
        expect(result.averageGrade).toBe(7.0); // only M1 counts for GPA
    });
});

// ─── getRulerConfig ───────────────────────────────────────────────────────────

describe('getRulerConfig', () => {
    it('should return 5 min intervals for extreme zoom (>= 15)', () => {
        expect(getRulerConfig(15)).toEqual({ intervalMins: 5, label: 'HH:mm' });
        expect(getRulerConfig(20)).toEqual({ intervalMins: 5, label: 'HH:mm' });
    });

    it('should return 60 min intervals for medium zoom (>= 1)', () => {
        expect(getRulerConfig(1)).toEqual({ intervalMins: 60, label: 'HH:mm' });
    });

    it('should return 1 day intervals for low zoom (>= 0.05)', () => {
        expect(getRulerConfig(0.05)).toEqual({ intervalMins: 60 * 24, label: 'dd MMM' });
    });

    it('should return weekly intervals for far zoom (< 0.05)', () => {
        expect(getRulerConfig(0.01)).toEqual({ intervalMins: 60 * 24 * 7, label: 'dd MMM' });
    });
});

// ─── isGradableNode ───────────────────────────────────────────────────────────

describe('isGradableNode', () => {
    it('should treat standard courses as gradable', () => {
        const node: Node<SubjectNodeData> = {
            id: 'PRO2',
            position: { x: 0, y: 0 },
            data: { label: 'PRO2', credits: 6, status: 'available', type: 'basic', attempts: 0, description: '', semester: 2, grade: null }
        };
        expect(isGradableNode(node)).toBe(true);
    });

    it('should exclude CFGS and VALIDATION nodes', () => {
        const cfgsNode: Node<SubjectNodeData> = {
            id: 'CFGS_01',
            position: { x: 0, y: 0 },
            data: { label: 'CFGS', credits: 15, status: 'passed', type: 'optional', attempts: 1, description: '', semester: 1, grade: null }
        };
        const valNode: Node<SubjectNodeData> = {
            id: 'VALIDATION_01',
            position: { x: 0, y: 0 },
            data: { label: 'VAL', credits: 6, status: 'passed', type: 'optional', attempts: 1, description: '', semester: 1, grade: null }
        };
        expect(isGradableNode(cfgsNode)).toBe(false);
        expect(isGradableNode(valNode)).toBe(false);
    });

    it('should exclude text and postit types', () => {
        const textNode: Node<SubjectNodeData> = {
            id: 'TXT_1',
            position: { x: 0, y: 0 },
            data: { label: 'Note', credits: 0, status: 'available', type: 'text', attempts: 0, description: '', semester: 1, grade: null }
        };
        expect(isGradableNode(textNode)).toBe(false);
    });
});

// ─── checkPrerequisites ───────────────────────────────────────────────────────

describe('checkPrerequisites', () => {
    it('should unlock downstream subject when prerequisite is passed', () => {
        const nodes: Node<SubjectNodeData>[] = [
            {
                id: 'PRO1',
                position: { x: 0, y: 0 },
                data: { label: 'PRO1', credits: 6, status: 'passed', type: 'basic', attempts: 1, description: '', semester: 1, grade: 8 }
            },
            {
                id: 'PRO2',
                position: { x: 0, y: 0 },
                data: { label: 'PRO2', credits: 6, status: 'locked', type: 'mandatory', attempts: 0, description: '', semester: 2, grade: null }
            }
        ];
        const edges: Edge[] = [
            { id: 'e1', source: 'PRO1', target: 'PRO2' }
        ];

        const updated = checkPrerequisites(nodes, edges);
        const pro2 = updated.find(n => n.id === 'PRO2');
        expect(pro2?.data.status).toBe('in_progress');
    });

    it('should lock downstream subject when prerequisite is not passed', () => {
        const nodes: Node<SubjectNodeData>[] = [
            {
                id: 'PRO1',
                position: { x: 0, y: 0 },
                data: { label: 'PRO1', credits: 6, status: 'in_progress', type: 'basic', attempts: 1, description: '', semester: 1, grade: null }
            },
            {
                id: 'PRO2',
                position: { x: 0, y: 0 },
                data: { label: 'PRO2', credits: 6, status: 'available', type: 'mandatory', attempts: 0, description: '', semester: 2, grade: null }
            }
        ];
        const edges: Edge[] = [
            { id: 'e1', source: 'PRO1', target: 'PRO2' }
        ];

        const updated = checkPrerequisites(nodes, edges);
        const pro2 = updated.find(n => n.id === 'PRO2');
        expect(pro2?.data.status).toBe('locked');
    });

    it('should never downgrade passed subjects', () => {
        const nodes: Node<SubjectNodeData>[] = [
            {
                id: 'PRO2',
                position: { x: 0, y: 0 },
                data: { label: 'PRO2', credits: 6, status: 'passed', type: 'mandatory', attempts: 1, description: '', semester: 2, grade: 9 }
            }
        ];
        const edges: Edge[] = [
            { id: 'e1', source: 'PRO1', target: 'PRO2' } // PRO1 missing/not passed
        ];

        const updated = checkPrerequisites(nodes, edges);
        const pro2 = updated.find(n => n.id === 'PRO2');
        expect(pro2?.data.status).toBe('passed');
    });
});

// ─── removeUndefined ──────────────────────────────────────────────────────────

describe('removeUndefined', () => {
    it('should recursively strip undefined properties from objects', () => {
        const input = {
            a: 1,
            b: undefined,
            c: {
                d: 'hello',
                e: undefined,
                f: [1, 2, 3]
            }
        };
        const cleaned = removeUndefined(input);
        expect(cleaned).toEqual({
            a: 1,
            c: {
                d: 'hello',
                f: [1, 2, 3]
            }
        });
        expect('b' in cleaned).toBe(false);
        expect('e' in (cleaned as any).c).toBe(false);
    });
});
