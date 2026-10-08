---
title: "Tema 5: Disparadors (Triggers)"
description: "SGBD actius i regles ECA, sintaxi a PostgreSQL, ordre d'execució (BEFORE/AFTER, ROW/STATEMENT), variables NEW, OLD i TG_OP, valors de retorn, auditoria, atributs derivats, INSTEAD OF i disparadors en cascada."
readTime: "10 min"
order: 5
draft: true
---

Un **disparador (*trigger*)** és un mecanisme que permet a l'SGBD reaccionar automàticament executant una funció quan es produeix un determinat esdeveniment de manipulació de dades (`INSERT`, `UPDATE` o `DELETE`).

---

## 5.1. Concepte i Regla ECA

Els SGBD convencionals són **passius** (només executen operacions sota petició explícita). Un SGBD **actiu** incorpora comportament reactiu basat en la **regla ECA**:

* **E (Esdeveniment):** L'operació SQL que activa el disparador (`INSERT`, `DELETE`, `UPDATE` o `UPDATE OF columna`).
* **C (Condició):** Expressió lògica que determina si cal executar l'acció.
* **A (Acció):** Procediment emmagatzemat específic que conté les instruccions a dur a terme.

> *«Quan es produeix l'esdeveniment E, si es compleix la condició C, aleshores s'executa l'acció A.»*

### Àmbits d'aplicació típics
1. **Auditoria d'operacions:** Registrar qui, quan i què s'ha modificat a la base de dades.
2. **Manteniment d'atributs derivats:** Recalcular automàticament totals o saldos quan canvien els valors base.
3. **Validació de regles de negoci complexes:** Restriccions que involucren càlculs globals o múltiples taules que no es poden expressar amb un simple `CHECK`.
4. **Manteniment d'integritat entre taules:** Sincronitzar o netejar dades relacionades.

---

## 5.2. Sintaxi a PostgreSQL

A PostgreSQL la creació d'un disparador requereix **dos passos independents**:

### Pas 1: Definir la funció del disparador
La funció no rep paràmetres i ha de retornar obligatòriament el tipus especial `trigger`:

```sql
CREATE FUNCTION nom_funcio() RETURNS trigger AS $$
BEGIN
    -- Codi de la funció
    RETURN NEW; -- o OLD o NULL
END;
$$ LANGUAGE plpgsql;
```

### Pas 2: Definir el disparador (`CREATE TRIGGER`)
Associa la funció a una taula i a un o més esdeveniments:

```sql [Sintaxi CREATE TRIGGER]
CREATE TRIGGER nom_trigger
    { BEFORE | AFTER | INSTEAD OF }
    { INSERT | DELETE | UPDATE [OF col1, col2...] } [OR ...]
    ON nom_taula
    [ FOR EACH { ROW | STATEMENT } ]
    EXECUTE PROCEDURE nom_funcio();
```

---

## 5.3. Ordre d'execució, nivell i visibilitat

### Moment d'execució: `BEFORE` vs. `AFTER` vs. `INSTEAD OF`
* **`BEFORE`:** S'executa **abans** que la sentència modifiqui la BD i **abans de comprovar les restriccions d'integritat** (`CHECK`, claus foranes). Permet alterar els valors que es desaran a la fila o avortar silenciosament l'operació.
* **`AFTER`:** S'executa **després** que la modificació física s'hagi produït i després de validar totes les restriccions d'integritat. Ideal per a auditories i propagació de canvis a altres taules.
* **`INSTEAD OF`:** S'aplica sobre **vistes** per substituir l'operació original i permetre actualitzar vistes complexes.

### Nivell d'execució: `ROW` vs. `STATEMENT`
* **`FOR EACH ROW`:** La funció s'executa **una vegada per cada fila afectada** per la sentència. Té accés a les dades de la fila (`NEW` i `OLD`).
* **`FOR EACH STATEMENT`:** La funció s'executa **una sola vegada per tota la sentència**, independentment de si afecta 0, 1 o 1.000 files.

### Seqüència completa d'execució per a una sentència:
1. Disparadors `BEFORE STATEMENT`
2. Per a cada fila afectada:
   * Disparadors `BEFORE FOR EACH ROW`
   * Comprovació de restriccions d'integritat de la BD
   * Modificació física de la fila a disc
   * Disparadors `AFTER FOR EACH ROW`
3. Disparadors `AFTER STATEMENT`

**Atomicitat:** Tot el bloc (la sentència i tots els disparadors associats) s'executa dins de la mateixa transacció. Si es produeix un error (`RAISE EXCEPTION`), es desfan absolutament tots els canvis (`ROLLBACK`).

---

## 5.4. Variables especials accessibles

Dins del cos de la funció del disparador, PostgreSQL proporciona automàticament les variables següents:

| Variable | Descripció | Valors |
| :--- | :--- | :--- |
| **`TG_OP`** | Nom de l'esdeveniment que ha activat el trigger | Cadena en majúscules: `'INSERT'`, `'UPDATE'` o `'DELETE'`. |
| **`NEW`** | Valors de la tupla després de l'operació | Conté la nova fila a `INSERT` i `UPDATE`. Val `NULL` a `DELETE` i triggers `STATEMENT`. |
| **`OLD`** | Valors de la tupla abans de l'operació | Conté la fila existent abans d'`UPDATE` i `DELETE`. Val `NULL` a `INSERT` i triggers `STATEMENT`. |

