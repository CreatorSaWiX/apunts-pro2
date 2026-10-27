---
title: "Parcial BD"
description: "Resum tema 1, 2, 3 i 7."
readTime: "10 min"
order: 8
draft: false
---

## 1. SQL i àlgebra relacional

### Consultes SQL
- **Ordre:** `SELECT [DISTINCT] ... FROM ... [WHERE ...] [GROUP BY ...] [HAVING ...] [ORDER BY ... [ASC|DESC]]`
- **Valors `NULL`:** Comparar sempre amb `IS NULL` / `IS NOT NULL` (mai `= NULL`).
- **Agregació:** `COUNT(*)` compta nuls; `COUNT(col)`, `SUM`, `AVG`, `MIN`, `MAX` ignoren nuls (i retornen `NULL` si 0 files, excepte `COUNT` que dóna `0`).
- **`WHERE` vs `HAVING`:** `WHERE` filtra files abans d'agrupar (sense agregacions). `HAVING` filtra grups després del `GROUP BY`. Tota columna del `SELECT` fora d'una agregació ha d'estar al `GROUP BY`. Exemple:
```sql
SELECT a.modul, a.numero, p.nomProf, COUNT(*) 
.
.
.
GROUP BY a.modul, a.numero, p.nomProf
```
- **Subconsultes d'exclusió:**
  - `NOT EXISTS (SELECT * FROM ... WHERE ...)`.
  - `col NOT IN (SELECT col FROM ... WHERE col IS NOT NULL)`.

### Enunciats tipus ("Més de X...", "Almenys X...", "X o més...")

Sempre que l'enunciat et demani filtrar segons la **quantitat de vegades**, s'ha d'usar **`GROUP BY` i `HAVING COUNT(...)`**.
**Enunciats típics:** *"que tinguin més de $N$..."*, *"en $N$ o més ocasions..."*, *"com a mínim $N$..."*.
```sql
SELECT columnes_que_identifiquen_el_grup
FROM ...
GROUP BY columnes_que_identifiquen_el_grup
HAVING COUNT(*) >= N; -- (o > N, segons digui l'enunciat)
```

**Exemple 1A:** "Obtenir el DNI dels professors que han tingut **5 o més assignacions** en total (a qualsevol despatx)."
Volem comptar files d'`assignacions` per cada professor. Per tant, agrupo per `dni`.
```sql
SELECT a.dni
FROM assignacions a
GROUP BY a.dni
HAVING COUNT(*) >= 5;
```

**Exemple 1B:** "Obtenir el despatx i el nom del professor quan **el mateix professor** ha estat assignat **al mateix despatx en 3 o més períodes**."
Ara no compto quantes assignacions té el professor en total, sinó quantes en té *en un mateix despatx*. Per tant, al `GROUP BY` hi he de posar tant el despatx (`modul, numero`) com el professor (`nomProf`).
```sql
SELECT a.modul, a.numero, p.nomProf, COUNT(*) AS numVegades
FROM assignacions a JOIN professors p ON a.dni = p.dni
GROUP BY a.modul, a.numero, p.nomProf
HAVING COUNT(*) >= 3;
```

**Exemple 1C:** "Obtenir l'identificador i nom de les playlists que tinguin **més de 5 cançons d'un mateix cantant**."
El recompte és per cada parella de *(playlist + cantant)*, així que he de fer `GROUP BY p.idList, p.nomList, c.cantant`. Però alerta: al `SELECT` només em demanen mostrar la playlist (`idList, nomList`), NO el cantant! Com que una playlist podria tenir 6 cançons de Shakira i 6 de Rosalía, sortiria dues vegades; per això hi afegim `DISTINCT` al `SELECT`.
```sql
SELECT DISTINCT p.idList, p.nomList
FROM playlist p 
NATURAL INNER JOIN cançonsAPlaylist cp
NATURAL INNER JOIN cançons c
GROUP BY p.idList, p.nomList, c.cantant
HAVING COUNT(*) > 5;
```

