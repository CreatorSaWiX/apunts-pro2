---
title: "Parcial BD"
description: "Resumen tema 1, 2, 3 y 7."
readTime: "10 min"
order: 8
draft: false
---

## 1. SQL y álgebra relacional

### Consultas SQL
- **Orden:** `SELECT [DISTINCT] ... FROM ... [WHERE ...] [GROUP BY ...] [HAVING ...] [ORDER BY ... [ASC|DESC]]`
- **Valores `NULL`:** Comparar siempre con `IS NULL` / `IS NOT NULL` (nunca `= NULL`).
- **Agregación:** `COUNT(*)` cuenta nulos; `COUNT(col)`, `SUM`, `AVG`, `MIN`, `MAX` ignoran nulos (y devuelven `NULL` si 0 filas, excepto `COUNT` que da `0`).
- **`WHERE` vs `HAVING`:** `WHERE` filtra filas antes de agrupar (sin agregaciones). `HAVING` filtra grupos después del `GROUP BY`. Toda columna del `SELECT` fuera de una agregación debe estar en el `GROUP BY`. Ejemplo:
```sql
SELECT a.modul, a.numero, p.nomProf, COUNT(*) 
.
.
.
GROUP BY a.modul, a.numero, p.nomProf
```
- **Subconsultas de exclusión:**
  - `NOT EXISTS (SELECT * FROM ... WHERE ...)`.
  - `col NOT IN (SELECT col FROM ... WHERE col IS NOT NULL)`.

### Enunciados tipo ("Más de X...", "Al menos X...", "X o más...")

Siempre que el enunciado te pida filtrar según la **cantidad de veces**, se debe usar **`GROUP BY` y `HAVING COUNT(...)`**.
**Enunciados típicos:** *"que tengan más de $N$..."*, *"en $N$ o más ocasiones..."*, *"como mínimo $N$..."*.
```sql
SELECT columnas_que_identifican_el_grupo
FROM ...
GROUP BY columnas_que_identifican_el_grupo
HAVING COUNT(*) >= N; -- (o > N, según diga el enunciado)
```

**Ejemplo 1A:** "Obtener el DNI de los profesores que han tenido **5 o más asignaciones** en total (en cualquier despacho)."
Queremos contar filas de `assignacions` por cada profesor. Por tanto, agrupo por `dni`.
```sql
SELECT a.dni
FROM assignacions a
GROUP BY a.dni
HAVING COUNT(*) >= 5;
```

**Ejemplo 1B:** "Obtener el despacho y el nombre del profesor cuando **el mismo profesor** ha sido asignado **al mismo despacho en 3 o más períodos**."
Ahora no cuento cuántas asignaciones tiene el profesor en total, sino cuántas tiene *en un mismo despacho*. Por tanto, en el `GROUP BY` debo poner tanto el despacho (`modul, numero`) como el profesor (`nomProf`).
```sql
SELECT a.modul, a.numero, p.nomProf, COUNT(*) AS numVegades
FROM assignacions a JOIN professors p ON a.dni = p.dni
GROUP BY a.modul, a.numero, p.nomProf
HAVING COUNT(*) >= 3;
```

**Ejemplo 1C:** "Obtener el identificador y nombre de las playlists que tengan **más de 5 canciones de un mismo cantante**."
El recuento es por cada pareja de *(playlist + cantante)*, así que debo hacer `GROUP BY p.idList, p.nomList, c.cantant`. Pero atención: en el `SELECT` solo me piden mostrar la playlist (`idList, nomList`), ¡NO el cantante! Como una playlist podría tener 6 canciones de Shakira y 6 de Rosalía, saldría dos veces; por eso añadimos `DISTINCT` al `SELECT`.
```sql
SELECT DISTINCT p.idList, p.nomList
FROM playlist p 
NATURAL INNER JOIN cançonsAPlaylist cp
NATURAL INNER JOIN cançons c
GROUP BY p.idList, p.nomList, c.cantant
HAVING COUNT(*) > 5;
```

