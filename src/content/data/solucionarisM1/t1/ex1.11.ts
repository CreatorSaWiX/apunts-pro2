import type { Solution } from '../../solutions';

export const ex1_11: Solution = {
    id: 'M1-T1-Ex1.11',
    title: 'Exercici 1.11: Propietats del Producte',
    author: 'Profe',
    code: '',
    type: 'notebook',
    statement: `Considereu els grafs $G_1 = (V_1, A_1)$ i $G_2 = (V_2, A_2)$. Doneu l'ordre, el grau dels vèrtexs i la mida de $G_1 \\times G_2$ en funció dels de $G_1$ i $G_2$.`,
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

**Idea:** ja sabem el grau de cada vèrtex (apartat 2). La mida és la meitat de la suma de tots els graus (Lema de les Encaixades: $\\sum \\text{grau} = 2M$).

**Exemple concret** — $K_2 \\times K_3$:
*   $K_2$: 2 vèrtexs {A, B}, 1 aresta, tots de grau 1.
*   $K_3$: 3 vèrtexs {1, 2, 3}, 3 arestes, tots de grau 2.
*   Producte: $2 \\times 3 = 6$ vèrtexs: (A,1), (A,2), (A,3), (B,1), (B,2), (B,3).

Grau de cada vèrtex (per l'apartat 2):

| Vèrtex | Grau $G_1$ + Grau $G_2$ | Total |
|--------|------------------------|-------|
| (A,1)  | 1 + 2 | 3 |
| (A,2)  | 1 + 2 | 3 |
| (A,3)  | 1 + 2 | 3 |
| (B,1)  | 1 + 2 | 3 |
| (B,2)  | 1 + 2 | 3 |
| (B,3)  | 1 + 2 | 3 |

Suma de tots els graus = $6 \\times 3 = 18$. Mida $= 18 / 2 = \\mathbf{9}$.

Comprovació amb la fórmula: $M = n_2 m_1 + n_1 m_2 = 3 \\cdot 1 + 2 \\cdot 3 = 3 + 6 = 9$ ✓

**Com s'arriba a la fórmula general?**

Fem exactament el mateix que a l'exemple, però amb lletres.

Sumem els graus de tots els vèrtexs $(u,v)$ — *a l'exemple, sumàvem els 6 valors de la taula*:
$$\\sum_{(u,v)} \\bigl(\\text{grau}_{G_1}(u) + \\text{grau}_{G_2}(v)\\bigr)$$

Ho separem en dues parts:

1. **Part de $G_1$** — *a l'exemple: fixem cada $v \\in \\{1,2,3\\}$ i sumem els graus d'A i B en $K_2$. Sumen $2m_1 = 2$, i ho fem $n_2 = 3$ vegades:*
$$n_2 \\cdot 2m_1 = 3 \\cdot 2 \\cdot 1 = 6$$

2. **Part de $G_2$** — *a l'exemple: fixem cada $u \\in \\{A,B\\}$ i sumem els graus de 1, 2, 3 en $K_3$. Sumen $2m_2 = 6$, i ho fem $n_1 = 2$ vegades:*
$$n_1 \\cdot 2m_2 = 2 \\cdot 2 \\cdot 3 = 12$$

Suma total de graus: $6 + 12 = 18$ — *coincideix amb la taula!* Dividim per 2:
$$\\boxed{M = n_2 m_1 + n_1 m_2 = 3 \\cdot 1 + 2 \\cdot 3 = 9}$$
        `,
    availableLanguages: ['ca']
};
