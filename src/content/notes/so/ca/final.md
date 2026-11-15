---
title: "Final SO"
description: "Resum integral per a l'examen final de Sistemes Operatius (Teoria i Laboratori): Temes 1–7, patrons reals, trampes i respostes model."
readTime: "40 min"
order: 99
draft: false
isNew: true
---

> **Regla d'or als finals de Teoria:** *"Justifica totes les respostes. Les respostes sense justificar es consideren errònies."* Des de QP24-25 l'examen es fa en PC amb editor de text pla i **`man` local disponible** (es permet consultar prototips i flags exactes, així que no es perdonen imprecisions).

## 1. Arquitectura del SO, modes i crides al kernel

### Modes de la CPU: usuari vs. kernel
La CPU té un bit intern al registre d'estat (PSW) que indica el mode:
* **Mode usuari**: Els programes d'usuari només accedeixen al seu espai de memòria lògic i a instruccions no privilegiades. No poden tocar maquinari directament.
* **Mode kernel (privilegiat)**: El SO té accés a tot el maquinari, tota la memòria física i a instruccions privilegiades.
* **Per què una aplicació no pot cridar directament funcions del kernel?**
  1. El codi del kernel està fora de l'espai d'adreces de l'aplicació (és inaccessible).
  2. Executa instruccions privilegiades prohibides en mode usuari.

### Com s'entra al kernel?
Només hi ha **3 vies d'entrada**. El kernel mai s'executa si no passa una d'aquestes tres:

| Mecanisme | Voluntari / Involuntari | Síncron / Asíncron | Causa |
| :--- | :---: | :---: | :--- |
| **Interrupció HW** | Involuntari | **Asíncron** | Dispositiu extern: tick de rellotge (cada ~10 ms), teclat, xarxa. |
| **Excepció SW** | Involuntari | **Síncron** | Error de la CPU en executar una instrucció: divisió per 0, accés a memòria invàlida (*SegFault*), fallada de pàgina. |
| **Crida a sistema (*trap*)** | **Voluntari** | **Síncron** | El programa demana un servei al SO (`write`, `fork`, `sigsuspend`). |

### Per què la biblioteca de sistema (`libc`) depèn del maquinari i no és portable?
Perquè conté la instrucció màquina específica d'aquella CPU per saltar al kernel (`syscall` a x86_64, `svc` a ARM) i col·loca els paràmetres als registres concrets que fixa l'arquitectura. Un binari de `libc` per a ARM no funciona a x86.

### Comandes de la shell: internes vs. externes
* **Interna (*built-in*, ex: `cd`, `exit`)**: S'executa dins de la mateixa shell. **No crea cap procés nou**.
* **Externa (ex: `ls`, `ps`)**: La shell crea un procés fill amb `fork()` i hi carrega el binari amb `execlp()`.

### Sortida per pantalla de baix nivell (`sprintf` + `write`)
A SO no s'usa `printf` perquè té memòria intermèdia (*buffer*). S'usa `write` al descriptor 1 (`stdout`):
```c
char buf[80];
int len = sprintf(buf, "Hola des del PID %d\n", getpid());
write(1, buf, len);
```

---

## 2. Gestió de processos (PCB, cicle de vida i crides)

### El PCB (*process control block*)
Fitxa que el kernel guarda a la seva memòria per a cada procés: PID, PPID, estat, còpia de registres de la CPU, memòria, taula de fitxers oberts (`fd`), 4 estructures de senyals i comptadors de CPU.

