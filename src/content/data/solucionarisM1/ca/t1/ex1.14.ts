import type { Solution } from '../../solutions';

export const ex1_14: Solution = {
    id: 'M1-T1-Ex1.14',
    title: 'Exercici 1.14: Comptant Grafs',
    author: 'Profe',
    code: '',
    type: 'notebook',
    statement: `Considereu els grafs que tenen conjunt de vèrtexs $[7] = \\{1, 2, 3, 4, 5, 6, 7\\}$. Calculeu quants grafs n'hi ha ...

1. ... amb exactament 20 arestes.
2. ... en total.`,
    content: `
El conjunt de vèrtexs té mida $n=7$.
El nombre total de possibles arestes (parelles de vèrtexs) és:
$$
M_{max} = \\binom{n}{2} = \\binom{7}{2} = \\frac{7 \\cdot 6}{2} = 21
$$
Pots imaginar que tenim 21 interruptors, un per cada possible aresta. Cada interruptor pot estar encès (aresta existeix) o apagat (no existeix).

### 1) Amb exactament 20 arestes
Hem de triar quines 20 arestes activar de les 21 possibles.
Això és el mateix que triar *quina aresta deixar fora*.
$$
\\binom{21}{20} = \\binom{21}{1} = 21
$$

Hi ha **21** grafs amb 20 arestes. (Tots isomorfs a $K_7$ menys una aresta).

:::tip
**Visualització amb $K_3$** (versió petita del mateix problema)

$K_3$ té $\\binom{3}{2} = 3$ arestes possibles: {12, 13, 23}. Quants grafs d'ordre 3 tenen **exactament 2** arestes?

| Graf | 12 | 13 | 23 | 0 eliminat |
|------|----|----|----|------------|
| 1    |  1 |  1 |  0 | fora el 23 |
| 2    |  1 |  0 |  1 | fora el 13 |
| 3    |  0 |  1 |  1 | fora el 12 |

La **mateixa taula** demostra la igualtat $\\binom{3}{2} = \\binom{3}{1}$:

*   Llegint les columnes **12, 13, 23** → estàs **triant 2** per incloure = $\\binom{3}{2}$
*   Llegint la columna **"0 eliminat"** → estàs **triant 1** per excloure = $\\binom{3}{1}$

Són dos punts de vista sobre la **mateixa decisió** → la resposta ha de ser la mateixa: **3**.

**Al problema original**: 21 arestes, 20 activades → l'únic que canvia entre grafs és **quin 0 hi ha** → **21 grafs**.
:::

### 2) En total
Cada possible aresta pot estar present o no (2 opcions).
Com que tenim 21 possibles arestes, el nombre total de grafs és:
$$
2^{21} = 2.097.152
$$
Són més de 2 milions de grafs!
        `,
    availableLanguages: ['ca']
};
