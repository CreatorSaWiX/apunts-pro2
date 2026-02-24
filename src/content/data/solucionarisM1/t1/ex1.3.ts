import type { Solution } from '../../solutions';

export const ex1_3: Solution = {
    id: 'M1-T1-Ex1.3',
    title: 'Exercici 1.3: Regularitat i Bipartició',
    author: 'Profe',
    code: '',
    type: 'notebook',
    statement: `Esbrineu si els grafs complet ($K_n$), trajecte ($T_n$) i cicle ($C_n$) d'ordre $n$, amb $n \\ge 1$ o $n \\ge 3$ segons el cas, són bipartits i/o regulars.`,
    content: `
Anem a analitzar cada cas com si fóssim detectius.

#### 1. Graf Complet ($K_n$)
*   **Regular?** **SÍ**. Tothom està connectat a tothom. Grau $n-1$ per a tots.
*   **Bipartit?**
    *   Si $n=1$: Sí (sense arestes).
    *   Si $n=2$: Sí ($1-2$, un a cada equip).
    *   Si $n \\ge 3$: **NO**. Perquè $K_3$ és un triangle (cicle de longitud 3), i un graf amb un cicle senar mai pot ser bipartit. (Si jo sóc de l'equip A, el meu veí és del B, el seu veí de l'A... i si ens toquem jo i l'últim, hi ha conflicte!).

#### 2. Graf Trajecte ($T_n$)
*   **Regular?**
    *   Si $n=1$: Sí (grau 0).
    *   Si $n=2$: Sí (grau 1).
    *   Si $n \\ge 3$: **NO**. Els extrems tenen grau 1 i els interiors grau 2. No hi ha igualtat.
*   **Bipartit?** **SÍ, SEMPRE**.
    Podem pintar els vèrtexs alternativament: Blanc - Negre - Blanc - Negre... Mai es toquen dos del mateix color.

#### 3. Graf Cicle ($C_n, n \\ge 3$)
*   **Regular?** **SÍ**. Tots tenen exactament 2 veïns. És 2-regular.
*   **Bipartit?** Depèn de la paritat de $n$.
    *   Si $n$ és **parell** (ex: quadrat, hexàgon): **SÍ**. Podem alternar colors.
    *   Si $n$ és **senar** (ex: triangle, pentàgon): **NO**. Quan tornem a l'inici del cicle, els colors xoquin.
        `,
    availableLanguages: ['ca']
  };
