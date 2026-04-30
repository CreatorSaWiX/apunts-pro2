import type { Solution } from '../../../solutions';

export const ex7_20: Solution = {
  id: 'M1-T7-Ex7.20',
  title: 'Exercici 7.20: Forma normal i cerca de base',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Sigui $M = \\begin{pmatrix} 0 & 2 & 1 \\\\ 0 & 0 & 3 \\\\ 0 & 0 & 0 \\end{pmatrix}$ la matriu associada a un endomorfisme $f$ de $\\mathbb{R}^3$ en la base canònica.

1) Trobeu els subespais $\\ker f$ i $\\text{Im } f$.
2) Trobeu una base $B$ de $\\mathbb{R}^3$ per a la qual la matriu associada $f$ sigui $M_B = \\begin{pmatrix} 0 & 1 & 0 \\\\ 0 & 0 & 1 \\\\ 0 & 0 & 0 \\end{pmatrix}$.`,
  content: `
### 1) Nucli i Imatge

A partir de la matriu $M$ en base canònica:
- **Imatge:** Està generada per les columnes de la matriu. Les columnes 2 i 3 són linealment independents, per tant:
  $$\\text{Im } f = \\langle (2, 0, 0), (1, 3, 0) \\rangle = \\langle (1, 0, 0), (0, 1, 0) \\rangle$$
  És a dir, el pla $z = 0$.
- **Nucli:** Com que el rang és 2, la dimensió del nucli és $3 - 2 = 1$. Observem que la primera columna és nul·la, el que indica que $f(e_1) = 0$:
  $$\\ker f = \\langle (1, 0, 0) \\rangle$$

---

### 2) Cerca de la base $B$

Volem una base $B = \\{v_1, v_2, v_3\\}$ tal que:
- $f(v_1) = 0$
- $f(v_2) = v_1$
- $f(v_3) = v_2$

Això implica que $v_1 = f(f(v_3))$ i $v_2 = f(v_3)$. Perquè $v_1$ no sigui nul, necessitem un vector $v_3$ tal que $f^2(v_3) \\neq 0$. Calculem $M^2$:
$$M^2 = \\begin{pmatrix} 0 & 2 & 1 \\\\ 0 & 0 & 3 \\\\ 0 & 0 & 0 \\end{pmatrix} \\begin{pmatrix} 0 & 2 & 1 \\\\ 0 & 0 & 3 \\\\ 0 & 0 & 0 \\end{pmatrix} = \\begin{pmatrix} 0 & 0 & 6 \\\\ 0 & 0 & 0 \\\\ 0 & 0 & 0 \\end{pmatrix}$$

Triem $v_3 = (0, 0, 1)$ (vector $e_3$), ja que $M^2 e_3 = (6, 0, 0) \\neq 0$.
Ara calculem la resta de vectors:
- $v_2 = f(v_3) = M \\begin{pmatrix} 0 \\\\ 0 \\\\ 1 \\end{pmatrix} = \\begin{pmatrix} 1 \\\\ 3 \\\\ 0 \\end{pmatrix}$
- $v_1 = f(v_2) = M \\begin{pmatrix} 1 \\\\ 3 \\\\ 0 \\end{pmatrix} = \\begin{pmatrix} 6 \\\\ 0 \\\\ 0 \\end{pmatrix}$

Comprovem que $f(v_1) = M \\begin{pmatrix} 6 \\\\ 0 \\\\ 0 \\end{pmatrix} = \\begin{pmatrix} 0 \\\\ 0 \\\\ 0 \\end{pmatrix} = 0$.

La base buscada és:
$$B = \\{ (6, 0, 0), (1, 3, 0), (0, 0, 1) \\}$$
`,
  availableLanguages: ['ca']
};
