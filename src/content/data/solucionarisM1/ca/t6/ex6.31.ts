import type { Solution } from '../../../solutions';

export const ex6_31: Solution = {
  id: 'M1-T6-Ex6.31',
  title: 'Exercici 6.31: Dimensió d’un Subespai amb Paràmetres',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Per a quins valors de $\\lambda$ els vectors generen un subespai vectorial de $\\mathbb{R}^4$ de dimensió 2?
$$v_1 = \\begin{pmatrix} \\lambda \\\\ 0 \\\\ 1 \\\\ \\lambda \\end{pmatrix}, \\quad v_2 = \\begin{pmatrix} \\lambda \\\\ 1 \\\\ 2 \\\\ 1 \\end{pmatrix}, \\quad v_3 = \\begin{pmatrix} 1 \\\\ 0 \\\\ \\lambda \\\\ \\lambda \\end{pmatrix}$$`,
  content: `
### Resolució del Problema

La dimensió de l'espai generat pels vectors és igual al **rang** de la matriu formada per aquests vectors. Se'ns demana que aquest rang sigui exactament 2. Això implica que els tres vectors han de ser linealment dependents (rang < 3) i que almenys n'hi ha dos de linealment independents (rang $\\geq 2$).

Construïm la matriu per columnes:
$$M = \\begin{pmatrix} \\lambda & \\lambda & 1 \\\\ 0 & 1 & 0 \\\\ 1 & 2 & \\lambda \\\\ \\lambda & 1 & \\lambda \\end{pmatrix}$$

Perquè el rang sigui menor que 3, tots els menors d'ordre $3 \\times 3$ han de tenir determinant zero.

### 1) Analitzem el menor format per les tres primeres files:
$$\\Delta_{123} = \\begin{vmatrix} \\lambda & \\lambda & 1 \\\\ 0 & 1 & 0 \\\\ 1 & 2 & \\lambda \\end{vmatrix} = 1 \\cdot \\begin{vmatrix} \\lambda & 1 \\\\ 1 & \\lambda \\end{vmatrix} = \\lambda^2 - 1$$
Perquè aquest determinant sigui zero:
$$\\lambda^2 - 1 = 0 \\implies \\lambda = 1 \\quad \\text{o} \\quad \\lambda = -1$$

### 2) Analitzem el menor format per les files 2, 3 i 4:
$$\\Delta_{234} = \\begin{vmatrix} 0 & 1 & 0 \\\\ 1 & 2 & \\lambda \\\\ \\lambda & 1 & \\lambda \\end{vmatrix} = -1 \\cdot (\\lambda - \\lambda^2) = \\lambda^2 - \\lambda = \\lambda(\\lambda - 1)$$
Perquè aquest determinant sigui zero:
$$\\lambda(\\lambda - 1) = 0 \\implies \\lambda = 0 \\quad \\text{o} \\quad \\lambda = 1$$

### Conclusió dels valors de $\\lambda$:
L'únic valor de $\\lambda$ que anul·la tots els menors d'ordre 3 simultàniament és **$\\lambda = 1$**. (Si $\\lambda = -1$ o $\\lambda = 0$, un dels menors seria diferent de zero i el rang seria 3).

### Comprovació per a $\\lambda = 1$:
Substituïm $\\lambda = 1$ en la matriu original:
$$M = \\begin{pmatrix} 1 & 1 & 1 \\\\ 0 & 1 & 0 \\\\ 1 & 2 & 1 \\\\ 1 & 1 & 1 \\end{pmatrix}$$

Observem les relacions:
*   Fila 4 = Fila 1
*   Fila 3 = Fila 1 + Fila 2
L'espai de files té només dues files independents. Per tant, el rang és 2.

El valor per al qual la dimensió del subespai és 2 és: **$\\lambda = 1$**.
`,
  availableLanguages: ['ca']
};
