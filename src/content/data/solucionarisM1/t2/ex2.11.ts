import type { Solution } from '../../solutions';

export const ex2_11: Solution = {
  id: 'M1-T2-Ex2.11',
  title: 'Exercici 2.11: Graf regular més petit amb pont',
  author: 'Profe',
  code: '',
  type: 'notebook',
  statement: `Trobeu el més petit $n$ tal que existeix un graf 3-regular d'ordre $n$ que té una aresta pont.`,
  content: `
Si tallem el pont, el graf es divideix en dos components (posem $C_1$ i $C_2$).
Dins de $C_1$, l'extrem del pont $u$ passa a tenir **grau 2**. L'altre $k-1$ vèrtexs de dins mantenen **grau 3** inicial.

Pel **Lema de les Encaixades** a dins de $C_1$, la suma és sempre parella:
$$ \\sum = 2 + 3(k-1) = \\textbf{Parell} \\implies 3(k-1) \\text{ és Parell}  \\implies k-1 \\text{ és Parell} \\implies k \\text{ és Senar} $$

Provem valors de $k$ (mida d'escamot o components separats per pont):
*   $k=1,3$: Impossible aconseguir les suficients arestes internes ($3$-regular dins de $k=3$ no dóna el pes). 
*   **$k=5$**: Funciona perfectament formant un sub-cicle intern ple amb una cruïlla menys d'on extreu un node amb grau restant 2, que tancarà amb el contrincant $v$. 

:::graph{height=220}
\`\`\`json
{
  "nodes": [
    { "id": "1", "color": "#3b82f6" }, { "id": "2", "color": "#3b82f6" }, { "id": "3", "color": "#3b82f6" }, { "id": "4", "color": "#3b82f6" }, { "id": "u", "color": "#ef4444" },
    { "id": "5", "color": "#facc15" }, { "id": "6", "color": "#facc15" }, { "id": "7", "color": "#facc15" }, { "id": "8", "color": "#facc15" }, { "id": "v", "color": "#ef4444" }
  ],
  "links": [
    { "source": "1", "target": "2" }, { "source": "2", "target": "3" }, { "source": "3", "target": "4" }, { "source": "4", "target": "1" }, { "source": "1", "target": "3" }, { "source": "u", "target": "2" }, { "source": "u", "target": "4" },
    { "source": "5", "target": "6" }, { "source": "6", "target": "7" }, { "source": "7", "target": "8" }, { "source": "8", "target": "5" }, { "source": "5", "target": "7" }, { "source": "v", "target": "6" }, { "source": "v", "target": "8" },
    { "source": "u", "target": "v", "color": "#10b981", "width": 4, "label": "Pont" }
  ]
}
\`\`\`
:::
<div class="text-xs text-center text-slate-400 mt-1 mb-4">Graf solució amb n = 10 vèrtexs (5 esquerra, 5 dreta reunits pel pont verd) on cadascun llança 3 línies (3-regular) exactament.</div>

**Mínim $n$ total:** $5 + 5 = \\textbf{10}$. $\\square$
  `,
  availableLanguages: ['ca']
};
