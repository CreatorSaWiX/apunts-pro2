import type { Solution } from '../../../solutions';

export const ex6_7: Solution = {
  id: 'M2-T6-Ex7',
  title: 'Exercici 7: Integrals immediates',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Calculeu les integrals immediates següents:

a) $\\int \\left(\\frac{1-x}{x}\\right)^2 \\, dx$;

b) $\\int \\frac{x^3}{x^4+1} \\, dx$;

c) $\\int \\sqrt{\\frac{\\arcsin x}{1-x^2}} \\, dx$;

d) $\\int x\\sqrt{x} \\, dx$;

e) $\\int \\frac{1}{x \\ln x} \\, dx$;

f) $\\int x 5^{2x^2} \\, dx$;

g) $\\int \\frac{1}{1+16x^2} \\, dx$;

h) $\\int \\tan^2 x \\, dx$.`,
  content: `
Resolem les integrals utilitzant mètodes de descomposició, canvi de variable immediat o fórmules de derivació elementals.

---

### a) $\\int \\left(\\frac{1-x}{x}\\right)^2 \\, dx$
Primer desenvolupem el quadrat del numerador:
$\\int \\frac{1-2x+x^2}{x^2} \\, dx = \\int \\left( \\frac{1}{x^2} - \\frac{2x}{x^2} + \\frac{x^2}{x^2} \\right) \\, dx = \\int (x^{-2} - 2x^{-1} + 1) \\, dx$

Integrem terme a terme:
$-x^{-1} - 2 \\ln|x| + x + C = \\mathbf{-\\frac{1}{x} - 2 \\ln|x| + x + C}$

---

### b) $\\int \\frac{x^3}{x^4+1} \\, dx$
Observem que la derivada del denominador és $4x^3$. Ajustem la constant:
$\\frac{1}{4} \\int \\frac{4x^3}{x^4+1} \\, dx = \\mathbf{\\frac{1}{4} \\ln(x^4+1) + C}$

---

### c) $\\int \\sqrt{\\frac{\\arcsin x}{1-x^2}} \\, dx$
Podem escriure-ho com:
$\\int (\\arcsin x)^{1/2} \\cdot \\frac{1}{\\sqrt{1-x^2}} \\, dx$
Identifiquem la forma $\\int f(x)^n \\cdot f'(x) \\, dx = \\frac{f(x)^{n+1}}{n+1}$:
$\\frac{(\\arcsin x)^{3/2}}{3/2} + C = \\mathbf{\\frac{2}{3} (\\arcsin x)^{3/2} + C}$

---

### d) $\\int x\\sqrt{x} \\, dx$
Expressem-ho com a potència:
$\\int x^1 \\cdot x^{1/2} \\, dx = \\int x^{3/2} \\, dx = \\frac{x^{5/2}}{5/2} + C = \\mathbf{\\frac{2}{5} x^{5/2} + C}$

---

### e) $\\int \\frac{1}{x \\ln x} \\, dx$
Escrivim la fracció com un quocient de funcions:
$\\int \\frac{1/x}{\\ln x} \\, dx$
La derivada de $\\ln x$ és $1/x$. Per tant:
$\\mathbf{\\ln|\\ln x| + C}$

---

### f) $\\int x 5^{2x^2} \\, dx$
La derivada de l'exponent $2x^2$ és $4x$. Ajustem les constants:
$\\frac{1}{4} \\int (4x) 5^{2x^2} \\, dx$
Recordant que $\\int a^{f(x)} f'(x) \\, dx = \\frac{a^{f(x)}}{\\ln a}$:
$\\frac{1}{4} \\frac{5^{2x^2}}{\\ln 5} + C = \\mathbf{\\frac{5^{2x^2}}{4 \\ln 5} + C}$

---

### g) $\\int \\frac{1}{1+16x^2} \\, dx$
Escrivim el denominador per identificar una arc tangent:
$\\int \\frac{1}{1+(4x)^2} \\, dx$
La derivada de la funció interior $4x$ és 4:
$\\frac{1}{4} \\int \\frac{4}{1+(4x)^2} \\, dx = \\mathbf{\\frac{1}{4} \\arctan(4x) + C}$

---

### h) $\\int \\tan^2 x \\, dx$
Utilitzem la identitat trigonomètrica $1 + \\tan^2 x = \\sec^2 x \\implies \\tan^2 x = \\sec^2 x - 1$:
$\\int (\\sec^2 x - 1) \\, dx = \\mathbf{\\tan x - x + C}$
`,
  availableLanguages: ['ca']
};
