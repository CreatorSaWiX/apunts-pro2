---
title: "Tema 1: Números reales"
description: "Valores absolutos, desigualdades y números complejos. Propiedades básicas."
order: 1
readTime: "10 min"
subject: "m2"
---

## 1.1 Definición
Primero teníamos los **naturales** $\mathbb{N} = \{1, 2, 3, \dots\}$. Después los **enteros** $\mathbb{Z} = \{\dots, -2, -1, 0, 1, 2, \dots\}$. Ahora ya tenemos el cero y los negativos. Llegan los **racionales** $\mathbb{Q}$, son las fracciones $a/b$.

Parece que ya llenamos toda la línea. Los griegos descubrieron que hay agujeros. Por ejemplo, la diagonal de un cuadrado de lado 1 es $\sqrt{2}$, y este número no se puede escribir como una fracción. Es un **irracional**. El conjunto de los números **reales** $\mathbb{R}$ es la unión de **racionales** e **irracionales**.

Decimos que $\mathbb{R}$ es un **cuerpo** porque tiene dos operaciones (suma y producto) que funcionan muy bien.

| Propiedad | Suma y Producto |
| --- | --- |
| **Asociativa** | $(a+b)+c = a+(b+c)$ |
| **Conmutativa** | $a+b = b+a$ |
| **Elemento neutro** | $a+0 = a$ y $a \cdot 1 = a$ |
| **Elementos inversos** | $a+(-a) = 0$ y $a \cdot a^{-1} = 1$ donde $a \neq 0$ |

## 1.2 Orden y los intervalos
Además de sumar y multiplicar, los reales están ordenados. Dados dos números, o son iguales, o uno es más pequeño que el otro. Esto se escribe $a < b$.

**Propiedades de las desigualdades:**
- Si **sumamos** lo mismo a los dos lados, el orden se mantiene: $a < b \implies a+c < b+c$.
- Si **multiplicamos** por un número **positivo**, el orden se mantiene.
- Si **multiplicamos** por un número **negativo** ($c < 0$), la desigualdad se invierte: $a < b \implies ac > bc$.

Los **intervalos** son los subconjuntos más famosos de la recta.

- **Abierto $(a,b)$:** Los extremos NO están: $\{x \in \mathbb{R} \mid a < x < b\}$.
- **Cerrado $[a,b]$:** Los extremos SÍ están: $\{x \in \mathbb{R} \mid a \leq x \leq b\}$.
- **Infinitos:** $(a, +\infty)$ o $(-\infty, a]$. El infinito siempre va con paréntesis abierto porque no es un número.

## 1.3 Valor absoluto y distancia
¿Cómo medimos la distancia entre dos puntos? No nos importa si vamos de derecha a izquierda o al revés, la distancia debe ser positiva. Definimos el valor absoluto $|x|$:
$$
|x| = \begin{cases}
  x  & \text{si } x \geq 0 \\
  -x & \text{si } x < 0
\end{cases}
$$

- Si $x$ es **positivo** o cero, lo dejamos **igual**.
- Si $x$ es **negativo**, le **cambiamos el signo** para hacerlo **positivo**.

**Propiedades:**
- **Desigualdad:** Ir directo siempre es más corto o igual que hacer escalas: $|x+y| \leq |x| + |y|$
- **Entornos:** $|x| < a$ equivale a decir que $x$ está atrapado entre $-a$ y $a$: $-a < x < a$.

## 1.4 Cotas: Supremo, ínfimo, máximo y mínimo
Imaginamos un conjunto $A$ dentro de la recta real:

- **Cota superior:** Un número $k$ es cota superior si es mayor o igual que TODOS los elementos del conjunto. Es como un 'techo'. Si tiene, el conjunto está acotado superiormente.
- **Cota inferior:** Un número $l$ es cota inferior si es menor o igual que TODOS los elementos. Es como un 'suelo'.

**Supremo ($\sup A$):** Es la **menor de las cotas superiores**. Es el 'techo' más ajustado al conjunto.
**Máximo ($\max A$):** Es un **supremo** que, además, pertenece al conjunto $A$.

> Si el intervalo es cerrado $[a, b]$: El máximo es $b$ y el supremo es $b$.
> Si el intervalo es abierto $(a, b)$: El supremo es $b$, pero no tiene máximo.

**Ejemplo:** Consideramos el intervalo $A = [0, 2)$.
- **Acotado superiormente:** Sí, el 5 es cota, el 100 es cota, el 2 es cota.
- **Supremo:** El 2, porque cualquier número más pequeño que 2 dejaría elementos de $A$ fuera.
- **Máximo:** No hay. Porque el 2 no está dentro del intervalo (es abierto). ¿El 1.9? No, porque 1.99 es más grande. ¿El 1.99? No... Nunca llegamos al máximo.

Lo mismo aplica para el **ínfimo** ($\inf A$) y el **mínimo** ($\min A$) por la parte de abajo.

**Teorema del extremo:** En $\mathbb{R}$, todo conjunto no vacío y acotado superiormente siempre tiene supremo. Esta propiedad no ocurre en los racionales (donde podría haber un agujero justo donde iría el supremo).

## 1.5 Polinomios
Los polinomios son funciones formadas por sumas y productos de $x$. La propiedad clave aquí es la factorización. Cuando dividimos un polinomio $f(x)$ por $(x - a)$, el resto es $f(a)$ (**Teorema del resto**).

Esto significa que $a$ es una raíz (solución de $f(x) = 0$) si y solo si la división es exacta. En los reales, cualquier polinomio se puede descomponer en factores de grado 1 (tipo $x - a$) o de grado 2.