---
title: "Tema 1: SQL y álgebra relacional"
description: "DQL, funciones de agregación, subconsultas y álgebra relacional."
readTime: "12 min"
order: 1
draft: false
---

Todas las consultas usan la sentencia `SELECT`. Esquema de referencia para los ejemplos:

:::sqlviz{simulation="esquema_empresa"}
:::

---

## 1.1. Estructura básica de `SELECT`

```sql
SELECT [DISTINCT | ALL] col_1, col_2 ...
FROM tabla
[WHERE condicion]
[GROUP BY col_a, col_b ...]
[HAVING condicion_grupo]
[ORDER BY col_x [ASC | DESC] ...];
```

`SELECT *` devuelve todas las columnas; `SELECT nom_empl, sou` devuelve solo las indicadas. El alias `AS` permite nombrar el resultado de un cálculo:

```sql
SELECT nom_empl, sou * 1.05 AS sou_incrementat FROM empleats;
```

`DISTINCT` elimina las filas repetidas del resultado:

```sql
SELECT DISTINCT ciutat_empl FROM empleats;
```

:::distinctviz
:::

`ORDER BY` ordena el resultado: `ASC` de menor a mayor (por defecto), `DESC` de mayor a menor:

```sql
SELECT * FROM empleats 
ORDER BY num_dpt ASC, sou DESC;
```

---

## 1.2. Filtros en la cláusula `WHERE`

| Operador | Uso | Ejemplo |
| :--- | :--- | :--- |
| **Comparación** | `=`, `<>`, `<`, `<=`, `>`, `>=` | `sou > 200000` |
| **Lógicos** | `AND`, `OR`, `NOT` | `num_dpt = 1 AND sou > 150000` |
| **Rangos** | `BETWEEN a AND b` *(inclusivo)* | `sou BETWEEN 200000 AND 300000` |
| **Listas** | `IN (v1, v2...)` / `NOT IN` | `ciutat_empl IN ('VIC', 'MATARO')` |
| **Texto** | `LIKE 'patron'` | `nom_empl LIKE 'J%'` |
| **Nulos** | `IS NULL` / `IS NOT NULL` | `ciutat_empl IS NOT NULL` |

`LIKE` permite buscar por patrón de texto: `%` sustituye cualquier secuencia de caracteres (incluso vacía), y `_` sustituye exactamente un carácter. Por ejemplo, `nom_empl LIKE 'J%'` encuentra todos los empleados cuyo nombre empieza por "J" (como "JOAN", "JÚLIA", etc.), y `nom_empl LIKE 'J_AN'` encontraría "JOAN" pero no "JOAN PERE".

**Cuidado con los NULL en las condiciones:** Nunca utilices `= NULL` o `<> NULL`, que nunca dan verdadero en filtros. Utiliza siempre **`IS NULL`** o **`IS NOT NULL`**.

---

## 1.3. Funciones de agregación

Procesan múltiples filas y devuelven un único valor resumen:

| Función | Descripción | Comportamiento con valores `NULL` |
| :--- | :--- | :--- |
| `COUNT(*)` | Total de filas devueltas | Cuenta todas las filas (incluye nulos). |
| `COUNT(col)` | Filas con valor no nulo en `col` | Ignora valores `NULL`. |
| `COUNT(DISTINCT col)` | Valores distintos y no nulos | Ignora duplicados y valores `NULL`. |
| `SUM(col)` | Suma aritmética | Ignora valores `NULL`. |
| `AVG(col)` | Media aritmética | Ignora valores `NULL`. |
| `MIN(col)` / `MAX(col)` | Valor mínimo / máximo | Ignora valores `NULL`. |

Si ninguna fila cumple el filtro, `COUNT` devuelve `0`, mientras que `SUM`, `AVG`, `MIN` y `MAX` devuelven `NULL`.

```sql
SELECT COUNT(*), AVG(sou), MAX(sou)
FROM empleats 
WHERE num_dpt = 2;
```

:::aggregateviz
:::

---

## 1.4. Agrupamientos (`GROUP BY`) y condiciones sobre grupos (`HAVING`)

`GROUP BY` divide las filas en grupos según los valores de las columnas indicadas. Toda columna individual del `SELECT` **debe aparecer en el `GROUP BY` o bien dentro de una función de agregación**; no se puede proyectar una columna que no forme parte del criterio de agrupamiento.

