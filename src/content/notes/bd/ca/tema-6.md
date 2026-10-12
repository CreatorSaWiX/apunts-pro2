---
title: "Tema 6: Disseny Conceptual (UML)"
description: "Modelatge conceptual en UML i traducció al model relacional lògic."
readTime: "11 min"
order: 6
draft: false
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

El **Disseny Conceptual** captura l'estructura de la informació en un model gràfic d'alt nivell (UML o diagrama E/R), completament independent del programari final. El **Disseny Lògic** adapta l'esquema conceptual al Model Relacional (taules, claus primàries i claus foranes). El **Disseny Físic** optimitza l'estructura sobre el maquinari i el motor concret (índexs, buffers) per aconseguir la màxima eficiència.

---

## 6.2. Punt de partida: Model Conceptual en UML

Una **classe** descriu un conjunt d'objectes del mateix tipus que comparteixen propietats (ex: `Empleat`); cada objecte té identitat pròpia (OID). Els **atributs** són les propietats univaluades compartides pels objectes. La **clau externa** (identificador) és el conjunt mínim d'atributs que identifiquen unívocament cada instància; com que la notació UML no té símbol per a claus, s'especifiquen mitjançant restriccions textuals (ex: *«Clau externa Empleat: dni»*).

### Transformació prèvia: Atributs multivaluats `[*]`

El model relacional **no admet valors multivaluats** (primera forma normal). Tot atribut `atribut[*]` es transforma en una **associació 1\:N** cap a una nova classe:

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

