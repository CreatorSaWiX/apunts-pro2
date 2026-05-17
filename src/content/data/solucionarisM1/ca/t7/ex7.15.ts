import type { Solution } from '../../../solutions';

export const ex7_15: Solution = {
  id: 'M1-T7-Ex7.15',
  title: 'Exercici 7.15: Composició d\'aplicacions lineals',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Per a les aplicacions lineals següents $f_1$ i $f_2$, digueu si l'aplicació composició $f = f_2 \\circ f_1$ és injectiva, exhaustiva, bijectiva.

1) $f_1: \\mathbb{R}^3 \\to \\mathbb{R}^3$ i $f_2: \\mathbb{R}^3 \\to \\mathbb{R}^2$, on $f_1 \\begin{pmatrix} x \\\\ y \\\\ z \\end{pmatrix} = \\begin{pmatrix} z \\\\ x + y \\\\ x + 2z - y \\end{pmatrix}$ i $f_2 \\begin{pmatrix} x \\\\ y \\\\ z \\end{pmatrix} = \\begin{pmatrix} 2x - 3z \\\\ y + 4z \\end{pmatrix}$;

2) $f_1: P_3(\\mathbb{R}) \\to P_2(\\mathbb{R})$ i $f_2: P_2(\\mathbb{R}) \\to P_2(\\mathbb{R})$, on $f_1(a_0 + a_1x + a_2x^2 + a_3x^3) = a_2 + a_3x + a_0x^2$ i $f_2(a_0 + a_1x + a_2x^2) = (a_1 + a_2) + (a_0 + a_2)x + (a_0 + a_1)x^2$;

3) $f_1: \\mathbb{R}^2 \\to \\mathbb{R}^3$ i $f_2: \\mathbb{R}^3 \\to \\mathbb{R}^3$, on $f_1 \\begin{pmatrix} x \\\\ y \\end{pmatrix} = \\begin{pmatrix} x \\\\ x + y \\\\ y \\end{pmatrix}$ i $f_2 \\begin{pmatrix} x \\\\ y \\\\ z \\end{pmatrix} = \\begin{pmatrix} y + z \\\\ x + y + z \\\\ y + x \\end{pmatrix}$.`,
  content: `
Recordem que si $f: V \\to W$, llavors:
- Si $\\dim V > \\dim W$, $f$ **no pot ser injectiva**.
- Si $\\dim V < \\dim W$, $f$ **no pot ser exhaustiva**.
- Si $\\dim V = \\dim W$, injectiva $\\iff$ exhaustiva $\\iff$ bijectiva.

---

### Apartat 1: $f = f_2 \\circ f_1: \\mathbb{R}^3 \\to \\mathbb{R}^2$

Com que $\\dim(\\mathbb{R}^3) = 3 > 2 = \\dim(\\mathbb{R}^2)$, l'aplicació **no és injectiva**.
Estudiem l'exhaustivitat a través de la matriu del producte $A = A_2 \\cdot A_1$:

$$A_1 = \\begin{pmatrix} 0 & 0 & 1 \\\\ 1 & 1 & 0 \\\\ 1 & -1 & 2 \\end{pmatrix}, \\quad A_2 = \\begin{pmatrix} 2 & 0 & -3 \\\\ 0 & 1 & 4 \\end{pmatrix}$$

$$A = \\begin{pmatrix} 2 & 0 & -3 \\\\ 0 & 1 & 4 \\end{pmatrix} \\begin{pmatrix} 0 & 0 & 1 \\\\ 1 & 1 & 0 \\\\ 1 & -1 & 2 \\end{pmatrix} = \\begin{pmatrix} -3 & 3 & -4 \\\\ 4 & -3 & 8 \\end{pmatrix}$$

Les dues files no són proporcionals, per tant el rang és 2. Com que el rang coincideix amb la dimensió de l'espai d'arribada, l'aplicació és **exhaustiva**.

---

### Apartat 2: $f = f_2 \\circ f_1: P_3 \\to P_2$

$\\dim(P_3) = 4 > 3 = \\dim(P_2)$. L'aplicació **no és injectiva**.
Estudiem la matriu de $f_1$ i $f_2$ en bases canòniques:
- $A_1 = \\begin{pmatrix} 0 & 0 & 1 & 0 \\\\ 0 & 0 & 0 & 1 \\\\ 1 & 0 & 0 & 0 \\end{pmatrix}$ (té rang 3, és exhaustiva cap a $P_2$).
- $A_2 = \\begin{pmatrix} 0 & 1 & 1 \\\\ 1 & 0 & 1 \\\\ 1 & 1 & 0 \\end{pmatrix}$. El seu determinant és $2 \\neq 0$, per tant és bijectiva.

Com que $f_1$ és exhaustiva i $f_2$ és un isomorfisme, la composició és **exhaustiva**.

---

### Apartat 3: $f = f_2 \\circ f_1: \\mathbb{R}^2 \\to \\mathbb{R}^3$

$\\dim(\\mathbb{R}^2) = 2 < 3 = \\dim(\\mathbb{R}^3)$. L'aplicació **no és exhaustiva**.
Mirem la injectivitat:
- $A_1 = \\begin{pmatrix} 1 & 0 \\\\ 1 & 1 \\\\ 0 & 1 \\end{pmatrix}$. El rang és 2 (les dues columnes són LI), per tant $f_1$ és injectiva.
- $A_2 = \\begin{pmatrix} 0 & 1 & 1 \\\\ 1 & 1 & 1 \\\\ 1 & 1 & 0 \\end{pmatrix}$. $\\det(A_2) = 1 \\neq 0$, per tant $f_2$ és un isomorfisme.

Com que $f_1$ és injectiva i $f_2$ manté la independència lineal (és bijectiva), la composició és **injectiva**.
- **Conclusió:** Injectiva, però no exhaustiva ni bijectiva.
`,
  availableLanguages: ['ca']
};
