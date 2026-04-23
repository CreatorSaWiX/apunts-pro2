import type { Solution } from '../../../solutions';

export const ex1_1: Solution = {
  id: 'M1-T1-Ex1.1',
  title: 'Exercici 1.1: Famílies de Grafs',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Per a cadascun dels grafs $N_n$, $K_n$, $T_n$, $C_n$ i $W_n$, doneu-ne:

1. Una representació gràfica per a $n=4$ i $n=6$.
2. La matriu d'adjacència per a $n=5$.
3. L'ordre, la mida, el grau màxim i el grau mínim en funció de $n$.`,
  // A grafs s'ha de posar en un grid de 2 cols, ja que falta per n=6
  content: `

  ### 1. Representacions i Matrius ($n=4, 5, 6$)

### $N_n$ (Graf Nul)
::::grid{cols=3}
:::graph{height=150}
\`\`\`json
{ "nodes": [ { "id": 1 }, { "id": 2 }, { "id": 3 }, { "id": 4 } ], "links": [] }
\`\`\`
:::

:::graph{height=150}
\`\`\`json
{ "nodes": [ { "id": 1 }, { "id": 2 }, { "id": 3 }, { "id": 4 }, { "id": 5 }, { "id": 6 } ], "links": [] }
\`\`\`
:::

$$
\\begin{pmatrix} 0 & 0 & 0 & 0 & 0 \\\\ 0 & 0 & 0 & 0 & 0 \\\\ 0 & 0 & 0 & 0 & 0 \\\\ 0 & 0 & 0 & 0 & 0 \\\\ 0 & 0 & 0 & 0 & 0 \\end{pmatrix}
$$
::::

### $K_n$ (Graf Complet)
::::grid{cols=3}
:::graph{height=150}
\`\`\`json
{
  "nodes": [{ "id": 1 }, { "id": 2 }, { "id": 3 }, { "id": 4 }],
  "links": [
    { "source": 1, "target": 2 }, { "source": 1, "target": 3 }, { "source": 1, "target": 4 },
    { "source": 2, "target": 3 }, { "source": 2, "target": 4 }, { "source": 3, "target": 4 }
  ]
}
\`\`\`
:::

:::graph{height=150}
\`\`\`json
{
  "nodes": [{ "id": 1 }, { "id": 2 }, { "id": 3 }, { "id": 4 }, { "id": 5 }, { "id": 6 }],
  "links": [
    { "source": 1, "target": 2 }, { "source": 1, "target": 3 }, { "source": 1, "target": 4 }, { "source": 1, "target": 5 }, { "source": 1, "target": 6 },
    { "source": 2, "target": 3 }, { "source": 2, "target": 4 }, { "source": 2, "target": 5 }, { "source": 2, "target": 6 },
    { "source": 3, "target": 4 }, { "source": 3, "target": 5 }, { "source": 3, "target": 6 },
    { "source": 4, "target": 5 }, { "source": 4, "target": 6 }, { "source": 5, "target": 6 }
  ]
}
\`\`\`
:::

$$
\\begin{pmatrix} 0 & 1 & 1 & 1 & 1 \\\\ 1 & 0 & 1 & 1 & 1 \\\\ 1 & 1 & 0 & 1 & 1 \\\\ 1 & 1 & 1 & 0 & 1 \\\\ 1 & 1 & 1 & 1 & 0 \\end{pmatrix}
$$
::::

### $T_n$ (Trajecte)
::::grid{cols=3}
:::graph{height=150}
\`\`\`json
{ "nodes": [{ "id": 1 }, { "id": 2 }, { "id": 3 }, { "id": 4 }], "links": [ { "source": 1, "target": 2 }, { "source": 2, "target": 3 }, { "source": 3, "target": 4 } ] }
\`\`\`
:::

:::graph{height=150}
\`\`\`json
{ "nodes": [{ "id": 1 }, { "id": 2 }, { "id": 3 }, { "id": 4 }, { "id": 5 }, { "id": 6 }], "links": [ { "source": 1, "target": 2 }, { "source": 2, "target": 3 }, { "source": 3, "target": 4 }, { "source": 4, "target": 5 }, { "source": 5, "target": 6 } ] }
\`\`\`
:::

$$
\\begin{pmatrix} 0 & 1 & 0 & 0 & 0 \\\\ 1 & 0 & 1 & 0 & 0 \\\\ 0 & 1 & 0 & 1 & 0 \\\\ 0 & 0 & 1 & 0 & 1 \\\\ 0 & 0 & 0 & 1 & 0 \\end{pmatrix}
$$
::::

### $C_n$ (Cicle)
::::grid{cols=3}
:::graph{height=150}
\`\`\`json
{ "nodes": [{ "id": 1 }, { "id": 2 }, { "id": 3 }, { "id": 4 }], "links": [ { "source": 1, "target": 2 }, { "source": 2, "target": 3 }, { "source": 3, "target": 4 }, { "source": 4, "target": 1 } ] }
\`\`\`
:::

:::graph{height=150}
\`\`\`json
{ "nodes": [{ "id": 1 }, { "id": 2 }, { "id": 3 }, { "id": 4 }, { "id": 5 }, { "id": 6 }], "links": [ { "source": 1, "target": 2 }, { "source": 2, "target": 3 }, { "source": 3, "target": 4 }, { "source": 4, "target": 5 }, { "source": 5, "target": 6 }, { "source": 6, "target": 1 } ] }
\`\`\`
:::

$$
\\begin{pmatrix} 0 & 1 & 0 & 0 & 1 \\\\ 1 & 0 & 1 & 0 & 0 \\\\ 0 & 1 & 0 & 1 & 0 \\\\ 0 & 0 & 1 & 0 & 1 \\\\ 1 & 0 & 0 & 1 & 0 \\end{pmatrix}
$$
::::

### $W_n$ (Roda)
::::grid{cols=3}
:::graph{height=150}
\`\`\`json
{ "nodes": [{ "id": "C", "color": "#facc15" }, { "id": 1 }, { "id": 2 }, { "id": 3 }], "links": [ { "source": 1, "target": 2 }, { "source": 2, "target": 3 }, { "source": 3, "target": 1 }, { "source": "C", "target": 1 }, { "source": "C", "target": 2 }, { "source": "C", "target": 3 } ] }
\`\`\`
:::

:::graph{height=150}
\`\`\`json
{ "nodes": [{ "id": "C", "color": "#facc15" }, { "id": 1 }, { "id": 2 }, { "id": 3 }, { "id": 4 }, { "id": 5 }], "links": [ { "source": 1, "target": 2 }, { "source": 2, "target": 3 }, { "source": 3, "target": 4 }, { "source": 4, "target": 5 }, { "source": 5, "target": 1 }, { "source": "C", "target": 1 }, { "source": "C", "target": 2 }, { "source": "C", "target": 3 }, { "source": "C", "target": 4 }, { "source": "C", "target": 5 } ] }
\`\`\`
:::

$$
\\begin{pmatrix} 0 & 1 & 1 & 1 & 1 \\\\ 1 & 0 & 1 & 0 & 1 \\\\ 1 & 1 & 0 & 1 & 0 \\\\ 1 & 0 & 1 & 0 & 1 \\\\ 1 & 1 & 0 & 1 & 0 \\end{pmatrix}
$$
::::


### 3. Propietats en funció de $n$

| Graf | Ordre ($n$) | Mida ($m$) | $\\delta(G)$ (min) | $\\Delta(G)$ (màx) |
|---|---|---|---|---|
| $N_n$ | $n$ | $0$ | $0$ | $0$ |
| $K_n$ | $n$ | $\\frac{n(n-1)}{2}$ | $n-1$ | $n-1$ |
| $T_n$ | $n$ | $n-1$ | $1$ (extrems) | $2$ (interiors) |
| $C_n$ | $n$ ($n \\ge 3$) | $n$ | $2$ | $2$ |
| $W_n$ | $n$ ($n \\ge 4$) | $2(n-1)$ | $3$ (perifèria) | $n-1$ (centre) |

`,
  availableLanguages: ['ca']
};
