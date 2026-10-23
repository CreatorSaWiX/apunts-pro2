---
title: "Tema 3: Componentes Lógicos"
description: "Esquemas, dominios, aserciones, vistas y permisos."
readTime: "8 min"
order: 3
draft: false
---

Este tema completa los componentes lógicos de gestión, estructuración y control de acceso de una base de datos según el estándar SQL.

---

## 3.1. Esquemas, Catálogos y Servidor

El SGBD organiza los recursos en una jerarquía de tres niveles administrativos:

:::dbhierarchyviz
:::

```sql
-- Creación de un esquema asociado a un propietario
CREATE SCHEMA nombre_esquema [AUTHORIZATION usuario];

-- Borrado de un esquema
DROP SCHEMA nombre_esquema RESTRICT; -- Solo si está vacío (por defecto)
DROP SCHEMA nombre_esquema CASCADE;  -- Borra el esquema y todos sus objetos
```

---

## 3.2. Conexiones, Sesiones y Transacciones

Una **conexión** es la asociación activa entre el cliente y el servidor de BD. Una **sesión** es el contexto de ejecución de un usuario durante esa conexión. Una **transacción** es una unidad atómica de operaciones SQL: o se ejecutan todas o ninguna.

:::sessionviz
:::

```sql
CONNECT TO nombre_servidor [AS nombre_conexion] [USER usuario];
SET SCHEMA nombre_esquema;
DISCONNECT nombre_conexion | DEFAULT | CURRENT | ALL;
```

Para el control de transacciones:

```sql
START TRANSACTION READ WRITE; -- o READ ONLY

-- Niveles de aislamiento estándar:
-- READ UNCOMMITTED | READ COMMITTED | REPEATABLE READ | SERIALIZABLE
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;

COMMIT;   -- Confirma y hace permanentes los cambios
ROLLBACK; -- Deshace todos los cambios de la transacción
```

---

## 3.3. Dominios (`CREATE DOMAIN`)

Un dominio es un **tipo de datos personalizado** con reglas de validación propias que se puede reutilizar en múltiples columnas. En lugar de repetir el `CHECK` en cada columna, se define una vez y se usa como tipo:

```sql
CREATE DOMAIN nombre_dominio AS tipo_datos
    [DEFAULT valor]
    [CONSTRAINT nombre_restr CHECK (condicion)];

-- Ejemplo:
CREATE DOMAIN ciudad AS CHAR(15)
    DEFAULT 'BCN'
    CONSTRAINT ciudades_validas CHECK (VALUE IN ('BCN', 'MAD', 'VAL'));

-- Uso en la definición de tablas:
CREATE TABLE empleats (
    nemp         INTEGER PRIMARY KEY,
    ciutat_naix  ciudad,
    ciutat_treb  ciudad
);
```

:::domainviz
:::

---

## 3.4. Aserciones (`CREATE ASSERTION`)

Una aserción es una **restricción de integridad global** del estándar SQL que se evalúa ante cualquier modificación de cualquier tabla implicada.

### Ámbito de aplicación de restricciones

Una restricción de **columna** (`CHECK`) evalúa solo el valor del propio campo (`CHECK (sou > 0)`). Una restricción de **tabla** (`CHECK`) compara columnas de la misma fila (`CHECK (data_fi >= data_ini)`) y se ignora si la tabla está vacía. Una **aserción** (`ASSERTION`) es obligatoria cuando la condición involucra múltiples filas, funciones de agregación o múltiples tablas.

```sql
CREATE ASSERTION nombre_asercion CHECK (
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

## 3.5. Vistas (`CREATE VIEW`)

Una vista es una **tabla virtual** definida por una consulta SQL. No almacena datos en disco (solo la definición en el catálogo); se computa en tiempo real al consultarla.

```sql
CREATE VIEW nombre_vista [(col1, col2, ...)] AS
consulta_select
[WITH CHECK OPTION];
```
**Ejemplo:**
```sql
CREATE VIEW empleats_altsous AS
SELECT num_empl, nom_empl, sou, num_dpt
FROM empleats
WHERE sou >= 200000;

-- Se consulta exactamente como una tabla ordinaria:
SELECT * FROM empleats_altsous WHERE num_dpt = 2;
```

:::viewviz
:::

### Actualizabilidad de Vistas (SQL Estándar)

Una vista admite `INSERT`, `UPDATE` o `DELETE` solo si la operación se traslada de forma unívoca a la tabla base. Según el estándar, debe estar definida sobre **una única tabla base** (sin `JOIN`, `UNION` ni subconsultas en el `FROM`), **sin funciones de agregación** ni `DISTINCT`, `GROUP BY` o `HAVING`, y con **columnas simples** en el `SELECT` (sin expresiones aritméticas ni constantes). Para aceptar `INSERT`, la vista debe incluir además todas las columnas `NOT NULL` sin `DEFAULT` de la tabla subyacente.

### Incompatibilidad de actualización en vistas con `JOIN`

Combinar dos tablas $A$ y $B$ por clave foránea genera ambigüedades que impiden la actualización: en `DELETE` no se puede determinar si hay que borrar la fila de $A$, la de $B$ o ambas; en `UPDATE` modificar atributos de $A$ puede alterar filas relacionadas de $B$ ajenas a la vista; y en `INSERT` es imposible determinar qué valores asignar a los atributos obligatorios de las tablas base no incluidos en la vista.

:::viewupdviz
:::

### Cláusula `WITH CHECK OPTION`

Impide que un `INSERT` o `UPDATE` a través de la vista genere tuplas que no cumplan su `WHERE`:

```sql
CREATE VIEW empleats_dep2 AS
SELECT * FROM empleats
WHERE num_dpt = 2
WITH CHECK OPTION;

