---
title: "Tema 4: Signals"
description: "Gestió avançada de senyals."
readTime: "25 min"
order: 4
draft: false
isNew: true
---
Els senyals són el mecanisme bàsic de comunicació asíncrona entre processos i el Kernel. Tota la seva gestió s'integra directament a la fitxa d'identitat de cada procés ([PCB a Tema 3](./so-tema-3)), mitjançant la taula d'accions, el bitmap de senyals pendents i la màscara de bloqueig.

## 4.1 Concepte de Signal

Un signal és una notificació asíncrona que el Sistema Operatiu (o un altre procés) envia a un procés. Cada signal té un número i un nom (`SIGALRM`, `SIGKILL`, `SIGINT`, etc.).

:::shellviz{command="kill -l" suggestions="kill -l,man 7 signal" title="Terminal — Llistar tots els senyals disponibles amb el seu número i nom (kill -l)"}
:::

Quan un procés rep un signal, pot passar una de 3 coses:
- **Acció per defecte:** Normalment acabar el procés (com fa `SIGKILL` o `SIGALRM`), ignorar-lo (com `SIGCHLD`) o parar-lo (`SIGSTOP`).
- **Ignorar-lo:** No fer res (compte: `SIGKILL` i `SIGSTOP` no es poden ignorar).
- **Capturar-lo/Reprogramar-lo:** Executar una funció pròpia (funció de tractament / signal handler) amb `sigaction`.

**Màscara de signals:** Conjunt de signals que el procés té bloquejats temporalment. Si arriba un signal bloquejat, queda pendent fins que es desbloqueja.  
**`sigsuspend(&mask):`** Crida atòmica que canvia la màscara de signals del procés per la nova màscara i bloqueja el procés a l'espera que arribi un signal no bloquejat.

### Taula de senyals
| Senyal | Codi | Què fa per defecte? | Què el provoca? | Es pot capturar o bloquejar? |
| :--- | :---: | :---: | :--- | :---: |
| **`SIGINT`** | 2 | Acaba el programa | Prems `Ctrl+C` a la terminal. | Sí |
| **`SIGKILL`** | 9 | Acaba el programa immediatament | Ordre de matar el procés. |  **MAI** (imparable) |
| **`SIGSTOP`** | 19 | Congela el procés (STOPPED) | Ordre de pausar el procés. |  **MAI** (imparable) |
| **`SIGCONT`** | 18 | Descongela el procés | Reactiva un procés pausat per `SIGSTOP`. | Sí |
| **`SIGALRM`** | 14 | Acaba el programa | S'esgota un compte enrere per programari (`alarm(segons)`). | Sí |
| **`SIGCHLD`** | 17 | **Ignorar (no fa res)** | Un procés fill ha acabat o s'ha aturat. | Sí |
| **`SIGSEGV`** | 11 | Acaba el programa (*Dump*) | Has intentat tocar memòria prohibida (punter nul). | Sí |
| **`SIGUSR1`** | 10 | Acaba el programa | Senyal lliure perquè el programador el faci servir per al que vulgui. | Sí |
| **`SIGUSR2`** | 12 | Acaba el programa | Segon senyal lliure per al programador. | Sí |

---

## 4.2 Com gestiona el procés un senyal? 

:::signalpcbviz
:::

Quan arriba un senyal, el Kernel consulta aquestes 4 estructures guardades a la fitxa (PCB) del procés seguint aquest ordre:

1. **Filtre inicial $\rightarrow$ Màscara de bloqueig**:
   * Si el senyal està a la màscara, està "retingut" temporalment i **no s'executa ara**.
2. **Bústia d'espera $\rightarrow$ Bitmap de pendents**:
   * On s'apunten els senyals retinguts (bit a `1`).
   * **No és un comptador**: si reps 5 cops el mateix senyal mentre està bloquejat, els repetits es descarten. En desbloquejar-lo només s'executarà **1 cop**.
3. **Què fem quan s'atén $\rightarrow$ Taula d'accions**:
   * Si el senyal no està bloquejat (o en el moment de desbloquejar-se), es mira quina resposta té configurada:
     * `SIG_DFL`: L'acció per defecte de Linux (morir, congelar-se o ignorar).
     * `SIG_IGN`: Ignorar-lo (es descarta).
     * Funció pròpia: El Kernel salta a executar la funció de C (`handler`) que hem programat.
