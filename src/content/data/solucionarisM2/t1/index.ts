import type { Solution } from '../../solutions';

export const m2t1Solutions: Solution[] = [
    {
        id: "M2-T1-Ex1",
        title: "Problema 1: Desigualtats fraccionàries i polinòmiques",
        author: "Apunts",
        type: "notebook",
        code: "",
        statement: `Resoleu les desigualtats següents:
a) $\\frac{x-1}{x+1} < 0$;
b) $\\frac{1}{x+3} > \\frac{1}{4}$;
c) $\\frac{x-1}{x+1} \\leq \\frac{x+1}{x-1}$;
d) $x^2 + x \\leq 0$; 
e) $1 < x^2 < 4$.

En cada apartat representeu sobre la recta real el conjunt de solucions i digueu si tal conjunt és fitat superiorment (inferiorment). En cas afirmatiu, trobeu-ne el suprem (ínfim).`,
        content: `**a)** $\\frac{x-1}{x+1} < 0$
Per resoldre una inequació, cal estudiar el signe de la fracció.
*   Arrel del numerador: $x-1=0 \\implies x=1$
*   Arrel del denominador: $x+1=0 \\implies x=-1$

Les arrels divideixen la recta real en tres intervals: $(-\\infty, -1), (-1, 1), (1, +\\infty)$. Avaluem el signe agafant un punt de cada interval:
*   $x=-2: \\frac{-3}{-1} = 3 > 0$
*   $x=0: \\frac{-1}{1} = -1 < 0$
*   $x=2: \\frac{1}{3} > 0$

Com que la inequació demana valors estrictament menors que 0, agafem l'interval negatiu.
**Conjunt de solucions:** $A = (-1, 1)$. $A$ és un conjunt fitat. $\\inf(A) = -1, \\sup(A) = 1$.

---

**b)** $\\frac{1}{x+3} > \\frac{1}{4}$
Passem-ho tot a un costat: $\\frac{1}{x+3} - \\frac{1}{4} > 0 \\implies \\frac{4 - (x+3)}{4(x+3)} > 0 \\implies \\frac{1-x}{4(x+3)} > 0$
*   Arrel del numerador: $1-x = 0 \\implies x=1$
*   Arrel del denominador: $4(x+3) = 0 \\implies x=-3$

Intervals: $(-\\infty, -3), (-3, 1), (1, +\\infty)$.
*   $x=-4: \\frac{5}{-4} < 0$
*   $x=0: \\frac{1}{12} > 0$
*   $x=2: \\frac{-1}{20} < 0$

**Conjunt de solucions:** $B = (-3, 1)$. $B$ és un conjunt fitat. $\\inf(B) = -3, \\sup(B) = 1$.

---

**c)** $\\frac{x-1}{x+1} \\leq \\frac{x+1}{x-1}$
Igualem a zero:
$$ \\frac{x-1}{x+1} - \\frac{x+1}{x-1} \\leq 0 \\implies \\frac{(x-1)^2 - (x+1)^2}{(x+1)(x-1)} \\leq 0 \\implies \\frac{-4x}{(x+1)(x-1)} \\leq 0 \\implies \\frac{4x}{(x+1)(x-1)} \\geq 0 $$
*   Arrel del numerador: $4x=0 \\implies x=0$.
*   Arrels del denominador: $x+1=0 \\implies x=-1$ i $x-1=0 \\implies x=1$.

Intervals: $(-\\infty, -1), (-1, 0), (0, 1), (1, +\\infty)$.
*   $x=-2: \\frac{-8}{3} < 0$
*   $x=-0.5: \\frac{-2}{-0.75} > 0$
*   $x=0.5: \\frac{2}{-0.75} < 0$
*   $x=2: \\frac{8}{3} > 0$

**Conjunt de solucions:** $C = (-1, 0] \\cup (1, +\\infty)$. $C$ és fitat inferiorment. $\\inf(C) = -1$.

---

**d)** $x^2 + x \\leq 0$
Traiem factor comú: $x(x+1) \\leq 0$. Arrels: $x=0$ i $x=-1$.
Intervals: $(-\\infty, -1), (-1, 0), (0, +\\infty)$.
*   $x=-2: (-2)(-1)=2 > 0$
*   $x=-0.5: (-0.5)(0.5)=-0.25 < 0$
*   $x=1: (1)(2)=2 > 0$

**Conjunt de solucions:** $D = [-1, 0]$. $D$ és fitat. $\\inf(D) = -1, \\sup(D) = 0$.

---

**e)** $1 < x^2 < 4$
Separem la doble inequació en dues que s'han de complir alhora:
*   $x^2 > 1 \\implies |x| > 1 \\implies x \\in (-\\infty, -1) \\cup (1, +\\infty)$.
*   $x^2 < 4 \\implies |x| < 2 \\implies x \\in (-2, 2)$.

Fem la intersecció de les dues solucions: $D = ((-\\infty, -1) \\cup (1, +\\infty)) \\cap (-2, 2)$
**Conjunt de solucions:** $E = (-2, -1) \\cup (1, 2)$. $E$ és fitat. $\\inf(E) = -2, \\sup(E) = 2$.`
    },
    {
        id: "M2-T1-Ex2",
        title: "Problema 2: Desigualtats amb valor absolut",
        author: "Apunts",
        type: "notebook",
        code: "",
        statement: `Trobeu tots els nombres reals $x$ que satisfan les desigualtats següents:
a) $|2x+7| \\geq 3$;
b) $|x^2 - 1| \\leq 3$;
c) $|x-1| > |x+1|$;
d) $|x| + |x+1| < 2$.`,
        content: `**a)** $|2x+7| \\geq 3$
Desdoblem el valor absolut en dues inequacions (condicions de direcció divergent):
1.  $2x+7 \\geq 3 \\implies 2x \\geq -4 \\implies x \\geq -2$
2.  $2x+7 \\leq -3 \\implies 2x \\leq -10 \\implies x \\leq -5$
Unim els dos intervals trobats.
**Conjunt de solucions:** $A = (-\\infty, -5] \\cup [-2, +\\infty)$. $A$ no és un conjunt fitat. No hi ha suprem ni ínfim.

---

**b)** $|x^2 - 1| \\leq 3$
Ho escrivim en forma contínua: $-3 \\leq x^2 - 1 \\leq 3 \\implies -2 \\leq x^2 \\leq 4$.
L'esquerra ($-2 \\leq x^2$) es compleix sempre per a qualsevol nombre real perquè un quadrat no pot ser negatiu. Ens centrem en la part dreta:
$x^2 \\leq 4 \\implies |x| \\leq 2 \\implies -2 \\leq x \\leq 2$.
**Conjunt de solucions:** $B = [-2, 2]$. $B$ és un conjunt fitat. $\\inf(B) = -2, \\sup(B) = 2$.

---

**c)** $|x-1| > |x+1|$
Com que tots dos costats són **estrictament positius** en ser valors absoluts, podem elevar cadascun al quadrat mantenint la desigualtat immutable:
$$ (x-1)^2 > (x+1)^2 \\implies x^2 - 2x + 1 > x^2 + 2x + 1 \\implies -4x > 0 \\implies x < 0 $$
**Conjunt de solucions:** $C = (-\\infty, 0)$. $C$ és un conjunt fitat superiorment. $\\sup(C) = 0$.

---

**d)** $|x| + |x+1| < 2$
A l'haver dos termes amb valors absoluts s'han d'estudiar per trams definits per les arrels dels mateixos: $x=0$ i $x=-1$.
*   **Tram $x < -1$**: Tots dos són negatius per la qual cosa en desgranar-los canviarem els seus signes i operarem $\\rightarrow (-x) + (-(x+1)) < 2 \\implies -2x - 1 < 2 \\implies -2x < 3 \\implies x > -3/2$. La **intersecció amb el tram actual** ens produeix $(-3/2, -1)$.
*   **Tram $-1 \\leq x < 0$**: Només canvia el signe el primer de l'esquerra doncs el de la dreta pren valors positius en sumar $+1$, on $\\rightarrow (-x) + (x+1) < 2 \\implies 1 < 2$. Com $1 < 2$, sempre és cert. Agafem tot el tram sencer on compleix: $[-1, 0)$.
*   **Tram $x \\geq 0$**: Tots dos positius plens: $(x) + (x+1) < 2 \\implies 2x + 1 < 2 \\implies 2x < 1 \\implies x < 1/2$. La **intersecció amb el tram actual** produeix $[0, 1/2)$.

Unint de forma col·lectiva la consecució i tots els trams viables desxifrem el pas del model:
**Conjunt de solucions:** $D = (-3/2, 1/2)$. $D$ és un conjunt fitat. $\\inf(D) = -3/2, \\sup(D) = 1/2$.`
    },
    {
        id: "M2-T1-Ex3",
        title: "Problema 3: Suprem, Ínfim de subconjunts",
        author: "Apunts",
        type: "notebook",
        code: "",
        statement: `Per a cadascun dels conjunts següents determineu si el conjunt és fitat superiorment, fitat inferiorment, és fitat o no. Trobeu el suprem i l'ínfim, si s'escau.
a) $A = \\{x \\in \\mathbb{R} \\mid x^3 - 4x < 0\\}$;
b) $B = \\{x \\in \\mathbb{R} \\mid \\exists n \\in \\mathbb{N}, x = 2^{-n}\\}$;
c) $C = \\{y \\in \\mathbb{R} \\mid \\exists x \\in \\mathbb{R}, y = 1 + x^2\\}$.`,
        content: `**a)** $A = \\{x \\in \\mathbb{R} \\mid x^3 - 4x < 0\\}$
Trobem les arrels del polinomi traient factor comú per analitzar signes com inequació clàssica: $x(x^2 - 4) < 0 \\implies x(x-2)(x+2) < 0$
*Arrels*: $x = -2, x = 0, x = 2$.
Aquestes divideixen la recta en els intervals: $(-\\infty, -2), (-2, 0), (0, 2), (2, +\\infty)$.
Avaluem el signe en cada tram i agafem on el total dels elements multiplicants sigui negatiu com vol la fórmula $<0$:
*   $x=-3: (-)(-) (-) \\rightarrow - < 0$
*   $x=-1: (-) (-)(+) \\rightarrow + > 0$
*   $x=+1: (+) (-)(+) \\rightarrow - < 0$
*   $x=+3: (+)(+)(+) \\rightarrow + > 0$
**Conjunt de solucions:** $A = (-\\infty, -2) \\cup (0, 2)$. Està **fitat superiorment**. $\\sup(A) = 2$.

---

**b)** $B = \\{x \\in \\mathbb{R} \\mid \\exists n \\in \\mathbb{N}, x = 2^{-n}\\}$
La condició es troba indexada al recorregut infinit d'un número natural (assumim el $1$ com a primer, sense comptar $0$).
Això genera la successió per instàncies seguides: $1/2, 1/4, 1/8, \\dots$ que decreix infinitament i progressiva cap a 0 però mai l'assoleix completament.
Aleshores $B = \\{1/2, 1/4, 1/8, \\dots\\}$.
Està fitat tant inferiorment (ja que mai serà $<0$) com superiorment (on el seu element original serà sempre el límit superior).
És una **successió fitada**. $\\sup(B) = 1/2 \\text{ (és màxim)}, \\inf(B) = 0$.

---

**c)** $C = \\{y \\in \\mathbb{R} \\mid \\exists x \\in \\mathbb{R}, y = 1 + x^2\\}$
Atès que qualsevol número real quadrat fa com a resultat $x^2 \\geq 0$ per a tot $x$ real, puguem inferir directament:
Afegeixint un $+1$ als extrems de les inequacions obtenim analíticament: $x^2 + 1 \\geq 1$, que directament ens porta a definir completament el comportament $\\implies y \\geq 1$.
**Conjunt de solucions:** $C = [1, +\\infty)$.
Està certament **fitat inferiorment**, però no posseeix cota d'abats quan fuig a infinit per definició ascendent doncs no és superiorment en estar subjecte només a valors més grans que 1. $\\inf(C) = 1 \\text{ (no té suprem)}$.`
    },
    {
        id: "M2-T1-Ex12",
        title: "Problema 12: Interseccions i unions de conjunts",
        author: "Apunts",
        type: "notebook",
        code: "",
        statement: `Siguin:
$A = (-3, 9]$
$B = \\mathbb{N}$
$C = (4, +\\infty)$
$D = \\{x \\mid x \\in \\mathbb{Q} \\wedge 0 \\leq x \\leq \\sqrt{2}\\}$

Trobeu, en cas que existeixin, el suprem i l'ínfim dels conjunts $A, B, C, D, A \\cap B, A \\cap C, B \\cap (C \\cup A)$. Digueu si aquests són o no màxim o mínim.`,
        content: `Càlcul per extrems inicials segons els grups proposats de les pròpies variables individuals:

*   **A:** Conjunt semitancat per la dreta. $\\inf(A) = -3$ (no mínim), $\\sup(A) = 9$ (és màxim).
*   **B:** Els naturals, $\\{1, 2, 3, \\dots\\}$. $\\inf(B) = 1$ (és mínim). No té suprem ni màxim per anar cap al infinit seguidament.
*   **C:** Conjunt obert començant del $4$. $\\inf(C) = 4$ (no mínim). No té suprem ni màxim.
*   **D:** Racionals enquadrats, fitat sota desigualtats menors i límits radicals com $\\sqrt{2}$. $\\inf(D) = 0$ (és mínim), $\\sup(D) = \\sqrt{2}$ (no màxim, perquè $\\sqrt{2} \\notin \\mathbb{Q}$).

Ara establim interrelacions d'unió / intersecció segons el que demana l'exercici analitzant la superposició dels valors entre ells.

*   **$A \\cap B$:** Intersecció entre un interval $(-3, 9]$ i els naturals ens dóna els naturals permesos inclosos en les xifres dictades: $\\{1, 2, 3, 4, 5, 6, 7, 8, 9\\}$.
    *   $\\inf = 1$ (mínim)
    *   $\\sup = 9$ (màxim).
*   **$A \\cap C$:** Intersecció de l'àmbit $(-3, 9]$ amb $(4, +\\infty)$ equival a l'espectre solapat donant d'aquesta un resultat en $(4, 9]$.
    *   $\\inf = 4$ (no mínim)
    *   $\\sup = 9$ (màxim).
*   **$B \\cap (C \\cup A)$:** Si ajuntem $C$ (més enllà del $4$) amb $A$ (des del $-3$), l'interval unificat creat adquireix valors solapats de continuïtat general i total $(-3, +\\infty)$. La posterior intersecció amb els Naturals $B = \\mathbb{N}$, que òbviament són ja naturals positius inferits dins, fa que doni per resultant tot $\\mathbb{N}$.
    *   $\\inf = 1$ (mínim)
    *   No té suprem ni màxim.`
    }
];
