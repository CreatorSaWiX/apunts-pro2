---
title: "Tema 5: Gestión de memoria"
description: "Traducción de direcciones, MMU, paginación, memoria dinámica (sbrk y malloc), mmap, COW y memoria virtual."
readTime: "15 min"
order: 5
draft: false
isUpdated: 1
---

## 5.1 Fundamentos y multiprogramación

Para ejecutar un programa, sus instrucciones y datos deben residir en la RAM:
* **Program Counter (PC)**: Registro de la CPU con la dirección de la siguiente instrucción a ejecutar.
* **Instrucciones**: Los saltos (`jmp`, `call`) y accesos a memoria (`mov`) referencian direcciones de destino.

Los sistemas modernos son **multiprogramados** (mantienen varios procesos simultáneos en RAM para alternar la CPU sin cargar desde disco en cada cambio de contexto). Esto impone **3 retos al SO**:

1. **Protección**: Ningún proceso puede acceder a la memoria de otros procesos ni a la del Kernel.
2. **Asignación dinámica**: El SO ubica el proceso en la memoria física libre disponible (varía en cada ejecución).
3. **Traducción de direcciones**: Es necesario traducir las direcciones del código a posiciones físicas reales de memoria.

### Direcciones lógicas vs direcciones físicas

:::addrspaceviz
:::

* **Dirección lógica o virtual (`@L`)**: Es la dirección que genera el compilador y que referencia el programa durante su ejecución. Cada proceso tiene su propio espacio de direcciones aislado (empezando desde `0`), creyendo que dispone de toda la memoria para él solo sin saber qué posición física ocupará.
* **Dirección física o real (`@F`)**: Es la posición real y tangible dentro de los chips de memoria RAM donde se almacenan los datos e instrucciones. El proceso nunca tiene acceso directo a ella; es gestionada por el sistema operativo y la MMU se encarga de traducir cada `@L` a su `@F`.

---

## 5.2 Soporte hardware: MMU, tabla de páginas y TLB

La traducción de direcciones se realiza **en tiempo de ejecución directamente por el hardware (HW)** para no penalizar la velocidad de la CPU.

### La MMU (*Memory Management Unit*)
Componente físico de la CPU situado entre la unidad de ejecución y el bus de memoria:

:::mmuviz
:::

1. La CPU emite una **dirección lógica (`@L`)**.
2. La MMU intenta traducirla a una **dirección física (`@F`)**.
3. **Acceso válido**: Si la dirección existe y tiene permisos adecuados (lectura `r`, escritura `w`, ejecución `x`), la MMU envía la `@F` al bus de memoria RAM.
4. **Acceso inválido**: Si la dirección no pertenece al proceso o vulnera permisos, la MMU dispara una **excepción de hardware** (*trap*). El Kernel la atiende (habitualmente enviando `SIGSEGV` al proceso).

### La tabla de páginas (TP)
Estructura de datos del Kernel (una por proceso) que describe la correspondencia de memoria:

* La dirección lógica se divide en dos partes:
  * **Página ($p$)**: Identificador de la página lógica.
  * **Desplazamiento ($d$)**: Posición exacta dentro de la página (se mantiene idéntico en la dirección física).
* Cada entrada (*PTE*) contiene:
  * **Bit de presencia/validez**: `1` si la página está en RAM; `0` si está en disco/swap.
  * **Permisos**: Bits de lectura (`r`), escritura (`w`) y ejecución (`x`).
  * **Bit de modificación (*dirty bit*)**: La CPU lo pone a `1` si se ha escrito en ella.
  * **Marco físico ($f$)**: Número de marco de la RAM donde se aloja.

:::pagetableviz
:::

> **Cambio de contexto:**  
> La dirección base de la TP de cada proceso se guarda en su **PCB**. Al conmutar de proceso, el Kernel carga esta dirección base en el registro de control de la CPU (`%cr3` en x86). A partir de ese ciclo, la MMU traduce según la TP del nuevo proceso.

### La TLB (*Translation Lookaside Buffer*)
Memoria caché asociativa de alta velocidad en la propia CPU para acelerar traducciones:
* **TLB Hit**: La traducción $p \rightarrow f$ está en la TLB; resolución inmediata sin acceder a RAM.
* **TLB Miss**: La traducción no está; la MMU consulta la TP en RAM, actualiza la TLB y accede al dato.
* **Cambio de contexto**: La TLB se invalida porque pertenece al espacio de direcciones del proceso anterior.

:::tlbviz
:::

---

## 5.3 Carga de un ejecutable y anatomía del espacio lógico

Al hacer `exec`, el Kernel lee el binario **ELF** y construye sus regiones lógicas en el espacio de direcciones:

### 1. Regiones de memoria y secciones ELF (`objdump -h`)

:::memlayoutviz
:::

