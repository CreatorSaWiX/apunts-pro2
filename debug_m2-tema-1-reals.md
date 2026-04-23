---
title: "Solucionari: Tema 1: Nombres reals i complexos"
author: "Apunts"
---

# Solucionari: Tema 1: Nombres reals i complexos

*Valor absoluts, desigualtats i nombres complexos. Propietats bàsiques.*

---

## Problema 1: Desigualtats fraccionàries i polinòmiques

### Enunciat

Resoleu les desigualtats següents:

a) $\frac{x-1}{x+1} < 0 $;  $\quad $ b) $\frac{1}{x+3} > \frac{1}{4}$; $\quad $ c) $\frac{x-1}{x+1} \leq \frac{x+1}{x-1}$; $\quad $ d) $ x^2 + x \leq 0 $; $\quad $ e) $ 1 < x^2 < 4 $.

En cada apartat representeu sobre la recta real el conjunt de solucions i digueu si tal conjunt és fitat superiorment (inferiorment). En cas afirmatiu, trobeu-ne el suprem (ínfim).

### Solució

**a)** $\frac{x-1}{x+1} < 0 $

Per resoldre una inequació, cal estudiar el signe de la fracció.
*   Arrel del numerador: $ x-1=0 \implies x=1 $
*   Arrel del denominador: $ x+1=0 \implies x=-1 $

Les arrels divideixen la recta real en tres intervals: $(-\infty, -1), (-1, 1), (1, +\infty)$. Avaluem el signe agafant un punt de cada interval:
*   $ x=-2: \frac{-3}{-1} = 3 > 0 $
*   $ x=0: \frac{-1}{1} = -1 < 0 $
*   $ x=2: \frac{1}{3} > 0 $

Com que la inequació demana valors estrictament menors que 0, agafem l'interval negatiu.
**Conjunt de solucions:** $ A = (-1, 1)$. $ A $ és un conjunt fitat. $\inf(A) = -1, \sup(A) = 1 $.



**b)** $\frac{1}{x+3} > \frac{1}{4}$

Passem-ho tot a un costat: $\frac{1}{x+3} - \frac{1}{4} > 0 \implies \frac{4 - (x+3)}{4(x+3)} > 0 \implies \frac{1-x}{4(x+3)} > 0 $
*   Arrel del numerador: $ 1-x = 0 \implies x=1 $
*   Arrel del denominador: $ 4(x+3) = 0 \implies x=-3 $

Intervals: $(-\infty, -3), (-3, 1), (1, +\infty)$.
*   $ x=-4: \frac{5}{-4} < 0 $
*   $ x=0: \frac{1}{12} > 0 $
*   $ x=2: \frac{-1}{20} < 0 $

**Conjunt de solucions:** $ B = (-3, 1)$. $ B $ és un conjunt fitat. $\inf(B) = -3, \sup(B) = 1 $.


**c)** $\frac{x-1}{x+1} \leq \frac{x+1}{x-1}$

Igualem a zero:
$$
\frac{x-1}{x+1} - \frac{x+1}{x-1} \leq 0 \implies \frac{(x-1)^2 - (x+1)^2}{(x+1)(x-1)} \leq 0 \implies \frac{-4x}{(x+1)(x-1)} \leq 0 \implies \frac{4x}{(x+1)(x-1)} \geq 0
$$
*   Arrel del numerador: $ 4x=0 \implies x=0 $.
*   Arrels del denominador: $ x+1=0 \implies x=-1 $ i $ x-1=0 \implies x=1 $.

Intervals: $(-\infty, -1), (-1, 0), (0, 1), (1, +\infty)$.
*   $ x=-2: \frac{-8}{3} < 0 $
*   $ x=-0.5: \frac{-2}{-0.75} > 0 $
*   $ x=0.5: \frac{2}{-0.75} < 0 $
*   $ x=2: \frac{8}{3} > 0 $

**Conjunt de solucions:** $ C = (-1, 0] \cup (1, +\infty)$. $ C $ és fitat inferiorment. $\inf(C) = -1 $.


**d)** $ x^2 + x \leq 0 $

Traiem factor comú: $ x(x+1) \leq 0 $. Arrels: $ x=0 $ i $ x=-1 $.
Intervals: $(-\infty, -1), (-1, 0), (0, +\infty)$.
*   $ x=-2: (-2)(-1)=2 > 0 $
*   $ x=-0.5: (-0.5)(0.5)=-0.25 < 0 $
*   $ x=1: (1)(2)=2 > 0 $

**Conjunt de solucions:** $ D = [-1, 0]$. $ D $ és fitat. $\inf(D) = -1, \sup(D) = 0 $.

**e)** $ 1 < x^2 < 4 $

