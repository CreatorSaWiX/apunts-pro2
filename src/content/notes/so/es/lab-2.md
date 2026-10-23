---
title: "Lab 2: El lenguaje C"
description: "Ejercicios y preguntas de la sesión 2 de laboratorio."
readTime: "7 min"
order: 2.5
draft: false
---

## Guía de la sesión 2: el lenguaje C y compilación

Respuestas concisas a las preguntas del laboratorio (`entrega.txt`) para el examen SIMLAB.

Empaquetar la entrega:
:::shellviz{command="tar zcfv sessio02.tar.gz entrega.txt makefile_1 listaParametros.c makefile_4 mis_funciones.h mis_funciones.c suma.c punters.c makefile_5 words.c makefile" suggestions="tar zcfv sessio02.tar.gz entrega.txt,tar ztfv sessio02.tar.gz" title="Terminal — Empaquetar la entrega de la Sesión 2"}
:::

---

## Bloque 1: Salida a bajo nivel (`sprintf` + `write`)

En SO **no** se usa `cout` ni `printf`. Patrón estándar obligatorio:

```c
#include <stdio.h>   // sprintf (man 3 sprintf)
#include <string.h>  // strlen (man 3 strlen)
#include <unistd.h>  // write (man 2 write)

char buffer[128];
int valor = 42;
sprintf(buffer, "El resultado es: %d\n", valor);
write(1, buffer, strlen(buffer)); // 1 = stdout, 2 = stderr
```

> Recordemos que `%.` es una variable cuyo valor es el siguiente argumento.
> * `%s`: Cadena de caracteres (char *).
> * `%d`: Entero decimal (int).
> * `%c`: Un solo carácter (char), por ejemplo 'a'.
> * `%p` o `%x`: Direcciones de memoria / hexadecimal (muy útil para ver el valor de un puntero).

:::shellviz{command="man 3 sprintf" suggestions="man 3 sprintf,man 2 write,man gcc" title="Terminal — Consultar el manual de sprintf y write"}
:::

---

## Bloque 2: Reglas de Makefile (Ejercicios 1 a 4)

Formato fundamental de una regla:
```makefile
target: dep1 dep2 ... depN
	comando
```

* **Requisito obligatorio**: La línea del comando debe empezar con un **`TAB`**. Los espacios producen el error `missing separator`.

```makefile
all: llistaParametres

llistaParametres: llistaParametres.c
	gcc -o llistaParametres llistaParametres.c

clean:
	rm -f llistaParametres *.o
```

:::shellviz{command="make" suggestions="make,make clean" title="Terminal — Automatización con make"}
:::

---

## Bloque 3: Errores frecuentes del compilador (Examen)

| Error / Aviso de `gcc` | Causa | Solución |
| :--- | :--- | :--- |
| `error: 'i' undeclared` | Variable del bucle no declarada | Declarar `int i;` antes o `for (int i = 0; ...)` |
| `warning: implicit declaration of 'sprintf'` | Falta la cabecera de formato | `#include <stdio.h>` |
| `warning: implicit declaration of 'strlen'` | Falta la cabecera de cadenas | `#include <string.h>` |
| `warning: implicit declaration of 'write'` | Falta la cabecera POSIX | `#include <unistd.h>` |
| `warning: return with a value in void function` | Función declarada `void main` | Declarar `int main(int argc, char *argv[])` |
| `error: syntax error at end of input` | Llave de cierre `}` olvidada | Cerrar la llave del bucle o función |

### Código corregido (`listaParametros.c`)
```c
#include <stdio.h>
#include <string.h>
#include <unistd.h>

int main(int argc, char *argv[]) {
    char buf[128];
    for (int i = 0; i < argc; i++) {
        sprintf(buf, "El argumento %d es %s\n", i, argv[i]);
        write(1, buf, strlen(buf));
    }
    return 0;
}
```

---

## Bloque 4: Parámetros `argc` y `argv`

* **`argc`**: Número total de argumentos ($\ge 1$).
* **`argv`**: Vector de cadenas `char *`.
  * `argv[0]`: Nombre o ruta del programa invocado (`./llistaParametres`).
  * `argv[1]` ... `argv[argc-1]`: Parámetros pasados por el usuario.
  * `argv[argc]`: Vale `NULL`.
* **Regla de Examen**: Los argumentos llegan **SIEMPRE como `char *`**, nunca como enteros. Hay que hacer conversión (`atoi`) para operar numéricamente.
* **Comillas en la Shell**: `./prog 10 "dos tres"` $\rightarrow$ `argc = 3`: `argv[1]="10"`, `argv[2]="dos tres"`.

:::shellviz{command="./llistaParametros a b c" suggestions="./llistaParametros a b c,./llistaParametros,./llistaParametros 100 200" title="Terminal — Paso de argumentos a través de argc y argv"}
:::

