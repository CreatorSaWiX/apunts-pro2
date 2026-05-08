import type { Solution } from '../../../solutions';

export const ex7_9: Solution = {
  id: 'M1-T7-Ex7.9',
  title: 'Exercici 7.9: Dimensió de la imatge segons un paràmetre',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Sigui $f$ un endomorfisme de $\\mathbb{R}^3$ amb matriu associada
  
$$A = \\begin{pmatrix} m-2 & 2 & -1 \\\\ 2 & m & 2 \\\\ 2m & 2(m+1) & m+1 \\end{pmatrix}$$

Determineu la dimensió de la imatge segons els valors de $m$.`,
  content: `
La dimensió de la imatge d'una aplicació lineal coincideix amb el rang de la seva matriu associada. Per estudiar el rang en funció del paràmetre $m$, calcularem primer el determinant de la matriu per saber quan és màxim (rang 3).

---

### 1) Càlcul del determinant de $A$

$$\\det(A) = \\begin{vmatrix} m-2 & 2 & -1 \\\\ 2 & m & 2 \\\\ 2m & 2m+2 & m+1 \\end{vmatrix}$$

Apliquem operacions elementals per simplificar: $F_3 \\to F_3 - 2F_1$
$$\\det(A) = \\begin{vmatrix} m-2 & 2 & -1 \\\\ 2 & m & 2 \\\\ 4 & 2m-2 & m+3 \\end{vmatrix}$$

Desenvolupant el determinant (o continuant simplificant), obtenim el polinomi:
$$\\det(A) = m^3 - 3m^2 + 2m = m(m-1)(m-2)$$

El determinant s'anul·la per als valors **$m = 0, m = 1, m = 2$**.

---

### 2) Discussió del rang segons $m$

### Cas 1: $m \\neq 0, 1, 2$
Si el paràmetre no és cap d'aquests valors, $\\det(A) \\neq 0$. La matriu té rang 3. **$\\text{dim}(\\text{Im } f) = 3$**.

### Cas 2: $m = 0$
La matriu és: $A = \\begin{pmatrix} -2 & 2 & -1 \\\\ 2 & 0 & 2 \\\\ 0 & 2 & 1 \\end{pmatrix}$.
Observem que $F_1 + F_2 = (0, 2, 1) = F_3$. Les files són dependents, però les dues primeres són independents entre elles. El rang és 2.
**$\\text{dim}(\\text{Im } f) = 2$**.

### Cas 3: $m = 1$
La matriu és: $A = \\begin{pmatrix} -1 & 2 & -1 \\\\ 2 & 1 & 2 \\\\ 2 & 4 & 2 \\end{pmatrix}$.
Observem que la primera i la tercera columna són iguals ($C_1 = C_3$). El rang és com a màxim 2. Les dues primeres columnes són independents. El rang és 2. **$\\text{dim}(\\text{Im } f) = 2$**.

### Cas 4: $m = 2$
La matriu és: $A = \\begin{pmatrix} 0 & 2 & -1 \\\\ 2 & 2 & 2 \\\\ 4 & 6 & 3 \\end{pmatrix}$.
Observem que $F_1 + 2F_2 = (4, 6, 3) = F_3$. De nou, les files són dependents i el rang és 2. **$\\text{dim}(\\text{Im } f) = 2$**.

---

### Conclusió

- Si **$m \\in \\{0, 1, 2\\}$**, la dimensió de la imatge és **2**.
- Si **$m \\notin \\{0, 1, 2\\}$**, la dimensió de la imatge és **3**.
`,
  availableLanguages: ['ca']
};
