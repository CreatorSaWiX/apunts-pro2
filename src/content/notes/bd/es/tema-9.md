---
title: "Tema 9: Almacenamiento y métodos de acceso"
description: "Arquitectura física y virtual (espacios de tablas y de agrupación, páginas, RID), árboles B+ (estructura, validación y dimensionamiento), índices agrupados vs no agrupados, multiatributo, intersección de RIDs y cálculo de costes."
readTime: "12 min"
order: 12
draft: true
---

Los datos se guardan en **páginas** de tamaño fijo en memoria externa. El coste de una consulta se mide exclusivamente en **número de páginas leídas (E/S)** (sin contar CPU).

---

## 9.1. Arquitectura física, virtual y estructura de página

:::storagearchviz
:::

- **Extensión (*extent*):** conjunto de páginas físicas consecutivas pedidas al SO (favorece lecturas secuenciales).
- **RID (*Record IDentifier*):** dirección lógica de una fila dentro de un espacio virtual: **`num_pagina_virtual`** (3 bytes) + **`num_elemento_VAF`** (1 byte). Mantiene la fila *clavada* en la página aunque se mueva internamente.

### Estructura interna de una página de datos

:::slottedpageviz
:::

- **Cabecera de fila:** indica la longitud total y el identificador de la tabla a la que pertenece (clave cuando conviven dos tablas en la misma página).
- **VAF (*Vector de Direcciones de Fila*):** contiene los desplazamientos de cada fila dentro de la página; permite reordenar o mover filas internamente sin invalidar ningún `RID`.

---

## 9.2. Tipos de espacios virtuales (EV de tabla vs. de agrupación)

| Tipo de EV | Relación | ¿Cómo se almacena? | Favorece | Penaliza |
| :--- | :---: | :--- | :--- | :--- |
| **Espacio de tablas** | $1\text{ tabla} \leftrightarrow 1\text{ EV} \leftrightarrow 1\text{ fichero}$ | Cada página solo tiene filas de una tabla. | `SELECT` y escaneo de **una sola tabla**. | `JOIN` entre tablas separadas. |
| **Espacio de agrupación** | $*\text{ tablas} \leftrightarrow 1\text{ EV} \leftrightarrow 1\text{ fichero}$ | Cada fila padre se almacena seguida de sus hijas relacionadas en la **misma página**. | **`JOIN`** entre las tablas agrupadas. | Selección o escaneo de **una sola tabla** (lee filas de la otra). |

**Coste secuencial sin índices en EV de agrupación:** si tenemos $N_A$ filas padre y cada una tiene $k$ filas hijas de tamaño similar con factor de bloqueo $f$, ambas tablas comparten $\left\lceil \frac{N_A \cdot (1 + k)}{f} \right\rceil$ páginas (¡ese será el coste tanto de un `SELECT * FROM A` como de un `JOIN A, B` sin índice!).

*(Otros espacios teóricos: **fragmentado** para tablas gigantes divididas por condición/aleatoriamente en varios ficheros, y **de objetos grandes** para separar atributos pesados de las filas normales).*

:::evviz
:::

---

## 9.3. Árboles $B^+$: estructura y reglas de validación

Un **índice** guarda parejas `(valor, RID)` ordenadas para acelerar accesos por valor. En un árbol $B^+$ de **orden $d$**:

- **Capacidad:** todos los nodos tienen **máximo $2d$ valores**.
- **Ocupación mínima:** todos los nodos **excepto la raíz** deben tener **al menos $d$ valores** ($\ge 50\%$). La raíz puede tener entre $1$ y $2d$ valores.
- **Equilibrado:** todas las hojas están exactamente al **mismo nivel $h$** (raíz = nivel 1).
- **Nodos internos (dirigen la búsqueda):** $n$ valores y $n+1$ punteros $(f_0, v_1, f_1, \dots, v_n, f_n)$, donde $f_0 < v_1$, $v_i \le f_i < v_{i+1}$ y $f_n \ge v_n$.
- **Nodos hoja (guardan las entradas `[valor, RID]`):** tienen punteros a la hoja anterior y siguiente (lista doblemente enlazada).

