import type { Solution } from '../../../solutions';

export const ex6_7: Solution = {
  id: 'M1-T6-Ex6.7',
  title: 'Exercici 6.7: Determinació de Subespais Vectorials',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Esbrineu quins dels conjunts següents són subespais vectorials sobre $\\mathbb{R}$. Justifiqueu les respostes.
  
$E_1 = \\{ (x, y) \\in \\mathbb{R}^2 : x + \\pi y = 0 \\}$

$E_2 = \\{ (x, y, z) \\in \\mathbb{R}^3 : x + z = \\pi \\}$

$E_3 = \\{ (x, y, z) \\in \\mathbb{R}^3 : xy = 0 \\}$

$E_4 = \\{ (x, y) \\in \\mathbb{R}^2 : x \\in \\mathbb{Q} \\}$

$E_5 = \\{ (x, y, z, t) \\in \\mathbb{R}^4 : x+y+z+t=0, x-t=0 \\}$

$E_6 = \\{ (x, y) \\in \\mathbb{R}^2 : x^2 + 2xy + y^2 = 0 \\}$

$E_7 = \\{ (a+b, a-2b, c, 2a+c) : a,b,c \\in \\mathbb{R} \\}$

$E_8 = \\{ (a^2, a, b+a, 2+a) : a,b \\in \\mathbb{R} \\}$`,
  content: `Recordem que un subconjunt $E \\subseteq V$ és un subespai vectorial si conté el vector nul, és tancat per la suma i és tancat pel producte per escalar. Una forma ràpida de detectar-ho és comprovar si el conjunt està definit per equacions lineals homogènies (terme independent 0, $ax + by = 0$, ex: $x + \\pi y = 0$, etc.).

---

### **$E_1$: SÍ**
Està definit per una **equació lineal homogènia** ($x + \\pi y = 0$). Tota equació del tipus $ax + by = 0$ defineix un subespai vectorial (una recta que passa per l'origen).

---

### **$E_2$: NO**
L'equació $x + z = \\pi$ no és homogènia perquè el terme independent $\\pi$ és diferent de zero. El **vector nul $(0,0,0)$ no hi pertany**, ja que $0+0 \\neq \\pi$.

---

### **$E_3$: NO**
La condició $xy = 0$ no és lineal. Tot i que conté el vector nul, **no és tancat per la suma**. Per exemple:
*   $(1, 0, 0) \\in E_3$ (perquè $1 \\cdot 0 = 0$)
*   $(0, 1, 0) \\in E_3$ (perquè $0 \\cdot 1 = 0$)
*   Però la seva suma $(1,0,0)+(0,1,0) = (1, 1, 0) \\notin E_3$ perquè $1 \\cdot 1 = 1 \\neq 0$.

---

### **$E_4$: NO**
La condició $x \\in \\mathbb{Q}$ (racionals) fa que el conjunt **no sigui tancat pel producte per escalar real**.
Si prenem el vector $(1, 0) \\in E_4$ i l'escalar $\\sqrt{2} \\in \\mathbb{R}$:
$$\\sqrt{2} \\cdot (1, 0) = (\\sqrt{2}, 0) \\notin E_4 \\quad \\text{perquè } \\sqrt{2} \\notin \\mathbb{Q}$$

---

### **$E_5$: SÍ**
Està definit per un **sistema d'equacions lineals homogènies**. Qualsevol conjunt de solucions d'un sistema homogeni és un subespai vectorial.

---

### **$E_6$: SÍ**
L'expressió $x^2 + 2xy + y^2 = 0$ es pot factoritzar com a $(x+y)^2 = 0$, que equival a l'equació lineal homogènia:
$$x + y = 0$$

Per tant, és un subespai vectorial.

---

### **$E_7$: SÍ**
Podem escriure el vector genèric com una combinació lineal de vectors fixos segons els paràmetres $a, b, c$:
$$(a+b, a-2b, c, 2a+c) = a(1, 1, 0, 2) + b(1, -2, 0, 0) + c(0, 0, 1, 1)$$

Això vol dir que $E_7 = \\text{Gen}\\{(1,1,0,2), (1,-2,0,0), (0,0,1,1)\\}$. El **generat (Span)** d'un conjunt de vectors sempre és un subespai vectorial.

---

### **$E_8$: NO**
El conjunt no conté el vector nul ni és lineal. Analitzem l'última component $2+a$: per ser el vector nul, $2+a$ hauria de ser $0$, pel que $a$ hauria de ser $-2$. Però si $a=-2$, la segona component seria $-2 \\neq 0$. A més, la component $a^2$ indica **no linealitat**.
`,
  availableLanguages: ['ca']
};
