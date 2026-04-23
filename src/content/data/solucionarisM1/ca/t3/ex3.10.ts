import type { Solution } from '../../../solutions';

export const ex3_10: Solution = {
  id: 'M1-T3-Ex3.10',
  title: 'Exercici 3.10: Bipartits i Hamiltonians',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Demostreu que si un graf bipartit és hamiltonià, aleshores les parts estables tenen el mateix cardinal.`,
  content: `
Sigui $G = (V_1 \\cup V_2, E)$ un graf bipartit amb dues parts estables $V_1$ i $V_2$. Per definició de graf bipartit, no hi ha arestes entre vèrtexs de la mateixa part; totes les arestes connecten un vèrtex de $V_1$ amb un vèrtex de $V_2$.

1. **L'alternança**: Qualsevol camí o cicle en un graf bipartit ha d'alternar vèrtexs entre $V_1$ i $V_2$. És a dir, la seqüència de vèrtexs d'un camí seria:
   $$v_1 \\in V_1 \\to v_2 \\in V_2 \\to v_3 \\in V_1 \\to v_4 \\in V_2 \\dots$$

2. **Cicle hamiltonià**: Un cicle hamiltonià és un cicle que visita **tots** els vèrtexs del graf exactament una vegada. Suposem que el cicle té longitud $n$ (on $n$ és el nombre total de vèrtexs).

3. **Paritat i tancament**:
   - Perquè el cicle es pugui "tancar" (tornar al punt de partida), l'últim vèrtex ha d'estar en una part diferent de la del primer vèrtex.
   - Això implica que el cicle ha de tenir una longitud **parell**: $n = 2k$.
   - Dins d'aquest cicle de longitud $2k$, exactament la meitat dels vèrtexs hauran de pertànyer a $V_1$ i l'altra meitat a $V_2$.

4. **Conclusió**:
   - Com que el cicle visita tots els vèrtexs una sola vegada, tenim:
     $$|V_1| = k \\quad \\text{i} \\quad |V_2| = k$$
   - Per tant, **$|V_1| = |V_2|$**.

### Conseqüència pràctica
Si tenim un graf bipartit on una part té més vèrtexs que l'altra (com el $G_4$ de l'exercici anterior), podem afirmar immediatament que **no és hamiltonià**.

:::tip{title="Exemple ràpid"}
Un tauler d'escacs de $3 \\times 3$ és un graf bipartit amb 5 caselles negres i 4 blanques (o viceversa). Com que $|V_1| \\neq |V_2|$, és impossible fer un recorregut hamiltonià pel tauler.
:::
  `,
  availableLanguages: ['ca']
};
