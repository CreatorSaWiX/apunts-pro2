---
title: "Tema 1: Consultes SQL"
description: "DQL, funcions d'agregació, subconsultes i àlgebra relacional."
readTime: "12 min"
order: 1
draft: false
---

Totes les consultes usen la sentència `SELECT`. Esquema de referència per als exemples:

:::sqlviz{simulation="esquema_empresa"}
:::

---

## 1.1. Estructura bàsica de `SELECT`

```sql
SELECT [DISTINCT | ALL] col_1, col_2 ...
FROM taula
[WHERE condicio]
[GROUP BY col_a, col_b ...]
[HAVING condicio_grup]
[ORDER BY col_x [ASC | DESC] ...];
```

`SELECT *` retorna totes les columnes; `SELECT nom_empl, sou` retorna només les indicades. L'àlies `AS` permet posar nom al resultat d'un càlcul:

```sql
SELECT nom_empl, sou * 1.05 AS sou_incrementat FROM empleats;
```

`DISTINCT` elimina les files repetides del resultat:

```sql
SELECT DISTINCT ciutat_empl FROM empleats;
```

`ORDER BY` ordena el resultat: `ASC` de menor a major (per defecte), `DESC` de major a menor:

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
| **Text** | `LIKE 'patro'` | `nom_empl LIKE 'J%'` |
| **Nuls** | `IS NULL` / `IS NOT NULL` | `ciutat_empl IS NOT NULL` |

`LIKE` permet cercar per patró de text: `%` substitueix qualsevol seqüència de caràcters (fins i tot cap), i `_` substitueix exactament un caràcter. Per exemple, `nom_empl LIKE 'J%'` troba tots els empleats el nom dels quals comença per "J" (com "JOAN", "JÚLIA", etc.), i `nom_empl LIKE 'J_AN'` trobaria "JOAN" però no "JOAN PERE".

**Compte amb els NULL a les condicions:** Mai utilitzis `= NULL` o `<> NULL`, que mai donen cert en filtres. Utilitza sempre **`IS NULL`** o **`IS NOT NULL`**.

---

## 1.3. Funcions d'agregació

Processen múltiples files i retornen un únic valor resum:

| Funció | Descripció | Comportament amb valors `NULL` |
| :--- | :--- | :--- |
| `COUNT(*)` | Total de files retornades | Compta totes les files (inclou nuls). |
| `COUNT(col)` | Files amb valor no nul a `col` | Ignora valors `NULL`. |
| `COUNT(DISTINCT col)` | Valors diferents i no nuls | Ignora duplicats i valors `NULL`. |
| `SUM(col)` | Suma aritmètica | Ignora valors `NULL`. |
| `AVG(col)` | Mitjana aritmètica | Ignora valors `NULL`. |
| `MIN(col)` / `MAX(col)` | Valor mínim / màxim | Ignora valors `NULL`. |

Si cap fila compleix el filtre, `COUNT` retorna `0`, mentre que `SUM`, `AVG`, `MIN` i `MAX` retornen `NULL`.

```sql [Exemple d'agregació]
SELECT COUNT(*), AVG(sou), MAX(sou)
FROM empleats 
WHERE num_dpt = 2;
```

---

## 1.4. Agrupaments (`GROUP BY`) i condicions sobre grups (`HAVING`)

`GROUP BY` divideix les files en grups segons els valors de les columnes indicades. Tota columna individual del `SELECT` **ha d'aparèixer al `GROUP BY` o bé dins d'una funció d'agregació**; no es pot projectar una columna que no formi part del criteri d'agrupament.

```sql [Sou mitjà per departament]
SELECT num_dpt, AVG(sou) AS sou_mig
FROM empleats 
GROUP BY num_dpt;
```

`WHERE` filtra files individuals **abans** d'agrupar i mai pot contenir funcions d'agregació. `HAVING` filtra **grups resultants després** de l'agrupament i és on s'usen condicions sobre `COUNT`, `AVG`, etc.:

```sql [Combinació WHERE + GROUP BY + HAVING]
SELECT num_dpt, AVG(sou) AS sou_mig
FROM empleats
WHERE sou > 200000        -- 1. Filtra empleats individuals amb sou > 200k
GROUP BY num_dpt          -- 2. Agrupa per departament
HAVING COUNT(*) > 1;      -- 3. Manté només departaments amb més d'1 empleat que compleixi el WHERE
```

