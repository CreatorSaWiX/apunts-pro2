import type { Solution } from '../../../solutions';

export const ex7_1: Solution = {
  id: 'M1-T7-Ex7.1',
  title: 'Exercici 7.1: Determinació d\'aplicacions lineals',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Determineu quines de les aplicacions següents són lineals:

1) $f: \\mathbb{R}^2 \\to \\mathbb{R}$, on $f \\begin{pmatrix} x \\\\ y \\end{pmatrix} = x + y$;

2) $f: \\mathbb{R}^2 \\to \\mathbb{R}$, on $f \\begin{pmatrix} x \\\\ y \\end{pmatrix} = x^2 y^2$;

3) $f: \\mathbb{R}^3 \\to \\mathbb{R}^3$, on $f \\begin{pmatrix} x \\\\ y \\\\ z \\end{pmatrix} = \\begin{pmatrix} x + 7 \\\\ 2y \\\\ x + y + z \\end{pmatrix}$;

4) $f: \\mathbb{R}^2 \\to \\mathbb{R}^3$, on $f \\begin{pmatrix} x \\\\ y \\end{pmatrix} = \\begin{pmatrix} x \\\\ y - x \\\\ x + y \\end{pmatrix}$;

5) $f: \\mathbb{R}^3 \\to \\mathbb{R}^3$, on $f \\begin{pmatrix} x \\\\ y \\\\ z \\end{pmatrix} = \\begin{pmatrix} xy \\\\ z \\\\ x \\end{pmatrix}$.`,
  content: `
Recordem que una aplicació $f: V \\to W$ és **lineal** si compleix dues condicions per a tot $u, v \\in V$ i $\\lambda \\in \\mathbb{K}$:
1.  **Additivitat:** $f(u + v) = f(u) + f(v)$
2.  **Homogeneïtat:** $f(\\lambda u) = \\lambda f(u)$

Una condició necessària (però no suficient) és que $f(\\vec{0}_V) = \\vec{0}_W$.

---

### 1) $f(x, y) = x + y$

Siguin $u = (x_1, y_1)$ i $v = (x_2, y_2)$.
- $f(u + v) = f(x_1+x_2, y_1+y_2) = (x_1+x_2) + (y_1+y_2) = (x_1+y_1) + (x_2+y_2) = f(u) + f(v)$.
- $f(\\lambda u) = f(\\lambda x_1, \\lambda y_1) = \\lambda x_1 + \\lambda y_1 = \\lambda(x_1 + y_1) = \\lambda f(u)$.

L'aplicació **és lineal**.

### 2) $f(x, y) = x^2 y^2$

Vegem si és homogènia. Si triem $\\lambda = 2$ i $u = (1, 1)$:
- $f(2u) = f(2, 2) = 2^2 \\cdot 2^2 = 16$.
- $2f(u) = 2f(1, 1) = 2(1^2 \\cdot 1^2) = 2$.

Com que $f(2u) \\neq 2f(u)$, l'aplicació **no és lineal**.

### 3) $f(x, y, z) = (x+7, 2y, x+y+z)$

Comprovem la imatge del vector zero:
- $f(0, 0, 0) = (0+7, 2(0), 0+0+0) = (7, 0, 0)$.

Com que $f(\\vec{0}) \\neq \\vec{0}$, l'aplicació **no és lineal**. (Qualsevol aplicació lineal ha d'enviar el zero al zero).

### 4) $f(x, y) = (x, y-x, x+y)$

Aquesta aplicació es pot escriure en forma matricial:
$f \\begin{pmatrix} x \\\\ y \\end{pmatrix} = \\begin{pmatrix} 1 & 0 \\\\ -1 & 1 \\\\ 1 & 1 \\end{pmatrix} \\begin{pmatrix} x \\\\ y \\end{pmatrix}$

Com que es pot expressar com el producte d'una matriu per un vector (sense termes constants), l'aplicació **és lineal**.

### 5) $f(x, y, z) = (xy, z, x)$

Vegem si és homogènia. Si triem $\\lambda = 2$ i $u = (1, 1, 0)$:
- $f(2, 2, 0) = (2 \\cdot 2, 0, 2) = (4, 0, 2)$.
- $2f(1, 1, 0) = 2(1 \\cdot 1, 0, 1) = (2, 0, 2)$.

Com que $f(2u) \\neq 2f(u)$, l'aplicació **no és lineal**. El terme producte $xy$ trenca la linealitat.
`,
  availableLanguages: ['ca']
};
