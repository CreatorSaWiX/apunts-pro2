---
title: "Tema 3: Processos"
description: "Processos"
readTime: "25 min"
order: 3
draft: false
---

## 3.1 Què és un Procés?

Quan fas doble clic a un programa o l'executes a la terminal, el sistema operatiu crea un procés (un programa en marxa a la memòria). Cada procés té un identificador únic (un DNI o número enter) anomenat PID (Process Identifier).

:::procoverviewviz
:::

### 1. Identitat, Entorn i Context
Cada procés en execució compta amb:
* **Identificadors únics**:
  * **PID (*Process ID*)**: El DNI únic del procés al sistema. Es consulta en C amb la crida `getpid()` (`man 2 getpid`).
  * **PPID (*Parent PID*)**: El PID del procés pare que el va crear. Es consulta en C amb la crida `getppid()` (`man 2 getppid`).
* **Credencials d'accés**: `UID` (usuari) i `GID` (grup), que controlen quins fitxers té permís per llegir/escriure i a quins altres processos pot enviar senyals.
* **Entorn**: Els arguments que li passem en obrir-lo (`argv`) i les variables d'entorn del sistema (`HOME`, `PATH`...).
* **Context d'execució**: Tot el que reflecteix com està funcionant en aquest mateix instant: els valors dels registres de la CPU, per quina línia de codi va (*Program Counter*) i el seu espai de memòria RAM.

### 2. Inspecció de processos des de la terminal
Podem consultar la identitat i l'estat dels processos actius amb comandes estàndard de Linux:

:::shellviz{command="ps -ef" suggestions="ps -ef,ps -l,pstree,man ps" title="Terminal — Consultar els processos en marxa (PID, PPID i arbre jeràrquic)"}
:::

* **`ps -ef`** o **`ps aux`**: Mostra la llista completa de processos en marxa, indicant l'usuari (`UID`), el `PID`, el `PPID`, el consum de recursos i l'ordre d'execució.
* **`pstree`**: Dibuixa l'arbre jeràrquic de processos del sistema (on es veu com el procés `systemd` o `init` amb PID 1 és l'arrel de tots els processos).


### 3. El PCB (*Process Control Block*)
El **PCB** és la **fitxa d'identitat** que el nucli del sistema operatiu (*Kernel*) guarda a la seva pròpia memòria per a cada programa en marxa. Quan un procés deixa d'executar-se a la CPU per deixar pas a un altre, el Kernel guarda tot el que estava fent dins d'aquesta fitxa:

* **Identificació**: PID, PPID i credencials d'usuari/grup.
* **Estat**: Què està fent en aquest instant (executant-se, a punt a la cua, adormit o mort).
* **Context de la CPU (Registres)**: Els valors dels registres generals, el punter de la pila (*Stack Pointer*) i el *Program Counter* (la línia de codi exacta per on anava) quan se li retira la CPU.
* **Espai de memòria**: Rangs de memòria RAM assignats (segment de codi/text, variables globals, heap i pila).
* **Fitxers oberts**: La taula de descriptors de fitxer (`fd = 0` per teclat, `fd = 1` per pantalla, `fd = 2` per errors, fitxers de disc o canonades).
* **Estructures de senyals (*Signals*)**: Taula d'accions, bitmap de pendents, màscara de bloqueig i alarma (estudiat a fons al [Tema 4: Signals](./so-tema-4)).
* **Comptadors de temps (*Accounting*)**: Quant de temps de processador ha gastat i estadístiques d'ús de recursos.

:::shellviz{command="cat /proc/self/status" suggestions="cat /proc/self/status,ls /proc,ls -l /proc/self,ls -l /proc/self/fd" title="Terminal — Radiografia del PCB al Kernel (/proc i /proc/self)"}
:::

---

## 3.2 Cicle de vida d'un procés i crides

Un procés no està sempre treballant a la CPU: al llarg de la seva vida va transitant per diferents estats. Aquest cicle es governa mitjançant el planificador del Kernel i les crides al sistema que invoquem al nostre codi:

:::processviz
:::

