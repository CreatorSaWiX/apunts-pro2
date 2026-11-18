---
title: "Tema 5: Triggers"
description: "Ordre d'execució, variables, valors de retorn."
readTime: "12 min"
order: 9
draft: false
isNew: true
---

Al Tema 4 vam veure les funcions en PL/pgSQL, però tenen una limitació: **només s'executen quan algú les crida explícitament**.

Un **disparador** (*trigger*) és com un **sensor de moviment** col·locat sobre una taula. En lloc d'haver de cridar una funció manualment, li diem a PostgreSQL: *"cada vegada que algú faci un `INSERT`, `UPDATE` o `DELETE` en aquesta taula, executa aquesta funció automàticament"*.

---

## 5.1. Concepte i regla ECA

Les bases de dades convencionals són **passives**: només fan coses quan els ho demanes. Quan hi afegim disparadors, la BD es torna **activa** i reacciona tota sola seguint la **regla ECA**:

- **E (Esdeveniment):** l'operació SQL que fa saltar el sensor (`INSERT`, `DELETE`, `UPDATE` o `UPDATE OF columna`).
- **C (Condició):** comprovació lògica opcional que decideix si cal actuar o no.
- **A (Acció):** la funció PL/pgSQL que s'executa com a resposta.

> *«Quan es produeix l'esdeveniment **E**, si es compleix la condició **C**, aleshores s'executa l'acció **A**.»*

