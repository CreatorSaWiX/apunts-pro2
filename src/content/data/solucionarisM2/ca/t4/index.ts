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
Al ser $f$ una funció **estrictament decreixent**, l'equació només té una **única solució**.

::mafs{type="unicitat_3x"}
`

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

a) $\\lim_{x \\to +\\infty} \\frac{e^x}{x^5}$; $\\quad$ b) $\\lim_{x \\to +\\infty} x^{1/x}$; $\\quad$ c) $\\lim_{x \\to 0^+} x^{\\sin x}$; $\\quad$ d) $\\lim_{x \\to 0} (\\frac{a^x + b^x}{2})^{1/x}$; $\\quad$ 

f) $\\lim_{x \\to 0} \\frac{1}{x} \\ln \\sqrt{\\frac{1+x}{1-x}}$; $\\quad$ g) $\\lim_{x \\to 0^+} (\\cos x)^{1/x}$; $\\quad$ h) $\\lim_{x \\to +\\infty} x^{\\tan(1/x)}$;
$\\quad$ i) $\\lim_{x \\to +\\infty} \\frac{\\ln(1+x^\\alpha)}{\\ln(1+x^\\beta)}$.`,
        content: `**a)** Indeterminació de tipus $\\frac{\\infty}{\\infty}$. 

$$\\lim_{x \\to \\infty} \\frac{e^x}{x^5} \\xrightarrow{H} \\lim_{x \\to \\infty} \\frac{e^x}{5x^4} \\xrightarrow{H} \\lim_{x \\to \\infty} \\frac{e^x}{20x^3} \\xrightarrow{H} \\lim_{x \\to \\infty} \\frac{e^x}{60x^2} \\xrightarrow{H} \\lim_{x \\to \\infty} \\frac{e^x}{120x} \\xrightarrow{H} \\lim_{x \\to \\infty} \\frac{e^x}{120} = \\mathbf{+\\infty}$$

**b)** Indeterminació de tipus $\\infty^0$. Per poder aplicar Hôpital, fem servir la identitat $A^B = e^{B \\ln A}$ per transformar la potència en una exponencial:
$$x^{1/x} = e^{\\frac{1}{x} \\ln x}$$. 
Sigui $L = \\lim_{x \\to \\infty} e^{\\frac{\\ln x}{x}}$. Calculem primer el límit de l'exponent (que és de tipus $\\frac{\\infty}{\\infty}$):
$$\\lim_{x \\to \\infty} \\frac{\\ln x}{x} \\xrightarrow{H} \\lim_{x \\to \\infty} \\frac{1/x}{1} = 0 \\implies L = e^0 = \\mathbf{1}$$

**c)** Indeterminació de tipus $0^0$. Escrivim $L = \\lim e^{\\sin x \\ln x}$. Estudiem l'exponent ($\\sin x \\ln x$ és del tipus $0 \\cdot (-\\infty)$):
$$\\lim_{x \\to 0^+} \\frac{\\ln x}{\\frac{1}{\\sin x}} \\xrightarrow{H} \\lim_{x \\to 0^+} \\frac{\\frac{1}{x}}{-\\frac{\\cos x}{\\sin^2 x}} = \\lim_{x \\to 0^+} \\frac{-\\sin^2 x}{x \\cos x} = \\lim_{x \\to 0^+} \\left( \\frac{\\sin x}{x} \\right) \\left( \\frac{-\\sin x}{\\cos x} \\right) = 1 \\cdot 0 = 0$$
Per tant, $L = e^0 = \\mathbf{1}$.

**d) $\\lim_{x \\to 0} (\\frac{a^x + b^x}{2})^{1/x}$:**
Indeterminació $1^\\infty$. Sigui $L$ el límit, llavors $\\ln L = \\lim_{x \\to 0} \\frac{\\ln(a^x + b^x) - \\ln 2}{x}$. Apliquem Hôpital ($\\frac{0}{0}$):
$$\\ln L = \\lim_{x \\to 0} \\frac{\\frac{a^x \\ln a + b^x \\ln b}{a^x + b^x}}{1} = \\frac{1 \\cdot \\ln a + 1 \\cdot \\ln b}{1+1} = \\frac{\\ln(ab)}{2} = \\ln \\sqrt{ab} \\implies L = \\mathbf{\\sqrt{ab}}$$

**f) $\\lim_{x \\to 0} \\frac{1}{x} \\ln \\sqrt{\\frac{1+x}{1-x}}$:**
Simplifiquem el logaritme: $\\ln \\sqrt{\\frac{1+x}{1-x}} = \\frac{1}{2} (\\ln(1+x) - \\ln(1-x))$. El límit és del tipus $\\frac{0}{0}$:
$$\\lim_{x \\to 0} \\frac{\\ln(1+x) - \\ln(1-x)}{2x} \\xrightarrow{H} \\lim_{x \\to 0} \\frac{\\frac{1}{1+x} - \\frac{-1}{1-x}}{2} = \\frac{\\frac{1}{1} + \\frac{1}{1}}{2} = \\frac{2}{2} = \\mathbf{1}$$

**g) $\\lim_{x \\to 0^+} (\\cos x)^{1/x}$:**
Indeterminació $1^\\infty$. Escrivim $L = e^{\\lim \\frac{\\ln(\\cos x)}{x}}$. Calculem l'exponent per Hôpital ($\\frac{0}{0}$):
$$\\lim_{x \\to 0^+} \\frac{\\ln(\\cos x)}{x} \\xrightarrow{H} \\lim_{x \\to 0^+} \\frac{\\frac{-\\sin x}{\\cos x}}{1} = \\lim_{x \\to 0^+} -\\tan x = 0 \\implies L = e^0 = \\mathbf{1}$$

**h) $\\lim_{x \\to +\\infty} x^{\\tan(1/x)}$:**
Indeterminació $\\infty^0$. Sigui $\\ln L = \\lim_{x \\to \\infty} \\tan(1/x) \\ln x = \\lim_{x \\to \\infty} \\frac{\\ln x}{\\cot(1/x)}$. Apliquem Hôpital ($\\frac{\\infty}{\\infty}$):
$$\\lim_{x \\to \\infty} \\frac{1/x}{-\\csc^2(1/x) \\cdot (-1/x^2)} = \\lim_{x \\to \\infty} \\frac{1/x}{\\frac{1}{\\sin^2(1/x)} \\cdot \\frac{1}{x^2}} = \\lim_{x \\to \\infty} \\frac{x^2}{x \\cdot \\frac{1}{\\sin^2(1/x)}} = \\lim_{x \\to \\infty} \\frac{\\sin^2(1/x)}{1/x}$$
Fent el canvi $t = 1/x$: $\\lim_{t \\to 0^+} \\frac{\\sin^2 t}{t} = \\lim_{t \\to 0} \\frac{\\sin t}{t} \\cdot \\sin t = 1 \\cdot 0 = 0$. Així, $L = e^0 = \\mathbf{1}$.

**i) $\\lim_{x \\to +\\infty} \\frac{\\ln(1+x^\\alpha)}{\\ln(1+x^\\beta)}$:**
Indeterminació $\\frac{\\infty}{\\infty}$. Apliquem Hôpital:
$$\\lim_{x \\to \\infty} \\frac{\\frac{\\alpha x^{\\alpha-1}}{1+x^\\alpha}}{\\frac{\\beta x^{\\beta-1}}{1+x^\\beta}} = \\frac{\\alpha}{\\beta} \\lim_{x \\to \\infty} \\frac{x^{\\alpha-1} (1+x^\\beta)}{x^\\beta-1 (1+x^\\alpha)} = \\frac{\\alpha}{\\beta} \\lim_{x \\to \\infty} \\frac{x^{\\alpha-1} + x^{\\alpha+\\beta-1}}{x^{\\beta-1} + x^{\\alpha+\\beta-1}}$$
Dividint numerador i denominador per $x^{\\alpha+\\beta-1}$:
$$\\frac{\\alpha}{\\beta} \\lim_{x \\to \\infty} \\frac{x^{-\\beta} + 1}{x^{-\\alpha} + 1} = \\frac{\\alpha}{\\beta} \\cdot \\frac{0+1}{0+1} = \\mathbf{\\frac{\\alpha}{\\beta}}$$`
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
        content: `*   **a) $\\lim_{x \\to 0} \\frac{x^2 \\sin(1/x)}{\\sin x}$:**
Separem el límit en dos:
$$\\lim_{x \\to 0} \\left( \\frac{x}{\\sin x} \\right) \\cdot \\left( x \\sin(1/x) \\right)$$
Avaluem cada part:
1. $\\lim_{x \\to 0} \\frac{x}{\\sin x} = 1$.
2. $\\lim_{x \\to 0} x \\sin(1/x) = 0$ (infinitèsim per funció acotada, ja que $-1 \\leq \\sin(1/x) \\leq 1$).
Per tant, $1 \\cdot 0 = \\mathbf{0}$.

*   **b) $\\lim_{x \\to \\infty} \\frac{x + \\sin x}{x - \\sin x}$:**
Per resoldre l'indeterminació $\\frac{\\infty}{\\infty}$, dividim numerador i denominador per $x$:
$$\\lim_{x \\to \\infty} \\frac{1 + \\frac{\\sin x}{x}}{1 - \\frac{\\sin x}{x}}$$
Com que $\\lim_{x \\to \\infty} \\frac{\\sin x}{x} = 0$, el límit queda:
$$\\frac{1 + 0}{1 - 0} = \\mathbf{1}$$

*   **c) $\\lim_{x \\to 0} \\frac{\\ln(1+x)}{x}$:**
Indeterminació $\\frac{0}{0}$. Apliquem la regla de l'Hôpital:
$$\\lim_{x \\to 0} \\frac{\\frac{d}{dx} \\ln(1+x)}{\\frac{d}{dx} x} = \\lim_{x \\to 0} \\frac{\\frac{1}{1+x}}{1} = \\mathbf{1}$$`
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
        statement: `Determineu i classifiqueu els punts crítics de la funció $f(x) = e^{8x - a(x^2 + 16)}$ segons els valors del paràmetre $a$ ($a \\in \\mathbb{R}$). Té asímptotes? Calculeu-les en funció de $a$.`,
        content: `**1. Punts crítics:**
Per trobar els punts crítics, derivem aplicant la regla de la cadena:
$$f(x) = e^{g(x)} \\implies f'(x) = e^{g(x)} \\cdot g'(x)$$
on $g(x) = 8x - a(x^2 + 16)$. La seva derivada és $g'(x) = 8 - 2ax$.
$$f'(x) = e^{8x - a(x^2 + 16)} (8 - 2ax)$$

Com que l'exponencial mai s'anul·la ($e^{g(x)} > 0$), els punts crítics només depenen del factor $(8 - 2ax)$:
*   Si $a = 0$: $f'(x) = 8e^{8x}$, que sempre és $>0$. No hi ha punts crítics ($f$ és sempre creixent).
*   Si $a \\neq 0$: $8 - 2ax = 0 \\implies x_c = \\frac{4}{a}$.

**2. Classificació:**
Avaluem la segona derivada en el punt crític $x_c$. Com que $f'(x_c) = 0$, la regla de la cadena simplificada ens dóna $f''(x_c) = f(x_c) \\cdot g''(x_c)$.

$$g''(x) = -2a \\implies f''(x_c) = e^{g(x_c)} \\cdot (-2a)$$
*   Si **$a > 0$**: $f''(x_c) < 0 \\implies$ **Màxim relatiu** en $x = 4/a$.
*   Si **$a < 0$**: $f''(x_c) > 0 \\implies$ **Mínim relatiu** en $x = 4/a$.

**3. Asímptotes:**
No hi ha asímptotes verticals perquè el domini és tot $\\mathbb{R}$. Estudiem les asímptotes horitzontals mirant el comportament a l'infinit segons el grau del polinomi de l'exponent:
$$f(x) = e^{-ax^2 + 8x - 16a}$$
*   **Si $a > 0$**: L'exponent tendeix a $-\\infty$ tant per $x \\to +\\infty$ com per $x \\to -\\infty$ (paràbola cap avall).
    $$\\lim_{x \\to \\pm\\infty} f(x) = e^{-\\infty} = 0 \\implies \\text{Asímptota } \\mathbf{y = 0}$$
*   **Si $a < 0$**: L'exponent tendeix a $+\\infty$ (paràbola cap amunt). La funció creix sense límit i **no té asímptotes horitzontals**.
*   **Si $a = 0$**: $f(x) = e^{8x}$.
    $$\\lim_{x \\to -\\infty} e^{8x} = 0 \\implies \\text{Asímptota } \\mathbf{y = 0} \\text{ només per l'esquerra.}$$

::mafs{type="parametrizada_exp"}
`
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

