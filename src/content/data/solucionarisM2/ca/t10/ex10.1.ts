import type { Solution } from '../../../solutions';

export const ex10_1: Solution = {
  id: 'M2-T10-Ex1',
  title: 'Exercici 1: Extrems condicionats',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Estudieu els extrems de la funció $f(x,y) = x^2 + y^2$ quan les variables $(x,y)$ estan lligades per la condició:
  $$y + x^2 = 1$$`,
  content: `Per resoldre aquest problema d'extrems condicionats, podem utilitzar dos mètodes: el mètode de substitució o el mètode dels multiplicadors de Lagrange.

### Mètode 1: Substitució
De la condició $y + x^2 = 1$, podem aïllar $y$ o $x^2$. Aïllar $x^2$ és més directe:
$$x^2 = 1 - y$$
Substituïm $x^2$ en la funció $f(x,y)$:
$$g(y) = (1 - y) + y^2 = y^2 - y + 1$$
Ara busquem els extrems d'una funció d'una variable. Derivem respecte a $y$:
$$g'(y) = 2y - 1 = 0 \\implies y = 1/2$$
Comprovem la segona derivada:
$$g''(y) = 2 > 0 \\implies \\text{Mínim relatiu}$$
Si $y = 1/2$, llavors $x^2 = 1 - 1/2 = 1/2 \\implies x = \\pm \\frac{1}{\\sqrt{2}}$.

També hem de considerar que $x^2 = 1 - y \\geq 0 \\implies y \\leq 1$. El punt on la condició "acaba" és $y = 1$:
Si $y = 1 \\implies x^2 = 0 \\implies x = 0$.
Calculant els valors de la funció:
- En $(\\pm 1/\\sqrt{2}, 1/2)$: $f = 1/2 + 1/4 = 3/4 = 0.75$ (**Mínims relatius**)
- En $(0, 1)$: $f = 0^2 + 1^2 = 1$ (**Màxim relatiu**)

---

### Mètode 2: Multiplicadors de Lagrange
Definim la funció de Lagrange amb $g(x,y) = y + x^2 - 1 = 0$:
$$L(x, y, \\lambda) = x^2 + y^2 - \\lambda(y + x^2 - 1)$$
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
