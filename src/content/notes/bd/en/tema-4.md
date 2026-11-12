---
title: "Topic 4: PL/pgSQL"
description: "Stored procedures in PostgreSQL: structure, scalar and SETOF return types, CREATE TYPE, variables (%TYPE), flow control (IF, FOUND, FOR), error handling (EXCEPTION), and quality criteria."
readTime: "8 min"
order: 8
draft: false
---

A **stored procedure** (or function) is a block of code saved inside the DBMS. It reduces network traffic, centralizes business rules, simplifies client applications, and controls user operations on the DB.

---

## 4.1. Basic structure and execution

```sql
CREATE [OR REPLACE] FUNCTION function_name(param_name type [, ...])
RETURNS return_type AS $$
DECLARE
    -- Local variables
BEGIN
    -- Body: SQL and PL/pgSQL statements
    RETURN value;
END;
$$ LANGUAGE plpgsql;

DROP FUNCTION function_name(param_type); -- Deletion
```

It can be called from interactive SQL, from another procedure, or from an application:

```sql
SELECT function_name('parameter');
SELECT * FROM function_name('parameter'); -- Recommended for SETOF or composite types
```

:::plpgsqlviz
:::

---

## 4.2. Parameters, return types (`SETOF`), and `CREATE TYPE`

| Case | `RETURNS` | How does it return? |
| :--- | :--- | :--- |
| **Single value / composite row** | `type` or `TName` | `RETURN variable;` (terminates the function). |
| **No return value** | `void` | Actions only (`INSERT`, `UPDATE`, `DELETE`). |
| **Set of tuples** | `SETOF type` or `SETOF TName` | `RETURN NEXT variable;` per row (does not exit) + final `RETURN;`. |

### Scalar return

```sql
CREATE OR REPLACE FUNCTION find_city(client_dni VARCHAR(9))
RETURNS VARCHAR(15) AS $$
DECLARE
    client_city VARCHAR(15);
BEGIN
    SELECT ciutat INTO client_city FROM clients WHERE dni = client_dni;
    RETURN client_city;
END;
$$ LANGUAGE plpgsql;
```

:::returnviz
:::

### Composite types (`CREATE TYPE`) and multiple-row return (`SETOF`)

When a function returns multiple columns that do not match an existing table, a `TYPE` is defined beforehand and fields are accessed with `variable.field`:

```sql
CREATE TYPE Tclient_data AS (
    client_dni  VARCHAR(9),
    client_name VARCHAR(15),
    pref        CHAR(1)
);

CREATE OR REPLACE FUNCTION city_clients(city_in clients.ciutat%TYPE)
RETURNS SETOF Tclient_data AS $$
DECLARE
    rec Tclient_data;
BEGIN
    FOR rec IN
        SELECT dni, nom, 'N' FROM clients WHERE ciutat = city_in
    LOOP
        rec.pref := 'P';
        RETURN NEXT rec; -- Appends the row to the result without exiting
    END LOOP;
    RETURN;              -- Ends the function
END;
$$ LANGUAGE plpgsql;
```

:::setofviz
:::

---

## 4.3. Variables and assignments

All variables declared in `DECLARE` are local and live in volatile memory:

```sql
var_name [CONSTANT] type [NOT NULL] [{DEFAULT | :=} expression];
client_dni clients.dni%TYPE; -- Automatically inherits the column's data type
```

- Without initialization, variables default to **`NULL`**. If declared `NOT NULL`, an initial value (`DEFAULT` or `:=`) is mandatory.
- **Assignments (valid only when returning at most 1 row):**
  - Direct or scalar: `var := expression;` or `qty := (SELECT qtt_com FROM clients WHERE dni = client_dni);`
  - Query: `SELECT carrer, num_carrer INTO client_addr FROM clients WHERE dni = client_dni;`
  - Function call: `total := single_order_amount(order_num);`

:::varviz
:::

---

## 4.4. Conditionals (`IF`) and the `FOUND` variable

```sql
IF condition THEN
    -- statements
ELSIF condition THEN
    -- statements
ELSE
    -- statements
END IF;
```

`FOUND` is a local boolean variable (starts as `False`) indicating whether the last SQL statement had any effect:

| Statement | When is `FOUND = True`? |
| :--- | :--- |
| `SELECT ... INTO` | If it returns a row (`False` if none is found). |
| `INSERT / UPDATE / DELETE` | If it affects at least one row. |
| `FOR ... IN SELECT` | **Upon exiting the loop:** `True` if it iterated $\ge 1$ time; `False` if 0 times. |

**Watch out for `FOUND` inside and after a `FOR` loop:**
- Inside each `FOR` iteration, any `SELECT ... INTO` or `UPDATE` updates `FOUND`, but upon exiting the `FOR` loop it is overwritten depending on whether the loop iterated or not.
- Typical exam pattern to detect empty results after a `FOR` loop:

```sql
FOR rec IN SELECT ... LOOP
    RETURN NEXT rec;
END LOOP;
IF NOT FOUND THEN
    RAISE EXCEPTION 'No results found';
END IF;
```

:::foundviz
:::

---

## 4.5. Iterative statements (loops)

**`FOR` loop over an SQL query (the one used in labs and exams):**

