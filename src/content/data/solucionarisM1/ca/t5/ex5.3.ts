import type { Solution } from '../../../solutions';

export const ex5_3: Solution = {
  id: 'M1-T5-Ex5.3',
  title: 'Exercici 5.3: Existència del Producte BA',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Donades $A$ i $B$ matrius tals que $AB$ és una matriu quadrada, proveu que el producte $BA$ està definit.`,
  content: `
Per demostrar que el producte $BA$ està definit, hem d'analitzar les dimensions de les matrius $A$ i $B$ basant-nos en les condicions del producte $AB$.

### Pas 1: Dimensions de $A$ i $B$ per al producte $AB$
Suposem que la matriu $A$ té dimensions $m \\times n$ (és a dir, $m$ files i $n$ columnes).
Perquè el producte $AB$ estigui definit, el nombre de files de $B$ ha de ser igual al nombre de columnes de $A$. Per tant, si $A$ és $m \\times n$, llavors $B$ ha de tenir dimensions $n \\times p$ per a algun valor $p$.

La matriu $AB$ resultant tindrà dimensions $m \\times p$.

### Pas 2: Condició de matriu quadrada
L'enunciat diu que $AB$ és una **matriu quadrada**. Una matriu és quadrada si el seu nombre de files és igual al seu nombre de columnes:
$$m = p$$

Substituint $p$ per $m$, tenim que les dimensions de $B$ són $n \\times m$.

### Pas 3: Verificació del producte $BA$
Ara mirem si el producte $BA$ està definit:
- La matriu **$B$** té dimensions **$n \\times m$**.
- La matriu **$A$** té dimensions **$m \\times n$**.

Perquè el producte $BA$ estigui definit, el nombre de columnes de $B$ ha de coincidir amb el nombre de files de $A$.
- Columnes de $B$: $m$
- Files de $A$: $m$

Com que $m = m$, el producte **$BA$ està definit** i la matriu resultant tindrà dimensions $n \\times n$ (també serà una matriu quadrada). $\\square$
`,
  availableLanguages: ['ca']
};