**Exemple 1D:** "Obtenir el DNI dels professors que han estat assignats a **5 o més despatxos diferents** dins d'un mateix mòdul."
Un professor pot haver estat al despatx `'Omega', '101'` en 4 períodes diferents (4 files a `assignacions`), però continua sent **1 sol despatx**! Si faig `COUNT(*)`, comptarà períodes (files). Si vull comptar *despatxos diferents* dins del mòdul, he de comptar quants valors diferents de `numero` té: `COUNT(DISTINCT a.numero)`.
```sql
SELECT a.dni, a.modul
FROM assignacions a
GROUP BY a.dni, a.modul
HAVING COUNT(DISTINCT a.numero) >= 5;
```

---

### Enunciats tipus ("Cap...", "No té cap...", "Mai...")

Sempre que l'enunciat et demani que un element **no tingui** cap relació amb una altra cosa (o amb una condició), s'ha d'usar **`NOT EXISTS`** dins del `WHERE`.

**Enunciats típics:** *"que no tingui cap..."*, *"que no hagi fet mai..."*, *"sense cap..."*.
```sql
SELECT ...
FROM taula_principal t1
WHERE NOT EXISTS (
    SELECT *
    FROM taula_secundaria t2
    WHERE t2.clau_forana = t1.clau_primaria  -- <-- CONNEXIÓ OBLIGATÒRIA!
      AND condicio_prohibida
);
```

