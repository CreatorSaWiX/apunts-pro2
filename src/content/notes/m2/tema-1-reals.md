---
title: "Tema 1: Nombres reals"
description: "Valor absoluts, desigualtats i nombres complexos. Propietats bàsiques."
order: 1
readTime: "10 min"
subject: "m2"
---

# Tema 1: Nombres reals

## 1.1 Definició
Imaginem una línia recta infinita. Cada punt d'aquesta línia correspon a un número real. Però, com hem arribat fins aquí?

Primer teníem els **naturals** $\mathbb{N} = \{1, 2, 3, \dots\}$. Després els **enters** $\mathbb{Z} = \{\dots, -2, -1, 0, 1, 2, \dots\}$. Ara ja tenim el zero i els negatius. Arriben els **racionals** $\mathbb{Q}$, són les fraccions $a/b$.

Sembla que ja omplim tota la línia. Els grecs van descobrir que hi ha forats. Per exemple, la diagonal d'un quadrat de costat 1 és $\sqrt{2}$, i aquest número no es pot escriure com una fracció. És un **irracional**. El conjunt dels nombres **reals** $\mathbb{R}$ és la unió de **racionals** i **irracionals**.

Diem que $\mathbb{R}$ és un **cos** perquè té dues operacions (suma i producte) que funcionen molt bé.

| Propietat | Suma i Producte |
| --- | --- |
| **Associativa** | $(a+b)+c = a+(b+c)$ |
| **Commutativa** | $a+b = b+a$ |
| **Element neutre** | $a+0 = a$ i $a \cdot 1 = a$ |
| **Elements inversos** | $a+(-a) = 0$ i $a \cdot a^{-1} = 1$ on $a \neq 0$ |

## 1.2 Ordre i els intervals
A més de sumar i multiplicar, els reals estan ordenats. Donats dos números, o són iguals, o un és més petit que l'altre. Això s'escriu $a < b$.

**Propietats de les desigualtats:**
- Si **sumem** el mateix als dos costats, l'ordre es manté: $a < b \implies a+c < b+c$.
- Si **multipliquem** per un número **positiu**, l'ordre es manté.
- Si **multipliquem** per un número **negatiu** ($c < 0$), la desigualtat es gira: $a < b \implies ac > bc$.

Els **intervals** són els subconjunts més famosos de la recta.

- **Obert $(a,b)$:** Els extrems NO hi són: $\{x \in \mathbb{R} \mid a < x < b\}$.
- **Tancat $[a,b]$:** Els extrems SÍ hi són: $\{x \in \mathbb{R} \mid a \leq x \leq b\}$.
- **Infinits:** $(a, +\infty)$ o $(-\infty, a]$. L'infinit sempre va amb parèntesi obert perquè no és un número.

## 1.3 Valor absolut i distància
Com mesurem la distància entre dos punts? No ens importa si anem de dreta a esquerra o a l'inrevés, la distància ha de ser positiva. Definim el valor absolut $|x|$:
$$
|x| = \begin{cases}
  x  & \text{si } x \geq 0 \\
  -x & \text{si } x < 0
\end{cases}
$$

- Si $x$ és **positiu** o zero, el deixem **igual**.
- Si $x$ és **negatiu**, li **canviem el signe** per fer-lo **positiu**.

**Propietats:**
- **Desigualtat:** Anar directe sempre és més curt o igual que fer escala: $|x+y| \leq |x| + |y|$
- **Entorns:** $|x| < a$ equival a dir que $x$ està atrapat entre $-a$ i $a$: $-a < x < a$.

## 1.4 Fites: Suprem, ínfim, màxim i mínim
Imaginem un conjunt $A$ dins de la recta real:

- **Fita superior (cota superior):** Un número $k$ és fita superior si és més gran o igual que TOTS els elements del conjunt. És com un 'sostre'. Si en té, el conjunt està fitat superiorment.
- **Fita inferior (cota inferior):** Un número $l$ és fita inferior si és més petit o igual que TOTS els elements. És com un 'terra'.

**Suprem ($\sup A$):** És la **menor de les fites superiors**. És el 'sostre' més ajustat al conjunt.
**Màxim ($\max A$):** És un **suprem** que, a més a més, pertany al conjunt $A$.

> Si l'interval és tancat $[a, b]$: El màxim és $b$ i el suprem és $b$.
> Si l'interval és obert $(a, b)$: El suprem és $b$, però no té màxim.

**Exemple:** Considerem l'interval $A = [0, 2)$.
- **Fitat superiorment:** Sí, el 5 és fita, el 100 és fita, el 2 és fita.
- **Suprem:** El 2, perquè qualsevol número més petit que 2 deixaria elements de $A$ fora.
- **Màxim:** No n'hi ha. Perquè el 2 no és dins l'interval (és obert). El 1.9? No, perquè 1.99 és més gran. El 1.99? No... Mai arribem al màxim.

El mateix aplica per a l'**ínfim** ($\inf A$) i el **mínim** ($\min A$) per la part de baix.

**Teorema de l'extrem:** A $\mathbb{R}$, tot conjunt no buit i fitat superiorment sempre té suprem. Aquesta propietat no passa als racionals (on podria haver-hi un forat just on aniria el suprem).

## 1.5 Polinomis
Els polinomis són funcions formades per sumes i productes de $x$. La propietat clau aquí és la factorització. Quan dividim un polinomi $f(x)$ per $(x - a)$, el residu és $f(a)$ (**Teorema del residu**).

Això vol dir que $a$ és una arrel (solució de $f(x) = 0$) si i només si la divisió és exacta. Als reals, qualsevol polinomi es pot descompondre en factors de grau 1 (tipus $x - a$) o de grau 2.