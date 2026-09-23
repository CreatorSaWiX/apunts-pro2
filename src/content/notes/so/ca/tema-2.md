---
title: "Tema 2: Gestió de Processos, Senyals i Planificació"
description: "Concepte de procés, estructura del PCB, diagrama d'estats (READY, RUN, BLOCKED, ZOMBIE), crides fork, exec, exit, waitpid, IPC amb senyals, màscares, sigsuspend, i planificació Round Robin."
readTime: "18 min"
order: 2
draft: false
---

# 2. Gestió de processos, senyals i planificació

::callout[type="info" title="Pes a l'avaluació"]
Aquest tema constitueix el nucli central teòric i pràctic de Sistemes Operatius. Dominar l'arbre de processos generat per `fork()`, el cicle d'estats, la gestió de senyals asíncrons amb `sigsuspend()` i la planificació és imprescindible per aprovar els exàmens parcials i finals.
::

---

## 2.1. Concepte de procés i estructures del kernel

Un ==procés== és la representació en el sistema operatiu d'un **programa en execució**:

* **Programa:** Entitat passiva. És simplement un fitxer binari emmagatzemat a disc amb codi màquina i dades inicials (ex: format ELF).
* **Procés:** Entitat activa. Disposa de recursos dinàmics assignats pel kernel: espai de memòria RAM propi (segments de codi, dades globals, pila i heap), registres de la CPU, un identificador únic (**PID**) i un estat d'execució.

### Propietats fonamentals d'un procés a Linux / UNIX

Les característiques d'un procés s'estructuren en tres eixos principals:

1. ==Identitat==: Defineix qui és el procés i quins drets d'accés té:
   * **PID (*Process ID*):** Enter positiu únic al sistema generat pel kernel en crear el procés.
   * **PPID (*Parent Process ID*):** El PID del procés que l'ha creat mitjançant `fork()`.
   * **Credencials:** `UID` (*User ID*) i `GID` (*Group ID*). Determinen els permisos sobre fitxers i dispositius (mecanisme `rwx`). L'usuari `root` (UID 0) gaudeix d'accés absolut. El mecanisme especial `setuid` permet executar temporalment un binari amb els permisos del seu propietari en lloc dels de qui l'invoca.
2. ==Entorn==: Informació transmesa durant la invocació:
   * Arguments de la línia de comandes (`argv`).
   * Variables d'entorn (`environ`, com `HOME`, `PATH`, `USER`).
3. ==Context==: Estat intern complet del procés:
   * **Context maquinari:** Valors continguts als registres de la CPU, el Program Counter ($PC$) i el punter de pila ($SP$).
   * **Context programari:** Estat de planificació, taula de descriptors de fitxers oberts, taula de tractament de senyals, màscara de senyals bloquejats i mètriques d'ús de recursos.

---

## 2.2. El Process Control Block (PCB)

El ==Process Control Block (PCB)== és l'estructura de dades interna del kernel (`struct task_struct` a Linux) que conté tota la informació necessària per administrar i reprendre un procés.

::callout[type="warning" title="Herència de camps del PCB en un fork() [Examen Parcial QP 2024-2025]"]
Quan s'invoca la crida `fork()`, el fill hereta la gran majoria de camps del pare, però alguns s'inicialitzen o canvien obligatòriament:
::

| Camps que el fill HERETA del pare | Camps que NO s'hereten (s'inicialitzen de nou) |
| :--- | :--- |
| $\bullet$ **Espai d'adreces lògic:** Còpia privada del contingut de la memòria del pare. | $\bullet$ **PID:** Rep un nou identificador únic al sistema. |
| $\bullet$ **Taula d'accions de senyals:** Mateixes rutines associades (`sigaction`). | $\bullet$ **PPID:** Es fixa al PID del procés pare creador. |
| $\bullet$ **Màscara de senyals bloquejats:** Mateixos senyals emmascarats (`sigprocmask`). | $\bullet$ **Senyals pendents:** El fill comença amb el bitmap a zero. |
| $\bullet$ **Credencials:** Mateix UID, GID i drets d'accés. | $\bullet$ **Temporitzadors (*alarms*):** L'alarma del pare no s'activa al fill. |
| $\bullet$ **Descriptors de fitxers:** Comparteix els fitxers ja oberts pel pare. | $\bullet$ **Temps de CPU consumit:** Els comptadors d'ús comencen a 0. |
| $\bullet$ **Variables d'entorn i directori de treball:** Mateix directori actual. | $\bullet$ **Estat de planificació:** El fill arrenca a l'estat `READY`. |