a) $f(x) = \\ln(x^2 - 9), \\quad |x| > 3$ $\\quad$ b) $f(x) = x^{2/3}(x - 1)^4, \\quad 0 \\leq x \\leq 1$`,
        content: `**a) $f(x) = \ln(x^2 - 9)$ ($|x| > 3$):**

**Derivada:**
$f'(x) = \\frac{2x}{x^2 - 9}$. 
El punt on $f'(x) = 0$ és $x=0$, però aquest punt **no pertany** al domini $|x| > 3$.

**Signe de la derivada:**
Com que el denominador $x^2 - 9$ és sempre **positiu** en el domini, el signe depèn de $2x$:
*   En $(-\\infty, -3)$: $2x < 0 \\implies f'(x) < 0 \\implies$ **Decreixent**.
*   En $(3, +\\infty)$: $2x > 0 \\implies f'(x) > 0 \\implies$ **Creixent**.


**b) $f(x) = x^{2/3}(x - 1)^4$ ($x \\in [0, 1]$):**

**Derivada:** $$f'(x) = \\frac{2}{3}x^{-1/3}(x-1)^4 + 4x^{2/3}(x-1)^3$$

Per simplificar, voldrem treure $\\frac{2(x-1)^3}{3x^{1/3}}$ factor comú:
1.  **Primer terme:** $\\frac{2}{3}x^{-1/3}(x-1)^4 = \\frac{2(x-1)^3 \\cdot (x-1)}{3x^{1/3}}$
2.  **Segon terme:** $4x^{2/3}(x-1)^3$. Per poder treure el denominador $3x^{1/3}$, multipliquem i dividim per ell:
    $$4x^{2/3}(x-1)^3 = \\frac{4x^{2/3} \\cdot 3x^{1/3} \\cdot (x-1)^3}{3x^{1/3}} = \\frac{12x(x-1)^3}{3x^{1/3}}$$
    *(Recorda que $x^{2/3} \\cdot x^{1/3} = x^{2/3+1/3} = x^1$)*

Ara ja podem ajuntar-ho tot:
$$f'(x) = \\frac{2(x-1)^3(x-1) + 12x(x-1)^3}{3x^{1/3}} = \\frac{2(x-1)^3 [ (x-1) + 6x ]}{3x^{1/3}} = \\frac{2(x-1)^3(7x-1)}{3x^{1/3}}$$

**Punts crítics ($f'(x) = 0$):**
Trobem zero al numerador quan $x=1$ o $x=1/7$. 
També cal notar que a $x=0$ la derivada no existeix (divisió per zero).

**Intervals:**
*   $(0, 1/7)$: $f' > 0$ (per exemple $f'(0.1) > 0$) $\\implies$ **Creixent**.
*   $(1/7, 1)$: $f' < 0$ (per exemple $f'(0.5) < 0$) $\\implies$ **Decreixent**.

**Extrems relatius:**
*   $x=0$: **Mínim** (la funció comença a créixer).
*   $x=1/7$: **Màxim relatiu** (canvi de creixent a decreixent).
*   $x=1$: **Mínim** (la funció acaba de decréixer).

::mafs{type="extrems_relatius"}
`
    }
];
