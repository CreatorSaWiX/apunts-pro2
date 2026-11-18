---
title: "Tema 5: Disparadores (triggers)"
description: "SGBD activos y reglas ECA, sintaxis en PostgreSQL, orden de ejecución (BEFORE/AFTER, ROW/STATEMENT), variables NEW, OLD y TG_OP, valores de retorno, ejemplos clave, criterios de calidad y cascada."
readTime: "12 min"
order: 9
draft: true
---

En el Tema 4 vimos las funciones en PL/pgSQL, pero tienen una limitación: **solo se ejecutan cuando alguien las llama explícitamente**.

Un **disparador** (*trigger*) es como un **sensor de movimiento** colocado sobre una tabla. En lugar de tener que llamar a una función manualmente, le decimos a PostgreSQL: *"cada vez que alguien haga un `INSERT`, `UPDATE` o `DELETE` en esta tabla, ejecuta esta función automáticamente"*.

---

## 5.1. Concepto y regla ECA

Las bases de datos convencionales son **pasivas**: solo hacen cosas cuando se lo pides. Cuando añadimos disparadores, la BD se vuelve **activa** y reacciona sola siguiendo la **regla ECA**:

- **E (Evento):** la operación SQL que hace saltar el sensor (`INSERT`, `DELETE`, `UPDATE` o `UPDATE OF columna`).
- **C (Condición):** comprobación lógica opcional que decide si hace falta actuar o no.
- **A (Acción):** la función PL/pgSQL que se ejecuta como respuesta.

> *«Cuando se produce el evento **E**, si se cumple la condición **C**, entonces se ejecuta la acción **A**.»*

**¿Para qué se usan?** Para auditar cambios (guardar quién ha tocado qué), mantener datos calculados (como un contador de empleados), o hacer cumplir reglas de negocio complejas que un simple `CHECK` no puede expresar.

:::ecaviz
:::

---

## 5.2. Sintaxis en PostgreSQL (los 2 pasos)

En PostgreSQL, crear un disparador siempre se hace en **dos pasos separados**: primero defines *qué hará* (la función) y después *cuándo y dónde se activará* (el trigger).

### Paso 1: Definir la función del disparador
Es una función normal de PL/pgSQL, pero con dos reglas obligatorias: **no tiene parámetros** y devuelve siempre **`trigger`**.

```sql [Paso 1: Función que ejecutará el trigger]
CREATE [OR REPLACE] FUNCTION nombre_funcion() RETURNS trigger AS $$
BEGIN
    -- Código de la función
    RETURN NEW; -- (o OLD o NULL, según el caso que veremos en 5.5)
END;
$$ LANGUAGE plpgsql;
```

### Paso 2: Enganchar la función a una tabla (`CREATE TRIGGER`)
Ahora conectamos la función con la tabla y el evento que la disparará:

```sql [Paso 2: Crear el trigger sobre la tabla]
CREATE TRIGGER nombre_trigger
    { BEFORE | AFTER | INSTEAD OF }
    { INSERT | DELETE | UPDATE [OF col1, col2...] } [OR ...]
    ON nombre_tabla
    [ FOR EACH { ROW | STATEMENT } ]
    EXECUTE PROCEDURE nombre_funcion(); -- (o EXECUTE FUNCTION en versiones nuevas)
```

*(¡Tranquilo! Enseguida veremos qué significan `NEW`, `OLD`, `BEFORE`/`AFTER` y `ROW`/`STATEMENT`.)*

---

## 5.3. Variables especiales (`NEW`, `OLD`, `TG_OP`)

Como la función del trigger **no recibe parámetros**, ¿cómo sabe qué fila se está insertando, modificando o borrando? PostgreSQL le pasa automáticamente estas tres variables:

- **`NEW`:** contiene la **fila nueva** (con los valores que quedarán después del `INSERT` o `UPDATE`). En un `DELETE` vale `NULL` ¡porque no hay ninguna fila nueva!
- **`OLD`:** contiene la **fila antigua** (los valores que había antes del `UPDATE` o `DELETE`). En un `INSERT` vale `NULL` ¡porque antes no existía!
- **`TG_OP`:** es un texto (`'INSERT'`, `'UPDATE'` o `'DELETE'`) que te dice qué operación ha disparado el trigger.

