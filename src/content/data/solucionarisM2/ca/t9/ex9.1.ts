import type { Solution } from '../../../solutions';

export const ex9_1: Solution = {
  id: 'M2-T9-Ex1',
  title: 'Exercici 1: Polinomi de Taylor de grau 2',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Donada la funció $f(x, y) = \\ln(1 + 2x + 3y)$:
  
a) Escriviu el polinomi de Taylor de grau 2 per a $f$ en el punt $(0,0)$.
b) Utilitzant el polinomi obtingut, calculeu un valor aproximat per a $f(1/10, 1/10)$ i fiteu l'error.`,
  content: `### Apartat a) Polinomi de Taylor de grau 2
Podem fer-ho mitjançant derivades o usant el desenvolupament de $\\ln(1+t) = t - \\frac{t^2}{2} + o(t^2)$.

Fem servir el desenvolupament directe per velocitat. Sigui $t = 2x + 3y$:
$$f(x,y) = \\ln(1 + (2x + 3y)) \\approx (2x + 3y) - \\frac{(2x + 3y)^2}{2}$$
Desenvolupem el quadrat:
$$P_2(x,y) = 2x + 3y - \\frac{4x^2 + 12xy + 9y^2}{2}$$
**$$P_2(x,y) = 2x + 3y - 2x^2 - 6xy - 4.5y^2$$**

---

### Apartat b) Aproximació i fita de l'error
Substituïm $x = 0.1$ i $y = 0.1$:
$$f(0.1, 0.1) \\approx 2(0.1) + 3(0.1) - 2(0.1)^2 - 6(0.1)^2 - 4.5(0.1)^2$$
$$f(0.1, 0.1) \\approx 0.2 + 0.3 - 0.02 - 0.06 - 0.045 = 0.375$$

**Fita de l'error (Residu de Lagrange):**
Les derivades de tercer ordre tenen la forma:
* $f_{xxx} = 16(1+2x+3y)^{-3}$
* $f_{xxy} = 24(1+2x+3y)^{-3}$
* $f_{xyy} = 36(1+2x+3y)^{-3}$
* $f_{yyy} = 54(1+2x+3y)^{-3}$

Totes es maximitzen al punt $(0,0)$ dins del segment que uneix l'origen amb $(0.1, 0.1)$.
$$|R_2| \\leq \\frac{1}{3!} \\sum_{i+j+k=3} \\binom{3}{i,j,k} |\\partial_{ijk} f| |h^i k^j l^k|$$
$$|R_2| \\leq \\frac{0.1^3}{6} [16 + 3(24) + 3(36) + 54] = \\frac{0.001}{6} [250] \\approx 0.042$$
`,
  availableLanguages: ['ca']
};