**Ejemplo 1D:** "Obtener el DNI de los profesores que han sido asignados a **5 o más despachos diferentes** dentro de un mismo módulo."
Un profesor puede haber estado en el despacho `'Omega', '101'` en 4 períodos diferentes (4 filas en `assignacions`), ¡pero sigue siendo **1 solo despacho**! Si hago `COUNT(*)`, contará períodos (filas). Si quiero contar *despachos diferentes* dentro del módulo, debo contar cuántos valores diferentes de `numero` tiene: `COUNT(DISTINCT a.numero)`.
```sql
SELECT a.dni, a.modul
FROM assignacions a
GROUP BY a.dni, a.modul
HAVING COUNT(DISTINCT a.numero) >= 5;
```

---

### Enunciados tipo ("Ningún...", "No tiene ningún...", "Nunca...")

Siempre que el enunciado te pida que un elemento **no tenga** ninguna relación con otra cosa (o con una condición), se debe usar **`NOT EXISTS`** dentro del `WHERE`.

**Enunciados típicos:** *"que no tenga ningún..."*, *"que no haya hecho nunca..."*, *"sin ningún..."*.
```sql
SELECT ...
FROM tabla_principal t1
WHERE NOT EXISTS (
    SELECT *
    FROM tabla_secundaria t2
    WHERE t2.clave_foranea = t1.clave_primaria  -- <-- ¡CONEXIÓN OBLIGATORIA!
      AND condicion_prohibida
);
```

*(Nota: Dentro del `NOT EXISTS` **siempre** debe haber una condición que conecte la subconsulta con la tabla de fuera, como `t2.dni = t1.dni`.)*

**Ejemplo 2A:** "Obtener el DNI y nombre de los profesores que **no tienen ninguna asignación vigente**."
Tomo un profesor `p` fuera, y compruebo que dentro de `assignacions` **no exista** ninguna fila de este profesor (`a.dni = p.dni`) con `instantFi IS NULL`.
```sql
SELECT p.dni, p.nomProf
FROM professors p
WHERE NOT EXISTS (
    SELECT *
    FROM assignacions a
    WHERE a.dni = p.dni           -- Conexión con el profesor de fuera
      AND a.instantFi IS NULL     -- Condición de asignación vigente
);
```

**Ejemplo 2B:** "...playlists tales que **su creador no tenga ningún seguidor silenciado**."
Fuera tengo la playlist `p` (que tiene el atributo `p.creador`). Dentro del `NOT EXISTS` busco en la tabla `seguidors s` a alguien que siga a este creador (`s.nomSeguit = p.creador`) y que esté silenciado (`s.silenciat = 0`).
```sql
SELECT p.idList, p.nomList
FROM playlist p
WHERE NOT EXISTS (
    SELECT *
    FROM seguidors s
    WHERE s.nomSeguit = p.creador -- Conexión con el creador de fuera
      AND s.silenciat = 0         -- Condición de silenciado
);
```

**Ejemplo 2C:** "Obtener el nombre de los profesores que **no han sido nunca asignados a ningún despacho de superficie superior a 20 metros cuadrados**."
¿Qué es lo que tienen prohibido estos profesores? Tener una asignación `a` en un despacho `d` con `d.superficie > 20`. Por tanto, pongo el `JOIN` entre `assignacions` y `despatxos` dentro del `NOT EXISTS`.
```sql
SELECT p.nomProf
FROM professors p
WHERE NOT EXISTS (
    SELECT *
    FROM assignacions a 
    JOIN despatxos d ON (a.modul = d.modul AND a.numero = d.numero)
    WHERE a.dni = p.dni           -- Conexión con el profesor de fuera
      AND d.superficie > 20       -- Condición prohibida
);
```

---

### Enunciados tipo ("Todos los...", "Siempre...", "Únicamente...")

En SQL no existe la palabra `FOR ALL` ("para todos"), así que se expresa con una **doble negación** usando **`NOT EXISTS (... WHERE NOT Y)`** (invirtiendo el signo de la condición dentro: `=` pasa a `<>`, `>` pasa a `<=`, `IS NOT NULL` pasa a `IS NULL`).

**Enunciados típicos:** *"donde todos los X cumplen Y"*, *"que únicamente / exclusivamente han hecho Y"*.

