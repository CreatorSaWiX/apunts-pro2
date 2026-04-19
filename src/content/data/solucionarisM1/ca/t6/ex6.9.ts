import type { Solution } from '../../../solutions';

export const ex6_9: Solution = {
  id: 'M1-T6-Ex6.9',
  title: 'Exercici 6.9: Subespais en l’Espai de Matrius',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Considereu $\\mathcal{M}_{n \\times m}(\\mathbb{R})$ l'espai vectorial de les matrius $n \\times m$ amb coeficients reals. Esbrineu quins dels subconjunts següents són subespais vectorials de $\\mathcal{M}_{n \\times m}(\\mathbb{R})$. Justifiqueu les respostes.
  
$M_1 = \\left\\{ A \\in \\mathcal{M}_{2 \\times 2}(\\mathbb{R}) : A \\begin{pmatrix} 2 & 1 \\\\ 1 & 1 \\end{pmatrix} = \\begin{pmatrix} 2 & 1 \\\\ 1 & 1 \\end{pmatrix} A \\right\\}$

$M_2 = \\{ A \\in \\mathcal{M}_{n \\times n}(\\mathbb{R}) : A = A^t \\}$

$M_3 = \\{ A \\in \\mathcal{M}_{n \\times m}(\\mathbb{R}) : a_{1i} = 0 \\quad \\forall i \\in [m] \\}$

$M_4 = \\{ A \\in \\mathcal{M}_{n \\times m}(\\mathbb{R}) : a_{1i} = 1 \\quad \\forall i \\in [m] \\}$

$M_5 = \\{ A \\in \\mathcal{M}_{n \\times m}(\\mathbb{R}) : AB = 0 \\}$ (on $B$ és una matriu fixa)`,
  content: `
Analitzem cada conjunt verificant les condicions de subespai vectorial en l'espai de matrius.

---

### **$M_1$: SÍ**
És el conjunt de matrius que **commuten** amb una matriu fixa $B$. La condició $AB = BA$ (o $AB - BA = 0$) és una equació lineal homogènia respecte als elements de $A$.
*   La matriu nul·la commuta: $0B = B0 = 0$.
*   Si $A_1$ i $A_2$ commuten, la seva suma també: $(A_1+A_2)B = A_1B+A_2B = BA_1+BA_2 = B(A_1+A_2)$.
*   El producte per escalar manté la commutativitat: $(\\lambda A)B = \\lambda(AB) = \\lambda(BA) = B(\\lambda A)$.

---

### **$M_2$: SÍ**
És el conjunt de les **matrius simètriques**. La trasposició és una operació lineal:
*   La matriu nul·la és simètrica ($0^t = 0$).
*   $(A+B)^t = A^t + B^t = A + B$.
*   $(\\lambda A)^t = \\lambda A^t = \\lambda A$.

---

### **$M_3$: SÍ**
La condició que la primera fila sigui zero ($a_{1i}=0$) equival a un conjunt d'equacions lineals homogènies sobre les entrades de la matriu. La suma de dues matrius amb la primera fila nul·la tindrà la primera fila nul·la, i el mateix passa amb el producte per escalar.

---

### **$M_4$: NO**
La condició $a_{1i}=1$ no és homogènia.
1.  **No conté la matriu nul·la**, ja que totes les entrades de la matriu nul·la són $0$, no $1$.
2.  **No és tancat per la suma**: la suma de dues matrius d'aquest conjunt tindria $1+1=2$ a la primera fila.

---

### **$M_5$: SÍ**
La condició $AB = 0$ és lineal i homogènia respecte a $A$:
*   La matriu nul·la compleix $0B = 0$.
*   Si $A_1B = 0$ i $A_2B = 0$, llavors $(A_1+A_2)B = A_1B + A_2B = 0 + 0 = 0$.
*   Si $AB = 0$, llavors $(\\lambda A)B = \\lambda (AB) = \\lambda \\cdot 0 = 0$.
`,
  availableLanguages: ['ca']
};
