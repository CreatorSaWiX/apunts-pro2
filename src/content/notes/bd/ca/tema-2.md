---
title: "Tema 2: DDL i DML"
description: "Definició d'esquemes amb CREATE TABLE, restriccions d'integritat, accions compensatòries, i manipulació de dades amb INSERT, UPDATE i DELETE."
readTime: "10 min"
order: 2
draft: false
---

Aquest tema recull la definició de l'estructura de la base de dades (**DDL**) i la manipulació de les dades que conté (**DML**).

---

## 2.1. Conceptes clau del Model Relacional

A l'examen només necessites tenir clars tres conceptes que es tradueixen directament a SQL:

* **Taula (Relació):** Formada per **columnes** (atributs) i **files** (tuples amb valors atòmics).
* **Clau Primària (PK):** Columna (o conjunt de columnes) que **identifica unívocament** cada fila. Mai pot ser repetida ni contenir valors nuls (`NOT NULL`).
* **Clau Forana (FK):** Columna que **apunta a la clau primària** d'una altra taula per relacionar-les.

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

* `DEFAULT valor`: Valor que pren la columna si no s'especifica en fer l'`INSERT`.

---

## 2.3. Restriccions d'integritat (*Constraints*)

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

### Sintaxi a la clau forana:
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

### 1. Inserció posicional
Requereix passar valors per a **totes les columnes** en l'ordre exacte de creació de la taula:

```sql [Inserció posicional]
INSERT INTO empleats
VALUES (5, 'FERRAN', 250000, 'MATARO', 1, 1);
```

### 2. Inserció amb llista de columnes
Permet indicar només un subconjunt de columnes. Les que no s'indiquin prendran automàticament el seu valor `DEFAULT` o bé `NULL`:

```sql [Inserció amb columnes explícites]
INSERT INTO departaments (num_dpt, nom_dpt)
VALUES (4, 'PERSONAL');
```

* **Restricció `NOT NULL`:** Si una columna no té `DEFAULT` i té la restricció `NOT NULL`, és obligatori incloure-la a la llista de columnes.

### 3. Inserció massiva a partir d'un `SELECT`
Insereix directament el resultat d'una consulta en una taula existent:

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

### Exemples d'esborrat bàsic:
```sql
-- Esborra empleats del departament 2
DELETE FROM empleats WHERE num_dpt = 2;

-- Esborra empleats amb sou inferior o igual a 250.000
DELETE FROM empleats WHERE sou <= 250000;
```

### Esborrat amb subconsulta correlacionada (`NOT EXISTS`):
Esborrar els departaments que actualment no tenen cap empleat assignat:

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

**Compte amb ometre el WHERE:** Sense clàusula `WHERE`, el canvi s'aplicarà indiscriminadament a **totes les files** de la taula.

### 1. Modificació acumulativa i múltiples columnes
```sql [Increment de sou i canvi de ciutat]
UPDATE empleats
SET sou = sou + 10000, 
    ciutat_empl = 'VIC'
WHERE num_dpt = 2;
```

### 2. Subconsulta a la clàusula `WHERE`
Modificar el sou dels empleats segons atributs de la taula departaments:

```sql [UPDATE amb subconsulta a WHERE]
UPDATE empleats 
SET sou = sou + 10000
WHERE num_dpt IN (
    SELECT num_dpt FROM departaments
    WHERE ciutat_dpt = 'MADRID'
);
```

### 3. Subconsulta a la clàusula `SET` (valor escalar)
Assignar a cada empleat el sou mitjà del seu departament:

```sql [UPDATE amb subconsulta a SET]
UPDATE empleats e
SET sou = (
    SELECT AVG(sou) FROM empleats
    WHERE num_dpt = e.num_dpt
)
WHERE num_dpt = 2;
```

* **Regla d'escalaritat a SET:** La subconsulta dins del `SET` ha de retornar **un únic valor escalar** (1 fila i 1 columna). Si retorna més d'una fila, la sentència fallarà amb error d'execució.
