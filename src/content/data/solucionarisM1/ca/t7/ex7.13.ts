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
  content: `Per a resoldre aquests exercicis, seguirem sistemàticament els següents passos:
1. **Matriu associada:** Trobarem la matriu $A$ de l'aplicació en les bases canòniques calculant les imatges dels vectors de la base de l'espai de sortida.
2. **Càlcul del rang:** Utilitzarem el mètode de Gauss o el determinant per a trobar el rang de la matriu, que coincideix amb la dimensió de la imatge: $\\text{dim}(\\text{Im } f) = \\text{rang}(A)$.
3. **Teorema de la dimensió:** Calcularem la dimensió del nucli com $\\text{dim}(\\ker f) = \\text{dim}(E) - \\text{rang}(A)$.
4. **Classificació:**
   - **Injectiva** $\\iff \\ker f = \\{0\\} \\iff \\text{dim}(\\ker f) = 0$.
   - **Exhaustiva** $\\iff \\text{Im } f = F \\iff \\text{dim}(\\text{Im } f) = \\text{dim}(F)$.
   - **Bijectiva** $\\iff$ és injectiva i exhaustiva alhora.
5. **Inversa ($f^{-1}$):** Només existeix si $f$ és bijectiva. Es troba calculant $A^{-1}$ o resolent el sistema $Ax=y$.

---

### 1) $f: \\mathbb{R} \\to \\mathbb{R}$, $f(x) = ax$
- **Matriu:** L'espai de sortida i arribada és $\\mathbb{R}$ (dimensió 1). La imatge de la base $e_1 = (1)$ és $f(1) = a$. Per tant, $A = (a)$.
- **Cas $a \\neq 0$:**
  - El rang és 1. $\\text{dim}(\\text{Im } f) = 1 \\implies \\text{Im } f = \\mathbb{R}$ (Exhaustiva).
  - Pel teorema de la dimensió: $\\text{dim}(\\ker f) = 1 - 1 = 0 \\implies \\ker f = \\{0\\}$ (Injectiva).
  - **Classificació:** **Bijectiva**.
  - **Inversa:** L'equació $ax = y$ té solució única $x = y/a$, per tant $f^{-1}(y) = \\frac{y}{a}$.
- **Cas $a = 0$:**
  - $f(x) = 0$. Rang 0. $\\text{dim}(\\text{Im } f) = 0$, $\\text{dim}(\\ker f) = 1$.
  - **Classificació:** **Cap de les tres**. No és injectiva (el nucli és tot $\\mathbb{R}$) ni exhaustiva.

### 2) $f: \\mathbb{R}^2 \\to \\mathbb{R}^2$, $f(x, y) = (x + 3y, 2x + 7y)$
- **Matriu:** $f(1, 0) = (1, 2)$ i $f(0, 1) = (3, 7)$. La matriu és $A = \\begin{pmatrix} 1 & 3 \\\\ 2 & 7 \\end{pmatrix}$.
- **Rang:** Calculem el determinant: $\\det(A) = (1)(7) - (3)(2) = 1 \\neq 0$. El rang és 2.
- **Dimensions:**
  - $\\text{dim}(\\text{Im } f) = \\text{rang}(A) = 2 = \\text{dim}(\\mathbb{R}^2) \\implies$ **Exhaustiva**.
  - $\\text{dim}(\\ker f) = 2 - 2 = 0 \\implies$ **Injectiva**.
- **Classificació:** **Bijectiva**.
- **Inversa:** Calculem $A^{-1} = \\frac{1}{\\det A} \\begin{pmatrix} 7 & -3 \\\\ -2 & 1 \\end{pmatrix} = \\begin{pmatrix} 7 & -3 \\\\ -2 & 1 \\end{pmatrix}$.
  - L'aplicació inversa és $f^{-1}(x', y') = (7x' - 3y', -2x' + y')$.

### 3) $f: \\mathbb{R}^4 \\to \\mathbb{R}^3$, $f(x, y, z, t) = (x - y + z + 2t, y - z + t, x - 2y + 2z)$
- **Matriu:** $A = \\begin{pmatrix} 1 & -1 & 1 & 2 \\\\ 0 & 1 & -1 & 1 \\\\ 1 & -2 & 2 & 0 \\end{pmatrix}$.
- **Rang per Gauss:**

  $A = \\begin{pmatrix} 1 & -1 & 1 & 2 \\\\ 0 & 1 & -1 & 1 \\\\ 1 & -2 & 2 & 0 \\end{pmatrix} \\xrightarrow{F_3 - F_1} \\begin{pmatrix} 1 & -1 & 1 & 2 \\\\ 0 & 1 & -1 & 1 \\\\ 0 & -1 & 1 & -2 \\end{pmatrix} \\xrightarrow{F_3 + F_2} \\begin{pmatrix} 1 & -1 & 1 & 2 \\\\ 0 & 1 & -1 & 1 \\\\ 0 & 0 & 0 & -1 \\end{pmatrix}$.
- **Dimensions:**
  - $\\text{dim}(\\text{Im } f) = 3 = \\text{dim}(\\mathbb{R}^3) \\implies$ **Exhaustiva**. Base: $\{(1,0,1), (-1,1,-2), (2,1,0)\}$ (polsant les columnes pivot 1, 2 i 4).
  - $\\text{dim}(\\ker f) = 4 - 3 = 1 \\implies$ **No injectiva**.
- **Base del Nucli:** Resolent el sistema $x - y + z + 2t = 0$, $y - z + t = 0$, $-t = 0$. Obtenim $t=0$, $y=z$, $x=0$.
$\\ker f = \\langle (0, 1, 1, 0) \\rangle$.
- **Classificació:** **Exhaustiva**. No té inversa (no és bijectiva).

### 4) $f: P_2(\\mathbb{R}) \\to P_2(\\mathbb{R})$, $f(a_0 + a_1 x + a_2 x^2) = (a_0 - a_1) + (a_1 - a_2) x + (a_2 - a_0) x^2$
- **Matriu:** Usant la base $\{1, x, x^2\}$:
  - $f(1) = 1 + 0x - x^2 \\to (1, 0, -1)$
  - $f(x) = -1 + x + 0x^2 \\to (-1, 1, 0)$
  - $f(x^2) = 0 - x + x^2 \\to (0, -1, 1)$
  - $A = \\begin{pmatrix} 1 & -1 & 0 \\\\ 0 & 1 & -1 \\\\ -1 & 0 & 1 \\end{pmatrix} \\xrightarrow{F_3 + F_1} \\begin{pmatrix} 1 & -1 & 0 \\\\ 0 & 1 & -1 \\\\ 0 & -1 & 1 \\end{pmatrix} \\xrightarrow{F_3 + F_2} \\begin{pmatrix} 1 & -1 & 0 \\\\ 0 & 1 & -1 \\\\ 0 & 0 & 0 \\end{pmatrix}$.
- **Rang:** 2.
- **Dimensions:**
  - $\\text{dim}(\\text{Im } f) = 2 < 3 \\implies$ **No exhaustiva**. Base: $\{1-x^2, -1+x\}$.
  - $\\text{dim}(\\ker f) = 3 - 2 = 1 \\implies$ **No injectiva**.
- **Base del Nucli:** $a_0 - a_1 = 0 \\implies a_0 = a_1$; $a_1 - a_2 = 0 \\implies a_1 = a_2$.
  - $\\ker f = \\langle 1 + x + x^2 \\rangle$.
- **Classificació:** **Cap de les tres**.

### 5) $f: P_2(\\mathbb{R}) \\to P_2(\\mathbb{R})$, $f(p) = 3a_0 + (a_0 - a_1) x + (2a_0 + a_1 + a_2) x^2$
- **Matriu:**
  - $f(1) = 3 + x + 2x^2 \\to (3, 1, 2)$
  - $f(x) = 0 - x + x^2 \\to (0, -1, 1)$
  - $f(x^2) = 0 + 0x + x^2 \\to (0, 0, 1)$
  - $A = \\begin{pmatrix} 3 & 0 & 0 \\\\ 1 & -1 & 0 \\\\ 2 & 1 & 1 \\end{pmatrix}$.
- **Rang:** Com que és triangular inferior (per blocs o resolent el det), $\\det(A) = 3(-1)(1) = -3 \\neq 0$. Rang 3.
- **Classificació:** **Bijectiva** (rang igual a dimensió de l'espai de sortida i arribada).
- **Inversa:** Calculant $A^{-1}$:
  $A^{-1} = \\begin{pmatrix} 1/3 & 0 & 0 \\\\ 1/3 & -1 & 0 \\\\ -1 & 1 & 1 \\end{pmatrix}$.
  - $f^{-1}(b_0 + b_1 x + b_2 x^2) = \\frac{1}{3}b_0 + (\\frac{1}{3}b_0 - b_1)x + (-b_0 + b_1 + b_2)x^2$.

### 6) $f: \\mathcal{M}_2(\\mathbb{R}) \\to \\mathbb{R}^2$, $f \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} = (a + d, b + c)$
- **Matriu:** Base canònica de $\\mathcal{M}_2$: $\{E_{11}, E_{12}, E_{21}, E_{22}\}$.
  - $f(E_{11}) = (1, 0)$, $f(E_{12}) = (0, 1)$, $f(E_{21}) = (0, 1)$, $f(E_{22}) = (1, 0)$.
  - $A = \\begin{pmatrix} 1 & 0 & 0 & 1 \\\\ 0 & 1 & 1 & 0 \\end{pmatrix}$.
- **Rang:** Clarament rang 2 (files linealment independents).
- **Dimensions:**
  - $\\text{dim}(\\text{Im } f) = 2 = \\text{dim}(\\mathbb{R}^2) \\implies$ **Exhaustiva**.
  - $\\text{dim}(\\ker f) = 4 - 2 = 2 \\implies$ **No injectiva**.
- **Base del Nucli:** $a + d = 0 \\implies d = -a$; $b + c = 0 \\implies c = -b$.
  - Una matriu del nucli és $\\begin{pmatrix} a & b \\\\ -b & -a \\end{pmatrix} = a \\begin{pmatrix} 1 & 0 \\\\ 0 & -1 \\end{pmatrix} + b \\begin{pmatrix} 0 & 1 \\\\ -1 & 0 \\end{pmatrix}$.
  - Base: $\\{E_{11}-E_{22}, \\, E_{12}-E_{21} \\}$.
- **Classificació:** **Exhaustiva**.

### 7) $f: \\mathbb{R}^3 \\to \\mathcal{M}_2(\\mathbb{R})$, $f(x, y, z) = \\begin{pmatrix} x - y & y - z \\\\ z - y & x - z \\end{pmatrix}$
- **Matriu:** Calculant imatges de la base de $\\mathbb{R}^3$:
  - $f(1,0,0) = \\begin{pmatrix} 1 & 0 \\\\ 0 & 1 \\end{pmatrix} \\to (1, 0, 0, 1)$
  - $f(0,1,0) = \\begin{pmatrix} -1 & 1 \\\\ -1 & 0 \\end{pmatrix} \\to (-1, 1, -1, 0)$
  - $f(0,0,1) = \\begin{pmatrix} 0 & -1 \\\\ 1 & -1 \\end{pmatrix} \\to (0, -1, 1, -1)$
  - $A = \\begin{pmatrix} 1 & -1 & 0 \\\\ 0 & 1 & -1 \\\\ 0 & -1 & 1 \\\\ 1 & 0 & -1 \\end{pmatrix} \\xrightarrow{F_3 + F_2, F_4 - F_1} \\begin{pmatrix} 1 & -1 & 0 \\\\ 0 & 1 & -1 \\\\ 0 & 0 & 0 \\\\ 0 & 1 & -1 \\end{pmatrix} \\xrightarrow{F_4 - F_2} \\begin{pmatrix} 1 & -1 & 0 \\\\ 0 & 1 & -1 \\\\ 0 & 0 & 0 \\\\ 0 & 0 & 0 \\end{pmatrix}$.
- **Rang:** 2.
- **Dimensions:**
  - $\\text{dim}(\\text{Im } f) = 2 < 4 \\implies$ **No exhaustiva**.
  - $\\text{dim}(\\ker f) = 3 - 2 = 1 \\implies$ **No injectiva**.
- **Base del Nucli:** $x - y = 0 \\implies x = y$; $y - z = 0 \\implies y = z$.
  - $\\ker f = \\langle (1, 1, 1) \\rangle$.
- **Classificació:** **Cap de les tres**.
` ,
  availableLanguages: ['ca']
};
