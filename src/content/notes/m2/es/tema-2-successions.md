---
title: "Tema 2: Sucesiones"
description: "Definiciones y criterios de convergencia."
order: 2
readTime: "15 min"
subject: "m2"
---

## 1.1 Definición

Imaginemos una lista infinita de números ordenados. Esto es, literalmente, una sucesión. Matemáticamente, la definimos como una aplicación donde a cada número natural ($1, 2, 3...$) le asignamos un número real. Normalmente usamos la letra $a$ y un subíndice $n$: $(a_n) = a_1, a_2, a_3, \dots, a_n, \dots$

Hay tres maneras principales de definirlas, y las debemos saber identificar:

- **Lista:** Nos dan los primeros números y nosotros deducimos la lógica. Ejemplo: $2, 4, 6, 8, \dots$ (pares).
- **Término general:** Es una "máquina" donde pones la $n$ (posición) y te da el valor. Ejemplo: $a_n = \frac{1}{n}$.
Si $n = 1 \rightarrow a_1 = 1$
Si $n = 10 \rightarrow a_{10} = 0.1$
- **Recurrencia:** Nos dan el primer término y una regla para encontrar el siguiente basándose en el anterior. Ejemplo: $a_n = a_{n-1} + a_{n-2}$ (Fibonacci). Necesitamos los anteriores para calcular el nuevo.

## 1.2 Cotas

Antes de ver hacia dónde viaja una sucesión, debemos saber si está "cerrada" o si se va hacia el infinito.

**Cota superior:** Si podemos encontrar un número real $k$ que sea mayor o igual que todos los términos de la sucesión ($a_n \leq k$), decimos que es una cota superior. De todas las cotas superiores posibles, a la más pequeña se le llama **supremo**.

**Cota inferior:** De la misma manera, si un número $k$ siempre se queda por debajo de los términos ($k \leq a_n$), es una cota inferior. La más grande de las cotas inferiores se llama **ínfimo**.

**Sucesión acotada:** Cuando una sucesión tiene tanto cota superior como cota inferior (tiene techo y tiene suelo), decimos que está acotada.

## 2.1 Límites de una sucesión

Si continuamos la lista infinitamente, ¿nos acercamos a algún número concreto? Esto es el **límite**:

*   **Convergentes:** Se acercan cada vez más a un número finito $l$. Un teorema muy importante dice que todas las sucesiones convergentes están acotadas. Ejemplo: $a_n = \frac{1}{n}$. Cuanto mayor es $n$, más cerca de $0$ estamos. Decimos que el límite es $0$.

::mafs{type="successio_1_n"}

*   **Divergentes:** Crecen o decrecen sin parar hacia $\infty$. Ejemplo: $a_n = n^2 \rightarrow 1, 4, 9, 16\dots$ El límite es $+\infty$.
*   **Oscilantes:** Ni se estabilizan ni van al infinito, van saltando. Ejemplo: $a_n = (-1)^n \rightarrow -1, 1, -1, 1\dots$ No tiene límite.

::mafs{type="successio_oscilant"}

**El criterio del sándwich:** Este es muy útil. Si tenemos una sucesión $a_n$ que siempre está atrapada entre otras dos ($b_n \leq a_n \leq c_n$), y resulta que tanto $b_n$ como $c_n$ tienen el mismo límite $l$, entonces $a_n$ por fuerza también tenderá a $l$.

> En caso de un número $a^n$, la progresión geométrica dependerá de la base:
> *   Si $\alpha > 1$: El término se hace infinitamente grande ($2^{10} = 1024$). Límite = $+\infty$.
> *   Si $\alpha = 1$: Tenemos $1^n$, que siempre es 1. Límite = $1$.
> *   Si $-1 < \alpha < 1$: Estamos multiplicando fracciones pequeñas ($0.5^{10} = 0.0009$). Límite = $0$.
> *   Si $\alpha \leq -1$: La sucesión va alternando signos (oscila) y creciendo en valor absoluto o manteniéndose en $1$/$-1$. El límite no existe.
> 
> Si la variable está en la base y el exponente es constante como $n^\alpha$:
> *   Si $\alpha > 0$: Tenemos el infinito elevado a un número positivo. Límite = $+\infty$.
> *   Si $\alpha = 0$: Cualquier número elevado a $0$ es $1$. Límite = $1$.
> *   Si $\alpha < 0$: El exponente negativo invierte la base (sería equivalente a $1/n^{|\alpha|}$). Un número dividido por infinito tiende a cero. Límite = $0$.

