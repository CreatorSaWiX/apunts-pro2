import type { Solution } from '../../../solutions';

export const ex1_12: Solution = {
  id: 'M1-T1-Ex1.12',
  title: 'Exercici 1.12: Teoria de Productes',
  author: 'Profe',
  code: '',
  type: 'notebook',
  statement: `Proveu o refuteu les afirmacions següents:

1. Si $G_1$ i $G_2$ són grafs regulars, aleshores $G_1 \\times G_2$ és regular.
2. Si $G_1$ i $G_2$ són grafs bipartits, aleshores $G_1 \\times G_2$ és bipartit.`,
  content: `
### 1) $G_1, G_2$ regular $\\implies G_1 \\times G_2$ regular?

**Sí. Demostració:**
*   Si $G_1$ és $r_1$-regular, $\\forall u \\in V_1: \\text{grau}(u) = r_1$.
*   Si $G_2$ és $r_2$-regular, $\\forall v \\in V_2: \\text{grau}(v) = r_2$.
*   El grau en el producte: $\\text{grau}(u,v) = r_1 + r_2$ (constant per a tots els vèrtexs).
*   El producte és $(r_1+r_2)$-regular. $\\square$

**Exemple Visual ($K_3 \\times K_2$):**
A $K_3$ cada vèrtex té grau 2. A $K_2$ cada vèrtex té grau 1. El producte és un prisma triangular on cada vèrtex té grau $2+1=3$.

:::graph
\`\`\`json
{
  "nodes": [
    { "id": "A1", "label": "(A,1)", "group": 1 }, { "id": "B1", "label": "(B,1)", "group": 1 }, { "id": "C1", "label": "(C,1)", "group": 1 },
    { "id": "A2", "label": "(A,2)", "group": 2 }, { "id": "B2", "label": "(B,2)", "group": 2 }, { "id": "C2", "label": "(C,2)", "group": 2 }
  ],
  "links": [
    { "source": "A1", "target": "B1" }, { "source": "B1", "target": "C1" }, { "source": "C1", "target": "A1" },
    { "source": "A2", "target": "B2" }, { "source": "B2", "target": "C2" }, { "source": "C2", "target": "A2" },
    { "source": "A1", "target": "A2" }, { "source": "B1", "target": "B2" }, { "source": "C1", "target": "C2" }
  ]
}
\`\`\`
:::

### 2) $G_1, G_2$ bipartit $\\implies G_1 \\times G_2$ bipartit?

**Sí. Demostració:**

::proofviz{proof="bipartite_product"}


Com $G_1$ és bipartit, existeix una partició $V_1 = X_1 \\cup Y_1$ tal que totes les arestes de $G_1$ van de $X_1$ a $Y_1$.
Com $G_2$ és bipartit, existeix una partició $V_2 = X_2 \\cup Y_2$ tal que totes les arestes de $G_2$ van de $X_2$ a $Y_2$.

Definim la partició de $V_1 \\times V_2$:
$$A = (X_1 \\times X_2) \\cup (Y_1 \\times Y_2), \\quad B = (X_1 \\times Y_2) \\cup (Y_1 \\times X_2)$$

Sigui $\\{(u,v),(u',v')\\}$ una aresta del producte. Per definició, o bé $u \\sim u'$ amb $v = v'$, o bé $v \\sim v'$ amb $u = u'$:

*   **Cas 1** ($u \\sim u'$ en $G_1$, $v = v'$): Com $G_1$ és bipartit, $u \\in X_1$ i $u' \\in Y_1$ (o viceversa). Com $v = v'$, tots dos pertanyen a la mateixa part de $V_2$. Per tant, $(u,v)$ i $(u',v')$ pertanyen a parts oposades de $\\{A, B\\}$.
*   **Cas 2** ($v \\sim v'$ en $G_2$, $u = u'$): Simètricament, $v$ i $v'$ estan en parts oposades de $V_2$ i $u = u'$ no canvia. Per tant, $(u,v)$ i $(u',v')$ pertanyen a parts oposades.

En ambdós casos, els extrems de cada aresta pertanyen a parts distintes de $\\{A, B\\}$. Per tant, $G_1 \\times G_2$ és bipartit. $\\square$
        `,
  availableLanguages: ['ca']
};
