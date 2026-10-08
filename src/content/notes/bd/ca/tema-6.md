---
title: "Tema 6: Disseny Conceptual (UML) i Traducció Relacional"
description: "Etapes del disseny de BD, modelatge conceptual en UML (classes, associacions, ternàries, herència) i regles formals de traducció al model relacional lògic (taules, PK, FK, NOT NULL i UNIQUE)."
readTime: "11 min"
order: 6
draft: true
---

El disseny d'una base de dades relacional consisteix a transformar els requisits del món real en una estructura lògica de taules, columnes i restriccions robustes i lliures d'anomalies.

---

## 6.1. Les etapes del disseny i «Els Tres Mons»

El procés d'enginyeria de bases de dades es divideix en tres etapes per separar la complexitat del negoci de la tecnologia concreta:

```text
[Món Real] 
    │
    ▼ (Disseny Conceptual / Especificació)
[Món Conceptual]  ---> Esquema UML / ER (Independent de la tecnologia)
    │
    ▼ (Disseny Lògic / Transformació)
[Món de les Representacions] ---> Esquema Relacional: Taules, PK, FK (Model SGBD)
    │
    ▼ (Disseny Físic / Optimització)
Fitxers físics, índexs, particions (Específic de l'SGBD: PostgreSQL, Oracle...)
```

