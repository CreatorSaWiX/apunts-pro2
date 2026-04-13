---
title: "Tema 6: Integració"
description: "Teorema fonamental del càlcul, integració numèrica (Trapezis i Simpson), integral de Riemann i repàs de càlcul de primitives."
order: 6
readTime: "30 min"
subject: "m2"
draft: true
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

### Estudi de funcions definides per integrals (Límits funcionals)

De vegades podem tenir límits d'integració que depenen d'una variable $x$. Com derivem aquestes integrals?

> **Teorema**: Sigui $f$ contínua i $u, v$ funcions derivables en un punt $x_0$. Si definim:
> $$F(x) = \int_{u(x)}^{v(x)} f(t)dt$$
> Aleshores $F$ és derivable en $x_0$ i la seva derivada en $x$ s'avalúa aplicant la Regla de la Cadena a Barrow:
> $$F'(x_0) = f(v(x_0)) \cdot v'(x_0) - f(u(x_0)) \cdot u'(x_0)$$

::mafs{type="limits_integracio"}

---

## 2. Integració Numèrica

En molts de problemes pràctics i en l'enginyeria, calcular l'integral d'una funció amb la Regla de Barrow és extremadament difícil, molest, o impossible perquè algunes funcions no tenen una primitiva expressable en funcions elementals (com $\int e^{-x^2} dx$).
En aquests casos s'utilitzen **mètodes elementals d'aproximació**, els quals substitueixen la funció original per polinomis elementals en el subinterval.

### Mètode dels Trapezis

Consisteix en subdividir l'interval total $[a,b]$ en $n$ subintervals petits d'amplada idèntica $h = \frac{b-a}{n}$. Aquest intervals estan limitats pels punts de partició $x_i = a + i \cdot h$. En cada interval, se substitueix la corba per un trapezi recte. La suma total aproximada és:

$$ \int_a^b f(x) dx \approx T_n = \frac{b-a}{n} \left( \frac{f(a) + f(b)}{2} + \sum_{i=1}^{n-1} f(x_i) \right) $$

**Càlcul de l'error del Mètode del Trapezi:**

Si la funció $f$ té la segona derivada de forma contínua i existeix una cota absoluta $|f''(x)| \le M_2$ per a tot $x \in [a,b]$, l'error de l'aproximació compleix:

$$ |T_n - \int_a^b f(x) dx| \leq \frac{(b-a)^3}{12n^2} \cdot M_2 $$

::mafs{type="integracio_trapezi"}

### Mètode de Simpson

Aquest mètode millora substancialment la precisió, aproximant la capçalera de la corba a l'interval mitjançant fragments de parets parabòliques (polinomis de grau dos). Per aplicar el Mètode de Simpson, és fonamental que el nombre de **subintervals (n) sigui nombre parell**.

$$ \int_a^b f(x) dx \approx S_n = \frac{b-a}{3n} \left( f(a) + f(b) + 4\sum_{i=1}^{n/2} f(x_{2i-1}) + 2\sum_{i=1}^{\frac{n}{2}-1} f(x_{2i}) \right) $$

**Càlcul de l'error del Mètode de Simpson:**

Si la funció té la quarta derivada contínua i podem fitar-la dins l'interval $|f^{(4)}(x)| \le M_4$, llavors el cost en la precisió de l'aproximació és:

$$ |S_n - \int_a^b f(x) dx| \leq \frac{(b-a)^5}{180n^4} \cdot M_4 $$

::mafs{type="integracio_simpson"}
<!-- 
---

## 3. Apèndix 1: La Integral de Riemann i Propietats Elementals

Al voltant de la noció històrica de com definir l'àrea amb certesa de rigor matemàtic, la construcció de la integral de Riemann es basa totalment en la **suma de particions rectangulars**:

Donada una partició $P$ de $[a,b]$, classifiquem dos conjunts de sumes de caixes:
* **Suma inferior**: $s(f,P) = \sum_{i=1}^n m_i \cdot (x_i - x_{i-1})$ on $m_i$ és l'**ínfim** (el mínim local) de f en el interval determinat $i$.
* **Suma superior**: $S(f,P) = \sum_{i=1}^n M_i \cdot (x_i - x_{i-1})$ igual però amb una alçada equivalent al $M_i$ **suprem** de l'interval.

