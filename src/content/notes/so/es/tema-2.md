---
title: "Tema 2: Lenguaje C"
description: "Makefiles, llamadas de bajo nivel, herramientas de inspección y gestión de errores."
readTime: "15 min"
order: 2
draft: false
---

## 2.1 Ciclo de compilación en UNIX

El paso de código fuente en C a un archivo ejecutable se realiza en **3 pasos consecutivos**:

:::compileviz
:::

| Fase | Herramienta | ¿Qué hace exactamente? | Archivos resultantes |
| :--- | :--- | :--- | :--- |
| **1. Preprocesador** | `cpp` | Sustitución de texto pura: copia y pega el texto de los `#include`, sustituye las palabras del `#define` por su valor y elimina todos los comentarios. | Texto expandido (`.i`) |
| **2. Compilador** | `gcc -c` | Comprueba que no haya errores de sintaxis ni de tipos y traduce el C a instrucciones máquina del procesador. Deja pendientes las direcciones de funciones que están fuera de este archivo. | Archivo objeto (`.o`) |
| **3. Enlazador (*Linker*)** | `ld` (vía `gcc`) | Junta los archivos `.o` con las bibliotecas del sistema (como `libc`), asigna las direcciones finales de cada función y crea el ejecutable. | Ejecutable (`a.out` o nombre indicado) |

:::shellviz{command="gcc --version" suggestions="gcc --version,which gcc" title="Terminal: Comprobación del compilador GCC"}
:::

---

## 2.2 `sprintf` + `write`

`printf` y `cout` son funciones de alto nivel que guardan datos en una memoria intermedia propia antes de escribir. Pero en SO se utiliza la combinación directa de bajo nivel:

1. **`sprintf(buf, format, ...)`** (`man 3 sprintf`, `<stdio.h>`): Convierte números o variables a una cadena de texto ASCII dentro del vector `buf`. **Todo lo que queramos mostrar por pantalla debe ser texto ASCII.**
2. **`write(fd, buf, nbytes)`** (`man 2 write`, `<unistd.h>`): Llamada a sistema que vuelca directamente los bytes al canal indicado por `fd`.

`fd` (*file descriptor*) o **descriptor de archivo** es simplemente un **número entero** que el SO asigna a cada archivo o dispositivo abierto para identificarlo. Cada proceso tiene abiertos por defecto **3 canales**:
* `fd = 0`: **`stdin`** (entrada estándar, teclado).
* `fd = 1`: **`stdout`** (salida estándar, pantalla).
* `fd = 2`: **`stderr`** (salida de errores, pantalla por defecto).

```c
#include <stdio.h>
#include <string.h>
#include <unistd.h>

char buf[128];
int valor = 42;
// 1. Preparamos el texto en memoria
int len = sprintf(buf, "El resultado es: %d\n", valor);
// 2. Lo escribimos en la salida estándar (canal 1)
write(1, buf, len);
```

:::shellviz{command="man 2 write" suggestions="man 2 write,man 3 sprintf,man 3 strlen" title="Terminal: Consulta de la llamada a sistema write"}
:::

---

## 2.3 Makefiles

La herramienta `make` sirve para no tener que recompilar todo el proyecto entero cada vez que hacemos un cambio pequeño. Compara la fecha de modificación del archivo que queremos crear (*target*) con la de los archivos de los que depende (*dependencias*).

### Sintaxis estricta de una regla
```makefile
target: dependencia1 dependencia2 ... dependenciaN
	comando_de_generación
```
La línea del comando **DEBE empezar con un TABULADOR**. Si pones espacios, `make` fallará con el error `missing separator. Stop.`

:::shellviz{command="make" suggestions="make,make clean" title="Terminal: Automatización con make"}
:::

### ¿Por qué hay que poner los archivos `.h` como dependencias?
Los archivos de cabecera (`.h`) no se compilan directamente, pero el preprocesador los incluye dentro de los `.c`. Si pones solo `util.o: util.c`, y mañana cambias una definición en `util.h`, `make` **no se dará cuenta del cambio** y no recompilará `util.o`. Tu programa quedará desactualizado con errores extraños de memoria.

```makefile
util.o: util.c util.h
	gcc -c util.c
```

### Ejemplo de makefile:
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

---

## 2.4 Flags fundamentales de `gcc`

