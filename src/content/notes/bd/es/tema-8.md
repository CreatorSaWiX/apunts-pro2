---
title: "Tema 8: Transacciones y concurrencia"
description: "Propiedades ACID, interferencias, serializabilidad, recuperabilidad, control con reservas (PR2F), niveles de aislamiento y abrazos mortales."
readTime: "10 min"
order: 11
draft: false
isNew: true
---

Una **transacción** es un conjunto de operaciones de lectura y/o actualización sobre la BD que se ejecuta como una unidad indivisible: o se confirma entera, o se deshace completamente.

---

## 8.1. Sintaxis SQL y propiedades ACID

```sql
START TRANSACTION;  -- Inicio explícito (cualquier sentencia SQL inicia una implícitamente)
-- operaciones SELECT, INSERT, UPDATE, DELETE...
COMMIT;             -- Confirma y hace permanentes los cambios
ROLLBACK;           -- Cancela y deshace todos los cambios (también ABORT)
```

| Propiedad | Significado | ¿Quién la garantiza? |
| :--- | :--- | :--- |
| **A — Atomicidad** | Todo o nada: si la transacción falla o se aborta, se deshacen todos los cambios previos. | SGBD |
| **C — Consistencia** | Lleva la BD de un estado válido a otro estado válido (datos y reglas coherentes). | Programador + restricciones SGBD |
| **I — Aislamiento** | La ejecución concurrente produce el mismo efecto que una ejecución secuencial. | SGBD (control de concurrencia) |
| **D — Definitividad** | Una vez confirmado (`COMMIT`), los cambios persisten ante caídas del sistema. | SGBD (recuperación) |

**Cuidado con los errores y la consistencia en examen:**
- Si una sentencia dentro de `START TRANSACTION ... COMMIT` viola un `CHECK`, una clave foránea o un trigger lanza `RAISE EXCEPTION`, **toda la transacción se aborta (`ROLLBACK`)** y se anulan las operaciones anteriores del bloque.
- Que no salte ninguna restricción DDL no garantiza la **Consistencia (C)**: si el código de la transacción mueve datos pero olvida actualizar un atributo derivado (sin trigger que lo mantenga), viola la consistencia por error de programación.

:::acidviz
:::

---

## 8.2. Las 5 interferencias entre transacciones

Se producen cuando dos o más transacciones se ejecutan concurrentemente sin aislamiento suficiente:

| Interferencia | Descripción | Ámbito | Nivel mínimo para evitarla |
| :--- | :--- | :---: | :--- |
| **Actualización perdida** | Dos transacciones leen un dato y lo actualizan; la segunda pisa el cambio de la primera. | 1 dato | `READ UNCOMMITTED` |
| **Lectura no confirmada** | $T_1$ lee un dato modificado por $T_2$ que no es definitivo ($T_2$ hace `ABORT` o lo vuelve a modificar antes de confirmar). | 1 dato | `READ COMMITTED` |
| **Lectura no repetible** | $T_1$ lee dos veces el mismo dato y obtiene valores distintos porque $T_2$ lo ha modificado en medio. | 1 dato | `REPEATABLE READ` |
| **Análisis inconsistente** | $T_1$ lee un conjunto de datos ($A$ y $B$) mientras $T_2$ los modifica; $T_1$ ve $A$ antes del cambio y $B$ después (o viceversa). | Conjunto | `REPEATABLE READ` |
| **Fantasmas** | $T_1$ lee todas las filas que cumplen una condición $C$; $T_2$ inserta una fila que cumple $C$ o modifica una que no la cumplía para que pase a cumplirla; $T_1$ vuelve a consultar $C$ y aparece la fila nueva. | Conjunto | `SERIALIZABLE` |

:::interferencesviz
:::

### Trampa clásica: lectura no repetible vs. fantasma

Ante dos consultas idénticas `SELECT ... WHERE cond` dentro de $T_1$:
- Si $T_2$ modifica una fila que **ya cumplía** `cond` y sigue cumpliéndola $\rightarrow$ **Lectura no repetible** (misma fila, valor diferente).
- Si $T_2$ **añade** una fila nueva al conjunto resultado (`INSERT` nuevo que cumple `cond`, o `UPDATE` de una fila que antes **no** cumplía `cond` y ahora sí) $\rightarrow$ **Fantasma**.

---

## 8.3. Serializabilidad y grafo de precedencias

- **Gránulo ($G$):** unidad elemental controlada por el SGBD (en examen, normalmente **la fila**, identificada por su PK).
- **Horario (historia):** ejecución concurrente de transacciones preservando el orden de acciones dentro de cada una.
- **Horario serial:** sin solapamientos entre transacciones ($n!$ posibles para $n$ transacciones).

### Traducción de SQL a operaciones sobre gránulos

| Sentencia SQL | Operación sobre gránulo $G$ | Detalle |
| :--- | :--- | :--- |
| `SELECT` | `R(G)` | Una lectura por cada fila devuelta/leída. |
| `INSERT / UPDATE / DELETE` | `RU(G)` seguido de `W(G)` | `RU` = lectura con intención de escritura. Si afecta a varias filas, se pone `RU(G), W(G)` para cada una. |
| Conjunto con **Fantasmas** | `R(IC)` / `RU(IC), W(IC)` | `IC` (Información de Control) solo se incluye si el horario presenta fantasmas. |

