import type { Solution } from '../../../solutions';

export const ex6_2: Solution = {
  id: 'M2-T6-Ex2',
  title: 'Exercici 2: Límits amb integrals',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Calculeu els límits següents:

a) $\\lim_{x \\to 0^+} \\frac{\\int_{0}^{x^2} \\sin \\sqrt{t} \\, dt}{x^3}$;

b) $\\lim_{x \\to 0} \\frac{x \\int_{0}^{x} e^{t^2} \\, dt}{\\int_{0}^{x} e^{t^2} \\sin t \\, dt}$.`,
  content: `
Per resoldre aquests límits, utilitzarem la **Regla de L'Hôpital** i el **Teorema Fonamental del Càlcul**.

---

### a) $\\lim_{x \\to 0^+} \\frac{\\int_{0}^{x^2} \\sin \\sqrt{t} \\, dt}{x^3}$

Observem que és una indeterminació de tipus $\\frac{0}{0}$. Apliquem la regla de L'Hôpital.

Derivem el numerador $N(x) = \\int_{0}^{x^2} \\sin \\sqrt{t} \\, dt$ usant el TFC:

$N'(x) = \\sin(\\sqrt{x^2}) \\cdot (x^2)' = \\sin(|x|) \\cdot 2x = \\sin(x) \\cdot 2x = 2x \\sin x$

Derivem el denominador $D(x) = x^3$:
$D'(x) = 3x^2$

El límit esdevé:
$\\lim_{x \\to 0^+} \\frac{2x \\sin x}{3x^2} = \\frac{2}{3} \\lim_{x \\to 0^+} \\frac{\\sin x}{x}$

Com que $\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1$:
$\\frac{2}{3} \\cdot 1 = \\mathbf{\\frac{2}{3}}$

---

### b) $\\lim_{x \\to 0} \\frac{x \\int_{0}^{x} e^{t^2} \\, dt}{\\int_{0}^{x} e^{t^2} \\sin t \\, dt}$

També tenim una indeterminació de tipus $\\frac{0}{0}$. Apliquem la regla de L'Hôpital.

**Derivada del numerador** (regla del producte):
$N'(x) = 1 \\cdot \\int_{0}^{x} e^{t^2} \\, dt + x \\cdot e^{x^2}$

**Derivada del denominador**:
$D'(x) = e^{x^2} \\sin x$

El nou límit és:
$\\lim_{x \\to 0} \\frac{\\int_{0}^{x} e^{t^2} \\, dt + x e^{x^2}}{e^{x^2} \\sin x}$

Continuem tenint una indeterminació $\\frac{0}{0}$. Podem aplicar L'Hôpital de nou o bé utilitzar **infinitèsims equivalents** per simplificar:

**Comprovació per L'Hôpital (segona vegada):**
Derivem el nou numerador: $e^{x^2} + (e^{x^2} + x \\cdot 2x e^{x^2}) = 2e^{x^2} + 2x^2 e^{x^2}$
Derivem el nou denominador: $2x e^{x^2} \\sin x + e^{x^2} \\cos x$

$\\lim_{x \\to 0} \\frac{2e^{x^2} + 2x^2 e^{x^2}}{2x e^{x^2} \\sin x + e^{x^2} \\cos x} = \\frac{2(1) + 0}{0 + 1(1)} = \\mathbf{2}$

**Comprovació per infinitéssims equivalents:** A prop de $x=0$, $e^{x^2} \\approx 1$ i $\\sin x \\approx x$.

$\\lim_{x \\to 0} \\frac{\\int_{0}^{x} e^{t^2} \\, dt + x e^{x^2}}{e^{x^2} \\sin x} \\approx \\lim_{x \\to 0} \\frac{\\int_{0}^{x} 1 \\, dt + x(1)}{1 \\cdot x} = \\lim_{x \\to 0} \\frac{x + x}{x} = \\lim_{x \\to 0} \\frac{2x}{x} = \\mathbf{2}$

`,
  availableLanguages: ['ca']
};
