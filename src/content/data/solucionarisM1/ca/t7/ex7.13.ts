import type { Solution } from '../../../solutions';

export const ex7_13: Solution = {
  id: 'M1-T7-Ex7.13',
  title: 'Exercici 7.13: Estudi complet d\'aplicacions lineals',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Per a cadascuna de les aplicacions lineals següents, doneu la matriu associada a l'aplicació en les bases canòniques; doneu la dimensió i una base del nucli i de la imatge de l'aplicació; digueu si l'aplicació és injectiva, exhaustiva, bijectiva o cap de les tres; i determineu l'aplicació inversa, en el cas que existeixi.

1) $f: \\mathbb{R} \\to \\mathbb{R}$, on $f(x) = ax, a \\in \\mathbb{R}$ fix;
2) $f: \\mathbb{R}^2 \\to \\mathbb{R}^2$, on $f(x, y) = (x + 3y, 2x + 7y)$;
3) $f: \\mathbb{R}^4 \\to \\mathbb{R}^3$, on $f(x, y, z, t) = (x - y + z + 2t, y - z + t, x - 2y + 2z)$;
4) $f: P_2(\\mathbb{R}) \\to P_2(\\mathbb{R})$, on $f(a_0 + a_1 x + a_2 x^2) = (a_0 - a_1) + (a_1 - a_2) x + (a_2 - a_0) x^2$;
5) $f: P_2(\\mathbb{R}) \\to P_2(\\mathbb{R})$, on $f(a_0 + a_1 x + a_2 x^2) = 3a_0 + (a_0 - a_1) x + (2a_0 + a_1 + a_2) x^2$;
6) $f: \\mathcal{M}_2(\\mathbb{R}) \\to \\mathbb{R}^2$, on $f \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} = (a + d, b + c)$;
7) $f: \\mathbb{R}^3 \\to \\mathcal{M}_2(\\mathbb{R})$, on $f(x, y, z) = \\begin{pmatrix} x - y & y - z \\\\ z - y & x - z \\end{pmatrix}$.`,
  content: `
A continuació es presenta l'estudi de cadascuna de les aplicacions lineals. Per a cada apartat, considerarem les bases canòniques dels espais corresponents.

---

### 1) $f(x) = ax$
- **Matriu:** $A = (a)$.
- **Cas $a \\neq 0$:** Rang 1. $\\text{Im } f = \\mathbb{R}$, $\\ker f = \\{0\\}$. **Bijectiva**. Inversa: $f^{-1}(y) = y/a$.
- **Cas $a = 0$:** Rang 0. $\\text{Im } f = \\{0\\}$, $\\ker f = \\mathbb{R}$. **Cap de les tres**. No existeix inversa.

### 2) $f(x, y) = (x + 3y, 2x + 7y)$
- **Matriu:** $A = \\begin{pmatrix} 1 & 3 \\\\ 2 & 7 \\end{pmatrix}$.
- **Rang:** $\\det(A) = 1 \\neq 0 \\implies$ Rang 2.
- **Imatge/Nucli:** $\\text{dim}(\\text{Im } f) = 2$, $\\text{dim}(\\ker f) = 0$.
- **Classificació:** **Bijectiva**.
- **Inversa:** $A^{-1} = \\begin{pmatrix} 7 & -3 \\\\ -2 & 1 \\end{pmatrix} \\implies f^{-1}(x', y') = (7x' - 3y', -2x' + y')$.

### 3) $f(x, y, z, t) = (x - y + z + 2t, y - z + t, x - 2y + 2z)$
- **Matriu:** $A = \\begin{pmatrix} 1 & -1 & 1 & 2 \\\\ 0 & 1 & -1 & 1 \\\\ 1 & -2 & 2 & 0 \\end{pmatrix} \\to \\begin{pmatrix} 1 & -1 & 1 & 2 \\\\ 0 & 1 & -1 & 1 \\\\ 0 & 0 & 0 & -1 \\end{pmatrix}$.
- **Rang:** 3. $\\text{dim}(\\text{Im } f) = 3$ (Base: canònica de $\\mathbb{R}^3$), $\\text{dim}(\\ker f) = 1$.
- **Base Nucli:** Resolent el sistema homogeni, obtenim $\\ker f = \\langle (0, 1, 1, 0) \\rangle$.
- **Classificació:** **Exhaustiva** (no injectiva). No existeix inversa.

