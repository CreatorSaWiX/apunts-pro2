---
title: "Tema 1: Conceptos básicos de grafos"
description: "Introducción a la teoría de grafos: vértices, aristas, grados y representaciones."
order: 1
readTime: "15 Min"
---

¡Bienvenidos al mundo de los **Grafos**! 🕸️

En FM, quizás estamos acostumbrados a notaciones pesadas. Aquí la cosa cambia. La Teoría de Grafos es **visual**, es **tangible** y es la base de todo: desde cómo Instagram te sugiere amigos hasta cómo Google Maps encuentra el camino más rápido a casa.

## 1. ¿Qué es, realmente, un grafo?

Un grafo es simplemente un conjunto de **puntos** conectados por **líneas**.

*   Los puntos se llaman **vértices** ($V$).
*   Las líneas se llaman **aristas** ($A$).

Prueba a mover los vértices de aquí abajo. ¿Ves cómo las conexiones se mantienen aunque los muevas? Esta es la esencia de un grafo: no importa *dónde* están dibujados los puntos, sino *cómo* están conectados.

:::graph
```json
{
  "nodes": [
    { "id": "A", "label": "Tú" },
    { "id": "B", "label": "Amigo 1" },
    { "id": "C", "label": "Amigo 2" },
    { "id": "D", "label": "Conocido" }
  ],
  "links": [
    { "source": "A", "target": "B" },
    { "source": "A", "target": "C" },
    { "source": "B", "target": "C" },
    { "source": "C", "target": "D" }
  ]
}
```
:::

Un grafo $G$ es una pareja $(V, A)$ donde $V$ es el conjunto de vértices (no vacío) y $A$ es el conjunto de aristas.

- **Orden ($n$)**: El número de vértices, $n = |V|$.
- **Tamaño ($m$)**: El número de aristas, $m = |A|$.

## 2. Relaciones: vecinos e incidencia

Cuando dos vértices están unidos por una arista, decimos que son **adyacentes** (o vecinos). 

*   Si $u$ y $v$ están conectados, escribimos: $u \sim v$
*   La arista que nos une decimos que es **incidente** en nosotros.

:::graph
```json
{
  "nodes": [
    { "id": 1, "label": "u", "color": "#ef4444" },
    { "id": 2, "label": "v", "color": "#3b82f6" },
    { "id": 3, "label": "No adyacente", "color": "#9ca3af" }
  ],
  "links": [
    { "source": 1, "target": 2, "label": "u ~ v" }
  ]
}
```
:::

En el grafo de arriba, $u$ y $v$ son adyacentes. El vértice gris está solo y no es adyacente a nadie.

## 3. ¿Cómo lo ve el ordenador?

Tenemos dos grandes maneras de guardar un grafo en la memoria:

### A. Lista de adyacencias
Para cada persona, tenemos una lista de sus amigos. Ideal para grafos con pocas aristas ya que ahorra memoria. **Ejemplo**: "El usuario u es amigo de [v, w, z]".

### B. Matriz de adyacencias
Una tabla ($n \times n$) de 0 y 1. Si la matriz tiene un $1$ en la posición $(i, j)$, el vértice $i$ está conectado con el $j$. 

$$
M_A = \begin{pmatrix}
0 & \mathbf{1} & 0 \\
\mathbf{1} & 0 & 1 \\
0 & 1 & 0
\end{pmatrix}
$$

*   $1$ si hay arista (conexión).
*   $0$ si no la hay.

Vemos que como las amistades son mutuas, la matriz es **simétrica**. Y la diagonal todo ceros, porque nadie es amigo de sí mismo (no hay lazos).

:::tip{title="Grados en la Matriz"}
La suma numérica de los valores de una fila $i$ (o columna) es **exactamente el grado** de aquel vértice.
$$ \sum_{j=1}^n (M_A)_{ij} = g(v_i) $$
*Si en el examen te dicen: "Tenemos una matriz de adyacencia donde cada fila suma 5", te están diciendo que estamos ante un grafo **5-regular**.*
:::

## 4. Grados y el "lema de los apretones de manos"