S'acorda que una funció acotada en $[a,b]$ és **Integrable Riemann** quan cert número reuneix les sumes superiors i les sumes inferiors (tots dos conjunts coincideixen), i aquest punt coincident es denomina de manera notacional $\int f$ o $\int_a^b f(x) dx$.

**Propietats Elementals que has de conèixer:**
1. Tota funció que sigui contínua és integrable en un espai afitat.
2. Tota funció acotada que sigui monòtona a l'interval és integrable.
3. El conjunt amb un llistat finit (o numerable) de punts de discontinuïtat és integrable.
4. **Linealitat**: Si f i g són integrables, $(\alpha f + \beta g)$ també ho és. $\implies \int (\alpha f + \beta g) = \alpha\int f + \beta \int g$.
5. **Monotonia i signe**: Si l'acotació f es sempre positiva ($f \ge 0$), aleshores la seva integral obtinguda $\int f \ge 0$. Més extens: Si $f \le g \implies \int f \le \int g$.
6. **Teorema de la mitjana de la integral**: Si f és totalment contínua, garantim l'existència d'algun punt $c \in [a,b]$ amagat tal que el valor de la integral és igual a l'àrea d'un rectangle de base $(b-a)$ per l'alçària mig $f(c)$. Això es nota: $\int_a^b f = f(c)(b-a)$.
7. **Additivitat segons l'interval**: l'àrea d'un tram complet és l'acumulat dels sub-trams: $\int_a^b f = \int_a^c f + \int_c^b f$.

---

## 4. Apèndix 2: Breu Repàs de Càlcul de Primitives

En gran part la feina es redueix a poder trobar la funció origen, coneguda com la integral indefinida. Un ràpid recordatori de les principals tècniques per solucionar-ho:

### Tècniques base

* **Canvi de variable**: Aplicat mitjançant la Regla de la cadena de les derivades $F(g(t))' = F'(g(t)) \cdot g'(t)$. Si ens trobem una integral com $\int f(g(t))g'(t)dt$, la podem reduir per variables transformades substituint l'enganyosa composició de funcions: resulta en $F(g(x)) + K$.
* **Integració per parts**: Empreu sempre aquesta propietat derivada d'un producte $(u \cdot v)'$. Ens aporta una molt agraïble fórmula general:\
**Fórmula màgica**: $\int u \cdot dv = u \cdot v - \int v \cdot du$
* **Integrals de funcions racionals**: $\int \frac{P(x)}{Q(x)}$
  - Si trobem que el grau del polinomi numèric (el numerador) es superior o igual, s'ha de procedir a fer una divisió algorítmica de polinomis, per separar la divisió amb una forma $C(x) + \frac{R(x)}{Q(x)}$.
  - Per funcions on el numerador és menor al denominador s'utilitzen tècniques de separació en fraccions simples $\left( A, B, C... \right)$. Aquelles que derivin de ser irreductibles acabaran sent integrables usant logaritmes i arctangents generalment, d'aquesta manera: $\frac{A}{x - a} \implies A\ln|x-a|$.

### Un resum d'Integrals Immediates (Taula Bàsica)
Les funcions elementals directes de les quals deriven les fórmules que necessites tindre al cap. Amb u equivalent a una variable funcional genèrica.

- $\int u^r \cdot u' \cdot dx = \frac{u^{r+1}}{r+1} + K$ (Excepte $r = -1$)
- $\int \frac{u'}{u} \cdot dx = \ln|u| + K$
- $\int u' e^u \cdot dx = e^u + K$
- $\int u' \cdot \cos(u) \cdot dx = \sin(u) + K$
- $\int u' \cdot \sin(u) \cdot dx = -\cos(u) + K$
- $\int \frac{u'}{\cos^2(u)} \cdot dx = \tan(u) + K$
- $\int \frac{u'}{1+u^2} \cdot dx = \arctan(u) + K$
- $\int \frac{u'}{\sqrt{1-u^2}} \cdot dx = \arcsin(u) + K$ -->
