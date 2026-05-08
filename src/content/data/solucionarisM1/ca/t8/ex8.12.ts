import type { Solution } from '../../../solutions';

export const ex8_12: Solution = {
  id: 'M1-T8-Ex8.12',
  title: 'Exercici 8.12: Trajectòria d\'un OVNI i potències de matrius',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Un OVNI surt d'un planeta... Després d'arribar al punt $v_0 = (0, 0, 1)$, cada dia es transporta de la situació $v$ a la $Av$, on $A = \\begin{pmatrix} 0 & 0 & -2 \\\\ 1 & 2 & 1 \\\\ 1 & 0 & 3 \\end{pmatrix}$.
1. On estarà al cap de 10 dies?
2. Arribarà algun dia a la Terra, situada al punt $(-4098, 2049, 4149)$ segons les seves coordenades?`,
  content: `
### Diagonalització de la matriu $A$
Primer calculem els valors i vectors propis de $A$:
- **Polinomi característic:** $p(\\lambda) = (2-\\lambda)(\\lambda-1)(\\lambda-2) = -(\\lambda-1)(\\lambda-2)^2$.
- **Valors propis:** $\\lambda=1$ (simple), $\\lambda=2$ (doble).
- **Subespais propis:**
  - $E_1 = \\langle (-2, 1, 1) \\rangle$
  - $E_2 = \\langle (0, 1, 0), (1, 0, -1) \\rangle$
- **Matrius de diagonalització:**
  $P = \\begin{pmatrix} -2 & 0 & 1 \\\\ 1 & 1 & 0 \\\\ 1 & 0 & -1 \\end{pmatrix}, \\quad P^{-1} = \\begin{pmatrix} -1 & 0 & -1 \\\\ 1 & 1 & 1 \\\\ -1 & 0 & -2 \\end{pmatrix}$

---

#### 1) Posició al cap de 10 dies
La posició al cap de $k$ dies és $v_k = A^k v_0$.
$v_{10} = P \\cdot D^{10} \\cdot P^{-1} \\cdot \\begin{pmatrix} 0 \\\\ 0 \\\\ 1 \\end{pmatrix}$

Multiplicant per la dreta:
$P^{-1} \\begin{pmatrix} 0 \\\\ 0 \\\\ 1 \\end{pmatrix} = \\begin{pmatrix} -1 \\\\ 1 \\\\ -2 \\end{pmatrix}$
$D^{10} \\begin{pmatrix} -1 \\\\ 1 \\\\ -2 \\end{pmatrix} = \\begin{pmatrix} 1^{10} \\cdot (-1) \\\\ 2^{10} \\cdot 1 \\\\ 2^{10} \\cdot (-2) \\end{pmatrix} = \\begin{pmatrix} -1 \\\\ 1024 \\\\ -2048 \\end{pmatrix}$

Finalment:
$v_{10} = \\begin{pmatrix} -2 & 0 & 1 \\\\ 1 & 1 & 0 \\\\ 1 & 0 & -1 \\end{pmatrix} \\begin{pmatrix} -1 \\\\ 1024 \\\\ -2048 \\end{pmatrix} = \\begin{pmatrix} 2 - 2048 \\\\ -1 + 1024 \\\\ -1 + 2048 \\end{pmatrix} = \\mathbf{\\begin{pmatrix} -2046 \\\\ 1023 \\\\ 2047 \\end{pmatrix}}$

---

#### 2) Arribada a la Terra
Busquem si existeix un $k$ tal que $v_k = \\begin{pmatrix} -4098 \\\\ 2049 \\\\ 4149 \\end{pmatrix}$.
La posició general és:
$v_k = \\begin{pmatrix} -2 & 0 & 1 \\\\ 1 & 1 & 0 \\\\ 1 & 0 & -1 \\end{pmatrix} \\begin{pmatrix} -1 \\\\ 2^k \\\\ -2^{k+1} \\end{pmatrix} = \\begin{pmatrix} 2 - 2^{k+1} \\\\ -1 + 2^k \\\\ -1 + 2^{k+1} \\end{pmatrix}$

Igualem les components:
1. $2 - 2^{k+1} = -4098 \\implies 2^{k+1} = 4100$ (No té solució entera, ja que $2^{12} = 4096$)
2. $-1 + 2^k = 2049 \\implies 2^k = 2050$ (No té solució entera)
3. $-1 + 2^{k+1} = 4149 \\implies 2^{k+1} = 4150$ (No té solució entera)

Com que no existeix cap enter $k$ que satisfaci aquestes equacions, l'OVNI **no arribarà mai** exactament a la Terra.
`,
  availableLanguages: ['ca']
};
