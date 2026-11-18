---
title: "Tema 4: PL/pgSQL"
description: "Procedimientos almacenados en PostgreSQL: estructura, retorno escalar y SETOF, CREATE TYPE, variables (%TYPE), control de flujo (IF, FOUND, FOR), gestión de errores (EXCEPTION) y criterios de calidad."
readTime: "12 min"
order: 8
draft: false
---

Hasta ahora, con SQL solo podíamos hacer consultas o modificaciones de una en una (`SELECT`, `INSERT`, `UPDATE`...). Pero SQL por sí solo no tiene variables, ni `if/else`, ni bucles.

Un **procedimiento almacenado** (o función en **PL/pgSQL**) es básicamente un pequeño programa que guardamos **directamente dentro del servidor de la base de datos** (PostgreSQL). En lugar de que nuestra aplicación tenga que enviar 20 consultas por red y procesarlas fuera, lo hacemos todo en un solo bloque dentro del SGBD:

- **Menos tráfico de red:** se ejecuta todo dentro de la BD y solo devuelve el resultado final.
- **Reglas centralizadas:** cualquier aplicación que acceda a la BD comparte la misma lógica y seguridad.

---

## 4.1. Estructura básica y ejecución

Una función en PL/pgSQL siempre sigue esta plantilla:

```sql [Plantilla de una función]
CREATE [OR REPLACE] FUNCTION nombre_funcion(nombre_param tipo [, ...])
RETURNS tipo_retorno AS $$
DECLARE
    -- (Opcional) Variables locales que solo existen dentro de la función
BEGIN
    -- Cuerpo: sentencias SQL y lógica PL/pgSQL (IF, FOR, etc.)
    RETURN valor;
END;
$$ LANGUAGE plpgsql;
```

¿Qué significa cada parte?
- `CREATE OR REPLACE`: crea la función, o la sobrescribe si ya existe (¡muy útil mientras pruebas código!).
- `RETURNS tipo_retorno`: indica qué devolverá la función al terminar (un número, un texto, una fila, o `void` si no devuelve nada).
- `$$ ... $$`: son simplemente las "comillas" que delimitan el bloque de código para que no tengas que escapar las comillas simples (`'`) de dentro.
- `DECLARE`: donde creas las variables. Si no necesitas ninguna, puedes omitir esta sección.
- `BEGIN ... END;`: donde va el código que se ejecuta.

### Ejemplo mínimo y cómo llamarla

```sql [Ejemplo: sumar dos números]
CREATE OR REPLACE FUNCTION sumar(a INT, b INT)
RETURNS INT AS $$
BEGIN
    RETURN a + b;
END;
$$ LANGUAGE plpgsql;
```

Una vez creada, la función queda guardada en la BD. Puedes llamarla desde SQL, desde otra función o desde una aplicación:

```sql [Cómo ejecutar y borrar funciones]
SELECT sumar(3, 5);                      -- Devuelve 8 (ideal para valores únicos)
SELECT * FROM nombre_funcion('parámetro'); -- Recomendado cuando devuelve múltiples filas (SETOF) o columnas

DROP FUNCTION sumar(INT, INT);           -- Para borrarla (hay que indicar los tipos de los parámetros)
```

:::plpgsqlviz
:::

---

## 4.2. Variables y asignaciones

Todas las variables declaradas en `DECLARE` son locales (solo existen mientras se ejecuta la función). Si no les das ningún valor inicial, valen **`NULL`** por defecto.

```sql [Sintaxis de declaración]
nombre_var [CONSTANT] tipo [NOT NULL] [{DEFAULT | :=} expresion];
```

Un truco muy útil y recomendado en los exámenes es **`%TYPE`**:

```sql
dni_cliente clients.dni%TYPE; -- Copia automáticamente el tipo de la columna 'dni' de 'clients'
```

Esto evita tener que recordar si `dni` era `CHAR(9)` o `VARCHAR(9)`: si alguna vez cambia en la tabla, la función se adapta sola.

### ¿Cómo dar valor a una variable?