:::sqlviz{simulation="select_group_having"}
:::

---

## 1.5. Consultes multitaula (Joins)

Permeten combinar files de múltiples taules relacionades. La forma estàndard recomanada és `INNER JOIN ... ON`:

```sql [INNER JOIN explícit]
SELECT e.nom_empl, d.nom_dpt
FROM empleats e
INNER JOIN departaments d ON e.num_dpt = d.num_dpt;
```

:::sqlviz{simulation="select_filtre_join"}
:::

`NATURAL INNER JOIN` iguala automàticament les columnes que comparteixen el mateix nom a ambdues taules, sense necessitat d'especificar la condició:

```sql
SELECT e.nom_empl, d.nom_dpt
FROM empleats e
NATURAL INNER JOIN departaments d;
```

Els joins es poden combinar amb agregació:

```sql [Nom de departament amb sou mig]
SELECT d.nom_dpt, AVG(e.sou) AS sou_mig
FROM empleats e
INNER JOIN departaments d ON e.num_dpt = d.num_dpt
GROUP BY d.nom_dpt
HAVING COUNT(*) > 1;
```

---

## 1.6. Operacions de conjunts (`UNION`)

`UNION` combina verticalment els resultats de dos `SELECT` independents en un únic resultat, eliminant automàticament les files duplicades. `UNION ALL` conserva els duplicats i és més ràpid en execució. Les dues consultes han de tenir exactament el mateix nombre de columnes i tipus compatibles, i el `ORDER BY` només es pot posar al final de tot:

```sql [Unió de ciutats]
SELECT ciutat_dpt AS ciutat FROM departaments
UNION
SELECT ciutat_empl AS ciutat FROM empleats;
```

---

## 1.7. Subconsultes

Una subconsulta és un `SELECT` dins d'una altra consulta. Per trobar els departaments **sense cap empleat**:

#### Amb `NOT IN` (compte amb els valors `NULL`):
```sql
SELECT * FROM departaments
WHERE num_dpt NOT IN (
    SELECT num_dpt FROM empleats
    WHERE num_dpt IS NOT NULL -- IMPRESCINDIBLE!
);
```

**La trampa de NULL amb `NOT IN`:** Si la subconsulta retorna encara que sigui un sol valor `NULL`, l'expressió `NOT IN` retornarà sempre fals i **la consulta no retornarà cap fila**. Per fer-la segura cal afegir sempre `WHERE col IS NOT NULL`.

#### Amb `NOT EXISTS` (opció recomanada i segura):
```sql [Subconsulta correlacionada]
SELECT * FROM departaments d
WHERE NOT EXISTS (
    SELECT * FROM empleats e
    WHERE e.num_dpt = d.num_dpt
);
```
`NOT EXISTS` comprova si la subconsulta retorna alguna fila i és completament immune als valors `NULL`.

---

## 1.8. Tipus i funcions temporals

Els tipus de data i hora principals són: `DATE` (format `'YYYY-MM-DD'`), `TIME` (format `'HH:MM:SS'`), `TIMESTAMP` i `INTERVAL`. Per obtenir la data o hora actual s'usen `CURRENT_DATE`, `CURRENT_TIME` o `NOW()`.

`EXTRACT` permet extreure una part concreta d'una data:

```sql
EXTRACT(YEAR FROM data)       -- Any (ex: 2024)
EXTRACT(MONTH FROM data)      -- Mes (1 a 12)
EXTRACT(DOW FROM data)        -- Dia setmana (0 = Diumenge)
```

`INTERVAL` permet sumar o restar períodes de temps:

```sql
SELECT * FROM viatges
WHERE moment > (data_sortida + INTERVAL '10 min');
```

---

## 1.9. Criteris de Qualitat de la FIB (Penalitzacions d'Examen)

Als exàmens de la FIB, encara que una consulta SQL retorni el resultat correcte, s'apliquen penalitzacions directes si no compleix aquests criteris:

1. **Sense taules innecessàries al `FROM`:** No incloure mai una taula si tots els atributs necessaris ja es troben en una altra taula vinculada per clau forana. *Malament:* `SELECT e.nom FROM empleats e, departaments d WHERE e.num_dpt = d.num_dpt AND d.num_dpt = 20;` — *Bé:* `SELECT e.nom FROM empleats e WHERE e.num_dpt = 20;`
2. **Ús estricte de `DISTINCT`:** S'ha d'usar **únicament** si la consulta pot generar duplicats per algun contingut vàlid de la BD. **No s'ha d'usar mai** si la presència d'una clau primària o clau candidata garanteix matemàticament que el resultat no tindrà repetits.
3. **No usar `GROUP BY` per eliminar duplicats:** Per eliminar repetits s'usa `DISTINCT`, mai un `GROUP BY` sense funcions d'agregació.
4. **No usar `GROUP BY` sobre un grup únic:** *Malament:* `SELECT AVG(sou) FROM empleats WHERE num_dpt = 5 GROUP BY num_dpt;` — *Bé:* `SELECT AVG(sou) FROM empleats WHERE num_dpt = 5;`
5. **Sense condicions trivials o redundants al `HAVING`:** No posar `HAVING COUNT(*) >= 1` si la combinació de taules ja garanteix l'existència de files.

---

## 1.10. Àlgebra Relacional (Pregunta fixa de l'examen parcial)

L'**Àlgebra Relacional** és un llenguatge formal on les consultes s'especifiquen aplicant operadors sobre relacions per produir noves relacions. Als exàmens val entre **1,5 i 2,5 punts** i s'exigeix escriure una seqüència d'assignacions pas a pas ($A = \dots, B = \dots, R = \dots$).

A diferència de SQL, en àlgebra relacional **mai hi ha tuples repetides**: la projecció elimina duplicats automàticament. Per fer operacions de conjunts ($\cup$, $\cap$, $-$), les dues relacions han de tenir el mateix nombre d'atributs, amb noms idèntics; si no coincideixen, cal reanomenar prèviament.

### Operadors (Notació FIB vs. Notació Clàssica)

