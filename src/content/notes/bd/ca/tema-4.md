---
title: "Tema 4: PL/pgSQL"
description: "Procediments emmagatzemats a PostgreSQL: estructura, retorn escalar i SETOF, CREATE TYPE, variables (%TYPE), control de flux (IF, FOUND, FOR), gestió d'errors (EXCEPTION) i criteris de qualitat."
readTime: "8 min"
order: 8
draft: false
---

Un **procediment emmagatzemat** (o funció) és un bloc de codi guardat dins l'SGBD. Redueix el tràfic de xarxa, centralitza regles de negoci, simplifica les aplicacions i controla les operacions dels usuaris sobre la BD.

---

## 4.1. Estructura bàsica i execució

```sql
CREATE [OR REPLACE] FUNCTION nom_funcio(nom_param tipus [, ...])
RETURNS tipus_retorn AS $$
DECLARE
    -- Variables locals
BEGIN
    -- Cos: sentències SQL i PL/pgSQL
    RETURN valor;
END;
$$ LANGUAGE plpgsql;

DROP FUNCTION nom_funcio(tipus_param); -- Esborrat
```

Es pot cridar des d'SQL interactiu, des d'un altre procediment o des d'una aplicació:

```sql
SELECT nom_funcio('paràmetre');
SELECT * FROM nom_funcio('paràmetre'); -- Recomanat per a SETOF o tipus compostos
```

:::plpgsqlviz
:::

---

## 4.2. Paràmetres, tipus de retorn (`SETOF`) i `CREATE TYPE`

| Cas | `RETURNS` | Com retorna? |
| :--- | :--- | :--- |
| **Valor únic / fila composta** | `tipus` o `TNom` | `RETURN variable;` (acaba la funció). |
| **Sense retorn** | `void` | Només accions (`INSERT`, `UPDATE`, `DELETE`). |
| **Conjunt de tuples** | `SETOF tipus` o `SETOF TNom` | `RETURN NEXT variable;` per cada fila (no acaba) + `RETURN;` final. |

### Retorn escalar

```sql
CREATE OR REPLACE FUNCTION trobar_ciutat(dni_client VARCHAR(9))
RETURNS VARCHAR(15) AS $$
DECLARE
    ciutat_client VARCHAR(15);
BEGIN
    SELECT ciutat INTO ciutat_client FROM clients WHERE dni = dni_client;
    RETURN ciutat_client;
END;
$$ LANGUAGE plpgsql;
```

:::returnviz
:::

### Tipus compostos (`CREATE TYPE`) i retorn múltiple (`SETOF`)

Quan una funció retorna diverses columnes que no corresponen a una taula existent, es defineix prèviament un `TYPE` i s'accedeix als camps amb `variable.camp`:

```sql
CREATE TYPE Tdades_client AS (
    dni_client  VARCHAR(9),
    nom_client  VARCHAR(15),
    pref        CHAR(1)
);

CREATE OR REPLACE FUNCTION clients_ciutat(ciutat_in clients.ciutat%TYPE)
RETURNS SETOF Tdades_client AS $$
DECLARE
    reg Tdades_client;
BEGIN
    FOR reg IN
        SELECT dni, nom, 'N' FROM clients WHERE ciutat = ciutat_in
    LOOP
        reg.pref := 'P';
        RETURN NEXT reg; -- Afegeix la fila al resultat sense sortir
    END LOOP;
    RETURN;              -- Finalitza la funció
END;
$$ LANGUAGE plpgsql;
```

:::setofviz
:::

---

## 4.3. Variables i assignacions

Totes les variables declarades a `DECLARE` són locals i viuen en memòria volàtil:

```sql
nom_var [CONSTANT] tipus [NOT NULL] [{DEFAULT | :=} expressio];
dni_client clients.dni%TYPE; -- Hereta automàticament el tipus de la columna
```

