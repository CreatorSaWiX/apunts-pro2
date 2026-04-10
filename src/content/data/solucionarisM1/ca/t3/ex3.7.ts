import type { Solution } from '../../../solutions';

export const ex3_7: Solution = {
  id: 'M1-T3-Ex3.7',
  title: 'Exercici 3.7: El Problema del Dòmino',
  author: 'Profe',
  code: '',
  type: 'notebook',
  statement: `Esbrineu si és possible posar en successió totes les fitxes d'un dòmino de forma que coincideixen les puntuacions dels extrems en contacte i que els dos extrems lliures tinguin la mateixa puntuació. Si és possible, expliciteu una solució.`,
  content: `
Podem representar el conjunt de fitxes del dòmino com un graf on:

:::graph{height=250}
\`\`\`json
{
  "nodes": [
    { "id": 0 }, { "id": 1 }, { "id": 2 }, { "id": 3 }, { "id": 4 }, { "id": 5 }, { "id": 6 }
  ],
  "links": [
    { "source": 0, "target": 1 }, { "source": 0, "target": 2 }, { "source": 0, "target": 3 }, { "source": 0, "target": 4 }, { "source": 0, "target": 5 }, { "source": 0, "target": 6 },
    { "source": 1, "target": 2 }, { "source": 1, "target": 3 }, { "source": 1, "target": 4 }, { "source": 1, "target": 5 }, { "source": 1, "target": 6 },
    { "source": 2, "target": 3 }, { "source": 2, "target": 4 }, { "source": 2, "target": 5 }, { "source": 2, "target": 6 },
    { "source": 3, "target": 4 }, { "source": 3, "target": 5 }, { "source": 3, "target": 6 },
    { "source": 4, "target": 5 }, { "source": 4, "target": 6 },
    { "source": 5, "target": 6 }
  ]
}
\`\`\`
:::

- Els **vèrtexs** són els números del $0$ al $6$ (7 vèrtexs).
- Les **arestes** són les fitxes. Una fitxa $[a|b]$ representa una aresta que connecta el vèrtex $a$ amb el vèrtex $b$.

El joc de dòmino complet té totes les combinacions possibles, incloent els dobles:
- Fitxes simples: $[0|1], [0|2], \\dots, [0|6], [1|2], \\dots, [5|6]$. Això correspon a les arestes d'un graf complet $K_7$.
- Fitxes dobles: $[0|0], [1|1], \\dots, [6|6]$. Aquestes corresponen a **bucles** a cada vèrtex.

L'enunciat ens demana si podem posar **totes** les fitxes en una successió tancada (els extrems coincideixen). En l'idioma dels grafs, això s'anomena trobar un **circuit eulerià**.

### Condició d'existència
Un graf connex té un circuit eulerià si i només si tots els seus vèrtexs tenen **grau parell**. Calculem el grau de cada vèrtex:
- En un graf complet $K_7$, cada vèrtex està connectat amb els altres 6 vèrtexs. Per tant, el grau inicial de cada vèrtex és **6**.
- Les fitxes dobles (bucles) afegeixen $2$ al grau de cada vèrtex (un bucle entra i surt pel mateix lloc).
- Grau final de cada vèrtex = $6 + 2 = \\mathbf{8}$.

Com que tots els vèrtexs tenen grau 8 (un nombre **parell**) i el graf és clarament connex, **podem afirmar que SÍ que és possible**.

### Explicitar una solució
Trobar el circuit exacte és complex per fer-ho a mà (28 fitxes), però podem simplificar el procés:
1. Primer, trobem un circuit eulerià pel graf complet $K_7$ (sense dobles).
2. Cada vegada que passem per un vèrtex $i$, podem "intercalar" la fitxa doble $[i|i]$ i seguir el camí.

Una seqüència parcial podria començar així:
$[0|0] \\rightarrow [0|1] \\rightarrow [1|1] \\rightarrow [1|2] \\rightarrow [2|2] \\rightarrow [2|0] \\rightarrow \\dots$
`,
  availableLanguages: ['ca']
};
