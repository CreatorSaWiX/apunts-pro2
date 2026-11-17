---
title: "Tema 7: Complejidad"
description: "Problemas decisionales y tamaño de entrada, clases P, NP y EXP, reducciones polinómicas, teoría de la NP-completitud (Cook-Levin) y problemas NP-completos clásicos."
readTime: "12 min"
order: 8
draft: false
---

La teoría de la complejidad clasifica los **problemas** (no los algoritmos concretos) según si admiten una solución eficiente o si, hasta donde sabemos, requieren búsqueda exhaustiva.

---

## 7.1. Problemas decisionales y tamaño de la entrada

Un **problema decisional** solo tiene dos respuestas posibles: **SÍ (`1`)** o **NO (`0`)**. Formalmente, sobre un conjunto de entradas válidas $E$, se identifica con el conjunto de **entradas positivas**:

$$
A = \{ x \in E \mid x \text{ satisface la propiedad} \} \qquad (\text{negativas: } E \setminus A)
$$

Los problemas de optimización o búsqueda se convierten en decisión añadiendo una **cota**:

| Problema original | Versión decisional |
| :--- | :--- |
| **Camino más corto** | ¿Existe un camino de $u$ a $v$ de longitud $\le k$? |
| **Mochila 0/1** | ¿Existe una selección de objetos con peso $\le C$ y valor $\ge V$? |
| **Viajante de comercio** | ¿Existe un ciclo que visite las $n$ ciudades con coste total $\le k$? |

> **¿Por qué basta con la versión decisional?** Si sabemos decidir rápidamente la existencia con restricciones parciales (como en las *$n$-reinas* fijando las primeras $k$ filas $r_1, \dots, r_k$), podemos reconstruir una solución haciendo un número polinómico de consultas.

### Función de tamaño $|x|$
La complejidad se mide siempre respecto a $|x|$: el **número de bits o símbolos** necesarios para codificar la entrada $x$. Para un entero natural $x \ge 1$ en binario:

$$
|x| = \lfloor \log_2 x \rfloor + 1
$$

> **Cuidado con los algoritmos pseudopolinómicos:** Comprobar todos los divisores de $x$ desde $2$ hasta $x - 1$ realiza $\Theta(x)$ operaciones, pero como $|x| \approx \log_2 x$, el coste real en función del tamaño de la entrada es $\Theta(2^{|x|})$ (**exponencial**).

---

## 7.2. Clases de complejidad: $\text{P}$, $\text{NP}$ y $\text{EXP}$

Un problema $A$ pertenece a $\text{TIME}(t)$ si existe un algoritmo determinista que lo decide en tiempo $\mathcal{O}(t(|x|))$ en el caso peor.

| Clase | Definición formal | Intuición | Ejemplos |
| :--- | :--- | :--- | :--- |
| **$\text{P}$** | $\bigcup_{k > 0} \text{TIME}(n^k)$ | **Encontrar** la solución en tiempo polinómico (**tratables**). | `CONECTIVIDAD`, `CAMINO CORTO`, `PRIMALIDAD`, `2-COLOR`. |
| **$\text{NP}$** | Tiempo polinómico **no determinista** | **Verificar** un testigo en tiempo polinómico. | `COMPUESTOS`, `3-COLOR`, `CNF-SAT`, `VIAJANTE`. |
| **$\text{EXP}$** | $\bigcup_{k > 0} \text{TIME}(2^{n^k})$ | Resolubles en tiempo exponencial (**intratables** si $\notin \text{P}$). | `PARADA ACOTADA` ($\in \text{EXP} \setminus \text{P}$). |

### Dos definiciones equivalentes de $\text{NP}$

1. **Vía no determinismo (`ELEGIR(x)`):** un algoritmo polinómico que puede bifurcarse eligiendo un valor en paralelo; devuelve `1` si **alguna** rama devuelve `1`.
2. **Vía testigo y verificador:** existe un polinomio $p(n)$ y un algoritmo determinista polinómico **verificador** $V(x, y)$ tales que, para toda entrada $x \in E$:

$$
x \in A \iff \exists y \quad \bigl(|y| \le p(|x|) \land V(x, y) = 1\bigr)
$$

