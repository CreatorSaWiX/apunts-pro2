---
title: "Topic 1: SQL and Relational Algebra"
description: "DQL, aggregate functions, subqueries, and relational algebra."
readTime: "12 min"
order: 1
draft: false
---

All queries use the `SELECT` statement. Reference schema for examples:

:::sqlviz{simulation="esquema_empresa"}
:::

---

## 1.1. Basic `SELECT` Syntax

```sql
SELECT [DISTINCT | ALL] col_1, col_2 ...
FROM table
[WHERE condition]
[GROUP BY col_a, col_b ...]
[HAVING group_condition]
[ORDER BY col_x [ASC | DESC] ...];
```

`SELECT *` returns all columns; `SELECT nom_empl, sou` returns only the projected columns. The `AS` alias assigns a name to computed expressions:

```sql
SELECT nom_empl, sou * 1.05 AS sou_incrementat FROM empleats;
```

`DISTINCT` eliminates duplicate rows from the query output:

```sql
SELECT DISTINCT ciutat_empl FROM empleats;
```

:::distinctviz
:::

`ORDER BY` sorts the result: `ASC` ascending (default), `DESC` descending:

```sql
SELECT * FROM empleats 
ORDER BY num_dpt ASC, sou DESC;
```

---

## 1.2. Filtering with `WHERE`

| Operator | Usage | Example |
| :--- | :--- | :--- |
| **Comparison** | `=`, `<>`, `<`, `<=`, `>`, `>=` | `sou > 200000` |
| **Logical** | `AND`, `OR`, `NOT` | `num_dpt = 1 AND sou > 150000` |
| **Range** | `BETWEEN a AND b` *(inclusive)* | `sou BETWEEN 200000 AND 300000` |
| **Membership** | `IN (v1, v2...)` / `NOT IN` | `ciutat_empl IN ('VIC', 'MATARO')` |
| **Pattern Match** | `LIKE 'pattern'` | `nom_empl LIKE 'J%'` |
| **Null Checks** | `IS NULL` / `IS NOT NULL` | `ciutat_empl IS NOT NULL` |

`LIKE` performs text wildcard matching: `%` matches any character sequence (including empty), while `_` matches exactly one character. For example, `nom_empl LIKE 'J%'` matches all employee names starting with "J" ("JOAN", "JULIA", etc.), and `nom_empl LIKE 'J_AN'` matches "JOAN" but not "JOAN PERE".

**Caution with NULL in predicates:** Never use `= NULL` or `<> NULL`, as three-valued logic prevents them from evaluating to true. Always use **`IS NULL`** or **`IS NOT NULL`**.

---

## 1.3. Aggregate Functions

Process multiple tuples and return a single summary value:

| Function | Description | Behavior with `NULL` Values |
| :--- | :--- | :--- |
| `COUNT(*)` | Total rows returned | Counts all tuples (including nulls). |
| `COUNT(col)` | Rows with non-null values in `col` | Ignores `NULL` values. |
| `COUNT(DISTINCT col)` | Distinct non-null values | Ignores duplicates and `NULL` values. |
| `SUM(col)` | Arithmetic sum | Ignores `NULL` values. |
| `AVG(col)` | Arithmetic mean | Ignores `NULL` values. |
| `MIN(col)` / `MAX(col)` | Minimum / maximum value | Ignores `NULL` values. |

If no tuples satisfy the condition, `COUNT` evaluates to `0`, while `SUM`, `AVG`, `MIN`, and `MAX` evaluate to `NULL`.

```sql
SELECT COUNT(*), AVG(sou), MAX(sou)
FROM empleats 
WHERE num_dpt = 2;
```

:::aggregateviz
:::

---

## 1.4. Grouping (`GROUP BY`) and Group Predicates (`HAVING`)

`GROUP BY` partitions tuples into groups according to distinct values of the specified attributes. Every individual non-aggregate column in the `SELECT` list **must appear in the `GROUP BY` clause**; projecting unaggregated non-grouping attributes is invalid.

