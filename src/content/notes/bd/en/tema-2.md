---
title: "Topic 2: DDL and DML"
description: "CREATE TABLE, integrity constraints, referential compensatory actions, and data manipulation."
readTime: "10 min"
order: 2
draft: false
---

This topic covers the definition of database schema structures (**DDL**) and data manipulation primitives (**DML**).

- **Table (Relation):** Structured into **columns** (attributes) and **rows** (tuples with atomic scalar values).
- **Primary Key (PK):** Column (or minimal set of columns) that **uniquely identifies** each row. Cannot contain duplicate values or nulls (`NOT NULL`).
- **Foreign Key (FK):** Column that **references the primary key** of another relation to establish a logical association.

---

## 2.1. Table Creation (`CREATE TABLE`)

```sql
CREATE TABLE table_name (
    column data_type [column_constraints] [DEFAULT value],
    ...,
    [table_constraints]
);
```

### Common Data Types

| Category | SQL Data Type | Description |
| :--- | :--- | :--- |
| **Integers** | `INTEGER` (or `INT`), `SMALLINT` | Whole numbers. |
| **Exact Decimals** | `DECIMAL(p, s)` / `NUMERIC(p, s)` | $p$ total digits, $s$ decimal fractional places (recommended for financial currency). |
| **Floating Point** | `FLOAT`, `REAL` | Approximate precision real numbers. |
| **Fixed-Length Text** | `CHAR(n)` | Exact length of $n$ characters (padded with trailing spaces). |
| **Variable-Length Text** | `VARCHAR(n)` | Character string up to $n$ characters. |
| **Dates and Times** | `DATE`, `TIME`, `TIMESTAMP` | `'YYYY-MM-DD'`, `'HH:MM:SS'`. |

`DEFAULT value` sets a default scalar value when columns are omitted in an `INSERT`.

### Integrity Constraints

Can be specified at **column level** (if referencing only that attribute) or at **table level** (mandatory when spanning multiple attributes, e.g., composite primary keys):

| Constraint | Semantics | Column-Level Example | Table-Level Example |
| :--- | :--- | :--- | :--- |
| `NOT NULL` | Forbids `NULL` entries. | `name VARCHAR(30) NOT NULL` | *(Column-level only)* |
| `UNIQUE` | Enforces uniqueness (permits `NULL`). | `nif CHAR(9) UNIQUE` | `UNIQUE (nif, series)` |
| `PRIMARY KEY` | Primary key (`NOT NULL` + `UNIQUE`). | `id INT PRIMARY KEY` | `PRIMARY KEY (course_id, year)` |
| `REFERENCES` | Foreign key referencing parent. | `num_dpt INT REFERENCES dpt(num)` | `FOREIGN KEY (dpt) REFERENCES dpt(num)` |
| `CHECK` | Business validation rule. | `salary INT CHECK (salary > 0)` | `CHECK (end_date >= start_date)` |

---

## 2.2. Referential Integrity

When parent tuples are deleted (`DELETE`) or modified (`UPDATE`), referenced foreign key relationships execute one of these policies:

| SQL Action | Behavior | Recommended Use Case |
| :--- | :--- | :--- |
| `RESTRICT` / `NO ACTION` | **Aborts operation with a constraint violation.** (Default standard behavior). | Whenever dependent orphan records or accidental cascade loss must be prevented. |
| `CASCADE` | **Automatically propagates** the deletion or update across all dependent child rows. | Weak entities or composition ownership (e.g., deleting an invoice deletes line items). |
| `SET NULL` | **Assigns `NULL`** to foreign key attributes in impacted child rows. | When child records remain valid without an assigned parent (FK cannot be `NOT NULL`). |

```sql
FOREIGN KEY (col_fk) REFERENCES parent_table(col_pk)
    ON DELETE CASCADE
    ON UPDATE RESTRICT
```
**Example:**

:::sqlviz{simulation="ddl_empleats"}
:::

---

## 2.3. Row Insertion (`INSERT INTO`)

**Positional Insertion:** requires supplying values for **all columns** matching the table declaration order:

```sql
INSERT INTO empleats
VALUES (5, 'FERRAN', 250000, 'MATARO', 1, 1);
```

**Explicit Column Insertion:** specifies a chosen subset of columns; omitted attributes take their `DEFAULT` or `NULL`. If an omitted attribute lacks a `DEFAULT` and has `NOT NULL`, the insertion errors out:

```sql
INSERT INTO departaments (num_dpt, nom_dpt)
VALUES (4, 'PERSONAL');
```

**Bulk Insertion via `SELECT`:** directly inserts query result sets into an existing target relation:

```sql
INSERT INTO proj_importants
SELECT * FROM projectes
WHERE pressupost > 2000000;
```

:::dmlviz
:::

---

## 2.4. Row Deletion (`DELETE FROM`)

```sql
DELETE FROM table_name [WHERE condition];
```

**Caution with Omitting WHERE:** Running `DELETE FROM table;` without a `WHERE` clause **deletes every row** in the table.

```sql
-- Delete employees belonging to department 2
DELETE FROM empleats WHERE num_dpt = 2;

-- Delete employees earning <= 250,000
DELETE FROM empleats WHERE sou <= 250000;
```

To delete departments with zero assigned employees, use `NOT EXISTS`:

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

## 2.5. Modifying Data (`UPDATE`)

```sql
UPDATE table_name
SET column1 = expression1 [, column2 = expression2 ...]
[WHERE condition];
```

**Caution with Omitting WHERE:** Lacking a `WHERE` predicate, modifications apply to **every row** in the relation.

```sql
UPDATE empleats
SET sou = sou + 10000, 
    ciutat_empl = 'VIC'
WHERE num_dpt = 2;
```

**Subquery in `WHERE` Clause:** filters rows to update based on correlated lookup against another table:

```sql
UPDATE empleats 
SET sou = sou + 10000
WHERE num_dpt IN (
    SELECT num_dpt FROM departaments
    WHERE ciutat_dpt = 'MADRID'
);
```

**Scalar Subquery in `SET` Clause:** computes updated attribute values dynamically. The subquery must return a **single scalar** (1 row and 1 column); multiple rows cause query termination:

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
