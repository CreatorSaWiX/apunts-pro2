import type { Solution } from '../../../solutions';

export const ex7_21: Solution = {
  id: 'M1-T7-Ex7.21',
  title: 'Exercici 7.21: Aplicació entre subespais i canvi de base',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Siguin $u_1 = (1, 0, 1, 0)$ i $u_2 = (1, 1, 1, 0)$ vectors de $\\mathbb{R}^4$ i $E$ el subespai generat per $B_E = \\{u_1, u_2\\}$.
Siguin $v_1 = (1, 1, 1)$ i $v_2 = (2, 1, 0)$ vectors de $\\mathbb{R}^3$ i $F$ el subespai generat per $B_F = \\{v_1, v_2\\}$.
Definim $f: E \\to F$ tal que $f(x_1 u_1 + x_2 u_2) = (x_1 - x_2) v_1 + (x_1 + x_2) v_2$.

1) Trobeu la matriu d'$f$ en les bases $B_E$ i $B_F$.
2) És $f$ injectiva? És exhaustiva?
3) Siguin $B'_E = \\{ (0, 1, 0, 0), (2, 1, 2, 0) \\}$ i $B'_F = \\{ (-1, 0, 1), (0, 1, 2) \\}$. Proveu que són bases d'$E$ i $F$ respectivament i doneu la matriu d'$f$ en aquestes noves bases.`,
  content: `
### 1) Matriu en bases $B_E$ i $B_F$

L'enunciat ens dóna directament la relació entre les coordenades en $B_E$ ($(x_1, x_2)$) i les coordenades en $B_F$:
- Per a $u_1$ (coordenades $(1, 0)$): $f(u_1) = (1-0)v_1 + (1+0)v_2 = 1v_1 + 1v_2 \\to (1, 1)_{B_F}$
- Per a $u_2$ (coordenades $(0, 1)$): $f(u_2) = (0-1)v_1 + (0+1)v_2 = -1v_1 + 1v_2 \\to (-1, 1)_{B_F}$

La matriu és:
$$M = \\begin{pmatrix} 1 & -1 \\\\ 1 & 1 \\end{pmatrix}$$

---

### 2) Injectivitat i Exhaustivitat

Calculem el determinant de la matriu: $\\det(M) = 1 - (-1) = 2 \\neq 0$.
- Com que $\\det(M) \\neq 0$, el rang és 2.
- Atès que $\\dim E = 2$ i $\\dim F = 2$, el fet que el rang sigui màxim implica que l'aplicació és **injectiva** i **exhaustiva** (cap a $F$).

---

### 3) Noves bases i canvi de base

**Comprovació de les bases:**
- Per a $B'_E$: 
  $(0, 1, 0, 0) = -u_1 + u_2 \\to (-1, 1)_{B_E}$
  $(2, 1, 2, 0) = u_1 + u_2 \\to (1, 1)_{B_E}$
  Són LI, per tant formen base d'$E$. Matriu de canvi: $P_E = \\begin{pmatrix} -1 & 1 \\\\ 1 & 1 \\end{pmatrix}$.

- Per a $B'_F$:
  $(-1, 0, 1) = 1v_1 - 1v_2 \\to (1, -1)_{B_F}$
  $(0, 1, 2) = 2v_1 - 1v_2 \\to (2, -1)_{B_F}$
  Són LI, per tant formen base d'$F$. Matriu de canvi: $P_F = \\begin{pmatrix} 1 & 2 \\\\ -1 & -1 \\end{pmatrix}$.

**Càlcul de la nova matriu ($M'$):**
Utilitzem la fórmula $M' = P_F^{-1} \\cdot M \\cdot P_E$:
- $P_F^{-1} = \\frac{1}{1} \\begin{pmatrix} -1 & -2 \\\\ 1 & 1 \\end{pmatrix} = \\begin{pmatrix} -1 & -2 \\\\ 1 & 1 \\end{pmatrix}$
- $M \\cdot P_E = \\begin{pmatrix} 1 & -1 \\\\ 1 & 1 \\end{pmatrix} \\begin{pmatrix} -1 & 1 \\\\ 1 & 1 \\end{pmatrix} = \\begin{pmatrix} -2 & 0 \\\\ 0 & 2 \\end{pmatrix}$
- $M' = \\begin{pmatrix} -1 & -2 \\\\ 1 & 1 \\end{pmatrix} \\begin{pmatrix} -2 & 0 \\\\ 0 & 2 \\end{pmatrix} = \\begin{pmatrix} 2 & -4 \\\\ -2 & 2 \\end{pmatrix}$

La matriu en les noves bases és:
$$M' = \\begin{pmatrix} 2 & -4 \\\\ -2 & 2 \\end{pmatrix}$$
`,
  availableLanguages: ['ca']
};
