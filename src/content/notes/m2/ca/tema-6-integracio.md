---
title: "Tema 6: Integració"
description: "Teorema fonamental del càlcul, integració numèrica (Trapezis i Simpson), integral de Riemann i repàs de càlcul de primitives."
order: 6
readTime: "30 min"
subject: "m2"
draft: false
isNew: true
---

L'objectiu principal d'aquest tema és estudiar l'àrea sota la corba d'una funció mitjançant diferents mètodes analítics i numèrics, i relacionar la integració amb la derivació.

## 1. El teorema fonamental del càlcul (TFC)

**Teorema fonamental del càlcul**: Sigui $f$ una funció integrable en $[a,b]$ i definim una funció $F: [a,b] \to \mathbb{R}$ per
$$F(x) = \int_a^x f(t) dt$$
llavors es compleix que:
1. $F$ és contínua en l'interval $[a,b]$.
2. Si $f$ és contínua en algun punt $c \in (a,b)$, llavors la funció àrea $F$ és derivable en $c$ i $F'(c) = f(c)$.

::mafs{type="teorema_fonamental"}

### Primitiva i regla de Barrow

Si tenim dues funcions $f$ i $F$ definides en l'interval $(a,b)$ tal que $F'(x) = f(x)$ per a tot $x \in (a,b)$, es diu que $F$ és una **primitiva** de $f$ en l'interval $(a,b)$.

::mafs{type="primitiva_familia"}

* **Corol·lari**: Si $f$ és contínua en $[a,b]$ i definim $F(x) = \int_a^x f$, aleshores $F$ és derivable en $[a,b]$ i és una primitiva de $f$ en $(a,b)$.

Aquest concepte ens introdueix una de les eines més importants i pràctiques per avaluar integrals definides: la **Regla de Barrow**. Ens permet calcular l'integral definida d'una funció contínua de manera molt senzilla si podem trobar una de les seves primitives.

