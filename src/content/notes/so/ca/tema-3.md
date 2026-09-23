---
title: "Tema 3: Exercicis d'Examen Resolts i Justificats"
description: "Resolució pas a pas de problemes d'examen de SO (QT i QP 2021-2025): jerarquies de processos recursius, aïllament de memòria en fork, depuració de senyals i timeout (patró watchdog), cues i Round Robin."
readTime: "22 min"
order: 3
draft: false
---

# 3. Exercicis d'examen resolts i justificats (Tema 1 i Tema 2)

::callout[type="info" title="Finalitat del Recull"]
Aquesta secció conté els exercicis més representatius dels exàmens parcials de Sistemes Operatius de la Facultat d'Informàtica de Barcelona (FIB - UPC) dels darrers cursos acadèmics (2021 a 2025), acompanyats de la justificació teòrica pas a pas i diagrames d'execució.
::

---

## Exercici 1: Jerarquia de processos en cadena, concurrència i determinisme

::callout[type="info" title="Parcial QT 2024-2025, Ex. 3"]
Es mostren els codis font de `ProgA.c` i `ProgB.c` (sense comprovació de codis d'error per simplificar). Des del terminal del sistema executem la comanda:
`./ProgA 2 3`
::

### Codis font del problema

```c
/* ProgA.c */
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/wait.h>
#include <string.h>

void func(); // Còmput de temps indeterminat

int main (int argc, char *argv[]) {
    char buf[80]; 
    int ret = 0, nprocs = 0, status;
    int n = atoi(argv[1]);

    for (int i = 0; i < n; i++) {
        ret = fork();
        if (ret == 0) {
            execlp("./ProgB", "./ProgB", argv[2], NULL);
            exit(1);
        }
        func(); // Còmput de durada desconeguda
        /* CHECKPOINT A */
        ret = waitpid(-1, &status, 0);
        if (WIFEXITED(status)) {
            nprocs = WEXITSTATUS(status);
            sprintf(buf, "Iter %d: Llib %d\n", i, nprocs);
            write(1, buf, strlen(buf));
        }
    }
    exit(0);
}
```

```c
/* ProgB.c */
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/wait.h>
#include <string.h>

int main (int argc, char *argv[]) {
    char buf[80]; 
    int ret = 0, status = 0, nprocs = 0;
    int n = atoi(argv[1]);

    if (n > 0) {
        ret = fork();
        if (ret == 0) {
            sprintf(buf, "%d", (n - 1));
            execlp("./ProgB", "./ProgB", buf, NULL);
            exit(1);
        }
        if ((ret = waitpid(-1, &status, 0)) > 0) {
            if (WIFEXITED(status))
                nprocs = WEXITSTATUS(status);
        }
    }
    /* CHECKPOINT B */
    nprocs += 1;
    sprintf(buf, "ProgB(%d): val %d\n", getpid(), nprocs);
    write(1, buf, strlen(buf));
    exit(nprocs);
}
```

---

### Apartat a) Dibuixeu la jerarquia de processos que es genera al sistema

El procés pare inicial $P_0$ (`ProgA`) s'executa amb paràmetre $n = 2$, de manera que el seu bucle fa exactament **2 iteracions**.

* A la **Iteració 0**, $P_0$ fa un `fork()` creant el procés fill $P_1$, el qual commuta mitjançant `execlp()` a `ProgB` amb paràmetre `"3"`.
* Dins de `ProgB 3`, com que $n = 3 > 0$, $P_1$ fa un `fork()` creant $P_2$, que muta a `ProgB 2`.
* Aquest procés recursiu continua creant una cadena vertical fins que s'arriba a $P_4$ amb paràmetre `"0"`, que no fa més forks.
* Un cop acabada la primera branca i recollit el resultat amb `waitpid()`, el procés $P_0$ entra a la **Iteració 1** i replica exactament la mateixa cadena de processos ($P_5 \rightarrow P_6 \rightarrow P_7 \rightarrow P_8$).

```text
                            ┌──────────────┐
                            │ P0 (ProgA)   │
                            │ (Iteració 0) │
                            └──────┬───────┘
                     Iter 0        │        Iter 1
             ┌─────────────────────┴─────────────────────┐
             ▼                                           ▼
      ┌──────────────┐                            ┌──────────────┐
      │  P1 (B: 3)   │                            │  P5 (B: 3)   │
      └──────┬───────┘                            └──────┬───────┘
             │ fork()                                    │ fork()
             ▼                                           ▼
      ┌──────────────┐                            ┌──────────────┐
      │  P2 (B: 2)   │                            │  P6 (B: 2)   │
      └──────┬───────┘                            └──────┬───────┘
             │ fork()                                    │ fork()
             ▼                                           ▼
      ┌──────────────┐                            ┌──────────────┐
      │  P3 (B: 1)   │                            │  P7 (B: 1)   │
      └──────┬───────┘                            └──────┬───────┘
             │ fork()                                    │ fork()
             ▼                                           ▼
      ┌──────────────┐                            ┌──────────────┐
      │  P4 (B: 0)   │ (Cas base)                 │  P8 (B: 0)   │ (Cas base)
      └──────────────┘                            └──────────────┘
```

---

### Apartat b) Podem saber quants processos estan vius al CHECKPOINT A i al CHECKPOINT B?

* **CHECKPOINT A:** **No es pot saber amb certesa.**
  * *Justificació:* La crida `func()` té un temps d'execució impredictible. Depenent de si `func()` triga molt o poc respecte a la velocitat dels fills de la branca de `ProgB`, aquests fills podrien seguir tots vius executant-se en paral·lel, o bé haver acabat tots i estar en estat `ZOMBIE` esperant que $P_0$ cridi a `waitpid()`. Per tant, el nombre exacte de processos vius és indeterminat.
* **CHECKPOINT B:** **Sí, podem saber-ho amb total exactitud: hi ha 5 processos vius.**
  * *Justificació:* El primer procés de tot el sistema que arriba físicament al CHECKPOINT B és el fulla de la jerarquia: $P_4$ (que té paràmetre $n = 0$ i per tant no fa cap `waitpid`). En aquell instant precís:
    1. $P_0$ està viu (executant `func()` o esperant a `waitpid`).
    2. $P_1, P_2, P_3$ estan tots tres **vius però bloquejats** a la seva crida `waitpid(-1, &status, 0)`, esperant cadascun el seu fill respectiu.
    3. $P_4$ està viu executant la línia de codi del CHECKPOINT B.
    4. Total de processos vius: $1 + 3 + 1 = \mathbf{5\text{ processos}}$.

---

### Apartat c) L'ordre dels missatges per pantalla serà sempre el mateix si repetim l'execució?

**Sí, l'ordre és estrictament determinista.**

* *Justificació conceptual:* Cada procés pare de la cadena `ProgB` té una crida `waitpid(-1, &status, 0)` amb paràmetre `options = 0` (**bloquejant**) just després de crear el fill. Això impedeix que qualsevol pare pugui executar el seu `printf`/`write` abans que el seu descendent directe hagi mort i lliurat el seu valor d'acabada.
* Per tant, les línies s'imprimeixen forçosament **en ordre ascendent de baix a dalt**:
  $$\text{Branca 1: } P_4 \longrightarrow P_3 \longrightarrow P_2 \longrightarrow P_1 \longrightarrow P_0 \text{ (Iter 0)}$$
  $$\text{Branca 2: } P_8 \longrightarrow P_7 \longrightarrow P_6 \longrightarrow P_5 \longrightarrow P_0 \text{ (Iter 1)}$$

---

### Apartat d) Quin canvi caldria fer a la línia de `waitpid` de `ProgB.c` per no bloquejar mantenint el mateix resultat?

Substituir el `if` per un bucle d'espera activa utilitzant el flag `WNOHANG`:

```c
while ((ret = waitpid(-1, &status, WNOHANG)) == 0);
```

* *Justificació:* La constant `WNOHANG` fa que `waitpid` retorni immediatament `0` si el fill encara segueix viu. En tancar la crida dins d'un bucle `while(ret == 0);`, el procés fa comprovacions contínues (espera activa) fins que el fill mor i la crida retorna el seu PID positiu ($>0$), desbloquejant el bucle i preservant la sincronització exacta.

---

## Exercici 2: Estat del PCB, herència en el fork i aïllament de memòria

::callout[type="info" title="Parcial QP 2024-2025, Ex. 2"]
Exercici sobre les propietats estructurals del PCB i l'impacte de la duplicació d'espais de memòria.
::

### Apartat a) Indiqueu justificadament quins dels següents camps del PCB s'hereten al fer un `fork()`: PID, temps de CPU, màscara de senyals bloquejats, senyals pendents, taula d'accions de senyals, espai d'adreces de memòria.

* **NO s'hereten (s'inicialitzen de nou):**
  1. ==PID==: És l'identificador únic del procés al sistema; dos processos diferents mai poden compartir el mateix PID.
  2. ==Temps de CPU consumit==: És un comptador d'ús de recursos propi de cada procés; el fill és una entitat nova i comença sempre des de zero.
  3. ==Senyals pendents==: Els senyals s'adrecen a un PID concret; el fill comença la seva execució amb la llista de senyals pendents buida.
