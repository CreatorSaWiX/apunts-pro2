---
title: "Tema 4: PL/pgSQL"
description: "Estructura, retorn escalar i SETOF, CREATE TYPE, variables (%TYPE), control de flux (IF, FOUND, FOR), gestió d'errors (EXCEPTION)"
readTime: "12 min"
order: 8
draft: false
isUpdated: 1
---

Fins ara, amb SQL només podíem fer consultes o modificacions d'una en una (`SELECT`, `INSERT`, `UPDATE`...). Però SQL tot sol no té variables, ni `if/else`, ni bucles.

Un **procediment emmagatzemat** (o funció en **PL/pgSQL**) és bàsicament un petit programa que guardem **directament dins del servidor de la base de dades** (PostgreSQL). En lloc que la nostra aplicació hagi d'enviar 20 consultes per xarxa i processar-les fora, ho fem tot en un sol bloc dins l'SGBD:

- **Menys tràfic de xarxa:** s'executa tot dins la BD i només retorna el resultat final.
- **Regles centralitzades:** qualsevol aplicació que accedeixi a la BD comparteix la mateixa lògica i seguretat.

---

## 4.1. Estructura bàsica i execució

Una funció en PL/pgSQL sempre segueix aquesta plantilla:

```sql [Plantilla d'una funció]
CREATE [OR REPLACE] FUNCTION nom_funcio(nom_param tipus [, ...])
RETURNS tipus_retorn AS $$
DECLARE
    -- (Opcional) Variables locals que només existeixen dins la funció
BEGIN
    -- Cos: sentències SQL i lògica PL/pgSQL (IF, FOR, etc.)
    RETURN valor;
END;
$$ LANGUAGE plpgsql;
```

Què vol dir cada part?
- `CREATE OR REPLACE`: crea la funció, o la sobreescriu si ja existeix (molt útil mentre proves codi!).
- `RETURNS tipus_retorn`: indica què tornarà la funció en acabar (un número, un text, una fila, o `void` si no torna res).
- `$$ ... $$`: són simplement les "cometes" que delimiten el bloc de codi perquè no hagis d'escapar les cometes simples (`'`) de dins.
- `DECLARE`: on crees les variables. Si no en necessites cap, pots ometre aquesta secció.
- `BEGIN ... END;`: on va el codi que s'executa.

```sql [Exemple: sumar dos números]
CREATE OR REPLACE FUNCTION sumar(a INT, b INT)
RETURNS INT AS $$
BEGIN
    RETURN a + b;
END;
$$ LANGUAGE plpgsql;
```

Un cop creada, la funció queda guardada a la BD. La pots cridar des de SQL, des d'una altra funció o des d'una aplicació:

```sql [Com executar i esborrar funcions]
SELECT sumar(3, 5);                   -- Retorna 8 (ideal per a valors únics)
SELECT * FROM nom_funcio('paràmetre'); -- Recomanat quan retorna múltiples files (SETOF) o columnes

