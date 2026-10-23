---
title: "Lab 2: The C Language"
description: "Exercises and questions from laboratory session 2."
readTime: "7 min"
order: 2.5
draft: false
---

## Session 2 Guide: The C Language and Compilation

Concise answers to laboratory questions (`entrega.txt`) for the SIMLAB exam.

Packaging the submission:
:::shellviz{command="tar zcfv sessio02.tar.gz entrega.txt makefile_1 listaParametros.c makefile_4 mis_funciones.h mis_funciones.c suma.c punters.c makefile_5 words.c makefile" suggestions="tar zcfv sessio02.tar.gz entrega.txt,tar ztfv sessio02.tar.gz" title="Terminal — Packaging the Session 2 submission"}
:::

---

## Block 1: Low-level Output (`sprintf` + `write`)

In Operating Systems, `cout` and `printf` are **not** used. Mandatory standard pattern:

```c
#include <stdio.h>   // sprintf (man 3 sprintf)
#include <string.h>  // strlen (man 3 strlen)
#include <unistd.h>  // write (man 2 write)

char buffer[128];
int valor = 42;
sprintf(buffer, "The result is: %d\n", valor);
write(1, buffer, strlen(buffer)); // 1 = stdout, 2 = stderr
```

> Recall that `%.` formats a variable whose value is the subsequent argument.
> * `%s`: Character string (char *).
> * `%d`: Decimal integer (int).
> * `%c`: Single character (char), e.g., 'a'.
> * `%p` or `%x`: Memory address / hexadecimal (very useful to inspect pointer values).

:::shellviz{command="man 3 sprintf" suggestions="man 3 sprintf,man 2 write,man gcc" title="Terminal — Inspect sprintf and write manual pages"}
:::

---

## Block 2: Makefile Rules (Exercises 1 to 4)

Fundamental rule format:
```makefile
target: dep1 dep2 ... depN
	command
```

* **Mandatory requirement**: The command line must begin with a **`TAB`**. Spaces cause the `missing separator` error.

```makefile
all: llistaParametres

llistaParametres: llistaParametres.c
	gcc -o llistaParametres llistaParametres.c

clean:
	rm -f llistaParametres *.o
```

:::shellviz{command="make" suggestions="make,make clean" title="Terminal — Automation with make"}
:::

---

## Block 3: Common Compiler Errors (Exam)

| Error / Warning from `gcc` | Cause | Solution |
| :--- | :--- | :--- |
| `error: 'i' undeclared` | Loop variable not declared | Declare `int i;` beforehand or `for (int i = 0; ...)` |
| `warning: implicit declaration of 'sprintf'` | Missing format header | `#include <stdio.h>` |
| `warning: implicit declaration of 'strlen'` | Missing strings header | `#include <string.h>` |
| `warning: implicit declaration of 'write'` | Missing POSIX header | `#include <unistd.h>` |
| `warning: return with a value in void function` | Function declared as `void main` | Declare `int main(int argc, char *argv[])` |
| `error: syntax error at end of input` | Missing closing brace `}` | Close the loop or function brace |

### Corrected Code (`listaParametros.c`)
```c
#include <stdio.h>
#include <string.h>
#include <unistd.h>

int main(int argc, char *argv[]) {
    char buf[128];
    for (int i = 0; i < argc; i++) {
        sprintf(buf, "Argument %d is %s\n", i, argv[i]);
        write(1, buf, strlen(buf));
    }
    return 0;
}
```

---

## Block 4: `argc` and `argv` Parameters

* **`argc`**: Total argument count ($\ge 1$).
* **`argv`**: Vector of strings `char *`.
  * `argv[0]`: Invoked program name or path (`./llistaParametres`).
  * `argv[1]` ... `argv[argc-1]`: User-supplied command-line parameters.
  * `argv[argc]`: Holds `NULL`.
* **Exam Rule**: Command-line arguments **ALWAYS arrive as `char *`**, never as integers. String conversion (`atoi`) is required for numeric arithmetic.
* **Quotes in Shell**: `./prog 10 "dos tres"` $\rightarrow$ `argc = 3`: `argv[1]="10"`, `argv[2]="dos tres"`.

:::shellviz{command="./llistaParametros a b c" suggestions="./llistaParametros a b c,./llistaParametros,./llistaParametros 100 200" title="Terminal — Passing arguments through argc and argv"}
:::

---

