import type { Solution } from '../../solutions';

export const ex1_9: Solution = {
    id: 'M1-T1-Ex1.9',
    title: 'Exercici 1.9: Complementaris Regulars i Bipartits',
    author: 'Profe',
    code: '',
    type: 'notebook',
    statement: `Esbrineu si el complementari d'un graf regular és regular, i si el complementari d'un graf bipartit és bipartit. En cas afirmatiu, demostreu-ho; en cas negatiu, doneu un contraexemple.`,
    content: `
#### 1. El complementari d'un graf regular... és regular?
**RESPOSTA: SÍ.**

**Demostració:**
Si $G$ és $k$-regular d'ordre $n$, cada vèrtex té grau $k$.
En el graf complet $K_n$, cada vèrtex té grau $n-1$.
El grau d'un vèrtex $v$ en el complementari $G^c$ és:
$$
\g_{G^c}(v) = \g_{K_n}(v) - \g_{G}(v) = (n-1) - k
$$
Com que $n$, $1$ i $k$ són constants per a tots els vèrtexs, el nou grau és constant per a tothom.
Per tant, $G^c$ és $(n-1-k)$-regular.

---

#### 2. El complementari d'un graf bipartit... és bipartit?
**RESPOSTA: NO necessàriament.**

**Contraexemple ($K_{3,3}$):**
*   $G = K_{3,3}$ és bipartit (per definició).
*   El seu complementari $G^c$ consisteix en les arestes que falten.
    *   En $K_{3,3}$, els del grup A no es toquen entre ells. En $G^c$, SÍ que es tocaran (formaran un $K_3$).
    *   Els del grup B no es toquen entre ells. En $G^c$, SÍ que es tocaran (formaran un altre $K_3$).
*   Per tant, $G^c = K_3 \\cup K_3$ (dos triangles disjunts).
*   Un triangle ($K_3$) NO és bipartit (té cicle senar 3).
*   Per tant, $G^c$ no és bipartit.
        `,
    availableLanguages: ['ca']
};
