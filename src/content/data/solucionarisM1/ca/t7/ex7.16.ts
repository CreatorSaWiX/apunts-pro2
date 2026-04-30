import type { Solution } from '../../../solutions';

export const ex7_16: Solution = {
  id: 'M1-T7-Ex7.16',
  title: 'Exercici 7.16: Càlcul de la matriu associada en base canònica',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Doneu les matrius associades a les aplicacions lineals següents respecte de les bases canòniques:

1) $f: \\mathbb{R}^2 \\to \\mathbb{R}^2$ tal que $f \\begin{pmatrix} 1 \\\\ 1 \\end{pmatrix} = \\begin{pmatrix} 2 \\\\ 2 \\end{pmatrix}$ i $f \\begin{pmatrix} -1 \\\\ 2 \\end{pmatrix} = \\begin{pmatrix} 1 \\\\ -2 \\end{pmatrix}$;

2) $f: \\mathbb{R}^2 \\to \\mathbb{R}^4$ tal que $f \\begin{pmatrix} 2 \\\\ -1 \\end{pmatrix} = \\begin{pmatrix} 1 \\\\ 0 \\\\ -1 \\\\ 3 \\end{pmatrix}$ i $f \\begin{pmatrix} 4 \\\\ 1 \\end{pmatrix} = \\begin{pmatrix} 2 \\\\ -2 \\\\ 3 \\\\ 1 \\end{pmatrix}$;

3) $f: \\mathbb{R}^3 \\to \\mathbb{R}^2$ tal que $f \\begin{pmatrix} 1 \\\\ 1 \\\\ 1 \\end{pmatrix} = \\begin{pmatrix} 1 \\\\ 1 \\end{pmatrix}$, $f \\begin{pmatrix} 0 \\\\ 1 \\\\ 1 \\end{pmatrix} = \\begin{pmatrix} 0 \\\\ 1 \\end{pmatrix}$ i $f \\begin{pmatrix} 1 \\\\ 0 \\\\ 1 \\end{pmatrix} = \\begin{pmatrix} 0 \\\\ 1 \\end{pmatrix}$.`,
  content: `
Per trobar la matriu associada $A$ en la base canònica coneixent les imatges d'un conjunt de vectors $v_i$, podem utilitzar la relació:
$$A \\cdot V = W \\implies A = W \\cdot V^{-1}$$
on $V$ és la matriu que té els vectors originals per columnes i $W$ la matriu amb les seves imatges.

---

### Apartat 1

Definim les matrius:
$$V = \\begin{pmatrix} 1 & -1 \\\\ 1 & 2 \\end{pmatrix}, \\quad W = \\begin{pmatrix} 2 & 1 \\\\ 2 & -2 \\end{pmatrix}$$

Calculem $V^{-1}$: $\\det(V) = 2 - (-1) = 3$.
$$V^{-1} = \\frac{1}{3} \\begin{pmatrix} 2 & 1 \\\\ -1 & 1 \\end{pmatrix}$$

Multipliquem:
$$A = \\begin{pmatrix} 2 & 1 \\\\ 2 & -2 \\end{pmatrix} \\frac{1}{3} \\begin{pmatrix} 2 & 1 \\\\ -1 & 1 \\end{pmatrix} = \\frac{1}{3} \\begin{pmatrix} 3 & 3 \\\\ 6 & 0 \\end{pmatrix} = \\begin{pmatrix} 1 & 1 \\\\ 2 & 0 \\end{pmatrix}$$

---

### Apartat 2

Definim les matrius:
$$V = \\begin{pmatrix} 2 & 4 \\\\ -1 & 1 \\end{pmatrix}, \\quad W = \\begin{pmatrix} 1 & 2 \\\\ 0 & -2 \\\\ -1 & 3 \\\\ 3 & 1 \\end{pmatrix}$$

Calculem $V^{-1}$: $\\det(V) = 2 - (-4) = 6$.
$$V^{-1} = \\frac{1}{6} \\begin{pmatrix} 1 & -4 \\\\ 1 & 2 \\end{pmatrix}$$

Multipliquem:
$$A = \\begin{pmatrix} 1 & 2 \\\\ 0 & -2 \\\\ -1 & 3 \\\\ 3 & 1 \\end{pmatrix} \\frac{1}{6} \\begin{pmatrix} 1 & -4 \\\\ 1 & 2 \\end{pmatrix} = \\frac{1}{6} \\begin{pmatrix} 3 & 0 \\\\ -2 & -4 \\\\ 2 & 10 \\\\ 4 & -10 \\end{pmatrix} = \\begin{pmatrix} 1/2 & 0 \\\\ -1/3 & -2/3 \\\\ 1/3 & 5/3 \\\\ 2/3 & -5/3 \\end{pmatrix}$$

---

### Apartat 3

En aquest cas és més senzill utilitzar la linealitat directament per trobar les imatges de la base canònica $\\{e_1, e_2, e_3\\}$:
1. $f(1, 1, 1) = (1, 1)$
2. $f(0, 1, 1) = (0, 1)$
3. $f(1, 0, 1) = (0, 1)$

- $f(e_1) = f(1, 1, 1) - f(0, 1, 1) = (1, 1) - (0, 1) = (1, 0)$
- $f(e_2) = f(1, 1, 1) - f(1, 0, 1) = (1, 1) - (0, 1) = (1, 0)$
- Per trobar $f(e_3)$, usem la segona equació: $f(e_2) + f(e_3) = (0, 1) \\implies (1, 0) + f(e_3) = (0, 1) \\implies f(e_3) = (-1, 1)$.

La matriu amb aquestes imatges per columnes és:
$$A = \\begin{pmatrix} 1 & 1 & -1 \\\\ 0 & 0 & 1 \\end{pmatrix}$$
`,
  availableLanguages: ['ca']
};
