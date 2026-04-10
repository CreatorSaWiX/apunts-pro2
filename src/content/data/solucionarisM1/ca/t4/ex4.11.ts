import type { Solution } from '../../../solutions';

export const ex4_11: Solution = {
  id: 'M1-T4-Ex4.11',
  title: 'Exercici 4.11: Grafs Unicíclics',
  author: 'Antigravity',
  code: '',
  type: 'notebook',
  statement: `Sigui $G$ un graf d'ordre $n$ i mida $m$. Demostreu que les propietats següents són equivalents:
a) El graf $G$ és connex i té un únic cicle.
b) Existeix una aresta $a$ de $G$ tal que $G - a$ és un arbre.
c) El graf $G$ és connex i $n = m$.`,
  content: `
Probarem l'equivalència mitjançant la cadena: $a \\implies b \\implies c \\implies a$.

### a) $\\implies$ b)
Si $G$ és connex i té un **únic cicle**, qualsevol aresta $a$ que formi part d'aquest cicle no és un pont (eliminar-la no desconnecta el graf). Per tant, $G - a$ segueix sent connex. Com que hem trencat l'únic cicle que existia, $G - a$ passa a ser acíclic. Un graf connex i acíclic és, per definició, un **arbre**.

### b) $\\implies$ c)
Si existeix una aresta $a$ tal que $G - a$ és un arbre:
- L'arbre $G - a$ té ordre $n$ (els vèrtexs no canvien) i mida $m - 1$ (hem tret una aresta).
- Per la propietat dels arbres, $(m - 1) = n - 1 \\implies \\mathbf{m = n}$.
- Com que l'arbre $G - a$ és connex, el graf original $G$ també ha de ser **connex**.

### c) $\\implies$ a)
Si $G$ és connex i $n = m$:
- Sabem que un graf connex necessita com a mínim $n - 1$ arestes per ser acíclic (arbre). En tenir $n$ arestes (una més del compte), el graf **ha de contenir almenys un cicle**.
- Si eliminem una aresta $a$ d'aquest cicle, obtenim un graf connex amb $n$ vèrtexs i $n - 1$ arestes. Aquest subgraf ha de ser un arbre (i per tant, acíclic).
- Si el graf original tingués més d'un cicle, el subgraf encara contindria algun cicle i no seria un arbre. Per tant, el cicle inicial ha de ser **únic**. $\\square$
`,
  availableLanguages: ['ca']
};
