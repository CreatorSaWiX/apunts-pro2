---
title: "Tema 6: Disseny Conceptual (UML)"
description: "Modelatge conceptual en UML i traducció al model relacional lògic."
readTime: "8 min"
order: 6
draft: false
---

El disseny de bases de dades transforma els requisits del món real en estructures relacionals lògiques lliures d'anomalies.

---

## 6.1. Model Conceptual en UML

Una **classe** descriu un conjunt d'objectes del mateix tipus que comparteixen propietats (ex: `Empleat`); cada objecte té identitat pròpia (OID). Els **atributs** són les propietats univaluades compartides pels objectes. La **clau externa** (identificador) és el conjunt mínim d'atributs que identifiquen unívocament cada instància, especificada mitjançant restriccions textuals (ex: *«Clau externa Empleat: dni»*).

### Transformació prèvia: Atributs multivaluats `[*]`

El model relacional no admet valors multivaluats (primera forma normal). Tot atribut `atribut[*]` es transforma en una **associació 1\:N** cap a una nova classe:

:::umlviz{schema="uml_multivaluat" title="Transformació d'Atribut Multivaluat a Nova Classe (1:N)" height="260"}
:::

---

## 6.2. Transformació d'Associacions Binàries

Un cop transformades les classes a relacions base (on la clau externa d'UML esdevé la **clau primària**), traduïm les associacions segons les seves multiplicitats:

### 1. Cas Un a Molts (1\:N)

La multiplicitat és $0..1$ o $1..1$ en un extrem ("un") i $*$ a l'altre ("molts"). S'afegeix una **clau forana (FK)** a la relació de l'extrem **«molts»**, referenciant la clau primària de l'extrem «un». Si la multiplicitat mínima de l'extrem «un» és **$1$ ($1..1$)**, la FK ha de ser **`NOT NULL`**; si és **$0$ ($0..1$)**, admet valors nuls.

:::umlviz{schema="uml_1_n" title="Associació 1:N (Departament - Empleat)" height="220"}
:::

```sql
DEPARTAMENT (num_dpt, nom_dpt)
    PRIMARY KEY (num_dpt)

EMPLEAT (dni, nom, num_dpt)
    PRIMARY KEY (dni)
    FOREIGN KEY (num_dpt) REFERENCES DEPARTAMENT(num_dpt)
    num_dpt NOT NULL  -- Obligatori perquè el mínim al costat Departament és 1!
```

---

### 2. Cas Un a Un (1\:1)

La multiplicitat màxima a tots dos extrems és $1$ ($0..1$ o $1..1$). S'afegeix una clau forana a **qualsevol de les dues taules**, però la columna FK ha de tenir la restricció **`UNIQUE`** per garantir que cap fila del destí es pugui enllaçar més d'un cop. Si un costat té $1..1$ i l'altre $0..1$, és preferible propagar la clau al costat $1..1$ amb `NOT NULL UNIQUE` per evitar camps nuls.

:::umlviz{schema="uml_1_1" title="Associació 1:1 (Delegació - Ciutat)" height="220"}
:::

```sql
CIUTAT (nom_ciutat, habitants)
    PRIMARY KEY (nom_ciutat)

DELEGACIO (codi_del, nom_del, nom_ciutat)
    PRIMARY KEY (codi_del)
    FOREIGN KEY (nom_ciutat) REFERENCES CIUTAT(nom_ciutat)
    UNIQUE (nom_ciutat)
```

---

### 3. Cas Molts a Molts (M\:N)

La multiplicitat màxima a tots dos extrems és $*$ ($0..*$ o $1..*$). Es defineix una **nova relació (taula associativa intermèdia)** amb la PK formada per la **composició de les claus primàries** de les dues entitats relacionades.

:::umlviz{schema="uml_m_n" title="Associació M:N (Producte - Magatzem)" height="220"}
:::

```sql
PRODUCTE (codi_prod, descripcio)
    PRIMARY KEY (codi_prod)

MAGATZEM (codi_mag, ciutat)
    PRIMARY KEY (codi_mag)

EMMAGATZEMATGE (codi_prod, codi_mag)
    PRIMARY KEY (codi_prod, codi_mag)
    FOREIGN KEY (codi_prod) REFERENCES PRODUCTE(codi_prod)
    FOREIGN KEY (codi_mag) REFERENCES MAGATZEM(codi_mag)
```

---

## 6.3. Transformació d'Associacions N-àries i Ternàries

Una associació ternària relaciona 3 classes simultàniament. **Sempre es tradueix a una nova relació**, però la seva clau primària varia segons les multiplicitats:

:::umlviz{schema="uml_ternaria" title="Associació Ternària amb Rombe de Relació" height="340"}
:::

| Multiplicitats ($A - B - C$) | Composició de la Clau Primària | Restriccions addicionals |
| :--- | :--- | :--- |
| **Molts - Molts - Molts** ($* - * - *$) | $\text{PK} = (A, B, C)$ | Totes tres formen la clau primària. |
| **Molts - Molts - Un** ($* - * - 0..1$) | $\text{PK} = (A, B)$ | La clau són els dos extrems «molts». $C$ és atribut simple amb `NOT NULL` (i FK a C). |
| **Molts - Un - Un** ($* - 0..1 - 0..1$) | Dues claus candidates: $(A, B)$ o $(A, C)$ | Una es tria com a $\text{PK}$ i l'altra es defineix com a `UNIQUE NOT NULL`. |

---

## 6.4. Associacions Recursives

Són associacions on **una mateixa classe participa més d'una vegada** exercint rols diferents. En la variant **1\:N** (ex: Empleat és cap d'altres empleats) s'afegeix una clau forana a la mateixa taula que referencia la pròpia clau primària, reanomenant la columna pel seu rol:

:::umlviz{schema="uml_recursiva" title="Associació Recursiva 1:N (Rols de Cap i Subordinat)" height="240"}
:::

```sql
PERSONA (dni, nom, dni_mare)
    PRIMARY KEY (dni)
    FOREIGN KEY (dni_mare) REFERENCES PERSONA(dni)
```

En la variant **M\:N** (ex: Compte segueix a Compte) es crea una taula intermèdia amb dues columnes de tipus FK que apunten totes dues a la taula base:

```sql
SEGUIMENT (nom_seguidor, nom_seguit)
    PRIMARY KEY (nom_seguidor, nom_seguit)
    FOREIGN KEY (nom_seguidor) REFERENCES COMPTE(nom_usuari)
    FOREIGN KEY (nom_seguit) REFERENCES COMPTE(nom_usuari)
```

---

## 6.5. Classes Associatives

Una **classe associativa** sorgeix quan una associació té atributs propis o participa en altres relacions. La relació creada per a l'associació **absorbeix els atributs propis** de la classe associativa:

:::umlviz{schema="uml_classe_associativa" title="Classe Associativa (Emmagatzematge)" height="310"}
:::

```sql
EMMAGATZEMATGE (codi_prod, codi_mag, quantitat)
    PRIMARY KEY (codi_prod, codi_mag)
    FOREIGN KEY (codi_prod) REFERENCES PRODUCTE(codi_prod)
    FOREIGN KEY (codi_mag) REFERENCES MAGATZEM(codi_mag)
```

---

## 6.6. Generalització i Especialització (Herència)

L'herència reflecteix una superclasse general (atributs comuns) que s'especialitza en una o més subclasses (atributs específics).

:::umlviz{schema="uml_herencia" title="Jerarquia d'Herència de Classes (UML)"}
:::

### Estratègia estàndard: Una taula per classe

1. **Taula per a la superclasse:** Té la seva clau primària original i els atributs comuns.
2. **Taula per a cada subclasse:** Té com a clau primària **la mateixa clau de la superclasse**, que actua **alhora com a Clau Primària i Clau Forana**:

```sql
CREATE TABLE PERSONA (
    dni VARCHAR(10) PRIMARY KEY,
    nom VARCHAR(50) NOT NULL
);

CREATE TABLE EMPLEAT (
    dni VARCHAR(10) PRIMARY KEY,
    sou INTEGER NOT NULL,
    FOREIGN KEY (dni) REFERENCES PERSONA(dni)
);

CREATE TABLE ESTUDIANT (
    dni VARCHAR(10) PRIMARY KEY,
    centre VARCHAR(50) NOT NULL,
    FOREIGN KEY (dni) REFERENCES PERSONA(dni)
);
```

:::sqlviz{simulation="ddl_empleats"}
:::

---

## 6.7. Resum de transformacions i criteris de disseny

