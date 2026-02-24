import type { Solution } from '../../solutions';

export const ex1_18: Solution = {
    id: 'M1-T1-Ex1.18',
    title: 'Exercici 1.18: Fita de la Mida',
    author: 'Profe',
    code: '',
    type: 'notebook',
    statement: `Demostreu que en un graf bipartit d'ordre $n$ la mida és menor o igual que $n^2/4$.`,
    content: `
Sigui un graf bipartit complet $K_{n_1, n_2}$ amb $n_1 + n_2 = n$.
La mida d'un graf bipartit és màxima quan és complet ($K_{n_1, n_2}$).
En aquest cas, la mida és $m = n_1 \\cdot n_2$.

Volem maximitzar el producte $n_1 \\cdot n_2$ subjecte a $n_1 + n_2 = n$.
Substituint $n_2 = n - n_1$:
$$f(n_1) = n_1 (n - n_1) = n \\cdot n_1 - n_1^2$$
Aquesta és una paràbola invertida. El màxim s'assoleix quan $n_1 = n/2$.

*   Si $n$ és parell, $n_1 = n_2 = n/2$.
    *   Màxima mida: $(n/2) \\cdot (n/2) = n^2 / 4$.
*   Si $n$ és senar, $n_1 = (n-1)/2$ i $n_2 = (n+1)/2$ (els enters més propers a $n/2$).
    *   Màxima mida: $\\frac{n-1}{2} \\cdot \\frac{n+1}{2} = \\frac{n^2 - 1}{4}$.
    *   Com que $\\frac{n^2 - 1}{4} < \\frac{n^2}{4}$, la desigualtat $m \\le n^2/4$ es compleix sempre.

**Conclusió:**
La mida màxima d'un graf bipartit es dóna quan les dues particions són el més equilibrades possible. En qualsevol cas, mai supera $n^2/4$.
        `,
    availableLanguages: ['ca']
  };