```sql
SELECT num_dpt, AVG(sou) AS sou_mig
FROM empleats 
GROUP BY num_dpt;
```

:::groupbyviz
:::

`WHERE` filters individual rows **before** grouping and cannot contain aggregate functions. `HAVING` filters **resulting groups after** grouping, where conditions on `COUNT`, `AVG`, etc. belong:

```sql
SELECT num_dpt, AVG(sou) AS sou_mig
FROM empleats
WHERE sou > 200000        -- 1. Filters individual employees with salary > 200k
GROUP BY num_dpt          -- 2. Groups by department
HAVING COUNT(*) > 1;      -- 3. Keeps departments with > 1 employee satisfying WHERE
```

:::sqlviz{simulation="select_group_having"}
:::

---

## 1.5. Multi-Table Queries (Joins)

Allow combining rows from multiple related tables. The recommended standard syntax is `INNER JOIN ... ON`:

```sql
SELECT e.nom_empl, d.nom_dpt
FROM empleats e
INNER JOIN departaments d ON e.num_dpt = d.num_dpt;
```

:::sqlviz{simulation="select_filtre_join"}
:::

`NATURAL INNER JOIN` automatically matches columns bearing identical names across both tables without requiring an explicit `ON` clause:

```sql
SELECT e.nom_empl, d.nom_dpt
FROM empleats e
NATURAL INNER JOIN departaments d;
```

:::naturaljoinviz
:::

Joins can be combined with grouping and aggregation:

```sql
SELECT d.nom_dpt, AVG(e.sou) AS sou_mig
FROM empleats e
INNER JOIN departaments d ON e.num_dpt = d.num_dpt
GROUP BY d.nom_dpt
HAVING COUNT(*) > 1;
```

:::joinaggviz
:::

---

## 1.6. Set Operations (`UNION`)

`UNION` vertically combines results from two independent `SELECT` statements into a single unified relation, automatically eliminating duplicate rows. `UNION ALL` retains duplicates and executes faster. Both queries must project identical arities with compatible data types, and `ORDER BY` can only appear once at the very end:

```sql
SELECT ciutat_dpt AS ciutat FROM departaments
UNION
SELECT ciutat_empl AS ciutat FROM empleats;
```

:::unionviz
:::

---

## 1.7. Subqueries

A subquery is a nested `SELECT` within an outer query. To find departments **with zero assigned employees**:

#### Using `NOT IN` (caution with `NULL` values):
```sql
SELECT * FROM departaments
WHERE num_dpt NOT IN (
    SELECT num_dpt FROM empleats
    WHERE num_dpt IS NOT NULL -- MANDATORY!
);
```

**The `NOT IN` NULL Trap:** If the subquery evaluates to even a single `NULL` value, `NOT IN` evaluates to unknown/false for all comparisons, and **the query returns an empty result set**. To ensure safety, always include `WHERE col IS NOT NULL`.

#### Using `NOT EXISTS` (recommended safe idiom):
```sql
SELECT * FROM departaments d
WHERE NOT EXISTS (
    SELECT * FROM empleats e
    WHERE e.num_dpt = d.num_dpt
);
```
`NOT EXISTS` verifies whether the inner query returns any tuples and is completely immune to `NULL` hazards.

---

## 1.8. Temporal Types and Functions

Primary temporal data types: `DATE` (format `'YYYY-MM-DD'`), `TIME` (format `'HH:MM:SS'`), `TIMESTAMP`, and `INTERVAL`. Current timestamps are obtained via `CURRENT_DATE`, `CURRENT_TIME`, or `NOW()`.

`EXTRACT` extracts specific calendar components:

```sql
EXTRACT(YEAR FROM data)       -- Year (e.g., 2024)
EXTRACT(MONTH FROM data)      -- Month (1 to 12)
EXTRACT(DOW FROM data)        -- Day of week (0 = Sunday)
```

