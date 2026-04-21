import type { Solution } from '../../../solutions';

export const ex6_3: Solution = {
  id: 'M1-T6-Ex6.3',
  title: 'Exercici 6.3: Operacions Gràfiques i Algebràiques',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Per als vectors de l'exercici anterior, calculeu $v_1 + v_2$, $v_1 - v_3$ i $v_2 - v_4$ gràficament i comproveu les vostres respostes algebràicament.`,
  content: `
Recordem els vectors de l'exercici 6.2:
$v_1 = \\begin{pmatrix} 2 \\\\ 6 \\end{pmatrix}, v_2 = \\begin{pmatrix} -4 \\\\ -8 \\end{pmatrix}, v_3 = \\begin{pmatrix} -1 \\\\ 5 \\end{pmatrix}, v_4 = \\begin{pmatrix} 3 \\\\ 0 \\end{pmatrix}$

### Resolució Algebràica

1) **Càlcul de $v_1 + v_2$**:
$$v_1 + v_2 = \\begin{pmatrix} 2 \\\\ 6 \\end{pmatrix} + \\begin{pmatrix} -4 \\\\ -8 \\end{pmatrix} = \\begin{pmatrix} 2-4 \\\\ 6-8 \\end{pmatrix} = \\mathbf{\\begin{pmatrix} -2 \\\\ -2 \\end{pmatrix}}$$

2) **Càlcul de $v_1 - v_3$**:
$$v_1 - v_3 = \\begin{pmatrix} 2 \\\\ 6 \\end{pmatrix} - \\begin{pmatrix} -1 \\\\ 5 \\end{pmatrix} = \\begin{pmatrix} 2-(-1) \\\\ 6-5 \\end{pmatrix} = \\mathbf{\\begin{pmatrix} 3 \\\\ 1 \\end{pmatrix}}$$

3) **Càlcul de $v_2 - v_4$**:
$$v_2 - v_4 = \\begin{pmatrix} -4 \\\\ -8 \\end{pmatrix} - \\begin{pmatrix} 3 \\\\ 0 \\end{pmatrix} = \\begin{pmatrix} -4-3 \\\\ -8-0 \\end{pmatrix} = \\mathbf{\\begin{pmatrix} -7 \\\\ -8 \\end{pmatrix}}$$

---

### Resolució Gràfica

::mafs{type="m1_t6_ex6_3"}
`,
  availableLanguages: ['ca']
};
