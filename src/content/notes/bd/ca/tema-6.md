---
title: "Tema 6: Programació amb SQL (JDBC)"
description: "SQL dinàmic amb JDBC, connexió i autocommit, Statement vs PreparedStatement, ResultSet i gestió de NULLs (wasNull), SQLException (SQLState) i criteris de qualitat d'examen."
readTime: "9 min"
order: 10
draft: true
isNew: true
---

**JDBC** (*Java Database Connectivity*) és l'API estàndard de Java per connectar-se a un SGBD relacional i executar SQL dinàmic mitjançant crides a mètodes.

---

## 6.1. SQL estàtic vs. dinàmic i drivers *(introductori)*

| Enfocament | Com funciona? | Portabilitat / Eficiència |
| :--- | :--- | :--- |
| **SQL estàtic (`SQLJ`)** | Sentències fixes incrustades; es precompilen i es validen abans d'executar. | Poc portable (cal recompilar), més eficient i menys codi. |
| **SQL dinàmic (`JDBC`)** | Sentències com a `String` construïdes i compilades en temps d'execució. | Portable entre SGBD, permet decidir consultes dinàmicament. |

L'API JDBC és independent del fabricant; cada SGBD proporciona un **driver** que l'implementa:
- **Tipus 1:** Pont JDBC–ODBC.
- **Tipus 2:** Driver JDBC + llibreria nativa del fabricant.
- **Tipus 3:** Driver genèric via protocol de xarxa cap a un servidor intermedi JDBC.
- **Tipus 4:** Driver Java pur directe contra l'SGBD *(el més habitual)*.

:::jdbcviz
:::

---

## 6.2. Connexió, `autocommit` i tancament

```java
import java.sql.*;
import java.util.Properties;

Properties props = new Properties();
props.setProperty("user", "usuari");
props.setProperty("password", "contrasenya");

Connection c = DriverManager.getConnection("jdbc:postgresql://host:port/bd", props);
c.setAutoCommit(false); // Obligatori a laboratori i exàmens!

// ... consultes i modificacions ...

c.commit();    // Confirma la transacció (o c.rollback() per desfer-la)
c.close();     // Tanca la connexió
```

**Compte a examen:** als enunciats ja et donen la connexió `c` oberta amb `autocommit = false`. Cal fer `c.commit()` al final si tot ha anat bé, i `c.rollback()` quan falla alguna regla o salta una excepció.

:::jdbcconnviz
:::

---

## 6.3. `Statement` vs. `PreparedStatement`

| Característica | `Statement` | `PreparedStatement` |
| :--- | :--- | :--- |
| **Compilació SQL** | Es compila **cada vegada** que s'executa. | Es compila **un sol cop** (reutilitzable i segur). |
| **Creació** | `Statement st = c.createStatement();` | `PreparedStatement ps = c.prepareStatement(sql);` |
| **Consultes (`SELECT`)** | `ResultSet rs = st.executeQuery(sql);` | `ResultSet rs = ps.executeQuery();` |
| **Modificacions (`I/U/D`)** | `int n = st.executeUpdate(sql);` | `int n = ps.executeUpdate();` |

- `executeQuery(...)` retorna un `ResultSet` amb les files.
- `executeUpdate(...)` retorna un `int` amb el **nombre de files afectades** (`0` si cap fila compleix el `WHERE`).
- En `PreparedStatement`, els paràmetres `?` s'assignen indexant des d'**`1`**: `ps.setString(1, val)`, `ps.setInt(2, val)`, `ps.setFloat(3, val)`, `ps.setNull(4, Types.INTEGER)`.

```java
// PreparedStatement preparat FORA del bucle i reutilitzat dins
PreparedStatement ps = c.prepareStatement(
    "DELETE FROM tipus WHERE tipus = ?;"
);
ps.setString(1, "titelles");
int files = ps.executeUpdate();
if (files == 0) System.out.println("No existeix");
ps.close();
```

**Regla d'or de cursors simultanis:** cada instància de `Statement` o `PreparedStatement` només pot mantenir **un únic `ResultSet` obert alhora**. Si executes una altra consulta sobre el mateix `Statement` mentre encara recorres el primer `ResultSet`, aquest es tanca automàticament. Cal usar **objectes `Statement`/`PreparedStatement` diferents** per a consultes imbricades.

:::jdbcstmtviz
:::

---

## 6.4. Tractament de resultats (`ResultSet`) i valors `NULL`

