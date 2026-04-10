import type { Solution } from '../../solutions';

export const ex3_9: Solution = {
  id: 'M1-T3-Ex3.9',
  title: 'Exercici 3.9: Cicles Hamiltonians',
  author: 'Profe',
  code: '',
  type: 'notebook',
  statement: `A cadascun del grafs de l'exercici 3.1 trobeu-hi un cicle hamiltonià, o demostreu-ne la no existència.
  
  <img src="/src/assets/apunts/m1/T3Ex1.png" class="rounded-lg border border-slate-200 shadow-sm w-full max-w-2xl mx-auto my-4" />
  `,
  content: `
Recordem que un **cicle hamiltonià** és un camí tancat que visita **tots els vèrtexs** del graf exactament una vegada (excepte l'origen i el final que coincideixen). A diferència dels eulerians, no hi ha una condició de "graus" tan senzilla, però tenim algunes eines com la condició dels vèrtexs de tall.

### Anàlisi dels grafs

1. **$G_1$**: **És Hamiltonià**. Té 6 vèrtexs. El perímetre exterior amb alguns salts interiors permet formar el cicle fàcilment.
2. **$G_2$**: **És Hamiltonià**. És un prisma sobre un quadrat. Podem recórrer el quadrat exterior, baixar a l'interior i tornar a pujar.
3. **$G_3$**: **És Hamiltonià**. Similar a $G_2$, el fet de tenir arestes creuades a l'interior només dona més opcions.
4. **$G_4$**: **No és Hamiltonià**. 
   - Observem que és un graf bipartit. Si comptem els vèrtexs, tenim 2 vèrtexs "centrals" i 4 vèrtexs "externs". 
   - En un graf bipartit $(V_1, V_2)$, per tenir un cicle hamiltonià cal que $|V_1| = |V_2|$. Aquí tenim $2 \\neq 4$, per tant és impossible.
5. **$G_5$**: **És Hamiltonià**. Podem recórrer en ziga-zaga: avall a amunt, avall amunt..
6. **$G_6$**: **És Hamiltonià**. És una estructura molt simètrica (octaedre amb subdivisions).
7. **$G_7$**: **No és Hamiltonià**. 
   - Podem aplicar la **condició de tall de vèrtexs**: $c(G-S) \\le |S|$.
   - Si traiem els 3 vèrtexs que formen el triangle central (conjunt $S$), el graf es divideix en 4 components aïllades (els vèrtexs exteriors o les puntes).
   - Com que $4 > 3$, el graf no pot ser hamiltonià.
8. **$G_8$**: **És Hamiltonià**. Té molta densitat d'arestes. El node central es pot integrar en el recorregut fàcilment.
9. **$G_9$**: **És Hamiltonià**. És un prisma pentagonal. Es recorre com el cub: mig pentà exterior, baixem a l'interior, recorrem el pentà interior, pugem i acabem el pentà exterior.
10. **$G_{10}$**: **No és Hamiltonià**. 
    - Aquest és el **Graf de Petersen**. 
    - És un resultat clàssic de la teoria de grafs que el graf de Petersen és el graf hipohamiltonià més petit (si li traiem qualsevol vèrtex és hamiltonià, però ell mateix no ho és).

### Resum
| Graf | Hamiltonià? | Motiu / Prova |
| :--- | :--- | :--- |
| $G_1, G_2, G_3$ | **SÍ** | Es pot trobar el cicle per inspecció. |
| $G_4$ | **NO** | Bipartit amb subconjunts de mida desigual (2 vs 4). |
| $G_5$ | **SÍ** | Es pot trobar el cicle. |
| $G_6$ | **SÍ** | Estructura simètrica puntejada. |
| $G_7$ | **NO** | Condició de tall: c(G-S) > S amb S=3. |
| $G_8, G_9$ | **SÍ** | Existeixen cicles explícits. |
| $G_{10}$ | **NO** | Graf de Petersen (clàssic no-hamiltonià). |
  `,
  availableLanguages: ['ca']
};