1. **Asignación directa:** `total := precio * cantidad;` (fíjate en los dos puntos `:=`: en PL/pgSQL se usa `:=` para asignar, no solo `=`).
2. **Desde una consulta (`SELECT ... INTO`):**
   En SQL normal, un `SELECT` muestra resultados por pantalla. En PL/pgSQL, ==un `SELECT` no puede quedar "al aire": tienes que guardar el resultado dentro de una variable usando `INTO`==.
   ```sql
   SELECT carrer, num_carrer INTO datosCli FROM clients WHERE dni = dni_cliente;
   ```
   *(También funciona con una subconsulta escalar: `qtt := (SELECT qtt_com FROM clients WHERE dni = dni_cliente);`)*
3. **Llamando a otra función:** `imp := importe_un_ped(num_com);`

::callout[type="warning" title="¡Cuidado con SELECT ... INTO!"]
La asignación con `SELECT ... INTO` (o subconsulta `:= (SELECT ...)`) **solo funciona si la consulta devuelve como máximo 1 fila**. Si devuelve 2 o más filas, ¡PostgreSQL lanzará un error en tiempo de ejecución! Si esperas múltiples filas, debes usar un bucle `FOR`.
::

:::varviz
:::

---

## 4.3. Sentencias iterativas (bucles)

El bucle estrella en PL/pgSQL (y prácticamente el único que usarás en laboratorio y exámenes) es **`FOR ... IN SELECT`**. Ejecuta una consulta y va guardando fila a fila dentro de la variable del bucle automáticamente:

```sql [Recorrer los resultados de un SELECT fila a fila]
CREATE OR REPLACE FUNCTION importe_todos_ped(dni_cliente clients.dni%TYPE)
RETURNS void AS $$
DECLARE
    num_pedido   comandes.num_com%TYPE;
    importe      comandes.import_total%TYPE;
BEGIN
    -- Por cada pedido del cliente, calculamos su importe y actualizamos la tabla
    FOR num_pedido IN SELECT num_com FROM comandes WHERE dni = dni_cliente LOOP
        SELECT SUM(ic.quantitat * i.preu_unitat) INTO importe
        FROM items_comanda ic, items i
        WHERE i.num_item = ic.num_item AND ic.num_com = num_pedido;

        UPDATE comandes SET import_total = importe WHERE num_com = num_pedido;
    END LOOP;
END;
$$ LANGUAGE plpgsql;
```

*(Nota: si el `SELECT` del `FOR` devuelve **más de una columna**, la variable del bucle no puede ser un tipo simple como `INT`; debe ser de un tipo compuesto `CREATE TYPE` o bien de tipo `RECORD`.)*

:::forloopviz
:::

### Otros tipos de bucles (menos habituales)

```sql
FOR i IN [REVERSE] 1..10 LOOP ... END LOOP;        -- Para recorrer un rango [1, 10]
WHILE condicion LOOP ... END LOOP;                 -- Mientras se cumpla la condición
LOOP ... EXIT WHEN condicion; END LOOP;            -- Bucle infinito hasta que se cumple EXIT WHEN
```

*(Los **cursores explícitos** con `DECLARE ... CURSOR FOR`, `OPEN`, `FETCH` y `CLOSE` no se utilizan en laboratorio ni entran en los exámenes; siempre se usa `FOR ... IN SELECT`.)*

---

## 4.4. Condicionales (`IF`) y la variable `FOUND`

La sintaxis del condicional es muy directa (cuidado porque se escribe **`ELSIF`**, sin la segunda "e"):

```sql [Estructura IF / ELSIF / ELSE]
IF condicion THEN
    -- sentencias
ELSIF otra_condicion THEN
    -- sentencias
ELSE
    -- sentencias
END IF;
```

### ¿Qué es `FOUND`?

`FOUND` es una ==variable booleana automática== que PostgreSQL mantiene para ti (empieza en `False`). Cada vez que ejecutas una sentencia SQL, PostgreSQL la actualiza para decirte **si la sentencia ha encontrado o afectado a alguna fila**:

| Sentencia ejecutada | ¿Cuándo queda `FOUND = True`? |
| :--- | :--- |
| `SELECT ... INTO` | Si ha encontrado una fila (`False` si la consulta estaba vacía). |
| `INSERT / UPDATE / DELETE` | Si ha modificado/borrado/insertado **al menos 1 fila**. |
| `FOR ... IN SELECT` | **Al salir del bucle:** `True` si ha hecho $\ge 1$ iteración; `False` si el `SELECT` no devolvió nada. |

### La trampa de `FOUND` con el bucle `FOR`

Dentro de cada vuelta de un `FOR`, cualquier `SELECT INTO` o `UPDATE` que hagas irá cambiando el valor de `FOUND`. **Pero al salir del `END LOOP;`**, PostgreSQL sobrescribe `FOUND` para indicar si el `FOR` ha iterado alguna vez o no.

Esto nos da el **patrón clásico de examen** para detectar cuándo una consulta `FOR` no ha encontrado ningún resultado:

```sql [Detectar resultado vacío después de un FOR]
FOR reg IN SELECT ... LOOP
    -- procesamos cada fila
END LOOP;

IF NOT FOUND THEN
    RAISE EXCEPTION 'No se han encontrado resultados';
END IF;
```

:::foundviz
:::

---

## 4.5. Parámetros, tipos de retorno (`SETOF`) y `CREATE TYPE`

Cuando diseñas una función, lo primero que debes decidir es **qué devolverá**. Hay tres casos posibles:

| Caso | ¿Qué pones en `RETURNS`? | ¿Cómo lo devuelve el código? |
| :--- | :--- | :--- |
| **Un solo valor (o una sola fila)** | `INT`, `VARCHAR`, `TNombre`... | `RETURN variable;` (devuelve el valor y **termina** la función). |
| **No devuelve nada (solo hace acciones)** | `void` | Hace `INSERT`/`UPDATE`/`DELETE` y termina (sin `RETURN` o con `RETURN;`). |
| **Varias filas (como una tabla)** | `SETOF tipo` o `SETOF TNombre` | `RETURN NEXT variable;` por cada fila + `RETURN;` al final. |

### Caso 1: Retorno escalar (un solo valor)

```sql [Retorno de un solo valor con SELECT ... INTO]
CREATE OR REPLACE FUNCTION encontrar_ciudad(dni_cliente VARCHAR(9))
RETURNS VARCHAR(15) AS $$
DECLARE
    ciudad_cliente VARCHAR(15);
BEGIN
    -- Guardamos la columna 'ciutat' dentro de la variable 'ciudad_cliente'
    SELECT ciutat INTO ciudad_cliente
    FROM clients
    WHERE dni = dni_cliente;

    RETURN ciudad_cliente;
END;
$$ LANGUAGE plpgsql;
```

:::returnviz
:::

### Caso 2: Retorno múltiple (`SETOF`) y tipos compuestos (`CREATE TYPE`)

Antes de mezclar consultas y tipos nuevos, veamos cómo funciona `SETOF` con un **bucle `FOR` muy sencillo** que solo devuelve números:

```sql [Ejemplo sencillo: un FOR básico con SETOF INT]
CREATE OR REPLACE FUNCTION contar_hasta_5()
RETURNS SETOF INT AS $$
DECLARE
    i INT;
BEGIN
    FOR i IN 1..5 LOOP -- Recordemos que IN es un rango [1,5]
        RETURN NEXT i; -- Añade cada número al resultado, pero NO sale de la función
    END LOOP;

    RETURN; -- Ahora sí: indica que ya no hay más filas y entrega los 5 números
END;
$$ LANGUAGE plpgsql;
```

Visto esto, ¿qué pasa si quieres devolver **varias filas** de una consulta y, además, **varias columnas** (por ejemplo, `dni`, `nom` y un campo extra)? PostgreSQL necesita saber de antemano qué forma tendrá cada fila.

Si las columnas no coinciden exactamente con ninguna tabla existente, primero definimos una "plantilla de fila" con `CREATE TYPE`:

```sql [Definir un tipo compuesto y devolver múltiples filas]
-- 1. Creamos el tipo compuesto (la forma que tendrá cada fila)
CREATE TYPE Tdatos_cliente AS (
    dni_cliente  VARCHAR(9),
    nom_cliente  VARCHAR(15),
    pref         CHAR(1)
);

-- 2. Función que devuelve un conjunto (SETOF) de este tipo
CREATE OR REPLACE FUNCTION clientes_ciudad(ciudad_in clients.ciutat%TYPE)
RETURNS SETOF Tdatos_cliente AS $$
DECLARE
    -- 'reg' es una variable compuesta (como un objeto/struct con 3 campos:
    -- reg.dni_cliente, reg.nom_cliente y reg.pref).
    reg Tdatos_cliente;
BEGIN
    -- En cada vuelta del bucle, PostgreSQL coge UNA fila del SELECT y
    -- rellena los 3 campos de 'reg' automáticamente:
    --   reg.dni_cliente := dni
    --   reg.nom_cliente := nom
    --   reg.pref        := 'N'
    FOR reg IN
        SELECT dni, nom, 'N' FROM clients WHERE ciutat = ciudad_in
    LOOP
        reg.pref := 'P'; -- Cambiamos solo el campo 'pref' de esta fila ('N' -> 'P')
        RETURN NEXT reg; -- Añade esta fila 'reg' a la tabla de salida (¡NO avanza el bucle!)
    END LOOP;            -- Aquí es donde el FOR pasa a la siguiente fila del SELECT

    RETURN; -- Ahora sí: indica que ya no hay más filas y termina la función
END;
$$ LANGUAGE plpgsql;
```

::callout[type="info" title="¿Qué significa exactamente RETURN NEXT reg?"]
El nombre `NEXT` engaña un poco: **no significa "pasa a la siguiente fila del `SELECT`"** (eso ya lo hace solo el `END LOOP`).

`RETURN NEXT reg;` significa: **"añade `reg` como la siguiente fila del resultado que devolverá la función"**, pero sin detenerla.
Imagina que es **poner un producto dentro del carrito**: puedes poner tantos como quieras dentro del bucle, y el `RETURN;` del final es **pasar por caja** y entregar todas las filas acumuladas de golpe.
::

:::setofviz
:::

---

## 4.6. Gestión de errores (`EXCEPTION` y `RAISE EXCEPTION`)

Cuando algo sale mal dentro de una función (por ejemplo, intentamos insertar una clave duplicada o una clave foránea que no existe), PostgreSQL aborta la ejecución. Para controlar estos errores sin que el programa falle de mala manera, ponemos una "red de seguridad" al final del `BEGIN ... END`: el bloque **`EXCEPTION`**.

Además de los errores propios de la BD, nosotros podemos lanzar nuestros propios errores cuando no se cumpla una regla de negocio usando:
`RAISE EXCEPTION 'Mensaje de error con valor: %', variable;`

### Errores más comunes (`WHEN ...`)

| Condición `WHEN` | `SQLSTATE` | ¿Cuándo salta? |
| :--- | :---: | :--- |
| `raise_exception` | `P0001` | Cuando nuestro código ejecuta `RAISE EXCEPTION '...'` |
| `not_null_violation` | `23502` | Se intenta poner `NULL` en una columna `NOT NULL` |
| `foreign_key_violation` | `23503` | El valor no existe en la tabla referenciada (o un borrado está bloqueado) |
| `unique_violation` | `23505` | Clave primaria (`PK`) o `UNIQUE` duplicada |
| `check_violation` | `23514` | Se incumple una restricción `CHECK` de la tabla |
| `OTHERS` | — | Cualquier otro error no capturado más arriba |

Dentro de cada `WHEN` tienes dos variables automáticas: `SQLSTATE` (el código de 5 caracteres) y `SQLERRM` (el texto del mensaje de error).

### ¿Cómo funciona el bloque `EXCEPTION`? (¡Muy importante!)

1. **Rollback automático del bloque:** Si salta una excepción dentro de un `BEGIN ... END`, PostgreSQL **deshace automáticamente todos los `INSERT`, `UPDATE` y `DELETE` hechos dentro de ese `BEGIN`** antes de entrar en el `EXCEPTION`.
2. **Propagación:** Si dentro de un `WHEN` vuelves a hacer un `RAISE EXCEPTION`, la función aborta inmediatamente y pasa el error hacia fuera.

