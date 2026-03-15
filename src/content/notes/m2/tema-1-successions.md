---
title: "Tema 1: Successions numèriques"
description: "Definicions i criteris de convergència."
order: 1
readTime: "15 min"
subject: "m2"
---

# Tema 1: Successions

## 1.1 Definició

Imaginem una llista infinita de números ordenats. Això és, literalment, una successió. Matemàticament, la definim com una aplicació on a cada número natural ($1, 2, 3...$) li assignem un número real. Normalment fem servir la lletra $a$ i un subíndex $n$: $(a_n) = a_1, a_2, a_3, \dots, a_n, \dots$

Hi ha tres maneres principals de definir-les, i les hem de saber identificar:

**Llista:** Ens donen els primers números i nosaltres deduïm la lògica. Exemple: $2, 4, 6, 8, \dots$ (parells).

**Terme general:** És una "màquina" on poses la $n$ (posició) i et dona el valor. Exemple: $a_n = \frac{1}{n}$.
Si $n = 1 \rightarrow a_1 = 1$
Si $n = 10 \rightarrow a_{10} = 0.1$

**Recurrència:** Ens donen el primer terme i una regla per trobar el següent basant-se en l'anterior. Exemple: $a_n = a_{n-1} + a_{n-2}$ (Fibonacci). Necessitem els anteriors per calcular el nou.

## 1.2 Fites

Abans de veure cap a on viatja una successió, hem de saber si està "tancada" o si se'n va cap a l'infinit.

**Cota superior:** Si podem trobar un nombre real $k$ que sigui més gran o igual que tots els termes de la successió ($a_n \leq k$), diem que és una cota superior. De totes les cotes superiors possibles, a la més petita se l'anomena **suprem**.

**Cota inferior:** De la mateixa manera, si un nombre $k$ sempre es queda per sota dels termes ($k \leq a_n$), és una cota inferior. La més gran de les cotes inferiors es diu **ínfim**.

**Successió acotada:** Quan una successió té tant cota superior com cota inferior (té sostre i té terra), diem que està acotada.

## 2.1 Límits d'una successió

Si continuem la llista infinitament, ens apropem a algun número concret? Això és el **límit**:

*   **Convergents:** S'apropen cada cop més a un número finit $l$. Un teorema molt important diu que totes les successions convergents estan acotades. Exemple: $a_n = \frac{1}{n}$. Com més gran és $n$, més a prop de $0$ estem. Diem que el límit és $0$.
*   **Divergents:** Creixen o decreixen sense parar cap a $\infty$. Exemple: $a_n = n^2 \rightarrow 1, 4, 9, 16\dots$ El límit és $+\infty$.
*   **Oscil·lants:** Ni s'estabilitzen ni van a l'infinit, va saltant. Exemple: $a_n = (-1)^n \rightarrow -1, 1, -1, 1\dots$ No té límit.

**El criteri del sandwich:** Aquest és molt útil. Si tenim una successió $a_n$ que sempre està atrapada entre altres dues ($b_n \leq a_n \leq c_n$), i resulta que tant $b_n$ com $c_n$ tenen el mateix límit $l$, llavors $a_n$ per força també tendirà a $l$.

:::exercise
**Calculeu el límit de les successions de terme general $a^n$ i $n^\alpha$, on $\alpha \in \mathbb{R}$.**

**a) $a^n$:**

Això és una progressió geomètrica. El seu comportament a l'infinit depèn de la base $\alpha$:
*   Si $\alpha > 1$: El terme es fa infinitament gran ($2^{10} = 1024$). Límit = $+\infty$.
*   Si $\alpha = 1$: Tenim $1^n$, que sempre és 1. Límit = $1$.
*   Si $-1 < \alpha < 1$: Estem multiplicant fraccions petites ($0.5^{10} = 0.0009$). Límit = $0$.
*   Si $\alpha \leq -1$: La successió va alternant signes (oscil·la) i creixent en valor absolut o mantenint-se en $1$/$-1$. El límit no existeix.

**a) $n^\alpha$:**

Aquí la base creix i l'exponent és fix.
*   Si $\alpha > 0$: Tenim l'infinit elevat a un nombre positiu. Límit = $+\infty$.
*   Si $\alpha = 0$: Qualsevol nombre elevat a $0$ és $1$. Límit = $1$.
*   Si $\alpha < 0$: L'exponent negatiu inverteix la base (seria equivalent a $1/n^{|\alpha|}$). Un nombre dividit per infinit tendeix a zero. Límit = $0$.
:::

