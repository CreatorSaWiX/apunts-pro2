import type { Solution } from '../../../solutions';

export const ex6_28: Solution = {
  id: 'M1-T6-Ex6.28',
  title: 'Exercici 6.28: Prova de Base mitjançant Combinacions',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Sigui $\\{v_1, v_2, v_3\\}$ una base d'un espai vectorial $E$. Demostreu que el conjunt $\\{u_1, u_2, u_3\\}$ definit per:
$$u_1 = v_1 + 2v_2, \\quad u_2 = 2v_2 + 3v_3, \\quad u_3 = 3v_3 + v_1$$
també és una base d'$E$.`,
  content: `
### Resolució del Problema

Com que la dimensió de l'espai $E$ és 3 (ja que té una base de 3 vectors) i el conjunt $\\{u_1, u_2, u_3\\}$ té exactament 3 vectors, per demostrar que és una base només cal provar que aquests vectors són **linealment independents**.

### Mètode 1: Definició d'Independència Lineal
Suposem una combinació lineal nul·la:
$$c_1 u_1 + c_2 u_2 + c_3 u_3 = \\vec{0}$$

Substituïm els vectors $u_i$ per la seva definició:
$$c_1(v_1 + 2v_2) + c_2(2v_2 + 3v_3) + c_3(3v_3 + v_1) = \\vec{0}$$

Reagrupem els termes segons els vectors de la base original $\\{v_1, v_2, v_3\\}$:
$$(c_1 + c_3)v_1 + (2c_1 + 2c_2)v_2 + (3c_2 + 3c_3)v_3 = \\vec{0}$$

Com que $\\{v_1, v_2, v_3\\}$ és una base, els seus vectors són linealment independents. Per tant, els coeficients de la combinació han de ser zero:
1.  $c_1 + c_3 = 0$
2.  $2c_1 + 2c_2 = 0 \\implies c_1 + c_2 = 0$
3.  $3c_2 + 3c_3 = 0 \\implies c_2 + c_3 = 0$

Resolem el sistema:
*   De (2): $c_1 = -c_2$
*   De (3): $c_3 = -c_2$
*   Substituïm en (1): $(-c_2) + (-c_2) = 0 \\implies -2c_2 = 0 \\implies \\mathbf{c_2 = 0}$
Això implica que **$c_1 = 0$** i **$c_3 = 0$**. Com que l'única solució és la trivial, els vectors són LI.

### Mètode 2: Determinant de la Matriu de Transició
Podem construir la matriu on cada columna representa un vector $u_i$ expressat en la base $\\{v_1, v_2, v_3\\}$:
$$M = \\begin{pmatrix} 1 & 0 & 1 \\\\ 2 & 2 & 0 \\\\ 0 & 3 & 3 \\end{pmatrix}$$

Calculem el seu determinant:
$$\\det(M) = 1 \\cdot \\begin{vmatrix} 2 & 0 \\\\ 3 & 3 \\end{vmatrix} + 1 \\cdot \\begin{vmatrix} 2 & 2 \\\\ 0 & 3 \\end{vmatrix} = (6 - 0) + (6 - 0) = 12$$

Com que $\\det(M) = 12 \\neq 0$, els vectors són linealment independents i, per tant, formen una **base d'$E$**.
`,
  availableLanguages: ['ca']
};
