import type { Solution } from '../../../solutions';

export const ex6_27: Solution = {
  id: 'M1-T6-Ex6.27',
  title: 'Exercici 6.27: Igualtat de Subespais i Coordenades en R4',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Considereu els subespais de $\\mathbb{R}^4$:
$$F = \\left\\langle \\begin{pmatrix} 1 \\\\ -1 \\\\ 1 \\\\ 0 \\end{pmatrix}, \\begin{pmatrix} 0 \\\\ 1 \\\\ -1 \\\\ 1 \\end{pmatrix}, \\begin{pmatrix} 1 \\\\ 0 \\\\ 0 \\\\ -1 \\end{pmatrix} \\right\\rangle, \\quad G = \\left\\langle \\begin{pmatrix} 1 \\\\ 0 \\\\ 0 \\\\ 0 \\end{pmatrix}, \\begin{pmatrix} 1 \\\\ -2 \\\\ 2 \\\\ 0 \\end{pmatrix}, \\begin{pmatrix} 0 \\\\ 1 \\\\ -1 \\\\ 1 \\end{pmatrix} \\right\\rangle$$

1) Proveu que $F=G$ i que els conjunts generadors donats són bases.
2) Esbrineu si algun dels vectors $w_1 = \\begin{pmatrix} \\sqrt{3} \\\\ \\sqrt{2}-1 \\\\ 1-\\sqrt{2} \\\\ 0 \\end{pmatrix}$ i $w_2 = \\begin{pmatrix} 0 \\\\ 1 \\\\ 0 \\\\ 0 \\end{pmatrix}$ pertany a $F$.
3) Si és el cas, doneu-ne les coordenades en les dues bases.`,
  content: `
### 1) Comprovació de la Base i Igualtat $F=G$

El mètode més ràpid per demostrar que $F=G$ és comprovar que la unió dels seus vectors generadors no fa créixer el rang.
Calculem el rang de cada conjunt per separat:
*   **Per a $F$**: 
$$\\begin{pmatrix} 1 & 0 & 1 \\\\ -1 & 1 & 0 \\\\ 1 & -1 & 0 \\\\ 0 & 1 & -1 \\end{pmatrix} \\xrightarrow[F_3 - F_1]{F_2 + F_1} \\begin{pmatrix} 1 & 0 & 1 \\\\ 0 & 1 & 1 \\\\ 0 & -1 & -1 \\\\ 0 & 1 & -1 \\end{pmatrix} \\xrightarrow[F_4 - F_2]{F_3 + F_2} \\begin{pmatrix} 1 & 0 & 1 \\\\ 0 & 1 & 1 \\\\ 0 & 0 & 0 \\\\ 0 & 0 & -2 \\end{pmatrix} \\implies \\text{Rang } 3$$

*   **Per a $G$**: 
$$\\begin{pmatrix} 1 & 1 & 0 \\\\ 0 & -2 & 1 \\\\ 0 & 2 & -1 \\\\ 0 & 0 & 1 \\end{pmatrix} \\xrightarrow{F_3 + F_2} \\begin{pmatrix} 1 & 1 & 0 \\\\ 0 & -2 & 1 \\\\ 0 & 0 & 0 \\\\ 0 & 0 & 1 \\end{pmatrix} \\implies \\text{Rang } 3$$

Ajuntem els 3 vectors de $F$ i els 3 de $G$ en una sola matriu $4 \\times 6$. Si el rang continua sent 3, vol dir que generen el mateix espai:

$$\\begin{pmatrix} 1 & 0 & 1 & | & 1 & 1 & 0 \\\\ -1 & 1 & 0 & | & 0 & -2 & 1 \\\\ 1 & -1 & 0 & | & 0 & 2 & -1 \\\\ 0 & 1 & -1 & | & 0 & 0 & 1 \\end{pmatrix} \\xrightarrow[F_3 - F_1]{F_2 + F_1} \\begin{pmatrix} 1 & 0 & 1 & | & 1 & 1 & 0 \\\\ 0 & 1 & 1 & | & 1 & -1 & 1 \\\\ 0 & -1 & -1 & | & -1 & 1 & -1 \\\\ 0 & 1 & -1 & | & 0 & 0 & 1 \\end{pmatrix} \\xrightarrow[F_4 - F_2]{F_3 + F_2} \\begin{pmatrix} 1 & 0 & 1 & | & 1 & 1 & 0 \\\\ 0 & 1 & 1 & | & 1 & -1 & 1 \\\\ 0 & 0 & 0 & | & 0 & 0 & 0 \\\\ 0 & 0 & -2 & | & -1 & 1 & 0 \\end{pmatrix}$$