## 2.2 Àlgebra de límits i indeterminacions

Quan sumem, multipliquem o dividim successions, els seus límits es comporten de manera bastant previsible si són nombres finits. Si $\lim a_n = a$ i $\lim b_n = b$, llavors la suma dels límits és $a \pm b$, i el producte és $a \cdot b$.

Però, què passa si entra en joc l'infinit?
*   Sumar un nombre a l'infinit no el canvia: $(+\infty) + l = +\infty$.
*   Multiplicar infinits dóna infinit: $(+\infty)(+\infty) = +\infty$.

Ara bé, hi ha "xocs d'infinits" on la resposta no és evident anomenades **indeterminacions**. Hem de vigilar especialment amb aquests casos:

$$
\frac{\infty}{\infty} \quad \quad \frac{0}{0} \quad \quad \infty - \infty \quad \quad 1^\infty, 0^0, i\ \infty^0
$$

Pels polinomis: si tenim $\frac{\infty}{\infty}$ format per polinomis $\frac{P(n)}{Q(n)}$, fixem-en els graus.
Si el grau del numerador és més gran, el límit és infinit. Si el del denominador és més gran, el límit és 0. Si són iguals, és la divisió dels seus coeficients principals.

### A. Jerarquia d'infinits

Quan tenim una divisió de $\frac{\infty}{\infty}$, guanya el que creix més ràpid: $n! \gg a^n\ (a > 1) \gg n^p \gg \ln(n)$.

$$
\text{Si dividim } \frac{\text{Ràpid}}{\text{Lent}} \rightarrow \infty. \quad \text{Si dividim } \frac{\text{Lent}}{\text{Ràpid}} \rightarrow 0.
$$

*   **Factorial** ($n!$): El més ràpid de tots.
*   **Exponencial** ($a^n$): Molt ràpid ($2^n$, $e^n$).
*   **Polinomi** ($n^3$, $n^{100}$): Ràpid, però perd contra els anteriors.
*   **Logaritme** ($\ln(n)$): El més lent.

### B. El número e i $1^\infty$

Una successió és **creixent** si cada terme és més gran o igual que l'anterior ($a_m \leq a_n$ quan $m < n$). És **decreixent** si passa el contrari. Les successions que són creixents o decreixents s'anomenen genèricament **monòtones**.

**Per teorema de la convergència monòtona**, tota successió monòtona i acotada és obligatòriament convergent. El millor exemple d'això és la successió $a_n = \left(1 + \frac{1}{n}\right)^n$.

És estrictament creixent i que està atrapada entre el $2$ i el $3$. Com que creix però té un sostre, xoca contra un límit. Aquest límit és el famosíssim **número d'Euler**, denotat per $e$ ($2,71828183$). Aquest descobriment és clau per resoldre les indeterminacions del tipus $1^\infty$.

### C. Criteris de l'arrel i del quocient

Finalment, com calculem límits més estranys si no tenim ni polinomis ni sumes senzilles? Tenim dues grans eines de diagnòstic:

1.  **Criteri de l'arrel:** Calculem el límit de l'arrel n-èsima del valor absolut del terme: $\lim_n \sqrt[n]{|a_n|} = L$.
    *   Si $L < 1$, el límit original de $a_n$ és $0$.
    *   Si $L > 1$, la successió s'escapa cap a infinit ($\lim_n |a_n| = +\infty$).

2.  **Criteri del quocient:** Si no ens agraden les arrels, podem agafar un terme i dividir-lo per l'anterior: $\lim_n \frac{|a_n|}{|a_{n-1}|} = L$. Els resultats funcionen exactament igual: si dóna menor a 1 convergeix a 0, i si és major a 1 divergeix.

El **criteri arrel-quocient** ens avisa que si el criteri del quocient dóna un resultat $L$, el de l'arrel donarà exactament el mateix $L$. Tanmateix, heu d'anar amb compte: podria donar-se el cas que el límit de l'arrel existeixi però el del quocient no es pugui calcular.

### D. Criteri del sandwich

Imaginem una successió complicada atrapada entre dues de fàcils. Si la 'petita' i la 'gran' van al mateix lloc, la del mig també. Això és vital per a sumes d'arrels com aquesta:

$$
b_n = \frac{1}{\sqrt{n^2 + 1}} + \dots + \frac{1}{\sqrt{n^2 + n}}
$$

