import type { Solution } from '../../solutions';

export const ex1_22: Solution = {
  id: 'M1-T1-Ex1.22',
  title: 'Exercici 1.22: Subgrafs i Isomorfia',
  author: 'Profe',
  code: '',
  type: 'notebook',
  statement: `Sigui $V = \\{a, b, c, d\\}$ i $A = \\{ab, ac, ad, dc\\}$. Determineu, llevat d'isomorfismes, tots els subgrafs del graf $G = (V, A)$.`,
  content: `
Analitzem el graf $G=(V,A)$ donat: $V = \\{a,b,c,d\\}$ i $A = \\{ab, ac, ad, dc\\}$.
$G$ és essencialment un triangle ($a, c, d$) amb una aresta penjant ($a, b$).

:::graph{height=200}
\`\`\`json
{
  "nodes": [{ "id": "a" }, { "id": "b" }, { "id": "c" }, { "id": "d" }],
  "links": [{ "source": "a", "target": "b" }, { "source": "a", "target": "c" }, { "source": "a", "target": "d" }, { "source": "d", "target": "c" }]
}
\`\`\`
:::

Un subgraf $H \\subseteq G$ s'obté eliminant arestes (o vèrtexs). Anem a classificar els subgrafs segons la seva mida $m$:

* **$m=0$**: Cap aresta. Forma **$4K_1$** (1 classe).
* **$m=1$**: Una única aresta. Tota aresta forma **$K_2 \\cup 2K_1$** (1 classe).
* **$m=2$**: 
   * Arestes que es toquen: Forma un **$P_3 \\cup K_1$**.
   * Arestes independents: Només la combinació $ab$ i $cd$ ho permet. Forma **$2K_2$**.
   *(2 classes)*
* **$m=3$**:
   * Si eliminem $ab$: Ens queda el triangle, **$K_3 \\cup K_1$**.
   * Si eliminem $cd$: El vèrtex $a$ connecta als altres tres, formant una estrella, **$K_{1,3}$**.
   * Si eliminem $ac$ o $ad$: Es trenca el triangle i queda un sender. Forma el trajecte de 4 vèrtexs, **$P_4$**.
   *(3 classes)*
* **$m=4$**: El graf sencer, **$G$** original (1 classe).

**Classes d'isomorfisme generades:** $4K_1$, $K_2 \\cup 2K_1$, $P_3 \\cup K_1$, $2K_2$, $K_3 \\cup K_1$, $K_{1,3}$, $P_4$, $G$.
`,
  availableLanguages: ['ca']
};
