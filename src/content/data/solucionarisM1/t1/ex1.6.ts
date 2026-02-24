import type { Solution } from '../../solutions';

export const ex1_6: Solution = {
    id: 'M1-T1-Ex1.6',
    title: 'Exercici 1.6: Subgrafs Induïts',
    author: 'Profe',
    code: '',
    type: 'notebook',
    statement: `El graf $G$ té vèrtexs $V = \\{0..8\\}$. $u \\sim v \\iff |u-v| \\in \\{1, 4, 5, 8\\}$. Determineu ordre i mida de:

1. El subgraf induït pels parells.
2. El subgraf induït pels senars.
3. El subgraf induït per $\\{0, 1, 2, 3, 4\\}$.
4. Un subgraf generador amb màxim d'arestes sense cicles.`,
    content: `
Primer, llistem les adjacències. Dos números són amics si la seva diferència és 1, 4, 5 o 8.

*   0: 1, 4, 5, 8
*   1: 0, 2, 5, 6
*   2: 1, 3, 6, 7
*   3: 2, 4, 7, 8
*   4: 0, 3, 5, 8
*   5: 0, 1, 4, 6
*   6: 1, 2, 5, 7
*   7: 2, 3, 6, 8
*   8: 0, 3, 4, 7

#### 1) Subgraf induït pels vèrtexs PARELLS $\\{0, 2, 4, 6, 8\\}$
**Ordre**: 5 (són 5 números).
**Mida**: Comptem les arestes on *tots dos* siguin parells.
Mirem les diferències:
*   Diferència 1? Mai (parell - parell = parell).
*   Diferència 5? Mai.
*   Diferència 4? Sí. $4-0$, $6-2$, $8-4$.
*   Diferència 8? Sí. $8-0$.

Arestes:
*   (0,4), (0,8)
*   (2,6)
*   (4,8)
Total: 4 arestes.
**Resultat: Ordre 5, Mida 4.**

#### 2) Subgraf induït pels vèrtexs SENARS $\\{1, 3, 5, 7\\}$
**Ordre**: 4.
**Mida**: Diferències 4 o 8.
*   (1,5) (dif 4)
*   (3,7) (dif 4)
*   (5, ...9 no hi és)
Total: 2 arestes.
**Resultat: Ordre 4, Mida 2.**

#### 3) Subgraf induït per $\\{0, 1, 2, 3, 4\\}$
**Ordre**: 5.
**Mida**: Busquem arestes on $u,v \\in \\{0,1,2,3,4\\}$. Diferències 1 o 4 (5 i 8 massa grans per aquest conjunt petit).
*   Dif 1: (0,1), (1,2), (2,3), (3,4) $\\to$ 4 arestes.
*   Dif 4: (0,4) $\\to$ 1 aresta.
Total: 5 arestes.
**Resultat: Ordre 5, Mida 5.**
*(Forma un cicle $0-1-2-3-4-0$).*

#### 4) Subgraf generador, màxim d'arestes, sense cicles
Això té un nom: **Arbre generador**.
Un arbre amb $n$ vèrtexs sempre té **$n-1$ arestes**.
Com que $G$ original té $n=9$ vèrtexs, qualsevol subgraf generador tindrà ordre 9.
Si volem el màxim d'arestes sense fer cicles, hem de connectar-ho tot sense tancar camins.
Mida màxima = $9 - 1 = 8$.

**Resultat: Ordre 9, Mida 8.**
        `,
    availableLanguages: ['ca']
  };
