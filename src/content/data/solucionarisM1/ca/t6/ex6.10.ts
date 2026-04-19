import type { Solution } from '../../../solutions';

export const ex6_10: Solution = {
  id: 'M1-T6-Ex6.10',
  title: 'Exercici 6.10: Combinacions Lineals No Úniques',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Considereu el conjunt $T \\subset \\mathbb{R}^4$ format pels vectors:
$$v_1 = \\begin{pmatrix} 1 \\\\ 0 \\\\ -1 \\\\ 0 \\end{pmatrix}, v_2 = \\begin{pmatrix} 1 \\\\ 1 \\\\ 1 \\\\ 0 \\end{pmatrix}, v_3 = \\begin{pmatrix} 0 \\\\ 1 \\\\ 1 \\\\ 1 \\end{pmatrix}, v_4 = \\begin{pmatrix} 0 \\\\ 1 \\\\ 2 \\\\ 0 \\end{pmatrix}$$

Proveu que el vector $u = \\begin{pmatrix} 0 \\\\ 3 \\\\ 5 \\\\ 1 \\end{pmatrix}$ es pot escriure com a combinació lineal dels vectors del conjunt almenys de dues maneres diferents.`,
  content: `
Per provar que $u$ es pot escriure com a combinació lineal dels vectors de $T$, busquem escalars $x_1, x_2, x_3, x_4$ tals que:
$$x_1 v_1 + x_2 v_2 + x_3 v_3 + x_4 v_4 = u$$

Això planteja el següent sistema d'equacions lineals per components:
1.  $x_1 + x_2 = 0$
2.  $x_2 + x_3 + x_4 = 3$
3.  $-x_1 + x_2 + x_3 + 2x_4 = 5$
4.  $x_3 = 1$

### Resolució del sistema

Substituïm $x_3 = 1$ (de l'equació 4) i $x_1 = -x_2$ (de l'equació 1) a les altres dues equacions:
*   De (2): $x_2 + 1 + x_4 = 3 \\implies \\mathbf{x_2 + x_4 = 2}$
*   De (3): $-(-x_2) + x_2 + 1 + 2x_4 = 5 \\implies 2x_2 + 2x_4 = 4 \\implies \\mathbf{x_2 + x_4 = 2}$

Com veiem, les dues equacions ens porten a la mateixa relació $x_2 + x_4 = 2$. Això vol dir que el sistema és **compatible indeterminat** (té infinites solucions). Podem expressar la solució general en funció d'un paràmetre $\\lambda$ (fent $x_4 = \\lambda$):
$$x_4 = \\lambda, \\quad x_2 = 2 - \\lambda, \\quad x_1 = \\lambda - 2, \\quad x_3 = 1$$

### Dues maneres diferents

Podem escollir qualsevol valor de $\\lambda$ per obtenir combinacions lineals diferents:

**Opció A: $\\lambda = 0$**
Tenim $x_1 = -2, x_2 = 2, x_3 = 1, x_4 = 0$.
$$-2 v_1 + 2 v_2 + v_3 = u$$

**Opció B: $\\lambda = 1$**
Tenim $x_1 = -1, x_2 = 1, x_3 = 1, x_4 = 1$.
$$-1 v_1 + v_2 + v_3 + v_4 = u$$

Havent trobat dues combinacions lineals distintes, queda provat que $u$ no s'escriu de forma única com a combinació lineal dels vectors de $T$. Això implica, per cert, que els vectors de $T$ són **linealment dependents**.
`,
  availableLanguages: ['ca']
};