Para acceder a una columna concreta de la fila, usas el punto: `NEW.nombre_columna` o `OLD.nombre_columna`.

| Variable | Significado | `INSERT` (`ROW`) | `UPDATE` (`ROW`) | `DELETE` (`ROW`) | `STATEMENT` |
| :--- | :--- | :---: | :---: | :---: | :---: |
| **`TG_OP`** | Operación activadora | `'INSERT'` | `'UPDATE'` | `'DELETE'` | `'INSERT'` / `'UPDATE'` / `'DELETE'` |
| **`NEW`** | Tupla **después** | Fila nueva | Fila nueva | `NULL` | `NULL` |
| **`OLD`** | Tupla **antes** | `NULL` | Fila antigua | Fila antigua | `NULL` |

::callout[type="warning" title="¡Cuidado con triggers multi-evento!"]
Si un mismo trigger se activa por `INSERT OR DELETE OR UPDATE`, comprueba **siempre `TG_OP` antes de tocar `NEW` o `OLD`**. Si intentas leer `NEW.campo` durante un `DELETE` (o `OLD.campo` durante un `INSERT`), estarás accediendo a `NULL`.
::

:::tgvarsviz
:::

---

## 5.4. ¿Cuándo y cómo se ejecuta? (`BEFORE`/`AFTER` y `ROW`/`STATEMENT`)

Cuando creas un trigger debes tomar dos decisiones clave: **en qué momento** se ejecuta y **con qué frecuencia**.

### 1. `FOR EACH ROW` vs `FOR EACH STATEMENT` (cantidad de veces)

Imagina que haces `UPDATE empleats SET sou = sou * 1.1;` y la tabla tiene **50 empleados**:
- **`FOR EACH ROW`** (nivel de fila): la función se ejecuta **50 veces** (una por cada empleado modificado) y tiene acceso a `NEW` y `OLD`. *(Si el `UPDATE` no afecta a ninguna fila, se ejecuta 0 veces).*
- **`FOR EACH STATEMENT`** (nivel de sentencia): la función se ejecuta **1 sola vez** para todo el comando SQL (¡aunque afecte a 0 filas o a 50!), y `NEW` / `OLD` valen `NULL`.

### 2. `BEFORE` vs `AFTER` (orden de ejecución)

Cuando ejecutas una sentencia SQL, PostgreSQL sigue estrictamente este orden:

1. Triggers **`BEFORE STATEMENT`** (1 vez antes de empezar).
2. Por cada fila afectada:
   **`BEFORE ROW`** $\rightarrow$ **modificación física + comprobación de restricciones (`PK`, `FK`, `CHECK`, `NOT NULL`)** $\rightarrow$ **`AFTER ROW`**.
3. Triggers **`AFTER STATEMENT`** (1 vez al final).

Fíjate en dos detalles vitales de este orden:
- **Precedencia con restricciones:** Si la sentencia viola una `PK`, `FK` o `CHECK`, falla **antes** de llegar a los triggers `AFTER`. Solo un `BEFORE` puede actuar o arreglar la BD antes de que salten las restricciones.
- **Atomicidad (todo o nada):** Todo ocurre dentro de la misma transacción. Si falla una restricción o el trigger lanza `RAISE EXCEPTION`, **se deshacen todos los cambios** hechos hasta ese momento.

### Guía rápida para elegir en el examen

| Decisión | ¿Cuándo elegirla? |
| :--- | :--- |
| **`BEFORE`** | Cuando quieres **modificar `NEW`** antes de que se guarde, **cancelar silenciosamente (`RETURN NULL`)**, o **crear/preparar una FK antes** de que el SGBD compruebe las restricciones. |
| **`AFTER`** | Cuando el trigger toca **otras tablas** (auditoría, contadores externos, mantenimiento de hijos) y quieres estar seguro de que la fila ya ha pasado todas las restricciones (`PK`, `FK`, `CHECK`). |
| **`FOR EACH ROW`** | Cuando necesitas leer **`NEW` o `OLD`** de una fila concreta o hacer actualizaciones **incrementales**. |
| **`FOR EACH STATEMENT`** | Cuando la regla **no depende de ninguna fila concreta** (prohibir operaciones en una tabla, comprobar la hora/día) o para auditar 1 sola vez por sentencia. |

*(Nota: **`INSTEAD OF`** solo se usa sobre **vistas** para sustituir la operación original; no aparece habitualmente en los exámenes finales).*