| Element del Model UML | Traducció al Model Relacional |
| :--- | :--- |
| **Classe d'objectes** | Relació (taula) amb la clau externa com a $\text{PK}$. |
| **Associació binària 1\:N** | Clau forana ($\text{FK}$) a la taula del costat "molts" (`NOT NULL` si min=1). |
| **Associació binària 1\:1** | Clau forana a qualsevol costat amb restricció `UNIQUE`. |
| **Associació binària M\:N** | Nova taula amb $\text{PK} = (\text{FK}_1, \text{FK}_2)$. |
| **Associació n-ària** | Nova taula. Si és $*.*..*$, $\text{PK}$ conté totes les claus; si hi ha costats $0..1$, la PK té $n-1$ claus. |
| **Classe associativa** | La taula de l'associació inclou els atributs de la classe associativa. |
| **Herència (super/subclasses)** | Una taula per a la superclasse i una per a cada subclasse amb $\text{PK} = \text{FK}$ a la superclasse. |

:::uml2relviz
:::

### Casos especials de modelatge

1. **Entitats febles / Identificadors relatius**: Si una classe no té identificador global propi (ex: *«no poden existir dues plantes amb el mateix id en una mateixa escola, però sí en escoles diferents»*), la clau primària de `PLANTA` és composta: `PRIMARY KEY (nom_escola, id_planta)`.
2. **Classes temporals pures**: Classes com `Data`, `Hora` o `Any` que només contenen un valor temporal i cap altre atribut no generen taules pròpies; es tradueixen directament com a columnes de tipus `DATE`, `TIME` o `INTEGER` a la taula associada.
3. **Classes associatives amb clau pròpia**: Si l'enunciat assigna un identificador extern artificial a la classe associativa (ex: `idMissatge`), aquest atribut esdevé la clau primària simple, mantenint les claus de les classes relacionades com a claus foranes individuals.
4. **Restriccions no capturades amb claus**: Multiplicitats amb mínim $>1$ o màxim fixat, condicions de cobertura o disjunció en jerarquies, i regles multitaula no es poden definir al DDL bàsic de taula; requereixen assercions (`CREATE ASSERTION`) o disparadors (`TRIGGER`).

---

## 6.8. Validació Semàntica de Models UML (Afirmacions de Cert / Fals)

Davant d'afirmacions sobre possibles estats d'un model UML, cal determinar si la situació és compatible amb l'esquema (**CERTA**) o si viola alguna restricció estructural (**FALSA**):

| Aspecte del Model UML | Com interpretar-lo | Si és Falsa, com s'arregla? |
| :--- | :--- | :--- |
| **Multiplicitat màxima $1$** | L'objecte només pot relacionar-se amb un únic element en aquell rol. | Canviar la multiplicitat màxima de $1$ a $*$. |
| **Multiplicitat mínima $1$** | L'objecte ha d'existir obligatòriament associat a un altre (FK `NOT NULL`). | Canviar la multiplicitat mínima de $1$ a $0$. |
| **Clau externa global** | L'atribut identifica unívocament la instància a tota la base de dades. | Fer que la clau externa sigui relativa (identificació feble). |
| **Clau externa relativa (Classe feble)** | Dues instàncies en contextos diferents sí que poden repetir el mateix identificador local. | Fer la clau externa global única per a tota la classe. |
| **Estructures cícliques** | Una associació reflexiva d'ordenació amb extrems oberts prohibeix circuits tancats. | Modificar les multiplicitats dels rols o suprimir la restricció d'ordre acíclic. |

Per justificar que una afirmació és **CERTA**, es construeix una instància mínima de dades tabulars que compleixi totes les PK, FK i multiplicitats. Si és **FALSA**, s'indica amb exactitud quin extrem d'associació o restricció del diagrama cal modificar per fer-la possible.

---

## 6.9. Classificació i Traducció de Restriccions Textuals (R1..Rn)

Les restriccions textuals addicionals s'implementen segons el seu abast:

1. **Identificadors alternatius:** `UNIQUE (nomUsuari)` a la taula corresponent.
2. **Restriccions de domini o estat:** restricció de columna `CHECK (estat IN ('confirmada', 'cancel·lada'))`.
3. **Condicions entre atributs de la mateixa fila (implicació $A \to B \equiv \neg A \lor B$):** restricció de taula `CHECK (estat <> 'confirmada' OR dataRegistre IS NOT NULL)`.
4. **Condicions que creuen múltiples taules:** no es poden definir com a restriccions de columna ni de taula perquè involucren més d'una taula; requereixen `CREATE ASSERTION` (o disparadors).

---

## 6.10. Cas Global de Referència (UML i Relacional)

Exemple complet d'una organització amb departaments, projectes i empleats:

### Model Conceptual Global (UML)
:::umlviz{schema="uml_empresa" title="Model Conceptual UML de l'Empresa de Referència" height="420"}
:::

### Esquema Relacional Resultant (ERD)
:::sqlviz{simulation="esquema_empresa"}
:::