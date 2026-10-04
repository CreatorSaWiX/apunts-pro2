---
title: "Lab 2: El llenguatge C"
description: "Exercicis i preguntes de la sessió 2 de laboratori."
readTime: "7 min"
order: 2.5
draft: false
---

## Guia de la Sessió 2: El llenguatge C i compilació

Respostes concises a les preguntes del laboratori (`entrega.txt`) per a l'examen SIMLAB.

Empaquetar l'entrega:
:::shellviz{command="tar zcfv sessio02.tar.gz entrega.txt makefile_1 listaParametros.c makefile_4 mis_funciones.h mis_funciones.c suma.c punters.c makefile_5 words.c makefile" suggestions="tar zcfv sessio02.tar.gz entrega.txt,tar ztfv sessio02.tar.gz" title="Terminal — Empaquetar l'entrega de la Sessió 2"}
:::

---

## Bloc 1: Sortida a Baix Nivell (`sprintf` + `write`)

A SO **no** s'usa `cout` ni `printf`. Patró estàndard obligatori:

```c
#include <stdio.h>   // sprintf (man 3 sprintf)
#include <string.h>  // strlen (man 3 strlen)
#include <unistd.h>  // write (man 2 write)

char buffer[128];
int valor = 42;
sprintf(buffer, "El resultat es: %d\n", valor);
write(1, buffer, strlen(buffer)); // 1 = stdout, 2 = stderr
```

:::shellviz{command="man 3 sprintf" suggestions="man 3 sprintf,man 2 write,man gcc" title="Terminal — Consultar el manual de sprintf i write"}
:::

---

## Bloc 2: Regles de Makefile (Exercicis 1 a 4)

Format fonamental d'una regla:
```makefile
target: dep1 dep2 ... depN
	comanda
```

* ⚠️ **Requisit obligatori**: La línia de la comanda ha de començar amb un **`TAB`**. Els espais produeixen l'error `missing separator`.

```makefile
all: llistaParametres

llistaParametres: llistaParametres.c
	gcc -o llistaParametres llistaParametres.c

clean:
	rm -f llistaParametres *.o
```

:::shellviz{command="make" suggestions="make,make clean" title="Terminal — Automatització amb make"}
:::

---

## Bloc 3: Errors Freqüents del Compilador (Examen)

| Error / Avís de `gcc` | Causa | Solució |
| :--- | :--- | :--- |
| `error: 'i' undeclared` | Variable del bucle no declarada | Declarar `int i;` abans o `for (int i = 0; ...)` |
| `warning: implicit declaration of 'sprintf'` | Falta la capçalera de format | `#include <stdio.h>` |
| `warning: implicit declaration of 'strlen'` | Falta la capçalera de strings | `#include <string.h>` |
| `warning: implicit declaration of 'write'` | Falta la capçalera POSIX | `#include <unistd.h>` |
| `warning: return with a value in void function` | Funció declarada `void main` | Declarar `int main(int argc, char *argv[])` |
| `error: syntax error at end of input` | Clau de tancament `}` oblidada | Tancar la clau del bucle o funció |

### Codi corregit (`listaParametros.c`)
```c
#include <stdio.h>
#include <string.h>
#include <unistd.h>

int main(int argc, char *argv[]) {
    char buf[128];
    for (int i = 0; i < argc; i++) {
        sprintf(buf, "L'argument %d es %s\n", i, argv[i]);
        write(1, buf, strlen(buf));
    }
    return 0;
}
```

---

## Bloc 4: Paràmetres `argc` i `argv`

* **`argc`**: Nombre total d'arguments ($\ge 1$).
* **`argv`**: Vector de cadenes `char *`.
  * `argv[0]`: Nom o ruta del programa invocat (`./llistaParametres`).
  * `argv[1]` ... `argv[argc-1]`: Paràmetres passats per l'usuari.
  * `argv[argc]`: Val `NULL`.
* ⚠️ **Regla d'Examen**: Els arguments arriben **SEMPRE com a `char *`**, mai com a enters. Cal fer conversió (`atoi`) per operar numèricament.
* **Cometes a la Shell**: `./prog 10 "dos tres"` $\rightarrow$ `argc = 3`: `argv[1]="10"`, `argv[2]="dos tres"`.

:::shellviz{command="./llistaParametros a b c" suggestions="./llistaParametros a b c,./llistaParametros,./llistaParametros 100 200" title="Terminal — Pas d'arguments a través d'argc i argv"}
:::

---

## Bloc 5: Funció `Usage()` i Validació de Paràmetres

Tots els programes d'examen han de validar el nombre d'arguments rebuts. Si és incorrecte, mostren ajuda i acaben amb `exit(1)`:

```c
void Usage(char *nom_prog) {
    char buf[256];
    sprintf(buf, "Usage: %s arg1 [arg2.. argn]\n", nom_prog);
    write(2, buf, strlen(buf));
    exit(1);
}

int main(int argc, char *argv[]) {
    if (argc < 2) Usage(argv[0]);
    // ...
    return 0;
}
```

:::shellviz{command="./llistaParametres" suggestions="./llistaParametres,./llistaParametres fitxer1 fitxer2" title="Terminal — Execució amb paràmetres incorrectes i Usage()"}
:::

---

## Bloc 6: Punters en C (`punters.c`)

* `&A`: Obtenir l'adreça de memòria de la variable `A`.
* `*PA`: Llegir o modificar el valor de la cel·la apuntada per `PA`.

```c
int A;
int *PA = &A;
*PA = 4; // Ara A val 4!
```

> ⚠️ Comprovar sempre `if (punter == NULL)` abans d'accedir-hi per evitar `Segmentation Fault` (`SIGSEGV`).

:::shellviz{command="./punters" suggestions="./punters,cat test.txt" title="Terminal — Execució de verificació de punters en memòria"}
:::

---

## Bloc 7: Conversió de Caràcters a Enters (`suma.c`)

1. **`char2int`**: Resta el valor ASCII del caràcter `'0'`:
   ```c
   unsigned int char2int(char c) { return (unsigned int)(c - '0'); }
   ```
2. **`mi_atoi`**: Converteix una cadena a enter gestionant el signe:
   ```c
   int mi_atoi(char *s) {
       int res = 0, sign = 1, i = 0;
       if (s[0] == '-') { sign = -1; i = 1; }
       for (; s[i] != '\0'; i++) res = res * 10 + char2int(s[i]);
       return res * sign;
   }
   ```

:::shellviz{command="./suma 100 2 3 4 100" suggestions="./suma 100 2 3 4 100,./suma -1 1,./suma 100 a" title="Terminal — Execució de suma.c amb control d'errors"}
:::

---

## Bloc 8: Modularització i Compilació amb `gcc`

Divisió en `.h` (prototips públics) i `.c` (implementació):

```c
/* mis_funciones.h */
#ifndef MIS_FUNCIONES_H
#define MIS_FUNCIONES_H
unsigned int char2int(char c);
int mi_atoi(char *s);
#endif
```

### Pregunta 28: Opcions de `gcc`
* **Generar fitxer objecte `.o` sense enllaçar:**
  `gcc -c mis_funciones.c` (flag **`-c`**).
* **Directori per trobar fitxers de capçalera `.h`:**
  `gcc -c suma.c -I.` (flag **`-I<dir>`**; `-I.` per al directori actual, `-I../inc` per a subdirectoris).
* **Directori de biblioteques i enllaç:**
  `gcc -o prog prog.c -I../inc -L../lib -lmates` (`-L` directori, `-l` biblioteca sense prefix `lib` ni extensió `.a`).

:::shellviz{command="gcc -c mis_funciones.c -I." suggestions="gcc -c mis_funciones.c -I.,gcc -o suma suma.c mis_funciones.o -I.,ls -l" title="Terminal — Compilació modular amb gcc -c i -I"}
:::

---

## Bloc 9: Comptador de Paraules (`words.c`)

Una paraula es delimita per espai `' '`, punt `'.' `, coma `','` o salt de línia `'\n'`:

```c
int esDelimitador(char c) {
    return (c == ' ' || c == '.' || c == ',' || c == '\n');
}

// Dins de main:
int count = 0, enParaula = 0;
for (int i = 0; str[i] != '\0'; i++) {
    if (!esDelimitador(str[i])) {
        if (!enParaula) { count++; enParaula = 1; }
    } else {
        enParaula = 0;
    }
}
```

:::shellviz{command="./words \"Aquesta es una frase.\"" suggestions="./words \"Aquesta es una frase.\",./words hola" title="Terminal — Execució de words.c"}
:::

---

## Resum del Paquet d'Entrega (`sessio02.tar.gz`)

| Fitxer | Contingut |
| :--- | :--- |
| `entrega.txt` | Respostes a les preguntes del laboratori. |
| `makefile_1` / `makefile_4` / `makefile_5` / `makefile` | Makefiles bàsics, modulars i final amb regles `all` i `clean`. |
| `listaParametros.c` | Codi amb `Usage()` i comprovació d'`argc`. |
| `mis_funciones.h` / `mis_funciones.c` | Capçalera i implementació modular (`char2int`, `mi_atoi`). |
| `suma.c` / `punters.c` / `words.c` | Programes de suma d'arguments, verificació de punters i comptador de paraules. |

:::shellviz{command="tar ztfv sessio02.tar.gz" suggestions="tar ztfv sessio02.tar.gz,ls -la" title="Terminal — Verificació dels fitxers continguts al paquet"}
:::