-- Falla (error de violación de CHECK OPTION):
UPDATE empleats_dep2 SET num_dpt = 3 WHERE num_empl = 5;
```

Sin esta cláusula, la operación se ejecuta en la tabla base, pero la fila modificada **desaparece silenciosamente de la vista**. En vistas anidadas (`CASCADED`), si $V_2$ se define sobre $V_1$ (que tiene `WITH CHECK OPTION`), cualquier modificación en $V_2$ debe cumplir tanto el filtro de $V_1$ como el de $V_2$.

### Coste físico: Tablas vs. Vistas

Una **vista virtual** ocupa cero páginas de datos en disco; cada consulta obliga al SGBD a leer físicamente todas las tuplas de las tablas base para recalcular el resultado. Una **tabla base** o materializada sí ocupa espacio físico, pero las consultas leen únicamente sus propias tuplas, reduciendo las operaciones de E/S en consultas sobre agregaciones o filtros.

---

## 3.6. Esquema de Información

Conjunto estándar de **vistas de solo lectura** con los metadatos de los objetos del catálogo:

| Vista | Contenido |
| :--- | :--- |
| `SCHEMATA` | Lista de todos los esquemas del catálogo. |
| `TABLES` | Nombres y tipos de todas las tablas y vistas existentes. |
| `COLUMNS` | Nombres, tipos de datos y configuración de cada columna. |
| `VIEWS` | Sentencias SQL de definición de las vistas. |
| `DOMAINS` | Dominios definidos por el usuario y sus restricciones. |
| `TABLE_CONSTRAINTS` | Claves primarias, foráneas y restricciones `CHECK`. |

---

## 3.7. Control de acceso: Privilegios y Roles

El SGBD regula el acceso a objetos mediante **privilegios**. Los privilegios de datos sobre tablas y vistas son `SELECT`, `INSERT`, `UPDATE[(col1, ...)]` y `DELETE`. Los privilegios estructurales y de ejecución incluyen `REFERENCES[(col1, ...)]` (crear claves foráneas hacia la tabla), `USAGE` (usar dominios) y `ALL`.

```sql
-- Otorgar permisos con derecho de delegación a terceros:
GRANT SELECT, UPDATE(sou) ON empleats TO anna;
GRANT SELECT(nom_empl) ON empleats TO anna WITH GRANT OPTION;

-- Revocación de permisos:
REVOKE SELECT ON empleats FROM anna CASCADE;  -- Revoca en cadena a los usuarios delegados por Anna
REVOKE SELECT ON empleats FROM anna RESTRICT; -- Falla si hay privilegios dependientes delegados
```

### Diagrama de Autorizaciones

Representación en grafo dirigido donde los nodos son usuarios y las aristas son concesiones de privilegios:

:::dacviz
:::

### Reglas de resolución de privilegios

1. **Caminos alternativos en `REVOKE CASCADE`**: Al eliminar una arista, se recalculan los caminos desde el propietario. Si un usuario descendiente mantiene otro camino independiente válido, conserva el privilegio.
2. **Revocar solo la delegación**: `REVOKE GRANT OPTION FOR SELECT ON tabla FROM usuario CASCADE` retira el derecho a delegar sin retirar el permiso de consulta propio.
3. **Requisito de `SELECT` para `UPDATE` y `DELETE`**: Para ejecutar una modificación con filtro `WHERE col = valor`, hay que tener el permiso de modificación y obligatoriamente `SELECT` sobre `col`.
4. **Comprobación en `INSERT ... SELECT`**: Ejecutar `INSERT INTO T1 SELECT colA FROM T2 WHERE colB = 1` requiere `INSERT` sobre `T1`, `SELECT` sobre `T2(colA)` y `SELECT` sobre `T2(colB)` (columna utilizada en el filtro).
5. **Vistas de menor privilegio**: Para limitar el acceso a determinadas filas o columnas, se crea una vista con el filtro exacto y `WITH CHECK OPTION`, concediendo el permiso mínimo estrictamente sobre la vista.

### Roles

Agrupación de privilegios para simplificar la gestión de usuarios con las mismas funciones:

```sql
CREATE ROLE lector;
GRANT SELECT ON empleats, departaments TO lector;

GRANT lector TO marc, laia; -- Asignación del rol
SET ROLE lector;            -- Activación en la sesión del usuario
```

```sql
CREATE VIEW el_meu_sou AS
SELECT num_empl, sou FROM empleats WHERE nom_empl = CURRENT_USER;

GRANT SELECT ON el_meu_sou TO PUBLIC;
```

---

## 3.8. Protección de datos (RGPD / LOPD-GDD)

- **Consentimiento**: Debe ser **inequívoco y explícito** (prohibida la aceptación tácita o casillas premarcadas).
- **Derechos de los ciudadanos**: Acceso, rectificación, oposición, portabilidad y supresión (**derecho al olvido**).
- **Datos de especial protección**: Salud, biometría, genética, religión, ideología, vida sexual.
- **Supervisión y sanciones**: Supervisado por el **DPO** (Delegado de Protección de Datos). Multas de hasta **20 M€** o el **4% de la facturación anual global**.
