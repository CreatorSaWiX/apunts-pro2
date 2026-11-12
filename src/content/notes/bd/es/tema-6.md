---
title: "Tema 6: Programación con SQL (JDBC)"
description: "SQL dinámico con JDBC, conexión y autocommit, Statement vs PreparedStatement, ResultSet y gestión de NULLs (wasNull), SQLException (SQLState) y criterios de calidad de examen."
readTime: "9 min"
order: 10
draft: true
isNew: true
---

**JDBC** (*Java Database Connectivity*) es la API estándar de Java para conectarse a un SGBD relacional y ejecutar SQL dinámico mediante llamadas a métodos.

---

## 6.1. SQL estático vs. dinámico y drivers *(introductorio)*

| Enfoque | ¿Cómo funciona? | Portabilidad / Eficiencia |
| :--- | :--- | :--- |
| **SQL estático (`SQLJ`)** | Sentencias fijas incrustadas; se precompilan y validan antes de ejecutar. | Poco portable (hay que recompilar), más eficiente y menos código. |
| **SQL dinámico (`JDBC`)** | Sentencias como `String` construidas y compiladas en tiempo de ejecución. | Portable entre SGBD, permite decidir consultas dinámicamente. |

La API JDBC es independiente del fabricante; cada SGBD proporciona un **driver** que la implementa:
- **Tipo 1:** Puente JDBC–ODBC.
- **Tipo 2:** Driver JDBC + librería nativa del fabricante.
- **Tipo 3:** Driver genérico vía protocolo de red hacia un servidor intermedio JDBC.
- **Tipo 4:** Driver Java puro directo contra el SGBD *(el más habitual)*.

:::jdbcviz
:::

---

## 6.2. Conexión, `autocommit` y cierre

```java
import java.sql.*;
import java.util.Properties;

Properties props = new Properties();
props.setProperty("user", "usuario");
props.setProperty("password", "contraseña");

Connection c = DriverManager.getConnection("jdbc:postgresql://host:port/bd", props);
c.setAutoCommit(false); // ¡Obligatorio en laboratorio y exámenes!

// ... consultas y modificaciones ...

c.commit();    // Confirma la transacción (o c.rollback() para deshacerla)
c.close();     // Cierra la conexión
```

**Cuidado en examen:** en los enunciados ya te dan la conexión `c` abierta con `autocommit = false`. Hay que hacer `c.commit()` al final si todo ha ido bien, y `c.rollback()` cuando falla alguna regla o salta una excepción.

:::jdbcconnviz
:::

---

## 6.3. `Statement` vs. `PreparedStatement`

| Característica | `Statement` | `PreparedStatement` |
| :--- | :--- | :--- |
| **Compilación SQL** | Se compila **cada vez** que se ejecuta. | Se compila **una sola vez** (reutilizable y seguro). |
| **Creación** | `Statement st = c.createStatement();` | `PreparedStatement ps = c.prepareStatement(sql);` |
| **Consultas (`SELECT`)** | `ResultSet rs = st.executeQuery(sql);` | `ResultSet rs = ps.executeQuery();` |
| **Modificaciones (`I/U/D`)** | `int n = st.executeUpdate(sql);` | `int n = ps.executeUpdate();` |

- `executeQuery(...)` devuelve un `ResultSet` con las filas.
- `executeUpdate(...)` devuelve un `int` con el **número de filas afectadas** (`0` si ninguna fila cumple el `WHERE`).
- En `PreparedStatement`, los parámetros `?` se asignan indexando desde **`1`**: `ps.setString(1, val)`, `ps.setInt(2, val)`, `ps.setFloat(3, val)`, `ps.setNull(4, Types.INTEGER)`.

```java
// PreparedStatement preparado FUERA del bucle y reutilizado dentro
PreparedStatement ps = c.prepareStatement(
    "DELETE FROM tipus WHERE tipus = ?;"
);
ps.setString(1, "titelles");
int filas = ps.executeUpdate();
if (filas == 0) System.out.println("No existe");
ps.close();
```

**Regla de oro de cursores simultáneos:** cada instancia de `Statement` o `PreparedStatement` solo puede mantener **un único `ResultSet` abierto a la vez**. Si ejecutas otra consulta sobre el mismo `Statement` mientras aún recorres el primer `ResultSet`, este se cierra automáticamente. Hay que usar **objetos `Statement`/`PreparedStatement` diferentes** para consultas anidadas.

:::jdbcstmtviz
:::

---

## 6.4. Tratamiento de resultados (`ResultSet`) y valores `NULL`