* **Ejemplo (`COMPUESTOS`):** para $x = 27$, el testigo es $y = 3$ ($|y| \le |x|$); el verificador solo comprueba $1 < y < x$ y $x \bmod y = 0$ en tiempo polinómico.
* **Ejemplo (`3-COLOR`):** dado un grafo $G$, el testigo es un vector de colores $(c_1, \dots, c_n) \in \{0, 1, 2\}^n$; el verificador comprueba todas las aristas en tiempo polinómico.

### Jerarquía conocida y el problema $\text{P} \stackrel{?}{=} \text{NP}$

$$
\text{P} \subseteq \text{NP} \subseteq \text{EXP} \qquad\text{y se sabe que}\qquad \text{P} \subsetneq \text{EXP}
$$

* **$\text{P} \subseteq \text{NP}$:** si ya sabemos decidir $x \in A$ en tiempo polinómico, el verificador simplemente ejecuta ese algoritmo ignorando el testigo $y$.
* **$\text{NP} \subseteq \text{EXP}$:** para cualquier problema en $\text{NP}$, podemos probar todos los posibles testigos $y$ con $|y| \le p(|x|)$ ($2^{\mathcal{O}(p(|x|))}$ candidatos) y evaluar $V(x, y)$.

Como $\text{P} \neq \text{EXP}$, hay tres escenarios posibles ($\text{P} \neq \text{NP} \neq \text{EXP}$, $\text{P} \neq \text{NP} = \text{EXP}$, o $\text{P} = \text{NP} \neq \text{EXP}$). **No se sabe si $\text{P} = \text{NP}$**, pero la hipótesis de trabajo estándar es que **$\text{P} \neq \text{NP}$**.

---

## 7.3. Reducciones polinómicas ($\le_p$)

Sean $A$ y $B$ dos problemas decisionales sobre dominios $E$ y $E'$. Decimos que **$A$ se reduce polinómicamente a $B$** ($A \le_p B$) si existe un algoritmo determinista polinómico $\mathcal{F} : E \to E'$ (donde $|\mathcal{F}(x)|$ es polinómica respecto a $|x|$) tal que:

$$
x \in A \iff \mathcal{F}(x) \in B
$$

> **Intuición:** Si $A \le_p B$, cualquier algoritmo para $B$ sirve para resolver $A$ (transformando primero $x$ en $\mathcal{F}(x)$). Por tanto, **$B$ es al menos tan difícil como $A$**.

### Propiedades fundamentales

| Propiedad | Enunciado | Utilidad |
| :--- | :--- | :--- |
| **Reflexividad** | $A \le_p A$ | Función identidad $\mathcal{F}(x) = x$. |
| **Transitividad** | $A \le_p B \land B \le_p C \implies A \le_p C$ | Permite encadenar reducciones ($\mathcal{G} \circ \mathcal{F}$). |
| **Cierre de $\text{P}$** | $A \le_p B \land B \in \text{P} \implies A \in \text{P}$ | Si resolvemos $B$ rápidamente, también $A$. (Contrarrecíproco: si $A \notin \text{P}$, entonces $B \notin \text{P}$). |

### Ejemplo: `MOCHILA` $\le_p$ `INECUACIONES LINEALES 0-1`
Dada una instancia de `MOCHILA` ($C$, $V$, pesos $p_1 \dots p_n$, valores $v_1 \dots v_n$), queremos traducirla al problema de decidir si existe $x \in \{0, 1\}^n$ tal que $Ax \ge b$.

Tomando $x_i = 1$ como *"cojo el objeto $i$"*, generamos en tiempo lineal las dos inecuaciones:

$$
\sum_{i=1}^n (-p_i)x_i \ge -C \qquad \land \qquad \sum_{i=1}^n v_i x_i \ge V
$$

Existe una selección válida de objetos para la mochila $\iff$ el sistema generado tiene solución binaria $x \in \{0, 1\}^n$.

---

## 7.4. Teoría de la $\text{NP}$-completitud

