---
title: "Tema 1: Consultes SQL (DQL)"
description: "Sintaxi de SELECT, filtres WHERE, funcions d'agregació, agrupaments (GROUP BY, HAVING), joins multitaula, operacions de conjunts i subconsultes."
readTime: "12 min"
order: 1
draft: false
---

El llenguatge de consulta (**DQL**) s'articula al voltant de la sentència `SELECT` per extreure i transformar la informació emmagatzemada.

Per a tots els exemples s'utilitza aquest esquema de referència:

:::sqlviz{simulation="esquema_empresa"}
:::

---

## 1.1. Estructura bàsica de `SELECT`

```sql [Ordre de les clàusules]
SELECT [DISTINCT | ALL] col_1, col_2 ...
FROM taula
[WHERE condicio]
[GROUP BY col_a, col_b ...]
[HAVING condicio_grup]
[ORDER BY col_x [ASC | DESC] ...];
```

### Projecció i càlculs:
* **Totes les columnes:** `SELECT * FROM empleats;`
* **Columnes específiques:** `SELECT nom_empl, sou FROM empleats;`
* **Càlculs amb àlies (`AS`):**
  ```sql
  SELECT nom_empl, sou * 1.05 AS sou_incrementat FROM empleats;
  ```
* **Eliminació de duplicats (`DISTINCT`):**
  ```sql
  SELECT DISTINCT ciutat_empl FROM empleats;
  ```

### Ordenació (`ORDER BY`):
* `ASC` (ascendent, per defecte) o `DESC` (descendent).
```sql
SELECT * FROM empleats 
ORDER BY num_dpt ASC, sou DESC;
```

---

## 1.2. Filtres a la clàusula `WHERE`

| Operador | Ús | Exemple |
| :--- | :--- | :--- |
| **Comparació** | `=`, `<>`, `<`, `<=`, `>`, `>=` | `sou > 200000` |
| **Lògics** | `AND`, `OR`, `NOT` | `num_dpt = 1 AND sou > 150000` |
| **Rangs** | `BETWEEN a AND b` *(inclusiu)* | `sou BETWEEN 200000 AND 300000` |
| **Llistes** | `IN (v1, v2...)` / `NOT IN` | `ciutat_empl IN ('VIC', 'MATARO')` |
| **Text** | `LIKE 'patro'` (`%` $\ge 0$ caràcters, `_` = 1) | `nom_empl LIKE 'J%'` |
| **Nuls** | `IS NULL` / `IS NOT NULL` | `ciutat_empl IS NOT NULL` |

**Compte amb els NULL a les condicions:** Mai utilitzis `= NULL` o `<> NULL`. En SQL qualsevol comparació directa amb `NULL` avalua a *Unknown* (mai cert en filtres). Utilitza sempre **`IS NULL`** o **`IS NOT NULL`**.

---

## 1.3. Funcions d'agregació

Processen múltiples files i retornen un **únic valor resum escalar**:

| Funció | Descripció | Comportament amb valors `NULL` |
| :--- | :--- | :--- |
| `COUNT(*)` | Total de files retornades | **Compta totes les files** (inclou nuls). |
| `COUNT(col)` | Files amb valor no nul a `col` | Ignora valors `NULL`. |
| `COUNT(DISTINCT col)` | Valors diferents i no nuls | Ignora duplicats i valors `NULL`. |
| `SUM(col)` | Suma aritmètica | Ignora valors `NULL`. |
| `AVG(col)` | Mitjana aritmètica | Ignora valors `NULL`. |
| `MIN(col)` / `MAX(col)` | Valor mínim / màxim | Ignora valors `NULL`. |

* **Comportament amb conjunts buits:** Si cap fila compleix el filtre, `COUNT` retorna **`0`**, mentre que `SUM`, `AVG`, `MIN` i `MAX` retornen **`NULL`**.

```sql [Exemple d'agregació]
SELECT COUNT(*), AVG(sou), MAX(sou)
FROM empleats 
WHERE num_dpt = 2;
```

---

## 1.4. Agrupaments (`GROUP BY`) i condicions sobre grups (`HAVING`)

### Clàusula `GROUP BY`:
Divideix les files en grups segons els valors de les columnes indicades.

* **Regla d'or de GROUP BY:** Tota columna individual del `SELECT` **ha d'aparèixer al GROUP BY o bé dins d'una funció d'agregació**. No es poden projectar columnes independents no agrupades.

```sql [Sou mitjà per departament]
SELECT num_dpt, AVG(sou) AS sou_mig
FROM empleats 
GROUP BY num_dpt;
```

### `WHERE` vs. `HAVING`:
* `WHERE`: Filtra **files individuals abans** d'agrupar. Mai pot contenir funcions d'agregació.
* `HAVING`: Filtra **grups resultants després** de l'agrupament. Ideal per a condicions sobre funcions d'agregació (`COUNT`, `AVG`...).

