import type { Solution } from '../../../solutions';

export const ex6_29: Solution = {
  id: 'M1-T6-Ex6.29',
  title: 'Exercici 6.29: Base d’un Subespai a R5 i Extensió',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Trobeu una base del subespai $E$ de $\\mathbb{R}^5$ i completeu-la a una base de $\\mathbb{R}^5$, sent:
$$E = \\left\\{ \\begin{pmatrix} x_1 \\\\ x_2 \\\\ x_3 \\\\ x_4 \\\\ x_5 \\end{pmatrix} \\in \\mathbb{R}^5 : x_3 = x_1 + x_2 - x_4, \\, x_5 = x_2 - x_1 \\right\\}$$`,
  content: `
### 1) Trobar una base del subespai $E$

El subespai $E$ està definit per dues equacions lineals a $\\mathbb{R}^5$. Per tant, la seva dimensió serà $5 - 2 = 3$. Expressem un vector genèric de $E$ en funció dels paràmetres lliures ($x_1, x_2, x_4$):

$$\\begin{pmatrix} x_1 \\\\ x_2 \\\\ x_3 \\\\ x_4 \\\\ x_5 \\end{pmatrix} = \\begin{pmatrix} x_1 \\\\ x_2 \\\\ x_1 + x_2 - x_4 \\\\ x_4 \\\\ x_2 - x_1 \\end{pmatrix}$$

Podem desglossar aquest vector com a combinació lineal dels paràmetres:
$$\\begin{pmatrix} x_1 \\\\ x_2 \\\\ x_3 \\\\ x_4 \\\\ x_5 \\end{pmatrix} = x_1 \\begin{pmatrix} 1 \\\\ 0 \\\\ 1 \\\\ 0 \\\\ -1 \\end{pmatrix} + x_2 \\begin{pmatrix} 0 \\\\ 1 \\\\ 1 \\\\ 0 \\\\ 1 \\end{pmatrix} + x_4 \\begin{pmatrix} 0 \\\\ 0 \\\\ -1 \\\\ 1 \\\\ 0 \\end{pmatrix}$$

Els vectors obtinguts són linealment independents (es pot observar per la posició dels zeros i uns). Per tant, una base de $E$ és:
$$\\mathbf{\\mathcal{B}_E = \\left\\{ \\begin{pmatrix} 1 \\\\ 0 \\\\ 1 \\\\ 0 \\\\ -1 \\end{pmatrix}, \\begin{pmatrix} 0 \\\\ 1 \\\\ 1 \\\\ 0 \\\\ 1 \\end{pmatrix}, \\begin{pmatrix} 0 \\\\ 0 \\\\ -1 \\\\ 1 \\\\ 0 \\end{pmatrix} \\right\\}}$$

---

### 2) Completar a una base de $\\mathbb{R}^5$

Per completar la base de $E$ fins a una base de tot l'espai $\\mathbb{R}^5$, hem d'afegir 2 vectors que siguin linealment independents respecte als tres anteriors. 

Col·loquem els vectors de la base $\\mathcal{B}_E$ en una matriu i busquem vectors de la base canònica que mantinguin el rang màxim:
$$M = \\begin{pmatrix} 1 & 0 & 0 \\\\ 0 & 1 & 0 \\\\ 1 & 1 & -1 \\\\ 0 & 0 & 1 \\\\ -1 & 1 & 0 \\end{pmatrix}$$

Si afegim els vectors $e_4 = (0, 0, 0, 1, 0)$ i $e_5 = (0, 0, 0, 0, 1)$, la matriu global $5 \\times 5$ seria:
$$\\tilde{M} = \\begin{pmatrix} 1 & 0 & 0 & 0 & 0 \\\\ 0 & 1 & 0 & 0 & 0 \\\\ 1 & 1 & -1 & 0 & 0 \\\\ 0 & 0 & 1 & 1 & 0 \\\\ -1 & 1 & 0 & 0 & 1 \\end{pmatrix}$$

El determinant d'aquesta matriu és producte dels elements de la diagonal (és triangular inferior si reordenem files, o simplement veient els pivots):
$$\\det(\\tilde{M}) = 1 \\cdot 1 \\cdot (-1) \\cdot 1 \\cdot 1 = -1$$

Com que el determinant és diferent de zero, el conjunt resultant és una base de $\\mathbb{R}^5$:
$$\\mathbf{\\mathcal{B}_{final} = \\left\\{ \\begin{pmatrix} 1 \\\\ 0 \\\\ 1 \\\\ 0 \\\\ -1 \\end{pmatrix}, \\begin{pmatrix} 0 \\\\ 1 \\\\ 1 \\\\ 0 \\\\ 1 \\end{pmatrix}, \\begin{pmatrix} 0 \\\\ 0 \\\\ -1 \\\\ 1 \\\\ 0 \\end{pmatrix}, \\begin{pmatrix} 0 \\\\ 0 \\\\ 0 \\\\ 1 \\\\ 0 \\end{pmatrix}, \\begin{pmatrix} 0 \\\\ 0 \\\\ 0 \\\\ 0 \\\\ 1 \\end{pmatrix} \\right\\}}$$
`,
  availableLanguages: ['ca']
};
