import type { Solution } from '../../../solutions';

export const ex5_6: Solution = {
  id: 'M1-T5-Ex5.6',
  title: 'Exercici 5.6: Potències de Matrius Diagonals',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `En aquest exercici es vol trobar una fórmula per calcular les potències d'una matriu diagonal.
a) Calculeu $A^2$, $A^3$ i $A^5$, sent $A = \\begin{pmatrix} 2 & 0 & 0 \\\\ 0 & -1 & 0 \\\\ 0 & 0 & 3 \\end{pmatrix}$.
b) Quina matriu creieu que és $A^{32}$?
c) Sigui $D$ una matriu $n \\times n$ diagonal que té per elements a la diagonal $\\lambda_1, \\lambda_2, \\dots, \\lambda_n$. Conjectureu quina és la matriu $D^r$, per a $r \\in \\mathbb{Z}, r \\ge 1$, i proveu la conjectura per inducció.`,
  content: `
### a) Càlcul de les primeres potències

Quan multipliquem una matriu diagonal per si mateixa, el resultat és una matriu on cada element de la diagonal s'ha multiplicat per l'element corresponent de l'altra.

- **$A^2$**:
$$A^2 = \\begin{pmatrix} 2 & 0 & 0 \\\\ 0 & -1 & 0 \\\\ 0 & 0 & 3 \\end{pmatrix} \\begin{pmatrix} 2 & 0 & 0 \\\\ 0 & -1 & 0 \\\\ 0 & 0 & 3 \\end{pmatrix} = \\begin{pmatrix} 2^2 & 0 & 0 \\\\ 0 & (-1)^2 & 0 \\\\ 0 & 0 & 3^2 \\end{pmatrix} = \\mathbf{\\begin{pmatrix} 4 & 0 & 0 \\\\ 0 & 1 & 0 \\\\ 0 & 0 & 9 \\end{pmatrix}}$$

- **$A^3$**:
$$A^3 = A \\cdot A^2 = \\begin{pmatrix} 2 \\cdot 4 & 0 & 0 \\\\ 0 & -1 \\cdot 1 & 0 \\\\ 0 & 0 & 3 \\cdot 9 \\end{pmatrix} = \\mathbf{\\begin{pmatrix} 8 & 0 & 0 \\\\ 0 & -1 & 0 \\\\ 0 & 0 & 27 \\end{pmatrix}}$$

- **$A^5$**:
$$A^5 = \\mathbf{\\begin{pmatrix} 2^5 & 0 & 0 \\\\ 0 & (-1)^5 & 0 \\\\ 0 & 0 & 3^5 \\end{pmatrix} = \\begin{pmatrix} 32 & 0 & 0 \\\\ 0 & -1 & 0 \\\\ 0 & 0 & 243 \\end{pmatrix}}$$

### b) Conjectura per a $A^{32}$

Seguint el patró observat, per a una matriu diagonal l'exponent s'aplica directament a cada element de la diagonal:

$$A^{32} = \\begin{pmatrix} 2^{32} & 0 & 0 \\\\ 0 & (-1)^{32} & 0 \\\\ 0 & 0 & 3^{32} \\end{pmatrix} = \\mathbf{\\begin{pmatrix} 2^{32} & 0 & 0 \\\\ 0 & 1 & 0 \\\\ 0 & 0 & 3^{32} \\end{pmatrix}}$$

### c) Generalització i Prova per Inducció

**Conjectura:**
$$D^r = \\text{diag}(\\lambda_1^r, \\lambda_2^r, \\dots, \\lambda_n^r) = \\begin{pmatrix} \\lambda_1^r & 0 & \\dots & 0 \\\\ 0 & \\lambda_2^r & \\dots & 0 \\\\ \\vdots & \\vdots & \\ddots & \\vdots \\\\ 0 & 0 & \\dots & \\lambda_n^r \\end{pmatrix}$$

**Prova per inducció:**

1.  **Cas base ($r=1$):**
    $D^1 = \\text{diag}(\\lambda_1^1, \\dots, \\lambda_n^1) = D$. És cert per definició.

2.  **Hipòtesi d'Inducció (HI):** Suposem que la fórmula és vàlida per a $r = k$:
    $D^k = \\text{diag}(\\lambda_1^k, \\lambda_2^k, \\dots, \\lambda_n^k)$.

3.  **Pas Inductiu:** Volem provar que es compleix per a $r = k+1$:
    $$D^{k+1} = D \\cdot D^k$$
    Com que $D$ i $D^k$ són diagonals, el seu producte és una matriu diagonal on cada element $(i, i)$ és el producte dels elements $(i, i)$ de les matrius originals:
    $$(D \\cdot D^k)_{ii} = d_{ii} \\cdot (d^k)_{ii} = \\lambda_i \\cdot \\lambda_i^k = \\lambda_i^{k+1}$$
    Per tant, $D^{k+1} = \\text{diag}(\\lambda_1^{k+1}, \\lambda_2^{k+1}, \\dots, \\lambda_n^{k+1})$. $\\square$
`,
  availableLanguages: ['ca']
};
