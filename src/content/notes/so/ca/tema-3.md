---
title: "Tema 3: Processos i signals"
description: "PCB, graf d'estats, canvi de context, planificació (RR i CFS), fork, exec, waitpid i gestió avançada de senyals."
readTime: "25 min"
order: 3
draft: false
---

## 3.1 Què és un Procés?

Un **procés** és un programa en marxa. Un fitxer com `programa.exe` guardat al disc és com una recepta de cuina escrita en un paper; el procés és el cuiner executant la recepta a la cuina real (utilitzant la CPU i la memòria RAM).

Cada procés té:
1. **Identitat**:
   * **PID (*Process ID*)**: El DNI únic del procés al sistema.
   * **PPID (*Parent PID*)**: El PID del procés pare que el va crear.
   * **Credencials**: `UID` (usuari) i `GID` (grup), que controlen quins fitxers pot tocar i a quins altres processos pot enviar senyals.
2. **Entorn**: Els arguments que li passem en obrir-lo (`argv`) i les variables d'entorn (`HOME`, `PATH`...).
3. **Context**: Tot el que defineix com està funcionant en aquest moment (els valors dels registres de la CPU, per quina línia de codi va i la seva memòria RAM).

---

## 3.2 El PCB (*Process Control Block*): la fitxa del procés

El **PCB** és la **fitxa d'identitat** que el nucli del sistema operatiu (*Kernel*) guarda a la seva memòria per a cada programa en marxa.

Quan un procés deixa d'executar-se a la CPU per deixar pas a un altre, el Kernel guarda tot el que estava fent dins d'aquesta fitxa:

* **Identificació**: El seu PID, el del pare (PPID) i a quin usuari pertany.
* **Estat**: Què està fent en aquest instant (executant-se, fent cua, adormit o mort).
* **Context de la CPU (Registres)**: On es guarden els valors dels registres generals, el punter de la pila i el *Program Counter* (la línia de codi exacta per on anava) quan se li retira la CPU.
* **Espai de memòria**: Quines zones de la memòria RAM té assignades (on és el seu codi, les seves variables i la seva pila).
* **Fitxers oberts**: La llista de canals que està utilitzant (`fd = 0` per teclat, `fd = 1` per pantalla, fitxers de disc o canonades).
* **Estructures de senyals (*Signals*)**:
  1. *Taula d'accions*: quina funció ha d'executar si rep cada senyal.
  2. *Bitmap de pendents*: una llista de bits per recordar quins senyals han arribat però encara no s'han tractat.
  3. *Màscara de bloqueig*: quins senyals té retinguts temporalment.
  4. *Temporitzador d'alarma*: quants segons li queden per rebre l'alarma.
* **Comptadors de temps (*Accounting*)**: Quant de temps de processador ha gastat.

---

## 3.3 El cicle de vida d'un procés: graf d'estats

Un procés va passant per diferents estats durant la seva vida:

:::processviz
:::


