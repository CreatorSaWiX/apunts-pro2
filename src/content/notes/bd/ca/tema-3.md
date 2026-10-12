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

```text
Servidor (Cluster)
└── Catàleg (Grup d'esquemes + Information Schema)
    └── Esquema (Unitat d'agrupació de taules, vistes, dominis, etc.)
```

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

```sql [Sintaxi i exemple de domini]
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

---

## 3.4. Assercions (`CREATE ASSERTION`)

Les assercions són **restriccions d'integritat globals** que involucren múltiples taules o múltiples files i que no es poden expressar com a restricció d'una sola taula. A diferència del `CHECK` d'una taula (que només es comprova quan s'actualitza aquella taula i mai si la taula és buida), una asserció **es comprova sempre** davant de qualsevol modificació de qualsevol de les taules implicades.

```sql [Sintaxi general]
CREATE ASSERTION nom_assercio CHECK (condicio);
```

Exemple: assegurar que cap empleat resideixi en una ciutat diferent a la del seu departament:

```sql [Asserció multitaula]
CREATE ASSERTION ciutat_emp_dept CHECK (
    NOT EXISTS (
        SELECT *
        FROM empleats e, departaments d
        WHERE e.num_dpt = d.num_dpt 
          AND e.ciutat_empl <> d.ciutat_dpt
    )
);
```

---

## 3.5. Vistes (`CREATE VIEW`)

Una vista és una **taula virtual derivada** definida a partir d'una consulta SQL. La seva extensió (files) no s'emmagatzema físicament a disc; es computa en temps real quan es consulta.

```sql [Sintaxi general]
CREATE VIEW nom_vista [(col1, col2...)] AS
consulta_select
[WITH CHECK OPTION];
```

```sql
CREATE VIEW empleats_altsous AS
SELECT num_empl, nom_empl, sou, num_dpt
FROM empleats
WHERE sou >= 200000;

-- La vista es consulta exactament com una taula ordinària:
SELECT * FROM empleats_altsous WHERE num_dpt = 2;
```

### Quan és actualitzable una vista?

Una vista només admet `INSERT`, `UPDATE` o `DELETE` si l'SGBD pot traslladar l'operació de manera unívoca a la taula base. Els requisits per ser actualitzable selon l'estàndard SQL: definida sobre **una única taula bàsica** (cap `JOIN`, cap `UNION`), sense funcions d'agregació ni `DISTINCT` ni `GROUP BY` ni `HAVING`, amb atributs simples al `SELECT` (sense expressions aritmètiques), i per admetre `INSERT` la vista ha d'incloure totes les columnes `NOT NULL` sense `DEFAULT`.

#### Per què una vista amb `JOIN` NO és actualitzable?

Aquesta és una pregunta teòrica clàssica d'examen. Si una vista combina dues taules $A$ i $B$ vinculades per clau forana, l'ambigüitat sorgeix en les tres operacions: en `DELETE` no queda clar si s'esborra la fila d'$A$, la de $B$ o totes dues; en `UPDATE` modificar un atribut d'$A$ pot propagar canvis a altres files de $B$ alienes a la vista; en `INSERT` no hi ha manera de determinar quins valors assignar a les columnes obligatòries de les taules base que no apareixen al `SELECT` de la vista. Com que no hi ha una única traducció semàntica coherent, l'estàndard **prohibeix actualitzar vistes amb múltiples taules**.

### Clàusula `WITH CHECK OPTION`

Garanteix que qualsevol fila inserida o modificada a través de la vista **continuï complint la condició `WHERE`** de la vista:

```sql [Exemple WITH CHECK OPTION]
CREATE VIEW empleats_dep2 AS
SELECT * FROM empleats
WHERE num_dpt = 2
WITH CHECK OPTION;

-- Això fallarà amb error de violació de CHECK OPTION:
UPDATE empleats_dep2 SET num_dpt = 3 WHERE num_empl = 5;
```

Sense `WITH CHECK OPTION`, la sentència s'executa amb èxit, la fila canvia al departament 3 i **desapareix silenciosament** de la vista sense que l'usuari rebi cap advertència. Si la vista base $V_1$ té `WITH CHECK OPTION` i definim $V_2$ sobre $V_1$ sense clàusula, per defecte s'aplica `CASCADED`: qualsevol inserció a $V_2$ que violi el filtre de $V_1$ serà igualment rebutjada.

:::viewviz
:::

### Cost Físic i Emmagatzematge (Taules vs. Vistes)

Una **taula base** té fitxers físics a disc. Una **vista virtual** no ocupa espai de dades a disc (només la sentència de definició guardada al catàleg); cada cop que s'executa un `SELECT` sobre la vista, l'SGBD llegeix físicament totes les tuples de les taules base. Per exemple: si tenim una taula `Edicions` amb 1.000 files i creem una taula `T` amb el resultat del `GROUP BY` (100 files), consultar `T` llegeix com a màxim 100 files. Consultar la vista equivalent `V` sobre `Edicions` obliga el motor a llegir les 1.000 files del disc per calcular el `GROUP BY` en memòria.

---

## 3.6. Esquema d'Informació

És un conjunt estàndard de **vistes de només lectura** que descriu totes les metadades dels objectes de la base de dades:

| Vista | Contingut |
| :--- | :--- |
| `SCHEMATA` | Llista de tots els esquemes del catàleg. |
| `TABLES` | Noms i tipus de totes les taules i vistes existents. |
| `COLUMNS` | Noms, tipus de dades i configuració de cada columna. |
| `VIEWS` | Sentències SQL de definició de les vistes. |
| `DOMAINS` | Dominis d'usuari i les seves restriccions. |
| `TABLE_CONSTRAINTS` | Claus primàries, foranes i restriccions `CHECK`. |

---

## 3.7. Control d'accés: Privilegis i Rols

L'SGBD regula qui pot executar quina operació sobre quin objecte mitjançant el concepte de **privilegi**. Els privilegis sobre dades (taules i vistes) són `SELECT`, `INSERT`, `UPDATE`, `DELETE` (poden aplicar-se a tota la taula o a una llista de columnes com `UPDATE(sou)`). Els privilegis estructurals inclouen `REFERENCES` (dret a referenciar com a FK), `USAGE` (usar dominis), `EXECUTE` (executar codi) i `ALL` (tots els privilegis).

```sql
-- Atorgar privilegis
GRANT SELECT, UPDATE(sou) ON empleats TO anna;

