import type { Solution } from '../../../solutions';

export const ex8_8: Solution = {
  id: 'M2-T8-Ex8',
  title: 'Exercici 8: Propietats del gradient',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Trobar la derivada de la funció $z = x^2 - xy + y^2$ en el punt $M(1,1)$ en la direcció que forma un angle $\\alpha$ amb la direcció positiva de l'eix $OX$. En quina direcció aquesta derivada:
  
a) assoleix el seu valor màxim?
b) assoleix el seu valor mínim?
c) és igual a 0?`,
  content: `### 1. Condició de diferenciabilitat
Com que $f(x,y) = x^2 - xy + y^2$ és una funció polinòmica, és de classe $C^1$ a tot $\\mathbb{R}^2$. Això ens permet usar les propietats del gradient per trobar les direccions de creixement.

### 2. Càlcul del gradient a $M(1,1)$
* $f_x = 2x - y \\implies f_x(1,1) = 2(1) - 1 = 1$
* $f_y = -x + 2y \\implies f_y(1,1) = -1 + 2(1) = 1$
$$\\nabla f(1,1) = (1, 1)$$

### 3. Resolució dels apartats
La derivada direccional en funció de l'angle $\\alpha$ és:
$$D_{\\alpha} f(M) = \\nabla f(M) \\cdot (\\cos \\alpha, \\sin \\alpha) = \\cos \\alpha + \\sin \\alpha$$

### a) Valor màxim
S'assoleix en la direcció del gradient $\\nabla f = (1,1)$.
Per tant, $\\tan \\alpha = \\frac{1}{1} = 1 \\implies \\mathbf{\\alpha = \\pi/4}$ (45°).
*Valor màxim*: $\\|\\nabla f\\| = \\sqrt{1^2+1^2} = \\sqrt{2}$.

### b) Valor mínim
S'assoleix en la direcció oposada al gradient $-\\nabla f = (-1, -1)$.
Això correspon a $\\mathbf{\\alpha = 5\\pi/4}$ (225°).
*Valor mínim*: $-\\|\\nabla f\\| = -\\sqrt{2}$.

### c) Derivada igual a 0
S'assoleix en les direccions ortogonals al gradient. Si el gradient és $(1,1)$, els vectors perpendiculars són $(1,-1)$ i $(-1,1)$.
Això correspon als angles:
* $\\tan \\alpha = -1 \\implies \\mathbf{\\alpha = 3\\pi/4}$ (135°) i $\\mathbf{\\alpha = 7\\pi/4}$ (315°).
`,
  availableLanguages: ['ca']
};