## Block 5: `Usage()` Function and Parameter Validation

All exam programs must validate the received argument count. If incorrect, they print usage instructions and exit with `exit(1)`:

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

:::shellviz{command="./llistaParametres" suggestions="./llistaParametres,./llistaParametres fitxer1 fitxer2" title="Terminal — Execution with invalid parameters and Usage()"}
:::

---

## Block 6: Pointers in C (`punters.c`)

* `&A`: Address-of operator: retrieves the memory address of variable `A`.
* `*PA`: Dereference operator: reads or modifies the value at the address pointed to by `PA`.

```c
int A;
int *PA = &A;
*PA = 4; // Now A holds 4!
```

> Always verify `if (pointer == NULL)` prior to dereferencing to prevent `Segmentation Fault` (`SIGSEGV`).

:::shellviz{command="./punters" suggestions="./punters,cat test.txt" title="Terminal — Verification of pointers in memory"}
:::

---

## Block 7: Converting Characters to Integers (`suma.c`)

1. **`char2int`**: Subtracts the ASCII value of character `'0'`:
   ```c
   unsigned int char2int(char c) { return (unsigned int)(c - '0'); }
   ```
2. **`mi_atoi`**: Converts a string to an integer handling positive/negative sign:
   ```c
   int mi_atoi(char *s) {
       int res = 0, sign = 1, i = 0;
       if (s[0] == '-') { sign = -1; i = 1; }
       for (; s[i] != '\0'; i++) res = res * 10 + char2int(s[i]);
       return res * sign;
   }
   ```

:::shellviz{command="./suma 100 2 3 4 100" suggestions="./suma 100 2 3 4 100,./suma -1 1,./suma 100 a" title="Terminal — Running suma.c with error handling"}
:::

---

## Block 8: Modularization and Compilation with `gcc`

Separation into `.h` (public prototypes) and `.c` (implementation):

```c
/* mis_funciones.h */
#ifndef MIS_FUNCIONES_H
#define MIS_FUNCIONES_H
unsigned int char2int(char c);
int mi_atoi(char *s);
#endif
```

### Question 28: `gcc` Compiler Options
* **Generate object file `.o` without linking:**
  `gcc -c mis_funciones.c` (flag **`-c`**).
* **Directory to find header files `.h`:**
  `gcc -c suma.c -I.` (flag **`-I<dir>`**; `-I.` for current directory, `-I../inc` for subdirectories).
* **Library directory and linking:**
  `gcc -o prog prog.c -I../inc -L../lib -lmates` (`-L` specifies library search path, `-l` specifies library name omitting `lib` prefix and `.a` extension).

:::shellviz{command="gcc -c mis_funciones.c -I." suggestions="gcc -c mis_funciones.c -I.,gcc -o suma suma.c mis_funciones.o -I.,ls -l" title="Terminal — Modular compilation with gcc -c and -I"}
:::

---

## Block 9: Word Counter (`words.c`)

A word is delimited by space `' '`, dot `'.' `, comma `','`, or newline `'\n'`:

```c
int esDelimitador(char c) {
    return (c == ' ' || c == '.' || c == ',' || c == '\n');
}

// Inside main:
int count = 0, enParaula = 0;
for (int i = 0; str[i] != '\0'; i++) {
    if (!esDelimitador(str[i])) {
        if (!enParaula) { count++; enParaula = 1; }
    } else {
        enParaula = 0;
    }
}
```

:::shellviz{command="./words \"This is a sentence.\"" suggestions="./words \"This is a sentence.\",./words hello" title="Terminal — Running words.c"}
:::

---

## Submission Package Summary (`sessio02.tar.gz`)

| File | Content |
| :--- | :--- |
| `entrega.txt` | Answers to laboratory questions. |
| `makefile_1` / `makefile_4` / `makefile_5` / `makefile` | Basic, modular, and final Makefiles with `all` and `clean` rules. |
| `listaParametros.c` | Source code with `Usage()` and `argc` verification. |
| `mis_funciones.h` / `mis_funciones.c` | Header and modular implementation (`char2int`, `mi_atoi`). |
| `suma.c` / `punters.c` / `words.c` | Argument sum programs, pointer checks, and word counter. |

:::shellviz{command="tar ztfv sessio02.tar.gz" suggestions="tar ztfv sessio02.tar.gz,ls -la" title="Terminal — Verification of files inside archive"}
:::