1.  Identifiquem el terme més petit $\frac{1}{\sqrt{n^2 + n}}$ i el més gran $\frac{1}{\sqrt{n^2 + 1}}$.
2.  Acotem substituint tots els sumands pel petit i tots pel gran: $n \cdot \frac{1}{\sqrt{n^2 + n}} \leq b_n \leq n \cdot \frac{1}{\sqrt{n^2 + 1}}$.
3.  Com que els extrems tendeixen a $1$, llavors $\lim b_n = 1$.

:::exercise
**Calculeu el límit de diverses successions donades**

**a)** $\frac{6n^3 + 4n + 1}{2n}$

Tenim una indeterminació de l'estil $\frac{\infty}{\infty}$.

Ens fixem en els graus: el numerador té grau 3 i el denominador grau 1. Com que el grau de dalt és superior, la successió s'escapa cap a l'infinit. Límit = $+\infty$.

**b)** $\frac{n^2 - 6n - 2}{3n^2 - 9n}$

Grau del numerador = 2; Grau del denominador = 2. Són iguals. El límit és directament el quocient dels coeficients principals: $\frac{1}{3}$.

**c)** $\sqrt[n]{n}$

Aquest és un límit clàssic que dóna una indeterminació $\infty^0$. Es pot resoldre teòricament aplicant logaritmes o usant el criteri de l'arrel, però és un resultat conegut d'anàlisi que val 1.

**d)** $\left(\sqrt{\frac{n+1}{2n+1}}\right)^{\frac{2n-1}{3n-1}}$

Avaluem primer la base: dins de l'arrel, tenim el mateix grau (1) a dalt i a baix. El coeficient és $\frac{1}{2}$. Per tant, la base tendeix a $\sqrt{\frac{1}{2}}$. Avaluem l'exponent: Mateix grau dalt i baix, coeficients 2 i 3. Tendeix a $\frac{2}{3}$.

$$ \left(\sqrt{\frac{1}{2}}\right)^{\frac{2}{3}} = ((\frac{1}{2})^{\frac{1}{2}})^{\frac{2}{3}} = (\frac{1}{2})^{\frac{1}{3}} = \sqrt[3]{\frac{1}{2}} $$
:::

:::exercise
**Troba el límit de $b_n = \frac{1}{\sqrt{n^2 + 1}} + \frac{1}{\sqrt{n^2 + 2}} + \dots + \frac{1}{\sqrt{n^2 + n}}$**

Això és un sumatori de $n$ fraccions. No podem simplement sumar els límits perquè el nombre de termes creix amb $n$. Hem de construir amb **criteri de sandvitx**:

**Cota inferior (el més petit):** Substituïm cada terme per la fracció més petita possible del sumatori (la que té el denominador més gran, és a dir, l'última). Si tenim $n$ vegades aquesta fracció menor, tenim: $n \cdot \frac{1}{\sqrt{n^2 + n}}$.

**Cota superior (el més gran):** Substituïm cada terme per la fracció més gran possible (la del denominador més petit, és a dir, la primera). Tenim: $n \cdot \frac{1}{\sqrt{n^2 + 1}}$.

Ara calculem el límit dels extrems:
**Límit inferior:** $\lim \frac{n}{\sqrt{n^2+n}} = \frac{n}{n} = 1$.
**Límit superior:** $\lim \frac{n}{\sqrt{n^2+1}} = \frac{n}{n} = 1$.

Com que totes dues fites convergeixen a 1, la nostra successió atrapada al mig també té com a límit 1.
:::

:::exercise
**a) $\lim_{n \rightarrow +\infty} \frac{a^n}{n!}$ amb $|a| > 1$**

A dalt tenim una exponencial (creix ràpid) i a baix un factorial (creix moltíssim més ràpid).
Recordem que: $\frac{\text{Lent}}{\text{Ràpid}} \rightarrow 0$.

Provem amb números: Posem una base $a = 10$. Si $n = 5$, a dalt tenim $10^5 = 100.000$. A baix tenim $5! = 5 \cdot 4 \cdot 3 \cdot 2 \cdot 1 = 120$. Sembla que guanya el de dalt. Però si $n = 20$, a baix tenim $20!$. Això és $20 \cdot 19 \cdot 18\dots$ Fins i tot la calculadora dona error de tan gran que és. El factorial sempre acaba destrossant a qualsevol potència.

Com que el de baix es fa absurdament més gran que el de dalt, la fracció tendeix a 0.

**b) $\lim_{n \rightarrow +\infty} \frac{n^\alpha}{a^n}$ amb $|a| > 1$**

