import type { Solution } from '../../../solutions';

export const ex2_1: Solution = {
  id: 'M1-T2-Ex2.1',
  title: 'Exercici 2.1: Trobar camins i cicles',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Trobeu en els grafs següents, si és possible, camins de longitud 9 i 11, i cicles de longitud 5, 6, 8 i 9.`,
  content: `
Recordem: un **camí** té longitud màxima $n-1$ i un **cicle** longitud màxima $n$.

### Graf $G_1$ (Petersen, $n = 10$)

:::graph{height=300}
\`\`\`json
{
  "nodes": [
    { "id": "1" }, { "id": "2" }, { "id": "3" }, { "id": "4" }, { "id": "5" },
    { "id": "6" }, { "id": "7" }, { "id": "8" }, { "id": "9" }, { "id": "10" }
  ],
  "links": [
    { "source": "1", "target": "2" }, { "source": "2", "target": "3" }, { "source": "3", "target": "4" },
    { "source": "4", "target": "5" }, { "source": "5", "target": "1" },
    { "source": "1", "target": "6" }, { "source": "2", "target": "7" }, { "source": "3", "target": "8" },
    { "source": "4", "target": "9" }, { "source": "5", "target": "10" },
    { "source": "6", "target": "8" }, { "source": "6", "target": "9" },
    { "source": "7", "target": "9" }, { "source": "7", "target": "10" },
    { "source": "8", "target": "10" }
  ]
}
\`\`\`
:::

| Pregunta | Resposta |
|---|---|
| **Camí long. 9** | ✅ $1-2-3-4-5-10-8-6-9-7$ |
| **Camí long. 11** | ❌ Necessitaria 12 vèrtexs, només en tenim 10 |
| **Cicle long. 5** | ✅ $1-2-3-4-5-1$ |
| **Cicle long. 6** | ✅ $1-2-3-4-9-6-1$ |
| **Cicle long. 8** | ✅ $1-2-3-4-5-10-8-6-1$ |
| **Cicle long. 9** | ✅ $1-2-7-10-5-4-3-8-6-1$ |

### Graf $G_2$ ($n = 11$)

:::graph{height=300}
\`\`\`json
{
  "nodes": [
    { "id": "1" }, { "id": "2" }, { "id": "3" }, { "id": "4" }, { "id": "5" },
    { "id": "6" }, { "id": "7" }, { "id": "8" }, { "id": "9" }, { "id": "10" },
    { "id": "11", "color": "#facc15" }
  ],
  "links": [
    { "source": "1", "target": "2" }, { "source": "2", "target": "3" }, { "source": "3", "target": "4" },
    { "source": "4", "target": "5" }, { "source": "5", "target": "1" },
    { "source": "1", "target": "6" }, { "source": "2", "target": "7" }, { "source": "3", "target": "8" },
    { "source": "4", "target": "9" }, { "source": "5", "target": "10" },
    { "source": "6", "target": "11" }, { "source": "7", "target": "11" },
    { "source": "6", "target": "7" }, { "source": "7", "target": "8" },
    { "source": "8", "target": "9" }, { "source": "9", "target": "10" },
    { "source": "10", "target": "6" }
  ]
}
\`\`\`
:::

| Pregunta | Resposta |
|---|---|
| **Camí long. 9** | ✅ $1-2-3-4-9-8-7-11-6-10$ |
| **Camí long. 11** | ❌ Necessitaria 12 vèrtexs, només en tenim 11. Longitud màxima possible = 10 |
| **Cicle long. 5** | ✅ $1-2-3-4-5-1$ |
| **Cicle long. 6** | ✅ $6-7-8-9-10-6$ (anell interior sense el node 11) |
| **Cicle long. 8** | ✅ $1-2-7-11-6-10-5-4-3-8$ → buscar combinant exterior i interior |
| **Cicle long. 9** | ✅ $1-2-3-8-9-4-5-10-6-1$ |

:::tip{title="Clau de l'exercici"}
La limitació és purament d'ordre: un camí simple no pot superar longitud $n-1$ ni un cicle longitud $n$, independentment de com d'enrevessat sigui el graf.
:::
  `,
  availableLanguages: ['ca']
};