Separem la doble inequació en dues que s'han de complir alhora:
*   $ x^2 > 1 \implies |x| > 1 \implies x \in (-\infty, -1) \cup (1, +\infty)$.
*   $ x^2 < 4 \implies |x| < 2 \implies x \in (-2, 2)$.

Fem la intersecció de les dues solucions: $ D = ((-\infty, -1) \cup (1, +\infty)) \cap (-2, 2)$
**Conjunt de solucions:** $ E = (-2, -1) \cup (1, 2)$. $ E $ és fitat. $\inf(E) = -2, \sup(E) = 2 $.

---

## Problema 2: Desigualtats amb valor absolut

### Enunciat

Trobeu tots els nombres reals $ x $ que satisfan les desigualtats següents:

a) $|2x+7| \geq 3 $; $\quad $ b) $|x^2 - 1| \leq 3 $; $\quad $ c) $|x-1| > |x+1|$; $\quad $ d) $|x| + |x+1| < 2 $.

### Solució

**a)** $|2x+7| \geq 3 $

Desdoblem el valor absolut en dues inequacions (condicions de direcció divergent):
1.  $ 2x+7 \geq 3 \implies 2x \geq -4 \implies x \geq -2 $
2.  $ 2x+7 \leq -3 \implies 2x \leq -10 \implies x \leq -5 $
Unim els dos intervals trobats.
**Conjunt de solucions:** $ A = (-\infty, -5] \cup [-2, +\infty)$. $ A $ no és un conjunt fitat. No hi ha suprem ni ínfim.


**b)** $|x^2 - 1| \leq 3 $

Ho escrivim en forma contínua: $-3 \leq x^2 - 1 \leq 3 \implies -2 \leq x^2 \leq 4 $.
L'esquerra ($-2 \leq x^2 $) es compleix sempre per a qualsevol nombre real perquè un quadrat no pot ser negatiu. Ens centrem en la part dreta:
$ x^2 \leq 4 \implies |x| \leq 2 \implies -2 \leq x \leq 2 $.
**Conjunt de solucions:** $ B = [-2, 2]$. $ B $ és un conjunt fitat. $\inf(B) = -2, \sup(B) = 2 $.


**c)** $|x-1| > |x+1|$

Com que tots dos costats són **estrictament positius** en ser valors absoluts, podem elevar cadascun al quadrat mantenint la desigualtat immutable:
$$
(x-1)^2 > (x+1)^2 \implies x^2 - 2x + 1 > x^2 + 2x + 1 \implies -4x > 0 \implies x < 0
$$
**Conjunt de solucions:** $ C = (-\infty, 0)$. $ C $ és un conjunt fitat superiorment. $\sup(C) = 0 $.


**d)** $|x| + |x+1| < 2 $

A l'haver dos termes amb valors absoluts s'han d'estudiar per trams definits per les arrels dels mateixos: $ x=0 $ i $ x=-1 $.
*   **Tram $ x < -1 $**: Tots dos són negatius per la qual cosa en desgranar-los canviarem els seus signes i operarem $\rightarrow (-x) + (-(x+1)) < 2 \implies -2x - 1 < 2 \implies -2x < 3 \implies x > -3/2 $. La **intersecció amb el tram actual** ens produeix $(-3/2, -1)$.
*   **Tram $-1 \leq x < 0 $**: Només canvia el signe el primer de l'esquerra doncs el de la dreta pren valors positius en sumar $+1 $, on $\rightarrow (-x) + (x+1) < 2 \implies 1 < 2 $. Com $ 1 < 2 $, sempre és cert. Agafem tot el tram sencer on compleix: $[-1, 0)$.
*   **Tram $ x \geq 0 $**: Tots dos positius plens: $(x) + (x+1) < 2 \implies 2x + 1 < 2 \implies 2x < 1 \implies x < 1/2 $. La **intersecció amb el tram actual** produeix $[0, 1/2)$.

Unint de forma col·lectiva la consecució i tots els trams viables desxifrem el pas del model:
**Conjunt de solucions:** $ D = (-3/2, 1/2)$. $ D $ és un conjunt fitat. $\inf(D) = -3/2, \sup(D) = 1/2 $.

---

## Problema 3: Suprem, Ínfim de subconjunts

### Enunciat

Per a cadascun dels conjunts següents determineu si el conjunt és fitat superiorment, fitat inferiorment, és fitat o no. Trobeu el suprem i l'ínfim, si s'escau.

a) $ A = \{x \in \mathbb{R} \mid x^3 - 4x < 0\}$;

b) $ B = \{x \in \mathbb{R} \mid \exists n \in \mathbb{N}, x = 2^{-n}\}$;

c) $ C = \{y \in \mathbb{R} \mid \exists x \in \mathbb{R}, y = 1 + x^2\}$.

### Solució

