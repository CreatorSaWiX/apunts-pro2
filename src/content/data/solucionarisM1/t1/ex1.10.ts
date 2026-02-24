import type { Solution } from '../../solutions';

export const ex1_10: Solution = {
    id: 'M1-T1-Ex1.10',
    title: 'Exercici 1.10: Unió i Producte',
    author: 'Profe',
    code: '',
    type: 'notebook',
    statement: `Doneu el conjunt d'arestes i una representació gràfica dels grafs $K_3 \\cup T_3$ i $T_3 \\times K_3$, suposant que els conjunts de vèrtexs de $K_3$ i de $T_3$ són disjunts.`,
    content: `
Definim els nostres jugadors:
*   $K_3$ (Triangle): Vèrtexs $\\{1,2,3\\}$, Arestes $\\{12, 23, 31\\}$.
*   $T_3$ (Trajecte/Camí 3): Vèrtexs $\\{a,b,c\\}$, Arestes $\\{ab, bc\\}$.

### 1. Unió ($K_3 \\cup T_3$)
Simplement els posem costat a costat. No hi ha connexions entre ells.
**Arestes**: $\\{12, 23, 31, ab, bc\\}$.

:::graph{height=200}
\`\`\`json
{
  "nodes": [{"id":1}, {"id":2}, {"id":3}, {"id":"a"}, {"id":"b"}, {"id":"c"}],
  "links": [{"source":1,"target":2}, {"source":2,"target":3}, {"source":3,"target":1}, {"source":"a","target":"b"}, {"source":"b","target":"c"}]
}
\`\`\`
:::

### 2. Producte Cartesià ($T_3 \\times K_3$)
El graf resultant tindrà $3 \\times 3 = 9$ vèrtexs.
Imagineu que agafem el $T_3$ (carril $a-b-c$) i a cada estació hi posem una còpia de $K_3$ (triangle).
Vèrtexs: $(a,1), (a,2), (a,3), (b,1)...$ etc.

**Estructura:**
*   3 Triangles verticals (còpies de $K_3$ a cada posició de $T_3$).
*   Connexions horitzontals seguint el camí $a-b-c$ (exemple: el punt 1 del triangle $a$ es connecta al punt 1 del triangle $b$).

:::graph{height=300}
\`\`\`json
{
  "nodes": [
    {"id":"a1", "group":1}, {"id":"a2", "group":1}, {"id":"a3", "group":1},
    {"id":"b1", "group":2}, {"id":"b2", "group":2}, {"id":"b3", "group":2},
    {"id":"c1", "group":3}, {"id":"c2", "group":3}, {"id":"c3", "group":3}
  ],
  "links": [
    {"source":"a1","target":"a2"}, {"source":"a2","target":"a3"}, {"source":"a3","target":"a1"},
    {"source":"b1","target":"b2"}, {"source":"b2","target":"b3"}, {"source":"b3","target":"b1"},
    {"source":"c1","target":"c2"}, {"source":"c2","target":"c3"}, {"source":"c3","target":"c1"},
    
    {"source":"a1","target":"b1", "color":"#666"}, {"source":"b1","target":"c1", "color":"#666"},
    {"source":"a2","target":"b2", "color":"#666"}, {"source":"b2","target":"c2", "color":"#666"},
    {"source":"a3","target":"b3", "color":"#666"}, {"source":"b3","target":"c3", "color":"#666"}
  ]
}
\`\`\`
:::
        `,
    availableLanguages: ['ca']
  };
