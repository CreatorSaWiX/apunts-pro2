import type { Solution } from '../../../solutions';

export const ex6_3: Solution = {
  id: 'M2-T6-Ex3',
  title: 'Exercici 3: Monotonia d\'una funció integral',
  author: 'Antigravity',
  code: '',
  type: 'notebook',
  statement: `Sigui $f : (0, +\\infty) \\setminus \{1\} \\to \\mathbb{R}$ definida per $f(x) = \\int_x^{x^2} \\frac{dt}{\\ln t}$. Proveu que $f$ és estrictament creixent a $(0, 1)$ i a $(1, +\\infty)$.`,
  content: `
Per provar que una funció és estrictament creixent en un interval, hem de demostrar que la seva derivada és estrictament positiva ($f'(x) > 0$) en aquest interval.

### 1) Càlcul de la derivada

Utilitzem el Teorema Fonamental del Càlcul per derivar la funció integral:
$f(x) = \\int_{x}^{x^2} \\frac{1}{\\ln t} \\, dt$

L'integrant és $g(t) = \\frac{1}{\\ln t}$. Aplicant la fórmula de la derivada d'una integral amb límits variables:
$f'(x) = g(x^2) \\cdot \\frac{d}{dx}(x^2) - g(x) \\cdot \\frac{d}{dx}(x)$

$f'(x) = \\frac{1}{\\ln(x^2)} \\cdot 2x - \\frac{1}{\\ln x} \\cdot 1$

Utilitzant la propietat dels logaritmes $\\ln(x^a) = a \\ln x$:
$f'(x) = \\frac{2x}{2 \\ln x} - \\frac{1}{\\ln x} = \\frac{x}{\\ln x} - \\frac{1}{\\ln x}$

Simplificant, obtenim l'expressió de la derivada:
$\\mathbf{f'(x) = \\frac{x-1}{\\ln x}}$

---

### 2) Anàlisi del signe de $f'(x)$

Analitzem el signe de la derivada en els dos intervals donats:

#### Interval $(0, 1)$
Si $x \\in (0, 1)$:
- El numerador: $x-1 < 0$ (perquè $x$ és menor que 1).
- El denominador: $\\ln x < 0$ (perquè el logaritme de números entre 0 i 1 és negatiu).
- Per tant: $f'(x) = \\frac{\\text{negatiu}}{\\text{negatiu}} > 0$.

#### Interval $(1, +\\infty)$
Si $x \\in (1, +\\infty)$:
- El numerador: $x-1 > 0$ (perquè $x$ és major que 1).
- El denominador: $\\ln x > 0$ (perquè el logaritme de números majors que 1 és positiu).
- Per tant: $f'(x) = \\frac{\\text{positiu}}{\\text{positiu}} > 0$.

### Conclusió
Com que la derivada $f'(x)$ és estrictament positiva en ambdós intervals, la funció **$f(x)$ és estrictament creixent** a $(0, 1)$ i a $(1, +\\infty)$.
`,
  availableLanguages: ['ca']
};