**a)** $ A = \{x \in \mathbb{R} \mid x^3 - 4x < 0\}$

Trobem les arrels del polinomi traient factor comú per analitzar signes com inequació clàssica: $ x(x^2 - 4) < 0 \implies x(x-2)(x+2) < 0 $
*Arrels*: $ x = -2, x = 0, x = 2 $.
Aquestes divideixen la recta en els intervals: $(-\infty, -2), (-2, 0), (0, 2), (2, +\infty)$.
Avaluem el signe en cada tram i agafem on el total dels elements multiplicants sigui negatiu com vol la fórmula $<0 $:
*   $ x=-3: (-)(-) (-) \rightarrow - < 0 $
*   $ x=-1: (-) (-)(+) \rightarrow + > 0 $
*   $ x=+1: (+) (-)(+) \rightarrow - < 0 $
*   $ x=+3: (+)(+)(+) \rightarrow + > 0 $

**Conjunt de solucions:** $ A = (-\infty, -2) \cup (0, 2)$. Està **fitat superiorment**. $\sup(A) = 2 $.

**b)** $ B = \{x \in \mathbb{R} \mid \exists n \in \mathbb{N}, x = 2^{-n}\}$

La condició es troba indexada al recorregut infinit d'un número natural (assumim el $ 1 $ com a primer, sense comptar $ 0 $).
Això genera la successió per instàncies seguides: $ 1/2, 1/4, 1/8, \dots $ que decreix infinitament i progressiva cap a 0 però mai l'assoleix completament.
Aleshores $ B = \{1/2, 1/4, 1/8, \dots\}$.
Està fitat tant inferiorment (ja que mai serà $<0 $) com superiorment (on el seu element original serà sempre el límit superior).
És una **successió fitada**. $\sup(B) = 1/2 \text{ (és màxim)}, \inf(B) = 0 $.

**c)** $ C = \{y \in \mathbb{R} \mid \exists x \in \mathbb{R}, y = 1 + x^2\}$

Atès que qualsevol número real quadrat fa com a resultat $ x^2 \geq 0 $ per a tot $ x $ real, puguem inferir directament:
Afegint un $+1 $ als extrems de les inequacions obtenim analíticament: $ x^2 + 1 \geq 1 $, que directament ens porta a definir completament el comportament $\implies y \geq 1 $.
**Conjunt de solucions:** $ C = [1, +\infty)$.
Està certament **fitat inferiorment**, però no posseeix cota quan fuig a infinit per definició ascendent doncs no és superiorment en estar subjecte només a valors més grans que 1. $\inf(C) = 1 \text{ (no té suprem)}$.

---

## Problema 4: Desigualtats creuades

### Enunciat

Trobeu tots els nombres reals $ x $ que satisfan cadascuna de les desigualtats següents:
a) $ x^2 > 3x + 4 $; $\quad $ b) $\frac{1}{x} < x $.

En cada apartat representeu sobre la recta real el conjunt de solucions i digueu si tal conjunt és fitat superiorment (inferiorment). En cas afirmatiu, trobeu-ne el suprem (ínfim).

### Solució

**a)** $ x^2 > 3x + 4 $

Passem tots els termes a un costat per obtenir una inequació respecte a 0:
$$
x^2 - 3x - 4 > 0
$$
Trobem les arrels del polinomi associat $ x^2 - 3x - 4 = 0 $ mitjançant la fórmula de l'equació de segon grau:
$$
x = \frac{3 \pm \sqrt{9 - 4(1)(-4)}}{2} = \frac{3 \pm 5}{2} \implies x_1 = 4, x_2 = -1
$$
El polinomi factoritza com $(x-4)(x+1) > 0 $. Com que el coeficient de $ x^2 $ és positiu, la paràbola s'obre cap amunt. Per tant, la funció és estrictament positiva fora de l'interval de les arrels.
**Conjunt de solucions:** $ A = (-\infty, -1) \cup (4, +\infty)$.
El conjunt $ A $ **no és fitat** ni superiorment ni inferiorment.

**b)** $\frac{1}{x} < x $

Passem tot a un costat; no podem multiplicar per $ x $ sense conèixer-ne el signe, així que restem:
$$
\frac{1}{x} - x < 0 \implies \frac{1 - x^2}{x} < 0
$$
Arrels del numerador: $ 1 - x^2 = 0 \implies x = 1, x = -1 $.
Arrel del denominador: $ x = 0 $.
Aquestes arrels divideixen la recta real en quatre intervals: $(-\infty, -1), (-1, 0), (0, 1),$ i $(1, +\infty)$. Avaluem el signe del quocient a cada interval:
*   $ x = -2 $: $\frac{1 - (-2)^2}{-2} = \frac{-3}{-2} = \frac{3}{2} > 0 $
*   $ x = -0.5 $: $\frac{1 - (-0.5)^2}{-0.5} = \frac{0.75}{-0.5} < 0 $  **(Solució)**
*   $ x = 0.5 $: $\frac{1 - 0.5^2}{0.5} = \frac{0.75}{0.5} > 0 $
*   $ x = 2 $: $\frac{1 - 2^2}{2} = \frac{-3}{2} < 0 $  **(Solució)**

