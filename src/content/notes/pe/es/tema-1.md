---
title: "Tema 1: Probabilidad y VAs"
description: "Probabilidad, Bayes, variables aleatorias discretas y continuas, indicadores y distribuciones bivariantes."
readTime: "30 min"
order: 1
draft: false
---

La teoría de la probabilidad proporciona el marco matemático formal para cuantificar la incertidumbre y modelar experimentos cuyo resultado no se puede predecir con certeza absoluta.

## 1. Experimento aleatorio y definiciones

### Fenómenos deterministas vs. aleatorios
Dentro del método científico y la ingeniería distinguimos dos tipos de fenómenos:

- **Fenómenos deterministas**: Conducen exactamente a los mismos resultados cuando se reproducen a partir de unas mismas condiciones iniciales conocidas.
  - *Ejemplo*: Si ponemos la mano en el fuego, nos quemaremos; o calcular el resultado de una suma $2 + 2$ en una máquina.
- **Fenómenos aleatorios**: Presentan una incertidumbre intrínseca sobre el resultado de una próxima realización del experimento, incluso manteniendo las condiciones de partida.
  - *Ejemplo*: Lanzar un dado equilibrado de seis caras; no podemos predecir con certeza qué número saldrá.

### Espacio muestral ($\Omega$)
El **espacio muestral** ($\Omega$) es el conjunto de **todos los resultados posibles** de un experimento o experiencia aleatoria:
$$
\Omega = \{\omega_1, \omega_2, \dots\}
$$

Ejemplos:
- **Lanzamiento de un dado de 6 caras**: $\Omega = \{1, 2, 3, 4, 5, 6\}$.
- **Lanzamiento de dos monedas**: $\Omega = \{(\text{cara}, \text{cara}),\, (\text{cara}, \text{cruz}),\, (\text{cruz}, \text{cara}),\, (\text{cruz}, \text{cruz})\}$.
- **Recuento discreto (procesos de llegada, peticiones a un servidor)**: $\Omega = \{0, 1, 2, 3, \dots\}$.

### Sucesos o eventos
Un **suceso** o **evento** es cualquier subconjunto del espacio muestral ($A \subseteq \Omega$):
- **Suceso elemental**: Conjunto formado por un solo resultado individual $\{\omega_i\}$.
- **Suceso seguro**: Coincide con todo el espacio muestral $\Omega$. Siempre ocurre ($P(\Omega) = 1$).
- **Suceso imposible**: Conjunto vacío $\emptyset$. Nunca se puede producir ($P(\emptyset) = 0$).

---

## 2. Álgebra de sucesos y operaciones de conjuntos

Dado que los sucesos son subconjuntos de $\Omega$, se les aplican directamente todas las operaciones de la teoría de conjuntos. El resultado de cualquier operación es otro suceso.

| Operación | Notación | Significado probabilístico | Diagrama de Venn |
| :--- | :---: | :--- | :---: |
| **Unión** | $A \cup B$ | Ocurre $A$, ocurre $B$ u ocurren ambos («al menos uno») | :vennviz{op="union"} |
| **Intersección** | $A \cap B$ | Ocurren $A$ y $B$ simultáneamente | :vennviz{op="intersection"} |
| **Complementario** | $\neg A$ o $\overline{A}$ | No ocurre el suceso $A$ | :vennviz{op="complement_a"} |
| **Diferencia** | $A \setminus B$ o $A - B$ | Ocurre $A$ pero **no** ocurre $B$ ($A \cap \neg B$) | :vennviz{op="diff_a_b"} |

:::vennviz
:::

Dos conjuntos o sucesos $A$ y $B$ son **disjuntos** o **incompatibles** si su intersección es vacía:
$$
A \cap B = \emptyset
$$
Esto implica que no pueden producirse simultáneamente en una misma realización del experimento (sus círculos en el diagrama de Venn no se tocan).

### Leyes de De Morgan
Permiten transformar la negación de uniones e intersecciones:
1. $\neg(A \cup B) = \neg A \cap \neg B$ («Ni $A$ ni $B$»)
2. $\neg(A \cap B) = \neg A \cup \neg B$ («Como mínimo uno de los dos no ocurre»)

### Partición del espacio muestral
Una familia finita de sucesos $\{A_1, A_2, \dots, A_n\}$ constituye una **partición** del espacio muestral $\Omega$ si y solo si cumple tres condiciones indispensables:

1. **No vacíos**: $A_i \neq \emptyset$ para todo $i \in \{1, \dots, n\}$.
2. **Disjuntos dos a dos**: $A_i \cap A_j = \emptyset$ para todo $i \neq j$.
3. **Unión exhaustiva**: $\bigcup_{i=1}^n A_i = \Omega$ (recubren todo el espacio muestral).

En el lanzamiento de un dado de 6 caras:
- $A_1 = \text{«salir par»} = \{2, 4, 6\}$
- $A_2 = \text{«salir impar»} = \{1, 3, 5\}$

