---
title: "Topic 4: PL/pgSQL"
description: "Stored procedures in PostgreSQL: structure, scalar and SETOF return types, CREATE TYPE, variables (%TYPE), flow control (IF, FOUND, FOR), error handling (EXCEPTION), and quality criteria."
readTime: "12 min"
order: 8
draft: false
---

So far, with plain SQL we could only run queries or modifications one at a time (`SELECT`, `INSERT`, `UPDATE`...). However, SQL on its own has no variables, no `if/else`, and no loops.

A **stored procedure** (or **PL/pgSQL** function) is basically a small program that we save **directly inside the database server** (PostgreSQL). Instead of having our application send 20 queries back and forth over the network and process them outside, we do everything in a single block inside the DBMS:

- **Less network traffic:** everything runs inside the DB and only the final result is returned.
- **Centralized rules:** any application accessing the DB shares the exact same logic and security checks.

---

## 4.1. Basic structure and execution

A PL/pgSQL function always follows this template:

```sql [Function template]
CREATE [OR REPLACE] FUNCTION function_name(param_name type [, ...])
RETURNS return_type AS $$
DECLARE
    -- (Optional) Local variables that only exist inside the function
BEGIN
    -- Body: SQL statements and PL/pgSQL logic (IF, FOR, etc.)
    RETURN value;
END;
$$ LANGUAGE plpgsql;
```

What does each part mean?
- `CREATE OR REPLACE`: creates the function, or overwrites it if it already exists (super useful while testing!).
- `RETURNS return_type`: specifies what the function will return when it finishes (a number, text, a row, or `void` if it returns nothing).
- `$$ ... $$`: simply acts as "quotes" wrapping the code block so you don't have to escape single quotes (`'`) inside.
- `DECLARE`: where you create variables. If you don't need any, you can omit this section.
- `BEGIN ... END;`: where the executable code goes.

### Minimal example and how to call it

```sql [Example: add two numbers]
CREATE OR REPLACE FUNCTION add_nums(a INT, b INT)
RETURNS INT AS $$
BEGIN
    RETURN a + b;
END;
$$ LANGUAGE plpgsql;
```

Once created, the function stays saved in the DB. You can call it from SQL, from another function, or from an application:

```sql [How to run and delete functions]
SELECT add_nums(3, 5);                     -- Returns 8 (ideal for single values)
SELECT * FROM function_name('parameter');  -- Recommended when returning multiple rows (SETOF) or columns

DROP FUNCTION add_nums(INT, INT);          -- To delete it (you must specify the parameter types)
```

:::plpgsqlviz
:::

---

## 4.2. Variables and assignments

All variables declared in `DECLARE` are local (they only exist while the function runs). If you don't give them an initial value, they default to **`NULL`**.

```sql [Declaration syntax]
var_name [CONSTANT] type [NOT NULL] [{DEFAULT | :=} expression];
```

A very useful trick recommended on exams is **`%TYPE`**:

```sql
client_dni clients.dni%TYPE; -- Automatically copies the data type of the 'dni' column in 'clients'
```

This saves you from having to remember whether `dni` was `CHAR(9)` or `VARCHAR(9)`: if the table ever changes, the function adapts automatically.

### How to assign a value to a variable?

1. **Direct assignment:** `total := price * quantity;` (notice the colon-equals `:=`: in PL/pgSQL you use `:=` to assign, not just `=`).
2. **From a query (`SELECT ... INTO`):**
   In regular SQL, a `SELECT` displays results on screen. In PL/pgSQL, ==a `SELECT` cannot just float in mid-air: you must store its result in a variable using `INTO`==.
   ```sql
   SELECT carrer, num_carrer INTO client_addr FROM clients WHERE dni = client_dni;
   ```
   *(Also works with a scalar subquery: `qty := (SELECT qtt_com FROM clients WHERE dni = client_dni);`)*
3. **Calling another function:** `total := single_order_amount(order_num);`

::callout[type="warning" title="Watch out for SELECT ... INTO!"]
Assigning with `SELECT ... INTO` (or a subquery `:= (SELECT ...)`) **only works if the query returns at most 1 row**. If it returns 2 or more rows, PostgreSQL will throw a runtime error! If you expect multiple rows, use a `FOR` loop.
::

:::varviz
:::

---

## 4.3. Iterative statements (loops)

The star loop in PL/pgSQL (and practically the only one you'll use in labs and exams) is **`FOR ... IN SELECT`**. It runs a query and stores the results row by row into the loop variable automatically:

```sql [Looping through SELECT results row by row]
CREATE OR REPLACE FUNCTION all_orders_amount(client_dni clients.dni%TYPE)
RETURNS void AS $$
DECLARE
    order_num    comandes.num_com%TYPE;
    total_amt    comandes.import_total%TYPE;
