---
title: "Parcial SO"
description: "Resum clau de teoria per al parcial de Sistemes Operatius."
readTime: "25 min"
order: 5
draft: false
isNew: true
---

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

## Preguntes freqüents dels parcials

Per obtenir la màxima puntuació a cada pregunta:

1. **Per què la sortida d'un vector/variable no canvia al pare?**  
   *"Perquè pare i fill tenen espais d'adreces lògics totalment independents; les modificacions de memòria del fill mai són visibles pel pare."*
2. **Per què falla el tractament del senyal després d'un `execlp`?**  
   *"Perquè la mutació amb `exec` destrueix el codi de l'espai d'adreces i restableix tots els handlers capturats a l'acció per defecte (`SIG_DFL`)."*
3. **Per què aquest bucle `waitpid` fa $N+1$ iteracions?**  
   *"Perquè fa $N$ iteracions per alliberar cadascun dels $N$ fills zombis i una darrera iteració que retorna `-1` (`ECHILD`) en no quedar més fills."*
4. **Per què `sigsuspend` rep el senyal sense perdre'l?**  
   *"Perquè el senyal s'ha bloquejat prèviament abans del fork, mantenint-lo pendent, i `sigsuspend` substitueix la màscara i suspèn el procés de forma atòmica."*
