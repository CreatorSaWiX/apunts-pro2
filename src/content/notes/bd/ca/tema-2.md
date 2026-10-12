---
title: "Tema 2: DDL i DML"
description: "CREATE TABLE, restriccions d'integritat, accions compensatòries, i manipulació de dades."
readTime: "10 min"
order: 2
draft: false
---

Aquest tema recull la definició de l'estructura de la base de dades (**DDL**) i la manipulació de les dades que conté (**DML**).

---

## 2.1. Conceptes clau del Model Relacional

A l'examen només necessites tenir clars tres conceptes:

- **Taula (Relació):** Formada per **columnes** (atributs) i **files** (tuples amb valors atòmics).
- **Clau Primària (PK):** Columna (o conjunt de columnes) que **identifica unívocament** cada fila. Mai pot ser repetida ni contenir valors nuls (`NOT NULL`).
- **Clau Forana (FK):** Columna que **apunta a la clau primària** d'una altra taula per relacionar-les.

---

## 2.2. Creació de taules (`CREATE TABLE`)

```sql [Sintaxi general]
CREATE TABLE nom_taula (
    columna tipus_dades [restriccions_columna] [DEFAULT valor],
    ...,
    [restriccions_taula]
);
```

### Tipus de dades freqüents

| Categoria | Tipus SQL | Descripció |
| :--- | :--- | :--- |
| **Enters** | `INTEGER` (o `INT`), `SMALLINT` | Nombres enters. |
| **Decimals exactes** | `DECIMAL(p, s)` / `NUMERIC(p, s)` | $p$ dígits totals, $s$ decimals (ideal per diners). |
| **Coma flotant** | `FLOAT`, `REAL` | Valors aproximats. |
| **Text fix** | `CHAR(n)` | Longitud exacta de $n$ caràcters (omple amb espais). |
| **Text variable** | `VARCHAR(n)` | Cadena de text de fins a $n$ caràcters. |
| **Dates i hores** | `DATE`, `TIME`, `TIMESTAMP` | `'YYYY-MM-DD'`, `'HH:MM:SS'`. |

`DEFAULT valor` indica el valor que pren la columna si no s'especifica en fer l'`INSERT`.

---

## 2.3. Restriccions d'integritat

Es poden definir a nivell de **columna** (si només afecten aquella columna) o a nivell de **taula** (obligatori si impliquen més d'una columna, com ara una clau composta):

| Restricció | Significat | Exemple (Columna) | Exemple (Taula) |
| :--- | :--- | :--- | :--- |
| `NOT NULL` | Prohibeix valors `NULL`. | `nom VARCHAR(30) NOT NULL` | *(Només a nivell de columna)* |
| `UNIQUE` | Valors únics (admet `NULL`). | `nif CHAR(9) UNIQUE` | `UNIQUE (nif, serie)` |
| `PRIMARY KEY` | Clau primària (`NOT NULL` + `UNIQUE`). | `id INT PRIMARY KEY` | `PRIMARY KEY (id_curs, any)` |
| `REFERENCES` | Clau forana que enllaça amb el pare. | `num_dpt INT REFERENCES dpt(num)` | `FOREIGN KEY (dpt) REFERENCES dpt(num)` |
| `CHECK` | Condició de validació de negoci. | `sou INT CHECK (sou > 0)` | `CHECK (data_fi >= data_inici)` |

---

## 2.4. Integritat referencial: accions compensatòries

Quan s'esborra (`DELETE`) o es modifica (`UPDATE`) una fila a la taula pare que està referenciada per una clau forana, s'aplica una d'aquestes polítiques:

| Acció SQL | Comportament | Quan utilitzar-la? |
| :--- | :--- | :--- |
| `RESTRICT` / `NO ACTION` | **Bloqueja l'operació amb un error.** (Opció per defecte si no s'indica res). | Quan no es permet deixar elements orfes ni esborrar dades dependents. |
| `CASCADE` | **Propaga automàticament** l'esborrat o canvi a totes les files filles relacionades. | Relacions febles o de composició (ex: esborrar una factura esborra les seves línies). |
| `SET NULL` | **Posa a `NULL`** la clau forana de les files filles afectades. | Quan la filla pot sobreviure sense pare (la FK **no** pot ser `NOT NULL`). |

