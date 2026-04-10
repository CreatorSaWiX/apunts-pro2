import type { Solution } from '../../../solutions';

export const ex3_6: Solution = {
  id: 'M1-T3-Ex3.6',
  title: 'Exercici 3.6: Ponts i Graus Parells',
  author: 'Profe',
  code: '',
  type: 'notebook',
  statement: `Demostreu que un graf connex amb tots els vèrtexs de grau parell no té arestes pont.`,
  content: `
Ho demostrarem per reducció a l'absurd.
:::graph{height=200}
\`\`\`json
{
  "nodes": [
    { "id": "u", "label": "g(3)", "color": "#ef4444" },
    { "id": "v", "label": "g(3)", "color": "#ef4444" },
    { "id": "1", "label": "g(2)" },
    { "id": "2", "label": "g(2)" },
    { "id": "3", "label": "g(2)" },
    { "id": "4", "label": "g(2)" }
  ],
  "links": [
    { "source": "u", "target": "1" }, { "source": "1", "target": "2" }, { "source": "2", "target": "u" },
    { "source": "v", "target": "3" }, { "source": "3", "target": "4" }, { "source": "4", "target": "v" },
    { "source": "u", "target": "v", "label": "PONT", "color": "#facc15" }
  ]
}
\`\`\`
:::

Suposem que existeix un graf $G$ on tots els vèrtexs tenen grau parell, però el graf té almenys una **aresta pont** $e = (u, v)$.
Per definició de pont, si eliminem l'aresta $e$, el graf $G$ es divideix en dues components connexes separades, $G_1$ i $G_2$. Suposem que el vèrtex $u$ queda a $G_1$ i el vèrtex $v$ queda a $G_2$

Tots els vèrtexs de $G_1$ (excepte $u$) tenen exactament el mateix grau que tenien a $G$, ja que cap de les seves arestes ha estat eliminada. Per tant, el seu grau segueix sent **parell**.
El vèrtex $u$, però, ha perdut l'aresta $e$. El seu nou grau a $G_1$ és $g_{G_1}(u) = g_G(u) - 1$. Com que $g_G(u)$ era parell, ara $g_{G_1}(u)$ és **senar**.

**Contradicció**:
   - El lema de les encaixades diu que la suma dels graus dels vèrtexs de qualsevol graf ha de ser parell (és igual a $2|E|$).
   - A la component $G_1$, tenim un vèrtex de grau senar ($u$) i tota la resta de grau parell.
   - La suma de graus de $G_1$ seria: $\\text{Parell} + \\text{Parell} + \\dots + \\text{Senar} = \\mathbf{Senar}$.
   - Això és **impossible**.

Com que hem arribat a una contradicció, la nostra hipòtesi inicial era falsa. Per tant, un graf on tots els vèrtexs tenen grau parell **no pot tenir arestes pont**.
`,
  availableLanguages: ['ca']
};
