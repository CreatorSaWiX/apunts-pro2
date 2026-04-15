import type { Solution } from '../../../solutions';

export const ex5_1: Solution = {
  id: 'M1-T5-Ex5.1',
  title: 'Exercici 5.1: Operacions amb Matrius',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Donades les matrius
$A = \\begin{pmatrix} 1 & 2 & 4 \\\\ -3 & 0 & -1 \\\\ 2 & 1 & 2 \\end{pmatrix}$,
$B = \\begin{pmatrix} 2 & 0 & 0 \\\\ 1 & -4 & 3 \\\\ -1 & 3 & 2 \\end{pmatrix}$,
$C = \\begin{pmatrix} 2 & 1 & 0 \\\\ 1 & 0 & 3 \\\\ -1 & 0 & 2 \\\\ 4 & 5 & -1 \\end{pmatrix}$,

calculeu: 1) $3A$; 2) $3A - B$; 3) $AB$; 4) $BA$; 5) $C(3A - 2B)$.`,
  content: `
### 1) Càlcul de $3A$

Multipliquem cada element de la matriu $A$ per l'escalar 3:

$3A = 3 \\begin{pmatrix} 1 & 2 & 4 \\\\ -3 & 0 & -1 \\\\ 2 & 1 & 2 \\end{pmatrix} = \\begin{pmatrix} 3(1) & 3(2) & 3(4) \\\\ 3(-3) & 3(0) & 3(-1) \\\\ 3(2) & 3(1) & 3(2) \\end{pmatrix} = \\mathbf{\\begin{pmatrix} 3 & 6 & 12 \\\\ -9 & 0 & -3 \\\\ 6 & 3 & 6 \\end{pmatrix}}$

### 2) Càlcul de $3A - B$

Restem els elements corresponents:

$3A - B = \\begin{pmatrix} 3 & 6 & 12 \\\\ -9 & 0 & -3 \\\\ 6 & 3 & 6 \\end{pmatrix} - \\begin{pmatrix} 2 & 0 & 0 \\\\ 1 & -4 & 3 \\\\ -1 & 3 & 2 \\end{pmatrix} = \\begin{pmatrix} 3-2 & 6-0 & 12-0 \\\\ -9-1 & 0-(-4) & -3-3 \\\\ 6-(-1) & 3-3 & 6-2 \\end{pmatrix} = \\mathbf{\\begin{pmatrix} 1 & 6 & 12 \\\\ -10 & 4 & -6 \\\\ 7 & 0 & 4 \\end{pmatrix}}$

### 3) Càlcul de $AB$

Fem el producte de matrius (fila per columna):

$AB = \\begin{pmatrix} 1 & 2 & 4 \\\\ -3 & 0 & -1 \\\\ 2 & 1 & 2 \\end{pmatrix} \\begin{pmatrix} 2 & 0 & 0 \\\\ 1 & -4 & 3 \\\\ -1 & 3 & 2 \\end{pmatrix} = \\begin{pmatrix} 1(2)+2(1)+4(-1) & 1(0)+2(-4)+4(3) & 1(0)+2(3)+4(2) \\\\ -3(2)+0(1)-1(-1) & -3(0)+0(-4)-1(3) & -3(0)+0(3)-1(2) \\\\ 2(2)+1(1)+2(-1) & 2(0)+1(-4)+2(3) & 2(0)+1(3)+2(2) \\end{pmatrix}$

$AB = \\begin{pmatrix} 2+2-4 & 0-8+12 & 0+6+8 \\\\ -6+0+1 & 0+0-3 & 0+0-2 \\\\ 4+1-2 & 0-4+6 & 0+3+4 \\end{pmatrix} = \\mathbf{\\begin{pmatrix} 0 & 4 & 14 \\\\ -5 & -3 & -2 \\\\ 3 & 2 & 7 \\end{pmatrix}}$

### 4) Càlcul de $BA$

