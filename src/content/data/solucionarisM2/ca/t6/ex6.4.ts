import type { Solution } from '../../../solutions';

export const ex6_4: Solution = {
  id: 'M2-T6-Ex4',
  title: 'Exercici 4: Paritat i concavitat d\'una funció integral',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Sigui $F(x) = \\int_{-x}^{x} t^2 e^{t^2} \\, dt$. Proveu que $F'$ és una funció parella i estudieu la concavitat de $F$.`,
  content: `
### 1) Derivada de $F(x)$ i prova de paritat

Primer calculem la derivada $F'(x)$ utilitzant el Teorema Fonamental del Càlcul:
$F(x) = \\int_{-x}^{x} t^2 e^{t^2} \\, dt$

L'integrant és $f(t) = t^2 e^{t^2}$. La derivada és:
$F'(x) = f(x) \\cdot (x)' - f(-x) \\cdot (-x)'$
$F'(x) = x^2 e^{x^2} \\cdot 1 - (-x)^2 e^{(-x)^2} \\cdot (-1)$
$F'(x) = x^2 e^{x^2} + x^2 e^{x^2}$
$F'(x) = 2x^2 e^{x^2}$

Per veure si $F'(x)$ és una **funció parella**, hem de comprovar si $F'(-x) = F'(x)$:
$F'(-x) = 2(-x)^2 e^{(-x)^2} = 2x^2 e^{x^2} = F'(x)$

Per tant, **$F'$ és una funció parella**.

---

### 2) Estudi de la concavitat de $F(x)$

La concavitat es determina mitjançant el signe de la segona derivada $F''(x)$:
$F''(x) = \\frac{d}{dx} (2x^2 e^{x^2})$

Apliquem la regla del producte:
$F''(x) = (4x) \\cdot e^{x^2} + (2x^2) \\cdot (e^{x^2} \\cdot 2x)$
$F''(x) = 4x e^{x^2} + 4x^3 e^{x^2}$
$F''(x) = 4x e^{x^2} (1 + x^2)$

Analitzem el signe de $F''(x)$:
- Sabem que $e^{x^2} > 0$ per a tot $x$.
- Sabem que $1 + x^2 > 0$ per a tot $x$.
- Per tant, el signe de $F''(x)$ és el mateix que el signe de $4x$:

1. **Interval $(-\\infty, 0)$**: $x < 0 \\implies F''(x) < 0$. La funció és **còncava** (cap avall).
2. **Interval $(0, +\\infty)$**: $x > 0 \\implies F''(x) > 0$. La funció és **convexa** (cap amunt).
3. **Punt $x = 0$**: Com que $F''(0) = 0$ i hi ha un canvi de signe en la curvatura, $x = 0$ és un **punt d'inflexió**.
`,
  availableLanguages: ['ca']
};
