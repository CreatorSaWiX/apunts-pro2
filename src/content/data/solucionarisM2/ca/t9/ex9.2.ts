import type { Solution } from '../../../solutions';

export const ex9_2: Solution = {
  id: 'M2-T9-Ex2',
  title: 'Exercici 2: Pla tangent i aproximació de Taylor',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Es demana,
  
a) Escriviu l'equació del pla tangent a la superfície de $\\mathbb{R}^3$ definida per l'equació: $z = \\sqrt[3]{xy}$, en el punt $P(1, 1, 1)$.

b) Calculeu aproximadament mitjançant un polinomi de Taylor de primer grau la quantitat $\\sqrt[3]{0.99 \\cdot 1.01}$. Calculeu l'error en aquesta aproximació, és a dir doneu una fita superior del residu en aquest càlcul.`,
  content: `### Apartat a) Equació del pla tangent
Considerem la funció $f(x,y) = \\sqrt[3]{xy} = x^{1/3}y^{1/3}$. El punt de tangència és $P(1,1,1)$, per tant $a=1, b=1$ i $f(1,1)=1$.

Calculem les derivades parcials de primer ordre:
*   $f_x = \\frac{1}{3} x^{-2/3} y^{1/3} \\implies f_x(1,1) = \\frac{1}{3}$
*   $f_y = \\frac{1}{3} x^{1/3} y^{-2/3} \\implies f_y(1,1) = \\frac{1}{3}$

L'equació del pla tangent és:
$$z = f(1,1) + f_x(1,1)(x-1) + f_y(1,1)(y-1)$$
$$z = 1 + \\frac{1}{3}(x-1) + \\frac{1}{3}(y-1)$$
Multiplicant per 3 per simplificar: **$x + y - 3z + 1 = 0$**.

---

### Apartat b) Aproximació i fita de l'error

**1. Aproximació:**
Volem calcular $\\sqrt[3]{0.99 \\cdot 1.01} = f(0.99, 1.01)$. Utilitzem el polinomi de Taylor de grau 1 (que coincideix amb l'equació del pla tangent):
$$P_1(x,y) = 1 + \\frac{1}{3}(x-1) + \\frac{1}{3}(y-1)$$
Substituïm $x=0.99$ i $y=1.01$:
$$f(0.99, 1.01) \\approx 1 + \\frac{1}{3}(0.99-1) + \\frac{1}{3}(1.01-1) = 1 + \\frac{1}{3}(-0.01) + \\frac{1}{3}(0.01) = 1$$

**2. Fita de l'error (Residu de Lagrange):**
L'error és $|R_1(x,y)|$. Necessitem les derivades de segon ordre:
*   $f_{xx} = -\\frac{2}{9} x^{-5/3} y^{1/3}$
*   $f_{yy} = -\\frac{2}{9} x^{1/3} y^{-5/3}$
*   $f_{xy} = \\frac{1}{9} x^{-2/3} y^{-2/3}$

En el segment que uneix $(1,1)$ amb $(0.99, 1.01)$, les derivades es poden fitar prenent el valor més desfavorable (més gran en valor absolut). Com que $x, y \\approx 1$, podem prendre una fita conservadora $M$ per a $|f_{ij}|$:
Si prenem $x, y \\in [0.99, 1.01]$, tenim:
*   $|f_{xx}| \\leq \\frac{2}{9} (0.99)^{-5/3} (1.01)^{1/3} \\approx 0.23$
*   $|f_{yy}| \\leq \\frac{2}{9} (1.01)^{1/3} (0.99)^{-5/3} \\approx 0.23$
*   $|f_{xy}| \\leq \\frac{1}{9} (0.99)^{-2/3} (0.99)^{-2/3} \\approx 0.12$

L'error es fita per:
$$|R_1| \\leq \\frac{1}{2} \\max \\{|f_{xx}|h^2 + 2|f_{xy}||hk| + |f_{yy}|k^2|\\}$$
Amb $h = -0.01$ i $k = 0.01$:
$$|R_1| \\leq \\frac{1}{2} [0.23(0.01)^2 + 2(0.12)(0.01)^2 + 0.23(0.01)^2]$$
$$|R_1| \\leq \\frac{1}{2} [0.000023 + 0.000024 + 0.000023] = \\mathbf{0.000035}$$
`,
  availableLanguages: ['ca']
};
