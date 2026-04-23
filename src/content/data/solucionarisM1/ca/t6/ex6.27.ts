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

### Per al subespai $F$:
Comprovem si els vectors generadors $\\{v_1, v_2, v_3\\}$ són linealment independents (LI):
$$\\begin{pmatrix} 1 & 0 & 1 \\\\ -1 & 1 & 0 \\\\ 1 & -1 & 0 \\\\ 0 & 1 & -1 \\end{pmatrix} \\xrightarrow[f_3+f_2]{f_2+f_1} \\begin{pmatrix} 1 & 0 & 1 \\\\ 0 & 1 & 1 \\\\ 0 & 0 & 0 \\\\ 0 & 1 & -1 \\end{pmatrix} \\implies \\text{Rang } 3$$
(Els vectors són LI, per tant formen una base de $F$). Observant els vectors, tots compleixen la condició $y + z = 0$. Per tant, l'equació de $F$ és **$y + z = 0$**.

### Per al subespai $G$:
Comprovem els generadors $\\{u_1, u_2, u_3\\}$:
$$\\text{Rang} \\begin{pmatrix} 1 & 1 & 0 \\\\ 0 & -2 & 1 \\\\ 0 & 2 & -1 \\\\ 0 & 0 & 1 \\end{pmatrix} \\implies \\text{Rang } 3$$
(Els vectors són LI, base de $G$). Tots els vectors de $G$ també compleixen **$y + z = 0$**.
Com que $\\dim(F) = \\dim(G) = 3$ i ambdós estan definits per la mateixa equació implícita a $\\mathbb{R}^4$, concloem que **$F = G$**.

---

### 2) Pertinença de $w_1$ i $w_2$

Utilitzem l'equació implícita $y + z = 0$:
*   **Vector $w_1$**: $(\\sqrt{2}-1) + (1-\\sqrt{2}) = 0$. **Pertany a $F$**.
*   **Vector $w_2$**: $1 + 0 = 1 \\neq 0$. **No pertany a $F$**.

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
