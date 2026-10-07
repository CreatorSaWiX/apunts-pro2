---
title: "Tema 1: SO i shell"
description: "Rol del SO, modes d'execució, crides a sistema, Shell, inodes, enllaços i permisos."
readTime: "15 min"
order: 1
draft: false
---

## 1.1 Què fa el Sistema Operatiu?

El **Sistema Operatiu (SO)** és el programa que fa d'intermediari entre les nostres aplicacions i el maquinari de l'ordinador (la CPU, la memòria RAM, el disc dur, el teclat o la pantalla).

Sense el SO, cada programador hauria d'escriure instruccions de baix nivell per controlar directament els circuits del disc o la targeta de xarxa. El SO s'encarrega d'aquesta feina i persegueix 3 objectius:

1. **Fàcil d'usar (Usabilitat)**: Amaga els detalls complicats del maquinari. En lloc d'haver de gestionar pistes o sectors físics d'un disc, nosaltres només veiem fitxers i carpetes.
2. **Segur (Protecció)**: Impedeix que un programa amb errors o maliciós esborri la memòria d'un altre programa o toqui dades d'altres usuaris.
3. **Eficient**: Reparteix el temps del processador i la memòria perquè puguem executar molts programes alhora sense malbaratar recursos.

:::osmediatorviz
:::

---

## 1.2 Modes d'execució: mode usuari vs mode kernel

Per evitar que qualsevol programa pugui penjar l'ordinador o accedir a dades privades, el processador físic (la CPU) té **dos modes de treball**:

1. **Mode usuari (*user mode*)**:
   * És on s'executen els programes que fem nosaltres, el navegador, l'editor o la Shell.
   * La CPU té **restringit l'accés**: no pot tocar el maquinari directament ni llegir memòria que no sigui la seva. Si ho intenta, la CPU s'atura i avisa el sistema.
2. **Mode kernel (*kernel mode* o mode privilegiat)**:
   * És on s'executa exclusivament el nucli del sistema operatiu (*Kernel*).
   * La CPU té **accés total**: pot executar qualsevol instrucció de la màquina, tocar tota la memòria RAM i parlar directament amb els dispositius.

