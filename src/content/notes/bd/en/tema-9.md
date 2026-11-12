---
title: "Topic 9: Storage and access methods"
description: "Physical and virtual architecture (table and cluster spaces, pages, RID), B+ trees (structure, validation and sizing), clustered vs non-clustered indexes, multi-attribute indexes, RID intersection, and cost calculation."
readTime: "12 min"
order: 12
draft: true
---

Data is stored in fixed-size **pages** in external memory. The cost of a query is measured exclusively in **number of pages read (I/O)** (excluding CPU cost).

---

## 9.1. Physical/virtual architecture and page structure

:::storagearchviz
:::

- **Extent:** set of consecutive physical pages requested from the OS (favors sequential reads).
- **RID (*Record IDentifier*):** logical address of a row inside a virtual space: **`virtual_page_num`** (3 bytes) + **`VAF_entry_num`** (1 byte). Keeps the row *pinned* to the page even if it moves internally.

### Internal structure of a data page

:::slottedpageviz
:::

- **Row header:** indicates the total length and the identifier of the table it belongs to (essential when two tables coexist on the same page).
- **VAF (*Row Address Vector / Slot Array*):** contains the offsets of each row within the page; allows reordering or moving rows internally without invalidating any `RID`.

---

## 9.2. Types of virtual spaces (table VS vs. cluster VS)

| VS type | Ratio | How is it stored? | Favors | Penalizes |
| :--- | :---: | :--- | :--- | :--- |
| **Table space** | $1\text{ table} \leftrightarrow 1\text{ VS} \leftrightarrow 1\text{ file}$ | Each page only holds rows of one table. | `SELECT` and scans of **a single table**. | `JOIN` between separate tables. |
| **Cluster space** | $*\text{ tables} \leftrightarrow 1\text{ VS} \leftrightarrow 1\text{ file}$ | Each parent row is stored followed by its related child rows on the **same page**. | **`JOIN`** between the clustered tables. | Selection or scan of **a single table** (reads rows of the other). |

**Sequential cost without indexes in a cluster VS:** if we have $N_A$ parent rows and each has $k$ child rows of similar size with blocking factor $f$, both tables share $\left\lceil \frac{N_A \cdot (1 + k)}{f} \right\rceil$ pages (this is the cost of both `SELECT * FROM A` and `JOIN A, B` without an index!).

*(Other theoretical spaces: **partitioned/fragmented** for huge tables split by condition/randomly into multiple files, and **large object** spaces to separate heavy attributes from regular rows).*

:::evviz
:::

---

## 9.3. $B^+$ trees: structure and validation rules

An **index** stores sorted `(value, RID)` pairs to speed up lookups by value. In a $B^+$ tree of **order $d$**:

- **Capacity:** every node has **at most $2d$ values**.
- **Minimum occupancy:** every node **except the root** must have **at least $d$ values** ($\ge 50\%$). The root may have between $1$ and $2d$ values.
- **Balanced:** all leaves are at the exact **same level $h$** (root = level 1).
- **Internal nodes (guide the search):** $n$ values and $n+1$ pointers $(f_0, v_1, f_1, \dots, v_n, f_n)$, where $f_0 < v_1$, $v_i \le f_i < v_{i+1}$, and $f_n \ge v_n$.
- **Leaf nodes (store `[value, RID]` entries):** have pointers to the previous and next leaf (doubly linked list).

**4 rules to validate whether a $B^+$ tree of order $d$ is valid (exam question):**
1. No node exceeds $2d$ values, and no node (other than the root) has fewer than $d$ values.
2. All leaves are at the same level and sorted in ascending order from left to right.
3. **All** values appearing in internal nodes must be **repeated in the leaves** (leaves contain 100% of the values).
4. **No value may repeat among internal nodes** (neither within the same node nor across different internal levels), and every child satisfies $v_i \le x < v_{i+1}$.

:::bplusviz
:::

---

## 9.4. $B^+$ tree sizing

### 1. Maximum capacity in bytes and with $h$ levels
Given page size $B$, value size $V$, `RID` size $T$, and node pointer size $A$:
- **Max entries in a leaf node (`nf`):** $nf \cdot (V + T) + 2A \le B \implies nf = \left\lfloor \frac{B - 2A}{V + T} \right\rfloor$
- **Max rows with $h$ levels (100% full, order $d$):** $(2d + 1)^{h-1} \cdot 2d$
- **Total tree nodes (100% full):** $\sum_{i=0}^{h-1} (2d + 1)^i$

### 2. Index pages and height given occupancy $p$ (e.g., $80\%$)
Given $N$ tuples, order $d$, occupancy $p$ (e.g., $0.80$), and table blocking factor $f$:

1. **Values per node:** $k = \lfloor 2d \cdot p \rfloor$ *(pointers per internal node = $k + 1$)*.
2. **Leaf-level pages:** $P_{\text{leaves}} = \left\lceil \frac{N}{k} \right\rceil$ *(every row has a `[value, RID]` entry in the leaves, even if the attribute has duplicates)*.
3. **Internal levels (bottom-up):** iteratively divide by $(k+1)$ rounding up ($\lceil P_{\text{child}} / (k + 1) \rceil$) until reaching **`1`** page (the root).
4. **Total index pages:** sum of pages across all levels (leaves + internals + 1).
5. **Height $h$:** total number of levels counting the root and the leaves.
6. **Table data pages:** $P_{\text{data}} = \left\lceil \frac{N}{f} \right\rceil$.

