import type { Solution } from '../../../solutions';

export const ex7_5: Solution = {
  id: 'M2-T7-Ex5',
  title: 'Exercici 5: Dibuix de subconjunts de R^2',
  author: 'asdf',
  code: '',
  type: 'notebook',
  statement: `Dibuixeu els subconjunts de $\\mathbb{R}^2$ següents:

a) $A = \\{(x,y) \\in \\mathbb{R}^2 : |x - 3| < 2, |1 - y| \\le 5\\}$;

b) $B = \\{(x,y) \\in \\mathbb{R}^2 : |x^2 + 4x + 1| = -x^2 - 4x - 1, |y - 2| < 10\\}$;

c) $C = \\{(x,y) \\in \\mathbb{R}^2 : x^2 + y^2 \\le 1, x < y\\}$.`,
  content: `
### a) Conjunt $A$

Analitzem les desigualtats per separat:
1. $|x - 3| < 2 \\implies -2 < x - 3 < 2 \\implies 1 < x < 5$. És una franja vertical oberta.
2. $|1 - y| \\le 5 \\implies -5 \\le 1 - y \\le 5 \\implies -6 \\le -y \\le 4 \\implies -4 \\le y \\le 6$. És una franja horitzontal tancada.

La intersecció és un rectangle de vèrtexs $(1, -4), (5, -4), (5, 6)$ i $(1, 6)$.
*   Les vores verticals ($x=1$ i $x=5$) són **obertes** (discontínues).
*   Les vores horitzontals ($y=-4$ i $y=6$) són **tancades** (sòlides).

::mafs{type="ex_7_5_a"}

---

### b) Conjunt $B$

La primera condició és $|f(x)| = -f(x)$, la qual cosa només és certa si $f(x) \\le 0$:
$$x^2 + 4x + 1 \\le 0$$
Trobem les arrels de $x^2 + 4x + 1 = 0$:
$$x = \\frac{-4 \\pm \\sqrt{16 - 4}}{2} = \\frac{-4 \\pm \\sqrt{12}}{2} = -2 \\pm \\sqrt{3}$$
Per tant, $x \\in [-2 - \\sqrt{3}, -2 + \\sqrt{3}] \\approx [-3.73, -0.27]$.

La segona condició $|y - 2| < 10$ implica $-8 < y < 12$.

El conjunt és una franja vertical entre $x \\approx -3.73$ i $x \\approx -0.27$ (vores incloses) tallada horitzontalment entre $y = -8$ i $y = 12$ (vores **no** incloses).

::mafs{type="ex_7_5_b"}

---

### c) Conjunt $C$

Tenim dues regions:
1. $x^2 + y^2 \\le 1$: És el disc unitat tancat (inclou la circumferència).
2. $x < y$: És el semiplà superior delimitat per la recta $y = x$.

La intersecció és la meitat del disc que queda per sobre de la diagonal.
*   L'arc de la circumferència està inclòs ($x^2+y^2=1$).
*   El segment de la recta $y=x$ dins del disc **no** està inclòs (ja que la desigualtat és estrictament $x < y$).

::mafs{type="ex_7_5_c"}
`,
  availableLanguages: ['ca']
};
