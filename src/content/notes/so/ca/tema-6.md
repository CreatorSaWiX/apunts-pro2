---
title: "Tema 6: Entrada i Sortida"
description: "Arquitectura en 3 nivells, taules del kernel (TC, TFO, TI), crides bàsiques, pipes, redireccions i concurrència."
readTime: "18 min"
order: 6
draft: false
---

## 6.1 Conceptes bàsics i arquitectura en 3 nivells

L'**Entrada/Sortida (E/S)** és la transferència de dades entre un procés i l'exterior (sempre des del punt de vista del procés): **entrada** (exterior $\rightarrow$ procés) i **sortida** (procés $\rightarrow$ exterior). A diferència de llibreries d'alt nivell (`cin`/`cout`, `printf`/`scanf`), les crides a sistema (`read`/`write`) mouen **bytes purs**: la conversió a text ASCII o tipus de dades és responsabilitat del programador.

### Visió HW i independència dels dispositius
* **Maquinari**: La CPU es comunica amb el **controlador** del perifèric a través del bus mitjançant **ports** (registres de control, estat i dades, amb instruccions `in`/`out` o adreces mapades) i rep **interrupcions (`int`)** quan el dispositiu acaba una operació.
* **Independència dels dispositius**: El codi d'usuari ha de funcionar igual tant si llegeix d'un teclat, un fitxer o una canonada. Per aconseguir-ho, el SO ofereix **operacions uniformes** (`open`, `read`, `write`, `close`), **dispositius virtuals** (identificadors enters) i capacitat de **redireccionament** (`programa < fitxer1 > fitxer2`).

### Disseny en 3 nivells

:::iolayersviz
:::

| Nivell | Què representa? | Responsabilitat principal | A Linux s'identifica per... |
| :--- | :--- | :--- | :--- |
| **1. Virtual** | Dispositiu en ús dins d'un procés | Aïlla el programa del maquinari real. | **Canal / `fd`** (enter: `0` `stdin`, `1` `stdout`, `2` `stderr`). |
| **2. Lògic** | Interfície uniforme i compartició | Permisos, blocs de mida independent i accés concurrent. | **Nom de fitxer / ruta** (`/dev/tty0`, `dades.txt`). |
| **3. Físic** | Implementació al controlador (*Device Driver*) | Tradueix operacions lògiques a ordres físiques (pistes, sectors, motors). | **Tipus** (`b`/`c`) + parell **`major` / `minor`**. |

* **`major`**: Indica el tipus de dispositiu (quin *Device Driver* el gestiona).
* **`minor`**: Indica la instància concreta dins d'aquell tipus (ex: partició 1 vs partició 2 del mateix disc).

### Tipus de fitxers a Linux i comanda `mknod`
A Linux, gairebé tot s'identifica amb un fitxer al VFS (*Virtual File System*):
* **Fitxer regular (*regular file*)**: Fitxer de dades convencional.
* **Fitxers especials**: Directori (`d`), Enllaç simbòlic (`l`), Dispositiu de blocs (`b`, ex: discs), Dispositiu de caràcters (`c`, ex: teclat, `/dev/null`), Pipe amb nom (`p` / FIFO) i Socket (`s`).

La crida/comanda **`mknod`** crea fitxers especials (no serveix per a fitxers regulars, directoris ni symlinks):
```bash
mknod nom_fitxer c major minor   # Dispositiu de caràcters
mknod nom_fitxer b major minor   # Dispositiu de blocs
mknod nom_pipe   p               # Pipe amb nom / FIFO (sense major/minor)
```

---

## 6.2 Estructures de dades del Kernel: TC, TFO i TI

Per connectar el nivell virtual (procés) amb el nivell físic (dispositiu o disc), el Kernel manté **tres taules enllaçades**:

:::kerneltablesviz
:::

1. **Taula de Canals (TC) — *Una per cada procés (dins el PCB)***:
   * Índex enter (`0, 1, 2...`): el **canal** o descriptor de fitxer (`fd`).
   * Cada entrada ocupada guarda l'índex a una entrada de la TFO.