DROP FUNCTION sumar(INT, INT);        -- Per esborrar-la (cal indicar els tipus dels paràmetres)
```

<!-- :::plpgsqlviz 
::: -->

---

## 4.2. Variables i assignacions

Totes les variables declarades a `DECLARE` són locals (només existeixen mentre s'executa la funció). Si no els dones cap valor inicial, valen **`NULL`** per defecte.

```sql [Sintaxi de declaració]
nom_var [CONSTANT] tipus [NOT NULL] [{DEFAULT | :=} expressio];
```

Un truc molt útil i recomanat als exàmens és **`%TYPE`**:

```sql
dni_client clients.dni%TYPE; -- Copia automàticament el tipus de la columna 'dni' de 'clients'
```

Això evita haver de recordar si `dni` era `CHAR(9)` o `VARCHAR(9)`: si mai canvia a la taula, la funció s'adapta sola.

### Com donar valor a una variable?

1. **Assignació directa:** `total := preu * quantitat;` (fixa't en els dos punts `:=`, en PL/pgSQL es fa servir `:=` per assignar, no només `=`).
2. **Des d'una consulta (`SELECT ... INTO`):**
   En SQL normal, un `SELECT` mostra resultats per pantalla. En PL/pgSQL, un `SELECT` no pot quedar "a l'aire": has de guardar el resultat dins d'una variable fent servir `INTO`.
   ```sql
   SELECT carrer, num_carrer INTO dadesCli FROM clients WHERE dni = dni_client;
   ```
   *(També funciona amb una subconsulta escalar: `qtt := (SELECT qtt_com FROM clients WHERE dni = dni_client);`)*
3. **Cridant una altra funció:** `imp := import_una_com(num_com);`

L'assignació amb `SELECT ... INTO` (o subconsulta `:= (SELECT ...)`) **només funciona si la consulta retorna com a màxim 1 fila**. Si retorna 2 o més files, PostgreSQL llançarà un error en temps d'execució! Si esperes múltiples files, has d'usar un bucle `FOR`.

<!-- :::varviz -->
<!-- ::: -->

---

## 4.3. Sentències iteratives (bucles)

El bucle estrella a PL/pgSQL (i pràcticament l'únic que faràs servir a laboratori i exàmens) és **`FOR ... IN SELECT`**. Executa una consulta i va guardant fila a fila dins la variable del bucle automàticament:

```sql [Recórrer els resultats d'un SELECT fila a fila]
CREATE OR REPLACE FUNCTION import_totes_com(dni_client clients.dni%TYPE)
RETURNS void AS $$
DECLARE
    num_comanda  comandes.num_com%TYPE;
    import       comandes.import_total%TYPE;
BEGIN
    -- Per cada comanda del client, en calculem l'import i actualitzem la taula
    FOR num_comanda IN SELECT num_com FROM comandes WHERE dni = dni_client LOOP
        SELECT SUM(ic.quantitat * i.preu_unitat) INTO import
        FROM items_comanda ic, items i
        WHERE i.num_item = ic.num_item AND ic.num_com = num_comanda;

        UPDATE comandes SET import_total = import WHERE num_com = num_comanda;
    END LOOP;
END;
$$ LANGUAGE plpgsql;
```

*(Nota: si el `SELECT` del `FOR` retorna **més d'una columna**, la variable del bucle no pot ser un tipus simple com `INT`; ha de ser d'un tipus compost `CREATE TYPE` o bé de tipus `RECORD`.)*

<!-- :::forloopviz -->
<!-- ::: -->

### Altres tipus de bucles (menys habituals)

```sql
FOR i IN [REVERSE] 1..10 LOOP ... END LOOP;        -- Per recórrer un rang [1, 10]
WHILE condicio LOOP ... END LOOP;                  -- Mentre es compleixi la condició
LOOP ... EXIT WHEN condicio; END LOOP;             -- Bucle infinit fins que es compleix EXIT WHEN
```

*(Els **cursors explícits** amb `DECLARE ... CURSOR FOR`, `OPEN`, `FETCH` i `CLOSE` no s'utilitzen a laboratori ni entren als exàmens; sempre s'usa `FOR ... IN SELECT`.)*

---

## 4.4. Condicionals (`IF`) i la variable `FOUND`

La sintaxi del condicional és molt directa (vigila que s'escriu **`ELSIF`**, sense la segona "e"):

```sql [Estructura IF / ELSIF / ELSE]
IF condicio THEN
    -- sentències
ELSIF altra_condicio THEN
    -- sentències
ELSE
    -- sentències
END IF;
```

### Què és `FOUND`?

`FOUND` és una variable booleana automàtica que PostgreSQL manté per a tu (comença a `False`). Cada vegada que executes una sentència SQL, PostgreSQL l'actualitza per dir-te **si la sentència ha trobat o afectat alguna fila**:

| Sentència executada | Quan queda `FOUND = True`? |
| :--- | :--- |
| `SELECT ... INTO` | Si ha trobat una fila (`False` si la consulta era buida). |
| `INSERT / UPDATE / DELETE` | Si ha modificat/esborrat/inserit **almenys 1 fila**. |
| `FOR ... IN SELECT` | **En sortir del bucle:** `True` si ha fet $\ge 1$ iteració; `False` si el `SELECT` no ha tornat res. |

### La trampa de `FOUND` amb el bucle `FOR`

Dins de cada volta d'un `FOR`, qualsevol `SELECT INTO` o `UPDATE` que facis anirà canviant el valor de `FOUND`. **Però en sortir del `END LOOP;`**, PostgreSQL sobreescriu `FOUND` perquè indiqui si el `FOR` ha iterat alguna vegada o no.

Això ens dona el **patró clàssic d'examen** per detectar quan una consulta `FOR` no ha trobat cap resultat:

```sql [Detectar resultat buit després d'un FOR]
FOR reg IN SELECT ... LOOP
    -- processem cada fila
END LOOP;

IF NOT FOUND THEN
    RAISE EXCEPTION 'No s''han trobat resultats';
END IF;
```

<!-- :::foundviz -->
<!-- ::: -->

---

## 4.5. Paràmetres, tipus de retorn (`SETOF`) i `CREATE TYPE`

Quan dissenyes una funció, el primer que has de decidir és **què retornarà**. Hi ha tres casos possibles:

| Cas | Què poses a `RETURNS`? | Com ho retorna el codi? |
| :--- | :--- | :--- |
| **Un sol valor (o una sola fila)** | `INT`, `VARCHAR`, `TNom`... | `RETURN variable;` (torna el valor i **acaba** la funció). |
| **No retorna res (només fa accions)** | `void` | Fa `INSERT`/`UPDATE`/`DELETE` i acaba (sense `RETURN` o amb `RETURN;`). |
| **Diverses files (com una taula)** | `SETOF tipus` o `SETOF TNom` | `RETURN NEXT variable;` per cada fila + `RETURN;` al final. |

### Cas 1: Retorn escalar (un sol valor)

```sql [Retorn d'un sol valor amb SELECT ... INTO]
CREATE OR REPLACE FUNCTION trobar_ciutat(dni_client VARCHAR(9))
RETURNS VARCHAR(15) AS $$
DECLARE
    ciutat_client VARCHAR(15);
BEGIN
    -- Guardem la columna 'ciutat' dins la variable 'ciutat_client'
    SELECT ciutat INTO ciutat_client
    FROM clients
    WHERE dni = dni_client;

    RETURN ciutat_client;
END;
$$ LANGUAGE plpgsql;
```

<!-- :::returnviz -->
<!-- ::: -->

### Cas 2: Retorn múltiple (`SETOF`) i tipus compostos (`CREATE TYPE`)

Abans de barrejar consultes i tipus nous, vegem com funciona `SETOF` amb un **bucle `FOR` molt senzill** que només retorna números:

```sql [Exemple senzill: un FOR bàsic amb SETOF INT]
CREATE OR REPLACE FUNCTION comptar_fins_5()
RETURNS SETOF INT AS $$
DECLARE
    i INT;
BEGIN
    FOR i IN 1..5 LOOP -- Recordem que IN és un rang [1,5]
        RETURN NEXT i; -- Afegeix cada número al resultat, però NO surt de la funció
    END LOOP;

    RETURN; -- Ara sí: indica que ja no hi ha més files i entrega els 5 números
END;
$$ LANGUAGE plpgsql;
```

Un cop vist això, què passa si vols retornar **diverses files** d'una consulta i, a més, **diverses columnes** (per exemple, `dni`, `nom` i un camp extra)? PostgreSQL necessita saber per avançat quina forma tindrà cada fila.

Si les columnes no coincideixen exactament amb cap taula existent, primer definim una "plantilla de fila" amb `CREATE TYPE`:

```sql [Definir un tipus compost i retornar-ne múltiples files]
-- 1. Creem el tipus compost (la forma que tindrà cada fila)
CREATE TYPE Tdades_client AS (
    dni_client  VARCHAR(9),
    nom_client  VARCHAR(15),
    pref        CHAR(1)
);

-- 2. Funció que retorna un conjunt (SETOF) d'aquest tipus
CREATE OR REPLACE FUNCTION clients_ciutat(ciutat_in clients.ciutat%TYPE)
RETURNS SETOF Tdades_client AS $$
DECLARE
    reg Tdades_client; -- Variable "fila" on accedirem als camps amb reg.camp
BEGIN
    FOR reg IN
        SELECT dni, nom, 'N' FROM clients WHERE ciutat = ciutat_in
    LOOP
        reg.pref := 'P'; -- Podem modificar un camp abans de retornar la fila
        RETURN NEXT reg; -- Afegeix la fila al resultat, PERÒ NO surt de la funció
    END LOOP;

    RETURN; -- Ara sí: indica que ja no hi ha més files i acaba la funció
END;
$$ LANGUAGE plpgsql;
```

Imagina que `RETURN NEXT reg;` és **posar un producte dins del carretó** (en pots posar tants com vulguis dins d'un bucle), i el `RETURN;` del final és **passar per caixa** i entregar totes les files acumulades de cop.


<!-- :::setofviz -->
<!-- ::: -->

---

## 4.6. Gestió d'errors (`EXCEPTION` i `RAISE EXCEPTION`)

Quan alguna cosa va malament dins una funció (per exemple, intentem inserir una clau duplicada o una clau forana que no existeix), PostgreSQL avorta l'execució. Per controlar aquests errors sense que el programa peti de manera lletja, posem una "xarxa de seguretat" al final del `BEGIN ... END`: el bloc **`EXCEPTION`**.

A més dels errors propis de la BD, nosaltres podem llançar els nostres propis errors quan no es compleixi una regla de negoci fent servir:
`RAISE EXCEPTION 'Missatge d''error amb valor: %', variable;`

### Errors més comuns (`WHEN ...`)

| Condició `WHEN` | `SQLSTATE` | Quan salta? |
| :--- | :---: | :--- |
| `raise_exception` | `P0001` | Quan el nostre codi executa `RAISE EXCEPTION '...'` |
| `not_null_violation` | `23502` | S'intenta posar `NULL` a una columna `NOT NULL` |
| `foreign_key_violation` | `23503` | El valor no existeix a la taula referenciada (o un esborrat està bloquejat) |
| `unique_violation` | `23505` | Clau primària (`PK`) o `UNIQUE` duplicada |
| `check_violation` | `23514` | S'incompleix una restricció `CHECK` de la taula |
| `OTHERS` | — | Qualsevol altre error no capturat més amunt |

Dins de cada `WHEN` tens dues variables automàtiques: `SQLSTATE` (el codi de 5 caràcters) i `SQLERRM` (el text del missatge d'error).

### Com funciona el bloc `EXCEPTION`? (Molt important!)

1. **Rollback automàtic del bloc:** Si salta una excepció dins d'un `BEGIN ... END`, PostgreSQL **desfà automàticament tots els `INSERT`, `UPDATE` i `DELETE` fets dins d'aquell `BEGIN`** abans d'entrar a l'`EXCEPTION`.
2. **Propagació:** Si dins d'un `WHEN` tornes a fer un `RAISE EXCEPTION`, la funció s'avorta immediatament i passa l'error cap a fora.

Posa **SEMPRE** `WHEN raise_exception` **abans** de `WHEN OTHERS`. Si poses `WHEN OTHERS` primer (o oblides posar `WHEN raise_exception`), `WHEN OTHERS` capturarà els teus propis `RAISE EXCEPTION` i en mascarejarà el missatge original.

### Exemple estàndard d'examen

```sql [Captura d'errors i missatges personalitzats]
CREATE OR REPLACE FUNCTION nova_linia(item INT, com INT, qtt INT)
RETURNS void AS $$
BEGIN
    -- Regla de negoci que no està al DDL de la taula: la validem amb IF
    IF (qtt < 12) THEN
        RAISE EXCEPTION 'Quantitat % inferior a 12', qtt;
    END IF;

    -- Si 'item' o 'com' no existeixen, saltarà 'foreign_key_violation' sola
    INSERT INTO items_comanda VALUES (item, com, qtt);
    RETURN;
EXCEPTION
    WHEN raise_exception THEN
        RAISE EXCEPTION '%', SQLERRM; -- Re-llança el nostre missatge intacte
    WHEN foreign_key_violation THEN
        RAISE EXCEPTION 'La comanda o el producte no existeixen';
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error intern: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;
```

<!-- :::exceptionviz -->
<!-- ::: -->

A banda d'avortar amb `RAISE EXCEPTION`, en alguns entorns existeixen altres estratègies com retornar un tipus `TError(codi, motiu)` sense avortar, guardar l'error en una taula d'auditoria `INSERT INTO t_errors`, o intentar recuperar-se automàticament de l'error dins del `WHEN`, tot i que als exàmens l'estàndard és capturar i re-llançar.


<!-- ## 4.7. Criteris de qualitat (què vigilar als exàmens)

Als exàmens no només miren que el codi funcioni, sinó que estigui ben escrit. Aquests són els **4 errors de disseny que penalitzen** i com evitar-los:

1. **Aprofita les restriccions del DDL (`PK`, `UNIQUE`, `FK`, `NOT NULL`, `CHECK`):**
   No facis un `SELECT` previ amb `IF EXISTS` per comprovar si una clau ja existeix o si una clau forana és vàlida. Fes l'`INSERT`/`UPDATE` directament i deixa que PostgreSQL ho comprovi; si falla, ho captures a l'`EXCEPTION` (`unique_violation`, `foreign_key_violation`, etc.).
   - ❌ `SELECT * INTO ...; IF FOUND THEN RAISE EXCEPTION ...; END IF; INSERT INTO ...;`
   - ✅ `INSERT INTO ...;` i capturar `WHEN unique_violation THEN RAISE EXCEPTION ...;`
   *(Només fem `IF ... RAISE EXCEPTION` per a regles que NO estan definides al DDL de les taules).*

2. **No facis `SELECT` previs abans d'`UPDATE` o `DELETE`:**
   No comprovis abans si la fila existeix. Executa l'`UPDATE` o `DELETE` directament i comprova `IF NOT FOUND` just després!
   - ❌ `IF NOT EXISTS (SELECT ... WHERE id = x) THEN RAISE EXCEPTION ...; END IF; DELETE ...;`
   - ✅ `DELETE FROM taula WHERE id = x; IF NOT FOUND THEN RAISE EXCEPTION ...; END IF;`

3. **No facis `JOIN` innecessaris:**
   Si la taula filla ja té la columna que necessites (per exemple, una clau forana com `modul` i `numero` a `assignacions`), agafa-la directament d'allà sense fer `JOIN` amb la taula pare (`despatxos`).

4. **No emmascaris els teus `RAISE EXCEPTION`:**
   Recorda posar `WHEN raise_exception THEN RAISE EXCEPTION '%', SQLERRM;` **abans** de `WHEN OTHERS`. -->
