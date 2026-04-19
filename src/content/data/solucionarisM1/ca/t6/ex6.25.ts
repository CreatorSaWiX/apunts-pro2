import type { Solution } from '../../../solutions';

export const ex6_25: Solution = {
  id: 'M1-T6-Ex6.25',
  title: 'Exercici 6.25: Base en l’Espai de Polinomis P3',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Sigui $P_3(\\mathbb{R})$ l'espai vectorial dels polinomis de grau com a molt 3. 

1) Demostreu que els polinomis $1 + x, -1 + x, 1 + x^2$ i $1 - x + x^3$ formen una base de $P_3(\\mathbb{R})$.
2) Doneu les coordenades del polinomi $q(x) = -5 + 6x + 3x^2 + x^3$ en aquesta base.`,
  content: `
### 1) Demostració de la Base

L'espai $P_3(\\mathbb{R})$ té dimensió 4. Per demostrar que els quatre polinomis donats formen una base, hem de veure que són linealment independents. Treballarem amb la matriu de coeficients respecte a la base canònica $\\{1, x, x^2, x^3\\}$:

*   $p_1 = 1 + x \\implies (1, 1, 0, 0)$
*   $p_2 = -1 + x \\implies (-1, 1, 0, 0)$
*   $p_3 = 1 + x^2 \\implies (1, 0, 1, 0)$
*   $p_4 = 1 - x + x^3 \\implies (1, -1, 0, 1)$

Construïm la matriu per columnes i calculem el determinant:
$$\\Delta = \\begin{vmatrix} 1 & -1 & 1 & 1 \\\\ 1 & 1 & 0 & -1 \\\\ 0 & 0 & 1 & 0 \\\\ 0 & 0 & 0 & 1 \\end{vmatrix}$$

Desenvolupant per l'última fila:
$$\\Delta = 1 \\cdot \\begin{vmatrix} 1 & -1 & 1 \\\\ 1 & 1 & 0 \\\\ 0 & 0 & 1 \\end{vmatrix}$$
Desenvolupant de nou per l'última fila d'aquest sub-determinant:
$$\\Delta = 1 \\cdot 1 \\cdot \\begin{vmatrix} 1 & -1 \\\\ 1 & 1 \\end{vmatrix} = 1 + 1 = 2$$

Com que $\\Delta = 2 \\neq 0$, els polinomis són linealment independents i formen una **base de $P_3(\\mathbb{R})$**.

---

### 2) Coordenades del polinomi $q(x)$

Busquem els escalars $c_1, c_2, c_3, c_4$ tals que:
$$c_1 (1+x) + c_2 (-1+x) + c_3 (1+x^2) + c_4 (1-x+x^3) = -5 + 6x + 3x^2 + x^3$$

Igualem els coeficients de cada potència de $x$:
*   **Terme $x^3$**: $c_4 = 1$
*   **Terme $x^2$**: $c_3 = 3$
*   **Terme $x^1$**: $c_1 + c_2 - c_4 = 6 \\implies c_1 + c_2 - 1 = 6 \\implies c_1 + c_2 = 7$
*   **Terme $x^0$**: $c_1 - c_2 + c_3 + c_4 = -5 \\implies c_1 - c_2 + 3 + 1 = -5 \\implies c_1 - c_2 = -9$

Tenim un sistema de dues equacions amb dues incògnites ($c_1, c_2$):
Sumant les dues equacions: $2c_1 = -2 \\implies \\mathbf{c_1 = -1}$.
Substituint: $-1 + c_2 = 7 \\implies \\mathbf{c_2 = 8}$.

Les coordenades del polinomi $q(x)$ en la base donada són:
$$\\mathbf{(-1, 8, 3, 1)_\\mathcal{B}}$$
`,
  availableLanguages: ['ca']
};