* **$\text{NP}$-difícil:** un problema $A$ es $\text{NP}$-difícil si $\forall B \in \text{NP},\ B \le_p A$ (al menos tan difícil como *cualquier* problema de $\text{NP}$; no hace falta que $A \in \text{NP}$).
* **$\text{NP}$-completo ($\text{NP-C}$):** un problema $A$ es $\text{NP}$-completo si **$A \in \text{NP}$** y **$A$ es $\text{NP}$-difícil** (los problemas más difíciles de $\text{NP}$).

**Proposición clave:** Si $A$ es $\text{NP}$-completo, entonces:

$$
\text{P} = \text{NP} \iff A \in \text{P}
$$

Es decir, si se encontrara un algoritmo polinómico para **un solo** problema $\text{NP}$-completo, todos los problemas de $\text{NP}$ pasarían automáticamente a estar en $\text{P}$.

### Receta para demostrar que $B$ es $\text{NP}$-completo
1. **$B \in \text{NP}$:** indicar cuál es el testigo $y$, comprobar que $|y|$ es polinómica en $|x|$ y describir un verificador $V(x, y)$ de coste polinómico.
2. **$B$ es $\text{NP}$-difícil:** escoger un problema $A \in \text{NP-C}$ ya conocido y dar una reducción polinómica **$A \le_p B$** (verificando que $\mathcal{F}$ es polinómica y que $x \in A \iff \mathcal{F}(x) \in B$).

> **Atención a la dirección:** Para probar que $B$ es $\text{NP}$-completo hay que reducir **de un $\text{NP-C}$ conocido hacia $B$** ($A_{\text{NP-C}} \le_p B$). Reducir $B \le_p A_{\text{NP-C}}$ solo prueba que $B$ no es más difícil que $A$, pero no demuestra que sea $\text{NP}$-difícil.

### Teorema de Cook-Levin (1971)
Una fórmula booleana está en **Forma Normal Conjuntiva (CNF)** si es una conjunción ($\land$) de cláusulas, y cada cláusula es una disyunción ($\lor$) de literales ($x$ o $\neg x$). Ejemplo: $(x \lor \neg y \lor z) \land (\neg x \lor \neg z)$.

* **`SAT`** (satisfactibilidad booleana general) y **`CNF-SAT`** (en forma CNF) son **$\text{NP}$-completos**.
* **Idea de la demostración:** pertenece a $\text{NP}$ porque el testigo es la asignación booleana $\alpha$ de $n \le |F|$ bits, verificable evaluando las conectivas en tiempo polinómico; es $\text{NP}$-difícil porque cualquier verificador polinómico $V(x, y)$ se puede simular con un circuito lógico (y traducir a una fórmula CNF de tamaño polinómico) satisfactible $\iff \exists y\ V(x,y)=1$.

---

## 7.5. Problemas canónicos y frontera $\text{P}$ vs $\text{NP-C}$

| Problema | Pregunta decisional | Testigo ($\in \text{NP}$) | Clase |
| :--- | :--- | :--- | :---: |
| **`1-SAT`** | Fórmula CNF con $1$ literal por cláusula: ¿es satisfactible? | Asignación booleana | **$\text{P}$** |
| **`2-SAT`** | Fórmula CNF con $\le 2$ literales por cláusula: ¿es satisfactible? | Asignación booleana | **$\text{P}$** |
| **`3-SAT`** | Fórmula CNF con $\le 3$ literales por cláusula: ¿es satisfactible? | Asignación booleana | **$\text{NP-C}$** |
| **`CLICA`** | ¿El grafo $G$ tiene un subgrafo completo de $k$ vértices? | Conjunto de $k$ vértices ($C \subseteq V$) | **$\text{NP-C}$** |
| **`CI`** | ¿El grafo $G$ tiene $k$ vértices no adyacentes dos a dos (independiente)? | Conjunto de $k$ vértices ($H \subseteq V$) | **$\text{NP-C}$** |
| **`RV`** | ¿El grafo $G$ tiene $k$ vértices que tocan todas las aristas (recubrimiento)? | Conjunto de $k$ vértices ($R \subseteq V$) | **$\text{NP-C}$** |
| **`k-COLOR`** ($k \le 2$) | ¿Se puede pintar $G$ con $\le k$ colores sin adyacentes iguales? | Asignación de colores | **$\text{P}$** |
| **`k-COLOR`** ($k \ge 3$) | ¿Se puede pintar $G$ con $\le k$ colores sin adyacentes iguales? | Asignación de colores | **$\text{NP-C}$** |

