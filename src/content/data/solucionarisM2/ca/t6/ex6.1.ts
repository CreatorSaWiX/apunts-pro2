import type { Solution } from '../../../solutions';

export const ex6_1: Solution = {
  id: 'M2-T6-Ex1',
  title: 'Exercici 1: Derivada de funcions integrals',
  author: 'Antigravity',
  code: '',
  type: 'notebook',
  statement: `Calculeu la derivada de les funcions següents:

a) $f(x) = \\int_{3}^{x} \\sin \\ln t \\, dt, x > 3$;

b) $g(x) = \\int_{x}^{10} \\sin \\ln t \\, dt, x > 0$;

c) $h(x) = \\int_{0}^{\\ln(x)} \\sin t^3 \\, dt, x > 0$;

d) $s(x) = \\int_{x^2+3x}^{x^4+2x+1} e^{\\sin t} \\, dt$.`,
  content: `
Per resoldre aquests exercicis utilitzarem el **Teorema Fonamental del Càlcul (TFC)** i la **Regla de la Cadena**.

Recordem que si $F(x) = \\int_{a}^{g(x)} f(t) \\, dt$, llavors per la regla de la cadena:
$F'(x) = f(g(x)) \\cdot g'(x)$

En el cas general, si $F(x) = \\int_{h(x)}^{g(x)} f(t) \\, dt$:
$F'(x) = f(g(x)) \\cdot g'(x) - f(h(x)) \\cdot h'(x)$

---

### a) $f(x) = \\int_{3}^{x} \\sin \\ln t \\, dt$

En aquest cas, tenim una aplicació directa del TFC on el límit superior és $x$ i l'inferior és una constant.

$f'(x) = \\sin(\\ln x)$

---

### b) $g(x) = \\int_{x}^{10} \\sin \\ln t \\, dt$

Primer, intercanviem els límits d'integració canviant el signe de la integral:
$g(x) = - \\int_{10}^{x} \\sin \\ln t \\, dt$

Ara derivem aplicant el TFC:
$g'(x) = - \\sin(\\ln x)$

---

### c) $h(x) = \\int_{0}^{\\ln(x)} \\sin t^3 \\, dt$

Apliquem la regla de la cadena. Sigui $u(x) = \\ln(x)$. Llavors $u'(x) = \\frac{1}{x}$.

$h'(x) = \\sin(u(x)^3) \\cdot u'(x) = \\sin((\\ln x)^3) \\cdot \\frac{1}{x}$

Finalment:
$h'(x) = \\frac{\\sin(\\ln^3 x)}{x}$

---

### d) $s(x) = \\int_{x^2+3x}^{x^4+2x+1} e^{\\sin t} \\, dt$

Apliquem la fórmula general per a límits dependents de $x$:
- Límit superior: $g(x) = x^4+2x+1 \\implies g'(x) = 4x^3+2$
- Límit inferior: $h(x) = x^2+3x \\implies h'(x) = 2x+3$
- Funció integrant: $f(t) = e^{\\sin t}$

$s'(x) = f(g(x)) \\cdot g'(x) - f(h(x)) \\cdot h'(x)$

$s'(x) = e^{\\sin(x^4+2x+1)} \\cdot (4x^3+2) - e^{\\sin(x^2+3x)} \\cdot (2x+3)$
`,
  availableLanguages: ['ca']
};
