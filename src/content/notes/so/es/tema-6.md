---
title: "Tema 6: Entrada y Salida"
description: "Arquitectura en 3 niveles, tablas del kernel (TC, TFO, TI), llamadas básicas, pipes, redirecciones y concurrencia."
readTime: "18 min"
order: 6
draft: false
---

## 6.1 Conceptos básicos y arquitectura en 3 niveles

La **Entrada/Salida (E/S)** es la transferencia de datos entre un proceso y el exterior (siempre desde el punto de vista del proceso): **entrada** (exterior $\rightarrow$ proceso) y **salida** (proceso $\rightarrow$ exterior). A diferencia de librerías de alto nivel (`cin`/`cout`, `printf`/`scanf`), las llamadas al sistema (`read`/`write`) mueven **bytes puros**: la conversión a texto ASCII o tipos de datos es responsabilidad del programador.

### Visión HW e independencia de los dispositivos
* **Hardware**: La CPU se comunica con el **controlador** del periférico a través del bus mediante **puertos** (registros de control, estado y datos, con instrucciones `in`/`out` o direcciones mapeadas) y recibe **interrupciones (`int`)** cuando el dispositivo termina una operación.
* **Independencia de los dispositivos**: El código de usuario debe funcionar igual tanto si lee de un teclado, un archivo o una tubería. Para lograrlo, el SO ofrece **operaciones uniformes** (`open`, `read`, `write`, `close`), **dispositivos virtuales** (identificadores enteros) y capacidad de **redirección** (`programa < archivo1 > archivo2`).

### Diseño en 3 niveles

:::iolayersviz
:::

| Nivel | ¿Qué representa? | Responsabilidad principal | En Linux se identifica por... |
| :--- | :--- | :--- | :--- |
| **1. Virtual** | Dispositivo en uso dentro de un proceso | Aísla el programa del hardware real. | **Canal / `fd`** (entero: `0` `stdin`, `1` `stdout`, `2` `stderr`). |
| **2. Lógico** | Interfaz uniforme y compartición | Permisos, bloques de tamaño independiente y acceso concurrente. | **Nombre de archivo / ruta** (`/dev/tty0`, `datos.txt`). |
| **3. Físico** | Implementación en el controlador (*Device Driver*) | Traduce operaciones lógicas a órdenes físicas (pistas, sectores, motores). | **Tipo** (`b`/`c`) + par **`major` / `minor`**. |

* **`major`**: Indica el tipo de dispositivo (qué *Device Driver* lo gestiona).
* **`minor`**: Indica la instancia concreta dentro de ese tipo (ej: partición 1 vs partición 2 del mismo disco).

### Tipos de archivos en Linux y comando `mknod`
En Linux, casi todo se identifica con un archivo en el VFS (*Virtual File System*):
* **Archivo regular (*regular file*)**: Archivo de datos convencional.
* **Archivos especiales**: Directorio (`d`), Enlace simbólico (`l`), Dispositivo de bloques (`b`, ej: discos), Dispositivo de caracteres (`c`, ej: teclado, `/dev/null`), Pipe con nombre (`p` / FIFO) y Socket (`s`).

La llamada/comando **`mknod`** crea archivos especiales (no sirve para archivos regulares, directorios ni symlinks):
```bash
mknod nombre_archivo c major minor   # Dispositivo de caracteres
mknod nombre_archivo b major minor   # Dispositivo de bloques
mknod nombre_pipe    p               # Pipe con nombre / FIFO (sin major/minor)
```

---

## 6.2 Estructuras de datos del Kernel: TC, TFO y TI

Para conectar el nivel virtual (proceso) con el nivel físico (dispositivo o disco), el Kernel mantiene **tres tablas enlazadas**:

:::kerneltablesviz
:::

1. **Tabla de Canales (TC) — *Una por cada proceso (dentro del PCB)***:
   * Índice entero (`0, 1, 2...`): el **canal** o descriptor de archivo (`fd`).
   * Cada entrada ocupada guarda el índice a una entrada de la TFO.
2. **Tabla de Ficheros Abiertos (TFO) — *Global (una para todo el sistema)***:
   * Representa cada "apertura" lógica activa.
   * **`refs`**: Número de entradas de TC (del mismo proceso o de otros) que apuntan a ella.
   * **`mode`**: Modo de acceso (`r`, `w`, `rw`).
   * **`posicion_le`**: Puntero actual de lectura/escritura en bytes (en dispositivos secuenciales como terminales o pipes vale `-`).
   * **`ent_ti`**: Índice a la Tabla de Inodos.