**Ejemplo 3A:** "Obtener el DNI de los profesores que tienen alguna asignación y tales que **todas sus asignaciones son en el módulo 'Omega'**."
"Tienen alguna asignación" $\rightarrow$ los tomo de la tabla `assignacions a`. "Todas son en 'Omega'" $\rightarrow$ **No existe** ninguna otra asignación `a2` de este mismo profesor (`a2.dni = a.dni`) donde el módulo **NO sea** `'Omega'` (`a2.modul <> 'Omega'`).
```sql
SELECT DISTINCT a.dni
FROM assignacions a
WHERE NOT EXISTS (
    SELECT *
    FROM assignacions a2
    WHERE a2.dni = a.dni          -- Mismo profesor
      AND a2.modul <> 'Omega'     -- ¡Condición INVERTIDA! (alguna fuera de Omega)
);
```

**Ejemplo 3B:** "Obtener el identificador de las playlists donde **todas las canciones que hay tienen más de 1000 reproducciones totales** (`numTotalReproduccions > 1000`)."
"Todas tienen $> 1000$" se traduce como: **No existe** ninguna canción dentro de esta playlist que tenga **$\le 1000$** reproducciones (`c.numTotalReproduccions <= 1000`).
```sql
SELECT p.idList, p.nomList
FROM playlist p
WHERE NOT EXISTS (
    SELECT *
    FROM cançonsAPlaylist cp 
    JOIN cançons c ON cp.idCanço = c.idCanço
    WHERE cp.idList = p.idList              -- Conexión con la playlist de fuera
      AND c.numTotalReproduccions <= 1000   -- ¡Condición INVERTIDA! (<= en lugar de >)
);
```

---

### Enunciados tipo ("Solo un único...", "El mismo para todos...")

Cuando el enunciado dice que un elemento **solo puede estar relacionado con un único** otro elemento, en la consulta de fuera encontramos el elemento con su relacionado `a`, y con un **`NOT EXISTS`** comprobamos que no exista ningún otro con un identificador diferente (`a2.dni != a.dni`).

**Enunciados típicos:** *"despachos que solo han tenido un único profesor"*, *"playlists donde todas las canciones son de un único cantante"*.

**Ejemplo 4A:** "Obtener los despachos (`modul, numero`) y el DNI del profesor para los despachos que **solo han tenido un único profesor asignado** a lo largo del tiempo."
Comprobamos que en el mismo despacho no haya habido ningún otro profesor con un DNI diferente.
```sql
SELECT DISTINCT a.modul, a.numero, a.dni
FROM assignacions a
WHERE NOT EXISTS (
    SELECT *
    FROM assignacions a2
    WHERE a2.modul = a.modul      -- Mismo módulo
      AND a2.numero = a.numero    -- Mismo número de despacho
      AND a2.dni != a.dni         -- ¡Pero un profesor DIFERENTE!
);
```

**Ejemplo 4B:** "...despachos que **solo han tenido un único profesor asignado con un sueldo superior a 1000**..."
Es idéntico al ejemplo 4A, pero la condición `sou > 1000` debe cumplirla tanto el profesor de fuera (`p.sou > 1000`) como el posible segundo profesor intruso de dentro del `NOT EXISTS` (`p2.sou > 1000`).
```sql
SELECT DISTINCT a.modul, a.numero, p.nomProf
FROM assignacions a JOIN professors p ON a.dni = p.dni
WHERE p.sou > 1000                -- Nuestro profesor cobra > 1000
  AND NOT EXISTS (
      SELECT *
      FROM assignacions a2 JOIN professors p2 ON a2.dni = p2.dni
      WHERE p2.sou > 1000         -- El otro profesor también cobra > 1000
        AND a2.modul = a.modul    -- Mismo módulo
        AND a2.numero = a.numero  -- Mismo número
        AND a2.dni != a.dni       -- ¡Pero es un profesor DIFERENTE!
  );
```

