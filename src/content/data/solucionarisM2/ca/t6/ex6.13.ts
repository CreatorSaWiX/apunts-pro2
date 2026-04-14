import type { Solution } from '../../../solutions';

export const ex6_13: Solution = {
  id: 'M2-T6-Ex13',
  title: 'Exercici 13: Determinació de la partició per a un error fixat',
  author: 'Antigravity',
  code: '',
  type: 'notebook',
  statement: `Feu ús de les fórmules dels trapezis i de Simpson per avaluar les integrals següents amb un error més petit que $0.5 \\cdot 10^{-2}$:

a) $\\int_0^1 e^{x^2} \\, dx$;

b) $\\int_0^1 \\cos(x^2) \\, dx$.`,
  content: `
Volem que l'error $|E| < \\epsilon = 0.005$. Utilitzarem les cotes de les derivades calculades a l'exercici anterior.

---

### a) $\\int_0^1 e^{x^2} \\, dx$

Dades: $b-a = 1$. Cotes: $\\max |f''(x)| \\approx 16.31$ i $\\max |f^{(4)}(x)| \\approx 206.59$.

**Mètode dels Trapezis:**
$\\frac{(b-a)h^2}{12} M_2 < 0.005 \\implies \\frac{h^2}{12} \\cdot 16.31 < 0.005$
$h^2 < \\frac{0.06}{16.31} \\approx 0.003678 \\implies h < 0.0606$
$n = \\frac{1}{h} > 16.5 \\implies \\mathbf{n = 17}$

**Regla de Simpson:**
$\\frac{(b-a)h^4}{180} M_4 < 0.005 \\implies \\frac{h^4}{180} \\cdot 206.59 < 0.005$
$h^4 < \\frac{0.9}{206.59} \\approx 0.00435 \\implies h < 0.256$
$n = \\frac{1}{h} > 3.9 \\implies \\mathbf{n = 4}$ (ha de ser parell)

---

### b) $\\int_0^1 \\cos(x^2) \\, dx$

Dades: $b-a = 1$. Cotes: $\\max |g''(x)| \\approx 3.844$ i $\\max |g^{(4)}(x)| \\approx 42.48$.

**Mètode dels Trapezis:**
$\\frac{h^2}{12} \\cdot 3.844 < 0.005 \\implies h^2 < \\frac{0.06}{3.844} \\approx 0.0156$
$h < 0.125$
$n = \\frac{1}{h} > 8 \\implies \\mathbf{n = 9}$ (o $n=8$ si l'error és molt ajustat)

**Regla de Simpson:**
$\\frac{h^4}{180} \\cdot 42.48 < 0.005 \\implies h^4 < \\frac{0.9}{42.48} \\approx 0.02118$
$h < 0.381$
$n = \\frac{1}{h} > 2.62 \\implies \\mathbf{n = 4}$ (ha de ser parell)

---

### Resum de resultats

| Integral | Trap. ($n$) | Simp. ($n$) |
|---|---|---|
| (a) $\\int e^{x^2}$ | 17 | 4 |
| (b) $\\int \\cos(x^2)$ | 9 | 4 |

**Nota:** Per a ambdues funcions, el mètode de Simpson requereix molts menys subintervals (només 4) per assolir la mateixa precisió del $0.5 \\%$, mentre que el dels trapezis en requereix prop del doble o més (fins a 17 en el cas de l'exponencial).
`,
  availableLanguages: ['ca']
};