## 2.2 Álgebra de límites e indeterminaciones

Cuando sumamos, multiplicamos o dividimos sucesiones, sus límites se comportan de manera bastante previsible si son números finitos. Si $\lim a_n = a$ y $\lim b_n = b$, entonces la suma de los límites es $a \pm b$, y el producto es $a \cdot b$.

Pero, ¿qué pasa si entra en juego el infinito?
*   Sumar un número al infinito no lo cambia: $(+\infty) + l = +\infty$.
*   Multiplicar infinitos da infinito: $(+\infty)(+\infty) = +\infty$.

Ahora bien, hay "choques de infinitos" donde la respuesta no es evidente llamadas **indeterminaciones**. Debemos vigilar especialmente con estos casos:

$$
\frac{\infty}{\infty} \quad \quad \frac{0}{0} \quad \quad \infty - \infty \quad \quad 1^\infty, 0^0, y\ \infty^0
$$

Para los polinomios: si tenemos $\frac{\infty}{\infty}$ formado por polinomios $\frac{P(n)}{Q(n)}$, nos fijamos en los grados.
Si el grado del numerador es mayor, el límite es infinito. Si el del denominador es mayor, el límite es 0. Si son iguales, es la división de sus coeficientes principales.

### A. Jerarquía de infinitos

Cuando tenemos una división de $\frac{\infty}{\infty}$, gana el que crece más rápido: $n! \gg a^n\ (a > 1) \gg n^p \gg \ln(n)$.

$$
\text{Si dividimos } \frac{\text{Rápido}}{\text{Lento}} \rightarrow \infty. \quad \text{Si dividimos } \frac{\text{Lento}}{\text{Rápido}} \rightarrow 0.
$$

*   **Factorial** ($n!$): El más rápido de todos.
*   **Exponencial** ($a^n$): Muy rápido ($2^n$, $e^n$).
*   **Polinomio** ($n^3$, $n^{100}$): Rápido, pero pierde contra los anteriores.
*   **Logaritmo** ($\ln(n)$): El más lento.

### B. El número e y $1^\infty$

Una sucesión es **creciente** si cada término es mayor o igual que el anterior ($a_m \leq a_n$ cuando $m < n$). Es **decreciente** si pasa lo contrario. Las sucesiones que son crecientes o decrecientes se llaman genéricamente **monótonas**.

**Por teorema de la convergencia monótona**, toda sucesión monótona y acotada es obligatoriamente convergente. El mejor ejemplo de ello es la sucesión $a_n = \left(1 + \frac{1}{n}\right)^n$.

Es estrictamente creciente y está atrapada entre el $2$ y el $3$. Como crece pero tiene un techo, choca contra un límite. Este límite es el famosísimo **número de Euler**, denotado por $e$ ($2,71828183$). Este descubrimiento es clave para resolver las indeterminaciones del tipo $1^\infty$.

### C. Criterios de la raíz y del cociente

Finalmente, ¿cómo calculamos límites más extraños si no tenemos ni polinomios ni sumas sencillas? Tenemos dos grandes herramientas de diagnóstico:

1.  **Criterio de la raíz:** Calculamos el límite de la raíz n-ésima del valor absoluto del término: $\lim_n \sqrt[n]{|a_n|} = L$.
    *   Si $L < 1$, el límite original de $a_n$ es $0$.
    *   Si $L > 1$, la sucesión se escapa hacia el infinito ($\lim_n |a_n| = +\infty$).

2.  **Criterio del cociente:** Si no nos gustan las raíces, podemos tomar un término y dividirlo por el anterior: $\lim_n \frac{|a_n|}{|a_{n-1}|} = L$. Los resultados funcionan exactamente igual: si da menor a 1 converge a 0, y si es mayor a 1 diverge.

El **criterio raíz-cociente** nos avisa de que si el criterio del cociente da un resultado $L$, el de la raíz dará exactamente el mismo $L$. Sin embargo, debéis tener cuidado: podría darse el caso de que el límite de la raíz exista pero el del cociente no se pueda calcular.

