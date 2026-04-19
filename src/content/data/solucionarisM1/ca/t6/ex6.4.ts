import type { Solution } from '../../../solutions';

export const ex6_4: Solution = {
  id: 'M1-T6-Ex6.4',
  title: 'Exercici 6.4: Combinacions Lineals Simbòliques',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Siguin $u, v, w$ elements d'un espai vectorial i siguin $\\alpha, \\beta, \\gamma$ elements del cos d'escalars amb $\\alpha \\neq 0$. Suposem que es compleix la relació $\\alpha u + \\beta v + \\gamma w = 0$. Escriviu els vectors $u$, $u - v$ i $u + \\alpha^{-1} \\beta v$ en funció de $v$ i $w$.`,
  content: `
Partim de la relació donada:
$$\\alpha u + \\beta v + \\gamma w = 0$$

Com que $\\alpha \\neq 0$, existeix l'invers $\\alpha^{-1}$ (o podem dividir per $\\alpha$).

### 1) Expressar $u$ en funció de $v, w$

Aïllem el terme amb $u$:
$$\\alpha u = -\\beta v - \\gamma w$$

Multipliquem per $\\alpha^{-1}$ a ambdós costats:
$$u = \\alpha^{-1}(-\\beta v - \\gamma w)$$
$$\\mathbf{u = -\\alpha^{-1}\\beta v - \\alpha^{-1}\\gamma w}$$

### 2) Expressar $u - v$ en funció de $v, w$

Substituïm l'expressió de $u$ trobada anteriorment:
$$u - v = (-\\alpha^{-1}\\beta v - \\alpha^{-1}\\gamma w) - v$$

Agrupem els termes amb $v$:
$$u - v = (-\\alpha^{-1}\\beta - 1)v - \\alpha^{-1}\\gamma w$$
$$\\mathbf{u - v = -(\\alpha^{-1}\\beta + 1)v - \\alpha^{-1}\\gamma w}$$

### 3) Expressar $u + \\alpha^{-1} \\beta v$ en funció de $v, w$

Substituïm de nou l'expressió de $u$:
$$u + \\alpha^{-1} \\beta v = (-\\alpha^{-1}\\beta v - \\alpha^{-1}\\gamma w) + \\alpha^{-1} \\beta v$$

Observem que els termes amb $v$ s'anul·len ($-\\alpha^{-1}\\beta v + \\alpha^{-1}\\beta v = 0$):
$$\\mathbf{u + \\alpha^{-1} \\beta v = -\\alpha^{-1}\\gamma w}$$
`,
  availableLanguages: ['ca']
};
