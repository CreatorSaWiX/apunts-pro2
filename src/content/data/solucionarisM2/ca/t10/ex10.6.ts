import type { Solution } from '../../../solutions';

export const ex10_6: Solution = {
  id: 'M2-T10-Ex6',
  title: "Exercici 6: Distància mínima a l'el·lipse",
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Trobeu la distància mínima des de l'origen de coordenades a l'el·lipse definida per:
  $$\\mathcal{E} = \\{(x,y) \\in \\mathbb{R}^2 : 5x^2 + 5y^2 - 6xy = 4\\}$$`,
  content: `Per trobar la distància mínima des de l'origen, minimitzarem el quadrat de la distància per evitar les arrels quadrades en les derivades:
**Funció objectiu**: $f(x,y) = x^2 + y^2$
**Restricció**: $g(x,y) = 5x^2 + 5y^2 - 6xy - 4 = 0$

### 1. Mètode dels Multiplicadors de Lagrange
Construïm la funció de Lagrange $L(x,y,\\lambda) = x^2 + y^2 - \\lambda(5x^2 + 5y^2 - 6xy - 4)$.
Busquem els punts on el gradient s'anul·la:
1.  $\\frac{\\partial L}{\\partial x} = 2x - \\lambda(10x - 6y) = 0 \\implies x = \\lambda (5x - 3y)$
2.  $\\frac{\\partial L}{\\partial y} = 2y - \\lambda(10y - 6x) = 0 \\implies y = \\lambda (5y - 3x)$
3.  $5x^2 + 5y^2 - 6xy = 4$

Per resoldre el sistema, multipliquem l'equació (1) per $y$ i l'equació (2) per $x$ per poder igualar els termes:
- $xy = \\lambda (5xy - 3y^2)$
- $yx = \\lambda (5yx - 3x^2)$

Igualant les dues expressions:
$$5xy - 3y^2 = 5xy - 3x^2 \\implies -3y^2 = -3x^2 \\implies \\mathbf{x^2 = y^2}$$
Això ens dona dues trajectòries candidates: **$y = x$** i **$y = -x$**.

### 2. Anàlisi dels casos
Analitzem la restricció en cada cas:

- **Cas $y = x$**:
  Substituïm a $g(x,y)=0$:
  $$5x^2 + 5x^2 - 6x^2 = 4 \\implies 4x^2 = 4 \\implies x^2 = 1 \\implies \\mathbf{x = \\pm 1}$$
  Els punts són $(1,1)$ i $(-1,-1)$.
  El quadrat de la distància és $f = 1^2 + 1^2 = 2 \\implies \\mathbf{d = \\sqrt{2}} \\approx 1.41$.

- **Cas $y = -x$**:
  Substituïm a $g(x,y)=0$:
  $$5x^2 + 5x^2 - 6(-x^2) = 4 \\implies 16x^2 = 4 \\implies x^2 = 1/4 \\implies \\mathbf{x = \\pm 1/2}$$
  Els punts són $(1/2, -1/2)$ i $(-1/2, 1/2)$.
  El quadrat de la distància és $f = (1/2)^2 + (-1/2)^2 = 1/4 + 1/4 = 1/2$.
  La distància és **$d = \\sqrt{1/2} = \\frac{1}{\\sqrt{2}} = \\frac{\\sqrt{2}}{2}$** $\\approx 0.71$.

### 3. Conclusió
Comparant els resultats, la distància mínima des de l'origen a l'el·lipse és **$1/\\sqrt{2}$**.`,
  availableLanguages: ['ca']
};