### Por qué `1-SAT` y `2-SAT` están en $\text{P}$, pero `3-SAT` es $\text{NP-C}$
* **`1-SAT` $\in \text{P}$:** basta con comprobar linealmente que no aparezcan a la vez un literal $x$ y su negado $\neg x$.
* **`2-SAT` $\in \text{P}$:** reescribimos cada cláusula como implicaciones usando $(a \lor b) \equiv (\neg a \implies b) \land (\neg b \implies a)$ y $(a) \equiv (\neg a \implies a)$, formando un digrafo sobre los literales. La fórmula es insatisfactible $\iff$ existe alguna variable $x$ con camino de $x$ a $\neg x$ **y** de $\neg x$ a $x$ (comprobable en tiempo polinómico).
* **`CNF-SAT` $\le_p$ `3-SAT`:** para toda cláusula $(a_1 \lor a_2 \lor \dots \lor a_k)$ con $k > 3$, se introducen variables nuevas $z_2, \dots, z_{k-2}$ para partirla en una cadena equisatisfactible de cláusulas de tamaño $3$:

$$
(a_1 \lor a_2 \lor z_2) \land (\neg z_2 \lor a_3 \lor z_3) \land \dots \land (\neg z_{k-2} \lor a_{k-1} \lor a_k)
$$

### Reducciones sobre grafos: `CLICA`, `CI` y `RV`
* **`CNF-SAT` $\le_p$ `CLICA`:** para una fórmula con $m$ cláusulas $C_1, \dots, C_m$, creamos un vértice $(l_i, j)$ por cada ocurrencia de un literal $l_i$ dentro de $C_j$, y ponemos arista entre $(l_i, j)$ y $(l_k, j')$ si y solo si son de cláusulas distintas ($j \neq j'$) y compatibles ($\neg l_i \neq l_k$). Entonces $F \in \text{CNF-SAT} \iff (G, m) \in \text{CLICA}$.
* **`CLICA` $\le_p$ `CI`:** dado $(G, k)$, construimos el grafo complementario $\overline{G}$ (mismos vértices, aristas invertidas). Un subgrafo completo de tamaño $k$ en $G$ es un subconjunto independiente de tamaño $k$ en $\overline{G}$.
* **`CI` $\le_p$ `RV`:** dado $(G, k)$ con $n = |V|$, devolvemos $(G, n - k)$. Un conjunto $H \subseteq V$ de tamaño $k$ no tiene aristas internas $\iff$ el complementario $V \setminus H$ de tamaño $n - k$ contiene al menos un extremo de toda arista de $G$.

### Reducciones de coloración: `k-COLOR`
* **`k-COLOR` ($k \le 2$) $\in \text{P}$:** `1-COLOR` acepta solo grafos sin aristas; `2-COLOR` comprueba si $G$ es bipartito mediante BFS/DFS en $\Theta(n + m)$.
* **`CNF-SAT` $\le_p$ `3-COLOR`:** se construye un triángulo base con 3 vértices $(V, G, B)$ que fijan 3 roles (*falso*, *cierto*, *base*). Cada variable $x$ y $\neg x$ se conectan entre sí y a $B$ (forzando una a *cierto* y la otra a *falso*), y para cada cláusula se engancha un subgrafo que solo es 3-coloreable si al menos uno de sus literales tiene color *cierto*.
* **`3-COLOR` $\le_p$ `k-COLOR` ($k > 3$):** dado $G$, se añade un subgrafo completo $K_{k-3}$ y se conectan todos sus vértices a todos los vértices de $G$. Los $k-3$ vértices nuevos consumen $k-3$ colores propios y dejan exactamente $3$ colores libres para $G$.

### Árbol resumen de reducciones

```text
CNF-SAT
 ├──► 3-SAT
 ├──► CLICA ──► CI ──► RV
 └──► 3-COLOR ──► k-COLOR (k > 3)
```

> **Casos particulares en $\text{P}$:** Que un problema general sea $\text{NP}$-completo no impide que versiones restringidas sean polinómicas (como pasar de `3-SAT` a `2-SAT`, o de `3-COLOR` a `2-COLOR`).
