import type { Node, Edge } from '@xyflow/react';
import { getSemesterForSubject } from '../data/curriculum';

const NODE_WIDTH = 280;
const ROW_HEIGHT = 150;
const START_X = 50;
const START_Y = 50;

export const getGridLayoutedElements = (nodes: Node[], edges: Edge[]) => {
    const NODES_PER_ROW = 5;
    const layoutedNodes: Node[] = [];
    
    // Separem els nodes estrictes per quadrimestre (assignatures base) dels seqüencials (TFG, optatives, CFGS)
    const strictNodesBySemester: Record<number, Node[]> = {};
    const sequentialNodes: Node[] = [];
    const absoluteNodes: Node[] = [];
    
    nodes.forEach(node => {
        const dataType = node.data?.type as string;
        const nodeType = node.type as string;
        if (node.id.startsWith('ANNOTATION_') || ['text', 'postit'].includes(dataType) || ['textNode', 'postItNode'].includes(nodeType)) {
            absoluteNodes.push(node);
        } else if (['basic', 'obligatory', 'specialization'].includes(dataType)) {
            const semester = (node.data?.semester as number) || getSemesterForSubject(node.id);
            if (!strictNodesBySemester[semester]) strictNodesBySemester[semester] = [];
            strictNodesBySemester[semester].push(node);
        } else {
            // TFG, optional, mobility, internship, custom validations, cfgs
            sequentialNodes.push(node);
        }
    });

    let currentRowIndex = 0;
    let currentColumnIndex = 0;

    const semesters = Object.keys(strictNodesBySemester).map(Number);
    const maxSemester = semesters.length > 0 ? Math.max(...semesters) : 0;

    // 1. Dibuixar l'estructura base
    for (let sem = 1; sem <= maxSemester; sem++) {
        const group = strictNodesBySemester[sem] || [];
        
        // Ignorem semestres buits per no deixar buits verticals
        if (group.length === 0) continue;

        group.forEach((node, index) => {
            const subRow = Math.floor(index / NODES_PER_ROW);
            const col = index % NODES_PER_ROW;

            const x = START_X + col * NODE_WIDTH;
            const y = START_Y + (currentRowIndex + subRow) * ROW_HEIGHT;

            layoutedNodes.push({
                ...node,
                position: { x, y }
            });
            
            currentColumnIndex = col + 1;
        });

        const subRowsUsed = Math.ceil(group.length / NODES_PER_ROW);
        
        if (sem < maxSemester) {
            currentRowIndex += subRowsUsed;
            currentColumnIndex = 0;
        } else {
            // A l'últim semestre, ens quedem a la mateixa fila per continuar empalmant
            currentRowIndex += (subRowsUsed - 1);
        }
    }

    // 2. Dibuixar els nodes seqüencials empalmant just després
    // Posem el TFG primer si existeix, després la resta en l'ordre d'inserció
    const tfgNodes = sequentialNodes.filter(n => n.data.type === 'tfg');
    const otherSequential = sequentialNodes.filter(n => n.data.type !== 'tfg');
    const finalSequential = [...tfgNodes, ...otherSequential];

    finalSequential.forEach(node => {
        if (currentColumnIndex >= NODES_PER_ROW) {
            currentColumnIndex = 0;
            currentRowIndex++;
        }

        const x = START_X + currentColumnIndex * NODE_WIDTH;
        const y = START_Y + currentRowIndex * ROW_HEIGHT;

        layoutedNodes.push({
            ...node,
            position: { x, y }
        });

        currentColumnIndex++;
    });

    // 3. Afegir els nodes absoluts sense tocar la seva posició
    absoluteNodes.forEach(node => {
        layoutedNodes.push(node);
    });

    return { nodes: layoutedNodes, edges };
};
