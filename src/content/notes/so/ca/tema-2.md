---
title: "Tema 2: El llenguatge C"
description: "Compilació, Makefile, gcc, punters i baix nivell."
readTime: "6 min"
order: 2
draft: false
---

## 2.1 Cicle de Compilació a UNIX

El pas de codi font a executable té 3 fases successives:

<!-- ```text
Codi font (.c, .h) ──[cpp]──> Codi expandit ──[gcc -c]──> Codi objecte (.o) ──[ld / gcc]──> Executable
``` -->

| Fase | Eina | Què fa | Fitxers |
| :--- | :--- | :--- | :--- |
| **1. Preprocessador** | `cpp` | Resol directives `#include` (copia capçalera) i `#define` (substitució textual); elimina comentaris. | Text expandit |
| **2. Compilador** | `gcc -c` | Tradueix C a codi màquina relocatable (sense resoldre crides externes). | `.o` (objecte) |
| **3. Enllaçador** | `ld` (via `gcc`) | Combina fitxers `.o` i biblioteques (`libc`), resol adreces de funcions. | Executable |

:::shellviz{command="gcc --version" suggestions="gcc --version,which gcc" title="Terminal: Comprovació del compilador GCC"}
:::

---

## 2.2 Baix Nivell a SO: `sprintf` + `write`

A SO **no** s'utilitza `printf` ni `cout`. S'utilitza la combinació estàndard:

1. **`sprintf(buf, format, ...)`** (`man 3 sprintf`, `<stdio.h>`): formata dades en memòria dins de `buf`.
2. **`write(fd, buf, nbytes)`** (`man 2 write`, `<unistd.h>`): crida a sistema que aboca els bytes al canal.
   * `fd = 1`: **stdout** (sortida estàndard).
   * `fd = 2`: **stderr** (sortida d'errors).
   * `nbytes`: mida exacta calculada amb `strlen(buf)` (`<string.h>`).

```c
#include <stdio.h>
#include <string.h>
#include <unistd.h>

char buf[128];
int val = 42;
sprintf(buf, "Resultat: %d\n", val);
write(1, buf, strlen(buf));
```

:::shellviz{command="man 2 write" suggestions="man 2 write,man 3 sprintf,man 3 strlen" title="Terminal: Consulta de la crida a sistema write"}
:::

---

## 2.3 Makefiles i Automatització

Format d'una regla:
```makefile
target: dep1 dep2 ... depN
	comanda_de_construccio
```

* **Sintaxi obligatòria**: La línia de comanda **HA de començar amb TAB** (si poses espais → error `missing separator`).
* **Dependències de capçaleres (`.h`)**: Si `util.c` fa `#include "util.h"`, la regla de `util.o` **ha d'incloure `util.h` com a dependència**:
  ```makefile
  util.o: util.c util.h
  	gcc -c util.c
  ```
> Si es modifica `util.h` i no està a les dependències de `util.o`, `make` **no recompilarà** `util.o` i el codi quedarà desactualitzat.

### Exemple complet de `Makefile`
```makefile
all: prog

prog: prog.o util.o
	gcc -o prog prog.o util.o

prog.o: prog.c util.h
	gcc -c prog.c

util.o: util.c util.h
	gcc -c util.c

clean:
	rm -f prog *.o
```

:::shellviz{command="make" suggestions="make,make clean" title="Terminal: Automatització amb make"}
:::

---

## 2.4 Flags de `gcc`

| Flag | Funció | Exemple / Comportament |
| :--- | :--- | :--- |
| **`-c`** | Genera només el `.o` (aturar abans d'enllaçar) | `gcc -c util.c` → crea `util.o` |
| **`-o nom`** | Nom de l'executable resultant | `gcc -o prog prog.o` (evita `a.out`) |
| **`-I dir`** | Directori on cercar capçaleres (`.h`) | `-I../inc` cerca a `../inc/fitxer.h` |
| **`-L dir`** | Directori on cercar biblioteques (`.a`, `.so`) | `-L../lib` |
| **`-l nom`** | Enllaça la biblioteca `lib<nom>.a` | `-lmates` enllaça `libmates.a` (sense `lib` ni `.a`) |
| **`-Wall`** | Mostra tots els avisos (*warnings*) | Molt recomanat |

* **Exemple d'examen complet**: Compilar `prog.c` amb capçaleres a `../inc`, llibreria `libmates.a` a `../lib` i sortida `prog`:
  ```bash
  gcc -o prog prog.c -I../inc -L../lib -lmates
  ```

---

## 2.5 Resolució d'Errors de Compilació

Analitzar sempre els errors en **ordre cronològic** (el primer error sovint en genera d'altres de falsos):

| Error / Warning del Compilador | Causa | Solució |
| :--- | :--- | :--- |
| `error: 'i' undeclared` | Variable usada sense declarar | Declarar `int i;` abans del bucle. |
| `warning: implicit declaration of function 'sprintf'` | Falta la capçalera de la funció | Afegir `#include <stdio.h>` |
| `warning: implicit declaration of function 'write'` | Falta la capçalera de crides POSIX | Afegir `#include <unistd.h>` |
| `warning: implicit declaration of function 'strlen'` | Falta la capçalera de strings | Afegir `#include <string.h>` |
| `error: syntax error at end of input` | Falta tancar una clau `}` (bucle/funció) | Tancar la clau oberta. |
| `warning: return with a value, in function returning void` | Funció declarada `void` amb `return 0;` | Declarar `int main(...)` i `return 0;`. |

---

## 2.6 Paràmetres del `main`: `argc` i `argv`

```c
int main(int argc, char *argv[])
```

* **`argc`**: Nombre total d'arguments (sempre $\ge 1$).
* **`argv`**: Vector de punters a caràcter (`char *`), cadascun apuntant a un string ASCII acavat en `\0`.
  * `argv[0]`: Nom o ruta de la comanda tal com s'ha invocat (`./prog`).
  * `argv[1]` ... `argv[argc - 1]`: Arguments de l'usuari.
  * `argv[argc]`: Garantit que val `NULL`.
* **Principi d'examen**: Els arguments arriben **SEMPRE com a text (`char *`)**, mai com a enters. Si passes `./prog 12`, `argv[1]` és `"12"`, no el nombre `12`. Per convertir: `atoi(argv[1])`.
* **Cometes a la Shell**: Les cometes agrupen paraules amb espais en un sol argument:
  ```bash
  ./prog 12 hola "tres cuatro"
  ```
  $\rightarrow$ `argc = 4`: `argv[0]="./prog"`, `argv[1]="12"`, `argv[2]="hola"`, `argv[3]="tres cuatro"`.

:::shellviz{command="./listaParametros a b c" suggestions="./listaParametros a b c,./listaParametros,./listaParametros 10 20" title="Terminal: Prova de pas de paràmetres argc i argv"}
:::

---

## 2.7 Punters i Traces de Memòria

Un **punter** guarda una adreça de memòria:
* `&variable`: operador adreça (*on és*).
* `*punter`: operador desreferència (*contingut de l'adreça*).

```c
int a = 3, b = 7;
int *p = &a, *q = &b;

*p = *q + 1; // a = 7 + 1 = 8
q = p;       // q ara apunta a 'a' (mateixa adreça que p)
*q = *q * 2; // a = 8 * 2 = 16
```
* **Resultat al final**: `a = 16`, `b = 7`.
* És cert `p == q`? **SÍ**, perquè contenen la mateixa adreça de memòria (`&a`).

> **Tractament de punters segur**: Sempre comprovar `if (ptr == NULL)` abans de desreferenciar per evitar `Segmentation Fault` (senyal `SIGSEGV`).
