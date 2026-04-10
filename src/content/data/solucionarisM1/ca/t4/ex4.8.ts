import type { Solution } from '../../../solutions';

export const ex4_8: Solution = {
  id: 'M1-T4-Ex4.8',
  title: 'Exercici 4.8: Condició per ser Arbre (Graus 1 i 5)',
  author: 'Antigravity',
  code: '',
  type: 'notebook',
  statement: `Sigui $G$ un graf connex que només té vèrtexs de grau 1 i de grau 5. Sigui $k$ el nombre de vèrtexs de grau 5. Demostreu que $G$ és un arbre si, i només si, el nombre de fulles és $3k + 2$.`,
  content: `Volem demostrar l'equivalència: $G$ és arbre $\\iff n_1 = 3k + 2$.
Com que el graf és connex, $G$ és un arbre si, i només si, $(\\sum d(v) = 2n - 2)$.

Dades del graf:
- $n$ vèrtexs en total.
- $k$ vèrtexs de grau 5.
- $n_1$ vèrtexs de grau 1 (fulles).
- No hi ha vèrtexs de cap altre grau $\\implies n = k + n_1$.

### 1. Càlcul de la suma de graus
$$\\sum d(v) = (5 \\cdot k) + (1 \\cdot n_1) = 5k + n_1$$

### 2. Condició per ser arbre
$G$ és un arbre $\\iff \\sum d(v) = 2n - 2$.
Substituïm els valors:
$$5k + n_1 = 2(k + n_1) - 2 \\implies$$
$$5k + n_1 = 2k + 2n_1 - 2 \\implies$$
$$5k - 2k + 2 = 2n_1 - n_1 \\implies$$
$$3k + 2 = n_1$$

Per tant, $G$ és un arbre si, i només si, el nombre de fulles és exactament **$3k + 2$**. $\square$
`,
  availableLanguages: ['ca']
};
