import type { Solution } from '../../../solutions';

export const ex7_2: Solution = {
  id: 'M1-T7-Ex7.2',
  title: 'Exercici 7.2: Aplicacions en espais de polinomis',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Determineu quines de les següents aplicacions $f: P_2(\\mathbb{R}) \\to P_2(\\mathbb{R})$ són lineals:

1) $f(a_0 + a_1 x + a_2 x^2) = 0$;

2) $f(a_0 + a_1 x + a_2 x^2) = a_0 + (a_1 + a_2)x + (2a_0 - 3a_1)x^2$;

3) $f(a_0 + a_1 x + a_2 x^2) = a_0 + a_1(1+x) + a_2(1+x)^2$.`,
  content: `
Per comprovar si una aplicació és lineal en l'espai de polinomis $P_2(\\mathbb{R})$, hem de verificar si es compleixen les propietats d'additivitat i homogeneïtat, o bé si l'acció sobre els coeficients es pot expressar com una combinació lineal sense termes constants ni productes entre ells.

---

### 1) $f(a_0 + a_1 x + a_2 x^2) = 0$

Aquesta és l'**aplicació nul·la**. Envia qualsevol polinomi al polinomi zero.

- **Additivitat:** $f(p + q) = 0$ i $f(p) + f(q) = 0 + 0 = 0$.
- **Homogeneïtat:** $f(\\lambda p) = 0$ i $\\lambda f(p) = \\lambda \\cdot 0 = 0$.

L'aplicació **és lineal**.

---

### 2) $f(a_0 + a_1 x + a_2 x^2) = a_0 + (a_1 + a_2)x + (2a_0 - 3a_1)x^2$

Vegem com es transformen els coeficients. Si representem un polinomi per les seves coordenades en la base canònica $\\{1, x, x^2\\}$, tenim que $v = (a_0, a_1, a_2)$. L'aplicació actua així:
$$f(a_0, a_1, a_2) = (a_0, a_1 + a_2, 2a_0 - 3a_1)$$

Podem expressar-ho en forma matricial:
$$f \\begin{pmatrix} a_0 \\\\ a_1 \\\\ a_2 \\end{pmatrix} = \\begin{pmatrix} 1 & 0 & 0 \\\\ 0 & 1 & 1 \\\\ 2 & -3 & 0 \\end{pmatrix} \\begin{pmatrix} a_0 \\\\ a_1 \\\\ a_2 \\end{pmatrix}$$

Com que l'aplicació es pot escriure com el producte d'una matriu per les coordenades del vector (és a dir, cada nou coeficient és una combinació lineal dels originals), l'aplicació **és lineal**.

---

### 3) $f(a_0 + a_1 x + a_2 x^2) = a_0 + a_1(1+x) + a_2(1+x)^2$

Aquesta aplicació consisteix a substituir la variable $x$ per $1+x$. És a dir, $f(p(x)) = p(1+x)$.

Anem a desenvolupar l'expressió per veure-ho més clar:
$$f(a_0 + a_1 x + a_2 x^2) = a_0 + a_1 + a_1 x + a_2(1 + 2x + x^2)$$
$$f(a_0 + a_1 x + a_2 x^2) = (a_0 + a_1 + a_2) + (a_1 + 2a_2)x + a_2 x^2$$

De nou, si mirem les coordenades:
$$f(a_0, a_1, a_2) = (a_0 + a_1 + a_2, a_1 + 2a_2, a_2)$$

En forma matricial:
$$f \\begin{pmatrix} a_0 \\\\ a_1 \\\\ a_2 \\end{pmatrix} = \\begin{pmatrix} 1 & 1 & 1 \\\\ 0 & 1 & 2 \\\\ 0 & 0 & 1 \\end{pmatrix} \\begin{pmatrix} a_0 \\\\ a_1 \\\\ a_2 \\end{pmatrix}$$

Com que és una transformació lineal de les coordenades, l'aplicació **és lineal**.
`,
  availableLanguages: ['ca']
};