*(Nota: Dins del `NOT EXISTS` **sempre** hi ha d'haver una condició que connecti la subconsulta amb la taula de fora, com `t2.dni = t1.dni`.)*

**Exemple 2A:** "Obtenir el DNI i nom dels professors que **no tenen cap assignació vigent**."
Agafo un professor `p` a fora, i comprovo que a dins d'`assignacions` **no existeixi** cap fila d'aquest professor (`a.dni = p.dni`) amb `instantFi IS NULL`.
```sql
SELECT p.dni, p.nomProf
FROM professors p
WHERE NOT EXISTS (
    SELECT *
    FROM assignacions a
    WHERE a.dni = p.dni           -- Connexió amb el professor de fora
      AND a.instantFi IS NULL     -- Condició d'assignació vigent
);
```

**Exemple 2B:** "...playlists tals que **el seu creador no tingui cap seguidor silenciat**."
Fora tinc la playlist `p` (que té l'atribut `p.creador`). Dins del `NOT EXISTS` busco a la taula `seguidors s` algú que segueixi aquest creador (`s.nomSeguit = p.creador`) i que estigui silenciat (`s.silenciat = 0`).
```sql
SELECT p.idList, p.nomList
FROM playlist p
WHERE NOT EXISTS (
    SELECT *
    FROM seguidors s
    WHERE s.nomSeguit = p.creador -- Connexió amb el creador de fora
      AND s.silenciat = 0         -- Condició de silenciat
);
```

**Exemple 2C:** "Obtenir el nom dels professors que **no han estat mai assignats a cap despatx de superfície superior a 20 metres quadrats**."
Què és el que tenen prohibit aquests professors? Tenir una assignació `a` en un despatx `d` amb `d.superficie > 20`. Per tant, poso el `JOIN` entre `assignacions` i `despatxos` a dins del `NOT EXISTS`.
```sql
SELECT p.nomProf
FROM professors p
WHERE NOT EXISTS (
    SELECT *
    FROM assignacions a 
    JOIN despatxos d ON (a.modul = d.modul AND a.numero = d.numero)
    WHERE a.dni = p.dni           -- Connexió amb el professor de fora
      AND d.superficie > 20       -- Condició prohibida
);
```

---

### Enunciats tipus ("Tots els...", "Sempre...", "Únicament...")

En SQL no existeix la paraula `FOR ALL` ("per a tots"), així que s'expressa amb una **doble negació** usant **`NOT EXISTS (... WHERE NOT Y)`** (invertint el signe de la condició a dins: `=` passa a `<>`, `>` passa a `<=`, `IS NOT NULL` passa a `IS NULL`).

**Enunciats típics:** *"on tots els X compleixen Y"*, *"que únicament / exclusivament han fet Y"*.

**Exemple 3A:** "Obtenir el DNI dels professors que tenen alguna assignació i tals que **totes les seves assignacions són al mòdul 'Omega'**."
"Tenen alguna assignació" $\rightarrow$ els agafo de la taula `assignacions a`. "Totes són a 'Omega'" $\rightarrow$ **No existeix** cap altra assignació `a2` d'aquest mateix professor (`a2.dni = a.dni`) on el mòdul **NO sigui** `'Omega'` (`a2.modul <> 'Omega'`).
```sql
SELECT DISTINCT a.dni
FROM assignacions a
WHERE NOT EXISTS (
    SELECT *
    FROM assignacions a2
    WHERE a2.dni = a.dni          -- Mateix professor
      AND a2.modul <> 'Omega'     -- Condició INVERTIDA! (alguna fora d'Omega)
);
```

**Exemple 3B:** "Obtenir l'identificador de les playlists on **totes les cançons que hi ha tenen més de 1000 reproduccions totals** (`numTotalReproduccions > 1000`)."
"Totes tenen $> 1000$" es tradueix com: **No existeix** cap cançó dins d'aquesta playlist que tingui **$\le 1000$** reproduccions (`c.numTotalReproduccions <= 1000`).
```sql
SELECT p.idList, p.nomList
FROM playlist p
WHERE NOT EXISTS (
    SELECT *
    FROM cançonsAPlaylist cp 
    JOIN cançons c ON cp.idCanço = c.idCanço
    WHERE cp.idList = p.idList              -- Connexió amb la playlist de fora
      AND c.numTotalReproduccions <= 1000   -- Condició INVERTIDA! (<= en lloc de >)
);
```

---

### Enunciats tipus ("Només un únic...", "El mateix per a tots...")

Quan l'enunciat diu que un element **només pot estar relacionat amb un únic** altre element, a la consulta de fora trobem l'element amb el seu relacionat `a`, i amb un **`NOT EXISTS`** comprovem que no n'existeixi cap altre amb un identificador diferent (`a2.dni != a.dni`).

**Enunciats típics:** *"despatxos que només han tingut un únic professor"*, *"playlists on totes les cançons són d'un únic cantant"*.

**Exemple 4A:** "Obtenir els despatxos (`modul, numero`) i el DNI del professor per als despatxos que **només han tingut un únic professor assignat** al llarg del temps."
Comprovem que al mateix despatx no hi hagi hagut cap altre professor amb un DNI diferent.
```sql
SELECT DISTINCT a.modul, a.numero, a.dni
FROM assignacions a
WHERE NOT EXISTS (
    SELECT *
    FROM assignacions a2
    WHERE a2.modul = a.modul      -- Mateix mòdul
      AND a2.numero = a.numero    -- Mateix número de despatx
      AND a2.dni != a.dni         -- Però un professor DIFERENT!
);
```

**Exemple 4B:** "...despatxos que **només han tingut un únic professor assignat amb un sou superior a 1000**..."
És idèntic a l'exemple 4A, però la condició `sou > 1000` ha de complir-la tant el professor de fora (`p.sou > 1000`) com el possible segon professor intrús de dins del `NOT EXISTS` (`p2.sou > 1000`).
```sql
SELECT DISTINCT a.modul, a.numero, p.nomProf
FROM assignacions a JOIN professors p ON a.dni = p.dni
WHERE p.sou > 1000                -- El nostre professor cobra > 1000
  AND NOT EXISTS (
      SELECT *
      FROM assignacions a2 JOIN professors p2 ON a2.dni = p2.dni
      WHERE p2.sou > 1000         -- L'altre professor també cobra > 1000
        AND a2.modul = a.modul    -- Mateix mòdul
        AND a2.numero = a.numero  -- Mateix número
        AND a2.dni != a.dni       -- Però és un professor DIFERENT!
  );
```

**Exemple 4C:** "Obtenir el nom de les playlists i el cantant per a aquelles playlists que **només tenen cançons d'un únic cantant**."
A fora ajunto la playlist amb les seves cançons per veure'n el cantant `c.cantant`. A dins del `NOT EXISTS`, busco si en aquella mateixa playlist (`cp2.idList = p.idList`) hi ha alguna cançó amb un cantant diferent (`c2.cantant <> c.cantant`).
```sql
SELECT DISTINCT p.nomList, c.cantant
FROM playlist p
NATURAL INNER JOIN cançonsAPlaylist cp
NATURAL INNER JOIN cançons c
WHERE NOT EXISTS (
    SELECT *
    FROM cançonsAPlaylist cp2 
    NATURAL INNER JOIN cançons c2
    WHERE cp2.idList = p.idList       -- Mateixa playlist
      AND c2.cantant <> c.cantant     -- Però un cantant DIFERENT!
);
```

**Exemple combinat (4B + 1B):** "Obtenir els despatxos que **només han tingut un únic professor assignat amb un sou superior a 1000** i que, a més, **el mateix professor ha estat assignat al mateix despatx en 3 o més períodes diferents**."
Combinem el filtre d'exclusivitat al `WHERE` (Exemple 4B) amb l'agrupació i recompte al `GROUP BY ... HAVING` (Exemple 1B).
```sql
SELECT a.modul, a.numero, p.nomProf, COUNT(*) AS numVegades
FROM assignacions a JOIN professors p ON a.dni = p.dni
WHERE p.sou > 1000 
  AND NOT EXISTS (
      SELECT *
      FROM assignacions a2 JOIN professors p2 ON a2.dni = p2.dni
      WHERE p2.sou > 1000
        AND a2.modul = a.modul 
        AND a2.numero = a.numero
        AND a2.dni != a.dni
  )
GROUP BY a.modul, a.numero, p.nomProf
HAVING COUNT(*) >= 3;
```

---

### Àlgebra Relacional
Sense duplicats per definició. S'escriu en seqüència pas a pas ($A = \dots, R = \dots$).

| Operador | Sintaxi | Descripció |
| :--- | :---: | :--- |
| **Selecció / Projecció** | $T(\text{cond})$ / $T[A, B]$ | Filtra files / Retalla columnes. |
| **Reanomenament** | $T\{A \to B\}$ | Canvia nom d'atributs (necessari per a $\cup, \cap, -$ o auto-joins). |
| **Joins** | $T[\text{cond}]S$ / $T * S$ | $\theta$-Join (amb condició) / Natural Join (mateix nom d'atributs). |
| **Conjunts** | $T \cup S$, $T - S$, $T \cap S$ | Esquemes idèntics (mateix grau i noms d'atribut). |

---

## 2. DDL i DML

### Definició de taules (`CREATE TABLE`) i Integritat
- **Restriccions:** `NOT NULL`, `UNIQUE` (admet nuls), `PRIMARY KEY` (`NOT NULL` + `UNIQUE`), `REFERENCES taula(pk)` (`FOREIGN KEY`), `CHECK (condició)`.
- **Polítiques de Clau Forana (`ON DELETE` / `ON UPDATE`):**
  - `RESTRICT` / `NO ACTION`: Bloqueja l'operació si hi ha fills *(per defecte)*.
  - `CASCADE`: Propaga l'esborrat o modificació als fills.
  - `SET NULL`: Posa la FK a `NULL` (requereix que la FK admeti nuls).

### Manipulació de dades (DML)
- `INSERT INTO taula [(cols)] VALUES (...)` o `INSERT INTO taula SELECT ...`
- `DELETE FROM taula [WHERE ...]` *(sense `WHERE` buida tota la taula)*.
- `UPDATE taula SET col = val [WHERE ...]` *(una subconsulta al `SET` ha de retornar 1 sola fila i columna)*.

---

## 3. Components Lògics i Seguretat

### Dominis, Assercions i Transaccions
- **`CREATE DOMAIN dom AS tipus [DEFAULT v] [CHECK (VALUE ...)]`:** Tipus reutilitzable.
- **On posar cada restricció:**
  - 1 columna $\to$ `CHECK` de columna.
  - Múltiples columnes de la **mateixa fila** $\to$ `CHECK` de taula (implicació $A \to B \equiv \neg A \lor B$).
  - Múltiples files o taules $\to$ `CREATE ASSERTION nom CHECK (NOT EXISTS (SELECT ... infractors))`.
- **Transaccions:** `START TRANSACTION`, `COMMIT` (desa), `ROLLBACK` (desfà). Aïllament màxim: `SERIALIZABLE`.

### Vistes (`CREATE VIEW`)
- **Actualitzables (SQL estàndard):** Només si es defineixen sobre **1 sola taula** (sense `JOIN`, `UNION`, `GROUP BY`, `HAVING`, `DISTINCT` ni agregacions) i projecten columnes simples. Per a `INSERT`, cal incloure totes les columnes `NOT NULL` sense `DEFAULT`.
- **`WITH CHECK OPTION`:** Impedeix fer `INSERT`/`UPDATE` a través de la vista si la fila resultant deixa de complir el `WHERE` de la vista.

### Privilegis (`GRANT` / `REVOKE`)
- `GRANT priv ON obj TO usuari [WITH GRANT OPTION]` (`SELECT`, `INSERT`, `UPDATE(col)`, `DELETE`, `REFERENCES`).
- `REVOKE priv ON obj FROM usuari [CASCADE | RESTRICT]` (`CASCADE` revoca en cadena llevat que l'usuari tingui un camí alternatiu vàlid al graf).
- **Regla d'or:** Un `UPDATE` o `DELETE` amb `WHERE col = x` exigeix permís d'`UPDATE`/`DELETE` **i també `SELECT` sobre `col`**.
- **Privacitat per fila/usuari:** Crear una vista amb `WHERE usuari = CURRENT_USER` i donar `GRANT` sobre la vista.

---

## 6. Disseny Conceptual (UML $\to$ Relacional)

### Traducció d'Estructures UML

| Element UML | Traducció al Model Relacional |
| :--- | :--- |
| **Classe** | Taula amb la clau externa com a `PRIMARY KEY`. |
| **Atribut multivaluat `[*]`** | Es transforma en una nova classe amb associació **1\:N**. |
| **Associació 1\:N** | FK al costat **«molts»** (`*`). Si el mínim del costat «un» és `1`, la FK és `NOT NULL`. |
| **Associació 1\:1** | FK a qualsevol dels dos costats (preferible al costat `1..1`) amb restricció **`UNIQUE`**. |
| **Associació M\:N** | Nova taula amb $\text{PK} = (\text{FK}_1, \text{FK}_2)$. |
| **Associació Ternària** | Nova taula:<li>Si és $* - * - *$: $\text{PK} = (A, B, C)$.</li><li>Si és $* - * - 0..1$: $\text{PK} = (A, B)$ i $C$ és FK `NOT NULL`.</li><li>Si és $* - 0..1 - 0..1$: $\text{PK} = (A, B)$ i $(A, C)$ és `UNIQUE NOT NULL`.</li> |
| **Associació Recursiva** | **1\:N:** FK a la mateixa taula (`dni_cap`). **M\:N:** Nova taula amb dues FK a la mateixa taula. |
| **Classe Associativa** | Els seus atributs s'afegeixen a la taula de l'associació. |
| **Herència** | 1 taula per a la superclasse + 1 per a cada subclasse amb $\text{PK} = \text{FK}$ apuntant a la superclasse. |
| **Classe feble** | $\text{PK}$ composta per la PK de la classe forta + el seu identificador relatiu. |
| **Classe temporal pura** | No crea taula; es tradueix com a atribut `DATE`/`TIME`/`INT` a la taula associada. |

### Validació d'Afirmacions UML (Cert / Fals)
- **CERTA:** Es demostra construint una instància mínima de files que compleixi totes les PK, FK i multiplicitats.
- **FALSA:** Viola una multiplicitat màxima (`1`), mínima (`1`) o clau externa. S'arregla canviant la multiplicitat (`1` $\to$ `*` o `1` $\to$ `0`) o fent la clau relativa.