Com que $\\dim(F) = \\dim(G) = 3$ i el rang del conjunt total és 3, concloem que **$F = G$**.

---

### 2) Pertinença de $w_1$ i $w_2$

Per saber si un vector pertany a $F$, mirem si en afegir-lo a la matriu de la base el rang es manté en 3:

$$\\begin{pmatrix} 1 & 0 & 1 & | & \\sqrt{3} \\\\ -1 & 1 & 0 & | & \\sqrt{2}-1 \\\\ 1 & -1 & 0 & | & 1-\\sqrt{2} \\\\ 0 & 1 & -1 & | & 0 \\end{pmatrix} \\xrightarrow[F_3 - F_1]{F_2 + F_1} \\begin{pmatrix} 1 & 0 & 1 & | & \\sqrt{3} \\\\ 0 & 1 & 1 & | & \\sqrt{3}+\\sqrt{2}-1 \\\\ 0 & -1 & -1 & | & 1-\\sqrt{2}-\\sqrt{3} \\\\ 0 & 1 & -1 & | & 0 \\end{pmatrix} \\xrightarrow{F_3 + F_2} \\begin{pmatrix} 1 & 0 & 1 & | & \\sqrt{3} \\\\ 0 & 1 & 1 & | & \\sqrt{3}+\\sqrt{2}-1 \\\\ \\mathbf{0} & \\mathbf{0} & \\mathbf{0} & | & \\mathbf{0} \\\\ 0 & 0 & -2 & | & 1-\\sqrt{2}-\\sqrt{3} \\end{pmatrix}$$

Com que apareix una fila de zeros completa, el sistema és compatible i **$w_1 \\in F$**.

$$\\begin{pmatrix} 1 & 0 & 1 & | & 0 \\\\ -1 & 1 & 0 & | & 1 \\\\ 1 & -1 & 0 & | & 0 \\\\ 0 & 1 & -1 & | & 0 \\end{pmatrix} \\xrightarrow[F_3 - F_1]{F_2 + F_1} \\begin{pmatrix} 1 & 0 & 1 & | & 0 \\\\ 0 & 1 & 1 & | & 1 \\\\ 0 & -1 & -1 & | & 0 \\\\ 0 & 1 & -1 & | & 0 \\end{pmatrix} \\xrightarrow{F_3 + F_2} \\begin{pmatrix} 1 & 0 & 1 & | & 0 \\\\ 0 & 1 & 1 & | & 1 \\\\ \\mathbf{0} & \\mathbf{0} & \\mathbf{0} & | & \\mathbf{1} \\\\ 0 & 1 & -1 & | & 0 \\end{pmatrix}$$

La tercera fila indica $0 = 1$, per tant el sistema és incompatible i **$w_2 \\notin F$**.

---

### 3) Coordenades de $w_1$

### En la base de $F$ ($\\{v_1, v_2, v_3\\}$):
Busquem $c_1, c_2, c_3$ tals que $c_1 v_1 + c_2 v_2 + c_3 v_3 = w_1$. Obtenim el sistema:
1. $c_1 + c_3 = \\sqrt{3}$
2. $-c_1 + c_2 = \\sqrt{2}-1$
3. $c_2 - c_3 = 0 \\implies c_2 = c_3$

Resolent:
$c_2 = c_3 = \\frac{\\sqrt{3} + \\sqrt{2} - 1}{2}, \\quad c_1 = \\frac{\\sqrt{3} - \\sqrt{2} + 1}{2}$

Coordenades: **$(\\frac{\\sqrt{3} - \\sqrt{2} + 1}{2}, \\frac{\\sqrt{3} + \\sqrt{2} - 1}{2}, \\frac{\\sqrt{3} + \\sqrt{2} - 1}{2})_F$**

### En la base de $G$ ($\\{u_1, u_2, u_3\\}$):
Busquem $k_1, k_2, k_3$ tals que $k_1 u_1 + k_2 u_2 + k_3 u_3 = w_1$:
1. $k_1 + k_2 = \\sqrt{3}$
2. $-2k_2 + k_3 = \\sqrt{2}-1$
3. $k_3 = 0$

Resolent:
$k_3 = 0, \\quad k_2 = \\frac{1-\\sqrt{2}}{2}, \\quad k_1 = \\sqrt{3} - \\frac{1-\\sqrt{2}}{2} = \\frac{2\\sqrt{3}-1+\\sqrt{2}}{2}$

Coordenades: **$(\\frac{2\\sqrt{3}-1+\\sqrt{2}}{2}, \\frac{1-\\sqrt{2}}{2}, 0)_G$**
`,
  availableLanguages: ['ca']
};
