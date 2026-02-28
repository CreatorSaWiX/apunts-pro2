import type { Solution } from '../../solutions';

export const ex1_6: Solution = {
    id: 'M1-T1-Ex1.6',
    title: 'Exercici 1.6: Subgrafs Induïts',
    author: 'Profe',
    code: '',
    type: 'notebook',
    statement: `El graf $G$ té vèrtexs $V = \\{0..8\\}$. $u \\sim v \\iff |u-v| \\in \\{1, 4, 5, 8\\}$. Determineu ordre i mida de:

1. El subgraf induït pels parells.
2. El subgraf induït pels senars.
3. El subgraf induït per $\\{0, 1, 2, 3, 4\\}$.
4. Un subgraf generador amb màxim d'arestes sense cicles.`,
    content: `
Traduïm l'enunciat: Tenim graf $G$ amb vèrtexs de 0 a 8 (9 en total). Dos vèrtexs estan connectats si la distància és de 1, 4, 5 o 8. Primer, llistem les adjacències.

*   0: 1, 4, 5, 8
*   1: 0, 2, 5, 6
*   2: 1, 3, 6, 7
*   3: 2, 4, 7, 8
*   4: 0, 3, 5, 8
*   5: 0, 1, 4, 6
*   6: 1, 2, 5, 7
*   7: 2, 3, 6, 8
*   8: 0, 3, 4, 7

:::graph
\`\`\`json
{
  "nodes": [
    { "id": 0 }, { "id": 1 }, { "id": 2 }, { "id": 3 }, { "id": 4 },
    { "id": 5 }, { "id": 6 }, { "id": 7 }, { "id": 8 }
  ],
  "links": [
    { "source": 0, "target": 1 }, { "source": 0, "target": 4 }, { "source": 0, "target": 5 }, { "source": 0, "target": 8 },
    { "source": 1, "target": 2 }, { "source": 1, "target": 5 }, { "source": 1, "target": 6 },
    { "source": 2, "target": 3 }, { "source": 2, "target": 6 }, { "source": 2, "target": 7 },
    { "source": 3, "target": 4 }, { "source": 3, "target": 7 }, { "source": 3, "target": 8 },
    { "source": 4, "target": 5 }, { "source": 4, "target": 8 },
    { "source": 5, "target": 6 },
    { "source": 6, "target": 7 },
    { "source": 7, "target": 8 }
  ]
}
\`\`\`
:::

#### 1) Subgraf induït pels vèrtexs PARELLS $\\{0, 2, 4, 6, 8\\}$

:::graph
\`\`\`json
{
  "nodes": [
    { "id": 0, "color": "#3b82f6" }, { "id": 2, "color": "#3b82f6" },
    { "id": 4, "color": "#3b82f6" }, { "id": 6, "color": "#3b82f6" }, { "id": 8, "color": "#3b82f6" }
  ],
  "links": [
    { "source": 0, "target": 4 }, { "source": 0, "target": 8 },
    { "source": 2, "target": 6 }, { "source": 4, "target": 8 }
  ]
}
\`\`\`
:::


**Ordre**: 5 (són 5 números).
**Mida**: Comptem les arestes on *tots dos* siguin parells.
Arestes: (0,4), (0,8), (2,6), (4,8) → Total: 4 arestes.
**Resultat: Ordre 5, Mida 4.**

#### 2) Subgraf induït pels vèrtexs SENARS $\\{1, 3, 5, 7\\}$

:::graph
\`\`\`json
{
  "nodes": [
    { "id": 1, "color": "#f59e0b" }, { "id": 3, "color": "#f59e0b" },
    { "id": 5, "color": "#f59e0b" }, { "id": 7, "color": "#f59e0b" }
  ],
  "links": [
    { "source": 1, "target": 5 }, { "source": 3, "target": 7 }
  ]
}
\`\`\`
:::

**Ordre**: 4.
**Mida**: Diferències 4 o 8.
*   (1,5) (dif 4)
*   (3,7) (dif 4)
Total: 2 arestes.
**Resultat: Ordre 4, Mida 2.**

#### 3) Subgraf induït per $\\{0, 1, 2, 3, 4\\}$

:::graph
\`\`\`json
{
  "nodes": [
    { "id": 0, "color": "#10b981" }, { "id": 1, "color": "#10b981" },
    { "id": 2, "color": "#10b981" }, { "id": 3, "color": "#10b981" }, { "id": 4, "color": "#10b981" }
  ],
  "links": [
    { "source": 0, "target": 1 }, { "source": 1, "target": 2 },
    { "source": 2, "target": 3 }, { "source": 3, "target": 4 }, { "source": 4, "target": 0 }
  ]
}
\`\`\`
:::

**Ordre**: 5.
**Mida**: Busquem arestes on $u,v \\in \\{0,1,2,3,4\\}$. Diferències 1 o 4 (5 i 8 massa grans per aquest conjunt petit).
*   Dif 1: (0,1), (1,2), (2,3), (3,4) $\\to$ 4 arestes.
*   Dif 4: (0,4) $\\to$ 1 aresta.
Total: 5 arestes.
**Resultat: Ordre 5, Mida 5.**
*(Forma un cicle $0-1-2-3-4-0$).*

#### 4) Subgraf generador, màxim d'arestes, sense cicles
Això té un nom: **Arbre generador**.
Un arbre amb $n$ vèrtexs sempre té **$n-1$ arestes**.

:::graph
\`\`\`json
{
  "nodes": [
    { "id": 0 }, { "id": 1 }, { "id": 2 }, { "id": 3 }, { "id": 4 },
    { "id": 5 }, { "id": 6 }, { "id": 7 }, { "id": 8 }
  ],
  "links": [
    { "source": 0, "target": 1 }, { "source": 1, "target": 2 }, { "source": 2, "target": 3 },
    { "source": 3, "target": 4 }, { "source": 4, "target": 5 }, { "source": 5, "target": 6 },
    { "source": 6, "target": 7 }, { "source": 7, "target": 8 }
  ]
}
\`\`\`
:::

Com que $G$ original té $n=9$ vèrtexs, qualsevol subgraf generador tindrà ordre 9.
Si volem el màxim d'arestes sense fer cicles, hem de connectar-ho tot sense tancar camins.
Mida màxima = $9 - 1 = 8$.

**Resultat: Ordre 9, Mida 8.**
        `,
    availableLanguages: ['ca']
};
