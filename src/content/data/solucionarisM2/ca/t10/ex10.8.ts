import type { Solution } from '../../../solutions';

export const ex10_8: Solution = {
  id: 'M2-T10-Ex8',
  title: 'Exercici 8: Optimització en un segment circular',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Sigui $f: \\mathbb{R}^2 \\to \\mathbb{R}$ la funció definida per $f(x,y) = x^4 + y^2$.

a) Calculeu i classifiqueu els extrems relatius de $f$ en el seu domini.

b) Justifiqueu l'existència d'extrems absoluts de $f$ en el recinte 
$$K = \\{(x,y) \\in \\mathbb{R}^2 : x^2 + y^2 \\leq 1, \\, y \\geq 1/2\\}$$

c) Determineu el màxim absolut i el mínim absolut de $f$ en el recinte $K$.`,
  content: `### Apartat a) Extrems relatius
Calculem el gradient de $f(x,y) = x^4 + y^2$:
*   $\\frac{\\partial f}{\\partial x} = 4x^3 = 0 \\implies x = 0$
*   $\\frac{\\partial f}{\\partial y} = 2y = 0 \\implies y = 0$

L'únic punt crític és l'origen **$(0,0)$**.
La Hessiana en $(0,0)$ és:
$$H(0,0) = \\begin{pmatrix} 12x^2 & 0 \\\\ 0 & 2 \\end{pmatrix}_{(0,0)} = \\begin{pmatrix} 0 & 0 \\\\ 0 & 2 \\end{pmatrix}$$
El determinant és $\\Delta = 0$, per tant el criteri no és concloent. No obstant, observem que $f(x,y) = x^4 + y^2 \\geq 0$ per a tot $(x,y)$ i $f(0,0) = 0$. Per definició, el punt $(0,0)$ és un **Mínim relatiu** (i absolut global).

---

### Apartat b) Existència d'extrems absoluts
El recinte $K$ és la regió del disc unitat que queda per sobre de la recta $y = 1/2$.
1.  **Tancat**: Definit per desigualtats febles.
2.  **Acotat**: Contingut dins del disc de radi 1.

Per ser $K$ un **compacte** i $f$ una funció contínua, el **Teorema de Weierstrass** assegura l'existència de màxim i mínim absoluts en $K$.

---

### Apartat c) Màxim i mínim absoluts en $K$
**1. Interior de $K$:**
L'únic punt crític $(0,0)$ **no pertany** a $K$, ja que la seva coordenada $y=0$ no compleix $y \\geq 1/2$. Per tant, no hi ha candidats a l'interior.

**2. Frontera de $K$:**
*   **Segment rectilini $y = 1/2$ per $x \\in [-\\sqrt{3}/2, \\sqrt{3}/2]$**:
    $g(x) = f(x, 1/2) = x^4 + 1/4$.
    $g'(x) = 4x^3 = 0 \\implies x=0$.
    Candidat: **$(0, 1/2)$**. Valor: $f(0, 1/2) = \\mathbf{0.25}$.
    Extrems del segment (vèrtexs): **$(\\pm \\sqrt{3}/2, 1/2)$**. Valor: $(3/4)^2 + 1/4 = 9/16 + 4/16 = \\mathbf{0.8125}$.

*   **Arc de circumferència $x^2 + y^2 = 1 \\implies x^2 = 1 - y^2$ per $y \\in [1/2, 1]$**:
    $h(y) = f(x,y) = (1-y^2)^2 + y^2 = y^4 - 2y^2 + 1 + y^2 = y^4 - y^2 + 1$.
    $h'(y) = 4y^3 - 2y = 2y(2y^2 - 1) = 0$.
    - $y=0$ (fora de l'interval).
    - $y^2 = 1/2 \\implies y = 1/\\sqrt{2} \\approx 0.707$ (dins l'interval).
    Si $y = 1/\\sqrt{2} \\implies x^2 = 1 - 1/2 = 1/2 \\implies x = \\pm 1/\\sqrt{2}$.
    Candidats: **$(\\pm 1/\\sqrt{2}, 1/\\sqrt{2})$**. Valor: $1/4 + 1/2 = \\mathbf{0.75}$.
    - $y=1$ (extrem de l'arc). Punt **$(0,1)$**. Valor: $f(0,1) = \\mathbf{1}$.

**3. Conclusió:**
Comparant els valors obtinguts $\{0.25, \\, 0.8125, \\, 0.75, \\, 1\}$:
*   El **Mínim absolut** és **$0.25$** al punt **$(0, 1/2)$**.
*   El **Màxim absolut** és **$1$** al punt **$(0, 1)$**.`,
  availableLanguages: ['ca']
};
