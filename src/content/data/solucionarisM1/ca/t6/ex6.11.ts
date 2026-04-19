import type { Solution } from '../../../solutions';

export const ex6_11: Solution = {
  id: 'M1-T6-Ex6.11',
  title: 'Exercici 6.11: Combinació Lineal amb Paràmetres',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Per a quins valors del paràmetre $a$ el vector $u = \\begin{pmatrix} 1 \\\\ 5 \\\\ a \\end{pmatrix}$ es pot escriure com a combinació lineal dels vectors del conjunt $T$?

$$T = \\left\\{ \\begin{pmatrix} 3 \\\\ 1 \\\\ -1 \\end{pmatrix}, \\begin{pmatrix} 0 \\\\ 7 \\\\ -1 \\end{pmatrix}, \\begin{pmatrix} -1 \\\\ 2 \\\\ 0 \\end{pmatrix} \\right\\}$$`,
  content: `
Perquè $u$ sigui combinació lineal dels vectors de $T$, el sistema d'equacions lineals format per la matriu ampliada $[v_1, v_2, v_3 | u]$ ha de ser compatible.

### Plantejament de la matriu ampliada

$$
\\left( \\begin{array}{ccc|c} 
3 & 0 & -1 & 1 \\\\
1 & 7 & 2 & 5 \\\\
-1 & -1 & 0 & a
\\end{array} \\right)
$$

### Escalonament mitjançant Gauss

1.  **Intercanviem la primera i la segona fila** per tenir un pivot d'unitat:

$$
\\left( \\begin{array}{ccc|c} 
1 & 7 & 2 & 5 \\\\
3 & 0 & -1 & 1 \\\\
-1 & -1 & 0 & a
\\end{array} \\right)
$$

2.  **Fem zeros sota el primer pivot** ($F_2 \\to F_2 - 3F_1$ i $F_3 \\to F_3 + F_1$):

*   $F_2: (3, 0, -1, 1) - 3(1, 7, 2, 5) = (0, -21, -7, -14)$ que simplifiquem dividint per $-7 \to (0, 3, 1, 2)$
*   $F_3: (-1, -1, 0, a) + (1, 7, 2, 5) = (0, 6, 2, a+5)$

Matriu resultant:

$$
\\left( \\begin{array}{ccc|c} 
1 & 7 & 2 & 5 \\\\
0 & 3 & 1 & 2 \\\\
0 & 6 & 2 & a+5
\\end{array} \\right)
$$

3.  **Fem zeros sota el segon pivot** ($F_3 \\to F_3 - 2F_2$):

*   $F_3: (0, 6, 2, a+5) - 2(0, 3, 1, 2) = (0, 0, 0, a+5-4) = (0, 0, 0, a+1)$

### Condició de compatibilitat

Perquè el sistema sigui compatible, el rang de la matriu de coeficients ha de ser igual al rang de la matriu ampliada (**Teorema de Rouché-Frobenius**). 

L'última fila de la matriu escalonada ens diu que:
*   El rang de la matriu de coeficients és **2**.
*   El rang de la matriu ampliada serà **2** només si l'últim terme és zero.

$$a + 1 = 0 \implies a = -1$$

### Conclusió

El vector $u$ es pot escriure com a combinació lineal dels vectors de $T$ si i només si l'escalar **$a = -1$**.
`,
  availableLanguages: ['ca']
};
