import type { Solution } from '../../solutions';

export const ex1_5: Solution = {
    id: 'M1-T1-Ex1.5',
    title: 'Exercici 1.5: Cerca de Subgrafs',
    author: 'Profe',
    code: '',
    type: 'notebook',
    statement: `Siguin $V = \\{a,b,c,d,e,f\\}$ i $A = \\{ab, af, ad, be, de, ef\\}$. Determineu tots els subgrafs de $G$ d'ordre 4 i mida 4.`,
    content: `
Primer, dibuixem el graf per veure què tenim.

*   $a$ connectat a: $b, f, d$ (Grau 3)
*   $b$ connectat a: $a, e$ (Grau 2)
*   $c$ connectat a: ... **ningú!** $c$ és un vèrtex aïllat.
*   $d$ connectat a: $a, e$ (Grau 2)
*   $e$ connectat a: $b, d, f$ (Grau 3)
*   $f$ connectat a: $a, e$ (Grau 2)

:::graph
\`\`\`json
{
  "nodes": [
    { "id": "a" }, { "id": "b" }, { "id": "c", "color": "#6b7280" },
    { "id": "d" }, { "id": "e" }, { "id": "f" }
  ],
  "links": [
    { "source": "a", "target": "b" }, { "source": "a", "target": "f" },
    { "source": "a", "target": "d" }, { "source": "b", "target": "e" },
    { "source": "d", "target": "e" }, { "source": "e", "target": "f" }
  ]
}
\`\`\`
:::

*Nota: $c$ és un vèrtex aïllat (grau 0), pintat en gris.*

És com un cicle de 5 ($a-b-e-f-a$) amb una corda $a-d-e$. 

**Solució**: Hi ha **3** subgrafs. Són els induïts pels conjunts de vèrtexs:
1.  $\\{a, b, d, e\\}$
2.  $\\{a, d, e, f\\}$
3.  $\\{a, b, e, f\\}$
        `,
    availableLanguages: ['ca']
};