3. **Tabla de Inodos (TI) — *Global (una para todo el sistema)***:
   * Copia en memoria RAM del inodo físico del disco para acelerar accesos (contiene tamaño, tipo, permisos, fechas, número de enlaces, índices a los bloques de datos y punteros a las rutinas del *Device Driver*).
   * **`refs`**: Número de entradas de la TFO que apuntan a él.

> **El Inodo NO guarda el nombre del archivo:**  
> Un directorio es simplemente un archivo con pares `(nombre, número_inodo)`. Todo el resto de metadatos viven en el inodo.

---

## 6.3 Llamadas al sistema básicas de E/S

### Operaciones bloqueantes vs no bloqueantes

:::ioblockingviz
:::

* **E/S Bloqueante (por defecto)**: Si no hay datos para leer (o no hay espacio para escribir), el proceso pasa de `RUN` $\rightarrow$ `BLOCKED`, cede la CPU y entra en una cola de espera. Cuando llegan los datos, el dispositivo genera una interrupción; la RSI recoge el dato y pasa el proceso a `READY`.
* **E/S No bloqueante**: Transfiere solo lo que esté disponible al instante y retorna inmediatamente (se puede activar con `fcntl` / flag `O_NONBLOCK`).

### Resumen de llamadas principales

| Llamada al sistema | Función principal | Efecto en las tablas (TC / TFO / TI) |
| :--- | :--- | :--- |
| **`open`** | Abre (o crea) un archivo y devuelve un `fd`. | Ocupa el **primer canal libre** de la TC, crea una **nueva entrada en la TFO** (`posicion_le = 0`) y enlaza con la TI. |
| **`read`** | Lee hasta `count` bytes de `fd` hacia memoria. | Avanza `posicion_le += bytes_leidos` en la TFO. Devuelve `0` al llegar a EOF. |
| **`write`** | Escribe hasta `count` bytes de memoria hacia `fd`. | Avanza `posicion_le += bytes_escritos` en la TFO. |
| **`lseek`** | Mueve manualmente el puntero `posicion_le`. | Modifica directamente `posicion_le` en la TFO (solo archivos con acceso aleatorio). |
| **`dup` / `dup2`** | Duplica un canal existente. | El nuevo canal apunta a la **misma entrada de la TFO** (`refs++` en la TFO). |
| **`close`** | Cierra el canal `fd`. | Libera la TC, hace `refs--` en la TFO. Si llega a `0`, libera la TFO y hace `refs--` en la TI. |
| **`pipe`** | Crea una tubería sin nombre (`fd[0]`, `fd[1]`). | Crea 2 entradas en TC (`r`/`w`), 2 en TFO (`r`/`w`) y 1 inodo temporal en la TI. |

### 1. `open(nombre, flags [, permisos])`
Comprueba los permisos de acceso **una sola vez** al ejecutarse (las llamadas `read`/`write` posteriores ya no los vuelven a validar):
* **Modo obligatorio** (uno de los tres): `O_RDONLY`, `O_WRONLY`, `O_RDWR`.
* **Flags de creación/truncado**:
  * `O_CREAT`: Crea el archivo regular si no existe (obliga a pasar el 3.er parámetro de permisos, ej: `S_IRUSR | S_IWUSR` o `0644`). Si ya existe, no hace nada.
  * `O_TRUNC`: Si el archivo ya existía, libera sus datos y lo deja a **0 bytes**.
  * *(Nota: Los archivos especiales como FIFOs o dispositivos deben existir previamente; `O_CREAT` no los crea).*

### 2. `read()` y `write()`: Acceso byte a byte, buffer y formato binario
```c
// Ineficiente: hace N llamadas al sistema (N cambios de modo usuario <-> kernel)
while ((n = read(0, &c, 1)) > 0)
    write(1, &c, 1);

// Eficiente: lee bloques enteros y reduce drásticamente las syscalls
char buf[1024];
while ((n = read(0, buf, sizeof(buf))) > 0)
    write(1, buf, n); // IMPORTANTE: escribir 'n' bytes (los realmente leídos), ¡NO sizeof(buf)!
```
* **Texto ASCII vs binario de máquina**: `read`/`write` mueven bytes puros. Puedes transferir texto ASCII (`"42"`) o datos binarios directos de memoria (`int x = 42; write(fd, &x, sizeof(int));` $\rightarrow$ 4 bytes tal como están en RAM, inspeccionables con `xxd` o `hexdump`).