::callout[type="danger" title="Error típico de examen: ¡el orden de WHEN raise_exception!"]
Pon **SIEMPRE** `WHEN raise_exception` **antes** de `WHEN OTHERS`. Si pones `WHEN OTHERS` primero (u olvidas poner `WHEN raise_exception`), ¡`WHEN OTHERS` capturará tus propios `RAISE EXCEPTION` y enmascarará su mensaje original!
::

### Ejemplo estándar de examen

```sql [Captura de errores y mensajes personalizados]
CREATE OR REPLACE FUNCTION nueva_linea(item INT, ped INT, qtt INT)
RETURNS void AS $$
BEGIN
    -- Regla de negocio que no está en el DDL de la tabla: la validamos con IF
    IF (qtt < 12) THEN
        RAISE EXCEPTION 'Cantidad % inferior a 12', qtt;
    END IF;

    -- Si 'item' o 'ped' no existen, saltará 'foreign_key_violation' sola
    INSERT INTO items_comanda VALUES (item, ped, qtt);
    RETURN;
EXCEPTION
    WHEN raise_exception THEN
        RAISE EXCEPTION '%', SQLERRM; -- Relanza nuestro mensaje intacto
    WHEN foreign_key_violation THEN
        RAISE EXCEPTION 'El pedido o el producto no existen';
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error interno: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;
```

:::exceptionviz
:::

*(Nota teórica: aparte de abortar con `RAISE EXCEPTION`, en algunos entornos existen otras estrategias como devolver un tipo `TError(codigo, motivo)` sin abortar, guardar el error en una tabla de auditoría `INSERT INTO t_errors`, o intentar recuperarse automáticamente del error dentro del `WHEN`, aunque en los exámenes el estándar es capturar y relanzar.)*

---

## 4.7. Criterios de calidad (qué vigilar en los exámenes)

En los exámenes no solo miran que el código funcione, sino que esté bien escrito. Estos son los **4 errores de diseño que penalizan** y cómo evitarlos:

1. **Aprovecha las restricciones del DDL (`PK`, `UNIQUE`, `FK`, `NOT NULL`, `CHECK`):**
   No hagas un `SELECT` previo con `IF EXISTS` para comprobar si una clave ya existe o si una clave foránea es válida. Haz el `INSERT`/`UPDATE` directamente y deja que PostgreSQL lo compruebe; si falla, lo capturas en el `EXCEPTION` (`unique_violation`, `foreign_key_violation`, etc.).
   - ❌ `SELECT * INTO ...; IF FOUND THEN RAISE EXCEPTION ...; END IF; INSERT INTO ...;`
   - ✅ `INSERT INTO ...;` y capturar `WHEN unique_violation THEN RAISE EXCEPTION ...;`
   *(Solo hacemos `IF ... RAISE EXCEPTION` para reglas que NO están definidas en el DDL de las tablas).*

2. **No hagas `SELECT` previos antes de `UPDATE` o `DELETE`:**
   No compruebes antes si la fila existe. ¡Ejecuta el `UPDATE` o `DELETE` directamente y comprueba `IF NOT FOUND` justo después!
   - ❌ `IF NOT EXISTS (SELECT ... WHERE id = x) THEN RAISE EXCEPTION ...; END IF; DELETE ...;`
   - ✅ `DELETE FROM tabla WHERE id = x; IF NOT FOUND THEN RAISE EXCEPTION ...; END IF;`

3. **No hagas `JOIN` innecesarios:**
   Si la tabla hija ya tiene la columna que necesitas (por ejemplo, una clave foránea como `modul` y `numero` en `assignacions`), cógela directamente de ahí sin hacer `JOIN` con la tabla padre (`despatxos`).

4. **No enmascares tus `RAISE EXCEPTION`:**
   Recuerda poner `WHEN raise_exception THEN RAISE EXCEPTION '%', SQLERRM;` **antes** de `WHEN OTHERS`.
