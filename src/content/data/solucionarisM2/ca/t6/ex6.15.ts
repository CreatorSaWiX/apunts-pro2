import type { Solution } from '../../../solutions';

export const ex6_15: Solution = {
  id: 'M2-T6-Ex15',
  title: 'Exercici 15: Punt crític i integració numèrica',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Sigui $F(x) = \\int_1^{x^2+2} \\frac{e^t}{t} \\, dt$.

a) Comproveu que $x = 0$ és un punt crític de $F$.

b) Calculeu el valor aproximat de $F(0)$ utilitzant el mètode de Simpson amb 4 subintervals.

c) Sabent que per $f(t) = \\frac{e^t}{t}$ es té $|f^{(4)}(t)| < 25$ per a tot $t \\in [1, 2]$, calculeu la cota superior de l'error comès.`,
  content: `
### a) Punt crític

Per trobar els punts crítics, derivem $F(x)$ utilitzant el Teorema Fonamental del Càlcul i la regla de la cadena:
$F'(x) = \\frac{d}{dx} \\left( \\int_1^{x^2+2} \\frac{e^t}{t} \\, dt \\right) = \\frac{e^{x^2+2}}{x^2+2} \\cdot \\frac{d}{dx}(x^2+2) = \\frac{e^{x^2+2}}{x^2+2} \\cdot 2x$

Substituint $x = 0$:
$F'(0) = \\frac{e^{0^2+2}}{0^2+2} \\cdot 2(0) = \\frac{e^2}{2} \\cdot 0 = 0$

Com que l'anul·lació de la derivada és la condició de punt crític, quedat comprovat que **$x=0$ és un punt crític**.

---

### b) Aproximació de $F(0)$

Tenim $F(0) = \\int_1^2 \\frac{e^t}{t} \\, dt$. Aplicarem Simpson amb $n=4$ i $h = \\frac{2-1}{4} = 0.25$.

**Taula de valors ($f(t) = e^t/t$):**
- $t_0 = 1.00 \\implies f(1.00) = e/1 \\approx 2.71828$
- $t_1 = 1.25 \\implies f(1.25) = e^{1.25}/1.25 \\approx 2.79227$
- $t_2 = 1.50 \\implies f(1.50) = e^{1.5}/1.5 \\approx 2.98779$
- $t_3 = 1.75 \\implies f(1.75) = e^{1.75}/1.75 \\approx 3.28834$
- $t_4 = 2.00 \\implies f(2.00) = e^2/2 \\approx 3.69453$

**Càlcul per Simpson:**
$S = \\frac{0.25}{3} [f(t_0) + 4f(t_1) + 2f(t_2) + 4f(t_3) + f(t_4)]$
$S = \\frac{1}{12} [2.71828 + 11.16908 + 5.97558 + 13.15336 + 3.69453]$
$S = \\frac{1}{12} [36.71083] \\approx \\mathbf{3.05924}$

---

### c) Cota superior de l'error

Utilitzem la fórmula de l'error per a Simpson amb $M_4 = 25$ i $h = 0.25$:
$|E_S| \\leq \\frac{(b-a)h^4}{180} M_4 = \\frac{1 \\cdot (0.25)^4}{180} \\cdot 25$
$|E_S| \\leq \\frac{0.00390625}{180} \\cdot 25 = \\frac{0.09765625}{180} \\approx \\mathbf{0.0005425}$

L'error comès és inferior a $5.43 \\cdot 10^{-4}$.
`,
  availableLanguages: ['ca']
};
