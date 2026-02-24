import type { Solution } from '../../solutions';

export const ex1_2: Solution = {
    id: 'M1-T1-Ex1.2',
    title: 'Exercici 1.2: Construcció de Grafs',
    author: 'Profe',
    code: '',
    type: 'notebook',
    statement: `Doneu un graf amb la propietat que es demana, explicitant-ne la llista d'adjacències i una representació gràfica.`,
    content: `
### 1) Graf 3-regular d'ordre com a mínim 5

Un graf és $r$-regular si tots els vèrtexs tenen grau $r$. Busquem que tothom tingui 3 amics.
El cas més senzill amb $n \\ge 5$ és el **Prisma Triangular** ($n=6$).

**Llista d'adjacències**:
*   1: [2, 3, 4]
*   2: [1, 3, 5]
*   3: [1, 2, 6]
*   4: [1, 5, 6]
*   5: [2, 4, 6]
*   6: [3, 4, 5]

:::graph
\`\`\`json
{
  "nodes": [{ "id": 1 }, { "id": 2 }, { "id": 3 }, { "id": 4 }, { "id": 5 }, { "id": 6 }],
  "links": [
    { "source": 1, "target": 2 }, { "source": 2, "target": 3 }, { "source": 3, "target": 1 },
    { "source": 4, "target": 5 }, { "source": 5, "target": 6 }, { "source": 6, "target": 4 },
    { "source": 1, "target": 4 }, { "source": 2, "target": 5 }, { "source": 3, "target": 6 }
  ]
}
\`\`\`
:::
*Nota: També es coneix com el graf $K_3 \\times K_2$.*

### 2) Graf bipartit d'ordre 6

Volem dividir els 6 vèrtexs en dos equips (per exemple, 3 a cada costat, o 2 vs 4) i només connectar equips diferents.
Un exemple senzill: $C_6$ (l'hexàgon) és bipartit!
Equip A: {1, 3, 5}, Equip B: {2, 4, 6}.

**Llista d'adjacències**:
*   1: [2, 6]
*   2: [1, 3]
*   3: [2, 4]
*   4: [3, 5]
*   5: [4, 6]
*   6: [5, 1]

:::graph
\`\`\`json
{
  "nodes": [
    { "id": 1, "group": 1 }, { "id": 2, "group": 2 }, { "id": 3, "group": 1 },
    { "id": 4, "group": 2 }, { "id": 5, "group": 1 }, { "id": 6, "group": 2 }
  ],
  "links": [
    { "source": 1, "target": 2 }, { "source": 2, "target": 3 }, { "source": 3, "target": 4 },
    { "source": 4, "target": 5 }, { "source": 5, "target": 6 }, { "source": 6, "target": 1 }
  ]
}
\`\`\`
:::

### 3) Graf bipartit complet d'ordre 7 ($K_{3,4}$)

Dos conjunts $V_1$ (3 vèrtexs) i $V_2$ (4 vèrtexs). Tots els de $V_1$ connectats a tots els de $V_2$.

:::graph{height=250}
\`\`\`json
{
  "nodes": [
    { "id": "A1", "group": 1, "color": "#ef4444" }, { "id": "A2", "group": 1, "color": "#ef4444" }, { "id": "A3", "group": 1, "color": "#ef4444" },
    { "id": "B1", "group": 2, "color": "#3b82f6" }, { "id": "B2", "group": 2, "color": "#3b82f6" }, { "id": "B3", "group": 2, "color": "#3b82f6" }, { "id": "B4", "group": 2, "color": "#3b82f6" }
  ],
  "links": [
    { "source": "A1", "target": "B1" }, { "source": "A1", "target": "B2" }, { "source": "A1", "target": "B3" }, { "source": "A1", "target": "B4" },
    { "source": "A2", "target": "B1" }, { "source": "A2", "target": "B2" }, { "source": "A2", "target": "B3" }, { "source": "A2", "target": "B4" },
    { "source": "A3", "target": "B1" }, { "source": "A3", "target": "B2" }, { "source": "A3", "target": "B3" }, { "source": "A3", "target": "B4" }
  ]
}
\`\`\`
:::

### 4) Graf estrella d'ordre 7 ($K_{1,6}$)

Un cas particular de bipartit complet on un conjunt té només 1 vèrtex (el centre).

:::graph
\`\`\`json
{
  "nodes": [
    { "id": "Centre", "color": "#facc15" },
    { "id": 1 }, { "id": 2 }, { "id": 3 }, { "id": 4 }, { "id": 5 }, { "id": 6 }
  ],
  "links": [
    { "source": "Centre", "target": 1 }, { "source": "Centre", "target": 2 }, { "source": "Centre", "target": 3 },
    { "source": "Centre", "target": 4 }, { "source": "Centre", "target": 5 }, { "source": "Centre", "target": 6 }
  ]
}
\`\`\`
:::
        `,
    availableLanguages: ['ca']
  };