$BA = \\begin{pmatrix} 2 & 0 & 0 \\\\ 1 & -4 & 3 \\\\ -1 & 3 & 2 \\end{pmatrix} \\begin{pmatrix} 1 & 2 & 4 \\\\ -3 & 0 & -1 \\\\ 2 & 1 & 2 \\end{pmatrix} = \\begin{pmatrix} 2(1)+0+0 & 2(2)+0+0 & 2(4)+0+0 \\\\ 1(1)-4(-3)+3(2) & 1(2)-4(0)+3(1) & 1(4)-4(-1)+3(2) \\\\ -1(1)+3(-3)+2(2) & -1(2)+3(0)+2(1) & -1(4)+3(-1)+2(2) \\end{pmatrix}$

$BA = \\begin{pmatrix} 2 & 4 & 8 \\\\ 1+12+6 & 2+3 & 4+4+6 \\\\ -1-9+4 & -2+2 & -4-3+4 \\end{pmatrix} = \\mathbf{\\begin{pmatrix} 2 & 4 & 8 \\\\ 19 & 5 & 14 \\\\ -6 & 0 & -3 \\end{pmatrix}}$

Observem que $AB \\neq BA$ (el producte de matrius no és commutatiu).

### 5) Càlcul de $C(3A - 2B)$

Primer calculem $3A - 2B$:

$2B = 2 \\begin{pmatrix} 2 & 0 & 0 \\\\ 1 & -4 & 3 \\\\ -1 & 3 & 2 \\end{pmatrix} = \\begin{pmatrix} 4 & 0 & 0 \\\\ 2 & -8 & 6 \\\\ -2 & 6 & 4 \\end{pmatrix}$

$3A - 2B = \\begin{pmatrix} 3 & 6 & 12 \\\\ -9 & 0 & -3 \\\\ 6 & 3 & 6 \\end{pmatrix} - \\begin{pmatrix} 4 & 0 & 0 \\\\ 2 & -8 & 6 \\\\ -2 & 6 & 4 \\end{pmatrix} = \\begin{pmatrix} -1 & 6 & 12 \\\\ -11 & 8 & -9 \\\\ 8 & -3 & 2 \\end{pmatrix}$

Ara multipliquem $C$ ($4 \\times 3$) per $(3A - 2B)$ ($3 \\times 3$):

$C(3A - 2B) = \\begin{pmatrix} 2 & 1 & 0 \\\\ 1 & 0 & 3 \\\\ -1 & 0 & 2 \\\\ 4 & 5 & -1 \\end{pmatrix} \\begin{pmatrix} -1 & 6 & 12 \\\\ -11 & 8 & -9 \\\\ 8 & -3 & 2 \\end{pmatrix}$

- Fila 1:
  - $2(-1) + 1(-11) + 0(8) = -2 - 11 = -13$
  - $2(6) + 1(8) + 0(-3) = 12 + 8 = 20$
  - $2(12) + 1(-9) + 0(2) = 24 - 9 = 15$

- Fila 2:
  - $1(-1) + 0(-11) + 3(8) = -1 + 24 = 23$
  - $1(6) + 0(8) + 3(-3) = 6 - 9 = -3$
  - $1(12) + 0(-9) + 3(2) = 12 + 6 = 18$

- Fila 3:
  - $-1(-1) + 0(-11) + 2(8) = 1 + 16 = 17$
  - $-1(6) + 0(8) + 2(-3) = -6 - 6 = -12$
  - $-1(12) + 0(-9) + 2(2) = -12 + 4 = -8$

- Fila 4:
  - $4(-1) + 5(-11) - 1(8) = -4 - 55 - 8 = -67$
  - $4(6) + 5(8) - 1(-3) = 24 + 40 + 3 = 67$
  - $4(12) + 5(-9) - 1(2) = 48 - 45 - 2 = 1$

Finalment:
$C(3A - 2B) = \\mathbf{\\begin{pmatrix} -13 & 20 & 15 \\\\ 23 & -3 & 18 \\\\ 17 & -12 & -8 \\\\ -67 & 67 & 1 \\end{pmatrix}}$
`,
  availableLanguages: ['ca']
};