* **SÍ s'hereten:**
  1. ==Màscara de senyals bloquejats==: El fill hereta les mateixes restriccions de protecció que tenia configurades el pare.
  2. ==Taula d'accions de senyals==: Manté les mateixes rutines de tractament (*handlers*) associades a cada senyal.
  3. ==Espai d'adreces de memòria==: El fill rep una còpia privada exacta del contingut dels segments de memòria del pare (pila, dades i heap).

---

### Apartat b) En un instant determinat tenim 6 processos en estat RUN, 1 en ZOMBIE i 1 en READY. Quantes CPUs té com a mínim el sistema?

**Té com a mínim 6 CPUs (o nuclis físics).**

* *Justificació:* Per definició del model d'estats del sistema operatiu, un procés només pot trobar-se en l'estat **`RUN`** si està sent executat físicament sobre una unitat de processament (*core*) en aquell instant concret de temps. Com que tenim 6 processos simultanis en estat `RUN`, és físicament indispensable disposar d'un mínim de 6 unitats de processament independents per suportar-los. Els processos en `READY` i `ZOMBIE` no ocupen CPU.

---

### Apartat c) Analitzeu el següent codi en C on `PIDS[10]` i `results[10]` són arrays globals inicialitzats a 0

```c
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

int PIDS[10] = {0};
int results[10] = {0};

void child_func(int i) {
    PIDS[i] = getpid();
    results[i] = 5000 + i;
    exit(results[i]);
}

int main() {
    for (int i = 0; i < 10; i++) {
        if (fork() == 0) child_func(i);
    }
    for (int i = 0; i < 10; i++) {
        while (results[i] == 0); // Espera que el fill escrigui el resultat
        printf("Proces %d amb PID %d acaba amb valor %d\n", i, PIDS[i], results[i]);
    }
}
```