### 4) $f(P_2) \\to P_2$, $f(p) = (a_0-a_1) + (a_1-a_2)x + (a_2-a_0)x^2$
- **Matriu:** $A = \\begin{pmatrix} 1 & -1 & 0 \\\\ 0 & 1 & -1 \\\\ -1 & 0 & 1 \\end{pmatrix} \\to \\dots \\to \\begin{pmatrix} 1 & -1 & 0 \\\\ 0 & 1 & -1 \\\\ 0 & 0 & 0 \\end{pmatrix}$.
- **Rang:** 2. $\\text{dim}(\\text{Im } f) = 2$ (Base: $\\{1-x^2, -1+x\\}$), $\\text{dim}(\\ker f) = 1$.
- **Base Nucli:** $a_0=a_1=a_2 \\implies \\ker f = \\langle 1 + x + x^2 \\rangle$.
- **Classificació:** **Cap de les tres**. No existeix inversa.

### 5) $f(P_2) \\to P_2$, $f(p) = 3a_0 + (a_0-a_1)x + (2a_0+a_1+a_2)x^2$
- **Matriu:** $A = \\begin{pmatrix} 3 & 0 & 0 \\\\ 1 & -1 & 0 \\\\ 2 & 1 & 1 \\end{pmatrix}$.
- **Rang:** $\\det(A) = -3 \\neq 0 \\implies$ Rang 3.
- **Classificació:** **Bijectiva**.
- **Inversa:** $A^{-1} = \\begin{pmatrix} 1/3 & 0 & 0 \\\\ 1/3 & -1 & 0 \\\\ -1 & 1 & 1 \\end{pmatrix} \\implies f^{-1}(b_0, b_1, b_2) = \\frac{1}{3}b_0 + (\\frac{1}{3}b_0 - b_1)x + (-b_0 + b_1 + b_2)x^2$.

### 6) $f(\\mathcal{M}_2) \\to \\mathbb{R}^2$, $f(A) = (a+d, b+c)$
- **Matriu:** $A = \\begin{pmatrix} 1 & 0 & 0 & 1 \\\\ 0 & 1 & 1 & 0 \\end{pmatrix}$.
- **Rang:** 2. $\\text{dim}(\\text{Im } f) = 2$ (Base: canònica $\\mathbb{R}^2$), $\\text{dim}(\\ker f) = 4-2=2$.
- **Base Nucli:** $\\{E_{11}-E_{22}, \\, E_{12}-E_{21} \\}$.
- **Classificació:** **Exhaustiva**. No existeix inversa.

### 7) $f(\\mathbb{R}^3) \\to \\mathcal{M}_2$, $f(x,y,z) = \\begin{pmatrix} x-y & y-z \\\\ z-y & x-z \\end{pmatrix}$
- **Matriu:** (sobre $\\{E_{11}, E_{12}, E_{21}, E_{22}\\}$): $A = \\begin{pmatrix} 1 & -1 & 0 \\\\ 0 & 1 & -1 \\\\ 0 & -1 & 1 \\\\ 1 & 0 & -1 \\end{pmatrix}$.
- **Rang:** 2. $\\text{dim}(\\text{Im } f) = 2$, $\\text{dim}(\\ker f) = 1$.
- **Base Nucli:** $x=y=z \\implies \\ker f = \\langle (1, 1, 1) \\rangle$.
- **Classificació:** **Cap de les tres**. No existeix inversa.
`,
  availableLanguages: ['ca']
};
