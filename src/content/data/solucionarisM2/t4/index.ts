import type { Solution } from '../../solutions';

export const m2t4Solutions: Solution[] = [
    {
        id: "M2-T4-Ex2",
        title: "Problema 2: Unicitat de solució per 3^{-x} = x",
        author: "Apunts",
        type: "notebook",
        code: "",
        statement: `Demostreu que l'equació $3^{-x} = x$ té una única solució. Quina és la part entera d'aquesta solució?`,
        content: `Definim la funció auxiliar $f(x) = 3^{-x} - x$. 
Com que és una combinació de funcions contínues, $f$ és contínua i derivable a tot $\\mathbb{R}$.

**1. Existència (Teorema de Bolzano):**
Avaluem en enters propers:
*   $f(0) = 3^{0} - 0 = 1 > 0$
*   $f(1) = 3^{-1} - 1 = \\frac{1}{3} - 1 = -\\frac{2}{3} < 0$

Atès que $f(0) \\cdot f(1) < 0$, pel **Teorema de Bolzano** existeix almenys una solució $c \\in (0, 1)$. La seva part entera és **0**.

**2. Unicitat:**
Derivem la funció:
$$f'(x) = -3^{-x} \\ln(3) - 1$$
Com que $3^{-x} > 0$ i $\\ln(3) > 1$, aleshores $f'(x) < 0$ per a tot $x$. 
Al ser $f$ una funció **estrictament decreixent**, l'equació només té una **única solució**.`
    },
    {
        id: "M2-T4-Ex4",
        title: "Problema 4: Equació e^{-x} = ln x",
        author: "Apunts",
        type: "notebook",
        code: "",
        statement: `Considerem l'equació $e^{-x} = \\ln x$.
a) Demostreu que l'equació té una solució en el conjunt $[1, +\\infty)$.
b) Doneu un interval de longitud $0.1$ que contingui aquesta solució.
c) Raoneu perquè l'equació donada no pot tenir dues solucions en $[1, +\\infty)$.
d) Apliqueu Newton-Raphson amb el valor inicial $x_0 = 1$ per a determinar l'arrel positiva. Atureu el càlcul quan la diferència entre dos iterats consecutius sigui menor que $10^{-4}$. Quantes iteracions calen en aquest cas?`,
        content: `Definim $f(x) = e^{-x} - \\ln(x)$, contínua a $(0, +\\infty)$.

**a) Existència a $[1, +\\infty)$:**
*   $f(1) = e^{-1} - \\ln(1) = \\frac{1}{e} \\approx 0.3678 > 0$
*   $f(e) = e^{-e} - \\ln(e) = e^{-e} - 1 \\approx -0.9341 < 0$
Pel **Teorema de Bolzano**, existeix almenys una solució a $[1, e] \\subset [1, +\\infty)$.

**b) Interval de longitud 0.1:**
Avaluem entre 1.3 i 1.4:
*   $f(1.3) = e^{-1.3} - \\ln(1.3) \\approx 0.0101 > 0$
*   $f(1.4) = e^{-1.4} - \\ln(1.4) \\approx -0.0899 < 0$
L'interval buscat és **$[1.3, 1.4]$**.

**c) Unicitat:**
Derivem: $f'(x) = -e^{-x} - \\frac{1}{x}$.
Per a $x \\geq 1$, es compleix $f'(x) < 0$. Al ser **estrictament decreixent**, l'arrel és única.

**d) Newton-Raphson ($x_0 = 1$):**
Fórmula: $x_{n+1} = x_n - \\frac{e^{-x_n} - \\ln(x_n)}{-e^{-x_n} - 1/x_n}$
1. $x_0 = 1$
2. $x_1 \\approx 1.2689$
3. $x_2 \\approx 1.3091$
4. $x_3 \\approx 1.3098$
5. $x_4 \\approx 1.3098$ ($|x_4 - x_3| < 10^{-4}$)
Calen **4 iteracions**.`
    },
    {
        id: "M2-T4-Ex6",
        title: "Problema 6: Existència de punt fix f(x)=x",
        author: "Apunts",
        type: "notebook",
        code: "",
        statement: `Sigui $f: [0,1] \\to [0,1]$ una funció contínua i derivable tal que $f'(x) \\neq 1$ per a tot $x \\in [0,1]$. Demostreu que existeix un únic $x_0 \\in [0,1]$ tal que $f(x_0) = x_0$.`,
        content: `Definim $g(x) = f(x) - x$. Cerquem $g(x) = 0$.

**1. Existència:**
*   $g(0) = f(0) \\geq 0$ (ja que $f:[0,1] \\to [0,1]$)
*   $g(1) = f(1) - 1 \\leq 0$ (ja que $f(1) \\leq 1$)

Si $g(0)=0$ o $g(1)=0$, ja hem trobat el punt fix. Si no, pel **Teorema de Bolzano**, existeix $x_0 \\in (0,1)$ tal que $g(x_0)=0$.

**2. Unicitat:**
Suposem dos punts $a < b$ tals que $g(a) = g(b) = 0$. Pel **Teorema de Rolle**, hi hauria un $c \\in (a,b)$ amb $g'(c) = 0$. 
Com que $g'(c) = f'(c) - 1$, tindríem $f'(c) = 1$, cosa que contravé l'enunciat.`
    },
    {
        id: "M2-T4-Ex7",
        title: "Problema 7: Equació e^x = x/2 + 2",
        author: "Apunts",
        type: "notebook",
        code: "",
        statement: `Considerem l'equació $e^x = \\frac{1}{2}x + 2$.
a) Demostreu que l'equació té una solució positiva i una de negativa a l'interval $[-5, 2]$.
b) Demostreu que l'equació només té dues solucions reals.
c) Calculeu, sense fer cap iteració, el nombre d'iteracions que serien necessàries si féssim servir el mètode de la bisecció per tal de calcular la solució positiva l'equació amb un error absolut menor que $10^{-8}$.`,
        content: `Definim $f(x) = e^x - \\frac{1}{2}x - 2$.

**a) Existència a $[-5, 2]$:**
*   $f(-5) = e^{-5} + 2.5 - 2 \\approx 0.5067 > 0$
*   $f(0) = 1 - 2 = -1 < 0$
*   $f(2) = e^2 - 1 - 2 \\approx 4.3891 > 0$
Per Bolzano, hi ha una arrel a $(-5, 0)$ (negativa) i una a $(0, 2)$ (positiva).

**b) Unicitat:**
$f'(x) = e^x - 1/2$. S'anul·la només a $x = \\ln(1/2) \\approx -0.69$.
Al tenir només un punt crític (mínim), per Rolle pot tenir com a màxim **dues arrels**. Com que ja n'hem trobat dues, no n'hi ha més.

**c) Iteracions Bissecció (error $< 10^{-8}$):**
Interval $[0, 2]$, amplada $L = 2$.
$$\\frac{L}{2^n} < 10^{-8} \\implies \\frac{2}{2^n} < 10^{-8} \\implies 2^{n-1} > 10^8$$
$(n-1) \\ln 2 > 8 \\ln 10 \\implies n > 27.57$. Calen **28 iteracions**.`
    },
    {
        id: "M2-T4-Ex8",
        title: "Problema 8: Regla de l'Hôpital (Diversos)",
        author: "Apunts",
        type: "notebook",
        code: "",
        statement: `Calculeu, utilitzant la regla de l'Hôpital, els límits següents:
a) $\\lim_{x \\to +\\infty} \\frac{e^x}{x^5}$; 
b) $\\lim_{x \\to +\\infty} x^{1/x}$; 
c) $\\lim_{x \\to 0^+} x^{\\sin x}$; 
d) $\\lim_{x \\to 0} (\\frac{a^x + b^x}{2})^{1/x}$;
f) $\\lim_{x \\to 0} \\frac{1}{x} \\ln \\sqrt{\\frac{1+x}{1-x}}$;
g) $\\lim_{x \\to 0^+} (\\cos x)^{1/x}$;
h) $\\lim_{x \\to +\\infty} x^{\\tan(1/x)}$;
i) $\\lim_{x \\to +\\infty} \\frac{\\ln(1+x^\\alpha)}{\\ln(1+x^\\beta)}$.`,
        content: `*   **a)** Indeterminació $\\infty/\\infty$. Apliquem Hôpital 5 cops: $\\lim \\frac{e^x}{5x^4} = \\dots = \\lim \\frac{e^x}{120} = \\mathbf{+\\infty}$.
*   **b)** Sigui $L$ el límit. $\\ln L = \\lim \\frac{\\ln x}{x} \\xrightarrow{H} \\lim \\frac{1/x}{1} = 0 \\implies L = e^0 = \\mathbf{1}$.
*   **c)** $\\ln L = \\lim \\sin x \\ln x = \\lim \\frac{\\ln x}{1/\\sin x} \\xrightarrow{H} \\lim \\frac{1/x}{-\\cos x/\\sin^2 x} = \\lim \\frac{-\\sin^2 x}{x \\cos x} = 0 \\implies L = \\mathbf{1}$.
*   **d)** $\\ln L = \\lim \\frac{\\ln(a^x+b^x) - \\ln 2}{x} \\xrightarrow{H} \\lim \\frac{a^x \\ln a + b^x \\ln b}{a^x + b^x} = \\frac{\\ln a + \\ln b}{2} = \\ln \\sqrt{ab} \\implies L = \\mathbf{\\sqrt{ab}}$.
*   **f)** $\\lim \\frac{\\ln(1+x) - \\ln(1-x)}{2x} \\xrightarrow{H} \\lim \\frac{\\frac{1}{1+x} + \\frac{1}{1-x}}{2} = \\frac{2}{2} = \\mathbf{1}$.
*   **g)** $\\ln L = \\lim \\frac{\\ln(\\cos x)}{x} \\xrightarrow{H} \\lim \\frac{-\\tan x}{1} = 0 \\implies L = \\mathbf{1}$.
*   **h)** $\\ln L = \\lim \\frac{\\ln x}{\\cot(1/x)} \\xrightarrow{H} \\lim \\frac{1/x}{\\csc^2(1/x) \\cdot (1/x^2)} = \\lim \\frac{x}{\\csc^2(1/x)} = 0 \\implies L = \\mathbf{1}$.
*   **i)** $\\lim \\frac{\\frac{\\alpha x^{\\alpha-1}}{1+x^\\alpha}}{\\frac{\\beta x^{\\beta-1}}{1+x^\\beta}} = \\frac{\\alpha}{\\beta} \\lim \\frac{x^\\alpha + x^{\\alpha+\\beta-1}}{x^\\beta + x^{\\alpha+\\beta-1}} = \\mathbf{\\frac{\\alpha}{\\beta}}$ ($x \\to \\infty$).`
    },
    {
        id: "M2-T4-Ex9",
        title: "Problema 9: Límits varis",
        author: "Apunts",
        type: "notebook",
        code: "",
        statement: `Calculeu els límits següents:
a) $\\lim_{x \\to 0} \\frac{x^2 \\sin(1/x)}{\\sin x}$;
b) $\\lim_{x \\to \\infty} \\frac{x + \\sin x}{x - \\sin x}$;
c) $\\lim_{x \\to 0} \\frac{\\ln(1+x)}{x}$.`,
        content: `*   **a)** $\\lim \\frac{x}{\\sin x} \\cdot x \\sin(1/x) = 1 \\cdot 0 = \\mathbf{0}$ (Infinitesimal per acotada).
*   **b)** $\\lim \\frac{1 + \\frac{\\sin x}{x}}{1 - \\frac{\\sin x}{x}} = \\frac{1+0}{1-0} = \\mathbf{1}$.
*   **c)** Directament per infinitèsims o Hôpital: $\\lim \\frac{1/(1+x)}{1} = \\mathbf{1}$.`
    },
    {
        id: "M2-T4-Ex10",
        title: "Problema 10: Teorema del valor mitjà",
        author: "Apunts",
        type: "notebook",
        code: "",
        statement: `Feu ús del teorema del valor mitjà per demostrar que es compleix $\\ln(1+x) \\leq x$ si $x \\geq 0$.`,
        content: `Definim $f(t) = \\ln(1+t)$. 
*   Si $x=0$, $0 \\leq 0$ cert.
*   Si $x>0$, pel **TVM** a $[0,x]$, existeix $c \\in (0,x)$ tal que:
    $$f(x) - f(0) = f'(c)(x-0) \\implies \\ln(1+x) = \\frac{1}{1+c} x$$
Com que $c > 0$, llavors $\\frac{1}{1+c} < 1$. Per tant, $\\ln(1+x) < x$. 
En conclusió, $\\ln(1+x) \\leq x$ per a tot $x \\geq 0$.`
    },
    {
        id: "M2-T4-Ex18",
        title: "Problema 18: Punts crítics, classificació i asímptotes",
        author: "Apunts",
        type: "notebook",
        code: "",
        statement: `Determineu i classifiqueu els punts crítics de la funció $f(x) = e^{8x - a(x^2 + 16)}$ segons els valors del paràmetre $a$ ($a \in \\mathbb{R}$). Té asímptotes? Calculeu-les en funció de $a$.`,
        content: `**1. Punts crítics:**
$f'(x) = e^{8x - a(x^2 + 16)} (8 - 2ax)$.
$f'(x) = 0 \\implies 8 - 2ax = 0 \\implies ax = 4$.
*   Si $a = 0$: No hi ha punts crítics ($f(x) = e^{8x}$ creixent).
*   Si $a \\neq 0$: Punt crític a $x_c = 4/a$.

**2. Classificació:**
$f''(x_c) = e^{\\dots} (-2a)$. 
*   Si $a > 0$: $f''(x_c) < 0 \\implies$ **Màxim**.
*   Si $a < 0$: $f''(x_c) > 0 \\implies$ **Mínim**.

**3. Asímptotes:**
No hi ha asímptotes verticals ($D = \\mathbb{R}$).
Estudiem $\\lim_{x \\to \\pm\\infty} e^{-ax^2 + 8x - 16a}$:
*   **$a > 0$**: $\\lim = e^{-\\infty} = 0$. Asímptota horitzontal **$y = 0$**.
*   **$a < 0$**: $\\lim = e^{+\\infty} = +\\infty$. No n'hi ha.
*   **$a = 0$**: $y=0$ quan $x \\to -\\infty$ (exponencial standard).`
    },
    {
        id: "M2-T4-Ex12",
        title: "Problema 12: Gràfica talla exactament un cop l'eix",
        author: "Apunts",
        type: "notebook",
        code: "",
        statement: `Siguin $a, b, c$ nombres reals i suposem $a^2 < 3b$. Demostreu que la gràfica de la funció $f(x) = x^3 + ax^2 + bx + c$ talla exactament una vegada l'eix d'abscisses.`,
        content: `**1. Existència:**
Al ser un polinomi de grau imparell ($x^3$), els límits a $\\pm\\infty$ són $\\pm\\infty$ respectivament. Per continuïtat i el Teorema dels Valors Intermedis, ha de tallar l'eix almenys una vegada.

**2. Unicitat:**
Derivem: $f'(x) = 3x^2 + 2ax + b$.
El discriminant és $\\Delta = (2a)^2 - 4(3)(b) = 4a^2 - 12b = 4(a^2 - 3b)$.
Com que l'enunciat diu $a^2 < 3b$, llavors $\\Delta < 0$.
Això implica que la derivada $f'(x)$ no s'anul·la mai i, com que el coeficient de $x^2$ és positiu, $f'(x) > 0$ sempre. 
Al ser $f$ **estrictament creixent**, el tall amb l'eix és únic.`
    },
    {
        id: "M2-T4-Ex21",
        title: "Problema 21: Intervals de creixement i extrems relatius",
        author: "Apunts",
        type: "notebook",
        code: "",
        statement: `Determineu els intervals de creixement i decreixement i els extrems relatius, si existeixen, de cada una de les funcions següents en els dominis de definició:
a) $f(x) = \\ln(x^2 - 9), \\quad |x| > 3$
b) $f(x) = x^{2/3}(x - 1)^4, \\quad 0 \\leq x \\leq 1$`,
        content: `**a) $f(x) = \\ln(x^2 - 9)$ ($|x| > 3$):**
$f'(x) = \\frac{2x}{x^2 - 9}$. El punt crític $x=0$ no pertany al domini.
*   $(-\\infty, -3)$: $f'(-4) < 0 \\implies$ **Decreixent**.
*   $(3, +\\infty)$: $f'(4) > 0 \\implies$ **Creixent**.
No té extrems relatius al domini.

**b) $f(x) = x^{2/3}(x - 1)^4$ ($x \\in [0, 1]$):**
$f'(x) = \\frac{2(x-1)^3(7x-1)}{3x^{1/3}}$. Punts crítics a $x=0, 1/7, 1$.
*   $(0, 1/7)$: $f'(0.1) > 0 \\implies$ **Creixent**.
*   $(1/7, 1)$: $f'(0.5) < 0 \\implies$ **Decreixent**.
Extrems:
*   $x=0, x=1$: **Mínims relatius** ($f=0$).
*   $x=1/7$: **Màxim relatiu**.`
    }
];
