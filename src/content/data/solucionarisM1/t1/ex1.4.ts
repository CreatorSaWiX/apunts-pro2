import type { Solution } from '../../solutions';

export const ex1_4: Solution = {
    id: 'M1-T1-Ex1.4',
    title: 'Exercici 1.4: Càlcul de Mides',
    author: 'Profe',
    code: '',
    type: 'notebook',
    statement: `Doneu la mida de:
        
1. Un graf $r$-regular d'ordre $n$.
2. Del graf bipartit complet $K_{r,s}$.`,
    content: `
### 1) Graf $r$-regular d'ordre $n$

Recordem el **Lema de les Encaixades**: $\\sum g(v) = 2m$.
En un graf $r$-regular, tots els $n$ vèrtexs tenen grau $r$.
Per tant, la suma de graus és $n \\cdot r$.

$$
n \\cdot r = 2m \\implies m = \\frac{n \\cdot r}{2}
$$

:::tip
Per això, si $n \\cdot r$ és senar, el graf no pot existir! (El lema diu que la suma ha de ser parella).
:::

### 2) Graf bipartit complet $K_{r,s}$

Tenim $r$ vèrtexs a l'Equip A i $s$ vèrtexs a l'Equip B.
Cada vèrtex de l'Equip A tira un cable a **cadascun** dels $s$ vèrtexs de l'Equip B.
Total de cables (arestes): $r$ vegades $s$.

$$
m = r \\cdot s
$$

També ho pots veure sumant graus:
*   Els $r$ vèrtexs tenen grau $s$. Suma: $r \\cdot s$.
*   Els $s$ vèrtexs tenen grau $r$. Suma: $s \\cdot r$.
*   Total suma: $2rs$. Dividit per 2: $rs$.
        `,
    availableLanguages: ['ca']
  };