:::extractviz
:::

`INTERVAL` supports arithmetic additions and subtractions over time:

```sql
SELECT * FROM viatges
WHERE moment > (data_sortida + INTERVAL '10 min');
```

:::intervalviz
:::

---

## 1.9. Query Quality Criteria

In FIB university database exams, even if a query yields correct data, point penalties are deducted if it violates these criteria:

1. **No unnecessary tables in `FROM`:** Never include a relation if all required columns already exist in another table joined by foreign key. *Incorrect:* `SELECT e.nom FROM empleats e, departaments d WHERE e.num_dpt = d.num_dpt AND d.num_dpt = 20;` — *Correct:* `SELECT e.nom FROM empleats e WHERE e.num_dpt = 20;`
2. **Strict usage of `DISTINCT`:** Use `DISTINCT` **only** if the query could legitimately generate duplicate tuples under valid database instances. **Never use it** if candidate or primary keys mathematically preclude duplicates.
3. **Do not use `GROUP BY` to eliminate duplicates:** Use `DISTINCT` to deduplicate, never a naked `GROUP BY` without aggregate expressions.
4. **Do not use `GROUP BY` on a known single group:** *Incorrect:* `SELECT AVG(sou) FROM empleats WHERE num_dpt = 5 GROUP BY num_dpt;` — *Correct:* `SELECT AVG(sou) FROM empleats WHERE num_dpt = 5;`
5. **No trivial or redundant `HAVING` filters:** Do not write `HAVING COUNT(*) >= 1` if relational joins already guarantee tuple existence.

---

## 1.10. Relational Algebra

**Relational Algebra** is a formal procedural query language where operators transform input relations into new output relations. In written examinations it carries between **1.5 and 2.5 points**, requiring step-by-step assignments ($A = \dots, B = \dots, R = \dots$).

Unlike SQL, relational algebra relations are mathematical sets **without duplicate tuples**: projection automatically eliminates duplicates. For set operations ($\cup$, $\cap$, $-$), both relations must be union-compatible (identical arity and matching attribute names; attributes must be renamed beforehand if mismatched).

### Relational Algebra Operators

| Operator | Syntax | Description |
| :--- | :---: | :--- |
| **Selection** | $T(condition)$ | Filters tuples satisfying predicate. |
| **Projection** | $T[A_1, A_2, \dots]$ | Selects specified attributes and eliminates duplicates. |
| **Renaming** | $T\{A \to B\}$ | Renames relation attributes. |
| **Cartesian Product** | $T \times S$ | Concatenates every tuple in $T$ with every tuple in $S$. |
| **Union** | $T \cup S$ | Tuples present in $T$, in $S$, or in both. |
| **Difference** | $T - S$ | Tuples present in $T$ but NOT in $S$. |
| **Intersection** | $T \cap S$ | Tuples present simultaneously in $T$ and $S$. |
| **$\theta$-Join** | $T[condition]S$ | Cartesian product conditioned by predicate. |
| **Natural Join** | $T * S$ | Equates shared attribute names and eliminates duplicate columns. |

:::relalgviz
:::

> **Problem Statement (LearnSQL - Exercise 4):**  
> *Provide a relational algebra sequence to obtain the department number and name of departments having two or more employees living in different cities.*

:::sqlviz{simulation="relalg_empleats_ciutats"}
:::

Standard hand-written exam notation:

$$A = \text{EMPLEATS}\{\text{CIUTAT\_EMPL} \to \text{C1}, \text{NUM\_DPT} \to \text{D1}\}$$

$$B = \text{EMPLEATS}[\text{NUM\_DPT} = \text{D1}, \text{CIUTAT\_EMPL} \neq \text{C1}] A$$

$$C = \text{DEPARTAMENTS} * B$$

$$R = C[\text{NUM\_DPT}, \text{NOM\_DPT}]$$
