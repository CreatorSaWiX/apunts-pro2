---
title: "Tema 2: El Model Relacional de Dades"
description: "Estructura formal de les relacions, grau i cardinalitat, jerarquia de claus (PK, FK, AK), regles d'integritat i accions compensatòries davant DELETE i UPDATE."
readTime: "12 min"
order: 2
draft: false
---

# 2. El model relacional de dades

El ==model relacional==, proposat originalment per Edgar F. Codd (1970), defineix una estructura lògica uniforme i completament independent de la implementació física a disc. Tota la informació es representa mitjançant un únic tipus d'element: el **conjunt de relacions**, on tots els valors emmagatzemats són estrictament **atòmics** (sense valors compostos ni llistes ni registres niats).

---

## 2.1. Concepte i estructura formal

En el model relacional, una «taula» és la representació visual i intuïtiva del concepte matemàtic de **relació** (un subconjunt del producte cartesià de diversos dominis):

$$
R \subseteq \mathrm{dom}(A_1) \times \mathrm{dom}(A_2) \times \dots \times \mathrm{dom}(A_n)
$$

### Anatomia d'una relació: Taula `EMPLEAT`

```text
               ┌─────────────────────── Esquema R(A₁, A₂, A₃, A₄) / Capçalera ────────────────────────┐
               │                         Grau (n = 4 atributs / columnes)                            │
               ├───────────────┬─────────────────────────┬──────────────┬────────────────────────────┤
               │   DNI (A₁)    │        Nom (A₂)         │  Edat (A₃)   │         Sou (A₄)           │
┌──────────────┼───────────────┼─────────────────────────┼──────────────┼────────────────────────────┤
│              │   12345678A   │       Anna Puig         │      28      │          2.400             │ ◄── Valor atòmic ∈ dom(A₄)
│ Extensió     ├───────────────┼─────────────────────────┼──────────────┼────────────────────────────┤
│ (Cos)        │   87654321B   │       Marc Vidal        │      35      │          1.950             │ ◄── Tupla t₂ ∈ Extensió
│              ├───────────────┼─────────────────────────┼──────────────┼────────────────────────────┤
│ m = 3 tuples │   45678901C   │       Laia Soler        │      22      │          NULL              │ ◄── Valor nul (desconegut)
└──────────────┴───────────────┴─────────────────────────┴──────────────┴────────────────────────────┘
                                           ▲
                                           │
                         Atribut / Camp / Columna (A₂ ∈ dom(A₂))
```

A partir d'aquest esquema es defineixen els conceptes fonamentals:

* ==Esquema de la relació (o Capçalera)==: Estructura lògica fixa denotada per $R(A_1, A_2, \dots, A_n)$, on $R$ és el nom de la relació i $\{A_1, \dots, A_n\}$ és el conjunt d'atributs que la componen.
* ==Extensió de la relació (o Cos)==: Conjunt de tuples existents en un moment concret del temps. A diferència de l'esquema (que és invariant), l'extensió és dinàmica i varia amb les operacions d'inserció, esborrat i modificació.
* ==Grau ($n$)==: Nombre d'atributs de l'esquema (nombre de columnes). A l'exemple de la taula `EMPLEAT`, el grau és $n = 4$.
* ==Cardinalitat ($m$)==: Nombre de tuples que formen l'extensió en un instant determinat (nombre de files). A l'exemple, la cardinalitat és $m = 3$.
* ==Tupla (o Fila / Registre)==: Element individual de l'extensió ($t \in \text{Extensió}$). Representa una col·lecció de valors estretament associats entre si que descriuen una entitat concreta de la realitat.
* ==Atribut (o Columna / Camp)==: Paper semàntic que un domini concret exerceix sobre l'esquema de la relació (ex: `Nom` $\in \text{dom}(A_2)$).
* ==Valor atòmic==: Valor elemental no descomposable en parts més petites pel SGBD. L'exigència de valors atòmics defineix la **Primera Forma Normal (1FN)**.
* ==Valor nul (`NULL`)==: Marca especial utilitzada per indicar que un valor concret és **desconegut** (ex: encara no sabem el sou d'una nova incorporació) o bé **inaplicable** (ex: el número de telèfon fix d'algú que no en té).

::callout[type="info" title="Diferències formals entre Taula (concepte informal) i Relació (concepte matemàtic)"]
Tot i que a la pràctica es fan servir com a sinònims, formalment una relació compleix quatre propietats matemàtiques estrictes:

1. **Valors atòmics (1FN):** Els atributs només poden contenir valors individuals i indivisibles; mai taules niades, estructures complexes, vectors ni col·leccions de valors.
2. **Absència de tuples duplicades:** Una relació és formalment un **conjunt matemàtic**. Per definició, un conjunt mai pot contenir elements repetits. En canvi, una taula física d'una base de dades sense clau primària podria admetre files idèntiques (*multiset* o bossa).
3. **Absència d'ordre entre tuples:** La seqüència en què apareixen les files no té cap significació lògica ni matemàtica. Les tuples no estan ordenades intrínsecament.
4. **Absència d'ordre entre atributs:** Els atributs formen un conjunt desordenat $\{A_1, \dots, A_n\}$. L'accés a les dades es fa exclusivament pel **nom de la columna**, mai per la seva posició ordinal.
::

---

## 2.2. Jerarquia de claus

En el model relacional no s'utilitzen adreces físiques ni punters interns per identificar files; la identificació d'una tupla depèn **exclusivament dels valors dels seus atributs**:

```text
┌────────────────────────────────────────────────────────┐
│  Superclau                                             │
│  (Identifica unívocament, pot tenir atributs sobrants) │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Clau / Clau Candidata                           │  │
│  │  (Superclau MÍNIMA, sense atributs redundants)   │  │
│  │  ┌────────────────────────┐ ┌──────────────────┐ │  │
│  │  │ Clau Primària (PK)     │ │ Clau Alternativa │ │  │
│  │  │ (Designada formalment, │ │ (AK - Resta de   │ │  │
│  │  │  mai admet NULLs)      │ │  candidates)     │ │  │
│  │  └────────────────────────┘ └──────────────────┘ │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────┘
```

* ==Superclau==: Qualsevol subconjunt d'atributs de l'esquema que garanteix la identificació unívoca de cada tupla de l'extensió (és a dir, mai existiran dues tuples amb els mateixos valors en aquests atributs).
  * *Propietat:* Qualsevol ampliació d'una superclau afegint-hi més atributs continua sent una superclau.