El **grado** de un vértice $g(v)$ es el número de aristas que inciden en él. O sea, el número de amigos que tiene.

:::graph
```json
{
  "nodes": [
    { "id": "A", "label": "Grado 3" },
    { "id": "B", "label": "Grado 1" },
    { "id": "C", "label": "Grado 1" },
    { "id": "D", "label": "Grado 1" }
  ],
  "links": [
    { "source": "A", "target": "B" },
    { "source": "A", "target": "C" },
    { "source": "A", "target": "D" }
  ]
}
```
:::

En el grafo de arriba, el vértice central tiene grado 3. Los otros, grado 1.

**Si sumamos los grados de TODOS los vértices, ¿qué nos da?**

Imaginemos una fiesta. Cada vez que dos personas se dan la mano (una arista), hay **dos** manos implicadas. Si al final contamos cuántas manos ha dado cada uno y lo sumamos todo, estaremos contando **el doble** de los apretones reales. Este es el **lema de los apretones de manos**:

$$
\sum g(v) = 2m
$$

> **Secuencia de grados**:
> Es simplemente hacer una lista con los grados de todos los vértices, ordenada generalmente de mayor a menor.
> Ej: Un grafo "triángulo con una cola colgando" tiene lista de grados $S = (3, 2, 2, 1)$.

Como $2|A|$ siempre es un número PAR, la suma de los grados debe ser par. Esto significa que es **imposible** que haya un número impar de gente con un número impar de amigos.

:::tip{title="Havel-Hakimi: Comprobar la secuencia de grados"}
El Lema de los apretones de manos es necesario (suma par), pero no suficiente para garantizar que un grafo existe. Para saber si una secuencia es **gráfica**, usamos el algoritmo de **Havel-Hakimi**:

1.  **Ordena** la secuencia de mayor a menor.
2.  **Elimina** el primer elemento ($d_1$).
3.  **Resta 1** a los siguientes $d_1$ elementos.
4.  **Si aparece un negativo**, la secuencia NO es gráfica.
5.  **Repite** hasta que solo queden ceros ($\exists$) o falles ($\nexists$).

**Ejemplo: S = (3, 3, 2, 2, 1, 1)**
*   Quitamos el **3**: Restamos 1 a los 3 siguientes $\to$ (3-1, 2-1, 2-1, 1, 1) = **(2, 1, 1, 1, 1)**
*   Quitamos el **2**: Restamos 1 a los 2 siguientes $\to$ (1-1, 1-1, 1, 1) = **(0, 0, 1, 1)**
*   Ordenamos $\to$ **(1, 1, 0, 0)**
*   Quitamos el **1**: Restamos 1 al siguiente $\to$ (1-1, 0, 0) = **(0, 0, 0)** $\to$ **¡SÍ es gráfica!**
:::

## 5. Isomorfismo

Dos grafos son **isomorfos** si tienen la misma estructura interna, aunque tengan etiquetas diferentes o estén dibujados de forma distinta. En estos dos grafos, el de la derecha es un ciclo (un pentágono) y el izquierdo es una estrella.

::::grid{cols=2}
:::graph{height=220}
```json
{
  "nodes": [ { "id": 1 }, { "id": 2 }, { "id": 3 }, { "id": 4 }, { "id": 5 } ],
  "links": [
    { "source": 1, "target": 2 }, { "source": 2, "target": 3 },
    { "source": 3, "target": 4 }, { "source": 4, "target": 5 },
    { "source": 5, "target": 1 }
  ]
}
```
:::

:::graph{height=220}
```json
{
  "nodes": [ { "id": "A" }, { "id": "B" }, { "id": "C" }, { "id": "D" }, { "id": "E" } ],
  "links": [
    { "source": "A", "target": "C" }, { "source": "C", "target": "E" },
    { "source": "E", "target": "B" }, { "source": "B", "target": "D" },
    { "source": "D", "target": "A" }
  ]
}
```
:::
::::

**¿Son el mismo grafo?** La respuesta es **sí**. Son isomorfos. Porque podemos encontrar un **diccionario de traducción** (una bijección) que convierte uno en el otro sin romper ninguna conexión.

