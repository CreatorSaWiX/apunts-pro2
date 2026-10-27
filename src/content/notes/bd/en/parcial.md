---
title: "DB Midterm"
description: "Summary of topics 1, 2, 3, and 7."
readTime: "10 min"
order: 8
draft: false
---

## 1. SQL and Relational Algebra

### SQL Queries
- **Order:** `SELECT [DISTINCT] ... FROM ... [WHERE ...] [GROUP BY ...] [HAVING ...] [ORDER BY ... [ASC|DESC]]`
- **`NULL` values:** Always compare using `IS NULL` / `IS NOT NULL` (never `= NULL`).
- **Aggregation:** `COUNT(*)` counts nulls; `COUNT(col)`, `SUM`, `AVG`, `MIN`, `MAX` ignore nulls (and return `NULL` if 0 rows, except `COUNT` which returns `0`).
- **`WHERE` vs `HAVING`:** `WHERE` filters rows before grouping (no aggregations). `HAVING` filters groups after `GROUP BY`. Every column in `SELECT` outside an aggregation must appear in `GROUP BY`. Example:
```sql
SELECT a.modul, a.numero, p.nomProf, COUNT(*) 
.
.
.
GROUP BY a.modul, a.numero, p.nomProf
```
- **Exclusion subqueries:**
  - `NOT EXISTS (SELECT * FROM ... WHERE ...)`.
  - `col NOT IN (SELECT col FROM ... WHERE col IS NOT NULL)`.

### Query Patterns ("More than X...", "At least X...", "X or more...")

Whenever the problem asks to filter by the **number of times** something occurs, use **`GROUP BY` and `HAVING COUNT(...)`**.
**Typical phrasing:** *"having more than $N$..."*, *"on $N$ or more occasions..."*, *"at least $N$..."*.
```sql
SELECT columns_identifying_the_group
FROM ...
GROUP BY columns_identifying_the_group
HAVING COUNT(*) >= N; -- (or > N, depending on the statement)
```

**Example 1A:** "Get the DNI of professors who have had **5 or more assignments** in total (to any office)."
We want to count rows in `assignacions` per professor. Therefore, we group by `dni`.
```sql
SELECT a.dni
FROM assignacions a
GROUP BY a.dni
HAVING COUNT(*) >= 5;
```

**Example 1B:** "Get the office and professor's name when **the same professor** has been assigned **to the same office in 3 or more periods**."
Here we don't count total assignments per professor, but how many they have *in the same office*. Thus, in `GROUP BY` we must include both the office (`modul, numero`) and the professor (`nomProf`).
```sql
SELECT a.modul, a.numero, p.nomProf, COUNT(*) AS numVegades
FROM assignacions a JOIN professors p ON a.dni = p.dni
GROUP BY a.modul, a.numero, p.nomProf
HAVING COUNT(*) >= 3;
```

**Example 1C:** "Get the identifier and name of playlists that have **more than 5 songs by the same singer**."
The count is per *(playlist + singer)* pair, so we use `GROUP BY p.idList, p.nomList, c.cantant`. Watch out: `SELECT` only asks for the playlist (`idList, nomList`), NOT the singer! Since a playlist could have 6 songs by Shakira and 6 by Rosalía, it would appear twice; therefore we add `DISTINCT` to `SELECT`.
```sql
SELECT DISTINCT p.idList, p.nomList
FROM playlist p 
NATURAL INNER JOIN cançonsAPlaylist cp
NATURAL INNER JOIN cançons c
GROUP BY p.idList, p.nomList, c.cantant
HAVING COUNT(*) > 5;
```

**Example 1D:** "Get the DNI of professors who have been assigned to **5 or more different offices** within the same module."
A professor might have been assigned to office `'Omega', '101'` across 4 different periods (4 rows in `assignacions`), yet it is still **1 single office**! Using `COUNT(*)` counts periods (rows). To count *distinct offices* within the module, count distinct `numero` values: `COUNT(DISTINCT a.numero)`.
```sql
SELECT a.dni, a.modul
FROM assignacions a
GROUP BY a.dni, a.modul
HAVING COUNT(DISTINCT a.numero) >= 5;
```

---

### Query Patterns ("No...", "Does not have any...", "Never...")

Whenever the statement asks for an element that has **no** relationship with something else (or with a specific condition), use **`NOT EXISTS`** inside `WHERE`.

