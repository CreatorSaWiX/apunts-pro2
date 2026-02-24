import type { Solution } from '../../solutions';

export const ex1_17: Solution = {
    id: 'M1-T1-Ex1.17',
    title: 'Exercici 1.17: Bipartit Regular',
    author: 'Profe',
    code: '',
    type: 'notebook',
    statement: `Sigui $G$ un graf bipartit d'ordre $n$ i regular de grau $d \\ge 1$. Quina és la mida de $G$? Pot ser que l'ordre de $G$ sigui senar?`,
    content: `
Sigui un graf bipartit amb partició $(V_1, V_2)$.
Com que és regular de grau $d$:
*   Cada vèrtex de $V_1$ té $d$ arestes. Totes van cap a $V_2$.
*   Cada vèrtex de $V_2$ té $d$ arestes. Totes venen de $V_1$.

El nombre total d'arestes ($m$) es pot comptar sumant els graus de $V_1$ (són exactament les arestes que surten de $V_1$):
$$m = |V_1| \\cdot d$$
I també sumant els graus de $V_2$:
$$m = |V_2| \\cdot d$$

Per tant:
$$|V_1| \\cdot d = |V_2| \\cdot d$$
Com que $d \\ge 1$, podem dividir per $d$:
$$|V_1| = |V_2|$$
Això vol dir que **les dues parts del graf bipartit tenen la mateixa mida**.

L'ordre total del graf és $n = |V_1| + |V_2| = |V_1| + |V_1| = 2|V_1|$.
Per tant, **$n$ ha de ser parell**.

**Respostes:**
1.  **Quina és la mida?** $m = \\frac{n}{2} \\cdot d$. (La meitat dels vèrtexs tenen grau $d$).
2.  **Pot ser l'ordre senar?** **No**. Ha de ser parell, perquè $V_1$ i $V_2$ han de tenir els mateixos vèrtexs per mantenir la regularitat.
        `,
    availableLanguages: ['ca']
  };