Como $A_1 \cap A_2 = \emptyset$ y $A_1 \cup A_2 = \Omega$, los sucesos $\{A_1, A_2\}$ forman una partición de $\Omega$. Dos conjuntos $A$ y $\neg A$ siempre forman una partición del espacio muestral.

---

## 3. Axiomas de la probabilidad y propiedades deducidas

Para cuantificar la incertidumbre se define una función o aplicación $P: \mathcal{P}(\Omega) \to \mathbb{R}$ que asigna a cada suceso $A$ un número real llamado **probabilidad**. Por definición, la medida de probabilidad debe satisfacer los tres axiomas de Kolmogórov:

1. **No-negatividad y acotación**:
   $$0 \le P(A) \le 1 \quad \forall A \subseteq \Omega$$
2. **Certeza del espacio muestral**:
   $$P(\Omega) = 1$$
3. **Aditividad para sucesos disjuntos**: Si $A_i \cap A_j = \emptyset$ para todo $i \neq j$, entonces:
   $$P(A_1 \cup A_2 \cup \dots \cup A_n) = P(A_1) + P(A_2) + \dots + P(A_n)$$

A partir de estos axiomas se derivan directamente las siguientes propiedades fundamentales:

- **Probabilidad del suceso contrario**:
  $$P(\neg A) = 1 - P(A)$$
- **Probabilidad del suceso imposible**:
  $$P(\emptyset) = 0$$
- **Monotonía**: Si un suceso está contenido en otro ($A \subseteq B$), su probabilidad no puede ser mayor:
  $$A \subseteq B \implies P(A) \le P(B)$$
- **Principio de inclusión-exclusión (para 2 sucesos)**:
  $$P(A \cup B) = P(A) + P(B) - P(A \cap B)$$
- **Principio de inclusión-exclusión (para 3 sucesos)**:
  $$P(A \cup B \cup C) = P(A) + P(B) + P(C) - P(A \cap B) - P(A \cap C) - P(B \cap C) + P(A \cap B \cap C)$$

### Regla de Laplace (resultados equiprobables)
Cuando un experimento aleatorio tiene un número finito de resultados posibles y todos ellos son **equiprobables** (tienen exactamente la misma probabilidad de ocurrir), la probabilidad de un suceso $A$ se calcula como:
$$
P(A) = \frac{\text{casos favorables}}{\text{casos totales}}
$$

---

## 4. Probabilidad condicionada

La **probabilidad condicionada** mide cómo cambia la probabilidad de un suceso cuando disponemos de información previa sobre la realización de otro suceso. Denotamos $P(A \mid B)$ la probabilidad de observar $A$ sabiendo que se ha producido el suceso $B$ (se lee «probabilidad de $A$ dado $B$» o «probabilidad de $A$ condicionada por $B$»).

Si $P(B) > 0$, la probabilidad condicionada se define como:
$$
P(A \mid B) = \frac{P(A \cap B)}{P(B)}
$$

En la práctica, condicionar por $B$ significa **reducir el universo de resultados observables al conjunto $B$**. Todos los resultados fuera de $B$ pasan a ser imposibles, y las probabilidades de los subconjuntos de $A$ se reescalan dividiendo por el peso total de $B$. Al evaluar $P(A \mid B)$, los dos sucesos desempeñan roles completamente asimétricos: **$A$ es incierto**, mientras que **$B$ es un dato conocido o asumido como cierto**.

En general:
$$P(A \mid B) \neq P(B \mid A) \neq P(A \cap B)$$

Si definimos $A = \text{«Fumar»}$ y $B = \text{«Tener cáncer de pulmón»}$, la probabilidad de ser fumador si ya se ha diagnosticado cáncer de pulmón es muy elevada ($P(A \mid B) \approx 0{,}85$); en cambio, la probabilidad de tener cáncer de pulmón sabiendo que una persona fuma es mucho menor ($P(B \mid A) \approx 0{,}10$). Confundir ambas magnitudes es una falacia clásica.

La información que aporta la ocurrencia de $B$ sobre $A$ puede tener tres efectos:
- **Favorece** ($B$ aumenta la probabilidad de $A$): $P(A \mid B) > P(A)$.
- **Desfavorece** ($B$ disminuye la probabilidad de $A$): $P(A \mid B) < P(A)$.
- **Indiferente** ($B$ no aporta información sobre $A$): $P(A \mid B) = P(A)$.

### Inversión de la desigualdad
Cuando comparamos los tamaños marginales de dos sucesos $A$ y $B$:
$$
P(A) > P(B) \implies \frac{1}{P(A)} < \frac{1}{P(B)} \implies \frac{P(A \cap B)}{P(A)} < \frac{P(A \cap B)}{P(B)} \implies P(B \mid A) < P(A \mid B)
$$