Un `ResultSet` funciona com un cursor que inicialment apunta **abans de la primera fila**. Cal cridar sempre `rs.next()` (retorna `false` si no queden files) abans de llegir columnes amb `getXXX(nomColumna)` o `getXXX(indexDesDe1)`.

### Detecció de valors `NULL` *(trampa clàssica)*

| Tipus de dada Java | Com comprovar si el camp SQL era `NULL`? |
| :--- | :--- |
| **Classes (`String`, `Date`)** | Retorna `null` directe: `if (nom == null)` |
| **Primitius (`int`, `float`, `double`)** | Un `NULL` SQL retorna **`0`**! Cal cridar **`rs.wasNull()`** immediatament després del `getInt`/`getFloat`. |

```java
ResultSet rs = st.executeQuery("SELECT titol, preu FROM activitats;");
int quants = 0;
while (rs.next()) {
    quants++;
    String titol = rs.getString("titol");
    int preu = rs.getInt("preu");
    if (rs.wasNull()) {
        System.out.println(titol + " sense preu");
    }
}
if (quants == 0) System.out.println("Sense resultats");
rs.close();
```

:::resultsetviz
:::

---

## 6.5. Gestió d'errors (`SQLException` i `SQLState`)

Els errors de connexió, execució SQL o tancament llancen `SQLException`. Els mètodes principals són `se.getSQLState()` (codi de 5 caràcters) i `se.getMessage()`.

| `SQLState` (PostgreSQL) | Significat |
| :--- | :--- |
| **`"23502"`** | `not_null_violation` (valor `NULL` en columna `NOT NULL`) |
| **`"23503"`** | `foreign_key_violation` (clau forana inexistent o esborrat amb fills) |
| **`"23505"`** | `unique_violation` (duplicat de `PRIMARY KEY` o `UNIQUE`) |
| **`"23514"`** | `check_violation` (incompliment d'una restricció `CHECK`) |

*(Altres codis: `"00000"` èxit, `"01XXX"` avís, `>"02XXX"` error greu, `"23XXX"` integritat, `"08XXX"` connexió).*

```java
try {
    Statement st = c.createStatement();
    int mod = st.executeUpdate(
        "UPDATE despatxos SET superficie = superficie + 5 WHERE modul = 'Omega';"
    );
    if (mod == 0) System.out.println("Cap despatx modificat");
    st.close();
    c.commit();
    c.close();
} catch (SQLException se) {
    c.rollback(); // Desfà tots els canvis de la transacció abans de sortir!
    if (se.getSQLState().equals("23514")) {
        System.out.println("Error: algun despatx supera el límit permès");
    } else {
        System.out.println("Excepció: " + se.getSQLState() + " - " + se.getMessage());
    }
}
```

:::sqlexceptionviz
:::

---

## 6.6. Criteris de qualitat en JDBC (preguntes d'examen)

Als finals es demana detectar i corregir codi JDBC que incompleix aquests criteris:

1. **No fer en Java el que pot fer una única sentència SQL:** evita el patró `SELECT` $\rightarrow$ `while (rs.next())` $\rightarrow$ `UPDATE`/`DELETE` fila per fila. Substitueix-lo per una sola sentència SQL (`UPDATE ... WHERE ...`, `DELETE ... WHERE NOT EXISTS (...)`, `INSERT INTO ... SELECT ...`).
2. **`PreparedStatement` fora del bucle:** mai creïs un `Statement` ni un `PreparedStatement` **dins** d'un `while` o `for`. Prepara el `PreparedStatement` una sola vegada abans del bucle i fes només `setXXX(...)` + `execute...()` a dins.
3. **Aprofitar el DDL i capturar `SQLException`:** no comprovis manualment amb `SELECT` o `if` en Java si una fila té fills, duplicats o supera un `CHECK` que ja és a la taula. Executa l'operació directa i captura `"23503"`, `"23505"`, `"23502"` o `"23514"` al `catch`.
4. **Consultes SQL netes:** no posis `DISTINCT` sobre claus primàries/candidates, no demanis columnes innecessàries ni filtris en Java amb `if` allò que pot anar al `WHERE`.
5. **Transaccions i tancament segur:** crida `c.rollback()` al `catch` (o si es detecta un error lògic), `c.commit()` al final si tot és correcte, i tanca tots els `ResultSet`, `Statement`/`PreparedStatement` i `Connection` (`.close()`).