**El diccionario**:
*   $1 \to A$
*   $2 \to C$
*   $3 \to E$
*   $4 \to B$
*   $5 \to D$

Comprobamos: en el primer grafo **1** toca a **2**. En el segundo, ¿la traducción de 1 (**A**) toca a la traducción de 2 (**C**)? Sí. Y así con todos.

Un isomorfismo es simplemente **reetiquetar** los vértices. Si cambiando los nombres de los vértices de un grafo puedo obtener exactamente el otro, son isomorfos. No importa cómo dibuje (la forma visual engaña), importa quién está conectado con quién.

## 6. Tipos de grafos

A continuación se detallan los grafos fundamentales que se utilizan continuamente y hay que dominar para los problemas teóricos:

::::::grid{cols=5 class="gap-3 mb-8"}

:::::grid{cols=1 class="border border-slate-700/50 rounded-xl p-2 bg-slate-900/20 text-center"}
#### Nulo ($N_n$)

:::graph{height=130 transparentBg=true}
```json
{ "nodes": [ { "id": 1, "color":"#525252" }, { "id": 2, "color":"#525252" }, { "id": 3, "color":"#525252" } ], "links": [] }
```
:::
:::::

:::::grid{cols=1 class="border border-slate-700/50 rounded-xl p-2 bg-slate-900/20 text-center"}
#### Trayecto ($T_n$)

:::graph{height=130 transparentBg=true}
```json
{ "nodes": [ { "id": 1, "color":"#3b82f6" }, { "id": 2, "color":"#3b82f6" }, { "id": 3, "color":"#3b82f6" }, { "id": 4, "color":"#3b82f6" } ], "links": [ { "source": 1, "target": 2 }, { "source": 2, "target": 3 }, { "source": 3, "target": 4 } ] }
```
:::
:::::

:::::grid{cols=1 class="border border-slate-700/50 rounded-xl p-2 bg-slate-900/20 text-center"}
#### Ciclo ($C_5$)

:::graph{height=130 transparentBg=true}
```json
{ "nodes": [ { "id": 1, "color":"#3b82f6" }, { "id": 2, "color":"#3b82f6" }, { "id": 3, "color":"#3b82f6" }, { "id": 4, "color":"#3b82f6" }, { "id": 5, "color":"#3b82f6" } ], "links": [ { "source": 1, "target": 2 }, { "source": 2, "target": 3 }, { "source": 3, "target": 4 }, { "source": 4, "target": 5 }, { "source": 5, "target": 1 } ] }
```
:::
:::::

:::::grid{cols=1 class="border border-slate-700/50 rounded-xl p-2 bg-slate-900/20 text-center"}
#### Completo ($K_5$)

:::graph{height=130 transparentBg=true}
```json
{ "nodes": [ { "id": 1, "color":"#a855f7" }, { "id": 2, "color":"#a855f7" }, { "id": 3, "color":"#a855f7" }, { "id": 4, "color":"#a855f7" }, { "id": 5, "color":"#a855f7" } ], "links": [ { "source": 1, "target": 2 }, { "source": 1, "target": 3 }, { "source": 1, "target": 4 }, { "source": 1, "target": 5 }, { "source": 2, "target": 3 }, { "source": 2, "target": 4 }, { "source": 2, "target": 5 }, { "source": 3, "target": 4 }, { "source": 3, "target": 5 }, { "source": 4, "target": 5 } ] }
```
:::
:::::

:::::grid{cols=1 class="border border-slate-700/50 rounded-xl p-2 bg-slate-900/20 text-center"}
#### $r$-Regular

:::graph{height=130 transparentBg=true}
```json
{ "nodes": [ { "id": 1, "color":"#ec4899" }, { "id": 2, "color":"#ec4899" }, { "id": 3, "color":"#ec4899" }, { "id": 4, "color":"#ec4899" } ], "links": [ { "source": 1, "target": 2 }, { "source": 2, "target": 3 }, { "source": 3, "target": 4 }, { "source": 4, "target": 1 }, { "source": 1, "target": 3 }, { "source": 2, "target": 4 } ] }
```
:::
:::::

