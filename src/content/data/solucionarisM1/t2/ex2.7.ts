import type { Solution } from '../../solutions';

export const ex2_7: Solution = {
  id: 'M1-T2-Ex2.7',
  title: 'Exercici 2.7: Extrems de Mida segons Components Connexos i Arbres',
  author: 'Profe',
  code: '',
  type: 'notebook',
  statement: `Sigui $G$ un graf d'ordre $n$ amb exactament $k$ components connexos. Demostreu que la mida de $G$ és més gran o igual que $n - k$.`,
  content: `
Aquest és un teorema clàssic que es demostra en dos simples passos analitzant el graf des de l'estructura més minimalista possible: els arbres.

**Intuïció visual:** Per connectar un component amb la mínima despesa d'arestes possible (sense cicles), formem un **arbre**, que sempre requereix exactament tantes arestes com vèrtexs menys u ($n_i - 1$).

:::graph{height=220}
\`\`\`json
{
  "nodes": [
    { "id": "1", "color": "#ef4444" }, { "id": "2", "color": "#ef4444" }, { "id": "3", "color": "#ef4444" },
    { "id": "4", "color": "#3b82f6" }, { "id": "5", "color": "#3b82f6" }, { "id": "6", "color": "#3b82f6" }, { "id": "7", "color": "#3b82f6" },
    { "id": "8", "color": "#facc15" }
  ],
  "links": [
    { "source": "1", "target": "2" }, { "source": "2", "target": "3" },
    { "source": "4", "target": "5" }, { "source": "5", "target": "6" }, { "source": "6", "target": "7" }
  ]
}
\`\`\`
:::
<div class="text-xs text-center text-slate-400 mt-1 mb-4">Exemple amb n=8 i k=3. Mínim d'arestes = (3-1) + (4-1) + (1-1) = 2 + 3 + 0 = 5. I efectivament 8 - 3 = 5.</div>

**1. L'estructura mínima d'un component**
Un component connex d'ordre $n_i$ assoleix el **mínim nombre d'arestes possible** únicament quan no té cicles, és a dir, quan adopta la forma d'un **arbre**.
Si el component és un arbre, la seva mida és exactament:
$$ m_i \\ge n_i - 1 $$

**2. Sumatori sobre els $k$ components**
Sigui $G$ desglossat en $k$ components independents d'ordres $n_1, n_2, \\dots, n_k$.
Sabem que la suma de tots els vèrtexs ens dona l'ordre total del graf: $\\sum_{i=1}^k n_i = n$.

Si sumem les arestes mínimes requerides per tots i cadascun dels components:
$$ m(G) = \\sum_{i=1}^k m_i \\ge \\sum_{i=1}^k (n_i - 1) $$

Si expandim el sumatori partint el parèntesi:
$$ m(G) \\ge \\left( \\sum_{i=1}^k n_i \\right) - \\left( \\sum_{i=1}^k 1 \\right) $$

Substituint el primer bloc per $n$ i el segon per sumar \`1\` exactament $k$ vegades:
$$ m(G) \\ge n - k $$
$\\square$
  `,
  availableLanguages: ['ca']
};
