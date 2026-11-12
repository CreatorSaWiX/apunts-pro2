---
title: "Topic 8: Transactions and concurrency"
description: "ACID properties, interferences, serializability, recoverability, lock-based control (2PL), isolation levels, and deadlocks."
readTime: "10 min"
order: 11
draft: false
isNew: true
---

A **transaction** is a set of read and/or update operations on the DB that executes as an indivisible unit: either it commits as a whole, or it is completely undone.

---

## 8.1. SQL syntax and ACID properties

```sql
START TRANSACTION;  -- Explicit start (any SQL statement starts one implicitly)
-- SELECT, INSERT, UPDATE, DELETE operations...
COMMIT;             -- Confirms and makes changes permanent
ROLLBACK;           -- Cancels and undoes all changes (also ABORT)
```

| Property | Meaning | Who guarantees it? |
| :--- | :--- | :--- |
| **A — Atomicity** | All or nothing: if the transaction fails or aborts, all prior changes are undone. | DBMS |
| **C — Consistency** | Brings the DB from one valid state to another valid state (coherent data and rules). | Programmer + DBMS constraints |
| **I — Isolation** | Concurrent execution produces the same effect as a serial execution. | DBMS (concurrency control) |
| **D — Durability** | Once committed (`COMMIT`), changes persist across system crashes. | DBMS (recovery) |

**Watch out for errors and consistency on exams:**
- If a statement inside `START TRANSACTION ... COMMIT` violates a `CHECK`, a foreign key, or a trigger raises `RAISE EXCEPTION`, **the entire transaction aborts (`ROLLBACK`)** and all earlier operations in the block are undone.
- Triggering no DDL constraint violation does not guarantee **Consistency (C)**: if transaction code moves data but forgets to update a derived attribute (with no trigger maintaining it), it violates consistency due to a programming error.

:::acidviz
:::

---

## 8.2. The 5 transaction interferences

They occur when two or more transactions execute concurrently without sufficient isolation:

| Interference | Description | Scope | Minimum level to prevent it |
| :--- | :--- | :---: | :--- |
| **Lost update** | Two transactions read a data item and update it; the second overwrites the first's change. | 1 item | `READ UNCOMMITTED` |
| **Dirty read (uncommitted read)** | $T_1$ reads data modified by $T_2$ that is not yet final ($T_2$ runs `ABORT` or modifies it again before committing). | 1 item | `READ COMMITTED` |
| **Non-repeatable read** | $T_1$ reads the same data item twice and gets different values because $T_2$ modified it in between. | 1 item | `REPEATABLE READ` |
| **Inconsistent analysis** | $T_1$ reads a set of data items ($A$ and $B$) while $T_2$ modifies them; $T_1$ sees $A$ before the change and $B$ after (or vice versa). | Set | `REPEATABLE READ` |
| **Phantoms** | $T_1$ reads all rows matching condition $C$; $T_2$ inserts a row matching $C$ or updates one that did not match so it now matches; $T_1$ re-queries $C$ and sees the new row. | Set | `SERIALIZABLE` |

:::interferencesviz
:::

### Classic trap: non-repeatable read vs. phantom

Given two identical queries `SELECT ... WHERE cond` inside $T_1$:
- If $T_2$ modifies a row that **already matched** `cond` and still matches it $\rightarrow$ **Non-repeatable read** (same row, different value).
- If $T_2$ **adds** a new row to the result set (new `INSERT` matching `cond`, or `UPDATE` of a row that previously **did not** match `cond` and now does) $\rightarrow$ **Phantom**.

---

## 8.3. Serializability and precedence graph

- **Granule ($G$):** elementary unit controlled by the DBMS (on exams, usually **the row**, identified by its PK).
- **Schedule (history):** concurrent execution of transactions preserving the order of actions within each transaction.
- **Serial schedule:** no interleaving between transactions ($n!$ possible schedules for $n$ transactions).

### Translating SQL to operations on granules

| SQL statement | Operation on granule $G$ | Detail |
| :--- | :--- | :--- |
| `SELECT` | `R(G)` | One read per returned/read row. |
| `INSERT / UPDATE / DELETE` | `RU(G)` followed by `W(G)` | `RU` = read with intent to write. If multiple rows are affected, write `RU(G), W(G)` for each one. |
| Set with **Phantoms** | `R(IC)` / `RU(IC), W(IC)` | `IC` (Control Information) is only included if the schedule exhibits phantoms. |