Es veu a ull, però provem amb números. Posem $a = 2$ i un exponent com $\alpha = 3$. Tenim $\frac{n^3}{2^n}$.
*   Si $n = 10$: A dalt $10^3 = 1000$. A baix $2^{10} = 1024$. Estan empatats (aprox 1).
*   Si $n = 20$: A dalt $20^3 = 8000$. A baix $2^{20} = 1.048.576$. ($0,007$).

$\frac{\text{Lent}}{\text{Ràpid}} \rightarrow 0$. Per tant, el límit també és 0.
:::

:::exercise
**Calculeu el límit de les successions de terme general següents:**

**a)** $\frac{\cos n}{n^2}$

Pensem-hi un moment: el cosinus sempre oscil·la entre -1 i 1, per tant és una successió acotada. A sota tenim $n^2$, que creix cap a l'infinit, així que $\frac{1}{n^2}$ o $-\frac{1}{n^2}$ tendeix a 0.

**b)** $\frac{2^n + 3^n}{2^n - 3^n}$

Això ens dóna una indeterminació de l'estil $\frac{\infty}{\infty}$.
El truc aquí és dividir el numerador i el denominador pel terme que domina, és a dir, pel que creix més ràpid: $3^n$. Al dividir-ho tot per $3^n$, ens queda: $\frac{(2/3)^n + 1}{(2/3)^n - 1}$. Com que $\frac{2}{3}$ és més petit que 1, en elevar-lo a infinit tendeix a 0.

Aleshores el límit és $\frac{0 + 1}{0 - 1} = -1$.

**c)** $\left(\frac{n+2}{n-3}\right)^{\frac{2n-1}{5}}$

La base tendeix a 1 (mateix grau dalt i baix) i l'exponent a infinit. És una indeterminació de tipus $1^\infty$. Hem d'utilitzar la fórmula de l'exponencial: $\lim a_n^{b_n} = e^{\lim b_n \cdot (a_n - 1)}$.

$$ \frac{2n-1}{5} \cdot \left(\frac{n+2}{n-3} - 1\right) = \frac{2n-1}{5} \cdot \left(\frac{5}{n-3}\right) = \frac{2n-1}{n-3} $$

El límit d'això darrer (mateix grau dalt i baix) és la divisió dels coeficients principals: $2$. Per tant, ajuntant-ho, el límit final és $e^2$.
:::

:::exercise
**Calculeu el límit de les successions de terme general $(\sqrt{n+1} - \sqrt{n})\sqrt{\frac{n+1}{2}}$**

Tenim una resta d'arrels (indeterminació $\infty - \infty$). El truc sempre és multiplicar i dividir per la suma de les arrels (el conjugat).

Això transforma el parèntesi en: $\frac{(n+1)-n}{\sqrt{n+1}+\sqrt{n}} = \frac{1}{\sqrt{n+1}+\sqrt{n}}$

Multiplicant pel segon terme tenim: $\frac{\sqrt{n+1}}{\sqrt{2}(\sqrt{n+1}+\sqrt{n})}$

Dividint-ho tot pel "terme dominant" $\sqrt{n}$, ens quedarà $\frac{1}{\sqrt{2}(1+1)}$, que és $\frac{1}{2\sqrt{2}}$.

Racionalitzant (multiplicant dalt i baix per $\sqrt{2}$), obtenim $\frac{\sqrt{2}}{4}$.
:::

:::exercise
**Sigui $(a_n)_{n \geq 1}$ una successió tal que $a_1 = -2/3$ i $3a_{n+1} = 2 + a_n^3$ si $n \geq 1$.**

**a) Proveu que $-2 \leq a_n \leq 1$ per a tot $n \geq 1$.**

Ho demostrem per inducció.
**Pas base:** Per $n = 1$, $a_1 = -2/3$. Es compleix $-2 \leq -2/3 \leq 1$.
**Pas inductiu:** Suposem cert per a $n$, és a dir $-2 \leq a_n \leq 1$, i volem veure que $-2 \leq a_{n+1} \leq 1$.

$$ 3a_{n+1} = 2 + a_n^3 \implies a_{n+1} = \frac{2 + a_n^3}{3} $$
$$ -2 \leq a_n \leq 1 \implies (-2)^3 \leq a_n^3 \leq 1^3 \implies -8 \leq a_n^3 \leq 1 \implies $$
$$ -6 \leq 2 + a_n^3 \leq 3 \implies (\text{H.I}) -2 \leq \frac{2 + a_n^3}{3} \leq 1 \implies -2 \leq a_{n+1} \leq 1 $$
$Q.E.D.$