**Conjunt de solucions:** $ B = (-1, 0) \cup (1, +\infty)$.
El conjunt $ B $ és **fitat inferiorment** per $-1 $, atès que no hi ha valors menors que $-1 $, sent el seu **ínfim** $\inf(B) = -1 $. No està fitat superiorment.

---

## Problema 5: Polinomis i valors absoluts amb condicions

### Enunciat

Trobeu els nombres reals $ x $ tals que:

a) $ x^3 - 1 \geq 0 $; $\quad $ b) $(x-1)|x^2 - 2| > 0 $; $\quad $ c) $|4x - 5| \leq 13 $.

En cada apartat representeu sobre la recta real el conjunt de solucions i digueu si tal conjunt és fitat superiorment (inferiorment). En cas afirmatiu, trobeu-ne el suprem (ínfim).

### Solució

**a)** $ x^3 - 1 \geq 0 $

Factoritzem utilitzant la identitat $ a^3 - b^3 = (a-b)(a^2+ab+b^2)$:
$$
(x-1)(x^2 + x + 1) \geq 0
$$
Analitzem el factor quadràtic $ x^2 + x + 1 $. El seu discriminant és $\Delta = 1^2 - 4(1)(1) = -3 < 0 $. Com que el coeficient principal és positiu i $\Delta < 0 $, sempre es compleix que $ x^2 + x + 1 > 0 $ per a qualsevol $ x \in \mathbb{R}$.
Per tant, el signe del producte depèn exclusivament de $ x-1 $:
$$
x - 1 \geq 0 \implies x \geq 1
$$
**Conjunt de solucions:** $ C = [1, +\infty)$. És **fitat inferiorment**. L'ínfim (i mínim) és $\inf(C) = 1 $. No està fitat superiorment.

**b)** $(x-1)|x^2 - 2| > 0 $

Tenim el producte d'un terme $ x-1 $ i un valor absolut $|x^2 - 2|$. Sabem per definició que $|x^2 - 2| \geq 0 $ per a tot $ x $.
Atès que volem una desigualtat estricta ($>0 $), el factor de valor absolut no pot ser $ 0 $. Llavors:
1. $|x^2 - 2| > 0 \implies x^2 - 2 \neq 0 \implies x \neq \sqrt{2} \text{ i } x \neq -\sqrt{2}$.
2. Havent garantit que el valor absolut és estrictament positiu, el producte serà positiu només si el primer factor també ho és:
   $$
x - 1 > 0 \implies x > 1
$$
Combinant $ x > 1 $ amb $ x \neq \pm \sqrt{2}$, suprimim la solució singular de la restricció.
**Conjunt de solucions:** $ D = (1, \sqrt{2}) \cup (\sqrt{2}, +\infty)$.
És **fitat inferiorment**. $\inf(D) = 1 $. No està fitat superiorment.

**c)** $|4x - 5| \leq 13 $

Apliquem la propietat del valor absolut per a limitacions menors o iguals, desdoblant-ho:
$$
-13 \leq 4x - 5 \leq 13
$$
Sumem 5 a totes les parts per aïllar gradualment $ x $:
$$
-8 \leq 4x \leq 18
$$
Dividim entre 4:
$$
-2 \leq x \leq \frac{18}{4} \implies -2 \leq x \leq \frac{9}{2}
$$
**Conjunt de solucions:** $ E = \left[-2, \frac{9}{2}\right]$.
El conjunt $ E $ és totalment **fitat**. Té mínim (ínfim) i màxim (suprem): $\inf(E) = -2 $ i $\sup(E) = 9/2 $.

---

## Problema 6: Equacions i inequacions amb múltiples valors absoluts

### Enunciat

Trobeu els nombres reals $ x $ tals que:

a) $|x - 3| = 2 $; $\quad $ b) $|x + 1| < 4 $; $\quad $ c) $|x - 1| + |x + 3| = 4 $; $\quad $ d) $|x + 1| + |x + 2| < 2 $.

En cada apartat representeu sobre la recta real el conjunt de solucions i digueu si tal conjunt té màxim o mínim.

### Solució

**a)** $|x - 3| = 2 $