- Sense inicialitzar, prenen valor **`NULL`**. Si porten `NOT NULL`, és obligatori assignar-hi un valor inicial (`DEFAULT` o `:=`).
- **Assignacions (només vàlides si retornen com a màxim 1 fila):**
  - Directa o escalar: `var := expressio;` o `qtt := (SELECT qtt_com FROM clients WHERE dni = dni_client);`
  - Consulta: `SELECT carrer, num_carrer INTO dadesCli FROM clients WHERE dni = dni_client;`
  - Crida a funció: `imp := import_una_com(num_com);`

:::varviz
:::

---

## 4.4. Condicionals (`IF`) i variable `FOUND`

```sql
IF condicio THEN
    -- sentències
ELSIF condicio THEN
    -- sentències
ELSE
    -- sentències
END IF;
```

`FOUND` és una variable booleana local (inicia en `False`) que indica si la darrera sentència SQL ha tingut efecte:

| Sentència | Quan queda `FOUND = True`? |
| :--- | :--- |
| `SELECT ... INTO` | Si retorna una fila (`False` si no en troba cap). |
| `INSERT / UPDATE / DELETE` | Si afecta almenys una fila. |
| `FOR ... IN SELECT` | **En sortir del bucle:** `True` si ha iterat $\ge 1$ vegada; `False` si 0 vegades. |

**Compte amb `FOUND` dins i després d'un `FOR`:**
- Dins de cada iteració del `FOR`, qualsevol `SELECT ... INTO` o `UPDATE` modifica `FOUND`, però en sortir del `FOR` es reescriu segons si s'ha iterat o no.
- Patró típic d'examen per detectar resultats buits després d'un `FOR`:

```sql
FOR reg IN SELECT ... LOOP
    RETURN NEXT reg;
END LOOP;
IF NOT FOUND THEN
    RAISE EXCEPTION 'No s''han trobat resultats';
END IF;
```

:::foundviz
:::

---

## 4.5. Sentències iteratives (bucles)