```sql
CREATE OR REPLACE FUNCTION all_orders_amount(client_dni clients.dni%TYPE)
RETURNS void AS $$
DECLARE
    order_num    comandes.num_com%TYPE;
    total_amt    comandes.import_total%TYPE;
BEGIN
    FOR order_num IN SELECT num_com FROM comandes WHERE dni = client_dni LOOP
        SELECT SUM(ic.quantitat * i.preu_unitat) INTO total_amt
        FROM items_comanda ic, items i
        WHERE i.num_item = ic.num_item AND ic.num_com = order_num;

        UPDATE comandes SET import_total = total_amt WHERE num_com = order_num;
    END LOOP;
END;
$$ LANGUAGE plpgsql;
```

*(If the `SELECT` in the `FOR` loop projects more than one column, the loop variable must be of a composite `CREATE TYPE` or `RECORD` type.)*

:::forloopviz
:::

**Other loops:**

```sql
FOR i IN [REVERSE] 1..10 LOOP ... END LOOP;        -- Known number of iterations
WHILE condition LOOP ... END LOOP;                 -- Re-evaluates the condition at every step
LOOP ... EXIT WHEN condition; END LOOP;            -- Unconditional loop
```

*(Note: **explicit cursors** (`DECLARE ... CURSOR FOR`, `OPEN`, `FETCH`, `CLOSE`) are not used in labs and do not appear on exams; `FOR ... IN SELECT` is always used instead.)*

---

## 4.6. Error handling (`EXCEPTION` and `RAISE EXCEPTION`)

Errors may be raised by the DBMS itself or user-defined via `RAISE EXCEPTION`:

| `WHEN` condition | `SQLSTATE` | When does it trigger? |
| :--- | :---: | :--- |
| `raise_exception` | `P0001` | When code executes `RAISE EXCEPTION '...'` |
| `not_null_violation` | `23502` | Insert/update with `NULL` in a `NOT NULL` column |
| `foreign_key_violation` | `23503` | Missing value in referenced table (or blocked deletion) |
| `unique_violation` | `23505` | Duplicate `PRIMARY KEY` or `UNIQUE` value |
| `check_violation` | `23514` | Violation of a `CHECK` constraint |
| `OTHERS` | — | Any other error not caught earlier |

Inside each `WHEN` branch, `SQLSTATE` (5-character code) and `SQLERRM` (message) are available.

**Critical rules of the `EXCEPTION` block:**
1. When an exception is caught inside a `BEGIN ... END` block, **all SQL modifications made inside that `BEGIN` are rolled back** before executing the `EXCEPTION` handler.
2. **Always place `WHEN raise_exception` before `WHEN OTHERS`:** otherwise, `WHEN OTHERS` will intercept your own `RAISE EXCEPTION` calls and overwrite their message!
3. If another exception is raised inside an `EXCEPTION` block (`RAISE EXCEPTION`), the procedure aborts immediately and propagates it upward.

```sql
-- Standard exam strategy (Option 1: catch and re-raise with custom message)
CREATE OR REPLACE FUNCTION new_line(item INT, ord INT, qty INT)
RETURNS void AS $$
BEGIN
    IF (qty < 12) THEN
        RAISE EXCEPTION 'Quantity % is less than 12', qty;
    END IF;
    INSERT INTO items_comanda VALUES (item, ord, qty);
    RETURN;
EXCEPTION
    WHEN raise_exception THEN
        RAISE EXCEPTION '%', SQLERRM; -- Re-raises the custom message unchanged
    WHEN foreign_key_violation THEN
        RAISE EXCEPTION 'The order or product does not exist';
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Internal error: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;
```

:::exceptionviz
:::

**Other strategies (theoretical):**
- **Returning an error object (`TError(code, reason)`):** returns code `'0'` on success or `SQLSTATE`/`SQLERRM` on failure (without aborting).
- **Error log table (`INSERT INTO t_errors`):** logs `SQLSTATE` and `SQLERRM` into an audit table and returns normally.
- **Automatic recovery:** resolves the cause inside `WHEN` (e.g., `WHEN undefined_table THEN CREATE TABLE ...`), uncommon.

---

## 4.7. Quality criteria in PL/pgSQL

On exams, failing to follow these criteria is penalized (and you are explicitly asked to fix them):

1. **Leverage declarative DDL constraints (`PK`, `UNIQUE`, `FK`, `NOT NULL`, `CHECK`):** Do not run prior `SELECT` queries with `IF EXISTS` / `IF NOT EXISTS` to validate keys or constraints before an `INSERT`/`UPDATE`. Execute the statement directly and catch `foreign_key_violation`, `unique_violation`, `not_null_violation`, or `check_violation` in the `EXCEPTION` block. *(Only use `IF ... RAISE EXCEPTION` for business rules NOT enforced by the DDL.)*
2. **No prior `SELECT` before `UPDATE` or `DELETE`:** Do not check with `IF EXISTS (SELECT ...)` whether rows to modify exist; execute the `UPDATE`/`DELETE` directly (and use `IF NOT FOUND` if you need to check whether any row was modified).
3. **No unnecessary tables:** Do not `JOIN` parent tables if the child table already contains all the columns you need (e.g., take `modul, numero` directly from `assignacions` without joining `despatxos` or `professors`).
4. **Do not mask your own `RAISE EXCEPTION`:** Always put `WHEN raise_exception THEN RAISE EXCEPTION '%', SQLERRM;` before `WHEN OTHERS`.