:::::grid{cols=1 class="border border-slate-700/50 rounded-xl p-2 bg-slate-900/20 text-center"}
#### Bipartito

:::graph{height=130 transparentBg=true}
```json
{ "nodes": [ { "id": "A1", "color": "#ef4444" }, { "id": "A2", "color": "#ef4444" }, { "id": "B1", "color": "#10b981" }, { "id": "B2", "color": "#10b981" } ], "links": [ { "source": "A1", "target": "B1" }, { "source": "A2", "target": "B2" }, { "source": "A1", "target": "B2" } ] }
```
:::
:::::

:::::grid{cols=1 class="border border-slate-700/50 rounded-xl p-2 bg-slate-900/20 text-center"}
#### Bip. com. ($K_{3,2}$)

:::graph{height=130 transparentBg=true}
```json
{ "nodes": [ { "id": "A1", "color": "#ef4444" }, { "id": "A2", "color": "#ef4444" }, { "id": "B1", "color": "#10b981" }, { "id": "B2", "color": "#10b981" }, { "id": "B3", "color": "#10b981" } ], "links": [ { "source": "A1", "target": "B1" }, { "source": "A1", "target": "B2" }, { "source": "A1", "target": "B3" }, { "source": "A2", "target": "B1" }, { "source": "A2", "target": "B2" }, { "source": "A2", "target": "B3" } ] }
```
:::
:::::

:::::grid{cols=1 class="border border-slate-700/50 rounded-xl p-2 bg-slate-900/20 text-center"}
#### $r$-Partido

:::graph{height=130 transparentBg=true}
```json
{ "nodes": [ { "id": "A1", "color": "#ef4444" }, { "id": "A2", "color": "#ef4444" }, { "id": "B1", "color": "#10b981" }, { "id": "B2", "color": "#10b981" }, { "id": "C1", "color": "#3b82f6" }, { "id": "C2", "color": "#3b82f6" } ], "links": [ { "source": "A1", "target": "B1" }, { "source": "A1", "target": "B2" }, { "source": "A1", "target": "C1" }, { "source": "A1", "target": "C2" }, { "source": "A2", "target": "B1" }, { "source": "A2", "target": "B2" }, { "source": "A2", "target": "C1" }, { "source": "A2", "target": "C2" }, { "source": "B1", "target": "C1" }, { "source": "B1", "target": "C2" }, { "source": "B2", "target": "C1" }, { "source": "B2", "target": "C2" } ] }
```
:::
:::::

:::::grid{cols=1 class="border border-slate-700/50 rounded-xl p-2 bg-slate-900/20 text-center"}
#### Estrella ($S_n$)

:::graph{height=130 transparentBg=true}
```json
{ "nodes": [ { "id": "C", "color": "#facc15" }, { "id": "1", "color": "#3b82f6" }, { "id": "2", "color": "#3b82f6" }, { "id": "3", "color": "#3b82f6" } ], "links": [ { "source": "C", "target": "1" }, { "source": "C", "target": "2" }, { "source": "C", "target": "3" } ] }
```
:::
:::::

:::::grid{cols=1 class="border border-slate-700/50 rounded-xl p-2 bg-slate-900/20 text-center"}
#### Rueda ($W_n$)

:::graph{height=130 transparentBg=true}
```json
{ "nodes": [ { "id": "C", "color": "#facc15" }, { "id": 1, "color":"#a8a29e" }, { "id": 2, "color":"#a8a29e" }, { "id": 3, "color":"#a8a29e" }, { "id": 4, "color":"#a8a29e" } ], "links": [ { "source": 1, "target": 2 }, { "source": 2, "target": 3 }, { "source": 3, "target": 4 }, { "source": 4, "target": 1 }, { "source": "C", "target": 1 }, { "source": "C", "target": 2 }, { "source": "C", "target": 3 }, { "source": "C", "target": 4 } ] }
```
:::
:::::

::::::

