import type { Solution } from '../../../solutions';

export const ex6_6: Solution = {
  id: 'M2-T6-Ex6',
  title: 'Exercici 6: Dimensió de la partició per Simpson',
  author: 'Antigravity',
  code: '',
  type: 'notebook',
  statement: `Siguin $f(x) = (\\sin(x) \\cos(x))^{4/3}$ i $I = \\int_{0.6}^{1.0} f(x) \\, dx$.

(a) Sabent que $0 < f^{(4)}(x) < 20$ per a tot $x \\in [0.6, 1.0]$, calculeu el nombre de subintervals necessaris per obtenir el valor de la integral amb la fórmula de Simpson amb una precisió de com a mínim quatre decimals correctes ($0.5 \\cdot 10^{-4}$).

(b) Doneu el valor aproximat de la integral $I$ amb el grau d'exactitud demanat.`,
  content: `
### (a) Càlcul del nombre de subintervals ($n$)

La fórmula de l'error per al mètode de Simpson és:
$|E_S| \\leq \\frac{(b-a)h^4}{180} \\max |f^{(4)}(x)|$

Dades del problema:
- Interval: $[0.6, 1.0] \\implies b-a = 0.4$
- Cota de la quarta derivada: $M_4 = 20$
- Precisió demanada: $\\epsilon = 0.5 \\cdot 10^{-4} = 5 \\cdot 10^{-5}$

Volem trobar $h$ tal que $|E_S| \\leq \\epsilon$:
$\\frac{0.4 \\cdot h^4}{180} \\cdot 20 \\leq 5 \\cdot 10^{-5}$
$\\frac{8 \\cdot h^4}{180} \\leq 5 \\cdot 10^{-5}$
$\\frac{2}{45} h^4 \\leq 5 \\cdot 10^{-5}$
$h^4 \\leq \\frac{5 \\cdot 10^{-5} \\cdot 45}{2} = 112.5 \\cdot 10^{-5} = 0.001125$

Calculem $h$:
$h \\leq \\sqrt[4]{0.001125} \\approx 0.183$

Com que $h = \\frac{b-a}{n} = \\frac{0.4}{n}$:
$\\frac{0.4}{n} \\leq 0.183 \\implies n \\geq \\frac{0.4}{0.183} \\approx 2.18$

En el mètode de Simpson, l'índex $n$ ha de ser un **nombre enter parell**. El primer enter parell que compleix la condició és **$n=4$**.

---

### (b) Valor aproximat de la integral ($n=4$)

Amb $n=4$, l'amplada de cada subinterval és $h = \\frac{0.4}{4} = 0.1$.
Els punts de la partició són: $x_0=0.6, x_1=0.7, x_2=0.8, x_3=0.9, x_4=1.0$.

Simplifiquem la funció utilitzant la identitat $\\sin x \\cos x = \\frac{1}{2} \\sin(2x)$:
$f(x) = \\left( \\frac{1}{2} \\sin(2x) \\right)^{4/3}$

Calculem els valors de la funció:
- $f(0.6) = (0.5 \\sin 1.2)^{4/3} \\approx 0.35821$
- $f(0.7) = (0.5 \\sin 1.4)^{4/3} \\approx 0.38584$
- $f(0.8) = (0.5 \\sin 1.6)^{4/3} \\approx 0.39322$
- $f(0.9) = (0.5 \\sin 1.8)^{4/3} \\approx 0.37981$
- $f(1.0) = (0.5 \\sin 2.0)^{4/3} \\approx 0.34651$

Apliquem la fórmula de Simpson:
$S = \\frac{h}{3} [f(x_0) + 4f(x_1) + 2f(x_2) + 4f(x_3) + f(x_4)]$
$S = \\frac{0.1}{3} [0.35821 + 4(0.38584) + 2(0.39322) + 4(0.37981) + 0.34651]$
$S = \\frac{0.1}{3} [0.35821 + 1.54336 + 0.78644 + 1.51924 + 0.34651]$
$S = \\frac{0.1}{3} [4.55376] \\approx \\mathbf{0.151792}$

El valor aproximat de la integral amb 4 decimals correctes és **$0.1518$**.
`,
  availableLanguages: ['ca']
};