```sql
FOREIGN KEY (col_fk) REFERENCES taula_pare(col_pk)
    ON DELETE CASCADE
    ON UPDATE RESTRICT
```

---

## 2.5. Exemple complet DDL

```sql [Definició de l'esquema d'empleats]
CREATE TABLE departaments (
    num_dpt     INTEGER,
    nom_dpt     CHAR(30) NOT NULL,
    ciutat_dpt  CHAR(30),
    PRIMARY KEY (num_dpt)
);

CREATE TABLE empleats (
    num_empl     INTEGER,
    nom_empl     CHAR(30) NOT NULL,
    sou          INTEGER DEFAULT 100000 CHECK (sou > 80000),
    ciutat_empl  CHAR(30),
    num_dpt      INTEGER,
    num_proj     INTEGER,
    PRIMARY KEY (num_empl),
    FOREIGN KEY (num_dpt) REFERENCES departaments(num_dpt)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
);
```

:::sqlviz{simulation="ddl_empleats"}
:::

---

## 2.6. Inserció de files (`INSERT INTO`)

**Inserció posicional:** requereix passar valors per a **totes les columnes** en l'ordre exacte de creació de la taula:

```sql [Inserció posicional]
INSERT INTO empleats
VALUES (5, 'FERRAN', 250000, 'MATARO', 1, 1);
```

**Inserció amb llista de columnes:** permet indicar només un subconjunt de columnes; les que no s'indiquin prendran el seu valor `DEFAULT` o bé `NULL`. Si una columna no té `DEFAULT` i té `NOT NULL`, és obligatori incloure-la:

```sql [Inserció amb columnes explícites]
INSERT INTO departaments (num_dpt, nom_dpt)
VALUES (4, 'PERSONAL');
```

**Inserció massiva a partir d'un `SELECT`:** insereix directament el resultat d'una consulta en una taula existent:

```sql [Inserció amb subconsulta]
INSERT INTO proj_importants
SELECT * FROM projectes
WHERE pressupost > 2000000;
```

---

## 2.7. Esborrat de files (`DELETE FROM`)

```sql [Sintaxi general]
DELETE FROM nom_taula [WHERE condicio];
```

**Compte amb ometre el WHERE:** Si executes `DELETE FROM taula;` sense `WHERE`, **s'esborraran totes les files** de la taula.

```sql
-- Esborra empleats del departament 2
DELETE FROM empleats WHERE num_dpt = 2;

-- Esborra empleats amb sou inferior o igual a 250.000
DELETE FROM empleats WHERE sou <= 250000;
```

Per esborrar els departaments que no tenen cap empleat assignat, s'usa `NOT EXISTS`:

```sql [Esborrat amb NOT EXISTS]
DELETE FROM departaments d
WHERE NOT EXISTS (
    SELECT * FROM empleats e
    WHERE e.num_dpt = d.num_dpt
);
```

---

## 2.8. Modificació de dades (`UPDATE`)

```sql [Sintaxi general]
UPDATE nom_taula
SET columna1 = expressio1 [, columna2 = expressio2 ...]
[WHERE condicio];
```

**Compte amb ometre el WHERE:** Sense clàusula `WHERE`, el canvi s'aplicarà a **totes les files** de la taula.

```sql [Increment de sou i canvi de ciutat]
UPDATE empleats
SET sou = sou + 10000, 
    ciutat_empl = 'VIC'
WHERE num_dpt = 2;
```

**Subconsulta a la clàusula `WHERE`:** per filtrar les files a modificar a partir d'una altra taula:

```sql [UPDATE amb subconsulta a WHERE]
UPDATE empleats 
SET sou = sou + 10000
WHERE num_dpt IN (
    SELECT num_dpt FROM departaments
    WHERE ciutat_dpt = 'MADRID'
);
```

**Subconsulta a la clàusula `SET`:** per calcular el nou valor en funció d'una consulta. La subconsulta ha de retornar **un únic valor** (1 fila i 1 columna); si retorna més d'una fila, la sentència fallarà:

```sql [UPDATE amb subconsulta a SET]
UPDATE empleats e
SET sou = (
    SELECT AVG(sou) FROM empleats
    WHERE num_dpt = e.num_dpt
)
WHERE num_dpt = 2;
```

---

## 2.9. La Matriu de Classificació de Restriccions d'Integritat (Pregunta d'examen de 2-3 punts)