4. **I les alarmes? $\rightarrow$ Temporitzador d'alarma**:
   * Un compte enrere intern que, en arribar a 0, envia un senyal `SIGALRM` al propi procés. Només hi ha **1 alarma activa per procés** (programar-ne una de nova cancel·la l'anterior).

---

## 4.3 Crides a sistema de senyals

### 1. Enviar un senyal: `kill(pid, senyal)`

:::killviz
:::

Envia qualsevol senyal al procés amb identificador `pid_desti` (no només serveix per matar, serveix per enviar qualsevol senyal):
```c
kill(pid_desti, SIGINT);  // Envia un Ctrl+C al procés
kill(pid_desti, SIGKILL); // Mata el procés forçosament
kill(pid_desti, SIGUSR1); // Envia el senyal d'usuari 1 (definit pel programador)
```
* Des de la terminal:
  * **Comanda `kill`**: `kill -KILL 1234` o pel seu codi numèric `kill -9 1234`. Per convenció a la línia d'ordres es treu el prefix `SIG` (`-KILL`, `-ALRM`, `-INT`).
  * **Comanda `killall`**: Envia el senyal buscant pel nom de l'executable en lloc del PID: `killall -KILL alarm1` o `killall -9 alarm1`.
  * **Qui mostra els missatges de mort?**: Si un procés s'atura o mor a causa d'un senyal no capturat (com `SIGALRM` o `SIGKILL`), el text que apareix a la pantalla (`Alarm clock`, `Killed` o `Segmentation fault`) el mostra **el propi Shell** després de recollir l'estat del fill amb `waitpid()`.

### 2. Canviar la resposta d'un senyal: `sigaction()`

:::sigactionviz
:::

Configura què ha de fer el procés quan rep un senyal determinat (ex: quan rebi `SIGINT` en lloc de morir):
```c
struct sigaction tractament;
tractament.sa_handler = la_meva_funcio; // La funció en C que s'executarà
sigemptyset(&tractament.sa_mask);        // No bloquegis cap altre senyal mentre s'atén
tractament.sa_flags = 0;

// Ara, en prémer Ctrl+C (SIGINT), s'executarà la_meva_funcio en lloc de tancar el programa:
sigaction(SIGINT, &tractament, NULL);
```

Els dos flags clau de `sa_flags`:
* **`SA_RESETHAND`**: S'atén el senyal un sol cop amb la teva funció; immediatament després, l'acció torna a la per defecte (`SIG_DFL`). Un segon senyal matarà el programa.
* **`SA_RESTART`**: Si el programa estava aturat en una lectura (`read`) o espera (`waitpid`) i arriba el senyal, un cop executada la teva funció, **la lectura es reprèn automàticament** sense retornar error.

### 3. Gestionar màscares de bloqueig (`sigset_t`)

:::sigprocmaskviz
:::

`sigset_t` és el **tipus de dades que representa un conjunt (*set*) de senyals**. Internament, a nivell de sistema operatiu, no és més que un **vector de bits (*bitmap*)**. Cada posició del bit correspon al número d'un senyal concret:

* Si el bit està a `1` $\rightarrow$ el senyal està inclòs al conjunt.
* Si el bit està a `0` $\rightarrow$ el senyal no hi és.

Com que és un tipus opac (no modifiquem els bits manualment amb `|` o `&`), POSIX ens dona una família de funcions per gestionar-lo:

| Funció | Què fa | Equivalent lògic |
| :--- | :--- | :--- |
| `sigemptyset(&mask)` | Buida el conjunt (tots els bits a `0`) | Conjunt buit $\emptyset$ |
| `sigfillset(&mask)` | Omple el conjunt amb **tots** els senyals possibles (tots a `1`) | Univers de senyals |
| `sigaddset(&mask, SIGALRM)` | Afegeix un senyal concret al conjunt | Posa a `1` el bit de `SIGALRM` |
| `sigdelset(&mask, SIGALRM)` | Treu un senyal del conjunt | Posa a `0` el bit de `SIGALRM` |
| `sigismember(&mask, SIGALRM)` | Comprova si un senyal és dins del conjunt | Retorna 1 si hi és, 0 si no |

Exemple d'ús:
```c
sigset_t mascara;
sigemptyset(&mascara);         // Inicialitza la màscara buida
sigaddset(&mascara, SIGINT);   // Afegeix SIGINT a la llista de bloquejats
sigdelset(&mascara, SIGINT);   // Treu SIGINT de la llista
```

### 4. **Modificar la màscara amb `sigprocmask()`**:
  ```c
  int sigprocmask(int how, const sigset_t *set, sigset_t *oldset);
  ```

  Paràmetres:
  * **`how`**: L'operació que volem fer sobre la màscara actual del procés:

    | Opció (`how`) | Comportament | Operació sobre la màscara |
    | :--- | :--- | :---: |
    | **`SIG_BLOCK`** | Afegeix els senyals de `set` als que ja estaven bloquejats. | $\text{màscara} \cup \text{set}$ |
    | **`SIG_UNBLOCK`** | Desbloqueja els senyals de `set` (els treu de la màscara). | $\text{màscara} \setminus \text{set}$ |
    | **`SIG_SETMASK`** | **Sobreescriu** tota la màscara del procés amb `set` tal qual. | $\text{màscara} = \text{set}$ |

  * **`set`**: Punter al conjunt de senyals amb què volem operar (si és `NULL`, no es modifica res, només serveix per consultar).
  * **`oldset`**: Si no és `NULL`, el Kernel hi copia la **màscara anterior** que tenia el procés just abans del canvi (molt útil per guardar-la i restaurar-la després). Si no ens interessa guardar-la, es passa `NULL`.

  ```c
  sigset_t mask, old_mask;
  sigemptyset(&mask);
  sigaddset(&mask, SIGALRM);

  // Bloqueja SIGALRM i guarda la màscara anterior a old_mask:
  sigprocmask(SIG_BLOCK, &mask, &old_mask);

  // ... secció crítica on no volem ser interromputs per SIGALRM ...

  // Restaura la màscara tal com estava abans:
  sigprocmask(SIG_SETMASK, &old_mask, NULL);
  ```

### 5. Esperar un senyal de forma segura: `sigsuspend()`

:::sigsuspendviz
:::

```c
sigsuspend(&mascara);
```
Atura el procés i l'adorm fins que arriba un senyal que **no estigui a `mascara`**.  
Quan arriba el senyal, s'executa la funció d'atenció, i tot seguit `sigsuspend` acaba i **restaura automàticament la màscara que el procés tenia abans**.

### 6. Programar un temporitzador: `alarm(segons)`

:::alarmviz
:::

`alarm(N)` programa un compte enrere de $N$ segons al Kernel.

* **El programa NO s'atura a esperar**: Continua executant les següents línies de codi a l'instant mentre el Kernel compta en segon pla.
* **Què passa quan passen els $N$ segons?** El Kernel envia un senyal `SIGALRM` al procés:
  1. **Per defecte (sense capturar)**: El senyal `SIGALRM` **mata el procés** (`exit`). S'utilitza com a límit de temps (*timeout*) perquè el programa no es quedi penjat.
  2. **Si l'has capturat amb `sigaction`**: En complir-se els segons, s'interromp momentàniament el programa, s'executa la teva funció (*handler*) i després el programa **continua treballant normalment**.

```c
alarm(5); // Programa el SIGALRM per d'aquí a 5 segons
alarm(0); // Desactiva qualsevol alarma pendent abans que soni
```

---

## 4.4 Exemple complet processos i signals (Previ lab-SO 4)

Aquí tenim un escenari complet pas a pas:
* **El Pare**: Procés principal. Crea 10 fills, els dona un límit de temps de 2 segons i comprova com moren. Si algun s'adorm massa temps (> 2s), el mata amb `SIGKILL`.
* **Els 10 Fills**: Processos creats amb `fork()`. Cadascun espera exactament 1 segon amb un temporitzador (`alarm(1)`) i després acaba educadament amb `exit(0)`.

:::oopviz{simulation="fork_alarm_timeout"}
:::

<!-- ## 4.4 Trucs i patrons amb senyals

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
**Per què cal el bucle `while (waitpid(-1, &st, WNOHANG) > 0)`?**  
Perquè si moren 3 fills alhora mentre s'està executant la funció, el sistema només posa a 1 el bit de `SIGCHLD`. Si fessis un sol `waitpid`, només en recolliries un i els altres dos es quedarien com a Zombies per sempre. El bucle `while` amb `WNOHANG` recull tots els fills que hagin mort fins que no en queda cap (retorna 0) i no bloqueja el pare.

---

## 4.5 Preguntes d'examen resoltes (Tema 4: Signals)

### 1. Un procés orfe rep `SIGKILL`. Pot quedar-se en estat Zombie per sempre?
**NO**. Quan un procés es queda orfe, és adoptat immediatament pel procés `init` (PID 1). Aquest procés té la funció d'anar fent `waitpid()` de tots els processos que adopta, de manera que allibera el seu PCB tan bon punt moren.

### 2. Què li passa a les estructures de senyals d'un pare quan fa `fork()`?
**Absolutament res**. L'execució de `fork()` crea un procés fill nou i no modifica cap de les dades del procés pare (la seva taula de senyals, el seu bitmap de pendents, la seva màscara de bloqueig i la seva alarma es queden exactament igual).

### 3. Què canvia i què es manté a les estructures de senyals quan un procés fa `execlp()`?
* **Canvia**: La taula d'accions es restableix a l'acció per defecte (`SIG_DFL`) per a totes les funcions d'usuari (perquè el codi nou ja no conté les funcions velles).  
* **Es manté**: La màscara de senyals bloquejats, la llista de senyals pendents i l'alarma es mantenen intactes.

### 4. Amb Round Robin, 3 processos i un quàntum de 10 ms, pot un procés executar-se dues vegades en menys de 30 ms?
**SÍ**. Si qualsevol dels altres dos processos fa una crida bloquejant (com llegir del teclat amb `read`, fer `waitpid` o esperar un senyal) abans d'esgotar els seus 10 ms, allibera la CPU immediatament i el torn passa al següent abans d'hora. -->
