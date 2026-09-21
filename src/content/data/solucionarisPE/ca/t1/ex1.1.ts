import type { Solution } from '../../../solutions';

export const ex1_1: Solution = {
  id: 'PE-T1-Ex1.1',
  title: "Exercici 1.1: Experiències aleatòries i àlgebra d'esdeveniments",
  author: 'FIB / Apunts',
  code: '',
  type: 'notebook',
  availableLanguages: ['ca'],
  statement: `### Part 1: Determinació de l'espai mostral ($\\Omega$)
Trobeu l'espai mostral $\\Omega$ en cadascun dels següents casos:
1. **Nombre de defectes ("tares")** en una peça industrial produïda en una línia de fabricació.
2. **Extracció sense reposició** de dues boles d'una urna que conté $4$ boles negres ($n$) i $1$ blanca ($b$).
3. **Diferència en valor absolut** entre el nombre de cares i creus obtingudes en $10$ tirades d'una moneda equilibrada.

### Part 2: Àlgebra d'esdeveniments i Lleis de De Morgan
Verifiqueu formalment mitjançant la teoria de conjunts les següents relacions d'equivalència:
1. $A \\cap B = \\neg(\\neg A \\cup \\neg B)$
2. $A \\cup B = \\neg(\\neg A \\cap \\neg B)$`,
  content: `## 1. Determinació de l'espai mostral ($\\Omega$)

L'**espai mostral** $\\Omega$ és el conjunt format per tots els resultats possibles d'un experiment o experiència aleatòria.

---

### 1.1. Nombre de defectes en una peça industrial
- **Definició**: Una peça manufacturada pot presentar cap defecte, un defecte, dos, o qualsevol quantitat entera no negativa.
- Com que a priori no hi ha un límit superior fixat per a les tares que podria contenir una peça, el conjunt de resultats possibles és el conjunt dels nombres naturals incloent el zero:
$$
\\Omega = \\{0, 1, 2, 3, \\dots\\} = \\mathbb{N}_0
$$
*(Es tracta d'un espai mostral discret infinit numerable).*

---

### 1.2. Extracció de dues boles sense reposició ($4$ negres, $1$ blanca)
- L'urna conté $5$ boles en total: $\\{n_1, n_2, n_3, n_4, b\\}$.
- Extraiem dues boles de manera seqüencial sense retornar la primera a l'urna.
- Donat que **només hi ha una única bola blanca**, és absolutament impossible extreure dues boles blanques ($bb$).
- Considerant l'ordre d'extracció com a parells ordenats $(\\text{1a bola}, \\text{2a bola})$:
$$
\\Omega = \\{bn, nb, nn\\}
$$
- Si no consideréssim l'ordre d'extracció (només la composició final del conjunt extret), tindríem $\\Omega = \\{\\{b, n\\}, \\{n, n\\}\\}$. En probabilitat se sol utilitzar la seqüència ordenada per preservar la coherència amb les probabilitats compostes.

---

### 1.3. Diferència en valor absolut entre cares i creus en $10$ tirades
Sigui $C$ el nombre de cares obtingudes en els $10$ llançaments. El nombre de creus serà necessàriament $K = 10 - C$.
La diferència en valor absolut entre ambdós recomptes és:
$$
D = |C - K| = |C - (10 - C)| = |2C - 10| = 2|C - 5|
$$
Com que $C$ només pot prendre valors enters dins el conjunt $\\{0, 1, 2, \\dots, 10\\}$:
- Si $C = 5 \\implies D = 2|5 - 5| = 0$
- Si $C = 4$ o $C = 6 \\implies D = 2|1| = 2$
- Si $C = 3$ o $C = 7 \\implies D = 2|2| = 4$
- Si $C = 2$ o $C = 8 \\implies D = 2|3| = 6$
- Si $C = 1$ o $C = 9 \\implies D = 2|4| = 8$
- Si $C = 0$ o $C = 10 \\implies D = 2|5| = 10$

Per tant, l'espai mostral només conté els valors parells compresos entre $0$ i $10$:
$$
\\Omega = \\{0, 2, 4, 6, 8, 10\\}
$$

---

## 2. Verificació de les operacions amb conjunts

Les relacions proposades són conseqüència directa de les **Lleis de De Morgan** i de la propietat d'involució del complementari ($\\neg(\\neg X) = X$).

### 2.1. Verificació de $A \\cap B = \\neg(\\neg A \\cup \\neg B)$
1. La primera Llei de De Morgan estableix que el complementari d'una unió de dos conjunts qualssevol $X$ i $Y$ és igual a la intersecció dels seus complementaris:
$$
\\neg(X \\cup Y) = \\neg X \\cap \\neg Y
$$
2. Si prenem $X = \\neg A$ i $Y = \\neg B$:
$$
\\neg(\\neg A \\cup \\neg B) = \\neg(\\neg A) \\cap \\neg(\\neg B)
$$
3. Aplicant la propietat de doble complementari ($\\neg(\\neg A) = A$ i $\\neg(\\neg B) = B$):
$$
\\neg(\\neg A \\cup \\neg B) = A \\cap B \\quad \\blacksquare
$$

### 2.2. Verificació de $A \\cup B = \\neg(\\neg A \\cap \\neg B)$
1. La segona Llei de De Morgan estableix que el complementari d'una intersecció és igual a la unió dels seus respectius complementaris:
$$
\\neg(X \\cap Y) = \\neg X \\cup \\neg Y
$$
2. Substituint $X = \\neg A$ i $Y = \\neg B$:
$$
\\neg(\\neg A \\cap \\neg B) = \\neg(\\neg A) \\cup \\neg(\\neg B)
$$
3. Per la propietat d'involució:
$$
\\neg(\\neg A \\cap \\neg B) = A \\cup B \\quad \\blacksquare
$$

> **Conclusió lògica**: La intersecció d'esdeveniments es pot expressar en termes exclusius d'unió i complementació, i viceversa. En termes d'àlgebra de Boole: $A \\cdot B = \\overline{\\overline{A} + \\overline{B}}$ i $A + B = \\overline{\\overline{A} \\cdot \\overline{B}}$.`
};
