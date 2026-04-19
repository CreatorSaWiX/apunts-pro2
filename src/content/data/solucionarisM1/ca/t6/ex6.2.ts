import type { Solution } from '../../../solutions';

export const ex6_2: Solution = {
  id: 'M1-T6-Ex6.2',
  title: 'Exercici 6.2: Representació de Vectors al Pla',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Dibuixeu en el pla els vectors següents de $\\mathbb{R}^2$:
  
1) $v_1 = \\begin{pmatrix} 2 \\\\ 6 \\end{pmatrix}$; $\\quad$ 2) $v_2 = \\begin{pmatrix} -4 \\\\ -8 \\end{pmatrix}$; $\\quad$ 3) $v_3 = \\begin{pmatrix} -1 \\\\ 5 \\end{pmatrix}$; $\\quad$ 4) $v_4 = \\begin{pmatrix} 3 \\\\ 0 \\end{pmatrix}$.`,
  content: `
Per representar un vector $v = \\begin{pmatrix} x \\\\ y \\end{pmatrix}$ en el pla $\\mathbb{R}^2$, situem l'origen del vector al punt $(0,0)$ i l'extrem al punt definit per les seves coordenades $(x,y)$.

A continuació es mostren els vectors de l'exercici representats gràficament:

::mafs{type="m1_t6_ex6_2"}

### Descripció dels vectors:

*   **$v_1 = (2, 6)$**: Es desplaça 2 unitats a la dreta (eix $X$) i 6 unitats cap amunt (eix $Y$). Es troba al **primer quadrant**.
*   **$v_2 = (-4, -8)$**: Es desplaça 4 unitats a l'esquerra (eix $X$) i 8 unitats cap avall (eix $Y$). Es troba al **tercer quadrant**.
*   **$v_3 = (-1, 5)$**: Es desplaça 1 unitat a l'esquerra (eix $X$) i 5 unitats cap amunt (eix $Y$). Es troba al **segon quadrant**.
*   **$v_4 = (3, 0)$**: Es desplaça 3 unitats a la dreta (eix $X$) i 0 unitats en vertical. Es troba sobre l'**eix d'abscisses** (part positiva).
`,
  availableLanguages: ['ca']
};
