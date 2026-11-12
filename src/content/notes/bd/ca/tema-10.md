---
title: "Tema 10: NoSQL"
description: "Conceptes bàsics de NoSQL: OLTP vs OLAP vs NoSQL, teorema CAP, model BASE vs ACID, els 4 tipus de BD NoSQL, comparativa amb relacionals i tendències actuals."
readTime: "4 min"
order: 13
draft: true
---

### AQUEST TEMA NO ENTRA A L'EXÀMEN FINAL

**NoSQL** (*Not Only SQL*) agrupa sistemes de bases de dades no relacionals pensats per a grans volums de dades distribuïdes, alta velocitat de consulta i esquemes flexibles.

---

## 10.1. Context: OLTP, OLAP i NoSQL

| Tipus de BD | Dades i càrrega principal | Model habitual |
| :--- | :--- | :--- |
| **Operacionals (OLTP)** | Dades estructurades, operacions diàries i transaccions concurrents. | Model relacional (SQL). |
| **Decisionals (OLAP)** | Principalment lectures massives per analitzar i pronosticar (*Data Warehousing*). | Emmagatzematge analític / columnar. |
| **NoSQL** | Dades semiestructurades o no estructurades a gran escala (web, xarxes socials). | Clau-valor, columnes, documents, grafs. |

- **S'acaba el *"One size fits all"*:** no tots els problemes es resolen millor usant només SGBD relacionals tradicionals; *"NoSQL"* vol dir *Not Only SQL* (no *mai SQL*).
- **Trets comuns de NoSQL:** grans volums de dades, replicació i distribució en milers de nodes, actualitzacions asíncrones, alta eficiència en lectura i absència d'esquema predefinit (*schema-less*).

---

## 10.2. Teorema CAP i model BASE (vs. ACID)

### Teorema CAP

En un sistema distribuït hi ha tres propietats: **C** (*Consistency* — tots els nodes veuen les mateixes dades), **A** (*Availability* — tota petició rep resposta) i **P** (*Partition tolerance* — el sistema funciona malgrat talls de comunicació entre nodes).

- Quan es produeix una partició de xarxa inevitable, **no es poden garantir `C` i `A` alhora**: cal triar entre retornar error per protegir les dades (**CP**) o continuar atenent peticions amb risc d'inconsistència temporal (**AP**).
- Les BD NoSQL tradicionals prioritzen la **disponibilitat (`AP`)** per sobre de la consistència immediata.

### ACID vs. BASE

| Propietat / Enfocament | **ACID** (Relacional) | **BASE** (NoSQL) |
| :--- | :--- | :--- |
| **Significat** | **A**tomicitat, **C**onsistència, **I**solation (aïllament), **D**efinitivitat. | **B**asically **A**vailable, **S**oft state, **E**ventually consistent. |
| **Consistència** | Forta i immediata (transaccions segures). | Feble / eventual (els canvis es propaguen de manera asíncrona). |
| **Prioritat** | Integritat i fiabilitat de les dades. | Disponibilitat i rendiment (accepta respostes aproximades, optimista). |

---

## 10.3. Els 4 models de bases de dades NoSQL

| Model | Estructura de dades | Característiques clau |
| :--- | :--- | :--- |
| **Key-Value Stores** | Parelles `<Key, Value>` planes. | Només operacions `get` / `set` / `delete` per clau; l'aplicació interpreta el valor (sovint JSON). |
| **Wide-Column Stores** | Taules de **famílies de columnes** (*Key-Value de 2 nivells*). | Cada fila pot tenir columnes i formats diferents sense esquema rígid. |
| **Document-Stores** | Parelles `<Key, Doc>` (JSON o XML). | Permet consultar i indexar pel **contingut intern** del document; molts afegeixen SQL estès i ACID. |
| **Graph Databases** | **Nodes** i **arestes** amb propietats. | Ideal per a informació semiestructurada altament connectada (xarxes socials, rutes). |

---

## 10.4. Relacionals vs. NoSQL i tendències

| Criteri | BD Relacionals (SGBDR) | BD NoSQL |
| :--- | :--- | :--- |
| **Esquema** | Predefinit (`CREATE TABLE` / `ALTER TABLE`). | Sense esquema fix (*schema-less*). |
| **Llenguatge** | SQL estàndard declaratiu (*què*, no *com*) amb optimitzador. | APIs o llenguatges propis de cada producte. |
| **Consistència** | Forta (`ACID`, restriccions DDL i triggers). | Eventual (`BASE`), prioritzant disponibilitat i escalabilitat horitzontal. |

- **El cost de renunciar al model relacional:** sense compilador/optimitzador SQL ni garanties ACID al gestor, la lògica d'accés i la consistència de dades recauen sobre el **codi de l'aplicació**.
- **Tendències actuals:**
  - Proveïdors NoSQL afegint **transaccions ACID** i **SQL** (o dialectes similars).
  - **Sistemes multi-model:** un mateix SGBD combina models (ex: PostgreSQL suporta el model relacional i documents `JSON`).
  - **BD relacionals columnars:** emmagatzemen per columnes en lloc de files per accelerar consultes analítiques.
  - **Bases de dades vectorials:** guarden *embeddings* (vectors numèrics generats per models d'IA) per fer cerques ràpides per **similitud semàntica** (documents, imatges, recomanacions).
