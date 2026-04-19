import type { Solution } from '../../../solutions';

export const ex6_13: Solution = {
  id: 'M1-T6-Ex6.13',
  title: 'Exercici 6.13: Equació Implícita d’un Subespai',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Donats els vectors $u = \\begin{pmatrix} 1 \\\\ 1 \\\\ 2 \\end{pmatrix}$ i $v = \\begin{pmatrix} 0 \\\\ 1 \\\\ 1 \\end{pmatrix}$ de $\\mathbb{R}^3$, trobeu quina condició han de complir les components d'un vector $w = \\begin{pmatrix} x \\\\ y \\\\ z \\end{pmatrix}$ per a que pertanyi al subespai generat per $\\{u, v\\}$.`,
  content: `
Un vector $w$ pertany al subespai generat per $\{u, v\}$ si es pot escriure com a combinació lineal d'aquests, és a dir, si existeixen escalars $\\lambda_1, \\lambda_2$ tals que:

$$
\\lambda_1 \\begin{pmatrix} 1 \\\\ 1 \\\\ 2 \\end{pmatrix} + \\lambda_2 \\begin{pmatrix} 0 \\\\ 1 \\\\ 1 \\end{pmatrix} = \\begin{pmatrix} x \\\\ y \\\\ z \\end{pmatrix}
$$

Això planteja un sistema d'equacions que ha de ser compatible. Utilitzem la matriu ampliada i l'escalonem:

### Escalonament de Gauss

$$
\\left( \\begin{array}{cc|c} 
1 & 0 & x \\\\
1 & 1 & y \\\\
2 & 1 & z
\\end{array} \\right)
$$

1.  **Fem zeros a la primera columna** ($F_2 \\to F_2 - F_1$ i $F_3 \\to F_3 - 2F_1$):

$$
\\left( \\begin{array}{cc|c} 
1 & 0 & x \\\\
0 & 1 & y - x \\\\
0 & 1 & z - 2x
\\end{array} \\right)
$$

2.  **Fem zero a la segona columna** ($F_3 \\to F_3 - F_2$):

$$
\\left( \\begin{array}{cc|c} 
1 & 0 & x \\\\
0 & 1 & y - x \\\\
0 & 0 & (z - 2x) - (y - x)
\\end{array} \\right)
$$

Simplifiquem el terme de l'última fila:

$$ (z - 2x) - (y - x) = z - 2x - y + x = -x - y + z $$

### Condició de pertinença (Equació implícita)

Perquè el sistema sigui compatible, el terme independent de la fila de zeros ha de ser nul (Teorema de Rouché-Frobenius):

$$-x - y + z = 0 \\implies \\mathbf{x + y - z = 0}$$

### Conclusió

La condició que han de complir les components del vector per pertànyer al subespai generat per $\{u, v\}$ és que la suma de les dues primeres components sigui igual a la tercera: **$x + y - z = 0$**. Aquesta és l'equació implícita del pla que generen els dos vectors a $\\mathbb{R}^3$.
`,
  availableLanguages: ['ca']
};
