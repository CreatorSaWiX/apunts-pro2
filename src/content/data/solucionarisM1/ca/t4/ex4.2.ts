import type { Solution } from '../../../solutions';

export const ex4_2: Solution = {
  id: 'M1-T4-Ex4.2',
  title: 'Exercici 4.2: Arbre és Bipartit',
  author: 'Antigravity',
  code: '',
  type: 'notebook',
  statement: `Proveu que tot arbre d'ordre $n \\ge 2$ és un graf bipartit.`,
  content: `
Recordem dues definicions clau del Tema 4:
1.  **Arbre**: Un graf **connex** i **acíclic** (que no conté cap cicle).
2.  **Graf bipartit**: Un graf és bipartit si, i només si, **no conté cap cicle de longitud senar**.

Com que un arbre és acíclic per definició, no conté **cap cicle** (ni parell, ni senar). 

Per tant:
- Si no té cap cicle, en particular no té cicles de longitud senar.
- Si no té cicles de longitud senar, compleix el criteri necessari i suficient per ser un graf bipartit. $\\square$

:::graph{height=300}
{
  "nodes": [
    { "id": "0", "label": "Arrel", "color": "#facc15" },
    { "id": "1", "color": "#10b981" },
    { "id": "2", "color": "#10b981" },
    { "id": "3", "color": "#facc15" },
    { "id": "4", "color": "#facc15" },
    { "id": "5", "color": "#facc15" },
    { "id": "6", "color": "#10b981" }
  ],
  "links": [
    { "source": "0", "target": "1" },
    { "source": "0", "target": "2" },
    { "source": "1", "target": "3" },
    { "source": "1", "target": "4" },
    { "source": "2", "target": "5" },
    { "source": "5", "target": "6" }
  ]
}
:::
`,
  availableLanguages: ['ca']
};