| Región / Sección ELF | Permisos en `maps` | ¿Qué contiene? |
| :--- | :---: | :--- |
| **`.text`** (Código) | `r-xp` | Instrucciones ejecutables (solo lectura por protección). |
| **`.rodata`** (Constantes) | `r--p` | Constantes y cadenas literales. |
| **`.data`** y **`.bss`** (Globales) | `rw-p` | Variables globales/estáticas (`.bss` sin inicializar ocupa 0 B en disco; el SO lo rellena de ceros). |
| **`[heap]`** | `rw-p` | Memoria dinámica (`sbrk`/`malloc`). Crece hacia direcciones altas ($\uparrow$). |
| **`[stack]`** | `rw-p` | Variables locales y marcos de función. Crece hacia direcciones bajas ($\downarrow$). |

* **Dirección 0 (`NULL`)**: Página no asignada intencionadamente; desreferenciar `NULL` provoca un `SIGSEGV` inmediato.

### 2. Inspección real con `/proc/[PID]/maps`

:::shellviz{command="cat /proc/self/maps" suggestions="cat /proc/self/maps,cat /proc/self/status,cat /proc/self/limits,ls -l /proc/self" title="Terminal — Mapa de memoria virtual del proceso (/proc/self/maps)"}
:::

* **Formato de cada línea**: `[rango de direcciones] [permisos] [offset] [dispositivo] [inodo] [etiqueta]`
* **`p` (*Private*) vs `s` (*Shared*)**: `p` indica región privada con *Copy-On-Write*; `s` indica memoria compartida real entre procesos.
* **Detalles prácticos clave**:
  * **`[heap]` no aparece en `maps`** hasta que el proceso pide memoria dinámica (`sbrk`/`malloc`).
  * **Bibliotecas dinámicas (`libc.so`)**: Se mapean en la zona intermedia (*mmap*).
  * **`[vvar]` y `[vdso]`**: Páginas del Kernel mapeadas en espacio de usuario para acelerar llamadas frecuentes (ej. `gettimeofday`) sin cambio de contexto.

---

## 5.4 Asignación física: Paginación

* **Página**: Bloque lógico de tamaño fijo potencia de 2 (estándar: **4096 bytes = 4 KB**).
* **Marco (*Frame*)**: Bloque físico en la RAM del mismo tamaño (4 KB).
* **Asignación no contigua**: Las páginas de un proceso se reparten en marcos libres dispersos; la TP mantiene la continuidad lógica.
* **Aislamiento por región**: Cada región lógica (código, datos, heap, pila, mmap) ocupa páginas separadas: dos regiones distintas **nunca comparten un mismo marco físico**.

:::pagingviz
:::

### Fragmentación interna vs externa

:::fragviz
:::

| Tipo | ¿Qué es? | ¿En la Paginación? | Cálculo |
| :--- | :--- | :---: | :--- |
| **Interna** | Memoria asignada pero no utilizada porque la región no es múltiplo de 4096 B. | **SÍ** | Región de 2400 B en página de 4096 B $\rightarrow$ desperdicia $4096 - 2400 = 1696$ B en el último marco. |
| **Externa** | Huecos libres dispersos que no pueden satisfacer una petición contigua grande. | **NO** | Cualquier marco libre de 4 KB sirve para cualquier página. |

---

## 5.5 Memoria dinámica: `sbrk` vs `malloc`

### 1. Llamada al sistema: `sbrk()`
Modifica el límite del heap (*break pointer*):

```c
#include <unistd.h>
void *sbrk(intptr_t increment);
```
* `sbrk(0)`: Devuelve la dirección actual del límite del heap.
* `sbrk(N)`: Aumenta el heap en $N$ bytes y devuelve la dirección anterior.
* `sbrk(-N)`: Reduce el heap en $N$ bytes.

:::sbrkviz
:::

> **Granularidad del Kernel:**  
> Aunque pidas `sbrk(100)`, el Kernel asigna marcos físicos completos de **4096 bytes**. El límite efectivo en `/proc/[PID]/maps` siempre se redondea al siguiente múltiplo de página.

### 2. Biblioteca de C (`<stdlib.h>`): `malloc()`, `realloc()` y `free()`
Pedir memoria con `sbrk()` directamente es ineficiente (muchas llamadas al sistema e imposibilidad de liberar huecos intermedios). La `libc` lo gestiona en espacio de usuario:

* **`malloc(size)`** / **`calloc(n, tamaño)`** *(inicializado a 0)*: Reserva un bloque en el heap. `malloc(64)` suele pedir un bloque grande al Kernel (ej. 132 KB vía `sbrk`) para ir repartiendo trozos; para peticiones muy grandes (> ~128 KB), usa **`mmap()`** fuera del heap.
* **`realloc(ptr, nuevo_tamaño)`**: Redimensiona un bloque reservado previamente (lo amplía *in-situ* si hay espacio o lo mueve a una dirección nueva copiando el contenido y liberando el antiguo).
* **`free(ptr)`**: Marca el bloque como reutilizable dentro de `libc`. Habitualmente **no reduce el límite del heap (`sbrk`)** en bloques pequeños (sí hace `munmap` si provenía de `mmap`).

### `SIGSEGV`: `sbrk` vs `malloc` fuera de rango
* Con `char *p = sbrk(4096);`, acceder a `p[4100] = 'a';` cae fuera de la página asignada $\rightarrow$ la MMU no tiene traducción $\rightarrow$ **`SIGSEGV`**.
* Con `char *p = malloc(4096);`, acceder a `p[4100] = 'a';` puede no fallar porque la biblioteca ha pedido memoria en exceso y la posición 4100 está dentro de una página ya válida para la MMU (aunque sea un error grave de código).

:::mallocviz
:::

---

## 5.6 Mapeo fuera del heap: `mmap` y `munmap`

```c
#include <sys/mman.h>
void *mmap(void *addr, size_t length, int prot, int flags, int fd, off_t offset);
int munmap(void *addr, size_t length);
```

* `addr`: Dirección lógica sugerida (`NULL` para que el Kernel elija una dirección libre).
* `length`: Tamaño en bytes de la región (el Kernel reserva páginas completas de 4 KB).
* `prot` (permisos de acceso; se combinan con `|`):
  * **`PROT_READ`**: Permite leer de la región.
  * **`PROT_WRITE`**: Permite escribir en ella (sin este permiso, escribir provoca `SIGSEGV`).
  * **`PROT_EXEC`**: Permite ejecutar instrucciones de ella.
  * **`PROT_NONE`**: Sin ningún permiso de acceso (página bloqueada, útil como centinela).
* `flags` (comportamiento; requiere **`MAP_PRIVATE`** o **`MAP_SHARED`**, combinables con otros flags):
  * **`MAP_PRIVATE`**: Cambios privados (vía COW). No se modifican archivos ni otros procesos los ven.
  * **`MAP_SHARED`**: Cambios visibles por otros procesos y reflejados en el archivo.
  * **`MAP_ANONYMOUS`**: Reserva memoria pura sin ningún archivo asociado (`fd = -1`, `offset = 0`).
* `fd` y `offset`: Descriptor del archivo a mapear y desplazamiento inicial dentro del archivo (múltiplo de página).
* **Control de errores**: Si falla, `mmap` devuelve **`MAP_FAILED`** (¡no `NULL`!).

:::mmapviz
:::

### Patrón 1: Memoria anónima (`MAP_ANONYMOUS`)
Reserva memoria directa al margen del heap (`fd = -1`, `offset = 0`):
* Con **`MAP_PRIVATE | MAP_ANONYMOUS`**: buffer privado del proceso (alternativa a `malloc`), liberado con `munmap(ptr, tamaño)`.
* Con **`MAP_SHARED | MAP_ANONYMOUS`**: memoria compartida entre procesos emparentados tras un `fork()`:

```c
int *contador = mmap(NULL, sizeof(int), PROT_READ | PROT_WRITE,
                     MAP_SHARED | MAP_ANONYMOUS, -1, 0);
if (contador == MAP_FAILED) { perror("mmap"); exit(1); }

*contador = 100;
if (fork() == 0) {
    *contador = 42; // El hijo modifica el valor físico compartido
    exit(0);
}
waitpid(-1, NULL, 0);
// El padre lee 42: ¡comparten el mismo marco físico!
munmap(contador, sizeof(int));
```

### Patrón 2: Archivos mapeados en memoria
Permite leer y escribir archivos mediante punteros, sin `read()` ni `write()`:

```c
int fd = open("datos.bin", O_RDWR);
char *datos = mmap(NULL, 4096, PROT_READ | PROT_WRITE, MAP_SHARED, fd, 0);

datos[0] = 'X'; // Modifica el archivo en disco de forma transparente

munmap(datos, 4096);
close(fd);
```

---

## 5.7 Optimizaciones clave del sistema operativo

### 1. Carga bajo demanda (*demand paging*)
Al hacer `exec`, el SO no copia todo el archivo ejecutable a RAM:
* Crea las regiones en el PCB y marca las páginas como **no residentes** (bit de presencia a `0`).
* Cuando la CPU ejecuta una instrucción de una página no cargada, la MMU genera un fallo de página.
* El Kernel lee del disco exclusivamente ese bloque de 4 KB, lo ubica en un marco libre y reanuda el proceso.
* **Binarios estáticos (`-static`)**: Permite ejecutar programas grandes sin cargar código de bibliotecas que nunca se llegue a llamar.

