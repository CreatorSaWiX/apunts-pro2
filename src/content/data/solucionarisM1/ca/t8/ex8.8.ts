import type { Solution } from '../../../solutions';

export const ex8_8: Solution = {
  id: 'M1-T8-Ex8.8',
  title: 'Exercici 8.8: Diagonalització de matrius triangulars',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Demostreu que si $A \\in \\mathcal{M}_n(\\mathbb{R})$ és una matriu triangular superior, amb els elements de la diagonal principal diferents dos a dos, aleshores $A$ és diagonalitzable.`,
  content: `
### Demostració

Per demostrar que la matriu $A$ és diagonalitzable, seguirem els següents passos:

---

### 1) Càlcul del polinomi característic
Si $A$ és una matriu triangular superior, té la forma:
$A = \\begin{pmatrix} a_{11} & a_{12} & \\dots & a_{1n} \\\\ 0 & a_{22} & \\dots & a_{23} \\\\ \\vdots & \\vdots & \\ddots & \\vdots \\\\ 0 & 0 & \\dots & a_{nn} \\end{pmatrix}$

El polinomi característic es defineix com $p(\\lambda) = \\det(A - \\lambda I)$. Per a una matriu triangular, el determinant és el producte dels elements de la diagonal principal:
$p(\\lambda) = \\prod_{i=1}^n (a_{ii} - \\lambda) = (a_{11} - \\lambda)(a_{22} - \\lambda) \\dots (a_{nn} - \\lambda)$

---

### 2) Identificació dels valors propis
Les arrels del polinomi característic són els valors propis de la matriu. En aquest cas, els valors propis són precisament els elements de la diagonal:
$\\text{Spec}(A) = \\{a_{11}, a_{22}, \\dots, a_{nn}\\}$

---

### 3) Condició de valors propis distints
L'enunciat especifica que els elements de la diagonal principal són **diferents dos a dos**. Això implica que:
$a_{ii} \\neq a_{jj} \\quad \\forall i \\neq j$

Per tant, la matriu $A$ té $n$ valors propis reals i **distints**.

---

### 4) Conclusió
Existeix un teorema fonamental en àlgebra lineal que estableix:
> "Tota matriu $A \\in \\mathcal{M}_n(\\mathbb{K})$ que tingui $n$ valors propis distints en el cos $\\mathbb{K}$ és diagonalitzable sobre $\\mathbb{K}$."

Atès que $A$ és una matriu d'ordre $n$ i hem trobat $n$ valors propis diferents, podem afirmar que $A$ és **diagonalitzable**.
`,
  availableLanguages: ['ca']
};
