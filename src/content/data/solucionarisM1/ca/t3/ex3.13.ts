import type { Solution } from '../../../solutions';

export const ex3_13: Solution = {
  id: 'M1-T3-Ex3.13',
  title: 'Exercici 3.13: Graus en Grafs Hamiltonians',
  author: 'Profe',
  code: '',
  type: 'notebook',
  statement: `Sigui $G$ un graf hamiltonià que no és un graf cicle. Demostreu que $G$ té almenys dos vèrtexs de grau $\ge 3$.`,
  content: `
Aquesta demostració és molt directa si utilitzem la definició de graf hamiltonià.

### Demostració

1. **Definició de Hamiltonià**: Per hipòtesi, $G$ és un graf hamiltonià. Això significa que $G$ conté un **cicle hamiltonià** $C$ que passa per tots els vèrtexs del graf exactament una vegada.
   - En aquest cicle $C$, cada vèrtex té exactament **grau 2**.
   - Per tant, en el graf original $G$, el grau de cada vèrtex ha de ser com a mínim 2 ($g_G(v) \\ge 2$).

2. **Graf no cicle**: També se'ns diu que $G$ **no és un graf cicle** ($G \\neq C_n$).
   - Si $G$ no és el cicle $C_n$, significa que $G$ ha de tenir, com a mínim, una aresta més que el cicle hamiltonià $C$.
   - Sigui $e = \\{u, v\\}$ una d'aquestes arestes "extres" que pertanyen a $G$ però no al cicle $C$.

3. **Anàlisi de graus**:
   - En el cicle $C$, els vèrtexs $u$ i $v$ ja tenien grau 2.
   - En afegir l'aresta extra $e = \\{u, v\\}$, el grau d'aquests dos vèrtexs augmenta en 1.
   - Així doncs: $g_G(u) \\ge 3$ i $g_G(v) \\ge 3$.

### Conclusió
Com que hem trobat almenys dos vèrtexs ($u$ i $v$) que tenen grau $\\ge 3$, la proposició queda demostrada.

---

### Exemple visual
Considereu un quadrat amb una diagonal. El quadrat és el cicle hamiltonià, i la diagonal és l'aresta extra que crea els vèrtexs de grau 3.

:::graph{height=180}
\`\`\`json
{
  "nodes": [
    { "id": "1", "color": "#ef4444" }, { "id": "2", "color": "#ef4444" },
    { "id": "3" }, { "id": "4" }
  ],
  "links": [
    { "source": "1", "target": "3" }, { "source": "3", "target": "4" }, { "source": "4", "target": "2" }, { "source": "2", "target": "1" },
    { "source": "1", "target": "2", "label": "Extra", "color": "#facc15", "width": 3 }
  ]
}
\`\`\`
:::
<div class="text-center text-xs text-slate-400 mt-2">Els nodes vermells tenen grau 3 degut a l'aresta extra groga.</div>
  `,
  availableLanguages: ['ca']
};
