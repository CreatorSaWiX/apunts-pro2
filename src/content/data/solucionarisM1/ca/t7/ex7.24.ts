import type { Solution } from '../../../solutions';

export const ex7_24: Solution = {
  id: 'M1-T7-Ex7.24',
  title: 'Exercici 7.24: Commutativitat d\'aplicacions lineals',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Siguin $f_1, f_2: \\mathbb{R}^2 \\to \\mathbb{R}^2$ aplicacions lineals. Determineu si $f_1 \\circ f_2 = f_2 \\circ f_1$ (si commuten) en els casos següents:

1) $f_1$ és la projecció sobre $OY$ i $f_2$ la projecció sobre $OX$.
2) $f_1$ i $f_2$ són rotacions d'angles $\\theta_1$ i $\\theta_2$.
3) $f_1$ és la reflexió respecte $OX$ i $f_2$ la reflexió respecte $OY$.
4) $f_1$ és la projecció sobre $OY$ i $f_2$ una rotació d'angle $\\theta$.`,
  content: `
Dues aplicacions lineals commuten si i només si el producte de les seves matrius associades és commutatiu: $M_1 \\cdot M_2 = M_2 \\cdot M_1$.

---

### 1) Projeccions sobre els eixos
$M_1 = \\begin{pmatrix} 0 & 0 \\\\ 0 & 1 \\end{pmatrix}$, $M_2 = \\begin{pmatrix} 1 & 0 \\\\ 0 & 0 \\end{pmatrix}$
- $M_1 M_2 = \\begin{pmatrix} 0 & 0 \\\\ 0 & 1 \\end{pmatrix} \\begin{pmatrix} 1 & 0 \\\\ 0 & 0 \\end{pmatrix} = \\begin{pmatrix} 0 & 0 \\\\ 0 & 0 \\end{pmatrix}$
- $M_2 M_1 = \\begin{pmatrix} 1 & 0 \\\\ 0 & 0 \\end{pmatrix} \\begin{pmatrix} 0 & 0 \\\\ 0 & 1 \\end{pmatrix} = \\begin{pmatrix} 0 & 0 \\\\ 0 & 0 \\end{pmatrix}$
**Sí commuten.** (El resultat és l'aplicació nul·la en ambdós casos).

---

### 2) Dues rotacions
Les rotacions en el pla $\\mathbb{R}^2$ sempre commuten, ja que el resultat d'aplicar dues rotacions seguides és una rotació de la suma dels angles, independentment de l'ordre:
- $R_{\\theta_1} \\circ R_{\\theta_2} = R_{\\theta_1 + \\theta_2}$
- $R_{\\theta_2} \\circ R_{\\theta_1} = R_{\\theta_2 + \\theta_1}$
**Sí commuten.**

---

### 3) Reflexions respecte els eixos
$M_1 = \\begin{pmatrix} 1 & 0 \\\\ 0 & -1 \\end{pmatrix}$, $M_2 = \\begin{pmatrix} -1 & 0 \\\\ 0 & 1 \\end{pmatrix}$
- $M_1 M_2 = \\begin{pmatrix} -1 & 0 \\\\ 0 & -1 \\end{pmatrix}$
- $M_2 M_1 = \\begin{pmatrix} -1 & 0 \\\\ 0 & -1 \\end{pmatrix}$
**Sí commuten.** (La composició de dues reflexions respecte eixos perpendiculars és una simetria central o rotació de $180^\\circ$).

---

### 4) Projecció sobre $OY$ i rotació d'angle $\\theta$
$M_1 = \\begin{pmatrix} 0 & 0 \\\\ 0 & 1 \\end{pmatrix}$, $M_2 = \\begin{pmatrix} \\cos \\theta & -\\sin \\theta \\\\ \\sin \\theta & \\cos \\theta \\end{pmatrix}$
- $M_1 M_2 = \\begin{pmatrix} 0 & 0 \\\\ \\sin \\theta & \\cos \\theta \\end{pmatrix}$
- $M_2 M_1 = \\begin{pmatrix} 0 & -\\sin \\theta \\\\ 0 & \\cos \\theta \\end{pmatrix}$
Perquè siguin iguals, caldria que $\\sin \\theta = 0$ (és a dir, $\\theta = 0$ o $\\theta = \\pi$).
**En general, no commuten.**
`,
  availableLanguages: ['ca']
};