:::granuleviz
:::

### Conflicting actions and precedence graph

Two actions are **conflicting (non-commutable)** if they satisfy all three conditions:
1. They belong to **different transactions** ($T_i \neq T_j$).
2. They operate on the **same granule** ($G$).
3. **At least one is a write** (`W`). *(Two reads `R`, or `R` with `RU` without `W`, do not conflict with each other).*

**Building the precedence graph:**
- Nodes = transactions.
- For every pair of conflicting actions on $G$ where $T_i$'s action executes **before** $T_j$'s, add the directed edge $T_i \xrightarrow{G} T_j$.

```text
Golden rule:
  Serializable schedule  <==>  Precedence graph WITHOUT CYCLES (acyclic)
```

- **Equivalent serial schedules:** all valid **topological orders** of the graph. For example, if there are only edges $T_2 \to T_1$ and $T_2 \to T_3$ (no edge between $T_1$ and $T_3$), both `T2; T1; T3` and `T2; T3; T1` are equivalent serial schedules.
- **Single-transaction schedule:** always serializable (it is already a serial schedule).

:::precedenceviz
:::

---

## 8.4. Recoverability

Serializability theory assumes all transactions end with `COMMIT`, but in practice some may execute `ABORT`.

> A schedule satisfies the **recoverability criterion** if no transaction $T_2$ that reads or writes a granule written by another transaction $T_1$ commits (`COMMIT`) before $T_1$ does.

```text
# time    T1        T2
1         RU(A)
2         W(A)
3                   RU(A)
4                   W(A)
5                   COMMIT   <-- Violates recoverability (T1 has not committed yet)
6         ABORT              <-- Impossible to undo T2's committed change
```

*(A schedule with a single transaction is always recoverable).*

:::recoverviz
:::

---

## 8.5. Lock-based concurrency control (2PL / PR2F)

Before operating on a granule $G$, a transaction must request a lock (`LOCK(G, m)`), and release it with `UNLOCK(G)`:

| Mode | Allows | Compatible with `S`? | Compatible with `X`? |
| :--- | :--- | :---: | :---: |
| **`S` (*Shared*)** | Reads only (`R`) | Yes | No |
| **`X` (*eXclusive*)** | Reads and writes (`R`, `RU`, `W`) | No | No |

**Lock request rules:**
- `R(G)` $\rightarrow$ `LOCK(G, S)` (except in `READ UNCOMMITTED`).
- `RU(G), W(G)` $\rightarrow$ **`LOCK(G, X)` before `RU(G)`**.
- If a transaction already holds `LOCK(G, S)` and later wants to do `RU(G), W(G)`, it must request `LOCK(G, X)` (lock conversion: if another transaction holds `S` on $G$, it must wait).
- If a transaction already holds `LOCK(G, S)` (to repeat a read) or `LOCK(G, X)` (to read or write again), it **does not request the lock again**.

:::lockviz
:::

### Two-Phase Locking Protocol (2PL / PR2F)

- **2PL (PR2F):** every lock is acquired before operating on the granule and **no** new lock is ever requested after releasing any lock. It guarantees **serializability** (if all commit), but **does not prevent dirty reads or non-recoverable schedules** if locks are released before ending.
- **Strict / Strong 2PL:** 2PL + holding **all** locks until transaction termination (`COMMIT` or `ABORT`). Guarantees both serializability and recoverability.

:::pr2fviz
:::

---

## 8.6. Isolation levels and schedule simulation

```sql
SET TRANSACTION { READ ONLY | READ WRITE }
    ISOLATION LEVEL { READ UNCOMMITTED | READ COMMITTED | REPEATABLE READ | SERIALIZABLE };
```

| Isolation level | `S` locks | `X` locks | `IC` locks | Interferences prevented |
| :--- | :--- | :--- | :---: | :--- |
| **`READ UNCOMMITTED`** | **Does not acquire `S` locks** | Until the end | No | Lost update |
| **`READ COMMITTED`** | Only during the read (`UNLOCK` right after `R`) | Until the end | No | + Dirty read |
| **`REPEATABLE READ`** | Until the end | Until the end | No | + Non-repeatable read and Inconsistent analysis |
| **`SERIALIZABLE`** | Until the end | Until the end | Yes (`S`/`X` until the end) | All (includes Phantoms) |

