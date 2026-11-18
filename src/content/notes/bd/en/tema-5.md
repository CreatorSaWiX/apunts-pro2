---
title: "Topic 5: Triggers"
description: "Active DBMS and ECA rules, PostgreSQL syntax, execution order (BEFORE/AFTER, ROW/STATEMENT), NEW, OLD and TG_OP variables, return values, key examples, quality criteria, and cascades."
readTime: "12 min"
order: 9
draft: true
---

In Topic 4 we saw PL/pgSQL functions, but they have one limitation: **they only run when someone explicitly calls them**.

A **trigger** is like a **motion sensor** placed on a table. Instead of having to call a function manually, we tell PostgreSQL: *"whenever someone runs an `INSERT`, `UPDATE`, or `DELETE` on this table, execute this function automatically"*.

---

## 5.1. Concept and ECA rule

Conventional databases are **passive**: they only act when you ask them to. When we add triggers, the DB becomes **active** and reacts on its own following the **ECA rule**:

- **E (Event):** the SQL operation that trips the sensor (`INSERT`, `DELETE`, `UPDATE`, or `UPDATE OF column`).
- **C (Condition):** optional logical check that decides whether an action is needed.
- **A (Action):** the PL/pgSQL function that runs in response.

> *«When event **E** occurs, if condition **C** holds, then action **A** is executed.»*

**What are they used for?** Auditing changes (logging who touched what), maintaining derived data (like an employee counter), or enforcing complex business rules that a simple `CHECK` constraint cannot express.

:::ecaviz
:::

---

## 5.2. Syntax in PostgreSQL (the 2 steps)

In PostgreSQL, creating a trigger always takes **two separate steps**: first you define *what it will do* (the function) and then *when and where it will fire* (the trigger).

### Step 1: Define the trigger function
It is a regular PL/pgSQL function, but with two mandatory rules: it takes **no parameters** and always returns **`trigger`**.

```sql [Step 1: Function that the trigger will run]
CREATE [OR REPLACE] FUNCTION func_name() RETURNS trigger AS $$
BEGIN
    -- Function body
    RETURN NEW; -- (or OLD or NULL, depending on the case shown in 5.5)
END;
$$ LANGUAGE plpgsql;
```

### Step 2: Attach the function to a table (`CREATE TRIGGER`)
Now we connect the function to the table and the event that will fire it:

```sql [Step 2: Create the trigger on the table]
CREATE TRIGGER trigger_name
    { BEFORE | AFTER | INSTEAD OF }
    { INSERT | DELETE | UPDATE [OF col1, col2...] } [OR ...]
    ON table_name
    [ FOR EACH { ROW | STATEMENT } ]
    EXECUTE PROCEDURE func_name(); -- (or EXECUTE FUNCTION in newer versions)
```

*(Don't worry! Right below we'll see what `NEW`, `OLD`, `BEFORE`/`AFTER`, and `ROW`/`STATEMENT` mean.)*

---

## 5.3. Special variables (`NEW`, `OLD`, `TG_OP`)

Since a trigger function **takes no parameters**, how does it know which row is being inserted, updated, or deleted? PostgreSQL automatically passes it these three variables:

- **`NEW`:** holds the **new row** (the values it will have after the `INSERT` or `UPDATE`). On a `DELETE` it is `NULL` because there is no new row!
- **`OLD`:** holds the **old row** (the values it had before the `UPDATE` or `DELETE`). On an `INSERT` it is `NULL` because nothing existed before!
- **`TG_OP`:** a text string (`'INSERT'`, `'UPDATE'`, or `'DELETE'`) telling you which operation fired the trigger.

To access a specific column of the row, use a dot: `NEW.column_name` or `OLD.column_name`.

| Variable | Meaning | `INSERT` (`ROW`) | `UPDATE` (`ROW`) | `DELETE` (`ROW`) | `STATEMENT` |
| :--- | :--- | :---: | :---: | :---: | :---: |
| **`TG_OP`** | Triggering operation | `'INSERT'` | `'UPDATE'` | `'DELETE'` | `'INSERT'` / `'UPDATE'` / `'DELETE'` |
| **`NEW`** | Tuple **after** | New row | New row | `NULL` | `NULL` |
| **`OLD`** | Tuple **before** | `NULL` | Old row | Old row | `NULL` |

::callout[type="warning" title="Watch out for multi-event triggers!"]
If a single trigger fires on `INSERT OR DELETE OR UPDATE`, **always check `TG_OP` before touching `NEW` or `OLD`**. If you try to read `NEW.field` during a `DELETE` (or `OLD.field` during an `INSERT`), you'll be accessing `NULL`.
::

:::tgvarsviz
:::

---

