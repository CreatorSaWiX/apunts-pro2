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
#### 1) $G_1, G_2$ regular $\\implies G_1 \\times G_2$ regular?
**VERTADER.**

**Demostració:**
*   Si $G_1$ és $r_1$-regular, $\\forall u, \g(u) = r_1$.
*   Si $G_2$ és $r_2$-regular, $\\forall v, \g(v) = r_2$.
*   El grau en el producte és la suma: $\g(u,v) = r_1 + r_2$.
*   Com que $r_1$ i $r_2$ són constants, la suma també ho és.
*   El producte és $(r_1+r_2)$-regular.

---

#### 2) $G_1, G_2$ bipartit $\\implies G_1 \\times G_2$ bipartit?
**VERTADER.**

**Intuïció:**
En un graf bipartit, podem pintar els vèrtexs de blanc (0) i negre (1) de forma que les arestes només van de 0 a 1.
Definim el color d'un vèrtex $(u,v)$ al producte com la suma de paritats:
$$Color(u,v) = (Color_1(u) + Color_2(v)) \\pmod 2$$

**Vegem si funciona:**
Una aresta en el producte connecta $(u,v)$ amb $(u',v')$. Hi ha dos casos:
1.  **Aresta de tipus G1**: $u \\sim u'$ i $v=v'$.
    *   Com $G_1$ és bipartit, $Color_1(u) \\neq Color_1(u')$.
    *   Com $v=v'$, $Color_2(v) = Color_2(v')$.
    *   Per tant, la suma canvia de paritat. Els colors finals seran diferents.
2.  **Aresta de tipus G2**: $u=u'$ i $v \\sim v'$.
    *   Similarment, $Color_1$ es manté, $Color_2$ canvia. La suma canvia de paritat.

En tots els casos, els veïns tenen colors (paritats) diferents. Per tant, $G_1 \\times G_2$ és bipartit.
        `,
    availableLanguages: ['ca']
};
