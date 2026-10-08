---
title: "Tema 4: PL/pgSQL"
description: "Estructura de funcions a PostgreSQL, paràmetres, retorn escalar i conjunt de tuples (SETOF), variables (%TYPE i nous tipus), control de flux (IF, FOUND, FOR, WHILE) i gestió d'errors (EXCEPTION, RAISE EXCEPTION)."
readTime: "9 min"
order: 4
draft: true
---

Un **procediment emmagatzemat** (o funció) és un bloc de codi estructurat que s'emmagatzema i s'executa directament dins de l'SGBD com un objecte de la base de dades.

* **Avantatges:** Redueix el tràfic de xarxa entre client i servidor, centralitza les regles de negoci i optimitza el rendiment d'operacions complexes.
* **Llenguatge:** A PostgreSQL s'utilitza **PL/pgSQL**, que combina instruccions SQL amb estructures de control imperatiu (variables, condicions, bucles i excepcions).

---

## 4.1. Estructura bàsica d'una funció

```sql [Sintaxi general]
CREATE FUNCTION nom_funcio(nom_param tipus [, ...]) 
RETURNS tipus_retorn AS $$
DECLARE
    -- Declaració de variables locals
BEGIN
    -- Cos de la funció: sentències SQL i PL/pgSQL
    RETURN valor;
END;
$$ LANGUAGE plpgsql;

-- Esborrat de la funció:
DROP FUNCTION nom_funcio(tipus_param);
```

### Invocació d'una funció:
Es pot cridar de manera interactiva des d'una consulta SQL, des d'un programa extern (JDBC) o des d'un altre procediment:
```sql
SELECT nom_funcio('paràmetre');
SELECT * FROM nom_funcio('paràmetre');
```

---

## 4.2. Paràmetres i tipus de retorn

### 1. Retorn d'un valor únic (o una tupla)
Utilitza `RETURNS tipus` i finalitza amb la sentència `RETURN variable;`:

```sql [Exemple: Retorn escalar]
CREATE FUNCTION trobar_ciutat(dni_client VARCHAR(9)) 
RETURNS VARCHAR(15) AS $$
DECLARE
    ciutat_client VARCHAR(15);
BEGIN
    SELECT ciutat INTO ciutat_client
    FROM clients
    WHERE dni = dni_client;

    RETURN ciutat_client;
END;
$$ LANGUAGE plpgsql;
```

### 2. Funció sense retorn (`void`)
Quan la funció només executa accions d'actualització (`INSERT`, `UPDATE`, `DELETE`):
```sql
CREATE FUNCTION actualitzar_estat(codi_comanda INT) 
RETURNS void AS $$
BEGIN
    UPDATE comandes SET data_arribada = CURRENT_DATE WHERE num_com = codi_comanda;
END;
$$ LANGUAGE plpgsql;
```

### 3. Retorn d'un conjunt de tuples (`SETOF`)
Quan la funció ha de retornar múltiples files:
* S'especifica `RETURNS SETOF tipus`.
* S'utilitza la clàusula **`RETURN NEXT variable;`** a cada fila generada (no interromp l'execució de la funció).
* La funció finalitza amb un **`RETURN;`** buit.

```sql [Exemple: Generar una seqüència de tuples]
CREATE FUNCTION exemple_retorn_n_tuples(max INTEGER) 
RETURNS SETOF INTEGER AS $$
DECLARE
    i INTEGER := 0;
BEGIN
    LOOP
        i := i + 1;
        RETURN NEXT i;           -- Afegeix el valor al resultat
        EXIT WHEN i = max;
    END LOOP;
    RETURN;                      -- Finalitza el procediment
END;
$$ LANGUAGE plpgsql;
```

---

## 4.3. Variables i creació de nous tipus

### Declaració de variables
Totes les variables locals es defineixen al bloc `DECLARE` i s'emmagatzemen a memòria volàtil:

```sql [Sintaxi de declaració]
nom_variable [CONSTANT] tipus [NOT NULL] [{DEFAULT | :=} expressio];
```

