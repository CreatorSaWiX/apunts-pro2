import type { Solution } from '../../../solutions';

export const ex6_5: Solution = {
  id: 'M2-T6-Ex5',
  title: 'Exercici 5: Integració numèrica (Trapezis i Simpson)',
  author: 'Antigravity',
  code: '',
  type: 'notebook',
  statement: `Calculeu la integral següent $I = \\int_{0}^{4} (1 - e^{x/4}) \\, dx$:

(a) Fent ús de la regla de Barrow.

(b) Fent ús de la fórmula dels trapezis amb una partició de 4 subintervals.

(c) Fent ús de la fórmula de Simpson amb una partició de 4 subintervals.

(d) Avalueu l'error absolut en cada cas i comenteu els resultats.

(e) Calculeu les cotes superiors de l'error utilitzant les fórmules teòriques.`,
  content: `
### (a) Regla de Barrow (Valor exacte)

Primer trobem una primitiva de $f(x) = 1 - e^{x/4}$:
$F(x) = \\int (1 - e^{x/4}) \\, dx = x - 4e^{x/4}$

Apliquem la Regla de Barrow en l'interval $[0, 4]$:
$I = [x - 4e^{x/4}]_0^4 = (4 - 4e^{4/4}) - (0 - 4e^{0/4})$
$I = 4 - 4e - (0 - 4) = 8 - 4e$

Valor numèric aproximat:
$I = 8 - 4(2.7182818) \\approx \\mathbf{-2.873127}$

---

### (b) Fórmula dels Trapezis ($n=4$)

Dividim l'interval $[0, 4]$ en $n=4$ subintervals, per tant $h = \\frac{4-0}{4} = 1$.
Els punts són $x_i = \{0, 1, 2, 3, 4\}$.

| $i$ | $x_i$ | $f(x_i) = 1 - e^{x_i/4}$ |
|---|---|---|
| 0 | 0 | $1 - e^0 = 0$ |
| 1 | 1 | $1 - e^{0.25} \\approx -0.284025$ |
| 2 | 2 | $1 - e^{0.5} \\approx -0.648721$ |
| 3 | 3 | $1 - e^{0.75} \\approx -1.117000$ |
| 4 | 4 | $1 - e^1 \\approx -1.718282$ |

Fórmula: $T = \\frac{h}{2} [f(x_0) + 2(f(x_1) + f(x_2) + f(x_3)) + f(x_4)]$
$T = \\frac{1}{2} [0 + 2(-0.284025 - 0.648721 - 1.117000) - 1.718282]$
$T = \\frac{1}{2} [-4.099492 - 1.718282] = \\frac{1}{2} [-5.817774] = \\mathbf{-2.908887}$

---

### (c) Fórmula de Simpson ($n=4$)

Fórmula: $S = \\frac{h}{3} [f(x_0) + 4f(x_1) + 2f(x_2) + 4f(x_3) + f(x_4)]$
$S = \\frac{1}{3} [0 + 4(-0.284025) + 2(-0.648721) + 4(-1.117000) - 1.718282]$
$S = \\frac{1}{3} [0 - 1.136100 - 1.297442 - 4.468000 - 1.718282]$
$S = \\frac{1}{3} [-8.619824] = \\mathbf{-2.873275}$

---

### (d) Error absolut i comentari

- **Error Trapezis**: $E_T = |I - T| = |-2.873127 - (-2.908887)| = \\mathbf{0.035760}$
- **Error Simpson**: $E_S = |I - S| = |-2.873127 - (-2.873275)| = \\mathbf{0.000148}$

**Comentari**: S'observa que el mètode de Simpson és molt més precís que el dels trapezis per al mateix nombre de divisions ($n=4$). L'error de Simpson és aproximadament 240 vegades menor.

---

### (e) Cotes superiors de l'error

Derivem la funció $f(x) = 1 - e^{x/4}$:
$f'(x) = -\\frac{1}{4} e^{x/4}$
$f''(x) = -\\frac{1}{16} e^{x/4} \\implies |f''(x)| \\leq \\frac{e}{16} \\approx 0.1699$ en $[0, 4]$.
$f'''(x) = -\\frac{1}{64} e^{x/4}$
$f^{(4)}(x) = -\\frac{1}{256} e^{x/4} \\implies |f^{(4)}(x)| \\leq \\frac{e}{256} \\approx 0.0106$ en $[0, 4]$.

**Cota Trapezis**:
$|E_T| \\leq \\frac{(b-a)h^2}{12} \\max |f''(x)| = \\frac{4 \\cdot 1^2}{12} \\cdot 0.1699 = \\frac{1}{3} \\cdot 0.1699 \\approx \\mathbf{0.0566}$
*(L'error real 0.0357 és menor que la cota 0.0566, correcte)*

**Cota Simpson**:
$|E_S| \\leq \\frac{(b-a)h^4}{180} \\max |f^{(4)}(x)| = \\frac{4 \\cdot 1^4}{180} \\cdot 0.0106 = \\frac{1}{45} \\cdot 0.0106 \\approx \\mathbf{0.000236}$
*(L'error real 0.000148 és menor que la cota 0.000236, correcte)*

Comentari: Les cotes confirmen teòricament la superioritat de Simpson.
`,
  availableLanguages: ['ca']
};
