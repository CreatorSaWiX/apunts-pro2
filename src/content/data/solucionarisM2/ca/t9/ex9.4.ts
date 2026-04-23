import type { Solution } from '../../../solutions';

export const ex9_4: Solution = {
  id: 'M2-T9-Ex4',
  title: 'Exercici 4: Determinació de paràmetres per a extrems',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Trobeu els valors de $a$ i $b$ per tal que la funció $f(x, y) = ax^3 + 3bxy^2 - 15a^2x - 12y + 5$ tingui un mínim local al punt $(2, 1)$.`,
  content: `### 1. Condició de punt crític
Perquè el punt $(2,1)$ sigui un extrem, el gradient ha de ser nul: $\\nabla f(2,1) = (0,0)$.

Calculem les primeres derivades:
*   $f_x = 3ax^2 + 3by^2 - 15a^2$
*   $f_y = 6bxy - 12$

Substituïm el punt $(2,1)$:
1.  $f_y(2,1) = 12b - 12 = 0 \\implies \\mathbf{b = 1}$
2.  $f_x(2,1) = 12a + 3b - 15a^2 = 0$

Substituint $b=1$ a la segona equació:
$$12a + 3 - 15a^2 = 0 \\implies 5a^2 - 4a - 1 = 0$$
Resolent l'equació de segon grau per a $a$:
$$a = \\frac{4 \\pm \\sqrt{16 + 20}}{10} = \\frac{4 \\pm 6}{10} \\implies a_1 = 1, \\quad a_2 = -0.2$$

---

### 2. Condició de mínim local (Matriu Hessiana)
Perquè sigui un mínim, la matriu Hessiana en $(2,1)$ ha de ser definida positiva. Calculem les segones derivades:
*   $f_{xx} = 6ax \\implies f_{xx}(2,1) = 12a$
*   $f_{yy} = 6bx \\implies f_{yy}(2,1) = 12b = 12$ (ja que $b=1$)
*   $f_{xy} = 6by \\implies f_{xy}(2,1) = 6b = 6$

La matriu Hessiana és:
$$H(2,1) = \\begin{pmatrix} 12a & 6 \\\\ 6 & 12 \\end{pmatrix}$$

Per ser un mínim, cal que:
1.  **Determinant $\\Delta > 0$:** $144a - 36 > 0 \\implies 144a > 36 \\implies a > 1/4$
2.  **Element $f_{xx} > 0$:** $12a > 0 \\implies a > 0$

Dels dos valors de $a$ que hem trobat ($1$ i $-0.2$), només **$a = 1$** compleix la condició $a > 0.25$.

---

### Conclusió
Els valors cercats són:
**$$a = 1, \\quad b = 1$$**
`,
  availableLanguages: ['ca']
};