* **Sense inicialitzar:** Prenen valor `NULL` per defecte.
* **Amb `NOT NULL`:** És obligatori assignar-hi un valor per defecte (`DEFAULT` o `:=`).
* **Ús de `%TYPE`:** Hereta automàticament el tipus de dada d'una columna de la base de dades. Si el camp de la taula canvia de mida, la variable s'adapta sense tocar el codi:
  ```sql
  dni_client clients.dni%TYPE;
  ```

### Assignació de valors a variables
1. **Assignació directa:** `var := expressio;`
2. **Assignació mitjançant consulta (`SELECT ... INTO`):**
   ```sql
   SELECT ciutat INTO ciutat_client
   FROM clients
   WHERE dni = dni_client;
   ```
3. **Assignació del resultat d'una altra funció:**
   ```sql
   imp_comanda := import_una_com(numero_com);
   ```

### Creació de tipus compostos (`CREATE TYPE`)
Quan una funció ha de retornar una estructura de diversos atributs que no coincideix amb cap taula existent:

```sql [Exemple: Tipus compost]
-- Creació prèvia del tipus compost
CREATE TYPE TAdressa AS (
    carrer      VARCHAR(20),
    num_carrer  VARCHAR(4),
    ciutat      VARCHAR(15)
);

-- Funció que retorna el tipus definit
CREATE FUNCTION trobar_adressa_client(dni_client clients.dni%TYPE) 
RETURNS TAdressa AS $$
DECLARE
    dadesCli TAdressa;
BEGIN
    SELECT carrer, num_carrer, ciutat INTO dadesCli
    FROM clients
    WHERE dni = dni_client;

    RETURN dadesCli;
END;
$$ LANGUAGE plpgsql;
```

---

## 4.4. Sentències condicionals i variable `FOUND`

### Estructura `IF ... THEN ... ELSE`
```sql [Sintaxi condicional]
IF condicio THEN
    -- bloc de sentències
ELSIF condicio THEN
    -- bloc de sentències
ELSE
    -- bloc de sentències
END IF;
```

### La variable automàtica `FOUND`
PostgreSQL manté una variable local booleana anomenada `FOUND` (inicia en `False`) que reflecteix el resultat de la darrera sentència SQL executada:

* **`SELECT ... INTO`:** Passa a `True` si la consulta troba alguna fila; `False` si retorna cap fila.
* **`UPDATE`, `INSERT`, `DELETE`:** Passa a `True` si almenys una fila s'ha vist afectada; `False` altrament.
* **Bucle `FOR`:** Passa a `True` si el bucle itera com a mínim un cop; `False` si el resultat era buit.

```sql [Exemple d'ús de FOUND]
CREATE FUNCTION calcul_desc_client(dni_client clients.dni%TYPE) 
RETURNS INTEGER AS $$
DECLARE
    descompte     INTEGER;
    qttComClient  INTEGER;
BEGIN
    SELECT qtt_com INTO qttComClient FROM clients WHERE dni = dni_client;
    
    IF FOUND THEN
        IF (qttComClient = 0) THEN descompte := 0;
        ELSIF (qttComClient < 5) THEN descompte := 1;
        ELSIF (qttComClient < 10) THEN descompte := 3;
        ELSIF (qttComClient < 15) THEN descompte := 5;
        ELSE descompte := 10;
        END IF;
    ELSE
        descompte := 0; -- Client inexistent
    END IF;

    RETURN descompte;
END;
$$ LANGUAGE plpgsql;
```

---

## 4.5. Sentències iteratives (Bucles)

### 1. Bucle `FOR` sobre consultes SQL (El més utilitzat)
Itera automàticament fila per fila sobre el conjunt retornat per una consulta:

```sql [Sintaxi i exemple FOR sobre SELECT]
CREATE FUNCTION import_totes_com(dni_client clients.dni%TYPE) 
RETURNS void AS $$
DECLARE
    num_comanda  comandes.num_com%TYPE;
    import       comandes.import_total%TYPE;
BEGIN
    FOR num_comanda IN SELECT num_com FROM comandes WHERE dni = dni_client LOOP
        SELECT SUM(ic.quantitat * i.preu_unitat) INTO import
        FROM items_comanda ic, items i
        WHERE i.num_item = ic.num_item AND ic.num_com = num_comanda;

        UPDATE comandes 
        SET import_total = import
        WHERE num_com = num_comanda;
    END LOOP;
END;
$$ LANGUAGE plpgsql;
```

