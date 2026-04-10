import type { Solution } from '../../solutions';

export const ex4_10: Solution = {
  id: 'M1-T4-Ex4.10',
  title: 'Exercici 4.10: Caracteritzacions del Graf Estrella',
  author: 'Antigravity',
  code: '',
  type: 'notebook',
  statement: `Demostreu que les afirmacions següents són equivalents per a un arbre $T$ d'ordre $n \\ge 3$:

  a) $T$ és isomorf al graf estrella $K_{1,n-1}$.

  b) $T$ té exactament $n - 1$ fulles.

  c) $T$ té grau màxim $n - 1$.

  d) $T$ té diàmetre igual a 2.`,
  content: `
Per demostrar l'equivalència, provarem la seqüència: $a \\implies b \\implies c \\implies d \\implies a$.

### a) $\\implies$ b)
Si $T \\cong K_{1,n-1}$, tenim un vèrtex central connectat a tot la resta. La resta de $n-1$ vèrtexs només tenen una aresta (la que va al centre), per tant, tots ells són fulles (grau 1). Llavors, hi ha exactament **$n-1$ fulles**.

### b) $\\implies$ c)
Si l'arbre té $n-1$ fulles, només queda $1$ vèrtex que no és fulla ($n - (n-1) = 1$). Anomenem-lo $v$.
Sabem que la suma de graus és $2n - 2$. Sumem els graus:
$$(n-1) \\cdot 1 + g(v) = 2n - 2 \\implies g(v) = (2n - 2) - (n - 1) = n - 1$$
Així, el **grau màxim és $n - 1$**.

### c) $\\implies$ d)
Sia $v$ el vèrtex de grau $n-1$. Com que el graf té $n$ vèrtexs, $v$ ha d'estar connectat a tots els altres vèrtexs de l'arbre.
- La distància de $v$ a qualsevol altre vèrtex és 1.
- La distància entre qualsevol parell de vèrtexs que no són $v$ és 2 (passant per $v$). Com que $n \\ge 3$, existeixen almenys dos vèrtexs d'aquest tipus.
El **diàmetre** (distància màxima) és, per tant, **2**.

### d) $\\implies$ a)
Si el diàmetre és 2, no pot haver-hi cap camí de longitud 3 ($u-v-w-z$). En un arbre, això només és possible si hi ha un únic vèrtex "central" connectat a tota la resta (fulles), o si fos un $K_2$ (però $n \\ge 3$). Si hi hagués dos vèrtexs de grau $\\ge 2$ connectats entre ells, el diàmetre seria com a mínim 3. Per tant, $T$ ha de ser un **graf estrella $K_{1,n-1}$**. $\\square$
`,
  availableLanguages: ['ca']
};