2. **Taula de Fitxers Oberts (TFO) — *Global (una per tot el sistema)***:
   * Representa cada "obertura" lògica activa.
   * **`refs`**: Nombre d'entrades de TC (del mateix procés o d'altres) que hi apunten.
   * **`mode`**: Mode d'accés (`r`, `w`, `rw`).
   * **`posicio_le`**: Punter actual de lectura/escriptura en bytes (en dispositius seqüencials com terminals o pipes val `-`).
   * **`ent_ti`**: Índex a la Taula d'Inodes.
3. **Taula d'Inodes (TI) — *Global (una per tot el sistema)***:
   * Còpia en memòria RAM de l'inode físic del disc per accelerar accessos (conté mida, tipus, permisos, dates, nombre d'enllaços, índexs als blocs de dades i punters a les rutines del *Device Driver*).
   * **`refs`**: Nombre d'entrades de la TFO que hi apunten.

> **L'Inode NO guarda el nom del fitxer:**  
> Un directori és simplement un fitxer amb parells `(nom, número_inode)`. Tota la resta de metadades viuen a l'inode.

---

## 6.3 Crides a sistema bàsiques d'E/S

### Operacions bloquejants vs no bloquejants

:::ioblockingviz
:::

* **E/S Bloquejant (per defecte)**: Si no hi ha dades per llegir (o no hi ha espai per escriure), el procés passa de `RUN` $\rightarrow$ `BLOCKED`, cedeix la CPU i entra a una cua d'espera. Quan arriben les dades, el dispositiu genera una interrupció; la RSI recull la dada i passa el procés a `READY`.
* **E/S No bloquejant**: Transfereix només el que estigui disponible a l'instant i retorna immediatament (es pot activar amb `fcntl` / flag `O_NONBLOCK`).

### Resum de crides principals

| Crida a sistema | Funció principal | Efecte a les taules (TC / TFO / TI) |
| :--- | :--- | :--- |
| **`open`** | Obre (o crea) un fitxer i retorna un `fd`. | Ocupa el **primer canal lliure** de la TC, crea una **nova entrada a la TFO** (`posicio_le = 0`) i enllaça amb la TI. |
| **`read`** | Llegeix fins a `count` bytes de `fd` cap a memòria. | Avança `posicio_le += bytes_llegits` a la TFO. Retorna `0` en arribar a EOF. |
| **`write`** | Escriu fins a `count` bytes de memòria cap a `fd`. | Avança `posicio_le += bytes_escrits` a la TFO. |
| **`lseek`** | Mou manualment el punter `posicio_le`. | Modifica directament `posicio_le` a la TFO (només fitxers amb accés aleatori). |
| **`dup` / `dup2`** | Duplica un canal existent. | El nou canal apunta a la **mateixa entrada de la TFO** (`refs++` a la TFO). |
| **`close`** | Tanca el canal `fd`. | Allibera la TC, fa `refs--` a la TFO. Si arriba a `0`, allibera la TFO i fa `refs--` a la TI. |
| **`pipe`** | Crea una canonada sense nom (`fd[0]`, `fd[1]`). | Crea 2 entrades a TC (`r`/`w`), 2 a TFO (`r`/`w`) i 1 inode temporal a la TI. |

