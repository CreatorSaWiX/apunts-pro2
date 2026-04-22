---
title: "Tema 2: Recorridos, conexión y DFS"
description: "Caminos, vértices de corte, distancias y el algoritmo de Búsqueda en Profundidad."
order: 2
---

## 1. Conceptos

*   **Recorrido**: Viajar de un vértice a otro mediante aristas (puedes repetir lugares como quieras).
*   **Camino**: Un recorrido donde **no repetimos ningún vértice** (tampoco ninguna arista).
*   **Ciclo**: Un camino cerrado (inicio = final) de longitud $\ge 3$. Un grafo sin ciclos se denomina **grafo acíclico**.
*   **Longitud**: Es exactamente el número de aristas que cruzamos, no los vértices. El viaje de un vértice a sí mismo (sin moverse) tiene longitud 0.

## 2. Cortes y puentes

Un grafo es **conexo** si siempre hay algún camino entre cualquier pareja de vértices. Si alguno no llega, se fragmenta en **componentes conexos** separados. Cualquier grafo conexo de tamaño real exige como mínimo el uso estricto de $n - 1$ aristas (si tenemos un grafo conexo de 5 vértices, entonces tiene exactamente 4 aristas).

*   **Vértice de corte**: Si borramos este solo vértice, cortamos tantas conexiones que el grafo se divide instantáneamente en MÁS componentes conexos.
*   **Arista puente**: Si borramos esta arista en solitario, rompemos el grafo en **exactamente 2** componentes conexos.

:::graph
```json
{
  "nodes": [
    { "id": "1" }, { "id": "2" }, { "id": "Corte", "color": "#ef4444" },
    { "id": "4", "color": "#3b82f6" }, { "id": "5" }
  ],
  "links": [
    { "source": "1", "target": "2" }, { "source": "2", "target": "Corte" }, { "source": "1", "target": "Corte" },
    { "source": "Corte", "target": "4", "color": "#facc15", "width": 3, "label": "Puente" },
    { "source": "4", "target": "5" }
  ]
}
```
:::
<div class="text-xs text-center text-slate-400 mt-2 mb-4">El vértice de <b>Corte</b> es vital. La arista amarilla es exclusivamente un <b>Puente</b>.</div>

:::tip{title="La falacia de aristas y vértices"}
"¿Un grafo conexo con vértices de corte siempre tiene alguna arista puente?" **FALSO**. Contraejemplo: el **grafo mariposa** (dos triángulos unidos por un solo vértice). El vértice central es de corte, pero ninguna arista es puente porque todas forman parte de un ciclo. En cambio, el **recíproco sí es cierto**: si una arista es puente, sus extremos son vértices de corte (excepto si algún extremo tiene grado 1, es decir, es una hoja).
:::

## 3. Métricas de distancia
Sean dos vértices que viven en un mismo componente conexo $u$ y $v$:
*   **Distancia $d(u,v)$**: El valor *mínimo* referente a la longitud de toda la variedad de caminos para ir de $u$ a $v$. Si no hay camino posible, se considera $\infty$.

A nivel global de grafo tenemos 4 definiciones clave a evaluar dependiendo de esta $d$:
1.  **Excentricidad $e(u)$**: Ponte en $u$. ¿Cuál es la distancia de aquel que está más lejos? ("el peor de los casos"). 
2.  **Diámetro $D(G)$**: La distancia más grande que puedes encontrar en **todo** el grafo. El valor máximo de las excentricidades juntas.
3.  **Radio $r(G)$**: Si buscamos el punto más eficiente del mapa... La menor excentricidad disponible obtenida por algún vértice se llama radio.
4.  **Centro del Grafo**: Cualquiera y todos los vértices donde hayan calculado tener de forma milagrosa justamente la excentricidad exactamente igual a dicho **radio**.

**Ejemplo:** Consideramos el camino $a - b - c - d$:

| | $d(\cdot, a)$ | $d(\cdot, b)$ | $d(\cdot, c)$ | $d(\cdot, d)$ | **Excentricidad** |
|:-:|:-:|:-:|:-:|:-:|:-:|
| **a** | 0 | 1 | 2 | 3 | **3** |
| **b** | 1 | 0 | 1 | 2 | **2** |
| **c** | 2 | 1 | 0 | 1 | **2** |
| **d** | 3 | 2 | 1 | 0 | **3** |

*   **Diámetro** $D(G) = \max(3,2,2,3) = 3$
*   **Radio** $r(G) = \min(3,2,2,3) = 2$
*   **Centro** = $\{b, c\}$ (los vértices con excentricidad $= r$)

---

## 4. DFS: Búsqueda en profundidad (Depth-First Search)