```sql
SELECT num_dpt, AVG(sou) AS sou_mig
FROM empleats 
GROUP BY num_dpt;
```

:::groupbyviz
:::

`WHERE` filtra filas individuales **antes** de agrupar y nunca puede contener funciones de agregación. `HAVING` filtra **grupos resultantes después** del agrupamiento y es donde se usan condiciones sobre `COUNT`, `AVG`, etc.:

```sql
SELECT num_dpt, AVG(sou) AS sou_mig
FROM empleats
WHERE sou > 200000        -- 1. Filtra empleados individuales con sou > 200k
GROUP BY num_dpt          -- 2. Agrupa por departamento
HAVING COUNT(*) > 1;      -- 3. Mantiene solo departamentos con más de 1 empleado que cumpla el WHERE
```

:::sqlviz{simulation="select_group_having"}
:::

---

## 1.5. Consultas multitaula (Joins)

Permiten combinar filas de múltiples tablas relacionadas. La forma estándar recomendada es `INNER JOIN ... ON`:

```sql
SELECT e.nom_empl, d.nom_dpt
FROM empleats e
INNER JOIN departaments d ON e.num_dpt = d.num_dpt;
```

:::sqlviz{simulation="select_filtre_join"}
:::

`NATURAL INNER JOIN` iguala automáticamente las columnas que comparten el mismo nombre en ambas tablas, sin necesidad de especificar la condición:

```sql
SELECT e.nom_empl, d.nom_dpt
FROM empleats e
NATURAL INNER JOIN departaments d;
```

:::naturaljoinviz
:::

Los joins se pueden combinar con agregación:

```sql
SELECT d.nom_dpt, AVG(e.sou) AS sou_mig
FROM empleats e
INNER JOIN departaments d ON e.num_dpt = d.num_dpt
GROUP BY d.nom_dpt
HAVING COUNT(*) > 1;
```

:::joinaggviz
:::

---

## 1.6. Operaciones de conjuntos (`UNION`)

`UNION` combina verticalmente los resultados de dos `SELECT` independientes en un único resultado, eliminando automáticamente las filas duplicadas. `UNION ALL` conserva los duplicados y es más rápido en ejecución. Las dos consultas deben tener exactamente el mismo número de columnas y tipos compatibles, y el `ORDER BY` solo se puede colocar al final del todo:

```sql
SELECT ciutat_dpt AS ciutat FROM departaments
UNION
SELECT ciutat_empl AS ciutat FROM empleats;
```

:::unionviz
:::

---

## 1.7. Subconsultas

Una subconsulta es un `SELECT` dentro de otra consulta. Para encontrar los departamentos **sin ningún empleado**:

#### Con `NOT IN` (cuidado con los valores `NULL`):
```sql
SELECT * FROM departaments
WHERE num_dpt NOT IN (
    SELECT num_dpt FROM empleats
    WHERE num_dpt IS NOT NULL -- ¡IMPRESCINDIBLE!
);
```

**La trampa de NULL con `NOT IN`:** Si la subconsulta devuelve aunque sea un solo valor `NULL`, la expresión `NOT IN` devolverá siempre falso y **la consulta no devolverá ninguna fila**. Para hacerla segura hay que añadir siempre `WHERE col IS NOT NULL`.

#### Con `NOT EXISTS` (opción recomendada y segura):
```sql
SELECT * FROM departaments d
WHERE NOT EXISTS (
    SELECT * FROM empleats e
    WHERE e.num_dpt = d.num_dpt
);
```
`NOT EXISTS` comprueba si la subconsulta devuelve alguna fila y es completamente inmune a los valores `NULL`.

---

## 1.8. Tipos y funciones temporales

Los tipos de fecha y hora principales son: `DATE` (formato `'YYYY-MM-DD'`), `TIME` (formato `'HH:MM:SS'`), `TIMESTAMP` e `INTERVAL`. Para obtener la fecha u hora actual se usan `CURRENT_DATE`, `CURRENT_TIME` o `NOW()`.

`EXTRACT` permite extraer una parte concreta de una fecha:

```sql
EXTRACT(YEAR FROM data)       -- Año (ej: 2024)
EXTRACT(MONTH FROM data)      -- Mes (1 a 12)
EXTRACT(DOW FROM data)        -- Día de la semana (0 = Domingo)
```

:::extractviz
:::

