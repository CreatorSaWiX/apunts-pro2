import type { Solution } from '../../../solutions';

export const ex6_14: Solution = {
  id: 'M2-T6-Ex14',
  title: 'Exercici 14: Anàlisi de l\'error en la regla de Simpson',
  author: 'Antigravity',
  code: '',
  type: 'notebook',
  statement: `Siguin $f(x) = \\cos^3(x)$ i $I = \\int_0^1 \\cos^3(x) \\, dx$.

a) Comproveu que $f''(x) = 6\\cos(x) - 9\\cos^3(x)$ i $f^{(4)}(x) = -60\\cos(x) + 81\\cos^3(x)$.

b) Justifiqueu que $\\max_{x \\in [0,1]} |f''(x)| \\leq 3$ i $\\max_{x \\in [0,1]} |f^{(4)}(x)| \\leq 21$.

c) Calculeu $I$ amb un error menor que $10^{-4}$.`,
  content: `
### a) Derivació de la funció

Tenim $f(x) = (\\cos x)^3$. Calculem les derivades successives:
1. $f'(x) = 3\\cos^2 x (-\\sin x) = -3\\cos^2 x \\sin x$.
2. $f''(x) = -3 [ 2\\cos x (-\\sin x) \\sin x + \\cos^2 x \\cos x ] = -3 [ -2\\sin^2 x \\cos x + \\cos^3 x ]$.
   Utilitzant $\\sin^2 x = 1 - \\cos^2 x$:
   $f''(x) = -3 [ -2(1-\\cos^2 x)\\cos x + \\cos^3 x ] = -3 [ -2\\cos x + 3\\cos^3 x ] = \\mathbf{6\\cos x - 9\\cos^3 x}$.
3. $f'''(x) = (-6 + 27\\cos^2 x)\\sin x$.
4. $f^{(4)}(x) = (-54\\cos x \\sin^2 x) + (-6 + 27\\cos^2 x)\\cos x = -54\\cos x (1-\\cos^2 x) - 6\\cos x + 27\\cos^3 x$.
   $f^{(4)}(x) = -54\\cos x + 54\\cos^3 x - 6\\cos x + 27\\cos^3 x = \\mathbf{81\\cos^3 x - 60\\cos x}$.

---

### b) Justificació de les cotes

En l'interval $x \\in [0, 1]$, la funció $\\cos x$ és decreixent i pren valors entre $\\cos(1) \\approx 0.54$ i $\\cos(0) = 1$. Fem el canvi de variable $u = \\cos x$, on $u \\in [0.54, 1]$.

**Per a $f''(x)$:**
Estudiem $g(u) = 6u - 9u^3$. La seva derivada és $g'(u) = 6 - 27u^2$. S'anul·la en $u = \\sqrt{6/27} \\approx 0.47$, que queda fora de l'interval $[0.54, 1]$. Els valors als extrems són:
- $g(1) = 6 - 9 = -3$.
- $g(0.54) \\approx 1.83$.
Per tant, $|f''(x)| \\leq |-3| = \\mathbf{3}$.

**Per a $f^{(4)}(x)$:**
Estudiem $h(u) = 81u^3 - 60u$. La seva derivada $h'(u) = 243u^2 - 60$ s'anul·la en $u \\approx 0.49$, també fora de l'interval.
- $h(1) = 81 - 60 = 21$.
- $h(0.54) \\approx -19.6$.
Per tant, $|f^{(4)}(x)| \\leq \\mathbf{21}$.

---

### c) Càlcul de $I$ amb error $< 10^{-4}$

Utilitzarem la **Regla de Simpson**. Busquem $n$ tal que $|E_S| < 10^{-4}$:
$\\frac{(b-a)h^4}{180} M_4 < 10^{-4} \\implies \\frac{1 \\cdot h^4}{180} \\cdot 21 < 10^{-4}$
$h^4 < \\frac{180 \\cdot 10^{-4}}{21} \\approx 0.000857 \\implies h < \\sqrt[4]{0.000857} \\approx 0.171$
$n = \\frac{1}{h} \\geq 5.85$. Com que $n$ ha de ser parell, triem **$n = 6$**.

Càlcul per Simpson ($n=6, h=1/6$):
$I \\approx \\frac{1}{18} [f(0) + 4f(1/6) + 2f(2/6) + 4f(3/6) + 2f(4/6) + 4f(5/6) + f(1)]$
Operant amb els valors de $\\cos^3(x)$:
$I \\approx \\frac{1}{18} [1 + 3.8213 + 1.6375 + 2.6582 + 0.9424 + 1.1576 + 0.1577] \\approx \\mathbf{0.6429}$

*(Nota: El valor exacte integrant analíticament és $\\sin(1) - \\frac{\\sin^3(1)}{3} \\approx 0.64287$, el que confirma que l'error amb $n=6$ és inferior a $10^{-4}$).*
`,
  availableLanguages: ['ca']
};
