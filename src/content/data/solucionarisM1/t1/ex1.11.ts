import type { Solution } from '../../solutions';

export const ex1_11: Solution = {
    id: 'M1-T1-Ex1.11',
    title: 'Exercici 1.11: Propietats del Producte',
    author: 'Profe',
    code: '',
    type: 'notebook',
    statement: `Considereu els grafs $G_1 = (V_1, A_1)$ i $G_2 = (V_2, A_2)$. Doneu l’ordre, el grau dels vèrtexs i la mida de $G_1 \\times G_2$ en funció dels de $G_1$ i $G_2$.`,
    content: `
Siguin:
*   $G_1$: Ordre $n_1$, Mida $m_1$.
*   $G_2$: Ordre $n_2$, Mida $m_2$.

### 1. Ordre (Vèrtexs)
El conjunt de vèrtexs és el producte cartesià $V_1 \\times V_2$.
Per tant, l'ordre és simplement el producte:
$$N = n_1 \\cdot n_2$$

### 2. Grau d'un vèrtex $(u, v)$
En el producte, un vèrtex $(u,v)$ està connectat a:
*   Veïns de $u$ en $G_1$ (fixant $v$). Aquests són $\g_{G_1}(u)$ veïns.
*   Veïns de $v$ en $G_2$ (fixant $u$). Aquests són $\g_{G_2}(v)$ veïns.

Total:
$$\g(u, v) = \g_{G_1}(u) + \g_{G_2}(v)$$

### 3. Mida (Arestes)
Podem usar el Lema de les Encaixades: $\sum \g = 2M$.
Sumem els graus de tots els $n_1 n_2$ vèrtexs del producte:

$$
\\sum_{(u,v)} (\g_{G_1}(u) + \g_{G_2}(v))
$$

Això es trenca en dues sumes:
1.  Per a cada $v \\in V_2$ (n'hi ha $n_2$), sumem tots els graus de $G_1$ (que sumen $2m_1$). $\\to n_2 \\cdot 2m_1$.
2.  Per a cada $u \\in V_1$ (n'hi ha $n_1$), sumem tots els graus de $G_2$ (que sumen $2m_2$). $\\to n_1 \\cdot 2m_2$.

Total suma graus: $2 n_2 m_1 + 2 n_1 m_2$.
La mida $M$ és la meitat:
$$M = n_2 m_1 + n_1 m_2$$
        `,
    availableLanguages: ['ca']
};
