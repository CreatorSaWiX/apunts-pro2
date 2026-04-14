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

### Primitiva i Regla de Barrow

Si tenim dues funcions $f$ i $F$ definides en l'interval $(a,b)$ tal que $F'(x) = f(x)$ per a tot $x \in (a,b)$, es diu que $F$ és una **primitiva** de $f$ en l'interval $(a,b)$.

::mafs{type="primitiva_familia"}

* **Corol·lari**: Si $f$ és contínua en $[a,b]$ i definim $F(x) = \int_a^x f$, aleshores $F$ és derivable en $[a,b]$ i és una primitiva de $f$ en $(a,b)$.

Aquest concepte ens introdueix una de les eines més importants i pràctiques per avaluar integrals definides: la **Regla de Barrow**. Ens permet calcular l'integral definida d'una funció contínua de manera molt senzilla si podem trobar una de les seves primitives.

> **Regla de Barrow**: Si $f$ és contínua en $[a,b]$ i $F$ és contínua en $[a,b]$ i derivable en $(a,b)$ sent una primitiva ($F'(x) = f(x)$), llavors:
> $$\int_a^b f(x) dx = F(b) - F(a)$$

::mafs{type="regla_barrow"}

### Propietats de Simetria i Paritat

Si la funció $f$ presenta simetries, l'estudi de la funció àrea $F(x) = \int_0^x f(t)dt$ se simplifica:
- Si **$f$ és parella** ($f(-x) = f(x)$), llavors **$F$ és imparella** ($F(-x) = -F(x)$).
- Si **$f$ és imparella** ($f(-x) = -f(x)$), llavors **$F$ és parella** ($F(-x) = F(x)$).

::mafs{type="paritat_integrals"}

> **Truc d'examen**: Recorda que la integral d'una funció imparella en un interval simètric $[-a, a]$ és sempre $0$.

### Estudi de funcions definides per integrals (Límits funcionals)

De vegades podem tenir límits d'integració que depenen d'una variable $x$. Com derivem aquestes integrals?

> **Teorema**: Sigui $f$ contínua i $u, v$ funcions derivables en un punt $x_0$. Si definim:
> $$F(x) = \int_{u(x)}^{v(x)} f(t)dt$$
> Aleshores $F$ és derivable en $x_0$ i la seva derivada en $x$ s'avalúa aplicant la Regla de la Cadena a Barrow:
> $$F'(x_0) = f(v(x_0)) \cdot v'(x_0) - f(u(x_0)) \cdot u'(x_0)$$

::mafs{type="limits_integracio"}

### Límits i Indeterminacions amb Integrals

Quan apareixen integrals en límits que generen indeterminacions del tipus $\frac{0}{0}$, podem aplicar la **Regla de L'Hôpital** derivant la funció integral mitjançant el TFC:

$$\lim_{x \to a} \frac{\int_a^x f(t)dt}{g(x)} = \lim_{x \to a} \frac{f(x)}{g'(x)}$$

::mafs{type="regla_hopital"}

---

### Estudi Local de la Funció Integral

Podem estudiar el comportament de $F(x) = \int_a^x f(t)dt$ sense calcular la integral:
- **Punts Crítics**: Són els valors de $x$ on $F'(x) = f(x) = 0$.
- **Creixement**: $F$ creix on $f(x) > 0$ i decreix on $f(x) < 0$.
- **Concavitat**: Estudiem $F''(x) = f'(x)$. Si $f'(x) > 0$, $F$ és convexa ($\cup$).
- **Punts d'Inflexió**: On $f'(x) = 0$ i hi ha canvi de curvatura.

---

## 2. Integració Numèrica

En molts de problemes pràctics i en l'enginyeria, calcular l'integral d'una funció amb la Regla de Barrow és extremadament difícil, molest, o impossible perquè algunes funcions no tenen una primitiva expressable en funcions elementals (com $\int e^{-x^2} dx$).
En aquests casos s'utilitzen **mètodes elementals d'aproximació**, els quals substitueixen la funció original per polinomis elementals en el subinterval.

### Mètode dels Trapezis

Consisteix en subdividir l'interval total $[a,b]$ en $n$ subintervals petits d'amplada idèntica $h = \frac{b-a}{n}$. Aquest intervals estan limitats pels punts de partició $x_i = a + i \cdot h$. En cada interval, se substitueix la corba per un trapezi recte. La suma total aproximada és:

$$ \int_a^b f(x) dx \approx T_n = \frac{b-a}{n} \left( \frac{f(a) + f(b)}{2} + \sum_{i=1}^{n-1} f(x_i) \right) $$

**Càlcul de l'error del Mètode del Trapezi:**

### Com trobar la cota $M$ i el nombre d'intervals $n$?

En els problemes de càlcul d'errors, el procediment general és:
1. **Calcular la derivada** (2a per a Trapezis, 4a per a Simpson).
2. **Trobar el màxim absolut** d'aquesta derivada en l'interval $[a,b]$. Sol ser en un dels extrems de l'interval si la derivada és monòtona. Aquest valor és la nostra $M$.
3. **Aïllar $n$** de la inecuació d'error segons la tolerància $\varepsilon$:
   - **Trapezis**: $n \geq \sqrt{\frac{(b-a)^3 M_2}{12\varepsilon}}$
   - **Simpson**: $n \geq \sqrt[4]{\frac{(b-a)^5 M_4}{180\varepsilon}}$ (Recorda: $n$ ha de ser parell).

::mafs{type="cota_error"}

$$ |T_n - \int_a^b f(x) dx| \leq \frac{(b-a)^3}{12n^2} \cdot M_2 $$

::mafs{type="integracio_trapezi"}

### Mètode de Simpson

Aquest mètode millora substancialment la precisió, aproximant la capçalera de la corba a l'interval mitjançant fragments de parets parabòliques (polinomis de grau dos). Per aplicar el Mètode de Simpson, és fonamental que el nombre de **subintervals (n) sigui nombre parell**.

$$ \int_a^b f(x) dx \approx S_n = \frac{b-a}{3n} \left( f(a) + f(b) + 4\sum_{i=1}^{n/2} f(x_{2i-1}) + 2\sum_{i=1}^{\frac{n}{2}-1} f(x_{2i}) \right) $$

**Càlcul de l'error del Mètode de Simpson:**

Si la funció té la quarta derivada contínua i podem fitar-la dins l'interval $|f^{(4)}(x)| \le M_4$, llavors el cost en la precisió de l'aproximació és:

$$ |S_n - \int_a^b f(x) dx| \leq \frac{(b-a)^5}{180n^4} \cdot M_4 $$

::mafs{type="integracio_simpson"}

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

