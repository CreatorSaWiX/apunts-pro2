import type { Solution } from '../../solutions';

export const ex1_24: Solution = {
  id: 'M1-T1-Ex1.24',
  title: 'Exercici 1.24: Isomorfismes de Complementaris',
  author: 'Profe',
  code: '',
  type: 'notebook',
  statement: `Sigui $G=(V,A)$ i $H=(W,B)$ dos grafs. Demostreu que $G$ i $H$ són isomorfs, si i només si, $G^c$ i $H^c$ són isomorfs.`,
  content: `
**Teorema:**
Sigui $G=(V,A)$ i $H=(W,B)$. Aleshores $G \\cong H \\iff G^c \\cong H^c$.

**Demostració $(\\implies)$:**
Suposem que es compleix $G \\cong H$.
1. Existeix una bijecció $f: V \to W$ tal que:
$ uv \\in A \\iff f(u)f(v) \\in B $
2. En el graf complementari, les arestes es defineixen per la condició de pertinença inversa (allò que falta per a la complexió $K_n$). 
Així, pel graf $G^c$: $uv \\in A^c \\iff uv \notin A$
3. Utilitzant la bijecció isomorfa:
$ uv \notin A \\iff f(u)f(v) \notin B \\iff f(u)f(v) \\in B^c $
Per tant, la mateixa funció $f$ serveix com a isomorfisme entre $G^c$ i $H^c$.

**Demostració $(\\impliedby)$:**
Suposem ara que $G^c \\cong H^c$.
Com que el complementari del complementari d'un graf recau en el graf original formatiu ($ (G^c)^c = G $), apliquem la demostració inversa utilitzant $(G^c)^c \\cong (H^c)^c$, obtenint automàticament $G \\cong H$. $\\square$
`,
  availableLanguages: ['ca']
};
