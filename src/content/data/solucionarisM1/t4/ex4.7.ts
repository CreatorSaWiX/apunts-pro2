import type { Solution } from '../../solutions';

export const ex4_7: Solution = {
  id: 'M1-T4-Ex4.7',
  title: 'Exercici 4.7: Fórmula de les Fulles',
  author: 'Antigravity',
  code: '',
  type: 'notebook',
  statement: `1) Sigui $T$ un arbre d'ordre $n \\ge 2$. Proveu que el nombre de fulles de $T$ és:
$$n_1 = 2 + \\sum_{g(u) \\ge 3} (g(u) - 2)$$
2) Sigui $\\Delta$ el grau màxim de $T$ i $n_i$ el nombre de vèrtexs de grau $i$. Vegeu que la fórmula anterior es pot escriure com:
$$n_1 = 2 + \\sum_{i=2}^{\\Delta} (i - 2) n_i$$
3) Sigui $G$ un graf connex on es compleix aquesta igualtat. Demostreu que $G$ és un arbre.`,
  content: `
### 1) Demostració de la fórmula de les fulles

En un arbre d'ordre $n$ i mida $m = n - 1$, usem les dues sumes bàsiques:
1.  **Ordre del graf ($n$)**: És el nombre total de vèrtexs, $n = |V|$.
2.  **Lema de les encaixades**: $\\sum_{u \\in V} g(u) = 2m = 2(n - 1) = 2n - 2$

Com que $2n$ és el mateix que sumar un 2 per cada vèrtex, podem escriure: $2n = \\sum_{u \\in V} 2$.

$$\\sum_{u \\in V} g(u) - \\sum_{u \\in V} 2 = -2 \\implies$$
$$\\sum_{u \\in V} (g(u) - 2) = -2$$

Ara separem el sumatori segons el grau dels vèrtexs:
- Per a les **fulles**: $g(u) - 2 = 1 - 2 = -1$.
- Per als **vèrtexs de grau 2**: $g(u) - 2 = 2 - 2 = 0$.
- Per als **vèrtexs de grau $\\ge 3$**: mantenim el terme $(g(u) - 2)$.

L'equació esdevé:
$$\\sum_{g(u)=1} (-1) + \\sum_{g(u)=2} (0) + \\sum_{g(u) \\ge 3} (g(u) - 2) = -2$$

Si $n_1 = n_{g(u)=1}$ (nombre de fulles, grau = 1):

$$\\underbrace{(-1) + (-1) + \\dots + (-1)}_{n_1 \\text{ vegades}} + \\sum_{g(u)=2} (0) + \\sum_{g(u) \\ge 3} (g(u) - 2) = -2 \\implies$$

$$-n_1 + 0 + \\sum_{g(u) \\ge 3} (g(u) - 2) = -2 \\implies$$
$$n_1 = 2 + \\sum_{g(u) \\ge 3} (g(u) - 2) \\quad \\square$$

---

### 2) Notació amb la suma de graus $n_i$

Podem reescriure el sumatori anterior utilitzant $n_i$ (nombre de vèrtexs de grau $i$):

$$\\sum_{g(u) \\ge 3} (g(u) - 2) = \\sum_{i=3}^{\\Delta} (i - 2) n_i$$

A més, com que el terme per $i=2$ és $(2 - 2) n_2 = 0$, podem incloure'l sense variar el resultat:

$$n_1 = 2 + \\sum_{i=2}^{\\Delta} (i - 2) n_i \\quad \\square$$

---

### 3) Demostració que $G$ és un arbre

Si el graf $G$ és connex i compleix la igualtat $n_1 = 2 + \\sum_{i=2}^{\\Delta} (i - 2) n_i$, podem desfer els passos anteriors:

$$n_1 - \\sum_{i=2}^{\\Delta} (i - 2) n_i = 2$$

$$n_1 + \\sum_{i=2}^{\\Delta} 2 n_i - \\sum_{i=2}^{\\Delta} i \\cdot n_i = 2$$

$$2(n_1 + \\sum_{i=2}^{\\Delta} n_i) - (n_1 + \\sum_{i=2}^{\\Delta} i \\cdot n_i) = 2$$

$$2n - \\sum_{v \\in V} d(v) = 2$$

Per tant, la suma de graus és $\\sum d(v) = 2n - 2$. 
Com que en qualsevol graf $\\sum d(v) = 2m$, tenim que $2m = 2n - 2$, és a dir, **$m = n - 1$**.

Un graf **connex** amb **$n - 1$ arestes** és, per definició, un **arbre**. $\\square$
`,
  availableLanguages: ['ca']
};