Això es tradueix en dues equacions lineals a resoldre:
1. $ x - 3 = 2 \implies x = 5 $
2. $ x - 3 = -2 \implies x = 1 $
**Conjunt de solucions:** $ A = \{1, 5\}$. A l'ésser un subconjunt discret fitat conté clarament un **mínim** (1) i un **màxim** (5).

**b)** $|x + 1| < 4 $

Desenvolupem la inequació de menor estricte establint els seus dos límits (negatiu i positiu):
$$
-4 < x + 1 < 4
$$
Restem 1 a tots tres membres per aïllar la variable:
$$
-5 < x < 3
$$
**Conjunt de solucions:** $ B = (-5, 3)$. Donat que l'interval és obert no arriba a assolir els extrems. No té ni màxim ni mínim (té ínfim $-5 $ i suprem $ 3 $).

**c)** $|x - 1| + |x + 3| = 4 $

Les "arrels" dels valors absoluts determinen els canvis de signe: $ x = 1 $ i $ x = -3 $. Dividim l'estudi en tres trams:
1.  **Tram $ x \leq -3 $**: Totes dues expressions interiors són negatives, de manera que en treure valors absoluts els girem el signe:
    $-(x - 1) - (x + 3) = 4 \implies -2x - 2 = 4 \implies -2x = 6 \implies x = -3 $.
    Com $-3 \leq -3 $, és vàlid.
2.  **Tram $-3 < x < 1 $**: El primer factor és negatiu i el segon és positiu:
    $-(x - 1) + (x + 3) = 4 \implies -x + 1 + x + 3 = 4 \implies 4 = 4 $.
    L'aportació d'aquest tram és una igualtat sempre certa. Per tant, l'interval enter $(-3, 1)$ resulta ser una solució.
3.  **Tram $ x \geq 1 $**: Tots dos factors són positius:
    $(x - 1) + (x + 3) = 4 \implies 2x + 2 = 4 \implies 2x = 2 \implies x = 1 $.
    Com $ 1 \geq 1 $, també és vàlid.
**Conjunt de solucions:** Integrant-ho tot: $\{-3\} \cup (-3, 1) \cup \{1\} \implies C = [-3, 1]$.
Aquest conjunt, com que és tancat i és fitat, té **mínim** (-3) i **màxim** (1).

**d)** $|x + 1| + |x + 2| < 2 $

Les arrels on s'anul·len i pivota el signe són $ x = -1 $ i $ x = -2 $.
1.  **Tram $ x \leq -2 $**: Les dues perden el signe originari.
    $-(x+1) - (x+2) < 2 \implies -2x - 3 < 2 \implies -2x < 5 \implies x > -5/2 $.
    *Intersecció amb tram:* $(-5/2, -2]$.
2.  **Tram $-2 < x < -1 $**: El primer menut encara el canvia, mentre que el segon $(x+2)$ ja es fa positiu.
    $-(x+1) + (x+2) < 2 \implies -x - 1 + x + 2 < 2 \implies 1 < 2 $.
    Certeses contínues. *Intersecció:* $(-2, -1)$.
3.  **Tram $ x \geq -1 $**: Tots dos en positius complets.
    $(x+1) + (x+2) < 2 \implies 2x + 3 < 2 \implies 2x < -1 \implies x < -1/2 $.
    *Intersecció:* $[-1, -1/2)$.
Unificant els fragments desxifrats generam la concatenació: $(-5/2, -2] \cup (-2, -1) \cup [-1, -1/2)$.
**Conjunt de solucions:** $ D = (-5/2, -1/2)$. L'interval resultant és estrictament obert. Per tant, no té ni màxim ni mínim (té ínfim $-5/2 $ i suprem $-1/2 $).

---

## Problema 7: Desigualtat triangular sobre polinomis de fraccions

### Enunciat

Proveu que si $|x| \leq 1 $, llavors es té:
$$
\left| x^4 + \frac{1}{2}x^3 + \frac{1}{4}x^2 + \frac{1}{8}x + \frac{1}{16} \right| < 2
$$

### Solució

Per la **desigualtat triangular generalitzada**, definim que el valor absolut d'una suma sempre serà menor o, independentment, com a molt igual que la suma pròpia dels respectius valors absoluts individuals:
$$
\left| x^4 + \frac{1}{2}x^3 + \frac{1}{4}x^2 + \frac{1}{8}x + \frac{1}{16} \right| \leq |x|^4 + \frac{1}{2}|x|^3 + \frac{1}{4}|x|^2 + \frac{1}{8}|x| + \frac{1}{16}
$$

Sabem per l'enunciat que la cota d'avaluació (hipòtesi) ens especifica que el valor més gran de $|x|$ que es pot prendre és $ 1 $. Sustituint aquest màxim incrementem el conjunt per arribar a veure el major escenari extrem possible:
$$
|x|^4 + \frac{1}{2}|x|^3 + \frac{1}{4}|x|^2 + \frac{1}{8}|x| + \frac{1}{16} \leq 1^4 + \frac{1}{2}(1)^3 + \frac{1}{4}(1)^2 + \frac{1}{8}(1) + \frac{1}{16}
$$