1. **Disseny Conceptual:** Es captura l'estructura de la informació en un model gràfic d'alt nivell (**UML** o diagrama E/R), completament independent del programari final.
2. **Disseny Lògic:** S'adapta l'esquema conceptual al model de dades de l'SGBD de destí (en el nostre cas, el **Model Relacional** amb taules, claus primàries i claus foranes).
3. **Disseny Físic:** S'optimitza l'estructura sobre el maquinari i el motor concret (índexs B-tree, estructures d'accés, estratègia de buffers) per aconseguir la màxima eficiència.

---

## 6.2. Punt de partida: Model Conceptual en UML

### 1. Classes d'objectes i atributs
* **Classe:** Descriu un conjunt d'objectes del mateix tipus que comparteixen propietats (ex: `Empleat`). Cada objecte té identitat pròpia (**OID**).
* **Atributs:** Propietats univaluades compartides pels objectes d'una classe.
* **Clau Externa (Identificador):** Conjunt mínim d'atributs que identifiquen unívocament cada instància d'una classe. Com que la notació estàndard UML no té símbol per a claus, s'especifiquen mitjançant **restriccions textuals** (ex: *«Clau externa Empleat: dni»*).

### 2. Transformació prèvia: Atributs multivaluats `[*]`
El model relacional clàssic **no admet valors multivaluats** a les columnes (primera forma normal). Per tant, abans de passar al disseny lògic:
* Tot atribut multivaluat `atribut[*]` es transforma en una **associació 1:N** cap a una nova classe que conté aquest atribut:

```text
[ Empleat ]                                [ Empleat ]
  dni                                        dni
  nom                         ===>           nom
  cognom                                     cognom
  telefon [*]                                   1 │ Té
                                                  │ *
                                           [ Telefon ]
                                             numTel
Clau externa Empleat: dni             Clau externa Empleat: dni
                                      Clau externa Telefon: numTel
```

---

## 6.3. Transformació d'Associacions Binàries

Un cop transformades les classes a relacions base (on la clau externa d'UML esdevé la **clau primària**, $\text{\underline{PK}}$), traduïm les associacions segons les seves multiplicitats:

### 1. Cas Un a Molts (1:N)
La multiplicitat és $0..1$ o $1..1$ en un extrem ("un") i $*$ a l'altre ("molts"):

* **Regla:** S'afegeix una **clau forana (FK)** a la relació que correspon a la classe de l'extrem **«molts»**, referenciant la clau primària de l'extrem «un».
* **Restricció `NOT NULL`:** Si la multiplicitat mínima de l'extrem «un» és **$1$ ($1..1$)**, la clau forana al costat «molts» ha de ser **`NOT NULL`**. Si el mínim és **$0$ ($0..1$)**, admet valors nuls.

```text
[ Departament ] 1 ────────── * [ Empleat ]
```

```sql
DEPARTAMENT (num_dpt, nom_dpt)
    PRIMARY KEY (num_dpt)

EMPLEAT (dni, nom, num_dpt)
    PRIMARY KEY (dni)
    FOREIGN KEY (num_dpt) REFERENCES DEPARTAMENT(num_dpt)
    num_dpt NOT NULL  -- Obligatori perquè el mínim al costat Departament és 1!
```

---

### 2. Cas Un a Un (1:1)
La multiplicitat màxima a tots dos extrems és $1$ ($0..1$ o $1..1$):

* **Regla:** S'afegeix una clau forana a **qualsevol de les dues taules**, referenciant l'altra.
* **Restricció `UNIQUE`:** La columna FK ha de tenir la restricció **`UNIQUE`** per garantir que cap fila del destí es pugui enllaçar més d'un cop.
* **Criteri d'elecció:** Si un costat té multiplicitat $1..1$ i l'altre $0..1$, és preferible propagar la clau al costat que té **$1..1$** amb **`NOT NULL UNIQUE`** per evitar camps nuls.

```text
[ Delegacio ] 0..1 ── Es situa a ── 0..1 [ Ciutat ]
```

```sql
CIUTAT (nom_ciutat, habitants)
    PRIMARY KEY (nom_ciutat)

DELEGACIO (codi_del, nom_del, nom_ciutat)
    PRIMARY KEY (codi_del)
    FOREIGN KEY (nom_ciutat) REFERENCES CIUTAT(nom_ciutat)
    UNIQUE (nom_ciutat)
```

---

### 3. Cas Molts a Molts (M:N)
La multiplicitat màxima a tots dos extrems és $*$ ($0..*$ o $1..*$):

* **Regla:** Es defineix una **nova relació (taula associativa intermèdia)**.
* **Clau primària:** La seva PK estarà formada per la **composició de les claus primàries** de les dues entitats relacionades.

```text
[ Producte ] * ── Es guarda a ── * [ Magatzem ]
```

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

## 6.4. Transformació d'Associacions N-àries i Ternàries

Una associació ternària relaciona 3 classes simultàniament. **Sempre es tradueix a una nova relació**, però la seva clau primària varia segons les multiplicitats:

```text
         [ A ]
          │ *
         ◇ Relacio
       * ╱ ╲ 0..1 (o *)
     [ B ]  [ C ]
```

| Multiplicitats ($A - B - C$) | Composició de la Clau Primària | Restriccions addicionals |
| :--- | :--- | :--- |
| **Molts - Molts - Molts** ($* - * - *$) | $\text{PK} = (A, B, C)$ | Totes tres formen la clau primària. |
| **Molts - Molts - Un** ($* - * - 0..1$) | $\text{PK} = (A, B)$ | La clau són els dos extrems «molts». $C$ és atribut simple amb `NOT NULL` (i FK a C). |
| **Molts - Un - Un** ($* - 0..1 - 0..1$) | Dues claus candidates: $(A, B)$ o $(A, C)$ | Una es tria com a $\text{PK}$ i l'altra es defineix com a `UNIQUE NOT NULL`. |

### Regla general per a associacions $n$-àries:
* Si tots els extrems són «molts», la PK és la concatenació de les $n$ claus.
* Si un o més extrems són «un», la PK la formen $n - 1$ claus (excloent la clau d'un extrem «un»).

---

## 6.5. Associacions Recursives

Són associacions on **una mateixa classe participa més d'una vegada** exercint rols diferents:

* **1:N recursiva (ex: Persona és mare de Persona):** S'afegeix una clau forana a la mateixa taula que referencia la pròpia clau primària, reanomenant la columna pel seu rol:
  ```sql
  PERSONA (dni, nom, dni_mare)
      PRIMARY KEY (dni)
      FOREIGN KEY (dni_mare) REFERENCES PERSONA(dni)
  ```
* **M:N recursiva (ex: Compte segueix a Compte):** Es crea una taula intermèdia amb dues columnes de tipus FK que apunten totes dues a la taula base:
  ```sql
  SEGUIMENT (nom_seguidor, nom_seguit)
      PRIMARY KEY (nom_seguidor, nom_seguit)
      FOREIGN KEY (nom_seguidor) REFERENCES COMPTE(nom_usuari)
      FOREIGN KEY (nom_seguit) REFERENCES COMPTE(nom_usuari)
  ```

---

## 6.6. Classes Associatives

Una **classe associativa** sorgeix quan una associació té atributs propis o participa en altres relacions:

* **Regla:** La relació creada per a l'associació **absorbeix els atributs propis** de la classe associativa.

```text
[ Producte ] * ────────────── * [ Magatzem ]
                       │
             [ Emmagatzematge ]
               quantitat
```

```sql
EMMAGATZEMATGE (codi_prod, codi_mag, quantitat)
    PRIMARY KEY (codi_prod, codi_mag)
    FOREIGN KEY (codi_prod) REFERENCES PRODUCTE(codi_prod)
    FOREIGN KEY (codi_mag) REFERENCES MAGATZEM(codi_mag)
```

---

## 6.7. Generalització i Especialització (Herència)

L'herència reflecteix una superclasse general (atributs comuns) que s'especialitza en una o més subclasses (atributs específics).

```text
         [ Persona ]
          dni, nom
             ▲
           ┌─┴─┐
           │   │
  [ Empleat ] [ Estudiant ]
    sou         centre
```

### Estratègia estàndard de la FIB: Una taula per classe
És l'estratègia universal exigida als exàmens de BD:
1. **Taula per a la superclasse:** Té la seva clau primària original i els atributs comuns.
2. **Taula per a cada subclasse:** Té com a clau primària **la mateixa clau de la superclasse**, que actua **alhora com a Clau Primària i Clau Forana**:

```sql [Traducció relacional de la jerarquia]
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

---

## 6.8. Resum de transformacions i consideracions d'examen

| Element del Model UML | Traducció al Model Relacional |
| :--- | :--- |
| **Classe d'objectes** | Relació (taula) amb la clau externa com a $\text{PK}$. |
| **Associació binària 1:N** | Clau forana ($\text{FK}$) a la taula del costat "molts" (`NOT NULL` si min=1). |
| **Associació binària 1:1** | Clau forana a qualsevol costat amb restricció `UNIQUE`. |
| **Associació binària M:N** | Nova taula amb $\text{PK} = (\text{FK}_1, \text{FK}_2)$. |
| **Associació n-ària** | Nova taula. Si és $*..*..*$, $\text{PK}$ conté totes les claus; si hi ha costats $0..1$, la PK té $n-1$ claus. |
| **Classe associativa** | La taula de l'associació inclou els atributs de la classe associativa. |
| **Herència (super/subclasses)** | Una taula per a la superclasse i una per a cada subclasse amb $\text{PK} = \text{FK}$ a la superclasse. |

### 📌 Punts clau que penalitzen als exàmens:
1. **Entitats febles / Identificadors relatius:** Si una classe no té identificador propi global (ex: *«Planta: no poden existir dues plantes amb el mateix id en una mateixa escola, però sí en escoles diferents»*), la clau primària de `PLANTA` ha de ser **composta**: `PRIMARY KEY (nom_escola, id_planta)`.
2. **Classes temporals pures:** Classes com `Data`, `Hora` o `Any` que només tenen el valor temporal i cap altre atribut **no es converteixen en taules**: s'emmagatzemen directament com a columnes de tipus `DATE`, `TIME` o `INTEGER` a la taula de la relació.
3. **Restriccions que NO es poden capturar només amb claus:**
   * Multiplicitats complexes (com ara mínim $2$ o màxim $5$).
   * Restriccions de jerarquia com **disjunta** (*disjoint*) o **completa** (*complete*).
   * **Com es resolen a l'examen:** S'indica explícitament que calen **mecanismes externs al DDL bàsic** com assercions (`CREATE ASSERTION`) o disparadors (`TRIGGER`).
