---
title: "Tema 5: Disparadores (triggers)"
description: "SGBD activos y reglas ECA, sintaxis en PostgreSQL, orden de ejecución (BEFORE/AFTER, ROW/STATEMENT), variables NEW, OLD y TG_OP, valores de retorno, ejemplos clave, criterios de calidad y cascada."
readTime: "10 min"
order: 9
draft: true
---

Un **disparador** es un mecanismo que permite al SGBD reaccionar automáticamente ejecutando una función cuando se produce un determinado evento de manipulación de datos (`INSERT`, `UPDATE` o `DELETE`).

---

## 5.1. Concepto y regla ECA

Los SGBD convencionales son **pasivos** (solo ejecutan operaciones bajo petición explícita). Un SGBD **activo** incorpora comportamiento reactivo basado en la **regla ECA**:

- **E (Evento):** La operación SQL que activa el disparador (`INSERT`, `DELETE`, `UPDATE` o `UPDATE OF columna`).
- **C (Condición):** Expresión lógica que determina si es necesario ejecutar la acción.
- **A (Acción):** Procedimiento almacenado específico que contiene las instrucciones a llevar a cabo.

> *«Cuando se produce el evento E, si se cumple la condición C, entonces se ejecuta la acción A.»*

Ámbitos de uso: auditoría, mantenimiento de atributos derivados, reglas de negocio complejas (que un `CHECK` no puede expresar) y mantenimiento de datos relacionados entre tablas.

:::ecaviz
:::

---

## 5.2. Sintaxis en PostgreSQL

La creación de un disparador requiere **dos pasos independientes**:

**Paso 1: Definir la función del disparador** (sin parámetros, devuelve obligatoriamente `trigger`):

```sql
CREATE [OR REPLACE] FUNCTION nombre_funcion() RETURNS trigger AS $$
BEGIN
    -- Código de la función
    RETURN NEW; -- o OLD o NULL
END;
$$ LANGUAGE plpgsql;
```

**Paso 2: Definir el disparador (`CREATE TRIGGER`):**

```sql
CREATE TRIGGER nombre_trigger
    { BEFORE | AFTER | INSTEAD OF }
    { INSERT | DELETE | UPDATE [OF col1, col2...] } [OR ...]
    ON nombre_tabla
    [ FOR EACH { ROW | STATEMENT } ]
    EXECUTE PROCEDURE nombre_funcion(); -- (o EXECUTE FUNCTION en versiones nuevas)
```

---

## 5.3. Orden de ejecución, nivel y criterio de elección

**Secuencia completa de ejecución de una sentencia:**
1. Disparadores `BEFORE STATEMENT` (1 vez antes de empezar).
2. Por cada fila afectada: `BEFORE ROW` $\rightarrow$ modificación física + comprobación de restricciones (`PK`, `FK`, `CHECK`, `NOT NULL`) $\rightarrow$ `AFTER ROW`.
3. Disparadores `AFTER STATEMENT` (1 vez al final).

- **Precedencia con restricciones:** Si la sentencia viola una restricción de tabla (`PK`, `FK`, `CHECK`), falla **antes** de llegar a los triggers `AFTER` (solo un `BEFORE` puede interceptar o preparar la BD antes de la comprobación).
- **Atomicidad:** Todo se ejecuta dentro de la misma transacción. Si falla una restricción o salta `RAISE EXCEPTION` (tanto en la sentencia como dentro del trigger), se deshacen **todos** los cambios de la transacción (o de la sentencia si se ejecuta sin bloque transaccional explícito).

### Cómo elegir y justificar el tipo de trigger en examen

| Decisión | ¿Cuándo elegirla? |
| :--- | :--- |
| **`BEFORE`** | Para **modificar `NEW`**, **cancelar silenciosamente (`RETURN NULL`)**, validar reglas globales antes de tocar datos, o **crear/preparar una FK antes** de que el SGBD compruebe las restricciones. |
| **`AFTER`** | Cuando la acción modifica otras tablas (auditoría, atributos derivados externos, mantenimiento de hijos) y hace falta que la fila ya esté validada por todas las restricciones de la BD. |
| **`FOR EACH ROW`** | Cuando hay que acceder a **`NEW` o `OLD`** de una fila concreta o hacer actualizaciones **incrementales**. *(Si la sentencia afecta 0 filas, no se ejecuta).* |
| **`FOR EACH STATEMENT`** | Cuando la regla **no depende de ninguna fila** (franja horaria, prohibir operaciones sobre una tabla, contador global) o para auditar 1 vez por sentencia. *(Se ejecuta siempre 1 vez, aunque afecte 0 filas).* |

*(Nota: **`INSTEAD OF`** se usa únicamente sobre **vistas** para sustituir la operación original; no aparece habitualmente en los exámenes finales).*

:::triggerviz
:::

---

## 5.4. Variables especiales (`TG_OP`, `NEW`, `OLD`)

| Variable | Significado | `INSERT` (`ROW`) | `UPDATE` (`ROW`) | `DELETE` (`ROW`) | `STATEMENT` |
| :--- | :--- | :---: | :---: | :---: | :---: |
| **`TG_OP`** | Operación activadora | `'INSERT'` | `'UPDATE'` | `'DELETE'` | `'INSERT'` / `'UPDATE'` / `'DELETE'` |
| **`NEW`** | Tupla **después** | Fila nueva | Fila nueva | `NULL` | `NULL` |
| **`OLD`** | Tupla **antes** | `NULL` | Fila antigua | Fila antigua | `NULL` |

**Cuidado con triggers multi-evento (`INSERT OR DELETE OR UPDATE`):** comprueba siempre `TG_OP` antes de acceder a `NEW` (en `DELETE` vale `NULL`) o a `OLD` (en `INSERT` vale `NULL`).