**Typical phrasing:** *"that has no..."*, *"who has never..."*, *"without any..."*.
```sql
SELECT ...
FROM main_table t1
WHERE NOT EXISTS (
    SELECT *
    FROM secondary_table t2
    WHERE t2.foreign_key = t1.primary_key  -- <-- MANDATORY CORRELATION!
      AND forbidden_condition
);
```

*(Note: Inside `NOT EXISTS` there must **always** be a condition correlating the subquery with the outer table, such as `t2.dni = t1.dni`.)*

**Example 2A:** "Get the DNI and name of professors who **do not have any active assignment**."
Take a professor `p` in the outer query, and verify that inside `assignacions` **no row exists** for this professor (`a.dni = p.dni`) with `instantFi IS NULL`.
```sql
SELECT p.dni, p.nomProf
FROM professors p
WHERE NOT EXISTS (
    SELECT *
    FROM assignacions a
    WHERE a.dni = p.dni           -- Correlation with outer professor
      AND a.instantFi IS NULL     -- Active assignment condition
);
```

**Example 2B:** "...playlists such that **their creator has no muted followers**."
In the outer query we have playlist `p` (with attribute `p.creador`). Inside `NOT EXISTS` we check table `seguidors s` for anyone following this creator (`s.nomSeguit = p.creador`) who is muted (`s.silenciat = 0`).
```sql
SELECT p.idList, p.nomList
FROM playlist p
WHERE NOT EXISTS (
    SELECT *
    FROM seguidors s
    WHERE s.nomSeguit = p.creador -- Correlation with outer creator
      AND s.silenciat = 0         -- Muted condition
);
```

**Example 2C:** "Get the name of professors who **have never been assigned to any office with an area greater than 20 square meters**."
What is forbidden for these professors? Having an assignment `a` in an office `d` with `d.superficie > 20`. Therefore, place the `JOIN` between `assignacions` and `despatxos` inside `NOT EXISTS`.
```sql
SELECT p.nomProf
FROM professors p
WHERE NOT EXISTS (
    SELECT *
    FROM assignacions a 
    JOIN despatxos d ON (a.modul = d.modul AND a.numero = d.numero)
    WHERE a.dni = p.dni           -- Correlation with outer professor
      AND d.superficie > 20       -- Forbidden condition
);
```

---

### Query Patterns ("All...", "Always...", "Only...")

SQL has no `FOR ALL` keyword, so universal quantification is expressed via **double negation** using **`NOT EXISTS (... WHERE NOT Y)`** (inverting the condition operator inside: `=` becomes `<>`, `>` becomes `<=`, `IS NOT NULL` becomes `IS NULL`).

**Typical phrasing:** *"where all X satisfy Y"*, *"who only / exclusively did Y"*.

**Example 3A:** "Get the DNI of professors who have at least one assignment and such that **all their assignments are in the 'Omega' module**."
"Have at least one assignment" $\rightarrow$ query from `assignacions a`. "All are in 'Omega'" $\rightarrow$ **There does not exist** any other assignment `a2` for this same professor (`a2.dni = a.dni`) where the module is **NOT** `'Omega'` (`a2.modul <> 'Omega'`).
```sql
SELECT DISTINCT a.dni
FROM assignacions a
WHERE NOT EXISTS (
    SELECT *
    FROM assignacions a2
    WHERE a2.dni = a.dni          -- Same professor
      AND a2.modul <> 'Omega'     -- INVERTED condition! (any outside Omega)
);
```

**Example 3B:** "Get the identifier of playlists where **all songs in them have more than 1000 total plays** (`numTotalReproduccions > 1000`)."
"All have $> 1000$" translates to: **There does not exist** any song in this playlist with **$\le 1000$** plays (`c.numTotalReproduccions <= 1000`).
```sql
SELECT p.idList, p.nomList
FROM playlist p
WHERE NOT EXISTS (
    SELECT *
    FROM cançonsAPlaylist cp 
    JOIN cançons c ON cp.idCanço = c.idCanço
    WHERE cp.idList = p.idList              -- Correlation with outer playlist
      AND c.numTotalReproduccions <= 1000   -- INVERTED condition! (<= instead of >)
);
```

---

### Query Patterns ("Only a single...", "The same for all...")

When the statement requires an element to **only be related to a single** other element, find the element and its related entity `a` in the outer query, and use **`NOT EXISTS`** to verify that no other row exists for the same element with a different identifier (`a2.dni != a.dni`).

**Typical phrasing:** *"offices that have only had a single professor"*, *"playlists where all songs are by a single singer"*.

