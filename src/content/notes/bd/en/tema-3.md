---
title: "Topic 3: Logical Components"
description: "Schemas, domains, assertions, views, and permissions."
readTime: "8 min"
order: 3
draft: false
---

This topic covers the logical organization, integrity mechanisms, and access control components in the standard SQL database architecture.

---

## 3.1. Schemas, Catalogs, and Clusters

The DBMS organizes storage resources into a three-level administrative hierarchy:

:::dbhierarchyviz
:::

```sql
-- Creating a schema owned by a user
CREATE SCHEMA schema_name [AUTHORIZATION username];

-- Dropping a schema
DROP SCHEMA schema_name RESTRICT; -- Only if empty (default)
DROP SCHEMA schema_name CASCADE;  -- Recursively drops schema and all nested objects
```

---

## 3.2. Connections, Sessions, and Transactions

A **connection** represents an active communication channel between client and database server. A **session** defines the execution context of an authenticated user across that connection. A **transaction** is an atomic sequence of SQL statements: either all succeed or none persist.

:::sessionviz
:::

```sql
CONNECT TO server_name [AS connection_name] [USER username];
SET SCHEMA schema_name;
DISCONNECT connection_name | DEFAULT | CURRENT | ALL;
```

Transaction management:

```sql
START TRANSACTION READ WRITE; -- or READ ONLY

-- Standard transaction isolation levels:
-- READ UNCOMMITTED | READ COMMITTED | REPEATABLE READ | SERIALIZABLE
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;

COMMIT;   -- Persists and finalizes changes
ROLLBACK; -- Discards and reverts transaction modifications
```

---

## 3.3. Domains (`CREATE DOMAIN`)

A domain is a **reusable custom data type** packaged with validation rules. Rather than declaring redundant column `CHECK` constraints, domains provide centralized type safety:

```sql
CREATE DOMAIN domain_name AS data_type
    [DEFAULT value]
    [CONSTRAINT constraint_name CHECK (condition)];

-- Example:
CREATE DOMAIN city AS CHAR(15)
    DEFAULT 'BCN'
    CONSTRAINT valid_cities CHECK (VALUE IN ('BCN', 'MAD', 'VAL'));

-- Usage in relation definitions:
CREATE TABLE empleats (
    nemp         INTEGER PRIMARY KEY,
    ciutat_naix  city,
    ciutat_treb  city
);
```

:::domainviz
:::

---

## 3.4. Assertions (`CREATE ASSERTION`)

An assertion is an overarching **global integrity constraint** in standard SQL evaluated against state mutations on any referenced table.

### Scope of Constraint Enforcement

A **column constraint** (`CHECK`) evaluates only scalar values of its own attribute (`CHECK (salary > 0)`). A **table constraint** (`CHECK`) compares multiple attributes across the identical tuple (`CHECK (end_date >= start_date)`) and vacously passes on empty relations. An **assertion** (`ASSERTION`) is mandatory whenever rules span multiple tuples, aggregate expressions, or cross-table invariants.

```sql
CREATE ASSERTION assertion_name CHECK (
    NOT EXISTS (
        SELECT *
        FROM empleats e, departaments d
        WHERE e.num_dpt = d.num_dpt 
          AND e.ciutat_empl <> d.ciutat_dpt
    )
);
```

:::assertionviz
:::

---

## 3.5. Views (`CREATE VIEW`)

A view is a **virtual relation** defined by an underlying SQL query. It stores zero data pages on physical storage (holding only its catalog query definition), dynamically materialized when queried.

```sql
CREATE VIEW view_name [(col1, col2, ...)] AS
select_query
[WITH CHECK OPTION];
```
**Example:**
```sql
CREATE VIEW empleats_altsous AS
SELECT num_empl, nom_empl, sou, num_dpt
FROM empleats
WHERE sou >= 200000;

-- Queried identically to a standard relation:
SELECT * FROM empleats_altsous WHERE num_dpt = 2;
```

:::viewviz
:::

### Updatability of Views (Standard SQL)

A view supports `INSERT`, `UPDATE`, or `DELETE` only if operations translate unambiguously into underlying base relations. Under the standard, it must query **a single base table** (excluding `JOIN`, `UNION`, and subqueries in `FROM`), omit aggregates, `DISTINCT`, `GROUP BY`, and `HAVING`, and project **simple attribute references** (no scalar arithmetic or literals). To support `INSERT`, the view must project all underlying `NOT NULL` columns lacking a `DEFAULT`.

### Ambiguity in Multi-Table Joined Views

