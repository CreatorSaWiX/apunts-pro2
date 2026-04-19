import type { Solution } from '../../../solutions';

export const ex6_23: Solution = {
  id: 'M1-T6-Ex6.23',
  title: 'Exercici 6.23: Canvi de Base i Coordenades en R4',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Considereu el conjunt de vectors $\\mathcal{B} = \\{ v_1, v_2, v_3, v_4 \\}$ a $\\mathbb{R}^4$:
$$v_1 = \\begin{pmatrix} 1 \\\\ 1 \\\\ 0 \\\\ 0 \\end{pmatrix}, \\quad v_2 = \\begin{pmatrix} 0 \\\\ 0 \\\\ 1 \\\\ 1 \\end{pmatrix}, \\quad v_3 = \\begin{pmatrix} 1 \\\\ 0 \\\\ 0 \\\\ 4 \\end{pmatrix}, \\quad v_4 = \\begin{pmatrix} 0 \\\\ 0 \\\\ 0 \\\\ 2 \\end{pmatrix}$$

1) Demostreu que formen una base de $\\mathbb{R}^4$.
2) Trobeu les coordenades del vector $w = \\begin{pmatrix} 1 \\\\ 0 \\\\ 2 \\\\ -3 \\end{pmatrix}$ en aquesta base.
3) Trobeu les coordenades d'un vector arbitrari $u = \\begin{pmatrix} x \\\\ y \\\\ z \\\\ t \\end{pmatrix}$ en aquesta base.`,
  content: `
### 1) Demostració de la Base

En un espai de dimensió $n$, un conjunt de $n$ vectors formen una base si i només si són linealment independents. Com que $\\dim(\\mathbb{R}^4) = 4$, només cal comprovar que el determinant de la matriu formada per aquests vectors és diferent de zero:

$$\\Delta = \\begin{vmatrix} 1 & 0 & 1 & 0 \\\\ 1 & 0 & 0 & 0 \\\\ 0 & 1 & 0 & 0 \\\\ 0 & 1 & 4 & 2 \\end{vmatrix}$$

Desenvolupant per la segona fila (que només té un element no nul):
$$\\Delta = -1 \\cdot \\begin{vmatrix} 0 & 1 & 0 \\\\ 1 & 0 & 0 \\\\ 1 & 4 & 2 \\end{vmatrix} = (-1) \\cdot (-1) \\cdot \\begin{vmatrix} 1 & 0 \\\\ 4 & 2 \\end{vmatrix} = 1 \\cdot (2 - 0) = 2$$

Com que $\\Delta = 2 \\neq 0$, els vectors són linealment independents i formen una **base de $\\mathbb{R}^4$**.

---

### 2) Coordenades del vector $w$

Busquem els escalars $c_1, c_2, c_3, c_4$ tals que $c_1 v_1 + c_2 v_2 + c_3 v_3 + c_4 v_4 = w$:
$$\\begin{cases} c_1 + c_3 = 1 \\\\ c_1 = 0 \\\\ c_2 = 2 \\\\ c_2 + 4c_3 + 2c_4 = -3 \\end{cases}$$

Resolem el sistema:
1.  De la 2a eq: **$c_1 = 0$**.
2.  Substituim en la 1a: $0 + c_3 = 1 \\implies \\mathbf{c_3 = 1}$.
3.  De la 3a eq: **$c_2 = 2$**.
4.  Substituim en la 4a: $2 + 4(1) + 2c_4 = -3 \\implies 6 + 2c_4 = -3 \\implies 2c_4 = -9 \\implies \\mathbf{c_4 = -4.5}$.

Les coordenades de $w$ en la base $\\mathcal{B}$ són: **$(0, 2, 1, -4.5)_{\\mathcal{B}}$**.

---

### 3) Coordenades d'un vector arbitrari $(x, y, z, t)$

Busquem el canvi de base genèric:
$$\\begin{cases} c_1 + c_3 = x \\\\ c_1 = y \\\\ c_2 = z \\\\ c_2 + 4c_3 + 2c_4 = t \\end{cases}$$

Aillant cada coeficient:
*   **$c_1 = y$**
*   **$c_2 = z$**
*   $c_3 = x - c_1 \\implies \\mathbf{c_3 = x - y}$
*   $2c_4 = t - c_2 - 4c_3 = t - z - 4(x - y) = t - z - 4x + 4y \\implies \\mathbf{c_4 = -2x + 2y - 0.5z + 0.5t}$

Per tant, les coordenades del vector $(x,y,z,t)$ són:
$$\\mathbf{(y, z, x-y, -2x + 2y - 0.5z + 0.5t)_\\mathcal{B}}$$
`,
  availableLanguages: ['ca']
};
