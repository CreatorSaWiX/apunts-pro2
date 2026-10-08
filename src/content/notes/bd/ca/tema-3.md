---
title: "Tema 3: Components Lògics"
description: "Esquemes, dominis, assercions, vistes (WITH CHECK OPTION), diccionari de dades, control d'accés (GRANT/REVOKE), rols i protecció de dades (RGPD)."
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

### Sentències de definició d'esquema:
```sql
-- Creació d'un esquema associat a un propietari
CREATE SCHEMA nom_esquema [AUTHORIZATION usuari];

-- Esborrat d'un esquema
DROP SCHEMA nom_esquema RESTRICT; -- Només si està buit (per defecte)
DROP SCHEMA nom_esquema CASCADE;  -- Esborra l'esquema i tots els seus objectes
```

---

## 3.2. Connexions, Sessions i Transaccions

* **Connexió:** Associació activa entre el client i el servidor de BD.
* **Sessió:** Context d'execució d'un usuari durant una connexió.
* **Transacció:** Unitat atòmica d'operacions SQL.

### Gestió de connexió i context:
```sql
CONNECT TO nom_servidor [AS nom_connexio] [USER usuari];
SET SCHEMA nom_esquema;
DISCONNECT nom_connexio | DEFAULT | CURRENT | ALL;
```

### Control de transaccions:
```sql
-- Definició de característiques de la transacció
START TRANSACTION READ WRITE; -- o READ ONLY

-- Nivells d'aïllament estàndard:
-- READ UNCOMMITTED | READ COMMITTED | REPEATABLE READ | SERIALIZABLE
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;

COMMIT;   -- Confirma i fa permanents els canvis
ROLLBACK; -- Desfà tots els canvis de la transacció
```

---

## 3.3. Dominis (`CREATE DOMAIN`)

Un domini és un **tipus de dades personalitzat** amb regles de validació pròpies que es pot reutilitzar en múltiples columnes:

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

Les assercions són **restriccions d'integritat globals** que involucren múltiples taules o múltiples files i que no es poden expressar com a restricció d'una sola taula:

* **Diferència clau amb `CHECK` de taula:** El `CHECK` d'una taula només es comprova quan s'actualitza aquesta taula (mai si la taula està buida). Una `ASSERTION` **es comprova sempre** davant de qualsevol modificació de qualsevol de les taules implicades.

```sql [Sintaxi general]
CREATE ASSERTION nom_assercio CHECK (condicio);
```

### Exemple clau d'examen:
Assegurar que cap empleat resideixi en una ciutat diferent a la del seu departament:

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

### Exemple de creació i consulta:
```sql
CREATE VIEW empleats_altsous AS
SELECT num_empl, nom_empl, sou, num_dpt
FROM empleats
WHERE sou >= 200000;

-- La vista es consulta exactament com una taula ordinària:
SELECT * FROM empleats_altsous WHERE num_dpt = 2;
```

### Actualització de dades a través de vistes
Una vista només admet `INSERT`, `UPDATE` o `DELETE` si l'SGBD pot traslladar l'operació **de manera unívoca i sense ambigüitats** a la taula base subjacent:

* **Requisits per ser actualitzable:**
  1. Definida sobre **una única taula** (sense joins).
  2. Sense funcions d'agregació (`COUNT`, `SUM`, `AVG`...).
  3. Sense clàusules `DISTINCT` ni `GROUP BY`.
  4. Per admetre `INSERT`, ha d'incloure totes les columnes `NOT NULL` de la taula base que no tinguin valor `DEFAULT`.

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

Sense `WITH CHECK OPTION`, la fila canviaria al departament 3 i desapareixeria de la vista sense error.

---

## 3.6. Esquema d'Informació (*Information Schema*)

És un conjunt estàndard de **vistes de només lectura** que descriu totes les metadades dels objectes definits a la base de dades:

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

L'SGBD regula qui pot executar quina operació sobre quin objecte mitjançant el concepte de **privilegi**.

### Tipus de privilegis estàndard
* **Sobre dades (taules i vistes):** `SELECT`, `INSERT`, `UPDATE`, `DELETE` (poden aplicar-se a tota la taula o a una llista de columnes com `UPDATE(sou)`).
* **Estructurals i de codi:** `REFERENCES` (dret a referenciar com a FK), `USAGE` (usar dominis), `EXECUTE` (executar codi), `ALL` (tots els privilegis).

