---
title: "Tema 5: Gestió de Memòria"
description: "Traducció d'adreces, MMU, paginació, memòria dinàmica (sbrk i malloc), mmap, COW i memòria virtual."
readTime: "15 min"
order: 5
draft: false
---

## 5.1 Fonaments i multiprogramació

Per executar un programa, les seves instruccions i dades han de residir a la RAM:
* **Program Counter (PC)**: Registre de la CPU amb l'adreça de la següent instrucció a executar.
* **Instruccions**: Els salts (`jmp`, `call`) i accessos a memòria (`mov`) referencien adreces de destí.

Els sistemes moderns són **multiprogramats** (mantenen diversos processos simultanis a RAM per alternar la CPU sense carregar des de disc a cada canvi de context). Això imposa **3 reptes al SO**:

1. **Protecció**: Cap procés pot accedir a la memòria d'altres processos ni a la del Kernel.
2. **Assignació dinàmica**: El SO ubica el procés a la memòria física lliure disponible (varia a cada execució).
3. **Traducció d'adreces**: Cal traduir les adreces del codi a posicions físiques reals de memòria.

### Adreces Lògiques vs Adreces Físiques

| Concepte | Adreça Lògica o Virtual (@L) | Adreça Física o Real (@F) |
| :--- | :--- | :--- |
| **Definició** | Adreça generada en compilar; és la que referencia la CPU en executar el codi. | Posició real als xips de memòria RAM. |
| **Visibilitat** | La veu el programador, el procés d'usuari i el binari. | Exclusiva del controlador de memòria i el Kernel. |
| **Espai d'adreces** | Rang d'@L permeses per al procés (de `0` al màxim de l'arquitectura). | Rang d'@F reals assignades al procés pel SO. |
| **Assignació** | Es fixa en compilar/enllaçar (s'ajusta en càrrega o execució). | En el moment que el SO assigna memòria física al procés. |

---

## 5.2 Suport maquinari: MMU, Taula de Pàgines i TLB

La traducció d'adreces es fa **en temps d'execució directament pel maquinari (HW)** per no penalitzar la velocitat de la CPU.

### La MMU (*Memory Management Unit*)
Component físic de la CPU situat entre la unitat d'execució i el bus de memòria:

:::mmuviz
:::

1. La CPU emet una **adreça lògica (`@L`)**.
2. La MMU intenta traduir-la a una **adreça física (`@F`)**.
3. **Accés vàlid**: Si l'adreça existeix i té permisos adients (lectura `r`, escriptura `w`, execució `x`), la MMU envia l'`@F` al bus de memòria RAM.
4. **Accés invàlid**: Si l'adreça no pertany al procés o vulnera permisos, la MMU dispara una **excepció de maquinari** (*trap*). El Kernel l'atén (habitualment enviant `SIGSEGV` al procés).

### La Taula de Pàgines (TP)
Estructura de dades del Kernel (una per procés) que descriu la correspondència de memòria:

* L'adreça lògica es divideix en dues parts:
  * **Pàgina ($p$)**: Identificador de la pàgina lògica.
  * **Desplaçament ($d$)**: Posició exacta dins la pàgina (es manté idèntic a l'adreça física).
* Cada entrada (*PTE*) conté:
  * **Bit de presència/validesa**: `1` si la pàgina és a RAM; `0` si és a disc/swap.
  * **Permisos**: Bits de lectura (`r`), escriptura (`w`) i execució (`x`).
  * **Bit de modificació (*dirty bit*)**: La CPU el posa a `1` si s'hi ha escrit.
  * **Marc físic ($f$)**: Número de marc de la RAM on s'allotja.

:::pagetableviz
:::

> **Canvi de context:**  
> L'adreça base de la TP de cada procés es guarda al seu **PCB**. En commutar de procés, el Kernel carrega aquesta adreça base al registre de control de la CPU (`%cr3` a x86). A partir d'aquell cicle, la MMU tradueix segons la TP del nou procés.

### La TLB (*Translation Lookaside Buffer*)
Memòria cau associativa d'alta velocitat a la pròpia CPU per accelerar traduccions:
* **TLB Hit**: La traducció $p \rightarrow f$ és a la TLB; resolució immediata sense accedir a RAM.
* **TLB Miss**: La traducció no hi és; la MMU consulta la TP a RAM, actualitza la TLB i accedeix a la dada.
* **Canvi de context**: La TLB s'invalida perquè pertany a l'espai d'adreces del procés anterior.

:::tlbviz
:::

---

## 5.3 Càrrega d'un executable i anatomia de l'espai lògic

La comanda `exec` (`execlp`, `execv`) llegeix un binari en format **ELF (*Executable and Linkable Format*)** i en construeix l'espai lògic.

### 1. Seccions del fitxer ELF (inspecció amb `objdump -h`)
* **`.text`**: Codi binari executable (`r-x`).
* **`.rodata`**: Constants i cadenes literals (`r--`).
* **`.data`**: Variables globals/estàtiques **inicialitzades** (`rw-`).
* **`.bss`**: Variables globals/estàtiques **sense inicialitzar** (`rw-`). Ocupa 0 bytes en disc; el SO l'omple de zeros en carregar-la.

### 2. Regions de memòria d'un procés

:::memlayoutviz
:::

* **Adreça 0 (NULL)**: Pàgina no assignada intencionadament. Desreferenciar `NULL` dispara un `SIGSEGV` immediat.
* **Stack**: Creix cap a **adreces baixes**.
* **Heap**: Creix cap a **adreces altes**.

### 3. Inspecció real amb `/proc/[PID]/maps`
Podem inspeccionar l'espai d'adreces virtuals de qualsevol procés en temps real consultant el fitxer `maps` dins del pseudo-sistema de fitxers `/proc`:

:::shellviz{command="cat /proc/self/maps" suggestions="cat /proc/self/maps,cat /proc/self/status,cat /proc/self/limits,ls -l /proc/self" title="Terminal — Mapa de memòria virtual del procés (/proc/self/maps)"}
:::

* **Estructura de cada línia**: `[rang d'adreces] [permisos] [offset] [dispositiu] [inode] [camí o etiqueta]`
* **Regions clau identificades al mapa**:
  * **Codi executable (`r-xp`)**: Secció `.text` del binari amb permís d'execució i lectura (sense escriptura per protegir les instruccions).
  * **Constants i literals (`r--p`)**: Secció `.rodata` en mode de només lectura.
  * **Variables globals (`rw-p`)**: Seccions `.data` i `.bss` privades (*Copy-On-Write*).
  * **`[heap]`**: Memòria dinàmica assignada amb `malloc` / `sbrk`. Creix cap a adreces altes ($\uparrow$).
  * **Biblioteques dinàmiques (`libc.so`)**: Mapatge dinàmic de biblioteques compartides a la zona intermèdia (*mmap*).
  * **`[stack]`**: Pila d'execució (variables locals i marcs de crida). Creix cap a adreces baixes ($\downarrow$).
* **Permís `p` (*Private*) vs `s` (*Shared*)**: `rw-p` indica regió privada amb *Copy-On-Write* (COW); `rw-s` indica regió de memòria compartida entre processos.
* **`[vvar]` i `[vdso]`**: Pàgines especials del Kernel mapades directament a l'espai d'usuari per accelerar crides freqüents (com `gettimeofday`) sense el cost d'un canvi de context complet de CPU.

---

## 5.4 Assignació física: Paginació

* **Pàgina**: Bloc lògic de mida fixa potència de 2 (estàndard: **4096 bytes = 4 KB**).
* **Marc (*Frame*)**: Bloc físic a la RAM de la mateixa mida (4 KB).
* **Assignació no contigua**: Les pàgines d'un procés es reparteixen en marcs lliures dispersos; la TP manté la continuïtat lògica.

:::pagingviz
:::

### Fragmentació Interna vs Externa

| Tipus | Què és? | A la Paginació? | Càlcul |
| :--- | :--- | :---: | :--- |
| **Interna** | Memòria assignada però no utilitzada perquè la regió no és múltiple de 4096 B. | **SÍ** | Regió de 2400 B en pàgina de 4096 B $\rightarrow$ malbarata $4096 - 2400 = 1696$ B a l'últim marc. |
| **Externa** | Forats lliures dispersos que no poden satisfer una petició contigua gran. | **NO** | Qualsevol marc lliure de 4 KB serveix per a qualsevol pàgina. |

---

## 5.5 Memòria dinàmica: `sbrk` vs `malloc`

### 1. Crida a sistema: `sbrk()`
Modifica el límit del heap (*break pointer*):

```c
#include <unistd.h>
void *sbrk(intptr_t increment);
```
* `sbrk(0)`: Retorna l'adreça actual del límit del heap.
* `sbrk(N)`: Augmenta el heap en $N$ bytes i retorna l'adreça anterior.
* `sbrk(-N)`: Redueix el heap en $N$ bytes.

:::sbrkviz
:::

> **Granularitat del Kernel:**  
> Encara que demanis `sbrk(100)`, el Kernel assigna marcs físics complets de **4096 bytes**. El límit efectiu a `/proc/[PID]/maps` sempre s'arrodoneix al següent múltiple de pàgina.

### 2. Biblioteca de C: `malloc()` i `free()`
Demanar memòria amb `sbrk()` directament és ineficient (massa crides a sistema i impossibilitat d'alliberar blocs intermedis).

* **Reserva en excés**: `malloc(64)` no demana 64 B al Kernel; demana un bloc gran (ex. 132 KB) via `sbrk` i en gestiona les porcions a l'espai d'usuari per atendre futurs `malloc` ràpidament.
* **Assignació fora del heap**: Per peticions grans (> ~128 KB), `malloc` no toca el heap; utilitza `mmap()`.

### `SIGSEGV`: `sbrk` vs `malloc` fora de rang
* Amb `char *p = sbrk(4096);`, accedir a `p[4100] = 'a';` cau fora de la pàgina assignada $\rightarrow$ la MMU no té traducció $\rightarrow$ **`SIGSEGV`**.
* Amb `char *p = malloc(4096);`, accedir a `p[4100] = 'a';` pot no fallar perquè la biblioteca ha demanat memòria en excés i la posició 4100 és dins d'una pàgina ja vàlida per a la MMU (tot i ser un error greu de codi).

:::mallocviz
:::

---

## 5.6 Mapeig fora del Heap: `mmap` i `munmap`

```c
#include <sys/mman.h>
void *mmap(void *addr, size_t length, int prot, int flags, int fd, off_t offset);
int munmap(void *addr, size_t length);
```

* `addr`: Adreça suggerida (`NULL` perquè el SO triï).
* `prot`: `PROT_READ | PROT_WRITE | PROT_EXEC | PROT_NONE`.
* `flags`: Requereix exactament un d'aquests dos:
  * **`MAP_PRIVATE`**: Canvis privats (via COW). No es modifiquen fitxers ni altres processos els veuen.
  * **`MAP_SHARED`**: Canvis visibles per altres processos i reflectits al fitxer.

:::mmapviz
:::

### Patró 1: Memòria compartida anònima (`MAP_ANONYMOUS`)
Reserva de memòria pura (`fd = -1`, `offset = 0`) compartida entre processos emparentats:

```c
int *comptador = mmap(NULL, sizeof(int), PROT_READ | PROT_WRITE,
                      MAP_SHARED | MAP_ANONYMOUS, -1, 0);

*comptador = 100;
if (fork() == 0) {
    *comptador = 42; // El fill modifica el valor físic compartit
    exit(0);
}
waitpid(-1, NULL, 0);
// El pare llegeix 42: comparteixen el mateix marc físic!
```

### Patró 2: Fitxers mapats en memòria
Permet llegir i escriure fitxers mitjançant punters, sense `read()` ni `write()`:

```c
int fd = open("dades.bin", O_RDWR);
char *dades = mmap(NULL, 4096, PROT_READ | PROT_WRITE, MAP_SHARED, fd, 0);

dades[0] = 'X'; // Modifica el fitxer al disc de forma transparent

munmap(dades, 4096);
close(fd);
```

---

## 5.7 Optimitzacions clau del Sistema Operatiu

### 1. Càrrega sota demanda (*Demand Paging*)
Al fer `exec`, el SO no copia tot el fitxer executable a RAM:
* Crea les regions al PCB i posa les pàgines com a **no residents** (bit de presència a `0`).
* Quan la CPU executa una instrucció d'una pàgina no carregada, la MMU genera una fallada de pàgina.
* El Kernel llegeix del disc exclusivament aquest bloc de 4 KB, l'ubica a un marc lliure i reprèn el procés.
* **Binaris estàtics (`-static`)**: Permet executar programes grans sense carregar codi de biblioteques que mai s'arribi a cridar.

:::demandpagingviz
:::

### 2. Biblioteques dinàmiques compartides (`.so`)

:::sharedlibviz
:::

* El codi (`.text`, `r-x`) de biblioteques comunes com `libc.so` es carrega **un sol cop a RAM**.
* La MMU mapera aquest mateix marc a l'espai d'adreces de tots els processos actius (`MAP_SHARED`).
* Cada procés manté la seva còpia privada de dades (`.data`).

### 3. Copy-On-Write (COW)
Elimina el cost de duplicar tota la memòria física a `fork()`:

1. **A la creació (`fork`)**: Pare i fill comparteixen els mateixos marcs físics a RAM. Totes les entrades a la TP es marquen com a **només lectura (`r--` o `r-x`)**.
2. **A l'escriptura**: Quan un procés intenta escriure (`ret = fork()` a la pila o `*p = 'A'`):
   * La MMU detecta intent d'escriptura no permès i genera una excepció.
   * El Kernel comprova al PCB que el procés té permís d'escriptura (és una regió COW).
   * El Kernel assigna un **nou marc físic de 4 KB**, hi copia el contingut del marc original, actualitza la TP del procés escriptor amb permís `rw-` i reinicia la instrucció.
3. **Pàgines no modificades**: El codi i les dades només llegides queden **compartides indefinidament**.
4. **Mutació amb `execlp()`**: Si el fill muta, el seu espai lògic i físic es destrueix completament i es recrea de zero; deixa de compartir marcs amb el pare.

:::cowviz
:::

---

## 5.8 Memòria Virtual, Fallades de Pàgina i Thrashing

Permet que la suma dels espais lògics dels processos superi la capacitat física de la RAM usant el disc com a magatzem secundari (**àrea de Swap**).

* **Pàgina resident**: Té un marc físic assignat a RAM (bit de presència = 1).
* **Pàgina no resident**: Emmagatzemada al disc o a l'àrea de swap (bit de presència = 0).

### Seqüència d'una fallada de pàgina (*Page Fault*)

:::pagefaultviz
:::

1. La CPU intenta accedir a una adreça lògica amb bit de presència = `0`.
2. La MMU llança una excepció de fallada de pàgina.
3. El Kernel posa el procés a l'estat **`BLOCKED`**.
4. El Kernel cerca un marc lliure a RAM:
   * Si no n'hi ha cap de lliure, l'**algorisme de reemplaçament** (LRU) tria una **pàgina víctima**.
   * Si la víctima s'ha modificat (*dirty bit* = 1), s'escriu al Swap; si no, es descarta. La seva TP passa a presència = `0`.
5. El Kernel llegeix la pàgina requerida des del Swap o executable i la copia al marc lliure.
6. Actualitza la TP del procés (assigna marc i bit de presència = `1`).
7. El procés passa a **`READY`**.
8. En rebre la CPU, la instrucció que havia fallat es **reinicia des del principi** i s'executa amb èxit.

### Sobrepaginació (*Thrashing*)

:::thrashingviz
:::

Es produeix quan la suma dels conjunts de treball (*working sets*, mínim de pàgines que cada procés necessita actives) supera la memòria física disponible:
* Els processos es prenen marcs contínuament els uns als altres.
* La CPU passa el 99% del temps esperant transferències d'E/S amb el Swap, i el rendiment cau a zero.
* **Solució del SO**: Redueix el grau de multiprogramació expulsant processos sencers al Swap (**estat *swapped-out***) fins que els restants acaben la seva feina.