BEGIN
    -- For each order of the client, compute its amount and update the table
    FOR order_num IN SELECT num_com FROM comandes WHERE dni = client_dni LOOP
        SELECT SUM(ic.quantitat * i.preu_unitat) INTO total_amt
        FROM items_comanda ic, items i
        WHERE i.num_item = ic.num_item AND ic.num_com = order_num;

        UPDATE comandes SET import_total = total_amt WHERE num_com = order_num;
    END LOOP;
END;
$$ LANGUAGE plpgsql;
```

*(Note: if the `SELECT` in the `FOR` loop returns **more than one column**, the loop variable cannot be a simple type like `INT`; it must be a composite `CREATE TYPE` or `RECORD` type.)*

:::forloopviz
:::

### Other loop types (less common)

```sql
FOR i IN [REVERSE] 1..10 LOOP ... END LOOP;        -- Loop over a range [1, 10]
WHILE condition LOOP ... END LOOP;                 -- As long as condition holds
LOOP ... EXIT WHEN condition; END LOOP;            -- Infinite loop until EXIT WHEN is met
```

*(**Explicit cursors** with `DECLARE ... CURSOR FOR`, `OPEN`, `FETCH`, and `CLOSE` are not used in labs and do not appear on exams; `FOR ... IN SELECT` is always used instead.)*

---

## 4.4. Conditionals (`IF`) and the `FOUND` variable

The conditional syntax is straightforward (watch the spelling **`ELSIF`**, without the second "e"):

```sql [IF / ELSIF / ELSE structure]
IF condition THEN
    -- statements
ELSIF other_condition THEN
    -- statements
ELSE
    -- statements
END IF;
```

### What is `FOUND`?

`FOUND` is an ==automatic boolean variable== maintained by PostgreSQL (it starts at `False`). Every time you run an SQL statement, PostgreSQL updates it to tell you **whether the statement found or affected any rows**:

| Statement executed | When is `FOUND = True`? |
| :--- | :--- |
| `SELECT ... INTO` | If it found a row (`False` if the query returned nothing). |
| `INSERT / UPDATE / DELETE` | If it modified/deleted/inserted **at least 1 row**. |
| `FOR ... IN SELECT` | **Upon exiting the loop:** `True` if it ran $\ge 1$ iteration; `False` if the `SELECT` returned nothing. |

### The `FOUND` trap with `FOR` loops

Inside each iteration of a `FOR` loop, any `SELECT INTO` or `UPDATE` you run will keep changing `FOUND`. **However, the moment you exit `END LOOP;`**, PostgreSQL overwrites `FOUND` to indicate whether the `FOR` loop iterated at least once or not.

This gives us the **classic exam pattern** to detect when a `FOR` query returned no results:

```sql [Detecting empty results after a FOR loop]
FOR rec IN SELECT ... LOOP
    -- process each row
END LOOP;

IF NOT FOUND THEN
    RAISE EXCEPTION 'No results found';
END IF;
```

:::foundviz
:::

---

## 4.5. Parameters, return types (`SETOF`), and `CREATE TYPE`

When designing a function, the first thing to decide is **what it will return**. There are three possible cases:

| Case | What goes in `RETURNS`? | How does the code return it? |
| :--- | :--- | :--- |
| **A single value (or a single row)** | `INT`, `VARCHAR`, `TName`... | `RETURN variable;` (returns the value and **exits** the function). |
| **Nothing (only performs actions)** | `void` | Runs `INSERT`/`UPDATE`/`DELETE` and finishes (no `RETURN` or just `RETURN;`). |
| **Multiple rows (like a table)** | `SETOF type` or `SETOF TName` | `RETURN NEXT variable;` per row + final `RETURN;`. |

### Case 1: Scalar return (a single value)

```sql [Returning a single value with SELECT ... INTO]
CREATE OR REPLACE FUNCTION find_city(client_dni VARCHAR(9))
RETURNS VARCHAR(15) AS $$
DECLARE
    client_city VARCHAR(15);
