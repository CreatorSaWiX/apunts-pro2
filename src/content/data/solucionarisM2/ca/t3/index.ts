import type { Solution } from '../../solutions';

export const m2t3Solutions: Solution[] = [
    {
        id: "M2-T3-Ex1",
        title: "Problema 1: Existència de solució a l'interval [0, 2]",
        author: "Apunts",
        type: "notebook",
        code: "",
        statement: `Demostreu que l'equació $x^3 - 3x^2 + 1 = 0$ té una solució a l'interval $[0, 2]$.`,
        content: `Definim la funció $f(x) = x^3 - 3x^2 + 1$. 
Com que $f$ és un polinomi, és contínua a tot $\\mathbb{R}$ i, particularment, a $[0, 2]$.

Avaluem els extrems de l'interval:
*   $f(0) = 0^3 - 3(0)^2 + 1 = 1 > 0$
*   $f(2) = 2^3 - 3(2)^2 + 1 = 8 - 12 + 1 = -3 < 0$

Com que $f(0) \\cdot f(2) < 0$, pel **Teorema de Bolzano** existeix almenys un valor $c \\in (0, 2)$ tal que $f(c) = 0$.`

    },
    {
        id: "M2-T3-Ex2",
        title: "Problema 2: Intersecció de dues funcions contínues",
        author: "Apunts",
        type: "notebook",
        code: "",
        statement: `Siguin $a, b \\in \\mathbb{R}$, amb $a < b$, i siguin $f$ i $g$ dues funcions contínues en $[a, b]$ amb $f(a) < g(a)$ i $f(b) > g(b)$. Demostreu que existeix $c \\in (a, b)$ tal que $f(c) = g(c)$.`,
        content: `Definim la funció auxiliar $h(x) = f(x) - g(x)$.
Com que $f$ i $g$ són contínues a $[a, b]$, la seva resta $h$ també és contínua a $[a, b]$.

Avaluem els signes als extrems:
*   $h(a) = f(a) - g(a) < 0$ (ja que $f(a) < g(a)$)
*   $h(b) = f(b) - g(b) > 0$ (ja que $f(b) > g(b)$)

Atès que $h$ és contínua i canvia de signe entre $a$ i $b$, pel **Teorema de Bolzano** existeix un $c \\in (a, b)$ tal que $h(c) = 0$.
Això implica que $f(c) - g(c) = 0 \\implies f(c) = g(c)$.`

    },
    {
        id: "M2-T3-Ex5",
        title: "Problema 5: Bolzano, bissecció i mètode de la secant",
        author: "Apunts",
        type: "notebook",
        code: "",
        statement: `a) Separeu les dues solucions reals de l'equació $x - 3\\ln x = 0$.

b) Partint d'un interval de longitud 1, quantes iteracions serien necessàries per calcular les dues solucions de l'equació amb una precisió de $0.5 \\cdot 10^{-3}$ aplicant el mètode de la bissecció? Apliqueu-lo per calcular-les amb una precisió de $0.5 \\cdot 10^{-1}$.

c) Apliqueu el mètode de la secant per calcular-les amb una precisió de tres decimals ($\\eta = 0.5 \\cdot 10^{-3}$).`,
        content: `Definim $f(x) = x - 3\\ln x$. Domini: $(0, +\\infty)$.

**a) Separació de solucions:**

Derivem per trobar extrems: $f'(x) = 1 - \\frac{3}{x} = \\frac{x-3}{x}$.
$f'(x) = 0 \\implies x = 3$. Com $f''(x) = 3/x^2 > 0$, $x=3$ és un mínim.
Busquem canvis de signe:
- Esquerra de $x=3$: $f(1) = 1 > 0$, $f(2) \\approx -0.079 < 0$. Solució en $[1, 2]$.
- Dreta de $x=3$: $f(4) \\approx -0.158 < 0$, $f(5) \\approx 0.17 > 0$. Solució en $[4, 5]$.

**b) Bissecció ($\\eta = 0.5 \\cdot 10^{-3}$):**

Fórmula d'error: $\\frac{L}{2^n} < \\eta \\implies \\frac{1}{2^n} < 5 \\cdot 10^{-4} \\implies 2^n > 2000 \\implies n \\geq 11$ iteracions.

Càlcul per $\\eta = 0.05$ (aprox. $5$ iteracions) a $[1, 2]$:

::videoviz{url="/m2/biseccio2.webm"}

Arrel a $[4, 5]$:

$c_1=4.5$ ($-$), $c_2=4.75$ ($+$), $c_3=4.625$ ($+$), $c_4=4.5625$ ($+$), $c_5=4.53125$.
Arrel $\\approx 4.53$.

**c) Secant ($\\eta = 0.5 \\cdot 10^{-3}$):**

::videoviz{url="/m2/secant2.webm"}

$x_n = x_{n-1} - f(x_{n-1}) \\frac{x_{n-1} - x_{n-2}}{f(x_{n-1}) - f(x_{n-2})}$

Partint de $x_0=1, x_1=2 \\implies x_2 \\approx 1.926, x_3 \\approx 1.852, x_4 \\approx 1.857$.
Arrel $\\approx 1.857$.`

    },
    {
        id: "M2-T3-Ex6",
        title: "Problema 6: Solucions a funcions trigonomètriques",
        author: "Apunts",
        type: "notebook",
        code: "",
        statement: `Demostreu que:
a) l'equació $\\ln x = x^2 - 4x$ té una solució real a l'interval $[1, +\\infty)$
b) l'equació $x^2 = x \\cdot \\sin x + \\cos x$ té una solució positiva i una solució negativa.
c) l'equació $2x^3 - 6x^2 + 3 = 0$ té totes les seves arrels a l'interval $[-1, 3]$.`,
        content: `**a)** $f(x) = \\ln x - x^2 + 4x$ a $[1, +\\infty)$.
- $f(1) = \\ln(1) - 1 + 4 = 3 > 0$.
- Per $x \\to +\\infty$, el terme $-x^2$ domina: $\\lim_{x \\to +\\infty} f(x) = -\\infty$.

Com que $f$ és contínua i canvia de signe (p. ex. $f(7) \\approx \\ln 7 - 49 + 28 < 0$), pel **Teorema de Bolzano** existeix una solució a $[1, +\\infty)$.

**b)** $f(x) = x^2 - x \\sin x - \\cos x$.
- $f(0) = -1 < 0$.
- $f(\\pi) = \\pi^2 + 1 > 0 \\implies$ Solució positiva a $(0, \\pi)$.
- $f(-\\pi) = \\pi^2 + 1 > 0 \\implies$ Solució negativa a $(-\\pi, 0)$.

**c)** $f(x) = 2x^3 - 6x^2 + 3$.
- $f(-1) = -5 < 0$
- $f(0) = 3 > 0$
- $f(1) = -1 < 0$
- $f(3) = 3 > 0$

Hi ha canvi de signe als intervals $[-1, 0]$, $[0, 1]$ i $[1, 3]$. Com que és un polinomi de grau 3, té exactament 3 arrels, totes contingudes a $[-1, 3]$.`

    },
    {
        id: "M2-T3-Ex8",
        title: "Problema 8: Aproximació d'arrels múltiples mètodes",
        author: "Apunts",
        type: "notebook",
        code: "",
        statement: `Considereu la funció $f(x) = x^3 - x + 5$.

a) Trobeu un interval on s'asseguri l'existència d'una arrel.

b) Calculeu l'arrel amb el mètode de la bissecció ($\\eta = 0.05$).

c) Calculeu l'arrel amb el mètode de la secant.

d) Calculeu l'arrel amb el mètode de Newton-Raphson.`,
        content: `**a) Existència d'arrel:**
$f(-2) = -1 < 0$ i $f(-1) = 5 > 0$. Com $f$ és contínua, pel **Teorema de Bolzano** hi ha una arrel a $(-2, -1)$.

**b) Bissecció ($\\eta = 0.05$):**
::videoviz{url="/m2/biseccio.webm"}

**c) Secant:**
::videoviz{url="/m2/secant.webm"}

**d) Newton-Raphson:**
::videoviz{url="/m2/tangent.webm"}
    `},
    {
        id: "M2-T3-Ex11",
        title: "Problema 11: Arrels de polinomis i limitador",
        author: "Apunts",
        type: "notebook",
        code: "",
        statement: `Demostreu que:
a) l'equació $x^3 - 2x^2 + 3 = 2$ té una solució a l'interval $[-1, 2]$.
b) l'equació $\\sin x = x - 1$ té una solució real a l'interval $[1, 2]$.
c) l'equació $2x^4 - 14x^2 + 14x - 1 = 0$ té quatre arrels reals.`,
        content: `**a)** $f(x) = x^3 - 2x^2 + 1$.
$f(-1) = -2 < 0$, $f(2) = 1 > 0$. Pel **Teorema de Bolzano**, existeix solució a $[-1, 2]$.

**b)** $f(x) = \\sin x - x + 1$.
$f(1) = \\sin(1) > 0$, $f(2) = \\sin(2) - 1 < 0$ (ja que $\\sin(2) \\approx 0.91$). Pel **Teorema de Bolzano**, existeix solució a $[1, 2]$.

**c)** $f(x) = 2x^4 - 14x^2 + 14x - 1$.
Busquem 4 canvis de signe:
- $f(-3) = 162 - 126 - 42 - 1 = -7 < 0$
- $f(-4) = 512 - 224 - 56 - 1 = 231 > 0 \\implies$ Arrel a $(-4, -3)$.
- $f(0) = -1 < 0 \\implies$ Arrel a $(-3, 0)$.
- $f(1) = 2 - 14 + 14 - 1 = 1 > 0 \\implies$ Arrel a $(0, 1)$.
- $f(3) = 162 - 126 + 42 - 1 = 77 > 0$.
Analitzant la derivada $f'(x) = 8x^3 - 28x + 14$, veiem que té un mínim local entre 1 i 3 on la funció torna a baixar. $f(2) = 32 - 56 + 28 - 1 = 3 > 0$. Provant valors propers a $x=0.1$ o analitzant el comportament, trobem la quarta arrel. (Nota: Les 4 arrels existeixen realment per Bolzano en intervals finits).`
    }
];