## 5.4. When and how does it run? (`BEFORE`/`AFTER` and `ROW`/`STATEMENT`)

When creating a trigger, you must make two key decisions: **when** it runs and **how often**.

### 1. `FOR EACH ROW` vs `FOR EACH STATEMENT` (how many times)

Imagine you run `UPDATE empleats SET sou = sou * 1.1;` and the table has **50 employees**:
- **`FOR EACH ROW`** (row level): the function runs **50 times** (once per modified employee) and has access to `NEW` and `OLD`. *(If the `UPDATE` affects 0 rows, it runs 0 times).*
- **`FOR EACH STATEMENT`** (statement level): the function runs **only 1 time** for the entire SQL command (even if it affects 0 rows or 50!), and `NEW` / `OLD` are `NULL`.

### 2. `BEFORE` vs `AFTER` (execution order)

When you execute an SQL statement, PostgreSQL strictly follows this order:

1. **`BEFORE STATEMENT`** triggers (1 time before starting).
2. For each affected row:
   **`BEFORE ROW`** $\rightarrow$ **physical change + constraint checks (`PK`, `FK`, `CHECK`, `NOT NULL`)** $\rightarrow$ **`AFTER ROW`**.
3. **`AFTER STATEMENT`** triggers (1 time at the end).

Notice two vital details of this order:
- **Precedence with constraints:** If the statement violates a `PK`, `FK`, or `CHECK`, it fails **before** reaching `AFTER` triggers. Only a `BEFORE` trigger can act or prepare the DB before constraints are checked.
- **Atomicity (all or nothing):** Everything runs inside the same transaction. If a constraint fails or the trigger raises `RAISE EXCEPTION`, **all changes** made so far are rolled back.

### Quick guide for exams

| Choice | When to pick it? |
| :--- | :--- |
| **`BEFORE`** | When you want to **modify `NEW`** before it is saved, **silently cancel (`RETURN NULL`)**, or **create/prepare an FK before** the DBMS checks constraints. |
| **`AFTER`** | When the trigger touches **other tables** (auditing, external counters, child maintenance) and you want to be sure the row already passed all constraints (`PK`, `FK`, `CHECK`). |
| **`FOR EACH ROW`** | When you need to read **`NEW` or `OLD`** of a specific row or perform **incremental** updates. |
| **`FOR EACH STATEMENT`** | When the rule **does not depend on any specific row** (forbidding operations on a table, checking time/day) or to audit once per statement. |

*(Note: **`INSTEAD OF`** is only used on **views** to replace the original operation; it does not usually appear on final exams).*

:::triggerviz
:::

---

## 5.5. Return values (`RETURN NEW | OLD | NULL`)

Since nobody calls a trigger with a `SELECT`, what is the `RETURN` at the end of the function for?
It's how **`BEFORE ROW` triggers tell PostgreSQL whether to proceed with the operation or abort it for that row!**

| Trigger type | `RETURN NEW` | `RETURN OLD` | `RETURN NULL` |
| :--- | :--- | :--- | :--- |
| **`BEFORE ROW` (`INSERT`)** | Inserts the row (with changes made to `NEW`). | **Silently cancels** the insert *(because `OLD` is `NULL`!)*. | **Silently cancels** the insert (no error, no `AFTER`). |
| **`BEFORE ROW` (`UPDATE`)** | Updates the row (with changes made to `NEW`). | **Silently cancels** the update of that row. | **Silently cancels** the update of that row. |
| **`BEFORE ROW` (`DELETE`)** | — | Deletes the row normally. | **Silently cancels** the deletion of that row. |
| **`AFTER` or `STATEMENT`** | Ignored | Ignored | Ignored (by convention, always write `RETURN NULL;`). |

::callout[type="danger" title="Classic exam trap: RETURN NULL vs RAISE EXCEPTION"]
Returning `NULL` (or returning `OLD` on an `INSERT`) inside a `BEFORE ROW` trigger **does NOT throw any error**: it simply skips that row silently and prevents the `AFTER` trigger from running. If the problem asks you to **abort with an error message**, you must use **`RAISE EXCEPTION '...'`**, not `RETURN NULL`.
::

:::trigretviz
:::

---

## 5.6. Key practical examples

### Example 1: Incremental maintenance (`AFTER ROW` + `TG_OP`)
We want to keep the `quants_empleats` counter in `departaments` up to date whenever `empleats` are inserted, deleted, or moved to another department.
- Since we modify another table and need `NEW.num_dpt` / `OLD.num_dpt`, we choose **`AFTER`** + **`FOR EACH ROW`**.

