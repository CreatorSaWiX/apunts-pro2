export const treeGraph = {
    nodes: [
        { id: 1, label: "1", fx: 0, fy: -100 },
        { id: 2, label: "2", fx: -60, fy: -20 },
        { id: 3, label: "3", fx: 60, fy: -20 },
        { id: 4, label: "4", fx: -90, fy: 60 },
        { id: 5, label: "5", fx: -30, fy: 60 },
        { id: 6, label: "6", fx: 30, fy: 60 },
        { id: 7, label: "7", fx: 90, fy: 60 }
    ],
    links: [
        { source: 1, target: 2 },
        { source: 1, target: 3 },
        { source: 2, target: 4 },
        { source: 2, target: 5 },
        { source: 3, target: 6 },
        { source: 3, target: 7 }
    ]
};

export const treeLeft: Record<number, number | null> = { 1: 2, 2: 4, 3: 6, 4: null, 5: null, 6: null, 7: null };
export const treeRight: Record<number, number | null> = { 1: 3, 2: 5, 3: 7, 4: null, 5: null, 6: null, 7: null };

// BST: nodes are labeled with actual values. Tree: 50(arrel), 20(esq), 80(dre), 10(esq-esq), 30(esq-dre), 70(dre-esq), 90(dre-dre)
// Node IDs: 1=50, 2=20, 3=80, 4=10, 5=30, 6=70, 7=90
export const bstGraph = {
    nodes: [
        { id: 1, label: "50", fx: 0,    fy: -120 },
        { id: 2, label: "20", fx: -80,  fy: -40  },
        { id: 3, label: "80", fx: 80,   fy: -40  },
        { id: 4, label: "10", fx: -120, fy: 60   },
        { id: 5, label: "30", fx: -40,  fy: 60   },
        { id: 6, label: "70", fx: 40,   fy: 60   },
        { id: 7, label: "90", fx: 120,  fy: 60   },
    ],
    links: [
        { source: 1, target: 2 },
        { source: 1, target: 3 },
        { source: 2, target: 4 },
        { source: 2, target: 5 },
        { source: 3, target: 6 },
        { source: 3, target: 7 },
    ]
};

// BST values per node id
export const bstVal: Record<number, number> = { 1: 50, 2: 20, 3: 80, 4: 10, 5: 30, 6: 70, 7: 90 };