**Què veurem per pantalla en executar aquest codi? Raoneu conceptualment la resposta.**

**Resposta:** **No es veurà absolutament res per pantalla: el programa queda congelat per sempre en un bucle infinit.**

* *Justificació conceptual:* La crida `fork()` crea espais d'adreces lògics **totalment independents i aïllats** per a cadascun dels processos fills. Quan el procés fill $i$ executa `results[i] = 5000 + i`, està modificant exclusivament la posició de memòria de la **seva pròpia còpia privada de dades**.
* L'espai de memòria del procés pare no pateix cap alteració; per tant, per al pare, `results[0]` continuarà valent indefectiblement `0`. En arribar a la línia `while (results[0] == 0);`, la condició serà permanentment certa i el pare quedarà atrapat en aquest bucle d'espera infinita sense arribar mai a la sentència `printf`.

---

## Exercici 3: El patró watchdog / timeout i depuració d'errors de senyals

::callout[type="info" title="Parcial QP 2024-2025, Ex. 3"]
Es vol implementar un programa que executi un procés fill (`./altreprograma 1`) i forci la seva mort amb `SIGKILL` si triga més de 15 segons, comptabilitzant el pas del temps mitjançant `alarm(1)` i `sigsuspend()`.
::

### Codi inicial amb errors greus

```c
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <signal.h>

int pid; 
int t = 0, fill_done = 0;

void ras(int s) {
    if (s == SIGALRM) { 
        t++; 
        alarm(1); 
    } else {
        fill_done = 1;
    }
}

int main() {
    struct sigaction sa;
    sa.sa_handler = ras;
    sigemptyset(&sa.sa_mask);
    sa.sa_flags = 0;
    sigaction(SIGALRM, &sa, NULL);
    sigaction(SIGCHLD, &sa, NULL);

    pid = fork();
    alarm(1); // ERROR 1

    if (pid == 0) {
        execlp("./altreprograma", "./altreprograma", "1", NULL);
    } else {
        sigset_t set;
        sigfillset(&set);
        sigdelset(&set, SIGCHLD); // ERROR 2

        while (!fill_done && t < 15) {
            sigsuspend(&set);
        }
        alarm(0);
        if (!fill_done) kill(pid, SIGKILL);
    }
}
```

---

