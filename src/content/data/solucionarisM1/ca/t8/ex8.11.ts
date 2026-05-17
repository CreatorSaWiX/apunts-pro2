import type { Solution } from '../../../solutions';

export const ex8_11: Solution = {
  id: 'M1-T8-Ex8.11',
  title: 'Exercici 8.11: Potències de matrius i diagonalització',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Sigui $A \\in \\mathcal{M}_n(\\mathbb{R})$.
1. Quina relació hi ha entre els valors propis d'A i els d'$A^k$? I entre els vectors propis?
2. Demostreu que si la matriu $A$ es pot escriure com $A = PDP^{-1}$, on $P$ és una matriu invertible, aleshores $A^k = P D^k P^{-1}$.
3. Fent ús de l'apartat anterior, calculeu:
   i) $\\begin{pmatrix} 17 & -6 \\\\ 35 & -12 \\end{pmatrix}^{100}$
   ii) $\\begin{pmatrix} 3 & 0 & 1 \\\\ 0 & 1 & 0 \\\\ 1 & 0 & 3 \\end{pmatrix}^{2001}$
   iii) $\\begin{pmatrix} 2 & 0 & 0 & 9 \\\\ 5 & 13 & 0 & 5 \\\\ 7 & 0 & -1 & 7 \\\\ 9 & 0 & 0 & 2 \\end{pmatrix}^{70}$`,
  content: `
### 1) Relació entre valors i vectors propis
Si $\\lambda$ és un valor propi d'$A$ amb vector propi associat $v$, llavors:
$A v = \\lambda v \\implies A^2 v = A(\\lambda v) = \\lambda (A v) = \\lambda^2 v \\implies \\dots \\implies A^k v = \\lambda^k v$

- Els valors propis d'$A^k$ són les potències $\\lambda^k$ dels valors propis d'$A$.
- Els vectors propis d'$A$ es mantenen com a vectors propis d'$A^k$.

---

### 2) Demostració de $A^k = P D^k P^{-1}$
Ho fem per inducció sobre $k$:
- **Cas base ($k=1$):** $A^1 = P D^1 P^{-1}$ (per hipòtesi).
- **Pas inductiu:** Suposem cert per a $k$. Llavors per a $k+1$:
  $A^{k+1} = A^k \\cdot A = (P D^k P^{-1})(P D P^{-1}) = P D^k (P^{-1} P) D P^{-1} = P D^k I D P^{-1} = P D^{k+1} P^{-1}$.

---

### 3) Càlculs

### i) $A = \\begin{pmatrix} 17 & -6 \\\\ 35 & -12 \\end{pmatrix}^{100}$
- Valors propis: $\\lambda_1=2, \\lambda_2=3$.
- Vectors propis: $v_1=(2,5), v_2=(3,7)$.
- $P = \\begin{pmatrix} 2 & 3 \\\\ 5 & 7 \\end{pmatrix}, P^{-1} = \\begin{pmatrix} -7 & 3 \\\\ 5 & -2 \\end{pmatrix}$.
- $A^{100} = \\begin{pmatrix} 2 & 3 \\\\ 5 & 7 \\end{pmatrix} \\begin{pmatrix} 2^{100} & 0 \\\\ 0 & 3^{100} \\end{pmatrix} \\begin{pmatrix} -7 & 3 \\\\ 5 & -2 \\end{pmatrix} = \\begin{pmatrix} -14 \\cdot 2^{100} + 15 \\cdot 3^{100} & 6 \\cdot 2^{100} - 6 \\cdot 3^{100} \\\\ -35 \\cdot 2^{100} + 35 \\cdot 3^{100} & 15 \\cdot 2^{100} - 14 \\cdot 3^{100} \\end{pmatrix}$

### ii) $A = \\begin{pmatrix} 3 & 0 & 1 \\\\ 0 & 1 & 0 \\\\ 1 & 0 & 3 \\end{pmatrix}^{2001}$
- Valors propis: $1, 2, 4$.
- Vectors propis: $v_1=(0,1,0), v_2=(1,0,-1), v_3=(1,0,1)$.
- Resultat: $A^{2001} = \\begin{pmatrix} 2^{2000} + 2^{4001} & 0 & 2^{4001} - 2^{2000} \\\\ 0 & 1 & 0 \\\\ 2^{4001} - 2^{2000} & 0 & 2^{2000} + 2^{4001} \\end{pmatrix}$ (on $4^{2001} = 2^{4002}$).

### iii) $A = \\begin{pmatrix} 2 & 0 & 0 & 9 \\\\ 5 & 13 & 0 & 5 \\\\ 7 & 0 & -1 & 7 \\\\ 9 & 0 & 0 & 2 \\end{pmatrix}^{70}$
- Valors propis: $13, -1, 11, -7$.
- Vectors propis: $v_{13}=(0,1,0,0), v_{-1}=(0,0,1,0), v_{11}=(6,-30,7,6), v_{-7}=(1,0,0,-1)$.
- Resultat: $A^{70} = \\begin{pmatrix} \\alpha & 0 & 0 & \\beta \\\\ \\gamma & 13^{70} & 0 & \\gamma \\\\ \\delta & 0 & 1 & \\delta \\\\ \\beta & 0 & 0 & \\alpha \\end{pmatrix}$ on:
  $\\alpha = \\frac{11^{70} + 7^{70}}{2}, \\beta = \\frac{11^{70} - 7^{70}}{2}, \\gamma = \\frac{5(13^{70} - 11^{70})}{2}, \\delta = \\frac{7(11^{70} - 1)}{12}$.
`,
  availableLanguages: ['ca']
};