| Tipo de grafo | Notación | Propiedades y definiciones | Tamaño | Grado |
| --- | :---: | --- | --- | --- |
| **Nulo** | $N_n$ | El conjunto de aristas es vacío. Los vértices están totalmente aislados en el espacio. | $0$ | $0$ |
| **Trivial** | $N_1$ | Grafo que contiene 1 vértice y 0 aristas. | $0$ | $0$ |
| **Trayecto** | $T_n$ | Secuencia simple donde la lista de adyacencia es abierta. No cierra ningún ciclo de relación. | $n-1$ | Extremos: 1<br/>Int: 2 |
| **Ciclo** | $C_n$ | Subgrafo cerrado sin intersecciones diagonales donde el orden cardinal y el tamaño son idénticos. | $n$ | $2$ |
| **Completo** | $K_n$ | El conjunto de aristas $A$ contiene absolutamente todos los pares posibles. | $\frac{n(n-1)}{2}$ | $n-1$ |
| **$r$-Regular** | - | La totalidad de los integrantes fuerzan un grado paramétrico idéntico. | $\frac{rn}{2}$ | $r$ |
| **Bipartito** | - | $V = V_1 \cup V_2$ con $V_1 \cap V_2 = \emptyset$. Exige ausencia de ciclos de longitud impar internamente. | $\le \frac{n^2}{4}$ | Limitados |
| **Bip. Completo** | $K_{r,s}$ | Máxima existencia teórica de vínculos cruzados incondicionales entre ambas facciones formales. | $r \cdot s$ | $r$ y $s$ |
| **Estrella** | $K_{1,s}$ | El caso particular clásico del bipartito completo previo asimétrico donde un extremo de la partición vale uno. | $s$ | $1$ y $s$ |
| **Rueda** | $W_n$ | Composición pura formativa por subgrafo $C_{n-1}$ unido con un vértice de tipo nexo exterior. | $2(n-1)$ | $3$ y $n-1$ |
| **$r$-Partido** | $G(V_1 \dots V_r)$ | Partición de $V$ en $r$ conjuntos estables $V_i$ tales que no hay aristas entre vértices del mismo grupo. | - | Limitados |

## 7. Subgrafos

Antes de entrar en detalles, entendamos la diferencia entre estar "entero" y que te falten piezas.

:::::grid{cols=2 class="gap-4"}

:::graph{height=120}
```json
{ "nodes": [ { "id": 1 }, { "id": 2 }, { "id": 3 }, { "id": 4 } ], "links": [ { "source": 1, "target": 2 }, { "source": 1, "target": 3 }, { "source": 1, "target": 4 }, { "source": 2, "target": 3 }, { "source": 2, "target": 4 }, { "source": 3, "target": 4 } ] }
```
:::

:::graph{height=120}
```json
{ "nodes": [ { "id": 1 }, { "id": 2 }, { "id": 3 }, { "id": 4 } ], "links": [ { "source": 1, "target": 2 }, { "source": 3, "target": 4 } ] }
```
:::

:::::

Si tenemos un grafo $G$, un **subgrafo** es cualquier resultado de eliminar vértices o aristas. ¡Nunca podemos añadir nada nuevo!

Hay dos tipos de "recortes" especiales:

:::::grid{cols=2 class="gap-4"}

::::grid{cols=1 class="h-full border border-slate-700/50 rounded-xl p-3 bg-slate-900/20 hover:bg-slate-900/40 transition-all !my-0"}
#### **Subgrafo generador**
Mantenemos **TODOS los vértices**, pero borramos algunas aristas.

:::graph{height=120}
```json
{
  "nodes": [ { "id": 1 }, { "id": 2 }, { "id": 3, "color": "#ef4444" } ],
  "links": [ { "source": 1, "target": 2 } ]
}
```
:::
<div class="text-xs text-center text-slate-400 mt-2">Original era un triángulo. El vértice 3 (rojo) sigue ahí, solo.</div>
::::

::::grid{cols=1 class="h-full border border-slate-700/50 rounded-xl p-3 bg-slate-900/20 hover:bg-slate-900/40 transition-all !my-0"}
#### **Subgrafo inducido ($G[S]$)**
Elegimos un "equipo" de vértices $S$ y nos quedamos con **TODAS** sus aristas internas.