Trobem ara el resultat final de la suma establint m.c.m denominador a $ 16 $:
$$
1 + \frac{1}{2} + \frac{1}{4} + \frac{1}{8} + \frac{1}{16} = \frac{16}{16} + \frac{8}{16} + \frac{4}{16} + \frac{2}{16} + \frac{1}{16} = \frac{16 + 8 + 4 + 2 + 1}{16} = \frac{31}{16}
$$

Com podem verificar i validar com a últim pas de deducció de tancament visual: establim que $\frac{31}{16} < \frac{32}{16}$ de sobres sabent naturalment que $\frac{32}{16}$ equival estrictament a $ 2 $.
Garantim així doncs absolutament que l'ordre menor impera:
$$
\left| x^4 + \frac{1}{2}x^3 + \frac{1}{4}x^2 + \frac{1}{8}x + \frac{1}{16} \right| \leq \frac{31}{16} < 2
$$

Queda demostrat.

---

## Problema 8: Simplificació de valors absoluts en funcions definides a trossos

### Enunciat

Escriviu les expressions següents prescindint dels valors absoluts:

a) $|x - 1| - |x|$; $\quad $ b) $||x| - 1|$; $\quad $ c) $|x| - |x^2|$; $\quad $ d) $ x - |x + |x||$.

### Solució

**a)** $|x - 1| - |x|$

Les "arrels" on s'anul·len els interiors absoluts són $ x = 0 $ i $ x = 1 $. Hem de separar el domini real en tres trams:
1.  **Tram $ x \leq 0 $**: Cap factor pren signe en positiu, sent originàriament tots dos negatius pel que al transformar-se ens queda:
    $-(x-1) - (-x) = -x + 1 + x = 1 $
2.  **Tram $ 0 < x < 1 $**: El primer factor segueix deutorament negatiu, mentre l'ultim canvià previ.
    $-(x-1) - (x) = -x + 1 - x = -2x + 1 $
3.  **Tram $ x \geq 1 $**: Ambdós valors romanen plenament positius incondicionals a conseqüència pròpia normal.
    $(x-1) - (x) = -1 $

En resum, la forma d'equivalent fragmentada o en trossos ens porta a la funció mateixa:
$$
f(x) =
\begin{cases}
1 & \text{si } x \leq 0 \\
-2x + 1 & \text{si } 0 < x < 1 \\
-1 & \text{si } x \geq 1
\end{cases}
$$


**b)** $||x| - 1|$

Aquesta expressió requereix analitzar d'una banda l'absolut intern $|x|$, i de l'altra la base global extrajectuada exterior $|\cdots - 1|$.  La funció interior $|x| - 1 $ s'anul·la si $|x| = 1 \implies x = 1, -1 $.  Això determina exactament 4 conjunccions operacionals diferents al llarg de tota la recta segons canvia la presència interna de signe de la interior com de l'exterior:
1.  **Tram $ x \leq -1 $**:
    $|(-x) - 1| = |-x - 1|$. Com $ x \leq -1 \implies -x \geq 1 \implies -x - 1 \geq 0 $. Igual a $-x - 1 $.
2.  **Tram $-1 < x \leq 0 $**:
    $|(-x) - 1| = |-x - 1|$. Com $ x > -1 \implies -x < 1 \implies -x - 1 < 0 $. Gir de signe natural propinat externament: $ x + 1 $.
3.  **Tram $ 0 < x < 1 $**:
    $|(x) - 1| = |x - 1|$. Com $ x < 1 \implies x - 1 < 0 $. Gir total de nou per insuficiència: $-x + 1 $.
4.  **Tram $ x \geq 1 $**:
    $|(x) - 1| = |x - 1|$. Com $ x \geq 1 \implies x - 1 \geq 0 $. Preservar igual naturalesa cap als limits sense restricció $ x - 1 $.

Forma definitiva:
$$
g(x) =
\begin{cases}
-x - 1 & \text{si } x \leq -1 \\
x + 1 & \text{si } -1 < x \leq 0 \\
-x + 1 & \text{si } 0 < x < 1 \\
x - 1 & \text{si } x \geq 1
\end{cases}
$$

**c)** $|x| - |x^2|$

