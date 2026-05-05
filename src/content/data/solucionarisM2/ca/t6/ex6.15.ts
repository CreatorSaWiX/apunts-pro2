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

La funció $f(t) = \\frac{e^t}{t}$ és contínua en tot el seu domini ($\\mathbb{R} \\setminus \{0\}$). Com que l'interval d'integració $[1, x^2+2]$ no conté el zero per a cap valor de $x$, la funció és contínua en l'interval de treball i podem aplicar el Teorema Fonamental del Càlcul i la regla de la cadena per derivar $F(x)$:

$$F'(x) = f(x^2+2) \\cdot (x^2+2)' - f(1) \\cdot (1)'$$

$$F'(x) = \\frac{e^{x^2+2}}{x^2+2} \\cdot 2x - \\frac{e^1}{1} \\cdot 0 = \\frac{e^{x^2+2}}{x^2+2} \\cdot 2x$$

$F'(0) = \\frac{e^2}{2} \\cdot 0 = 0$

Com que l'anul·lació de la derivada és la condició de punt crític, quedat comprovat que **$x=0$ és un punt crític**.

---

### b) Aproximació de $F(0)$

Tenim $F(0) = \\int_1^2 \\frac{e^t}{t} \\, dt$. Aplicarem la regla de Simpson amb $n=4$:
- Interval: $[1, 2]$, per tant $a=1$ i $b=2$.
- $h = \\frac{2-1}{4} = \\frac{1}{4}$
- Punts: $t_i = 1 + i \\cdot \\frac{1}{4} \\implies \\{t_0=1, t_1=\\frac{5}{4}, t_2=\\frac{6}{4}, t_3=\\frac{7}{4}, t_4=2\\}$

La fórmula de Simpson és:
$$S = \\frac{h}{3} \\left[ f(t_0) + 4f(t_1) + 2f(t_2) + 4f(t_3) + f(t_4) \\right]$$

Substituïm els valors de la funció $f(t) = \\frac{e^t}{t}$ sense aproximar:

$$S = \\frac{1}{12} \\left[ \\frac{e^1}{1} + 4 \\cdot \\frac{e^{5/4}}{5/4} + 2 \\cdot \\frac{e^{6/4}}{6/4} + 4 \\cdot \\frac{e^{7/4}}{7/4} + \\frac{e^2}{2} \\right]$$

$$S = \\frac{1}{12} \\left[ e + \\frac{16}{5} e^{5/4} + \\frac{4}{3} e^{3/2} + \\frac{16}{7} e^{7/4} + \\frac{e^2}{2} \\right] \\approx \\mathbf{3.05924}$$

---

### c) Cota superior de l'error

Utilitzem la fórmula de l'error per a Simpson amb $M_4 = 25$ i $h = \\frac{1}{4}$:

$$|E_S| \\leq \\frac{(b-a)h^4}{180} M_4 = \\frac{1 \\cdot (1/4)^4}{180} \\cdot 25$$

$$|E_S| \\leq \\frac{1/256}{180} \\cdot 25 = \\frac{25}{46080} = \\frac{5}{9216} \\approx \\mathbf{5.425 \\cdot 10^{-4}}$$

`,
  availableLanguages: ['ca']
};