---

## 2.3. Cicle de vida i diagrama d'estats del procés

El sistema operatiu classifica en tot moment els processos actius en un dels següents estats fonamentals:

```text
                  fork()
         ─────────────────────────►┌──────────────┐
                                   │    READY     │◄───────────────────┐
                              ┌───►│ (preparat)   │                    │
                              │    └──────┬───────┘                    │
      Fi de quàntum /         │           │                            │ Esdeveniment produït
      interrupció de rellotge │           │ Dispatcher                 │ o senyal rebut
                              │           ▼                            │
                           ┌──┴──────────────┐   Crida bloquejant   ┌──┴──────────────┐
                           │      RUN        ├─────────────────────►│     BLOCKED     │
                           │  (en execució)  │ (waitpid, sigsuspend)│   (bloquejat)   │
                           └──────┬──────────┘                      └─────────────────┘
                                  │
                                  │ exit() o mort per senyal
                                  ▼
                           ┌──────────────┐
                           │    ZOMBIE    │
                           │  (terminat)  │
                           └──────┬───────┘
                                  │
                                  │ waitpid() del pare
                                  ▼
                          (PCB alliberat)
```

::callout[type="tip" title="Les 4 regles d'or dels canvis d'estat [Exàmens Parcials 2023-2025]"]
1. **`RUN` $\rightarrow$ `BLOCKED`:** **Només pot ser provocat voluntàriament pel mateix procés** en executar una crida a sistema bloquejant (`waitpid()`, `sigsuspend()`, `read()`, etc.).
2. **La interrupció de rellotge:** **Mai pot passar un procés a `BLOCKED`**. En ser un esdeveniment apropiatiu extern, desallotja la CPU passant el procés de **`RUN` a `READY`**.
3. **`BLOCKED` $\rightarrow$ `READY`:** Quan finalitza l'operació d'E/S o arriba el senyal esperat, el procés **mai passa directament a `RUN`**; es col·loca a la cua de `READY` a esperar que el planificador li torni a assignar la CPU.
4. **Estat `ZOMBIE`:** És l'estat d'un procés que ja ha finalitzat la seva feina i ha alliberat la memòria RAM, però el seu PCB roman a la memòria del kernel perquè el seu procés pare encara no ha consultat el seu codi d'acabada mitjançant `waitpid()`.
::

---

## 2.4. Serveis bàsics de gestió de processos (UNIX)

### 1. `int fork(void);`
* **Funció:** Duplica el procés actual creant un nou procés fill que és un clon idèntic en dades i codi, amb un nou PCB.
* **Valor de retorn:**
  * Retorna **`0`** al procés fill.
  * Retorna el **`PID` del fill** ($>0$) al procés pare.
  * Retorna **`-1`** en cas d'error (no s'ha pogut crear el fill).
* **Espais de memòria completament aïllats:** Pare i fill disposen de mapes de memòria privats i independents. Qualsevol modificació sobre variables globals o locals que faci un d'ells **no serà visible mai per a l'altre**.