### 3. `lseek(fd, desplazamiento, relativo_a)`
Permite saltar a cualquier posición de un archivo regular (**falla con `ESPIPE` en pipes, FIFOs o terminales**):
* `SEEK_SET`: `posicion_le = desplazamiento` (desde el inicio).
* `SEEK_CUR`: `posicion_le = posicion_le + desplazamiento` (desde la posición actual).
* `SEEK_END`: `posicion_le = tamaño_archivo + desplazamiento` (desde el final).
* **TFO vs TI**: `SEEK_SET` y `SEEK_CUR` solo modifican la **TFO**; **`SEEK_END` consulta el tamaño en la TI (inodo)**.
* **Truco para calcular el tamaño de un archivo**: `off_t size = lseek(fd, 0, SEEK_END);`.

### 4. `dup()`, `dup2()` y `close()`

:::dup2viz
:::

* **`newfd = dup(fd)`**: Busca el **primer canal libre** de la TC y lo hace apuntar a la misma entrada de TFO que `fd`.
* **`dup2(fd, newfd)`**: Fuerza que el canal destino sea `newfd`. Si `newfd` estaba abierto previamente, lo cierra automáticamente de forma atómica. Base para redirecciones:
  ```c
  int fd = open("salida.txt", O_WRONLY | O_CREAT | O_TRUNC, 0644);
  dup2(fd, 1); // ¡Ahora todo write(1, ...) o printf escribe en salida.txt!
  close(fd);   // Liberamos el canal auxiliar 'fd'; el canal 1 mantiene la TFO viva
  ```

### 5. Control avanzado y espacio de nombres
* **`pread(fd, buf, count, offset)` / `pwrite(...)`**: Lee o escribe directamente en `offset` **sin modificar `posicion_le` de la TFO** (muy útil cuando varios *threads* leen el mismo `fd` sin pisarse).
* **`ioctl(fd, cmd [, ptr])`**: Modifica parámetros específicos del **dispositivo lógico / driver** (ej: configuración de un terminal o red).
* **`fcntl(fd, cmd [, args])`**: Modifica propiedades del **canal virtual** (ej: pasar `fd` a modo no bloqueante `O_NONBLOCK`).
* **Metadatos y enlaces**: `link` / `unlink` (borra el nombre del directorio; solo libera inodo y bloques cuando `#enlaces == 0` **y** `TI.refs == 0`), `symlink`, `chmod`, `chown` / `chgrp`, y consulta de inodo con `stat` (sigue symlinks), `lstat` (no sigue symlinks) y `fstat` (a partir de un `fd` abierto).

---

## 6.4 Pipes y Terminales

### Pipes sin nombre (`pipe`) vs Pipes con nombre (FIFO)

| Característica | Pipe sin nombre (`pipe(fd)`) | Pipe con nombre / FIFO (`mknod` + `open`) |
| :--- | :--- | :--- |
| **¿Nombre en el Sistema de Archivos?** | **NO** (solo existe en RAM, inodo temporal). | **SÍ** (tiene entrada en un directorio, tipo `p`). |
| **¿Quién puede utilizarla?** | Solo el proceso creador y sus **descendientes** (herencia por `fork`). | **Cualquier proceso** del sistema que conozca la ruta y tenga permisos. |
| **¿Cómo se abre?** | `pipe(fd)` ya devuelve los 2 canales abiertos (`fd[0]` lectura, `fd[1]` escritura). | Se crea en C con `mkfifo("p", 0660)` (o `mknod`) y cada proceso hace `open("p", ...)`. |

> **Bloqueo en el `open` y reintentos:**  
> Abrir una pipe con nombre en `O_RDONLY` **bloquea** el proceso hasta que algún otro proceso la abra en `O_WRONLY` (y viceversa). Si se abre con `O_RDWR`, no bloquea, ¡pero el mismo proceso pasa a constar como posible escritor! Si la FIFO ya existía, `mkfifo` falla con `errno == EEXIST`.

### Reglas de oro de bloqueo y sincronización en pipes

:::pipeviz
:::

