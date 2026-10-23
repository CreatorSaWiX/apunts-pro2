---
title: "Tema 2: DDL y DML"
description: "CREATE TABLE, restricciones de integridad, acciones compensatorias y manipulación de datos."
readTime: "10 min"
order: 2
draft: false
---

Este tema recoge la definición de la estructura de la base de datos (**DDL**) y la manipulación de los datos que contiene (**DML**).

- **Tabla (Relación):** Formada por **columnas** (atributos) y **filas** (tuplas con valores atómicos).
- **Clave Primaria (PK):** Columna (o conjunto de columnas) que **identifica** cada fila. Nunca puede estar repetida ni contener valores nulos (`NOT NULL`).
- **Clave Foránea (FK):** Columna que **apunta a la clave primaria** de otra tabla para relacionarlas.

---

## 2.1. Creación de tablas (`CREATE TABLE`)

```sql
CREATE TABLE nombre_tabla (
    columna tipo_datos [restricciones_columna] [DEFAULT valor],
    ...,
    [restricciones_tabla]
);
```

### Tipos de datos frecuentes

| Categoría | Tipo SQL | Descripción |
| :--- | :--- | :--- |
| **Enteros** | `INTEGER` (o `INT`), `SMALLINT` | Números enteros. |
| **Decimales exactos** | `DECIMAL(p, s)` / `NUMERIC(p, s)` | $p$ dígitos totales, $s$ decimales (ideal para dinero). |
| **Coma flotante** | `FLOAT`, `REAL` | Valores aproximados. |
| **Texto fijo** | `CHAR(n)` | Longitud exacta de $n$ caracteres (rellena con espacios). |
| **Texto variable** | `VARCHAR(n)` | Cadena de texto de hasta $n$ caracteres. |
| **Fechas y horas** | `DATE`, `TIME`, `TIMESTAMP` | `'YYYY-MM-DD'`, `'HH:MM:SS'`. |

`DEFAULT valor` indica el valor que toma la columna si no se especifica al hacer el `INSERT`.

### Restricciones de integridad

Se pueden definir a nivel de **columna** (si solo afectan a esa columna) o a nivel de **tabla** (obligatorio si implican a más de una columna, como una clave compuesta):

| Restricción | Significado | Ejemplo (Columna) | Ejemplo (Tabla) |
| :--- | :--- | :--- | :--- |
| `NOT NULL` | Prohíbe valores `NULL`. | `nombre VARCHAR(30) NOT NULL` | *(Solo a nivel de columna)* |
| `UNIQUE` | Valores únicos (admite `NULL`). | `nif CHAR(9) UNIQUE` | `UNIQUE (nif, serie)` |
| `PRIMARY KEY` | Clave primaria (`NOT NULL` + `UNIQUE`). | `id INT PRIMARY KEY` | `PRIMARY KEY (id_curso, any)` |
| `REFERENCES` | Clave foránea que enlaza con el padre. | `num_dpt INT REFERENCES dpt(num)` | `FOREIGN KEY (dpt) REFERENCES dpt(num)` |
| `CHECK` | Condición de validación de negocio. | `sou INT CHECK (sou > 0)` | `CHECK (data_fi >= data_inici)` |

---

## 2.2. Integridad referencial

Cuando se borra (`DELETE`) o se modifica (`UPDATE`) una fila en la tabla padre que está referenciada por una clave foránea, se aplica una de estas políticas:

| Acción SQL | Comportamiento | ¿Cuándo utilizarla? |
| :--- | :--- | :--- |
| `RESTRICT` / `NO ACTION` | **Bloquea la operación con un error.** (Opción por defecto si no se indica nada). | Cuando no se permite dejar elementos huérfanos ni borrar datos dependientes. |
| `CASCADE` | **Propaga automáticamente** el borrado o cambio a todas las filas hijas relacionadas. | Relaciones débiles o de composición (ej: borrar una factura borra sus líneas). |
| `SET NULL` | **Pone a `NULL`** la clave foránea de las filas hijas afectadas. | Cuando la hija puede sobrevivir sin padre (la FK **no** puede ser `NOT NULL`). |

```sql
FOREIGN KEY (col_fk) REFERENCES tabla_padre(col_pk)
    ON DELETE CASCADE
    ON UPDATE RESTRICT
```
**Ejemplo:**

:::sqlviz{simulation="ddl_empleats"}
:::

---

## 2.3. Inserción de filas (`INSERT INTO`)

**Inserción posicional:** requiere pasar valores para **todas las columnas** en el orden exacto de creación de la tabla:

```sql
INSERT INTO empleats
VALUES (5, 'FERRAN', 250000, 'MATARO', 1, 1);
```

**Inserción con lista de columnas:** permite indicar solo un subconjunto de columnas; las que no se indiquen tomarán su valor `DEFAULT` o bien `NULL`. Si una columna no tiene `DEFAULT` y tiene `NOT NULL`, es obligatorio incluirla:

```sql
INSERT INTO departaments (num_dpt, nom_dpt)
VALUES (4, 'PERSONAL');
```

**Inserción masiva a partir de un `SELECT`:** inserta directamente el resultado de una consulta en una tabla existente:

```sql
INSERT INTO proj_importants
SELECT * FROM projectes
WHERE pressupost > 2000000;
```

:::dmlviz
:::

---

## 2.4. Borrado de filas (`DELETE FROM`)

```sql
DELETE FROM nombre_tabla [WHERE condicion];
```

**Cuidado con omitir el WHERE:** Si ejecutas `DELETE FROM tabla;` sin `WHERE`, **se borrarán todas las filas** de la tabla.

```sql
-- Borra empleados del departamento 2
DELETE FROM empleats WHERE num_dpt = 2;

-- Borra empleados con sueldo inferior o igual a 250.000
DELETE FROM empleats WHERE sou <= 250000;
```

Para borrar los departamentos que no tienen ningún empleado asignado, se usa `NOT EXISTS`:

```sql
DELETE FROM departaments d
WHERE NOT EXISTS (
    SELECT * FROM empleats e
    WHERE e.num_dpt = d.num_dpt
);
```

:::deleteviz
:::

---

## 2.5. Modificación de datos (`UPDATE`)

```sql
UPDATE nombre_tabla
SET columna1 = expresion1 [, columna2 = expresion2 ...]
[WHERE condicion];
```

**Cuidado con omitir el WHERE:** Sin cláusula `WHERE`, el cambio se aplicará a **todas las filas** de la tabla.

```sql
UPDATE empleats
SET sou = sou + 10000, 
    ciutat_empl = 'VIC'
WHERE num_dpt = 2;
```

**Subconsulta en la cláusula `WHERE`:** para filtrar las filas a modificar a partir de otra tabla:

```sql
UPDATE empleats 
SET sou = sou + 10000
WHERE num_dpt IN (
    SELECT num_dpt FROM departaments
    WHERE ciutat_dpt = 'MADRID'
);
```

**Subconsulta en la cláusula `SET`:** para calcular el nuevo valor en función de una consulta. La subconsulta debe devolver **un único valor** (1 fila y 1 columna); si devuelve más de una fila, la sentencia fallará:

```sql
UPDATE empleats e
SET sou = (
    SELECT AVG(sou) FROM empleats
    WHERE num_dpt = e.num_dpt
)
WHERE num_dpt = 2;
```

:::updateviz
:::