```sql [Combinació WHERE + GROUP BY + HAVING]
SELECT num_dpt, AVG(sou) AS sou_mig
FROM empleats
WHERE sou > 200000        -- 1. Filtra empleats individuals amb sou > 200k
GROUP BY num_dpt          -- 2. Agrupa per departament
HAVING COUNT(*) > 1;      -- 3. Manté només departaments amb més d'1 empleat que compleixi el WHERE
```

---

## 1.5. Consultes multitaula (*Joins*)

Permeten combinar files de múltiples taules relacionades mitjançant claus foranes.

### 1. `INNER JOIN ... ON` (Sintaxi estàndard recomanada)
```sql [INNER JOIN explícit]
SELECT e.nom_empl, d.nom_dpt
FROM empleats e
INNER JOIN departaments d ON e.num_dpt = d.num_dpt;
```

:::sqlviz{simulation="select_filtre_join"}
:::

### 2. `NATURAL INNER JOIN`
Iguala automàticament les columnes que comparteixen el mateix nom a ambdues taules:
```sql
SELECT e.nom_empl, d.nom_dpt
FROM empleats e
NATURAL INNER JOIN departaments d;
```

### 3. Join combinat amb agregació
```sql [Nom de departament amb sou mig]
SELECT d.nom_dpt, AVG(e.sou) AS sou_mig
FROM empleats e
INNER JOIN departaments d ON e.num_dpt = d.num_dpt
GROUP BY d.nom_dpt
HAVING COUNT(*) > 1;
```

---

## 1.6. Operacions de conjunts (`UNION`)

Combina verticalment els resultats de dos `SELECT` independents en un únic resultat:

```sql [Unió de ciutats]
SELECT ciutat_dpt AS ciutat FROM departaments
UNION
SELECT ciutat_empl AS ciutat FROM empleats;
```

* `UNION`: Elimina automàticament files duplicades.
* `UNION ALL`: Conserva els duplicats (més ràpid en execució).
* **Requisits:** Totes dues consultes han de tenir exactament el mateix nombre de columnes i tipus compatibles. El `ORDER BY` només es pot posar al final de tot.

---

## 1.7. Subconsultes (*Subqueries*)

### Diferència clau: `NOT IN` vs `NOT EXISTS`
Per trobar els departaments **sense cap empleat**:

#### Amb `NOT IN` (Compte amb els valors `NULL`!):
```sql
SELECT * FROM departaments
WHERE num_dpt NOT IN (
    SELECT num_dpt FROM empleats
    WHERE num_dpt IS NOT NULL -- IMPRESCINDIBLE!
);
```

**La trampa de NULL amb `NOT IN`:** Si la subconsulta retorna encara que sigui un sol valor `NULL`, l'expressió `NOT IN` retornarà sempre *Unknown* i **la consulta no retornarà cap fila**. Per fer-la segura cal afegir sempre `WHERE col IS NOT NULL`.

#### Amb `NOT EXISTS` (Opció recomanada i segura):
```sql [Subconsulta correlacionada]
SELECT * FROM departaments d
WHERE NOT EXISTS (
    SELECT * FROM empleats e
    WHERE e.num_dpt = d.num_dpt
);
```
`NOT EXISTS` només avalua si la subconsulta retorna alguna fila; és completament immune als valors `NULL`.

---

## 1.8. Tipus i funcions temporals

* **Tipus:** `DATE` (`'YYYY-MM-DD'`), `TIME` (`'HH:MM:SS'`), `TIMESTAMP`, `INTERVAL`.
* **Funcions actuals:** `CURRENT_DATE`, `CURRENT_TIME`, `NOW()`.

### Extracció (`EXTRACT`):
```sql
EXTRACT(YEAR FROM data)       -- Any (ex: 2024)
EXTRACT(MONTH FROM data)      -- Mes (1 a 12)
EXTRACT(DOW FROM data)        -- Dia setmana (0 = Diumenge)
```

### Aritmètica d'intervals:
```sql
SELECT * FROM viatges
WHERE moment > (data_sortida + INTERVAL '10 min');
```

---

## 1.9. Criteris de Qualitat de la FIB (Penalitzacions d'Examen)

Als exàmens de la FIB, encara que una consulta SQL retorni el resultat correcte, **s'apliquen penalitzacions directes** si no compleix aquests criteris de qualitat:

1. **Sense taules innecessàries al `FROM`:** No incloure mai una taula si tots els atributs necessaris (per projectar o filtrar) ja es troben en una altra taula vinculada per clau forana:
   * ❌ *Malament:* `SELECT e.nom FROM empleats e, departaments d WHERE e.num_dpt = d.num_dpt AND d.num_dpt = 20;`
   * ✅ *Bé:* `SELECT e.nom FROM empleats e WHERE e.num_dpt = 20;`
2. **Ús estricte de `DISTINCT`:**
   * S'ha d'usar **únicament** si la consulta pot generar duplicats per algun contingut vàlid de la BD.
   * **No s'ha d'usar mai** si la presència d'una clau primària o clau candidata garanteix matemàticament que el resultat no tindrà repetits.
