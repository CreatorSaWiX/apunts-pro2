---
title: "Tema 5: Disparadors (triggers)"
description: "SGBD actius i regles ECA, sintaxi a PostgreSQL, ordre d'execució (BEFORE/AFTER, ROW/STATEMENT), variables NEW, OLD i TG_OP, valors de retorn, exemples clau, criteris de qualitat i cascada."
readTime: "10 min"
order: 9
draft: true
---

Un **disparador** és un mecanisme que permet a l'SGBD reaccionar automàticament executant una funció quan es produeix un determinat esdeveniment de manipulació de dades (`INSERT`, `UPDATE` o `DELETE`).

---

## 5.1. Concepte i regla ECA

Els SGBD convencionals són **passius** (només executen operacions sota petició explícita). Un SGBD **actiu** incorpora comportament reactiu basat en la **regla ECA**:

- **E (Esdeveniment):** L'operació SQL que activa el disparador (`INSERT`, `DELETE`, `UPDATE` o `UPDATE OF columna`).
- **C (Condició):** Expressió lògica que determina si cal executar l'acció.
- **A (Acció):** Procediment emmagatzemat específic que conté les instruccions a dur a terme.

> *«Quan es produeix l'esdeveniment E, si es compleix la condició C, aleshores s'executa l'acció A.»*

Àmbits d'ús: auditoria, manteniment d'atributs derivats, regles de negoci complexes (que un `CHECK` no pot expressar) i manteniment de dades relacionades entre taules.

:::ecaviz
:::

---

## 5.2. Sintaxi a PostgreSQL

La creació d'un disparador requereix **dos passos independents**:

**Pas 1: Definir la funció del disparador** (sense paràmetres, retorna obligatòriament `trigger`):

```sql
CREATE [OR REPLACE] FUNCTION nom_funcio() RETURNS trigger AS $$
BEGIN
    -- Codi de la funció
    RETURN NEW; -- o OLD o NULL
END;
$$ LANGUAGE plpgsql;
```

**Pas 2: Definir el disparador (`CREATE TRIGGER`):**

```sql
CREATE TRIGGER nom_trigger
    { BEFORE | AFTER | INSTEAD OF }
    { INSERT | DELETE | UPDATE [OF col1, col2...] } [OR ...]
    ON nom_taula
    [ FOR EACH { ROW | STATEMENT } ]
    EXECUTE PROCEDURE nom_funcio(); -- (o EXECUTE FUNCTION en versions noves)
```

---

## 5.3. Ordre d'execució, nivell i criteri d'elecció

**Seqüència completa d'execució d'una sentència:**
1. Disparadors `BEFORE STATEMENT` (1 cop abans de començar).
2. Per cada fila afectada: `BEFORE ROW` $\rightarrow$ modificació física + comprovació de restriccions (`PK`, `FK`, `CHECK`, `NOT NULL`) $\rightarrow$ `AFTER ROW`.
3. Disparadors `AFTER STATEMENT` (1 cop al final).

- **Precedència amb restriccions:** Si la sentència viola una restricció de taula (`PK`, `FK`, `CHECK`), falla **abans** d'arribar als triggers `AFTER` (només un `BEFORE` pot interceptar o preparar la BD abans de la comprovació).
- **Atomicitat:** Tot s'executa dins la mateixa transacció. Si falla una restricció o salta `RAISE EXCEPTION` (tant a la sentència com dins del trigger), es desfan **tots** els canvis de la transacció (o de la sentència si s'executa sense bloc transaccional explícit).

### Com triar i justificar el tipus de trigger a examen