`INTERVAL` permite sumar o restar periodos de tiempo:

```sql
SELECT * FROM viatges
WHERE moment > (data_sortida + INTERVAL '10 min');
```

:::intervalviz
:::

---

## 1.9. Criterios de calidad

En los exámenes de la FIB, aunque una consulta SQL devuelva el resultado correcto, se aplican penalizaciones directas si no cumple estos criterios:

1. **Sin tablas innecesarias en el `FROM`:** No incluir nunca una tabla si todos los atributos necesarios ya se encuentran en otra tabla vinculada por clave foránea. *Mal:* `SELECT e.nom FROM empleats e, departaments d WHERE e.num_dpt = d.num_dpt AND d.num_dpt = 20;` — *Bien:* `SELECT e.nom FROM empleats e WHERE e.num_dpt = 20;`
2. **Uso estricto de `DISTINCT`:** Se debe usar **únicamente** si la consulta puede generar duplicados para algún contenido válido de la BD. **No se debe usar nunca** si la presencia de una clave primaria o clave candidata garantiza matemáticamente que el resultado no tendrá repetidos.
3. **No usar `GROUP BY` para eliminar duplicados:** Para eliminar repetidos se usa `DISTINCT`, nunca un `GROUP BY` sin funciones de agregación.
4. **No usar `GROUP BY` sobre un grupo único:** *Mal:* `SELECT AVG(sou) FROM empleats WHERE num_dpt = 5 GROUP BY num_dpt;` — *Bien:* `SELECT AVG(sou) FROM empleats WHERE num_dpt = 5;`
5. **Sin condiciones triviales o redundantes en el `HAVING`:** No poner `HAVING COUNT(*) >= 1` si la combinación de tablas ya garantiza la existencia de filas.

---

## 1.10. Álgebra relacional

El **Álgebra Relacional** es un lenguaje formal donde las consultas se especifican aplicando operadores sobre relaciones para producir nuevas relaciones. En los exámenes vale entre **1,5 y 2,5 puntos** y se exige escribir una secuencia de asignaciones paso a paso ($A = \dots, B = \dots, R = \dots$).

A diferencia de SQL, en álgebra relacional **nunca hay tuplas repetidas**: la proyección elimina duplicados automáticamente. Para hacer operaciones de conjuntos ($\cup$, $\cap$, $-$), las dos relaciones deben tener el mismo número de atributos, con nombres idénticos; si no coinciden, hay que renombrar previamente.

### Operadores

| Operador | Sintaxis | Descripción |
| :--- | :---: | :--- |
| **Selección** | $T(condicion)$ | Filtra las tuplas que cumplen la condición. |
| **Proyección** | $T[A_1, A_2, \dots]$ | Recorta columnas y elimina duplicados. |
| **Renombramiento** | $T\{A \to B\}$ | Cambia el nombre de los atributos. |
| **Producto Cartesiano** | $T \times S$ | Concatena cada fila de $T$ con cada fila de $S$. |
| **Unión** | $T \cup S$ | Tuplas que están en $T$, en $S$ o en ambas. |
| **Diferencia** | $T - S$ | Tuplas que están en $T$ pero NO en $S$. |
| **Intersección** | $T \cap S$ | Tuplas que pertenecen a $T$ y a $S$. |
| **$\theta$-Join** | $T[condicion]S$ | Producto cartesiano filtrado por condición. |
| **Natural Join** | $T * S$ | Iguala atributos con mismo nombre y elimina duplicados. |

:::relalgviz
:::

> **Enunciado (LearnSQL - Ejercicio 4):**  
> *Dad una secuencia de operaciones del álgebra relacional para obtener el número y nombre de los departamentos que tienen dos o más empleados que viven en ciudades distintas.*

:::sqlviz{simulation="relalg_empleats_ciutats"}
:::

En los exámenes escritos a mano se aplica esta notación:

$$A = \text{EMPLEATS}\{\text{CIUTAT\_EMPL} \to \text{C1}, \text{NUM\_DPT} \to \text{D1}\}$$

$$B = \text{EMPLEATS}[\text{NUM\_DPT} = \text{D1}, \text{CIUTAT\_EMPL} \neq \text{C1}] A$$

$$C = \text{DEPARTAMENTS} * B$$

$$R = C[\text{NUM\_DPT}, \text{NOM\_DPT}]$$
