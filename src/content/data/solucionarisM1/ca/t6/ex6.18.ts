import type { Solution } from '../../../solutions';

export const ex6_18: Solution = {
  id: 'M1-T6-Ex6.18',
  title: 'Exercici 6.18: Prova Teòrica de Dependència',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Siguin $E$ un $\\mathbb{R}$-espai vectorial i $u, v, w$ tres vectors qualssevol d'$E$. Demostreu que el conjunt $\\{u-v, v-w, w-u\\}$ és linealment dependent.`,
  content: `
Per demostrar que un conjunt de vectors $\\{v_1, v_2, v_3\\}$ és linealment dependent (LD), hem de trobar una combinació lineal no trivial que sigui igual al vector nul:
$$c_1 v_1 + c_2 v_2 + c_3 v_3 = \\vec{0}$$
on almenys un dels coeficients $c_i$ sigui diferent de zero.

### Demostració

Considerem els vectors del conjunt:
*   $v_1 = u - v$
*   $v_2 = v - w$
*   $v_3 = w - u$

Sumem els tres vectors (triant els coeficients $c_1 = c_2 = c_3 = 1$):
$$(u - v) + (v - w) + (w - u) = u - v + v - w + w - u$$
Rearrangem els termes mitjançant les propietats commutativa i associativa de l'espai vectorial:
$$(u - u) + (v - v) + (w - w) = \\vec{0} + \\vec{0} + \\vec{0} = \\vec{0}$$

### Conclusió

Hem trobat una combinació lineal amb coeficients no nuls ($1, 1, 1$) que dóna el vector nul:
$$1(u-v) + 1(v-w) + 1(w-u) = \\vec{0}$$
Per tant, per la definició de dependència lineal, el conjunt és **Linealment Dependent (LD)**, independentment de quins siguin els vectors $u, v, w$ originals.
`,
  availableLanguages: ['ca']
};