BEGIN
    -- Store the 'ciutat' column inside the 'client_city' variable
    SELECT ciutat INTO client_city
    FROM clients
    WHERE dni = client_dni;

    RETURN client_city;
END;
$$ LANGUAGE plpgsql;
```

:::returnviz
:::

### Case 2: Multiple-row return (`SETOF`) and composite types (`CREATE TYPE`)

Before mixing in queries and custom types, let's see how `SETOF` works with a **very simple `FOR` loop** that just returns numbers:

```sql [Simple example: a basic FOR loop with SETOF INT]
CREATE OR REPLACE FUNCTION count_to_5()
RETURNS SETOF INT AS $$
DECLARE
    i INT;
BEGIN
    FOR i IN 1..5 LOOP -- Remember that IN is a range [1,5]
        RETURN NEXT i; -- Appends each number to the result, WITHOUT exiting the function
    END LOOP;

    RETURN; -- Now we're done: signals no more rows and delivers all 5 numbers
END;
$$ LANGUAGE plpgsql;
```

Once you see that, what if you want to return **multiple rows** from a query and **multiple columns** (for instance, `dni`, `nom`, and an extra field)? PostgreSQL needs to know in advance what shape each row will have.

If those columns don't match an existing table, we first define a "row template" with `CREATE TYPE`:

```sql [Defining a composite type and returning multiple rows]
-- 1. Create the composite type (the shape each row will have)
CREATE TYPE Tclient_data AS (
    client_dni  VARCHAR(9),
    client_name VARCHAR(15),
    pref        CHAR(1)
);

-- 2. Function returning a set (SETOF) of this type
CREATE OR REPLACE FUNCTION city_clients(city_in clients.ciutat%TYPE)
RETURNS SETOF Tclient_data AS $$
DECLARE
    -- 'rec' is a composite variable (like an object/struct with 3 fields:
    -- rec.client_dni, rec.client_name, and rec.pref).
    rec Tclient_data;
BEGIN
    -- On each loop iteration, PostgreSQL takes ONE row from the SELECT and
    -- fills the 3 fields of 'rec' automatically:
    --   rec.client_dni  := dni
    --   rec.client_name := nom
    --   rec.pref        := 'N'
    FOR rec IN
        SELECT dni, nom, 'N' FROM clients WHERE ciutat = city_in
    LOOP
        rec.pref := 'P'; -- Change only the 'pref' field of this row ('N' -> 'P')
        RETURN NEXT rec; -- Appends this 'rec' row to the output table (does NOT advance the loop!)
    END LOOP;            -- This is where the FOR loop moves to the next SELECT row

    RETURN; -- Now we're done: signals no more rows and exits the function
