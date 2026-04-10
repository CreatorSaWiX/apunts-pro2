import type { Solution } from '../../solutions';

export const ex1_26: Solution = {
   id: 'M1-T1-Ex1.26',
   title: 'Exercici 1.26: Grafs Autocomplementaris (Ordres Petits)',
   author: 'Profe',
   code: '',
   type: 'notebook',
   statement: `Un graf és *autocomplementari* si és isomorf al seu graf complementari. Demostreu que no hi ha grafs autocomplementaris d'ordre 3, però sí d'ordres 4 i 5.`,
   content: `
**Definició:** 
Un graf $G=(V, A)$ és autocomplementari si $G \\cong G^c$. Aquesta isomorfia requereix obligatòriament que tinguin exactament el mateix nombre d'arestes.

$ m(G) = m(G^c) = \\frac{1}{2} m_{K_n} = \\frac{n(n-1)}{4} $

*(La mida ha de ser un nombre enter estrictament)*.

**Casos a avaluar:**

1. **Ordre 3 ($n=3$):**
   $ m = \\frac{3(2)}{4} = 1.5 $
   El resultat és fraccional, ergo, **no existeix** cap graf autocomplementari per a $n=3$.

2. **Ordre 4 ($n=4$):**
   $ m = \\frac{4(3)}{4} = 3 \\text{ arestes} $
   Això s'assoleix amb el trajecte lineal: **$P_4$**.

3. **Ordre 5 ($n=5$):**
   $ m = \\frac{5(4)}{4} = 5 \\text{ arestes} $
   El polígon estrellat ho compleix on tot vèrtex actua amb grau de paral·lel equivalent i complementari. Model formatiu: el Cicle pur **$C_5$**.
`,
   availableLanguages: ['ca']
};