:::triggerviz
:::

---

## 5.5. Valores de retorno (`RETURN NEW | OLD | NULL`)

Como nadie llama al trigger con un `SELECT`, ¿para qué sirve el `RETURN` del final de la función?
Sirve para que **los triggers `BEFORE ROW` le digan a PostgreSQL si debe seguir adelante con la operación o abortarla para esa fila!**

| Tipo de trigger | `RETURN NEW` | `RETURN OLD` | `RETURN NULL` |
| :--- | :--- | :--- | :--- |
| **`BEFORE ROW` (`INSERT`)** | Inserta la fila (con los cambios hechos en `NEW`). | **Cancela silenciosamente** la inserción *(porque `OLD` es `NULL`!)*. | **Cancela silenciosamente** la inserción (sin error ni `AFTER`). |
| **`BEFORE ROW` (`UPDATE`)** | Modifica la fila (con los cambios hechos en `NEW`). | **Cancela silenciosamente** la modificación de esa fila. | **Cancela silenciosamente** la modificación de esa fila. |
| **`BEFORE ROW` (`DELETE`)** | — | Borra la fila normalmente. | **Cancela silenciosamente** el borrado de esa fila. |
| **`AFTER` o `STATEMENT`** | Ignorado | Ignorado | Ignorado (por convención, pon siempre `RETURN NULL;`). |

::callout[type="danger" title="Trampa típica de examen: RETURN NULL vs RAISE EXCEPTION"]
Devolver `NULL` (o devolver `OLD` en un `INSERT`) dentro de un `BEFORE ROW` **no lanza ningún error**: simplemente se salta esa fila en silencio y evita que se ejecute el trigger `AFTER`. Si el enunciado pide **abortar con un mensaje de error**, debes hacer **`RAISE EXCEPTION '...'`**, no `RETURN NULL`.
::

:::trigretviz
:::

---

## 5.6. Ejemplos prácticos clave

### Ejemplo 1: Mantenimiento incremental (`AFTER ROW` + `TG_OP`)
Queremos mantener actualizado el contador `quants_empleats` en la tabla `departaments` cuando se insertan, borran o cambian de departamento los `empleats`.
- Como modificamos otra tabla y necesitamos `NEW.num_dpt` / `OLD.num_dpt`, elegimos **`AFTER`** + **`FOR EACH ROW`**.

```sql [Contador incremental multi-evento]
CREATE OR REPLACE FUNCTION actualizar_contador() RETURNS trigger AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        UPDATE departaments SET quants_empleats = quants_empleats + 1
        WHERE num_dpt = NEW.num_dpt;
    ELSIF (TG_OP = 'DELETE') THEN
        UPDATE departaments SET quants_empleats = quants_empleats - 1
        WHERE num_dpt = OLD.num_dpt;
    ELSIF (TG_OP = 'UPDATE' AND OLD.num_dpt <> NEW.num_dpt) THEN
        UPDATE departaments SET quants_empleats = quants_empleats - 1
        WHERE num_dpt = OLD.num_dpt;
        UPDATE departaments SET quants_empleats = quants_empleats + 1
        WHERE num_dpt = NEW.num_dpt;
    END IF;
    RETURN NULL; -- En triggers AFTER el retorno se ignora
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_contador_empl
    AFTER INSERT OR DELETE OR UPDATE OF num_dpt ON empleats
    FOR EACH ROW EXECUTE PROCEDURE actualizar_contador();
```

:::incrtriggerviz
:::

### Ejemplo 2: Regla global o bloqueo (`BEFORE STATEMENT`)
Impedir cualquier modificación o borrado sobre la tabla `auditoria`.
- No nos hace falta mirar ninguna fila (`NEW`/`OLD`) y queremos cortarlo antes de tocar nada $\rightarrow$ **`BEFORE`** + **`FOR EACH STATEMENT`**.

```sql [Bloquear operaciones sobre una tabla]
CREATE OR REPLACE FUNCTION proteger_auditoria() RETURNS trigger AS $$
BEGIN
    RAISE EXCEPTION 'No se puede modificar ni borrar la tabla auditoria';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_no_modificar_auditoria
    BEFORE UPDATE OR DELETE ON auditoria
    FOR EACH STATEMENT EXECUTE PROCEDURE proteger_auditoria();
```

