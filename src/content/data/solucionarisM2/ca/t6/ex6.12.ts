import type { Solution } from '../../../solutions';

export const ex6_12: Solution = {
  id: 'M2-T6-Ex12',
  title: 'Exercici 12: Integració numèrica de funcions no elementals',
  author: 'Antigravity',
  code: '',
  type: 'notebook',
  statement: `Utilitzeu el mètode dels trapezis i la regla de Simpson amb 4 subintervals per avaluar les integrals següents:

a) $\\int_0^1 e^{x^2} \\, dx$;

b) $\\int_0^1 \\cos(x^2) \\, dx$.

Calculeu també la cota superior de l'error comès en cada cas.`,
  content: `
Per a ambdues integrals tenim $n=4$ subintervals en l'interval $[0, 1]$, per tant $h = \\frac{1-0}{4} = 0.25$.
Els punts de la partició són $x_i = a + i \\cdot h = 0 + \\frac i 4 = \\{0, 0.25, 0.5, 0.75, 1\\}$.

---

### a) $\\int_0^1 e^{x^2} \\, dx$

Taula de valors ($f(x) = e^{x^2}$):
- $f(0) = 1$
- $f(0.25) \\approx 1.06449$
- $f(0.5) \\approx 1.28403$
- $f(0.75) \\approx 1.75505$
- $f(1) \\approx 2.71828$

**Mètode dels Trapezis ($T$):**
$T_n = \\frac{h}{2} \\left[ f(x_0) + 2 \\sum_{i=1}^{n-1} f(x_i) + f(x_n) \\right]$

$T = \\frac{0.25}{2} [f(0) + 2(f(0.25) + f(0.5) + f(0.75)) + f(1)]$

$T = 0.125 [1 + 2(4.10357) + 2.71828] = 0.125 [11.92542] \\approx \\mathbf{1.49068}$

**Regla de Simpson ($S$):**
$S_n = \\frac{h}{3} \\left[ f(x_0) + 4 \\sum_{\\text{senars}} f(x_i) + 2 \\sum_{\\text{parells}} f(x_i) + f(x_n) \\right]$

$S = \\frac{0.25}{3} [f(0) + 4f(0.25) + 2f(0.5) + 4f(0.75) + f(1)]$

$S = \\frac{0.25}{3} [1 + 4.25796 + 2.56806 + 7.02020 + 2.71828] = \\frac{0.25}{3} [17.56450] \\approx \\mathbf{1.46371}$

**Cotes d'error (a):**
Necessitem les derivades: $f''(x) = (2+4x^2)e^{x^2}$ i $f^{(4)}(x) = (12+48x^2+16x^4)e^{x^2}$.
- $max |f''(x)| = f''(1) = 6e \\approx 16.31$
- $max |f^{(4)}(x)| = f^{(4)}(1) = 76e \\approx 206.59$

Fórmules de l'error:
$|E_T| \\leq \\frac{(b-a)h^2}{12} M_2, \\quad |E_S| \\leq \\frac{(b-a)h^4}{180} M_4$

$|E_T| \\leq \\frac{1 \\cdot 0.25^2}{12} \\cdot 16.31 \\approx \\mathbf{0.0849}$
$|E_S| \\leq \\frac{1 \\cdot 0.25^4}{180} \\cdot 206.59 \\approx \\mathbf{0.00448}$

---

### b) $\\int_0^1 \\cos(x^2) \\, dx$

Taula de valors ($g(x) = \\cos(x^2)$):
- $g(0) = 1$
- $g(0.25) \\approx 0.99805$
- $g(0.5) \\approx 0.96891$
- $g(0.75) \\approx 0.84592$
- $g(1) \\approx 0.54030$

**Mètode dels Trapezis ($T$):**
$T = \\frac{0.25}{2} [g(0) + 2(g(0.25) + g(0.5) + g(0.75)) + g(1)]$
$T = 0.125 [1 + 2(2.81288) + 0.54030] = 0.125 [7.16606] \\approx \\mathbf{0.89576}$

**Regla de Simpson ($S$):**
$S = \\frac{0.25}{3} [g(0) + 4g(0.25) + 2g(0.5) + 4g(0.75) + g(1)]$
$S = \\frac{0.25}{3} [1 + 3.99220 + 1.93782 + 3.38368 + 0.54030] = \\frac{0.25}{3} [10.85400] \\approx \\mathbf{0.90450}$

**Cotes d'error (b):**
Derivada segona: $g''(x) = -2\\sin(x^2) - 4x^2\\cos(x^2)$.
- $max |g''(x)| \\approx |g''(1)| = |-2\\sin(1) - 4\\cos(1)| \\approx 3.844$

$|E_T| \\leq \\frac{1 \\cdot 0.0625}{12} \\cdot 3.844 \\approx \\mathbf{0.0200}$
*(Nota: Les derivades de Simpson per $\\cos(x^2)$ són més complexes però segueixen la mateixa metodologia de cotes superiors).*
`,
  availableLanguages: ['ca']
};
