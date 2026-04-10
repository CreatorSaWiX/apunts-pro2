---
title: "Tema 3: Continuïtat"
description: "Teoremes fonamentals de les funcions contínues: Bolzano, Weierstrass i el Valor Intermedi."
order: 3
readTime: "20 min"
subject: "m2"
---

## 1. Funció (Repàs FM)
Pensem en una funció com si fos una màquina: tu hi introdueixes un número (la matèria primera), la màquina fa una operació, i et retorna un altre número (el producte acabat).

Formalment, una funció real de variable real és una aplicació $f: D \to \mathbb{R}$, on $D$ és un subconjunt dels nombres reals denotat com a domini de $f$. L'element $y$ és la imatge de $x$, i la $x$ és l'antiimatge de $y$.

## 2. Límit d'una funció
El límit d'una funció $f$ en un punt $a$ és un nombre real $l$ al qual s'apropen els valors de la funció quan ens apropem a $a$. S'escriu amb $\lim_{x \to a} f(x) = l$.

### Límits laterals
Perquè el límit global existeixi, els dos límits laterals han d'existir i ser iguals:
$$\lim_{x \to a} f(x) = l \iff \lim_{x \to a^+} f(x) = \lim_{x \to a^-} f(x) = l$$

## 3. Continuïtat: dibuixar sense aixecar el llapis
Perquè una funció sigui "contínua" en un punt $a$, s'han de complir tres regles:
1. Ha d'existir el límit: $l = \lim_{x \to a} f(x)$.
2. El punt ha de ser vàlid: $a \in D$.
3. El límit i el valor de la funció han de coincidir: $l = f(a)$.

### Discontinuïtats
- **Evitable:** Existeix el límit, però falla la condició 2 o 3.
- **Essencial:** No existeix el límit (salt infinit o salts laterals diferents).

## 4. Teoremes fonamentals

:::mafs{type="teorema_bolzano"}
:::

### Teorema de Bolzano
Si una funció és contínua en un interval tancat $[a, b]$ i als extrems canvia de signe ($f(a) \cdot f(b) < 0$), llavors existeix almenys un punt $c \in (a, b)$ tal que $f(c) = 0$.

### Teorema de Weierstrass
Tota funció contínua en un interval tancat $[a, b]$ té garantit un punt màxim absolut $M$ i un mínim absolut $m$ dins d'aquest interval.

## 5. Resolució aproximada d'equacions

### Mètode de la bissecció
Es basa en dividir l'interval per la meitat successivament. Si $f(a) \cdot f(b) < 0$, calculem el punt mitjà $c_1 = \frac{a+b}{2}$.
- Si $f(a) \cdot f(c_1) < 0$, l'arrel és a $[a, c_1]$.
- Si $f(c_1) \cdot f(b) < 0$, l'arrel és a $[c_1, b]$.

::videoviz{url="/m2/biseccio.webm" delay="2000"}

### Mètode de la secant
Utilitza una línia recta que uneix $x_0$ i $x_1$ per aproximar el zero:
$$x_{n+1} = x_n - \frac{x_n - x_{n-1}}{f(x_n) - f(x_{n-1})} f(x_n)$$

::videoviz{url="/m2/secant.webm" delay="2000"}

### Mètode de Newton-Raphson
Requereix la derivada de la funció i utilitza la recta tangent:
$$x_{n+1} = x_n - \frac{f(x_n)}{f'(x_n)}$$

::videoviz{url="/m2/tangent.webm" delay="2000"}