> **Regla de Barrow**: Si $f$ és contínua en $[a,b]$ i $F$ és contínua en $[a,b]$ i derivable en $(a,b)$ sent una primitiva ($F'(x) = f(x)$), llavors:
> $$\int_a^b f(x) dx = F(b) - F(a)$$

::mafs{type="regla_barrow"}

### Propietats fonamentals

Per treballar amb integrals definides, és essencial recordar aquestes propietats:

1. **Inversió de límits**: Si intercanviem els límits d'integració, el signe de la integral canvia.
   $$\int_a^b f(x) dx = -\int_b^a f(x) dx$$

::mafs{type="propietat_inversio"}

2. **Linealitat**: La integral de la suma és la suma d'integrals, i les constants poden sortir de la integral.
   $$\int_a^b (k \cdot f(x) + g(x)) dx = k \int_a^b f(x) dx + \int_a^b g(x) dx$$

::mafs{type="propietat_linealitat"}

3. **Additivitat de l'interval**: Podem partir una integral en un punt $c \in [a,b]$.
   $$\int_a^b f(x) dx = \int_a^c f(x) dx + \int_c^b f(x) dx$$

::mafs{type="propietat_additivitat"}

### Propietats de simetria i paritat

Si la funció $f$ presenta simetries, l'estudi de la funció àrea $F(x) = \int_0^x f(t)dt$ se simplifica:
- Si **$f$ és parella** ($f(-x) = f(x)$), llavors **$F$ és imparella** ($F(-x) = -F(x)$).
- Si **$f$ és imparella** ($f(-x) = -f(x)$), llavors **$F$ és parella** ($F(-x) = F(x)$).

::mafs{type="paritat_integrals"}

> **Truc d'examen**: Recorda que la integral d'una funció imparella en un interval simètric $[-a, a]$ és sempre $0$.

### Derivada d'una integral

Quan els límits d'integració depenen d'una variable $x$, no podem aplicar el TFC directament; cal utilitzar la **Regla de la Cadena**.

> **Teorema**: Sigui $f$ contínua i $u(x), v(x)$ funcions derivables. Si definim:
> $$F(x) = \int_{u(x)}^{v(x)} f(t)dt$$
> Aleshores la seva derivada és:
> $$F'(x) = f(v(x)) \cdot v'(x) - f(u(x)) \cdot u'(x)$$

*En paraules:* Substituïm la $x$ en la funció i multipliquem per la derivada del límit.

::mafs{type="limits_integracio"}

### Límits i indeterminacions amb integrals

Quan apareixen integrals en límits que generen indeterminacions del tipus $\frac{0}{0}$, podem aplicar la **Regla de L'Hôpital** derivant la funció integral mitjançant el TFC:

$$\lim_{x \to a} \frac{\int_a^x f(t)dt}{g(x)} = \lim_{x \to a} \frac{f(x)}{g'(x)}$$

::mafs{type="regla_hopital"}

---

### Estudi local de la funció integral

Podem estudiar el comportament de $F(x) = \int_a^x f(t)dt$ sense calcular la integral:
- **Punts crítics**: Són els valors de $x$ on $F'(x) = f(x) = 0$.
- **Creixement**: $F$ creix on $f(x) > 0$ i decreix on $f(x) < 0$.
- **Concavitat**: Estudiem $F''(x) = f'(x)$. Si $f'(x) > 0$, $F$ és convexa ($\cup$).
- **Punts d'Inflexió**: On $f'(x) = 0$ i hi ha canvi de curvatura.

---

## 2. Integració numèrica

En molts de problemes pràctics i en l'enginyeria, calcular l'integral d'una funció amb la Regla de Barrow és extremadament difícil o impossible perquè algunes funcions no tenen una primitiva expressable en funcions elementals (com $\int e^{-x^2} dx$). En aquests casos s'utilitzen **mètodes elementals d'aproximació**.

### 2.1 Mètode dels Trapezis

Consisteix en subdividir l'interval $[a,b]$ en $n$ subintervals d'amplada $h = \frac{b-a}{n}$. En cada interval, se substitueix la corba per un trapezi recte.

$$ T_n = \frac{h}{2} \left[ f(a) + f(b) + 2 \sum_{i=1}^{n-1} f(x_i) \right] $$

**Càlcul de l'error i cerca de $n$:**
L'error màxim admès ve fita per:
$$ |E_T| \leq \frac{(b-a)h^2}{12} M_2 = \frac{(b-a)^3}{12n^2} M_2 $$
*On $M_2$ és el valor màxim de $|f''(x)|$ en l'interval.*

Per trobar el nombre d'intervals $n$ necessari per a una precisió $\varepsilon$:
1. Calculem $f''(x)$ i busquem el seu màxim $M_2$ en $[a,b]$.
2. Aïllem $n$: **$n \geq \sqrt{\frac{(b-a)^3 M_2}{12\varepsilon}}$**

::mafs{type="integracio_trapezi"}

### 2.2 Mètode de Simpson

Aquest mètode millora la precisió aproximant la corba mitjançant fragments de paràboles (polinomis de grau 2). Per aplicar-lo, és fonamental que el nombre de **subintervals ($n$) sigui parell**.

$$ S_n = \frac{h}{3} \left[ f(a) + f(b) + 4\sum_{i=1}^{n/2} f(x_{2i-1}) + 2\sum_{i=1}^{\frac{n}{2}-1} f(x_{2i}) \right] $$

**Càlcul de l'error i cerca de $n$:**
L'error màxim admès ve fita per:
$$ |E_S| \leq \frac{(b-a)h^4}{180} M_4 = \frac{(b-a)^5}{180n^4} M_4 $$
*On $M_4$ és el valor màxim de $|f^{(4)}(x)|$ en l'interval.*

Per trobar el nombre d'intervals $n$ necessari per a una precisió $\varepsilon$:
1. Calculem $f^{(4)}(x)$ i busquem el seu màxim $M_4$ en $[a,b]$.
2. Aïllem $n$: **$n \geq \sqrt[4]{\frac{(b-a)^5 M_4}{180\varepsilon}}$** (recorda arrodonir al següent enter parell).

::mafs{type="integracio_simpson"}

### Exemple comparativa de cotes d'error

::mafs{type="cota_error"}

---

## 3. Annex: Càlcul de Primitives i Àrees

Aquestes són les eines analítiques que hem utilitzat per resoldre els exercicis del tema.

### 3.1 Càlcul d'Àrees entre corbes
Per trobar l'àrea limitada per dues funcions $f$ i $g$:
1. Trobem els punts de tall igualant $f(x) = g(x)$.
2. Determinem quina funció és superior a l'interval $[a,b]$.
3. Calculem l'àrea com: $A = \int_a^b |f(x) - g(x)| dx$.

::mafs{type="area_entre_corbes"}

### 3.2 Tècniques d'Integració
- **Integració per parts**: $\int u \, dv = u \cdot v - \int v \, du$. Utilitzada per a productes de funcions (Ex 8 i 11).
- **Canvi de variable**: $u = g(x) \implies du = g'(x)dx$.
- **Racionals**: Divisió de polinomis o fraccions simples si el denominador té arrels.

### 3.3 Integrals Immediates
| Tipus | Fórmula |
|---|---|
| **Potencial** | $\int u^n \cdot u' \, dx = \frac{u^{n+1}}{n+1} + C$ |
| **Logarítmica** | $\int \frac{u'}{u} \, dx = \ln \lvert u \rvert + C$ |
| **Exponencial** | $\int e^u \cdot u' \, dx = e^u + C$ |
| **Trigonomètrica** | $\int \cos(u) \cdot u' \, dx = \sin(u) + C$ |
| **Arctangent** | $\int \frac{u'}{1+u^2} \, dx = \arctan(u) + C$ |