Joining tables $A$ and $B$ over foreign keys introduces ambiguities precluding updates: on `DELETE`, the DBMS cannot deduce whether to remove $A$, $B$, or both; on `UPDATE`, modifying $A$ attributes side-effects unprojected $B$ rows; and on `INSERT`, values for omitted mandatory columns in base tables remain undefined.

:::viewupdviz
:::

### The `WITH CHECK OPTION` Clause

Ensures that view-mediated `INSERT` or `UPDATE` statements cannot introduce rows violating the view's `WHERE` predicate:

```sql
CREATE VIEW empleats_dep2 AS
SELECT * FROM empleats
WHERE num_dpt = 2
WITH CHECK OPTION;

-- Fails (CHECK OPTION violation error):
UPDATE empleats_dep2 SET num_dpt = 3 WHERE num_empl = 5;
```

Without this clause, the mutation succeeds in the base relation, but the row **silently vanishes from the view**. Under cascading views (`CASCADED`), modifying nested view $V_2$ over $V_1$ enforces predicates for both $V_1$ and $V_2$.

### Physical Storage Trade-offs: Tables vs. Views

A **virtual view** consumes zero disk blocks; however, queries incur full re-execution costs against base tables. A **materialized table** occupies physical storage, but subsequent queries read cached tuples directly, saving I/O on expensive aggregations and joins.

---

## 3.6. The Information Schema

A standardized family of **read-only administrative metadata views**:

| View | Content |
| :--- | :--- |
| `SCHEMATA` | Catalog listing of all schemas. |
| `TABLES` | Table and view names with structural types. |
| `COLUMNS` | Attribute names, types, and constraints. |
| `VIEWS` | SQL text definitions of all views. |
| `DOMAINS` | Defined domains and validation checks. |
| `TABLE_CONSTRAINTS` | Primary, foreign, and check constraints. |

---

## 3.7. Access Control: Privileges and Roles

The DBMS regulates access through **privileges**. Data privileges on tables/views are `SELECT`, `INSERT`, `UPDATE[(col1, ...)]`, and `DELETE`. Structural privileges include `REFERENCES[(col1, ...)]` (creating foreign keys), `USAGE` (domains), and `ALL`.

```sql
-- Granting permissions with delegation rights:
GRANT SELECT, UPDATE(sou) ON empleats TO anna;
GRANT SELECT(nom_empl) ON empleats TO anna WITH GRANT OPTION;

-- Revoking permissions:
REVOKE SELECT ON empleats FROM anna CASCADE;  -- Cascades revocation to delegates
REVOKE SELECT ON empleats FROM anna RESTRICT; -- Fails if dependent delegations exist
```

### Authorization Graphs

Directed graph models where vertices represent users/roles and edges represent granted privileges:

:::dacviz
:::

### Privilege Resolution Invariants

1. **Alternative Paths in `REVOKE CASCADE`**: Removing an edge recomputes connectivity from the object owner. If a user retains an independent path, the privilege is preserved.
2. **Revoking Delegation Exclusively**: `REVOKE GRANT OPTION FOR SELECT ON table FROM user CASCADE` removes propagation rights while retaining personal query access.
3. **`SELECT` Requirement for `UPDATE` / `DELETE`**: Executing an update filtered with `WHERE col = value` requires `UPDATE` permission and mandatory `SELECT` on `col`.
4. **Permissions on `INSERT ... SELECT`**: Executing `INSERT INTO T1 SELECT colA FROM T2 WHERE colB = 1` requires `INSERT` on `T1`, `SELECT` on `T2(colA)`, and `SELECT` on `T2(colB)`.
5. **Least-Privilege Views**: Security boundaries are created by projecting filtered rows/columns via views with `WITH CHECK OPTION`, granting permissions strictly on the view.

### Roles

Collections of privileges simplifying access administration across user cohorts:

```sql
CREATE ROLE lector;
GRANT SELECT ON empleats, departaments TO lector;

GRANT lector TO marc, laia; -- Assigning role
SET ROLE lector;            -- Activating in session
```

```sql
CREATE VIEW el_meu_sou AS
SELECT num_empl, sou FROM empleats WHERE nom_empl = CURRENT_USER;

GRANT SELECT ON el_meu_sou TO PUBLIC;
```

---

## 3.8. Data Privacy (GDPR / LOPD-GDD)

- **Consent**: Must be **explicit, informed, and unambiguous** (pre-ticked opt-in boxes prohibited).
- **Subject Rights**: Right of access, rectification, objection, portability, and erasure (**right to be forgotten**).
- **Special Category Data**: Health records, biometrics, genetics, religious/political beliefs, sexual orientation.
- **Enforcement & Oversight**: Supervised by the **DPO** (Data Protection Officer). Penalties reach up to **€20M** or **4% of global annual turnover**.
