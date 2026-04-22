---
title: "Tema 3: Continuidad"
description: "Teoremas fundamentales de las funciones continuas: Bolzano, Weierstrass y el Valor Intermedio."
order: 3
readTime: "20 min"
subject: "m2"
---

## 1. Función (Repaso FM)
Pensemos en una función como si fuera una máquina: tú introduces un número (la materia prima), la máquina hace una operación, y te devuelve otro número (el producto acabado).

Formalmente, una función real de variable real es una aplicación $f: D \to \mathbb{R}$, donde $D$ es un subconjunto de los números reales denotado como dominio de $f$. El elemento $y$ es la imagen de $x$, y la $x$ es la antiimagen de $y$.

## 2. Límite de una función
El límite de una función $f$ en un punto $a$ es un número real $l$ al cual se acercan los valores de la función cuando nos acercamos a $a$. Se escribe como $\lim_{x \to a} f(x) = l$.

### Límites laterales
Para que el límite global exista, los dos límites laterales deben existir y ser iguales:
$$\lim_{x \to a} f(x) = l \iff \lim_{x \to a^+} f(x) = \lim_{x \to a^-} f(x) = l$$

## 3. Continuidad: dibujar sin levantar el lápiz
Para que una función sea "continua" en un punto $a$, se deben cumplir tres reglas:
1. Debe existir el límite: $l = \lim_{x \to a} f(x)$.
2. El punto debe ser válido: $a \in D$.
3. El límite y el valor de la función deben coincidir: $l = f(a)$.

### Discontinuidades
- **Evitable:** Existe el límite, pero falla la condición 2 o 3.
- **Esencial:** No existe el límite (salto infinito o saltos laterales diferentes).

## 4. Teoremas fundamentales

:::mafs{type="teorema_bolzano"}
:::

### Teorema de Bolzano
Si una función es continua en un intervalo cerrado $[a, b]$ y en los extremos cambia de signo ($f(a) \cdot f(b) < 0$), entonces existe al menos un punto $c \in (a, b)$ tal que $f(c) = 0$.

### Teorema de Weierstrass
Toda función continua en un intervalo cerrado $[a, b]$ tiene garantizado un punto máximo absoluto $M$ y un mínimo absoluto $m$ dentro de este intervalo.

## 5. Resolución aproximada de ecuaciones

### Método de la bisección
Se basa en dividir el intervalo por la mitad sucesivamente. Si $f(a) \cdot f(b) < 0$, calculamos el punto medio $c_1 = \frac{a+b}{2}$.
- Si $f(a) \cdot f(c_1) < 0$, la raíz está en $[a, c_1]$.
- Si $f(c_1) \cdot f(b) < 0$, la raíz está en $[c_1, b]$.

::videoviz{url="/m2/biseccio.webm" delay="2000"}

### Método de la secante
Utiliza una línea recta que une $x_0$ y $x_1$ para aproximar el cero:
$$x_{n+1} = x_n - \frac{x_n - x_{n-1}}{f(x_n) - f(x_{n-1})} f(x_n)$$

::videoviz{url="/m2/secant.webm" delay="2000"}

### Método de Newton-Raphson
Requiere la derivada de la función y utiliza la recta tangente:
$$x_{n+1} = x_n - \frac{f(x_n)}{f'(x_n)}$$

::videoviz{url="/m2/tangent.webm" delay="2000"}