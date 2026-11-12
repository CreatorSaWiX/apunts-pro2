---
title: "Tema 8: Transaccions i concurrència"
description: "Propietats ACID, interferències, serialitzabilitat, recuperabilitat, control amb reserves (PR2F), nivells d'aïllament i abraçades mortals."
readTime: "10 min"
order: 11
draft: false
isNew: true
---

Una **transacció** és un conjunt d'operacions de lectura i/o actualització sobre la BD que s'executa com una unitat indivisible: o es confirma sencera, o es desfà completament.

---

## 8.1. Sintaxi SQL i propietats ACID

```sql
START TRANSACTION;  -- Inici explícit (qualsevol sentència SQL n'inicia una implícitament)
-- operacions SELECT, INSERT, UPDATE, DELETE...
COMMIT;             -- Confirma i fa permanents els canvis
ROLLBACK;           -- Cancel·la i desfà tots els canvis (també ABORT)
```

| Propietat | Significat | Qui la garanteix? |
| :--- | :--- | :--- |
| **A — Atomicitat** | Tot o res: si la transacció falla o s'avorta, es desfan tots els canvis previs. | SGBD |
| **C — Consistència** | Porta la BD d'un estat vàlid a un altre estat vàlid (dades i regles coherents). | Programador + restriccions SGBD |
| **I — Aïllament** | L'execució concurrent produeix el mateix efecte que una execució seqüencial. | SGBD (control de concurrència) |
| **D — Definitivitat** | Un cop confirmat (`COMMIT`), els canvis persisteixen davant caigudes del sistema. | SGBD (recuperació) |

**Compte amb els errors i la consistència a examen:**
- Si una sentència dins de `START TRANSACTION ... COMMIT` viola un `CHECK`, una clau forana o un trigger llança `RAISE EXCEPTION`, **tota la transacció s'avorta (`ROLLBACK`)** i s'anul·len les operacions anteriors del bloc.
- Que no salti cap restricció DDL no garanteix la **Consistència (C)**: si el codi de la transacció mou dades però oblida actualitzar un atribut derivat (sense trigger que ho mantingui), viola la consistència per error de programació.

:::acidviz
:::

---

## 8.2. Les 5 interferències entre transaccions

Es produeixen quan dues o més transaccions s'executen concurrentment sense aïllament suficient:

| Interferència | Descripció | Àmbit | Nivell mínim per evitar-la |
| :--- | :--- | :---: | :--- |
| **Actualització perduda** | Dues transaccions llegeixen una dada i l'actualitzen; la segona trepitja el canvi de la primera. | 1 dada | `READ UNCOMMITTED` |
| **Lectura no confirmada** | $T_1$ llegeix una dada modificada per $T_2$ que no és definitiva ($T_2$ fa `ABORT` o la torna a modificar abans de confirmar). | 1 dada | `READ COMMITTED` |
| **Lectura no repetible** | $T_1$ llegeix dues vegades la mateixa dada i obté valors diferents perquè $T_2$ l'ha modificat entremig. | 1 dada | `REPEATABLE READ` |
| **Anàlisi inconsistent** | $T_1$ llegeix un conjunt de dades ($A$ i $B$) mentre $T_2$ les modifica; $T_1$ veu $A$ abans del canvi i $B$ després (o viceversa). | Conjunt | `REPEATABLE READ` |
| **Fantasmes** | $T_1$ llegeix totes les files que compleixen una condició $C$; $T_2$ insereix una fila que compleix $C$ o modifica una que no la complia perquè passi a complir-la; $T_1$ torna a consultar $C$ i apareix la fila nova. | Conjunt | `SERIALIZABLE` |

:::interferencesviz
:::

### Trampa clàssica: lectura no repetible vs. fantasma