### Apartat a) Error 1: En executar el codi, el fill sempre mor al cap d'1 segon. Què succeeix i com s'arregla només reordenant línies?

* **Causa de l'error:** La comanda `alarm(1)` està situada abans del bloc de bifurcació condicional `if (pid == 0)`. Això provoca que **tant el pare com el fill activin una alarma a 1 segon**. Quan el fill muta mitjançant `execlp()`, el temporitzador continua corrent, però `exec` **restableix automàticament totes les rutines de tractament de senyals a la seva acció per defecte (`SIG_DFL`)**. Com que l'acció per defecte de `SIGALRM` és finalitzar el procés, en expirar el segon el fill és assassinat pel propi kernel.
* **Solució:** Desplaçar la instrucció `alarm(1);` a l'interior del bloc `else`, de manera que només la configuri el procés pare.

---

### Apartat b) Error 2: Arreglat l'error anterior, el programa es bloqueja durant 25 segons i indica que el fill ha trigat 1 segon. Què passa i com s'arregla?

* **Causa de l'error:** La màscara `set` que es transmet a `sigsuspend(&set)` s'ha inicialitzat amb `sigfillset` (tots els senyals bloquejats) i només s'ha desbloquejat `SIGCHLD` (`sigdelset(&set, SIGCHLD)`). Per tant, **el senyal `SIGALRM` està bloquejat a l'espera**.
  * Quan expira el temporitzador de cada segon, el senyal queda retingut al bitmap de pendents i **mai desperta el `sigsuspend`**.
  * En conseqüència, la variable `t` mai s'incrementa. El pare queda immobilitzat al `sigsuspend` fins que el fill acaba el seu cicle de 25 segons i li envia el `SIGCHLD` (que sí que està desbloquejat).
* **Solució:** Afegir a la màscara d'espera la desprotecció del senyal d'alarma:
  ```c
  sigdelset(&set, SIGALRM);
  ```

---

### Apartat c) Condició de cursa (*race condition*): Com s'assegura que no es perdi cap senyal abans d'entrar a `sigsuspend`?

