import type { Solution } from '../../../solutions';

export const ex3_5: Solution = {
  id: 'M1-T3-Ex3.5',
  title: 'Exercici 3.5: Connectant Components Eulerians',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Sigui $G$ un graf que té exactament dos components connexos que són eulerians. Trobeu el mínim nombre d'arestes que cal afegir per obtenir un graf eulerià.`,
  content: `
Perquè un graf sigui eulerià, ha de complir dues condicions:
1. Ser **connex**.
2. Que tots els seus vèrtexs tinguin **grau parell**.

### Anàlisi Inicial
Tenim dos components connexos $C_1$ i $C_2$. Com que ambdós són eulerians per separat, tots els seus vèrtexs tenen grau parell. El problema és que el graf global **no és connex**.

---

### Intent amb 1 aresta
Si afegim una sola aresta $e = (u, v)$ amb $u \\in C_1$ i $v \\in C_2$:
- El graf passa a ser **connex**.
- Però els vèrtexs $u$ i $v$ passen a tenir **grau senar** (parell + 1).

:::graph{height=150}
\`\`\`json
{
  "nodes": [
    { "id": "u", "label": "u (C1)", "color": "#3b82f6", "x": 100, "y": 75 },
    { "id": "v", "label": "v (C2)", "color": "#ef4444", "x": 300, "y": 75 }
  ],
  "links": [
    { "source": "u", "target": "v", "label": "+1 (imparell!)", "color": "#f59e0b" }
  ]
}
\`\`\`
:::

---

### Cas A: Algun component NO és complet (3 arestes)

Si $C_2$ no és complet, podem trobar dos vèrtexs $v_1, v_2 \\in C_2$ que **no** estiguin connectats entre ells. Aleshores afegim un "triangle" que connecti els components:
1. $(u, v_1)$
2. $(u, v_2)$
3. $(v_1, v_2)$ (aresta nova interna a $C_2$)

Així, $u, v_1, v_2$ augmenten el seu grau en 2 i es mantenen parells.

:::graph{height=180}
\`\`\`json
{
  "nodes": [
    { "id": "u", "label": "u (C1)", "color": "#3b82f6", "x": 100, "y": 90 },
    { "id": "v1", "label": "v1 (C2)", "color": "#ef4444", "x": 300, "y": 50 },
    { "id": "v2", "label": "v2 (C2)", "color": "#ef4444", "x": 300, "y": 130 }
  ],
  "links": [
    { "source": "u", "target": "v1" },
    { "source": "u", "target": "v2" },
    { "source": "v1", "target": "v2", "label": "nova", "dash": [5, 5] }
  ]
}
\`\`\`
:::

### Cas B: Ambdós components SÓN complets (4 arestes)

Si $C_1$ i $C_2$ ja són grafs complets, no podem afegir cap aresta interna. Per mantenir la paritat, hem d'afegir arestes entre parelles de vèrtexs diferents dels dos components (una "creu" o rectangle):
1. $(u_1, v_1)$ i $(u_1, v_2)$
2. $(u_2, v_1)$ i $(u_2, v_2)$

Tots quatre vèrtexs augmenten el seu grau en 2.

:::graph{height=180}
\`\`\`json
{
  "nodes": [
    { "id": "u1", "label": "u1", "color": "#3b82f6", "x": 100, "y": 50 },
    { "id": "u2", "label": "u2", "color": "#3b82f6", "x": 100, "y": 130 },
    { "id": "v1", "label": "v1", "color": "#ef4444", "x": 300, "y": 50 },
    { "id": "v2", "label": "v2", "color": "#ef4444", "x": 300, "y": 130 }
  ],
  "links": [
    { "source": "u1", "target": "v1" },
    { "source": "u1", "target": "v2" },
    { "source": "u2", "target": "v1" },
    { "source": "u2", "target": "v2" }
  ]
}
\`\`\`
:::
`,
  availableLanguages: ['ca']
};