Davant de dues consultes idèntiques `SELECT ... WHERE cond` dins de $T_1$:
- Si $T_2$ modifica una fila que **ja complia** `cond` i continua complint-la $\rightarrow$ **Lectura no repetible** (mateixa fila, valor diferent).
- Si $T_2$ **afegeix** una fila nova al conjunt resultat (`INSERT` nou que compleix `cond`, o `UPDATE` d'una fila que abans **no** complia `cond` i ara sí) $\rightarrow$ **Fantasma**.

---

## 8.3. Serialitzabilitat i graf de precedències

- **Grànul ($G$):** unitat elemental controlada per l'SGBD (a examen, normalment **la fila**, identificada per la seva PK).
- **Horari (història):** execució concurrent de transaccions preservant l'ordre d'accions dins de cadascuna.
- **Horari serial:** sense encavalcaments entre transaccions ($n!$ possibles per a $n$ transaccions).

### Traducció de SQL a operacions sobre grànuls

| Sentència SQL | Operació sobre grànul $G$ | Detall |
| :--- | :--- | :--- |
| `SELECT` | `R(G)` | Una lectura per cada fila retornada/llegida. |
| `INSERT / UPDATE / DELETE` | `RU(G)` seguit de `W(G)` | `RU` = lectura amb intenció d'escriptura. Si afecta diverses files, es posa `RU(G), W(G)` per a cadascuna. |
| Conjunt amb **Fantasmes** | `R(IC)` / `RU(IC), W(IC)` | `IC` (Informació de Control) només s'inclou si l'horari presenta fantasmes. |

:::granuleviz
:::

### Accions conflictives i graf de precedències

Dues accions són **conflictives (no commutables)** si compleixen totes tres condicions:
1. Pertanyen a **transaccions diferents** ($T_i \neq T_j$).
2. Operen sobre el **mateix grànul** ($G$).
3. **Almenys una és d'escriptura** (`W`). *(Dues lectures `R` o `R` amb `RU` sense `W` no generen conflicte entre si).*

**Construcció del graf de precedències:**
- Nodes = transaccions.
- Per cada parell d'accions conflictives sobre $G$ on l'acció de $T_i$ s'executa **abans** que la de $T_j$, afegim l'aresta dirigida $T_i \xrightarrow{G} T_j$.

```text
Regla d'or:
  Horari serialitzable  <==>  Graf de precedències SENSE CICLES (acíclic)
```

- **Horaris serials equivalents:** tots els **ordres topològics** vàlids del graf. Per exemple, si només hi ha $T_2 \to T_1$ i $T_2 \to T_3$ (sense aresta entre $T_1$ i $T_3$), tant `T2; T1; T3` com `T2; T3; T1` són horaris serials equivalents.
- **Horari d'una sola transacció:** sempre és serialitzable (ja és un horari serial).

:::precedenceviz
:::

---

## 8.4. Recuperabilitat

La teoria de la serialitzabilitat assumeix que totes les transaccions acaben fent `COMMIT`, però a la pràctica alguna pot fer `ABORT`.

> Un horari compleix el **criteri de recuperabilitat** si cap transacció $T_2$ que llegeix o escriu un grànul escrit per una altra transacció $T_1$ confirma (`COMMIT`) abans que ho faci $T_1$.

```text
# temps   T1        T2
1         RU(A)
2         W(A)
3                   RU(A)
4                   W(A)
5                   COMMIT   <-- Viola recuperabilitat (T1 encara no ha confirmat)
6         ABORT              <-- Impossible desfer el canvi confirmat de T2
```

*(Un horari amb una única transacció sempre és recuperable).*

:::recoverviz
:::

---

## 8.5. Control de concurrència amb reserves (PR2F)

Abans d'operar sobre un grànul $G$, una transacció ha de demanar-ne la reserva (`LOCK(G, m)`), i alliberar-la amb `UNLOCK(G)`:

| Modalitat | Permet | Compatible amb `S`? | Compatible amb `X`? |
| :--- | :--- | :---: | :---: |
| **`S` (*Shared*)** | Només lectures (`R`) | Sí | No |
| **`X` (*eXclusive*)** | Lectures i escriptures (`R`, `RU`, `W`) | No | No |

**Regles de petició de reserves:**
- `R(G)` $\rightarrow$ `LOCK(G, S)` (llevat de `READ UNCOMMITTED`).
- `RU(G), W(G)` $\rightarrow$ **`LOCK(G, X)` abans de `RU(G)`**.
- Si una transacció ja té `LOCK(G, S)` i més tard vol fer `RU(G), W(G)`, ha de demanar `LOCK(G, X)` (conversió de reserva: si una altra transacció té `S` sobre $G$, ha d'esperar).
- Si una transacció ja té `LOCK(G, S)` (per repetir lectura) o `LOCK(G, X)` (per llegir o escriure de nou), **no torna a demanar reserva**.

:::lockviz
:::

### Protocol de Reserves en Dues Fases (PR2F)

- **PR2F:** tota reserva s'adquireix abans d'operar sobre el grànul i **mai** es demana cap reserva nova després d'haver-ne alliberat alguna. Garanteix **serialitzabilitat** (si totes fan `COMMIT`), però **no evita lectures no confirmades ni horaris no recuperables** si s'allibera abans d'acabar.
- **PR2F fortament estricte:** PR2F + mantenir **totes** les reserves fins a l'acabament de la transacció (`COMMIT` o `ABORT`). Garanteix serialitzabilitat i recuperabilitat.

:::pr2fviz
:::

---

## 8.6. Nivells d'aïllament i simulació d'horaris

```sql
SET TRANSACTION { READ ONLY | READ WRITE }
    ISOLATION LEVEL { READ UNCOMMITTED | READ COMMITTED | REPEATABLE READ | SERIALIZABLE };
```

| Nivell d'aïllament | Reserves `S` | Reserves `X` | Reserves `IC` | Interferències que evita |
| :--- | :--- | :--- | :---: | :--- |
| **`READ UNCOMMITTED`** | **No fa reserves `S`** | Fins al final | No | Actualització perduda |
| **`READ COMMITTED`** | Només durant la lectura (`UNLOCK` just després de `R`) | Fins al final | No | + Lectura no confirmada |
| **`REPEATABLE READ`** | Fins al final | Fins al final | No | + Lectura no repetible i Anàlisi inconsistent |
| **`SERIALIZABLE`** | Fins al final | Fins al final | Sí (`S`/`X` fins al final) | Totes (inclou Fantasmes) |

:::isolationviz
:::

### Mètode pas a pas per simular horaris amb reserves (cua FIFO)

A la mateixa execució poden conviure transaccions amb nivells d'aïllament diferents: cadascuna aplica les **seves** regles de reserva.

1. **Ordre d'execució:** processa les operacions en l'ordre temporal original sempre que la transacció no estigui suspesa.
2. **Insereix `LOCK` / `UNLOCK`:** posa `LOCK(G, S/X)` just abans de l'operació; en `READ COMMITTED`, posa `UNLOCK(G)` immediatament després de `R(G)`. En `REPEATABLE READ` i `SERIALIZABLE` (i totes les `X`), allibera a `COMMIT` / `ABORT`.
3. **Bloqueig i cua FIFO:** si una reserva és incompatible amb una reserva vigent d'una altra transacció (o hi ha una transacció al davant a la cua FIFO d'aquell grànul), la transacció **se suspèn** i entra a la cua **FIFO** de $G$. Mentre està suspesa, **no pot executar cap altra instrucció seva**.
4. **Represa en alliberar:** en executar `UNLOCK(G)`, s'atorga la reserva a la primera petició compatible de la cua FIFO de $G$ (si hi ha diverses peticions `S` seguides al capdavant, entren totes fins al primer `X`) i la transacció reprèn la seva execució.

**Exemple (`T1` en `READ COMMITTED`, `T2` en `REPEATABLE READ`):**
Horari original: `T1: R(A)` $\to$ `T2: RU(B), W(B)` $\to$ `T1: R(B)` $\to$ `T2: RU(A), W(A), COMMIT` $\to$ `T1: COMMIT`.

```text
#   T1 (READ COMMITTED)          T2 (REPEATABLE READ)
1   LOCK(A, S)
2   R(A)
3   UNLOCK(A)
4                                LOCK(B, X)
5                                RU(B)
6                                W(B)
7   LOCK(B, S)  [espera B]
8                                LOCK(A, X)      <-- Lliure (T1 va fer UNLOCK(A))
9                                RU(A)
10                               W(A)
11                               COMMIT + UNLOCK(B, A)
12  [obté LOCK(B, S)]
13  R(B)
14  UNLOCK(B)
15  COMMIT
```

*(Nota: si una `T3` en `READ UNCOMMITTED` executés `R(B)` al pas 7, no demanaria `LOCK(B, S)` i llegiria immediatament el valor no confirmat escrit per `T2`, provocant una **lectura no confirmada**).*

---

## 8.7. Abraçades mortals (*deadlocks*) i graf d'espera

Les esperes per reserves incompatibles poden formar un bloqueig circular indefinidament (**abraçada mortal**).

- **Graf d'espera (en un instant concret):** nodes = transaccions; aresta $T_i \xrightarrow{G} T_j$ si $T_i$ està **esperant** una reserva sobre $G$ concedida actualment a $T_j$.
- **Detecció:** existeix abraçada mortal $\iff$ el graf d'espera té un **cicle**.

```text
#   T1 (RR)              T2 (RR)
1   LOCK(A, S)
2   R(A)
3                        LOCK(B, X)
4                        RU(B), W(B)
5   LOCK(B, S) [espera]
6                        LOCK(A, X) [espera]  --> Deadlock!

Graf d'espera:  T1 --(B)--> T2 --(A)--> T1   (cicle)
```

:::deadlockviz
:::

**No confondre els dos grafs a examen:**
- **Graf de precedències:** representa conflictes **ja executats** a l'horari $\rightarrow$ cicle = horari **no serialitzable**.
- **Graf d'espera:** representa bloqueigs **actius en un instant** $\rightarrow$ cicle = **abraçada mortal**.

**Com actua l'SGBD davant abraçades mortals:**
1. **Prevenir-les** abans que es produeixin.
2. **Detectar cicles** al graf d'espera (en demanar reserva, periòdicament o en transaccions lentes) i **cancel·lar (`ABORT`)** una o més transaccions per trencar el cicle.
3. **Temps d'espera màxim (*timeout*):** cancel·lar automàticament la transacció si supera un llindar d'espera.

---

## 8.8. Recuperació física (dietari i còpies de seguretat)

*(Bloc teòric de suport; no apareix habitualment als exàmens finals).*

- **Restauració** (davant `ABORT` o caiguda del sistema): garanteix atomicitat i definitivitat usant el **dietari (*log*)**, on s'anoten canvis, `COMMIT` i `ABORT`:
  - **Cap enrere (*undo*):** desfà els canvis de transaccions avortades o actives en el moment de la fallada.
  - **Cap endavant (*redo*):** refà els canvis de transaccions confirmades que encara no s'havien escrit a disc.
- **Reconstrucció** (davant pèrdua física de disc): combina una **còpia de seguretat** (*estàtica* vs. *dinàmica*; *completa* vs. *incremental*) amb el **dietari** registrat a partir del moment de la còpia.

:::logviz
:::
