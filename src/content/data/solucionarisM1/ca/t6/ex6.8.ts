import type { Solution } from '../../../solutions';

export const ex6_8: Solution = {
  id: 'M1-T6-Ex6.8',
  title: 'Exercici 6.8: Subespais en l’Espai de Polinomis',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Denotem per $P(\\mathbb{R})$ l'espai vectorial dels polinomis amb coeficients reals i variable $x$. Esbrineu quins dels subconjunts següents són subespais vectorials de $P(\\mathbb{R})$. Justifiqueu les respostes.
  
$F_1 = \\{ a_3 x^3 + a_2 x^2 + a_1 x + a_0 \\in P(\\mathbb{R}) : a_2 = a_0 \\}$

$F_2 = \\{ p(x) \\in P(\\mathbb{R}) : p(x) \\text{ té grau } 3 \\}$

$F_3 = \\{ p(x) \\in P(\\mathbb{R}) : p(x) \\text{ té grau parell} \\}$

$F_4 = \\{ p(x) \\in P(\\mathbb{R}) : p(1) = 0 \\}$

$F_5 = \\{ p(x) \\in P(\\mathbb{R}) : p(0) = 1 \\}$

$F_6 = \\{ p(x) \\in P(\\mathbb{R}) : p'(5) = 0 \\}$`,
  content: `
Per a cada conjunt, analitzem si compleix les condicions de subespai vectorial: conté el zero, tancament per la suma i tancament pel producte per escalar.

---

### **$F_1$: SÍ**
La condició $a_2 = a_0$ es pot escriure com una **equació lineal homogènia** entre els coeficients: $a_2 - a_0 = 0$. Qualsevol restricció lineal i homogènia sobre els components d'un vector (o coeficients d'un polinomi) defineix un subespai.

---

### **$F_2$: NO**
Els polinomis de grau **exactament** 3 no formen un subespai vectorial per dos motius:
1.  **No conté el polinomi nul**, ja que el polinomi $0$ no té grau 3 (el seu grau és $0$ o $-\\infty$).
2.  **No és tancat per la suma**. Per exemple, si sumem $p(x) = x^3 + x$ i $q(x) = -x^3 + 2$, obtenim $(p+q)(x) = x + 2$, que té grau 1.

---

### **$F_3$: NO**
Tot i que conté el polinomi nul (grau 0, parell), **no és tancat per la suma**. Considereu:
*   $p(x) = x^4 + x^3 \\in F_3$ (grau 4, parell)
*   $q(x) = -x^4 \\in F_3$ (grau 4, parell)
*   La suma $(p+q)(x) = x^3 \\notin F_3$ perquè té grau 3 (imparell).

---

### **$F_4$: SÍ**
L'avaluació en un punt és una operació lineal. La condició $p(1) = 0$ és una **equació lineal homogènia**.
*   $0(1) = 0$.
*   $(p+q)(1) = p(1) + q(1) = 0 + 0 = 0$.
*   $(\\lambda p)(1) = \\lambda p(1) = \\lambda \\cdot 0 = 0$.

---

### **$F_5$: NO**
La condició $p(0) = 1$ no és homogènia. El **polinomi nul no hi pertany** perquè $0(0) = 0 \\neq 1$. Tampoc seria tancat per la suma ($1+1=2 \\neq 1$).

---

### **$F_6$: SÍ**
La derivada i la seva avaluació en un punt són operacions lineals. La condició $p'(5) = 0$ és una restricció lineal homogènia.
*   La derivada del polinomi nul és $0$, i $0(5) = 0$.
*   Les propietats de la derivada asseguren que $(p+q)'(5) = p'(5) + q'(5) = 0+0=0$ i $(\\lambda p)'(5) = \\lambda p'(5) = 0$.
`,
  availableLanguages: ['ca']
};
