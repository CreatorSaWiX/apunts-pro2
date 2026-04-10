import type { Solution } from '../../solutions';

export const ex1_15: Solution = {
    id: 'M1-T1-Ex1.15',
    title: 'Exercici 1.15: Seqüències de Graus',
    author: 'Profe',
    code: '',
    type: 'notebook',
    statement: `Per a cadascuna de les seqüències següents, esbrineu si existeixen grafs d'ordre 5 de forma que els graus dels vèrtexs siguin els valors donats. Si existeixen, doneu-ne un exemple.

1.  3, 3, 2, 2, 2
2.  4, 4, 3, 2, 1
3.  4, 3, 3, 2, 2
4.  3, 3, 3, 2, 2
5.  3, 3, 3, 3, 2
6.  5, 3, 2, 2, 2`,
    content: `
Per verificar si una seqüència és gràfica, usem dues regles d'or:
1.  **Lema de les Encaixades**: La suma dels graus ha de ser **PARELLA** ($2m$).
2.  **Grau màxim**: Cap grau pot ser $\\ge n$ (si és simple). En aquest cas, $n=5$, així que graus han de ser $\\le 4$.
3.  **Teorema de Havel-Hakimi** (si calgués, per casos difícils).

Analitzem cas per cas ($n=5$):

**1) 3, 3, 2, 2, 2**
*   Suma: $3+3+2+2+2 = 12$ (Parell). OK.
*   Exemple: Un cicle $C_5$ té graus 2,2,2,2,2. Afegim una corda (aresta extra) entre dos vèrtexs no adjacents. Aquests dos passen a grau 3. Els altres es queden amb 2.
    *   **EXISTEIX**. ($C_5 +$ corda).

**2) 4, 4, 3, 2, 1**
*   Suma: $4+4+3+2+1 = 14$ (Parell). OK.
*   Exemple: Havel-Hakimi.
    *   Ordenem. 4,4,3,2,1.
    *   Trec 4 $\\to$ (resta 1 a 4,3,2,1) $\\to$ 3, 2, 1, 0.
    *   De 3,2,1,0 $\\to$ Trec 3 $\\to$ (resta 1 a 2,1,0) $\\to$ 1, 0, -1. **IMPOSSIBLE**.
    *   **NO EXISTEIX**.

**3) 4, 3, 3, 2, 2**
*   Suma: $4+3+3+2+2 = 14$ (Parell). OK.
*   Exemple: Vèrtex central connectat a tots 4 ($K_{1,4}$, graus 4,1,1,1,1). Afegim arestes als de fora.
    *   Connectem dos de fora (graus passen a 2,2).
    *   Connectem els altres dos de fora (graus passen a 2,2). Tenim 4, 2,2, 2,2. Encara falta.
    *   Havel-Hakimi: $4, 3, 3, 2, 2 \\xrightarrow{-4} 2, 2, 1, 1$. (Treu el 4, resta 1 als altres).
    *   $2, 2, 1, 1 \\xrightarrow{-2} 1, 0, 1 \\to$ Ordenat $1, 1, 0$.
    *   $1, 1, 0 \\xrightarrow{-1} 0, 0$. Possible!
    *   **EXISTEIX**.

**4) 3, 3, 3, 2, 2**
*   Suma: $3+3+3+2+2 = 13$. **IMPARELL**.
*   **NO EXISTEIX** (pel Lema de les Encaixades).

**5) 3, 3, 3, 3, 2**
*   Suma: $3+3+3+3+2 = 14$. (Parell). OK.
*   Exemple: Havel-Hakimi: $3, 3, 3, 3, 2 \\xrightarrow{-3} 2, 2, 2, 2$. (Trec un 3, en queden tres 2 i el 2 final).
    *   $2, 2, 2, 2$ és un cicle $C_4$. Existeix.
    *   **EXISTEIX**.

**6) 5, 3, 2, 2, 2**
*   Grau màxim 5 en un graf d'ordre 5?
*   Impossible. Com a molt pots tenir 4 veïns (els altres 4 vèrtexs). Graf simple no té llaços ni multiarestes.
*   **NO EXISTEIX** (Grau $\\ge n$).
        `,
    availableLanguages: ['ca']
};
