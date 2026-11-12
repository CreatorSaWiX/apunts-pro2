---
title: "Topic 6: SQL Programming (JDBC)"
description: "Dynamic SQL with JDBC, connection and autocommit, Statement vs PreparedStatement, ResultSet and NULL handling (wasNull), SQLException (SQLState), and exam quality criteria."
readTime: "9 min"
order: 10
draft: true
isNew: true
---

**JDBC** (*Java Database Connectivity*) is the standard Java API for connecting to a relational DBMS and executing dynamic SQL via method calls.

---

## 6.1. Static vs. dynamic SQL and drivers *(introductory)*

| Approach | How does it work? | Portability / Efficiency |
| :--- | :--- | :--- |
| **Static SQL (`SQLJ`)** | Fixed embedded statements; precompiled and validated before execution. | Low portability (requires recompilation), higher efficiency and less code. |
| **Dynamic SQL (`JDBC`)** | Statements built as `String` objects and compiled at runtime. | Portable across DBMSs, allows deciding queries dynamically. |

The JDBC API is vendor-independent; each DBMS provides a **driver** implementing it:
- **Type 1:** JDBC–ODBC bridge.
- **Type 2:** JDBC driver + vendor's native library.
- **Type 3:** Generic driver over a network protocol to an intermediate JDBC server.
- **Type 4:** Pure Java driver directly against the DBMS *(the most common)*.

:::jdbcviz
:::

---

## 6.2. Connection, `autocommit`, and closing

```java
import java.sql.*;
import java.util.Properties;

Properties props = new Properties();
props.setProperty("user", "username");
props.setProperty("password", "password");

Connection c = DriverManager.getConnection("jdbc:postgresql://host:port/db", props);
c.setAutoCommit(false); // Mandatory in labs and exams!

// ... queries and updates ...

c.commit();    // Commits the transaction (or c.rollback() to undo it)
c.close();     // Closes the connection
```

**Watch out on exams:** problem statements already give you an open connection `c` with `autocommit = false`. You must call `c.commit()` at the end if everything succeeded, and `c.rollback()` when a business rule fails or an exception is thrown.

:::jdbcconnviz
:::

---

## 6.3. `Statement` vs. `PreparedStatement`

| Feature | `Statement` | `PreparedStatement` |
| :--- | :--- | :--- |
| **SQL compilation** | Compiled **every time** it runs. | Compiled **once** (reusable and safe). |
| **Creation** | `Statement st = c.createStatement();` | `PreparedStatement ps = c.prepareStatement(sql);` |
| **Queries (`SELECT`)** | `ResultSet rs = st.executeQuery(sql);` | `ResultSet rs = ps.executeQuery();` |
| **Updates (`I/U/D`)** | `int n = st.executeUpdate(sql);` | `int n = ps.executeUpdate();` |

- `executeQuery(...)` returns a `ResultSet` containing the rows.
- `executeUpdate(...)` returns an `int` with the **number of affected rows** (`0` if no row matches the `WHERE` clause).
- In `PreparedStatement`, `?` parameters are bound using **`1`-based indexing**: `ps.setString(1, val)`, `ps.setInt(2, val)`, `ps.setFloat(3, val)`, `ps.setNull(4, Types.INTEGER)`.

```java
// PreparedStatement prepared OUTSIDE the loop and reused inside
PreparedStatement ps = c.prepareStatement(
    "DELETE FROM tipus WHERE tipus = ?;"
);
ps.setString(1, "titelles");
int rows = ps.executeUpdate();
if (rows == 0) System.out.println("Does not exist");
ps.close();
```

**Golden rule for simultaneous cursors:** each `Statement` or `PreparedStatement` instance can only keep **one open `ResultSet` at a time**. If you execute another query on the same `Statement` while still iterating over the first `ResultSet`, the first one closes automatically. You must use **separate `Statement`/`PreparedStatement` objects** for nested queries.

:::jdbcstmtviz
:::

---

## 6.4. Processing results (`ResultSet`) and `NULL` values