Als exàmens parcials de la FIB es dóna un llistat de regles de negoci i es demana **on i com implementar cadascuna**: com a restricció al `CREATE TABLE`, com a asserció (`CREATE ASSERTION`), o explicar per què no es pot fer de cap de les dues maneres.

### Arbre de Decisió

```text
La regla implica dades dependents de l'usuari connectat? (ex: "només veure les meves dades")
├── SÍ  ──> CONTROL D'ACCÉS / SEGURETAT (CREATE VIEW + GRANT). Ni CHECK ni ASSERTION!
└── NO
    ├── Implica una única fila de la mateixa taula?
    │   ├── Afecta només un atribut? ──> RESTRICCIÓ DE COLUMNA (CHECK, NOT NULL, DEFAULT)
    │   └── Afecta múltiples atributs de la mateixa fila? ──> RESTRICCIÓ DE TAULA (CHECK, UNIQUE, PK)
    └── Implica múltiples files de la mateixa taula O múltiples taules creuades?
        ├── Es pot resoldre amb integritat referencial estàndard? ──> CLAU FORANA (ON DELETE CASCADE, etc.)
        ├── Exigeix condicions de validació sense acció reactiva complexa? ──> ASSERCIÓ (CREATE ASSERTION)
        └── Exigeix accions reactives / càlculs derivats dinàmics? ──> DISPARADORS (TRIGGER / PL/pgSQL)
```

### Taula Comparativa per a les Respostes d'Examen

| Mecanisme | Àmbit d'Aplicació | Què admet / Què prohibeix | Exemple típic d'Examen |
| :--- | :--- | :--- | :--- |
| **`CHECK` de Columna** | Un sol atribut de la fila actual. | Admet comparacions simples (`edat >= 0`, `estat IN (...)`). | `tarifa CHAR(7) CHECK (tarifa IN ('premium', 'free'))` |
| **`CHECK` de Taula** | Dos o més atributs de la **mateixa fila**. | **PROHIBIT:** No pot contenir subconsultes `SELECT`, ni comparar amb altres files ni amb altres taules. | `CHECK (data_fi >= data_inici)` o `CHECK (preu <= 200 OR descripcio = 'premium')` |
| **`UNIQUE` / `PRIMARY KEY`** | Unicitat dins de la mateixa taula. | Pot ser compost. Impedeix duplicats en la taula. | `PRIMARY KEY (nom_congrés, edicio)` |
| **`FOREIGN KEY`** | Integritat referencial entre taules. | Assegura que el valor existeix a la taula pare. Admet `ON DELETE CASCADE / SET NULL`. | `FOREIGN KEY (creador) REFERENCES usuaris(nom)` |
| **`CREATE ASSERTION`** | Múltiples files de la mateixa taula o múltiples taules creuades. | Es formula sempre com: `CHECK (NOT EXISTS (select que troba infractors))`. No pot dependre de `CURRENT_USER`. | *"Cap persona pot coordinar més de 2 congressos després de 2021"*, o *"Tots els inscrits han de ser participants"*. |
| **Vistes i Permisos (`GRANT`)** | Regles de privacitat dependents de la sessió. | No pertany a la integritat de dades, sinó al control d'accés. | *"Cada usuari només podrà consultar i modificar les seves pròpies inscripcions"*. |

---

## 2.10. Traça d'Execució DML i Integritat Transaccional (Anàlisi d'Scripts SQL)

Als exàmens s'inclouen exercicis on es mostra una seqüència de sentències `INSERT` consecutives i es demana quin resultat donarà un `SELECT` final.

Quan les sentències s'executen d'una en una (comportament per defecte a DBeaver i línia de comandes), **la fallada d'una instrucció NO anul·la les insercions correctes anteriors**. Per calcular el resultat del `SELECT` final cal eliminar mentalment les files que han provocat una excepció i comptabilitzar exclusivament les que s'han inserit amb èxit. Els errors més freqüents a detectar:

- **Clau Primària / `UNIQUE` duplicada:** Si s'intenta inserir una fila amb un valor de PK que ja existeix, la sentència **falla immediatament** (`duplicate key value violates unique constraint`).
- **Clau Forana inexistent:** Si un `INSERT` referencia un pare que **encara no existeix** o que va fallar en un pas previ, la sentència **és rebutjada** (`violates foreign key constraint`).

:::dmlviz
:::
