import type { Solution } from '../../../solutions';

export const ex4_15: Solution = {
  id: 'M1-T4-Ex4.15',
  title: 'Exercici 4.15: Fulles del Spanning Tree i Vèrtexs de Tall',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Demostreu que si $T$ és un arbre generador de $G$, aleshores les fulles de $T$ no són vèrtexs de tall de $G$. Conclogueu que tot graf connex d'ordre $n \\ge 2$ té almenys dos vèrtexs que no són vèrtexs de tall.`,
  content: `
Si $T$ és un arbre generador d'un graf connex $G$, i sia $v$ una fulla de $T$. Volem veure que $G - v$ és connex (és a dir, que $v$ no és un vèrtex de tall).

:::graph{height=250}
{
  "nodes": [
    { "id": "v1", "label": "Fulla T", "color": "#10b981" },
    { "id": "v2", "label": "Tall ?", "color": "#f87171" },
    { "id": "v3" },
    { "id": "v4", "label": "Fulla T", "color": "#10b981" }
  ],
  "links": [
    { "source": "v1", "target": "v2", "color": "#fbbf24", "width": 4 },
    { "source": "v2", "target": "v3", "color": "#fbbf24", "width": 4 },
    { "source": "v3", "target": "v4", "color": "#fbbf24", "width": 4 },
    { "source": "v1", "target": "v3", "label": "Extra G", "dash": [5, 5] },
    { "source": "v2", "target": "v4", "label": "Extra G", "dash": [5, 5] }
  ]
}
:::

1.  Com que $v$ és una fulla de l'arbre $T$, sabem que el subgraf $T - v$ és connex (eliminar una fulla d'un arbre sempre dóna lloc a un altre arbre).
2.  L'arbre generador $T$ conté tots els vèrtexs de $G$. Per tant, $T - v$ conté tots els vèrtexs del graf $G - v$.
3.  $T - v$ és un subgraf de $G - v$ (ja que les arestes de l'arbre són arestes del graf original).
4.  Si un subgraf ($T-v$) que conté tots els vèrtexs és connex, llavors el graf que el conté ($G-v$) també ha de ser **connex**.

En conseqüència, el vèrtex $v$ **no és un vèrtex de tall** de $G$.

### Conclusió

- Tot graf connex $G$ d'ordre $n \\ge 2$ té almenys un arbre generador $T$.
- Qualsevol arbre d'ordre $n \\ge 2$ té, com a mínim, **dues fulles**.
- Com hem demostrat, cada fulla d'un arbre generador és un vèrtex que no és de tall per al graf original.

Per tant, tot graf connex d'ordre $n \\ge 2$ té **almenys dos vèrtexs** que no són vèrtexs de tall. $\\square$
`,
  availableLanguages: ['ca']
};
