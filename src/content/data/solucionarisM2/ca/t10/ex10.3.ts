import type { Solution } from '../../../solutions';

export const ex10_3: Solution = {
  id: 'M2-T10-Ex3',
  title: 'Exercici 3: Extrems absoluts en un disc',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Calculeu els extrems absoluts que pren la funció $f(x,y) = x^2 + y^2 - 12x - 8y + 50$ sobre el domini definit per la inequació:
  $$x^2 + y^2 - 4x - 2y \\leq 20$$`,
  content: `Per trobar els extrems absoluts en un domini compacte, hem d'analitzar els punts crítics de l'interior i els extrems de la frontera.

### 1. Punts crítics a l'interior
Calculem el gradient de $f(x,y)$ i l'igualem a zero:
- $\\frac{\\partial f}{\\partial x} = 2x - 12 = 0 \\implies x = 6$
- $\\frac{\\partial f}{\\partial y} = 2y - 8 = 0 \\implies y = 4$

Comprovem si el punt $(6, 4)$ pertany a l'interior del domini:
$$6^2 + 4^2 - 4(6) - 2(4) = 36 + 16 - 24 - 8 = 20$$
Com que el valor és exactament 20, el punt $(6, 4)$ es troba a la **frontera**, no a l'interior estricte. No hi ha punts crítics a l'interior.

---

### 2. Estudi de la frontera
La frontera és la circumferència $g(x,y) = x^2 + y^2 - 4x - 2y - 20 = 0$. 
Podem simplificar $f$ usant la condició de la frontera: $x^2 + y^2 = 4x + 2y + 20$.
Substituïm en $f$:
$$f = (4x + 2y + 20) - 12x - 8y + 50 = -8x - 6y + 70$$
Volem optimitzar $h(x,y) = -8x - 6y + 70$ subjecte a $g(x,y) = 0$. Aplicant Lagrange:
$$\\nabla h = (-8, -6), \\quad \\nabla g = (2x-4, 2y-2)$$
$$(-8, -6) = \\lambda (2x-4, 2y-2)$$
1. $-4 = \\lambda(x-2) \\implies x-2 = -4/\\lambda$
2. $-3 = \\lambda(y-1) \\implies y-1 = -3/\\lambda$

Substituïm en la forma normalitzada de la frontera $(x-2)^2 + (y-1)^2 = 25$:
$$(-4/\\lambda)^2 + (-3/\\lambda)^2 = 25 \\implies 25/\\lambda^2 = 25 \\implies \\lambda = \\pm 1$$
- **Si $\\lambda = 1$**: $x-2 = -4 \\implies x = -2$ i $y-1 = -3 \\implies y = -2$. Punt **$(-2, -2)$**.
- **Si $\\lambda = -1$**: $x-2 = 4 \\implies x = 6$ i $y-1 = 3 \\implies y = 4$. Punt **$(6, 4)$**.

---

### 3. Conclusió
Avaluem la funció en els candidats:
- $f(-2, -2) = (-2)^2 + (-2)^2 - 12(-2) - 8(-2) + 50 = 4 + 4 + 24 + 16 + 50 = 98$
- $f(6, 4) = 6^2 + 4^2 - 12(6) - 8(4) + 50 = 36 + 16 - 72 - 32 + 50 = -2$

El **màxim absolut** és $98$ al punt $(-2, -2)$ i el **mínim absolut** és $-2$ al punt $(6, 4)$.`,
  availableLanguages: ['ca']
};
