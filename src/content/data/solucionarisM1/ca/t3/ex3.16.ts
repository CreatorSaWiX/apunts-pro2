import type { Solution } from '../../../solutions';

export const ex3_16: Solution = {
  id: 'M1-T3-Ex3.16',
  title: 'Exercici 3.16: Existència de Camí Hamiltonià',
  author: 'Profe',
  code: '',
  type: 'notebook',
  statement: `Sigui $G$ un graf d'ordre $n \\ge 2$ tal que cada vèrtex té grau $\\ge (n-1)/2$. Demostreu que $G$ té un camí hamiltonià.`,
  content: `
Per demostrar l'existència d'un camí hamiltonià en $G$, utilitzarem una construcció auxiliar que ens permeti aplicar el **Teorema de Dirac**.

### Teorema de Dirac (per a cicles)
Recordem que un graf amb $N$ vèrtexs té un cicle hamiltonià si cada vèrtex té grau $\\ge N/2$.

### Demostració

1. **Construcció del graf auxiliar $G'$**:
   Creem un nou graf $G'$ afegint un vèrtex extra $x$ al graf original $G$. Connectem aquest vèrtex $x$ amb **tots** els vèrtexs originals de $G$.
   - L'ordre del nou graf $G'$ és $N = n + 1$.

2. **Càlcul dels graus en $G'$**:
   - Per a qualsevol vèrtex $v$ original de $G$:
     $$g_{G'}(v) = g_G(v) + 1 \\ge \\frac{n-1}{2} + 1 = \\frac{n+1}{2}$$
     Com que $N = n+1$, això significa que $g_{G'}(v) \\ge \\frac{N}{2}$.
   - Per al vèrtex nou $x$:
     $$g_{G'}(x) = n$$
     Com que $n \\ge \\frac{n+1}{2}$ per a tot $n \\ge 1$ (i sabem que $n \\ge 2$), també es compleix que $g_{G'}(x) \\ge \\frac{N}{2}$.

3. **Aplicació de Dirac a $G'$**:
   Com que tots els vèrtexs de $G'$ tenen grau $\\ge N/2$, el graf $G'$ té un **cicle hamiltonià**.

4. **Retorn al graf original $G$**:
   Un cicle hamiltonià a $G'$ passa per tots els vèrtexs, inclòs el vèrtex $x$. La seqüència seria:
   $$\\dots \\to v_i \\to x \\to v_j \\to \\dots$$
   Si eliminem el vèrtex $x$ d'aquest cicle, ens queda una seqüència de tots els vèrtexs de $G$ que encara estan connectats (ja que eren adjacents a través de $x$ però el camí segueix la resta d'arestes de $G$).
   En retirar $x$, el cicle es "trenca" precisament en el vèrtex extra, deixant un **camí hamiltonià** que recorre tots els vèrtexs originals de $G$.

### Conclusió
L'existència d'un cicle hamiltonià en el graf augmentat garanteix l'existència d'un camí hamiltonià en el graf original sota les condicions de grau donades.
  `,
  availableLanguages: ['ca']
};