:::granuleviz
:::

### Acciones conflictivas y grafo de precedencias

Dos acciones son **conflictivas (no conmutables)** si cumplen las tres condiciones:
1. Pertenecen a **transacciones diferentes** ($T_i \neq T_j$).
2. Operan sobre el **mismo gránulo** ($G$).
3. **Al menos una es de escritura** (`W`). *(Dos lecturas `R`, o `R` con `RU` sin `W`, no generan conflicto entre sí).*

**Construcción del grafo de precedencias:**
- Nodos = transacciones.
- Por cada par de acciones conflictivas sobre $G$ donde la acción de $T_i$ se ejecuta **antes** que la de $T_j$, añadimos la arista dirigida $T_i \xrightarrow{G} T_j$.

```text
Regla de oro:
  Horario serializable  <==>  Grafo de precedencias SIN CICLOS (acíclico)
```

- **Horarios seriales equivalentes:** todos los **órdenes topológicos** válidos del grafo. Por ejemplo, si solo hay $T_2 \to T_1$ y $T_2 \to T_3$ (sin arista entre $T_1$ y $T_3$), tanto `T2; T1; T3` como `T2; T3; T1` son horarios seriales equivalentes.
- **Horario de una sola transacción:** siempre es serializable (ya es un horario serial).

:::precedenceviz
:::

---

## 8.4. Recuperabilidad

La teoría de la serializabilidad asume que todas las transacciones terminan haciendo `COMMIT`, pero en la práctica alguna puede hacer `ABORT`.

> Un horario cumple el **criterio de recuperabilidad** si ninguna transacción $T_2$ que lee o escribe un gránulo escrito por otra transacción $T_1$ confirma (`COMMIT`) antes de que lo haga $T_1$.

```text
# tiempo  T1        T2
1         RU(A)
2         W(A)
3                   RU(A)
4                   W(A)
5                   COMMIT   <-- Viola recuperabilidad (T1 aún no ha confirmado)
6         ABORT              <-- Imposible deshacer el cambio confirmado de T2
```

*(Un horario con una única transacción siempre es recuperable).*

:::recoverviz
:::

---

## 8.5. Control de concurrencia con reservas (PR2F)

Antes de operar sobre un gránulo $G$, una transacción debe pedir su reserva (`LOCK(G, m)`), y liberarla con `UNLOCK(G)`:

| Modalidad | Permite | ¿Compatible con `S`? | ¿Compatible con `X`? |
| :--- | :--- | :---: | :---: |
| **`S` (*Shared*)** | Solo lecturas (`R`) | Sí | No |
| **`X` (*eXclusive*)** | Lecturas y escrituras (`R`, `RU`, `W`) | No | No |

**Reglas de petición de reservas:**
- `R(G)` $\rightarrow$ `LOCK(G, S)` (salvo en `READ UNCOMMITTED`).
- `RU(G), W(G)` $\rightarrow$ **`LOCK(G, X)` antes de `RU(G)`**.
- Si una transacción ya tiene `LOCK(G, S)` y más tarde quiere hacer `RU(G), W(G)`, debe pedir `LOCK(G, X)` (conversión de reserva: si otra transacción tiene `S` sobre $G$, debe esperar).
- Si una transacción ya tiene `LOCK(G, S)` (para repetir lectura) o `LOCK(G, X)` (para leer o escribir de nuevo), **no vuelve a pedir reserva**.

:::lockviz
:::

### Protocolo de Reservas en Dos Fases (PR2F)

- **PR2F:** toda reserva se adquiere antes de operar sobre el gránulo y **nunca** se pide ninguna reserva nueva tras haber liberado alguna. Garantiza **serializabilidad** (si todas hacen `COMMIT`), pero **no evita lecturas no confirmadas ni horarios no recuperables** si se libera antes de terminar.
- **PR2F fuertemente estricto:** PR2F + mantener **todas** las reservas hasta la finalización de la transacción (`COMMIT` o `ABORT`). Garantiza serializabilidad y recuperabilidad.

:::pr2fviz
:::

---

## 8.6. Niveles de aislamiento y simulación de horarios

```sql
SET TRANSACTION { READ ONLY | READ WRITE }
    ISOLATION LEVEL { READ UNCOMMITTED | READ COMMITTED | REPEATABLE READ | SERIALIZABLE };
```

| Nivel de aislamiento | Reservas `S` | Reservas `X` | Reservas `IC` | Interferencias que evita |
| :--- | :--- | :--- | :---: | :--- |
| **`READ UNCOMMITTED`** | **No hace reservas `S`** | Hasta el final | No | Actualización perdida |
| **`READ COMMITTED`** | Solo durante la lectura (`UNLOCK` justo tras `R`) | Hasta el final | No | + Lectura no confirmada |
| **`REPEATABLE READ`** | Hasta el final | Hasta el final | No | + Lectura no repetible y Análisis inconsistente |
| **`SERIALIZABLE`** | Hasta el final | Hasta el final | Sí (`S`/`X` hasta el final) | Todas (incluye Fantasmas) |

