---
title: "Tema 3: Components Lògics"
description: "Esquemes, dominis, assercions, vistes i permisos."
readTime: "8 min"
order: 3
draft: false
---

Aquest tema completa els components lògics de gestió, estructuració i control d'accés d'una base de dades segons l'estàndard SQL.

---

## 3.1. Esquemes, Catàlegs i Servidor

L'SGBD organitza els recursos en una jerarquia de tres nivells administratius:

:::dbhierarchyviz
:::

```sql
-- Creació d'un esquema associat a un propietari
CREATE SCHEMA nom_esquema [AUTHORIZATION usuari];

-- Esborrat d'un esquema
DROP SCHEMA nom_esquema RESTRICT; -- Només si està buit (per defecte)
DROP SCHEMA nom_esquema CASCADE;  -- Esborra l'esquema i tots els seus objectes
```

---

## 3.2. Connexions, Sessions i Transaccions

Una **connexió** és l'associació activa entre el client i el servidor de BD. Una **sessió** és el context d'execució d'un usuari durant aquella connexió. Una **transacció** és una unitat atòmica d'operacions SQL: o s'executen totes o cap.

:::sessionviz
:::

```sql
CONNECT TO nom_servidor [AS nom_connexio] [USER usuari];
SET SCHEMA nom_esquema;
DISCONNECT nom_connexio | DEFAULT | CURRENT | ALL;
```

Per al control de transaccions:

```sql
START TRANSACTION READ WRITE; -- o READ ONLY

-- Nivells d'aïllament estàndard:
-- READ UNCOMMITTED | READ COMMITTED | REPEATABLE READ | SERIALIZABLE
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;

COMMIT;   -- Confirma i fa permanents els canvis
ROLLBACK; -- Desfà tots els canvis de la transacció
```

---

## 3.3. Dominis (`CREATE DOMAIN`)

Un domini és un **tipus de dades personalitzat** amb regles de validació pròpies que es pot reutilitzar en múltiples columnes. En lloc de repetir el `CHECK` a cada columna, es defineix una vegada i s'usa com a tipus:

```sql
CREATE DOMAIN nom_domini AS tipus_dades
    [DEFAULT valor]
    [CONSTRAINT nom_restr CHECK (condicio)];

-- Exemple:
CREATE DOMAIN ciutat AS CHAR(15)
    DEFAULT 'BCN'
    CONSTRAINT ciutats_valides CHECK (VALUE IN ('BCN', 'MAD', 'VAL'));

-- Ús a la definició de taules:
CREATE TABLE empleats (
    nemp         INTEGER PRIMARY KEY,
    ciutat_naix  ciutat,
    ciutat_treb  ciutat
);
```

:::domainviz
:::

---

## 3.4. Assercions (`CREATE ASSERTION`)

Una asserció és una **restricció d'integritat global** de l'estàndard SQL que s'avalua davant qualsevol modificació de qualsevol taula implicada.

### Àmbit d'aplicació de restriccions

Una restricció de **columna** (`CHECK`) avalua només el valor del propi camp (`CHECK (sou > 0)`). Una restricció de **taula** (`CHECK`) compara columnes de la mateixa fila (`CHECK (data_fi >= data_ini)`) i s'ignora si la taula està buida. Una **asserció** (`ASSERTION`) és obligatòria quan la condició involucra múltiples files, funcions d'agregació o múltiples taules.

```sql
CREATE ASSERTION nom_assercio CHECK (
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

## 3.5. Vistes (`CREATE VIEW`)

Una vista és una **taula virtual** definida per una consulta SQL. No emmagatzema dades a disc (només la definició al catàleg); es computa en temps real en consultar-la.

```sql
CREATE VIEW nom_vista [(col1, col2, ...)] AS
consulta_select
[WITH CHECK OPTION];
```
**Exemple:**
```sql
CREATE VIEW empleats_altsous AS
SELECT num_empl, nom_empl, sou, num_dpt
FROM empleats
WHERE sou >= 200000;

-- Es consulta exactament com una taula ordinària:
SELECT * FROM empleats_altsous WHERE num_dpt = 2;
```

:::viewviz
:::

### Actualitzabilitat de Vistes (SQL Estàndard)

Una vista admet `INSERT`, `UPDATE` o `DELETE` només si l'operació es trasllada de forma unívoca a la taula base. Segons l'estàndard, ha d'estar definida sobre **una única taula base** (sense `JOIN`, `UNION` ni subconsultes al `FROM`), **sense funcions d'agregació** ni `DISTINCT`, `GROUP BY` o `HAVING`, i amb **columnes simples** al `SELECT` (sense expressions aritmètiques ni constants). Per acceptar `INSERT`, la vista ha d'incloure a més totes les columnes `NOT NULL` sense `DEFAULT` de la taula subjacent.

### Incompatibilitat d'actualització en vistes amb `JOIN`

Combinar dues taules $A$ i $B$ per clau forana genera ambigüitats que impedeixen l'actualització: en `DELETE` no es pot determinar si cal esborrar la fila d'$A$, la de $B$ o totes dues; en `UPDATE` modificar atributs d'$A$ pot alterar files relacionades de $B$ alienes a la vista; i en `INSERT` és impossible determinar quins valors assignar als atributs obligatoris de les taules base no inclosos a la vista.

:::viewupdviz
:::

### Clàusula `WITH CHECK OPTION`

Impedeix que un `INSERT` o `UPDATE` a través de la vista generi tuples que no compleixin el seu `WHERE`:

```sql
CREATE VIEW empleats_dep2 AS
SELECT * FROM empleats
WHERE num_dpt = 2
WITH CHECK OPTION;