Un cop transformades les classes a relacions base (on la clau externa d'UML esdevé la **clau primària**), traduïm les associacions segons les seves multiplicitats:

:::umlviz{schema="uml_associacions" title="Diagrama d'Associacions Binàries (1:1, 1:N, M:N)"}
:::

### 1. Cas Un a Molts (1\:N)

La multiplicitat és $0..1$ o $1..1$ en un extrem ("un") i $*$ a l'altre ("molts"). S'afegeix una **clau forana (FK)** a la relació de l'extrem **«molts»**, referenciant la clau primària de l'extrem «un». Si la multiplicitat mínima de l'extrem «un» és **$1$ ($1..1$)**, la FK ha de ser **`NOT NULL`**; si és **$0$ ($0..1$)**, admet valors nuls.

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

### 2. Cas Un a Un (1\:1)

La multiplicitat màxima a tots dos extrems és $1$ ($0..1$ o $1..1$). S'afegeix una clau forana a **qualsevol de les dues taules**, però la columna FK ha de tenir la restricció **`UNIQUE`** per garantir que cap fila del destí es pugui enllaçar més d'un cop. Si un costat té $1..1$ i l'altre $0..1$, és preferible propagar la clau al costat $1..1$ amb `NOT NULL UNIQUE` per evitar camps nuls.

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

### 3. Cas Molts a Molts (M\:N)

La multiplicitat màxima a tots dos extrems és $*$ ($0..*$ o $1..*$). Es defineix una **nova relació (taula associativa intermèdia)** amb la PK formada per la **composició de les claus primàries** de les dues entitats relacionades.

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

La regla general: si tots els extrems són «molts», la PK és la concatenació de totes les claus. Si un o més extrems són «un», la PK la formen les claus dels extrems «molts» (excloent els «un»).

---

## 6.5. Associacions Recursives

Són associacions on **una mateixa classe participa més d'una vegada** exercint rols diferents. En la variant **1\:N** (ex: Persona és mare de Persona) s'afegeix una clau forana a la mateixa taula que referencia la pròpia clau primària, reanomenant la columna pel seu rol:

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

## 6.6. Classes Associatives

Una **classe associativa** sorgeix quan una associació té atributs propis o participa en altres relacions. La relació creada per a l'associació **absorbeix els atributs propis** de la classe associativa:

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

:::umlviz{schema="uml_herencia" title="Jerarquia d'Herència de Classes (UML)"}
:::

### Estratègia estàndard de la FIB: Una taula per classe

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
| **Associació binària 1\:N** | Clau forana ($\text{FK}$) a la taula del costat "molts" (`NOT NULL` si min=1). |
| **Associació binària 1\:1** | Clau forana a qualsevol costat amb restricció `UNIQUE`. |
| **Associació binària M\:N** | Nova taula amb $\text{PK} = (\text{FK}_1, \text{FK}_2)$. |
| **Associació n-ària** | Nova taula. Si és $*.*..*$, $\text{PK}$ conté totes les claus; si hi ha costats $0..1$, la PK té $n-1$ claus. |
| **Classe associativa** | La taula de l'associació inclou els atributs de la classe associativa. |
| **Herència (super/subclasses)** | Una taula per a la superclasse i una per a cada subclasse amb $\text{PK} = \text{FK}$ a la superclasse. |

:::uml2relviz
:::

### Punts clau que penalitzen als exàmens

1. **Entitats febles / Identificadors relatius:** Si una classe no té identificador propi global (ex: *«Planta: no poden existir dues plantes amb el mateix id en una mateixa escola, però sí en escoles diferents»*), la clau primària de `PLANTA` ha de ser **composta**: `PRIMARY KEY (nom_escola, id_planta)`.
2. **Classes temporals pures:** Classes com `Data`, `Hora` o `Any` que només tenen el valor temporal i cap altre atribut **no es converteixen en taules**: s'emmagatzemen directament com a columnes de tipus `DATE`, `TIME` o `INTEGER` a la taula de la relació.
3. **Restriccions que NO es poden capturar només amb claus:** Multiplicitats complexes (com ara mínim 2 o màxim 5), restriccions de jerarquia com **disjunta** o **completa**, o condicions entre múltiples taules han d'indicar-se explícitament com a mecanismes externs al DDL bàsic: assercions (`CREATE ASSERTION`) o disparadors (`TRIGGER`).

---

## 6.9. Validació Semàntica de Models UML (Preguntes de Cert / Fals d'Examen)

Als exàmens sovint es plantegen afirmacions sobre el model UML i es demana: dir si l'afirmació és **CERTA** o **FALSA**, i si és certa donar un contingut tabular d'exemple que ho demostri; si és falsa indicar exactament **què hauria de canviar al diagrama UML** perquè fos certa.

| Aspecte del Model UML | Com interpretar-lo | Si és Falsa, com s'arregla? |
| :--- | :--- | :--- |
| **Multiplicitat màxima $1$** | L'objecte **només pot estar relacionat amb un únic element** en aquell rol. | Canviar la multiplicitat màxima de $1$ a $*$. |
| **Multiplicitat mínima $1$** | L'objecte **ha d'existir obligatòriament associat** a un altre (FK `NOT NULL`). | Canviar la multiplicitat mínima de $1$ a $0$. |
| **Clau externa global** | L'atribut identifica unívocament la instància a **tota la base de dades**. No pot haver-hi dues instàncies amb el mateix valor, ni en contextos diferents. | Fer que la clau external sigui relativa (identificació feble). |
| **Clau externa relativa (Classe feble)** | Dues instàncies en contenidors diferents **SÍ que poden repetir el mateix nom/codi**. | Fer la clau externa global única per a tota la classe. |
| **Estructures cícliques** | Si una associació reflexiva d'ordenació exigeix extrems oberts, prohibeix cicles complets llevat que el model admeti ambdós sentits o no imposi asimetria. | Modificar les multiplicitats dels rols o treure la restricció d'ordre acíclic. |

**Si l'afirmació és CERTA:** dibuixa una instància mínima de les taules que mostri la situació sense violar cap PK, FK ni multiplicitat. **Si l'afirmació és FALSA:** sigues precís, indicant exactament quina multiplicitat o restricció cal canviar i en quin extrem de quina associació.

---

## 6.10. Classificació i Traducció de Restriccions Textuals (R1..Rn)

Als enunciats de disseny és comú afegir una llista de restriccions textuals additionals. La seva traducció segueix sempre el mateix patró:

1. **Identificadors alternatius:** *«No poden existir dos perfils amb el mateix nomUsuari»* → **`UNIQUE (nomUsuari)`** a la taula `PERFIL`.
2. **Restriccions de domini / estat:** *«L'estat d'una assistència només pot ser 'confirmada' o 'cancel·lada'»* → **restricció de columna**: `CHECK (estat IN ('confirmada', 'cancel·lada'))`.
3. **Condicions entre atributs de la mateixa fila:** *«Si una assistència és confirmada, ha de tenir una data de registre»* → **restricció de taula**: `CHECK (estat <> 'confirmada' OR dataRegistre IS NOT NULL)`.
4. **Condicions que creuen múltiples taules:** *«Les actuacions en un esdeveniment han de ser en escenaris contractats per aquest esdeveniment»* → **NO es pot** com a restricció de columna ni de taula perquè involucra dues taules. S'ha d'implementar com a **`CREATE ASSERTION`** (o disparadors).