### 1. `open(nom, flags [, permisos])`
Comprova els permisos d'accés **un sol cop** en executar-se (les crides `read`/`write` posteriors ja no els tornen a validar):
* **Mode obligatori** (un dels tres): `O_RDONLY`, `O_WRONLY`, `O_RDWR`.
* **Flags de creació/truncat**:
  * `O_CREAT`: Crea el fitxer regular si no existeix (obliga a passar el 3r paràmetre de permisos, ex: `S_IRUSR | S_IWUSR` o `0644`). Si ja existeix, no fa res.
  * `O_TRUNC`: Si el fitxer ja existia, allibera les seves dades i el deixa a **0 bytes**.
  * *(Nota: Els fitxers especials com FIFOs o dispositius han d'existir prèviament; `O_CREAT` no els crea).*

### 2. `read()` i `write()`: Accés byte a byte, buffer i format binari
```c
// Ineficient: fa N crides a sistema (N canvis de mode usuari <-> kernel)
while ((n = read(0, &c, 1)) > 0)
    write(1, &c, 1);

// Eficient: llegeix blocs sencers i redueix dràsticament les syscalls
char buf[1024];
while ((n = read(0, buf, sizeof(buf))) > 0)
    write(1, buf, n); // IMPORTANT: escriure 'n' bytes (els realment llegits), NO sizeof(buf)!
```
* **Text ASCII vs binari de màquina**: `read`/`write` mouen bytes purs. Pots transferir text ASCII (`"42"`) o dades binàries directes de memòria (`int x = 42; write(fd, &x, sizeof(int));` $\rightarrow$ 4 bytes tal com són a RAM, inspeccionables amb `xxd` o `hexdump`).

### 3. `lseek(fd, desplaçament, relatiu_a)`
Permet saltar a qualsevol posició d'un fitxer regular (**falla amb `ESPIPE` a pipes, FIFOs o terminals**):
* `SEEK_SET`: `posicio_le = desplaçament` (des de l'inici).
* `SEEK_CUR`: `posicio_le = posicio_le + desplaçament` (des de la posició actual).
* `SEEK_END`: `posicio_le = mida_fitxer + desplaçament` (des del final).
* **TFO vs TI**: `SEEK_SET` i `SEEK_CUR` només modifiquen la **TFO**; **`SEEK_END` consulta la mida a la TI (inode)**.
* **Truc per calcular la mida d'un fitxer**: `off_t size = lseek(fd, 0, SEEK_END);`.

### 4. `dup()`, `dup2()` i `close()`

:::dup2viz
:::

* **`newfd = dup(fd)`**: Cerca el **primer canal lliure** de la TC i el fa apuntar a la mateixa entrada de TFO que `fd`.
* **`dup2(fd, newfd)`**: Força que el canal destí sigui `newfd`. Si `newfd` estava obert prèviament, el tanca automàticament de forma atòmica. Base per a redireccions:
  ```c
  int fd = open("sortida.txt", O_WRONLY | O_CREAT | O_TRUNC, 0644);
  dup2(fd, 1); // Ara tot write(1, ...) o printf escriu a sortida.txt!
  close(fd);   // Alliberem el canal auxiliar 'fd'; el canal 1 manté la TFO viva
  ```

### 5. Control avançat i espai de noms
* **`pread(fd, buf, count, offset)` / `pwrite(...)`**: Llegeix o escriu directament a `offset` **sense modificar `posicio_le` de la TFO** (molt útil quan diversos *threads* llegeixen el mateix `fd` sense trepitjar-se).
* **`ioctl(fd, cmd [, ptr])`**: Modifica paràmetres específics del **dispositiu lògic / driver** (ex: configuració d'un terminal o xarxa).
* **`fcntl(fd, cmd [, args])`**: Modifica propietats del **canal virtual** (ex: passar `fd` a mode no bloquejant `O_NONBLOCK`).
* **Metadades i enllaços**: `link` / `unlink` (esborra el nom del directori; només allibera inode i blocs quan `#links == 0` **i** `TI.refs == 0`), `symlink`, `chmod`, `chown` / `chgrp`, i consulta d'inode amb `stat` (segueix symlinks), `lstat` (no segueix symlinks) i `fstat` (a partir d'un `fd` obert).

---

## 6.4 Pipes i Terminals

### Pipes sense nom (`pipe`) vs Pipes amb nom (FIFO)

| Característica | Pipe sense nom (`pipe(fd)`) | Pipe amb nom / FIFO (`mknod` + `open`) |
| :--- | :--- | :--- |
| **Nom al Sistema de Fitxers?** | **NO** (només existeix a RAM, inode temporal). | **SÍ** (té entrada a un directori, tipus `p`). |
| **Qui la pot utilitzar?** | Només el procés creador i els seus **descendents** (herència per `fork`). | **Qualsevol procés** del sistema que conegui la ruta i tingui permisos. |
| **Com s'obre?** | `pipe(fd)` ja retorna els 2 canals oberts (`fd[0]` lectura, `fd[1]` escriptura). | Es crea en C amb `mkfifo("p", 0660)` (o `mknod`) i cada procés fa `open("p", ...)`. |

> **Bloqueig a l'`open` i reintents:**  
> Obrir una pipe amb nom en `O_RDONLY` **bloqueja** el procés fins que algun altre procés l'obri en `O_WRONLY` (i viceversa). Si s'obre amb `O_RDWR`, no bloqueja, però el mateix procés passa a constar com a possible escriptor! Si la FIFO ja existia, `mkfifo` falla amb `errno == EEXIST`.

### Regles d'or de bloqueig i sincronització en pipes

:::pipeviz
:::

El Kernel sincronitza automàticament lectors i escriptors (i a la TFO `posicio_le` sempre val `-`):
* **Lectura (`read`)**:
  * Si hi ha dades $\rightarrow$ retorna fins a `count` bytes disponibles.
  * Si és buida i queda **almenys 1 canal d'escriptura obert** $\rightarrow$ el lector es **bloqueja**.
  * Si és buida i **tots els canals d'escriptura estan tancats** $\rightarrow$ retorna `0` (**EOF**).
* **Escriptura (`write`)**:
  * Si la pipe és plena $\rightarrow$ l'escriptor es **bloqueja** fins que el lector buidi espai.
  * Si **tots els canals de lectura estan tancats** $\rightarrow$ el procés rep el senyal **`SIGPIPE`** (mata el procés per defecte; si l'ignores amb `SIG_IGN`, `write` retorna `-1` amb `errno == EPIPE`).

> **Regla crítica — Tancar sempre els canals que no s'usen:**  
> Després d'un `fork()`, tant el pare com els fills hereten tots els canals de la pipe. Si el procés lector (o el pare que només fa `waitpid`) deixa obert el canal d'escriptura `fd[1]`, la pipe encara té un "possible escriptor" viu i **el lector es quedarà bloquejat per sempre sense rebre mai EOF**.

```c
// Redirecció estil Shell: programa1 | programa2
int fd[2];
pipe(fd);
if (fork() == 0) { // FILL 1 (escriptor)
    dup2(fd[1], 1);
    close(fd[0]); close(fd[1]); // Tanca tots dos canals originals
    execlp("programa1", "programa1", NULL);
}
if (fork() == 0) { // FILL 2 (lector)
    dup2(fd[0], 0);
    close(fd[0]); close(fd[1]); // Tanca tots dos canals originals
    execlp("programa2", "programa2", NULL);
}
close(fd[0]); close(fd[1]);     // IMPRESCINDIBLE: el pare tanca ambdós canals!
while (waitpid(-1, NULL, 0) > 0);
```

### Terminals (Mode Canònic per defecte)
* **Lectura**: El controlador manté un *buffer* de línia. Els caràcters no s'envien al procés fins que es prem Enter (`CR`), permetent editar prèviament amb `^H` (esborrar caràcter) i `^U` (esborrar línia).
* **`^D` (EOF)**: Forces el buidat del *buffer* cap al `read()`. Si el *buffer* era buit, `read()` retorna `0` (interpretat com a final de fitxer).

---

## 6.5 E/S en execució concurrent: `fork`, `exec` i senyals

### 1. `fork()`: Compartició vs independència del punter `posicio_le`
El fill hereta una **còpia exacta de la TC** del pare, de manera que ambdós apunten a la **mateixa entrada de la TFO** (`refs` s'incrementa):

:::forkioviz
:::

* **Obert ABANS del `fork()` $\rightarrow$ Punter compartit**:
  ```c
  int fd = open("fitxer.txt", O_RDONLY);
  fork();
  // Pare i fill comparteixen l'entrada de TFO: si el pare llegeix el byte 0,
  // el fill llegirà el byte 1! Es reparteixen el fitxer.
  ```
* **Obert DESPRÉS del `fork()` $\rightarrow$ Punters independents**:
  ```c
  fork();
  int fd = open("fitxer.txt", O_RDONLY);
  // Cadascú crea la seva pròpia entrada a la TFO (posicio_le = 0 independent).
  // Tant pare com fill llegiran el fitxer sencer des del principi.
  ```

### 2. `exec()`: Per què funcionen les redireccions?
Quan un procés muta amb `exec()`, la seva memòria RAM es substitueix pel nou programa, però **les seves estructures d'E/S (la TC) es mantenen intactes**.
Per això l'esquema canònic de redirecció és:
1. `fork()` (el fill hereta els canals del pare).
2. El fill tanca/duplica canals (`close(0); open(...)` o `dup2(fd, 1); close(fd);`).
3. El fill executa `exec()`: el nou programa ja arrenca amb l'entrada o sortida redireccionada de forma completament transparent.

### 3. Interrupció de crides d'E/S per senyals (`EINTR` vs `SA_RESTART`)
Si arriba un senyal mentre un procés està `BLOCKED` en un `read()`, `write()` o `open()`:
* **Amb el flag `SA_RESTART`** a `sigaction`: Un cop finalitza el *handler*, el Kernel **reinicia automàticament** la crida d'E/S (excepte en operacions particulars com sockets o `sigsuspend`).
* **Sense `SA_RESTART`**: La crida retorna error (`-1`) i `errno` val **`EINTR`**. Per evitar que una lectura legítima falli per un senyal, es protegeix amb un bucle:
  ```c
  while ((n = read(fd, buf, size)) == -1 && errno == EINTR);
  ```

---

## 6.6 Model físic del Sistema de Fitxers a disc

Un sistema de fitxers UNIX a disc s'organitza en **tres grans zones**:

:::unixfsviz
:::

1. **Superbloc**: Metadades globals de la partició (mida de bloc, bitmaps/llistes d'inodes i blocs lliures, i adreça de l'inode arrel `/`).
2. **Taula d'Inodes**: Cada inode conté les metadades del fitxer (`tipus`, `permisos`, `#enllaços`, `mida`, dates) i **punters als seus blocs de dades**:
   * **Punters directes**: Apunten directament a blocs de dades (accés immediat en fitxers petits).
   * **Indirectes (simple, doble, triple)**: Apunten a blocs que contenen adreces d'altres blocs, permetent fitxers enormes *(tot i que la mida efectiva màxima també queda acotada pel tipus de `posicio_le` a la TFO, ex. 4 GiB si és de 32 bits)*.
3. **Blocs de Dades (BD)**: Emmagatzemen el contingut dels fitxers regulars i les taules `(nom, inode)` dels directoris (incloent sempre `.` i `..`).
   * **Soft links**: Si la ruta destí és curta es desa *inline* dins el propi inode (`0` BD); si és llarga ocupa `1` BD amb el text de la ruta.
4. **Resolució de camins i *Buffer Cache***:
   * Per obrir `/dir/f.txt`, el Kernel parteix de `/` i alterna **Inode de directori $\rightarrow$ BD del directori** fins a trobar l'inode final (si troba un *soft link* amb ruta absoluta, reinicia des de `/`).
   * La **Buffer Cache** guarda en RAM els darrers blocs i inodes llegits/modificats: les segones lectures fan *hit* a memòria sense tocar el disc, i les escriptures es bolquen de forma diferida.

### Què passa en cada crida a sistema?

| Crida a sistema | Què consulta o modifica al Sistema de Fitxers? | Accedeix als BD del fitxer objectiu? |
| :--- | :--- | :---: |
| **`open` (existent)** | Recorre el camí des de `/` (o `.`) alternant Inode $\rightarrow$ BD de directori (o cau). Si troba un *soft link*, en llegeix la ruta i torna a resoldre. Comprova permisos a l'inode final. | **NO** |
| **`open` (`O_CREAT`)** | Tot l'anterior + demana un **nou inode lliure al Superbloc**, afegeix `(nom, nou_inode)` al BD del directori pare i n'actualitza mida/dates. | **NO** |
| **`mkdir`** | Demana **1 inode + 1 BD lliure** al Superbloc per al nou directori (amb `.` i `..`), afegeix l'entrada al pare i incrementa `#enllaços` del pare. | **SÍ (crea el seu BD)** |
| **`unlink`** | Treu `(nom, inode)` del BD del pare i resta 1 a `#enllaços`. Només allibera l'inode i els BD al Superbloc si **`#enllaços == 0` i `TI.refs == 0`**. | **NO** |
| **`read`** | Comprova a la TFO si `posicio_le == mida` (EOF). Calcula el bloc, consulta els índexs de l'inode i llegeix des de *Buffer Cache* o disc. | **SÍ** |
| **`write`** | Igual que `read`; si amplia el fitxer, demana **BD lliures al Superbloc** i actualitza índexs i mida a l'inode. | **SÍ** |
| **`mmap`** | Consulta l'inode (mida, permisos, blocs) i crea la regió lògica. Els BD no es llegeixen fins al primer accés en memòria (**Page Fault**). | **NO (en fer `mmap`)** |
| **`close`** | Quan `TFO.refs` arriba a 0, allibera TFO i fa `TI.refs--`; si `TI.refs == 0`, actualitza metadades finals de l'inode (no toca `TC/TFO` en `unlink`). | **NO** |