3. **No usar `GROUP BY` per eliminar duplicats:** Per eliminar repetits s'usa `DISTINCT`, mai un `GROUP BY` sense funcions d'agregació.
4. **No usar `GROUP BY` sobre un grup únic:** Si una subconsulta filtra per una clau o calcula un agregat sobre tot un conjunt, no s'hi afegeix `GROUP BY`:
   * ❌ *Malament:* `SELECT AVG(sou) FROM empleats WHERE num_dpt = 5 GROUP BY num_dpt;`
   * ✅ *Bé:* `SELECT AVG(sou) FROM empleats WHERE num_dpt = 5;`
5. **Sense condicions trivials o redundants al `HAVING`:** No posar `HAVING COUNT(*) >= 1` si la combinació de taules ja garanteix l'existència de files.

---

## 1.10. Àlgebra Relacional (Pregunta fixa de l'examen parcial)

L'**Àlgebra Relacional** és un llenguatge procedimental formal on les consultes s'especifiquen aplicant operadors sobre relacions per produir noves relacions. Als exàmens val entre **1,5 i 2,5 punts** i s'exigeix escriure una seqüència d'assignacions pas a pas ($R_1 = \dots, R_2 = \dots, \text{Resultat} = \dots$).

### 1. Operadors Fonamentals

| Operador | Notació | Descripció i Requisits |
| :--- | :---: | :--- |
| **Selecció** | $\sigma_{condicio}(R)$ | Filtra tuples que compleixen la condició. |
| **Projecció** | $\pi_{col_1, col_2}(R)$ | Selecciona columnes i **elimina duplicats automàticament**. |
| **Producte Cartesià** | $R \times S$ | Combina cada fila de $R$ amb cada fila de $S$. |
| **Unió** | $R \cup S$ | Tuples que són a $R$, a $S$ o a totes dues. Exigeix **esquemes unió-compatibles** (mateix nombre de columnes i mateixos dominis). |
| **Diferència** | $R - S$ | Tuples que són a $R$ però **NO** a $S$. Exigeix **esquemes unió-compatibles**. |
| **Renombrament** | $\rho_{S(nou_1, nou_2)}(R)$ | Canvia el nom de la relació o dels seus atributs. |

### 2. Operadors Derivats

* **Reunió Natural ($\bowtie$):** Combina tuples que coincideixen en els atributs amb el mateix nom i en projecta una sola còpia:
  $$R \bowtie S = \pi_{\dots}(\sigma_{R.a = S.a}(R \times S))$$
* **Reunió $\theta$ ($\bowtie_\theta$):** Reunió sota una condició explícita:
  $$R \bowtie_{R.a > S.b} S = \sigma_{R.a > S.b}(R \times S)$$
* **Intersecció ($\cap$):** $R \cap S = R - (R - S)$.

---

### 3. Patrons Clàssics d'Examen

#### Patró 1: "Únicament", "Mai" o "Cap" (Diferència de conjunts)
A l'examen demanen sovint entitats que *únicament* han fet una acció o que *mai* han complert una condició. La fórmula és sempre:
$$\text{Resultat} = (\text{Tots els candidats possibles}) - (\text{Candidats que incompleixen la condició})$$

*Exemple (Metges que només han visitat jubilats $\ge 65$ anys):*
1. $Tots = \pi_{idMetge}(Visites)$
2. $Incompleixen = \pi_{idMetge}(Visites \bowtie_{Visites.idPacient = Pacients.idPacient} \sigma_{edat < 65}(Pacients))$
3. $Bons = Tots - Incompleixen$
4. $Resultat = \pi_{nom, especialitat}(Metges \bowtie Bons)$

---

#### Patró 2: Simular un recompte mínim fix ($\ge 2$ o $\ge 3$)
L'àlgebra relacional pura **no té funcions d'agregació** (`COUNT`, `AVG`). Si l'enunciat demana *«vídeos amb almenys 2 usuaris diferents»*:
* Es fa una **auto-reunió amb desigualtat ($\neq$)**:
  $$R_1 = \pi_{titol, mail_1}(\rho_{V_1(titol, mail_1)}(Visualitzacions))$$
  $$R_2 = \pi_{titol, mail_2}(\rho_{V_2(titol, mail_2)}(Visualitzacions))$$
  $$Parella = \sigma_{mail_1 \neq mail_2}(R_1 \bowtie R_2)$$
  $$Resultat = \pi_{titol}(Parella)$$

---

### 4. Pregunta teòrica d'expressabilitat: "És possible en àlgebra relacional?"
Als exàmens sovint pregunten si una consulta SQL es pot expressar en àlgebra relacional:
* **NO ÉS POSSIBLE** si la consulta necessita:
  * Càlculs aritmètics sobre conjunts (`AVG`, `SUM`, variàncies).
  * Recomptes arbitraris o totals (`COUNT(*)`) que depenen de la mida dinàmica de les dades.
  * Tancament transitiu o recursivitat (ex: jerarquies d'empleats indefinides).
* **SÍ ÉS POSSIBLE** si només demana un llindar fix xicotet (com $\ge 2$ usuaris diferents) perquè es pot simular amb auto-reunió i $\neq$.