**Ejemplo 4C:** "Obtener el nombre de las playlists y el cantante para aquellas playlists que **solo tienen canciones de un único cantante**."
Fuera junto la playlist con sus canciones para ver su cantante `c.cantant`. Dentro del `NOT EXISTS`, busco si en esa misma playlist (`cp2.idList = p.idList`) hay alguna canción con un cantante diferente (`c2.cantant <> c.cantant`).
```sql
SELECT DISTINCT p.nomList, c.cantant
FROM playlist p
NATURAL INNER JOIN cançonsAPlaylist cp
NATURAL INNER JOIN cançons c
WHERE NOT EXISTS (
    SELECT *
    FROM cançonsAPlaylist cp2 
    NATURAL INNER JOIN cançons c2
    WHERE cp2.idList = p.idList       -- Misma playlist
      AND c2.cantant <> c.cantant     -- ¡Pero un cantante DIFERENTE!
);
```

**Ejemplo combinado (4B + 1B):** "Obtener los despachos que **solo han tenido un único profesor asignado con un sueldo superior a 1000** y que, además, **el mismo profesor ha sido asignado al mismo despacho en 3 o más períodos diferentes**."
Combinamos el filtro de exclusividad en el `WHERE` (Ejemplo 4B) con la agrupación y recuento en el `GROUP BY ... HAVING` (Ejemplo 1B).
```sql
SELECT a.modul, a.numero, p.nomProf, COUNT(*) AS numVegades
FROM assignacions a JOIN professors p ON a.dni = p.dni
WHERE p.sou > 1000 
  AND NOT EXISTS (
      SELECT *
      FROM assignacions a2 JOIN professors p2 ON a2.dni = p2.dni
      WHERE p2.sou > 1000
        AND a2.modul = a.modul 
        AND a2.numero = a.numero
        AND a2.dni != a.dni
  )
GROUP BY a.modul, a.numero, p.nomProf
HAVING COUNT(*) >= 3;
```

---

### Álgebra Relacional
Sin duplicados por definición. Se escribe en secuencia paso a paso ($A = \dots, R = \dots$).

| Operador | Sintaxis | Descripción |
| :--- | :---: | :--- |
| **Selección / Proyección** | $T(\text{cond})$ / $T[A, B]$ | Filtra filas / Recorta columnas. |
| **Renombramiento** | $T\{A \to B\}$ | Cambia nombre de atributos (necesario para $\cup, \cap, -$ o auto-joins). |
| **Joins** | $T[\text{cond}]S$ / $T * S$ | $\theta$-Join (con condición) / Natural Join (mismo nombre de atributos). |
| **Conjuntos** | $T \cup S$, $T - S$, $T \cap S$ | Esquemas idénticos (mismo grado y nombres de atributo). |

---

## 2. DDL y DML

### Definición de tablas (`CREATE TABLE`) e Integridad
- **Restricciones:** `NOT NULL`, `UNIQUE` (admite nulos), `PRIMARY KEY` (`NOT NULL` + `UNIQUE`), `REFERENCES tabla(pk)` (`FOREIGN KEY`), `CHECK (condición)`.
- **Políticas de Clave Foránea (`ON DELETE` / `ON UPDATE`):**
  - `RESTRICT` / `NO ACTION`: Bloquea la operación si hay hijos *(por defecto)*.
  - `CASCADE`: Propaga el borrado o modificación a los hijos.
  - `SET NULL`: Pone la FK a `NULL` (requiere que la FK admita nulos).

### Manipulación de datos (DML)
- `INSERT INTO tabla [(cols)] VALUES (...)` o `INSERT INTO tabla SELECT ...`
- `DELETE FROM tabla [WHERE ...]` *(sin `WHERE` vacía toda la tabla)*.
- `UPDATE tabla SET col = val [WHERE ...]` *(una subconsulta en el `SET` debe devolver 1 sola fila y columna)*.

---

## 3. Componentes Lógicos y Seguridad

### Dominios, Aserciones y Transacciones
- **`CREATE DOMAIN dom AS tipo [DEFAULT v] [CHECK (VALUE ...)]`:** Tipo reutilizable.
- **Dónde poner cada restricción:**
  - 1 columna $\to$ `CHECK` de columna.
  - Múltiples columnas de la **misma fila** $\to$ `CHECK` de tabla (implicación $A \to B \equiv \neg A \lor B$).
  - Múltiples filas o tablas $\to$ `CREATE ASSERTION nom CHECK (NOT EXISTS (SELECT ... infractores))`.
