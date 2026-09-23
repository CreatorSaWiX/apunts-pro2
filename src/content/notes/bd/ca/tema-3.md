---
title: "Tema 3: SQL Cheat Sheet (DDL, DML i DQL)"
description: "Guia ràpida completa de SQL: definició d'esquemes (DDL), manipulació de dades (DML), consultes d'una i múltiples taules (DQL), funcions d'agregació, subconsultes i tipus temporals."
readTime: "20 min"
order: 3
draft: false
---

# 3. SQL Cheat Sheet

Guia de referència ràpida i completa del llenguatge **SQL** per a bases de dades relacionals, estructurada en tres grans àrees: **DDL** (definició de dades), **DML** (manipulació de dades) i **DQL** (consultes de dades).

---

## 3.1. DDL i esquema relacional de referència

### Esquema relacional de referència i dades de mostra

Per a tots els exemples d'aquesta guia utilitzarem l'esquema relacional format per tres taules: `departaments`, `projectes` i `empleats`:

```text
 ┌────────────────────────────────────────────────────────┐       ┌──────────────────────────────────────────────────┐
 │ departaments                                           │       │ projectes                                        │
 ├──────────┬────────────┬─────────┬────────────┬─────────┤       ├──────────┬──────────┬───────────┬────────────────┤
 │ *num_dpt │ nom_dpt    │ planta  │ edifici    │ ciutat  │       │ *num_proj│ nom_proj │ producte  │ pressupost     │
 ├──────────┼────────────┼─────────┼────────────┼─────────┤       ├──────────┼──────────┼───────────┼────────────────┤
 │    1     │ DIRECCIO   │   10    │ PAU CLARIS │BARCELONA│       │    1     │ IBDTEL   │ TELEVISIO │ 1.000.000      │
 │    2     │ DIRECCIO   │    8    │ RIOS ROSAS │ MADRID  │       │    2     │ IBDVID   │ VIDEO     │   500.000      │
 │    3     │ MARQUETING │    1    │ PAU CLARIS │BARCELONA│       │    3     │ IBDTEF   │ TELEFON   │   700.000      │
 └────▲─────┴────────────┴─────────┴────────────┴─────────┘       └────▲─────┴──────────┴───────────┴────────────────┘
      │                                                                │
      │ FK1: num_dpt ──► departaments                                  │ FK2: num_proj ──► projectes
      └──────────────────────────────────┐        ┌────────────────────┘
                                         │        │
 ┌───────────────────────────────────────┴────────┴────────────────────────────────────────┐
 │ empleats                                                                                │
 ├──────────┬──────────┬───────────┬──────────────┬───────────────────┬────────────────────┤
 │ *num_empl│ nom_empl │ sou       │ ciutat_empl  │ num_dpt (FK1)     │ num_proj (FK2)     │
 ├──────────┼──────────┼───────────┼──────────────┼───────────────────┼────────────────────┤
 │    1     │ CARME    │  400.000  │ MATARO       │         1         │         1          │
 │    2     │ EUGENIA  │  350.000  │ TOLEDO       │         2         │         2          │
 │    3     │ JOSEP    │  250.000  │ SITGES       │         3         │         1          │
 │    4     │ RICARDO  │  400.000  │ BARCELONA    │         1         │         1          │
 │   11     │ NURIA    │  100.000  │ NULL         │         3         │         2          │
 └──────────┴──────────┴───────────┴──────────────┴───────────────────┴────────────────────┘
```

* ==Clau primària (PK)==: Identifica unívocament cada fila de la taula (valor únic i mai nul; ex: `num_dpt` a `departaments`).
* ==Clau forana (FK)==: Relaciona files referenciant la clau primària d'una altra taula (ex: `num_dpt` a `empleats` referencia `departaments`).

---

### Creació de taules: sintaxi i tipus de dades

```sql [Sintaxi CREATE TABLE]
CREATE TABLE nom_taula (
    nom_columna tipus_dades [restriccions_col] [DEFAULT {literal | NULL}],
    [...],
    [restriccions_taula]
);
```