-- Permetre a Anna concedir aquest privilegi a altres usuaris:
GRANT SELECT(nom_empl) ON empleats TO anna WITH GRANT OPTION;

-- Revocació de privilegis
REVOKE SELECT ON empleats FROM anna CASCADE;
```

`CASCADE` a `REVOKE` revoca també en cadena tots els privilegis que Anna hagi atorgat a tercers. `RESTRICT` fa fallar l'operació si existeixen privilegis dependents atorgats a altres usuaris.

### Diagrama d'Autoritzacions i Regles d'Examen

Als exàmens és habitual demanar el graf d'autoritzacions (on els nodes són els usuaris i les arestes indiquen qui ha atorgat un privilegi a qui) i analitzar l'efecte de sentències `REVOKE`. Les regles clau:

1. **Camins alternatius en `REVOKE CASCADE`:** Quan un usuari revoca un permís, s'elimina la seva aresta i es recalculen els camins des del propietari. Si un usuari descendent **encara manté un camí alternatiu vàlid**, **conserva el privilegi**.
2. **Revocar només la delegació:** `REVOKE GRANT OPTION FOR SELECT ON taula FROM usuari CASCADE` retira el dret a delegar però l'usuari manté el permís de consulta per a ell mateix.
3. **El requisit de `SELECT` per a `UPDATE` / `DELETE`:** Per executar un `UPDATE` amb condició (ex: `WHERE sou < 1000`), no n'hi ha prou amb tenir `UPDATE`: cal tenir **obligatòriament `SELECT`** sobre les columnes del `WHERE`. Si no el té, la sentència és rebutjada.
4. **Comprovació en `INSERT ... SELECT`:** Per executar `INSERT INTO taulaDesti SELECT c1, c2 FROM taulaOrigen WHERE c3 = 'BCN'` cal tenir: `INSERT` sobre `taulaDesti`, `SELECT` sobre les columnes projectades `c1, c2` **i també** sobre la columna `c3` usada al `WHERE`. Si falta qualsevol d'aquests permisos de lectura, l'execució és avortada.
5. **Disseny de Vistes per a Privilegis Mínims:** Quan l'enunciat exigeix donar accés restringit a un usuari, es crea una vista amb el filtre exacte del `WHERE` i s'hi afegeix **`WITH CHECK OPTION`** (per impedir crear o moure files fora de l'àmbit permès). Després es concedeixen `SELECT`, `INSERT` i `UPDATE` restringit a la columna permesa sobre la vista, mai sobre la taula base.

```text
[Propietari] ─── SELECT*, UPDATE* ───> [Usuari A] ─── SELECT ───> [Usuari B]
     │                                                              ▲
     └───────────────────────── SELECT ─────────────────────────────┘
```

:::dacviz
:::

### Rols

Un rol és una **agrupació de privilegis** que es pot assignar a múltiples usuaris:

```sql [Gestió de rols]
-- Com a administrador (DBA):
CREATE ROLE lector;
GRANT SELECT ON empleats TO lector;
GRANT SELECT ON departaments TO lector;

-- Assignar el rol als usuaris:
GRANT lector TO marc, laia;

-- L'usuari activa el seu rol a la sessió:
SET ROLE lector;
```

Les vistes són el mecanisme principal per aplicar **seguretat a nivell de fila o columna** sense alterar la taula base:

```sql
-- Crear una vista amb el sou del propi usuari
CREATE VIEW el_meu_sou AS
SELECT num_empl, sou FROM empleats WHERE nom_empl = CURRENT_USER;

-- Donar accés només a la vista:
GRANT SELECT ON el_meu_sou TO public;
```

---

## 3.8. Protecció de dades (RGPD / GDPR)

Normativa europea (Reglament UE 2016/679) i Llei Orgànica 3/2018 (LOPD-GDD) relativa al tractament de dades personals. El consentiment ha de ser **inequívoc i explícit**; es prohibeix completament l'acceptació tàcita o premarcada. Els ciutadans tenen dret d'accés, rectificació, supressió (**dret a l'oblit**), oposició i portabilitat de dades. Les dades d'especial protecció inclouen les biomètriques, genètiques, de salut, religió, ideologia i vida sexual. El **Delegat de Protecció de Dades (DPO)** és responsable de supervisar el compliment. Les multes poden arribar fins a **20 milions d'euros** o el **4% de la facturació anual global** de l'empresa.
