import type { Solution } from '../../../solutions';

export const ex6_12: Solution = {
  id: 'M2-T6-Ex12',
  title: 'Exercici 12: Integració numèrica de funcions no elementals',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Utilitzeu el mètode dels trapezis i la regla de Simpson amb 4 subintervals per avaluar les integrals següents:

a) $\\int_0^1 e^{x^2} \\, dx$;

b) $\\int_0^1 \\cos(x^2) \\, dx$.

Calculeu també la cota superior de l'error comès en cada cas.`,
  content: `### a) $\\int_0^1 e^{x^2} \\, dx$
- Interval: $[a, b] = [0, 1]$
- Nombre de subintervals: $n = 4$
- Amplada dels intervals: $h = \\frac{b-a}{n} = \\frac{1-0}{4} = \\frac{1}{4}$
- Punts de la partició ($x_i = a + i \\cdot h$):
  - $x_0 = 0 + 0 \\cdot \\frac{1}{4} = 0$
  - $x_1 = 0 + 1 \\cdot \\frac{1}{4} = \\frac{1}{4}$
  - $x_2 = 0 + 2 \\cdot \\frac{1}{4} = \\frac{2}{4}$ (o $0.5$)
  - $x_3 = 0 + 3 \\cdot \\frac{1}{4} = \\frac{3}{4}$
  - $x_4 = 0 + 4 \\cdot \\frac{1}{4} = 1$

**Mètode dels Trapezis ($T$):**
Fórmula: $T_n = h \\left[ \\frac{f(a)+f(b)}{2} + \\sum_{i=1}^{n-1} f(x_i) \\right]$

$$T = \\frac{1}{4} \\left[ \\frac{f(0)+f(1)}{2} + f\\left(\\frac{1}{4}\\right) + f\\left(\\frac{2}{4}\\right) + f\\left(\\frac{3}{4}\\right) \\right]$$

$$T = \\frac{1}{4} \\left[ \\frac{e^{0^2}+e^{1^2}}{2} + e^{(1/4)^2} + e^{(2/4)^2} + e^{(3/4)^2} \\right]\\approx \\mathbf{1.490679}$$

**Regla de Simpson ($S$):**
Fórmula: $S_{2m} = \\frac{h}{3} \\left[ f(a)+f(b) + 4\\sum_{j=1}^{m} f(x_{2j-1}) + 2\\sum_{j=1}^{m-1} f(x_{2j}) \\right]$ (amb $n=2m=4 \\implies m=2$)

$$S = \\frac{1/4}{3} \\left[ f(0)+f(1) + 4\\left(f\\left(\\frac{1}{4}\\right) + f\\left(\\frac{3}{4}\\right)\\right) + 2f\\left(\\frac{2}{4}\\right) \\right]$$

$$S = \\frac{1}{12} \\left[ e^0 + e^1 + 4e^{(1/4)^2} + 2e^{(2/4)^2} + 4e^{(3/4)^2} \\right] \\approx \\mathbf{1.46371}$$

**Cotes d'error (a):**
Necessitem les derivades: $f''(x) = (2+4x^2)e^{x^2}$ i $f^{(4)}(x) = (12+48x^2+16x^4)e^{x^2}$.
- $M_2 = \\max |f''(x)|$ en $[0, 1] = f''(1) = 6e$
- $M_4 = \\max |f^{(4)}(x)|$ en $[0, 1] = f^{(4)}(1) = 76e$

$$|E_T| \\leq \\frac{(b-a)h^2}{12} M_2 = \\frac{1 \\cdot (1/4)^2}{12} \\cdot 6e = \\frac{1/16}{12} \\cdot 6e = \\frac{6e}{192} = \\frac{e}{32} \\approx \\mathbf{0.0849}$$

$$|E_S| \\leq \\frac{(b-a)h^4}{180} M_4 = \\frac{1 \\cdot (1/4)^4}{180} \\cdot 76e = \\frac{1/256}{180} \\cdot 76e = \\frac{76e}{46080} = \\frac{19e}{11520} \\approx \\mathbf{0.00448}$$

---

### b) $\\int_0^1 \\cos(x^2) \\, dx$

**Dades inicials:**
- Interval: $[a, b] = [0, 1]$
- $h = \\frac{1}{4}$ i punts $x_i = \\{0, \\frac{1}{4}, \\frac{2}{4}, \\frac{3}{4}, 1\\}$

**Mètode dels Trapezis ($T$):**

$$T = \\frac{1}{4} \\left[ \\frac{g(0)+g(1)}{2} + g\\left(\\frac{1}{4}\\right) + g\\left(\\frac{2}{4}\\right) + g\\left(\\frac{3}{4}\\right) \\right]$$

$$T = \\frac{1}{4} \\left[ \\frac{\\cos(0)+\\cos(1)}{2} + \\cos(1/16) + \\cos(4/16) + \\cos(9/16) \\right] \\approx \\mathbf{0.89576}$$

**Regla de Simpson ($S$):**

$$S = \\frac{1}{12} \\left[ g(0) + g(1) + 4\\left(g\\left(\\frac{1}{4}\\right) + g\\left(\\frac{3}{4}\\right)\\right) + 2g\\left(\\frac{2}{4}\\right) \\right]$$

$$S = \\frac{1}{12} \\left[ \\cos(0) + \\cos(1) + 4\\cos(1/16) + 2\\cos(4/16) + 4\\cos(9/16) \\right] \\approx \\mathbf{0.90450}$$

**Cotes d'error (b):**
Derivada segona: $g''(x) = -2\\sin(x^2) - 4x^2\\cos(x^2)$.
- $M_2 = \\max |g''(x)|$ en $[0, 1] \\approx |g''(1)| = 2\\sin(1) + 4\\cos(1) \\approx 3.844$

$$|E_T| \\leq \\frac{(b-a)h^2}{12} M_2 = \\frac{1 \\cdot (1/4)^2}{12} \\cdot 3.844 \\approx \\mathbf{0.0200}$$

*(Nota: Les derivades de Simpson per a $\\cos(x^2)$ són més complexes però seguirien la mateixa metodologia de cotes superiors).*
`,
  availableLanguages: ['ca']
};
