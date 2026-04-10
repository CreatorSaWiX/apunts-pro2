import type { Solution } from '../../solutions';

export const ex2_4: Solution = {
    id: 'M1-T2-Ex2.4',
    title: 'Exercici 2.4: Algorisme DFS',
    author: 'Profe',
    code: '',
    type: 'notebook',
    statement: `Useu l'algorisme DFS per esbrinar si els grafs següents, representats mitjançant la seva llista d'adjacències, són connexos, i en cas contrari determineu-ne els components connexos. Considereu que el conjunt de vèrtexs està ordenat alfabèticament.`,
    content: `
**Regla del DFS:** des del vèrtex actual, saltem al veí **no visitat** de menor ordre alfabètic. Quan tots els veïns estan visitats, fem *backtrack*.

### Graf 1

:::graph{height=280}
\`\`\`json
{
  "nodes": [
    { "id": "a", "color": "#3b82f6" }, { "id": "b", "color": "#3b82f6" },
    { "id": "c", "color": "#ef4444" }, { "id": "d", "color": "#3b82f6" },
    { "id": "e", "color": "#3b82f6" }, { "id": "f", "color": "#3b82f6" },
    { "id": "g", "color": "#3b82f6" }, { "id": "h", "color": "#ef4444" },
    { "id": "i", "color": "#3b82f6" }, { "id": "j", "color": "#3b82f6" }
  ],
  "links": [
    { "source": "a", "target": "d" }, { "source": "a", "target": "e" }, { "source": "a", "target": "f" },
    { "source": "b", "target": "d" }, { "source": "b", "target": "g" }, { "source": "b", "target": "i" }, { "source": "b", "target": "j" },
    { "source": "c", "target": "h" },
    { "source": "d", "target": "e" }, { "source": "d", "target": "f" },
    { "source": "g", "target": "i" }, { "source": "g", "target": "j" }
  ]
}
\`\`\`
:::

**DFS des de $a$:**

$a \\to d \\to b \\to g \\to i$ (backtrack) $\\to j$ (backtrack fins a $d$) $\\to e$ (backtrack) $\\to f$

**Component 1 (blau):** $\\{a, b, d, e, f, g, i, j\\}$

Queden $c$ i $h$ sense visitar. Nou DFS des de $c$: $c \\to h$.

**Component 2 (vermell):** $\\{c, h\\}$

**Conclusió:** Graf **NO connex**. 2 components connexos.

---

### Graf 2

:::graph{height=280}
\`\`\`json
{
  "nodes": [
    { "id": "a", "color": "#3b82f6" }, { "id": "b", "color": "#3b82f6" },
    { "id": "c", "color": "#ef4444" }, { "id": "d", "color": "#3b82f6" },
    { "id": "e", "color": "#3b82f6" }, { "id": "f", "color": "#ef4444" },
    { "id": "g", "color": "#3b82f6" }, { "id": "h", "color": "#3b82f6" },
    { "id": "i", "color": "#ef4444" }, { "id": "j", "color": "#3b82f6" },
    { "id": "k", "color": "#ef4444" }, { "id": "l", "color": "#ef4444" },
    { "id": "m", "color": "#3b82f6" }
  ],
  "links": [
    { "source": "a", "target": "b" }, { "source": "a", "target": "j" },
    { "source": "b", "target": "d" }, { "source": "b", "target": "e" }, { "source": "b", "target": "g" },
    { "source": "b", "target": "h" }, { "source": "b", "target": "j" },
    { "source": "c", "target": "f" }, { "source": "c", "target": "i" }, { "source": "c", "target": "k" },
    { "source": "d", "target": "h" },
    { "source": "e", "target": "g" },
    { "source": "f", "target": "k" },
    { "source": "g", "target": "m" },
    { "source": "i", "target": "k" }, { "source": "i", "target": "l" }
  ]
}
\`\`\`
:::

**DFS des de $a$:**

$a \\to b \\to d \\to h$ (backtrack fins a $b$) $\\to e \\to g \\to m$ (backtrack fins a $b$) $\\to j$

**Component 1 (blau):** $\\{a, b, d, e, g, h, j, m\\}$

Queden $c, f, i, k, l$. Nou DFS des de $c$: $c \\to f \\to k \\to i \\to l$.

**Component 2 (vermell):** $\\{c, f, i, k, l\\}$

**Conclusió:** Graf **NO connex**. 2 components connexos. $\\square$
  `,
    availableLanguages: ['ca']
};