:::demandpagingviz
:::

### 2. Bibliotecas dinámicas compartidas (`.so`)

:::sharedlibviz
:::

* El código de bibliotecas comunes como `libc.so` se carga **una sola vez en RAM** (ahorra disco y memoria física).
* Los procesos lo mapean como lectura/ejecución privada (`r-xp` en `maps`), pero mientras no se escriba en él, la MMU apunta a los **mismos marcos físicos compartidos**.
* Cada proceso mantiene su copia privada de datos (`.data`, `rw-p`).

### 3. Copy-On-Write (COW)
Elimina el coste de duplicar toda la memoria física en `fork()`:

1. **En la creación (`fork`)**: Padre e hijo comparten los mismos marcos físicos en RAM. Todas las entradas en la TP se marcan como **solo lectura (`r--` o `r-x`)**.
2. **En la escritura**: Cuando un proceso intenta escribir (`ret = fork()` en la pila o `*p = 'A'`):
   * La MMU detecta un intento de escritura no permitido y genera una excepción.
   * El Kernel comprueba en el PCB que el proceso tiene permiso de escritura (es una región COW).
   * El Kernel asigna un **nuevo marco físico de 4 KB**, copia en él el contenido del marco original, actualiza la TP del proceso escritor con permiso `rw-` y reinicia la instrucción.
3. **Páginas no modificadas**: El código y los datos solo leídos quedan **compartidos indefinidamente**.
4. **Mutación con `execlp()`**: Si el hijo muta, su espacio lógico y físico se destruye por completo y se recrea de cero; deja de compartir marcos con el padre.

:::cowviz
:::

---

## 5.8 Memoria virtual, fallos de página y thrashing

Permite que la suma de los espacios lógicos de los procesos supere la capacidad física de la RAM usando el disco como almacenamiento secundario (**área de Swap**).

* **Página residente**: Tiene un marco físico asignado en RAM (bit de presencia = 1).
* **Página no residente**: Almacenada en el disco o en el área de swap (bit de presencia = 0).

### Secuencia de un fallo de página (*page fault*)

:::pagefaultviz
:::

1. La CPU intenta acceder a una dirección lógica con bit de presencia = `0`.
2. La MMU lanza una excepción de fallo de página.
3. El Kernel pone el proceso en estado **`BLOCKED`**.
4. El Kernel busca un marco libre en RAM:
   * Si no hay ninguno libre, el **algoritmo de reemplazo** (LRU) elige una **página víctima**.
   * Si la víctima se ha modificado (*dirty bit* = 1), se escribe en el Swap; si no, se descarta. Su TP pasa a presencia = `0`.
5. El Kernel lee la página requerida desde el Swap o ejecutable y la copia al marco libre.
6. Actualiza la TP del proceso (asigna marco y bit de presencia = `1`).
7. El proceso pasa a **`READY`**.
8. Al recibir la CPU, la instrucción que había fallado se **reinicia desde el principio** y se ejecuta con éxito.

### Tipos de fallo y reemplazo de páginas

:::pagereplaceviz
:::

* **Excepción de MMU $\neq$ siempre `SIGSEGV`**: Cuando falla la traducción, el Kernel consulta el PCB. Solo envía `SIGSEGV` si la dirección no pertenece al proceso o viola permisos; si es *COW* o *page fault*, la resuelve de forma transparente y reinicia la instrucción.
* **Fallo menor (*Minor*) vs mayor (*Major Page Fault*)**:
  * **Menor**: La página ya está en RAM (ej. copia por *COW* o dato ya presente en la caché); **no accede a disco**.
  * **Mayor**: Hay que ir a buscar la página a disco o Swap; bloquea el proceso hasta completar la lectura.
* **Algoritmos básicos de reemplazo** (para elegir la página víctima si la RAM está llena):
  * **FIFO**: Expulsa la página que lleva más tiempo desde que entró.
  * **LRU (*Least Recently Used*)**: Expulsa la que lleva más tiempo sin utilizarse (muy buena eficiencia, cara de implementar en hardware puro).
  * **Reloj (*Second Chance*)**: Aproximación eficiente de LRU mediante un bit de acceso puesto a `1` por la MMU en cada lectura/escritura.

### Sobrepaginación (*thrashing*)

:::thrashingviz
:::

Se produce cuando la suma de los conjuntos de trabajo (*working sets*, mínimo de páginas que cada proceso necesita activas) supera la memoria física disponible:
* Los procesos se quitan marcos continuamente unos a otros.
* La CPU pasa el 99% del tiempo esperando transferencias de E/S con el Swap, y el rendimiento cae a cero.
* **Solución del SO**: Reduce el grado de multiprogramación expulsando procesos enteros al Swap (**estado *swapped-out***) hasta que los restantes terminan su trabajo.