Sean $A = \text{«Ser estudiante universitario»}$ y $B = \text{«Ser estudiante de la FIB»}$.  
Como hay muchos más universitarios que estudiantes de la FIB, tenemos $P(A) > P(B)$.
- Si alguien es estudiante de la FIB ($B$), es seguro que es universitario: $P(A \mid B) = 1$.
- Si elegimos un universitario cualquiera al azar ($A$), la probabilidad de que sea precisamente de la FIB es muy baja: $P(B \mid A) \approx 0{,}02$.
- Se cumple la regla de inversión: $P(B \mid A) < P(A \mid B)$.

---

## 5. Teorema de Bayes

A partir de la definición de probabilidad condicionada podemos despejar la probabilidad de la intersección (regla del producto):
$$
P(A \cap B) = P(A \mid B) \cdot P(B)
$$

Dado que la intersección es conmutativa ($A \cap B = B \cap A$):
$$
P(B \cap A) = P(B \mid A) \cdot P(A)
$$

Igualando ambas expresiones:
$$
P(B \mid A) \cdot P(A) = P(A \mid B) \cdot P(B)
$$

Despejando la probabilidad condicionada inversa obtenemos la **fórmula de Bayes para dos sucesos**:
$$
P(B \mid A) = \frac{P(A \mid B) \cdot P(B)}{P(A)}
$$

Esta relación fundamental permite pasar de la probabilidad directa $P(A \mid B)$ a la probabilidad inversa $P(B \mid A)$ (revertir la relación entre causa y efecto).

---

## 6. Independencia de sucesos

Dos sucesos son **estadísticamente independientes** si la ocurrencia de uno no aporta ninguna información sobre la ocurrencia del otro ni modifica su probabilidad de ocurrir.

### Definición formal
Dos sucesos $A$ y $B$ son independientes si y solo si la probabilidad de su intersección es igual al producto de sus probabilidades marginales:
$$A \text{ y } B \text{ independientes} \iff P(A \cap B) = P(A) \cdot P(B)$$

### Condiciones equivalentes
Si $P(A) > 0$ y $P(B) > 0$, las siguientes afirmaciones son completamente equivalentes:
1. $P(A \cap B) = P(A) \cdot P(B)$
2. $P(A \mid B) = P(A)$
3. $P(B \mid A) = P(B)$
4. $P(B \mid A) = P(B \mid \neg A) = P(B)$

Si alguna de estas igualdades no se cumple, los sucesos son **dependientes** ($P(B \mid A) \neq P(B)$).

- **Ejemplo independiente**: Al lanzar una moneda dos veces, que salga cara en la 1.ª tirada ($C_1$) no cambia la probabilidad de sacar cara en la 2.ª ($C_2$): $P(C_2 \mid C_1) = P(C_2) = \frac{1}{2} \implies P(C_1 \cap C_2) = \frac{1}{2} \cdot \frac{1}{2} = \frac{1}{4}$.
- **Ejemplo dependiente**: Extraer cartas de una baraja **sin reemplazo**. La composición de la baraja para la 2.ª carta depende de qué carta se extrajo primero.

Es un error muy frecuente confundir que dos sucesos sean disjuntos con que sean independientes:
- **Disjuntos (incompatibles)**: $A \cap B = \emptyset \implies P(A \cap B) = 0$.
- **Independientes**: Exige $P(A \cap B) = P(A) \cdot P(B) > 0$.

Dos sucesos disjuntos con probabilidades estrictamente positivas ($P(A) > 0$ y $P(B) > 0$) **¡NUNCA pueden ser independientes!** Si son disjuntos y sabemos que ha ocurrido $A$, tenemos la certeza absoluta de que no puede haber ocurrido $B$ ($P(B \mid A) = 0 \neq P(B)$); por tanto, la ocurrencia de $A$ proporciona la máxima información posible sobre $B$.

---

## 7. Herramientas de representación: árboles de probabilidad y tablas de contingencia

Para analizar experimentos compuestos y estructurar los datos de un problema se utilizan habitualmente dos herramientas gráficas complementarias.

### 7.1 Árboles de sucesos y probabilidades
Un árbol de probabilidad desglosa un experimento en etapas secuenciales:
- **Nivel 1 (Raíz $\to$ primer nivel)**: Contiene las probabilidades **marginales** de los sucesos iniciales ($P(A)$ y $P(\neg A)$).
- **Nivel 2 (Ramas interiores)**: Contiene **siempre probabilidades condicionadas**, nunca probabilidades conjuntas.
- **Hojas terminales (regla del producto)**: La probabilidad conjunta del camino completo desde la raíz hasta una hoja se obtiene multiplicando las probabilidades de todas las ramas del camino:
  $$P(A \cap B) = P(A) \cdot P(B \mid A)$$

:::probtreeviz
:::

