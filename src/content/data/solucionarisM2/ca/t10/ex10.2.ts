import type { Solution } from '../../../solutions';

export const ex10_2: Solution = {
  id: 'M2-T10-Ex2',
  title: 'Exercici 2: Extrems condicionats (I)',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Determineu els extrems condicionats de les funcions següents:

a) $f(x,y) = x + 2y$, si $x^2 + y^2 = 5$

b) $f(x,y,z) = x^2 + y^2 + z^2$, si $\\begin{cases} x^2 + y^2 = 1 \\\\ x + y + z = 1 \\end{cases}$`,
  content: `### Apartat a) $f(x,y) = x + 2y$ amb $x^2 + y^2 = 5$

**1. Definició del sistema de Lagrange**
Tenim la funció objectiu $f(x,y) = x + 2y$ i la restricció $g(x,y) = x^2 + y^2 - 5 = 0$.
Construïm la funció de Lagrange $L(x,y,\\lambda) = f - \\lambda g$:
$$L(x,y,\\lambda) = (x + 2y) - \\lambda(x^2 + y^2 - 5)$$

**2. Càlcul de punts crítics**
Busquem on s'anul·la el gradient de $L$:
1.  $\\frac{\\partial L}{\\partial x} = 1 - 2\\lambda x = 0 \\implies 1 = 2\\lambda x$
2.  $\\frac{\\partial L}{\\partial y} = 2 - 2\\lambda y = 0 \\implies 2 = 2\\lambda y$
3.  $\\frac{\\partial L}{\\partial \\lambda} = -(x^2 + y^2 - 5) = 0 \\implies x^2 + y^2 = 5$

De les equacions (1) i (2), podem aïllar $\\lambda$:
$\\lambda = \\frac{1}{2x} = \\frac{2}{2y} \\implies 2y = 4x \\implies \\mathbf{y = 2x}$

**3. Substitució en la restricció**
Substituïm $y = 2x$ a l'equació (3):
$$x^2 + (2x)^2 = 5 \\implies 5x^2 = 5 \\implies x^2 = 1 \\implies \\mathbf{x = \\pm 1}$$
- Si $x = 1 \\implies y = 2(1) = 2$. Punt **$(1, 2)$**. Valor: $f(1,2) = 1 + 2(2) = \\mathbf{5}$.
- Si $x = -1 \\implies y = 2(-1) = -2$. Punt **$(-1, -2)$**. Valor: $f(-1,-2) = -1 + 2(-2) = \\mathbf{-5}$.

**Conclusió a):** El punt $(1, 2)$ és un **màxim condicionat** i $(-1, -2)$ és un **mínim condicionat**.

---

### Apartat b) $f(x,y,z) = x^2 + y^2 + z^2$ amb dues restriccions
$g_1 = x^2 + y^2 - 1 = 0$

$g_2 = x + y + z - 1 = 0$

**1. Simplificació del problema**
Com que a la frontera $x^2 + y^2 = 1$, la funció objectiu esdevé:

$$f(x,y,z) = (x^2 + y^2) + z^2 = 1 + z^2$$

Volem minimitzar/maximitzar $z^2$. De la segona restricció sabem que $z = 1 - x - y$.
Per tant, el problema es redueix a optimitzar la funció de dues variables:

$$h(x,y) = (1 - x - y)^2 \\quad \\text{subjecte a } x^2 + y^2 = 1$$

**2. Mètode de Lagrange per a $h(x,y)$**
Definim $L(x,y,\\mu) = (1-x-y)^2 - \\mu(x^2 + y^2 - 1)$. Calculem les derivades:
1.  $\\frac{\\partial L}{\\partial x} = 2(1-x-y)(-1) - 2\\mu x = 0 \\implies -(1-x-y) = \\mu x$
2.  $\\frac{\\partial L}{\\partial y} = 2(1-x-y)(-1) - 2\\mu y = 0 \\implies -(1-x-y) = \\mu y$
3.  $x^2 + y^2 = 1$

Igualant les dues primeres equacions: $\\mu x = \\mu y$.
- **Cas $\\mu = 0$**:
  Això implica $1-x-y = 0 \\implies x+y=1$.
  Amb $x^2+y^2=1$, l'única solució és que una variable sigui 1 i l'altra 0: **$(1,0)$** o **$(0,1)$**.
  En aquests punts $z = 1-1-0 = 0$. Valor $f = 1 + 0^2 = \\mathbf{1}$.
- **Cas $x = y$**:
  Substituïm a $x^2+y^2=1 \\implies 2x^2=1 \\implies x = \\pm \\frac{1}{\\sqrt{2}}$.
  - Si $x=y=1/\\sqrt{2} \\implies z = 1 - \\sqrt{2}$. Valor $f = 1 + (1-\\sqrt{2})^2 = \\mathbf{4 - 2\\sqrt{2}} \\approx 1.17$.
  - Si $x=y=-1/\\sqrt{2} \\implies z = 1 + \\sqrt{2}$. Valor $f = 1 + (1+\\sqrt{2})^2 = \\mathbf{4 + 2\\sqrt{2}} \\approx 6.83$.

**Conclusió b):** 
- **Mínims**: $(1,0,0)$ i $(0,1,0)$ amb valor **$1$**.
- **Màxim**: $(-1/\\sqrt{2}, -1/\\sqrt{2}, 1+\\sqrt{2})$ amb valor **$4+2\\sqrt{2}$**.`,
  availableLanguages: ['ca']
};
