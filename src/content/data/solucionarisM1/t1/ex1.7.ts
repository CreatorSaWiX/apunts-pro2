import type { Solution } from '../../solutions';

export const ex1_7: Solution = {
    id: 'M1-T1-Ex1.7',
    title: 'Exercici 1.7: Operacions amb Grafs',
    author: 'Profe',
    code: '',
    type: 'notebook',
    statement: `Considereu un graf $G = (V, A)$ amb $V = \\{1, 2, 3, 4, 5\\}$ i $A = \\{12, 13, 23, 24, 34, 45\\}$. Doneu el conjunt d'arestes, la matriu d'adjacència i una representació gràfica dels grafs $G^c$, $G - 4$, $G - 45$ i $G + 25$.`,
    content: `
Anem a construir els grafs demanats pas a pas.

**El graf original $G$:**
*   Arestes: $(1,2), (1,3), (2,3)$ (Triangle), $(2,4), (3,4)$ (node 4 connectat a 2 i 3), $(4,5)$ (node 5 penja del 4).
*   Ordre $n=5$, Mida $m=6$.

### 1. Graf Complementari ($G^c$)
Té les arestes que *li falten* a $G$ per ser complet.
En $K_5$ hi ha $\\binom{5}{2} = 10$ arestes possibles. $G$ en té 6. $G^c$ en tindrà 4.
**Arestes**:
*   De 1: $(1,4), (1,5)$ (no està connectat a 4 ni 5 en G).
*   De 2: $(2,5)$ (no connectat a 5).
*   De 3: $(3,5)$ (no connectat a 5).
*   De 4: Cap (connectat a tots excepte 5, però a 5 sí, falta 1, que ja tenim).

$$A(G^c) = \\{14, 15, 25, 35\\}$$

:::graph{height=200}
\`\`\`json
{
  "nodes": [{"id":1}, {"id":2}, {"id":3}, {"id":4}, {"id":5}],
  "links": [{"source":1,"target":4}, {"source":1,"target":5}, {"source":2,"target":5}, {"source":3,"target":5}]
}
\`\`\`
:::

### 2. $G - 4$ (Eliminar vèrtex 4)
Eliminem el vèrtex 4 i totes les arestes que el toquen: $(2,4), (3,4), (4,5)$.
Ens queda el triangle $1-2-3$ i el vèrtex 5 aïllat.

$$A(G-4) = \\{12, 13, 23\\}$$

:::graph{height=200}
\`\`\`json
{
  "nodes": [{"id":1}, {"id":2}, {"id":3}, {"id":5}],
  "links": [{"source":1,"target":2}, {"source":1,"target":3}, {"source":2,"target":3}]
}
\`\`\`
:::

### 3. $G - 45$ (Eliminar l'aresta 4-5)
Només treiem l'enllaç entre 4 i 5. El vèrtex 5 es queda sol, però encara existeix. (Nota: $45$ aquí es refereix a l'aresta $e=\\{4,5\\}$).

$$A(G-45) = \\{12, 13, 23, 24, 34\\}$$

:::graph{height=200}
\`\`\`json
{
  "nodes": [{"id":1}, {"id":2}, {"id":3}, {"id":4}, {"id":5}],
  "links": [{"source":1,"target":2}, {"source":1,"target":3}, {"source":2,"target":3}, {"source":2,"target":4}, {"source":3,"target":4}]
}
\`\`\`
:::

### 4. $G + 25$ (Afegir aresta 2-5)
Afegim un cable nou entre el 2 i el 5.

$$A(G+25) = \\{12, 13, 23, 24, 34, 45, \\mathbf{25}\\}$$

:::graph{height=200}
\`\`\`json
{
  "nodes": [{"id":1}, {"id":2}, {"id":3}, {"id":4}, {"id":5}],
  "links": [{"source":1,"target":2}, {"source":1,"target":3}, {"source":2,"target":3}, {"source":2,"target":4}, {"source":3,"target":4}, {"source":4,"target":5}, {"source":2,"target":5, "color": "orange"}]
}
\`\`\`
:::
        `,
    availableLanguages: ['ca']
  };
