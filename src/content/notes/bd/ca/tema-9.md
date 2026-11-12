---
title: "Tema 9: Emmagatzemament i mètodes d'accés"
description: "Arquitectura física i virtual (espais de taules i d'agrupació, pàgines, RID), arbres B+ (estructura, validació i dimensionament), índexs agrupats vs no agrupats, multiatribut, intersecció de RIDs i càlcul de costos."
readTime: "12 min"
order: 12
draft: true
---

Les dades es guarden en **pàgines** de mida fixa en memòria externa. El cost d'una consulta es mesura exclusivament en **nombre de pàgines llegides (E/S)** (sense comptar CPU).

---

## 9.1. Arquitectura física, virtual i estructura de pàgina

:::storagearchviz
:::

- **Extensió (*extent*):** conjunt de pàgines físiques consecutives demanades al SO (afavoreix lectures seqüencials).
- **RID (*Record IDentifier*):** adreça lògica d'una fila dins d'un espai virtual: **`num_pàgina_virtual`** (3 bytes) + **`num_element_VAF`** (1 byte). Manté la fila *clavada* a la pàgina encara que es mogui internament.

### Estructura interna d'una pàgina de dades

:::slottedpageviz
:::

- **Capçalera de fila:** indica la longitud total i l'identificador de la taula a la qual pertany (clau quan conviuen dues taules a la mateixa pàgina).
- **VAF (*Vector d'Adreces de Fila*):** conté els desplaçaments de cada fila dins la pàgina; permet reordenar o moure files internament sense invalidar cap `RID`.

---

## 9.2. Tipus d'espais virtuals (EV de taula vs. d'agrupació)

| Tipus d'EV | Relació | Com s'emmagatzema? | Afavoreix | Penalitza |
| :--- | :---: | :--- | :--- | :--- |
| **Espai de taules** | $1\text{ taula} \leftrightarrow 1\text{ EV} \leftrightarrow 1\text{ fitxer}$ | Cada pàgina només té files d'una taula. | `SELECT` i escaneig d'**una sola taula**. | `JOIN` entre taules separades. |
| **Espai d'agrupació** | $*\text{ taules} \leftrightarrow 1\text{ EV} \leftrightarrow 1\text{ fitxer}$ | Cada fila pare s'emmagatzema seguida de les seves filles relacionades a la **mateixa pàgina**. | **`JOIN`** entre les taules agrupades. | Selecció o escaneig d'**una sola taula** (llegeix files de l'altra). |

**Cost seqüencial sense índexs en EV d'agrupació:** si tenim $N_A$ files pare i cadascuna té $k$ files filles de mida similar amb factor de bloqueig $f$, totes dues taules comparteixen $\left\lceil \frac{N_A \cdot (1 + k)}{f} \right\rceil$ pàgines (aquest serà el cost tant d'un `SELECT * FROM A` com d'un `JOIN A, B` sense índex!).

