import type { Solution } from '../../../solutions';

export const ex7_8: Solution = {
  id: 'M1-T7-Ex7.8',
  title: 'Exercici 7.8: Matriu associada, nucli i imatge',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Doneu la matriu associada a les aplicacions lineals següents en les bases canòniques i calculeu la dimensió del nucli i de la imatge:

1) $f: \\mathbb{R} \\to \\mathbb{R}$, on $f(x) = 3x$;

2) $f: \\mathbb{R}^2 \\to \\mathbb{R}^3$, on $f \\begin{pmatrix} x \\\\ y \\end{pmatrix} = \\begin{pmatrix} x \\\\ y \\\\ x - y \\end{pmatrix}$;

3) $f: \\mathbb{R}^3 \\to \\mathbb{R}^3$, on $f \\begin{pmatrix} x \\\\ y \\\\ z \\end{pmatrix} = \\begin{pmatrix} x + y + z \\\\ y + z \\\\ z \\end{pmatrix}$;

4) $f: \\mathcal{M}_2(\\mathbb{R}) \\to \\mathbb{R}^3$, on $f \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} = \\begin{pmatrix} b + c \\\\ c + d \\\\ 2a - b + c - d \\end{pmatrix}$;

5) $f: P_2(\\mathbb{R}) \\to P_3(\\mathbb{R})$, on $f(a_0 + a_1 x + a_2 x^2) = (2a_1 - a_0) + (2a_1 - a_2)x + (3a_2 - 2a_1 + a_0)x^2 + (a_0 + a_1 + a_2)x^3$.`,
  content: `
Per trobar la matriu associada a una aplicació lineal en les bases canòniques, hem de col·locar les imatges dels vectors de la base de l'espai d'origen com a columnes de la matriu.

Recordem que:
- $\\text{dim}(\\text{Im } f) = \\text{rang}(A)$
- $\\text{dim}(\\ker f) = \\text{dim}(E) - \\text{rang}(A)$

---

### Apartat 1: $f(x) = 3x$
- Origen: $\\mathbb{R}$ (Base canònica $\\{1\\}$).
- $f(1) = 3$.
- Matriu $A = \\begin{pmatrix} 3 \\end{pmatrix}$.
- **$\text{dim}(\text{Im } f) = 1$**, **$\text{dim}(\ker f) = 1 - 1 = 0$**.

---

### Apartat 2: $f(x, y) = (x, y, x - y)$
- Origen: $\\mathbb{R}^2$ (Base $\\{e_1, e_2\\}$).
- $f(1, 0) = (1, 0, 1)$, $f(0, 1) = (0, 1, -1)$.
- Matriu $A = \\begin{pmatrix} 1 & 0 \\\\ 0 & 1 \\\\ 1 & -1 \\end{pmatrix}$.
- El rang és clarament 2 (les columnes no són proporcionals).
- **$\text{dim}(\text{Im } f) = 2$**, **$\text{dim}(\ker f) = 2 - 2 = 0$**.

---

### Apartat 3: $f(x, y, z) = (x+y+z, y+z, z)$
- Origen: $\\mathbb{R}^3$ (Base $\\{e_1, e_2, e_3\\}$).
- $f(e_1) = (1, 0, 0)$, $f(e_2) = (1, 1, 0)$, $f(e_3) = (1, 1, 1)$.
- Matriu $A = \\begin{pmatrix} 1 & 1 & 1 \\\\ 0 & 1 & 1 \\\\ 0 & 0 & 1 \\end{pmatrix}$.
- La matriu és triangular superior amb valors no nuls a la diagonal. El rang és 3.
- **$\text{dim}(\text{Im } f) = 3$**, **$\text{dim}(\ker f) = 3 - 3 = 0$**.

---

### Apartat 4: $f \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} = (b+c, c+d, 2a-b+c-d)$
- Base canònica de $\\mathcal{M}_2$: $E_{11}=\\begin{pmatrix} 1 & 0 \\\\ 0 & 0 \\end{pmatrix}, E_{12}=\\begin{pmatrix} 0 & 1 \\\\ 0 & 0 \\end{pmatrix}, E_{21}=\\begin{pmatrix} 0 & 0 \\\\ 1 & 0 \\end{pmatrix}, E_{22}=\\begin{pmatrix} 0 & 0 \\\\ 0 & 1 \\end{pmatrix}$.
- $f(E_{11}) = (0, 0, 2)$, $f(E_{12}) = (1, 0, -1)$, $f(E_{21}) = (1, 1, 1)$, $f(E_{22}) = (0, 1, -1)$.
- Matriu $A = \\begin{pmatrix} 0 & 1 & 1 & 0 \\\\ 0 & 0 & 1 & 1 \\\\ 2 & -1 & 1 & -1 \\end{pmatrix}$.
- Rang: Les tres files són linealment independents (podem veure que la submatriu formada per les columnes 1, 2 i 3 té determinant no nul). Per tant, el rang és 3.
- **$\text{dim}(\text{Im } f) = 3$**, **$\text{dim}(\ker f) = 4 - 3 = 1$**.

---

### Apartat 5: Polinomis $P_2 \\to P_3$
- Base canònica de $P_2$: $\\{1, x, x^2\\}$.
- $f(1) \\implies a_0=1: -1 + 0x + 1x^2 + 1x^3 \\to (-1, 0, 1, 1)$
- $f(x) \\implies a_1=1: 2 + 2x - 2x^2 + 1x^3 \\to (2, 2, -2, 1)$
- $f(x^2) \\implies a_2=1: 0 - 1x + 3x^2 + 1x^3 \\to (0, -1, 3, 1)$
- Matriu $A = \\begin{pmatrix} -1 & 2 & 0 \\\\ 0 & 2 & -1 \\\\ 1 & -2 & 3 \\\\ 1 & 1 & 1 \\end{pmatrix}$.
- Estudiem el rang:
  $$\\begin{pmatrix} -1 & 2 & 0 \\\\ 0 & 2 & -1 \\\\ 1 & -2 & 3 \\\\ 1 & 1 & 1 \\end{pmatrix} \\xrightarrow{F_3+F_1, F_4+F_1} \\begin{pmatrix} -1 & 2 & 0 \\\\ 0 & 2 & -1 \\\\ 0 & 0 & 3 \\\\ 0 & 3 & 1 \\end{pmatrix} \\xrightarrow{F_4-1.5F_2} \\begin{pmatrix} -1 & 2 & 0 \\\\ 0 & 2 & -1 \\\\ 0 & 0 & 3 \\\\ 0 & 0 & 2.5 \\end{pmatrix}$$
- El rang és 3.
- **$\text{dim}(\text{Im } f) = 3$**, **$\text{dim}(\ker f) = 3 - 3 = 0$**.
`,
  availableLanguages: ['ca']
};
