---
title: "Tema 1: Teoría de la probabilidad"
description: "Espacio muestral, operaciones con sucesos, axiomas de Kolmogórov, probabilidad condicionada, fórmula de Bayes, independencia, árboles de probabilidad y tablas de contingencia."
readTime: "12 min"
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
2. $\neg(A \cap B) = \neg A \cup \neg B$ («Al menos uno de los dos no ocurre»)

### Partición del espacio muestral
Una familia finita de sucesos $\{A_1, A_2, \dots, A_n\}$ constituye una **partición** del espacio muestral $\Omega$ si y solo si cumple tres condiciones indispensables:

1. **No vacíos**: $A_i \neq \emptyset$ para todo $i \in \{1, \dots, n\}$.
2. **Disjuntos dos a dos**: $A_i \cap A_j = \emptyset$ para todo $i \neq j$.
3. **Unión exhaustiva**: $\bigcup_{i=1}^n A_i = \Omega$ (recubren todo el espacio muestral).

En el lanzamiento de un dado de 6 caras:
- $A_1 = \text{«salir par»} = \{2, 4, 6\}$
- $A_2 = \text{«salir impar»} = \{1, 3, 5\}$

Puesto que $A_1 \cap A_2 = \emptyset$ y $A_1 \cup A_2 = \Omega$, los sucesos $\{A_1, A_2\}$ forman una partición de $\Omega$. Dos conjuntos $A$ y $\neg A$ siempre forman una partición del espacio muestral.

---

## 3. Axiomas de la probabilidad y propiedades deducidas

Para cuantificar la incertidumbre se define una función o aplicación $P: \mathcal{P}(\Omega) \to \mathbb{R}$ que asigna a cada suceso $A$ un número real denominado **probabilidad**. Por definición, la medida de probabilidad debe satisfacer los tres axiomas siguientes:

1. **No-negatividad y acotación**:
   $$0 \le P(A) \le 1 \quad \forall A \subseteq \Omega$$
2. **Certeza del espacio muestral**:
   $$P(\Omega) = 1$$
3. **Aditividad para sucesos disjuntos**: Si $A_i \cap A_j = \emptyset$ para todo $i \neq j$, entonces:
   $$P(A_1 \cup A_2 \cup \dots \cup A_n) = P(A_1) + P(A_2) + \dots + P(A_n)$$

A partir de estos axiomas se derivan directamente las propiedades fundamentales siguientes:

- **Probabilidad del suceso contrario**:
  $$P(\neg A) = 1 - P(A)$$
- **Probabilidad del suceso imposible**:
  $$P(\emptyset) = 0$$
- **Monotonía**: Si un suceso está contenido en otro ($A \subseteq B$), su probabilidad no puede ser superior:
  $$A \subseteq B \implies P(A) \le P(B)$$
- **Principio de inclusión-exclusión (para 2 sucesos)**:
  $$P(A \cup B) = P(A) + P(B) - P(A \cap B)$$
- **Principio de inclusión-exclusión (para 3 sucesos)**:
  $$P(A \cup B \cup C) = P(A) + P(B) + P(C) - P(A \cap B) - P(A \cap C) - P(B \cap C) + P(A \cap B \cap C)$$

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

En la práctica, condicionar por $B$ significa **reducir el universo de resultados observables al conjunto $B$**. Todos los resultados fuera de $B$ pasan a ser imposibles, y las probabilidades de los subconjuntos de $A$ se reescalan dividiendo por el peso total de $B$. Al evaluar $P(A \mid B)$, los dos sucesos juegan roles completamente asimétricos: **$A$ es incierto**, mientras que **$B$ es un dato conocido o asumido como cierto**.

En general:
$$P(A \mid B) \neq P(B \mid A) \neq P(A \cap B)$$

Si definimos $A = \text{«Fumar»}$ y $B = \text{«Tener cáncer de pulmón»}$, la probabilidad de ser fumador si ya se ha diagnosticado cáncer de pulmón es muy elevada ($P(A \mid B) \approx 0{,}85$); en cambio, la probabilidad de tener cáncer de pulmón sabiendo que una persona fuma es mucho menor ($P(B \mid A) \approx 0{,}10$). Confundir ambas magnitudes es una falacia clásica.

La información que aporta la ocurrencia de $B$ sobre $A$ puede tener tres efectos:
- **Favorece** ($B$ aumenta la probabilidad de $A$): $P(A \mid B) > P(A)$.
- **Desfavorece** ($B$ disminuye la probabilidad de $A$): $P(A \mid B) < P(A)$.
- **Indiferente** ($B$ no aporta información sobre $A$): $P(A \mid B) = P(A)$.

