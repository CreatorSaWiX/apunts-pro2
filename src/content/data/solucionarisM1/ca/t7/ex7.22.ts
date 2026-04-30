import type { Solution } from '../../../solutions';

export const ex7_22: Solution = {
  id: 'M1-T7-Ex7.22',
  title: 'Exercici 7.22: Interpretació geomètrica de matrius 2x2',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Considerem les aplicacions lineals associades a les matrius següents i la seva interpretació geomètrica en aplicar-les a un vector $\\begin{pmatrix} x \\\\ y \\end{pmatrix} \\in \\mathbb{R}^2$:

1) $\\begin{pmatrix} 1 & 0 \\\\ 0 & -1 \\end{pmatrix}$ $\\to$ Reflexió respecte de l'eix $OX$;

2) $\\begin{pmatrix} -1 & 0 \\\\ 0 & 1 \\end{pmatrix}$ $\\to$ Reflexió respecte de l'eix $OY$;

3) $\\begin{pmatrix} 1 & 0 \\\\ 0 & 0 \\end{pmatrix}$ $\\to$ Projecció ortogonal sobre l'eix $OX$;

4) $\\begin{pmatrix} 0 & 0 \\\\ 0 & 1 \\end{pmatrix}$ $\\to$ Projecció ortogonal sobre l'eix $OY$;

5) $\\begin{pmatrix} k & 0 \\\\ 0 & k \\end{pmatrix}$ $\\to$ Escalat de factor $k$;

6) $\\begin{pmatrix} \\cos \\alpha & -\\sin \\alpha \\\\ \\sin \\alpha & \\cos \\alpha \\end{pmatrix}$ $\\to$ Rotació antihorària d'angle $\\alpha$.`,
  content: `
Per verificar la interpretació geomètrica d'aquestes matrius, apliquem cadascuna d'elles a un vector genèric $\\vec{v} = (x, y)^T$.

---

### 1) Reflexió respecte de l'eix $OX$
$$\\begin{pmatrix} 1 & 0 \\\\ 0 & -1 \\end{pmatrix} \\begin{pmatrix} x \\\\ y \\end{pmatrix} = \\begin{pmatrix} x \\\\ -y \\end{pmatrix}$$
El component $x$ es manté igual, però el component $y$ canvia de signe. Això equival a "reflectir" el punt a través de l'eix horitzontal.

### 2) Reflexió respecte de l'eix $OY$
$$\\begin{pmatrix} -1 & 0 \\\\ 0 & 1 \\end{pmatrix} \\begin{pmatrix} x \\\\ y \\end{pmatrix} = \\begin{pmatrix} -x \\\\ y \\end{pmatrix}$$
El component $y$ es manté igual, però el component $x$ canvia de signe. Això equival a "reflectir" el punt a través de l'eix vertical.

### 3) Projecció ortogonal sobre l'eix $OX$
$$\\begin{pmatrix} 1 & 0 \\\\ 0 & 0 \\end{pmatrix} \\begin{pmatrix} x \\\\ y \\end{pmatrix} = \\begin{pmatrix} x \\\\ 0 \\end{pmatrix}$$
S'elimina la component vertical del vector, deixant només la seva "ombra" sobre l'eix $x$.

### 4) Projecció ortogonal sobre l'eix $OY$
$$\\begin{pmatrix} 0 & 0 \\\\ 0 & 1 \\end{pmatrix} \\begin{pmatrix} x \\\\ y \\end{pmatrix} = \\begin{pmatrix} 0 \\\\ y \\end{pmatrix}$$
S'elimina la component horitzontal del vector, deixant només la seva "ombra" sobre l'eix $y$.

### 5) Escalat (Homotècia) de factor $k$
$$\\begin{pmatrix} k & 0 \\\\ 0 & k \\end{pmatrix} \\begin{pmatrix} x \\\\ y \\end{pmatrix} = \\begin{pmatrix} kx \\\\ ky \\end{pmatrix} = k \\begin{pmatrix} x \\\\ y \\end{pmatrix}$$
El vector s'allarga o s'escurça mantenint la mateixa direcció (si $k>0$). És una dilatació o contracció uniforme.

### 6) Rotació antihorària d'angle $\\alpha$
$$\\begin{pmatrix} \\cos \\alpha & -\\sin \\alpha \\\\ \\sin \\alpha & \\cos \\alpha \\end{pmatrix} \\begin{pmatrix} x \\\\ y \\end{pmatrix} = \\begin{pmatrix} x \\cos \\alpha - y \\sin \\alpha \\\\ x \\sin \\alpha + y \\cos \\alpha \\end{pmatrix}$$
Aquesta és la matriu de rotació estàndard que gira qualsevol vector un angle $\\alpha$ al voltant de l'origen en sentit contrari a les agulles del rellotge.
`,
  availableLanguages: ['ca']
};
