import type { Solution } from '../../solutions';

export const m2t5Solutions: Solution[] = [
    {
        id: "M2-T5-Ex1",
        title: "Problema 1: Taylor i avaluabilitat radical",
        author: "Apunts",
        type: "notebook",
        code: "",
        statement: `Empreu el polinomi de Taylor de grau 2 de la funció $f(x) = \\sqrt[3]{1728 + x}$ per tal d'avaluar $\\sqrt[3]{1731}$. Fiteu l'error comès.`,
        content: `Sigui $f(x) = (1728 + x)^{1/3}$. Centrem el polinomi a $a = 0$ ja que $f(0) = \\sqrt[3]{1728} = 12$.

1. **Derivades a $a = 0$:**
   * $f(0) = 12$
   * $f'(x) = \\frac{1}{3}(1728 + x)^{-2/3} \\implies f'(0) = \\frac{1}{432}$
   * $f''(x) = -\\frac{2}{9}(1728 + x)^{-5/3} \\implies f''(0) = -\\frac{1}{1119744}$

2. **Polinomi de Taylor ($P_2$):**

   $$ P_2(x) = 12 + \\frac{1}{432}x - \\frac{1}{2239488}x^2 $$

3. **Avaluació:** Per a $\\sqrt[3]{1731}$, usem $x = 3$:

   $$ P_2(3) = 12 + \\frac{3}{432} - \\frac{9}{2239488} \\approx 12.00694043 $$

4. **Error (Resta de Lagrange):**

   $$ R_2(x) = \\frac{f'''(c)}{3!}x^3, \\quad f'''(x) = \\frac{10}{27}(1728+x)^{-8/3} $$

   Per a $x=3$ i $c \\in (0, 3)$, l'error màxim és a $c=0$:

   $$ \\varepsilon \\leq \\frac{5}{81 \\cdot 1728^{8/3}} \\cdot 3^3 = \\frac{5}{1289945088} \\approx 3.876 \\cdot 10^{-9} $$

   Així, **$\\varepsilon \\leq 0.4 \\cdot 10^{-8}$**.`
    },
    {
        id: "M2-T5-Ex2",
        title: "Problema 2: Desenvolupament logs",
        author: "Apunts",
        type: "notebook",
        code: "",
        statement: `Considereu la funció $f(x) = \\ln(1 - x)$.
a) Determineu els cinc primers termes no nuls del polinomi de Taylor centrat a l'origen i l'expressió del residu corresponent en la forma de Lagrange de la funció $f(x)$.
b) Determineu el grau del polinomi de Taylor de la funció $f(x)$ per obtenir el valor de $\\ln 0.75$ amb error més petit que $10^{-3}$.`,
        content: `**a) Taylor fins a grau 5 a $a = 0$:**
Calculem les derivades:
* $f(x) = \\ln(1-x) \\implies f(0) = 0$
* $f'(x) = -(1-x)^{-1} \\implies f'(0) = -1$
* $f''(x) = -(1-x)^{-2} \\implies f''(0) = -1$
* $f^{(k)}(0) = -(k-1)!$ per a $k \\geq 1$.

El polinomi és:

$$ P_5(x) = -x - \\frac{x^2}{2} - \\frac{x^3}{3} - \\frac{x^4}{4} - \\frac{x^5}{5} $$

Expressió del residu de Lagrange ($n$):

$$ R_n(x) = \\frac{f^{(n+1)}(c)}{(n+1)!} x^{n+1} = -\\frac{x^{n+1}}{(n+1)(1-c)^{n+1}} $$

amb $c$ entre $0$ i $x$.

**b) Càlcul del grau per a $\\ln(0.75)$:**
Volem $\\ln(1-x) = \\ln(0.75) \\implies x = 0.25 = 1/4$. L'error ha de ser $< 10^{-3}$:

$$ |R_n(0.25)| = \\frac{1}{(n+1) 4^{n+1} (1-c)^{n+1}} $$

Per a $c \\in (0, 0.25)$, el residu és màxim quan $c=0.25$:

$$ |R_n(0.25)| \\leq \\frac{1}{(n+1) 4^{n+1} (3/4)^{n+1}} = \\frac{1}{(n+1) 3^{n+1}} $$

Imposem $\\frac{1}{(n+1) 3^{n+1}} \\leq 10^{-3} \\implies (n+1) 3^{n+1} \\geq 1000$:

* Per $n=3: 4 \\cdot 81 = 324 < 1000$
* Per $n=4: 5 \\cdot 243 = 1215 \\geq 1000$

El grau mínim és **$n \\geq 4$**.`
    },
    {
        id: "M2-T5-Ex3",
        title: "Problema 3: Aproximant e amb fites fixades generals",
        author: "Apunts",
        type: "notebook",
        code: "",
        statement: `Doneu una cota superior de l'error en la fórmula $e \\approx 2 + \\frac{1}{2!} + \\frac{1}{3!} + \\frac{1}{4!}$ mitjançant la fórmula de Taylor de $e^x$.`,
        content: `Usem el desenvolupament de $e^x$ a $a=0$ atès que $e^x \\approx P_n(x) = \\sum_{k=0}^n \\frac{x^k}{k!}$.
La fórmula $2 + \\frac{1}{2!} + \\frac{1}{3!} + \\frac{1}{4!}$ correspon a $P_4(1) = 1 + 1 + \\frac{1}{2!} + \\frac{1}{3!} + \\frac{1}{4!}$.

L'error és el residu de Lagrange $R_4(1)$:

$$ R_4(1) = \\frac{f^{(5)}(c)}{5!} 1^5 = \\frac{e^c}{120}, \\quad c \\in (0, 1) $$

Com que $e^c$ és creixent, el valor màxim s'assoleix a $c=1$:

$$ \\text{Error} \\leq \\frac{e^1}{120} < \\frac{3}{120} = 0.025 $$`
    },
    {
        id: "M2-T5-Ex4",
        title: "Problema 4: Arrels quadrades sobre Taller de funcions",
        author: "Apunts",
        type: "notebook",
        code: "",
        statement: `Sigui $f(x) = \\sqrt{x}$.
a) Obteniu el polinomi de Taylor de grau dos de la funció $f(x)$ en $x_0 = 1$.
b) Fent ús del polinomi de l'apartat a) calculeu un valor aproximat de $\\sqrt{1.02}$.
c) Doneu una fita superior de l'error comès en el càlcul de l'apartat b).`,
        content: `**a) Polinomi a $x_0 = 1$:**
Calculem derivades:
* $f(1) = \\sqrt{1} = 1$
* $f'(x) = \\frac{1}{2}x^{-1/2} \\implies f'(1) = 1/2$
* $f''(x) = -\\frac{1}{4}x^{-3/2} \\implies f''(1) = -1/4$

$$ P_2(x) = 1 + \\frac{1}{2}(x-1) - \\frac{1}{8}(x-1)^2 $$

**b) Aproximació de $\\sqrt{1.02}$:**
Usem $x = 1.02$, per tant $x-1 = 0.02$:

$$ \\sqrt{1.02} \\approx P_2(1.02) = 1 + \\frac{0.02}{2} - \\frac{0.0004}{8} = 1 + 0.01 - 0.00005 = 1.00995 $$

**c) Fita de l'error:**

$$ R_2(x) = \\frac{f'''(c)}{6}(x-1)^3, \\quad f'''(x) = \\frac{3}{8}x^{-5/2} $$

Per a $c \\in (1, 1.02)$ i $x-1 = 0.02$:

$$ |R_2(1.02)| \\leq \\frac{3/8 \\cdot 1^{-5/2}}{6} (0.02)^3 = \\frac{1}{16} (0.000008) = 0.5 \\cdot 10^{-6} $$`
    },
    {
        id: "M2-T5-Ex5",
        title: "Problema 5: Exemples d'Avaluacions Decimalitzades",
        author: "Apunts",
        type: "notebook",
        code: "",
        statement: `Avalueu amb tres decimals correctes (error $\\leq \\frac{1}{2}10^{-3}$) les quantitats següents:
a) $e^{0.25}$; b) $\\sin(-0.2)$; c) $\\cos(0.9)$; d) $\\ln(1.1)$;
e) $\\ln(0.9)$; f) $\\sqrt{1.05}$; g) $\\sqrt{0.97}$; h) $1/\\sqrt{e}$.`,
        content: `Volem error $\\leq 0.0005$.

* **a) $e^{0.25}$:** $a=0$. $R_n(x) = \\frac{e^c}{(n+1)!}x^{n+1}$. Per $x=0.25$ i $n=3$, l'error és $\\leq \\frac{e^{0.25}}{24} (0.25)^4 < 0.0005$.
  $P_3(0.25) = 1 + 0.25 + \\frac{0.25^2}{2} + \\frac{0.25^3}{6} \\approx \\mathbf{1.284}$
* **b) $\\sin(-0.2)$:** $a=0$. Amb $n=3$, l'error és $\\leq \\frac{0.2^5}{120} < 0.0005$.
  $P_3(-0.2) = -0.2 - \\frac{(-0.2)^3}{6} \\approx \\mathbf{-0.199}$
* **c) $\\cos(0.9)$:** $a=0$. Es requereix $n=6$.
  $P_6(0.9) = 1 - \\frac{0.9^2}{2} + \\frac{0.9^4}{24} - \\frac{0.9^6}{720} \\approx \\mathbf{0.622}$
* **d) $\\ln(1.1)$:** $a=0$. $x=0.1, n=3$ és suficient.
  $P_3(0.1) = 0.1 - \\frac{0.1^2}{2} + \\frac{0.1^3}{3} \\approx \\mathbf{0.095}$
* **e) $\\ln(0.9)$:** $a=0$. $x=-0.1, n=3$.
  $P_3(-0.1) = -0.1 - \\frac{0.1^2}{2} - \\frac{0.1^3}{3} \\approx \\mathbf{-0.105}$
* **f) $\\sqrt{1.05}$:** $a=0$. $x=0.05, n=2$.
  $P_2(0.05) = 1 + \\frac{0.05}{2} - \\frac{0.05^2}{8} \\approx \\mathbf{1.025}$
* **g) $\\sqrt{0.97}$:** $a=0$. $x=-0.03, n=2$.
  $P_2(-0.03) = 1 - \\frac{0.03}{2} - \\frac{0.03^2}{8} \\approx \\mathbf{0.985}$
* **h) $1/\\sqrt{e} = e^{-0.5}$:** $a=0$. $x=-0.5, n=4$.
  $P_4(-0.5) = 1 - 0.5 + \\frac{0.5^2}{2} - \\frac{0.5^3}{6} + \\frac{0.5^4}{24} \\approx \\mathbf{0.607}$`
    },
    {
        id: "M2-T5-Ex6",
        title: "Problema 6: Maclaurin i residu de varies funcions",
        author: "Apunts",
        type: "notebook",
        code: "",
        statement: `Determineu els cinc primers termes no nuls del polinomi de Taylor centrat a l'origen i l'expressió del residu en la forma de Lagrange de les funcions:
a) $f(x) = e^x$;
b) $f(x) = \\sin(x)$;
c) $f(x) = \\ln(1+x)$.`,
        content: `**a) $e^x$:**
Totes les derivades són $e^x$, per tant $f^{(k)}(0) = 1$.

$$ P_4(x) = 1 + x + \\frac{x^2}{2} + \\frac{x^3}{6} + \\frac{x^4}{24} $$

$$ R_4(x) = \\frac{e^c}{120}x^5, \\quad c \\in (0, x) $$

**b) $\\sin(x)$:**
Derivades a $x=0$: $0, 1, 0, -1, 0, 1, 0, -1, 0, 1$. Els termes no nuls són de grau imparell:

$$ P_9(x) = x - \\frac{x^3}{6} + \\frac{x^5}{120} - \\frac{x^7}{5040} + \\frac{x^9}{362880} $$

$$ R_9(x) = \\frac{\\sin^{(10)}(c)}{10!}x^{10} = -\\frac{\\sin(c)}{10!}x^{10}, \\quad c \\in (0, x) $$

**c) $\\ln(1+x)$:**
Derivades a $x=0$: $f^{(k)}(0) = (-1)^{k-1}(k-1)!$ per $k \\geq 1$.

$$ P_5(x) = x - \\frac{x^2}{2} + \\frac{x^3}{3} - \\frac{x^4}{4} + \\frac{x^5}{5} $$

$$ R_5(x) = \\frac{f^{(6)}(c)}{6!}x^6 = -\\frac{x^6}{6(1+c)^6}, \\quad c \\in (0, x) $$`
    },
    {
        id: "M2-T5-Ex8",
        title: "Problema 8: Límits mitjançant infinitèssims i Taylor",
        author: "Apunts",
        type: "notebook",
        code: "",
        statement: `Calculeu els límits següents fent ús de la fórmula de Taylor i/o infinitèssims:
a) $\\lim_{x \\to 0} \\frac{e^x - 1}{x}$;
b) $\\lim_{x \\to a} \\frac{\\sin x - \\sin a}{x^2 - 4ax + 3a^2}$;
e) $\\lim_{x \\to 0} \\frac{(1-\\cos x)\\arctan x}{x \\sin^2 x}$.`,
        content: `**a) $\\lim_{x \\to 0} \\frac{e^x - 1}{x}$:**
Substituïm $e^x \\sim 1 + x$:

$$ \\lim_{x \\to 0} \\frac{(1+x)-1}{x} = \\lim_{x \\to 0} \\frac{x}{x} = 1 $$

**b) $\\lim_{x \\to a} \\frac{\\sin x - \\sin a}{x^2 - 4ax + 3a^2}$:**
Numerador: $\\sin x - \\sin a \\sim \\cos(a)(x-a)$.
Denominador: $x^2 - 4ax + 3a^2 = (x-a)(x-3a)$.

$$ \\lim_{x \\to a} \\frac{\\cos(a)(x-a)}{(x-a)(x-3a)} = \\lim_{x \\to a} \\frac{\\cos a}{x-3a} = \\frac{\\cos a}{a-3a} = -\\frac{\\cos a}{2a} $$

**e) $\\lim_{x \\to 0} \\frac{(1-\\cos x)\\arctan x}{x \\sin^2 x}$:**
Usem infinitèsims: $1-\\cos x \\sim \\frac{x^2}{2}$, $\\arctan x \\sim x$, $\\sin^2 x \\sim x^2$.

$$ \\lim_{x \\to 0} \\frac{(x^2/2) \\cdot x}{x \\cdot x^2} = \\frac{1}{2} $$`
    },
    {
        id: "M2-T5-Ex9",
        title: "Problema 9: Desenvolupaments d'ordre divers",
        author: "Apunts",
        type: "notebook",
        code: "",
        statement: `Trobeu el desenvolupament de Taylor:
a) d'ordre 3 a l'origen de la funció $f(x) = e^x \\tan x$
b) d'ordre 4 a l'origen de $f(x) = \\sqrt{1 - x^2}$
c) d'ordre 3 a l'origen de $f(x) = e^{\\cos x}$`,
        content: `**a) $f(x) = e^x \\tan x$ d'ordre 3 a $a=0$:**

* $e^x = 1 + x + \\frac{x^2}{2} + \\frac{x^3}{6} + \\dots$
* $\\tan x = x + \\frac{x^3}{3} + \\dots$

Multipliquem ometent termes de grau $>3$:

$$ f(x) \\approx (1 + x + \\frac{x^2}{2} + \\frac{x^3}{6})(x + \\frac{x^3}{3}) = x + \\frac{x^3}{3} + x^2 + \\frac{x^3}{2} = x + x^2 + \\frac{5}{6}x^3 $$

$$ P_3(x) = x + x^2 + \\frac{5}{6}x^3 $$

**b) $f(x) = \\sqrt{1 - x^2}$ d'ordre 4 a $a=0$:**
Usem $(1+u)^{1/2} = 1 + \\frac{1}{2}u - \\frac{1}{8}u^2 + \\dots$ amb $u = -x^2$:

$$ P_4(x) = 1 + \\frac{1}{2}(-x^2) - \\frac{1}{8}(-x^2)^2 = 1 - \\frac{1}{2}x^2 - \\frac{1}{8}x^4 $$

**c) $f(x) = e^{\\cos x}$ d'ordre 3 a $a=0$:**
* $\\cos x \\approx 1 - \\frac{x^2}{2}$

$$ e^{\\cos x} \\approx e \\cdot e^{-x^2/2} $$

Sustituïm $e^u = 1 + u + \\dots$ amb $u = -x^2/2$:

$$ e \\cdot (1 - \\frac{x^2}{2}) = e - \\frac{e}{2}x^2 $$`
    },
    {
        id: "M2-T5-Ex11",
        title: "Problema 11: Polinomi de funcions irracionals",
        author: "Apunts",
        type: "notebook",
        code: "",
        statement: `Sigui la funció $f(x) = \\frac{1}{\\sqrt{1-x}}$
a) Construïu el polinomi de Taylor de grau 1 en l'entorn del punt $x_0 = 0$.
b) Escriviu el terme complementari de l'error que es comet en considerar el polinomi de Taylor de grau 1 obtingut enlloc de la funció irracional $f(x)$.
c) Trobeu una cota superior de l'error si $|x| < \\frac{1}{16}$ en l'aproximació $\\frac{1}{\\sqrt{1-x}} \\approx 1 + \\frac{x}{2}$.`,
        content: `**a) Taylor de grau 1 a $x_0 = 0$:**
* $f(0) = 1$
* $f'(x) = \\frac{1}{2}(1-x)^{-3/2} \\implies f'(0) = 1/2$

$$ P_1(x) = 1 + \\frac{1}{2}x $$

**b) Terme complementari (Residu):**
* $f''(x) = \\frac{3}{4}(1-x)^{-5/2}$

$$ R_1(x) = \\frac{f''(c)}{2!}x^2 = \\frac{3x^2}{8(1-c)^{5/2}} $$

**c) Cota superior de l'error per $|x| < 1/16$:**
L'error és màxim quan $x=1/16$ i $c=1/16$:

$$ \\varepsilon \\leq \\frac{3 (1/16)^2}{8(1 - 1/16)^{5/2}} \\approx \\mathbf{0.00172} $$`
    }
];