### 2. `int execlp(const char *file, const char *arg0, ..., NULL);`
* **Funció:** Substitueix completament la imatge de memòria del procés actual carregant el nou binari `file`.
* **Propietats clau:**
  * El procés **manté el mateix PID** i PPID.
  * L'espai d'adreces es reinicia de zero (nou codi, noves dades, nova pila) i l'execució comença a la primera línia del `main` del nou programa.
  * **Comportament crític:** Si té èxit, **mai retorna** (el codi posterior a `execlp` no s'executarà mai).
  * **Efecte sobre senyals:** Restableix la taula d'accions de senyals als valors per defecte (**`SIG_DFL`**), però **conserva la màscara de senyals bloquejats**.

### 3. `void exit(int status);`
* **Funció:** Finalitza voluntàriament el procés i allibera tots els seus recursos de memòria RAM i fitxers oberts.
* **Codi d'acabada:** Desa els 8 bits inferiors de `status` (`status & 0377`, valors de 0 a 255) al PCB perquè el pare pugui llegir-los.
* **Canvi d'estat:** Passa immediatament el procés a l'estat **`ZOMBIE`** i envia un senyal `SIGCHLD` al seu pare.

### 4. `pid_t waitpid(pid_t pid, int *status, int options);`
* **Funció:** Espera que un procés fill canviï d'estat (habitualment que acabi), extreu el seu codi de retorn copiant-lo a la variable apuntada per `status` i **elimina definitivament el seu PCB de la memòria del kernel**.
* **Paràmetre `pid`:** Si `pid == -1`, espera la finalització de **qualsevol** procés fill. Si el procés no té fills vius ni zombies, retorna immediatament **`-1`** amb `errno = ECHILD`.
* **Comportament segons `options`:**
  * `options = 0` (**Bloquejant**): Si cap fill és `ZOMBIE`, suspèn el pare passant-lo a `BLOCKED` fins que mori un fill. Per recollir ordenadament $N$ fills d'un procés cal executar exactament **$N + 1$** crides (l'última retornarà `-1`).
  * `options = WNOHANG` (**No bloquejant**): Si cap fill ha mort, no suspèn el procés i retorna immediatament **`0`**. S'utilitza per fer comprovacions sense aturar l'execució.
* **Macros per analitzar la variable `status`:**
  * `WIFEXITED(status)`: Retorna cert si el fill ha finalitzat voluntàriament cridant a `exit()`.
  * `WEXITSTATUS(status)`: Extreu el número retornat pel fill (només té sentit si `WIFEXITED` és cert).
  * `WIFSIGNALED(status)`: Retorna cert si el fill ha mort sobtadament per un senyal no capturat.
  * `WTERMSIG(status)`: Retorna l'identificador numèric del senyal que ha matat el fill.

---

## 2.5. Esquemes d'execució: Seqüencial vs. Concurrent

En estructurar programes que utilitzen múltiples processos podem adoptar dues filosofies de disseny:

* ==Esquema seqüencial==: El pare crea un fill i espera immediatament la seva mort (`waitpid`) abans de crear el següent fill a la següent iteració del bucle.
  * **Concurrència màxima:** Com a màxim hi ha **2 processos vius** simultàniament al sistema (el pare i el fill actual).
* ==Esquema concurrent==: El pare crea tots els fills ràpidament dins d'un primer bucle de `fork()`. Un cop creats tots, recull les seves finalitzacions mitjançant un segon bucle de `waitpid()`.
  * **Concurrència màxima:** Tots els processos fills s'executen en paral·lel alhora (grau de concurrència igual a $N + 1$).

---

## 2.6. Comunicació entre processos (IPC) i senyals a Linux

Els ==senyals== són interrupcions per software asíncrones enviades pel nucli o per altres processos per notificar l'aparició d'un esdeveniment específic.

### Taula dels senyals principals de Linux

| Senyal | Acció per defecte | Esdeveniment causant |
| :--- | :---: | :--- |
| `SIGINT` | Terminar procés | Interrupció interactiva generada des del terminal (`Ctrl + C`). |
| `SIGALRM` | Terminar procés | Expiració del temporitzador programat mitjançant `alarm()`. |
| `SIGCHLD` | Ignorar (`SIG_IGN`) | Un procés fill ha finalitzat o s'ha aturat. |
| `SIGKILL` | Terminar procés | Mort forçada i immediata. **No es pot capturar ni bloquejar mai**. |
| `SIGSTOP` | Aturar procés (`STOPPED`) | Pausa l'execució del procés. **No es pot capturar ni bloquejar mai**. |
| `SIGCONT` | Continuar | Reprèn un procés aturat prèviament per `SIGSTOP`. |
| `SIGSEGV` | Terminar + Core dump | Accés no permès a memòria (fallada de segmentació / punter invàlid). |
| `SIGUSR1` / `SIGUSR2` | Terminar procés | Senyals reservats per a propòsits lliures de l'usuari i aplicació. |