---

## Bloque 5: Función `Usage()` y validación de parámetros

Todos los programas de examen deben validar el número de argumentos recibidos. Si es incorrecto, muestran ayuda y terminan con `exit(1)`:

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

:::shellviz{command="./llistaParametres" suggestions="./llistaParametres,./llistaParametres fitxer1 fitxer2" title="Terminal — Ejecución con parámetros incorrectos y Usage()"}
:::

---

## Bloque 6: Punteros en C (`punters.c`)

* `&A`: Obtener la dirección de memoria de la variable `A`.
* `*PA`: Leer o modificar el valor de la celda apuntada por `PA`.

```c
int A;
int *PA = &A;
*PA = 4; // ¡Ahora A vale 4!
```

> Comprobar siempre `if (puntero == NULL)` antes de acceder para evitar `Segmentation Fault` (`SIGSEGV`).

:::shellviz{command="./punters" suggestions="./punters,cat test.txt" title="Terminal — Ejecución de verificación de punteros en memoria"}
:::

---

## Bloque 7: Conversión de caracteres a enteros (`suma.c`)

1. **`char2int`**: Resta el valor ASCII del carácter `'0'`:
   ```c
   unsigned int char2int(char c) { return (unsigned int)(c - '0'); }
   ```
2. **`mi_atoi`**: Convierte una cadena a entero gestionando el signo:
   ```c
   int mi_atoi(char *s) {
       int res = 0, sign = 1, i = 0;
       if (s[0] == '-') { sign = -1; i = 1; }
       for (; s[i] != '\0'; i++) res = res * 10 + char2int(s[i]);
       return res * sign;
   }
   ```

:::shellviz{command="./suma 100 2 3 4 100" suggestions="./suma 100 2 3 4 100,./suma -1 1,./suma 100 a" title="Terminal — Ejecución de suma.c con control de errores"}
:::

---

## Bloque 8: Modularización y compilación con `gcc`

División en `.h` (prototipos públicos) y `.c` (implementación):

```c
/* mis_funciones.h */
#ifndef MIS_FUNCIONES_H
#define MIS_FUNCIONES_H
unsigned int char2int(char c);
int mi_atoi(char *s);
#endif
```

### Pregunta 28: Opciones de `gcc`
* **Generar archivo objeto `.o` sin enlazar:**
  `gcc -c mis_funciones.c` (flag **`-c`**).
* **Directorio para encontrar archivos de cabecera `.h`:**
  `gcc -c suma.c -I.` (flag **`-I<dir>`**; `-I.` para el directorio actual, `-I../inc` para subdirectorios).
* **Directorio de bibliotecas y enlace:**
  `gcc -o prog prog.c -I../inc -L../lib -lmates` (`-L` directorio, `-l` biblioteca sin prefijo `lib` ni extensión `.a`).

:::shellviz{command="gcc -c mis_funciones.c -I." suggestions="gcc -c mis_funciones.c -I.,gcc -o suma suma.c mis_funciones.o -I.,ls -l" title="Terminal — Compilación modular con gcc -c e -I"}
:::

---

## Bloque 9: Contador de palabras (`words.c`)

Una palabra está delimitada por espacio `' '`, punto `'.' `, coma `','` o salto de línea `'\n'`:

```c
int esDelimitador(char c) {
    return (c == ' ' || c == '.' || c == ',' || c == '\n');
}

// Dentro de main:
int count = 0, enPalabra = 0;
for (int i = 0; str[i] != '\0'; i++) {
    if (!esDelimitador(str[i])) {
        if (!enPalabra) { count++; enPalabra = 1; }
    } else {
        enPalabra = 0;
    }
}
```

:::shellviz{command="./words \"Esta es una frase.\"" suggestions="./words \"Esta es una frase.\",./words hola" title="Terminal — Ejecución de words.c"}
:::

---

## Resumen del paquete de entrega (`sessio02.tar.gz`)

| Archivo | Contenido |
| :--- | :--- |
| `entrega.txt` | Respuestas a las preguntas del laboratorio. |
| `makefile_1` / `makefile_4` / `makefile_5` / `makefile` | Makefiles básicos, modulares y final con reglas `all` y `clean`. |
| `listaParametros.c` | Código con `Usage()` y comprobación de `argc`. |
| `mis_funciones.h` / `mis_funciones.c` | Cabecera e implementación modular (`char2int`, `mi_atoi`). |
| `suma.c` / `punters.c` / `words.c` | Programas de suma de argumentos, verificación de punteros y contador de palabras. |

:::shellviz{command="tar ztfv sessio02.tar.gz" suggestions="tar ztfv sessio02.tar.gz,ls -la" title="Terminal — Verificación de los archivos contenidos en el paquete"}
:::
