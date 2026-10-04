---
title: "Lab 3: Processos"
description: "Exercicis i preguntes de la sessió 3 de laboratori."
readTime: "7 min"
order: 3.5
draft: false
---

## Guia de la Sessió 3: Gestió de Processos

Respostes concises a les preguntes del laboratori (`entrega.txt`) per a l'examen SIMLAB.

Empaquetar l'entrega:
:::shellviz{command="tar zcfv sessio03.tar.gz entrega.txt makefile myPS_v0.c myPS.c myPS2.c myPS3.c parsExec.c" suggestions="tar zcfv sessio03.tar.gz entrega.txt,tar ztfv sessio03.tar.gz" title="Terminal — Empaquetar l'entrega de la Sessió 3"}
:::

---

## Bloc 1: Crides a Sistema Fonamentals

| Crida | Secció manual | Què retorna | Ús típic |
| :--- | :---: | :--- | :--- |
| **`fork()`** | `man 2` | `0` al fill, `PID` al pare, `-1` si error | Duplica el procés actual. |
| **`getpid()`** | `man 2` | `pid_t` (PID propi) | Consulta d'identitat. |
| **`getppid()`** | `man 2` | `pid_t` (PID del pare) | Consulta del creador. |
| **`exit(codi)`** | `man 3` | No retorna | Finalitza el procés i passa a `Z (zombie)`. |
| **`waitpid(pid, &st, opts)`** | `man 2` | PID del fill finalitzat | Espera el fill i n'allibera el PCB. |
| **`execlp(file, a0, ...)`** | `man 3` | **Només si falla** (`-1`) | Muta la imatge de memòria. |
| **`perror(msg)`** | `man 3` | `void` | Escriu per `stderr` (canal 2) l'error del kernel (`errno`). |

:::shellviz{command="man 2 fork" suggestions="man 2 fork,man 2 waitpid,man 3 perror" title="Terminal — Consultar el manual de les crides a sistema"}
:::

---

## Bloc 2: Tractament d'Errors amb `perror`

Patró obligatori per a crides que poden fallar:

```c
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

void error_y_exit(char *msg, int exit_status) {
    perror(msg);
    exit(exit_status);
}
```

---

## Bloc 3: Creació i Mutació de Processos (`myPS.c`)

```c
void muta_a_PS(char *username) {
    execlp("ps", "ps", "-u", username, (char *)NULL);
    error_y_exit("Ha fallat la mutacio al ps", 1);
}
```

### Pregunta 29: Obtenir PIDs
* **Com sap el pare el PID dels fills?** A través del **retorn de `fork()`** (al pare li retorna el PID positiu del nou fill; al fill li retorna `0`).
* **Com consulta un procés el seu propi PID?** Amb la crida **`getpid()`** (i `getppid()` per al PID del pare).

### Pregunta 30: Execució després d'`execlp`
* **En quin cas s'executa el codi posterior a `execlp`?** **NOMÉS SI L'EXECLP FALLA**.
* **Motiu:** Si `execlp` té èxit, el kernel substitueix completament tot l'espai de memòria pel nou programa. El codi original deixa d'existir a la RAM. Si la següent instrucció s'arriba a executar, és la certesa absoluta que la mutació ha fallat.

:::shellviz{command="./myPS alumne" suggestions="./myPS alumne,which ps,ps -u alumne" title="Terminal — Execució de myPS amb mutació a ps"}
:::

---

## Bloc 4: Pseudo-Sistema `/proc` (P31 a P36)

`/proc` és un sistema de fitxers virtual a memòria RAM generat pel Kernel.

### Pregunta 31: Fitxers a `/proc/[PID]/`
* Comanda per llistar enllaços i metadades: `ls -la /proc/$$/` (`$$` = PID actual).
* **Fitxers clau**:
  * `status`: Estat de planificació (`State:`), memòria (VmSize) i UIDs.
  * `cmdline`: Línia d'ordres d'invocació separada per bytes nuls `\0`.
  * `environ`: Variables d'entorn heretades en iniciar el procés.
  * `cwd`: Soft link que apunta al directori de treball actual.
  * `exe`: Soft link que apunta al binari executable a disc.

:::shellviz{command="ls -la /proc" suggestions="ls -la /proc,df -h" title="Terminal — Exploració del sistema de fitxers /proc"}
:::