Cal **bloquejar prèviament els senyals `SIGALRM` i `SIGCHLD` al principi del programa** (abans d'invocar `fork()`) mitjançant:

```c
sigset_t mask;
sigemptyset(&mask);
sigaddset(&mask, SIGALRM);
sigaddset(&mask, SIGCHLD);
sigprocmask(SIG_BLOCK, &mask, NULL);
```

* *Justificació:* Si el fill acabés de forma instantània abans que el pare hagués tingut temps d'executar el bucle i entrar a `sigsuspend`, el `SIGCHLD` arribaria amb el procés desprotegit. Si el senyal està blocat des del principi a la màscara del procés, quedarà retingut com a pendent i serà lliurat de forma atòmica i immediata quan `sigsuspend` canvii la màscara.

---

## Exercici 4: Traça de senyals multiplexats i origen de missatges

::callout[type="info" title="Parcial QT 2024-2025, Ex. 2"]
Un procés executa el següent fragment de codi on prèviament s'han blocat tots els senyals:
::

```c
sigfillset(&mask);
sigprocmask(SIG_SETMASK, &mask, NULL);

sa.sa_handler = ras;
sa.sa_flags = 0;
sigemptyset(&sa.sa_mask);
sigaddset(&sa.sa_mask, SIGUSR2); // Bloqueja SIGUSR2 DURANT el handler

sigaction(SIGUSR1, &sa, NULL);
sigaction(SIGHUP,  &sa, NULL);

kill(getpid(), SIGHUP);  // L17
kill(getpid(), SIGCHLD); // L18
kill(getpid(), SIGUSR1); // L19
```

---

### Apartat a) Quina serà la sortida per pantalla i com queda el bitmap de senyals pendents després de cada `kill`?

* **Sortida per pantalla:** **Cap ni una.** Atès que tots els senyals es troben emmascarats per la instrucció `sigprocmask(SIG_SETMASK, &mask, NULL)`, cap dels senyals emesos pot ser lliurat a la rutina `ras`.
* **Evolució del bitmap de senyals pendents:**
  1. Després de la línia 17: El senyal `SIGHUP` s'activa com a pendent.
  2. Després de la línia 18: Els senyals `SIGHUP` i `SIGCHLD` estan actius com a pendents.
  3. Després de la línia 19: Els senyals `SIGHUP`, `SIGCHLD` i `SIGUSR1` estan tots tres pendents de ser atesos.

---

### Apartat b) Si el procés s'atura a continuació en un `sigsuspend` que només té bloquejat `SIGPIPE`, en quin ordre s'atendran els senyals?

1. En entrar al `sigsuspend`, el nucli detecta els senyals pendents i lliura primer el **`SIGHUP`** (per ordre d'arribada temporal o prioritat estàndard).
2. En començar la rutina de tractament de `SIGHUP`, el sistema operatiu bloqueja automàticament:
   * El propi senyal `SIGHUP` (mecanisme d'autobloqueig).
   * Els senyals especificats a `sa.sa_mask` (en aquest cas, `SIGUSR2`).
3. No obstant això, observem que el senyal `SIGUSR1` **no està inclòs a la `sa_mask` ni tampoc bloquejat per `sigsuspend`**.
4. Per tant, **`SIGUSR1` interromp immediatament l'execució de la rutina de `SIGHUP`**, executa el seu propi handler de forma aniuada i, un cop acabat, es reprèn la finalització de la rutina de `SIGHUP`.

---

### Apartat c) Si un programa mor a causa d'un senyal `SIGUSR1` que no s'ha capturat, qui escriu per la consola el missatge `"User defined signal 1"`?

El missatge és imprès exclusivament per la **shell** (l'intèrpret d'ordres com `bash` o `zsh`), i **no pas pel programa ni pel kernel directament**:

* *Justificació:* Quan el programa mor de forma sobtada per un senyal, el procés queda en estat `ZOMBIE`. La shell que estava fent un `waitpid()` bloquejant sobre el nostre programa rep el codi de notificació, detecta mitjançant la macro `WIFSIGNALED(status)` que el programa ha mort per violència d'un senyal no capturat, consulta el número del senyal amb `WTERMSIG(status)` i escriu per pantalla la descripció del senyal a la consola.

---

## Exercici 5: Qüestions curtes clàssiques de teoria de SO i kernel

::callout[type="info" title="Recull de conceptes clau (Parcials 2021 a 2025)"]
Preguntes curtes de raonament teòric habituals en les proves d'avaluació.
::

### a) [Parcial QT 2024-2025, Ex. 1.e] Quines crides a sistema provoquen SEMPRE un canvi d'estat en el procés que les executa?

1. **`exit()`:** Passa el procés de **`RUN` a `ZOMBIE` en el 100% dels casos**.
2. **`sigsuspend()`:** Passa el procés de **`RUN` a `BLOCKED` sempre** de forma ineludible (fins que arribi un senyal que el desperti).
* *Comentari sobre `waitpid()`:* La crida `waitpid()` **no provoca sempre** un canvi d'estat: si el fill ja ha finalitzat prèviament i es troba en estat `ZOMBIE`, la crida recull el resultat immediatament sense que el pare hagi d'abandonar l'estat `RUN`.

---

### b) [Parcial QT 2023-2024, Ex. 2.b] En un planificador Round Robin amb 3 processos i un quàntum de 10 ms, és possible que un mateix procés s'arribi a executar dos cops en menys de 30 ms?

**Sí, és perfectament possible.**

* *Raonament:* El límit temporal teòric de $(N - 1) \cdot Q = 2 \cdot 10\text{ ms} = 20\text{ ms}$ assumeix que tots els processos exhaureixen el seu quàntum de CPU complet.
* Si algun dels altres dos processos fa una crida a sistema bloquejant d'E/S (com ara llegir de disc o del teclat) al cap de només $1\text{ ms}$ d'haver començat, aquest procés allibera voluntàriament la CPU passant a l'estat `BLOCKED`.
* El planificador assignarà la CPU immediatament al següent procés, de manera que el primer procés pot tornar a rebre el control de la CPU molt abans que hagin transcorregut 30 ms.

---

### c) [Parcial QT 2024-2025, Ex. 1.d] Quins senyals ens poden treure SEMPRE d'un `sigsuspend` que té configurada una màscara plena (`sigfillset`)?

Únicament els senyals **`SIGKILL` i `SIGSTOP`**.

* *Raonament:* `SIGKILL` (terminació forçosa) i `SIGSTOP` (aturada d'execució) són senyals absoluts de control del sistema operatiu que estan protegits pel nucli. El kernel té prohibit per disseny que cap procés els pugui bloquejar, emmascarar o associar a cap rutina de tractament (`sigaction`). Per tant, fins i tot amb una màscara totalment plena de bits a 1, la recepció d'un d'aquests dos senyals té efecte immediat per sobre de la màscara.