### D. Criterio del sándwich

Imaginemos una sucesión complicada atrapada entre dos fáciles. Si la 'pequeña' y la 'grande' van al mismo lugar, la del medio también. Esto es vital para sumas de raíces como esta:

$$
b_n = \frac{1}{\sqrt{n^2 + 1}} + \dots + \frac{1}{\sqrt{n^2 + n}}
$$

1.  Identificamos el término más pequeño $\frac{1}{\sqrt{n^2 + n}}$ y el más grande $\frac{1}{\sqrt{n^2 + 1}}$.
2.  Acotamos sustituyendo todos los sumandos por el pequeño y todos por el grande: $n \cdot \frac{1}{\sqrt{n^2 + n}} \leq b_n \leq n \cdot \frac{1}{\sqrt{n^2 + 1}}$.
3.  Como los extremos tienden a $1$, entonces $\lim b_n = 1$.

> **Casos prácticos y ejemplos representativos**
>
>  Cuando te encuentras con la división de raíces o polinomios hay que atender a los siguientes casos: 
> Si tenemos $\frac{6n^3 + 4n + 1}{2n}$, es una indeterminación $\frac{\infty}{\infty}$. Como el grado del numerador es 3 y el del denominador 1, gana la vía hacia el infinito. El límite es $+\infty$.
> Por el contrario, en $\frac{n^2 - 6n - 2}{3n^2 - 9n}$, los grados son idénticos. Entonces se evalúa la división del coeficiente de arriba contra el del denominador, tenemos $\frac{1}{3}$.
> O bien un número como $\sqrt[n]{n}$ da $\infty^0$ y usualmente sabemos que se resuelve como 1.
> Para raíces como $\left(\sqrt{\frac{n+1}{2n+1}}\right)^{\frac{2n-1}{3n-1}}$, tomamos la base que es coeficiente en raíz $\sqrt{\frac{1}{2}}$ y exponente que es $\frac{2}{3}$. Se evaluará $\sqrt[3]{\frac{1}{2}}$.
>  
> Cuando hay sumatorios masivos hará falta el sándwich:
>  Analizando $\frac{1}{\sqrt{n^2 + 1}} + \frac{1}{\sqrt{n^2 + 2}} + \dots + \frac{1}{\sqrt{n^2 + n}}$, construimos acotando a nivel de raíces:
>  Límite superior $n \cdot \frac{1}{\sqrt{n^2 + 1}}$ y Límite Inferior $n \cdot \frac{1}{\sqrt{n^2 + n}}$. Como ambos desembocan de manera de grados iguales a $1$, la respuesta a la sucesión atrapada en medio del sándwich será 1.
>
> También aplica lo rápido y lento que hemos visto sobre las **jerarquías**: En  $\lim_{n \rightarrow +\infty} \frac{a^n}{n!}$ siendo $a=10$, para n grandes el factorial de n aplasta a la exponencial y la hace 0. Todo va determinado bajo $\frac{\text{Lento}}{\text{Rápido}} \rightarrow 0$.
>
> Y referente a trigonométricas, como en $\frac{\cos n}{n^2}$, debido a que $\cos$ estará comprendido y acotado por valores entre -1 y 1, acaba dividiendo por algo enorme como $n^2$, entonces forzosamente se orienta hacia $0$. Y para indeterminación de exponenciales $\frac{2^n + 3^n}{2^n - 3^n}$ tomamos quien lidera: Al elevar con elemento predominante encontraremos fracciones con elevados en 0. Siendo la resolución final $-1$. Este sería el caso equivalente como las constantes $\left(\frac{n+2}{n-3}\right)^{\frac{2n-1}{5}}$ que hay que aplicar regla de Euler como $e^{b_n \cdot (a_n - 1)}$ con resultado de $e^2$.
> Resta de raíces se solventa como lo explicado por el conjugado: $(\sqrt{n+1} - \sqrt{n})\sqrt{\frac{n+1}{2}}$, que como método nos lleva a $\frac{\sqrt{2}}{4}$. Y problemas recurrentes donde pone ej. $a_{n+1} = ...$ piden escribir la iteración del límite bajo la relación encontrada.