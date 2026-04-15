import type { Solution } from '../../../solutions';

export const ex6_9: Solution = {
  id: 'M2-T6-Ex9',
  title: 'Exercici 9: Àrea entre una paràbola i una recta',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Trobeu l'àrea determinada per la paràbola $y = x^2 + 7$ i la recta $y = 10$.`,
  content: `
Per trobar l'àrea entre dues corbes, primer hem de determinar els seus punts d'intersecció i quina funció queda per sobre de l'altra.

### 1) Punts d'intersecció

Igualem les dues funcions per trobar els límits d'integració:
$x^2 + 7 = 10$
$x^2 = 3 \\implies x = \\pm \\sqrt{3}$

Els punts d'intersecció són $x = -\\sqrt{3}$ i $x = \\sqrt{3}$.

---

### 2) Càlcul de l'àrea

En l'interval $[-\\sqrt{3}, \\sqrt{3}]$, la recta $y = 10$ està per sobre de la paràbola $y = x^2 + 7$ (per exemple, en $x = 0$, $10 > 7$).

L'àrea $A$ ve donada per la integral de la diferència:
$A = \\int_{-\\sqrt{3}}^{\\sqrt{3}} (10 - (x^2 + 7)) \\, dx = \\int_{-\\sqrt{3}}^{\\sqrt{3}} (3 - x^2) \\, dx$

Aprofitant la simetria de la funció (és una funció parella), podem integrar de $0$ a $\\sqrt{3}$ i multiplicar per 2:
$A = 2 \\int_{0}^{\\sqrt{3}} (3 - x^2) \\, dx$

Calculem la integral:
$A = 2 \\left[ 3x - \\frac{x^3}{3} \\right]_0^{\\sqrt{3}}$
$A = 2 \\left( 3\\sqrt{3} - \\frac{(\\sqrt{3})^3}{3} \\right) = 2 \\left( 3\\sqrt{3} - \\frac{3\\sqrt{3}}{3} \\right)$
$A = 2 ( 3\\sqrt{3} - \\sqrt{3} ) = 2 ( 2\\sqrt{3} )$

L'àrea final és:
$\\mathbf{A = 4\\sqrt{3}}$ unitats d'àrea.
`,
  availableLanguages: ['ca']
};
