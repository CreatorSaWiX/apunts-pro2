---
title: "Tema 1: Introducció i Arquitectura dels SGBD"
description: "Els tres mons de la informació, objectius dels SGBD, transaccions, concurrència, fiabilitat, arquitectura ANSI/SPARC i tipologies d'usuaris."
readTime: "8 min"
order: 1
draft: false
---

# 1. Introducció i arquitectura dels SGBD

::callout[type="info" title="Pes a l'avaluació"]
El pes de la nota als exàmens es concentra principalment a partir del **Tema 2 (Model Relacional)** i especialment al **Tema 3 (SQL)**. Aleshores, per a aquest primer tema és suficient una lectura comprensiva dels conceptes clau i del resum de síntesi final.
::

---

## 1.1. Els tres mons i objectius d'un SGBD

El procés d'abstracció de la informació dins de les organitzacions s'estructura formalment en **tres nivells** o «mons»:

1. ==Món real==: Objectes, entitats físiques o abstractes i fets del negoci en la realitat quotidiana (persones, factures, comptes bancaris, comandes).
2. ==Món conceptual==: Abstracció semàntica i formal del negoci independent de qualsevol tecnologia concreta: definició de **classes d'objectes**, els seus **atributs** i les seves **associacions** (modelats mitjançant diagrames de classes UML o diagrames E/R).
3. ==Món de les representacions==: Estructures de dades lògiques i físiques gestionades pel computador i els sistemes operatius per emmagatzemar la informació de forma permanent (fitxers, taules, tuples, registres, camps i blocs de disc).

```text
┌────────────────┐       Abstracció        ┌────────────────┐       Implementació       ┌──────────────────────┐
│    MÓN REAL    │   ─────────────────►   │ MÓN CONCEPTUAL │   ───────────────────►   │ MÓN REPRESENTACIONS  │
│ (Factures,     │   Classes d'objectes,  │ (Diagrama UML, │   Taules, tuples, camps, │ (Fitxers, discs,     │
│  comptes, ...) │   atributs, relacions  │  model E/R)    │   estructures físiques)  │  SGBD)               │
└────────────────┘                        └────────────────┘                          └──────────────────────┘
```

### Limitacions dels fitxers ordinaris vs. SGBD

L'ús de fitxers convencionals del sistema operatiu gestionats directament per programes d'aplicació presenta greus inconvenients: redundància incontrolada de dades, inconsistència entre fitxers, pèrdua d'informació davant fallades del sistema i absència de control d'accessos concurrents simultanis.

Un ==Sistema de Gestió de Bases de Dades (SGBD)== resol aquests problemes aportant cinc propietats fonamentals:

* **Persistència:** Les dades es conserven de manera íntegra i duradora després de la finalització dels processos que les han creat o modificat.
* **Eficiència i emmagatzematge massiu:** Proporciona estructures d'indexació avançades (arbres B+, taules de dispersió / hash) i mètodes d'accés optimitzats per gestionar volums massius de dades molt superiors a la capacitat de la memòria principal, evitant lectures seqüencials completes de disc.
* **Accés multiusuari i concurrència:** Coordina l'accés simultani de nombrosos usuaris i aplicacions a les mateixes dades garantint la integritat mitjançant el concepte de **transacció**.
* **Seguretat i fiabilitat:** Ofereix un control estricte d'autoritzacions i privilegis d'accés, acompanyat de mecanismes de recuperació automàtica davant fallades físiques o lògiques.
* **Conveniència:** Incorpora un llenguatge declaratiu d'alt nivell (**SQL**) que independitza la formulació de consultes de la seva implementació física i dels algorismes concrets d'accés.

---

## 1.2. Transaccions i concurrència