| Flag | ¿Qué hace? | Ejemplo de Uso |
| :--- | :--- | :--- |
| **`-c`** | Genera solo el archivo objeto (`.o`) sin enlazar. | `gcc -c util.c` (crea `util.o`) |
| **`-o nombre`** | Elige el nombre del archivo ejecutable que se creará (en lugar de `a.out`). | `gcc -o prog prog.o` |
| **`-I dir`** | Indica dónde buscar archivos `.h` si están en otra carpeta. | `gcc -c main.c -I./include` |
| **`-L dir`** | Indica dónde buscar bibliotecas (`.a` o `.so`). | `gcc -o prog prog.o -L./libs -lutil` |
| **`-l nombre`** | Enlaza con la biblioteca `lib<nombre>.a` o `.so` (sin el prefijo `lib` ni extensión). | `-lm` (enlaza la biblioteca matemática `libm.so`) |
| **`-Wall`** | Muestra todos los avisos (*warnings*) de cosas que podrían ser errores. | `gcc -Wall -c prog.c` |
| **`-static`** | Realiza **enlace estático**: copia todo el código de las bibliotecas dentro del ejecutable. | `gcc -static -o prog_static prog.c` |

---

## 2.5 Compilación estática vs dinámica (`-static`)

Esta es una pregunta muy frecuente en los exámenes:

| Propiedad | Compilación Dinámica (por defecto) | Compilación Estática (`gcc -static`) |
| :--- | :--- | :--- |
| **Composición del archivo** | Solo contiene nuestro código y referencias a las bibliotecas del sistema (`libc.so`). | **Copia física completa** de todo el código de las funciones de biblioteca dentro del propio archivo binario. |
| **Tamaño del ejecutable** | **Muy pequeño** (p. ej. 15 KB). | **Muy grande** (p. ej. 800 KB - 1 MB o más). |
| **Al ejecutar el programa** | El sistema operativo carga las bibliotecas compartidas desde el disco a la memoria RAM. | El binario lleva todo lo necesario dentro y no depende de archivos externos. |
| **Mapa de memoria (`maps`)** | Muestra regiones de memoria para el programa y para las bibliotecas compartidas (`libc.so`). | Mapa de memoria limpio: solo el programa, el *heap* y la pila (*stack*). |
| **Tabla de símbolos (`nm`)** | Las funciones de biblioteca aparecen como **`U` (*undefined*)** porque se resolverán en ejecución. | Todas las funciones de biblioteca aparecen resueltas con dirección en la sección **`T` (*text*)**. |

---

## 2.6 Herramientas para analizar binarios: `nm`, `objdump` y `strace`

### 1. `nm <ejecutable>`: la tabla de símbolos
Lee la lista de funciones y variables globales que contiene el archivo:
* **`T` / `t`**: Código / Texto (funciones del programa como `main`).
* **`D` / `d`**: Datos inicializados (variables globales con valor inicial: `int x = 5;`).
* **`B` / `b`**: BSS (variables globales sin valor inicial: `int y;`). El sistema operativo las pone a 0 automáticamente al cargar el programa.
* **`R` / `r`**: Datos de solo lectura (constantes como `const int c = 1;` o textos entre comillas).
* **`U`**: Símbolos no definidos (funciones externas que se enlazarán en tiempo de ejecución).

*¿Por qué las variables locales de una función NO aparecen en `nm`?*  
Porque las variables locales no se guardan en el archivo ejecutable en disco. Se crean y se destruyen al vuelo dentro de la **pila (*stack*)** de la memoria RAM cuando se ejecuta la función.

### 2. `objdump -d <ejecutable>`
Desensambla el archivo binario y te muestra las instrucciones en lenguaje ensamblador para ver exactamente qué instrucciones ejecutará la CPU.

### 3. `strace <ejecutable>`
Ejecuta el programa y muestra por pantalla **todas las llamadas a sistema que realiza mientras corre**, qué argumentos pasa y qué devuelve cada una.
* `strace -e read ./prog < archivo`: filtra para ver solo las llamadas `read`.
* `strace -o registro.txt ./prog`: guarda la lista en un archivo de texto.

