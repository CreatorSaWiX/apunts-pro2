import type { Solution } from '../../../solutions';

export const ex10_1: Solution = {
  id: 'M2-T10-Ex1',
  title: 'Exercici 1: Extrems condicionats',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Estudieu els extrems de la funció $f(x,y) = x^2 + y^2$ quan les variables $(x,y)$ estan lligades per la condició:
  $$y + x^2 = 1$$`,
  content: `Per resoldre aquest problema d'extrems condicionats, podem utilitzar dos camins: la substitució directa o el mètode dels multiplicadors de Lagrange.

### Mètode 1: Substitució directa

Aquest mètode és útil quan podem aïllar fàcilment una variable de la restricció.

De la condició $y + x^2 = 1$, aïllem $x^2$:

$$x^2 = 1 - y$$

Substituïm aquesta expressió a la funció original $f(x,y) = x^2 + y^2$:

$$h(y) = (1 - y) + y^2 = y^2 - y + 1$$

Ara tenim una funció d'una sola variable. Busquem on s'anul·la la seva derivada:

$$h'(y) = 2y - 1 = 0 \\implies y = 1/2$$

Com que $h''(y) = 2 > 0$, es tracta d'un **mínim**.

Si $y = 1/2 \\implies x^2 = 1 - 1/2 = 1/2 \\implies x = \\pm \\frac{1}{\\sqrt{2}}$.

També cal revisar els extrems del domini de la variable $y$. Com que $x^2 = 1-y$ i $x^2 \\geq 0$, tenim que $y \\leq 1$. En el límit $y=1$, obtenim $x=0$, que ens dona el punt $(0,1)$.

---

### Mètode 2: Multiplicadors de Lagrange
Aquest mètode consisteix a buscar els punts on el gradient de la funció $f$ és paral·lel al gradient de la restricció $g$.

1. **Definim la funció objectiu**: $f(x,y) = x^2 + y^2$
2. **Definim la restricció** (igualada a zero): $g(x,y) = y + x^2 - 1 = 0$
3. **Construïm la funció de Lagrange** ($L = f - \\lambda g$):
$$L(x, y, \\lambda) = \\underbrace{x^2 + y^2}_{f} - \\lambda \\underbrace{(y + x^2 - 1)}_{g}$$

Busquem els punts on el gradient de $L$ és zero:
1. $\\frac{\\partial L}{\\partial x} = 2x - 2\\lambda x = 2x(1 - \\lambda) = 0$
2. $\\frac{\\partial L}{\\partial y} = 2y - \\lambda = 0$
3. $y + x^2 - 1 = 0$

De la primera equació tenim dues possibilitats:
- **Cas 1: $x = 0$**
  Substituint a la condició (3): $y + 0 = 1 \\implies y = 1$.
  D'on $\\lambda = 2(1) = 2$. Obtenim el punt **$(0, 1)$**.
- **Cas 2: $\\lambda = 1$**
  Substituint a la segona equació: $2y - 1 = 0 \\implies y = 1/2$.
  Substituint a la condició (3): $1/2 + x^2 = 1 \\implies x^2 = 1/2 \\implies x = \\pm \\frac{1}{\\sqrt{2}}$.
  Obtenim els punts **$(\\frac{1}{\\sqrt{2}}, \\frac{1}{2})$** i **$(-\\frac{1}{\\sqrt{2}}, \\frac{1}{2})$**.

### Conclusió
- Els punts $(\\pm \\frac{1}{\\sqrt{2}}, \\frac{1}{2})$ són **mínims relatius** amb valor $f = 3/4$.
- El punt $(0, 1)$ és un **màxim relatiu** amb valor $f = 1$.`,
  availableLanguages: ['ca']
};