:::stmtguardviz
:::

### Ejemplo 3: Modificar la propia fila antes de guardar (`BEFORE ROW`)
Recalcular automáticamente `preu_total` en la misma tabla `items` cuando cambia la cantidad `qtt`.
- Como queremos alterar `NEW.preu_total` antes de que se escriba en disco $\rightarrow$ **`BEFORE`** + **`FOR EACH ROW`** + **`RETURN NEW;`**.

```sql [Modificar NEW antes de guardar la fila]
CREATE OR REPLACE FUNCTION calcular_nuevo_total() RETURNS trigger AS $$
BEGIN
    IF (OLD.qtt <> 0) THEN
        NEW.preu_total := (OLD.preu_total / OLD.qtt) * NEW.qtt;
    END IF;
    RETURN NEW; -- ¡Obligatorio devolver NEW para que se guarden los cambios!
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER atributo_derivado_precio
    BEFORE UPDATE OF qtt ON items
    FOR EACH ROW EXECUTE PROCEDURE calcular_nuevo_total();
```

:::beforemodviz
:::

### Ejemplo 4: Preparar datos antes de una restricción (`BEFORE ROW`)
Garantizar «Todo estudiante debe ser usuario» (donde `estudiant.id_e REFERENCES usuari`).
- Si insertamos un estudiante que aún no es usuario, un trigger **`AFTER`** no llegaría a tiempo (saltaría primero el error de clave foránea). Con **`BEFORE`**, creamos el usuario justo antes de que PostgreSQL compruebe la `FK`.

```sql [Crear el padre antes de que se compruebe la FK]
CREATE OR REPLACE FUNCTION asegurar_usuario() RETURNS trigger AS $$
BEGIN
    IF (NOT EXISTS (SELECT * FROM usuari WHERE id_u = NEW.id_e)) THEN
        INSERT INTO usuari VALUES (NEW.id_e);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_crear_usuario
    BEFORE INSERT ON estudiant
    FOR EACH ROW EXECUTE PROCEDURE asegurar_usuario();
```

:::beforefkviz
:::

*(**Sobre `INSTEAD OF`:** se utiliza con vistas, ej. `INSTEAD OF INSERT ON vista FOR EACH ROW`, para redirigir la operación hacia las tablas base reales).*

---

## 5.7. Criterios de calidad y peligros (cascada y ciclos)

### Criterios de calidad en examen (qué vigilar para no perder puntos)

1. **Implementación incremental (`FOR EACH ROW`) vs recálculo global:**
   Para mantener sumas o contadores en una tabla padre, suma o resta solo el diferencial (`+ 1`, `- 1`, `NEW.val - OLD.val`) en la fila afectada (`WHERE id = NEW.id`).
   - ❌ `UPDATE departaments d SET quants_empleats = (SELECT COUNT(*) FROM empleats e WHERE e.num_dpt = d.num_dpt);` (¡recalcula toda la tabla!)
   - ✅ `UPDATE departaments SET quants_empleats = quants_empleats + 1 WHERE num_dpt = NEW.num_dpt;`

2. **Especificar columnas en `UPDATE OF`:**
   Indica siempre solo los atributos que realmente afectan a la regla (`AFTER UPDATE OF preu ON ...`) para evitar que el trigger se active cuando se modifican otras columnas que no tienen nada que ver.

3. **Cubrir todos los eventos y tablas afectados:**
   Una restricción entre dos tablas a menudo exige triggers en **ambas** (por ejemplo: `INSERT`/`UPDATE` en la tabla hija y `UPDATE`/`DELETE` en la tabla padre).

4. **No usar `ROW` si la regla es global:**
   Si la condición no depende de ninguna fila (horarios, bloqueo total de tabla), usa **`FOR EACH STATEMENT`**.

### Cascada y recursión infinita
- **Disparadores en cascada:** si el trigger de una tabla $A$ modifica la tabla $B$, se activan automáticamente los triggers de $B$. Como todo va dentro de la misma transacción, un error en $B$ deshace también los cambios de $A$.
- **Recursión infinita:** si un trigger de $A$ modifica $B$ y el de $B$ vuelve a modificar $A$ (o un trigger se activa a sí mismo sin parar), PostgreSQL acaba agotando la memoria de llamadas y aborta la transacción.
