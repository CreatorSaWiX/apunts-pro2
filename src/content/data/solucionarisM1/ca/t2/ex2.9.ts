import type { Solution } from '../../solutions';

export const ex2_9: Solution = {
  id: 'M1-T2-Ex2.9',
  title: 'Exercici 2.9: Vèrtexs de tall i arestes pont',
  author: 'Profe',
  code: '',
  type: 'notebook',
  statement: `Trobeu tots els vèrtexs de tall i arestes pont dels grafs següents.`,
  content: `
**Foto exercici**

  | Graf | Vèrtexs de tall | Arestes pont |
| :---: | :---: | :---: |
| **$G_1$** | $\\emptyset$ | $\\emptyset$ |
| **$G_2$** | $\\emptyset$ | $\\emptyset$ |
| **$G_3$** | $\\{3, 6\\}$ | $(3, 6)$ |

<br/>

**Exercici mal fet**

:::graph{height=220}
\`\`\`json
{
  "nodes": [
    { "id": "1", "color": "#3b82f6" }, { "id": "5", "color": "#3b82f6" }, { "id": "6", "color": "#ef4444" },
    { "id": "2", "color": "#facc15" }, { "id": "4", "color": "#facc15" }, { "id": "3", "color": "#ef4444" }
  ],
  "links": [
    { "source": "1", "target": "5" }, { "source": "1", "target": "6" }, { "source": "5", "target": "6" },
    { "source": "2", "target": "4" }, { "source": "2", "target": "3" }, { "source": "4", "target": "3" },
    { "source": "3", "target": "6", "color": "#ef4444", "width": 4, "label": "Pont" }
  ]
}
\`\`\`
:::
<div class="text-xs text-center text-slate-400 mt-1 mb-4">Graf G₃: El node 3 i 6 són vitals (colls d'ampolla) encadenats pel pont letal (3,6)</div>
  `,
  availableLanguages: ['ca']
};