---

## 5.5. Valors de retorn (`RETURN NEW | OLD | NULL`)

El valor de retorn té un significat crític segons el moment i nivell del disparador:

### En triggers `BEFORE FOR EACH ROW`:
* **A `INSERT` i `UPDATE`:**
  * **`RETURN NEW;`** $\rightarrow$ S'insereix o es modifica la fila. Si es modifiquen camps de `NEW` dins de la funció (ex: `NEW.sou := 1500;`), la fila es desarà a la taula amb aquests nous valors.
  * **`RETURN NULL;`** $\rightarrow$ **Cancel·la silenciosament** l'operació sobre aquesta fila concreta (no s'insereix ni es modifica, i no produeix cap error).
* **A `DELETE`:**
  * **`RETURN OLD;`** $\rightarrow$ La fila s'elimina normalment.
  * **`RETURN NULL;`** $\rightarrow$ **Cancel·la l'esborrat** de la fila.

### En triggers `AFTER` o a nivell de `STATEMENT`:
El valor retornat és ignorat per l'SGBD. Per convenció s'escriu sempre **`RETURN NULL;`**.

---

## 5.6. Exemples pràctics clau

### Exemple 1: Auditoria d'operacions (`AFTER`)
Registrar cada canvi de quantitat a la taula `items` dins d'una taula de registre `log_record`:

```sql [Auditoria a nivell de fila]
CREATE TABLE log_record (
    item         INTEGER,
    username     VARCHAR(30),
    update_time  TIMESTAMP,
    old_qtt      INTEGER,
    new_qtt      INTEGER
);

CREATE FUNCTION insert_log() RETURNS trigger AS $$
BEGIN
    INSERT INTO log_record 
    VALUES (OLD.item, CURRENT_USER, CURRENT_TIMESTAMP, OLD.qtt, NEW.qtt);
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auditar_canvis_estoc
    AFTER UPDATE OF qtt ON items
    FOR EACH ROW
    EXECUTE PROCEDURE insert_log();
```

### Exemple 2: Manteniment automàtic d'atributs derivats (`BEFORE`)
Mantenir el camp `preu_total` actualitzat automàticament quan es modifica la quantitat (`qtt`) d'un producte:

```sql [Recàlcul automàtic de camp]
CREATE FUNCTION calcular_nou_total() RETURNS trigger AS $$
BEGIN
    IF (OLD.qtt <> 0) THEN
        NEW.preu_total := (OLD.preu_total / OLD.qtt) * NEW.qtt;
    END IF;
    RETURN NEW; -- Molt important retornar NEW modificat!
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER atribut_derivat_preu
    BEFORE UPDATE OF qtt ON items
    FOR EACH ROW
    EXECUTE PROCEDURE calcular_nou_total();
```

### Exemple 3: Precedència i manteniment de restriccions (`BEFORE`)
Si tenim la regla que «Tot estudiant ha de ser usuari» (amb una clau forana `id_e REFERENCES usuari`), si inserim un estudiant que encara no existeix a `usuari`:

```sql [Garantir FK abans de la validació]
CREATE FUNCTION assegurar_usuari() RETURNS trigger AS $$
BEGIN
    IF (NOT EXISTS (SELECT * FROM usuari WHERE id_u = NEW.id_e)) THEN
        INSERT INTO usuari VALUES (NEW.id_e);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- En ser BEFORE, s'executa ABANS que la BD comprovi la clau forana
CREATE TRIGGER auto_crear_usuari
    BEFORE INSERT ON estudiant
    FOR EACH ROW
    EXECUTE PROCEDURE assegurar_usuari();
```

Si el trigger fos `AFTER`, la sentència fallaria immediatament per violació de clau forana abans d'arribar a executar el trigger.

### Exemple 4: Actualització de vistes amb `INSTEAD OF`
Permet fer insercions sobre una vista que d'altra manera no admetria actualitzacions directes:

```sql [Actualització de vista amb INSTEAD OF]
CREATE VIEW empleats_alts AS 
SELECT num_empl, sou FROM empleats WHERE sou > 200000;

CREATE FUNCTION insert_vista_empleats() RETURNS trigger AS $$
BEGIN
    -- Redirigeix la inserció cap a la taula base real
    INSERT INTO empleats (num_empl, nom_empl, sou) 
    VALUES (NEW.num_empl, 'NOU', NEW.sou);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trig_insert_vista
    INSTEAD OF INSERT ON empleats_alts
    FOR EACH ROW
    EXECUTE PROCEDURE insert_vista_empleats();
```

---

## 5.7. Consideracions de disseny i perills

* **Eficiència incremental:** Per comprovar regles de volum (ex: no augmentar l'estoc total en més del 50%), és molt més eficient avaluar el diferencial `(NEW.qtt - OLD.qtt)` a nivell de fila que rellegir tota la taula sencera amb un `SELECT SUM(...)`.
* **Triggers en cascada:** Quan l'acció d'un disparador executa un `UPDATE` o `DELETE` sobre una altra taula, pot activar altres disparadors en cadena.
* **Perill de bucle infinit:** Si el trigger d'una taula $A$ modifica la taula $B$, i el trigger de $B$ modifica la taula $A$, es produeix una recursió infinita fins que l'SGBD esgota la pila i avorta la transacció.
