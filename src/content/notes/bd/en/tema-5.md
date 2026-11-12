---
title: "Topic 5: Triggers"
description: "Active DBMS and ECA rules, PostgreSQL syntax, execution order (BEFORE/AFTER, ROW/STATEMENT), NEW, OLD and TG_OP variables, return values, key examples, quality criteria, and cascades."
readTime: "10 min"
order: 9
draft: true
---

A **trigger** is a mechanism that allows the DBMS to react automatically by executing a function whenever a specific data manipulation event (`INSERT`, `UPDATE`, or `DELETE`) occurs.

---

## 5.1. Concept and ECA rule

Conventional DBMSs are **passive** (they only execute operations upon explicit request). An **active** DBMS incorporates reactive behavior based on the **ECA rule**:

- **E (Event):** The SQL operation that activates the trigger (`INSERT`, `DELETE`, `UPDATE`, or `UPDATE OF column`).
- **C (Condition):** Logical expression that determines whether the action should run.
- **A (Action):** Specific stored procedure containing the instructions to execute.

> *«When event E occurs, if condition C holds, then action A is executed.»*

Common use cases: auditing, maintaining derived attributes, complex business rules (that a `CHECK` constraint cannot express), and maintaining related data across tables.

:::ecaviz
:::

---

## 5.2. Syntax in PostgreSQL

Creating a trigger requires **two independent steps**:

**Step 1: Define the trigger function** (takes no parameters, must return `trigger`):

```sql
CREATE [OR REPLACE] FUNCTION function_name() RETURNS trigger AS $$
BEGIN
    -- Function body
    RETURN NEW; -- or OLD or NULL
END;
$$ LANGUAGE plpgsql;
```

**Step 2: Define the trigger (`CREATE TRIGGER`):**

```sql
CREATE TRIGGER trigger_name
    { BEFORE | AFTER | INSTEAD OF }
    { INSERT | DELETE | UPDATE [OF col1, col2...] } [OR ...]
    ON table_name
    [ FOR EACH { ROW | STATEMENT } ]
    EXECUTE PROCEDURE function_name(); -- (or EXECUTE FUNCTION in newer versions)
```

---

## 5.3. Execution order, granularity, and selection criteria

**Complete execution sequence of a statement:**
1. `BEFORE STATEMENT` triggers (once before starting).
2. For each affected row: `BEFORE ROW` $\rightarrow$ physical modification + constraint checks (`PK`, `FK`, `CHECK`, `NOT NULL`) $\rightarrow$ `AFTER ROW`.
3. `AFTER STATEMENT` triggers (once at the end).

- **Precedence with constraints:** If the statement violates a table constraint (`PK`, `FK`, `CHECK`), it fails **before** reaching `AFTER` triggers (only a `BEFORE` trigger can intercept or prepare the DB prior to constraint checking).
- **Atomicity:** Everything executes within the same transaction. If a constraint fails or `RAISE EXCEPTION` is triggered (either in the statement or inside the trigger), **all** changes in the transaction (or in the statement if run without an explicit transaction block) are rolled back.

### How to choose and justify the trigger type on an exam

| Decision | When to choose it? |
| :--- | :--- |
| **`BEFORE`** | To **modify `NEW`**, **silently cancel (`RETURN NULL`)**, validate global rules before touching data, or **create/prepare an FK before** the DBMS checks constraints. |
| **`AFTER`** | When the action modifies other tables (auditing, external derived attributes, maintaining child rows) and the row must already be validated by all DB constraints. |
| **`FOR EACH ROW`** | When you need to access **`NEW` or `OLD`** of a specific row or perform **incremental** updates. *(If the statement affects 0 rows, it does not execute.)* |
| **`FOR EACH STATEMENT`** | When the rule **does not depend on any row** (time window, blocking operations on a table, global counter) or to audit once per statement. *(Always executes once, even if 0 rows are affected.)* |

*(Note: **`INSTEAD OF`** is used exclusively on **views** to replace the original operation; it does not typically appear on final exams).*

:::triggerviz
:::

---

## 5.4. Special variables (`TG_OP`, `NEW`, `OLD`)

| Variable | Meaning | `INSERT` (`ROW`) | `UPDATE` (`ROW`) | `DELETE` (`ROW`) | `STATEMENT` |
| :--- | :--- | :---: | :---: | :---: | :---: |
| **`TG_OP`** | Triggering operation | `'INSERT'` | `'UPDATE'` | `'DELETE'` | `'INSERT'` / `'UPDATE'` / `'DELETE'` |
| **`NEW`** | Tuple **after** | New row | New row | `NULL` | `NULL` |
| **`OLD`** | Tuple **before** | `NULL` | Old row | Old row | `NULL` |

**Watch out with multi-event triggers (`INSERT OR DELETE OR UPDATE`):** always check `TG_OP` before accessing `NEW` (it is `NULL` on `DELETE`) or `OLD` (it is `NULL` on `INSERT`).

:::tgvarsviz
:::

---

## 5.5. Return values (`RETURN NEW | OLD | NULL`)