- **Si $A$ y $B$ son independientes**: Las ramas del segundo nivel no dependen del camino de origen; valen directamente $P(B)$ y $P(\neg B)$:
  $$P(A \cap B) = P(A) \cdot P(B)$$
- **Si $A$ y $B$ NO son independientes**: Las probabilidades de las ramas del segundo nivel están condicionadas al nodo padre: $P(B \mid A) \neq P(B \mid \neg A)$.

La suma de todas las hojas terminales del árbol es siempre igual a $1$:
$$\sum \text{Hojas} = P(A \cap B) + P(A \cap \neg B) + P(\neg A \cap B) + P(\neg A \cap \neg B) = 1$$

---

### 7.2 Tabla de contingencia ($2 \times 2$ de probabilidades)
Una tabla de contingencia cruza dos sucesos binarios ($A$ y $B$):

| Suceso | $B$ | $\neg B$ | **Marginal ($A$)** |
| :---: | :---: | :---: | :---: |
| **$A$** | $P(A \cap B)$ | $P(A \cap \neg B)$ | **$P(A)$** |
| **$\neg A$** | $P(\neg A \cap B)$ | $P(\neg A \cap \neg B)$ | **$P(\neg A)$** |
| **Marginal ($B$)** | **$P(B)$** | **$P(\neg B)$** | **$1{,}00$** |

1. **Celdas interiores (4 celdas)**: Contienen las probabilidades **conjuntas** de ambos sucesos ($P(A \cap B)$, etc.). La suma de las 4 celdas interiores vale $1$.
2. **Márgenes (última fila y última columna)**: Contienen las probabilidades **marginales** ($P(A), P(\neg A), P(B), P(\neg B)$), obtenidas sumando las filas o columnas correspondientes mediante el Teorema de la Probabilidad Total.
3. **Cálculo de probabilidades condicionadas**: Se obtienen dividiendo la celda conjunta por el total del margen condicionante:
   - Condicionada sobre la fila $A$:
     $$P(B \mid A) = \frac{P(A \cap B)}{P(A)}$$
   - Condicionada sobre la columna $B$:
     $$P(A \mid B) = \frac{P(A \cap B)}{P(B)}$$

Para comprobar si $A$ y $B$ son independientes observando una tabla de contingencia, basta con verificar si **cada celda interior es exactamente igual al producto de sus dos márgenes**:
$$P(A \cap B) \stackrel{?}{=} P(A) \cdot P(B)$$
Si la igualdad se cumple en todas las celdas, existe **independencia estadística**. Si tan solo una celda no la cumple, los sucesos son **dependientes**.

---

## 8. Variables aleatorias

### 8.1 Motivación conceptual: De conjuntos a la recta real

Hasta ahora definíamos la probabilidad sobre subconjuntos del espacio muestral ($A \subseteq \Omega$). Ahora bien, con conjuntos solo podemos realizar operaciones de teoría de conjuntos (uniones $A \cup B$, intersecciones $A \cap B$, complementarios $\overline{A}$). **Los conjuntos no se pueden sumar, restar, multiplicar, derivar ni integrar**.

Al definir una **variable aleatoria** como una función $X: \Omega \to \mathbb{R}$, asignamos a cada suceso elemental $\omega \in \Omega$ un valor numérico real $X(\omega)$. Al incorporar esta capa numérica pasamos de un dominio abstracto a la recta real: ahora podemos emplear todo el potencial del álgebra, desigualdades, límites, derivadas e integrales.

Según la naturaleza de los valores que puede tomar $X$, distinguimos dos grandes tipos:
- **Variable Aleatoria Discreta (VAD)**: El conjunto de valores posibles es finito o numerable (ejemplos: resultado de un dado $\{1, 2, 3, 4, 5, 6\}$, número de peticiones que llegan a un servidor $\{0, 1, 2, \dots\}$). Se calcula mediante **sumatorios ordinarios** ($\sum$).
- **Variable Aleatoria Continua (VAC)**: Toma valores en un continuo no numerable de la recta real (ejemplos: tiempo de ejecución de un algoritmo, memoria consumida, tiempo de espera en una cola, temperatura). Aquí no podemos listar los valores uno a uno; es necesario dar el salto conceptual a las **integrales** ($\int$).

---

### 8.2 Variables Aleatorias Discretas (VAD)

Sea $X$ una variable aleatoria discreta que toma valores en el conjunto $\{x_1, x_2, \dots\}$. Definimos:

**Función de probabilidad puntual ($p_X(k)$)**  
Asigna directamente la probabilidad exacta a cada valor posible individual $k$:
$$
p_X(k) = P(X = k)
$$

Debe cumplir dos condiciones fundamentales:
1. $0 \le p_X(k) \le 1$ para todo $k$.
2. La suma total de todas las probabilidades debe ser exactamente 1:
   $$\sum_k p_X(k) = 1$$

Se representa gráficamente mediante un **gráfico de barras**: cada barra situada sobre el valor $k$ tiene una altura igual a $p_X(k)$. **Es una altura pura, no es un área**.

