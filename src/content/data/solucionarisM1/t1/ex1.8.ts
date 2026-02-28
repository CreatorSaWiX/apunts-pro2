import type { Solution } from '../../solutions';

export const ex1_8: Solution = {
    id: 'M1-T1-Ex1.8',
    title: 'Exercici 1.8: Ordre i mida',
    author: 'Profe',
    code: '',
    type: 'notebook',
    statement: `Considereu un graf $G = (V, A)$ d'ordre $n$ i mida $m$. Siguin $v$ un vèrtex i $a$ una aresta de $G$. Doneu l'ordre i la mida de $G^c$, $G - v$ i $G - a$.`,
    content: `
*Notació: $n$ = nombre de vèrtexs (ordre), $m$ = nombre d'arestes (mida).*

#### 1. Complementari ($G^c$)
*   **Ordre**: $n$ (Manté els mateixos vèrtexs).
*   **Mida**: $\\binom{n}{2} - m$ (Té totes les arestes que NO té $G$).
    *   Recorda que $\\binom{n}{2} = \\frac{n(n-1)}{2}$ és la mida del graf complet $K_n$.

#### 2. Eliminar un vèrtex ($G - v$)
Quan mates un vèrtex, també mates totes les arestes que hi estan connectades (el seu grau).
*   **Ordre**: $n - 1$ (Hem tret un vèrtex).
*   **Mida**: $m - \\text{grau}(v)$ (Hem tret les arestes incidents a $v$).

#### 3. Eliminar una aresta ($G - a$)
Només tallem un cable. Els vèrtexs es queden igual.
*   **Ordre**: $n$ (Intacte).
*   **Mida**: $m - 1$ (Una aresta menys).
        `,
    availableLanguages: ['ca']
};
