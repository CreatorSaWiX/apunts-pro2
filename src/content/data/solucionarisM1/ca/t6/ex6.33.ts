import type { Solution } from '../../../solutions';

export const ex6_33: Solution = {
  id: 'M1-T6-Ex6.33',
  title: 'Exercici 6.33: Intersecció i Bases de Subespais',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Doneu una base i la dimensió dels espais $E, F$ i $E \\cap F$ en els casos següents:

1) $E = \\{ (x, y, z) \\in \\mathbb{R}^3 : 2x = 2y = z \\}$ i $F = \\{ (x, y, z) \\in \\mathbb{R}^3 : x + y = z, \\, 3x + y + z = 0 \\}$.
2) $E = \\langle (1, 1, -1), (2, 0, -1), (0, 2, -1) \\rangle$ i $F = \\langle (1, 0, -1), (2, 3, 0), (4, 3, -2) \\rangle$ a $\\mathbb{R}^3$.
3) $E = \\{ (a, a+3b, 2a-b, c) : a,b,c \\in \\mathbb{R} \\}$ i $F = \\{ (-2a, b, 0, 3b) : a,b \\in \\mathbb{R} \\}$ a $\\mathbb{R}^4$.
4) $E = \\{ \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} \\in \\mathcal{M}_2(\\mathbb{R}) : a=b=c \\}$ i $F = \\left\\langle \\begin{pmatrix} 1 & 1 \\\\ 2 & 1 \\end{pmatrix}, \\begin{pmatrix} 2 & 0 \\\\ -1 & 1 \\end{pmatrix} \\right\\rangle$.`,
  content: `
### Cas 1: Rectes a $\\mathbb{R}^3$

*   **Subespai $E$**: $2x=z$ i $2y=z \\implies x=y=z/2$. Vector generador: $(1, 1, 2)$.
    **$\\mathcal{B}_E = \\{(1, 1, 2)\\}, \\dim(E)=1$.**
*   **Subespai $F$**: Resolent el sistema $\\begin{cases} x+y-z=0 \\\\ 3x+y+z=0 \\end{cases} \\implies y=-2x, z=-x$.
    **$\\mathcal{B}_F = \\{(1, -2, -1)\\}, \\dim(F)=1$.**
*   **Intersecció $E \\cap F$**: Com que els generadors no són proporcionals (no és la mateixa recta), la intersecció és només el vector nul.
    **$\\dim(E \\cap F)=0, \\mathcal{B}_{E \\cap F} = \\emptyset$.**

---

### Cas 2: Plans a $\\mathbb{R}^3$

*   **Subespai $E$**: El rang dels generadors és 2. Equació: $3x - y + z = 0$.
    **$\\mathcal{B}_E = \\{(1, 1, -1), (2, 0, -1)\\}, \\dim(E)=2$.**
*   **Subespai $F$**: El rang és 2. Equació: $3x - 2y + 3z = 0$.
    **$\\mathcal{B}_F = \\{(1, 0, -1), (2, 3, 0)\\}, \\dim(F)=2$.**
*   **Intersecció $E \\cap F$**: Resolent el sistema de les dues equacions: $y=2z, x=z/3$.
    **$\\mathcal{B}_{E \\cap F} = \\{(1, 6, 3)\\}, \\dim(E \\cap F)=1$.**

---

### Cas 3: Subespais a $\\mathbb{R}^4$

*   **Subespai $E$**: $E = \\langle (1, 1, 2, 0), (0, 3, -1, 0), (0, 0, 0, 1) \\rangle$. Equació: $7x_1 - x_2 - 3x_3 = 0$.
    **$\\dim(E)=3$.**
*   **Subespai $F$**: $F = \\langle (-2, 0, 0, 0), (0, 1, 0, 3) \\rangle$.
    **$\\dim(F)=2$.**
*   **Intersecció $E \\cap F$**: Un vector de $F$ és $(-2a, b, 0, 3b)$. Substituint a l'eq. de $E$: $7(-2a) - b = 0 \\implies b = -14a$. Vector: $(-2a, -14a, 0, -42a) = -2a(1, 7, 0, 21)$.
    **$\\mathcal{B}_{E \\cap F} = \\{(1, 7, 0, 21)\\}, \\dim(E \\cap F)=1$.**

---

### Cas 4: Subespais de matrius $\\mathcal{M}_2(\\mathbb{R})$

*   **Subespai $E$**: Matrius de la forma $\\begin{pmatrix} a & a \\\\ a & d \\end{pmatrix}$.
    **$\\mathcal{B}_E = \\{ \\begin{pmatrix} 1 & 1 \\\\ 1 & 0 \\end{pmatrix}, \\begin{pmatrix} 0 & 0 \\\\ 0 & 1 \\end{pmatrix} \\}, \\dim(E)=2$.**
*   **Subespai $F$**: Generat per dues matrius independents.
    **$\\dim(F)=2$.**
*   **Intersecció $E \\cap F$**: Una matriu de $F$ és $\\begin{pmatrix} k_1+2k_2 & k_1 \\\\ 2k_1-k_2 & k_1+k_2 \\end{pmatrix}$.
    Condició $a=b \\implies k_1+2k_2 = k_1 \\implies k_2 = 0$.
    Condició $b=c \\implies k_1 = 2k_1-k_2 \\implies k_1 = 0$ (ja que $k_2=0$).
    **$\\dim(E \\cap F)=0, \\mathcal{B}_{E \\cap F} = \\emptyset$.**
`,
  availableLanguages: ['ca']
};
