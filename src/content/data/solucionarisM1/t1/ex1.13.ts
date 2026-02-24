import type { Solution } from '../../solutions';

export const ex1_13: Solution = {
    id: 'M1-T1-Ex1.13',
    title: 'Exercici 1.13: Grafs d\'ordre 3',
    author: 'Profe',
    code: '',
    type: 'notebook',
    statement: `Doneu tots els grafs que tenen $V = \\{a, b, c\\}$ com a conjunt de vèrtexs i representeu-los gràficament.`,
    content: `
Tenim $n=3$ vèrtexs: $a, b, c$.
El nombre màxim d'arestes és $\\binom{3}{2} = 3$. Les possibles arestes són $ab, ac, bc$.
Podem classificar els grafs pel nombre d'arestes ($m$):

### 1) $m=0$ (Cap aresta)
El graf nul $N_3$.
*   Arestes: $\\emptyset$

:::graph{height=150}
\`\`\`json
{ "nodes": [{"id":"a"}, {"id":"b"}, {"id":"c"}], "links": [] }
\`\`\`
:::

### 2) $m=1$ (Una aresta)
Hi ha 3 opcions depenent de quina aresta triem ($ab$, $ac$ o $bc$). Són isomorfs, però com a grafs etiquetats són diferents.
*   $G_1$: $\\{ab\\}$
*   $G_2$: $\\{ac\\}$
*   $G_3$: $\\{bc\\}$

:::graph{height=150}
\`\`\`json
{ "nodes": [{"id":"a"}, {"id":"b"}, {"id":"c"}], "links": [{"source":"a","target":"b"}] }
\`\`\`
:::
*(Mostrem només el cas $ab$, els altres són equivalents girant el triangle)*

### 3) $m=2$ (Dues arestes)
És equivalent a triar quina aresta *no* hi és (o quin parell no està connectat). 3 opcions.
Es formen camins de longitud 2 ($P_3$).
*   $G_4$: $\\{ab, bc\\}$ (falta $ac$). Camí $a-b-c$.
*   $G_5$: $\\{ab, ac\\}$ (falta $bc$). Camí $b-a-c$.
*   $G_6$: $\\{ac, bc\\}$ (falta $ab$). Camí $a-c-b$.

:::graph{height=150}
\`\`\`json
{ "nodes": [{"id":"a"}, {"id":"b"}, {"id":"c"}], "links": [{"source":"a","target":"b"}, {"source":"b","target":"c"}] }
\`\`\`
:::

### 4) $m=3$ (Tres arestes)
El graf complet $K_3$ (Triangle). Només n'hi ha 1.
*   $G_7$: $\\{ab, ac, bc\\}$

:::graph{height=150}
\`\`\`json
{ "nodes": [{"id":"a"}, {"id":"b"}, {"id":"c"}], "links": [{"source":"a","target":"b"}, {"source":"b","target":"c"}, {"source":"c","target":"a"}] }
\`\`\`
:::

**Total**: $1 + 3 + 3 + 1 = 8$ grafs etiquetats.
        `,
    availableLanguages: ['ca']
  };