- **Transacciones:** `START TRANSACTION`, `COMMIT` (guarda), `ROLLBACK` (deshace). Aislamiento máximo: `SERIALIZABLE`.

### Vistas (`CREATE VIEW`)
- **Actualizables (SQL estándar):** Solo si se definen sobre **1 sola tabla** (sin `JOIN`, `UNION`, `GROUP BY`, `HAVING`, `DISTINCT` ni agregaciones) y proyectan columnas simples. Para `INSERT`, hay que incluir todas las columnas `NOT NULL` sin `DEFAULT`.
- **`WITH CHECK OPTION`:** Impide hacer `INSERT`/`UPDATE` a través de la vista si la fila resultante deja de cumplir el `WHERE` de la vista.

### Privilegios (`GRANT` / `REVOKE`)
- `GRANT priv ON obj TO usuario [WITH GRANT OPTION]` (`SELECT`, `INSERT`, `UPDATE(col)`, `DELETE`, `REFERENCES`).
- `REVOKE priv ON obj FROM usuario [CASCADE | RESTRICT]` (`CASCADE` revoca en cadena salvo que el usuario tenga un camino alternativo válido en el grafo).
- **Regla de oro:** Un `UPDATE` o `DELETE` con `WHERE col = x` exige permiso de `UPDATE`/`DELETE` **y también `SELECT` sobre `col`**.
- **Privacidad por fila/usuario:** Crear una vista con `WHERE usuario = CURRENT_USER` y dar `GRANT` sobre la vista.

---

## 6. Diseño Conceptual (UML $\to$ Relacional)

### Traducción de Estructuras UML

| Elemento UML | Traducción al Modelo Relacional |
| :--- | :--- |
| **Clase** | Tabla con la clave externa como `PRIMARY KEY`. |
| **Atributo multivaluado `[*]`** | Se transforma en una nueva clase con asociación **1\:N**. |
| **Asociación 1\:N** | FK en el lado **«muchos»** (`*`). Si el mínimo del lado «uno» es `1`, la FK es `NOT NULL`. |
| **Asociación 1\:1** | FK en cualquiera de los dos lados (preferible en el lado `1..1`) con restricción **`UNIQUE`**. |
| **Asociación M\:N** | Nueva tabla con $\text{PK} = (\text{FK}_1, \text{FK}_2)$. |
| **Asociación Ternaria** | Nueva tabla:<li>Si es $* - * - *$: $\text{PK} = (A, B, C)$.</li><li>Si es $* - * - 0..1$: $\text{PK} = (A, B)$ y $C$ es FK `NOT NULL`.</li><li>Si es $* - 0..1 - 0..1$: $\text{PK} = (A, B)$ y $(A, C)$ es `UNIQUE NOT NULL`.</li> |
| **Asociación Recursiva** | **1\:N:** FK a la misma tabla (`dni_jefe`). **M\:N:** Nueva tabla con dos FK a la misma tabla. |
| **Clase Asociativa** | Sus atributos se añaden a la tabla de la asociación. |
| **Herencia** | 1 tabla para la superclase + 1 para cada subclase con $\text{PK} = \text{FK}$ apuntando a la superclase. |
| **Clase débil** | $\text{PK}$ compuesta por la PK de la clase fuerte + su identificador relativo. |
| **Clase temporal pura** | No crea tabla; se traduce como atributo `DATE`/`TIME`/`INT` en la tabla asociada. |

### Validación de Afirmaciones UML (Verdadero / Falso)
- **VERDADERA:** Se demuestra construyendo una instancia mínima de filas que cumpla todas las PK, FK y multiplicidades.
- **FALSA:** Viola una multiplicidad máxima (`1`), mínima (`1`) o clave externa. Se arregla cambiando la multiplicidad (`1` $\to$ `*` o `1` $\to$ `0`) o haciendo la clave relativa.

