import type { Solution } from '../../../solutions';

export const ex1_9: Solution = {
  id: 'M1-T1-Ex1.9',
  title: 'Exercici 1.9: Complementaris Regulars i Bipartits',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Esbrineu si el complementari d'un graf regular és regular, i si el complementari d'un graf bipartit és bipartit. En cas afirmatiu, demostreu-ho; en cas negatiu, doneu un contraexemple.`,
  content: `
### 1. El complementari d'un graf regular... és regular?

**Sí**. Si tots els vèrtexs tenen el mateix nombre d'amics en $G$, tots tindran el mateix nombre de *no-amics* en $G^c$. Com que tots perden el mateix, tots guanyen el mateix.

**Exemple concret** — Agafem el prisma triangular (6 vèrtexs, 3-regular):

:::graph
\`\`\`json
{
  "nodes": [{"id":1},{"id":2},{"id":3},{"id":4},{"id":5},{"id":6}],
  "links": [
    {"source":1,"target":2},{"source":2,"target":3},{"source":3,"target":1},
    {"source":4,"target":5},{"source":5,"target":6},{"source":6,"target":4},
    {"source":1,"target":4},{"source":2,"target":5},{"source":3,"target":6}
  ]
}
\`\`\`
:::

Cada vèrtex té grau 3. En $K_6$ cada vèrtex té grau 5. Per tant, en $G^c$ cada vèrtex tindrà grau $5 - 3 = 2$. Tots igual → **$G^c$ és 2-regular**

**Fórmula general:** Si $G$ és $k$-regular d'ordre $n$:
$$\\text{grau en } G^c = (n-1) - k$$

---

### 2. El complementari d'un graf bipartit... és bipartit?

**No necessàriament.**

**Contraexemple:** Agafem $K_{3,3}$: dos grups de 3 (A = {1,2,3}, B = {4,5,6}), tots connectats entre grups, ningú dins el mateix grup.

$G = K_{3,3}$ (bipartit):
:::graph
\`\`\`json
{
  "nodes": [
    {"id":1,"color":"#ef4444"},{"id":2,"color":"#ef4444"},{"id":3,"color":"#ef4444"},
    {"id":4,"color":"#3b82f6"},{"id":5,"color":"#3b82f6"},{"id":6,"color":"#3b82f6"}
  ],
  "links": [
    {"source":1,"target":4},{"source":1,"target":5},{"source":1,"target":6},
    {"source":2,"target":4},{"source":2,"target":5},{"source":2,"target":6},
    {"source":3,"target":4},{"source":3,"target":5},{"source":3,"target":6}
  ]
}
\`\`\`
:::

Ara calculem $G^c$ (les arestes que **falten** a $K_{3,3}$ per ser $K_6$):
- Dins del grup A (1,2,3): cap aresta en $G$ → **totes apareixen** en $G^c$: (1,2), (1,3), (2,3)
- Dins del grup B (4,5,6): cap aresta en $G$ → **totes apareixen** en $G^c$: (4,5), (4,6), (5,6)
- Entre A i B: totes hi eren a $G$ → **cap queda** en $G^c$

$G^c = K_3 \\cup K_3$ (dos triangles sense connexió entre ells):
:::graph
\`\`\`json
{
  "nodes": [
    {"id":1,"color":"#ef4444"},{"id":2,"color":"#ef4444"},{"id":3,"color":"#ef4444"},
    {"id":4,"color":"#3b82f6"},{"id":5,"color":"#3b82f6"},{"id":6,"color":"#3b82f6"}
  ],
  "links": [
    {"source":1,"target":2},{"source":2,"target":3},{"source":3,"target":1},
    {"source":4,"target":5},{"source":5,"target":6},{"source":6,"target":4}
  ]
}
\`\`\`
:::

Un triangle ($K_3$) **no és bipartit** perquè té un cicle de longitud 3 (senar). Per ser bipartit cal no tenir cicles senars. Per tant, $G^c$ **no és bipartit**. ✗
        `,
  availableLanguages: ['ca']
};
