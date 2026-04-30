import type { Solution } from '../../../solutions';

export const ex7_23: Solution = {
  id: 'M1-T7-Ex7.23',
  title: 'Exercici 7.23: Composició de transformacions geomètriques',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Doneu la matriu de la composició de les aplicacions lineals de $\\mathbb{R}^2$ següents:

1) Una rotació de $30^\\circ$ en sentit antihorari seguida d'una reflexió respecte a l'eix $OY$;
2) Una projecció ortogonal sobre l'eix $y$, seguida d'un escalat de factor $k = 1/2$;
3) Un escalat de factor $k = 2$, seguida d'una rotació de $45^\\circ$ en sentit antihorari seguit d'una reflexió respecte a l'eix $OY$.`,
  content: `
Recordem que la matriu de la composició $g \\circ f$ és el producte de matrius $M_g \\cdot M_f$ (la matriu de l'aplicació que s'aplica primer va a la dreta).

---

### 1) Rotació de $30^\\circ$ i reflexió $OY$

- **Rotació $30^\\circ$ ($M_R$):**
  $$M_R = \\begin{pmatrix} \\cos 30^\\circ & -\\sin 30^\\circ \\\\ \\sin 30^\\circ & \\cos 30^\\circ \\end{pmatrix} = \\begin{pmatrix} \\sqrt{3}/2 & -1/2 \\\\ 1/2 & \\sqrt{3}/2 \\end{pmatrix}$$
- **Reflexió $OY$ ($M_S$):**
  $$M_S = \\begin{pmatrix} -1 & 0 \\\\ 0 & 1 \\end{pmatrix}$$

**Composició ($M_S \\cdot M_R$):**
$$M_{S \\circ R} = \\begin{pmatrix} -1 & 0 \\\\ 0 & 1 \\end{pmatrix} \\begin{pmatrix} \\sqrt{3}/2 & -1/2 \\\\ 1/2 & \\sqrt{3}/2 \\end{pmatrix} = \\begin{pmatrix} -\\sqrt{3}/2 & 1/2 \\\\ 1/2 & \\sqrt{3}/2 \\end{pmatrix}$$

---

### 2) Projecció eix $y$ i escalat $k=1/2$

- **Projecció eix $y$ ($M_P$):**
  $$M_P = \\begin{pmatrix} 0 & 0 \\\\ 0 & 1 \\end{pmatrix}$$
- **Escalat $k=1/2$ ($M_E$):**
  $$M_E = \\begin{pmatrix} 1/2 & 0 \\\\ 0 & 1/2 \\end{pmatrix}$$

**Composició ($M_E \\cdot M_P$):**
$$M_{E \\circ P} = \\begin{pmatrix} 1/2 & 0 \\\\ 0 & 1/2 \\end{pmatrix} \\begin{pmatrix} 0 & 0 \\\\ 0 & 1 \\end{pmatrix} = \\begin{pmatrix} 0 & 0 \\\\ 0 & 1/2 \\end{pmatrix}$$

---

### 3) Escalat $k=2$, rotació $45^\\circ$ i reflexió $OY$

- **Escalat $k=2$ ($M_E$):** $M_E = \\begin{pmatrix} 2 & 0 \\\\ 0 & 2 \\end{pmatrix}$
- **Rotació $45^\\circ$ ($M_R$):** $M_R = \\begin{pmatrix} \\sqrt{2}/2 & -\\sqrt{2}/2 \\\\ \\sqrt{2}/2 & \\sqrt{2}/2 \\end{pmatrix}$
- **Reflexió $OY$ ($M_S$):** $M_S = \\begin{pmatrix} -1 & 0 \\\\ 0 & 1 \\end{pmatrix}$

**Composició ($M_S \\cdot M_R \\cdot M_E$):**
Primer $M_S \\cdot M_R$:
$$\\begin{pmatrix} -1 & 0 \\\\ 0 & 1 \\end{pmatrix} \\begin{pmatrix} \\sqrt{2}/2 & -\\sqrt{2}/2 \\\\ \\sqrt{2}/2 & \\sqrt{2}/2 \\end{pmatrix} = \\begin{pmatrix} -\\sqrt{2}/2 & \\sqrt{2}/2 \\\\ \\sqrt{2}/2 & \\sqrt{2}/2 \\end{pmatrix}$$
Després multipliquem per $M_E$:
$$\\begin{pmatrix} -\\sqrt{2}/2 & \\sqrt{2}/2 \\\\ \\sqrt{2}/2 & \\sqrt{2}/2 \\end{pmatrix} \\begin{pmatrix} 2 & 0 \\\\ 0 & 2 \\end{pmatrix} = \\begin{pmatrix} -\\sqrt{2} & \\sqrt{2} \\\\ \\sqrt{2} & \\sqrt{2} \\end{pmatrix}$$
`,
  availableLanguages: ['ca']
};
