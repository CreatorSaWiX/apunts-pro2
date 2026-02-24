import type { Solution } from '../../solutions';

export const ex1_19: Solution = {
  id: 'M1-T1-Ex1.19',
  title: 'Exercici 1.19: Graus i Ordre',
  author: 'Profe',
  code: '',
  type: 'notebook',
  statement: `Sigui $G$ un graf d'ordre 9 tal que tots els vèrtexs tenen grau 5 o 6. Proveu que hi ha un mínim de 5 vèrtexs de grau 6 o un mínim de 6 vèrtexs de grau 5.`,
  content: `
:::info{title="Lema de les Encaixades"}
La suma dels graus de tots els vèrtexs és igual al doble del nombre d'arestes:
$ \\sum_{v \\in V} \g(v) = 2m $
:::

Sabem que $n = 9$ i $\g(v) \\in \\{5, 6\\}$. 
Sigui $x$ el nombre de vèrtexs de grau 5, i $y$ el nombre de vèrtexs de grau 6.
Llavors tenim el següent sistema d'equacions:

1. **Total de vèrtexs:**
$ x + y = 9 \\implies y = 9 - x $

2. **Suma de graus (ha de ser parell):**
$ 5x + 6y = 2m $

Substituint $y$ a la segona equació:
$ 5x + 6(9 - x) = 2m \\implies 54 - x = 2m $

Com que $2m$ és parell i $54$ també, **$x$ ha de ser un nombre parell**.
Els valors possibles per $x$ (sent $x \\le 9$) són: $x \\in \\{0, 2, 4, 6, 8\\}$.

**Anàlisi de casos:**
* Si $x = 0$, $2, 4 \\implies y = 9, 7, 5$. Tenim **almenys 5 vèrtexs de grau 6**.
* Si $x = 6, 8 \\implies x \\ge 6$. Tenim **almenys 6 vèrtexs de grau 5**.

Es demostra que sempre es compleix una de les dues condicions.
`,
  availableLanguages: ['ca']
};
