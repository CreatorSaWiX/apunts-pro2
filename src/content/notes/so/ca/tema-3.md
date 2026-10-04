---
title: "Tema 3: Processos"
description: "fork, waitpid, execlp, /proc i concurrència."
readTime: "6 min"
order: 3
draft: false
---

## 3.1 Conceptes i Crides a Sistema Fonamentals

Un **procés** és un programa en execució amb espai d'adreces propi. Tot procés té un identificador únic (**`PID`**) i el del seu creador (**`PPID`**).

| Crida | Secció | Retorn | Què fa |
| :--- | :---: | :--- | :--- |
| **`fork()`** | `man 2` | `0` al fill, `PID_fill` al pare, `-1` si error | Clona el procés (duplica memòria i recursos). |
| **`getpid()`** / **`getppid()`** | `man 2` | `PID` / `PPID` | Retorna PID propi o del pare. Sempre té èxit. |
| **`exit(status)`** | `man 3` | No retorna | Acaba el procés, allibera RAM/fitxers i passa a estat **`Z (Zombie)`**. |
| **`waitpid(pid, &st, opts)`** | `man 2` | `PID` del fill recollit (`-1` si error / `ECHILD`) | Bloqueja el pare fins que el fill mor i **allibera el seu PCB**. |
| **`execlp(file, a0, ...)`** | `man 3` | **Només retorna si falla** (`-1`) | Muta el procés carregant un nou binari. Manté PID i PPID. |
| **`perror(msg)`** | `man 3` | `void` | Escriu per `stderr` (canal 2) `msg: <descripció de errno>`. |

:::shellviz{command="man 2 fork" suggestions="man 2 fork,man 2 waitpid,man 3 execlp,man 3 perror" title="Terminal: Consulta del manual de la crida fork"}
:::

---

## 3.2 El `fork()` i Aïllament de Memòria

Després d'un `fork()`, el pare i el fill tenen **còpies privades independents de la memòria** (variables globals i locals):

```c
int g = 10;
int main() {
    int l = 5, pid;
    pid = fork();
    if (pid == 0) {
        g++; l += 2; // Només afecta la memòria del fill!
        exit(0);
    }
    waitpid(pid, NULL, 0);
    // Pare: g continua sent 10, l continua sent 5!
    return 0;
}
```
* **Valors finals d'examen**: Fill escriu `g = 11, l = 7`. Pare escriu `g = 10, l = 5`.

### Càlcul de processos en bucle de `fork()`
```c
for (int i = 0; i < 3; i++) fork();
write(1, "X\n", 2);
```
* Per a **$n$ crides consecutives a `fork()`**:
  * **Nombre total de processos**: **$2^n$** (per a $n=3 \rightarrow 2^3 = 8$ processos).
  * **Processos creats**: $2^n - 1$ ($8 - 1 = 7$ nous fills).
  * **Cops que s'executa la instrucció posterior**: $2^n$ vegades (s'escriuen **8 línies amb "X"**).

---

## 3.3 Traça d'Examen: `fork` + `waitpid`

```c
write(1, "A\n", 2);
pid = fork();
if (pid == 0) { write(1, "B\n", 2); exit(0); }
write(1, "C\n", 2);
waitpid(pid, NULL, 0);
write(1, "D\n", 2);
```
* **Sortides possibles**: **`A B C D`** i **`A C B D`**.
  * `A` surt sempre **primer i un sol cop** (abans del fork).
  * `D` surt sempre **l'últim** (el pare no passa de `waitpid` fins que el fill mor després d'escriure `B`).
  * L'ordre entre `B` i `C` és **no determinista** (depèn del planificador / scheduler).

---

## 3.4 Mutació de Processos amb `execlp`

```c
write(1, "Abans\n", 6);
execlp("echo", "echo", "uno", "dos", (char *)NULL);
error_y_exit("Error en execlp", 1); // NOMÉS s'executa si execlp falla!
```

1. **Paràmetres**:
   - `argv[0]` es repeteix obligatòriament com a 2n argument (conveni de la Shell).
   - L'últim argument ha de ser **`(char *)NULL`**.
2. **Si té èxit**: La imatge de memòria se substitueix completament pel nou programa. **Mai retorna**.
3. **Si falla**: Retorna `-1`. Cal capturar l'error immediatament amb `perror` i `exit(1)`.
4. **Valors per al nou programa**: Rebrà `argc = 3`, `argv[0]="echo"`, `argv[1]="uno"`, `argv[2]="dos"`.

---

## 3.5 Estats del Procés i Pseudo-FS `/proc`

`/proc` és un sistema de fitxers virtual a la RAM generat pel Kernel:

| Ruta | Contingut | Exemple |
| :--- | :--- | :--- |
| `/proc/[PID]/status` | Camp **`State:`** (`R` Running, `S` Sleeping / Wait, `Z` Zombie), memòria i UIDs | `State: S (sleeping)` |
| `/proc/[PID]/cmdline` | Línia d'ordres amb arguments separats per `\0` | `./prog arg1 arg2` |
| `/proc/[PID]/cwd` | Enllaç simbòlic al directori de treball actual | S'hereta del pare, `exec` NO el canvia |
| `/proc/[PID]/exe` | Enllaç simbòlic al binari executable a disc | Canvia al nou binari en fer `exec` (ex: `/usr/bin/ps`) |

> 🚨 **Cas d'examen d'estats**:
> * **Pare bloquejat a `waitpid`**: Estat **`S (sleeping)`**.
> * **Fill en bucle actiu `while(1);`**: Estat **`R (running)`**.
> * **Fill acabat amb `exit()` sense que el pare hagi fet `waitpid`**: Estat **`Z (zombie)`**. El seu PCB segueix al kernel fins que el pare recull el seu estat amb `waitpid` (o el pare mor i l'adopta `init`/`systemd`).

---

## 3.6 Seqüencial vs Concurrent (Clau de Programació d'Examen)

### 1. Esquema Seqüencial (Ordre Garantit)
El pare crea un fill i **l'espera immediatament a cada iteració**. Garanteix l'ordre estricte:

```c
for (int i = 1; i < argc; i++) {
    if ((pid = fork()) == 0) {
        execlp("wc", "wc", "-c", argv[i], (char *)NULL);
        error_y_exit("Error exec", 1);
    }
    waitpid(pid, NULL, 0); // El pare ESPERA DINS del bucle abans del següent fill!
}
```

### 2. Esquema Concurrent (Ordre No Garantit)
El pare **crea tots els fills primer** i després els espera a tots en un bucle separat:

```c
int pids[MAX];
for (int i = 0; i < nhijos; i++) {
    if ((pid = fork()) == 0) {
        execlp("wc", "wc", "-c", argv[i + 1], (char *)NULL);
        error_y_exit("Error exec", 1);
    }
    pids[i] = pid; // Guarda el PID, NO espera aquí!
}

// Espera a tots els fills
while (waitpid(-1, NULL, 0) > 0);
if (errno != ECHILD) error_y_exit("Error waitpid", 1);
```
* **Pregunta d'examen**: *Es garanteix l'ordre de sortida en la versió concurrent?* **NO**. L'ordre depèn exclusivament de la planificació del sistema operatiu (*scheduler*).
