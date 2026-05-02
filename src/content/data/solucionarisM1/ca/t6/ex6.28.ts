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
  content: `Com que la dimensió de l'espai $E$ és 3 (ja que té una base de 3 vectors) i el conjunt $\\{u_1, u_2, u_3\\}$ té exactament 3 vectors, per demostrar que és una base només cal provar que aquests vectors són **linealment independents**.

Construïm la matriu on cada columna representa un vector $u_i$ expressat en la base original $\{v_1, v_2, v_3\}$ (això és la matriu de **canvi de base**):
$$M = \\begin{pmatrix} 1 & 0 & 1 \\\\ 2 & 2 & 0 \\\\ 0 & 3 & 3 \\end{pmatrix}$$

Calculem el seu determinant:
$$\\det(M) = 1 \\cdot \\begin{vmatrix} 2 & 0 \\\\ 3 & 3 \\end{vmatrix} + 1 \\cdot \\begin{vmatrix} 2 & 2 \\\\ 0 & 3 \\end{vmatrix} = (6 - 0) + (6 - 0) = 12$$

Com que $\\det(M) = 12 \\neq 0$, els vectors són linealment independents i, per tant, formen una **base d'$E$**.
`,
  availableLanguages: ['ca']
};