### Atorgament (`GRANT`) i Revocació (`REVOKE`)
```sql
-- Atorgar privilegis
GRANT SELECT, UPDATE(sou) ON empleats TO anna;

-- Permetre a Anna concedir aquest privilegi a altres usuaris:
GRANT SELECT(nom_empl) ON empleats TO anna WITH GRANT OPTION;

-- Revocació de privilegis
REVOKE SELECT ON empleats FROM anna CASCADE;
```

* **`CASCADE` a `REVOKE`:** Revoca també en cadena tots els privilegis que Anna hagi atorgat a tercers usuaris mitjançant `WITH GRANT OPTION`.
* **`RESTRICT` a `REVOKE`:** Falla l'operació si existeixen privilegis dependents atorgats a altres usuaris.

### Diagrama d'Autoritzacions (Graf DAC) i Regles d'Examen
Als exàmens és habitual demanar el graf d'autoritzacions i analitzar l'efecte de sentències `REVOKE`:

* **Estructura del Graf:**
  * **Nodes:** Els usuaris del sistema. L'arrel és el **propietari** de la taula (qui té tots els privilegis per defecte).
  * **Arestes dirigides ($A \rightarrow B$):** Indiquen que l'usuari $A$ ha atorgat un privilegi a $B$.
  * **Etiqueta de l'aresta:** El tipus de privilegi (ex: `SELECT`, `UPDATE`). Si inclou `WITH GRANT OPTION`, s'afegeix un asterisc o marca `*` (ex: $\text{SELECT}^*$).

```text
[Propietari] ─── SELECT*, UPDATE* ───> [Usuari A] ─── SELECT ───> [Usuari B]
     │                                                              ▲
     └───────────────────────── SELECT ─────────────────────────────┘
```

#### 📌 Regles d'or per als exàmens:
1. **Camins alternatius en `REVOKE CASCADE`:** Quan un usuari revoca un permís amb `CASCADE`, s'elimina la seva aresta i es recalculen els camins des del propietari. Si un usuari descendent **encara manté un camí alternatiu vàlid connectat amb el propietari**, aquest usuari **CONSERVA el privilegi**.
2. **Revocar només la delegació:** `REVOKE GRANT OPTION FOR SELECT ON taula FROM usuari CASCADE` retira el dret a delegar (elimina l'asterisc `*` de les seves arestes d'origen i revoca els descendents que només depenien d'aquesta delegació), però l'usuari manté el permís de consulta per a ell mateix.
3. **El requisit de `SELECT` per a `UPDATE`:** Per executar un `UPDATE` amb condició (ex: `UPDATE t SET sou = 1000 WHERE sou < 1000`), no n'hi ha prou amb tenir privilegi `UPDATE`: cal tenir **obligatòriament privilegi `SELECT`** sobre les columnes que formen la condició del `WHERE`! Si no el té, la sentència és rebutjada per falta de privilegis.


### Rols (`ROLE`)
Un rol és una **agrupació de privilegis** que es pot assignar a múltiples usuaris com a classe:

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

### Privilegis combinats amb Vistes
Les vistes són el mecanisme principal per aplicar **seguretat a nivell de fila o columna sense alterar la taula base**:
```sql
-- Crear una vista amb el sou del propi usuari
CREATE VIEW el_meu_sou AS
SELECT num_empl, sou FROM empleats WHERE nom_empl = CURRENT_USER;

-- Donar accés només a la vista:
GRANT SELECT ON el_meu_sou TO public;
```

---

## 3.8. Protecció de dades (RGPD / GDPR)

Normativa europea (Reglament UE 2016/679) i Llei Orgànica 3/2018 (LOPD-GDD) relativa al tractament de dades personals:

* **Consentiment:** Ha de ser **inequívoc i explícit**; es prohibeix completament l'acceptació tàcita o premarcada.
* **Drets dels ciutadans:** Dret d'accés, rectificació, supressió (**dret a l'oblit**), oposició i portabilitat de dades.
* **Dades d'especial protecció:** Dades biomètriques, genètiques, de salut, religió, ideologia i vida sexual.
* **Figures clau:** Delegat de Protecció de Dades (**DPO** / DPD) responsable de supervisar el compliment.
* **Règim sancionador:** Multes de fins a **20 milions d'euros** o el **4% de la facturació anual global** de l'empresa.
