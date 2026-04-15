import type { Solution } from '../../../solutions';

export const ex4_12: Solution = {
  id: 'M1-T4-Ex4.12',
  title: 'Exercici 4.12: Arbres generadors de C_n i K_{2,r}',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `1) Calculeu el nombre d'arbres generadors diferents del graf cicle $C_n$. Quants n'hi ha llevat isomorfismes?
2) Calculeu el nombre d'arbres generadors diferents del graf bipartit complet $K_{2,r}$. Quants n'hi ha llevat isomorfismes?`,
  content: `
### 1) Graf Cicle $C_n$

- **Nombre d'arbres generadors diferents**:
Un graf cicle $C_n$ té $n$ vèrtexs i $n$ arestes. Un arbre generador ha de tenir $n - 1$ arestes i no tenir cicles. Per tant, l'única manera d'obtenir un arbre generador és eliminant exactament **una aresta** del cicle. Com que hi ha $n$ arestes possibles per triar, hi ha **$n$ arbres generadors diferents**.

- **Llevat isomorfismes**:
Qualsevol arbre obtingut eliminant una aresta d'un cicle $C_n$ és un graf camí $P_n$ d'ordre $n$. Com que tots els vèrtexs d'un cicle són equivalents per simetria, tots aquests arbres són isomorfs entre si. Per tant, només hi ha **1** arbre generador llevat isomorfismes.

---

### 2) Graf Bipartit Complet $K_{2,r}$

- **Nombre d'arbres generadors diferents**:
Podem utilitzar la fòrmula general per al nombre d'arbres generadors d'un graf bipartit complet $K_{n_1, n_2}$, que és $n_1^{n_2-1} \\cdot n_2^{n_1-1}$.
En aquest cas, $n_1 = 2$ i $n_2 = r$:
$$\\tau(K_{2,r}) = 2^{r-1} \\cdot r^{2-1} = \\mathbf{r \\cdot 2^{r-1}}$$

- **Llevat isomorfismes**:
Siguin $A, B$ els dos vèrtexs de la partició de mida 2, i $\{v_1, \\dots, v_r\}$ els vèrtexs de la partició de mida $r$. Qualsevol arbre generador ha de connectar $A$ i $B$ a través d'exactament un vèrtex $v_i$ (si es connectessin per més d'un, hi hauria un cicle).
Els altres $r-1$ vèrtexs de la partició de mida $r$ han d'estar connectats a $A$ o a $B$ com a fulles (només una aresta per no crear cicles).
Un arbre estarà determinat per quants d'aquests $r-1$ vèrtexs pengen d'un costat o de l'altre. Siga $k$ el nombre de vèrtexs fulla connectats a $A$, llavors hi haurà $(r-1-k)$ vèrtexs fulla connectats a $B$.
Dos arbres són isomorfs si tenen els mateixos graus per als vèrtexs $A$ i $B$ (que són intercanviables). Això equival a comptar quantes combinacions no ordenades del tipus $\{k, r-1-k\}$ podem fer, on $k \\in \\{0, 1, \\dots, r-1\\}$.

El nombre de classes d'isomorfisme és **$\\lceil r/2 \\rceil$**.
*(Exemple per $r=3$: conjunts $\{0, 2\}$ i $\{1, 1\}$, total 2).*
`,
  availableLanguages: ['ca']
};
