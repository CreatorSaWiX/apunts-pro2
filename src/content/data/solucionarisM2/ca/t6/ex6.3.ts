import type { Solution } from '../../../solutions';

export const ex6_3: Solution = {
  id: 'M2-T6-Ex3',
  title: 'Exercici 3: Monotonia d\'una funció integral',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Sigui $f : (0, +\\infty) \\setminus \{1\} \\to \\mathbb{R}$ definida per $f(x) = \\int_x^{x^2} \\frac{dt}{\\ln t}$. Proveu que $f$ és estrictament creixent a $(0, 1)$ i a $(1, +\\infty)$.`,
  content: `
Per provar que una funció és estrictament creixent en un interval, hem de demostrar que la seva derivada és estrictament positiva ($f'(x) > 0$) en aquest interval.

### 1) Càlcul de la derivada

Utilitzem el Teorema Fonamental del Càlcul. Com que els dos límits d'integració depenen de $x$, la derivada s'avalua en ambdós extrems:
$$f'(x) = \\frac{1}{\\ln(x^2)} \\cdot (x^2)' - \\frac{1}{\\ln x} \\cdot (x)'$$

Substituïm les derivades $(x^2)' = 2x$ i $(x)' = 1$:
$$f'(x) = \\frac{2x}{\\ln(x^2)} - \\frac{1}{\\ln x}$$

Ara apliquem la propietat dels logaritmes $\\ln(a^b) = b \\ln a$ al primer terme:
$$f'(x) = \\frac{2x}{2 \\ln x} - \\frac{1}{\\ln x}$$

Simplifiquem el factor $2$ i agrupem els termes (tenen el mateix denominador):
$$f'(x) = \\frac{x}{\\ln x} - \\frac{1}{\\ln x} = \\mathbf{\\frac{x-1}{\\ln x}}$$

---

### 2) Estudi del signe

Per saber si la funció és creixent, mirem on $f'(x) > 0$. Recordem el comportament de $\\ln x$ (és negatiu entre $0$ i $1$, i positiu a partir d'1):

| | $x \\in (0, 1)$ | $x \\in (1, +\\infty)$ |
| :--- | :---: | :---: |
| **Numerador** ($x-1$) | $-$ | $+$ |
| **Denominador** ($\\ln x$) | $-$ | $+$ |
| **Signe de $f'(x)$** | $\\mathbf{+}$ | $\\mathbf{+}$ |

**Conclusió**: Com que $f'(x) > 0$ en ambdós intervals, la funció **$f(x)$ és estrictament creixent** a $(0, 1)$ i a $(1, +\\infty)$.

`,
  availableLanguages: ['ca']
};
