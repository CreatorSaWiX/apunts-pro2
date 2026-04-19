import type { Solution } from '../../../solutions';

export const ex6_32: Solution = {
  id: 'M1-T6-Ex6.32',
  title: 'Exercici 6.32: Subespai de Matrius amb Paràmetres i Bases',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Considereu el subespai $F_a = \\left\\langle \\begin{pmatrix} 1 & 2 \\\\ 0 & 2 \\end{pmatrix}, \\begin{pmatrix} -1 & 1 \\\\ 0 & 1 \\end{pmatrix}, \\begin{pmatrix} 2 & a \\\\ 0 & -1 \\end{pmatrix} \\right\\rangle$ de $\\mathcal{M}_2(\\mathbb{R})$.

1) Trobeu el valor de $a$ per al qual $F_a$ és de dimensió 2.
2) Sigui $a = a_0$ el valor obtingut. Trobeu les condicions en forma de sistema d'equacions lineals perquè una matriu sigui de $F_{a_0}$.
3) Raoneu que $B = \\left\\{ \\begin{pmatrix} 1 & 2 \\\\ 0 & 2 \\end{pmatrix}, \\begin{pmatrix} -1 & 1 \\\\ 0 & 1 \\end{pmatrix} \\right\\}$ i $B' = \\left\\{ \\begin{pmatrix} 0 & 1 \\\\ 0 & 1 \\end{pmatrix}, \\begin{pmatrix} 2 & 1 \\\\ 0 & 1 \\end{pmatrix} \\right\\}$ són bases de $F_{a_0}$.`,
  content: `
### 1) Valor de $a$ per a dimensió 2

Escribim els generadors com a vectors de $\\mathbb{R}^4$:
$v_1 = (1, 2, 0, 2), \\, v_2 = (-1, 1, 0, 1), \\, v_3 = (2, a, 0, -1)$.
Com que $v_1$ i $v_2$ són clarament linealment independents, el subespai tindrà dimensió 2 si $v_3$ és combinació lineal de $v_1$ i $v_2$:
$c_1 \\begin{pmatrix} 1 \\\\ 2 \\\\ 0 \\\\ 2 \\end{pmatrix} + c_2 \\begin{pmatrix} -1 \\\\ 1 \\\\ 0 \\\\ 1 \\end{pmatrix} = \\begin{pmatrix} 2 \\\\ a \\\\ 0 \\\\ -1 \\end{pmatrix}$

Obtenim el sistema:
1. $c_1 - c_2 = 2$
2. $2c_1 + c_2 = a$
3. $2c_1 + c_2 = -1$

Igualant (2) i (3), veiem immediatament que **$a = -1$**.
(Resolent el sistema, trobem $c_1 = 1/3, c_2 = -5/3$).

---

### 2) Equacions implícites de $F_{a_0}$ ($a = -1$)

Una matriu $\\begin{pmatrix} x & y \\\\ z & t \\end{pmatrix}$ pertany a $F_{-1}$ si el vector $(x, y, z, t)$ és combinació de $v_1$ i $v_2$.
D'una banda, és evident que el tercer component ha de ser zero: **$z = 0$**.
D'altra banda, observem que tant en $v_1$ com en $v_2$ (i per tant en qualsevol combinació), el segon i quart component coincideixen ($y = t$).
Per tant, el sistema d'equacions implícites és:
$$\\begin{cases} z = 0 \\\\ y - t = 0 \\end{cases}$$

---

### 3) Raonament de les Bases

*   **Base $B$**: Són els dos primers generadors de $F_{a_0}$. Ja hem vist que són linealment independents i que generen l'espai de dimensió 2, per tant formen una base.
*   **Base $B'$**:
    1.  Comprovem que les matrius compleixen les condicions del subespai:
        *   $\\begin{pmatrix} 0 & 1 \\\\ 0 & 1 \\end{pmatrix} \\implies z=0, y=t=1$ (Compleix).
        *   $\\begin{pmatrix} 2 & 1 \\\\ 0 & 1 \\end{pmatrix} \\implies z=0, y=t=1$ (Compleix).
    2.  Comprovem la independència lineal: Clarament no són proporcionals (una té $x=0$ i l'altra $x=2$).
    Com que són 2 vectors linealment independents en un espai de dimensió 2, automàticament formen una **base de $F_{a_0}$**.
`,
  availableLanguages: ['ca']
};
