import type { Solution } from '../../../solutions';

export const ex2_5: Solution = {
  id: 'M1-T2-Ex2.5',
  title: 'Exercici 2.5: Dos Vèrtexs Senars connectats per un Camí',
  author: 'Profe',
  code: '',
  type: 'notebook',
  statement: `Demostreu que si un graf té exactament dos vèrtexs de grau senar, aleshores existeix un camí que va d'un a l'altre.`,
  content: `
Sigui $G$ un graf amb exactament dos vèrtexs de grau senar: $x$ i $y$. Demostrem per **reducció a l'absurd** que estan connectats.

**Suposem que $x$ i $y$ estan en components diferents:**

:::graph{height=220}
\`\`\`json
{
  "nodes": [
    { "id": "x", "color": "#ef4444" },
    { "id": "a", "color": "#3b82f6" },
    { "id": "b", "color": "#3b82f6" },
    { "id": "c", "color": "#3b82f6" },
    { "id": "y", "color": "#ef4444" },
    { "id": "d", "color": "#facc15" },
    { "id": "e", "color": "#facc15" },
    { "id": "f", "color": "#facc15" }
  ],
  "links": [
    { "source": "x", "target": "a" }, { "source": "x", "target": "b" }, { "source": "x", "target": "c" },
    { "source": "a", "target": "b" }, { "source": "b", "target": "c" }, { "source": "c", "target": "a" },
    { "source": "y", "target": "d" }, { "source": "y", "target": "e" }, { "source": "y", "target": "f" },
    { "source": "d", "target": "e" }, { "source": "e", "target": "f" }, { "source": "f", "target": "d" }
  ]
}
\`\`\`
:::
<div class="text-xs text-center text-slate-400 mt-1 mb-4">Suposició: x (grau 3, senar) i y (grau 3, senar) en components separats.</div>

Mirem el component $C_x$ (blau) on viu $x$:

*   $x$ té grau **3 (senar)**.
*   Tots els altres nodes de $C_x$ ($a, b, c$) haurien de tenir grau **parell** (en el dibuix en tenen 3 per la mateixa paradoxa: **és impossible** dibuixar un component amb un sol node senar!).

Sumem els graus dins $C_x$:
$$
\\underbrace{3}_{x} + \\underbrace{\\text{Parell} + \\dots}_{\\text{resta}} = \\textbf{Senar}
$$

Però pel **Lema de les Encaixades de Mans**, la suma de graus ha de ser **parella**.

$$ \\textbf{Senar} \\neq \\textbf{Parell} \\implies \\text{Contradicció!} $$

La suposició era falsa: $x$ i $y$ **han de viure al mateix component**, per tant existeix un camí entre ells. $\\square$
  `,
  availableLanguages: ['ca']
};