El algoritmo de demostración oficial **DFS** permite encontrar absolutamente todo el componente conexo al cual pertenece un inicio dado $v$. Descubre las profundidades antes de mirar por los lados contiguos y se basa nativamente en emplear una especie de **pila (LIFO)**. 

En cada visita se intenta añadir un solo adyacente fresco de quien seguir hundiéndose (push). Solo si nos quedamos acorralados (todos los vecinos revisados), hace marcha atrás deshaciendo desde la propia pila para explorar por donde vinimos (pop).

:::algoviz{algorithm="dfs"}
:::

## 5. BFS: Búsqueda en anchura (Breadth-First Search)

Mientras que el DFS baja en picado "cayendo", el **BFS** se propaga radialmente por capas. En el ordenador necesita puramente estructurar memoria temporal alrededor de una **cola (FIFO)**.

Si tenemos un array `D` que nos guarda cuántos pasos llevamos hechos:
1. Poner el nodo de origen ($v$) a distancia `0` dentro de `D`. `D[v] = 0`.
2. Encuelas y añades el $v$ a la lista de Visitado ($W$).
3. Cuando extraes el primero de la cola (llamado $x$), todos los nuevos adyacentes inexplorados ($y$) tomarán estrictamente como distancia oficial el valor **$D[y] = D[x] + 1$**. ¡Y tú avanzas a otro barrio!

> Sea el grafo simple $G = (V,A)$ y su vértice $v \in V$. El vector resultante $D$ obtenido manualmente durante **las rutinas puras del algoritmo BFS** garantiza convertirse en el almacenamiento real de la **distancia mínima de caminos del vértice original $v$ hacia cualquier otro** ubicado en toda la raíz de nodos conectados.

:::algoviz{algorithm="bfs2"}
:::

:::tip{title="Truco de Examen: Ejecutar Recorridos en Papel"}
A menudo pedirán listar explícitamente y de memoria sobre "el orden de adición de vértices al árbol generador BFS/DFS priorizando estrictamente con el orden numérico pequeño de frontera". Es clave no fallar ni liarse:
*   **Aristas Generadoras:** ¡La tubería maestra o *arista de descubrimiento* proviene únicamente desde qué vértice anterior has conquistado de primeras al otro desconocido! Y nunca entre adyacentes descubiertos desde un mismo fondo.
*   **Orden BFS Papel:** Listad los de distancia 1 (ordenados de menor id a mayor), poned las ramitas, haced de origen uno a uno y añadid los de distancia 2. ¡No saltéis ramas!
*   **Orden DFS Papel:** Sigue la línea sin cerrar hasta el último rincón menor posible. Una vez cortado el paso sin ruta (todos los vecinos actuales visitados), deshacer atrás y buscar rutas vírgenes paralelas descartadas como recurso.
:::

---

## 6. ¿Cómo saber si un grafo es Bipartito?

Un grafo es **bipartito** si podemos pintar sus vértices con **2 colores** (ej: Rojo y Azul) de manera que ningún par de vértices del mismo color estén conectados entre sí.

:::tip{title="Regla de oro de examen"}
Un grafo es **Bipartito** $\iff$ **NO tiene ningún ciclo de longitud IMPAR** (como un triángulo $C_3$ o un pentágono $C_5$).
:::

### Visualización: el método del "pintado"
Imagina que intentas pintar el grafo alternando colores. Si en algún momento te ves obligado a conectar dos nodos del mismo color, es que hay un ciclo impar y **no** es bipartito.

:::::grid{cols=2 class="gap-4"}

::::grid{cols=1 class="bg-slate-900/40 p-4 rounded-xl border border-emerald-500/20"}
**Bipartito**
Todos los caminos cerrados son pares ($C_4$). Podemos separar en dos grupos.

:::graph{height=150}
```json
{
  "nodes": [
    { "id": 1, "color": "#ef4444" }, { "id": 2, "color": "#3b82f6" },
    { "id": 3, "color": "#ef4444" }, { "id": 4, "color": "#3b82f6" }
  ],
  "links": [
    { "source": 1, "target": 2 }, { "source": 2, "target": 3 },
    { "source": 3, "target": 4 }, { "source": 4, "target": 1 }
  ]
}
```
:::
::::

::::grid{cols=1 class="bg-slate-900/40 p-4 rounded-xl border border-red-500/20"}
**No bipartito (Ciclo $C_3$)**
Tiene un triángulo. Es imposible pintarlo con 2 colores sin repetir en una arista.

:::graph{height=150}
```json
{
  "nodes": [
    { "id": 1, "color": "#ef4444" }, { "id": 2, "color": "#3b82f6" },
    { "id": 3, "color": "#facc15" }
  ],
  "links": [
    { "source": 1, "target": 2 }, { "source": 2, "target": 3 },
    { "source": 3, "target": 1 }
  ]
}
```
:::
::::

:::::
