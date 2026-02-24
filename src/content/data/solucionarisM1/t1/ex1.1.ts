import type { Solution } from '../../solutions';

export const ex1_1: Solution = {
  id: 'M1-T1-Ex1.1',
  title: 'Exercici 1.1: Famílies de Grafs',
  author: 'Profe',
  code: '',
  type: 'notebook',
  statement: `Per a cadascun dels grafs $N_n$, $K_n$, $T_n$, $C_n$ i $W_n$, doneu-ne:

1. Una representació gràfica per a $n=4$ i $n=6$.
2. La matriu d'adjacència per a $n=5$.
3. L'ordre, la mida, el grau màxim i el grau mínim en funció de $n$.`,
  content: `
### 1. Representació Gràfica ($n=4$ i $n=6$)

Aquí teniu com es veuen aquestes famílies. Fixeu-vos en com creixen!

#### $N_n$ (Graf Nul)
Només vèrtexs, cap aresta. La soledat absoluta.

:::graph
\`\`\`json
{
  "nodes": [ { "id": 1 }, { "id": 2 }, { "id": 3 }, { "id": 4 } ],
  "links": []
}
\`\`\`
:::

#### $K_n$ (Graf Complet)
Tothom connectat amb tothom. El màxim d'arestes possible.

:::graph
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

#### $T_n$ (Trajecte)
Una línia simple.

:::graph
\`\`\`json
{
  "nodes": [{ "id": 1 }, { "id": 2 }, { "id": 3 }, { "id": 4 }],
  "links": [
    { "source": 1, "target": 2 }, { "source": 2, "target": 3 }, { "source": 3, "target": 4 }
  ]
}
\`\`\`
:::

#### $C_n$ (Cicle)
Un cercle tancat.

:::graph
\`\`\`json
{
  "nodes": [{ "id": 1 }, { "id": 2 }, { "id": 3 }, { "id": 4 }],
  "links": [
    { "source": 1, "target": 2 }, { "source": 2, "target": 3 },
    { "source": 3, "target": 4 }, { "source": 4, "target": 1 }
  ]
}
\`\`\`
:::

#### $W_n$ (Roda)
Un cicle de $n-1$ vèrtexs més un centre connectat a tots. (Per $n=4$: triangle + centre).

:::graph{height=200}
\`\`\`json
{
  "nodes": [{ "id": "C", "color": "#facc15" }, { "id": 1 }, { "id": 2 }, { "id": 3 }],
  "links": [
    { "source": 1, "target": 2 }, { "source": 2, "target": 3 }, { "source": 3, "target": 1 },
    { "source": "C", "target": 1 }, { "source": "C", "target": 2 }, { "source": "C", "target": 3 }
  ]
}
\`\`\`
:::

---

### 2. Matriu d'Adjacència ($n=5$)

Recordeu: $1$ si hi ha aresta, $0$ si no.

**$N_5$ (Nul)**: Tot zeros.
$$
\\begin{pmatrix} 0 & 0 & 0 & 0 & 0 \\\\ 0 & 0 & 0 & 0 & 0 \\\\ 0 & 0 & 0 & 0 & 0 \\\\ 0 & 0 & 0 & 0 & 0 \\\\ 0 & 0 & 0 & 0 & 0 \\end{pmatrix}
$$

**$K_5$ (Complet)**: Tot uns excepte la diagonal.
$$
\\begin{pmatrix} 0 & 1 & 1 & 1 & 1 \\\\ 1 & 0 & 1 & 1 & 1 \\\\ 1 & 1 & 0 & 1 & 1 \\\\ 1 & 1 & 1 & 0 & 1 \\\\ 1 & 1 & 1 & 1 & 0 \\end{pmatrix}
$$

**$T_5$ (Trajecte)**: Una línia just sobre i sota la diagonal principal.
$$
\\begin{pmatrix} 0 & 1 & 0 & 0 & 0 \\\\ 1 & 0 & 1 & 0 & 0 \\\\ 0 & 1 & 0 & 1 & 0 \\\\ 0 & 0 & 1 & 0 & 1 \\\\ 0 & 0 & 0 & 1 & 0 \\end{pmatrix}
$$

**$C_5$ (Cicle)**: Com $T_5$ però amb les cantonades $(1,5)$ i $(5,1)$ a 1.
$$
\\begin{pmatrix} 0 & 1 & 0 & 0 & 1 \\\\ 1 & 0 & 1 & 0 & 0 \\\\ 0 & 1 & 0 & 1 & 0 \\\\ 0 & 0 & 1 & 0 & 1 \\\\ 1 & 0 & 0 & 1 & 0 \\end{pmatrix}
$$

**$W_5$ (Roda)**: Centre connectat a tots (fila/cal 1 plena d'uns), i la resta un cicle $C_4$.
*Assumim vèrtex 1 és el centre*.
$$
\\begin{pmatrix} 0 & 1 & 1 & 1 & 1 \\\\ 1 & 0 & 1 & 0 & 1 \\\\ 1 & 1 & 0 & 1 & 0 \\\\ 1 & 0 & 1 & 0 & 1 \\\\ 1 & 1 & 0 & 1 & 0 \\end{pmatrix}
$$

---

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