*(Altres espais teòrics: **fragmentat** per a taules gegants dividides per condició/aleatòriament en varis fitxers, i **d'objectes grans** per separar atributs pesants de les files normals).*

:::evviz
:::

---

## 9.3. Arbres $B^+$: estructura i regles de validació

Un **índex** guarda parelles `(valor, RID)` ordenades per accelerar accessos per valor. En un arbre $B^+$ d'**ordre $d$**:

- **Capacitat:** tots els nodes tenen **màxim $2d$ valors**.
- **Ocupació mínima:** tots els nodes **excepte l'arrel** han de tenir **almenys $d$ valors** ($\ge 50\%$). L'arrel pot tenir entre $1$ i $2d$ valors.
- **Equilibrat:** totes les fulles són exactament al **mateix nivell $h$** (arrel = nivell 1).
- **Nodes interns (dirigeixen la cerca):** $n$ valors i $n+1$ apuntadors $(f_0, v_1, f_1, \dots, v_n, f_n)$, on $f_0 < v_1$, $v_i \le f_i < v_{i+1}$ i $f_n \ge v_n$.
- **Nodes fulla (guarden les entrades `[valor, RID]`):** tenen apuntadors a la fulla anterior i següent (llista doblement enllaçada).

**4 regles per validar si un arbre $B^+$ d'ordre $d$ és correcte (pregunta d'examen):**
1. Cap node supera $2d$ valors, i cap node (tret de l'arrel) té menys de $d$ valors.
2. Totes les fulles estan al mateix nivell i ordenades creixentment d'esquerra a dreta.
3. **Tots** els valors que apareixen als nodes interns han d'estar **repetits a les fulles** (les fulles contenen el 100% dels valors).
4. **No pot haver-hi valors repetits als nodes interns** (ni dins el mateix node ni entre nivells interns diferents), i tot fill compleix $v_i \le x < v_{i+1}$.

:::bplusviz
:::

---

## 9.4. Dimensionament de l'arbre $B^+$ 

### 1. Capacitat màxima en bytes i amb $h$ nivells
Donada mida de pàgina $B$, mida del valor $V$, mida del `RID` $T$ i mida d'apuntador a node $A$:
- **Màxim d'entrades a un node fulla (`nf`):** $nf \cdot (V + T) + 2A \le B \implies nf = \left\lfloor \frac{B - 2A}{V + T} \right\rfloor$
- **Màxim de files amb $h$ nivells (ple al 100%, ordre $d$):** $(2d + 1)^{h-1} \cdot 2d$
- **Total de nodes de l'arbre (ple al 100%):** $\sum_{i=0}^{h-1} (2d + 1)^i$

### 2. Pàgines d'índex i alçada donada una ocupació $p$ (ex. $80\%$)
Donades $N$ tuples, ordre $d$, ocupació $p$ (ex. $0.80$) i factor de bloqueig $f$ de la taula:

1. **Valors per node:** $k = \lfloor 2d \cdot p \rfloor$ *(apuntadors per node intern = $k + 1$)*.
2. **Pàgines del nivell fulla:** $P_{\text{fulles}} = \left\lceil \frac{N}{k} \right\rceil$ *(cada fila té una entrada `[valor, RID]` a les fulles, encara que l'atribut tingui repetits)*.
3. **Nivells interns (de baix a dalt):** divideix iterativament per $(k+1)$ arrodonint amunt ($\lceil P_{\text{fill}} / (k + 1) \rceil$) fins arribar a **`1`** pàgina (l'arrel).
4. **Total pàgines de l'índex:** suma de les pàgines de tots els nivells (fulles + interns + 1).
5. **Alçada $h$:** nombre total de nivells comptant l'arrel i les fulles.
6. **Pàgines de dades de la taula:** $P_{\text{dades}} = \left\lceil \frac{N}{f} \right\rceil$.

:::bplussizingviz
:::

---

## 9.5. Índex agrupat vs. no agrupat i càlcul de costos

- **Índex agrupat (*cluster*):** les files del fitxer de dades estan ordenades físicament segons el valor de l'índex. Com a màxim **1 índex agrupat per taula**.
- **Índex no agrupat:** les files de dades no segueixen l'ordre de l'índex; pot haver-n'hi **tants com es vulgui** per taula.

Sigui $h$ l'alçada de l'arbre, $k$ les entrades per fulla, $f$ el factor de bloqueig de dades, $M$ el nombre de files que compleixen la condició de l'índex, i $F = \max\left(0, \left\lceil \frac{M}{k} \right\rceil - 1\right)$ el nombre de fulles addicionals recorregudes (si l'arrel és en memòria, resta $1$ al cost d'índex).

| Tipus d'accés / consulta | Cost d'índex | Cost de dades | Cost total |
| :--- | :---: | :---: | :--- |
| **Recorregut seqüencial** (sense índex) | $0$ | $\lceil N / f \rceil$ | $\lceil N / f \rceil$ |
| **Igualtat única (`PK` / `UNIQUE`)** | $h$ | $1$ *(0 si no existeix)* | $h + 1$ *(o $h$ si no existeix)* |
| **Agrupat** (`=` amb repetits o rang `>=`) | $h + F$ | $\lceil M / f \rceil$ | $(h + F) + \lceil M / f \rceil$ |
| **No agrupat** (`=` amb repetits o rang `>=`) | $h + F$ | $M$ | $(h + F) + M$ |
| ***Index-Only Scan*** (`SELECT 1` / `EXISTS` / columnes dins l'índex) | $h + F$ | **$0$** | $h + F$ |
| **Intersecció de RIDs** (2 índexs amb `AND`, $M_\cap$ coincidències) | $(h_1 + F_1) + (h_2 + F_2)$ | $M_\cap$ *(o $\lceil M_\cap / f \rceil$ si agrupat contigu)* | $(h_1 + F_1) + (h_2 + F_2) + M_\cap$ |

**Detalls crítics d'examen:**
- **Quan convé no usar l'índex?** Si $(h + F) + M \ge \lceil N / f \rceil$, és més barat fer un **recorregut seqüencial** de tota la taula!
- **Consultes amb `OR` (`WHERE a = X OR b = Y`):** un sol índex no basta; alternatives del SGBD: unir RIDs dels dos índexs (*union de RIDs*) o fer recorregut seqüencial de la taula.

:::indexcostviz
:::

---

## 9.6. Índexs multiatribut (`[A, B]`)

Un índex multiatribut sobre `[A, B]` ordena les entrades **lexicogràficament** (primer per $A$; a igualtat d'$A$, per $B$).

| Consulta | Com es resol amb índex `[A, B]`? |
| :--- | :--- |
| `WHERE A = x AND B = y` (o `B > y`) / `ORDER BY A, B` | **Eficient:** totes les entrades buscades són **contigües** a les fulles ($h + F + \text{dades}$). |
| `WHERE A > x AND B = y` / `ORDER BY B, A` | **Ineficient:** `B` no és contigu quan varia `A`; cal recórrer tot el rang d'$A > x$ (o totes les fulles). |
| `SELECT A FROM T WHERE B = y` *(amb `[A, B]`)* | **Index-only scan complet:** totes les columnes són a l'índex (**0 accessos a dades**), però en filtrar pel **2n atribut** cal escanejar **totes les fulles** (`cost = (h - 1) + P_fulles`). |

:::multiindexviz
:::

---

## 9.7. Exemple numèric tipus d'examen

**Enunciat:** Taula `R` amb $N = 100.000$ files, $f = 5$ tuples/pàgina. Índex sobre `id` (agrupat) i sobre `ciutat` (no agrupat), tots dos d'ordre $d = 50$ i ocupació $80\%$. La consulta `WHERE id > 20000 AND ciutat = 'BCN'` té $80.000$ files amb `id > 20000`, $1.000$ de `'BCN'` i $200$ que compleixen totes dues condicions.

1. **Mida i alçada dels índexs:**
   - Valors per node: $k = 2 \cdot 50 \cdot 0.80 = 80$ (apuntadors interns = $81$).
   - Fulles: $\lceil 100.000 / 80 \rceil = 1.250$. Nivell superior: $\lceil 1.250 / 81 \rceil = 16$. Arrel: $\lceil 16 / 81 \rceil = 1$.
   - **Total pàgines índex** $= 1.250 + 16 + 1 = 1.267$, **alçada $h = 3$**. (Dades: $\lceil 100.000 / 5 \rceil = 20.000$ pàgines).
2. **Comparativa d'estratègies per resoldre la consulta:**
   - **Només índex agrupat (`id > 20000`):** $F_{\text{id}} = \lceil 80.000 / 80 \rceil - 1 = 999 \implies (3 + 999) + \lceil 80.000 / 5 \rceil = 17.002$ pàgines.
   - **Només índex no agrupat (`ciutat = 'BCN'`):** $F_{\text{ciutat}} = \lceil 1.000 / 80 \rceil - 1 = 12 \implies (3 + 12) + 1.000 = 1.015$ pàgines.
   - **Intersecció de RIDs (`id` + `ciutat`):** $(3 + 999) + (3 + 12) + 200 = 1.217$ pàgines *(pitjor que usar només `ciutat`, perquè recórrer $999$ fulles d'`id` costa massa!)*.

:::strategyviz
:::