Un `ResultSet` funciona como un cursor que inicialmente apunta **antes de la primera fila**. Hay que llamar siempre a `rs.next()` (devuelve `false` si no quedan filas) antes de leer columnas con `getXXX(nombreColumna)` o `getXXX(indiceDesde1)`.

### Detección de valores `NULL` *(trampa clásica)*

| Tipo de dato Java | ¿Cómo comprobar si el campo SQL era `NULL`? |
| :--- | :--- |
| **Clases (`String`, `Date`)** | Devuelve `null` directo: `if (nom == null)` |
| **Primitivos (`int`, `float`, `double`)** | ¡Un `NULL` SQL devuelve **`0`**! Hay que llamar a **`rs.wasNull()`** inmediatamente después del `getInt`/`getFloat`. |

```java
ResultSet rs = st.executeQuery("SELECT titol, preu FROM activitats;");
int cuantos = 0;
while (rs.next()) {
    cuantos++;
    String titol = rs.getString("titol");
    int preu = rs.getInt("preu");
    if (rs.wasNull()) {
        System.out.println(titol + " sin precio");
    }
}
if (cuantos == 0) System.out.println("Sin resultados");
rs.close();
```

:::resultsetviz
:::

---

## 6.5. Gestión de errores (`SQLException` y `SQLState`)

Los errores de conexión, ejecución SQL o cierre lanzan `SQLException`. Los métodos principales son `se.getSQLState()` (código de 5 caracteres) y `se.getMessage()`.

| `SQLState` (PostgreSQL) | Significado |
| :--- | :--- |
| **`"23502"`** | `not_null_violation` (valor `NULL` en columna `NOT NULL`) |
| **`"23503"`** | `foreign_key_violation` (clave foránea inexistente o borrado con hijos) |
| **`"23505"`** | `unique_violation` (duplicado de `PRIMARY KEY` o `UNIQUE`) |
| **`"23514"`** | `check_violation` (incumplimiento de una restricción `CHECK`) |

*(Otros códigos: `"00000"` éxito, `"01XXX"` aviso, `>"02XXX"` error grave, `"23XXX"` integridad, `"08XXX"` conexión).*

```java
try {
    Statement st = c.createStatement();
    int mod = st.executeUpdate(
        "UPDATE despatxos SET superficie = superficie + 5 WHERE modul = 'Omega';"
    );
    if (mod == 0) System.out.println("Ningún despacho modificado");
    st.close();
    c.commit();
    c.close();
} catch (SQLException se) {
    c.rollback(); // ¡Deshace todos los cambios de la transacción antes de salir!
    if (se.getSQLState().equals("23514")) {
        System.out.println("Error: algún despacho supera el límite permitido");
    } else {
        System.out.println("Excepción: " + se.getSQLState() + " - " + se.getMessage());
    }
}
```

:::sqlexceptionviz
:::

---

## 6.6. Criterios de calidad en JDBC (preguntas de examen)

En los finales se pide detectar y corregir código JDBC que incumple estos criterios:

1. **No hacer en Java lo que puede hacer una única sentencia SQL:** evita el patrón `SELECT` $\rightarrow$ `while (rs.next())` $\rightarrow$ `UPDATE`/`DELETE` fila por fila. Sustitúyelo por una sola sentencia SQL (`UPDATE ... WHERE ...`, `DELETE ... WHERE NOT EXISTS (...)`, `INSERT INTO ... SELECT ...`).
2. **`PreparedStatement` fuera del bucle:** nunca crees un `Statement` ni un `PreparedStatement` **dentro** de un `while` o `for`. Prepara el `PreparedStatement` una sola vez antes del bucle y haz solo `setXXX(...)` + `execute...()` dentro.
3. **Aprovechar el DDL y capturar `SQLException`:** no compruebes manualmente con `SELECT` o `if` en Java si una fila tiene hijos, duplicados o supera un `CHECK` que ya está en la tabla. Ejecuta la operación directa y captura `"23503"`, `"23505"`, `"23502"` o `"23514"` en el `catch`.
4. **Consultas SQL limpias:** no pongas `DISTINCT` sobre claves primarias/candidatas, no pidas columnas innecesarias ni filtres en Java con `if` aquello que puede ir en el `WHERE`.
5. **Transacciones y cierre seguro:** llama a `c.rollback()` en el `catch` (o si se detecta un error lógico), `c.commit()` al final si todo es correcto, y cierra todos los `ResultSet`, `Statement`/`PreparedStatement` y `Connection` (`.close()`).