El Kernel sincroniza automáticamente lectores y escritores (y en la TFO `posicion_le` siempre vale `-`):
* **Lectura (`read`)**:
  * Si hay datos $\rightarrow$ devuelve hasta `count` bytes disponibles.
  * Si está vacía y queda **al menos 1 canal de escritura abierto** $\rightarrow$ el lector se **bloquea**.
  * Si está vacía y **todos los canales de escritura están cerrados** $\rightarrow$ devuelve `0` (**EOF**).
* **Escritura (`write`)**:
  * Si la pipe está llena $\rightarrow$ el escritor se **bloquea** hasta que el lector vacíe espacio.
  * Si **todos los canales de lectura están cerrados** $\rightarrow$ el proceso recibe la señal **`SIGPIPE`** (mata al proceso por defecto; si la ignoras con `SIG_IGN`, `write` devuelve `-1` con `errno == EPIPE`).

> **Regla crítica — Cerrar siempre los canales que no se usan:**  
> Tras un `fork()`, tanto el padre como los hijos heredan todos los canales de la pipe. Si el proceso lector (o el padre que solo hace `waitpid`) deja abierto el canal de escritura `fd[1]`, la pipe aún tiene un "posible escritor" vivo y **el lector se quedará bloqueado para siempre sin recibir nunca EOF**.

```c
// Redirección estilo Shell: programa1 | programa2
int fd[2];
pipe(fd);
if (fork() == 0) { // HIJO 1 (escritor)
    dup2(fd[1], 1);
    close(fd[0]); close(fd[1]); // Cierra ambos canales originales
    execlp("programa1", "programa1", NULL);
}
if (fork() == 0) { // HIJO 2 (lector)
    dup2(fd[0], 0);
    close(fd[0]); close(fd[1]); // Cierra ambos canales originales
    execlp("programa2", "programa2", NULL);
}
close(fd[0]); close(fd[1]);     // IMPRESCINDIBLE: ¡el padre cierra ambos canales!
while (waitpid(-1, NULL, 0) > 0);
```

### Terminales (Modo Canónico por defecto)
* **Lectura**: El controlador mantiene un *buffer* de línea. Los caracteres no se envían al proceso hasta que se pulsa Enter (`CR`), permitiendo editar previamente con `^H` (borrar carácter) y `^U` (borrar línea).
* **`^D` (EOF)**: Fuerza el vaciado del *buffer* hacia `read()`. Si el *buffer* estaba vacío, `read()` devuelve `0` (interpretado como fin de archivo).

---

## 6.5 E/S en ejecución concurrente: `fork`, `exec` y señales

### 1. `fork()`: Compartición vs independencia del puntero `posicion_le`
El hijo hereda una **copia exacta de la TC** del padre, de modo que ambos apuntan a la **misma entrada de la TFO** (`refs` se incrementa):

:::forkioviz
:::

* **Abierto ANTES del `fork()` $\rightarrow$ Puntero compartido**:
  ```c
  int fd = open("archivo.txt", O_RDONLY);
  fork();
  // Padre e hijo comparten la entrada de TFO: si el padre lee el byte 0,
  // ¡el hijo leerá el byte 1! Se reparten el archivo.
  ```
* **Abierto DESPUÉS del `fork()` $\rightarrow$ Punteros independientes**:
  ```c
  fork();
  int fd = open("archivo.txt", O_RDONLY);
  // Cada uno crea su propia entrada en la TFO (posicion_le = 0 independiente).
  // Tanto padre como hijo leerán el archivo entero desde el principio.
  ```

### 2. `exec()`: ¿Por qué funcionan las redirecciones?
Cuando un proceso muta con `exec()`, su memoria RAM se sustituye por el nuevo programa, pero **sus estructuras de E/S (la TC) se mantienen intactas**.
Por ello el esquema canónico de redirección es:
1. `fork()` (el hijo hereda los canales del padre).
2. El hijo cierra/duplica canales (`close(0); open(...)` o `dup2(fd, 1); close(fd);`).
3. El hijo ejecuta `exec()`: el nuevo programa ya arranca con la entrada o salida redireccionada de forma completamente transparente.