* ==Clau (o Clau Candidata)==: Una **superclau mínima**. Això vol dir que cap subconjunt propi seu manté la propietat d'identificació unívoca (si en suprimim qualsevol atribut, deixa d'identificar de forma única les tuples).
* ==Clau Primària (PK - *Primary Key*)==: La clau candidata formalment triada pel dissenyador com a identificador principal de la relació. Per convenció gràfica se subratlla en l'esquema relacional: $\underline{\text{DNI}}$.
* ==Clau Alternativa (AK - *Alternate Key*)==: Qualsevol altra clau candidata que no ha estat escollida com a clau primària (per exemple, si tenim `DNI` com a PK, el número de passaport o el nom d'usuari podrien ser claus alternatives úniques).
* ==Clau Forana (FK - *Foreign Key*)==: Un subconjunt d'atributs d'una relació que fa referència a la clau primària d'una altra relació (o de la pròpia relació en el cas de relacions recursives).
  * Ha de tenir exactament el mateix nombre d'atributs que la clau primària referenciada.
  * Els dominis i tipus dels seus atributs han de ser estrictament compatibles amb els de la clau primària.
  * **Conseqüència fonamental:** *Les claus foranes són l'únic mecanisme que ofereix el model relacional per establir vincles i connexions lògiques entre tuples diferents.*

---

## 2.3. Les tres regles d'integritat

El model relacional garanteix la coherència i validesa de les dades mitjançant tres regles d'integritat generals:

### 1. Regla d'integritat d'entitat
Afecta la **clau primària (PK)** de cada relació:
* Els atributs de la clau primària han de prendre **valors únics** per a cada tupla en conjunt.
* **Cap atribut que formi part de la clau primària pot prendre el valor nul (`NULL`)**. Una entitat sense identificador conegut no pot existir ni ser referenciada formalment.

### 2. Regla d'integritat referencial
Afecta les **claus foranes (FK)** que connecten taules:
* Qualsevol valor present a la clau forana d'una relació filla **ha de correspondre obligatòriament a un valor existent de la clau primària referenciada** a la relació pare, o bé **ha de prendre el valor nul (`NULL`)** (si la relació admet que la connexió sigui opcional).

### 3. Regla d'integritat de domini
Afecta els **atributs individuals**:
* Qualsevol valor no nul assignat a un atribut ha de pertànyer estrictament al **domini de valors vàlids** definit per a aquest atribut (tant pel que fa al tipus bàsic de dada com a possibles restriccions addicionals de rang o format).
* Totes les operacions i comparacions aplicades han de ser semànticament compatibles amb el domini de l'atribut. En SQL estàndard la comprovació automàtica es limita als dominis predefinits (`INTEGER`, `VARCHAR`, `DATE`, etc.).

---

## 2.4. Manteniment de la integritat referencial (accions compensatòries)

Quan un usuari intenta esborrar (`DELETE`) o modificar (`UPDATE`) una fila que conté una **clau primària referenciada** per una o més claus foranes d'altres taules, es podria produir una violació d'integritat referencial (creació d'elements orfes).

L'SGBD disposa de **tres polítiques o accions compensatòries** configurables pel dissenyador:

| Política SQL | Comportament davant `DELETE` o `UPDATE` de la PK pare | Condicions i observacions |
| :--- | :--- | :--- |
| ==RESTRICT== / ==NO ACTION== | **Rebutja i bloqueja l'operació.** Si hi ha com a mínim una fila filla que referencia aquesta clau, l'SGBD llança un error i avorta la transacció. | És el comportament **per defecte** en SQL si no s'especifica res més. Máxima protecció. |
| ==CASCADE== | **Accepta l'operació i propaga el canvi automàticament.** Si s'esborra la PK pare, s'esborren totes les files filles relacionades. Si es modifica la PK, s'actualitza el nou valor a les FKs filles. | S'aplica de forma **recursiva** per tota la jerarquia de taules enllaçades. |
| ==SET NULL== | **Accepta l'operació assignant valors nuls (`NULL`)** a les columnes de la clau forana de totes les tuples filles que feien referència a la fila pare afectada. | **Només és vàlid si la clau forana admet nuls** (no té restricció `NOT NULL` ni forma part de la clau primària de la taula filla). |

---

## 2.5. Operacions del model relacional

Les operacions que es poden executar sobre una base de dades relacional es divideixen en dos grups:

1. ==Operacions d'actualització==: Modifiquen l'extensió de les relacions:
   * **Inserció:** Afegeix noves tuples a una relació.
   * **Esborrat:** Suprimeix tuples existents.
   * **Modificació:** Altera els valors de determinats atributs en tuples existents.
2. ==Operacions de consulta==: Deducció i extracció de nova informació a partir de les dades emmagatzemades a les relacions, sense alterar el seu contingut.
   * **Àlgebra relacional:** Llenguatge formal de caràcter **procedural**, on s'especifica la seqüència exacta d'operacions (selecció $\sigma$, projecció $\pi$, combinació $\bowtie$, unió $\cup$, etc.) necessàries per construir el resultat.
   * **Càlcul relacional:** Llenguatge formal de caràcter **declaratiu** basat en la lògica de predicats de primer ordre, on s'especifica *què* es vol obtenir sense indicar *com* computar-ho.
   * **SQL:** El llenguatge universal estàndard. Es basa conceptualment en el càlcul relacional (declaratiu), integrant alhora elements operacionals i d'agregació de l'àlgebra.

---

::callout[type="tip" title="Resum de Síntesi: Tema 2"]
* **Elements estructurals:** Relacions compostes per tuples (files) i atributs (columnes) amb valors atòmics (1FN).
* **Mides:** Grau = nombre de columnes; Cardinalitat = nombre de files actuals.
* **Jerarquia de claus:** Superclau $\longrightarrow$ Clau candidata (superclau mínima) $\longrightarrow$ Clau primària (PK, única i sense nuls) $\longrightarrow$ Clau forana (FK, connecta amb una PK).
* **Enllaç de dades:** Les claus foranes són l'únic mecanisme relacional per connectar informació entre taules.
* **Regles d'integritat:**
  1. *Entitat:* PK única i mai nul·la.
  2. *Referencial:* La FK ha de coincidir amb una PK existent o ser `NULL`.
  3. *Domini:* Valors compatibles amb el tipus definit.
* **Accions davant `DELETE`/`UPDATE` de PK:**
  * `RESTRICT`: Rebutja l'operació (per defecte).
  * `CASCADE`: Propaga automàticament l'esborrat o modificació en cadena.
  * `SET NULL`: Posa a `NULL` la clau forana a les files filles (si admet nuls).
::
