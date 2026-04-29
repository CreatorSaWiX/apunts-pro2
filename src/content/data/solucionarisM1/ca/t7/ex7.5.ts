import type { Solution } from '../../../solutions';

export const ex7_5: Solution = {
  id: 'M1-T7-Ex7.5',
  title: 'Exercici 7.5: Existència i unicitat d\'endomorfismes',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Estudieu si existeix algun endomorfisme $f: \\mathbb{R}^3 \\to \\mathbb{R}^3$ tal que $f(u_i) = v_i, i = 1, 2, 3$, on:

1) $u_1 = \\begin{pmatrix} 1 \\\\ 1 \\\\ 0 \\end{pmatrix}, u_2 = \\begin{pmatrix} 0 \\\\ 1 \\\\ 1 \\end{pmatrix}, u_3 = \\begin{pmatrix} -1 \\\\ 1 \\\\ 0 \\end{pmatrix}$ i $v_1 = \\begin{pmatrix} 1 \\\\ 2 \\\\ 3 \\end{pmatrix}, v_2 = \\begin{pmatrix} 3 \\\\ 2 \\\\ 1 \\end{pmatrix}, v_3 = \\begin{pmatrix} 8 \\\\ 4 \\\\ 0 \\end{pmatrix}$;

2) $u_1 = \\begin{pmatrix} 1 \\\\ 1 \\\\ 0 \\end{pmatrix}, u_2 = \\begin{pmatrix} 0 \\\\ 1 \\\\ 1 \\end{pmatrix}, u_3 = \\begin{pmatrix} -1 \\\\ 2 \\\\ 3 \\end{pmatrix}$ i $v_1 = \\begin{pmatrix} 1 \\\\ 2 \\\\ 3 \\end{pmatrix}, v_2 = \\begin{pmatrix} 3 \\\\ 2 \\\\ 1 \\end{pmatrix}, v_3 = \\begin{pmatrix} 8 \\\\ 4 \\\\ 0 \\end{pmatrix}$;

3) $u_1 = \\begin{pmatrix} 1 \\\\ 1 \\\\ 0 \\end{pmatrix}, u_2 = \\begin{pmatrix} 0 \\\\ 1 \\\\ 1 \\end{pmatrix}, u_3 = \\begin{pmatrix} -1 \\\\ 2 \\\\ 3 \\end{pmatrix}$ i $v_1 = \\begin{pmatrix} 1 \\\\ 2 \\\\ 3 \\end{pmatrix}, v_2 = \\begin{pmatrix} 3 \\\\ 2 \\\\ 1 \\end{pmatrix}, v_3 = \\begin{pmatrix} 0 \\\\ 1 \\\\ 2 \\end{pmatrix}$.`,
  content: `
Perquè existeixi una aplicació lineal que enviï uns vectors $u_i$ a uns $v_i$, s'ha de complir que qualsevol relació de dependència lineal entre els vectors origen $u_i$ també s'ha de complir entre les seves imatges $v_i$.

- Si $\\{u_1, u_2, u_3\\}$ és una **base**, l'aplicació existeix i és única.
- Si $\\{u_1, u_2, u_3\\}$ és **linealment dependent**, l'aplicació existeix si les imatges respecten la mateixa relació. En aquest cas, no serà única (hi haurà infinites).
- Si la relació no es respecta, l'aplicació no existeix.

---

### Apartat 1

Comprovem si els vectors $u_i$ formen una base calculant el seu determinant:
$$\\det(u_1, u_2, u_3) = \\begin{vmatrix} 1 & 0 & -1 \\\\ 1 & 1 & 1 \\\\ 0 & 1 & 0 \\end{vmatrix} = (0 + 0 - 1) - (0 + 1 + 0) = -2$$

Com que el determinant és diferent de zero, els vectors són linealment independents i formen una base de $\\mathbb{R}^3$. Per tant, l'endomorfisme **existeix i és únic**.

---

### Apartat 2

Comprovem el determinant dels nous vectors $u_i$:
$$\\det(u_1, u_2, u_3) = \\begin{vmatrix} 1 & 0 & -1 \\\\ 1 & 1 & 2 \\\\ 0 & 1 & 3 \\end{vmatrix} = (3 + 0 - 1) - (0 + 2 + 0) = 2 - 2 = 0$$

Els vectors són linealment dependents. Busquem la relació: $u_3 = a u_1 + b u_2$.
- Per la primera component: $-1 = a(1) + b(0) \\implies a = -1$.
- Per la tercera component: $3 = a(0) + b(1) \\implies b = 3$.
- Comprovem la segona: $-1(1) + 3(1) = 2$. (Correcte!)

Així doncs, $u_3 = -u_1 + 3u_2$. Comprovem si les imatges compleixen la mateixa relació ($v_3 = -v_1 + 3v_2$):
$$-v_1 + 3v_2 = -\\begin{pmatrix} 1 \\\\ 2 \\\\ 3 \\end{pmatrix} + 3\\begin{pmatrix} 3 \\\\ 2 \\\\ 1 \\end{pmatrix} = \\begin{pmatrix} -1+9 \\\\ -2+6 \\\\ -3+3 \\end{pmatrix} = \\begin{pmatrix} 8 \\\\ 4 \\\\ 0 \\end{pmatrix} = v_3$$

Com que es compleix la relació, l'endomorfisme **existeix**. Com que els vectors no formen una base, l'aplicació no està totalment determinada (podem triar la imatge d'un quart vector independent de $u_1$ i $u_2$ lliurement), per tant n'hi ha **infinits**.

---

### Apartat 3

Els vectors $u_i$ són els mateixos que a l'apartat anterior, per tant seguim tenint la relació $u_3 = -u_1 + 3u_2$. Comprovem les noves imatges:
$$-v_1 + 3v_2 = \\begin{pmatrix} 8 \\\\ 4 \\\\ 0 \\end{pmatrix}$$

En aquest cas, $v_3 = \\begin{pmatrix} 0 \\\\ 1 \\\\ 2 \\end{pmatrix}$. Com que $v_3 \\neq -v_1 + 3v_2$, les imatges no respecten la dependència lineal dels orígens.

Per tant, **no existeix cap endomorfisme** que compleixi les condicions.
`,
  availableLanguages: ['ca']
};