> **Com sap la CPU en quin mode està?**  
> Té un bit intern (al registre d'estat de la CPU o PSW). Quan val 0 està en mode kernel i quan val 1 en mode usuari. Un programa d'usuari té prohibit canviar aquest bit pel seu compte.

---

## 1.3 Com entrem al kernel? (3 portes d'entrada)

El nucli del sistema operatiu (*Kernel*) és un codi que està en repòs i només s'activa quan passa un esdeveniment. Només hi ha **3 maneres d'entrar al Kernel**:

| Esdeveniment | Qui el genera? | Sincronisme | Què és i Exemples |
| :--- | :--- | :--- | :--- |
| **Interrupció hardware** | Dispositiu extern | **Asíncrona** (pot arribar en qualsevol moment, entre dues instruccions) | El maquinari avisa que ha passat alguna cosa: prems una tecla, arriba un missatge de xarxa, el disc acaba de llegir dades, o salta el **rellotge del sistema**. |
| **Excepció software** | La pròpia CPU | **Síncrona** (la provoca una instrucció concreta mentre s'executa) | S'ha produït un error al codi: divisió entre zero, intentar tocar memòria no permesa (*Segmentation Fault*), o una fallada de pàgina (*page fault*). |
| **Crida a sistema (*trap*)** | El programa d'usuari | **Síncrona** (la demana expressament el codi) | El programa demana un servei al SO mitjançant una instrucció especial (`syscall`): obrir un fitxer, escriure per pantalla (`write`), o crear un fill (`fork`). |

### Per a què serveix la interrupció de rellotge? (Pregunta d'examen)
Imagina un programa amb un bucle infinit que no fa cap crida a sistema: `while (1);`. Com pot el sistema operatiu recuperar el control si el programa no li demana res?  
* Un xip temporitzador de la placa base genera una **interrupció de rellotge periòdica** (per exemple cada 10 mil·lisegons).
* Cada 10 ms, la CPU s'atura, passa a mode kernel i executa la rutina de rellotge del SO.
* El SO comprova si el programa porta massa estona executant-se. Si és així, li treu la CPU i la dona a un altre programa. Això impedeix que cap procés pengi la màquina.

---

## 1.4 Com funciona una crida a sistema per sota?

Quan un programa vol demanar ajuda al Kernel (per exemple per escriure bytes amb `write`), no pot saltar directament a una adreça del Kernel perquè està en mode usuari.

### 1. Per què la biblioteca de sistema (`libc`) depèn del maquinari? (Clau d'examen)
Quan en C escrius `write(1, buf, len)`, estàs cridant una funció d'usuari que ve amb la biblioteca estàndard de C (`libc`). Aquesta funció fa de pont:
1. Col·loca els arguments (`1`, `buf`, `len`) als **registres concrets de la CPU** que demana l'arquitectura.
2. Executa la **instrucció màquina de canvi de mode** de la CPU (`syscall` a 64 bits, `int 0x80` o `sysenter` a 32 bits).
3. Com que cada família de processadors (Intel, AMD, ARM) té instruccions i registres diferents, **el codi d'aquesta biblioteca ha d'estar escrit expressament per al maquinari on s'executa**.

### 2. Com s'aconsegueix que el codi funcioni entre diferents versions de Linux?
El Kernel no identifica els serveis per adreces de memòria (que canvien entre actualitzacions), sinó amb una **taula de números enters fixos** (la *syscall table*):
* `SYS_write = 1`, `SYS_fork = 57`, etc.
* La biblioteca posa el número al registre `%rax` i crida `syscall`. El Kernel llegeix aquest número, busca la funció a la seva taula i l'executa.
* **Totes les crides segueixen la mateixa regla**: si funcionen retornen el resultat; si fallen retornen `-1` i guarden el codi de l'error a la variable `errno`.

---

## 1.5 La shell i comandes (internes vs externes)

La **Shell** (a Linux normalment **Bash**) és l'intèrpret de comandes. Funciona amb un bucle infinit senzill: llegeix el text que escrius, l'interpreta, executa la comanda i torna a mostrar el símbol d'espera (*prompt*).

Hi ha dos tipus de comandes:

| Tipus | On s'executa? | Exemples | Com veure l'ajuda |
| :--- | :--- | :--- | :--- |
| **Interna (*built-in*)** | Dins del mateix procés de la Shell (**sense crear cap procés nou**) | `cd`, `pwd`, `export`, `alias`, `exit`, `echo` | `help <comanda>` |
| **Externa** | La Shell crea un procés fill nou amb `fork()` i carrega el fitxer binari des del disc amb `exec()` | `ls`, `mkdir`, `cp`, `rm`, `grep`, `cat` | `man <comanda>` |

* `type <comanda>`: et diu si una comanda és interna o un fitxer extern al disc.

:::shellviz{command="type cd" suggestions="type cd,type ls" title="Terminal — Comprovar si una comanda és interna o externa"}
:::

---

## 1.6 El manual `man` (les 3 seccions d'examen)

Quan consultes `man nom`, el manual està dividit en seccions numerades:

| Secció | Contingut | Exemples |
| :---: | :--- | :--- |
| **1** | Comandes que escrius a la terminal | `ls`, `cp`, `bash`, `man` |
| **2** | **Crides a sistema del Kernel** | `fork`, `write`, `read`, `open`, `waitpid`, `kill` |
| **3** | **Funcions de la biblioteca de C** | `printf`, `sprintf`, `strlen`, `malloc`, `perror` |

* `man write` $\rightarrow$ mostra la comanda d'enviar missatges a la terminal (secció 1).
* `man 2 write` $\rightarrow$ mostra la crida a sistema de C per escriure bytes (secció 2).
* **Tecles de navegació**: `Espai` (avançar pàgina), `b` (retrocedir), `/text` (cercar), `n` (següent coincidència), `q` (sortir).

:::shellviz{command="man write" suggestions="man write,man 2 write" title="Terminal — Consultar el manual de write (secció 1 vs 2)"}
:::

---

## 1.7 Com organitza els fitxers UNIX: inodes i carpetes

A UNIX tots els fitxers pengen d'un únic arbre des de l'arrel `/` (no hi ha lletres de disc com `C:` o `D:` de Windows).

### Què és un inode?
A UNIX, un fitxer té dues parts ben diferenciades:
1. **L'Inode (el DNI del fitxer)**: Una fitxa interna de dades que guarda la informació de gestió: mida en bytes, a quin usuari pertany, permisos (`rwx`), dates de creació/modificació, nombre d'enllaços (*links*), i els punters als blocs del disc on hi ha el contingut real.  
   **Dada clau d'examen: L'Inode NO sap com es diu el fitxer.**
2. **El Nom del fitxer**: Es guarda dins de les carpetes. Una carpeta és simplement una llista de parells `(nom_del_fitxer, número_inode)`.

| Nom del fitxer (a `/home/usuari`) | Núm. Inode | Descripció |
| :--- | :---: | :--- |
| `.` | `1001` | La pròpia carpeta actual (*ella mateixa*) |
| `..` | `1000` | La carpeta pare |
| `apunts.txt` | `50421` | El fitxer real |


* `stat fitxer`: mostra totes les dades guardades a l'inode (mida, blocs, enllaços, dates).
* **Comptador de links d'una carpeta**: Una carpeta nova té sempre **2 links**: el seu propi nom a la carpeta pare i el punt `.` que té a dins. Cada subcarpeta que creïs a dins sumarà $+1$ link (pel `..` de la filla).

:::shellviz{command="stat test.txt" suggestions="stat test.txt,stat Documents" title="Terminal — Consultar les metadades de l'Inode amb stat"}
:::

---

## 1.8 Hard links vs soft links (enllaços)

| Característica | Hard Link (`ln fitxer enllac`) | Soft Link (`ln -s fitxer enllac`) |
| :--- | :--- | :--- |
| **Què és en realitat?** | Un **segon nom** afegit a la carpeta que apunta al **mateix número d'inode**. | Un **fitxer nou i independent** amb un **inode nou** que a dins conté escrita la ruta de l'original (com un accés directe). |
| **Número d'Inode** | **El mateix** que l'original. | **Diferent** (té el seu propi inode). |
| **Comptador d'enllaços (*Links*)** | Suma $+1$ a l'inode original. | No afecta l'original (té comptador 1 propi). |
| **Si esborres l'original amb `rm`** | El contingut **no es perd**. El comptador baixa en 1, però mentre quedi un hard link viu, les dades continuen al disc. | L'enllaç queda **trencat (*dangling*)**. Si intentes obrir-lo dóna error: `No such file or directory`. |
| **Pot enllaçar carpetes?** | No (per evitar bucles infinits a l'arbre). | **Sí**. |
| **Pot saltar entre discs/particions?** | **No** (els números d'inode només tenen sentit dins del seu disc). | **Sí** (guarda una ruta de text). |

* `readlink enllac_soft`: mostra el text de la ruta que té guardat el soft link a dins.
* `namei -l ruta`: recorre pas a pas tota la ruta comprovant cada carpeta, enllaç i permís.

---

## 1.9 Permisos d'accés i comanda `chmod`

Els permisos s'organitzen en 1 caràcter pel tipus d'element i 3 grups de 3 caràcters (`rwx`):

| Tipus | Propietari (`u` - *user*) | Grup (`g` - *group*) | Altres (`o` - *others*) |
| :---: | :---: | :---: | :---: |
| `-` | `r w x` | `r - x` | `r - -` |

* **Tipus**: `-` fitxer normal · `d` directori/carpeta · `l` enllaç simbòlic (*soft link*).
* `u` (*user*): Propietari del fitxer.
* `g` (*group*): Usuaris del mateix grup.
* `o` (*others*): La resta d'usuaris del sistema.

### Significat de cada permís
| Lletra | Valor Octal | Sobre un fitxer | Sobre una carpeta |
| :---: | :---: | :--- | :--- |
| **`r`** (read) | 4 | Llegir el text o dades | Veure els noms dels fitxers que conté (`ls`) |
| **`w`** (write) | 2 | Modificar o sobreescriure el fitxer | **Crear, esborrar o canviar de nom** fitxers a dins |
| **`x`** (execute) | 1 | Executar el programa o script | **Entrar-hi amb `cd`** i accedir als fitxers de dins |

> **Pregunta Clau d'Examen**:  
> Per **esborrar un fitxer**, necessites permís `w` sobre el mateix fitxer?  
> **NO**. Esborrar un fitxer és treure el seu nom de la llista de la carpeta on es troba. Per tant, només necessites permisos **`w` i `x` sobre la carpeta pare**. Encara que un fitxer sigui de només lectura (`r--r--r--`), si tens permís `w` a la carpeta, el pots esborrar!

* **Canviar permisos amb `chmod`**:
  * Amb lletres: `chmod u+x script.sh` (afegeix execució al propietari), `chmod go-w fitxer` (treu escriptura a grup i altres).
  * Amb números octals: `chmod 755 script.sh` (`rwxr-xr-x`), `chmod 644 document.txt` (`rw-r--r--`).

:::shellviz{command="chmod u+x SO/lab1.sh" suggestions="chmod u+x SO/lab1.sh,chmod 755 SO/lab1.sh,ls -l SO" title="Terminal — Prova canviar permisos amb chmod"}
:::

---

## 1.10 Variables d'Entorn i `$PATH`

Les **variables d'entorn** són dades en format `NOM=VALOR` que es passen automàticament de pares a fills quan es crea un procés.
* `env`: mostra totes les variables definides.
* `echo $NOM`: mostra el valor d'una variable concreta.
* `export NOM="valor"`: defineix una variable i assegura que els programes que obris a partir d'ara també la puguin llegir.

### La variable `$PATH`
És una llista de carpetes (separades per dos punts `:`) on la Shell busca els binaris quan escrius una comanda com `ls` o `gcc`:
* La Shell busca d'esquerra a dreta i executa el primer que troba.
* **Perill d'examen**: Si poses `export PATH=.:$PATH`, la Shell buscarà primer a la teva carpeta actual (`.`). Si descarregues un projecte d'Internet que tingui un programa fraudulent anomenat `ls`, la Shell l'executarà abans que el `ls` autèntic del sistema!
* `which <comanda>`: et diu la ruta exacta del fitxer que s'executarà.

---

## 1.11 Redireccions d'entrada/sortida

* `>` : Envia la sortida cap a un fitxer. Si el fitxer ja existia, **en buida el contingut anterior**.
* `>>` : Envia la sortida cap a un fitxer, però **afegint les línies al final**, sense esborrar el que hi havia.
* `<` : Fa que el programa llegeixi les dades des d'un fitxer en lloc del teclat.
* `&` : Posa la comanda en segon pla (*background*); la Shell et torna el control immediatament.
* **Comodins (*Globbing*)**: `*` (qualsevol grup de lletres) i `?` (una sola lletra).  
  **Detall d'examen**: **L'expansió del comodí la fa la Shell abans d'executar el programa**. Si fas `grep hola *.c`, el teu programa no rep l'asterisc; rep directament `argv = ["grep", "hola", "a.c", "b.c"]`.

---

## 1.12 Preguntes típiques d'examen resoltes (Tema 1)

### 1. Per què la biblioteca de sistema (`libc`) depèn del maquinari?
> **Resposta breu i exacta**:  
> Perquè per canviar de mode d'usuari a mode kernel cal executar una instrucció màquina específica de la CPU (`syscall`, `sysenter`, `int 0x80`), i cal posar els paràmetres als registres concrets que demana l'arquitectura del processador.

### 2. Quins tres tipus d'esdeveniments fan que la CPU entri al Kernel?
> **Resposta breu i exacta**:  
> 1. **Interrupció de maquinari**: asíncrona, la genera un dispositiu extern (teclat, disc, rellotge).  
> 2. **Excepció de programari**: síncrona, la causa una instrucció del programa amb error (divisió per zero, violació de memòria).  
> 3. **Crida a sistema (*trap*)**: síncrona, la demana expressament el codi per sol·licitar un servei al sistema operatiu.

### 3. Executem `ln A B`. Sabem que `A` existeix, `B` no existeix, tenim permisos a la carpeta i hi ha espai al disc, però la comanda falla. Per què?
> **Resposta breu i exacta**:  
> Per un d'aquests dos motius:  
> 1. `A` és una **carpeta/directori**, i UNIX no permet crear *hard links* sobre carpetes per evitar cicles a l'arbre de fitxers.  
> 2. `A` i `B` estan en **particions o discs diferents**, i un *hard link* només pot compartir inodes dins del mateix sistema de fitxers.