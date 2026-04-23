import type { Solution } from '../../../solutions';

export const ex6_39: Solution = {
  id: 'M1-T6-Ex6.39',
  title: 'Exercici 6.39: Relació entre Coordenades de Bases Diferents',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Considereu els conjunts $B = \\left\\{ \\begin{pmatrix} 2 \\\\ 1 \\\\ 1 \\end{pmatrix}, \\begin{pmatrix} 1 \\\\ 2 \\\\ 1 \\end{pmatrix}, \\begin{pmatrix} 1 \\\\ 1 \\\\ 2 \\end{pmatrix} \\right\\}$ i $B' = \\left\\{ \\begin{pmatrix} 0 \\\\ 1 \\\\ 1 \\end{pmatrix}, \\begin{pmatrix} 1 \\\\ 0 \\\\ 1 \\end{pmatrix}, \\begin{pmatrix} 1 \\\\ 1 \\\\ 0 \\end{pmatrix} \\right\\}$ bases de $\\mathbb{R}^3$.

Sigui $u$ un vector de $\\mathbb{R}^3$ que en la base $B$ té coordenades $u_B = (x, y, z)^T$ i en la base $B'$, $u_{B'} = (x', y', z')^T$. Expresseu $x, y, z$ en funció de $x', y', z'$, i viceversa.`,
  content: `
### 1) Comprovació de les bases

*   **Det($P_C^B$)**: $\\begin{vmatrix} 2 & 1 & 1 \\\\ 1 & 2 & 1 \\\\ 1 & 1 & 2 \\end{vmatrix} = 2(4-1) - 1(2-1) + 1(1-2) = 6 - 1 - 1 = 4 \\neq 0$.
*   **Det($P_C^{B'}$)**: $\\begin{vmatrix} 0 & 1 & 1 \\\\ 1 & 0 & 1 \\\\ 1 & 1 & 0 \\end{vmatrix} = -1(0-1) + 1(1-0) = 2 \\neq 0$.
Ambdós conjunts són bases de $\\mathbb{R}^3$.

---

### 2) Exprexió de $(x, y, z)$ en funció de $(x', y', z')$

S'obté mitjançant la matriu de canvi de base $P_B^{B'}$:
$$U_B = P_B^{B'} U_{B'} \\implies P_B^{B'} = (P_C^B)^{-1} \\cdot P_C^{B'}$$

Calculem la inversa $(P_C^B)^{-1} = \\frac{1}{4} \\begin{pmatrix} 3 & -1 & -1 \\\\ -1 & 3 & -1 \\\\ -1 & -1 & 3 \\end{pmatrix}$. Multiplicant per $P_C^{B'}$:
$$P_B^{B'} = \\frac{1}{4} \\begin{pmatrix} 3 & -1 & -1 \\\\ -1 & 3 & -1 \\\\ -1 & -1 & 3 \\end{pmatrix} \\begin{pmatrix} 0 & 1 & 1 \\\\ 1 & 0 & 1 \\\\ 1 & 1 & 0 \\end{pmatrix} = \\begin{pmatrix} -1/2 & 1/2 & 1/2 \\\\ 1/2 & -1/2 & 1/2 \\\\ 1/2 & 1/2 & -1/2 \\end{pmatrix}$$

Les equacions són:
$$\\begin{cases} x = -\\frac{1}{2}x' + \\frac{1}{2}y' + \\frac{1}{2}z' \\\\ y = \\frac{1}{2}x' - \\frac{1}{2}y' + \\frac{1}{2}z' \\\\ z = \\frac{1}{2}x' + \\frac{1}{2}y' - \\frac{1}{2}z' \\end{cases}$$

---

### 3) Expressió de $(x', y', z')$ en funció de $(x, y, z)$

S'obté mitjançant la matriu $P_{B'}^B$:
$$U_{B'} = P_{B'}^B U_B \\implies P_{B'}^B = (P_C^{B'})^{-1} \\cdot P_C^B$$

Calculem la inversa $(P_C^{B'})^{-1} = \\frac{1}{2} \\begin{pmatrix} -1 & 1 & 1 \\\\ 1 & -1 & 1 \\\\ 1 & 1 & -1 \\end{pmatrix}$. Multiplicant per $P_C^B$:
$$P_{B'}^B = \\frac{1}{2} \\begin{pmatrix} -1 & 1 & 1 \\\\ 1 & -1 & 1 \\\\ 1 & 1 & -1 \\end{pmatrix} \\begin{pmatrix} 2 & 1 & 1 \\\\ 1 & 2 & 1 \\\\ 1 & 1 & 2 \\end{pmatrix} = \\begin{pmatrix} 0 & 1 & 1 \\\\ 1 & 0 & 1 \\\\ 1 & 1 & 0 \\end{pmatrix}$$

Les equacions són:
$$\\begin{cases} x' = y + z \\\\ y' = x + z \\\\ z' = x + y \\end{cases}$$
`,
  availableLanguages: ['ca']
};
