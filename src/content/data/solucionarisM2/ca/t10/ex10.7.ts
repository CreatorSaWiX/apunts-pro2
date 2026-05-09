import type { Solution } from '../../../solutions';

export const ex10_7: Solution = {
  id: 'M2-T10-Ex7',
  title: 'Exercici 7: Extrems absoluts en un recinte compacte',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Sigui $f: \\mathbb{R}^2 \\to \\mathbb{R}$ la funció definida per $f(x,y) = x^2 + y^2$.

a) Calculeu i classifiqueu els extrems relatius de $f$ en el seu domini.
b) Justifiqueu l'existència d'extrems absoluts de $f$ en el conjunt 
$$K = \\{(x,y) \\in \\mathbb{R}^2 : y \\leq 1 - x^2, \\, y \\geq x - 1\\}$$
c) Determineu tots els candidats a màxim i a mínim absoluts de $f$ en el recinte $K$.
d) Trieu els punts on $f$ pren els valors màxim i mínim absoluts en $K$ i digueu quins són els valors màxim i mínim de $f$ en $K$.`,
  content: `### Apartat a) Extrems relatius
Calculem el gradient de $f(x,y) = x^2 + y^2$:
*   $\\frac{\\partial f}{\\partial x} = 2x = 0 \\implies x = 0$
*   $\\frac{\\partial f}{\\partial y} = 2y = 0 \\implies y = 0$

L'únic punt crític és l'origen **$(0,0)$**.
Calculem la Hessiana:
$$H(0,0) = \\begin{pmatrix} 2 & 0 \\\\ 0 & 2 \\end{pmatrix}$$
Com que $\\Delta = 4 > 0$ i $f_{xx} = 2 > 0$, el punt $(0,0)$ és un **Mínim relatiu**. El seu valor és $f(0,0) = 0$.

---

### Apartat b) Existència d'extrems absoluts
El conjunt $K$ està definit per les desigualtats $y \\leq 1 - x^2$ (interior d'una paràbola) i $y \\geq x - 1$ (part superior d'una recta).
1.  **Tancat**: Està definit per desigualtats no estrictes de funcions contínues.
2.  **Acotat**: El conjunt està contingut en una regió finita del pla (entre la paràbola i la recta).

Com que $K$ és un **conjunt compacte** (tancat i acotat) i la funció $f$ és contínua, el **Teorema de Weierstrass** garanteix que $f$ assoleix el seu màxim i el seu mínim absolut en $K$.

---

### Apartat c) Candidats a extrems absoluts
Busquem candidats en l'interior i a la frontera:

**1. Interior de $K$:**
L'únic punt crític és **$(0,0)$**, que pertany a $K$ (ja que $0 \\leq 1-0^2$ i $0 \\geq 0-1$).
*   Valor: $f(0,0) = \\mathbf{0}$.

**2. Frontera de $K$:**
La frontera està formada per dos arcs que s'intersequen en $1-x^2 = x-1 \\implies x^2+x-2=0$, és a dir, en $x=1$ i $x=-2$.

*   **Segment de recta $y = x-1$ per $x \\in [-2, 1]$**:
    $g(x) = f(x, x-1) = x^2 + (x-1)^2 = 2x^2 - 2x + 1$
    $g'(x) = 4x - 2 = 0 \\implies x = 1/2$.
    Punt candidat: **$(1/2, -1/2)$**. Valor: $f(1/2, -1/2) = 1/4 + 1/4 = \\mathbf{0.5}$.

*   **Arc de paràbola $y = 1-x^2$ per $x \\in [-2, 1]$**:
    $h(x) = f(x, 1-x^2) = x^2 + (1-x^2)^2 = x^4 - x^2 + 1$
    $h'(x) = 4x^3 - 2x = 2x(2x^2 - 1) = 0 \\implies x=0$ o $x = \\pm \\frac{1}{\\sqrt{2}}$.
    Punts candidats:
    - $(0, 1)$. Valor: $f(0,1) = \\mathbf{1}$.
    - $(\\pm \\frac{1}{\\sqrt{2}}, \\frac{1}{2})$. Valor: $f(\\pm \\frac{1}{\\sqrt{2}}, \\frac{1}{2}) = \\frac{1}{2} + \\frac{1}{4} = \\mathbf{0.75}$.

*   **Vèrtexs (Interseccions)**:
    - $P(-2, -3)$. Valor: $f(-2, -3) = 4 + 9 = \\mathbf{13}$.
    - $P(1, 0)$. Valor: $f(1, 0) = \\mathbf{1}$.

---

### Apartat d) Valors màxim i mínim absoluts
Comparant tots els valors candidats:
$\{0, \\, 0.5, \\, 1, \\, 0.75, \\, 13\}$

*   El **Mínim absolut** s'assoleix en el punt **$(0,0)$** amb un valor de **$0$**.
*   El **Màxim absolut** s'assoleix en el punt **$(-2, -3)$** amb un valor de **$13$** (correspon a un dels vèrtexs de la regió).`,
  availableLanguages: ['ca']
};
