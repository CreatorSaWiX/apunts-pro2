---
title: "Tema 2: El llenguatge C i Eines del Sistema"
description: "Cicle de compilació, Makefiles, crides de baix nivell, eines d'inspecció (nm, objdump, strace) i gestió d'errors."
readTime: "15 min"
order: 2
draft: false
---

## 2.1 Cicle de Compilació a UNIX

El pas de codi font en C a un fitxer executable es fa en **3 passos consecutius**:

:::compileviz
:::


| Fase | Eina | Què fa exactament? | Fitxers resultants |
| :--- | :--- | :--- | :--- |
| **1. Preprocessador** | `cpp` | Substitució de text pura: copia i enganxa el text dels `#include`, substitueix les paraules del `#define` pel seu valor i esborra tots els comentaris. | Text expandit (`.i`) |
| **2. Compilador** | `gcc -c` | Comprova que no hi hagi errors de sintaxi ni de tipus i tradueix el C a instruccions màquina del processador. Deixa pendents les adreces de funcions que són fora d'aquest fitxer. | Fitxer objecte (`.o`) |
| **3. Enllaçador (*Linker*)** | `ld` (via `gcc`) | Ajunta els fitxers `.o` amb les biblioteques del sistema (com `libc`), assigna les adreces finals de cada funció i crea l'executable. | Executable (`a.out` o nom indicat) |

:::shellviz{command="gcc --version" suggestions="gcc --version,which gcc" title="Terminal: Comprovació del compilador GCC"}
:::

---

## 2.2 Baix Nivell a SO: Canals i `sprintf` + `write`

Als exàmens i laboratoris de SO **no s'utilitza `printf` ni `cout`** (són funcions d'alt nivell que guarden dades en una memòria intermèdia pròpia abans d'escriure). S'utilitza la combinació directa de baix nivell:

1. **`sprintf(buf, format, ...)`** (`man 3 sprintf`, `<stdio.h>`): Converteix números o variables a una cadena de text ASCII dins del vector `buf`. **Tot el que volem mostrar per pantalla ha de ser text ASCII.**
2. **`write(fd, buf, nbytes)`** (`man 2 write`, `<unistd.h>`): Crida a sistema que aboca directament el nombre de bytes al dispositiu associat al canal `fd`.

