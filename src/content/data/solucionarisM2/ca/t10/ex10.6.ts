import type { Solution } from '../../../solutions';

export const ex10_6: Solution = {
  id: 'M2-T10-Ex6',
  title: "Exercici 6: Distància mínima a l'el·lipse",
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Trobeu la distància mínima des de l'origen de coordenades a l'el·lipse definida per:
  $$\\mathcal{E} = \\{(x,y) \\in \\mathbb{R}^2 : 5x^2 + 5y^2 - 6xy = 4\\}$$`,
  content: `Per trobar la distància mínima, optimitzarem el quadrat de la distància $f(x,y) = x^2 + y^2$ subjecte a la restricció de l'el·lipse.

### 1. Definició del problema
- Funció objectiu: $f(x,y) = x^2 + y^2$
- Restricció: $g(x,y) = 5x^2 + 5y^2 - 6xy - 4 = 0$

### 2. Mètode dels Multiplicadors de Lagrange
Calculem els gradients:
- $\\nabla f = (2x, 2y)$
- $\\nabla g = (10x - 6y, 10y - 6x)$

El sistema $\\nabla f = \\lambda \\nabla g$ ens dóna:
1. $2x = \\lambda (10x - 6y) \\implies x = \\lambda (5x - 3y)$
2. $2y = \\lambda (10y - 6x) \\implies y = \\lambda (5y - 3x)$

Multiplicant la primera per $y$ i la segona per $x$:
$xy = \\lambda(5xy - 3y^2)$
$yx = \\lambda(5yx - 3x^2)$
Igualant les expressions: $5xy - 3y^2 = 5xy - 3x^2 \\implies x^2 = y^2$.
D'on obtenim dues possibilitats: $y = x$ o $y = -x$.

### 3. Anàlisi dels casos
- **Cas $y = x$**:
  Substituïm a la restricció: $5x^2 + 5x^2 - 6x^2 = 4 \\implies 4x^2 = 4 \\implies x = \\pm 1$.
  Els punts són $(1,1)$ i $(-1,-1)$.
  Distància: $d = \\sqrt{1^2 + 1^2} = \\sqrt{2} \\approx 1.414$.

- **Cas $y = -x$**:
  Substituïm a la restricció: $5x^2 + 5x^2 + 6x^2 = 4 \\implies 16x^2 = 4 \\implies x^2 = 1/4 \\implies x = \\pm 1/2$.
  Els punts són $(1/2, -1/2)$ i $(-1/2, 1/2)$.
  Distància: $d = \\sqrt{(1/2)^2 + (-1/2)^2} = \\sqrt{1/2} = \\frac{1}{\\sqrt{2}} \\approx 0.707$.

### 4. Conclusió
La distància mínima des de l'origen a l'el·lipse és **$1/\\sqrt{2}$** (o $\\sqrt{2}/2$).`,
  availableLanguages: ['ca']
};
