---
title: "Tema 2: Successions"
description: "Definicions i criteris de convergència."
order: 2
readTime: "15 min"
subject: "m2"
---

## 1.1 Definició

Imaginem una llista infinita de números ordenats. Això és, literalment, una successió. Matemàticament, la definim com una aplicació on a cada número natural ($1, 2, 3...$) li assignem un número real. Normalment fem servir la lletra $a$ i un subíndex $n$: $(a_n) = a_1, a_2, a_3, \dots, a_n, \dots$

Hi ha tres maneres principals de definir-les, i les hem de saber identificar:

- **Llista:** Ens donen els primers números i nosaltres deduïm la lògica. Exemple: $2, 4, 6, 8, \dots$ (parells).
- **Terme general:** És una "màquina" on poses la $n$ (posició) i et dona el valor. Exemple: $a_n = \frac{1}{n}$.
Si $n = 1 \rightarrow a_1 = 1$
Si $n = 10 \rightarrow a_{10} = 0.1$
- **Recurrència:** Ens donen el primer terme i una regla per trobar el següent basant-se en l'anterior. Exemple: $a_n = a_{n-1} + a_{n-2}$ (Fibonacci). Necessitem els anteriors per calcular el nou.

## 1.2 Fites

Abans de veure cap a on viatja una successió, hem de saber si està "tancada" o si se'n va cap a l'infinit.

**Cota superior:** Si podem trobar un nombre real $k$ que sigui més gran o igual que tots els termes de la successió ($a_n \leq k$), diem que és una cota superior. De totes les cotes superiors possibles, a la més petita se l'anomena **suprem**.

**Cota inferior:** De la mateixa manera, si un nombre $k$ sempre es queda per sota dels termes ($k \leq a_n$), és una cota inferior. La més gran de les cotes inferiors es diu **ínfim**.

**Successió acotada:** Quan una successió té tant cota superior com cota inferior (té sostre i té terra), diem que està acotada.

## 2.1 Límits d'una successió

Si continuem la llista infinitament, ens apropem a algun número concret? Això és el **límit**:

*   **Convergents:** S'apropen cada cop més a un número finit $l$. Un teorema molt important diu que totes les successions convergents estan acotades. Exemple: $a_n = \frac{1}{n}$. Com més gran és $n$, més a prop de $0$ estem. Diem que el límit és $0$.

::mafs{type="successio_1_n"}

*   **Divergents:** Creixen o decreixen sense parar cap a $\infty$. Exemple: $a_n = n^2 \rightarrow 1, 4, 9, 16\dots$ El límit és $+\infty$.
*   **Oscil·lants:** Ni s'estabilitzen ni van a l'infinit, va saltant. Exemple: $a_n = (-1)^n \rightarrow -1, 1, -1, 1\dots$ No té límit.

::mafs{type="successio_oscilant"}

**El criteri del sandwich:** Aquest és molt útil. Si tenim una successió $a_n$ que sempre està atrapada entre altres dues ($b_n \leq a_n \leq c_n$), i resulta que tant $b_n$ com $c_n$ tenen el mateix límit $l$, llavors $a_n$ per força també tendirà a $l$.

> En cas d'un nombre $a^n$, la progressió geomètrica dependrà de la base:
> *   Si $\alpha > 1$: El terme es fa infinitament gran ($2^{10} = 1024$). Límit = $+\infty$.
> *   Si $\alpha = 1$: Tenim $1^n$, que sempre és 1. Límit = $1$.
> *   Si $-1 < \alpha < 1$: Estem multiplicant fraccions petites ($0.5^{10} = 0.0009$). Límit = $0$.
> *   Si $\alpha \leq -1$: La successió va alternant signes (oscil·la) i creixent en valor absolut o mantenint-se en $1$/$-1$. El límit no existeix.
> 
> Si la variable està a base i l'exponent és constant com $n^\alpha$:
> *   Si $\alpha > 0$: Tenim l'infinit elevat a un nombre positiu. Límit = $+\infty$.
> *   Si $\alpha = 0$: Qualsevol nombre elevat a $0$ és $1$. Límit = $1$.
> *   Si $\alpha < 0$: L'exponent negatiu inverteix la base (seria equivalent a $1/n^{|\alpha|}$). Un nombre dividit per infinit tendeix a zero. Límit = $0$.

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

> **Casos pràctics i exemples representatius**
>
>  Quan et trobes amb la divisió d'arrels o polinomis cal atendre als següents casos: 
> Si tenim $\frac{6n^3 + 4n + 1}{2n}$, és una indeterminació $\frac{\infty}{\infty}$. Com el grau del numerador és 3 i el del denominador 1, guanya la via cap a l'infinit. El límit és $+\infty$.
> Per contra, a $\frac{n^2 - 6n - 2}{3n^2 - 9n}$, els graus són idèntics. Llavors s'avalua la divisió coeficient d'alt contra el del denominador, tenim $\frac{1}{3}$.
> O bé un número com $\sqrt[n]{n}$ dóna $\infty^0$ i usualment sabem que es ressolt con a 1.
> Per arrels com $\left(\sqrt{\frac{n+1}{2n+1}}\right)^{\frac{2n-1}{3n-1}}$, prenem la base que és coeficient en arrel $\sqrt{\frac{1}{2}}$ i exponent que és $\frac{2}{3}$. S'avaluarà $\sqrt[3]{\frac{1}{2}}$.
>  
> Quan hi ha sumatoris massius caldrà sandwich:
>  Analitzant $\frac{1}{\sqrt{n^2 + 1}} + \frac{1}{\sqrt{n^2 + 2}} + \dots + \frac{1}{\sqrt{n^2 + n}}$, construïm cotant a nivell d'arrels:
>  Límit superior $n \cdot \frac{1}{\sqrt{n^2 + 1}}$ i Límit Inferior $n \cdot \frac{1}{\sqrt{n^2 + n}}$. Com tots dos desemboquen de manera de graus igual a $1$, la resposta a successió al mig atrapada del sandwich serà un $1$.
>
> També aplica lo ràpid i lent que hem vist sobre les **jerarquies**: En  $\lim_{n \rightarrow +\infty} \frac{a^n}{n!}$ sent $a=10$, per n grans el factorial de n aixafa exponencial i el fa 0. Tot va determinat sota $\frac{\text{Lent}}{\text{Ràpid}} \rightarrow 0$.
>
> I referent a trigonomètriques, com a $\frac{\cos n}{n^2}$, pel fet que $\cos$ estarà comprès i acotat per valors entre -1 i 1, acaba dividint per quelcom enorme com $n^2$, llavors forçosament s'orienta cap a $0$. I per indeterminació d'exponencials $\frac{2^n + 3^n}{2^n - 3^n}$ agafem qui lidera: A l'elevar amb element predominant trobarem fraccions amb elevats en 0. Sent la resolució final a $-1$. Aquest seria el cas equivalent com les constants $\left(\frac{n+2}{n-3}\right)^{\frac{2n-1}{5}}$ que cal aplicar regla d'Euler com $e^{b_n \cdot (a_n - 1)}$ amb resultat de $e^2$.
> Resta d'arrels es solventa com l'explicat per el conjugat: $(\sqrt{n+1} - \sqrt{n})\sqrt{\frac{n+1}{2}}$, que com a mètode ens du a $\frac{\sqrt{2}}{4}$. I problemes recurrents on posa  ex. $a_{n+1} = ...$ demanen d'escriure la iteració del límit sota relació trobada.