El mecanisme fonamental dels SGBD per gestionar de forma segura els accessos concurrents és la ==transacció==: una seqüència d'operacions sobre la base de dades que s'executa com una **unitat atòmica de treball** (o es completa íntegrament o no s'aplica cap canvi).

Tota transacció finalitza amb una de les dues sentències següents:
* ==COMMIT==: Confirma la transacció amb èxit. Totes les modificacions esdevenen permanents i visibles a la base de dades.
* ==ROLLBACK==: Cancel·la o avorta la transacció per error o fallada. L'SGBD desfà automàticament qualsevol modificació intermèdia realitzada, retornant la base de dades a l'estat previ a l'inici de la transacció.

::callout[type="warning" title="Problema de concurrència per manca d'aïllament (Exemple)"]
Considerem dos comptes bancaris: **$X = 1500$** i **$Y = 2000$** (saldo total del sistema $= 3500$).

La transacció $T_1$ transfereix $1000$ de $X$ a $Y$. Simultàniament, la transacció $T_2$ calcula la suma total dels saldos:

1. $T_1$ resta $1000$ al compte $X$ ($X$ passa a valer $500$).
2. $T_2$ llegeix el saldo de $Y$ ($2000$).
3. $T_1$ suma $1000$ al compte $Y$ ($Y$ passa a valer $3000$) i fa `COMMIT`.
4. $T_2$ llegeix el saldo de $X$ ($500$) i calcula la suma: $2000 + 500 = 2500$.

**El resultat calculat per $T_2$ és incorrecte** ($2500 \neq 3500$) a causa de la lectura d'un estat intermedi inconsistent de $T_1$.

**Mecanisme de resolució:** L'SGBD empra **bloquejos (*locks*)** sobre les dades per restringir l'accés d'altres transaccions fins que la transacció activa confirma el seu resultat final (`COMMIT` o `ROLLBACK`).
::

---

## 1.3. Fiabilitat i recuperació

Per garantir que les dades reflecteixin fidelment la realitat i no es corrompin, l'SGBD disposa de controls i protocols:

* **Regles d'integritat del model:** Condicions estructurals inherents al propi model relacional (com ara la unicitat de la clau primària o la integritat referencial de les claus foranes) que l'SGBD verifica de manera automàtica.
* **Restriccions d'integritat dels usuaris:** Regles de negoci definides específicament pels dissenyadors per satisfer la semàntica de l'aplicació (per exemple, `CHECK (sou > 80000)` o `edat >= 18`).
* **Redundàncies controlades:** Emmagatzematge deliberat de dades derivades o duplicades amb l'objectiu d'optimitzar el temps de resposta de determinades consultes crítiques. L'SGBD s'encarrega de mantenir la coherència actualitzant-les automàticament davant qualsevol modificació de les dades origen.
* **Mecanismes de recuperació:** Enregistrament continu de totes les operacions d'escriptura en un ==dietari (*log*)== emmagatzemat en memòria estable (disc), cosa que permet refer les transaccions confirmades (*redo*) i desfer les transaccions incompletes (*undo*) davant una fallada sobtada del sistema o caiguda elèctrica.

---

## 1.4. Arquitectura ANSI/SPARC i la independència de dades

L'arquitectura estàndard ANSI/SPARC defineix **tres nivells d'abstracció** per desacoblar completament les aplicacions d'usuari de les estructures físiques d'emmagatzematge:

```text
 ┌─────────────────┐       ┌─────────────────┐                 ┌─────────────────┐
 │ Esquema ext. 1  │       │ Esquema ext. 2  │      ...        │ Esquema ext. n  │  Nivell Extern
 └────────┬────────┘       └────────┬────────┘                 └────────┬────────┘  (Vistes d'usuaris i apps)
          │                         │                                   │
          └─────────────────────────┼───────────────────────────────────┘
                                    ▼
                 ┌──────────────────────────────────────┐
                 │          Esquema Conceptual          │                       Nivell Conceptual
                 │  (Estructura lògica global de la BD) │                       (Entitats, atributs, relacions)
                 └──────────────────┬───────────────────┘
                                    ▲
                                    │ (Correspondència conceptual / interna)
                                    ▼
                 ┌──────────────────────────────────────┐
                 │            Esquema Intern            │                       Nivell Intern
                 │ (Fitxers, índexs i mètodes d'accés)  │                       (Emmagatzematge físic a disc)
                 └──────────────────────────────────────┘
```

1. ==Nivell extern==: Format per múltiples **esquemes externs (o vistes)**. Cadascun reflecteix la porció de la base de dades pertinent per a un usuari o grup d'usuaris determinat, amagant les dades no pertinents o confidencials.
2. ==Nivell conceptual==: L'**esquema conceptual** representa l'estructura lògica completa i comunitària de tota la base de dades (totes les taules, atributs, relacions i restriccions) sense cap referència a detalls tècnics d'emmagatzematge en disc.
3. ==Nivell intern==: L'**esquema intern** descriu la implementació física real: organització dels fitxers a disc, assignació de blocs de memòria, mètodes d'accés i estructures d'indexació (índexs B+, claus hash).

::callout[type="info" title="Independència física vs. Independència lògica de les dades"]
Aquesta separació en nivells fa possibles dos tipus decisius d'independència:

* ==Independència física==: Capacitat de modificar l'esquema intern (afegir o suprimir índexs, reorganitzar fitxers a disc o alterar la mida dels blocs) **sense haver d'alterar l'esquema conceptual ni els esquemes externs ni els programes d'aplicació**. Únicament cal ajustar la correspondència (*mapping*) entre el nivell conceptual i el nivell intern.
* ==Independència lògica==: Capacitat de modificar l'esquema conceptual (afegir noves taules, afegir columnes o modificar relacions) **sense alterar els esquemes externs existents que no facin ús d'aquests elements modificats**. De la mateixa manera, qualsevol canvi en un esquema extern és totalment transparent per a la resta d'esquemes externs.
::

---

## 1.5. Tipologies d'usuaris d'una base de dades

Els usuaris que interactuen amb una base de dades es classifiquen en dues grans categories:

### Usuaris informàtics
* **Administrador de la Base de Dades (DBA - *Database Administrator*):** Responsable de la gestió global del sistema: monitorització del rendiment, definició de polítiques de seguretat, gestió d'usuaris i privilegis, ajust de l'esquema físic i planificació de còpies de seguretat (*backups*) i recuperacions.
* **Dissenyadors de BD:** Analitzen els requisits del negoci i elaboren els esquemes conceptuals (UML / E-R) i lògics (relacionals).
* **Programadors d'aplicacions:** Desenvolupen el programari que interactua amb la BD mitjançant consultes incrustades (SQL) o APIs (JDBC, ORMs).
* **Implementadors del SGBD:** Enginyers que programen el propi programari motor del SGBD (gestor de transaccions, optimitzador de consultes, gestor de memòria).

### Usuaris no informàtics
* ==Usuaris paramètrics (o predefinits)==: Interactuen amb la base de dades únicament mitjançant interfícies gràfiques o aplicacions predefinides (formularis web, caixers automàtics, punts de venda). **No requereixen coneixements de l'estructura interna ni de llenguatges com SQL**.
* ==Usuaris finals (o ocasionals)==: Formulen consultes puntuals i directes mitjançant un llenguatge d'alt nivell com **SQL**. **Requereixen conèixer part de l'estructura de la base de dades** (taules i columnes) per expressar el que necessiten.

---

::callout[type="tip" title="Resum de Síntesi: Tema 1"]
* **Nivells d'abstracció:** Món real $\longrightarrow$ Món conceptual (UML / E-R) $\longrightarrow$ Món de les representacions (taules, tuples, dades a disc).
* **Transacció:** Unitat atòmica d'execució tancada amb `COMMIT` (èxit permanent) o `ROLLBACK` (reversió total). El control d'accessos concurrents es resol amb **bloquejos (*locks*)**.
* **Arquitectura ANSI/SPARC:** Tres nivells desacoblats: **extern** (vistes d'usuari), **conceptual** (estructura lògica comunitària) i **intern** (físic a disc).
* **Independència física:** Modificar índexs i organització física a disc sense tocar el nivell conceptual ni els programes.
* **Independència lògica:** Afegir nous elements al nivell conceptual sense trencar els esquemes externs que no els usen.
* **Usuaris no informàtics:** L'**usuari paramètric** fa servir interfícies sense conèixer SQL; l'**usuari final** formula consultes directes en SQL sobre l'esquema.
::