-- Falla (error de violació de CHECK OPTION):
UPDATE empleats_dep2 SET num_dpt = 3 WHERE num_empl = 5;
```

Sense aquesta clàusula, l'operació s'executa a la taula base, però la fila modificada **desapareix silenciosament de la vista**. En vistes aniuades (`CASCADED`), si $V_2$ es defineix sobre $V_1$ (que té `WITH CHECK OPTION`), qualsevol modificació a $V_2$ ha de complir tant el filtre de $V_1$ com el de $V_2$.

### Cost físic: Taules vs. Vistes

Una **vista virtual** ocupa zero pàgines de dades a disc; cada consulta obliga l'SGBD a llegir físicament totes les tuples de les taules base per recalcular el resultat. Una **taula base** o materialitzada sí ocupa espai físic, però les consultes llegeixen únicament les seves pròpies tuples, reduint les operacions d'E/S en consultes sobre agregacions o filtres.

---

## 3.6. Esquema d'Informació

Conjunt estàndard de **vistes de només lectura** amb les metadades dels objectes del catàleg:

| Vista | Contingut |
| :--- | :--- |
| `SCHEMATA` | Llista de tots els esquemes del catàleg. |
| `TABLES` | Noms i tipus de totes les taules i vistes existents. |
| `COLUMNS` | Noms, tipus de dades i configuració de cada columna. |
| `VIEWS` | Sentències SQL de definició de les vistes. |
| `DOMAINS` | Dominis definits per l'usuari i les seves restriccions. |
| `TABLE_CONSTRAINTS` | Claus primàries, foranes i restriccions `CHECK`. |

---

## 3.7. Control d'accés: Privilegis i Rols

L'SGBD regula l'accés a objectes mitjançant **privilegis**. Els privilegis de dades sobre taules i vistes són `SELECT`, `INSERT`, `UPDATE[(col1, ...)]` i `DELETE`. Els privilegis estructurals i d'execució inclouen `REFERENCES[(col1, ...)]` (crear claus foranes cap a la taula), `USAGE` (usar dominis) i `ALL`.

```sql
-- Atorgar permisos amb dret de delegació a tercers:
GRANT SELECT, UPDATE(sou) ON empleats TO anna;
GRANT SELECT(nom_empl) ON empleats TO anna WITH GRANT OPTION;

-- Revocació de permisos:
REVOKE SELECT ON empleats FROM anna CASCADE;  -- Revoca en cadena als usuaris delegats per Anna
REVOKE SELECT ON empleats FROM anna RESTRICT; -- Falla si hi ha privilegis dependents delegats
```

### Diagrama d'Autoritzacions

Representació en graf dirigit on els nodes són usuaris i les arestes són concessions de privilegis:

:::dacviz
:::

### Regles de resolució de privilegis

1. **Camins alternatius a `REVOKE CASCADE`**: En eliminar una aresta, es recalculen els camins des del propietari. Si un usuari descendent manté un altre camí independent vàlid, conserva el privilegi.
2. **Revocar només la delegació**: `REVOKE GRANT OPTION FOR SELECT ON taula FROM usuari CASCADE` retira el dret a delegar sense retirar el permís de consulta propi.
3. **Requisit de `SELECT` per a `UPDATE` i `DELETE`**: Per executar una modificació amb filtre `WHERE col = valor`, cal tenir el permís de modificació i obligatòriament `SELECT` sobre `col`.
4. **Comprovació a `INSERT ... SELECT`**: Executar `INSERT INTO T1 SELECT colA FROM T2 WHERE colB = 1` requereix `INSERT` sobre `T1`, `SELECT` sobre `T2(colA)` i `SELECT` sobre `T2(colB)` (columna utilitzada al filtre).
5. **Vistes de menor privilegi**: Per limitar l'accés a determinades files o columnes, es crea una vista amb el filtre exacte i `WITH CHECK OPTION`, concedint el permís mínim estrictament sobre la vista.

### Rols

Agrupació de privilegis per simplificar la gestió d'usuaris amb les mateixes funcions:

```sql
CREATE ROLE lector;
GRANT SELECT ON empleats, departaments TO lector;

GRANT lector TO marc, laia; -- Assignació del rol
SET ROLE lector;            -- Activació a la sessió de l'usuari
```

```sql
CREATE VIEW el_meu_sou AS
SELECT num_empl, sou FROM empleats WHERE nom_empl = CURRENT_USER;

GRANT SELECT ON el_meu_sou TO PUBLIC;
```

---

## 3.8. Protecció de dades (RGPD / LOPD-GDD)

- **Consentiment**: Ha de ser **inequívoc i explícit** (prohibida l'acceptació tàcita o caselles premarcades).
- **Drets dels ciutadans**: Accés, rectificació, oposició, portabilitat i supressió (**dret a l'oblit**).
- **Dades d'especial protecció**: Salut, biometria, genètica, religió, ideologia, vida sexual.
- **Supervisió i sancions**: Supervisat pel **DPO** (Delegat de Protecció de Dades). Multes de fins a **20 M€** o el **4% de la facturació anual global**.