### Cicle de vida i canvis d'estat
* **`RUN`**: Executant instruccions a la CPU física.
* **`READY`**: A punt per executar, esperant torn a la cua de la CPU.
* **`BLOCKED`**: Esperant un esdeveniment extern (I/O, mort d'un fill, senyal). **No consumeix CPU**.
* **`STOPPED`**: Pausat expressament per `SIGSTOP` o `Ctrl+Z`. Es reprèn només amb `SIGCONT`.
* **`ZOMBIE`**: Ha fet `exit()`. Memòria alliberada, però el PCB continua viu al kernel guardant el codi de sortida fins que el pare faci `waitpid()`.

*Pot la interrupció de rellotge passar un procés a `BLOCKED`?*  
**No.** El pas a `BLOCKED` és **sempre voluntari** del procés quan fa una crida a sistema bloquejant. El rellotge només pot passar el procés de `RUN` a `READY` (si esgota el seu quàntum de temps).

---

### Què s'hereda a `fork()` i què canvia a `exec()`? (Imprescindible)

| Dades del PCB | Després de `fork()` (fill) | Després de `exec()` (mutació) |
| :--- | :--- | :--- |
| **PID** | **Nou i únic** (no s'hereda) | **Es manté idèntic** |
| **PPID** | Pren el PID del pare | **Es manté idèntic** |
| **Espai de memòria** | Còpia independent (*copy-on-write*) | **Es destrueix** i es carrega el nou binari |
| **Descriptors oberts (`fd`)**| S'hereden (apunten als mateixos fitxers) | Es mantenen (excepte si porten `FD_CLOEXEC`) |
| **Màscara de senyals** | **S'hereda idèntica** | **Es manté idèntica** |
| **Senyals pendents** | **Neix buit (a 0)** | **Es mantenen** els senyals pendents |
| **Vector de tractament** | **S'hereda idèntic** | **Els capturats tornen a `SIG_DFL`**; els `SIG_IGN` es mantenen |
| **Temporitzador `alarm()`** | **Neix desactivat (a 0)** | **Es manté** el temps restant de l'alarma |
| **Temps consumit CPU** | **Neix a 0** | Es manté l'acumulat |

---

### Cicle de vida i crides fonamentals

### 1. Clonar un procés: `fork()`
Clona el procés actual creant-ne un de nou idèntic:
```c
int pid = fork();
if (pid < 0) {
    perror("Error en fork");
    exit(1);
} else if (pid == 0) {
    // Codi que només executa el fill (retorn 0)
    exit(0);
} else {
    // Codi que només executa el pare (retorn és el PID del fill)
}
```

* **Aïllament de memòria:** El pare i el fill **no comparteixen memòria**. Les modificacions del fill mai són visibles pel pare:
```c
int global = 100;
if (fork() == 0) {
    global = 200; // Només canvia a la memòria privada del fill
    exit(0);
}
waitpid(-1, NULL, 0);
// Aquí al pare, global continua valent 100!
```

### 2. Mutar un procés: `execlp()`
Substitueix la memòria del procés pel nou binari, mantenint el mateix PID. Només retorna si falla (`-1`). Requereix centinella `(char *)NULL`:
```c
execlp("./programa", "programa", "arg1", (char *)NULL);
// Si s'executa aquesta línia, és que execlp ha fallat:
perror("Error carregant el binari");
exit(1);
```

### 3. Finalitzar un procés: `exit(status)`
Allibera memòria RAM, tanca descriptors i posa el procés en estat **`ZOMBIE`** guardant el codi `status` al PCB. Mai retorna.

### 4. Recollir fills i alliberar PCB: `waitpid()`
El pare espera que un fill acabi, n'extreu la causa de mort i **allibera el seu PCB del kernel**:
```c
int status;
int pid_fill = waitpid(-1, &status, 0); // -1 = qualsevol fill, 0 = bloquejant

if (WIFEXITED(status)) {
    // Ha acabat voluntàriament amb exit(codi) o return
    int codi = WEXITSTATUS(status);
} else if (WIFSIGNALED(status)) {
    // Ha mort de cop a causa d'un senyal no capturat
    int sig = WTERMSIG(status);
}
```

* **Comportament segons opcions:**
  * `opcions = 0` (bloquejant): Si té fills vius s'adorm a `BLOCKED`. Si té un fill zombie, l'allibera i retorna de seguida. Si **no té cap fill**, retorna `-1` immediatament (`ECHILD`).
  * `opcions = WNOHANG` (no bloquejant): Si té fills vius però cap zombie, **retorna `0` immediatament**.
  * **Alerta trampa:** `while(waitpid(-1, NULL, WNOHANG) >= 0);` sobre fills vius és una **espera activa** (crema 100% de CPU fent milers de crides inútils per segon).
* **Quantes crides fa un bucle per netejar fills?**
```c
// Fa exactament N_fills + 1 crides (les N que alliberen fills i l'última que retorna -1)
while (waitpid(-1, NULL, 0) > 0);
```

### Processos orfes i zombis
* Si el pare mor abans que el fill, el fill passa a ser **orfe** i és adoptat immediatament pel procés `init` / `systemd` (PID 1).
* **Pot un orfe quedar-se zombie per sempre?** **No.** El procés PID 1 executa `waitpid()` periòdicament per netejar qualsevol procés orfe tan bon punt mor.

---

## 3. Jerarquies de processos i concurrència

### Esquema seqüencial vs. concurrent
Descriuen quan espera el pare els seus fills respecte a quan els crea.

### Esquema seqüencial
El pare crea un fill i n'espera la finalització abans de crear el següent. El `waitpid` va **dins** del bucle:
```c
for (i = 0; i < N; i++) {
    ret = fork();
    if (ret == 0) {
        // Codi del fill
        exit(0);
    }
    waitpid(-1, NULL, 0); // Espera el fill abans de crear-ne un altre
}
```
* Només hi ha un fill viu alhora (més el pare).
* **Grau màxim de concurrència = 2** (pare + 1 fill).
* L'ordre d'execució és **determinista**: fill 0, després fill 1, etc.

### Esquema concurrent
El pare crea tots els fills primer i després els espera. El `waitpid` va **fora** del bucle de creació:
```c
for (i = 0; i < N; i++) {
    ret = fork();
    if (ret == 0) {
        // Codi del fill
        exit(0);
    }
}
while (waitpid(-1, NULL, 0) > 0); // Espera tots els fills al final
```
* Tots els fills poden estar vius al mateix temps.
* **Grau màxim de concurrència = N + 1** (pare + N fills).
* L'ordre d'execució i de finalització **no és determinista**: depèn del planificador de la CPU.

---

### Arbres de processos

### 1. Arbre en ventall (estrellat)
Un pare crea $N$ fills directes que acaben amb `exit()`:
```c
for (i = 0; i < 3; i++) {
    if (fork() == 0) {
        exit(0); // El fill mor i no fa més forks
    }
}
while (waitpid(-1, NULL, 0) > 0);
```
```text
P0
├── P0.0
├── P0.1
└── P0.2
```

### 2. Arbre en cascada (cadena de mutació)
El fill muta al mateix programa passant un paràmetre decrementat:
```c
// Execució: ./prog 3
int n = atoi(argv[1]);
if (n > 0) {
    if (fork() == 0) {
        char buf[10];
        sprintf(buf, "%d", n - 1);
        execlp("./prog", "prog", buf, (char *)NULL);
    }
    waitpid(-1, NULL, 0);
}
```
```text
P0 ──> P0.0 ──> P0.0.0 ──> P0.0.0.0
```

### 3. Arbre binari recursiu (`arbol.c` a QT 23-24)
Cada procés amb nivells $> 0$ crea 2 fills, i aquests muten amb `nivells - 1`:
```c
if (nivells > 0) {
    ret = fork();
    if (ret > 0) {
        ret = fork(); // El pare fa un segon fork
    }
    if (ret == 0) {
        nivells--;
        sprintf(buf, "%d", nivells);
        execlp("./arbol", "arbol", buf, (char *)NULL);
    }
}
```
* Processos totals: $2^{\text{nivells} + 1} - 1$. Per nivells = 3: $1 + 2 + 4 + 8 = 15$ processos.

---

## 4. Gestió de senyals (*signals*)

Un senyal és una notificació asíncrona enviada pel kernel o per un altre procés.

### Les 4 estructures de senyals al PCB
Quan arriba un senyal, el kernel consulta aquestes 4 estructures en aquest ordre:
1. **Màscara de bloquejats (`sigset_t`)**: Senyals retinguts temporalment. Si el senyal hi és, no es lliura ara.
2. **Bitmap de pendents**: Bits que guarden els senyals retinguts. **No s'encuen**: si reps 5 cops el mateix senyal mentre està bloquejat, en desbloquejar-lo només s'atén **1 cop**.
3. **Taula de tractament (handlers)**: Què fer en rebre'l:
   * `SIG_DFL`: Acció per defecte (morir, congelar-se o ignorar).
   * `SIG_IGN`: Ignorar-lo (es descarta).
   * Funció pròpia: Salta a executar el handler en C.
4. **Temporitzador d'alarma**: Compte enrere intern gestionat pel kernel. Quan arriba a 0, envia un `SIGALRM`. Només hi ha 1 alarma per procés.

### Taula de senyals fonamentals

| Senyal | Codi | Acció per defecte | Es pot capturar o bloquejar? |
| :--- | :---: | :---: | :---: |
| **`SIGKILL`** | 9 | Mata el procés a l'instant | **Mai (imparable)** |
| **`SIGSTOP`** | 19 | Congela el procés (`STOPPED`) | **Mai (imparable)** |
| **`SIGCONT`** | 18 | Descongela el procés | Sí |
| **`SIGALRM`** | 14 | Mata el procés | Sí |
| **`SIGCHLD`** | 17 | **Ignorar (no fa res)** | Sí |
| **`SIGINT`** | 2 | Mata el procés (`Ctrl+C`) | Sí |
| **`SIGUSR1` / `SIGUSR2`** | 10 / 12 | Mata el procés | Sí |

---

### Crides de senyals

### 1. Enviar un senyal: `kill(pid, senyal)`
Envia un senyal a un procés. No només serveix per matar:
```c
kill(pid, SIGSTOP); // Pausa el procés (passa a STOPPED)
kill(pid, SIGCONT); // Descongela el procés pausat
kill(pid, SIGKILL); // Força la mort immediata
kill(pid, SIGUSR1); // Envia senyal d'usuari
```

### 2. Configurar la resposta a un senyal: `sigaction()`
```c
void tracta_senyal(int s) {
    char msg[64];
    int len = sprintf(msg, "Rebut senyal %d\n", s);
    write(1, msg, len);
}

// Al main:
struct sigaction sa;
sa.sa_handler = tracta_senyal;       // Funció que s'executarà
sigemptyset(&sa.sa_mask);            // Senyals a bloquejar NOMÉS durant el handler
sa.sa_flags = 0;
sigaction(SIGUSR1, &sa, NULL);       // Associa SIGUSR1 al handler
```

* **Flags clau de `sa_flags`:**
  * `sa.sa_flags = SA_RESETHAND;`: Executa el handler 1 sol cop; immediatament després, l'acció torna a la per defecte (`SIG_DFL`).
  * `sa.sa_flags = SA_RESTART;`: Si el procés estava bloquejat en una syscall lenta (`read`, `waitpid`), la reinicia automàticament sense donar error `EINTR`.
* **El camp `sa.sa_mask`:** Senyals que s'afegeixen a la màscara **únicament mentre s'està executant el handler**. En sortir del handler, la màscara prèvia es restaura sola:
```c
sigaddset(&sa.sa_mask, SIGUSR2); // Durant tracta_senyal, SIGUSR2 també estarà bloquejat
```

### 3. Modificar la màscara de bloqueig: `sigprocmask()`
```c
sigset_t mask, oldmask;
sigemptyset(&mask);
sigaddset(&mask, SIGALRM);
sigaddset(&mask, SIGCHLD);

// 1. Bloqueja SIGALRM i SIGCHLD (els afegeix a la màscara actual):
sigprocmask(SIG_BLOCK, &mask, &oldmask);

// 2. Desbloqueja:
sigprocmask(SIG_UNBLOCK, &mask, NULL);

// 3. Restaura la màscara tal com estava a oldmask:
sigprocmask(SIG_SETMASK, &oldmask, NULL);
```

### 4. Esperar un senyal de forma segura: `sigsuspend()`
Substitueix de forma **atòmica** la màscara del procés per `mask` i el posa a **`BLOCKED`** fins que arriba un senyal no bloquejat:
```c
sigsuspend(&mask); // Sempre retorna -1 (errno = EINTR)
```
* En retornar del handler, `sigsuspend` **restaura automàticament la màscara anterior**.
* **Quins senyals poden treure sempre un procés de `sigsuspend`?** Només `SIGKILL` i `SIGSTOP` (perquè no es poden bloquejar mai).

### 5. Programar un temporitzador: `alarm(segons)`
Programa un `SIGALRM` per d'aquí a $N$ segons. No atura el procés:
```c
alarm(5); // D'aquí a 5 segons arribarà SIGALRM

// Cancel·lar alarma i obtenir el temps restant:
int restants = alarm(0);       // alarm(0) desactiva i retorna els segons que faltaven
int temps_passat = 5 - restants; // Mesura el temps consumit pel fill
```

---

### Condicions de cursa

Esperar un senyal amb `sigsuspend` evitant curses.
Si un pare vol esperar que el fill li enviï un senyal (`SIGUSR1`), **cal bloquejar-lo abans del `fork()`**:
```c
sigset_t mask, mask_espera;
int rebut = 0;

void handler_usr1(int s) {
    rebut = 1;
}

// 1. Bloquegem ABANS del fork. Si el fill és ultra ràpid, el senyal no es perd
sigfillset(&mask);
sigprocmask(SIG_BLOCK, &mask, NULL);

// Associem el handler
struct sigaction sa;
sa.sa_handler = handler_usr1;
sigemptyset(&sa.sa_mask);
sa.sa_flags = 0;
sigaction(SIGUSR1, &sa, NULL);

if (fork() == 0) {
    // Fill fa una feina ràpida i avisa al pare
    kill(getppid(), SIGUSR1);
    exit(0);
}

// 2. Preparem màscara per a sigsuspend: tot bloquejat EXCEPTE SIGUSR1
sigfillset(&mask_espera);
sigdelset(&mask_espera, SIGUSR1);

// 3. Espera passiva (0% CPU): desbloqueja atòmicament i s'adorm
while (!rebut) {
    sigsuspend(&mask_espera);
}
```
* **Per què és un error no bloquejar abans del `fork()`?**  
  Si el fill envia `SIGUSR1` abans que el pare entri a `sigsuspend()`, el senyal es processa abans d'hora. Quan el pare finalment executa `sigsuspend()`, **es queda congelat per sempre**.

### Qui escriu missatges com `"Alarm clock"` o `"User defined signal 1"`?
Els escriu la **shell**, no el procés. La shell fa `waitpid()` sobre el programa executat i, en detectar amb `WIFSIGNALED(status)` que ha mort per un senyal no capturat, imprimeix el text descriptiu per la consola.

---

## 5. Planificació de la CPU (*scheduling*)

* **Planificació no apropiativa (cooperativa):** El procés només deixa la CPU si vol: fa `exit()`, fa una syscall bloquejant (`read`, `waitpid`), o mor per un senyal.
* **Planificació apropiativa:** El kernel li pot treure la CPU per la força quan esgota el seu quàntum de temps (interrupció de rellotge) o quan un procés més prioritari passa a `READY`.

### Round Robin (RR)
Cua FIFO amb quàntum fix de temps:
* *Amb 3 processos i un quàntum de 10 ms, pot un procés executar-se dos cops en menys de 30 ms?*  
  **Sí.** Si qualsevol dels altres processos fa una crida bloquejant abans d'esgotar els seus 10 ms, allibera la CPU abans d'hora i el torn avança immediatament.

### Completely Fair Scheduler (CFS de Linux)
Ordena els processos per `vruntime` (temps virtual d'execució). Afavoreix els processos interactius / d'I/O intensiva perquè passen molt de temps bloquejats, acumulen molt poc `vruntime` i reben màxima prioritat en despertar-se.

---

## 6. Processos i Signals: girs clàssics del Final

Al Final, el 30–40% de la nota de teoria continua sent de Processos i Signals, però amb aquestes 4 trampes recurrents:

### 1. El bucle `fork()` invertit (quan muta el PARE, `ret > 0`)
Llegeix amb lupa si qui fa `execlp()` o `exit()` és `ret == 0` o **`ret > 0`**:
```c
for (int i = 0; i < N; i++) {
    int ret = fork();
    if (ret > 0) execlp("compute", "compute", NULL); // Muta el PARE, el FILL segueix el for!
}
while (waitpid(-1, NULL, 0) > 0);
```
* No crea un ventall, sinó una **cadena lineal** (`P0 -> P0.0 -> P0.0.0 -> ...`).
* Qui arriba al `waitpid` és **l'últim fill** (que té **0 fills**!), així que `waitpid(-1, ...)` retorna `-1` (`ECHILD`) de cop. Si en comptes de `waitpid` tenia `while (procs > 0) sigsuspend(...)` esperant `SIGCHLD`, es queda **penjat per sempre**.
* **Variant si `execlp` falla:** tots els fills que no han mutat continuen donant voltes al `for`, creant un arbre exponencial tipus $2^N$.

### 2. Bucle obligatori dins el handler de `SIGCHLD`
Com que el bitmap de pendents no compta senyals repetits, si moren 3 fills gairebé alhora mentre `SIGCHLD` està bloquejat o s'està atenent, el handler s'executa **1 sol cop**:
```c
void tracta_sigchld(int s) {
    int st;
    while (waitpid(-1, &st, WNOHANG) > 0) { // Bucle obligatori per no deixar zombies!
        fills_vius--;
    }
}
```

### 3. `SA_RESTART` vs `EINTR` sobre `waitpid` i `read`/`write`
Si arriba un senyal capturat mentre el procés està bloquejat a `waitpid()` o a `read()`/`write()`:
* **Amb `sa_flags = 0`**: un cop acaba el handler, la syscall retorna **`-1` amb `errno == EINTR`**. Trampa mortal: si tens `while (waitpid(-1, &st, 0) > 0);`, el `-1` el fa sortir del bucle i deixa els fills **zombis**!
* **Amb `sa_flags = SA_RESTART`**: el Kernel **reinicia automàticament** la syscall lenta un cop acaba el handler.

### 4. Múltiples `alarm()` i màscares amb `exec`
* **Un sol temporitzador per procés:** `for (i = 0; i < 32; i++) alarm(i);` només deixa activa l'última alarma (**31 segons**).
* **`alarm()` es manté després d'`exec`**, però si l'executable mutat no captura `SIGALRM`, morirà amb `"Alarm clock"`. I compte a les mutacions: a `fork()`, el fill neix amb **`alarm(0)`**!

---

## 7. Memòria: marcs físics, COW, `maps` i Heap (Tema 5)

### On viu cada dada i la trampa del punter

| Codi en C | On viu la variable? | On viu la dada apuntada? | Si fas `p[0] = 5;`, trenca COW a la pàgina del punter? |
| :--- | :--- | :--- | :--- |
| `int v[10];` local / `int i;` | **Pila** (`[stack]`) | **Pila** (`[stack]`) | Sí (escriu a la pila). |
| `int g = 1;` / `int *gp;` global | **Dades** (`.data`/`.bss`) | `gp` a Dades; `*gp` al Heap | **NO!** `gp[0] = 5` modifica el Heap; la pàgina de Dades de `gp` segueix compartida per COW. |
| `int *p = sbrk(4096);` local | **Pila** (`[stack]`) | **Heap** (`[heap]`) | **NO!** Escriu al Heap; `p` no canvia de valor. |
| `int *d = mmap(..., MAP_ANONYMOUS, ...);` | **Pila** (`[stack]`) | **Regió `mmap`** *(mai al Heap!)* | **NO!** Escriu a la regió `mmap`. |

### Les 4 regles per comptar marcs físics (pàgines de 4 KB)
1. **Aïllament absolut entre regions:** Codi, Dades, Pila, Heap i `mmap` **mai no comparteixen marc físic** entre si (encara que una variable global ocupi 4 B, gasta 1 marc sencer de 4096 B $\Rightarrow 4092$ B de fragmentació interna).
2. **`ret = fork()` gairebé sempre trenca COW a la Pila:** en tornar del `fork()`, tant el pare com el fill escriuen el valor `ret` (i el comptador `i` del bucle) al seu *stack*, així que les pàgines de pila modificades es dupliquen de seguida.
3. **`execlp()` destrueix l'espai COW:** si el fill muta, allibera la seva herència del pare i comença amb un espai nou sota *demand paging*.
4. **`mmap(..., MAP_SHARED | MAP_ANONYMOUS, -1, 0)` no fa COW:** pare i fill escriuen directament sobre els **mateixos marcs físics** (no es dupliquen!).

### Com llegir `/proc/[PID]/maps` a l'examen
* **No apareix `libc.so` ni cap `.so`:** El binari s'ha compilat **estàticament (`-static`)**. Avantatge amb *demand paging*: només es carreguen a RAM les pàgines de biblioteca que realment s'executen.
* **Apareixen `libc.so.6` i `ld-linux`:** Compilació **dinàmica**; estalvia espai **en disc** (executables petits) i **en memòria física** (el codi `r-xp` es comparteix entre tots els processos).
* **No apareix la línia `[heap]`:** El procés encara no ha demanat memòria dinàmica (`sbrk`/`malloc`).
* **Alineament de `sbrk(0)` vs `maps`:** `sbrk(0)` retorna la direcció lògica exacta (ex. `0x883ed400`), mentre que `maps` mostra el límit físic arrodonit al següent múltiple de **4096 B** (`0x883ee000`).

### `sbrk(4096)` vs `malloc(4096)` i *Major Page Fault*
* **`p[4100]` fora de rang:** Amb `sbrk(4096)` cau fora de la pàgina assignada $\Rightarrow$ la MMU no té traducció $\Rightarrow$ **`SIGSEGV`**. Amb `malloc(4096)` pot **no fallar** perquè `libc` fa reserva en excés amb `sbrk` i la pàgina encara és vàlida per a la MMU.
* **Excepció de MMU $\neq$ sempre `SIGSEGV`:** La MMU llança l'excepció i el Kernel consulta el PCB. Només envia `SIGSEGV` si l'accés és il·legal o sense permisos; si és COW o *page fault*, el resol i **reinicia la instrucció**.
* **Les 3 causes d'un *Major Page Fault* en `*a = 1;`:** Pot no ser en RAM la pàgina de **(1) codi** (instrucció), **(2) dades/pila** (on viu el punter `a`), o **(3) heap/pila** (on viu `*a`).

---

## 8. Taules del Kernel (`TC`, `TFA`, `TI`) i Pipes (Tema 6)

### Regles exactes per seguir les 3 taules en cada crida

```text
TC (1 per procés al PCB) ───> TFA / TFO (global sistema) ───> TI (global sistema)
[fd 0, 1, 2, ...]             [refs | mode | pos_le | TI]     [refs | inode]
```

| Crida | Efecte a `TC` | Efecte a `TFA` (Oberta) | Efecte a `TI` (Inodes) |
| :--- | :--- | :--- | :--- |
| **`open(f, flags)`** | Ocupa el **menor `fd` lliure** | Crea **sempre una nova entrada** (`refs=1`, `pos=0`) | Crea entrada (`refs=1`) o fa **`refs++`** si ja existia |
| **`dup2(old, new)`** | `TC[new]` apunta a la mateixa TFA que `old` *(tanca `new` si cal)* | **`TFA.refs++`** | No canvia |
| **`fork()`** | El fill hereta **còpia exacta de `TC`** | **`TFA.refs++`** per cada canal apuntat | No canvia |
| **`pipe(p)`** | Ocupa 2 canals (`p[0]` lectura, `p[1]` escriptura) | Crea **2 entrades** (`r` i `w`), amb **`pos = '-'`** | Crea **1 inode temporal** amb **`refs = 2`** |
| **`pthread_create()`** | **No fa res** (tots els threads usen la mateixa `TC`) | **No fa res** | **No fa res** |
| **`close(fd)`** | Allibera `TC[fd]` | `TFA.refs--`; si arriba a `0`, s'allibera | Si `TFA` s'allibera $\Rightarrow$ `TI.refs--` (i si és 0, s'allibera) |

* **`read`/`write` en fitxer vs pipe:** en fitxer regular modifiquen `pos_le` a la `TFA` (i `write` pot actualitzar mida/blocs/data a `TI`); en una pipe **`pos_le` val `'-'` i NO canvia a la `TFA`** *(els exàmens solen considerar que un `write` actualitza la data d'accés a la `TI`)*.

### Les 3 trampes mortals de Pipes i FIFOs (Deadlocks i EOF)
1. **No arriba mai EOF (`read()` penjat per sempre):** Després de `fork()`, el pare o el procés lector ha oblidat tancar el canal d'escriptura `p[1]`. Mentre quedi 1 canal d'escriptura obert al sistema, la pipe **no envia EOF**.
2. **Obrir una FIFO amb `O_RDWR`:** El mateix procés passa a constar alhora com a lector i **possible escriptor**! Això impedeix que rebi EOF quan l'altre procés tanqui, o fa que un procés que només escriu es bloquegi en omplir-se sense rebre `SIGPIPE`.
3. **Obrir una FIFO abans del `fork()`:** `open("fifo", O_RDONLY)` bloqueja fins que algú l'obri en `O_WRONLY` (i viceversa). Si ho fas **abans** de crear l'altre procés, el programa es bloqueja abans de fer el `fork()`.
* **Concurrència vs determinisme en pipes:** Múltiples fills escrivint alhora a la mateixa pipe barregen bytes de forma **no determinista**; un pare llegint seqüencialment de dues pipes diferents manté ordre determinista.

---

## 9. Sistema de Fitxers físic (Inodes, Blocs, Links i Buffer Cache)

Quan l'examen demana taules d'inodes i blocs de dades a disc o comptar accessos de `open()`:

1. **Comptador `#enllaços` d'un directori:** Sempre val **`2 + nombre_de_subdirectoris`** (l'entrada `.` dins seu + el seu nom al directori pare + l'entrada `..` de cada fill immediat).
2. **Hard links vs Soft links:**
   * **Hard link (`ln`)**: mateix número d'inode (`#enllaços++`). Prohibit sobre directoris i entre particions.
   * **Soft link (`ln -s`)**: nou inode tipus `l` (`#enllaços = 1`). Si la ruta és curta es desa *inline* dins l'inode (**`0` blocs de dades**); si és llarga ocupa **`1` bloc de dades**.
   * **`chmod` sobre un *soft link*:** Canvia els permisos del **fitxer destí**, mai del propi link!
3. **Resolució de camins + *Buffer Cache*:**
   * Cada salt d'un path alterna `Inode directori -> Bloc de Dades del directori`.
   * Si en resoldre un *soft link* la seva ruta comença per **`/` (ruta absoluta)**, el Kernel torna a començar des de l'inode arrel `/` (`I0`). Si hi ha **Buffer Cache**, les segones visites a `I0` i al seu bloc són **hits de memòria** (no toquen disc).
4. **Càlcul de blocs, `lseek` i mida màxima real:**
   * Blocs ocupats per un fitxer: $\lceil \text{mida} / \text{mida\_bloc} \rceil$.
   * `lseek(fd, 0, SEEK_END)` **consulta l'inode** per llegir-ne la mida; `SEEK_SET`/`SEEK_CUR` només toquen la `TFA`.
   * **Trampa de mida màxima:** Encara que els índexs de l'inode (directes + indirectes simples/dobles/triples) donin per a diversos TiB, si el camp `pos_le` de la **`TFA`** és de **32 bits (4 bytes)**, la mida màxima real queda limitada a **$2^{32}$ bytes (4 GiB)**.
5. **`unlink` (`rm`) vs `close()`:**
   * `unlink` només modifica el bloc de directori pare i fa `#enllaços--`. **No toca `TC`, `TFA` ni `TI`!**
   * Els blocs i l'inode no s'alliberen fins que **`#enllaços == 0` i `TI.refs == 0`** (si algun procés el té obert, segueix podent llegir fins que faci `close`).

---

## 10. Threads i Mutexes (Tema 7 — novetat a QP25-26)

* **ULT vs KLT (*Sw threads*):** Amb *User-Level Threads*, el Kernel només veu 1 procés $\Rightarrow$ si un ULT fa una crida bloquejant (`read`, `waitpid`), **bloqueja tot el procés**. Amb *Kernel-Level Threads* (Pthreads a Linux), cada fil es planifica i es bloqueja de forma independent.
* **`fork()` vs `pthread_create()` sobre `TC / TFA / TI`:** `fork()` duplica la `TC` i fa `TFA.refs++`; **`pthread_create()` no modifica res** en cap de les tres taules (tots els threads comparteixen la mateixa `TC`; per llegir un mateix `fd` sense trepitjar `pos_le`, usa **`pread()`**).
* **Mort dins d'un mutex (*Deadlock*):** Si un thread mor o fa `pthread_exit()` mantenint un `pthread_mutex_lock` sense haver fet `unlock`, **el mutex queda bloquejat per sempre** i qualsevol altre thread que intenti entrar-hi es queda encallat infinitament.
* **`exit()` vs `pthread_exit()`:** `exit()` mata **tot el procés** (tots els threads); `pthread_exit()` acaba només el thread que el crida. En un procés multifil, `fork()` només clona al fill el thread que l'ha cridat.

---

## 11. Guia ràpida per al Final de Laboratori

En gairebé totes les convocatòries recents, l'estructura i rúbrica del Lab Final són fixes:
* **`Makefile` (0,5 pts):** Ha de generar tots els programes alhora (`all`), cadascun per separat, tenir `clean` (deixant només els `.c`/`.h`), i recompilar **només si han canviat les fonts**.
* **Control d'errors i `Usage()` (0,5 pts):** Valida arguments amb `Usage()` (a `stderr`, fd `2`) i comprova el retorn `< 0` (o `MAP_FAILED`) de **totes** les crides a sistema **excepte `write` per pantalla**.
* **Regla crítica a l'Exercici 1 (24-25 / 25-26):** Es valora el resultat d'execució (**100% / 75% si error no-SO / 0% directe si hi ha cap error de SO**).

### 1. Plantilla de `Makefile` multi-programa i `Usage()`
```makefile
all: prog1 prog2

prog1: prog1.c
	gcc -Wall -o prog1 prog1.c

prog2: prog2.c
	gcc -Wall -pthread -o prog2 prog2.c

clean:
	rm -f prog1 prog2 *.o
```
*(Important: les línies sota cada regla han de començar amb **TABULADOR**, mai amb espais.)*

```c
void Usage(char *nom) {
    char b[128];
    int len = sprintf(b, "Usage: %s <arg1>\n", nom);
    write(2, b, len);
    exit(1);
}
void error_y_exit(char *msg, int code) { perror(msg); exit(code); }
```

### 2. Esquelet segur de Signals (sense `sleep()` ni curses)
* **Prohibició típica:** gairebé sempre prohibeixen `sleep()`. Es substitueix amb **`alarm(seg)` + `sigsuspend(&mask)`** (espera passiva) o `volatile sig_atomic_t` si demanen espera activa explícita.
* **Un sol handler per múltiples senyals:** rep `int sig` i fa `switch (sig)` o `if (sig == SIGALRM) ...`.
* **Ignorar `SIGPIPE` i detectar `EPIPE`:**
  ```c
  struct sigaction sa = {0};
  sa.sa_handler = SIG_IGN;
  sigaction(SIGPIPE, &sa, NULL);
  // Després al write en pipe sense lectors:
  if (write(fd, &val, sizeof(int)) == -1) {
      if (errno == EPIPE) break; // Tots els lectors han tancat
      error_y_exit("write pipe", 2);
  }
  ```
* **Protegir `read()` d'`EINTR` (quan hi ha `Ctrl+C` / `SIGALRM`):**
  ```c
  while ((n = read(0, buf, sizeof(buf))) == -1 && errno == EINTR);
  ```

### 3. I/O binària, `lseek`, pipes/FIFOs i redireccions
* **Escriure/llegir enters en binari i accés directe:**
  ```c
  int v = 42;
  write(fd, &v, sizeof(int));                  // Escriptura binària (comprovable amb xxd / hexdump)
  off_t bytes = lseek(fd, 0, SEEK_END);        // Mida total -> elements = bytes / sizeof(int)
  lseek(fd, idx * sizeof(int), SEEK_SET);      // Salt directe a l'element 'idx'
  ```
* **Creació i truncat de fitxer:** `open(nom, O_WRONLY | O_CREAT | O_TRUNC, 0640)` *(revisa permisos octals a l'enunciat: `0600` = `rw-------`, `0640` = `rw-r-----`, `0644` = `rw-r--r--`, `0660` = `rw-rw----`)*.
* **Redirecció a qualsevol canal (`1`, `4`, `10`):** `dup2(fd, 10); close(fd);` (des de bash: `./prog 10> out.bin`).
* **FIFO en C tolerant si ja existeix:**
  ```c
  if (mkfifo("MIPIPE", 0660) == -1 && errno != EEXIST) error_y_exit("mkfifo", 2);
  ```
* **Pipes sense nom:** tanca **sempre** `p[0]` i `p[1]` sobrers a pare i fills just després de `dup2` i abans d'`exec`/`waitpid`.

### 4. Memòria dinàmica (`malloc`/`realloc`/`mmap`) i Pthreads al Lab
* **`mmap` anònim privat vs `malloc`:**
  ```c
  int *buf = mmap(NULL, n * sizeof(int), PROT_READ | PROT_WRITE,
                  MAP_PRIVATE | MAP_ANONYMOUS, -1, 0);
  if (buf == MAP_FAILED) error_y_exit("mmap", 2);
  // ... read / write amb buf ...
  if (munmap(buf, n * sizeof(int)) == -1) error_y_exit("munmap", 2);
  ```
* **Redimensionar sense `realloc` (quan el prohibeixen):** crea un vector nou amb `malloc(nova_mida)`, copia amb un `for`, i fes `free(vell)`.
* **Pthreads + `pread` + argument al heap:**
  ```c
  int *id = malloc(sizeof(int)); *id = i; // Cada thread té el seu punter propi (després fa free(arg))
  pthread_create(&th[i], NULL, worker, id);
  // Dins worker(): usar pread(fd, &c, 1, offset) i acumular en variable local abans de pthread_mutex_lock!
  ```

---

## Preguntes freqüents i respostes model del Final

1. **Per què la sortida d'un vector/variable no canvia al pare?**  
   *"Perquè pare i fill tenen espais d'adreces lògics totalment independents; les modificacions de memòria del fill mai són visibles pel pare."*
2. **Per què falla el tractament del senyal després d'un `execlp`?**  
   *"Perquè la mutació amb `exec` destrueix el codi de l'espai d'adreces i restableix tots els handlers capturats a l'acció per defecte (`SIG_DFL`)."*
3. **Per què aquest bucle `waitpid` fa $N+1$ iteracions?**  
   *"Perquè fa $N$ iteracions per alliberar cadascun dels $N$ fills zombis i una darrera iteració que retorna `-1` (`ECHILD`) en no quedar més fills."*
4. **Per què `sigsuspend` rep el senyal sense perdre'l?**  
   *"Perquè el senyal s'ha bloquejat prèviament abans del fork, mantenint-lo pendent, i `sigsuspend` substitueix la màscara i suspèn el procés de forma atòmica."*
5. **Per què `p[0] = 5;` no trenca el COW de la pàgina on viu `p`?**  
   *"Perquè `p[0] = 5` modifica el bloc de memòria del Heap (o `mmap`), no el valor de la variable punter `p` (a la Pila o Dades), així que la pàgina del punter segueix sense escriure's i compartida per COW."*
6. **Per què `maps` no mostra `libc.so` i com ajuda el *demand paging*?**  
   *"El binari s'ha compilat estàticament (`-static`). Gràcies al *demand paging*, el Kernel només carrega a RAM les pàgines de codi de biblioteca realment executades, estalviant memòria física i temps d'arrencada."*
7. **Per què aquest programa queda bloquejat en llegir d'una pipe/FIFO?**  
   *"O bé el pare/lector no ha tancat el descriptor d'escriptura, o bé s'ha obert la FIFO amb `O_RDWR`, de manera que el Kernel detecta un escriptor viu i `read()` es bloqueja indefinidament sense rebre mai EOF."*
8. **Quina diferència hi ha a `TC/TFA/TI` entre `fork()` i `pthread_create()`?**  
   *"`fork()` duplica la `TC` del pare i incrementa les `refs` de la `TFA` apuntades (sense tocar `TI`); en canvi, `pthread_create()` no afegeix ni modifica res en cap de les tres taules perquè tots els threads comparteixen la mateixa `TC` del procés."*
9. **Què passa si un de dos *Sw threads* mor dins d'una regió crítica protegida per un `pthread_mutex`?**  
   *"El mutex queda bloquejat i no s'allibera automàticament en morir el thread, de manera que l'altre thread quedarà bloquejat indefinidament en intentar fer `pthread_mutex_lock()`."*
