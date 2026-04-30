import type { Solution } from '../../../solutions';

export const ex7_11: Solution = {
  id: 'M1-T7-Ex7.11',
  title: 'Exercici 7.11: Nucli, imatges i antiimatges',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Trobeu el nucli de l'aplicació lineal $f: \\mathbb{R}^3 \\to \\mathbb{R}^3$, on $f \\begin{pmatrix} x \\\\ y \\\\ z \\end{pmatrix} = \\begin{pmatrix} x - y \\\\ y - z \\\\ z - x \\end{pmatrix}$, calculeu $f \\begin{pmatrix} 2 \\\\ 0 \\\\ 1 \\end{pmatrix}$ i les antiimatges, si en tenen, dels vectors $\\begin{pmatrix} 2 \\\\ -1 \\\\ -1 \\end{pmatrix}$ i $\\begin{pmatrix} 2 \\\\ -1 \\\\ 0 \\end{pmatrix}$.`,
  content: `
Anem a resoldre l'exercici pas a pas, analitzant l'estructura de l'aplicació lineal $f$.

---

### 1) Càlcul del nucli ($\ker f$)

El nucli està format pels vectors que van a parar al zero:
$$\\begin{pmatrix} x - y \\\\ y - z \\\\ z - x \\end{pmatrix} = \\begin{pmatrix} 0 \\\\ 0 \\\\ 0 \\end{pmatrix}$$

Això ens dona el sistema d'equacions:
1. $x - y = 0 \\implies x = y$
2. $y - z = 0 \\implies y = z$
3. $z - x = 0 \\implies z = x$ (equació redundant)

Totes les variables han de ser iguals ($x = y = z$). Per tant:
$$\\ker f = \\{ (x, x, x) : x \\in \\mathbb{R} \\} = \\langle (1, 1, 1) \\rangle$$
La dimensió del nucli és **1**.

---

### 2) Càlcul de $f(2, 0, 1)$

Substituïm els valors $x=2, y=0, z=1$ a l'expressió de l'aplicació:
$$f(2, 0, 1) = (2 - 0, \\, 0 - 1, \\, 1 - 2) = (2, -1, -1)$$

---

### 3) Estudi de les antiimatges

Observem una propietat important de l'aplicació: la suma de les components de la imatge és sempre zero, ja que $(x-y) + (y-z) + (z-x) = 0$. Això vol dir que qualsevol vector de la imatge ha de tenir suma de components nul·la.

#### Cas A: Vector $(2, -1, -1)$
La suma de les seves components és $2 - 1 - 1 = 0$. Sabem que té antiimatge. De fet, a l'apartat anterior hem vist que $f(2, 0, 1) = (2, -1, -1)$.
El conjunt de totes les antiimatges és la solució particular més el nucli:
$$f^{-1}(2, -1, -1) = \\{ (2, 0, 1) + \\lambda(1, 1, 1) : \\lambda \\in \\mathbb{R} \\}$$

#### Cas B: Vector $(2, -1, 0)$
La suma de les seves components és $2 - 1 + 0 = 1$. Com que la suma no és zero, aquest vector **no pertany a la imatge** de $f$.
Per tant, el vector $(2, -1, 0)$ **no té antiimatge**.
`,
  availableLanguages: ['ca']
};