A `ResultSet` acts like a cursor initially positioned **before the first row**. You must always call `rs.next()` (returns `false` when no rows remain) before reading columns with `getXXX(colName)` or `getXXX(indexFrom1)`.

### Detecting `NULL` values *(classic trap)*

| Java data type | How to check if the SQL field was `NULL`? |
| :--- | :--- |
| **Classes (`String`, `Date`)** | Directly returns `null`: `if (name == null)` |
| **Primitives (`int`, `float`, `double`)** | An SQL `NULL` returns **`0`**! You must call **`rs.wasNull()`** immediately after `getInt`/`getFloat`. |

```java
ResultSet rs = st.executeQuery("SELECT titol, preu FROM activitats;");
int count = 0;
while (rs.next()) {
    count++;
    String title = rs.getString("titol");
    int price = rs.getInt("preu");
    if (rs.wasNull()) {
        System.out.println(title + " has no price");
    }
}
if (count == 0) System.out.println("No results");
rs.close();
```

:::resultsetviz
:::

---

## 6.5. Error handling (`SQLException` and `SQLState`)

Connection, SQL execution, or closing errors throw `SQLException`. The main methods are `se.getSQLState()` (5-character code) and `se.getMessage()`.

| `SQLState` (PostgreSQL) | Meaning |
| :--- | :--- |
| **`"23502"`** | `not_null_violation` (`NULL` value in a `NOT NULL` column) |
| **`"23503"`** | `foreign_key_violation` (missing foreign key or deletion with child rows) |
| **`"23505"`** | `unique_violation` (duplicate `PRIMARY KEY` or `UNIQUE`) |
| **`"23514"`** | `check_violation` (violation of a `CHECK` constraint) |

*(Other codes: `"00000"` success, `"01XXX"` warning, `>"02XXX"` severe error, `"23XXX"` integrity, `"08XXX"` connection).*

```java
try {
    Statement st = c.createStatement();
    int mod = st.executeUpdate(
        "UPDATE despatxos SET superficie = superficie + 5 WHERE modul = 'Omega';"
    );
    if (mod == 0) System.out.println("No offices modified");
    st.close();
    c.commit();
    c.close();
} catch (SQLException se) {
    c.rollback(); // Undoes all transaction changes before exiting!
    if (se.getSQLState().equals("23514")) {
        System.out.println("Error: some office exceeds the allowed limit");
    } else {
        System.out.println("Exception: " + se.getSQLState() + " - " + se.getMessage());
    }
}
```

:::sqlexceptionviz
:::

---

## 6.6. Quality criteria in JDBC (exam questions)

Final exams ask you to detect and fix JDBC code that violates these criteria:

1. **Do not do in Java what a single SQL statement can do:** avoid the pattern `SELECT` $\rightarrow$ `while (rs.next())` $\rightarrow$ `UPDATE`/`DELETE` row by row. Replace it with a single SQL statement (`UPDATE ... WHERE ...`, `DELETE ... WHERE NOT EXISTS (...)`, `INSERT INTO ... SELECT ...`).
2. **`PreparedStatement` outside the loop:** never create a `Statement` or `PreparedStatement` **inside** a `while` or `for` loop. Prepare the `PreparedStatement` once before the loop and only call `setXXX(...)` + `execute...()` inside.
3. **Leverage the DDL and catch `SQLException`:** do not manually check with `SELECT` or `if` in Java whether a row has children, duplicates, or exceeds a `CHECK` already declared on the table. Execute the operation directly and catch `"23503"`, `"23505"`, `"23502"`, or `"23514"` in the `catch` block.
4. **Clean SQL queries:** do not put `DISTINCT` on primary/candidate keys, do not select unnecessary columns, and do not filter in Java with `if` what belongs in the `WHERE` clause.
5. **Transactions and safe closing:** call `c.rollback()` in `catch` (or when a logic error is detected), `c.commit()` at the end if everything succeeded, and close all `ResultSet`, `Statement`/`PreparedStatement`, and `Connection` objects (`.close()`).
