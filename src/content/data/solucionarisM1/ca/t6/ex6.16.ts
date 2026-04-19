import type { Solution } from '../../../solutions';

export const ex6_16: Solution = {
  id: 'M1-T6-Ex6.16',
  title: 'Exercici 6.16: Independència Lineal de Conjunts',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Esbrineu si els conjunts de vectors següents són linealment independents a l'espai vectorial que s'indica.
  
1) $\\{ (1,2,3), (3,6,8) \\}$ a $\\mathbb{R}^3$.
2) $\\{ (2,-3,1), (3,-1,5), (1,-4,3) \\}$ a $\\mathbb{R}^3$.
3) $\\{ (5,4,3), (3,3,2), (8,1,3) \\}$ a $\\mathbb{R}^3$.
4) $\\{ (4,-5,2,6), (2,2,-1,3), (6,-3,3,9), (4,-1,5,6) \\}$ a $\\mathbb{R}^4$.
5) $\\{ (1,0,0,2,5), (0,1,0,3,4), (0,0,1,4,7), (2,-3,4,11,12) \\}$ a $\\mathbb{R}^5$.`,
  content: `
Recordem que un conjunt de vectors és Linealment Independent (LI) si cap d'ells es pot escriure com a combinació lineal dels altres. Per a conjunts de $n$ vectors en $\\mathbb{R}^n$, podem utilitzar el determinant; si el determinant és diferent de zero, el conjunt és LI.

---

### **1) $\\{ (1,2,3), (3,6,8) \\}$ a $\\mathbb{R}^3$**
Dos vectors són linealment dependents si i només si són proporcionals.
$$(3, 6, 8) = k(1, 2, 3) \\implies k=3, \\text{ però } 3 \\cdot 3 = 9 \\neq 8$$
Com que no són proporcionals, el conjunt és **Linealment Independent (LI)**.

---

### **2) $\\{ (2,-3,1), (3,-1,5), (1,-4,3) \\}$ a $\\mathbb{R}^3$**
Calculem el determinant de la matriu formada pels vectors:
$$\\Delta = \\begin{vmatrix} 2 & 3 & 1 \\\\ -3 & -1 & -4 \\\\ 1 & 5 & 3 \\end{vmatrix} = 2(-3+20) - 3(-9+4) + 1(-15+1) = 34 + 15 - 14 = 35$$
Com que $\\Delta = 35 \\neq 0$, el conjunt és **Linealment Independent (LI)**.

---

### **3) $\\{ (5,4,3), (3,3,2), (8,1,3) \\}$ a $\\mathbb{R}^3$**
Calculem el determinant:
$$\\Delta = \\begin{vmatrix} 5 & 3 & 8 \\\\ 4 & 3 & 1 \\\\ 3 & 2 & 3 \\end{vmatrix} = 5(9-2) - 3(12-3) + 8(8-9) = 35 - 27 - 8 = 0$$
Com que el determinant és $0$, el conjunt és **Linealment Dependent (LD)**.

---

### **4) $\\{ v_1, v_2, v_3, v_4 \\}$ a $\\mathbb{R}^4$**
Observem les files de la matriu o busquem relacions:
$$\\text{Matriu} = \\begin{pmatrix} 4 & 2 & 6 & 4 \\\\ -5 & 2 & -3 & -1 \\\\ 2 & -1 & 3 & 5 \\\\ 6 & 3 & 9 & 6 \\end{pmatrix}$$
Observem que la quarta fila és $1.5$ vegades la primera fila: $F_4 = \\frac{3}{2} F_1$. Això implica que el determinant és $0$ i el rang és menor que 4. El conjunt és **Linealment Dependent (LD)**.

---

### **5) $\\{ v_1, v_2, v_3, v_4 \\}$ a $\\mathbb{R}^5$**
Els tres primers vectors tenen els elements de la base canònica a les 3 primeres posicions. Qualsevol combinació de $v_1, v_2, v_3$ que vulgui donar $v_4$ hauria d'utilitzar els coeficients $2, -3, 4$:
$$2v_1 - 3v_2 + 4v_3 = \\begin{pmatrix} 2 \\\\ -3 \\\\ 4 \\\\ 2(2)-3(3)+4(4) \\\\ 2(5)-3(4)+4(7) \\end{pmatrix} = \\begin{pmatrix} 2 \\\\ -3 \\\\ 4 \\\\ 11 \\\\ 26 \\end{pmatrix}$$
Com que $26 \\neq 12$ (l'última component del quart vector), veiem que $v_4$ no és combinació lineal de la resta. Com que $v_1, v_2, v_3$ són clarament LI entre ells, tot el conjunt és **Linealment Independent (LI)**.
`,
  availableLanguages: ['ca']
};
