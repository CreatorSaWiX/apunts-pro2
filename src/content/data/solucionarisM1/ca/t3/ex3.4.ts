import type { Solution } from '../../../solutions';

export const ex3_4: Solution = {
  id: 'M1-T3-Ex3.4',
  title: 'Exercici 3.4: Eulerianitat en Bipartits Complets',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Trobeu els valors de $r$ i $s$ tals que el graf bipartit complet $K_{r,s}$ és eulerià.`,
  content: `
Per resoldre aquest exercici, hem d'aplicar el **Teorema d'Euler**: Un graf connex és eulerià si i només si tots els seus vèrtexs tenen grau parell.

En un graf bipartit complet $K_{r,s}$, tenim dos conjunts de vèrtexs, $V_1$ i $V_2$, amb $|V_1| = r$ i $|V_2| = s$.
- Cada vèrtex de $V_1$ està connectat amb **tots** els vèrtexs de $V_2$. Per tant, el grau de qualsevol vèrtex $v \\in V_1$ és $g(v) = s$.
- Cada vèrtex de $V_2$ està connectat amb **tots** els vèrtexs de $V_1$. Per tant, el grau de qualsevol vèrtex $w \\in V_2$ és $g(w) = r$.

Perquè el graf sigui eulerià, **tots** els graus han de ser parells:
1. Els vèrtexs de $V_1$ han de tenir grau parell $\\implies s$ ha de ser **parell**.
2. Els vèrtexs de $V_2$ han de tenir grau parell $\\implies r$ ha de ser **parell**.

El graf bipartit complet $K_{r,s}$ és eulerià si i només si **tant $r$ com $s$ són nombres parells**.

---

### Exemples visuals

::::grid{cols=2}

:::graph{height=200}
\`\`\`json
{
  "nodes": [
    { "id": "A1", "label": "d=2", "color": "#3b82f6" }, { "id": "A2", "label": "d=2", "color": "#3b82f6" },
    { "id": "B1", "label": "d=2", "color": "#ef4444" }, { "id": "B2", "label": "d=2", "color": "#ef4444" }
  ],
  "links": [
    { "source": "A1", "target": "B1" }, { "source": "A1", "target": "B2" },
    { "source": "A2", "target": "B1" }, { "source": "A2", "target": "B2" }
  ]
}
\`\`\`
:::

:::graph{height=200}
\`\`\`json
{
  "nodes": [
    { "id": "A1", "label": "d=3", "color": "#3b82f6" }, { "id": "A2", "label": "d=3", "color": "#3b82f6" },
    { "id": "B1", "label": "d=2", "color": "#ef4444" }, { "id": "B2", "label": "d=2", "color": "#ef4444" }, { "id": "B3", "label": "d=2", "color": "#ef4444" }
  ],
  "links": [
    { "source": "A1", "target": "B1" }, { "source": "A1", "target": "B2" }, { "source": "A1", "target": "B3" },
    { "source": "A2", "target": "B1" }, { "source": "A2", "target": "B2" }, { "source": "A2", "target": "B3" }
  ]
}
\`\`\`
:::

::::
  `,
  availableLanguages: ['ca']
};