**Función de distribución acumulada ($F_X(x)$)**  
Mide la probabilidad acumulada de todos los valores menores o iguales a un punto $x$:
$$
F_X(x) = P(X \le x) = \sum_{k \le x} p_X(k)
$$

Propiedades de $F_X(x)$ en VAD:
- Es una función **escalonada creciente a trozos**, con saltos verticales en cada valor posible $k$.
- El tamaño del salto vertical en cada valor $k$ es exactamente la probabilidad puntual de ese punto:
  $$\Delta F = p_X(k) = F_X(k) - F_X(k^-)$$
- Límites en los extremos: $\lim_{x \to -\infty} F_X(x) = 0$ y $\lim_{x \to +\infty} F_X(x) = 1$.

En variables discretas, las desigualdades estrictas excluyen valores de la suma:
$$P(a < X \le b) = \sum_{k=a+1}^b p_X(k) \quad \neq \quad P(a \le X \le b) = \sum_{k=a}^b p_X(k)$$

*Ejemplo*: En un dado de 6 caras equiprobable ($p_X(k) = 1/6$):
- $P(2 < X \le 5) = P(X \in \{3, 4, 5\}) = \frac{3}{6} = 0{,}50$
- $P(2 \le X \le 5) = P(X \in \{2, 3, 4, 5\}) = \frac{4}{6} \approx 0{,}67$

---

### 8.3 Variables Aleatorias Continuas (VAC)

Sea $X$ una variable aleatoria continua que toma valores en un intervalo o región de la recta real ($X(\Omega) \subseteq \mathbb{R}$).

**Función de densidad de probabilidad ($f_X(x)$)**  
Describe cómo se reparte la masa de probabilidad sobre la recta real. Para que una función pueda ser una función de densidad válida debe satisfacer **obligatoriamente dos condiciones**:
1. **No-negatividad**: $f_X(x) \ge 0 \quad \forall x \in \mathbb{R}$ (no tiene sentido una densidad negativa).
2. **Área total bajo la curva igual a 1**:
   $$\int_{-\infty}^{+\infty} f_X(x)\,dx = 1$$

A diferencia de las discretas, la probabilidad en una variable continua es **siempre el ÁREA bajo la curva de densidad**:
$$
P(a \le X \le b) = \int_a^b f_X(x)\,dx
$$

Interpretación infinitesimal: Cada rectángulo de Riemann tiene una base infinitesimal $dx$ y una altura $f_X(x)$, de modo que la probabilidad infinitesimal de un tramo elemental es:
$$d\text{Área} = f_X(x)\,dx$$

**Función de distribución acumulada ($F_X(x)$) y la Regla de Barrow**  
En la práctica, no resolvemos integrales definidas directamente mediante sumas infinitesimales: usamos la primitiva mediante la **función de distribución**:
$$
F_X(x) = P(X \le x) = \int_{-\infty}^x f_X(t)\,dt
$$

Por el Teorema Fundamental del Cálculo (TFC), la derivada de la función de distribución es la función de densidad:
$$
f_X(x) = \frac{d F_X(x)}{dx} = F_X'(x)
$$
*(La pendiente de la curva acumulada $F_X(x)$ en cada punto es la densidad $f_X(x)$).*

Por lo tanto, calcular la probabilidad de cualquier intervalo en VAC es tan sencillo como aplicar la **Regla de Barrow**, evaluando la función de distribución en los extremos:
$$
P(a \le X \le b) = \int_a^b f_X(x)\,dx = F_X(b) - F_X(a)
$$

1. **Evaluar $f_X(x)$ NO es una probabilidad**: $f_X(x)$ representa la densidad (altura de la curva) y puede ser perfectamente superior a 1 (por ejemplo, una distribución uniforme en $[0, 0{,}2]$ tiene altura $f_X(x) = 5$). En VAC la probabilidad siempre es un área (integrales $\int$ o diferencias de distribución $F_X(b) - F_X(a)$). Evaluar $f_X(k)$ nunca da $P(X = k)$.
2. **La probabilidad de un punto exacto es siempre CERO ($P(X = k) = 0$)**: La integral en un intervalo degenerado de anchura cero no encierra ningún área:
   $$P(X = k) = \int_k^k f_X(x)\,dx = 0$$
3. **Desigualdades estrictas y no estrictas son completamente EQUIVALENTES**: Como la probabilidad de cada punto aislado es nula, incluir o excluir los extremos no altera el valor del área:
   $$P(a \le X \le b) = P(a < X \le b) = P(a \le X < b) = P(a < X < b) = F_X(b) - F_X(a)$$

---

### 8.4 Tabla comparativa exhaustiva: VAD vs. VAC