### Els 3 Canals Estàndard oberts per defecte
Cada cop que s'executa un procés, el sistema li obre **3 canals automàticament**:
* `fd = 0`: **`stdin`** (entrada estàndard, teclat).
* `fd = 1`: **`stdout`** (sortida estàndard, pantalla).
* `fd = 2`: **`stderr`** (sortida d'errors, pantalla per on s'escriuen els missatges d'error).

```c
#include <stdio.h>
#include <string.h>
#include <unistd.h>

char buf[128];
int valor = 42;
// 1. Preparem el text en memòria
int len = sprintf(buf, "El resultat es: %d\n", valor);
// 2. L'escrivim a la sortida estàndard (canal 1)
write(1, buf, len);
```

:::shellviz{command="man 2 write" suggestions="man 2 write,man 3 sprintf,man 3 strlen" title="Terminal: Consulta de la crida a sistema write"}
:::

---

## 2.3 Makefiles i Automatització de la Compilació

L'eina `make` serveix per no haver de recompilar tot el projecte sencer cada cop que fem un canvi petit. Compara la data de modificació de l'arxiu que volem crear (*target*) amb la dels arxius dels quals depèn (*dependències*).

### Sintaxi Estricta d'una Regla
```makefile
target: dependència1 dependència2 ... dependènciaN
	comanda_de_generació
```
* **IMPORTANTÍSSIM**: La línia de la comanda **HA de començar obligatòriament amb un TABULADOR (`\t`)**. Si hi poses espais, `make` fallarà amb l'error `missing separator. Stop.`

### Per què cal posar els fitxers `.h` com a dependències? (Pregunta d'Examen)
Els fitxers capçalera (`.h`) no es compilen directament, però el preprocessador els inclou dins dels `.c`.
* Si poses només `util.o: util.c`, i demà canvies una definició a `util.h`, `make` **no s'adonarà del canvi** i no recompilarà `util.o`. El teu programa quedarà desactualitzat amb errors estranys de memòria.
* **Forma correcta**:
  ```makefile
  util.o: util.c util.h
  	gcc -c util.c
  ```

### Exemple Complet de Makefile per a Laboratori i Examen
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

## 2.4 Flags Fonamentals de `gcc`

| Flag | Què fa? | Exemple d'Ús |
| :--- | :--- | :--- |
| **`-c`** | Genera només el fitxer objecte (`.o`) sense enllaçar. | `gcc -c util.c` (crea `util.o`) |
| **`-o nom`** | Tria el nom del fitxer executable que es crearà (en lloc del `a.out`). | `gcc -o prog prog.o` |
| **`-I dir`** | Diu on anar a buscar fitxers `.h` si estan en una altra carpeta. | `gcc -c main.c -I./include` |
| **`-L dir`** | Diu on anar a buscar biblioteques (`.a` o `.so`). | `gcc -o prog prog.o -L./libs -lutil` |
| **`-l nom`** | Enllaça amb la biblioteca `lib<nom>.a` o `.so` (sense el prefix `lib` ni extensió). | `-lm` (enllaça la biblioteca matemàtica `libm.so`) |
| **`-Wall`** | Mostra tots els avisos (*warnings*) de coses que podrien ser errors. | `gcc -Wall -c prog.c` |
| **`-static`** | Fa **enllaçat estàtic**: copia tot el codi de les biblioteques dins de l'executable. | `gcc -static -o prog_static prog.c` |

---

## 2.5 Compilació Estàtica vs Dinàmica (`-static`)

Aquesta és una pregunta molt freqüent als exàmens:

| Propietat | Compilació Dinàmica (per defecte) | Compilació Estàtica (`gcc -static`) |
| :--- | :--- | :--- |
| **Composició del fitxer** | Només conté el nostre codi i referències a les biblioteques del sistema (`libc.so`). | **Còpia física completa** de tot el codi de les funcions de biblioteca dins del mateix fitxer binari. |
| **Mida de l'executable** | **Molt petita** (p. ex. 15 KB). | **Molt gran** (p. ex. 800 KB - 1 MB o més). |
| **En executar el programa** | El sistema operatiu carrega les biblioteques compartides des del disc a la memòria RAM. | El binari porta tot el que necessita a dins i no depèn de fitxers externs. |
| **Mapa de memòria (`maps`)** | Mostra regions de memòria per al programa i per a les biblioteques compartides (`libc.so`). | Mapa de memòria net: només el programa, el *heap* i la pila (*stack*). |
| **Taula de símbols (`nm`)** | Les funcions de biblioteca apareixen com a **`U` (*undefined*)** perquè es resoldran en executar-se. | Totes les funcions de biblioteca apareixen resoltes amb adreça a la secció **`T` (*text*)**. |

---

## 2.6 Eines per Analitzar Binaris: `nm`, `objdump` i `strace`

### 1. `nm <executable>`: La Taula de Símbols
Llegeix la llista de funcions i variables globals que conté el fitxer:
* **`T` / `t`**: Codi / Text (funcions del programa com `main`).
* **`D` / `d`**: Dades inicialitzades (variables globals amb valor inicial: `int x = 5;`).
* **`B` / `b`**: BSS (variables globals sense valor inicial: `int y;`). El sistema operatiu les posa a 0 automàticament en carregar el programa.
* **`R` / `r`**: Dades de només lectura (constants com `const int c = 1;` o textos entre cometes).
* **`U`**: Símbols no definits (funcions externes que s'enllaçaran en temps d'execució).

> **Pregunta d'examen**: *Per què les variables locals d'una funció NO apareixen a `nm`?*  
> Perquè les variables locals no es guarden al fitxer executable del disc. Es creen i es destrueixen al vol dins de la **pila (*stack*)** de la memòria RAM quan s'executa la funció.

### 2. `objdump -d <executable>`
Desassembla el fitxer binari i et mostra les instruccions en llenguatge d'assemblador per veure exactament quines instruccions farà la CPU.

### 3. `strace <executable>`
Executa el programa i et mostra per pantalla **totes les crides a sistema que fa mentre corre**, quins arguments hi passa i què retorna cadascuna.
* `strace -e read ./prog < fitxer`: filtra per veure només les crides `read`.
* `strace -o registre.txt ./prog`: guarda la llista en un fitxer de text.

> **Rendiment d'E/S (Pregunta d'examen)**:  
> Si llegeixes un fitxer de 1024 bytes caràcter a caràcter (`read(0, &c, 1)`), fas **1024 crides a sistema**. Cada crida obliga la CPU a canviar de mode usuari a kernel i salvar registres, fent anar el programa molt lent.  
> En canvi, si llegeixes amb un búfer de 256 bytes (`read(0, buf, 256)`), només fas **4 crides a sistema**, i el programa funciona molt més ràpid.

