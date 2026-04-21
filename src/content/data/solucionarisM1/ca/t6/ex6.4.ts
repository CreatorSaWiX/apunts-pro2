import type { Solution } from '../../../solutions';

export const ex6_4: Solution = {
  id: 'M1-T6-Ex6.4',
  title: 'Exercici 6.4: Combinacions Lineals Simbòliques',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Siguin $u, v, w$ elements d'un espai vectorial i siguin $\\alpha, \\beta, \\gamma$ elements del cos d'escalars amb $\\alpha \\neq 0$. Suposem que es compleix la relació $\\alpha u + \\beta v + \\gamma w = 0$. Escriviu els vectors $u$, $u - v$ i $u + \\alpha^{-1} \\beta v$ en funció de $v$ i $w$.`,
  content: `Recordem que un vector $\\vec{u}$ és combinació lineal d'un conjunt de vectors $\\{\\vec{v}_1, \\dots, \\vec{v}_n\\}$ si existeixen escalars $a_1, \\dots, a_n$ tals que:
$$\\vec{u} = a_1 \\vec{v}_1 + a_2 \\vec{v}_2 + \\dots + a_n \\vec{v}_n$$. En aquest exercici, estem expressant un vector $u$ com a combinació lineal de $v$ i $w$.

::mafs{type="vis_combinacio_lineal"}

Partim de la relació donada:
$$\\alpha u + \\beta v + \\gamma w = 0$$

Com que $\\alpha \\neq 0$, existeix l'invers $\\alpha^{-1}$ (o podem dividir per $\\alpha$).

### 1) Expressar $u$ en funció de $v, w$


$$\\alpha u = -\\beta v - \\gamma w$$

$$u = \\alpha^{-1}(-\\beta v - \\gamma w)$$

$$\\mathbf{u = -\\alpha^{-1}\\beta v - \\alpha^{-1}\\gamma w}$$

### 2) Expressar $u - v$ en funció de $v, w$

$$u - v = (-\\alpha^{-1}\\beta v - \\alpha^{-1}\\gamma w) - v$$

$$u - v = (-\\alpha^{-1}\\beta - 1)v - \\alpha^{-1}\\gamma w$$

$$\\mathbf{u - v = -(\\alpha^{-1}\\beta + 1)v - \\alpha^{-1}\\gamma w}$$

### 3) Expressar $u + \\alpha^{-1} \\beta v$ en funció de $v, w$

$$u + \\alpha^{-1} \\beta v = (-\\alpha^{-1}\\beta v - \\alpha^{-1}\\gamma w) + \\alpha^{-1} \\beta v$$

$$\\mathbf{u + \\alpha^{-1} \\beta v = -\\alpha^{-1}\\gamma w}$$
`,
  availableLanguages: ['ca']
};
