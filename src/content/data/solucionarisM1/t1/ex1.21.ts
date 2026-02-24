import type { Solution } from '../../solutions';

export const ex1_21: Solution = {
  id: 'M1-T1-Ex1.21',
  title: 'Exercici 1.21: Isomorfismes (Ordre 4, Mida 2)',
  author: 'Profe',
  code: '',
  type: 'notebook',
  statement: `Determineu, llevat d'isomorfismes, tots els grafs d'ordre quatre i mida dos.`,
  content: `
Busquem grafs no isomorfs amb $n=4$ i $m=2$.

:::tip{title="Estratègia"}
Amb poques arestes, podem simplement llistar les configuracions de connexió possibles sense formar isomorfismes.
:::

Tenim només 2 arestes. Hi ha exactament dues formes d'ubicar-les respecte l'adjacència:

1. **Arestes Adjacents (Comparteixen un vèrtex)**
   Es forma un camí de 3 vèrtexs i ens queda sempre un vèrtex aïllat.
   **Classe isomorfa:** $P_3 \\cup K_1$ (Trajecte de longitud 2 i un vèrtex isolat).

:::graph{height=150}
\`\`\`json
{
  "nodes": [{ "id": 1 }, { "id": 2 }, { "id": 3 }, { "id": 4 }],
  "links": [{ "source": 1, "target": 2 }, { "source": 2, "target": 3 }]
}
\`\`\`
:::

2. **Arestes Independents (No es toquen)**
   Són dues parelles de vèrtexs connectats separadament.
   **Classe isomorfa:** $2K_2$ (Dues còpies del graf complet de 2 vèrtexs).

:::graph{height=150}
\`\`\`json
{
  "nodes": [{ "id": 1 }, { "id": 2 }, { "id": 3 }, { "id": 4 }],
  "links": [{ "source": 1, "target": 2 }, { "source": 3, "target": 4 }]
}
\`\`\`
:::

**Resultat:**
Llevat d'isomorfismes, només hi ha **2** grafs d'ordre 4 i mida 2.
`,
  availableLanguages: ['ca']
};