Donat que $ x^2 \geq 0 $ garantit d'ésser preeminent per a qualsevol $ x \in \mathbb{R}$, resulta que el pes global $|x^2|$ és simplement la representació idèntica treient les regles o limitadors físiques de barres limitant $|x^2| = x^2 $. Llavors de l'únic el signe que en depèn per obrar fragmentació d'expressió és la pròpia base arrel referencial $ x $. Per aquest fi es reestableixen dues limitacions de conjunts de fites principals com a condició de pas:
1.  **Tram $ x < 0 $**: Canvi complet seguidament: $-x - x^2 $
2.  **Tram $ x \geq 0 $**: La matèria normal romanent contant que era positiu previ: $ x - x^2 $

Forma definitiva final de resultats globals:
$$
h(x) =
\begin{cases}
-x^2 - x & \text{si } x < 0 \\
-x^2 + x & \text{si } x \geq 0
\end{cases}
$$


**d)** $ x - |x + |x||$

Resolem fixament depenent del signe de l'absolut estrictament localitzat a l'arrel original, limitant la bifurcació als paràmetres centrals.
1.  **Tram $ x \leq 0 $**: Sabent el seu contingut i naturalesa l'igual equival general cap a negatiu i dóna $|x| = -x $. Aleshores l'expressió queda reemplaçant interior $ x - |x - x| = x - |0| = x - 0 = x $.
2.  **Tram $ x > 0 $**: D'igual pes contrari equivaldria a dir de forma literal el pas oposat on la igualtat roman on la premissa originaria estableix $|x| = x $. Aleshores partint i reemplaçant el costat, l'expressió queda com a resultats complets integrants de la solució interior de tal manera representativa general iterativa progressant successiu de la suma de valors: $ x - |x + x| = x - |2x|$. Com que ens definim a aquest tram només considerant elements positius, sent base de regles estrictament on constant $ x > 0 $, l'interior es predetermina natural de signe que farà $|2x|$ sempre i obligatòriament ésser positiu unívoc per endavant. Llevant les barres ens farà només acabar operant $ x - 2x = -x $.

Forma definitiva, adonant-nos ademés que la conversió final equivalent correspon de model directriu simètric natural equivalent al propi canvi del valor absolut amb factor invertit propinat inicial generant simetria inversa:
$$
k(x) =
\begin{cases}
x & \text{si } x \leq 0 \\
-x & \text{si } x > 0
\end{cases}
\implies k(x) = -|x|
$$

---

## Problema 9: Desigualtat Triangular Generalitzada amb sumatoris oposats

### Enunciat

Demostreu que per a tot $ x \in \mathbb{R}$ es compleix $|x - 1| + |x - 2| \geq 1 $.
En quin cas aquesta desigualtat és una igualtat?

### Solució

Per la desigualtat triangular $|a| + |b| \geq |a + b|$ i sabent que $|x - 2| = |2 - x|$:
$$
|x-1| + |x-2| = |x-1| + |2-x| \geq |(x-1) + (2-x)| = |1| = 1
$$

La igualtat $|a| + |b| = |a + b|$ es compleix si $ a $ i $ b $ tenen el mateix signe ($ a \cdot b \geq 0 $):
$$
(x-1)(2-x) \geq 0 \implies x \in [1, 2]
$$

---

## Problema 10: Inequacions compostes de paràmetres de polinomis i extrems absoluts

### Enunciat

Trobeu els nombres reals $ x $ tals que:
a) $|x - 1||x + 2| = 3 $;
b) $\frac{1}{4} \leq |x^2 - 5x + 6| \leq 3 $.

En cada apartat representeu sobre la recta real el conjunt de solucions i digueu si tal conjunt té màxim o mínim.

### Solució

**a)** $|x^2 + x - 2| = 3 $:
1. $ x^2 + x - 2 = 3 \implies x^2 + x - 5 = 0 \implies x = \frac{-1 \pm \sqrt{21}}{2}$
2. $ x^2 + x - 2 = -3 \implies x^2 + x + 1 = 0 \implies \Delta < 0 \implies \nexists x \in \mathbb{R}$

$ A = \left\{ \frac{-1-\sqrt{21}}{2}, \frac{-1+\sqrt{21}}{2} \right\}$. $\quad $ Mínim: $\frac{-1-\sqrt{21}}{2}$, Màxim: $\frac{-1+\sqrt{21}}{2}$.

**b)** $\frac{1}{4} \leq |x^2 - 5x + 6| \leq 3 $:
- $|x^2 - 5x + 6| \leq 3 \implies x^2 - 5x + 6 \in [-3, 3] \implies x \in \left[ \frac{5-\sqrt{13}}{2}, \frac{5+\sqrt{13}}{2} \right]$
- $|x^2 - 5x + 6| \geq \frac{1}{4} \implies x \in (-\infty, \frac{5-\sqrt{2}}{2}] \cup \{ \frac{5}{2} \} \cup [ \frac{5+\sqrt{2}}{2}, \infty)$