### 3. Interrupción de llamadas de E/S por señales (`EINTR` vs `SA_RESTART`)
Si llega una señal mientras un proceso está `BLOCKED` en un `read()`, `write()` u `open()`:
* **Con el flag `SA_RESTART`** en `sigaction`: Una vez finaliza el *handler*, el Kernel **reinicia automáticamente** la llamada de E/S (excepto en operaciones particulares como sockets o `sigsuspend`).
* **Sin `SA_RESTART`**: La llamada devuelve error (`-1`) y `errno` vale **`EINTR`**. Para evitar que una lectura legítima falle por una señal, se protege con un bucle:
  ```c
  while ((n = read(fd, buf, size)) == -1 && errno == EINTR);
  ```

---

## 6.6 Modelo físico del Sistema de Archivos en disco

Un sistema de archivos UNIX en disco se organiza en **tres grandes zonas**:

:::unixfsviz
:::

1. **Superbloque**: Metadatos globales de la partición (tamaño de bloque, bitmaps/listas de inodos y bloques libres, y dirección del inodo raíz `/`).
2. **Tabla de Inodos**: Cada inodo contiene los metadatos del archivo (`tipo`, `permisos`, `#enlaces`, `tamaño`, fechas) y **punteros a sus bloques de datos**:
   * **Punteros directos**: Apuntan directamente a bloques de datos (acceso inmediato en archivos pequeños).
   * **Indirectos (simple, doble, triple)**: Apuntan a bloques que contienen direcciones de otros bloques, permitiendo archivos enormes *(aunque el tamaño efectivo máximo también queda acotado por el tipo de `posicion_le` en la TFO, ej. 4 GiB si es de 32 bits)*.
3. **Bloques de Datos (BD)**: Almacenan el contenido de los archivos regulares y las tablas `(nombre, inodo)` de los directorios (incluyendo siempre `.` y `..`).
   * **Soft links**: Si la ruta destino es corta se guarda *inline* dentro del propio inodo (`0` BD); si es larga ocupa `1` BD con el texto de la ruta.
4. **Resolución de caminos y *Buffer Cache***:
   * Para abrir `/dir/f.txt`, el Kernel parte de `/` y alterna **Inodo de directorio $\rightarrow$ BD del directorio** hasta encontrar el inodo final (si encuentra un *soft link* con ruta absoluta, reinicia desde `/`).
   * La **Buffer Cache** guarda en RAM los últimos bloques e inodos leídos/modificados: las segundas lecturas hacen *hit* en memoria sin tocar el disco, y las escrituras se vuelcan de forma diferida.

### ¿Qué pasa en cada llamada al sistema?

| Llamada al sistema | ¿Qué consulta o modifica en el Sistema de Archivos? | ¿Accede a los BD del archivo objetivo? |
| :--- | :--- | :---: |
| **`open` (existente)** | Recorre el camino desde `/` (o `.`) alternando Inodo $\rightarrow$ BD de directorio (o caché). Si encuentra un *soft link*, lee su ruta y vuelve a resolver. Comprueba permisos en el inodo final. | **NO** |
| **`open` (`O_CREAT`)** | Todo lo anterior + pide un **nuevo inodo libre al Superbloque**, añade `(nombre, nuevo_inodo)` al BD del directorio padre y actualiza su tamaño/fechas. | **NO** |
| **`mkdir`** | Pide **1 inodo + 1 BD libre** al Superbloque para el nuevo directorio (con `.` y `..`), añade la entrada al padre e incrementa `#enlaces` del padre. | **SÍ (crea su BD)** |
| **`unlink`** | Quita `(nombre, inodo)` del BD del padre y resta 1 a `#enlaces`. Solo libera el inodo y los BD en el Superbloque si **`#enlaces == 0` y `TI.refs == 0`**. | **NO** |
| **`read`** | Comprueba en la TFO si `posicion_le == tamaño` (EOF). Calcula el bloque, consulta los índices del inodo y lee desde *Buffer Cache* o disco. | **SÍ** |
| **`write`** | Igual que `read`; si amplía el archivo, pide **BD libres al Superbloque** y actualiza índices y tamaño en el inodo. | **SÍ** |
| **`mmap`** | Consulta el inodo (tamaño, permisos, bloques) y crea la región lógica. Los BD no se leen hasta el primer acceso en memoria (**Page Fault**). | **NO (al hacer `mmap`)** |
| **`close`** | Cuando `TFO.refs` llega a 0, libera TFO y hace `TI.refs--`; si `TI.refs == 0`, actualiza metadatos finales del inodo (no toca `TC/TFO` en `unlink`). | **NO** |
