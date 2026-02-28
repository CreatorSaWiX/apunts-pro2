import type { Solution } from '../../solutions';

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

### 2) $G_1, G_2$ bipartit $\\implies G_1 \\times G_2$ bipartit?

**Sí. Demostració:**

<details>
<summary><strong>Recomanació: llegir aquest exemple abans de la demostració</strong></summary>

<div style="display:none; justify-content:center; margin: 1rem 0;">
  <img src="/apunts/IMG_1449.JPG" alt="Explicació visual" style="max-width:420px; width:100%; border-radius:16px; border: 2px solid #334155; box-shadow: 0 4px 24px rgba(0,0,0,0.4);" />
</div>

- $G_1 = K_2$: vèrtexs A (part $X_1$) i B (part $Y_1$). Aresta A–B.
- $G_2 = K_2$: vèrtexs 1 (part $X_2$) i 2 (part $Y_2$). Aresta 1–2.

Partició del producte: $A = \\{(A,1),(B,2)\\}$, $B = \\{(A,2),(B,1)\\}$.

| Vèrtex | Part $G_1$ | Part $G_2$ | Part |
|--------|-----------|-----------|------|
| (A,1)  | $X_1$ | $X_2$ | ⬜ (Tots dos a X) |
| (A,2)  | $X_1$ | $Y_2$ | ⬛ (Un a X, un a Y) |
| (B,1)  | $Y_1$ | $X_2$ | ⬛ (Un a Y, un a X) |
| (B,2)  | $Y_1$ | $Y_2$ | ⬜ (Tots dos a Y) |

$K_2 \\times K_2 = C_4$ — totes les arestes van de ⬜ ($A$) a ⬛ ($B$):
:::graph
\`\`\`json
{
  "nodes": [
    { "id": "(A,1)", "color": "#e2e8f0" }, { "id": "(A,2)", "color": "#1e293b" },
    { "id": "(B,1)", "color": "#1e293b" }, { "id": "(B,2)", "color": "#e2e8f0" }
  ],
  "links": [
    { "source": "(A,1)", "target": "(B,1)" }, { "source": "(A,1)", "target": "(A,2)" },
    { "source": "(B,2)", "target": "(A,2)" }, { "source": "(B,2)", "target": "(B,1)" }
  ]
}
\`\`\`
:::

Bipartit ✓

</details>

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
