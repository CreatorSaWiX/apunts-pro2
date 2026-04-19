import type { Solution } from '../../../solutions';

export const ex6_20: Solution = {
  id: 'M1-T6-Ex6.20',
  title: 'Exercici 6.20: Dependència Lineal de Polinomis',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Demostreu que els polinomis $p_1(x) = -1 + 2x + x^2$, $p_2(x) = 1 + x^2$ i $p_3(x) = x + x^2$ són linealment dependents a l'espai $P(\\mathbb{R})$.`,
  content: `
Per demostrar que tres polinomis són linealment dependents, podem treballar amb els seus coeficients respecte a la base canònica de $P_2(\\mathbb{R})$, que és $\\{1, x, x^2\\}$. 

### Representació vectorial

Escrivim els coeficients de cada polinomi com a vectors de $\\mathbb{R}^3$:
*   $p_1(x) = -1 + 2x + x^2 \\implies v_1 = (-1, 2, 1)$
*   $p_2(x) = 1 + 0x + x^2 \\implies v_2 = (1, 0, 1)$
*   $p_3(x) = 0 + 1x + x^2 \\implies v_3 = (0, 1, 1)$

### Càlcul del Determinant

El conjunt serà linealment dependent si el determinant de la matriu formada per aquests vectors és zero:
$$\\Delta = \\begin{vmatrix} -1 & 1 & 0 \\\\ 2 & 0 & 1 \\\\ 1 & 1 & 1 \\end{vmatrix}$$

Desenvolupant per la primera fila:
$$\\Delta = -1(0 - 1) - 1(2 - 1) + 0 = -1(-1) - 1(1) = 1 - 1 = 0$$

Com que el determinant és **zero**, els vectors (i per tant els polinomis) són **Linealment Dependents (LD)**.

### Relació de dependència

Podem trobar la combinació lineal que dóna el polinomi nul buscant els coeficients $x, y, z$ tals que $x p_1 + y p_2 + z p_3 = 0$:
$$x(-1 + 2x + x^2) + y(1 + x^2) + z(x + x^2) = 0$$
Observem que:
$$1 \\cdot p_1(x) + 1 \\cdot p_2(x) = (-1+1) + (2x) + (1+1)x^2 = 2x + 2x^2 = 2(x + x^2) = 2 p_3(x)$$
Per tant, la relació és:
$$\\mathbf{p_1(x) + p_2(x) - 2 p_3(x) = 0}$$
`,
  availableLanguages: ['ca']
};
