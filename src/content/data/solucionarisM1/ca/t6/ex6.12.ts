import type { Solution } from '../../../solutions';

export const ex6_12: Solution = {
  id: 'M1-T6-Ex6.12',
  title: 'Exercici 6.12: Combinació Lineal de Matrius',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Doneu els valors dels paràmetres $a$ i $b$ per als quals la matriu $\\begin{pmatrix} 1 & 0 \\\\ a & b \\end{pmatrix}$ és combinació lineal de $A = \\begin{pmatrix} 1 & 4 \\\\ -5 & 2 \\end{pmatrix}$ i $B = \\begin{pmatrix} 1 & 2 \\\\ 3 & -1 \\end{pmatrix}$.`,
  content: `
Busquem escalars $x$ i $y$ tals que:
$$x \\begin{pmatrix} 1 & 4 \\\\ -5 & 2 \\end{pmatrix} + y \\begin{pmatrix} 1 & 2 \\\\ 3 & -1 \\end{pmatrix} = \\begin{pmatrix} 1 & 0 \\\\ a & b \\end{pmatrix}$$

Això ens dóna un sistema de 4 equacions lineals (una per cada entrada de la matriu):
1.  $x + y = 1$ (entrada 1,1)
2.  $4x + 2y = 0$ (entrada 1,2)
3.  $-5x + 3y = a$ (entrada 2,1)
4.  $2x - y = b$ (entrada 2,2)

### Resolució del sistema

Utilitzem les equacions (1) i (2) per trobar $x$ i $y$:
*   De la segona equació: $4x = -2y \\implies y = -2x$.
*   Substituïm a la primera: $x + (-2x) = 1 \\implies -x = 1 \\implies \\mathbf{x = -1}$.
*   Per tant: $y = -2(-1) \\implies \\mathbf{y = 2}$.

### Càlcul de $a$ i $b$

Ara que tenim els coeficients de la combinació lineal, els substituïm a les equacions restants:
*   Per a $a$: $a = -5(-1) + 3(2) = 5 + 6 \\implies \\mathbf{a = 11}$.
*   Per a $b$: $b = 2(-1) - (2) = -2 - 2 \\implies \\mathbf{b = -4}$.

### Conclusió

La matriu donada és combinació lineal de $A$ i $B$ si i només si els paràmetres prenen els valors **$a = 11$** i **$b = -4$**.
`,
  availableLanguages: ['ca']
};
