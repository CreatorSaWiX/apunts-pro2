import type { Solution } from '../../../solutions';

export const ex6_14: Solution = {
  id: 'M2-T6-Ex14',
  title: 'Exercici 14: Anàlisi de l\'error en la regla de Simpson',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Siguin $f(x) = \\cos^3(x)$ i $I = \\int_0^1 \\cos^3(x) \\, dx$.

a) Comproveu que $f''(x) = 6\\cos(x) - 9\\cos^3(x)$ i $f^{(4)}(x) = -60\\cos(x) + 81\\cos^3(x)$.

b) Justifiqueu que $\\max_{x \\in [0,1]} |f''(x)| \\leq 3$ i $\\max_{x \\in [0,1]} |f^{(4)}(x)| \\leq 21$.

c) Calculeu $I$ amb un error menor que $10^{-4}$.`,
  content: `
### a) Derivació de la funció

Tenim $f(x) = (\\cos x)^3$. Calculem les derivades successives:

$f'(x) = 3\\cos^2 x (-\\sin x) = -3\\cos^2 x \\sin x$.

$f''(x) = -3 [ 2\\cos x (-\\sin x) \\sin x + \\cos^2 x \\cos x ] = -3 [ -2\\sin^2 x \\cos x + \\cos^3 x ]$.

Utilitzant $\\sin^2 x = 1 - \\cos^2 x$:

$f''(x) = -3 [ -2(1-\\cos^2 x)\\cos x + \\cos^3 x ] = -3 [ -2\\cos x + 3\\cos^3 x ] = \\mathbf{6\\cos x - 9\\cos^3 x}$.

$f'''(x) = (-6 + 27\\cos^2 x)\\sin x$.

$f^{(4)}(x) = (-54\\cos x \\sin^2 x) + (-6 + 27\\cos^2 x)\\cos x = -54\\cos x (1-\\cos^2 x) - 6\\cos x + 27\\cos^3 x$.

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

Utilitzarem la **Regla de Simpson**. Busquem el nombre de subintervals $n$ necessari perquè $|E_S| < 10^{-4}$. Substituint $h = 1/n$ i $M_4 = 21$:

$$\\frac{(b-a)h^4}{180} M_4 < 10^{-4} \\implies \\frac{1}{180n^4} \\cdot 21 < 10^{-4}$$

$$n^4 > \\frac{21}{180 \\cdot 10^{-4}} = \\frac{21}{0.018} = \\frac{21000}{18} = \\frac{3500}{3}$$

$$n > \\sqrt[4]{\\frac{3500}{3}} \\approx 5.84 \\implies \\mathbf{n \\geq 6} \\text{ (ha de ser parell)}$$

**Càlcul per Simpson ($n=6, h=1/6$):**
Punts: $x_i = \\{0, \\frac{1}{6}, \\frac{2}{6}, \\frac{3}{6}, \\frac{4}{6}, \\frac{5}{6}, 1\\}$

$$I \\approx \\frac{1/6}{3} \\left[ f(0) + f(1) + 4\\left(f\\left(\\frac{1}{6}\\right) + f\\left(\\frac{3}{6}\\right) + f\\left(\\frac{5}{6}\\right)\\right) + 2\\left(f\\left(\\frac{2}{6}\\right) + f\\left(\\frac{4}{6}\\right)\\right) \\right]$$

Substituint la funció $f(x) = \\cos^3(x)$:
$$I \\approx \\frac{1}{18} \\left[ \\cos^3(0) + \\cos^3(1) + 4\\left(\\cos^3\\left(\\frac{1}{6}\\right) + \\cos^3\\left(\\frac{3}{6}\\right) + \\cos^3\\left(\\frac{5}{6}\\right)\\right) + 2\\left(\\cos^3\\left(\\frac{2}{6}\\right) + \\cos^3\\left(\\frac{4}{6}\\right)\\right) \\right]$$

$$I \\approx \\mathbf{0.6429}$$

`,
  availableLanguages: ['ca']
};