| Operador | Notació FIB | Notació Clàssica | Descripció |
| :--- | :---: | :---: | :--- |
| **Selecció** | $T(condicio)$ | $\sigma_{condicio}(T)$ | Filtra les tuples que compleixen la condició. |
| **Projecció** | $T[A_1, A_2, \dots]$ | $\pi_{A_1, A_2, \dots}(T)$ | Retalla columnes i elimina duplicats. |
| **Reanomenament** | $T\{A \to B\}$ | $\rho_{T'(B)}(T)$ | Canvia el nom dels atributs. |
| **Producte Cartesià** | $T \times S$ | $T \times S$ | Concatena cada fila de $T$ amb cada fila de $S$. |
| **Unió** | $T \cup S$ | $T \cup S$ | Tuples que són a $T$, a $S$ o a totes dues. |
| **Diferència** | $T - S$ | $T - S$ | Tuples que són a $T$ però NO a $S$. |
| **Intersecció** | $T \cap S$ | $T \cap S$ | Tuples que pertanyen a $T$ i a $S$. |
| **$\theta$-Join** | $T[condicio]S$ | $T \bowtie_{condicio} S$ | Producte cartesià filtrat per condició. |
| **Natural Join** | $T * S$ | $T \bowtie S$ | Iguala atributs amb mateix nom i elimina duplicats. |

---

### Patrons Clàssics d'Examen

#### Patró 1: "Únicament", "Mai" o "Cap" (Diferència de conjunts)
Quan demanen entitats que *únicament* han fet una acció o que *mai* han incomplert una condició, la lògica és: *candidats possibles* menys *els que incompleixen la regla*.

*Exemple (Metges que només han visitat pacients de 65 anys o més a la clínica 'El Remei'):*
```text
TotsMetges = Visites[idMetge]
IncomplidorsEdat = (Visites[Visites.idPacient = Pacients.idPacient] Pacients(edat < 65))[idMetge]
IncomplidorsClinica = Visites(nomClinica <> 'El Remei')[idMetge]
MetgesBons = TotsMetges - IncomplidorsEdat - IncomplidorsClinica
Resultat = (Metges[Metges.idMetge = MetgesBons.idMetge] MetgesBons)[nom, especialitat]
```

---

#### Patró 2: Simular un recompte mínim fix (2 o més)
Com que l'àlgebra relacional **no disposa de `COUNT()`**, per comprovar que un element té almenys 2 instàncies diferents es fa una **auto-reunió (self-join) comparant que les claus siguin diferents**:

*Exemple (Usuaris que han creat 2 o més playlists de la mateixa temàtica):*
```text
P1 = Playlist{idList -> id1, tematica -> tema1, creador -> cr1}
P2 = Playlist{idList -> id2, tematica -> tema2, creador -> cr2}
Combinacio = P1[cr1 = cr2, tema1 = tema2, id1 <> id2]P2
Resultat = Combinacio[cr1]
```

---

#### Patró 3: Condició Universal ("Per a tots") i Divisió Relacional
Quan una consulta demana seleccionar les tuples de $R$ associades a **tots** els elements de $S$ (per exemple: *«Persones que han organitzat el congrés en les tres edicions 2020, 2021 i 2022»*).

**Estratègia A: Intersecció successiva** (ideal quan el conjunt de referència és fix i petit):
```text
Ed2020 = Participants(edicio = 2020 AND rol = 'organitzador')[email, idCongres]
Ed2021 = Participants(edicio = 2021 AND rol = 'organitzador')[email, idCongres]
Ed2022 = Participants(edicio = 2022 AND rol = 'organitzador')[email, idCongres]
OrganitzadorsTotesTres = Ed2020 ∩ Ed2021 ∩ Ed2022
Resultat = (Persones * OrganitzadorsTotesTres * Congressos)[nomPersona, email, nomCongres]
```

**Estratègia B: Doble diferència / Divisió formal** (per a un conjunt dinàmic $S$):
tots els emparellaments possibles menys els que no s'han produït realment, i d'aquí s'extreuen els incomplets; el resultat final és els candidats menys els incomplets.

---

### Pregunta teòrica: "És possible en àlgebra relacional?"
Als exàmens és habitual que preguntin si una sentència SQL donada es pot expressar en àlgebra relacional. **NO ÉS POSSIBLE** si la consulta requereix càlculs aritmètics sobre conjunts (`AVG`, `SUM`), recomptes arbitraris o dinàmics (`COUNT(*) >= N` on $N$ és variable), o consultes recursives (arbres jeràrquics de profunditat arbitrària). **SÍ ÉS POSSIBLE** si només demana un llindar fix i petit (com 2 o 3) perquè es pot descompondre en un producte de relacions amb claus diferents.

---

## 1.11. Càlcul de Cardinalitats Mínimes i Màximes (Pregunta d'examen de 1 a 1,5 punts)

Als exàmens sovint es dóna la mida de cada taula en tuples i es demana raonar el **mínim i màxim nombre de tuples** que retornarà una consulta SQL.

| Tipus de consulta | Mínim | Màxim | Justificació |
| :--- | :---: | :---: | :--- |
| **Join per clau forana obligatòria (`FK NOT NULL`)** *(S té FK que referencia PK de R)* | $|S|$ | $|S|$ | Cada fila de $S$ té exactament un pare a $R$ per integritat referencial. |
| **Join per clau forana opcional (FK admet `NULL`)** | $0$ | $|S|$ | Si totes les files de $S$ tenen la FK a `NULL`, cap fila enllaça amb $R$. |
| **Join pel costat pare ($R$) cap a fills ($S$)** | $0$ | $|S|$ | Un pare a $R$ pot tenir 0 fills associats a $S$. |
| **Join sense clau forana o condició no unívoca** | $0$ | $|R| \times |S|$ | Si cap tupla coincideix és 0; si totes coincideixen s'obté el producte complet. |
| **Agregació global sense `GROUP BY`** (ex: `SELECT COUNT(*)`) | $1$ | $1$ | Una consulta agregada global sempre retorna exactament 1 fila, fins i tot si la taula és buida. |
| **Consulta amb `GROUP BY columna`** | $0$ | $\min(|R|, \text{valors diferents de col})$ | Si cap tupla passa el `WHERE` el resultat és buit. Com a màxim hi haurà tantes files com valors diferents tingui la columna agrupada. |

**Pot donar duplicats?** No pot donar duplicats si la clau primària de la relació principal és al `SELECT`, si s'usa `DISTINCT`, o si l'esquema garanteix cardinalitat 1\:1. Sí pot donar duplicats si es fa un join entre taules amb cardinalitat 1\:N i al `SELECT` només es projecten atributs de la taula pare sense `DISTINCT`, ja que la fila del pare es repetirà tantes vegades com fills tingui.
