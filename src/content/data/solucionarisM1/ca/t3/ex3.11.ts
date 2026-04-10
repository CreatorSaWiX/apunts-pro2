import type { Solution } from '../../solutions';

export const ex3_11: Solution = {
  id: 'M1-T3-Ex3.11',
  title: 'Exercici 3.11: Hamiltonianitat en Bipartits Complets',
  author: 'Profe',
  code: '',
  type: 'notebook',
  statement: `Demostreu que un graf bipartit $K_{r,s}$ d'ordre $\\ge 3$ és hamiltonià si, i només si, $r = s$.`,
  content: `
Aquest exercici és una aplicació directa de la propietat demostrada a l'exercici 3.10, aplicada al cas específic dels grafs bipartits complets.

### Demostració ($\\implies$)
Suposem que $K_{r,s}$ és hamiltonià.
Com que $K_{r,s}$ és, per definició, un graf bipartit amb parts de mida $r$ i $s$, sabem per l'exercici 3.10 que perquè existeixi un cicle hamiltonià, les dues parts han de tenir el mateix nombre de vèrtexs.
Per tant, **$r = s$**.

### Demostració ($\\impliedby$)
Suposem que $r = s$. Volem veure si el graf $K_{r,r}$ és hamiltonià per a un ordre $\\ge 3$.
Si l'ordre és $\\ge 3$ i $r=s$, llavors $2r \\ge 3$, la qual cosa implica que **$r \\ge 2$**.

Podem provar-ho de dues maneres:

1. **Construcció explícita**:
   Siguin $V_1 = \\{u_1, u_2, \\dots, u_r\\}$ i $V_2 = \\{v_1, v_2, \\dots, v_r\\}$ les dues parts del graf. Com que és un graf bipartit complet, existeixen totes les arestes $(u_i, v_j)$.
   Podem construir el següent cicle que visita tots els vèrtexs:
   $$u_1 \\to v_1 \\to u_2 \\to v_2 \\to \\dots \\to u_r \\to v_r \\to u_1$$
   Aquest camí és un cicle vàlid perquè totes aquestes arestes existeixen a $K_{r,r}$ i passa exactament una vegada per cada vèrtex.

2. **Teorema de Dirac**:
   En el graf $K_{r,r}$, el nombre total de vèrtexs és $n = 2r$.
   El grau de cada vèrtex és exactament $g(v) = r$.
   La condició de Dirac diu que si $g(v) \\ge n/2$ per a tot vèrtex, el graf és hamiltonià:
   $$r \\ge \\frac{2r}{2} \\implies r \\ge r$$
   Com que la condició es compleix per a $n \\ge 3$ (que en el nostre cas vol dir $r \\ge 2$), el graf és hamiltonià.

### Conclusió
Un graf $K_{r,s}$ d'ordre $\\ge 3$ és hamiltonià si i només si les seves parts són iguals: **$r = s$**.

---

:::graph{height=200}
\`\`\`json
{
  "nodes": [
    { "id": "u1", "label": "u1", "color": "#3b82f6" },
    { "id": "u2", "label": "u2", "color": "#3b82f6" },
    { "id": "v1", "label": "v1", "color": "#ef4444" },
    { "id": "v2", "label": "v2", "color": "#ef4444" }
  ],
  "links": [
    { "source": "u1", "target": "v1", "color": "#10b981", "width": 3 },
    { "source": "v1", "target": "u2", "color": "#10b981", "width": 3 },
    { "source": "u2", "target": "v2", "color": "#10b981", "width": 3 },
    { "source": "v2", "target": "u1", "color": "#10b981", "width": 3 },
    { "source": "u1", "target": "v2", "opacity": 0.2 },
    { "source": "u2", "target": "v1", "opacity": 0.2 }
  ]
}
\`\`\`
:::
<div class="text-center text-xs text-slate-400 mt-2">Cicle hamiltonià (en verd) en un graf $K_{2,2}$ (un quadrat).</div>
  `,
  availableLanguages: ['ca']
};
