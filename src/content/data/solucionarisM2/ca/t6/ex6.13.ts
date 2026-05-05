import type { Solution } from '../../../solutions';

export const ex6_13: Solution = {
  id: 'M2-T6-Ex13',
  title: 'Exercici 13: Determinació de la partició per a un error fixat',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Feu ús de les fórmules dels trapezis i de Simpson per avaluar les integrals següents amb un error més petit que $0.5 \\cdot 10^{-2}$:

a) $\\int_0^1 e^{x^2} \\, dx$;

b) $\\int_0^1 \\cos(x^2) \\, dx$.`,
  content: `
Volem que l'error $|E| < \\epsilon = 0.5 \\cdot 10^{-2} = 5 \\cdot 10^{-3}$. Utilitzarem les cotes de les derivades en $[0, 1]$ calculades a l'exercici 12.

---

### a) $\\int_0^1 e^{x^2} \\, dx$

Dades: $b-a = 1$, $M_2 = 6e$ i $M_4 = 76e$.

**Mètode dels Trapezis:**
Necessitem $|E_T| \\leq \\frac{(b-a)h^2}{12} M_2 < \\epsilon$. Substituint $h = \\frac{b-a}{n} = \\frac{1}{n}$:

$$\\frac{1}{12n^2} \\cdot 6e < 5 \\cdot 10^{-3}$$

$$\\frac{e}{2n^2} < 0.005 \\implies n^2 > \\frac{e}{0.01} = 100e$$

$$n > \\sqrt{100e} = 10\\sqrt{e} \\approx 16.48 \\implies \\mathbf{n \\geq 17}$$

**Regla de Simpson:**
Necessitem $|E_S| \\leq \\frac{(b-a)h^4}{180} M_4 < \\epsilon$. Amb $h = \\frac{1}{n}$:

$$\\frac{1}{180n^4} \\cdot 76e < 5 \\cdot 10^{-3}$$

$$n^4 > \\frac{76e}{180 \\cdot 0.005} = \\frac{76e}{0.9}$$

$$n > \\sqrt[4]{\\frac{76e}{0.9}} \\approx 3.89 \\implies \\mathbf{n \\geq 4} \\text{ (parell)}$$

---

### b) $\\int_0^1 \\cos(x^2) \\, dx$

Dades: $b-a = 1$, $M_2 = 2\\sin(1) + 4\\cos(1) \\approx 3.844$.

**Mètode dels Trapezis:**

$$\\frac{1}{12n^2} \\cdot M_2 < 0.005 \\implies n^2 > \\frac{M_2}{12 \\cdot 0.005} = \\frac{M_2}{0.06}$$

$$n > \\sqrt{\\frac{3.844}{0.06}} \\approx 8.004 \\implies \\mathbf{n \\geq 9}$$

**Regla de Simpson:**
Seguint la mateixa metodologia amb la cota de la quarta derivada $M_4$ (més complexa analíticament), obtindríem el valor de $n$ necessari per assegurar l'error requerit (sempre arrodonint a l'enter parell superior).
`,
  availableLanguages: ['ca']
};