:::isolationviz
:::

### Método paso a paso para simular horarios con reservas (cola FIFO)

En la misma ejecución pueden convivir transacciones con niveles de aislamiento distintos: cada una aplica **sus** reglas de reserva.

1. **Orden de ejecución:** procesa las operaciones en el orden temporal original siempre que la transacción no esté suspendida.
2. **Inserta `LOCK` / `UNLOCK`:** pon `LOCK(G, S/X)` justo antes de la operación; en `READ COMMITTED`, pon `UNLOCK(G)` inmediatamente después de `R(G)`. En `REPEATABLE READ` y `SERIALIZABLE` (y todas las `X`), libera en `COMMIT` / `ABORT`.
3. **Bloqueo y cola FIFO:** si una reserva es incompatible con una reserva vigente de otra transacción (o hay una transacción delante en la cola FIFO de ese gránulo), la transacción **se suspende** y entra en la cola **FIFO** de $G$. Mientras está suspendida, **no puede ejecutar ninguna otra instrucción suya**.
4. **Reanudación al liberar:** al ejecutar `UNLOCK(G)`, se otorga la reserva a la primera petición compatible de la cola FIFO de $G$ (si hay varias peticiones `S` seguidas al frente, entran todas hasta el primer `X`) y la transacción reanuda su ejecución.

**Ejemplo (`T1` en `READ COMMITTED`, `T2` en `REPEATABLE READ`):**
Horario original: `T1: R(A)` $\to$ `T2: RU(B), W(B)` $\to$ `T1: R(B)` $\to$ `T2: RU(A), W(A), COMMIT` $\to$ `T1: COMMIT`.

```text
#   T1 (READ COMMITTED)          T2 (REPEATABLE READ)
1   LOCK(A, S)
2   R(A)
3   UNLOCK(A)
4                                LOCK(B, X)
5                                RU(B)
6                                W(B)
7   LOCK(B, S)  [espera B]
8                                LOCK(A, X)      <-- Libre (T1 hizo UNLOCK(A))
9                                RU(A)
10                               W(A)
11                               COMMIT + UNLOCK(B, A)
12  [obtiene LOCK(B, S)]
13  R(B)
14  UNLOCK(B)
15  COMMIT
```

*(Nota: si una `T3` en `READ UNCOMMITTED` ejecutase `R(B)` en el paso 7, no pediría `LOCK(B, S)` y leería inmediatamente el valor no confirmado escrito por `T2`, provocando una **lectura no confirmada**).*

---

## 8.7. Abrazos mortales (*deadlocks*) y grafo de espera

Las esperas por reservas incompatibles pueden formar un bloqueo circular indefinido (**abrazo mortal**).

- **Grafo de espera (en un instante concreto):** nodos = transacciones; arista $T_i \xrightarrow{G} T_j$ si $T_i$ está **esperando** una reserva sobre $G$ concedida actualmente a $T_j$.
- **Detección:** existe abrazo mortal $\iff$ el grafo de espera tiene un **ciclo**.

```text
#   T1 (RR)              T2 (RR)
1   LOCK(A, S)
2   R(A)
3                        LOCK(B, X)
4                        RU(B), W(B)
5   LOCK(B, S) [espera]
6                        LOCK(A, X) [espera]  --> ¡Deadlock!

Grafo de espera:  T1 --(B)--> T2 --(A)--> T1   (ciclo)
```

:::deadlockviz
:::

**No confundir ambos grafos en examen:**
- **Grafo de precedencias:** representa conflictos **ya ejecutados** en el horario $\rightarrow$ ciclo = horario **no serializable**.
- **Grafo de espera:** representa bloqueos **activos en un instante** $\rightarrow$ ciclo = **abrazo mortal**.

**Cómo actúa el SGBD ante abrazos mortales:**
1. **Prevenirlos** antes de que se produzcan.
2. **Detectar ciclos** en el grafo de espera (al pedir reserva, periódicamente o en transacciones lentas) y **cancelar (`ABORT`)** una o más transacciones para romper el ciclo.
3. **Tiempo de espera máximo (*timeout*):** cancelar automáticamente la transacción si supera un umbral de espera.

---

## 8.8. Recuperación física (diario y copias de seguridad)

*(Bloque teórico de apoyo; no aparece habitualmente en los exámenes finales).*

- **Restauración** (ante `ABORT` o caída del sistema): garantiza atomicidad y definitividad usando el **diario (*log*)**, donde se anotan cambios, `COMMIT` y `ABORT`:
  - **Hacia atrás (*undo*):** deshace los cambios de transacciones abortadas o activas en el momento del fallo.
  - **Hacia delante (*redo*):** rehace los cambios de transacciones confirmadas que aún no se habían escrito a disco.
- **Reconstrucción** (ante pérdida física de disco): combina una **copia de seguridad** (*estática* vs. *dinámica*; *completa* vs. *incremental*) con el **diario** registrado a partir del momento de la copia.

:::logviz
:::