| Crida | Secció `man` | Retorn | Què fa exactament? |
| :--- | :---: | :--- | :--- |
| **`fork()`** | `man 2` | `0` al fill, `PID_fill` al pare, `-1` si error | Clona el procés creant-ne un de nou (neix a READY i passa a RUN). |
| **`execlp(file, a0, ...)`** | `man 3` | Només retorna si falla (`-1`) | Muta el procés: esborra el seu codi i hi carrega un programa nou (manté el mateix PID). |
| **`exit(status)`** | `man 3` | Mai retorna | Finalitza el procés, allibera la seva memòria RAM i el deixa en estat ZOMBIE. |
| **`waitpid(pid, &st, opts)`**| `man 2` | PID del fill recollit | Atura el pare fins que el fill mor i allibera la seva fitxa (PCB) del Kernel. |

---

### 1. Com neix un procés: Clonació amb `fork()` (READY $\rightarrow$ RUN)
Quan un procés crida `fork()`, el Kernel fa una **còpia exacta** del procés creador (procés pare). El nou procés (fill) neix a l'estat **READY** esperant el seu torn de CPU per passar a **RUN**:

:::forkviz
:::

```c
int g = 10;
int main() {
    int l = 5;
    int pid = fork();
    if (pid == 0) {
        // Codi exclusiu del fill: té la seva pròpia còpia a la seva memòria!
        g++; l += 2;
        exit(0);
    }
    waitpid(pid, NULL, 0);
    // Codi del pare: les seves variables NO han canviat! g = 10 i l = 5.
    return 0;
}
```

| S'hereta (Còpia idèntica) | NO s'hereta (Valor nou / Reinicialitzat) |
| :--- | :--- |
| **Variables i memòria RAM** (còpia privada independent) | **PID** (identificador únic nou per al fill) |
| **Fitxers oberts** (descriptors `fd` 0, 1, 2, canonades i offsets) | **PPID** (rep el PID del procés pare) |
| **Taula d'accions de senyals** (funcions/handlers definits) | **Senyals pendents** (neix net, sense senyals acumulats) |
| **Màscara de bloqueig** (senyals retinguts temporalment) | **Temporitzador d'alarma** (rellotge intern desactivat) |
| **Credencials i entorn** (`UID`, `GID` i variables `environ`) | **Temps d'execució** (comptadors de CPU reiniciats a 0) |

* **Si els fills NO fan `exit()`**: Cada iteració duplica tots els processos que hi ha vius en aquell moment:
  ```c
  for (int i = 0; i < N; i++) fork();
  ```
  * Processos totals: **$2^N$**. Per exemple, per $N = 3 \rightarrow 2^3 = 8$ processos.
  * Fills nous creats: **$2^N - 1$** ($8 - 1 = 7$).
* **Si els fills fan `exit(0)`**: Només el pare continua donant voltes al bucle:
  ```c
  for (int i = 0; i < N; i++) {
      if (fork() == 0) {
          ferFeina();
          exit(0); // El fill mor aquí i no fa més forks!
      }
  }
  ```
  * Es creen exactament **$N$ fills** en ventall (total: **$N + 1$ processos**).

---

### 2. Com muta un procés: substitució de programa amb `execlp()`

`execlp()` no crea cap procés: buida la memòria del procés actual i hi carrega un binari nou des del seu `main`. Manté el mateix PID.

:::execviz
:::

```c
// Format: execlp(programa, arg0, arg1, ..., (char *)NULL);
execlp("ls", "ls", "-l", (char *)NULL);

// Nomes s'executa si execlp falla (ex: comanda inexistent):
perror("Error a execlp");
exit(1);
```

* **`"ls"` (programa)**: La `p` indica que el busca automàticament al `PATH`.
* **`"ls"` (`arg0`)**: Convé repetir el nom del programa (`argv[0]`).
* **`"-l"` (`arg1...`)**: Arguments de la comanda.
* **`(char *)NULL`**: Centinella obligatori per indicar el final dels arguments.

Què canvia i què es manté a `execlp()`:

| Es manté (Sense canvis) | Canvia (Substituït / Reinicialitzat) |
| :--- | :--- |
| **PID i PPID** (és el mateix procés) | **Memòria RAM** (es buida i s'hi carrega el nou binari) |
| **Descriptors de fitxer** (`fd` i canonades obertes) | **Registres de CPU** (arranquen al `main` del nou codi) |
| **Màscara de senyals bloquejats** | **Taula de senyals** (les funcions d'usuari es restableixen a l'acció per defecte) |
| **Senyals pendents** | **Pila i memòria dinàmica** (es reinicien amb els nous arguments) |

---

### 3. Com s'adorm un procés (RUN $\rightarrow$ BLOCKED)
L'estat **BLOCKED (Bloquejat / Adormit)** es produeix quan un procés no pot continuar la seva execució perquè està esperant una acció externa. **Mentre està bloquejat no gasta gens de CPU.**

:::blockedviz
:::

Crides a sistema que fan passar de RUN a BLOCKED:
* `waitpid(pid, &st, 0)`: si el procés fill encara està en execució, el pare s'atura a esperar que acabi.
* `read(0, buf, size)`: si espera que l'usuari escrigui pel teclat i encara no hi ha dades.

---

### 4. Com mor i com es recull: `exit()`, estat ZOMBIE i `waitpid()`
Quan un procés acaba amb `exit(status)` o fent `return` des del `main`:
1. El sistema allibera tota la seva memòria RAM i tanca els seus fitxers oberts.
2. El procés passa a l'estat **ZOMBIE (pendent de recollir)**: la seva fitxa (PCB) continua al Kernel guardant com ha mort (el codi de sortida) fins que el seu pare ho consulti amb `waitpid()`.

:::zombieviz
:::

### Sincronització amb `waitpid()` i diagnòstic de mort
El pare utilitza `waitpid()` per esperar que un fill acabi, recollir com ha mort a la variable `status` i **eliminar definitivament el seu PCB del Kernel**:

```c
int status;
int pid_fill = waitpid(pid, &status, opcions);
```

* **`pid`**: PID concret del fill a esperar, o `-1` per esperar qualsevol fill que acabi primer.
* **`&status`**: Punter a un enter on el Kernel escriu codificada la causa de la mort.
* **`opcions`**: `0` per esperar bloquejat, o `WNOHANG` per no bloquejar-se (si no hi ha cap fill mort, retorna `0` immediatament).

L'enter `status` conté informació empaquetada en diferents bits. S'utilitzen aquestes macros per inspeccionar-lo:

| Macro | Què comprova o extreu? |
| :--- | :--- |
| **`WIFEXITED(status)`** | Retorna cert si el fill ha acabat voluntàriament (`exit()` o `return`). |
| **`WEXITSTATUS(status)`** | Si ha acabat amb `exit()`, n'obté el codi de sortida (ex: `0`, `1`...). |
| **`WIFSIGNALED(status)`** | Retorna cert si el fill ha mort sobtadament a causa d'un senyal no capturat. |
| **`WTERMSIG(status)`** | Si ha mort per un senyal, n'obté el número del senyal causant. |

Exemple pràctic de diagnòstic:

```c
#include <sys/wait.h>

int status;
int pid_fill = waitpid(-1, &status, 0); // Espera que acabi qualsevol fill

if (WIFEXITED(status)) {
    int codi = WEXITSTATUS(status);
    sprintf(buf, "Fill %d ha acabat be amb codi %d\n", pid_fill, codi);
    write(1, buf, strlen(buf));
} else if (WIFSIGNALED(status)) {
    int senyal = WTERMSIG(status);
    sprintf(buf, "Fill %d ha mort pel senyal %d\n", pid_fill, senyal);
    write(1, buf, strlen(buf));
}
```

:::oopviz{simulation="waitpid_diagnosi"}
:::

### Què passa si un procés queda orfe? Pot quedar Zombie per sempre? 
**NO**. A Linux, quan un pare mor, els fills orfes són adoptats automàticament pel procés `init` (PID 1) o `systemd`. Aquest procés s'encarrega d'anar fent `waitpid()` periòdicament de tots els fills adoptats, netejant els seus PCBs tan bon punt moren.

---

### 5. Com es congela un procés: estat STOPPED
L'estat **STOPPED (Pausat / Congelat)** es produeix quan un procés s'atura expressament:
* Des de la terminal: prement **`Ctrl+Z`** o executant `kill -STOP <PID>`.
* Des de codi C: enviant `kill(pid, SIGSTOP)`.
* **Com es desperta?**: El procés queda immòbil sense gastar CPU fins que algú li enviï un senyal de continuació: `kill -CONT <PID>` o cridant `kill(pid, SIGCONT)`.

:::stoppedviz
:::

---

## 3.3 Seqüencial vs concurrent

Combinant `fork()` i `waitpid()` podem estructurar l'execució de múltiples processos de dues formes fonamentals:

```c
// 1. ESQUEMA SEQÜENCIAL: Un darrere l'altre
// El pare crea un fill i s'espera que acabi ABANS de crear el següent
for (int i = 0; i < N; i++) {
    if ((pid = fork()) == 0) {
        ferFeina(i);
        exit(0);
    }
    waitpid(pid, NULL, 0); // Espera DINS del bucle!
}
```

```c
// 2. ESQUEMA CONCURRENT: Tots alhora
// El pare crea tots els fills de cop i després els recull al final
for (int i = 0; i < N; i++) {
    if ((pid = fork()) == 0) {
        ferFeina(i);
        exit(0);
    }
    // NO espera aquí! Continua creant fills en paral·lel
}
// Ara que tots estan treballant alhora, el pare els espera a tots:
while (waitpid(-1, NULL, 0) > 0);
```

### Com executa les comandes el Shell: Primer pla vs Segon pla (`&`)

Quan escrius una comanda al terminal, el Shell (`bash`, `zsh`) fa internament un bucle amb `fork()`, `exec()` i `waitpid()`:

```c
while (1) {
    comanda = llegir_comanda();
    int pid = fork();
    if (pid == 0) {
        execlp(comanda, comanda, ..., NULL); // Executa el programa
    }
    // Si és en PRIMER PLA:
    waitpid(pid, &status, 0); // El Shell es bloqueja fins que el programa acabi
}
```

* **Primer pla (*Foreground*, `./programa`)**: El Shell es bloqueja a l'espera que el procés fill acabi amb `waitpid()`. Com que el Shell està adormit, el teclat queda pres pel programa i no pots introduir noves comandes. Per això, si el programa triga o s'adorm, cal obrir una altra pestanya o finestra de terminal per enviar-li senyals o consultar `ps`.
* **Segon pla (*Background*, `./programa &`)**: Afegint un ampersand `&` al final, el Shell llança el procés fill però **no fa `waitpid()` bloquejant** d'immediat. Et torna el control del teclat a l'instant mostrant el número de feina i el PID (ex: `[1] 20226`), permetent-te continuar executant altres comandes a la mateixa terminal mentre el programa corre de fons.

---

## 3.4 Canvi de context i planificació (*scheduling*)

Com aconsegueix el sistema operatiu que desenes de processos funcionin alhora en una mateixa CPU?

### 1. El canvi de context (*context switch*)

:::contextswitchviz
:::

Quan la CPU deixa d'executar el procés A per posar-se a executar el procés B, s'executa un **canvi de context**:
1. La CPU salta a **mode Kernel** a causa d'una interrupció de rellotge o d'una crida al sistema bloquejant.
2. El Kernel copia tots els registres de la CPU del procés A a la seva fitxa (`PCB[A]`).
3. El Kernel actualitza l'estat de A (el posa a `READY` o a `BLOCKED`).
4. El **planificador (*scheduler*)** tria quin serà el següent procés a executar (per exemple, B).
5. El Kernel commuta l'espai de memòria activa cap al de B i carrega els registres des de `PCB[B]` a la CPU física.
6. La CPU torna a **mode usuari** i reprèn el procés B exactament on s'havia quedat.

Durant el canvi de context, la CPU només desa i carrega estructures internes del Kernel; **cap procés d'usuari està avançant la seva feina**. És una despesa inevitable de gestió del sistema que cal minimitzar.

### 2. Planificació de la CPU (*scheduling*)

:::schedulerviz
:::

El **planificador (*scheduler*)** és la part del Kernel que decideix qui agafa la CPU, en quin ordre i durant quant de temps:

* **Temps de tornada (*Turnaround Time*)**: El temps total que passa des que un programa s'obre fins que acaba del tot (inclou el temps que està corrent, el que passa esperant a la cua i el que està bloquejat).
* **Temps d'espera (*Waiting Time*)**: El temps total que el procés es passa avorrit fent cua a l'estat `READY` esperant que li toqui el torn de CPU.
* **Planificació no apropiativa (*Non-preemptive* / Cooperativa)**: El sistema és "educat": un cop un programa entra a la CPU, **ningú no li pot treure**. Només marxa si acaba voluntàriament (`exit`) o si s'adorm per fer una lectura (`read`).
* **Planificació aropiativa (*Preemptive*)**: El sistema té autoritat: si s'acaba el seu temps de torn o arriba un procés més important, el Kernel li treu la CPU per la força.

### 3. Algorismes de planificació clau

### Round Robin (RR)

:::roundrobinviz
:::

Funciona com un torn de paraula en cercle:
* Cada procés té dret a utilitzar la CPU durant un temps màxim anomenat **quàntum ($Q$)**, per exemple 10 mil·lisegons.
* Si el procés esgota els 10 ms i encara no ha acabat, la interrupció de rellotge el treu de la CPU i el posa a la cua de `READY`.
* **Mida del quàntum**:
  * Si el quàntum és **gegant**: es converteix en un ordre per ordre d'arribada (*First-Come First-Served*, FCFS).
  * Si el quàntum és **massa petit** (p. ex. 0,1 ms): la CPU es passa més temps fent canvis de context que executant programes útils.
* Què passa si un procés es bloqueja abans d'esgotar els 10 ms? 
  Allibera la CPU immediatament (passa a `BLOCKED`) i **el planificador avança el torn al següent procés a l'instant**, sense haver d'esperar que passin els 10 ms.

### Completely Fair Scheduler (CFS de Linux)

:::cfsviz
:::

És el planificador real de Linux:
* Busca que tots els programes rebin una part justa del temps de CPU.
* Porta un comptador per a cada procés anomenat **temps virtual d'execució (`vruntime`)**. Com menys CPU ha gastat un programa fins ara, més prioritat té per entrar a la CPU.
* Gràcies a això, els programes interactius (com el ratolí, el teclat o l'editor de text, que passen gairebé tot el temps adormits a `BLOCKED`) entren a la CPU de manera immediata en quant l'usuari toca una tecla, donant una resposta instantània.

### Resum ràpid: com canvia d'estat un procés?

| Transició | De $\rightarrow$ A | Causa principal |
| :--- | :---: | :--- |
| **Creació** | `Nou` $\rightarrow$ `READY` | El pare crida **`fork()`**. |
| **Assignació CPU** | `READY` $\rightarrow$ `RUN` | El planificador li dona el torn de CPU. |
| **Fi de torn** | `RUN` $\rightarrow$ `READY` | S'esgota el temps de CPU (**quàntum**). |
| **Espera externa** | `RUN` $\rightarrow$ `BLOCKED` | Crida bloquejant: esperar fill (**`waitpid`**) o dades (**`read`**). |
| **Esdeveniment llest** | `BLOCKED` $\rightarrow$ `READY` | Arriben les dades o mor el fill esperat. |
| **Finalització** | `RUN` $\rightarrow$ `ZOMBIE` | El procés acaba (**`exit()`**); manté PCB fins que el pare faci `waitpid`. |
| **Alliberament** | `ZOMBIE` $\rightarrow$ `Eliminat` | El pare el recull amb **`waitpid()`** i el Kernel esborra el seu PCB. |