### Inversión de la desigualdad
Cuando comparamos las medidas marginales de dos sucesos $A$ y $B$:
$$
P(A) > P(B) \implies \frac{1}{P(A)} < \frac{1}{P(B)} \implies \frac{P(A \cap B)}{P(A)} < \frac{P(A \cap B)}{P(B)} \implies P(B \mid A) < P(A \mid B)
$$

Sean $A = \text{«Ser estudiante universitario»}$ y $B = \text{«Ser estudiante de la FIB»}$.
Dado que hay muchos más universitarios que estudiantes de la FIB, tenemos $P(A) > P(B)$.
- Si alguien es estudiante de la FIB ($B$), es seguro que es universitario: $P(A \mid B) = 1$.
- Si elegimos un universitario cualquiera al azar ($A$), la probabilidad de que sea precisamente de la FIB es muy baja: $P(B \mid A) \approx 0{,}02$.
- Se cumple la regla: $P(B \mid A) < P(A \mid B)$.

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

Esta relación fundamental permite pasar de la probabilidad directa $P(A \mid B)$ a la probabilidad inversa $P(B \mid A)$ (revertir la relación causa-efecto).

---

## 6. Independencia de sucesos

Dos sucesos son **estadísticamente independientes** si la ocurrencia de uno no aporta ninguna información sobre la ocurrencia del otro ni modifica su probabilidad.

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

Es un error muy común confundir que dos sucesos sean disjuntos con que sean independientes:
- **Disjuntos (incompatibles)**: $A \cap B = \emptyset \implies P(A \cap B) = 0$.
- **Independientes**: Exige $P(A \cap B) = P(A) \cdot P(B)$.

Dos sucesos disjuntos con probabilidades estrictamente positivas ($P(A) > 0$ y $P(B) > 0$) **¡NUNCA pueden ser independientes!** Si son disjuntos y sabemos que ha ocurrido $A$, tenemos la certeza absoluta de que no puede haber ocurrido $B$ ($P(B \mid A) = 0 \neq P(B)$); por lo tanto, la ocurrencia de $A$ proporciona la máxima información posible sobre $B$.

---

## 7. Herramientas de representación: árboles de probabilidad y tablas de contingencia

Para analizar problemas compuestos y estructurar los datos de un experimento, se utilizan habitualmente dos herramientas gráficas complementarias.

### 7.1 Árboles de sucesos y probabilidades
Un árbol de probabilidad desglosa un experimento en etapas secuenciales:
- **Nivel 1 (Raíz $\to$ primer nivel)**: Contiene las probabilidades **marginales** de los sucesos iniciales ($P(A)$ y $P(\neg A)$).
- **Nivel 2 (Ramas interiores)**: Contiene **siempre probabilidades condicionadas**, nunca probabilidades conjuntas.
- **Hojas terminales (regla del producto)**: La probabilidad conjunta del camino completo desde la raíz hasta una hoja se obtiene multiplicando las probabilidades de todas las ramas del camino:
  $$P(A \cap B) = P(A) \cdot P(B \mid A)$$

:::probtreeviz
:::

- **Si $A$ y $B$ son independientes**: Las ramas del segundo nivel no dependen del camino de origen; valen directamente $P(B)$ y $P(\neg B)$.
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
2. **Márgenes (última fila y última columna)**: Contienen las probabilidades **marginales** ($P(A), P(\neg A), P(B), P(\neg B)$), obtenidas sumando las filas o columnas correspondientes.
3. **Cálculo de probabilidades condicionadas**: Se obtienen dividiendo la celda conjunta por el total del margen condicionante:
   - Condicionada sobre la fila $A$:
     $$P(B \mid A) = \frac{P(A \cap B)}{P(A)}$$
   - Condicionada sobre la columna $B$:
     $$P(A \mid B) = \frac{P(A \cap B)}{P(B)}$$

Para comprobar si $A$ y $B$ son independientes observando una tabla de contingencia, basta con verificar si **cada celda interior es exactamente igual al producto de sus dos márgenes**:
$$P(A \cap B) \stackrel{?}{=} P(A) \cdot P(B)$$
Si la igualdad se cumple en todas las celdas, existe **independencia estadística**. Si incluso una sola celda no la cumple, los sucesos son **dependientes**.