### Pregunta 32: Comparació d'`environ` i estats
* `/proc/[PID]/environ` conté exactament la mateixa llista de variables que la comanda `env`.
* **Estats al camp `State`**:
  * Procés en bucle actiu `while(1);` $\rightarrow$ **`R (running)`**.
  * Procés esperant a `waitpid()` $\rightarrow$ **`S (sleeping)`**.
* **Temps de CPU**: Camp 14 de `/proc/[PID]/stat` (*utime*).

### Preguntes 33 a 36: `cwd`, `exe` i mutació
* `cwd`: S'hereta del pare; `exec` **no** el canvia.
* `exe`: En un procés sense mutar (`myPS_v0`), apunta a `./myPS_v0`. En mutar amb `execlp("ps", ...)` (`myPS`), `exe` passa a apuntar a `/usr/bin/ps`.

---

## Bloc 5: Execució Seqüencial (`myPS2.c`)

El pare crea els fills **d'un en un**, esperant cadascun abans de crear el següent:

```c
for (int i = 0; i < num_fills; i++) {
    int pid = fork();
    if (pid < 0) error_y_exit("Error fork", 1);
    if (pid == 0) {
        muta_a_PS(argv[i + 1]);
    }
    // El pare ESPERA DINS del bucle: ordre 100% garantit
    waitpid(pid, NULL, 0);
}
```

:::shellviz{command="./myPS2 alumne root" suggestions="./myPS2 alumne root,./myPS2 alumne,ps" title="Terminal — Execució seqüencial de processos amb myPS2"}
:::

---

## Bloc 6: Execució Concurrent (`myPS3.c`)

El pare **crea tots els fills immediatament** i després n'espera la finalització:

```c
// 1. Fase de creació concurrent
for (int i = 0; i < num_fills; i++) {
    int pid = fork();
    if (pid < 0) error_y_exit("Error fork", 1);
    if (pid == 0) {
        muta_a_PS(argv[i + 1]);
    }
    // El pare NO espera aquí
}

// 2. Fase de recollida de PCBs
while (waitpid(-1, NULL, 0) > 0);
```

### Pregunta 37: Estat del pare durant l'espera
* El pare està en estat **`S (sleeping)`** perquè `waitpid(-1, ...)` és una crida **bloquejant** que allibera la CPU.

### Pregunta 38: No determinisme
* Executar `./myPS3 alumne root > sortida.txt` diverses vegades pot produir un ordre de sortida diferent perquè depèn de la planificació del kernel (*scheduler*).

:::shellviz{command="./myPS3 alumne root > sortida1.txt" suggestions="./myPS3 alumne root > sortida1.txt,cat sortida1.txt" title="Terminal — Redirecció de sortida concurrent a fitxer"}
:::

---

## Bloc 7: Pas d'Arguments amb `execlp` (`parsExec.c`)

```c
// Exemple d'invocació múltiple amb execlp
pid = fork();
if (pid == 0) {
    execlp("./listaParametros", "listaParametros", "1024", "hola", (char *)NULL);
    error_y_exit("Error execlp", 1);
}
while (waitpid(-1, NULL, 0) > 0);
```

:::shellviz{command="./parsExec" suggestions="./parsExec,./listaParametros a b,ps" title="Terminal — Execució de parsExec amb pas d'arguments"}
:::

---

## Resum del Paquet d'Entrega (`sessio03.tar.gz`)

| Fitxer | Rol |
| :--- | :--- |
| `entrega.txt` | Respostes a les preguntes 29 a 38. |
| `makefile` | Regles `all` i `clean` per a tots els binaris. |
| `myPS_v0.c` | Fill sense mutar (executa `while(1);`). |
| `myPS.c` | Fill mutat a `ps -u username`. |
| `myPS2.c` | Esquema seqüencial (waitpid dins del bucle). |
| `myPS3.c` | Esquema concurrent (waitpid fora del bucle). |
| `parsExec.c` | Execució de 4 fills amb arguments diversos. |

:::shellviz{command="tar ztfv sessio03.tar.gz" suggestions="tar ztfv sessio03.tar.gz,ls -la" title="Terminal — Verificació del paquet de l'entrega de la Sessió 3"}
:::
