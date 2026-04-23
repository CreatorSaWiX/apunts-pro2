import type { Solution } from '../../../solutions';

export const ex2_2: Solution = {
  id: 'M1-T2-Ex2.2',
  title: 'Exercici 2.2: Camí en Graf de Grau Mínim',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Demostreu que si $G$ és un graf de grau mínim $d$, aleshores $G$ conté un camí de longitud $d$.`,
  content: `
Sigui $P = v_0 v_1 \\dots v_k$ un **camí de longitud màxima** dins $G$.

1. Com que $P$ és màxim, **tots els veïns de $v_k$ pertanyen a $P$**. Si existís un veí $x \\notin P$, podríem allargar $P$ amb $x$, contradient que és màxim.

2. Per hipòtesi, $\\text{grau}(G) = d$, és a dir $v_k$ té com a mínim $d$ veïns. Tots dins $\\{v_0, \\dots, v_{k-1}\\}$.

3. Per tant, $k \\ge d$, i $P$ té longitud $\\ge d$. $\\square$

:::graph{height=200}
\`\`\`json
{
  "nodes": [
    { "id": "v₀" },
    { "id": "v₁" },
    { "id": "..." },
    { "id": "vₖ₋₁" },
    { "id": "vₖ", "color": "#ef4444" }
  ],
  "links": [
    { "source": "v₀", "target": "v₁" },
    { "source": "v₁", "target": "..." },
    { "source": "...", "target": "vₖ₋₁" },
    { "source": "vₖ₋₁", "target": "vₖ" },
    { "source": "vₖ", "target": "v₀", "color": "#facc15", "width": 2, "label": "≥d veïns" },
    { "source": "vₖ", "target": "v₁", "color": "#facc15", "width": 2 }
  ]
}
\`\`\`
:::
<div class="text-xs text-center text-slate-400 mt-1 mb-4">vₖ no pot sortir de P → tots els seus ≥d veïns estan dins el camí → longitud ≥ d.</div>
  `,
  availableLanguages: ['ca']
};
