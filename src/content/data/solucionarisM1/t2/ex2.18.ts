import type { Solution } from '../../solutions';

export const ex2_18: Solution = {
  id: 'M1-T2-Ex2.18',
  title: 'Exercici 2.18: Diàmetre Mínim per Densitat Alta',
  author: 'Profe',
  code: '',
  type: 'notebook',
  statement: `Sigui $G$ un graf d'ordre $1001$ tal que cada vèrtex té grau $\\ge 500$. Demostreu que $G$ té diàmetre $\\le 2$.`,
  content: `
Aquest exercici es resol mitjançant una **reducció a l'absurd**. L'objectiu és demostrar que la densitat del graf (que cada node estigui connectat a gairebé la meitat dels altres) força que qualsevol parell de vèrtexs estigui a distància màxima 2.

::proofviz{proof="diameter_bound_dense"}

### Resum de la demostració:

1.  **Suposició per absurd:** Suposem que el diàmetre és $\ge 3$. Això implica que existeixen dos vèrtexs $u$ i $v$ tals que la seva distància mínima és 3 ($d(u,v) \ge 3$).
2.  **Conseqüències de la distància:**
    *   $u$ i $v$ no són adjacents ($d=1$).
    *   $u$ i $v$ no tenen cap veí en comú ($d=2$). És a dir, $N(u) \cap N(v) = \emptyset$.
3.  **Recompte de vèrtexs:**
    *   Tenim el propi vèrtex $\{u\}$.
    *   Tenim els seus veïns $N(u)$, que són com a mínim $500$.
    *   Tenim el propi vèrtex $\{v\}$.
    *   Tenim els seus veïns $N(v)$, que són com a mínim $500$.
4.  **Càlcul de l'ordre mínim:**
    Com que tots aquests conjunts són disjunts, el nombre total de vèrtexs $n$ ha de ser:
    $$ n \ge |\{u\}| + |\{v\}| + |N(u)| + |N(v)| \ge 1 + 1 + 500 + 500 = 1002 $$
5.  **Contradicció:**
    L'enunciat ens diu que $n = 1001$. Com que $1002 > 1001$, la nostra suposició inicial era falsa.

**Conclusió:** Per tant, no poden existir dos vèrtexs a distància 3 o superior. El diàmetre ha de ser $D(G) \le 2$. $\square$
  `,
  availableLanguages: ['ca']
};