:::graph{height=120}
```json
{
  "nodes": [ { "id": 1 }, { "id": 2 }, { "id": 3 }, { "id": 4 } ],
  "links": [ { "source": 1, "target": 2 }, { "source": 2, "target": 3 }, { "source": 3, "target": 4 } ]
}
```
:::
<div class="text-xs text-center text-slate-400 mt-2">Recortamos un trozo de la red, manteniendo las conexiones locales.</div>
::::

:::::

## 8. El grafo complementario ($G^c$)

Imaginad el universo paralelo del grafo. Es el **negativo** de la foto. Hay grafos que son **autocomplementarios**: son idénticos a su "negativo" ($G \cong G^c$). El pentágono ($C_5$) es uno de ellos.

:::::grid{cols=2 class="gap-4"}

::::grid{cols=1 class="h-full border border-slate-700/50 rounded-xl p-3 bg-slate-900/20 hover:bg-slate-900/40 transition-all !my-0"}
#### **Grafo original ($G$)**
Dos vértices conectados (Amigos).

:::graph{height=120}
```json
{
  "nodes": [ { "id": 1 }, { "id": 2 }, { "id": 3 }, { "id": 4 } ],
  "links": [ { "source": 1, "target": 2 }, { "source": 3, "target": 4 } ]
}
```
:::
::::

::::grid{cols=1 class="h-full border border-slate-700/50 rounded-xl p-3 bg-slate-900/20 hover:bg-slate-900/40 transition-all !my-0"}
#### **Grafo complementario ($G^c$)**
Ahora los amigos se pelean, y los desconocidos se hacen amigos.

:::graph{height=120}
```json
{
  "nodes": [ { "id": 1 }, { "id": 2 }, { "id": 3 }, { "id": 4 } ],
  "links": [
    { "source": 1, "target": 3 }, { "source": 1, "target": 4 },
    { "source": 2, "target": 3 }, { "source": 2, "target": 4 },
    { "source": 1, "target": 4 }, { "source": 2, "target": 3 }
  ]
}
```
:::

::::

:::::

:::tip{title="Álgebra del complementario"}
No intentes dibujar el complementario si en el examen te piden números. El ordenador de tu mente debe usar estas 3 reglas de oro:
1.  **Orden igual:** $n_{G^c} = n$
2.  **Tamaño invertido:** $m_{G^c} = \frac{n(n-1)}{2} - m$  (Son las aristas totales posibles menos las que ya tienes en $G$).
3.  **Grado invertido (Imprescindible):** El nuevo grado de un vértice es todo aquello con lo que no estaba conectado en tu red original. Esta fórmula se usa continuamente:
    $$ g_{G^c}(v) = (n - 1) - g_G(v) $$
:::


- **Conjunto independiente**: Subconjunto de vértices $S \subseteq V$ donde **ningún par** de vértices es adyacente (0 aristas internas). En $G$ es un subgrafo completo (trozo que forma un grafo completo) en el grafo complementario $G^c$.
- **Número de independencia $\alpha(G)$**: Tamaño del conjunto independiente más grande del grafo.


## 9. Operaciones con grafos

### Grafo reunión ($G \cup G'$)
Es la unión disjunta de dos grafos. Simplemente los dibujamos uno al lado del otro.
- **Vértices y Aristas**: $V_{total} = V \cup V'$ y $A_{total} = A \cup A'$.
- Si $V \cap V' = \emptyset$ (no comparten nodos), el orden total es exactamente $n + n'$.

**Ejemplo**: $C_3 \cup C_3$
:::graph{height=150}
```json
{
  "nodes": [
    { "id": 1, "color": "#3b82f6" }, { "id": 2, "color": "#3b82f6" }, { "id": 3, "color": "#3b82f6" },
    { "id": 4, "color": "#ef4444" }, { "id": 5, "color": "#ef4444" }, { "id": 6, "color": "#ef4444" }
  ],
  "links": [
    { "source": 1, "target": 2 }, { "source": 2, "target": 3 }, { "source": 3, "target": 1 },
    { "source": 4, "target": 5 }, { "source": 5, "target": 6 }, { "source": 6, "target": 4 }
  ]
}
```
:::

