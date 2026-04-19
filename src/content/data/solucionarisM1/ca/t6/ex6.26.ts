import type { Solution } from '../../../solutions';

export const ex6_26: Solution = {
  id: 'M1-T6-Ex6.26',
  title: 'Exercici 6.26: Base i Equació Implícita d’un Subespai',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Considereu el subespai $F = \\left\\langle \\begin{pmatrix} 0 \\\\ 1 \\\\ 1 \\end{pmatrix}, \\begin{pmatrix} 4 \\\\ 1 \\\\ -1 \\end{pmatrix}, \\begin{pmatrix} 2 \\\\ 1 \\\\ 0 \\end{pmatrix} \\right\\rangle$ a $\\mathbb{R}^3$. Trobeu una base de $F$ i la condició (en forma de sistema d'equacions lineals homogènies) que ha de satisfer un vector $\\begin{pmatrix} x \\\\ y \\\\ z \\end{pmatrix}$ per pertànyer a $F$.`,
  content: `
### 1) Càlcul de la Base de $F$

Tenim tres vectors generadors: $v_1 = (0, 1, 1)$, $v_2 = (4, 1, -1)$ i $v_3 = (2, 1, 0)$. Comprovem si són linealment independents observant si un es pot escriure com a combinació dels altres:
$$\\frac{1}{2} v_1 + \\frac{1}{2} v_2 = \\begin{pmatrix} 0 \\\\ 0.5 \\\\ 0.5 \\end{pmatrix} + \\begin{pmatrix} 2 \\\\ 0.5 \\\\ -0.5 \\end{pmatrix} = \\begin{pmatrix} 2 \\\\ 1 \\\\ 0 \\end{pmatrix} = v_3$$

Com que $v_3$ és combinació lineal de $v_1$ i $v_2$, el podem descartar. Els vectors $v_1$ i $v_2$ són linealment independents (no són proporcionals), per tant una base de $F$ és:
$$\\mathbf{\\mathcal{B}_F = \\left\\{ \\begin{pmatrix} 0 \\\\ 1 \\\\ 1 \\end{pmatrix}, \\begin{pmatrix} 4 \\\\ 1 \\\\ -1 \\end{pmatrix} \\right\\}}$$
Això implica que $\\dim(F) = 2$ (és un pla a $\\mathbb{R}^3$).

---

### 2) Equació Implícita del Subespai

Un vector $(x, y, z)$ pertany al subespai $F$ si es pot escriure com a combinació lineal dels vectors de la base. Això equival a dir que el determinant de la matriu formada pels vectors de la base i el vector genèric ha de ser zero:

$$\\begin{vmatrix} 0 & 4 & x \\\\ 1 & 1 & y \\\\ 1 & -1 & z \\end{vmatrix} = 0$$

Desenvolupant el determinant (per exemple, per la primera fila):
$$0 \\cdot \\begin{vmatrix} 1 & y \\\\ -1 & z \\end{vmatrix} - 4 \\cdot \\begin{vmatrix} 1 & y \\\\ 1 & z \\end{vmatrix} + x \\cdot \\begin{vmatrix} 1 & 1 \\\\ 1 & -1 \\end{vmatrix} = 0$$
$$-4(z - y) + x(-1 - 1) = 0$$
$$-4z + 4y - 2x = 0$$

Dividint tota l'equació per $-2$ per simplificar:
$$\\mathbf{x - 2y + 2z = 0}$$

Aquesta és l'equació implícita (o condició de pertinença) que defineix el subespai $F$. Qualsevol vector que satisfaci aquesta igualtat pertany a $F$.
`,
  availableLanguages: ['ca']
};
