import type { Solution } from '../../../solutions';

export const ex5_7: Solution = {
  id: 'M1-T5-Ex5.7',
  title: 'Exercici 5.7: Transposada del Producte',
  author: 'Antigravity',
  code: '',
  type: 'notebook',
  statement: `Doneu un exemple de dues matrius $A$ i $B$ de tipus $2 \\times 2$ tals que $(AB)^t \\neq A^t B^t$.`,
  content: `
Recordem que la propietat correcta per a la transposada d'un producte és **$(AB)^t = B^t A^t$**. Segons aquesta propietat, la igualtat $(AB)^t = A^t B^t$ només es compliria si les matrius transposades commutessin ($B^t A^t = A^t B^t$). Com que generalment el producte de matrius no és commutatiu, és fàcil trobar un contraexemple.

### Exemple de contraexemple

Siguin les matrius:
$$A = \\begin{pmatrix} 1 & 1 \\\\ 0 & 1 \\end{pmatrix}, \\quad B = \\begin{pmatrix} 0 & 1 \\\\ 1 & 0 \\end{pmatrix}$$

**1. Calculem $(AB)^t$:**
Primer el producte $AB$:
$$AB = \\begin{pmatrix} 1 & 1 \\\\ 0 & 1 \\end{pmatrix} \\begin{pmatrix} 0 & 1 \\\\ 1 & 0 \\end{pmatrix} = \\begin{pmatrix} 1(0)+1(1) & 1(1)+1(0) \\\\ 0(0)+1(1) & 0(1)+1(0) \\end{pmatrix} = \\begin{pmatrix} 1 & 1 \\\\ 1 & 0 \\end{pmatrix}$$
Llavors la seva transposada:
$$(AB)^t = \\begin{pmatrix} 1 & 1 \\\\ 1 & 0 \\end{pmatrix}$$

**2. Calculem $A^t B^t$:**
Transposem les matrius originals:
$$A^t = \\begin{pmatrix} 1 & 0 \\\\ 1 & 1 \\end{pmatrix}, \\quad B^t = \\begin{pmatrix} 0 & 1 \\\\ 1 & 0 \\end{pmatrix}$$
Ara les multipliquem en aquest ordre:
$$A^t B^t = \\begin{pmatrix} 1 & 0 \\\\ 1 & 1 \\end{pmatrix} \\begin{pmatrix} 0 & 1 \\\\ 1 & 0 \\end{pmatrix} = \\begin{pmatrix} 1(0)+0(1) & 1(1)+0(0) \\\\ 1(0)+1(1) & 1(1)+1(0) \\end{pmatrix} = \\begin{pmatrix} 0 & 1 \\\\ 1 & 1 \\end{pmatrix}$$

### Conclusió
Com podem observar:
$$(AB)^t = \\begin{pmatrix} 1 & 1 \\\\ 1 & 0 \\end{pmatrix} \\neq \\begin{pmatrix} 0 & 1 \\\\ 1 & 1 \\end{pmatrix} = A^t B^t$$

L'exemple demostra que, en general, **la transposada no és distributiva respecte al producte mantenint l'ordre**, sinó que s'ha d'invertir l'ordre dels factors: $(AB)^t = B^t A^t$.
`,
  availableLanguages: ['ca']
};
