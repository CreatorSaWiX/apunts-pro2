import type { Solution } from '../../../solutions';

export const ex5_8: Solution = {
  id: 'M1-T5-Ex5.8',
  title: 'Exercici 5.8: Producte de Matrius Simètriques',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Siguin $A = \\begin{pmatrix} 1 & -2 \\\\ -2 & 3 \\end{pmatrix}$ i $B = \\begin{pmatrix} -2 & 1 \\\\ 1 & 1 \\end{pmatrix}$. Calculeu $(AB)^t$ i $B^t A^t$. Observeu que, encara que $A$ i $B$ són matrius simètriques, el seu producte no ho és.`,
  content: `
Diem que una matriu $M$ és **simètrica** si $M^t = M$. En aquest exercici comprovarem que la simetria no es conserva necessàriament mitjançant el producte.

### 1) Verificació de la simetria de $A$ i $B$

- **Matriu $A$**: $A^t = \\begin{pmatrix} 1 & -2 \\\\ -2 & 3 \\end{pmatrix} = A$. (Simètrica)
- **Matriu $B$**: $B^t = \\begin{pmatrix} -2 & 1 \\\\ 1 & 1 \\end{pmatrix} = B$. (Simètrica)

### 2) Càlcul de $(AB)^t$ i $B^t A^t$

$$AB = \\begin{pmatrix} 1 & -2 \\\\ -2 & 3 \\end{pmatrix} \\begin{pmatrix} -2 & 1 \\\\ 1 & 1 \\end{pmatrix} = \\begin{pmatrix} 1(-2)+(-2)(1) & 1(1)+(-2)(1) \\\\ (-2)(-2)+3(1) & (-2)(1)+3(1) \\end{pmatrix} = \\begin{pmatrix} -4 & -1 \\\\ 7 & 1 \\end{pmatrix}$$

$$(AB)^t = \\mathbf{\\begin{pmatrix} -4 & 7 \\\\ -1 & 1 \\end{pmatrix}}$$

$$B^t A^t = B A = \\begin{pmatrix} -2 & 1 \\\\ 1 & 1 \\end{pmatrix} \\begin{pmatrix} 1 & -2 \\\\ -2 & 3 \\end{pmatrix} = \\begin{pmatrix} -2(1)+1(-2) & -2(-2)+1(3) \\\\ 1(1)+1(-2) & 1(-2)+1(3) \\end{pmatrix} = \\mathbf{\\begin{pmatrix} -4 & 7 \\\\ -1 & 1 \\end{pmatrix}}$$

Observem que, efectivament, $(AB)^t = B^t A^t$.

### 3) Observació sobre la simetria del producte

Perquè el producte $AB$ fos simètric, caldria que $(AB)^t = AB$.

$$(AB)^t = \\begin{pmatrix} -4 & 7 \\\\ -1 & 1 \\end{pmatrix} \\neq \\begin{pmatrix} -4 & -1 \\\\ 7 & 1 \\end{pmatrix} = AB$$

Encara que dues matrius siguin simètriques, el seu producte **no té per què ser simètric**. El producte de dues matrius simètriques només és simètric si les matrius **commuten** ($AB = BA$).
`,
  availableLanguages: ['ca']
};