---

## 2.7. Màscares de senyals i la funció `sigaction`

### El tipus de dada `sigset_t`

Un procés pot emmascarar senyals per impedir que l'interrompin mentre duu a terme operacions crítiques. Els senyals blocats queden retinguts al **bitmap de senyals pendents** del PCB (que només recorda 1 bit per tipus de senyal; no en comptabilitza la quantitat):

* `sigemptyset(&mask)`: Inicialitza la màscara buida (tots els bits a 0).
* `sigfillset(&mask)`: Bloqueja tots els senyals possibles (tots els bits a 1).
* `sigaddset(&mask, SIG)` / `sigdelset(&mask, SIG)`: Afegeix o retira un senyal concret de la màscara.
* `sigprocmask(comanda, &nova, &vella)`: Aplica la nova màscara al procés segons la comanda:
  * `SIG_BLOCK`: Afegeix els senyals de `nova` als que ja estaven blocats ($M_{\text{act}} = M_{\text{act}} \cup \text{nova}$).
  * `SIG_UNBLOCK`: Desbloqueja els senyals indicats a `nova` ($M_{\text{act}} = M_{\text{act}} \setminus \text{nova}$).
  * `SIG_SETMASK`: Substitueix la màscara del procés íntegrament per `nova` ($M_{\text{act}} = \text{nova}$).

### Configuració precisa amb `struct sigaction`

Permet associar una rutina de tractament (*signal handler*) a un senyal:

```c
struct sigaction sa;
sa.sa_handler = rutina_tractament; // SIG_DFL, SIG_IGN o funció void nom(int)
sigemptyset(&sa.sa_mask);           // Senyals que es bloquegen DURANT la rutina
sigaddset(&sa.sa_mask, SIGUSR2);
sa.sa_flags = 0;                    // SA_RESETHAND, SA_RESTART, etc.
sigaction(SIGUSR1, &sa, NULL);
```

* **Autobloqueig:** El sistema sempre bloqueja automàticament el propi senyal que s'està atenent durant l'execució del seu handler per impedir invocacions recursives infinites.
* `sa_mask`: Permet especificar senyals addicionals que han de quedar suspesos mentre s'executa la rutina. En finalitzar el handler, la màscara original del procés es restaura per complet.

---

## 2.8. La crida atòmica `sigsuspend(&mask)`

::callout[type="warning" title="Propietats invariants de sigsuspend() [Pregunta recurrent d'examen]"]
1. **Canvi atòmic i suspensió:** Substitueix en un únic pas indivisible la màscara de senyals del procés per la passada per paràmetre (`mask`) i passa el procés a estat **`BLOCKED`**.
2. **Retorn exclusiu per senyal:** Només es desbloqueja quan rep un senyal que **no estigui bloquejat a `mask`** i que tingui associada una rutina de tractament (o senyals no bloquejables com `SIGKILL`).
3. **Execució i restauració:** Primer s'executa la rutina de tractament del senyal i, en retornar, el programa reprèn l'execució immediatament després de `sigsuspend`, registrant de nou la seva **màscara de senyals original anterior**.
4. **Valor de retorn:** **Sempre retorna `-1`** amb la variable `errno = EINTR`. Mai retorna 0 ni cap valor positiu!
::

### El temporitzador `alarm(segons)`

Programa un temporitzador al nucli. Quan transcorre el temps especificat, el kernel envia un senyal `SIGALRM` al procés:
* Només pot existir **un únic temporitzador actiu** per procés. Una nova crida a `alarm()` sobreescriu la programació anterior.
* La invocació `alarm(0)` cancel·la el temporitzador pendent i retorna els segons que quedaven abans d'expirar.

