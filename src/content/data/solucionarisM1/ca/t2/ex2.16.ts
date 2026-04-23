import type { Solution } from '../../../solutions';

export const ex2_16: Solution = {
  id: 'M1-T2-Ex2.16',
  title: 'Exercici 2.16: Impacte del tall al Diàmetre',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Per a cadascuna de les relacions següents sobre el diàmetre, doneu un graf $G = (V, A)$ connex i un vèrtex $u \\in V$ que les satisfacin:\n1) $D(G) = D(G - u)$.\n2) $D(G) < D(G - u)$.\n3) $D(G) > D(G - u)$.`,
  content: `
L'eliminació d'un vèrtex pot afectar el diàmetre del graf depenent de si aquest vèrtex formava part dels camins més llargs o si servia de "drecera" entre els altres nodes.

**1) El diàmetre es manté igual**: $D(G) = D(G - u)$
*   **Exemple:** Un graf complet $G = K_4$ i qualsevol vèrtex $u$.
*   **Raonament:** En $K_4$, la distància entre qualsevol parell és $1$. Si eliminem $u$, ens queda $K_3$, on la distància segueix sent $1$.

:::graph{height=150}
\`\`\`json
{
  "nodes": [
    { "id": "u", "color": "#ef4444" }, { "id": "1" }, { "id": "2" }, { "id": "3" }
  ],
  "links": [
    { "source": "u", "target": "1" }, { "source": "u", "target": "2" }, { "source": "u", "target": "3" },
    { "source": "1", "target": "2" }, { "source": "2", "target": "3" }, { "source": "3", "target": "1" }
  ]
}
\`\`\`
:::

**2) El diàmetre augmenta**: $D(G) < D(G - u)$
*   **Exemple:** El graf roda $G = W_7$ i el vèrtex central $u$.
*   **Raonament:** El vèrtex $u$ connecta a tothom ($D=2$). Sense ell, queda $C_6$ on el diàmetre puja a $3$.

:::graph{height=180}
\`\`\`json
{
  "nodes": [
    { "id": "u", "color": "#ef4444" },
    { "id": "1" }, { "id": "2" }, { "id": "3" }, { "id": "4" }, { "id": "5" }, { "id": "6" }
  ],
  "links": [
    { "source": "u", "target": "1" }, { "source": "u", "target": "2" }, { "source": "u", "target": "3" },
    { "source": "u", "target": "4" }, { "source": "u", "target": "5" }, { "source": "u", "target": "6" },
    { "source": "1", "target": "2" }, { "source": "2", "target": "3" }, { "source": "3", "target": "4" },
    { "source": "4", "target": "5" }, { "source": "5", "target": "6" }, { "source": "6", "target": "1" }
  ]
}
\`\`\`
:::

**3) El diàmetre disminueix**: $D(G) > D(G - u)$
*   **Exemple:** Un camí $G = P_4$ i un vèrtex extrem $u$.
*   **Raonament:** En $P_4$, la distància màxima és $3$. Si eliminem un extrem, el camí $P_3$ resultant té diàmetre $2$.

:::graph{height=120}
\`\`\`json
{
  "nodes": [
    { "id": "u", "color": "#ef4444" }, { "id": "1" }, { "id": "2" }, { "id": "3" }
  ],
  "links": [
    { "source": "u", "target": "1" }, { "source": "1", "target": "2" }, { "source": "2", "target": "3" }
  ]
}
\`\`\`
:::
  `,
  availableLanguages: ['ca']
};
