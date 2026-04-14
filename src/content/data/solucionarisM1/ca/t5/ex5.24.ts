import type { Solution } from '../../../solutions';

export const ex5_24: Solution = {
  id: 'M1-T5-Ex5.24',
  title: 'Exercici 5.24: Valors per Determinant Nul (Valors Propis)',
  author: 'Antigravity',
  code: '',
  type: 'notebook',
  statement: `Trobeu els valors de $\\lambda$ per als quals les matrius següents tenen determinant 0.
1) $\\begin{pmatrix} \\lambda - 1 & -2 \\\\ 1 & \\lambda - 4 \\end{pmatrix}$
2) $\\begin{pmatrix} \\lambda - 6 & 0 & 0 \\\\ 0 & \\lambda & -1 \\\\ 0 & 4 & \\lambda - 4 \\end{pmatrix}$
3) $\\begin{pmatrix} 3 - \\lambda & 1 & 1 \\\\ 2 & 4 - \\lambda & 2 \\\\ 1 & 1 & 3 - \\lambda \\end{pmatrix}$`,
  content: `
El determinant de la matriu ha de ser igual a zero. Això equival a trobar les arrels del polinomi característic (els valors propis de la matriu).

---

### 1) Matriu $2 \\times 2$
$$ \\det(A) = (\\lambda - 1)(\\lambda - 4) - (-2)(1) = 0 $$
$$ \\lambda^2 - 5\\lambda + 4 + 2 = 0 \\implies \\lambda^2 - 5\\lambda + 6 = 0 $$
Resolem l'equació de segon grau:
$$ \\lambda = \\frac{5 \\pm \\sqrt{25 - 24}}{2} = \\frac{5 \\pm 1}{2} \\implies \\mathbf{\\lambda \\in \\{2, 3\\}} $$

### 2) Matriu $3 \\times 3$
Desenvolupem per la primera fila (ja que té dos zeros):
$$ \\det(A) = (\\lambda - 6) \\begin{vmatrix} \\lambda & -1 \\\\ 4 & \\lambda - 4 \\end{vmatrix} = 0 $$
$$ (\\lambda - 6)(\\lambda(\\lambda - 4) - (-1)(4)) = 0 $$
$$ (\\lambda - 6)(\\lambda^2 - 4\\lambda + 4) = 0 $$
$$ (\\lambda - 6)(\\lambda - 2)^2 = 0 $$
Els valors són: **$\\lambda \\in \\{2, 6\\}$** (on el 2 és una arrel doble).

### 3) Matriu $3 \\times 3$ (Simètrica)
Podem simplificar restant la fila 3 a la fila 1 ($R_1 \\to R_1 - R_3$):
$$ \\begin{vmatrix} 2 - \\lambda & 0 & \\lambda - 2 \\\\ 2 & 4 - \\lambda & 2 \\\\ 1 & 1 & 3 - \\lambda \\end{vmatrix} = 0 $$
Treiem factor comú $(\\lambda - 2)$ de la primera fila:
$$ (\\lambda - 2) \\begin{vmatrix} -1 & 0 & 1 \\\\ 2 & 4 - \\lambda & 2 \\\\ 1 & 1 & 3 - \\lambda \\end{vmatrix} = 0 $$
Sumem la primera columna a la tercera ($C_3 \\to C_3 + C_1$):
$$ (\\lambda - 2) \\begin{vmatrix} -1 & 0 & 0 \\\\ 2 & 4 - \\lambda & 4 \\\\ 1 & 1 & 4 - \\lambda \\end{vmatrix} = (\\lambda - 2) (-1) ((4-\\lambda)^2 - 4) = 0 $$
$$ (2 - \\lambda) ((\\lambda - 4)^2 - 4) = 0 $$
L'equació $(\\lambda - 4)^2 = 4$ té solucions $\\lambda - 4 = 2 \\to \\lambda = 6$ i $\\lambda - 4 = -2 \\to \\lambda = 2$.
Per tant, els valors són: **$\\mathbf{\\lambda \\in \\{2, 6\\}}$**.
`,
  availableLanguages: ['ca']
};
