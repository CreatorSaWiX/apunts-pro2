import type { Solution } from '../../../solutions';

export const ex6_21: Solution = {
  id: 'M1-T6-Ex6.21',
  title: 'Exercici 6.21: Propietats de la Dependència Lineal',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Si $\\{e_1, e_2, \\dots, e_r\\}$ és un conjunt de vectors linealment dependent (LD) d'un espai vectorial, és cert que qualsevol $e_i$ es pot escriure com a combinació lineal dels altres vectors del conjunt? Demostreu-ho o doneu un contraexemple.`,
  content: `
La resposta a aquesta afirmació és **FALS**. 

La definició de dependència lineal ens diu que existeix **almenys un** vector del conjunt que es pot escriure com a combinació lineal dels altres, però no garanteix que **qualsevol** d'ells ho pugui ser.

### Justificació Teòrica

Un conjunt és LD si existeixen escalars $c_1, c_2, \\dots, c_r$, **no tots nuls**, tals que:
$$c_1 e_1 + c_2 e_2 + \\dots + c_r e_r = \\vec{0}$$

Si volem aïllar un vector concret $e_j$ en funció dels altres:
$$e_j = -\\frac{1}{c_j} \\sum_{i \\neq j} c_i e_i$$
Perquè això sigui possible, el coeficient $c_j$ ha de ser **diferent de zero**. Com que la definició només garanteix que un dels coeficients és no nul, només podem assegurar que el vector corresponent a aquest coeficient es pot expressar com a combinació lineal dels altres.

### Contraexemple

Considerem l'espai $\\mathbb{R}^2$ i el conjunt de vectors:
$$v_1 = \\begin{pmatrix} 1 \\\\ 0 \\end{pmatrix}, \\quad v_2 = \\begin{pmatrix} 2 \\\\ 0 \\end{pmatrix}, \\quad v_3 = \\begin{pmatrix} 0 \\\\ 1 \\end{pmatrix}$$

1.  **El conjunt és LD**: Podem veure que $2v_1 - 1v_2 + 0v_3 = \\vec{0}$. Com que hem trobat coeficients no nuls ($2$ i $-1$), el conjunt és linealment dependent.
2.  **$v_3$ no és combinació lineal**: Intentem escriure $v_3$ com a combinació de $v_1$ i $v_2$:
    $$a \\begin{pmatrix} 1 \\\\ 0 \\end{pmatrix} + b \\begin{pmatrix} 2 \\\\ 0 \\end{pmatrix} = \\begin{pmatrix} a+2b \\\\ 0 \\end{pmatrix}$$
    És impossible obtenir la segona component $1$ del vector $v_3 = \\begin{pmatrix} 0 \\\\ 1 \\end{pmatrix}$.

Per tant, hem trobat un vector ($v_3$) d'un conjunt LD que no es pot escriure com a combinació lineal de la resta del conjunt.
`,
  availableLanguages: ['ca']
};