:::isolationviz
:::

### Step-by-step method to simulate schedules with locks (FIFO queue)

Transactions with different isolation levels can coexist in the same execution: each applies its **own** locking rules.

1. **Execution order:** process operations in their original chronological order as long as the transaction is not suspended.
2. **Insert `LOCK` / `UNLOCK`:** place `LOCK(G, S/X)` right before the operation; in `READ COMMITTED`, place `UNLOCK(G)` immediately after `R(G)`. In `REPEATABLE READ` and `SERIALIZABLE` (and all `X` locks), release at `COMMIT` / `ABORT`.
3. **Blocking and FIFO queue:** if a lock is incompatible with an active lock held by another transaction (or another transaction is ahead in the FIFO queue for that granule), the transaction **suspends** and enters the **FIFO** queue of $G$. While suspended, it **cannot execute any further instructions of its own**.
4. **Resuming on release:** when `UNLOCK(G)` executes, the lock is granted to the first compatible request in the FIFO queue of $G$ (if there are several consecutive `S` requests at the front, all of them enter up to the first `X`) and the transaction resumes execution.

**Example (`T1` in `READ COMMITTED`, `T2` in `REPEATABLE READ`):**
Original schedule: `T1: R(A)` $\to$ `T2: RU(B), W(B)` $\to$ `T1: R(B)` $\to$ `T2: RU(A), W(A), COMMIT` $\to$ `T1: COMMIT`.

```text
#   T1 (READ COMMITTED)          T2 (REPEATABLE READ)
1   LOCK(A, S)
2   R(A)
3   UNLOCK(A)
4                                LOCK(B, X)
5                                RU(B)
6                                W(B)
7   LOCK(B, S)  [waits for B]
8                                LOCK(A, X)      <-- Free (T1 ran UNLOCK(A))
9                                RU(A)
10                               W(A)
11                               COMMIT + UNLOCK(B, A)
12  [gets LOCK(B, S)]
13  R(B)
14  UNLOCK(B)
15  COMMIT
```

*(Note: if a `T3` in `READ UNCOMMITTED` executed `R(B)` at step 7, it would not request `LOCK(B, S)` and would immediately read the uncommitted value written by `T2`, causing a **dirty read**).*

---

## 8.7. Deadlocks and wait-for graph

Waits for incompatible locks can form an indefinite circular block (**deadlock**).

- **Wait-for graph (at a specific instant):** nodes = transactions; edge $T_i \xrightarrow{G} T_j$ if $T_i$ is **waiting** for a lock on $G$ currently held by $T_j$.
- **Detection:** a deadlock exists $\iff$ the wait-for graph has a **cycle**.

```text
#   T1 (RR)              T2 (RR)
1   LOCK(A, S)
2   R(A)
3                        LOCK(B, X)
4                        RU(B), W(B)
5   LOCK(B, S) [waits]
6                        LOCK(A, X) [waits]  --> Deadlock!

Wait-for graph:  T1 --(B)--> T2 --(A)--> T1   (cycle)
```

:::deadlockviz
:::

**Do not confuse the two graphs on exams:**
- **Precedence graph:** represents conflicts **already executed** in the schedule $\rightarrow$ cycle = **non-serializable** schedule.
- **Wait-for graph:** represents **active locks/waits at an instant** $\rightarrow$ cycle = **deadlock**.

**How the DBMS handles deadlocks:**
1. **Prevent them** before they occur.
2. **Detect cycles** in the wait-for graph (when requesting a lock, periodically, or on slow transactions) and **abort (`ABORT`)** one or more transactions to break the cycle.
3. **Timeout:** automatically abort the transaction if it exceeds a wait threshold.

---

## 8.8. Physical recovery (log and backups)

*(Supporting theoretical section; does not typically appear on final exams).*

- **Restoration** (on `ABORT` or system crash): guarantees atomicity and durability using the **log** (*journal*), which records changes, `COMMIT`, and `ABORT`:
  - **Backward (*undo*):** undoes changes from transactions that were aborted or active at failure time.
  - **Forward (*redo*):** redoes changes from committed transactions that had not yet been flushed to disk.
- **Reconstruction** (on physical disk loss): combines a **backup** (*static* vs. *dynamic*; *full* vs. *incremental*) with the **log** recorded from the moment of the backup.

:::logviz
:::
