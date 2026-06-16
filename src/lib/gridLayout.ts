import type { Node, Edge } from '@xyflow/react';
import { getSemesterForSubject } from '../data/curriculum';

const NODE_WIDTH = 280;
const ROW_HEIGHT = 150;
const START_X = 50;
const START_Y = 50;

export const getGridLayoutedElements = (nodes: Node[], edges: Edge[]) => {
    // Group nodes by semester
    const semesterGroups: Record<number, Node[]> = {};
    
    // First pass: assign explicit semesters or fallback to dynamic ones based on dependencies?
    // For now, we use the explicit static semesters for base nodes, and push optatives to Q5-Q8.
    
    nodes.forEach(node => {
        const semester = getSemesterForSubject(node.id);
        if (!semesterGroups[semester]) semesterGroups[semester] = [];
        semesterGroups[semester].push(node);
    });

    const layoutedNodes = nodes.map(node => {
        const semester = getSemesterForSubject(node.id);
        const group = semesterGroups[semester];
        // Sort alphabetically or logically? We can just use the index of insertion
        const indexInSemester = group.findIndex(n => n.id === node.id);

        // Center vertically based on max items? No, just top aligned or centered.
        // Let's just top align for a clean grid.
        // Transposed: Semesters are now ROWS, Subjects are COLUMNS
        const x = START_X + indexInSemester * NODE_WIDTH;
        const y = START_Y + (semester - 1) * ROW_HEIGHT;

        return {
            ...node,
            position: { x, y }
        };
    });

    return { nodes: layoutedNodes, edges };
};
