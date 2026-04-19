import type { Solution } from '../../../solutions';

export const ex6_19: Solution = {
  id: 'M1-T6-Ex6.19',
  title: 'Exercici 6.19: Independència Lineal i Combinacions de Matrius',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Demostreu que les matrius $A, B$ i $C$ següents formen un conjunt linealment independent a $\\mathcal{M}_{2 \\times 3}(\\mathbb{R})$.
$$A = \\begin{pmatrix} 0 & 1 & -2 \\\\ 1 & 1 & 1 \\end{pmatrix}, \\quad B = \\begin{pmatrix} 1 & 1 & -2 \\\\ 0 & 1 & 1 \\end{pmatrix}, \\quad C = \\begin{pmatrix} -1 & 1 & -2 \\\\ 3 & -2 & 0 \\end{pmatrix}$$

Proveu que per a qualsevol valor de $\\lambda$ la matriu següent és combinació lineal d'$A$ i $B$:
$$M_\\lambda = \\begin{pmatrix} \\lambda & 2 & -4 \\\\ 2-\\lambda & 2 & 2 \\end{pmatrix}$$`,
  content: `
### 1) Demostració d'Independència Lineal

Plantegem l'equació $x A + y B + z C = \\mathbf{0}$:
$$x \\begin{pmatrix} 0 & 1 & -2 \\\\ 1 & 1 & 1 \\end{pmatrix} + y \\begin{pmatrix} 1 & 1 & -2 \\\\ 0 & 1 & 1 \\end{pmatrix} + z \\begin{pmatrix} -1 & 1 & -2 \\\\ 3 & -2 & 0 \\end{pmatrix} = \\begin{pmatrix} 0 & 0 & 0 \\\\ 0 & 0 & 0 \\end{pmatrix}$$

Això ens dóna el següent sistema d'equacions per components:
*   (1,1): $y - z = 0 \\implies y = z$
*   (2,1): $x + 3z = 0$
*   (2,3): $x + y = 0 \\implies x = -y$

Substituint en les unes a les altres:
Com que $x = -y$ i $z = y$, l'equació $x + 3z = 0$ esdevé $-y + 3y = 0 \\implies 2y = 0 \\implies y = 0$.
Això implica $x = 0$ i $z = 0$.

Com que l'única solució és la trivial ($x=y=z=0$), les matrius $\\{A, B, C\\}$ són **Linealment Independents (LI)**.

---

### 2) Prova de la Combinació Lineal $M_\\lambda$

Busquem escalars $x, y$ tals que $x A + y B = M_\\lambda$:
$$x \\begin{pmatrix} 0 & 1 & -2 \\\\ 1 & 1 & 1 \\end{pmatrix} + y \\begin{pmatrix} 1 & 1 & -2 \\\\ 0 & 1 & 1 \\end{pmatrix} = \\begin{pmatrix} \\lambda & 2 & -4 \\\\ 2-\\lambda & 2 & 2 \\end{pmatrix}$$

Sumant component a component:
$$\\begin{pmatrix} y & x+y & -2(x+y) \\\\ x & x+y & x+y \\end{pmatrix} = \\begin{pmatrix} \\lambda & 2 & -4 \\\\ 2-\\lambda & 2 & 2 \\end{pmatrix}$$

Comparant les entrades:
*   De (1,1): **$y = \\lambda$**
*   De (2,1): **$x = 2 - \\lambda$**

Comprovem la resta de components per verificar la consistència per a qualsevol $\\lambda$:
*   (1,2), (2,2), (2,3): $x + y = (2-\\lambda) + \\lambda = 2$. **Correcte**.
*   (1,3): $-2(x+y) = -2(2) = -4$. **Correcte**.

Havent trobat escalars que satisfan totes les equacions per a qualsevol $\\lambda$, queda provat que $M_\\lambda$ és combinació lineal de $A$ i $B$:
$$\\mathbf{M_\\lambda = (2-\\lambda) A + \\lambda B}$$
`,
  availableLanguages: ['ca']
};