:::tgvarsviz
:::

---

## 5.5. Valores de retorno (`RETURN NEW | OLD | NULL`)

| Tipo de trigger | `RETURN NEW` | `RETURN OLD` | `RETURN NULL` |
| :--- | :--- | :--- | :--- |
| **`BEFORE ROW` (`INSERT`)** | Inserta la fila (con los cambios hechos en `NEW`). | **Cancela silenciosamente** la inserción *(¡porque `OLD` es `NULL`!)*. | **Cancela silenciosamente** la inserción (sin error ni `AFTER`). |
| **`BEFORE ROW` (`UPDATE`)** | Modifica la fila (con los cambios hechos en `NEW`). | **Cancela silenciosamente** la modificación de esa fila. | **Cancela silenciosamente** la modificación de esa fila. |
| **`BEFORE ROW` (`DELETE`)** | — | Borra la fila normalmente. | **Cancela silenciosamente** el borrado de esa fila. |
| **`AFTER` o `STATEMENT`** | Ignorado | Ignorado | Ignorado (convención: usar siempre `RETURN NULL;`). |

**Trampa típica de examen:** devolver `NULL` (o devolver `OLD` en un `INSERT`) dentro de un `BEFORE ROW` **no lanza ninguna excepción**; simplemente descarta la operación sobre esa fila y evita que se ejecute el trigger `AFTER`.

:::trigretviz
:::

---

## 5.6. Ejemplos prácticos clave

### Ejemplo 1: mantenimiento incremental multi-evento (`AFTER ROW` + `TG_OP`)
Mantener el contador derivado `quants_empleats` en `departaments` ante inserciones, borrados o cambios de departamento en `empleats`:

```sql
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
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_contador_empl
    AFTER INSERT OR DELETE OR UPDATE OF num_dpt ON empleats
    FOR EACH ROW EXECUTE PROCEDURE actualizar_contador();
```

:::incrtriggerviz
:::

### Ejemplo 2: regla global o bloqueo (`BEFORE STATEMENT`)
Impedir cualquier modificación o borrado sobre la tabla `auditoria` (o restringir operaciones según la hora/día):

```sql
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

### Ejemplo 3: modificar la propia fila (`BEFORE ROW`)
Recalcular automáticamente `preu_total` en la misma tabla `items` cuando cambia `qtt`:

```sql
CREATE OR REPLACE FUNCTION calcular_nuevo_total() RETURNS trigger AS $$
BEGIN
    IF (OLD.qtt <> 0) THEN
        NEW.preu_total := (OLD.preu_total / OLD.qtt) * NEW.qtt;
    END IF;
    RETURN NEW; -- ¡Obligatorio devolver NEW modificado!
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER atributo_derivado_precio
    BEFORE UPDATE OF qtt ON items
    FOR EACH ROW EXECUTE PROCEDURE calcular_nuevo_total();
```

:::beforemodviz
:::

### Ejemplo 4: precedencia antes de restricciones (`BEFORE ROW`)
Garantizar «Todo estudiante debe ser usuario» (con `estudiant.id_e REFERENCES usuari`):

```sql
CREATE OR REPLACE FUNCTION asegurar_usuario() RETURNS trigger AS $$
BEGIN
    IF (NOT EXISTS (SELECT * FROM usuari WHERE id_u = NEW.id_e)) THEN
        INSERT INTO usuari VALUES (NEW.id_e);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Al ser BEFORE, se ejecuta ANTES de que la BD compruebe la clave foránea
CREATE TRIGGER auto_crear_usuario
    BEFORE INSERT ON estudiant
    FOR EACH ROW EXECUTE PROCEDURE asegurar_usuario();
```

Si fuera `AFTER`, fallaría inmediatamente por violación de clave foránea antes de ejecutar el trigger.

:::beforefkviz
:::

*(**Sobre `INSTEAD OF`:** se utiliza con vistas, ej. `INSTEAD OF INSERT ON vista FOR EACH ROW`, para redirigir la operación hacia las tablas base reales).*

---

## 5.7. Criterios de calidad y peligros (cascada y ciclos)

### Criterios de calidad en examen
1. **Implementación incremental (`FOR EACH ROW`) vs. recálculo global:** para mantener sumas o contadores en una tabla padre, usa `FOR EACH ROW` aplicando el diferencial (`NEW.val - OLD.val`) solo a la fila afectada (`WHERE id = NEW.id`), **nunca** un `SELECT SUM(...)` sobre toda la tabla ni actualizando todas las filas sin `WHERE`.
2. **Especificar columnas en `UPDATE OF`:** indica siempre solo los atributos relevantes (`AFTER UPDATE OF preu ON ...`) para evitar activaciones innecesarias.
3. **Cubrir todos los eventos y tablas afectados:** una restricción entre dos tablas puede exigir triggers en **ambas** (ej: `INSERT/UPDATE` en la tabla hija y `UPDATE/DELETE` en la tabla padre).
4. **No usar `ROW` si la regla es global:** si la condición no depende de ninguna fila (horarios, bloqueo total de tabla, contador general de otra tabla), usa **`FOR EACH STATEMENT`**.

### Cascada y recursión infinita
- **Disparadores en cascada:** si el trigger de una tabla $A$ modifica $B$, se activan también los triggers de $B$; todo forma parte de la misma transacción, así que un error en $B$ deshace los cambios de $A$.
- **Recursión infinita:** si un trigger de $A$ modifica $B$ y el de $B$ modifica $A$ (o un trigger se activa a sí mismo indefinidamente), el SGBD acaba agotando la pila y aborta la transacción.