### Espera activa vs. Bloqueig i condicions de cursa

* **Espera activa (*busy waiting*):** Comprovar en un bucle tancat una variable global (`while(!arribat);`). Malbarata el 100% del temps de CPU de manera inútil.
* **Bloqueig eficient amb `sigsuspend`:** Allibera completament la CPU perquè altres processos puguin aprofitar-la mentre s'espera la notificació.
* **El patró d'or contra condicions de cursa (*race conditions*):**
  Si un procés ha d'esperar un senyal enviat per un altre, **cal bloquejar el senyal abans de crear el fill o iniciar la feina** amb `sigprocmask(SIG_BLOCK, ...)`. Si no es fes així, el senyal podria arribar abans d'entrar a la crida d'espera i es perdria per sempre, deixant el procés bloquejat indefinidament.

---

## 2.9. Gestió interna, canvi de context i planificació

### El canvi de context (*context switch*)

Quan el planificador decideix alternar el procés que ocupa la CPU, s'executa un procés de quatre passos:

1. Salva el context físic (registres, $PC$, punter de pila $SP$) del procés sortint al seu respectiu PCB.
2. L'algorisme de planificació tria el procés destinatari segons la política establerta.
3. Restaura el context del nou procés des del seu PCB i actualitza els registres de control de memòria virtual a la MMU.
4. El canvi de context és **sobrecàrrega pura (*overhead*)**: és temps consumit pel sistema durant el qual no s'avança feina útil d'usuari.

### Polítiques de planificació

* **No apropiatives (*non-preemptive*):** El procés conserva la CPU de forma ininterrompuda fins que decideix alliberar-la voluntàriament (perquè acaba o fa una crida a sistema bloquejant).
* **Apropiatives (*preemptive*):** El sistema operatiu pot retirar forçosament la CPU al procés actiu (perquè s'ha esgotat el seu quàntum de rellotge o ha despertat un procés de més prioritat).

### Algorisme Round Robin (RR)

És l'algorisme estàndard de temps compartit en sistemes moderns:

* Organitza els processos preparats en una cua **FIFO**.
* Cada procés rep la CPU durant un temps màxim anomenat **quàntum ($Q$)** (habitualment 10 a 100 ms).
* Si a la cua de `READY` hi ha $N$ processos preparats, **cap procés esperarà més de $(N-1) \cdot Q$ unitats de temps** per tornar a rebre la CPU.
* **Mida del quàntum $Q$:**
  * Si $Q$ és massa gran: El sistema degenera en un esquema seqüencial (*First-Come First-Served*, FCFS).
  * Si $Q$ és massa petit: La sobrecàrrega dels continus canvis de context consumeix gairebé tota la potència del processador.

---

## 2.10. Accions internes del kernel en crides fonamentals

| Crida | Seqüència d'operacions internes del nucli |
| :--- | :--- |
| **`fork`** | Reserva un nou PCB buit; genera nous identificadors (nou PID, PPID del pare); duplica el mapa de memòria; copia la configuració de senyals; insereix el nou fill a la cua de `READY`. |
| **`exec`** | Allibera els segments de memòria anteriors; carrega el nou binari a RAM; fixa el $PC$ al `main`; restableix els handlers a `SIG_DFL` mantenint la màscara de bloquejats; manté PID i PPID. |
| **`exit`** | Allibera la memòria i els fitxers oberts; desa el codi d'acabada (8 bits) al PCB; desallotja el procés de la cua de `READY` col·locant-lo en estat `ZOMBIE`; invoca el planificador. |
| **`waitpid`** | Revisa la llista de descendents: si troba un fill en estat `ZOMBIE`, llegeix el seu codi de retorn, **allibera el seu PCB definitivament** i retorna al pare. Si no n'hi ha cap i és bloquejant, passa el pare a `BLOCKED`. |