### 2. Bucle `FOR` numèric
Per a un nombre conegut d'iteracions:
```sql
FOR i IN [REVERSE] 1..10 LOOP
    -- sentències
END LOOP;
```

### 3. Bucle `WHILE`
Itera mentre la condició sigui certa:
```sql
WHILE EXISTS (SELECT * FROM items WHERE preu_unitat < 25) LOOP
    UPDATE items
    SET preu_unitat = preu_unitat + 5
    WHERE preu_unitat < 25;
END LOOP;
```

### 4. Bucle incondicional `LOOP ... EXIT`
```sql
LOOP
    -- sentències
    EXIT WHEN condicio;
END LOOP;
```

---

## 4.6. Cursors explícits

Un cursor és un punter que recorre individualment les files resultants d'una consulta SQL. És l'alternativa clàssica al `FOR ... IN SELECT`:

1. **Declarar:** `DECLARE nom_cursor CURSOR FOR consulta;`
2. **Obrir:** `OPEN nom_cursor;`
3. **Llegir fila:** `FETCH nom_cursor INTO variable;`
4. **Comprovar:** `EXIT WHEN NOT FOUND;`
5. **Tancar:** `CLOSE nom_cursor;`

```sql [Exemple de cursor explícit]
CREATE FUNCTION clients_ciutat(ciutat_in clients.ciutat%TYPE) 
RETURNS SETOF VARCHAR(9) AS $$
DECLARE
    cur_clients CURSOR FOR SELECT dni FROM clients WHERE ciutat = ciutat_in;
    dni_cli     clients.dni%TYPE;
BEGIN
    OPEN cur_clients;
    LOOP
        FETCH cur_clients INTO dni_cli;
        EXIT WHEN NOT FOUND;
        RETURN NEXT dni_cli;
    END LOOP;
    CLOSE cur_clients;
    RETURN;
END;
$$ LANGUAGE plpgsql;
```

---

## 4.7. Gestió d'errors (`EXCEPTION` i `RAISE EXCEPTION`)

### Provocar un error d'usuari (`RAISE EXCEPTION`)
Interromp la transacció i llança un missatge d'error personalitzat:
```sql
RAISE EXCEPTION 'Quantitat % fora de rang permès', qtt;
```

### Captura d'errors (`EXCEPTION`)
S'afegeix al final del bloc de la funció per interceptar fallades i evitar que avortin l'aplicació:

```sql [Estructura del bloc EXCEPTION]
BEGIN
    -- sentències
EXCEPTION
    WHEN raise_exception THEN
        -- error llançat per RAISE EXCEPTION
    WHEN foreign_key_violation THEN
        -- violació de clau forana (codi 23503)
    WHEN unique_violation THEN
        -- violació de clau primària o unique (codi 23505)
    WHEN OTHERS THEN
        -- qualsevol altre error no previst
END;
```

* **Variables de diagnòstic:**
  * `SQLSTATE`: Codi alfanumèric estàndard de 5 caràcters de l'error.
  * `SQLERRM`: Cadena amb el text descriptiu de l'error.

### Les 4 estratègies de captura d'errors

1. **Captura i re-llançament d'excepció (Neteja i missatge amigable):**
   ```sql
   EXCEPTION
       WHEN foreign_key_violation THEN
           RAISE EXCEPTION 'La comanda o el producte no existeixen';
       WHEN OTHERS THEN
           RAISE EXCEPTION 'Error intern del sistema: %', SQLERRM;
   ```
2. **Captura i retorn d'un objecte d'error:**
   La funció retorna un tipus `TError(codi, motiu)`. Retorna codi `'0'` si té èxit o `SQLSTATE` i `SQLERRM` si falla.
3. **Captura i inserció a taula d'auditoria d'errors:**
   ```sql
   EXCEPTION
       WHEN OTHERS THEN
           INSERT INTO t_errors VALUES (SQLSTATE, SQLERRM);
           RETURN;
   ```
4. **Captura i recuperació automàtica dins del procediment:**
   ```sql
   EXCEPTION
       WHEN undefined_table THEN
           CREATE TABLE prova (a INT PRIMARY KEY, b INT);
   ```
