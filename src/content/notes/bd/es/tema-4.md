---
title: "Tema 4: PL/pgSQL"
description: "Procedimientos almacenados en PostgreSQL: estructura, retorno escalar y SETOF, CREATE TYPE, variables (%TYPE), control de flujo (IF, FOUND, FOR), gestión de errores (EXCEPTION) y criterios de calidad."
readTime: "8 min"
order: 8
draft: false
---

Un **procedimiento almacenado** (o función) es un bloque de código guardado dentro del SGBD. Reduce el tráfico de red, centraliza reglas de negocio, simplifica las aplicaciones y controla las operaciones de los usuarios sobre la BD.

---

## 4.1. Estructura básica y ejecución

```sql
CREATE [OR REPLACE] FUNCTION nombre_funcion(nombre_param tipo [, ...])
RETURNS tipo_retorno AS $$
DECLARE
    -- Variables locales
BEGIN
    -- Cuerpo: sentencias SQL y PL/pgSQL
    RETURN valor;
END;
$$ LANGUAGE plpgsql;

DROP FUNCTION nombre_funcion(tipo_param); -- Borrado
```

Se puede llamar desde SQL interactivo, desde otro procedimiento o desde una aplicación:

```sql
SELECT nombre_funcion('parámetro');
SELECT * FROM nombre_funcion('parámetro'); -- Recomendado para SETOF o tipos compuestos
```

:::plpgsqlviz
:::

---

## 4.2. Parámetros, tipos de retorno (`SETOF`) y `CREATE TYPE`

| Caso | `RETURNS` | ¿Cómo retorna? |
| :--- | :--- | :--- |
| **Valor único / fila compuesta** | `tipo` o `TNombre` | `RETURN variable;` (termina la función). |
| **Sin retorno** | `void` | Solo acciones (`INSERT`, `UPDATE`, `DELETE`). |
| **Conjunto de tuplas** | `SETOF tipo` o `SETOF TNombre` | `RETURN NEXT variable;` por cada fila (no termina) + `RETURN;` final. |

### Retorno escalar

```sql
CREATE OR REPLACE FUNCTION encontrar_ciudad(dni_cliente VARCHAR(9))
RETURNS VARCHAR(15) AS $$
DECLARE
    ciudad_cliente VARCHAR(15);
BEGIN
    SELECT ciutat INTO ciudad_cliente FROM clients WHERE dni = dni_cliente;
    RETURN ciudad_cliente;
END;
$$ LANGUAGE plpgsql;
```

:::returnviz
:::

### Tipos compuestos (`CREATE TYPE`) y retorno múltiple (`SETOF`)

Cuando una función devuelve varias columnas que no corresponden a una tabla existente, se define previamente un `TYPE` y se accede a los campos con `variable.campo`:

```sql
CREATE TYPE Tdatos_cliente AS (
    dni_cliente  VARCHAR(9),
    nom_cliente  VARCHAR(15),
    pref         CHAR(1)
);

CREATE OR REPLACE FUNCTION clientes_ciudad(ciudad_in clients.ciutat%TYPE)
RETURNS SETOF Tdatos_cliente AS $$
DECLARE
    reg Tdatos_cliente;
BEGIN
    FOR reg IN
        SELECT dni, nom, 'N' FROM clients WHERE ciutat = ciudad_in
    LOOP
        reg.pref := 'P';
        RETURN NEXT reg; -- Añade la fila al resultado sin salir
    END LOOP;
    RETURN;              -- Finaliza la función
END;
$$ LANGUAGE plpgsql;
```

:::setofviz
:::

---

## 4.3. Variables y asignaciones

Todas las variables declaradas en `DECLARE` son locales y viven en memoria volátil:

```sql
nombre_var [CONSTANT] tipo [NOT NULL] [{DEFAULT | :=} expresion];
dni_cliente clients.dni%TYPE; -- Hereda automáticamente el tipo de la columna
```