**4 reglas para validar si un árbol $B^+$ de orden $d$ es correcto (pregunta de examen):**
1. Ningún nodo supera $2d$ valores, y ningún nodo (salvo la raíz) tiene menos de $d$ valores.
2. Todas las hojas están al mismo nivel y ordenadas crecientemente de izquierda a derecha.
3. **Todos** los valores que aparecen en los nodos internos deben estar **repetidos en las hojas** (las hojas contienen el 100% de los valores).
4. **No puede haber valores repetidos en los nodos internos** (ni dentro del mismo nodo ni entre niveles internos distintos), y todo hijo cumple $v_i \le x < v_{i+1}$.

:::bplusviz
:::

---

## 9.4. Dimensionamiento del árbol $B^+$ 

### 1. Capacidad máxima en bytes y con $h$ niveles
Dado tamaño de página $B$, tamaño del valor $V$, tamaño del `RID` $T$ y tamaño de puntero a nodo $A$:
- **Máximo de entradas en un nodo hoja (`nf`):** $nf \cdot (V + T) + 2A \le B \implies nf = \left\lfloor \frac{B - 2A}{V + T} \right\rfloor$
- **Máximo de filas con $h$ niveles (lleno al 100%, orden $d$):** $(2d + 1)^{h-1} \cdot 2d$
- **Total de nodos del árbol (lleno al 100%):** $\sum_{i=0}^{h-1} (2d + 1)^i$

### 2. Páginas de índice y altura dada una ocupación $p$ (ej. $80\%$)
Dadas $N$ tuplas, orden $d$, ocupación $p$ (ej. $0.80$) y factor de bloqueo $f$ de la tabla:

1. **Valores por nodo:** $k = \lfloor 2d \cdot p \rfloor$ *(punteros por nodo interno = $k + 1$)*.
2. **Páginas del nivel hoja:** $P_{\text{hojas}} = \left\lceil \frac{N}{k} \right\rceil$ *(cada fila tiene una entrada `[valor, RID]` en las hojas, aunque el atributo tenga repetidos)*.
3. **Niveles internos (de abajo arriba):** divide iterativamente por $(k+1)$ redondeando arriba ($\lceil P_{\text{hijo}} / (k + 1) \rceil$) hasta llegar a **`1`** página (la raíz).
4. **Total páginas del índice:** suma de las páginas de todos los niveles (hojas + internos + 1).
5. **Altura $h$:** número total de niveles contando la raíz y las hojas.
6. **Páginas de datos de la tabla:** $P_{\text{datos}} = \left\lceil \frac{N}{f} \right\rceil$.

:::bplussizingviz
:::

---

## 9.5. Índice agrupado vs. no agrupado y cálculo de costes

- **Índice agrupado (*cluster*):** las filas del fichero de datos están ordenadas físicamente según el valor del índice. Como máximo **1 índice agrupado por tabla**.
- **Índice no agrupado:** las filas de datos no siguen el orden del índice; puede haber **tantos como se quiera** por tabla.

Sea $h$ la altura del árbol, $k$ las entradas por hoja, $f$ el factor de bloqueo de datos, $M$ el número de filas que cumplen la condición del índice, y $F = \max\left(0, \left\lceil \frac{M}{k} \right\rceil - 1\right)$ el número de hojas adicionales recorridas (si la raíz está en memoria, resta $1$ al coste de índice).

| Tipo de acceso / consulta | Coste de índice | Coste de datos | Coste total |
| :--- | :---: | :---: | :--- |
| **Recorrido secuencial** (sin índice) | $0$ | $\lceil N / f \rceil$ | $\lceil N / f \rceil$ |
| **Igualdad única (`PK` / `UNIQUE`)** | $h$ | $1$ *(0 si no existe)* | $h + 1$ *(o $h$ si no existe)* |
| **Agrupado** (`=` con repetidos o rango `>=`) | $h + F$ | $\lceil M / f \rceil$ | $(h + F) + \lceil M / f \rceil$ |
| **No agrupado** (`=` con repetidos o rango `>=`) | $h + F$ | $M$ | $(h + F) + M$ |
| ***Index-Only Scan*** (`SELECT 1` / `EXISTS` / columnas en el índice) | $h + F$ | **$0$** | $h + F$ |
| **Intersección de RIDs** (2 índices con `AND`, $M_\cap$ coincidencias) | $(h_1 + F_1) + (h_2 + F_2)$ | $M_\cap$ *(o $\lceil M_\cap / f \rceil$ si agrupado contiguo)* | $(h_1 + F_1) + (h_2 + F_2) + M_\cap$ |