| Concepto | Variable Discreta (VAD) | Variable Continua (VAC) |
| :--- | :--- | :--- |
| **Valores posibles** | Finito o numerable (puntos aislados: $\{1, 2, 3, \dots\}$) | Continuo / No numerable (intervalos de $\mathbb{R}$) |
| **Herramienta de cálculo** | Sumatorios ordinarios ($\sum$) | Integrales / Cálculo infinitesimal ($\int$) |
| **Función descriptiva** | **Función de probabilidad** $p_X(k) = P(X = k)$ | **Función de densidad** $f_X(x)$ (altura de la curva) |
| **Normalización** | $\sum_k p_X(k) = 1$ | $\int_{-\infty}^{+\infty} f_X(x)\,dx = 1$ (Área total $= 1$) |
| **Probabilidad puntual** | $P(X = k) = p_X(k) \in [0, 1]$ | $\mathbf{P(X = k) = 0}$ (área de un punto $= 0$) |
| **Desigualdades** | **Los extremos cuentan:** $P(X \le k) \neq P(X < k)$ | **Los extremos no alteran:** $P(X \le x) = P(X < x)$ |
| **Función de distribución** | $F_X(x) = \sum_{k \le x} p_X(k)$ *(escalones a trozos)* | $F_X(x) = \int_{-\infty}^x f_X(t)\,dt$ *(curva continua suave)* |
| **Cálculo de un intervalo** | $P(a \le X \le b) = \sum_{k=a}^b p_X(k)$ | $P(a \le X \le b) = \int_a^b f_X(x)\,dx = F_X(b) - F_X(a)$ |
| **Paso de distribución a base** | $p_X(k) = F_X(k) - F_X(k^-)$ *(tamaño del salto)* | $f_X(x) = \frac{d F_X(x)}{dx}$ *(derivada / pendiente)* |

---

### 8.5 Cuantiles (El problema inverso)

Dado un nivel de probabilidad $\alpha \in [0, 1]$, el **cuantil $\alpha$** de $X$ (denotado $x_\alpha$) es el valor umbral que acumula exactamente una probabilidad igual a $\alpha$:
$$
F_X(x_\alpha) = P(X \le x_\alpha) = \alpha \iff x_\alpha = F_X^{-1}(\alpha)
$$

> *«$x_\alpha$ es el valor umbral tal que la probabilidad acumulada de que la variable no lo supere ($X \le x_\alpha$) es exactamente $\alpha$, calculado invirtiendo la función $F_X^{-1}(\alpha)$»*

Es el **problema inverso** al cálculo de probabilidades acumuladas: en lugar de buscar $p = F_X(x)$ a partir de un valor $x$, fijamos la fracción deseada $\alpha$ y determinamos el umbral $x_\alpha$ resolviendo la ecuación $F_X(x) = \alpha$.

**Casos particulares:**
- **Mediana ($M = x_{0{,}50} = P_{50}$):** Divide la distribución en dos mitades iguales ($50\%$).
- **Cuartiles:** Dividen la distribución en cuatro partes:
  - Primer cuartil: $Q_1 = x_{0{,}25}$
  - Segundo cuartil (mediana): $Q_2 = M = x_{0{,}50}$
  - Tercer cuartil: $Q_3 = x_{0{,}75}$
- **Percentiles:** Dividen la distribución en cien partes ($P_k = x_{k/100}$, por ejemplo $P_{90} = x_{0{,}90}$).

---

### 8.6 Indicadores en variables aleatorias

Para caracterizar numéricamente una variable aleatoria sin depender de toda la distribución funcional, definimos indicadores de **tendencia central** (valores típicos) y de **dispersión** (concentración respecto a la media).

**Probabilidad (Modelo teórico / Población) vs. Estadística (Datos empíricos / Muestra)**

| Concepto | Probabilidad (Población / Modelo teórico) | Estadística (Muestra empírica) |
| :--- | :--- | :--- |
| **Ámbito** | Espacio $\Omega$ completo (censo, dado ideal). | Conjunto de $n$ observaciones reales. |
| **Pesos** | Probabilidad teórica exacta: $p_i = P(X=x_i)$. | Frecuencia relativa observada: $f_i = n_i / n$. |
| **Tendencia central** | **Esperanza:** $\mu_X = E(X)$ (parámetro teórico fijo). | **Media muestral:** $\overline{x} = \frac{1}{n}\sum x_i$ (fluctúa en cada muestra). |
| **Dispersión** | **Varianza:** $\sigma_X^2 = V(X)$ \quad y \quad Desv. $\sigma_X$. | **Varianza muestral:** $s_x^2$ \quad y \quad Desviación muestral $s_x$. |
| **Conexión** | Modelo teórico (del parámetro $\mu,\sigma$ a la probabilidad). | **Inferencia:** de la muestra ($\overline{x}, s$) se estiman $\mu$ y $\sigma$. |