$ B = \left[ \frac{5-\sqrt{13}}{2}, \frac{5-\sqrt{2}}{2} \right] \cup \{ \frac{5}{2} \} \cup \left[ \frac{5+\sqrt{2}}{2}, \frac{5+\sqrt{13}}{2} \right]$. $\quad $ Mínim: $\frac{5-\sqrt{13}}{2}$, Màxim: $\frac{5+\sqrt{13}}{2}$.

---

## Problema 11: Inequacions diverses de grau superior i quocients creuats

### Enunciat

Resoleu les inequacions següents:

a) $\left|\frac{2x - 2}{x + 4}\right| < 1 $; $\quad $ b) $\left|\frac{x}{x - 2}\right| > 10 $; $\quad $ c) $|3x - 5| - |2x + 3| > 0 $;  

d) $|2 - x^2| < 1 $; $\quad $ e) $ x^2 < |2x + 8|$; $\quad $ f) $|x^2 - 5x| > |x^2| - |5x|$.

### Solució

**a)** $| \frac{2x-2}{x+4} | < 1 \implies \frac{2x-2}{x+4} \in (-1, 1) \implies x \in (-2/3, 6)$.

**b)** $| \frac{x}{x-2} | > 10 \implies \frac{x}{x-2} \in (-\infty, -10) \cup (10, \infty) \implies x \in (20/11, 2) \cup (2, 20/9)$.

**c)** $|3x-5| > |2x+3| \implies (3x-5)^2 > (2x+3)^2 \implies 5x^2 - 42x + 16 > 0 \implies x \in (-\infty, 2/5) \cup (8, \infty)$.

**d)** $|2-x^2| < 1 \implies 1 < x^2 < 3 \implies x \in (-\sqrt{3}, -1) \cup (1, \sqrt{3})$.

**e)** $ x^2 < |2x+8| \implies x^2-2x-8 < 0 \implies (x-4)(x+2) < 0 \implies x \in (-2, 4)$.

**f)** $|x^2-5x| > |x^2|-|5x| \iff |x| \cdot |x-5| > |x|^2 - 5|x| \implies x \in (-\infty, 0) \cup (0, 5).$

---

## Problema 12: Interseccions i unions de conjunts

### Enunciat

Siguin:
$ A = (-3, 9]$
$ B = \mathbb{N}$
$ C = (4, +\infty)$
$ D = \{x \mid x \in \mathbb{Q} \wedge 0 \leq x \leq \sqrt{2}\}$

Trobeu, en cas que existeixin, el suprem i l'ínfim dels conjunts $ A, B, C, D, A \cap B, A \cap C, B \cap (C \cup A)$. Digueu si aquests són o no màxim o mínim.

### Solució

Càlcul per extrems inicials segons els grups proposats de les pròpies variables individuals:

*   **A:** Conjunt semitancat per la dreta. $\inf(A) = -3 $ (no mínim), $\sup(A) = 9 $ (és màxim).
*   **B:** Els naturals, $\{1, 2, 3, \dots\}$. $\inf(B) = 1 $ (és mínim). No té suprem ni màxim per anar cap al infinit seguidament.
*   **C:** Conjunt obert començant del $ 4 $. $\inf(C) = 4 $ (no mínim). No té suprem ni màxim.
*   **D:** Racionals enquadrats, fitat sota desigualtats menors i límits radicals com $\sqrt{2}$. $\inf(D) = 0 $ (és mínim), $\sup(D) = \sqrt{2}$ (no màxim, perquè $\sqrt{2} \notin \mathbb{Q}$).

Ara establim interrelacions d'unió / intersecció segons el que demana l'exercici analitzant la superposició dels valors entre ells.

*   **$ A \cap B $:** Intersecció entre un interval $(-3, 9]$ i els naturals ens dóna els naturals permesos inclosos en les xifres dictades: $\{1, 2, 3, 4, 5, 6, 7, 8, 9\}$.
    *   $\inf = 1 $ (mínim)
    *   $\sup = 9 $ (màxim).
*   **$ A \cap C $:** Intersecció de l'àmbit $(-3, 9]$ amb $(4, +\infty)$ equival a l'espectre solapat donant d'aquesta un resultat en $(4, 9]$.
    *   $\inf = 4 $ (no mínim)
    *   $\sup = 9 $ (màxim).
*   **$ B \cap (C \cup A)$:** Si ajuntem $ C $ (més enllà del $ 4 $) amb $ A $ (des del $-3 $), l'interval unificat creat adquireix valors solapats de continuïtat general i total $(-3, +\infty)$. La posterior intersecció amb els Naturals $ B = \mathbb{N}$, que òbviament són ja naturals positius inferits dins, fa que doni per resultant tot $\mathbb{N}$.
    *   $\inf = 1 $ (mínim)
    *   No té suprem ni màxim.

---