### Potencia de Grafos ($G^k$)
- **Definición ($G^2$):** Mantiene los nodos de $G$. Dos nodos son adyacentes si su distancia original en $G$ es **$\le 2$**.
- **Regla general ($G^k$):** $u \sim v$ si $dist_G(u, v) \le k$.
- **Examen:** Si $G$ es conexo (tema 2), $G^2$ también lo es y su diámetro se reduce (más "atajos").

**Ejemplo**: $P_4^2$ (Nodos distancia $\le 2$ conectados)
:::graph{height=150}
```json
{
  "nodes": [ { "id": 1 }, { "id": 2 }, { "id": 3 }, { "id": 4 } ],
  "links": [
    { "source": 1, "target": 2, "color": "#94a3b8" }, { "source": 2, "target": 3, "color": "#94a3b8" }, { "source": 3, "target": 4, "color": "#94a3b8" },
    { "source": 1, "target": 3, "color": "#f43f5e", "name": "Dist 2" }, { "source": 2, "target": 4, "color": "#f43f5e", "name": "Dist 2" }
  ]
}
```
:::

### Grafo producto ($G \times H$)
El **producto cartesiano** genera estructuras tipo "rejilla". Sustituimos cada vértice de $G$ por una copia de $H$ y los conectamos siguiendo la estructura de $G$.

**Ejemplo**: $P_3 \times P_2$ (una escalera)

:::graph
```json
{
  "nodes": [
    { "id": "1A", "label": "1A", "group": 1 }, { "id": "1B", "label": "1B", "group": 1 },
    { "id": "2A", "label": "2A", "group": 2 }, { "id": "2B", "label": "2B", "group": 2 },
    { "id": "3A", "label": "3A", "group": 3 }, { "id": "3B", "label": "3B", "group": 3 }
  ],
  "links": [
    { "source": "1A", "target": "1B" }, { "source": "2A", "target": "2B" }, { "source": "3A", "target": "3B" },
    { "source": "1A", "target": "2A" }, { "source": "2A", "target": "3A" },
    { "source": "1B", "target": "2B" }, { "source": "2B", "target": "3B" }
  ]
}
```
:::

- **Orden**: $n_{G \times H} = n_G \cdot n_H$
- **Tamaño**: $m_{G \times H} = n_G \cdot m_H + n_H \cdot m_G$

:::tip{title="Distancias en el Producto"}
La distancia en el producto es la suma de las distancias:
$$ d_{G \times H}((u_1, v_1), (u_2, v_2)) = d_G(u_1, u_2) + d_H(v_1, v_2) $$
$$ \text{Diámetro}(G \times H) = \text{Diámetro}(G) + \text{Diámetro}(H) $$
:::

### Producto coronal ($G \circ H$)
Se construye tomando una copia de $G$ y $n_G$ copias de $H$, y conectando cada vértice $i$ de $G$ con **todos** los vértices de su copia correspondiente de $H$.
- **Orden**: $n_{G \circ H} = n_G(1 + n_H)$
- **Grado de un vértice $v \in G$**: $g_{original}(v) + n_H$
- **Tamaño**: $m_{G \circ H} = m_G + n_G(m_H + n_H)$

**Ejemplo**: $K_2 \circ N_2$ (Cada nodo de $K_2$ se conecta a una pareja de nodos nuevos)
:::graph{height=200}
```json
{
  "nodes": [
    { "id": "G1", "color": "#facc15" }, { "id": "G2", "color": "#facc15" },
    { "id": "H1_1", "color": "#3b82f6" }, { "id": "H1_2", "color": "#3b82f6" },
    { "id": "H2_1", "color": "#ef4444" }, { "id": "H2_2", "color": "#ef4444" }
  ],
  "links": [
    { "source": "G1", "target": "G2" },
    { "source": "G1", "target": "H1_1" }, { "source": "G1", "target": "H1_2" },
    { "source": "G2", "target": "H2_1" }, { "source": "G2", "target": "H2_2" }
  ]
}
```
:::