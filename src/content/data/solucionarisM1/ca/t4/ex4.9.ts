import type { Solution } from '../../../solutions';

export const ex4_9: Solution = {
  id: 'M1-T4-Ex4.9',
  title: 'Exercici 4.9: Grau Màxim i Nombre de Fulles',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Sigui $T$ un arbre d'ordre $n \\ge 2$ i de grau màxim $\\Delta$. Proveu que $T$ té un mínim de $\\Delta$ fulles.`,
  content: `Utilitzarem la fórmula de les fulles demostrada a l'exercici 4.7:
$$n_1 = 2 + \\sum_{i=3}^{\\Delta} (i - 2) n_i$$

Sabem que el grau màxim de l'arbre és $\\Delta$. Això implica que existeix, almenys, un vèrtex de grau $\\Delta$. Per tant, el nombre de vèrtexs de grau $\\Delta$ és **$n_{\\Delta} \\ge 1$**.
Separem el terme corresponent a $i = \\Delta$ del sumatori:
$$n_1 = 2 + (\\Delta - 2) n_{\\Delta} + \\sum_{i=3}^{\\Delta - 1} (i - 2) n_i$$

Com que tots els $n_i$ són enters no negatius ($n_i \\ge 0$) i els coeficients $(i-2)$ són positius ($i \\ge 3$), el sumatori restant és $\\ge 0$. A més, sabem que $n_{\\Delta} \\ge 1$:

$$n_1 \\ge 2 + (\\Delta - 2) \\cdot 1$$
$$n_1 \\ge 2 + \\Delta - 2$$
$$n_1 \\ge \\Delta$$

Per tant, qualsevol arbre amb grau màxim $\\Delta$ ha de tenir, com a mínim, **$\\Delta$ fulles**. $\\square$
`,
  availableLanguages: ['ca']
};