---

## 2.7 Paràmetres del `main`: `argc` i `argv`

```c
int main(int argc, char *argv[])
```

* **`argc`**: Quants arguments s'han passat per la terminal (com a mínim val 1).
* **`argv`**: Vector de cadenes de text (`char *`):
  * `argv[0]`: El nom del programa tal com s'ha cridat (`./prog`).
  * `argv[1]` fins a `argv[argc - 1]`: Els arguments de l'usuari.
  * `argv[argc]`: Sempre val `NULL`.
* **Important**: Els arguments arriben **SEMPRE com a text**. Si escrius `./prog 42`, `argv[1]` és la paraula `"42"`, no el número enter. Per fer càlculs cal convertir-lo abans amb `atoi(argv[1])`.

### Patró de la Funció `Usage()` (Obligatori a Exàmens)
A tots els exàmens has de comprovar que l'usuari hagi passat els arguments correctes abans de començar a fer res:

```c
#include <unistd.h>
#include <stdlib.h>
#include <string.h>
#include <stdio.h>

void Usage(char *nom_prog) {
    char buf[128];
    int len = sprintf(buf, "Usage: %s <num_elements> <fitxer>\n", nom_prog);
    write(2, buf, len); // Canal 2: stderr (missatges d'error)
    exit(1);
}

int main(int argc, char *argv[]) {
    if (argc != 3) {
        Usage(argv[0]);
    }
    // Si és correcte, continua el programa...
    return 0;
}
```

---

## 2.8 Control d'Errors amb `perror()`

Totes les crides a sistema a Linux retornen `-1` quan fallen i guarden el motiu de l'error a la variable `errno`.

* La funció `perror(missatge)` (`man 3 perror`) escriu pel canal 2 (`stderr`) el teu missatge seguit de la descripció clara de l'error que ha passat:

```c
void error_y_exit(char *msg, int codi_sortida) {
    perror(msg);
    exit(codi_sortida);
}

// Exemple en obrir un fitxer:
int fd = open("dades.txt", O_RDONLY);
if (fd < 0) {
    error_y_exit("Error en obrir el fitxer", 1);
}
```

---

## 2.9 Punters i Adreces de Memòria

Un **punter** és una variable que guarda una adreça de memòria RAM:
* `&variable`: "A quina adreça de memòria està guardada aquesta variable?".
* `*punter`: "Quin valor hi ha guardat a l'adreça on apunta aquest punter?".

```c
int a = 10;
int *p = &a; // p guarda l'adreça de 'a'
*p = 25;     // Canvia el valor de 'a' a 25 a través del punter
```

* **Errors greus de punters**:
  1. Desreferenciar `NULL` (`int *p = NULL; *p = 5;`): provoca que la CPU aturi el programa amb un **`Segmentation Fault` (senyal `SIGSEGV`)**.
  2. Utilitzar punters sense inicialitzar: apunten a adreces a l'atzar de la memòria i poden danyar altres dades.

---

## 2.10 Preguntes Típiques d'Examen Resoltes (Tema 2)

### 1. Per què un executable compilat amb `-static` ocupa tant d'espai comparat amb el normal?
> **Resposta breu i exacta**:  
> Perquè el flag `-static` copia físicament tot el codi màquina de les funcions de biblioteca (com `sprintf`, `strlen`, etc.) dins del propi fitxer executable. En la compilació dinàmica, el fitxer només guarda una petita referència i les biblioteques es comparteixen a la memòria des del sistema.

### 2. A quina secció del fitxer binari pertanyen aquestes variables segons `nm`: una constant global, una global inicialitzada a 0, una global inicialitzada a 100, i una variable local de `main`?
> **Resposta breu i exacta**:  
> * Constant global: secció **`R` / `r` (*rodata*)** (només lectura).  
> * Global inicialitzada a 0: secció **`B` / `b` (*bss*)** (sense valor inicial, el sistema la posa a 0 al carregar-la).  
> * Global inicialitzada a 100: secció **`D` / `d` (*data*)** (dades inicialitzades guardades al binari).  
> * Variable local de `main`: **No apareix a `nm`**, perquè es crea a la pila (*stack*) de memòria mentre el programa s'executa.