**Bucle `FOR` sobre consulta SQL (el que s'usa a laboratori i exàmens):**

```sql
CREATE OR REPLACE FUNCTION import_totes_com(dni_client clients.dni%TYPE)
RETURNS void AS $$
DECLARE
    num_comanda  comandes.num_com%TYPE;
    import       comandes.import_total%TYPE;
BEGIN
    FOR num_comanda IN SELECT num_com FROM comandes WHERE dni = dni_client LOOP
        SELECT SUM(ic.quantitat * i.preu_unitat) INTO import
        FROM items_comanda ic, items i
        WHERE i.num_item = ic.num_item AND ic.num_com = num_comanda;

        UPDATE comandes SET import_total = import WHERE num_com = num_comanda;
    END LOOP;
END;
$$ LANGUAGE plpgsql;
```

*(Si el `SELECT` del `FOR` projecta més d'una columna, la variable del bucle ha de ser d'un tipus compost `CREATE TYPE` o `RECORD`.)*

:::forloopviz
:::

**Altres bucles:**

```sql
FOR i IN [REVERSE] 1..10 LOOP ... END LOOP;        -- Nombre conegut d'iteracions
WHILE condicio LOOP ... END LOOP;                  -- Reavalua la condició a cada pas
LOOP ... EXIT WHEN condicio; END LOOP;             -- Bucle incondicional
```

*(Nota: els **cursors explícits** (`DECLARE ... CURSOR FOR`, `OPEN`, `FETCH`, `CLOSE`) no s'utilitzen a laboratori ni surten als exàmens; s'usa sempre `FOR ... IN SELECT`.)*

---

## 4.6. Gestió d'errors (`EXCEPTION` i `RAISE EXCEPTION`)

Es poden produir errors del propi SGBD o errors d'usuari llançats amb `RAISE EXCEPTION`:

| Condició `WHEN` | `SQLSTATE` | Quan salta? |
| :--- | :---: | :--- |
| `raise_exception` | `P0001` | Quan el codi executa `RAISE EXCEPTION '...'` |
| `not_null_violation` | `23502` | Inserció/modificació amb `NULL` en columna `NOT NULL` |
| `foreign_key_violation` | `23503` | Valor inexistent a la taula referenciada (o esborrat bloquejat) |
| `unique_violation` | `23505` | Duplicat de `PRIMARY KEY` o `UNIQUE` |
| `check_violation` | `23514` | Incompliment d'una restricció `CHECK` |
| `OTHERS` | — | Qualsevol altre error no capturat prèviament |

Dins de cada branca `WHEN` estan disponibles `SQLSTATE` (codi de 5 caràcters) i `SQLERRM` (missatge).

**Regles crítiques del bloc `EXCEPTION`:**
1. En capturar-se una excepció dins d'un bloc `BEGIN ... END`, **es desfan totes les modificacions SQL fetes dins d'aquell `BEGIN`** abans d'executar el `EXCEPTION`.
2. **Posar sempre `WHEN raise_exception` abans de `WHEN OTHERS`:** si no es fa, `WHEN OTHERS` interceptarà els `RAISE EXCEPTION` propis i en sobreescriurà el missatge!
3. Si dins d'un bloc `EXCEPTION` es llança una altra excepció (`RAISE EXCEPTION`), el procediment s'avorta immediatament i la propaga cap amunt.

```sql
-- Estratègia estàndard d'examen (Opció 1: captura i re-llançament amb missatge propi)
CREATE OR REPLACE FUNCTION nova_linia(item INT, com INT, qtt INT)
RETURNS void AS $$
BEGIN
    IF (qtt < 12) THEN
        RAISE EXCEPTION 'Quantitat % inferior a 12', qtt;
    END IF;
    INSERT INTO items_comanda VALUES (item, com, qtt);
    RETURN;
EXCEPTION
    WHEN raise_exception THEN
        RAISE EXCEPTION '%', SQLERRM; -- Re-llança el missatge propi sense alterar-lo
    WHEN foreign_key_violation THEN
        RAISE EXCEPTION 'La comanda o el producte no existeixen';
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error intern: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;
```

:::exceptionviz
:::

**Altres estratègies (teòriques):**
- **Retorn d'objecte d'error (`TError(codi, motiu)`):** retorna codi `'0'` si té èxit o `SQLSTATE`/`SQLERRM` si falla (sense avortar).
- **Taula d'errors (`INSERT INTO t_errors`):** registra `SQLSTATE` i `SQLERRM` a una taula d'auditoria i retorna normalment.
- **Recuperació automàtica:** resol la causa dins del `WHEN` (ex: `WHEN undefined_table THEN CREATE TABLE ...`), poc habitual.

---

## 4.7. Criteris de qualitat en PL/pgSQL

Als exàmens es penalitza (i es demana explícitament corregir) incomplir aquests criteris:

1. **Aprofitar les restriccions declaratives del DDL (`PK`, `UNIQUE`, `FK`, `NOT NULL`, `CHECK`):** No fer `SELECT` previs amb `IF EXISTS` / `IF NOT EXISTS` per validar claus o restriccions abans d'un `INSERT`/`UPDATE`. Executa la sentència directament i captura `foreign_key_violation`, `unique_violation`, `not_null_violation` o `check_violation` al bloc `EXCEPTION`. *(Només cal `IF ... RAISE EXCEPTION` per a regles que NO són al DDL.)*
2. **Sense `SELECT` previs abans d'`UPDATE` o `DELETE`:** No comprovis amb `IF EXISTS (SELECT ...)` si existeixen files a modificar; executa l'`UPDATE`/`DELETE` directe (i usa `IF NOT FOUND` si cal comprovar si s'ha modificat alguna fila).
3. **Sense taules innecessàries:** No facis `JOIN` amb taules pare si la taula filla ja té totes les columnes que necessites (ex: agafar `modul, numero` directament d'`assignacions` sense fer `JOIN` amb `despatxos` ni `professors`).
4. **No emmascarar `RAISE EXCEPTION` propis:** Posa sempre `WHEN raise_exception THEN RAISE EXCEPTION '%', SQLERRM;` abans de `WHEN OTHERS`.
