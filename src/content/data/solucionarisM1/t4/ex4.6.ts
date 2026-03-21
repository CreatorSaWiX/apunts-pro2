import type { Solution } from '../../solutions';

export const ex4_6: Solution = {
  id: 'M1-T4-Ex4.6',
  title: 'Exercici 4.6: Graf no arbre amb vèrtexs de tall',
  author: 'Antigravity',
  code: '',
  type: 'notebook',
  statement: `Trobeu un graf connex tal que tot vèrtex de grau $\\ge 2$ sigui de tall però no sigui arbre.`,
  content: `
Perquè un graf **no sigui un arbre**, ha de contenir almenys un cicle. 

Tanmateix, en un cicle simple ($C_n$), cap vèrtex és de tall (si n'eliminem un, la resta segueix connectada per un camí). Per aconseguir que els vèrtexs del cicle siguin de tall, hem d'afegir-hi vèrtexs "penjants" (fulles).

Un exemple és un **triangle ($C_3$) on cada vèrtex té una fulla adjacent**:

:::graph{height=250}
{
  "nodes": [
    { "id": "v0", "label": "3", "color": "#facc15" },
    { "id": "v1", "label": "3", "color": "#facc15" },
    { "id": "v2", "label": "3", "color": "#facc15" },
    { "id": "l0", "label": "1" },
    { "id": "l1", "label": "1" },
    { "id": "l2", "label": "1" }
  ],
  "links": [
    { "source": "v0", "target": "v1" },
    { "source": "v1", "target": "v2" },
    { "source": "v2", "target": "v0" },
    { "source": "v0", "target": "l0" },
    { "source": "v1", "target": "l1" },
    { "source": "v2", "target": "l2" }
  ]
}
:::

**Comprovació:**
1.  **Connex**: Sí, ho és.
2.  **No és arbre**: Conté el cicle $\{v_0, v_1, v_2\}$.
3.  **Vèrtexs de grau $\\ge 2$**: Són $v_0, v_1, v_2$ (tots de grau 3).
4.  **Tots són de tall**: Sí, si eliminem $v_0$, la fulla $l_0$ queda aïllada. El mateix passa amb $v_1$ i $l_1$, i $v_2$ i $l_2$.
`,
  availableLanguages: ['ca']
};