**Per a què es fan servir?** Per auditar canvis (guardar qui ha tocat què), mantenir dades calculades (com un comptador d'empleats), o fer complir regles de negoci complexes que un simple `CHECK` no pot expressar.

<!-- :::ecaviz -->
<!-- ::: -->

---

## 5.2. Sintaxi a PostgreSQL (els 2 passos)

A PostgreSQL, crear un disparador sempre es fa en **dos passos separats**: primer defines *què farà* (la funció) i després *quan i on s'activarà* (el trigger).

### Pas 1: Definir la funció del disparador
És una funció normal de PL/pgSQL, però amb dues regles obligatòries: **no té paràmetres** i retorna sempre **`trigger`**.

```sql [Pas 1: Funció que executarà el trigger]
CREATE [OR REPLACE] FUNCTION nom_funcio() RETURNS trigger AS $$
BEGIN
    -- Codi de la funció
    RETURN NEW; -- (o OLD o NULL, segons el cas que veurem a 5.5)
END;
$$ LANGUAGE plpgsql;
```

### Pas 2: Enganxar la funció a una taula (`CREATE TRIGGER`)
Ara connectem la funció amb la taula i l'esdeveniment que la dispararà:

```sql [Pas 2: Crear el trigger sobre la taula]
CREATE TRIGGER nom_trigger
    { BEFORE | AFTER | INSTEAD OF }
    { INSERT | DELETE | UPDATE [OF col1, col2...] } [OR ...]
    ON nom_taula
    [ FOR EACH { ROW | STATEMENT } ]
    EXECUTE PROCEDURE nom_funcio(); -- (o EXECUTE FUNCTION en versions noves)
```

*(Tranquil! Tot seguit veurem què volen dir `NEW`, `OLD`, `BEFORE`/`AFTER` i `ROW`/`STATEMENT`.)*

---

## 5.3. Variables especials (`NEW`, `OLD`, `TG_OP`)

Com que la funció del trigger **no rep paràmetres**, com sap quina fila s'està inserint, modificant o esborrant? PostgreSQL li passa automàticament aquestes tres variables:

- **`NEW`:** conté la **fila nova** (amb els valors que quedaràn després de l'`INSERT` o `UPDATE`). A un `DELETE` val `NULL` perquè no hi ha cap fila nova!
- **`OLD`:** conté la **fila antiga** (els valors que hi havia abans de l'`UPDATE` o `DELETE`). A un `INSERT` val `NULL` perquè abans no existia!
- **`TG_OP`:** és un text (`'INSERT'`, `'UPDATE'` o `'DELETE'`) que et diu quina operació ha disparat el trigger.

Per accedir a una columna concreta de la fila, fas servir el punt: `NEW.nom_columna` o `OLD.nom_columna`.

| Variable | Significat | `INSERT` (`ROW`) | `UPDATE` (`ROW`) | `DELETE` (`ROW`) | `STATEMENT` |
| :--- | :--- | :---: | :---: | :---: | :---: |
| **`TG_OP`** | Operació activadora | `'INSERT'` | `'UPDATE'` | `'DELETE'` | `'INSERT'` / `'UPDATE'` / `'DELETE'` |
| **`NEW`** | Tupla **després** | Fila nova | Fila nova | `NULL` | `NULL` |
| **`OLD`** | Tupla **abans** | `NULL` | Fila antiga | Fila antiga | `NULL` |

<!-- ::callout[type="warning" title="Compte amb triggers multi-esdeveniment!"] -->
Si un mateix trigger s'activa per `INSERT OR DELETE OR UPDATE`, comprova **sempre `TG_OP` abans de tocar `NEW` o `OLD`**. Si intentes llegir `NEW.camp` durant un `DELETE` (o `OLD.camp` durant un `INSERT`), estaràs accedint a `NULL`.
<!-- :: -->

<!-- :::tgvarsviz -->
<!-- ::: -->

---

## 5.4. Quan i com s'executa? (`BEFORE`/`AFTER` i `ROW`/`STATEMENT`)

Quan crees un trigger has de prendre dues decisions clau: **en quin moment** s'executa i **amb quina freqüència**.

### 1. `FOR EACH ROW` vs `FOR EACH STATEMENT` (quantitat de vegades)

Imagina que fas `UPDATE empleats SET sou = sou * 1.1;` i la taula té **50 empleats**:
- **`FOR EACH ROW`** (nivell de fila): la funció s'executa **50 vegades** (una per cada empleat modificat) i té accés a `NEW` i `OLD`. *(Si l'`UPDATE` no afecta cap fila, s'executa 0 vegades).*
- **`FOR EACH STATEMENT`** (nivell de sentència): la funció s'executa **1 sola vegada** per a tota la comanda SQL (encara que afecti 0 files o 50!), i `NEW` / `OLD` valen `NULL`.

### 2. `BEFORE` vs `AFTER` (ordre d'execució)

Quan executes una sentència SQL, PostgreSQL segueix estrictament aquest ordre:

1. Triggers **`BEFORE STATEMENT`** (1 cop abans de començar).
2. Per cada fila afectada:
   **`BEFORE ROW`** $\rightarrow$ **modificació física + comprovació de restriccions (`PK`, `FK`, `CHECK`, `NOT NULL`)** $\rightarrow$ **`AFTER ROW`**.
3. Triggers **`AFTER STATEMENT`** (1 cop al final).

Fixa't en dos detalls vitals d'aquest ordre:
- **Precedència amb restriccions:** Si la sentència viola una `PK`, `FK` o `CHECK`, peta **abans** d'arribar als triggers `AFTER`. Només un `BEFORE` pot actuar o arreglar la BD abans que saltin les restriccions.
- **Atomicitat (tot o res):** Tot passa dins la mateixa transacció. Si falla una restricció o el trigger llança `RAISE EXCEPTION`, **es desfan tots els canvis** fets fins aquell moment.

### Guia ràpida per triar a l'examen

| Decisió | Quan escollir-la? |
| :--- | :--- |
| **`BEFORE`** | Quan vols **modificar `NEW`** abans que es guardi, **cancel·lar silenciosament (`RETURN NULL`)**, o **crear/preparar una FK abans** que l'SGBD comprovi les restriccions. |
| **`AFTER`** | Quan el trigger toca **altres taules** (auditoria, comptadors externs, manteniment de fills) i vols estar segur que la fila ja ha passat totes les restriccions (`PK`, `FK`, `CHECK`). |
| **`FOR EACH ROW`** | Quan necessites llegir **`NEW` o `OLD`** d'una fila concreta o fer actualitzacions **incrementals**. |
| **`FOR EACH STATEMENT`** | Quan la regla **no depèn de cap fila concreta** (prohibir operacions en una taula, comprovar l'hora/dia) o per auditar 1 sol cop per sentència. |

*(Nota: **`INSTEAD OF`** només s'usa sobre **vistes** per substituir l'operació original; no apareix habitualment als exàmens finals).*

<!-- :::triggerviz -->
<!-- ::: -->

---

## 5.5. Valors de retorn (`RETURN NEW | OLD | NULL`)

Com que ningú crida el trigger amb un `SELECT`, per a què serveix el `RETURN` del final de la funció?
Serveix perquè **els triggers `BEFORE ROW` li diguin a PostgreSQL si ha de seguir endavant amb l'operació o avortar-la per a aquella fila!**

| Tipus de trigger | `RETURN NEW` | `RETURN OLD` | `RETURN NULL` |
| :--- | :--- | :--- | :--- |
| **`BEFORE ROW` (`INSERT`)** | Insereix la fila (amb els canvis fets a `NEW`). | **Cancel·la silenciosament** la inserció *(perquè `OLD` és `NULL`!)*. | **Cancel·la silenciosament** la inserció (sense error ni `AFTER`). |
| **`BEFORE ROW` (`UPDATE`)** | Modifica la fila (amb els canvis fets a `NEW`). | **Cancel·la silenciosament** la modificació d'aquella fila. | **Cancel·la silenciosament** la modificació d'aquella fila. |
| **`BEFORE ROW` (`DELETE`)** | — | Esborra la fila normalment. | **Cancel·la silenciosament** l'esborrat d'aquella fila. |
| **`AFTER` o `STATEMENT`** | Ignorat | Ignorat | Ignorat (per convenció, posa sempre `RETURN NULL;`). |

<!-- ::callout[type="danger" title="Trampa típica d'examen: RETURN NULL vs RAISE EXCEPTION"] -->
Retornar `NULL` (o retornar `OLD` en un `INSERT`) dins d'un `BEFORE ROW` **no llança cap error**: simplement es salta aquella fila en silenci i evita que s'executi el trigger `AFTER`. Si l'enunciat demana **avortar amb un missatge d'error**, has de fer **`RAISE EXCEPTION '...'`**, no `RETURN NULL`.
<!-- :: -->

<!-- :::trigretviz -->
<!-- ::: -->

---

## 5.6. Exemples pràctics clau

### Exemple 1: Manteniment incremental (`AFTER ROW` + `TG_OP`)
Volem mantenir actualitzat el comptador `quants_empleats` a la taula `departaments` quan s'insereixen, esborren o canvien de departament els `empleats`.
- Com que modifiquem una altra taula i necessitem `NEW.num_dpt` / `OLD.num_dpt`, triem **`AFTER`** + **`FOR EACH ROW`**.

```sql [Comptador incremental multi-esdeveniment]
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
    RETURN NULL; -- En triggers AFTER el retorn s'ignora
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_comptador_empl
    AFTER INSERT OR DELETE OR UPDATE OF num_dpt ON empleats
    FOR EACH ROW EXECUTE PROCEDURE actualitzar_comptador();
```

<!-- :::incrtriggerviz -->
<!-- ::: -->

### Exemple 2: Regla global o bloqueig (`BEFORE STATEMENT`)
Impedir qualsevol modificació o esborrat sobre la taula `auditoria`.
- No ens cal mirar cap fila (`NEW`/`OLD`) i volem tallar-ho abans de tocar res $\rightarrow$ **`BEFORE`** + **`FOR EACH STATEMENT`**.

```sql [Bloquejar operacions sobre una taula]
CREATE OR REPLACE FUNCTION protegir_auditoria() RETURNS trigger AS $$
BEGIN
    RAISE EXCEPTION 'No es pot modificar ni esborrar la taula auditoria';
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_no_modificar_auditoria
    BEFORE UPDATE OR DELETE ON auditoria
    FOR EACH STATEMENT EXECUTE PROCEDURE protegir_auditoria();
```

<!-- :::stmtguardviz -->
<!-- ::: -->

### Exemple 3: Modificar la pròpia fila abans de guardar (`BEFORE ROW`)
Recalcular automàticament `preu_total` a la mateixa taula `items` quan canvia la quantitat `qtt`.
- Com que volem alterar `NEW.preu_total` abans que s'escrigui al disc $\rightarrow$ **`BEFORE`** + **`FOR EACH ROW`** + **`RETURN NEW;`**.

```sql [Modificar NEW abans de guardar la fila]
CREATE OR REPLACE FUNCTION calcular_nou_total() RETURNS trigger AS $$
BEGIN
    IF (OLD.qtt <> 0) THEN
        NEW.preu_total := (OLD.preu_total / OLD.qtt) * NEW.qtt;
    END IF;
    RETURN NEW; -- Obligatori retornar NEW perquè es guardin els canvis!
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER atribut_derivat_preu
    BEFORE UPDATE OF qtt ON items
    FOR EACH ROW EXECUTE PROCEDURE calcular_nou_total();
```

<!-- :::beforemodviz -->
<!-- ::: -->

### Exemple 4: Preparar dades abans d'una restricció (`BEFORE ROW`)
Garantir «Tot estudiant ha de ser usuari» (on `estudiant.id_e REFERENCES usuari`).
- Si inserim un estudiant que encara no és usuari, un trigger **`AFTER`** no arribaria a temps (saltaria primer l'error de clau forana). Amb **`BEFORE`**, creem l'usuari just abans que PostgreSQL comprovi la `FK`.

```sql [Crear el pare abans que es comprovi la FK]
CREATE OR REPLACE FUNCTION assegurar_usuari() RETURNS trigger AS $$
BEGIN
    IF (NOT EXISTS (SELECT * FROM usuari WHERE id_u = NEW.id_e)) THEN
        INSERT INTO usuari VALUES (NEW.id_e);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER auto_crear_usuari
    BEFORE INSERT ON estudiant
    FOR EACH ROW EXECUTE PROCEDURE assegurar_usuari();
```

<!-- :::beforefkviz -->
<!-- ::: -->

*(**Sobre `INSTEAD OF`:** s'utilitza amb vistes, ex. `INSTEAD OF INSERT ON vista FOR EACH ROW`, per redirigir l'operació cap a les taules base reals).*

<!-- ---

## 5.7. Criteris de qualitat i perills (cascada i cicles)

### Criteris de qualitat a examen (què vigilar per no perdre punts)

1. **Implementació incremental (`FOR EACH ROW`) vs recàlcul global:**
   Per mantenir sumes o comptadors en una taula pare, suma o resta només el diferencial (`+ 1`, `- 1`, `NEW.val - OLD.val`) a la fila afectada (`WHERE id = NEW.id`).
   - ❌ `UPDATE departaments d SET quants_empleats = (SELECT COUNT(*) FROM empleats e WHERE e.num_dpt = d.num_dpt);` (recalcula tota la taula!)
   - ✅ `UPDATE departaments SET quants_empleats = quants_empleats + 1 WHERE num_dpt = NEW.num_dpt;`

2. **Especificar columnes a `UPDATE OF`:**
   Indica sempre només els atributs que realment afecten la regla (`AFTER UPDATE OF preu ON ...`) per evitar que el trigger s'activi quan es modifiquen altres columnes que no hi tenen res a veure.

3. **Cobrir tots els esdeveniments i taules afectats:**
   Una restricció entre dues taules sovint exigeix triggers a **totes dues** (per exemple: `INSERT`/`UPDATE` a la taula filla i `UPDATE`/`DELETE` a la taula pare).

4. **No usar `ROW` si la regla és global:**
   Si la condició no depèn de cap fila (horaris, bloqueig total de taula), usa **`FOR EACH STATEMENT`**. -->

### Cascada i recursió infinita
- **Disparadors en cascada:** si el trigger d'una taula $A$ modifica la taula $B$, s'activen automàticament els triggers de $B$. Com que tot va dins la mateixa transacció, un error a $B$ desfà també els canvis d'$A$.
- **Recursió infinita:** si un trigger d'$A$ modifica $B$ i el de $B$ torna a modificar $A$ (o un trigger s'activa a si mateix sense parar), PostgreSQL acaba esgotant la memòria de crides i avorta la transacció.