#### Tipus de dades SQL estàndard
* **Enters:** `INTEGER` (o `INT`), `SMALLINT`, `BIGINT`.
* **Coma flotant:** `FLOAT(p)`, `REAL`, `DOUBLE PRECISION`.
* **Numèric exacte:** `NUMERIC(p, s)`, `DECIMAL(p, s)` (on $p$ és la precisió total de dígits i $s$ és l'escala o nombre de decimals).
* **Text:** `CHAR(n)` (longitud fixa de $n$ caràcters, omple amb espais en blanc), `VARCHAR(n)` (longitud variable fins a un màxim de $n$ caràcters).
* **Temporals:** `DATE` (`'YYYY-MM-DD'`), `TIME` (`'HH:MM:SS'`), `TIMESTAMP`.
* ==DEFAULT==: Valor per defecte que s'assigna automàticament a la columna si aquesta s'omet en inserir la fila (ex: `DEFAULT 100000` o `DEFAULT NULL`).

---

### Restriccions d'integritat: columna vs. taula

| Àmbit | Restricció | Sintaxi i Descripció |
| :--- | :--- | :--- |
| **Columna** *(s'aplica a una única columna directament en la seva declaració)* | ==NOT NULL== | Prohibeix valors nuls (`NULL`) a la columna. Obliga a donar un valor a cada fila. |
| | ==UNIQUE== | Prohibeix valors repetits entre files de la taula. Admet un o més `NULL`. |
| | ==PRIMARY KEY== | La columna és la clau primària (aplica `NOT NULL` i `UNIQUE` implícitament). |
| | ==REFERENCES== | La columna és una clau forana que referencia una taula pare: `REFERENCES taula(col)`. |
| | ==CHECK== | Condició lògica de validació que ha de complir el valor: `CHECK (condicio)`. |
| **Taula** *(es defineix al final; imprescindible per a claus formades per múltiples columnes)* | ==PRIMARY KEY== | Declara la clau primària composta: `PRIMARY KEY (col1, col2)`. |
| | ==FOREIGN KEY== | Declara una clau forana (simple o composta): `FOREIGN KEY (c1, c2) REFERENCES pare(c1, c2)`. |
| | ==UNIQUE== | Exigeix valors únics per a la combinació de columnes: `UNIQUE (c1, c2)`. |
| | ==CHECK== | Condició que pot implicar i comparar diverses columnes de la mateixa fila. |

#### Exemple complet de creació de taula (DDL)

```sql [Exemple DDL taula empleats]
CREATE TABLE empleats (
    num_empl     INTEGER,
    nom_empl     CHAR(30) NOT NULL,
    sou          INTEGER DEFAULT 100000 CHECK (sou > 80000),
    ciutat_empl  CHAR(30),
    num_dpt      INTEGER,
    num_proj     INTEGER,
    PRIMARY KEY (num_empl),
    FOREIGN KEY (num_dpt) REFERENCES departaments(num_dpt),
    FOREIGN KEY (num_proj) REFERENCES projectes(num_proj)
);
```

---

## 3.2. DML (manipulació de dades)

### Inserció de dades (`INSERT INTO`)

#### 1. Inserció posicional
Cal especificar valors per a **totes** les columnes seguint exactament l'ordre físic en què es van definir a la taula:

```sql [Inserció posicional]
INSERT INTO empleats
VALUES (5, 'FERRAN', 250000, 'MATARO', 1, 1);
```

#### 2. Inserció amb llista de columnes
Permet especificar només un subconjunt de columnes. Les columnes no esmentades prenen automàticament el seu valor `DEFAULT` o bé `NULL` (si no tenen restricció `NOT NULL`):

```sql [Inserció amb llista de columnes]
INSERT INTO departaments (num_dpt, nom_dpt)
VALUES (4, 'PERSONAL');
```

#### 3. Inserció massiva amb subconsulta
Insereix directament el conjunt de files retornat per una consulta `SELECT`:

```sql [Inserció amb subconsulta]
INSERT INTO proj_importants
SELECT * FROM projectes
WHERE pressupost > 2000000;
```

::callout[type="note" title="Requisit de compatibilitat"]
La subconsulta ha de retornar exactament el mateix nombre de columnes i amb tipus de dades compatibles amb la taula de destinació.
::

---

### Esborrat de files (`DELETE FROM`)

Sintaxi general:
```sql [Sintaxi DELETE]
DELETE FROM taula [WHERE condicio];
```

::callout[type="warning" title="Omissió de la clàusula WHERE"]
Si s'executa un `DELETE FROM taula;` **sense clàusula WHERE**, s'esborraran **totes les files** de la taula. La taula queda completament buida però la seva estructura es conserva a la base de dades.
::

#### Exemples d'esborrat bàsic:

```sql [Esborrats condicionals]
-- Esborra els empleats del departament 2
DELETE FROM empleats WHERE num_dpt = 2;

-- Esborra els empleats amb sou inferior o igual a 250.000
DELETE FROM empleats WHERE sou <= 250000;
```

#### Subconsulta correlacionada (`NOT EXISTS`):
Esborrar els departaments que no tenen cap empleat assignat:

```sql [Esborrat amb subconsulta correlacionada]
DELETE FROM departaments d
WHERE NOT EXISTS (
    SELECT * FROM empleats e
    WHERE e.num_dpt = d.num_dpt
);
```

---

### Modificació de dades (`UPDATE`)

Sintaxi general:
```sql [Sintaxi UPDATE]
UPDATE taula
SET col_1 = expr_1 [, col_2 = expr_2 ...]
[WHERE condicio];
```

::callout[type="warning" title="Omissió de la clàusula WHERE"]
Sense clàusula `WHERE`, la modificació s'aplicarà indiscriminadament a **totes les files** de la taula.
::

#### 1. Increment acumulatiu:
```sql [Increment de sou]
UPDATE empleats
SET sou = sou + 10000
WHERE num_dpt = 2;
```

#### 2. Modificació de múltiples columnes:
```sql [Actualització de sou i ciutat]
UPDATE empleats
SET sou = sou + 10000, ciutat_empl = 'VIC'
WHERE num_dpt = 2;
```

#### 3. Subconsulta a la clàusula `WHERE`:
Modificar el sou dels empleats segons la ciutat del seu departament:

```sql [Update amb subconsulta a WHERE]
UPDATE empleats 
SET sou = sou + 10000
WHERE num_dpt IN (
    SELECT num_dpt FROM departaments
    WHERE ciutat_dpt = 'MADRID'
);
```

#### 4. Subconsulta a la clàusula `SET`:
Assignar a l'empleat el sou mitjà del seu departament:

```sql [Update amb subconsulta a SET]
UPDATE empleats e
SET sou = (
    SELECT AVG(sou) FROM empleats
    WHERE num_dpt = e.num_dpt
)
WHERE num_dpt = 2;
```

::callout[type="danger" title="Restricció d'escalaritat a SET"]
Una subconsulta a la clàusula `SET` ha de retornar **exactament un únic valor escalar** (1 fila i 1 columna). Si no retorna cap fila s'assigna `NULL`; si en retorna més d'una, la sentència fallarà amb un error d'execució.
::

---

## 3.3. DQL (consultes d'una taula)

### Format bàsic de `SELECT` i projecció

```sql [Estructura general SELECT]
SELECT [DISTINCT | ALL] col_1, col_2 ...
FROM taula
[WHERE condicio]
[ORDER BY col_a [ASC | DESC] ...];
```

#### Modalitats de projecció:
* **Tots els atributs:** `SELECT * FROM empleats;`
* **Selecció de determinats atributs:** `SELECT nom_empl, sou FROM empleats;`
* **Expressions aritmètiques (+, -, \*, /):**
```sql [Projecció amb càlcul]
SELECT nom_empl, sou * 1.05 AS sou_incrementat FROM empleats;
```

---

### Operadors a la clàusula `WHERE`

| Tipus d'operador | Operadors i Sintaxi | Significat / Exemple |
| :--- | :--- | :--- |
| **Comparació** | `=`, `<>`, `<`, `<=`, `>`, `>=` | Comparacions de valors numèrics, cadenes o dates (`<>` equival a diferent). |
| **Lògics** | `AND`, `OR`, `NOT` | Combinació booleana de condicions (precedència: `NOT` > `AND` > `OR`). |
| **Rangs** | `BETWEEN v1 AND v2` | Comprovació de rang **inclusiu** ($v_1 \le x \le v_2$). |
| **Pertinença** | `IN (v1, v2...)`, `NOT IN (v1...)` | Pertinença a una llista finita de valors o subconsulta. |
| **Patrons de text** | `LIKE 'patró'` | `%` substitueix qualsevol cadena de $\ge 0$ caràcters; `_` substitueix exactament 1 caràcter. |
| **Valors nuls** | ==IS NULL==, ==IS NOT NULL== | Verificació de valors desconeguts (**mai usar `= NULL`**, ja que sempre avalua a *Unknown*). |

```sql [Exemples de clàusula WHERE]
-- Empleats amb sou entre 200.000 i 300.000
SELECT nom_empl FROM empleats
WHERE sou BETWEEN 200000 AND 300000;

-- Empleats el nom dels quals comença per 'J' i tenen ciutat coneguda
SELECT * FROM empleats
WHERE nom_empl LIKE 'J%' AND ciutat_empl IS NOT NULL;
```

---

### Ordenació i eliminació de duplicats

#### Clàusula `ORDER BY`:
Ordena el conjunt final de tuples retornat:
* `ASC`: Ordenació ascendent de menor a major (opció per defecte).
* `DESC`: Ordenació descendent de major a menor.
* Admet múltiples criteris separats per coma ordenats per prioritat.

```sql [Exemple ORDER BY múltiple]
SELECT * FROM empleats 
ORDER BY num_dpt ASC, sou DESC;
```

#### Modificadors `DISTINCT` / `ALL`:
* `ALL`: Manté totes les files resultants, incloent duplicades (comportament per defecte).
* ==DISTINCT==: Filtra i elimina totes les files repetides del resultat.

```sql [Eliminació de duplicats]
SELECT DISTINCT ciutat_empl FROM empleats;
```

---

### Funcions d'agregació

Processen una columna sobre un conjunt de files i retornen un **únic valor resum escalar**:

| Funció | Descripció | Tractament de valors `NULL` |
| :--- | :--- | :--- |
| ==COUNT(\*)== | Nombre total de files seleccionades | **Compta totes les files**, incloent les que tenen nuls. |
| ==COUNT(col)== | Nombre de files amb valor **no nul** a `col` | Ignora els valors `NULL`. |
| ==COUNT(DISTINCT col)== | Nombre de valors **diferents i no nuls** a `col` | Ignora valors repetits i valors `NULL`. |
| ==SUM(col)== | Suma aritmètica dels valors de la columna | Ignora els valors `NULL`. |
| ==AVG(col)== | Mitjana aritmètica dels valors de la columna | Ignora els valors `NULL`. |
| ==MIN(col)== / ==MAX(col)== | Valor mínim / valor màxim de la columna | Ignora els valors `NULL`. |

::callout[type="info" title="Comportament davant conjunts buits"]
Si el conjunt de files avaluat és buit:
* `COUNT` retorna **`0`**.
* `SUM`, `AVG`, `MIN` i `MAX` retornen **`NULL`**.
::

```sql [Exemple d'agregats]
SELECT COUNT(*), AVG(sou), MAX(sou)
FROM empleats 
WHERE num_dpt = 2;
```

---

### Agrupament (`GROUP BY`) i condicions sobre grups (`HAVING`)

#### Clàusula `GROUP BY`:
Divideix les files seleccionades en grups homogenis que comparteixen exactament els mateixos valors a les columnes d'agrupament.

::callout[type="danger" title="Regla d'or de GROUP BY"]
Tota columna individual que aparegui a la llista de projecció del `SELECT` **ha d'aparèixer obligatòriament a la clàusula GROUP BY o bé dins d'una funció d'agregació**. No es poden projectar columnes independents no agrupades.
::

```sql [Exemple bàsic GROUP BY]
SELECT num_dpt, AVG(sou) AS sou_mig
FROM empleats 
GROUP BY num_dpt;
```

#### Clàusula `HAVING` vs. `WHERE`:
* ==WHERE==: Filtra **files individuals abans** de fer l'agrupament. Mai pot contenir funcions d'agregació (ex: `WHERE sou > 200000`).
* ==HAVING==: Filtra **grups complets després** de l'agrupament. Està dissenyada específicament per avaluar condicions sobre **funcions d'agregació** (ex: `HAVING COUNT(*) > 1`).

```sql [Combinació WHERE + GROUP BY + HAVING]
SELECT num_dpt, AVG(sou) AS sou_mig
FROM empleats
WHERE sou > 200000
GROUP BY num_dpt
HAVING COUNT(*) > 1;
```

---

## 3.4. DQL (consultes multitaula i subconsultes)

### Consultes multitaula: combinacions (*joins*)

Permeten associar i correlacionar dades distribuïdes en dues o més taules relacionades mitjançant claus foranes.

#### 1. Combinació implícita (clàusula `WHERE`):
```sql [Join implícit]
SELECT e.nom_empl, d.nom_dpt
FROM empleats e, departaments d
WHERE e.num_dpt = d.num_dpt;
```
::callout[type="warning" title="Perill de producte cartesià"]
Si s'omet la condició d'enllaç al `WHERE`, l'SGBD realitzarà el producte cartesià complet ($n \times m$ files), combinant totes les files de la primera taula amb totes les de la segona.
::

#### 2. Combinació explícita (`INNER JOIN ... ON`):
És la sintaxi estàndard moderna recomanada per separar la condició de relació dels filtres de dades:

```sql [INNER JOIN explícit]
SELECT e.nom_empl, d.nom_dpt
FROM empleats e
INNER JOIN departaments d ON e.num_dpt = d.num_dpt;
```

#### 3. Combinació natural (`NATURAL INNER JOIN`):
Iguala automàticament totes les columnes de les dues taules que tinguin **exactament el mateix nom** (en el nostre esquema, igualarà per `num_dpt`):

```sql [NATURAL JOIN]
SELECT e.nom_empl, d.nom_dpt
FROM empleats e
NATURAL INNER JOIN departaments d;
```

#### 4. Multitaula amb agrupament:
```sql [Join amb GROUP BY i HAVING]
SELECT d.nom_dpt, AVG(e.sou) AS sou_mig
FROM empleats e
INNER JOIN departaments d ON e.num_dpt = d.num_dpt
GROUP BY d.nom_dpt
HAVING COUNT(*) > 1;
```

---

### Operacions de conjunts: `UNION`

Permet combinar verticalment els resultats de dues sentències `SELECT` independents en un únic conjunt de tuples:

```sql [Exemple UNION]
SELECT ciutat_dpt AS ciutat FROM departaments
UNION
SELECT ciutat_empl AS ciutat FROM empleats;
```

::callout[type="info" title="Regles d'ús de UNION"]
1. Les dues consultes han de projectar **exactament el mateix nombre de columnes** i amb tipus de dades compatibles en cadascuna de les posicions respectives.
2. `UNION` **elimina duplicats per defecte**. Per mantenir les files repetides i millorar el rendiment, s'utilitza ==UNION ALL==.
3. La clàusula `ORDER BY` només es pot indicar una vegada, **al final de tot**, i fa referència als noms de columna de la primera sentència `SELECT`.
::

---

### Subconsultes: diferència crucial entre `NOT IN` i `NOT EXISTS`

Suposem que volem obtenir els departaments que **no tenen cap empleat**:

#### Opció A: Amb `NOT IN`
```sql [NOT IN]
SELECT * FROM departaments
WHERE num_dpt NOT IN (
    SELECT num_dpt FROM empleats
    WHERE num_dpt IS NOT NULL -- OBLIGATORI!
);
```

::callout[type="danger" title="Trampa del valor NULL amb NOT IN"]
Si la subconsulta retorna com a mínim un sol valor `NULL`, l'expressió `v NOT IN (...)` s'avaluarà com a *Unknown* per a qualsevol valor $v$. En conseqüència, **la consulta no retornarà cap fila**. Per fer servir `NOT IN` de manera segura cal filtrar explícitament `WHERE columna IS NOT NULL`.
::

#### Opció B: Amb `NOT EXISTS` (Recomanada)
```sql [NOT EXISTS correlacionada]
SELECT * FROM departaments d
WHERE NOT EXISTS (
    SELECT * FROM empleats e
    WHERE e.num_dpt = d.num_dpt
);
```
`NOT EXISTS` avalua si la subconsulta correlacionada retorna un conjunt buit o no. És completament **immune a la presència de valors nuls** a la columna filla.

---

### Mapa d'ús de subconsultes

Les subconsultes (consultes niades) es poden utilitzar en diversos contextos de l'SQL:

1. **A les clàusules `WHERE` / `HAVING` (com a filtres):**
   * **Escalar:** Ús d'operadors ordinaris (`=`, `<>`, `<`, `>`, `<=`, `>=`). La subconsulta ha de retornar 1 fila i 1 columna.
   * **Multivalor:** Ús de `IN`, `NOT IN`, `ANY` (o `SOME`), `ALL`.
   * **Existència:** Ús de `EXISTS` i `NOT EXISTS` (habitualment en subconsultes correlacionades).
2. **A la clàusula `SET` d'un `UPDATE`:** Per calcular dinàmicament el nou valor d'un camp (*ha de retornar un únic valor escalar*).
3. **A la clàusula `INSERT INTO ... SELECT`:** Càrrega massiva de dades a partir d'un conjunt de tuples generat al vol.
4. **A la clàusula `FROM`:** Com a **taula derivada en memòria** (subconsulta a la qual s'assigna obligatòriament un àlies).

---

### Tipus i funcions temporals

#### Tipus de dades per a dates i hores
* `DATE`: Data de calendari (`'2024-03-15'`).
* `TIME`: Hora del dia (`'14:30:00'`).
* `TIMESTAMP`: Data i hora combinades (`'2024-03-15 14:30:00'`).
* `INTERVAL`: Magnitud o durada temporal (ex: `INTERVAL '10 min'`, `INTERVAL '2 day'`).

#### Funcions de sistema
* `CURRENT_DATE`: Retorna la data actual del sistema.
* `CURRENT_TIME`: Retorna l'hora actual del sistema.
* `CURRENT_TIMESTAMP` / `NOW()`: Retorna la data i hora actuals completes.

#### Extracció de components (`EXTRACT`)
```sql [Funcions EXTRACT]
EXTRACT(YEAR FROM data)       -- Any (ex: 2024)
EXTRACT(MONTH FROM data)      -- Mes (1 a 12)
EXTRACT(DOW FROM data)        -- Dia de la setmana (0 = Diumenge, 6 = Dissabte)
EXTRACT(DOY FROM data)        -- Dia de l'any (1 a 366)
```

#### Format de text (`TO_CHAR`)
```sql [Formatatge TO_CHAR]
TO_CHAR(NOW(), 'DD/MM/YYYY')  -- Cadena formatada (ex: '15/03/2024')
TO_CHAR(data, 'Day')          -- Nom complet del dia (ex: 'Friday')
```

#### Aritmètica d'intervals
Permet sumar o restar períodes de temps directament a dates i segells temporals:

```sql [Aritmètica amb dates i intervals]
SELECT * FROM viatges
WHERE moment > (data_sortida + hora_prevista + INTERVAL '10 min');
```
