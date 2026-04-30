import type { Solution } from '../../../solutions';

export const ex7_25: Solution = {
  id: 'M1-T7-Ex7.25',
  title: 'Exercici 7.25: Interpretació geomètrica de matrius 3x3',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Considerem les aplicacions lineals de $\\mathbb{R}^3$ associades a les matrius següents i la seva interpretació geomètrica:

1) Reflexió respecte del pla $z = 0$;
2) Reflexió respecte del pla $y = 0$;
3) Reflexió respecte del pla $x = 0$;
4) Projecció ortogonal sobre el pla $z = 0$;
5) Projecció ortogonal sobre el pla $y = 0$;
6) Projecció ortogonal sobre el pla $x = 0$;
7) Rotació d'angle $\\alpha$ respecte a l'eix $OZ$;
8) Rotació d'angle $\\alpha$ respecte a l'eix $OY$;
9) Rotació d'angle $\\alpha$ respecte a l'eix $OX$.`,
  content: `
Apliquem cada matriu a un vector genèric $\\vec{v} = (x, y, z)^T$ per verificar-ne l'efecte.

---

### Reflexions respecte de plans de coordenades
Es canvia el signe de la coordenada perpendicular al pla.
1. **Pla $z=0$:** $\\begin{pmatrix} 1 & 0 & 0 \\\\ 0 & 1 & 0 \\\\ 0 & 0 & -1 \\end{pmatrix} \\begin{pmatrix} x \\\\ y \\\\ z \\end{pmatrix} = \\begin{pmatrix} x \\\\ y \\\\ -z \\end{pmatrix}$
2. **Pla $y=0$:** $\\begin{pmatrix} 1 & 0 & 0 \\\\ 0 & -1 & 0 \\\\ 0 & 0 & 1 \\end{pmatrix} \\begin{pmatrix} x \\\\ y \\\\ z \\end{pmatrix} = \\begin{pmatrix} x \\\\ -y \\\\ z \\end{pmatrix}$
3. **Pla $x=0$:** $\\begin{pmatrix} -1 & 0 & 0 \\\\ 0 & 1 & 0 \\\\ 0 & 0 & 1 \\end{pmatrix} \\begin{pmatrix} x \\\\ y \\\\ z \\end{pmatrix} = \\begin{pmatrix} -x \\\\ y \\\\ z \\end{pmatrix}$

---

### Projeccions ortogonals sobre plans de coordenades
S'anul·la la coordenada perpendicular al pla.
4. **Pla $z=0$:** $\\begin{pmatrix} 1 & 0 & 0 \\\\ 0 & 1 & 0 \\\\ 0 & 0 & 0 \\end{pmatrix} \\begin{pmatrix} x \\\\ y \\\\ z \\end{pmatrix} = \\begin{pmatrix} x \\\\ y \\\\ 0 \\end{pmatrix}$
5. **Pla $y=0$:** $\\begin{pmatrix} 1 & 0 & 0 \\\\ 0 & 0 & 0 \\\\ 0 & 0 & 1 \\end{pmatrix} \\begin{pmatrix} x \\\\ y \\\\ z \\end{pmatrix} = \\begin{pmatrix} x \\\\ 0 \\\\ z \\end{pmatrix}$
6. **Pla $x=0$:** $\\begin{pmatrix} 0 & 0 & 0 \\\\ 0 & 1 & 0 \\\\ 0 & 0 & 1 \\end{pmatrix} \\begin{pmatrix} x \\\\ y \\\\ z \\end{pmatrix} = \\begin{pmatrix} 0 \\\\ y \\\\ z \\end{pmatrix}$

---

### Rotacions respecte dels eixos de coordenades
7. **Eix $OZ$:** La coordenada $z$ no canvia. Rotació en el pla $XY$:
   $$\\begin{pmatrix} \\cos \\alpha & -\\sin \\alpha & 0 \\\\ \\sin \\alpha & \\cos \\alpha & 0 \\\\ 0 & 0 & 1 \\end{pmatrix}$$
8. **Eix $OY$:** La coordenada $y$ no canvia. Rotació en el pla $XZ$:
   $$\\begin{pmatrix} \\cos \\alpha & 0 & \\sin \\alpha \\\\ 0 & 1 & 0 \\\\ -\\sin \\alpha & 0 & \\cos \\alpha \\end{pmatrix}$$
9. **Eix $OX$:** La coordenada $x$ no canvia. Rotació en el pla $YZ$:
   $$\\begin{pmatrix} 1 & 0 & 0 \\\\ 0 & \\cos \\alpha & -\\sin \\alpha \\\\ 0 & \\sin \\alpha & \\cos \\alpha \\end{pmatrix}$$
`,
  availableLanguages: ['ca']
};