**Detalles críticos de examen:**
- **¿Cuándo conviene no usar el índice?** Si $(h + F) + M \ge \lceil N / f \rceil$, es más barato hacer un **recorrido secuencial** de toda la tabla.
- **Consultas con `OR` (`WHERE a = X OR b = Y`):** un solo índice no basta; alternativas del SGBD: unir RIDs de los dos índices (*unión de RIDs*) o hacer recorrido secuencial de la tabla.

:::indexcostviz
:::

---

## 9.6. Índices multiatributo (`[A, B]`)

Un índice multiatributo sobre `[A, B]` ordena las entradas **lexicográficamente** (primero por $A$; a igualdad de $A$, por $B$).

| Consulta | ¿Cómo se resuelve con índice `[A, B]`? |
| :--- | :--- |
| `WHERE A = x AND B = y` (o `B > y`) / `ORDER BY A, B` | **Eficiente:** todas las entradas buscadas son **contiguas** en las hojas ($h + F + \text{datos}$). |
| `WHERE A > x AND B = y` / `ORDER BY B, A` | **Ineficiente:** `B` no es contiguo cuando varía `A`; hay que recorrer todo el rango de $A > x$ (o todas las hojas). |
| `SELECT A FROM T WHERE B = y` *(con `[A, B]`)* | **Index-only scan completo:** todas las columnas están en el índice (**0 accesos a datos**), pero al filtrar por el **2.º atributo** hay que escanear **todas las hojas** (`cost = (h - 1) + P_hojas`). |

:::multiindexviz
:::

---

## 9.7. Ejemplo numérico tipo de examen

**Enunciado:** Tabla `R` con $N = 100.000$ filas, $f = 5$ tuplas/página. Índice sobre `id` (agrupado) y sobre `ciutat` (no agrupado), ambos de orden $d = 50$ y ocupación $80\%$. La consulta `WHERE id > 20000 AND ciutat = 'BCN'` tiene $80.000$ filas con `id > 20000`, $1.000$ de `'BCN'` y $200$ que cumplen ambas condiciones.

1. **Tamaño y altura de los índices:**
   - Valores por nodo: $k = 2 \cdot 50 \cdot 0.80 = 80$ (punteros internos = $81$).
   - Hojas: $\lceil 100.000 / 80 \rceil = 1.250$. Nivel superior: $\lceil 1.250 / 81 \rceil = 16$. Raíz: $\lceil 16 / 81 \rceil = 1$.
   - **Total páginas índice** $= 1.250 + 16 + 1 = 1.267$, **altura $h = 3$**. (Datos: $\lceil 100.000 / 5 \rceil = 20.000$ páginas).
2. **Comparativa de estrategias para resolver la consulta:**
   - **Solo índice agrupado (`id > 20000`):** $F_{\text{id}} = \lceil 80.000 / 80 \rceil - 1 = 999 \implies (3 + 999) + \lceil 80.000 / 5 \rceil = 17.002$ páginas.
   - **Solo índice no agrupado (`ciutat = 'BCN'`):** $F_{\text{ciutat}} = \lceil 1.000 / 80 \rceil - 1 = 12 \implies (3 + 12) + 1.000 = 1.015$ páginas.
   - **Intersección de RIDs (`id` + `ciutat`):** $(3 + 999) + (3 + 12) + 200 = 1.217$ páginas *(peor que usar solo `ciutat`, ¡porque recorrer $999$ hojas de `id` cuesta demasiado!)*.

:::strategyviz
:::
