import type { Solution } from '../../../solutions';

export const ex6_5: Solution = {
  id: 'M2-T6-Ex5',
  title: 'Exercici 5: Integració numèrica (Trapezis i Simpson)',
  author: 'SaWiX',
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

Per trobar una primitiva de $f(x) = 1 - e^{x/4}$, calculem cada part per separat:
1. La primitiva de 1 és $x$.
2. Per a l'exponencial $e^{x/4}$, sabem que la seva primitiva és $4e^{x/4}$, ja que si la derivem tornem a l'original:
$$(4e^{x/4})' = 4 \\cdot e^{x/4} \\cdot \\frac{1}{4} = e^{x/4}$$

Així doncs, la primitiva completa és: **$F(x) = x - 4e^{x/4}$**

Apliquem la Regla de Barrow en l'interval $[0, 4]$:
$$I = [x - 4e^{x/4}]_0^4 = (4 - 4e^{4/4}) - (0 - 4e^{0/4})$$
$$I = (4 - 4e) - (0 - 4 \\cdot 1) = 4 - 4e + 4 = 8 - 4e$$

Valor numèric aproximat:
$I = 8 - 4(2.7182818) \\approx \\mathbf{-2.873127}$

---

### (b) Fórmula dels Trapezis ($n=4$)

Dividim l'interval $[0, 4]$ en $n=4$ subintervals, per tant $h = \\frac{4-0}{4} = 1$.
Els punts són $x_i = \{0, 1, 2, 3, 4\}$.

| $i$ | $x_i$ | $f(x_i) = 1 - e^{x_i/4}$ |
|---|---|---|
| 0 | 0 | $1 - e^0 = 0$ |
| 1 | 1 | $1 - e^{1/4}$ |
| 2 | 2 | $1 - e^{1/2}$ |
| 3 | 3 | $1 - e^{3/4}$ |
| 4 | 4 | $1 - e^1$ |

Substituïm els valors exactes en la fórmula:

$$T = \\frac{h}{2} \\left[ f(0) + 2(f(1) + f(2) + f(3)) + f(4) \\right]$$

$$T = \\frac{1}{2} \\left[ 0 + 2( (1-e^{1/4}) + (1-e^{1/2}) + (1-e^{3/4}) ) + (1-e) \\right] \\approx \\mathbf{-2.908887}$$

---

### (c) Fórmula de Simpson ($n=4$)

Substituïm els valors exactes en la fórmula de Simpson:

$$S = \\frac{h}{3} \\left[ f(0) + 4f(1) + 2f(2) + 4f(3) + f(4) \\right]$$

$$S = \\frac{1}{3} \\left[ 0 + 4(1-e^{1/4}) + 2(1-e^{1/2}) + 4(1-e^{3/4}) + (1-e) \\right]$$

$$S = \\frac{1}{3} \\left[ 4 - 4e^{1/4} + 2 - 2e^{1/2} + 4 - 4e^{3/4} + 1 - e \\right]$$

$$S = \\frac{1}{3} \\left[ 11 - e - 4e^{1/4} - 2e^{1/2} - 4e^{3/4} \\right] \\approx \\mathbf{-2.873275}$$

---

### (d) Error absolut i comentari

- **Error Trapezis**: $E_T = |I - T| \\approx |-2.873127 - (-2.908887)| = \\mathbf{0.035760}$
- **Error Simpson**: $E_S = |I - S| \\approx |-2.873127 - (-2.873275)| = \\mathbf{0.000148}$

S'observa que el mètode de Simpson és molt més precís que el dels trapezis per al mateix nombre de divisions. 

---

### (e) Cotes superiors de l'error

Derivem la funció $f(x) = 1 - e^{x/4}$:

$f'(x) = -\\frac{1}{4} e^{x/4}$

$f''(x) = -\\frac{1}{16} e^{x/4} \\implies |f''(x)| \\leq \\frac{e}{16} \\approx 0.1699$ en $[0, 4]$ (el màxim es dóna a $x=4$ perquè l'exponencial creix).

$f'''(x) = -\\frac{1}{64} e^{x/4}$

$f^{(4)}(x) = -\\frac{1}{256} e^{x/4} \\implies |f^{(4)}(x)| \\leq \\frac{e}{256} \\approx 0.0106$ en $[0, 4]$ (el màxim es dóna a $x=4$ perquè l'exponencial creix).

**Cota Trapezis**:
$|E_T| \\leq \\frac{(b-a)h^2}{12} \\max |f''(x)| = \\frac{4 \\cdot 1^2}{12} \\cdot 0.1699 = \\frac{1}{3} \\cdot 0.1699 \\approx \\mathbf{0.0566}$

**Cota Simpson**:
$|E_S| \\leq \\frac{(b-a)h^4}{180} \\max |f^{(4)}(x)| = \\frac{4 \\cdot 1^4}{180} \\cdot 0.0106 = \\frac{1}{45} \\cdot 0.0106 \\approx \\mathbf{0.000236}$
`,
  availableLanguages: ['ca']
};
