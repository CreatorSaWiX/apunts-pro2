---
title: "Tema 4: Derivabilitat"
description: "Estudi del canvi instantani, regles de derivació, teoremes fonamentals del càlcul i aplicacions geomètriques."
order: 4
readTime: "25 min"
subject: "m2"
---

En aquest tema aprendrem a mesurar a quina velocitat es mouen les funcions. Si al tema anterior vam estudiar els límits per saber cap a on anava una funció, ara n'estudiarem el canvi instantani.

## 1. La Derivada

Una funció és derivable en un punt si podem mesurar el seu canvi instantani de forma precisa. Aquest concepte neix d'un límit fonamental:

> **Definició**: Diem que una funció $f$ és derivable en un punt $a$ si existeix el següent límit i és un nombre real:
> $$f'(a) = \lim_{x \to a} \frac{f(x) - f(a)}{x - a} = \lim_{h \to 0} \frac{f(a+h) - f(a)}{h}$$

Aquest valor $f'(a)$ s'anomena la **derivada** de $f$ en $a$.

### Interpretació Geomètrica
Geomètricament, la derivada $f'(a)$ ens dóna el **pendent** (la inclinació) de la recta tangent a la gràfica just en el punt $(a, f(a))$. 

L'equació d'aquesta recta tangent és:
$$y = f(a) + f'(a)(x - a)$$

::mafs{type="derivada_tangent"}

### Derivabilitat i Continuïtat
Hi ha una relació jeràrquica molt important entre aquests dos conceptes:
1. Si una funció és derivable en un punt, llavors és **obligatòriament contínua** en aquell punt.
2. El revés **no és cert**: hi ha funcions contínues que no són derivables (per exemple, si tenen una "punxa" o un angle brusc).

---

## 2. Derivació Logarítmica

Quan tenim funcions tipus $f(x) = u(x)^{v(x)}$ (on tant la base com l'exponent depenen de $x$), les regles normals no serveixen. Utilitzem la **derivació logarítmica**:

1. Apliquem logaritmes: $\ln f(x) = v(x) \ln u(x)$
2. Derivem a banda i banda (regla de la cadena): $\frac{f'(x)}{f(x)} = v'(x) \ln u(x) + v(x) \frac{u'(x)}{u(x)}$
3. Aïllem $f'(x)$:
$$f'(x) = u(x)^{v(x)} \left( v'(x) \ln u(x) + v(x) \frac{u'(x)}{u(x)} \right)$$

---

## 3. Teoremes del Càlcul

Aquests teoremes ens permeten assegurar l'existència de punts amb propietats concretes només mirant els extrems d'un interval.

### Teorema de Rolle
Si $f$ és contínua en $[a, b]$, derivable a $(a, b)$ i **$f(a) = f(b)$**, llavors existeix almenys un punt $c \in (a, b)$ tal que:
$$f'(c) = 0$$
*Intuïció: Si puges una muntanya i tornes a baixar a la mateixa alçada, en algun moment el teu pendent ha hagut de ser zero (el cim).*

### Teorema del Valor Mitjà (Lagrange)
És una versió "inclinada" del de Rolle. Si $f$ és contínua en $[a, b]$ i derivable a $(a, b)$, existeix un punt $c \in (a, b)$ tal que:
$$f'(c) = \frac{f(b) - f(a)}{b - a}$$
*Significat: Hi ha un instant on el pendent de la tangent és paral·lel a la recta que uneix els punts d'inici i final.*

---

## 4. Aplicacions de la Derivada

### Monotonia i Extrems
Podem saber si una funció puja o baixa mirant el signe de la seva primera derivada:
- $f'(x) > 0 \implies$ Funció **creixent**.
- $f'(x) < 0 \implies$ Funció **decreixent**.

Per trobar **màxims i mínims relatius**:
1. Busquem punts on $f'(a) = 0$ (punts crítics).
2. Mirem la segona derivada:
   - $f''(a) > 0 \implies$ **Mínim** (forma de bol).
   - $f''(a) < 0 \implies$ **Màxim** (forma de paraigua).

### Regla de l'Hôpital
Molt útil per resoldre indeterminacions del tipus $0/0$ o $\infty/\infty$ en límits:
$$\lim_{x \to a} \frac{f(x)}{g(x)} = \lim_{x \to a} \frac{f'(x)}{g'(x)}$$

### Curvatura (Concavitat i Convexitat)
Veiem la curvatura mirant el signe de la **segona derivada**:
- $f''(x) > 0 \implies$ **Convexa** (forma $\cup$).
- $f''(x) < 0 \implies$ **Còncava** (forma $\cap$).
- Si $f''(a) = 0$ i hi ha canvi de signe, tenim un **punt d'inflexió**.

---

## 5. Taula de Derivades Fonamentals

Aquesta taula recull les derivades més utilitzades i la seva versió amb la **Regla de la Cadena**.

| Funció $f(x)$ | Derivada Simple $f'(x)$ | Funció Composta $f(u)$ | Derivada Composta (Cadena) |
| :--- | :--- | :--- | :--- |
| **Constant**: $k$ | $0$ | - | - |
| **Identitat**: $x$ | $1$ | $u$ | $u'$ |
| **Potència**: $x^n$ | $n \cdot x^{n-1}$ | $u^n$ | $n \cdot u^{n-1} \cdot u'$ |
| **Arrel**: $\sqrt{x}$ | $\frac{1}{2\sqrt{x}}$ | $\sqrt{u}$ | $\frac{u'}{2\sqrt{u}}$ |
| **Logaritme**: $\ln(x)$ | $\frac{1}{x}$ | $\ln(u)$ | $\frac{u'}{u}$ |
| **Logaritme $a$**: $\log_a(x)$ | $\frac{1}{x \ln a}$ | $\log_a(u)$ | $\frac{u'}{u \ln a}$ |
| **Exponencial**: $e^x$ | $e^x$ | $e^u$ | $e^u \cdot u'$ |
| **Exponencial $a$**: $a^x$ | $a^x \ln a$ | $a^u$ | $a^u \ln a \cdot u'$ |
| **Sinus**: $\sin(x)$ | $\cos(x)$ | $\sin(u)$ | $u' \cos(u)$ |
| **Cosinus**: $\cos(x)$ | $-\sin(x)$ | $\cos(u)$ | $-u' \sin(u)$ |
| **Tangent**: $\tan(x)$ | $\frac{1}{\cos^2(x)}$ | $\tan(u)$ | $\frac{u'}{\cos^2(u)}$ |

---

## 6. Operacions amb Derivades

Siguin $f$ i $g$ dues funcions derivables:

- **Suma/Resta**: $(f \pm g)' = f' \pm g'$
- **Producte**: $(f \cdot g)' = f' \cdot g + f \cdot g'$
- **Quocient**: $\left( \frac{f}{g} \right)' = \frac{f' \cdot g - f \cdot g'}{g^2}$