**b) Proveu que $(a_n)$ és creixent**

Volem veure que $a_{n+1} - a_n \geq 0$. $a_{n+1} - a_n = \frac{2+a_n^3}{3} - a_n = \frac{a_n^3-3a_n+2}{3}$.

Hem d'estudiar el signe del polinomi $P(x) = x^3 - 3x + 2$. Busquem arrels (Ruffini amb $x=1$): $x^3 - 3x + 2 = (x-1)(x^2 + x - 2) = (x-1)(x-1)(x+2) = (x-1)^2(x+2)$

Per tant: $a_{n+1} - a_n = \frac{(a_n-1)^2(a_n+2)}{3}$

Sabem per l'apartat a) que $a_n \in [-2, 1]$.
*   $(a_n-1)^2 \geq 0$ (sempre positiu o zero).
*   $a_n \geq -2 \implies a_n + 2 \geq 0$.

Per tant, el producte és $\geq 0$, així que $a_{n+1} \geq a_n$. La successió és creixent.
$Q.E.D.$

**c) Proveu que $(a_n)_{n \geq 1}$ és convergent i calculeu el seu límit.**

Com que la successió és monòtona (creixent) i fitada (superiorment per 1), pel **Teorema de la Convergència Monòtona**, la successió és convergent.

Sigui $l = \lim_{n\rightarrow\infty} a_n$. Aplicant límits a la recurrència $a_{n+1} = \frac{2 + a_n^3}{3}$:
$$ l = \frac{2 + l^3}{3} \iff 3l = 2 + l^3 \iff l^3 - 3l + 2 = 0 $$
Com hem vist abans, això factoritza com: $(l-1)^2(l+2) = 0 \implies l = 1 \vee l = -2$. Com que la successió és creixent i comença en $a_1 = -2/3$, el límit no pot ser -2. Per tant, $l = 1$.
$Q.E.D.$
:::

:::exercise
** $\lim_{n \rightarrow +\infty} \frac{2^n \cdot 3^n + 5^{n+1}}{(2^n + 1)(3^{n-1} - 1)}$ **

Simplifiquem els termes dominants.

**Numerador:** $2^n \cdot 3^n = 6^n$. El terme $5^{n+1}$ és negligible davant de $6^n$.
**Denominador:** $(2^n + 1)(3^{n-1} - 1) \sim 2^n \cdot 3^{n-1} = 2^n \cdot \frac{3^n}{3} = \frac{6^n}{3}$.

$$ \lim_{n\rightarrow\infty} \frac{6^n + 5 \cdot 5^n}{(2^n+1)(\frac{1}{3}3^n-1)} = \lim_{n\rightarrow\infty} \frac{1 + 5(5/6)^n}{(1 + 1/2^n)(\frac{1}{3} - 1/3^n)} $$

Com que $(5/6)^n \rightarrow 0$, $(1/2)^n \rightarrow 0$, etc: $= \frac{1 + 0}{1 \cdot \frac{1}{3}} = 3$
:::

:::exercise
**Calculeu $a$ i $b$ tals que $\lim_{n \rightarrow +\infty} (\frac{1-an^2}{3n^2-2})^{1-bn^2} = \sqrt{e}$.**

El límit és $\sqrt{e} = e^{1/2}$. Perquè un límit de tipus potencial-exponencial doni un nombre diferent de 0, 1 o infinit, normalment prové d'una indeterminació $1^\infty$. La base ha de tendir a 1.

$$ \lim_{n\rightarrow\infty} \frac{1-an^2}{3n^2-2} = \frac{-a}{3} = 1 \implies a = -3. \text{ Ara la base és } \frac{1+3n^2}{3n^2-2}. $$

Usem la fórmula $e^L$ amb $L = \text{lim}(\text{base} - 1) \cdot \text{exp}$:

$$ \text{Base} - 1 = \frac{1+3n^2}{3n^2-2} - 1 = \frac{1+3n^2 - (3n^2-2)}{3n^2-2} = \frac{3}{3n^2-2} $$

$$ L = \lim_{n\rightarrow\infty} \frac{3}{3n^2-2} \cdot (1-bn^2) = \lim_{n\rightarrow\infty} \frac{3-3bn^2}{3n^2-2} = \frac{-3b}{3} = -b $$

Sabem que el límit és $\sqrt{e} = e^{1/2}$. $-b = \frac{1}{2} \implies b = -\frac{1}{2}$.
:::