**Example 4A:** "Get the offices (`modul, numero`) and the professor's DNI for offices that **have only had a single professor assigned** over time."
We check that in the same office there has been no other professor with a different DNI.
```sql
SELECT DISTINCT a.modul, a.numero, a.dni
FROM assignacions a
WHERE NOT EXISTS (
    SELECT *
    FROM assignacions a2
    WHERE a2.modul = a.modul      -- Same module
      AND a2.numero = a.numero    -- Same office number
      AND a2.dni != a.dni         -- But a DIFFERENT professor!
);
```

**Example 4B:** "...offices that **have only had a single professor assigned with a salary greater than 1000**..."
Identical to Example 4A, except the condition `sou > 1000` must be met both by the outer professor (`p.sou > 1000`) and by any potential second professor inside `NOT EXISTS` (`p2.sou > 1000`).
```sql
SELECT DISTINCT a.modul, a.numero, p.nomProf
FROM assignacions a JOIN professors p ON a.dni = p.dni
WHERE p.sou > 1000                -- Our professor earns > 1000
  AND NOT EXISTS (
      SELECT *
      FROM assignacions a2 JOIN professors p2 ON a2.dni = p2.dni
      WHERE p2.sou > 1000         -- The other professor also earns > 1000
        AND a2.modul = a.modul    -- Same module
        AND a2.numero = a.numero  -- Same number
        AND a2.dni != a.dni       -- But is a DIFFERENT professor!
  );
```

**Example 4C:** "Get the playlist name and singer for playlists that **only contain songs by a single singer**."
In the outer query, join the playlist with its songs to get singer `c.cantant`. Inside `NOT EXISTS`, check if that same playlist (`cp2.idList = p.idList`) contains any song with a different singer (`c2.cantant <> c.cantant`).
```sql
SELECT DISTINCT p.nomList, c.cantant
FROM playlist p
NATURAL INNER JOIN cançonsAPlaylist cp
NATURAL INNER JOIN cançons c
WHERE NOT EXISTS (
    SELECT *
    FROM cançonsAPlaylist cp2 
    NATURAL INNER JOIN cançons c2
    WHERE cp2.idList = p.idList       -- Same playlist
      AND c2.cantant <> c.cantant     -- But a DIFFERENT singer!
);
```

**Combined Example (4B + 1B):** "Get the offices that **have only had a single professor assigned with a salary greater than 1000** and where, additionally, **the same professor has been assigned to the same office in 3 or more different periods**."
Combine the exclusivity filter in `WHERE` (Example 4B) with the grouping and count in `GROUP BY ... HAVING` (Example 1B).
```sql
SELECT a.modul, a.numero, p.nomProf, COUNT(*) AS numVegades
FROM assignacions a JOIN professors p ON a.dni = p.dni
WHERE p.sou > 1000 
  AND NOT EXISTS (
      SELECT *
      FROM assignacions a2 JOIN professors p2 ON a2.dni = p2.dni
      WHERE p2.sou > 1000
        AND a2.modul = a.modul 
        AND a2.numero = a.numero
        AND a2.dni != a.dni
  )
GROUP BY a.modul, a.numero, p.nomProf
HAVING COUNT(*) >= 3;
```

---

### Relational Algebra
Duplicate-free by definition. Written as a step-by-step sequence ($A = \dots, R = \dots$).

| Operator | Syntax | Description |
| :--- | :---: | :--- |
| **Selection / Projection** | $T(\text{cond})$ / $T[A, B]$ | Filters rows / Slices columns. |
| **Rename** | $T\{A \to B\}$ | Renames attributes (needed for $\cup, \cap, -$ or self-joins). |
| **Joins** | $T[\text{cond}]S$ / $T * S$ | $\theta$-Join (with condition) / Natural Join (matching attribute names). |
| **Set Operations** | $T \cup S$, $T - S$, $T \cap S$ | Identical schemas (same degree and attribute names). |

---

## 2. DDL and DML

### Table Definition (`CREATE TABLE`) and Integrity
- **Constraints:** `NOT NULL`, `UNIQUE` (allows nulls), `PRIMARY KEY` (`NOT NULL` + `UNIQUE`), `REFERENCES table(pk)` (`FOREIGN KEY`), `CHECK (condition)`.
- **Foreign Key Policies (`ON DELETE` / `ON UPDATE`):**
  - `RESTRICT` / `NO ACTION`: Blocks operation if child rows exist *(default)*.
  - `CASCADE`: Propagates deletion or update to child rows.
  - `SET NULL`: Sets FK to `NULL` (requires FK column to be nullable).