Si lees un archivo de 1024 bytes carácter a carácter (`read(0, &c, 1)`), haces **1024 llamadas a sistema**. Cada llamada obliga a la CPU a cambiar de modo usuario a kernel y guardar registros, ralentizando notablemente el programa. En cambio, si lees con un búfer de 256 bytes (`read(0, buf, 256)`), solo haces **4 llamadas a sistema**, y el programa funciona mucho más rápido.

---

## 2.7 Parámetros de `main`: `argc` y `argv`

```c
int main(int argc, char *argv[])
```

* **`argc`**: Cuántos argumentos se han pasado por la terminal (como mínimo vale 1).
* **`argv`**: Vector de cadenas de texto (`char *`):
  * `argv[0]`: El nombre del programa tal como se ha llamado (`./prog`).
  * `argv[1]` hasta `argv[argc - 1]`: Los argumentos del usuario.
  * `argv[argc]`: Siempre vale `NULL`.
* **Importante**: Los argumentos llegan **SIEMPRE como texto**. Si escribes `./prog 42`, `argv[1]` es la palabra `"42"`, no el número entero. Para hacer cálculos hay que convertirlo antes con `atoi(argv[1])`.

### Patrón de la función `Usage()`
En todos los exámenes debes comprobar que el usuario haya pasado los argumentos correctos antes de empezar a hacer nada:

```c
#include <unistd.h>
#include <stdlib.h>
#include <string.h>
#include <stdio.h>

void Usage(char *nom_prog) {
    char buf[128];
    int len = sprintf(buf, "Usage: %s <num_elementos> <archivo>\n", nom_prog);
    write(2, buf, len); // Canal 2: stderr (mensajes de error)
    exit(1);
}

int main(int argc, char *argv[]) {
    if (argc != 3) {
        Usage(argv[0]);
    }
    // Si es correcto, continúa el programa...
    return 0;
}
```

---

## 2.8 Control de errores con `perror()`

Todas las llamadas a sistema en Linux devuelven `-1` cuando fallan y guardan el motivo del error en la variable `errno`.

* La función `perror(mensaje)` (`man 3 perror`) escribe por el canal 2 (`stderr`) tu mensaje seguido de la descripción clara del error ocurrido:

```c
void error_y_exit(char *msg, int codigo_salida) {
    perror(msg);
    exit(codigo_salida);
}

// Ejemplo al abrir un archivo:
int fd = open("datos.txt", O_RDONLY);
if (fd < 0) {
    error_y_exit("Error al abrir el archivo", 1);
}
```

---

## 2.9 Punteros y direcciones de memoria

Un **puntero** es una variable que guarda una dirección de memoria RAM:
* `&variable`: "¿En qué dirección de memoria está guardada esta variable?".
* `*puntero`: "¿Qué valor hay guardado en la dirección donde apunta este puntero?".

```c
int a = 10;
int *p = &a; // p guarda la dirección de 'a'
*p = 25;     // Cambia el valor de 'a' a 25 a través del puntero
```

* **Errores graves de punteros**:
  1. Desreferenciar `NULL` (`int *p = NULL; *p = 5;`): provoca que la CPU detenga el programa con un **`Segmentation Fault` (señal `SIGSEGV`)**.
  2. Utilizar punteros sin inicializar: apuntan a direcciones al azar de la memoria y pueden corromper otros datos.

---

## 2.10 Preguntas típicas de examen resueltas (Tema 2)

### 1. ¿Por qué un ejecutable compilado con `-static` ocupa tanto espacio comparado con el normal?
Porque el flag `-static` copia físicamente todo el código máquina de las funciones de biblioteca (como `sprintf`, `strlen`, etc.) dentro del propio archivo ejecutable. En la compilación dinámica, el archivo solo guarda una pequeña referencia y las bibliotecas se comparten en la memoria desde el sistema.

### 2. ¿A qué sección del archivo binario pertenecen estas variables según `nm`: una constante global, una global inicializada a 0, una global inicializada a 100, y una variable local de `main`?
* Constante global: sección **`R` / `r` (*rodata*)** (solo lectura).  
* Global inicializada a 0: sección **`B` / `b` (*bss*)** (sin valor inicial, el sistema la pone a 0 al cargarla).  
* Global inicializada a 100: sección **`D` / `d` (*data*)** (datos inicializados guardados en el binario).  
* Variable local de `main`: **No aparece en `nm`**, porque se crea en la pila (*stack*) de memoria mientras el programa se ejecuta.
