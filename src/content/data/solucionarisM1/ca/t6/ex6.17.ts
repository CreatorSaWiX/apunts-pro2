import type { Solution } from '../../../solutions';

export const ex6_17: Solution = {
  id: 'M1-T6-Ex6.17',
  title: 'Exercici 6.17: Dependència Lineal i Paràmetres',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `A l'espai vectorial $\\mathbb{R}^4$ considerem els vectors:
$$v_1 = \\begin{pmatrix} 1 \\\\ 1 \\\\ 0 \\\\ a \\end{pmatrix}, v_2 = \\begin{pmatrix} 3 \\\\ -1 \\\\ b \\\\ -1 \\end{pmatrix}, v_3 = \\begin{pmatrix} -3 \\\\ 5 \\\\ a \\\\ -4 \\end{pmatrix}$$

Determineu $a$ i $b$ per tal que siguin un conjunt linealment dependent, i en aquest cas expresseu el vector $0_{\\mathbb{R}^4}$ com a combinació lineal no nul·la dels vectors.`,
  content: `
Tres vectors a $\\mathbb{R}^4$ són linealment dependents (LD) si el rang de la matriu que formen és inferior a 3. Això equival a dir que, en escalonar la matriu per columnes, algun dels pivots s'ha d'anul·lar.

### Escalonament de Gauss

Plantegem la matriu per columnes i l'escalonem:
$$\\begin{pmatrix} 1 & 3 & -3 \\\\ 1 & -1 & 5 \\\\ 0 & b & a \\\\ a & -1 & -4 \\end{pmatrix}$$

1.  Fem zeros a la primera columna ($F_2 \\to F_2 - F_1$ i $F_4 \\to F_4 - aF_1$):
$$\\begin{pmatrix} 1 & 3 & -3 \\\\ 0 & -4 & 8 \\\\ 0 & b & a \\\\ 0 & -1-3a & -4+3a \\end{pmatrix} \\xrightarrow{F_2 \\div (-4)} \\begin{pmatrix} 1 & 3 & -3 \\\\ 0 & 1 & -2 \\\\ 0 & b & a \\\\ 0 & -1-3a & -4+3a \\end{pmatrix}$$

2.  Fem zeros sota el segon pivot ($F_3 \\to F_3 - bF_2$ i $F_4 \\to F_4 + (1+3a)F_2$):
*   $F_3: (0, b, a) - b(0, 1, -2) = (0, 0, a+2b)$
*   $F_4: (0, -1-3a, -4+3a) + (1+3a)(0, 1, -2) = (0, 0, -4+3a - 2 - 6a) = (0, 0, -6-3a)$

### Condició de Dependència Lineal

Perquè el rang sigui menor que 3, tant la 3a com la 4a fila han de tenir zeros a l'última columna:
1.  $-6 - 3a = 0 \\implies 3a = -6 \\implies \\mathbf{a = -2}$
2.  $a + 2b = 0 \\implies -2 + 2b = 0 \\implies 2b = 2 \\implies \\mathbf{b = 1}$

Els valors buscats són **$a = -2$** i **$b = 1$**.

### Combinació lineal nul·la

Amb aquests valors, el sistema resolt per la combinació $x v_1 + y v_2 + z v_3 = 0$ és:
*   $y - 2z = 0 \\implies y = 2z$
*   $x + 3y - 3z = 0 \\implies x + 3(2z) - 3z = 0 \\implies x + 3z = 0 \\implies x = -3z$

Si triem $z=1$, obtenim els coeficients $x=-3, y=2, z=1$. L'expressió del vector nul és:
$$\\mathbf{-3 v_1 + 2 v_2 + v_3 = 0}$$
`,
  availableLanguages: ['ca']
};
