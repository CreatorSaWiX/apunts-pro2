import type { Solution } from '../../../solutions';

export const ex7_18: Solution = {
  id: 'M1-T7-Ex7.18',
  title: 'Exercici 7.18: Matriu associada en diferents bases',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Sigui $B_E = \\{e_1, e_2, e_3\\}$ una base d'un $\\mathbb{R}$-espai vectorial $E$ i sigui $B_F = \\{v_1, v_2\\}$ una base d'un $\\mathbb{R}$-espai vectorial $F$. Considerem l'aplicació lineal $f: E \\to F$ definida per:
$$f(x e_1 + y e_2 + z e_3) = (x - 2z) v_1 + (y + z) v_2$$

Trobeu la matriu associada a $f$ en les bases:
1) $B_E = \\{e_1, e_2, e_3\\}$ i $B_F = \\{v_1, v_2\\}$.
2) $B_E = \\{e_1, e_2, e_3\\}$ i $B'_F = \\{2v_1, 2v_2\\}$.
3) $B'_E = \\{e_1 + e_2 + e_3, 2e_1 + 2e_3, 3e_3\\}$ i $B_F = \\{v_1, v_2\\}$.
4) $B'_E = \\{e_1 + e_2 + e_3, 2e_1 + 2e_3, 3e_3\\}$ i $B'_F = \\{2v_1, 2v_2\\}$.`,
  content: `
L'aplicació $f$ ens dóna directament les coordenades en $B_F$ a partir de les coordenades en $B_E$:
$$(x, y, z)_{B_E} \\xrightarrow{f} (x - 2z, y + z)_{B_F}$$

---

### 1) Bases $B_E$ i $B_F$

La matriu conté les imatges dels vectors de la base d'origen expressades en la base d'arribada:
- $f(e_1) = f(1, 0, 0) = (1, 0)_{B_F}$
- $f(e_2) = f(0, 1, 0) = (0, 1)_{B_F}$
- $f(e_3) = f(0, 0, 1) = (-2, 1)_{B_F}$

Llavors:
$$A = \\begin{pmatrix} 1 & 0 & -2 \\\\ 0 & 1 & 1 \\end{pmatrix}$$

### 2) Bases $B_E$ i $B'_F = \\{2v_1, 2v_2\\}$

Les imatges són les mateixes, però ara les hem d'expressar en $B'_F$. Com que els vectors de $B'_F$ són el doble que els de $B_F$, les coordenades seran la meitat:
- $f(e_1) = (1, 0)_{B_F} = (1/2, 0)_{B'_F}$
- $f(e_2) = (0, 1)_{B_F} = (0, 1/2)_{B'_F}$
- $f(e_3) = (-2, 1)_{B_F} = (-1, 1/2)_{B'_F}$

$$A' = \\begin{pmatrix} 1/2 & 0 & -1 \\\\ 0 & 1/2 & 1/2 \\end{pmatrix}$$

### 3) Bases $B'_E = \\{w_1, w_2, w_3\\}$ i $B_F$

Calculem les imatges dels nous vectors d'origen:
- $f(w_1) = f(e_1 + e_2 + e_3) = f(1, 1, 1) = (1-2, 1+1) = (-1, 2)_{B_F}$
- $f(w_2) = f(2e_1 + 2e_3) = f(2, 0, 2) = (2-4, 0+2) = (-2, 2)_{B_F}$
- $f(w_3) = f(3e_3) = f(0, 0, 3) = (0-6, 0+3) = (-6, 3)_{B_F}$

$$A'' = \\begin{pmatrix} -1 & -2 & -6 \\\\ 2 & 2 & 3 \\end{pmatrix}$$

### 4) Bases $B'_E$ i $B'_F$

Simplement dividim per 2 els resultats de l'apartat anterior (canvi a $B'_F$):
- $f(w_1) = (-1, 2)_{B_F} = (-1/2, 1)_{B'_F}$
- $f(w_2) = (-2, 2)_{B_F} = (-1, 1)_{B'_F}$
- $f(w_3) = (-6, 3)_{B_F} = (-3, 3/2)_{B'_F}$

$$A''' = \\begin{pmatrix} -1/2 & -1 & -3 \\\\ 1 & 1 & 3/2 \\end{pmatrix}$$
`,
  availableLanguages: ['ca']
};
