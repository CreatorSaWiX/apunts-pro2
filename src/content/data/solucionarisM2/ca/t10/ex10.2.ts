import type { Solution } from '../../../solutions';

export const ex10_2: Solution = {
  id: 'M2-T10-Ex2',
  title: 'Exercici 2: Extrems condicionats (I)',
  author: 'SaWiX',
  code: '',
  type: 'notebook',
  statement: `Determineu els extrems condicionats de les funcions següents:

a) $f(x,y) = x + 2y$, si $x^2 + y^2 = 5$

b) $f(x,y,z) = x^2 + y^2 + z^2$, si $\\begin{cases} x^2 + y^2 = 1 \\\\ x + y + z = 1 \\end{cases}$`,
  content: `### Apartat a) $f(x,y) = x + 2y$ amb $x^2 + y^2 = 5$

**1. Definició del sistema de Lagrange**
Volem optimitzar $f(x,y) = x + 2y$ subjecte a $g(x,y) = x^2 + y^2 - 5 = 0$ que no és linial en $x$ ni $y$.
Construïm la funció de Lagrange $L(x,y,\\lambda) = f(x,y) - \\lambda g(x,y)$:

$$
L(x,y,\\lambda) = (x + 2y) - \\lambda(x^2 + y^2 - 5)
$$

**2. Càlcul de punts crítics**
Busquem els punts on s'anul·la el gradient de $L$:
1.  $\\frac{\\partial L}{\\partial x} = 1 - 2\\lambda x = 0 \\implies 1 = 2\\lambda x$
2.  $\\frac{\\partial L}{\\partial y} = 2 - 2\\lambda y = 0 \\implies 2 = 2\\lambda y$
3.  $\\frac{\\partial L}{\\partial \\lambda} = -(x^2 + y^2 - 5) = 0 \\implies x^2 + y^2 = 5$

Dividim l'equació (2) per la (1) per eliminar $\\lambda$:
$$\\frac{2}{1} = \\frac{2\\lambda y}{2\\lambda x} \\implies 2 = \\frac{y}{x} \\implies y = 2x$$

**3. Substitució en la restricció**
Substituïm $y = 2x$ a l'equació de la restricció $x^2 + y^2 = 5$:
$$
x^2 + (2x)^2 = 5
$$

$$
x^2 + 4x^2 = 5 \\implies 5x^2 = 5 \\implies x^2 = 1 \\implies \\mathbf{x = \\pm 1}
$$

Trobem els punts corresponents:
*   **Si $x = 1$**: $y = 2(1) = 2$. Punt $\\mathbf{P_1(1, 2)}$.
    Valor: $f(1,2) = 1 + 2(2) = 5$.
*   **Si $x = -1$**: $y = 2(-1) = -2$. Punt $\\mathbf{P_2(-1, -2)}$.
    Valor: $f(-1,-2) = -1 + 2(-2) = -5$.

**Conclusió:**
Com que la restricció és una corba tancada (circumferència) i la funció és contínua, el valor més alt és el màxim i el més baix el mínim:
- $(1, 2)$ és un **Màxim condicionat**.
- $(-1, -2)$ és un **Mínim condicionat**.

---

### Apartat b) $f(x,y,z) = x^2 + y^2 + z^2$ amb dues restriccions
Restriccions:
1. $g_1(x,y,z) = x^2 + y^2 - 1 = 0 \\implies x^2 + y^2 = 1$
2. $g_2(x,y,z) = x + y + z - 1 = 0 \\implies z = 1 - x - y$

**1. Simplificació del problema**
En lloc d'usar tres variables, podem usar les restriccions per reduir el problema a dues variables ($x$ i $y$).
*   Primer, usem la restricció (1) a la funció objectiu:
    $$f(x,y,z) = (x^2 + y^2) + z^2 = 1 + z^2$$
*   Segon, usem la restricció (2) per substituir la $z$:
    $$f(x,y) = 1 + (1 - x - y)^2$$

Ara el problema és optimitzar la funció $h(x,y) = 1 + (1 - x - y)^2$ subjecte a $x^2 + y^2 = 1$.

**2. Mètode de Lagrange per a $h(x,y)$**
Definim el Lagrangià $L(x,y,\\mu) = 1 + (1-x-y)^2 - \\mu(x^2 + y^2 - 1)$.
Busquem on s'anul·len les derivades parcials:

1.  $\\frac{\\partial L}{\\partial x} = 2(1-x-y) \\cdot (-1) - 2\\mu x = 0 \\implies -2(1-x-y) = 2\\mu x \\implies -(1-x-y) = \\mu x$
2.  $\\frac{\\partial L}{\\partial y} = 2(1-x-y) \\cdot (-1) - 2\\mu y = 0 \\implies -2(1-x-y) = 2\\mu y \\implies -(1-x-y) = \\mu y$
3.  $\\frac{\\partial L}{\\partial \\mu} = -(x^2 + y^2 - 1) = 0 \\implies x^2 + y^2 = 1$

Igualem les expressions de les equacions (1) i (2):
$$\\mu x = \\mu y \\implies \\mu x - \\mu y = 0 \\implies \\mu(x - y) = 0$$

Aquesta equació ens dona dues possibilitats: **Cas 1 ($\\mu = 0$)** o **Cas 2 ($x = y$)**.


**Cas 1: $\\mu = 0$**

Si $\\mu = 0$, aleshores de l'equació (1) tenim:

$$
-(1 - x - y) = 0 \\implies 1 - x - y = 0 \\implies x + y = 1
$$

Combinem això amb la restricció (3): $x^2 + y^2 = 1$. Substituïm $y = 1 - x$ a la restricció:

$$x^2 + (1 - x)^2 = 1$$

$$x^2 + 1 - 2x + x^2 = 1 \\implies 2x^2 - 2x = 0 \\implies 2x(x - 1) = 0$$

Això ens dona dues solucions per a $(x,y)$:
*   Si $x = 0 \\implies y = 1 - 0 = 1$. Llavors $z = 1 - 0 - 1 = 0$. Punt: $\\mathbf{(0,1,0)}$.
*   Si $x = 1 \\implies y = 1 - 1 = 0$. Llavors $z = 1 - 1 - 0 = 0$. Punt: $\\mathbf{(1,0,0)}$.

En ambdós punts, el valor de la funció és: $f = 1 + 0^2 = \\mathbf{1}$.

**Cas 2: $x = y$**

Si $x = y$, substituïm a la restricció (3):

$$
x^2 + x^2 = 1 \\implies 2x^2 = 1 \\implies x^2 = 1/2 \\implies x = \\pm \\frac{1}{\\sqrt{2}}
$$

Això ens dona dos subcasos:
*   **Subcas $x = y = 1/\\sqrt{2}$**:
    $z = 1 - \\frac{1}{\\sqrt{2}} - \\frac{1}{\\sqrt{2}} = 1 - \\frac{2}{\\sqrt{2}} = 1 - \\sqrt{2}$.

    Punt: $\\mathbf{(\\frac{1}{\\sqrt{2}}, \\frac{1}{\\sqrt{2}}, 1-\\sqrt{2})}$.

    Valor: $f = 1 + (1 - \\sqrt{2})^2 = 1 + (1 + 2 - 2\\sqrt{2}) = \\mathbf{4 - 2\\sqrt{2} \\approx 1.17}$.

*   **Subcas $x = y = -1/\\sqrt{2}$**:

    $z = 1 - (-\\frac{1}{\\sqrt{2}}) - (-\\frac{1}{\\sqrt{2}}) = 1 + \\frac{2}{\\sqrt{2}} = 1 + \\sqrt{2}$.

    Punt: $\\mathbf{(-\\frac{1}{\\sqrt{2}}, -\\frac{1}{\\sqrt{2}}, 1+\\sqrt{2})}$.
    
    Valor: $f = 1 + (1 + \\sqrt{2})^2 = 1 + (1 + 2 + 2\\sqrt{2}) = \\mathbf{4 + 2\\sqrt{2} \\approx 6.83}$.

**Conclusió final:**
*   Els punts **$(0,1,0)$** i **$(1,0,0)$** són **Mínims condicionats** (valor 1).
*   El punt **$(-\\frac{1}{\\sqrt{2}}, -\\frac{1}{\\sqrt{2}}, 1+\\sqrt{2})$** és un **Màxim condicionat** (valor $\\approx 6.83$).
*   El punt **$(\\frac{1}{\\sqrt{2}}, \\frac{1}{\\sqrt{2}}, 1-\\sqrt{2})$** és un extrem local però no absolut del sistema.`,
  availableLanguages: ['ca']
};