- Sin inicializar, toman valor **`NULL`**. Si llevan `NOT NULL`, es obligatorio asignarles un valor inicial (`DEFAULT` o `:=`).
- **Asignaciones (solo válidas si devuelven como máximo 1 fila):**
  - Directa o escalar: `var := expresion;` o `qtt := (SELECT qtt_com FROM clients WHERE dni = dni_cliente);`
  - Consulta: `SELECT carrer, num_carrer INTO datosCli FROM clients WHERE dni = dni_cliente;`
  - Llamada a función: `imp := importe_un_ped(num_com);`

:::varviz
:::

---

## 4.4. Condicionales (`IF`) y variable `FOUND`

```sql
IF condicion THEN
    -- sentencias
ELSIF condicion THEN
    -- sentencias
ELSE
    -- sentencias
END IF;
```

`FOUND` es una variable booleana local (inicia en `False`) que indica si la última sentencia SQL ha tenido efecto:

| Sentencia | ¿Cuándo queda `FOUND = True`? |
| :--- | :--- |
| `SELECT ... INTO` | Si devuelve una fila (`False` si no encuentra ninguna). |
| `INSERT / UPDATE / DELETE` | Si afecta al menos a una fila. |
| `FOR ... IN SELECT` | **Al salir del bucle:** `True` si ha iterado $\ge 1$ vez; `False` si 0 veces. |

**Cuidado con `FOUND` dentro y después de un `FOR`:**
- Dentro de cada iteración del `FOR`, cualquier `SELECT ... INTO` o `UPDATE` modifica `FOUND`, pero al salir del `FOR` se sobrescribe según si se ha iterado o no.
- Patrón típico de examen para detectar resultados vacíos después de un `FOR`:

```sql
FOR reg IN SELECT ... LOOP
    RETURN NEXT reg;
END LOOP;
IF NOT FOUND THEN
    RAISE EXCEPTION 'No se han encontrado resultados';
END IF;
```

:::foundviz
:::

---

## 4.5. Sentencias iterativas (bucles)

**Bucle `FOR` sobre consulta SQL (el que se usa en laboratorio y exámenes):**

```sql
CREATE OR REPLACE FUNCTION importe_todos_ped(dni_cliente clients.dni%TYPE)
RETURNS void AS $$
DECLARE
    num_pedido   comandes.num_com%TYPE;
    importe      comandes.import_total%TYPE;
BEGIN
    FOR num_pedido IN SELECT num_com FROM comandes WHERE dni = dni_cliente LOOP
        SELECT SUM(ic.quantitat * i.preu_unitat) INTO importe
        FROM items_comanda ic, items i
        WHERE i.num_item = ic.num_item AND ic.num_com = num_pedido;

        UPDATE comandes SET import_total = importe WHERE num_com = num_pedido;
    END LOOP;
END;
$$ LANGUAGE plpgsql;
```

*(Si el `SELECT` del `FOR` proyecta más de una columna, la variable del bucle debe ser de un tipo compuesto `CREATE TYPE` o `RECORD`.)*

:::forloopviz
:::

**Otros bucles:**

```sql
FOR i IN [REVERSE] 1..10 LOOP ... END LOOP;        -- Número conocido de iteraciones
WHILE condicion LOOP ... END LOOP;                 -- Reevalúa la condición en cada paso
LOOP ... EXIT WHEN condicion; END LOOP;            -- Bucle incondicional
```

*(Nota: los **cursores explícitos** (`DECLARE ... CURSOR FOR`, `OPEN`, `FETCH`, `CLOSE`) no se utilizan en laboratorio ni salen en los exámenes; se usa siempre `FOR ... IN SELECT`.)*

---

## 4.6. Gestión de errores (`EXCEPTION` y `RAISE EXCEPTION`)

Se pueden producir errores del propio SGBD o errores de usuario lanzados con `RAISE EXCEPTION`:

| Condición `WHEN` | `SQLSTATE` | ¿Cuándo salta? |
| :--- | :---: | :--- |
| `raise_exception` | `P0001` | Cuando el código ejecuta `RAISE EXCEPTION '...'` |
| `not_null_violation` | `23502` | Inserción/modificación con `NULL` en columna `NOT NULL` |
| `foreign_key_violation` | `23503` | Valor inexistente en la tabla referenciada (o borrado bloqueado) |
| `unique_violation` | `23505` | Duplicado de `PRIMARY KEY` o `UNIQUE` |
| `check_violation` | `23514` | Incumplimiento de una restricción `CHECK` |
| `OTHERS` | — | Cualquier otro error no capturado previamente |

Dentro de cada rama `WHEN` están disponibles `SQLSTATE` (código de 5 caracteres) y `SQLERRM` (mensaje).

**Reglas críticas del bloque `EXCEPTION`:**
1. Al capturarse una excepción dentro de un bloque `BEGIN ... END`, **se deshacen todas las modificaciones SQL hechas dentro de ese `BEGIN`** antes de ejecutar el `EXCEPTION`.
2. **Poner siempre `WHEN raise_exception` antes de `WHEN OTHERS`:** si no se hace, `WHEN OTHERS` interceptará los `RAISE EXCEPTION` propios y sobrescribirá su mensaje.
3. Si dentro de un bloque `EXCEPTION` se lanza otra excepción (`RAISE EXCEPTION`), el procedimiento aborta inmediatamente y la propaga hacia arriba.

```sql
-- Estrategia estándar de examen (Opción 1: captura y relanzamiento con mensaje propio)
CREATE OR REPLACE FUNCTION nueva_linea(item INT, ped INT, qtt INT)
RETURNS void AS $$
BEGIN
    IF (qtt < 12) THEN
        RAISE EXCEPTION 'Cantidad % inferior a 12', qtt;
    END IF;
    INSERT INTO items_comanda VALUES (item, ped, qtt);
    RETURN;
EXCEPTION
    WHEN raise_exception THEN
        RAISE EXCEPTION '%', SQLERRM; -- Relanza el mensaje propio sin alterarlo
    WHEN foreign_key_violation THEN
        RAISE EXCEPTION 'El pedido o el producto no existen';
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error interno: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;
```

:::exceptionviz
:::

**Otras estrategias (teóricas):**
- **Retorno de objeto de error (`TError(codigo, motivo)`):** devuelve código `'0'` si tiene éxito o `SQLSTATE`/`SQLERRM` si falla (sin abortar).
- **Tabla de errores (`INSERT INTO t_errors`):** registra `SQLSTATE` y `SQLERRM` en una tabla de auditoría y retorna normalmente.
- **Recuperación automática:** resuelve la causa dentro del `WHEN` (ej: `WHEN undefined_table THEN CREATE TABLE ...`), poco habitual.

---

## 4.7. Criterios de calidad en PL/pgSQL

En los exámenes se penaliza (y se pide explícitamente corregir) incumplir estos criterios:

1. **Aprovechar las restricciones declarativas del DDL (`PK`, `UNIQUE`, `FK`, `NOT NULL`, `CHECK`):** No hacer `SELECT` previos con `IF EXISTS` / `IF NOT EXISTS` para validar claves o restricciones antes de un `INSERT`/`UPDATE`. Ejecuta la sentencia directamente y captura `foreign_key_violation`, `unique_violation`, `not_null_violation` o `check_violation` en el bloque `EXCEPTION`. *(Solo hace falta `IF ... RAISE EXCEPTION` para reglas que NO están en el DDL.)*
2. **Sin `SELECT` previos antes de `UPDATE` o `DELETE`:** No compruebes con `IF EXISTS (SELECT ...)` si existen filas a modificar; ejecuta el `UPDATE`/`DELETE` directo (y usa `IF NOT FOUND` si hace falta comprobar si se ha modificado alguna fila).
3. **Sin tablas innecesarias:** No hagas `JOIN` con tablas padre si la tabla hija ya tiene todas las columnas que necesitas (ej: coger `modul, numero` directamente de `assignacions` sin hacer `JOIN` con `despatxos` ni `professors`).
4. **No enmascarar `RAISE EXCEPTION` propios:** Pon siempre `WHEN raise_exception THEN RAISE EXCEPTION '%', SQLERRM;` antes de `WHEN OTHERS`.