:::bplussizingviz
:::

---

## 9.5. Clustered vs. non-clustered index and cost calculation

- **Clustered index:** the rows in the data file are physically ordered by the index value. At most **1 clustered index per table**.
- **Non-clustered index:** data rows do not follow the index order; there can be **as many as desired** per table.

Let $h$ be the tree height, $k$ the entries per leaf, $f$ the data blocking factor, $M$ the number of rows matching the index condition, and $F = \max\left(0, \left\lceil \frac{M}{k} \right\rceil - 1\right)$ the number of additional leaf pages traversed (if the root is in memory, subtract $1$ from the index cost).

| Access type / query | Index cost | Data cost | Total cost |
| :--- | :---: | :---: | :--- |
| **Sequential scan** (no index) | $0$ | $\lceil N / f \rceil$ | $\lceil N / f \rceil$ |
| **Unique equality (`PK` / `UNIQUE`)** | $h$ | $1$ *(0 if non-existent)* | $h + 1$ *(or $h$ if non-existent)* |
| **Clustered** (`=` with duplicates or range `>=`) | $h + F$ | $\lceil M / f \rceil$ | $(h + F) + \lceil M / f \rceil$ |
| **Non-clustered** (`=` with duplicates or range `>=`) | $h + F$ | $M$ | $(h + F) + M$ |
| ***Index-Only Scan*** (`SELECT 1` / `EXISTS` / columns inside index) | $h + F$ | **$0$** | $h + F$ |
| **RID intersection** (2 indexes with `AND`, $M_\cap$ matches) | $(h_1 + F_1) + (h_2 + F_2)$ | $M_\cap$ *(or $\lceil M_\cap / f \rceil$ if clustered contiguous)* | $(h_1 + F_1) + (h_2 + F_2) + M_\cap$ |

**Critical exam details:**
- **When is it better not to use the index?** If $(h + F) + M \ge \lceil N / f \rceil$, a **sequential scan** of the whole table is cheaper!
- **Queries with `OR` (`WHERE a = X OR b = Y`):** a single index is not enough; DBMS alternatives: unite RIDs from both indexes (*RID union*) or perform a sequential table scan.

:::indexcostviz
:::

---

## 9.6. Multi-attribute indexes (`[A, B]`)

A multi-attribute index on `[A, B]` sorts entries **lexicographically** (first by $A$; on ties in $A$, by $B$).

| Query | How is it resolved with index `[A, B]`? |
| :--- | :--- |
| `WHERE A = x AND B = y` (or `B > y`) / `ORDER BY A, B` | **Efficient:** all matching entries are **contiguous** in the leaves ($h + F + \text{data}$). |
| `WHERE A > x AND B = y` / `ORDER BY B, A` | **Inefficient:** `B` is not contiguous when `A` varies; must scan the whole $A > x$ range (or all leaves). |
| `SELECT A FROM T WHERE B = y` *(with `[A, B]`)* | **Full index-only scan:** all columns are in the index (**0 data accesses**), but filtering by the **2nd attribute** requires scanning **all leaves** (`cost = (h - 1) + P_leaves`). |

:::multiindexviz
:::

---

## 9.7. Exam-style numerical example

**Problem:** Table `R` with $N = 100{,}000$ rows, $f = 5$ tuples/page. Index on `id` (clustered) and on `ciutat` (non-clustered), both of order $d = 50$ and $80\%$ occupancy. The query `WHERE id > 20000 AND ciutat = 'BCN'` has $80{,}000$ rows with `id > 20000`, $1{,}000$ from `'BCN'`, and $200$ matching both conditions.

1. **Index size and height:**
   - Values per node: $k = 2 \cdot 50 \cdot 0.80 = 80$ (internal pointers = $81$).
   - Leaves: $\lceil 100{,}000 / 80 \rceil = 1{,}250$. Upper level: $\lceil 1{,}250 / 81 \rceil = 16$. Root: $\lceil 16 / 81 \rceil = 1$.
   - **Total index pages** $= 1{,}250 + 16 + 1 = 1{,}267$, **height $h = 3$**. (Data: $\lceil 100{,}000 / 5 \rceil = 20{,}000$ pages).
2. **Comparison of strategies to solve the query:**
   - **Only clustered index (`id > 20000`):** $F_{\text{id}} = \lceil 80{,}000 / 80 \rceil - 1 = 999 \implies (3 + 999) + \lceil 80{,}000 / 5 \rceil = 17{,}002$ pages.
   - **Only non-clustered index (`ciutat = 'BCN'`):** $F_{\text{ciutat}} = \lceil 1{,}000 / 80 \rceil - 1 = 12 \implies (3 + 12) + 1{,}000 = 1{,}015$ pages.
   - **RID intersection (`id` + `ciutat`):** $(3 + 999) + (3 + 12) + 200 = 1{,}217$ pages *(worse than using `ciutat` alone, because traversing $999$ leaves of `id` costs too much!)*.

:::strategyviz
:::
