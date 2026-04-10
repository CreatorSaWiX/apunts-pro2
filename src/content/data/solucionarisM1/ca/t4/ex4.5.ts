import type { Solution } from '../../../solutions';

export const ex4_5: Solution = {
  id: 'M1-T4-Ex4.5',
  title: 'Exercici 4.5: Seqüència de Graus i Arbres No Isomorfs',
  author: 'Antigravity',
  code: '',
  type: 'notebook',
  statement: `Sigui $T$ un arbre d'ordre 12 que té exactament 3 vèrtexs de grau 3 i exactament un vèrtex de grau 2.
1) Trobeu la seqüència de graus de $T$.
2) Trobeu dos arbres no isomorfs amb aquesta seqüència de graus.`,
  content: `
### 1) Trobeu la seqüència de graus de $T$

Sabem que $T$ és un arbre d'ordre $n=12$. Per tant, el nombre d'arestes és $m = n - 1 = 11$.
Utilitzant el lema de les encaixades, la suma dels graus dels vèrtexs és igual a $2m$:
$$\\sum_{v \\in V} d(v) = 2 \\times 11 = 22$$

Aleshores, és obvi que la **seqüència de graus** és:
$$(4, 3, 3, 3, 2, 1, 1, 1, 1, 1, 1, 1)$$

---

### 2) Trobeu dos arbres no isomorfs

Per trobar dos arbres no isomorfs amb aquesta seqüència de graus, podem canviar com es connecten els vèrtexs de grau $>1$ entre ells.

### Arbre A: Estel·lar (Centrat en el vèrtex de grau 4)
En aquest cas, el vèrtex de grau 4 connecta directament amb els tres de grau 3 i el de grau 2.

:::graph{height=250}
{
  "nodes": [
    { "id": "v4", "label": "4", "color": "#facc15" },
    { "id": "v3a", "label": "3", "color": "#3b82f6" },
    { "id": "v3b", "label": "3", "color": "#3b82f6" },
    { "id": "v3c", "label": "3", "color": "#3b82f6" },
    { "id": "v2", "label": "2", "color": "#10b981" },
    { "id": "l1", "label": "1" }, { "id": "l2", "label": "1" },
    { "id": "l3", "label": "1" }, { "id": "l4", "label": "1" },
    { "id": "l5", "label": "1" }, { "id": "l6", "label": "1" },
    { "id": "l7", "label": "1" }
  ],
  "links": [
    { "source": "v4", "target": "v3a" }, { "source": "v4", "target": "v3b" },
    { "source": "v4", "target": "v3c" }, { "source": "v4", "target": "v2" },
    { "source": "v3a", "target": "l1" }, { "source": "v3a", "target": "l2" },
    { "source": "v3b", "target": "l3" }, { "source": "v3b", "target": "l4" },
    { "source": "v3c", "target": "l5" }, { "source": "v3c", "target": "l6" },
    { "source": "v2", "target": "l7" }
  ]
}
:::

### Arbre B: Cadena central (Vèrtexs de grau > 1 alineats)
En aquest cas, formem un camí amb els vèrtexs de grau $>1$: $V_2 - V_3 - V_4 - V_3 - V_3$.

:::graph{height=250}
{
  "nodes": [
    { "id": "v2", "label": "2", "color": "#10b981" },
    { "id": "v3a", "label": "3", "color": "#3b82f6" },
    { "id": "v4", "label": "4", "color": "#facc15" },
    { "id": "v3b", "label": "3", "color": "#3b82f6" },
    { "id": "v3c", "label": "3", "color": "#3b82f6" },
    { "id": "l1", "label": "1" }, { "id": "l2", "label": "1" },
    { "id": "l3", "label": "1" }, { "id": "l4", "label": "1" },
    { "id": "l5", "label": "1" }, { "id": "l6", "label": "1" },
    { "id": "l7", "label": "1" }
  ],
  "links": [
    { "source": "v2", "target": "v3a" }, { "source": "v3a", "target": "v4" },
    { "source": "v4", "target": "v3b" }, { "source": "v3b", "target": "v3c" },
    { "source": "v2", "target": "l1" },
    { "source": "v3a", "target": "l2" },
    { "source": "v4", "target": "l3" }, { "source": "v4", "target": "l4" },
    { "source": "v3b", "target": "l5" },
    { "source": "v3c", "target": "l6" }, { "source": "v3c", "target": "l7" }
  ]
}
:::

Aquests dos arbres **no són isomorfs** (per exemple, a l'Arbre A el vèrtex de grau 4 està a distància 1 del de grau 2, mentre que a l'Arbre B estan a distància 2).
`,
  availableLanguages: ['ca']
};