| Decisió | Quan escollir-la? |
| :--- | :--- |
| **`BEFORE`** | Per **modificar `NEW`**, **cancel·lar silenciosament (`RETURN NULL`)**, validar regles globals abans de tocar dades, o **crear/preparar una FK abans** que l'SGBD comprovi les restriccions. |
| **`AFTER`** | Quan l'acció modifica altres taules (auditoria, atributs derivats externs, manteniment de fills) i cal que la fila ja estigui validada per totes les restriccions de la BD. |
| **`FOR EACH ROW`** | Quan cal accedir a **`NEW` o `OLD`** d'una fila concreta o fer actualitzacions **incrementals**. *(Si la sentència afecta 0 files, no s'executa).* |
| **`FOR EACH STATEMENT`** | Quan la regla **no depèn de cap fila** (franja horària, prohibir operacions sobre una taula, comptador global) o per auditar 1 cop per sentència. *(S'executa sempre 1 cop, encara que afecti 0 files).* |

*(Nota: **`INSTEAD OF`** s'usa únicament sobre **vistes** per substituir l'operació original; no apareix habitualment als exàmens finals).*

:::triggerviz
:::

---

## 5.4. Variables especials (`TG_OP`, `NEW`, `OLD`)

| Variable | Significat | `INSERT` (`ROW`) | `UPDATE` (`ROW`) | `DELETE` (`ROW`) | `STATEMENT` |
| :--- | :--- | :---: | :---: | :---: | :---: |
| **`TG_OP`** | Operació activadora | `'INSERT'` | `'UPDATE'` | `'DELETE'` | `'INSERT'` / `'UPDATE'` / `'DELETE'` |
| **`NEW`** | Tupla **després** | Fila nova | Fila nova | `NULL` | `NULL` |
| **`OLD`** | Tupla **abans** | `NULL` | Fila antiga | Fila antiga | `NULL` |

**Compte amb triggers multi-esdeveniment (`INSERT OR DELETE OR UPDATE`):** comprova sempre `TG_OP` abans d'accedir a `NEW` (a `DELETE` val `NULL`) o `OLD` (a `INSERT` val `NULL`).

:::tgvarsviz
:::

---

## 5.5. Valors de retorn (`RETURN NEW | OLD | NULL`)

| Tipus de trigger | `RETURN NEW` | `RETURN OLD` | `RETURN NULL` |
| :--- | :--- | :--- | :--- |
| **`BEFORE ROW` (`INSERT`)** | Insereix la fila (amb els canvis fets a `NEW`). | **Cancel·la silenciosament** la inserció *(perquè `OLD` és `NULL`!)*. | **Cancel·la silenciosament** la inserció (sense error ni `AFTER`). |
| **`BEFORE ROW` (`UPDATE`)** | Modifica la fila (amb els canvis fets a `NEW`). | **Cancel·la silenciosament** la modificació d'aquella fila. | **Cancel·la silenciosament** la modificació d'aquella fila. |
| **`BEFORE ROW` (`DELETE`)** | — | Esborra la fila normalment. | **Cancel·la silenciosament** l'esborrat d'aquella fila. |
| **`AFTER` o `STATEMENT`** | Ignorat | Ignorat | Ignorat (convenció: usar sempre `RETURN NULL;`). |

**Trampa típica d'examen:** retornar `NULL` (o retornar `OLD` en un `INSERT`) dins d'un `BEFORE ROW` **no llança cap excepció**; simplement descarta l'operació sobre aquella fila i evita que s'executi el trigger `AFTER`.

:::trigretviz
:::

---

## 5.6. Exemples pràctics clau

### Exemple 1: manteniment incremental multi-esdeveniment (`AFTER ROW` + `TG_OP`)
Mantenir el comptador derivat `quants_empleats` a `departaments` davant insercions, esborrats o canvis de departament a `empleats`:

```sql
CREATE OR REPLACE FUNCTION actualitzar_comptador() RETURNS trigger AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        UPDATE departaments SET quants_empleats = quants_empleats + 1
        WHERE num_dpt = NEW.num_dpt;
    ELSIF (TG_OP = 'DELETE') THEN
        UPDATE departaments SET quants_empleats = quants_empleats - 1
        WHERE num_dpt = OLD.num_dpt;
    ELSIF (TG_OP = 'UPDATE' AND OLD.num_dpt <> NEW.num_dpt) THEN
        UPDATE departaments SET quants_empleats = quants_empleats - 1
        WHERE num_dpt = OLD.num_dpt;
        UPDATE departaments SET quants_empleats = quants_empleats + 1
        WHERE num_dpt = NEW.num_dpt;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_comptador_empl
    AFTER INSERT OR DELETE OR UPDATE OF num_dpt ON empleats
    FOR EACH ROW EXECUTE PROCEDURE actualitzar_comptador();
```

:::incrtriggerviz
:::

### Exemple 2: regla global o bloqueig (`BEFORE STATEMENT`)
Impedir qualsevol modificació o esborrat sobre la taula `auditoria` (o restringir operacions segons l'hora/dia):

```sql
CREATE OR REPLACE FUNCTION protegir_auditoria() RETURNS trigger AS $$
BEGIN
    RAISE EXCEPTION 'No es pot modificar ni esborrar la taula auditoria';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_no_modificar_auditoria
    BEFORE UPDATE OR DELETE ON auditoria
    FOR EACH STATEMENT EXECUTE PROCEDURE protegir_auditoria();
```

:::stmtguardviz
:::

### Exemple 3: modificar la pròpia fila (`BEFORE ROW`)
Recalcular automàticament `preu_total` a la mateixa taula `items` quan canvia `qtt`:

```sql
CREATE OR REPLACE FUNCTION calcular_nou_total() RETURNS trigger AS $$
BEGIN
    IF (OLD.qtt <> 0) THEN
        NEW.preu_total := (OLD.preu_total / OLD.qtt) * NEW.qtt;
    END IF;
    RETURN NEW; -- Obligatori retornar NEW modificat!
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER atribut_derivat_preu
    BEFORE UPDATE OF qtt ON items
    FOR EACH ROW EXECUTE PROCEDURE calcular_nou_total();
```

:::beforemodviz
:::

### Exemple 4: precedència abans de restriccions (`BEFORE ROW`)
Garantir «Tot estudiant ha de ser usuari» (amb `estudiant.id_e REFERENCES usuari`):

```sql
CREATE OR REPLACE FUNCTION assegurar_usuari() RETURNS trigger AS $$
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
    FOR EACH ROW EXECUTE PROCEDURE assegurar_usuari();
```

Si fos `AFTER`, fallaria immediatament per violació de clau forana abans d'executar el trigger.

:::beforefkviz
:::

*(**Sobre `INSTEAD OF`:** s'utilitza amb vistes, ex. `INSTEAD OF INSERT ON vista FOR EACH ROW`, per redirigir l'operació cap a les taules base reals).*

---

## 5.7. Criteris de qualitat i perills (cascada i cicles)

### Criteris de qualitat a examen
1. **Implementació incremental (`FOR EACH ROW`) vs. recàlcul global:** per mantenir sumes o comptadors en una taula pare, usa `FOR EACH ROW` aplicant el diferencial (`NEW.val - OLD.val`) només a la fila afectada (`WHERE id = NEW.id`), **mai** un `SELECT SUM(...)` sobre tota la taula ni actualitzant totes les files sense `WHERE`.
2. **Especificar columnes a `UPDATE OF`:** indica sempre només els atributs rellevants (`AFTER UPDATE OF preu ON ...`) per evitar activacions innecessàries.
3. **Cobrir tots els esdeveniments i taules afectats:** una restricció entre dues taules pot exigir triggers a **totes dues** (ex: `INSERT/UPDATE` a la taula filla i `UPDATE/DELETE` a la taula pare).
4. **No usar `ROW` si la regla és global:** si la condició no depèn de cap fila (horaris, bloqueig total de taula, comptador general d'una altra taula), usa **`FOR EACH STATEMENT`**.

### Cascada i recursió infinita
- **Disparadors en cascada:** si el trigger d'una taula $A$ modifica $B$, s'activen també els triggers de $B$; tot forma part de la mateixa transacció, així que un error a $B$ desfà els canvis d'$A$.
- **Recursió infinita:** si un trigger d'$A$ modifica $B$ i el de $B$ modifica $A$ (o un trigger s'activa a si mateix indefinidament), l'SGBD acaba esgotant la pila i avorta la transacció.
