---
title: "Tema 5: Polinomi de Taylor"
description: "Aproximació de funcions mitjançant polinomis, càlcul de l'error (resta de Lagrange) i estudi local."
order: 5
readTime: "25 min"
subject: "m2"
---

L'objectiu d'aquest tema és aproximar funcions complicades mitjançant funcions molt senzilles: els polinomis. Això ens permet calcular valors aproximats, límits difícils i estudiar el comportament local d'una funció.

::videoviz{url="/m2/taylor_master_tema5.webm"}

## 1. El Polinomi de Taylor

Sigui $f$ una funció $n$ vegades derivable en el punt $a$. El **polinomi de Taylor de grau $n$** per a $f$ en el punt $a$ es defineix com:

$$P_n(f, a, x) = f(a) + \frac{f'(a)}{1!}(x-a) + \frac{f''(a)}{2!}(x-a)^2 + \dots + \frac{f^{(n)}(a)}{n!}(x-a)^n$$

### Propietats clau:
1. En el punt $a$, el polinomi i la funció valen el mateix: $P_n(a) = f(a)$.
2. Totes les seves derivades fins a ordre $n$ també coincideixen en el punt $a$: $P_n^{(k)}(a) = f^{(k)}(a)$.
3. El polinomi de Taylor de grau 1 coincideix amb l'equació de la **recta tangent**.

::mafs{type="taylor_centrat"}

---

## 2. Teorema de Taylor i Resta de Lagrange

Aproximar una funció té un cost: l'error. Definim el **resta de Taylor** com la diferència entre la funció real i el polinomi:
$$R_n(f,a,x) = f(x) - P_n(f,a,x)$$

::mafs{type="taylor_teorema"}

> **Teorema de Taylor**: Si $f$ és $n+1$ vegades derivable, existeix un punt $c$ entre $a$ i $x$ tal que:
> $$R_n(f,a,x) = \frac{f^{(n+1)}(c)}{(n+1)!}(x-a)^{n+1}$$
> Aquesta expressió s'anomena **Resta de Lagrange**.

::mafs{type="taylor_lagrange"}

---

## 3. Desenvolupaments de Maclaurin (a = 0)

Són els polinomis de Taylor centrats a l'origen més comuns:

::mafs{type="taylor_maclaurin"}

| Funció | Desenvolupament ($a=0$) |
| :--- | :--- |
| **$e^x$** | $1 + x + \frac{x^2}{2!} + \dots + \frac{x^n}{n!} + \dots$ |
| **$\sin(x)$** | $x - \frac{x^3}{3!} + \frac{x^5}{5!} - \dots + (-1)^n \frac{x^{2n+1}}{(2n+1)!}$ |
| **$\cos(x)$** | $1 - \frac{x^2}{2!} + \frac{x^4}{4!} - \dots + (-1)^n \frac{x^{2n}}{(2n)!}$ |
| **$\ln(1+x)$** | $x - \frac{x^2}{2} + \frac{x^3}{3} - \dots + (-1)^{n-1} \frac{x^n}{n}$ |
| **$\frac{1}{1-x}$** | $1 + x + x^2 + x^3 + \dots + x^n$ |

---

## 4. Acotació de l'Error

Per saber com de bona és la nostra aproximació, busquem una fita superior del resta. Si la derivada $(n+1)$ està acotada per $|f^{(n+1)}(t)| \leq K$ en l'interval d'estudi:

$$|R_n(x)| \leq \frac{K}{(n+1)!} |x-a|^{n+1}$$

::mafs{type="taylor_error"}

Això ens permet determinar el grau $n$ necessari per a una precisió desitjada (per exemple, error $< 10^{-4}$).

---

## 5. Estudi Local de Funcions

El polinomi de Taylor ens dóna informació sobre els extrems i la curvatura mitjançant les derivades d'ordre superior:

### Màxims i Mínims
Si $f'(a) = f''(a) = \dots = f^{(n-1)}(a) = 0$ i $f^{(n)}(a) \neq 0$:
- **Si $n$ és parell**:
  - $f^{(n)}(a) > 0 \implies$ **Mínim** relatiu.
  - $f^{(n)}(a) < 0 \implies$ **Màxim** relatiu.
- **Si $n$ és senar**: No és un extrem (és un punt d'inflexió amb tangent horitzontal).

::mafs{type="taylor_comportament"}

### Curvatura i Inflexió
Si $f''(a) = f'''(a) = \dots = f^{(n-1)}(a) = 0$ i $f^{(n)}(a) \neq 0$:
- **Si $n$ és parell**:
  - $f^{(n)}(a) > 0 \implies$ **Convexa** ($\cup$).
  - $f^{(n)}(a) < 0 \implies$ **Còncava** ($\cap$).
- **Si $n$ és senar**: **Punt d'inflexió**.