| Trigger type | `RETURN NEW` | `RETURN OLD` | `RETURN NULL` |
| :--- | :--- | :--- | :--- |
| **`BEFORE ROW` (`INSERT`)** | Inserts the row (including changes made to `NEW`). | **Silently cancels** the insertion *(because `OLD` is `NULL`!)*. | **Silently cancels** the insertion (no error and no `AFTER`). |
| **`BEFORE ROW` (`UPDATE`)** | Updates the row (including changes made to `NEW`). | **Silently cancels** the update of that row. | **Silently cancels** the update of that row. |
| **`BEFORE ROW` (`DELETE`)** | — | Deletes the row normally. | **Silently cancels** the deletion of that row. |
| **`AFTER` or `STATEMENT`** | Ignored | Ignored | Ignored (convention: always use `RETURN NULL;`). |

**Classic exam trap:** returning `NULL` (or returning `OLD` on an `INSERT`) inside a `BEFORE ROW` trigger **does not throw an exception**; it simply discards the operation on that row and prevents the `AFTER` trigger from running.

:::trigretviz
:::

---

## 5.6. Key practical examples

### Example 1: multi-event incremental maintenance (`AFTER ROW` + `TG_OP`)
Maintain the derived counter `quants_empleats` in `departaments` upon insertions, deletions, or department changes in `empleats`:

```sql
CREATE OR REPLACE FUNCTION update_counter() RETURNS trigger AS $$
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

CREATE TRIGGER trg_emp_counter
    AFTER INSERT OR DELETE OR UPDATE OF num_dpt ON empleats
    FOR EACH ROW EXECUTE PROCEDURE update_counter();
```

:::incrtriggerviz
:::

### Example 2: global rule or lock (`BEFORE STATEMENT`)
Prevent any modification or deletion on the `auditoria` table (or restrict operations based on time/day):

```sql
CREATE OR REPLACE FUNCTION protect_audit() RETURNS trigger AS $$
BEGIN
    RAISE EXCEPTION 'Cannot modify or delete from the auditoria table';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_no_modify_audit
    BEFORE UPDATE OR DELETE ON auditoria
    FOR EACH STATEMENT EXECUTE PROCEDURE protect_audit();
```

:::stmtguardviz
:::

### Example 3: modifying the current row (`BEFORE ROW`)
Automatically recalculate `preu_total` in the same `items` table when `qtt` changes:

```sql
CREATE OR REPLACE FUNCTION compute_new_total() RETURNS trigger AS $$
BEGIN
    IF (OLD.qtt <> 0) THEN
        NEW.preu_total := (OLD.preu_total / OLD.qtt) * NEW.qtt;
    END IF;
    RETURN NEW; -- Mandatory to return modified NEW!
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER derived_price_attr
    BEFORE UPDATE OF qtt ON items
    FOR EACH ROW EXECUTE PROCEDURE compute_new_total();
```

:::beforemodviz
:::

### Example 4: precedence before constraints (`BEFORE ROW`)
Enforce «Every student must be a user» (with `estudiant.id_e REFERENCES usuari`):

```sql
CREATE OR REPLACE FUNCTION ensure_user() RETURNS trigger AS $$
BEGIN
    IF (NOT EXISTS (SELECT * FROM usuari WHERE id_u = NEW.id_e)) THEN
        INSERT INTO usuari VALUES (NEW.id_e);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Because it is BEFORE, it runs BEFORE the DB checks the foreign key
CREATE TRIGGER auto_create_user
    BEFORE INSERT ON estudiant
    FOR EACH ROW EXECUTE PROCEDURE ensure_user();
```

If it were `AFTER`, it would fail immediately with a foreign key violation before the trigger could execute.

:::beforefkviz
:::

*(**About `INSTEAD OF`:** used with views, e.g., `INSTEAD OF INSERT ON view_name FOR EACH ROW`, to redirect the operation to the underlying base tables).*

---

## 5.7. Quality criteria and pitfalls (cascades and cycles)

### Exam quality criteria
1. **Incremental implementation (`FOR EACH ROW`) vs. global recalculation:** to maintain sums or counters in a parent table, use `FOR EACH ROW` applying the delta (`NEW.val - OLD.val`) only to the affected row (`WHERE id = NEW.id`), **never** a `SELECT SUM(...)` over the entire table or updating all rows without a `WHERE` clause.
2. **Specify columns in `UPDATE OF`:** always list only the relevant attributes (`AFTER UPDATE OF preu ON ...`) to avoid unnecessary activations.
3. **Cover all affected events and tables:** a constraint between two tables may require triggers on **both** (e.g., `INSERT/UPDATE` on the child table and `UPDATE/DELETE` on the parent table).
4. **Do not use `ROW` if the rule is global:** if the condition does not depend on any row (schedules, full table lock, general counter in another table), use **`FOR EACH STATEMENT`**.

### Cascading and infinite recursion
- **Cascading triggers:** if a trigger on table $A$ modifies $B$, triggers on $B$ also fire; everything belongs to the same transaction, so an error in $B$ rolls back changes in $A$.
- **Infinite recursion:** if a trigger on $A$ modifies $B$ and $B$'s trigger modifies $A$ (or a trigger activates itself indefinitely), the DBMS eventually exhausts the call stack and aborts the transaction.
