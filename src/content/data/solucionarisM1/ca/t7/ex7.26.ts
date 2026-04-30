import type { Solution } from '../../../solutions';

export const ex7_26: Solution = {
  id: 'M1-T7-Ex7.26',
  title: 'Exercici 7.26: Composició de transformacions en 3D',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Doneu la matriu de la composició de les aplicacions lineals de $\\mathbb{R}^3$ següents:

1) Reflexió respecte el pla $x = 0$, seguida d'una projecció ortogonal sobre el pla $y = 0$;
2) Rotació de $45^\\circ$ respecte l'eix $OY$, seguida d'un escalat de factor $k = \\sqrt{2}$;
3) Rotació de $30^\\circ$ respecte l'eix $OX$, seguida d'una rotació de $30^\\circ$ respecte l'eix $OZ$, seguida d'un escalat de factor $k = 1/3$.`,
  content: `
Multipliquem les matrius en l'ordre de la composició (de dreta a esquerra).

---

### 1) Reflexió $x=0$ i projecció $y=0$

- **Reflexió $x=0$ ($M_1$):** $M_1 = \\begin{pmatrix} -1 & 0 & 0 \\\\ 0 & 1 & 0 \\\\ 0 & 0 & 1 \\end{pmatrix}$
- **Projecció $y=0$ ($M_2$):** $M_2 = \\begin{pmatrix} 1 & 0 & 0 \\\\ 0 & 0 & 0 \\\\ 0 & 0 & 1 \\end{pmatrix}$

**Composició ($M_2 M_1$):**
$$M = \\begin{pmatrix} 1 & 0 & 0 \\\\ 0 & 0 & 0 \\\\ 0 & 0 & 1 \\end{pmatrix} \\begin{pmatrix} -1 & 0 & 0 \\\\ 0 & 1 & 0 \\\\ 0 & 0 & 1 \\end{pmatrix} = \\begin{pmatrix} -1 & 0 & 0 \\\\ 0 & 0 & 0 \\\\ 0 & 0 & 1 \\end{pmatrix}$$

---

### 2) Rotació eix $OY$ i escalat $k = \\sqrt{2}$

- **Rotació $45^\\circ$ eix $OY$ ($M_R$):**
  $$M_R = \\begin{pmatrix} \\cos 45^\\circ & 0 & \\sin 45^\\circ \\\\ 0 & 1 & 0 \\\\ -\\sin 45^\\circ & 0 & \\cos 45^\\circ \\end{pmatrix} = \\begin{pmatrix} \\sqrt{2}/2 & 0 & \\sqrt{2}/2 \\\\ 0 & 1 & 0 \\\\ -\\sqrt{2}/2 & 0 & \\sqrt{2}/2 \\end{pmatrix}$$
- **Escalat $k = \\sqrt{2}$ ($M_E$):** $M_E = \\sqrt{2} I$

**Composició ($M_E M_R$):**
$$M = \\sqrt{2} \\begin{pmatrix} \\sqrt{2}/2 & 0 & \\sqrt{2}/2 \\\\ 0 & 1 & 0 \\\\ -\\sqrt{2}/2 & 0 & \\sqrt{2}/2 \\end{pmatrix} = \\begin{pmatrix} 1 & 0 & 1 \\\\ 0 & \\sqrt{2} & 0 \\\\ -1 & 0 & 1 \\end{pmatrix}$$

---

### 3) Rotació $OX$, rotació $OZ$ i escalat $k = 1/3$

- **Rotació $30^\\circ$ eix $OX$ ($M_1$):**
  $$M_1 = \\begin{pmatrix} 1 & 0 & 0 \\\\ 0 & \\sqrt{3}/2 & -1/2 \\\\ 0 & 1/2 & \\sqrt{3}/2 \\end{pmatrix}$$
- **Rotació $30^\\circ$ eix $OZ$ ($M_2$):**
  $$M_2 = \\begin{pmatrix} \\sqrt{3}/2 & -1/2 & 0 \\\\ 1/2 & \\sqrt{3}/2 & 0 \\\\ 0 & 0 & 1 \\end{pmatrix}$$

**Producte $M_2 M_1$:**
$$M_2 M_1 = \\begin{pmatrix} \\sqrt{3}/2 & -\\sqrt{3}/4 & 1/4 \\\\ 1/2 & 3/4 & -\\sqrt{3}/4 \\\\ 0 & 1/2 & \\sqrt{3}/2 \\end{pmatrix}$$

**Escalat per $k = 1/3$:**
$$M = \\begin{pmatrix} \\sqrt{3}/6 & -\\sqrt{3}/12 & 1/12 \\\\ 1/6 & 1/4 & -\\sqrt{3}/12 \\\\ 0 & 1/6 & \\sqrt{3}/6 \\end{pmatrix}$$
`,
  availableLanguages: ['ca']
};