**Medida de tendencia central: Esperanza matemática ($\mu_X = E(X)$)**  
Condensa la distribución en un único valor típico ponderado:
$$
\mu_X = E(X) = \sum_{\forall k} k \cdot p_X(k) \quad \text{(VAD)} \qquad \int_{-\infty}^{+\infty} x \cdot f_X(x)\,dx \quad \text{(VAC)}
$$

Físicamente es el **centro de gravedad o punto de equilibrio** de los pesos de probabilidad (por ejemplo: en un dado equilibrado de 6 caras, $E(X) = \frac{21}{6} = \mathbf{3{,}5}$).

**Insuficiencia del valor central:** Conjuntos de datos completamente distintos (como las notas $\{5,5,5\}$, $\{4,5,6\}$ o $\{0,5,10\}$) comparten la misma media ($5$). Un valor central nunca es suficiente por sí solo; debe acompañarse siempre de una medida de **dispersión**.

**Medida de dispersión: Varianza ($V(X)$ o $\sigma_X^2$) y Desviación típica ($\sigma_X$)**  
Cuantifican el grado de concentración o alejamiento de los valores respecto a la media $\mu = E(X)$:
- **Varianza ($V(X)$ o $\sigma_X^2$):** Mide la dispersión al cuadrado (unidades$^2$, por ejemplo $\text{minutos}^2$ o $\text{euros}^2$).
- **Desviación típica ($\sigma_X = \sqrt{V(X)}$):** Raíz cuadrada de la varianza; **recupera las unidades originales** (por ejemplo $\text{minutos}$ o $\text{euros}$), midiendo la dispersión en la escala real.

**Fórmula operativa (Relación de Koenig):**
$$
\mathbf{V(X) = E(X^2) - [E(X)]^2} \qquad \text{y} \qquad \mathbf{\sigma_X = \sqrt{V(X)}}
$$

> *«La varianza $V(X)$ es la media de los cuadrados $E(X^2)$ menos el cuadrado de la media $[E(X)]^2$, y la desviación $\sigma_X$ es su raíz para regresar a las unidades originales»*

**Cálculo paso a paso:**
1. **1.er Paso (Esperanza):** Calculamos $E(X) = \sum k\,p_X(k)$ \quad (o $\int x\,f_X(x)\,dx$).
2. **2.º Paso (Momento de orden 2):** Calculamos $E(X^2) = \sum k^2\,p_X(k)$ \quad (o $\int x^2\,f_X(x)\,dx$).
3. **3.er Paso (Varianza y desviación):** Hacemos $V(X) = E(X^2) - [E(X)]^2$ \quad y \quad $\sigma_X = \sqrt{V(X)}$.

:::warning[Cuidado con la varianza]
La varianza **siempre debe ser $\ge 0$**. Si obtienes un valor negativo, ¡revisa haber restado $[E(X)]^2$ y no $E(X)$!
:::

---

### 8.7 Propiedades de la esperanza y la varianza

Sean $X$ e $Y$ variables aleatorias, y $a, b \in \mathbb{R}$ constantes:

| Operación | Esperanza $E(\cdot)$ | Varianza $V(\cdot)$ |
| :--- | :--- | :--- |
| **Desplazamiento ($+a$)** | $E(a + X) = a + E(X)$ | $V(a + X) = V(X)$ *(¡desplazar los datos no altera la dispersión!)* |
| **Escalado ($\cdot b$)** | $E(bX) = b \cdot E(X)$ | $V(bX) = b^2 \cdot V(X)$ *(el factor sale al cuadrado)* |
| **Transformación lineal** | $E(a + bX) = a + b E(X)$ | $V(a + bX) = b^2 \cdot V(X)$ |
| **Suma de dos variables** | $E(X + Y) = E(X) + E(Y)$ | $V(X + Y) = V(X) + V(Y) + 2\,\text{Cov}(X,Y)$ |
| **Resta de dos variables** | $E(X - Y) = E(X) - E(Y)$ | $V(X - Y) = V(X) + V(Y) - 2\,\text{Cov}(X,Y)$ |
| **Si $X, Y$ son INDEPENDIENTES** | $E(X \cdot Y) = E(X) \cdot E(Y)$ | $\mathbf{V(X \pm Y) = V(X) + V(Y)}$ (**¡Atención: SIEMPRE con signo $+$!**) |

Si restamos dos variables independientes, la varianza es $V(X - Y) = V(X) + V(Y)$. Restar variables aleatorias independientes **acumula incertidumbre**, ¡nunca se restan las varianzas!

---

## 9. Par de variables aleatorias (Distribución bivariante)

Cuando en una misma experiencia aleatoria observamos simultáneamente dos variables discretas $X$ e $Y$ (por ejemplo: dos dados o dos métricas de un sistema), analizamos su comportamiento conjunto mediante una **tabla de doble entrada**:

1. **Función de probabilidad conjunta ($p_{X,Y}(x,y)$):** Probabilidad de cada celda interior ($x$ e $y$):
   $$p(x,y) = P(X=x \cap Y=y)$$
   La suma de todas las celdas interiores de la tabla es exactamente:
   $$\sum_x \sum_y p(x,y) = 1$$

2. **Distribuciones marginales ($p_X(x), p_Y(y)$):** La distribución de cada variable por separado. Se calculan **sumando por filas o por columnas** (en los *márgenes* de la tabla):
   $$p_X(x) = \sum_{\forall y} p_{X,Y}(x,y) \quad \text{(sumar columna } x\text{)}, \qquad p_Y(y) = \sum_{\forall x} p_{X,Y}(x,y) \quad \text{(sumar fila } y\text{)}$$

3. **Función de probabilidad condicionada ($p_{X \mid Y}(x \mid y)$):** Restringir el estudio a una fila o columna concreta:
   $$P(X=x \mid Y=y) = \frac{p_{X,Y}(x,y)}{p_Y(y)} = \frac{\text{probabilidad de la celda }(x,y)}{\text{total marginal de la fila } y}$$

4. **Condición formal de independencia:** $X$ e $Y$ son independientes si y solo si **todas las celdas** son el producto de sus dos márgenes:
   $$p_{X,Y}(x,y) = p_X(x) \cdot p_Y(y) \quad \forall (x,y)$$
   *(Comprobación: Si hay una sola celda donde $p(x,y) \neq p_X(x) \cdot p_Y(y)$, las variables **NO son independientes**).*

### Indicadores bivariantes: Covarianza ($\text{Cov}(X,Y)$ o $\sigma_{X,Y}$)
Mide la tendencia de asociación lineal conjunta entre dos variables $X$ e $Y$:

- **Definición teórica:** Media del producto de las desviaciones respecto a sus medias:
  $$\text{Cov}(X,Y) = \sum_{\forall x}\sum_{\forall y} (x - E(X))(y - E(Y)) \cdot p_{X,Y}(x,y)$$
  > *«Suma de cómo se desvían a la vez $x$ e $y$ respecto a sus medias $E(X)$ y $E(Y)$, ponderada por la probabilidad $p_{X,Y}(x,y)$ de que ocurran conjuntamente»*

- **Fórmula práctica de cálculo:** Se evita restar medias término a término calculando:
  $$\mathbf{\text{Cov}(X,Y) = E(X \cdot Y) - E(X) \cdot E(Y)}$$
  > *«La covarianza $\text{Cov}(X,Y)$ es la media del producto cruzado $E(X \cdot Y)$ menos el producto de las medias individuales $E(X) \cdot E(Y)$»*

- **Interpretación por cuadrantes:** Desplazando el origen al centro de masas $(E(X), E(Y))$, el producto $(x-\mu_X)(y-\mu_Y)$ es positivo en los cuadrantes I y III (relación **directa**) y negativo en los cuadrantes II y IV (relación **inversa**).
- **El problema de escala:** La covarianza depende de las unidades de medida (por ejemplo: en metros da un valor y en milímetros queda multiplicada por $1.000$). No permite comparar intensidades de asociación.

### Coeficiente de correlación de Pearson ($\rho_{X,Y}$ o $\rho$)
Para eliminar la dependencia de las unidades, **estandarizamos** la covarianza dividiendo por el producto de las desviaciones típicas:
$$
\rho_{X,Y} = \frac{\text{Cov}(X,Y)}{\sigma_X \cdot \sigma_Y} \qquad \text{con} \quad \mathbf{-1 \le \rho_{X,Y} \le 1}
$$

- **Relación lineal perfecta ($|\rho| = 1$):** Puntos sobre una recta $Y = a + bX$ (pendiente positiva si $\rho = +1$, negativa si $\rho = -1$).
- **Incorrelación ($\rho = 0$):** Sin tendencia lineal. Si son independientes $\implies \text{Cov} = 0 \implies \mathbf{\rho = 0}$ (la inversa no siempre: relaciones curvas simétricas como $Y=X^2$ pueden tener $\rho = 0$ a pesar de depender la una de la otra).

**Propiedades algebraicas:**

| Propiedad | Descripción |
| :--- | :--- |
| $\text{Cov}(X, X) = V(X), \quad \rho_{X,X} = 1$ | Varianza como autocovarianza |
| $\text{Cov}(X, Y) = \text{Cov}(Y, X)$ | Simetría |
| $\text{Cov}(aX + c, bY + d) = a \cdot b \cdot \text{Cov}(X,Y)$ | Invarianza por desplazamiento y escalado |
| $E(X \cdot Y) = E(X) \cdot E(Y) + \text{Cov}(X,Y)$ | Desglose de la esperanza del producto |
| $V(X \pm Y) = V(X) + V(Y) \pm 2\,\text{Cov}(X,Y)$ | Varianza de la suma/resta (*si independientes:* $V(X \pm Y) = V(X) + V(Y)$) |