```sql [Multi-event incremental counter]
CREATE OR REPLACE FUNCTION update_emp_count() RETURNS trigger AS $$
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
    RETURN NULL; -- Return value is ignored in AFTER triggers
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_emp_count
    AFTER INSERT OR DELETE OR UPDATE OF num_dpt ON empleats
    FOR EACH ROW EXECUTE PROCEDURE update_emp_count();
```

:::incrtriggerviz
:::

### Example 2: Global rule or lock (`BEFORE STATEMENT`)
Prevent any update or deletion on the `auditoria` table.
- We don't need to inspect any row (`NEW`/`OLD`) and want to stop it before touching anything $\rightarrow$ **`BEFORE`** + **`FOR EACH STATEMENT`**.

```sql [Block operations on a table]
CREATE OR REPLACE FUNCTION protect_audit() RETURNS trigger AS $$
BEGIN
    RAISE EXCEPTION 'Cannot update or delete from the auditoria table';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_no_modify_audit
    BEFORE UPDATE OR DELETE ON auditoria
    FOR EACH STATEMENT EXECUTE PROCEDURE protect_audit();
```

:::stmtguardviz
:::

### Example 3: Modifying the row itself before saving (`BEFORE ROW`)
Automatically recalculate `preu_total` in the same `items` table when quantity `qtt` changes.
- Since we want to alter `NEW.preu_total` before it is written to disk $\rightarrow$ **`BEFORE`** + **`FOR EACH ROW`** + **`RETURN NEW;`**.

```sql [Modify NEW before saving the row]
CREATE OR REPLACE FUNCTION compute_new_total() RETURNS trigger AS $$
BEGIN
    IF (OLD.qtt <> 0) THEN
        NEW.preu_total := (OLD.preu_total / OLD.qtt) * NEW.qtt;
    END IF;
    RETURN NEW; -- Mandatory to return NEW so changes are saved!
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER derived_price_attr
    BEFORE UPDATE OF qtt ON items
    FOR EACH ROW EXECUTE PROCEDURE compute_new_total();
```

:::beforemodviz
:::

### Example 4: Preparing data before a constraint (`BEFORE ROW`)
Enforce «Every student must be a user» (where `estudiant.id_e REFERENCES usuari`).
- If we insert a student who isn't a user yet, an **`AFTER`** trigger wouldn't run in time (the foreign key error would fire first). With **`BEFORE`**, we create the user right before PostgreSQL checks the `FK`.

```sql [Create parent row before FK is checked]
CREATE OR REPLACE FUNCTION ensure_user() RETURNS trigger AS $$
BEGIN
    IF (NOT EXISTS (SELECT * FROM usuari WHERE id_u = NEW.id_e)) THEN
        INSERT INTO usuari VALUES (NEW.id_e);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_create_user
    BEFORE INSERT ON estudiant
    FOR EACH ROW EXECUTE PROCEDURE ensure_user();
```

:::beforefkviz
:::

*(**About `INSTEAD OF`:** used with views, e.g., `INSTEAD OF INSERT ON my_view FOR EACH ROW`, to redirect the operation to the underlying base tables).*

---

## 5.7. Quality criteria and pitfalls (cascades and cycles)

### Exam quality criteria (what to watch out for)

1. **Incremental implementation (`FOR EACH ROW`) vs global recalculation:**
   To maintain sums or counters in a parent table, add or subtract only the delta (`+ 1`, `- 1`, `NEW.val - OLD.val`) on the affected row (`WHERE id = NEW.id`).
   - ❌ `UPDATE departaments d SET quants_empleats = (SELECT COUNT(*) FROM empleats e WHERE e.num_dpt = d.num_dpt);` (recalculates the whole table!)
   - ✅ `UPDATE departaments SET quants_empleats = quants_empleats + 1 WHERE num_dpt = NEW.num_dpt;`

2. **Specify columns in `UPDATE OF`:**
   Always list only the attributes that actually affect the rule (`AFTER UPDATE OF preu ON ...`) so the trigger doesn't fire when unrelated columns change.

3. **Cover all affected events and tables:**
   A constraint between two tables often requires triggers on **both** (e.g., `INSERT`/`UPDATE` on the child table and `UPDATE`/`DELETE` on the parent table).

4. **Don't use `ROW` if the rule is global:**
   If the condition doesn't depend on any row (schedules, full table lock), use **`FOR EACH STATEMENT`**.

### Cascades and infinite recursion
- **Cascading triggers:** if a trigger on table $A$ modifies table $B$, $B$'s triggers fire automatically too. Since everything runs in the same transaction, an error in $B$ also rolls back $A$'s changes.
- **Infinite recursion:** if a trigger on $A$ modifies $B$ and $B$'s trigger modifies $A$ (or a trigger keeps firing itself endlessly), PostgreSQL eventually runs out of call stack and aborts the transaction.