### Data Manipulation (DML)
- `INSERT INTO table [(cols)] VALUES (...)` or `INSERT INTO table SELECT ...`
- `DELETE FROM table [WHERE ...]` *(omitting `WHERE` deletes all rows)*.
- `UPDATE table SET col = val [WHERE ...]` *(a subquery in `SET` must return 1 single row and column)*.

---

## 3. Logical Components and Security

### Domains, Assertions, and Transactions
- **`CREATE DOMAIN dom AS type [DEFAULT v] [CHECK (VALUE ...)]`:** Reusable custom type.
- **Where to place each constraint:**
  - 1 column $\to$ Column `CHECK`.
  - Multiple columns of the **same row** $\to$ Table `CHECK` (implication $A \to B \equiv \neg A \lor B$).
  - Multiple rows or tables $\to$ `CREATE ASSERTION name CHECK (NOT EXISTS (SELECT ... violators))`.
- **Transactions:** `START TRANSACTION`, `COMMIT` (saves), `ROLLBACK` (undoes). Maximum isolation: `SERIALIZABLE`.

### Views (`CREATE VIEW`)
- **Updatable (Standard SQL):** Only if defined over **1 single base table** (no `JOIN`, `UNION`, `GROUP BY`, `HAVING`, `DISTINCT`, or aggregations) projecting simple columns. For `INSERT`, all `NOT NULL` columns without a `DEFAULT` must be included.
- **`WITH CHECK OPTION`:** Prevents `INSERT`/`UPDATE` through the view if the resulting row no longer satisfies the view's `WHERE` clause.

### Privileges (`GRANT` / `REVOKE`)
- `GRANT priv ON obj TO user [WITH GRANT OPTION]` (`SELECT`, `INSERT`, `UPDATE(col)`, `DELETE`, `REFERENCES`).
- `REVOKE priv ON obj FROM user [CASCADE | RESTRICT]` (`CASCADE` revokes in chain unless the user has an independent valid path in the grant graph).
- **Golden rule:** An `UPDATE` or `DELETE` with `WHERE col = x` requires `UPDATE`/`DELETE` privilege **plus `SELECT` on `col`**.
- **Row-level/user privacy:** Create a view with `WHERE user = CURRENT_USER` and `GRANT` permissions on the view.

---

## 6. Conceptual Design (UML $\to$ Relational)

### Mapping UML Structures

| UML Element | Relational Model Mapping |
| :--- | :--- |
| **Class** | Table with external key as `PRIMARY KEY`. |
| **Multivalued attribute `[*]`** | Transforms into a new class with a **1\:N** association. |
| **1\:N Association** | FK on the **«many»** (`*`) side. If the minimum on the «one» side is `1`, the FK is `NOT NULL`. |
| **1\:1 Association** | FK on either side (preferably the `1..1` side) with a **`UNIQUE`** constraint. |
| **M\:N Association** | New table with $\text{PK} = (\text{FK}_1, \text{FK}_2)$. |
| **Ternary Association** | New table:<li>If $* - * - *$: $\text{PK} = (A, B, C)$.</li><li>If $* - * - 0..1$: $\text{PK} = (A, B)$ and $C$ is FK `NOT NULL`.</li><li>If $* - 0..1 - 0..1$: $\text{PK} = (A, B)$ and $(A, C)$ is `UNIQUE NOT NULL`.</li> |
| **Recursive Association** | **1\:N:** Self-referencing FK (`manager_dni`). **M\:N:** New table with two FKs to the same table. |
| **Association Class** | Its attributes are added to the association's table. |
| **Inheritance** | 1 table for the superclass + 1 for each subclass with $\text{PK} = \text{FK}$ referencing the superclass. |
| **Weak Class** | Composite $\text{PK}$ formed by the strong class PK + its relative identifier. |
| **Pure Temporal Class** | No table created; maps as a `DATE`/`TIME`/`INT` attribute on the associated table. |

### Validating UML Assertions (True / False)
- **TRUE:** Proven by constructing a minimal row instance satisfying all PKs, FKs, and multiplicities.
- **FALSE:** Violates a maximum (`1`) or minimum (`1`) multiplicity or external key. Fixed by changing the multiplicity (`1` $\to$ `*` or `1` $\to$ `0`) or making the key relative.

