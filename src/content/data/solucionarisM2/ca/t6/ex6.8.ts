import type { Solution } from '../../../solutions';

export const ex6_8: Solution = {
  id: 'M2-T6-Ex8',
  title: 'Exercici 8: Integració per parts',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Calculeu les integrals següents integrant per parts:

a) $\\int e^{2x} \\sin x \\, dx$;

b) $\\int \\frac{\\ln x}{\\sqrt{x}} \\, dx$;

c) $\\int \\arcsin x \\, dx$;

d) $\\int x \\sin 2x \\, dx$.`,
  content: `
Utilitzem la fórmula d'integració per parts: $\\int u \\, dv = uv - \\int v \\, du$.

---

### a) $\\int e^{2x} \\sin x \\, dx$ (Integral cíclica)
Triem $u = \\sin x$ i $dv = e^{2x} \\, dx$:
- $du = \\cos x \\, dx$
- $v = \\frac{1}{2} e^{2x}$

$I = \\frac{1}{2} e^{2x} \\sin x - \\frac{1}{2} \\int e^{2x} \\cos x \\, dx$

Apliquem parts de nou a la segona integral ($u = \\cos x, dv = e^{2x} \\, dx$):
- $du = -\\sin x \\, dx$
- $v = \\frac{1}{2} e^{2x}$

$I = \\frac{1}{2} e^{2x} \\sin x - \\frac{1}{2} \\left[ \\frac{1}{2} e^{2x} \\cos x - \\int \\frac{1}{2} e^{2x} (-\\sin x) \\, dx \\right]$
$I = \\frac{1}{2} e^{2x} \\sin x - \\frac{1}{4} e^{2x} \\cos x - \\frac{1}{4} \\int e^{2x} \\sin x \\, dx$

Com que la integral és la mateixa que la inicial ($I$):
$I = \\frac{1}{2} e^{2x} \\sin x - \\frac{1}{4} e^{2x} \\cos x - \\frac{1}{4} I$
$\\frac{5}{4} I = \\frac{1}{2} e^{2x} \\sin x - \\frac{1}{4} e^{2x} \\cos x$

Multiplicant per $4/5$:
$I = \\frac{2}{5} e^{2x} \\sin x - \\frac{1}{5} e^{2x} \\cos x + C = \\mathbf{\\frac{e^{2x}}{5} (2 \\sin x - \\cos x) + C}$

---

### b) $\\int \\frac{\\ln x}{\\sqrt{x}} \\, dx = \\int x^{-1/2} \\ln x \\, dx$
Triem $u = \\ln x$ i $dv = x^{-1/2} \\, dx$:
- $du = \\frac{1}{x} \\, dx$
- $v = 2x^{1/2}$

$I = 2x^{1/2} \\ln x - \\int 2x^{1/2} \\frac{1}{x} \\, dx = 2\\sqrt{x} \\ln x - 2 \\int x^{-1/2} \\, dx$
$I = 2\\sqrt{x} \\ln x - 2 \\frac{x^{1/2}}{1/2} + C = \\mathbf{2\\sqrt{x} \\ln x - 4\\sqrt{x} + C}$

---

### c) $\\int \\arcsin x \\, dx$
Triem $u = \\arcsin x$ i $dv = dx$:
- $du = \\frac{1}{\\sqrt{1-x^2}} \\, dx$
- $v = x$

$I = x \\arcsin x - \\int \\frac{x}{\\sqrt{1-x^2}} \\, dx$

Resolem la integral restant per canvi de variable inmediat ($t = 1-x^2, dt = -2x \\, dx$):
$\\int \\frac{x}{\\sqrt{1-x^2}} \\, dx = -\\frac{1}{2} \\int (1-x^2)^{-1/2} (-2x) \\, dx = -\\frac{1}{2} \\frac{(1-x^2)^{1/2}}{1/2} = -\\sqrt{1-x^2}$

Substituint:
$I = x \\arcsin x - (-\\sqrt{1-x^2}) + C = \\mathbf{x \\arcsin x + \\sqrt{1-x^2} + C}$

---

### d) $\\int x \\sin 2x \\, dx$
Triem $u = x$ i $dv = \\sin 2x \\, dx$:
- $du = dx$
- $v = -\\frac{1}{2} \\cos 2x$

$I = -\\frac{x}{2} \\cos 2x - \\int -\\frac{1}{2} \\cos 2x \\, dx$
$I = -\\frac{x}{2} \\cos 2x + \\frac{1}{2} \\int \\cos 2x \\, dx$
$I = -\\frac{x}{2} \\cos 2x + \\frac{1}{2} \\frac{\\sin 2x}{2} + C = \\mathbf{-\\frac{x}{2} \\cos 2x + \\frac{1}{4} \\sin 2x + C}$
`,
  availableLanguages: ['ca']
};