### Els 5 estats explicats de forma senzilla
* **RUN**: Està executant-se a la CPU en aquest mateix instant.
* **READY (A punt / Preparat)**: Té tot el que necessita per treballar a la RAM, només està esperant a la cua que el processador quedi lliure per tenir el seu torn.
* **BLOCKED (Bloquejat / Adormit)**: No pot continuar perquè està esperant una acció externa (que l'usuari teclegi alguna cosa a `read`, que un fill acabi a `waitpid`, o que arribi un senyal a `sigsuspend`). **Mentre està bloquejat no gasta gens de CPU.**
* **ZOMBIE (Mort pendent de recollir)**: El procés ja ha acabat amb `exit()`. Tota la seva memòria RAM i els seus fitxers ja s'han alliberat, però el seu PCB (la fitxa) continua al Kernel guardant com ha mort fins que el seu pare ho pregunti amb `waitpid()`.
* **STOPPED (Pausat / Congelat)**: S'ha congelat amb un senyal `SIGSTOP` o prement `Ctrl+Z`. Es queda completament immòbil fins que algú li enviï un senyal `SIGCONT`.

### Preguntes clau d'examen sobre estats
* **Quines crides a sistema fan passar un procés de RUN a BLOCKED?**
  1. `waitpid(pid, &st, 0)`: si el fill encara està viu (i no hem posat l'opció `WNOHANG`).
  2. `sigsuspend(&mask)`: si no hi ha cap senyal pendent desbloquejat.
  3. `read(0, buf, size)`: si estem llegint del teclat o d'una canonada buida i no hi ha dades disponibles.
  4. `open("fifo", O_WRONLY)`: si intentem obrir una canonada amb nom i a l'altre extrem encara no hi ha cap lector.
* **Què passa si un procés queda orfe (el pare mor abans)? Pot quedar Zombie per sempre?**  
  **NO**. A Linux, quan un pare mor, els fills orfes són adoptats automàticament pel procés `init` (PID 1) o `systemd`. Aquest procés s'encarrega d'anar fent `waitpid()` periòdicament de tots els fills adoptats, netejant els seus PCBs tan bon punt moren.

---

## 3.4 El canvi de context (*context switch*)

Quan la CPU deixa d'executar el procés A per posar-se a executar el procés B, s'executa un **canvi de context**:
1. La CPU salta a mode Kernel a causa d'una interrupció de rellotge o d'una crida bloquejant.
2. El Kernel copia tots els registres de la CPU del procés A a la fitxa de A (`PCB[A]`).
3. El Kernel canvia l'estat de A (el posa a READY o a BLOCKED).
4. El **planificador** tria quin serà el següent procés (per exemple, B).
5. El Kernel canvia la memòria activa cap a la de B i copia els registres des de `PCB[B]` cap a la CPU física.
6. La CPU torna a mode usuari i reprèn el procés B exactament on s'havia quedat.

> **Què és l'overhead del canvi de context?**  
> Durant el temps que dura el canvi de context, la CPU només està guardant i carregant dades del Kernel; **cap dels nostres programes no està avançant la seva feina**. Per tant, és un temps perdut necessari que cal fer tan ràpid com sigui possible.

---

## 3.5 Planificació de la CPU (*scheduling*)

El **planificador (*scheduler*)** és la part del Kernel que decideix qui agafa la CPU, en quin ordre i durant quant de temps.

### Conceptes que pregunten a l'examen
* **Temps de tornada (*Turnaround Time*)**: El temps total que passa des que un programa s'obre fins que acaba del tot (inclou el temps que està corrent, el que passa esperant a la cua i el que està bloquejat).
* **Temps d'espera (*Waiting Time*)**: El temps total que el procés es passa avorrit fent cua a l'estat READY esperant que li toqui el torn de CPU.
* **Planificació No Apropiativa (*Non-preemptive*)**: El sistema és "educat": un cop un programa entra a la CPU, **ningú no li pot treure**. Només marxa si acaba voluntàriament (`exit`) o si s'adorm per fer una lectura (`read`).
* **Planificació Apropiativa (*Preemptive*)**: El sistema té autoritat: si s'acaba el seu temps de torn o arriba un procés més important, el Kernel li treu la CPU per la força.

### Algorisme Round Robin (RR)
Funciona com un torn de paraula en cercle:
* Cada procés té dret a utilitzar la CPU durant un temps màxim anomenat **quàntum ($Q$)**, per exemple 10 mil·lisegons.
* Si el procés esgota els 10 ms i encara no ha acabat, la interrupció de rellotge el treu de la CPU i el posa a la cua de READY.
* **Pregunta d'examen: Què passa si un procés es bloqueja abans d'esgotar els 10 ms?**  
  Allibera la CPU immediatament (passa a BLOCKED) i **el planificador avança el torn al següent procés a l'instant**, sense haver d'esperar que passin els 10 ms.
* **Mida del quàntum**:
  * Si el quàntum és **gegant**: es converteix en un ordre per ordre d'arribada (ningú és expulsat).
  * Si el quàntum és **massa petit** (p. ex. 0,1 ms): la CPU es passa més temps fent canvis de context que executant programes útils.

### Completely Fair Scheduler (CFS de Linux)
És el planificador real de Linux:
* Busca que tots els programes rebin una part justa del temps de CPU.
* Porta un comptador per a cada procés anomenat **temps virtual d'execució (`vruntime`)**. Com menys CPU ha gastat un programa fins ara, més prioritat té per entrar a la CPU.
* Gràcies a això, els programes interactius (com el ratolí, el teclat o l'editor de text, que passen gairebé tot el temps adormits a BLOCKED) entren a la CPU de manera immediata en quant l'usuari toca una tecla, donant una resposta instantània.

---

## 3.6 Crides a sistema de processos

| Crida | Secció `man` | Retorn | Què fa exactament? |
| :--- | :---: | :--- | :--- |
| **`fork()`** | `man 2` | `0` al fill, `PID_fill` al pare, `-1` si error | Clona el procés. Crea un procés fill idèntic en un espai de memòria nou. |
| **`getpid()`** | `man 2` | El PID del procés | Retorna el DNI del procés que fa la crida. |
| **`getppid()`** | `man 2` | El PID del pare | Retorna el DNI del pare del procés. |
| **`exit(status)`** | `man 3` | Mai retorna | Tanca el procés, allibera la seva memòria RAM i el deixa en estat ZOMBIE. |
| **`waitpid(pid, &st, opts)`**| `man 2` | PID del fill recollit | Atura el pare fins que el fill mor i allibera la seva fitxa (PCB) del Kernel. |
| **`execlp(file, a0, ...)`** | `man 3` | Només retorna si falla (`-1`) | Muta el procés: esborra el seu codi i hi carrega un programa nou. Manté el mateix PID. |

---

## 3.7 La crida `fork()`: clonació i herència

Quan crides `fork()`, el Kernel fa una còpia exacta del procés:

```c
int g = 10;
int main() {
    int l = 5;
    int pid = fork();
    if (pid == 0) {
        g++; l += 2; // El fill canvia la seva pròpia còpia a la seva memòria!
        exit(0);
    }
    waitpid(pid, NULL, 0);
    // Pare: les seves variables NO han canviat! g = 10 i l = 5.
    return 0;
}
```

### Què s'hereta i què NO s'hereta a `fork()`? (Clau d'examen)
* **S'HERETA (Còpia idèntica)**:
  * Les variables i la memòria (cada procés té la seva còpia privada).
  * La taula de senyals (si el pare tenia una funció per atendre un senyal, el fill la manté).
  * La màscara de senyals bloquejats.
  * Els fitxers i canals oberts (`fd` 0, 1, 2, canonades).
  * L'usuari, grup i variables d'entorn.
* **NO S'HERETA (Valors nous i propis del fill)**:
  * El seu **PID** (té un identificador nou propi).
  * El seu **PPID** (rep el PID del seu pare).
  * El temps de CPU gastat (comença de zero).
  * **Els senyals pendents** (el fill neix net, sense senyals acumulats).
  * **L'alarma** (el temporitzador de l'alarma del fill està desactivat).

### Càlcul de processos en bucles de `fork()`
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

## 3.8 Mutació de procés amb `execlp()`

`execlp()` no crea cap procés nou. El procés que el crida **es transforma completament** en un altre programa:

```c
execlp("ls", "ls", "-l", (char *)NULL);
error_y_exit("Aixo nomes s'executa si execlp ha fallat!", 1);
```

### Què canvia i què es manté a `execlp()`?
* **Canvia**:
  * Tota la memòria del procés (es buida i s'hi carrega el nou binari; el programa comença des del `main`).
  * **La taula de senyals es restableix a l'acció per defecte (`SIG_DFL`)** per a tots els senyals que tenien una funció d'usuari (perquè la funció d'usuari del programa antic ja no existeix a la memòria nova). Els senyals configurats per ignorar-se (`SIG_IGN`) es mantenen ignorats.
* **Es manté**:
  * El mateix **PID** i el mateix **PPID**.
  * Els fitxers oberts.
  * La màscara de senyals bloquejats.
  * **La llista de senyals pendents** (si tenia un senyal esperant, continua esperant).

---

## 3.9 Sincronització amb `waitpid()` i diagnòstic de mort

El pare utilitza `waitpid()` per esperar que un fill acabi i saber per què ha mort:

```c
#include <sys/wait.h>

int status;
int pid_fill = waitpid(-1, &status, 0); // Espera que acabi qualsevol fill

if (WIFEXITED(status)) {
    // Ha mort de forma normal amb exit() o return de main
    int codi = WEXITSTATUS(status);
    sprintf(buf, "Fill %d ha acabat be amb codi %d\n", pid_fill, codi);
    write(1, buf, strlen(buf));
} else if (WIFSIGNALED(status)) {
    // Ha mort de cop a causa d'un senyal que ningun ha capturat (ex: SIGKILL o SIGSEGV)
    int senyal = WTERMSIG(status);
    sprintf(buf, "Fill %d ha mort pel senyal %d\n", pid_fill, senyal);
    write(1, buf, strlen(buf));
}
```

* `waitpid(-1, &status, 0)`: es queda **bloquejat** esperant que mori algun fill.
* `waitpid(-1, &status, WNOHANG)`: **no es bloqueja**. Si hi ha un fill mort en recull el cadàver i retorna el seu PID; si tots els fills continuen vius, retorna `0` a l'instant; si no queden fills, retorna `-1`.

---

## 3.10 Esquemes de programació: seqüencial vs concurrent

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

// 2. ESQUEMA CONCURRENT: Tots alhora
// El pare crea tots els fills de cop i després els recull al final
for (int i = 0; i < N; i++) {
    if ((pid = fork()) == 0) {
        ferFeina(i);
        exit(0);
    }
    // NO espera aquí! Continua creant fills
}
// Ara que tots estan treballant alhora, el pare els espera a tots:
while (waitpid(-1, NULL, 0) > 0);
```

---

## 3.11 El sistema de senyals (signals) a Linux

Un **senyal (*signal*)** és una notificació asíncrona per programari que el sistema operatiu o un altre procés envia a un programa per avisar-lo que ha passat un esdeveniment.

### Taula de senyals que entren a examen
| Senyal | Codi | Què fa per defecte? | Què el provoca? | Es pot capturar o bloquejar? |
| :--- | :---: | :---: | :--- | :---: |
| **`SIGINT`** | 2 | Acaba el programa | Prems `Ctrl+C` a la terminal. | Sí |
| **`SIGKILL`** | 9 | Acaba el programa immediatament | Ordre de matar el procés. |  **MAI** (imparable) |
| **`SIGSTOP`** | 19 | Congela el procés (STOPPED) | Ordre de pausar el procés. |  **MAI** (imparable) |
| **`SIGCONT`** | 18 | Descongela el procés | Reactiva un procés pausat per `SIGSTOP`. | Sí |
| **`SIGALRM`** | 14 | Acaba el programa | S'ha acabat el temporitzador de la crida `alarm()`. | Sí |
| **`SIGCHLD`** | 17 | **Ignorar (no fa res)** | Un procés fill ha acabat o s'ha aturat. | Sí |
| **`SIGSEGV`** | 11 | Acaba el programa (*Dump*) | Has intentat tocar memòria prohibida (punter nul). | Sí |
| **`SIGUSR1`** | 10 | Acaba el programa | Senyal lliure perquè el programador el faci servir per al que vulgui. | Sí |
| **`SIGUSR2`** | 12 | Acaba el programa | Segon senyal lliure per al programador. | Sí |

---

## 3.12 Les 4 estructures de senyals a la fitxa del procés (PCB)

Dins del PCB de cada procés hi ha 4 coses que controlen els senyals:

1. **Taula d'Accions (Vector de captura)**: Una taula on per a cada senyal diu què cal fer:
   * `SIG_DFL`: Fer l'acció per defecte de Linux (acabar el programa, congelar-lo o ignorar-lo).
   * `SIG_IGN`: Ignorar el senyal completament (llençar-lo a la paperera).
   * Funció pròpia: Cridar la nostra funció en C `void la_meva_funcio(int s)`.
2. **Bitmap de Senyals Pendents**:
   * És una tira de bits on cada posició representa un senyal (0 si no hi és, 1 si ha arribat).
   * **Molt important per a l'examen**: **No és un comptador**. Si un procés té un senyal bloquejat i en rep 5 del mateix tipus, el bit es posa a 1 el primer cop i els altres 4 **es perden**. Quan es desbloquegi, la teva funció només s'executarà **una sola vegada**.
3. **Màscara de Senyals Bloquejats**: Una llista de senyals que el procés té "retinguts". Si arriba un senyal d'aquesta llista, no s'executa la seva funció sinó que es queda guardat al bitmap de pendents fins que el desbloquegem.
4. **Temporitzador d'Alarma**: Només hi ha **una alarma per procés**. Si fas `alarm(10)` i després `alarm(2)`, la primera s'esborra i queda només la de 2 segons.

---

## 3.13 Crides a sistema de senyals

### 1. Enviar un senyal: `kill(pid, senyal)`
```c
kill(pid_desti, SIGUSR1);
```
* Des de la terminal: `kill -SIGUSR1 1234` o `kill -9 1234` (per matar amb `SIGKILL`).

### 2. Canviar què fa un senyal: `sigaction()`
```c
struct sigaction tractament;
tractament.sa_handler = la_meva_funcio; // La funció que volem que s'executi
sigemptyset(&tractament.sa_mask);        // Senyals que volem bloquejar mentre s'executa la funció
tractament.sa_flags = 0;

sigaction(SIGUSR1, &tractament, NULL);
```

#### Els dos flags clau de `sa_flags` que pregunten a l'examen:
* **`SA_RESETHAND`**: Quan arriba el senyal per primera vegada s'executa la teva funció, però automàticament el senyal **torna a la seva acció per defecte (`SIG_DFL`)**. Si arriba un segon cop, el programa morirà.
* **`SA_RESTART`**: Si el programa estava adormit en una crida com `read` o `waitpid` i arriba un senyal, un cop executada la funció del senyal, **la crida `read` es reprèn automàticament** sense retornar error `EINTR`.

### 3. Gestionar màscares de bloqueig (`sigset_t`)
```c
sigset_t mascara;
sigemptyset(&mascara);         // Buidar la màscara
sigaddset(&mascara, SIGUSR1);  // Afegir SIGUSR1 a la màscara
sigdelset(&mascara, SIGUSR1);  // Treure SIGUSR1 de la màscara
```

* **Bloquejar o Desbloquejar amb `sigprocmask()`**:
  ```c
  sigprocmask(SIG_BLOCK, &mascara, NULL);   // Bloqueja els senyals de la màscara
  sigprocmask(SIG_UNBLOCK, &mascara, NULL); // Desbloqueja els senyals
  ```

### 4. Esperar un senyal de forma segura: `sigsuspend()`
```c
sigsuspend(&mascara);
```
Atura el procés i l'adorm fins que arriba un senyal que **no estigui a `mascara`**.  
Quan arriba el senyal, s'executa la funció d'atenció, i tot seguit `sigsuspend` acaba i **restaura automàticament la màscara que el procés tenia abans**.

### 5. Programar un temporitzador: `alarm(segons)`
```c
alarm(5); // D'aquí a 5 segons rebràs el senyal SIGALRM
alarm(0); // Cancel·la qualsevol alarma que tinguessis programada
```

---

## 3.14 Trucs i patrons clau d'examen amb senyals

### Patró 1: Com aturar un procés i reprendre'l quan vulguis?
* **Per aturar-se a si mateix**:
  ```c
  kill(getpid(), SIGSTOP); // Es posa en estat STOPPED a l'instant
  ```
* **Per reprendre'l**: Des d'una altra terminal o un altre procés:
  ```bash
  kill -SIGCONT <PID>
  ```

---

### Patró 2: Com evitar el perill del "senyal perdut"? (cursa crítica)
Imagina que un pare vol esperar que el seu fill li enviï `SIGUSR1`.  
Si el pare fa simplement `sigsuspend(&buit)` sense bloquejar res abans, pot passar que el fill acabi tan ràpid que enviï el senyal **abans** que el pare hagi tingut temps d'arribar a la línia de `sigsuspend`. El senyal arriba, s'executa, i quan el pare finalment entra a `sigsuspend`, **es queda adormit per sempre** perquè el senyal ja ha passat!

**Com es resol a l'examen?**
1. **Bloqueges el senyal ABANS de fer el `fork`**:
   ```c
   sigset_t mask, mask_suspend;
   sigemptyset(&mask);
   sigaddset(&mask, SIGUSR1);
   sigprocmask(SIG_BLOCK, &mask, NULL); // SIGUSR1 queda bloquejat!
   ```
2. Crees el fill amb `fork()`. Si el fill envia el senyal ara, no es perd: es queda retingut al bitmap de pendents.
3. El pare s'adorm amb `sigsuspend(&mask_suspend)`, on `mask_suspend` té `SIGUSR1` desbloquejat. `sigsuspend` desbloqueja el senyal i s'adorm en una única acció atòmica: el senyal pendent es processa i el pare es desperta correctament!

---

### Patró 3: Com recollir els fills morts en segon pla sense bloquejar el pare?
Si el pare està fent feina i no vol aturar-se amb `waitpid()`, programa el senyal `SIGCHLD`:

```c
void tracta_mort_fill(int s) {
    int status;
    // Bucle obligatori amb WNOHANG!
    while (waitpid(-1, &status, WNOHANG) > 0) {
        // Recull el cadàver de cada fill que hagi mort
    }
}
```
> **Per què cal el bucle `while (waitpid(-1, &st, WNOHANG) > 0)`?**  
> Perquè si moren 3 fills alhora mentre s'està executant la funció, el sistema només posa a 1 el bit de `SIGCHLD`. Si fessis un sol `waitpid`, només en recolliries un i els altres dos es quedarien com a Zombies per sempre. El bucle `while` amb `WNOHANG` recull tots els fills que hagin mort fins que no en queda cap (retorna 0) i no bloqueja el pare.

---

## 3.15 Preguntes d'examen resoltes (Tema 3)

### 1. Un procés orfe rep `SIGKILL`. Pot quedar-se en estat Zombie per sempre?
> **Resposta breu i exacta**:  
> **NO**. Quan un procés es queda orfe, és adoptat immediatament pel procés `init` (PID 1). Aquest procés té la funció d'anar fent `waitpid()` de tots els processos que adopta, de manera que allibera el seu PCB tan bon punt moren.

### 2. Què li passa a les estructures de senyals d'un pare quan fa `fork()`?
> **Resposta breu i exacta**:  
> **Absolutament res**. L'execució de `fork()` crea un procés fill nou i no modifica cap de les dades del procés pare (la seva taula de senyals, el seu bitmap de pendents, la seva màscara de bloqueig i la seva alarma es queden exactament igual).

### 3. Què canvia i què es manté a les estructures de senyals quan un procés fa `execlp()`?
> **Resposta breu i exacta**:  
> * **Canvia**: La taula d'accions es restableix a l'acció per defecte (`SIG_DFL`) per a totes les funcions d'usuari (perquè el codi nou ja no conté les funcions velles).  
> * **Es manté**: La màscara de senyals bloquejats, la llista de senyals pendents i l'alarma es mantenen intactes.

### 4. Amb Round Robin, 3 processos i un quàntum de 10 ms, pot un procés executar-se dues vegades en menys de 30 ms?
> **Resposta breu i exacta**:  
> **SÍ**. Si qualsevol dels altres dos processos fa una crida bloquejant (com llegir del teclat amb `read`, fer `waitpid` o esperar un senyal) abans d'esgotar els seus 10 ms, allibera la CPU immediatament i el torn passa al següent abans d'hora.
