import type { Solution } from '../../../solutions';

export const ex10_9: Solution = {
  id: 'M2-T10-Ex9',
  title: 'Exercici 9: Extrems condicionats (Multiplicadors de Lagrange)',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Trobeu els punts de la circumferència $x^2 + y^2 - 2x - 2y = 16$ tals que la suma de les seves coordenades sigui màxima i mínima, respectivament.`,
  content: `### 1. Definició del problema
Volem optimitzar la funció **objectiu**:
$$f(x,y) = x + y$$
Subjecta a la **restricció** (circumferència):
$$g(x,y) = x^2 + y^2 - 2x - 2y - 16 = 0$$

### 2. Mètode dels Multiplicadors de Lagrange
Definim la funció de Lagrange $L(x, y, \\lambda) = f(x,y) - \\lambda g(x,y)$:
$$L(x, y, \\lambda) = x + y - \\lambda(x^2 + y^2 - 2x - 2y - 16)$$

Busquem els punts on el gradient de $L$ s'anul·la:
1.  $\\frac{\\partial L}{\\partial x} = 1 - \\lambda(2x - 2) = 0 \\implies 1 = 2\\lambda(x-1)$
2.  $\\frac{\\partial L}{\\partial y} = 1 - \\lambda(2y - 2) = 0 \\implies 1 = 2\\lambda(y-1)$
3.  $\\frac{\\partial L}{\\partial \\lambda} = -(x^2 + y^2 - 2x - 2y - 16) = 0$

De les equacions (1) i (2), veiem que:
$$2\\lambda(x-1) = 2\\lambda(y-1)$$
Com que $\\lambda$ no pot ser zero (perquè llavors $1=0$), podem dividir per $2\\lambda$:
$$x-1 = y-1 \\implies \\mathbf{x = y}$$

### 3. Substitució en la restricció
Substituïm $y = x$ en l'equació de la circumferència:
$$x^2 + x^2 - 2x - 2x - 16 = 0$$
$$2x^2 - 4x - 16 = 0$$
Dividim per 2:
$$x^2 - 2x - 8 = 0$$
Resolent l'equació de segon grau:
$$(x-4)(x+2) = 0 \\implies x = 4, \\, x = -2$$

Obtenim dos punts candidats:
*   Si $x = 4 \\implies y = 4 \\implies P_1(4, 4)$
*   Si $x = -2 \\implies y = -2 \\implies P_2(-2, -2)$

### 4. Conclusió
Avaluem la funció suma $f(x,y) = x + y$ en els punts trobats:
*   $f(4, 4) = 4 + 4 = \\mathbf{8}$
*   $f(-2, -2) = -2 - 2 = \\mathbf{-4}$

Per tant:
*   El **màxim** s'assoleix al punt **$(4, 4)$** amb un valor de **$8$**.
*   El **mínim** s'assoleix al punt **$(-2, -2)$** amb un valor de **$-4$**.`,
  availableLanguages: ['ca']
};