END;
$$ LANGUAGE plpgsql;
```

::callout[type="info" title="What does RETURN NEXT rec actually mean?"]
The word `NEXT` is a bit misleading: **it does NOT mean "move to the next row of the `SELECT`"** (`END LOOP` already handles that on its own).

`RETURN NEXT rec;` means: **"append `rec` as the next row of the result that the function will return"**, without stopping the function.
Think of it as **putting an item into a shopping cart**: you can add as many as you want inside the loop, and the final `RETURN;` is **going to checkout** and handing over all the accumulated rows at once.
::

:::setofviz
:::

---

## 4.6. Error handling (`EXCEPTION` and `RAISE EXCEPTION`)

When something goes wrong inside a function (for example, trying to insert a duplicate key or a non-existent foreign key), PostgreSQL aborts execution. To handle these errors cleanly instead of crashing, we place a "safety net" at the end of `BEGIN ... END`: the **`EXCEPTION`** block.

Besides the DB's own errors, we can raise our own errors whenever a business rule is violated using:
`RAISE EXCEPTION 'Error message with value: %', variable;`

### Most common errors (`WHEN ...`)

| `WHEN` condition | `SQLSTATE` | When does it trigger? |
| :--- | :---: | :--- |
| `raise_exception` | `P0001` | When our code executes `RAISE EXCEPTION '...'` |
| `not_null_violation` | `23502` | Attempting to put `NULL` into a `NOT NULL` column |
| `foreign_key_violation` | `23503` | Value does not exist in the referenced table (or deletion is blocked) |
| `unique_violation` | `23505` | Duplicate `PRIMARY KEY` or `UNIQUE` value |
| `check_violation` | `23514` | A table `CHECK` constraint is violated |
| `OTHERS` | — | Any other error not caught above |

Inside each `WHEN` branch you have two automatic variables: `SQLSTATE` (the 5-character code) and `SQLERRM` (the error message text).

### How does the `EXCEPTION` block work? (Very important!)

1. **Automatic block rollback:** If an exception is raised inside a `BEGIN ... END` block, PostgreSQL **automatically undoes all `INSERT`, `UPDATE`, and `DELETE` statements executed inside that `BEGIN`** before entering the `EXCEPTION` handler.
2. **Propagation:** If you execute another `RAISE EXCEPTION` inside a `WHEN` branch, the function aborts immediately and passes the error outward.

::callout[type="danger" title="Common exam mistake: the order of WHEN raise_exception!"]
**ALWAYS** place `WHEN raise_exception` **before** `WHEN OTHERS`. If you put `WHEN OTHERS` first (or forget `WHEN raise_exception`), `WHEN OTHERS` will catch your own `RAISE EXCEPTION` calls and overwrite their original message!
::

### Standard exam example

```sql [Catching errors and custom messages]
CREATE OR REPLACE FUNCTION new_line(item INT, ord INT, qty INT)
RETURNS void AS $$
BEGIN
    -- Business rule not in the table's DDL: validate it with IF
    IF (qty < 12) THEN
        RAISE EXCEPTION 'Quantity % is less than 12', qty;
    END IF;

    -- If 'item' or 'ord' do not exist, 'foreign_key_violation' will trigger on its own
    INSERT INTO items_comanda VALUES (item, ord, qty);
    RETURN;
EXCEPTION
    WHEN raise_exception THEN
        RAISE EXCEPTION '%', SQLERRM; -- Re-raises our message intact
    WHEN foreign_key_violation THEN
        RAISE EXCEPTION 'The order or product does not exist';
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Internal error: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;
```

:::exceptionviz
:::

*(Theoretical note: besides aborting with `RAISE EXCEPTION`, some environments use other strategies like returning a `TError(code, reason)` object without aborting, logging the error into an audit table `INSERT INTO t_errors`, or attempting automatic recovery inside `WHEN`, though on exams the standard is to catch and re-raise.)*

---

## 4.7. Quality criteria (what to watch out for on exams)

On exams, they don't just check that your code works—they also check that it's well written. These are the **4 design mistakes that lose points** and how to avoid them:

1. **Leverage declarative DDL constraints (`PK`, `UNIQUE`, `FK`, `NOT NULL`, `CHECK`):**
   Do not run a prior `SELECT` with `IF EXISTS` to check if a key already exists or if a foreign key is valid. Run the `INSERT`/`UPDATE` directly and let PostgreSQL check it; if it fails, catch it in `EXCEPTION` (`unique_violation`, `foreign_key_violation`, etc.).
   - ❌ `SELECT * INTO ...; IF FOUND THEN RAISE EXCEPTION ...; END IF; INSERT INTO ...;`
   - ✅ `INSERT INTO ...;` and catch `WHEN unique_violation THEN RAISE EXCEPTION ...;`
   *(We only use `IF ... RAISE EXCEPTION` for rules that are NOT defined in the table DDL.)*

2. **No prior `SELECT` before `UPDATE` or `DELETE`:**
   Do not check beforehand whether the row exists. Run the `UPDATE` or `DELETE` directly and check `IF NOT FOUND` right after!
   - ❌ `IF NOT EXISTS (SELECT ... WHERE id = x) THEN RAISE EXCEPTION ...; END IF; DELETE ...;`
   - ✅ `DELETE FROM table_name WHERE id = x; IF NOT FOUND THEN RAISE EXCEPTION ...; END IF;`

3. **No unnecessary `JOIN`s:**
   If the child table already has the column you need (for example, a foreign key like `modul` and `numero` in `assignacions`), read it directly from there without joining the parent table (`despatxos`).

4. **Don't mask your own `RAISE EXCEPTION`:**
   Remember to put `WHEN raise_exception THEN RAISE EXCEPTION '%', SQLERRM;` **before** `WHEN OTHERS`.
