---
title: "Lab 3: Procesos"
description: "Ejercicios y preguntas de la sesión 3 de laboratorio."
readTime: "7 min"
order: 3.5
draft: false
---

## Guía de la sesión 3: gestión de procesos

Respuestas concisas a las preguntas del laboratorio (`entrega.txt`) para el examen SIMLAB.

Empaquetar la entrega:
:::shellviz{command="tar zcfv sessio03.tar.gz entrega.txt makefile myPS_v0.c myPS.c myPS2.c myPS3.c parsExec.c" suggestions="tar zcfv sessio03.tar.gz entrega.txt,tar ztfv sessio03.tar.gz" title="Terminal — Empaquetar la entrega de la Sesión 3"}
:::

---

## Bloque 1: Llamadas a sistema fundamentales

| Llamada | Sección manual | Qué devuelve | Uso típico |
| :--- | :---: | :--- | :--- |
| **`fork()`** | `man 2` | `0` al hijo, `PID` al padre, `-1` si error | Duplica el proceso actual. |
| **`getpid()`** | `man 2` | `pid_t` (PID propio) | Consulta de identidad. |
| **`getppid()`** | `man 2` | `pid_t` (PID del padre) | Consulta del creador. |
| **`exit(código)`** | `man 3` | No devuelve | Finaliza el proceso y pasa a `Z (zombie)`. |
| **`waitpid(pid, &st, opts)`** | `man 2` | PID del hijo finalizado | Espera al hijo y libera su PCB. |
| **`execlp(file, a0, ...)`** | `man 3` | **Solo si falla** (`-1`) | Muta la imagen de memoria. |
| **`perror(msg)`** | `man 3` | `void` | Escribe por `stderr` (canal 2) el error del kernel (`errno`). |

:::shellviz{command="man 2 fork" suggestions="man 2 fork,man 2 waitpid,man 3 perror" title="Terminal — Consultar el manual de las llamadas a sistema"}
:::

---

## Bloque 2: Tratamiento de errores con `perror`

Patrón obligatorio para llamadas que pueden fallar:

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

## Bloque 3: Creación y mutación de procesos (`myPS.c`)

```c
void muta_a_PS(char *username) {
    execlp("ps", "ps", "-u", username, (char *)NULL);
    error_y_exit("Ha fallado la mutacion a ps", 1);
}
```

### Pregunta 29: Obtener PIDs
* **¿Cómo sabe el padre el PID de los hijos?** A través del **retorno de `fork()`** (al padre le devuelve el PID positivo del nuevo hijo; al hijo le devuelve `0`).
* **¿Cómo consulta un proceso su propio PID?** Con la llamada **`getpid()`** (y `getppid()` para el PID del padre).

### Pregunta 30: Ejecución después de `execlp`
* **¿En qué caso se ejecuta el código posterior a `execlp`?** **SOLO SI EL EXECLP FALLA**.
* **Motivo:** Si `execlp` tiene éxito, el kernel sustituye completamente todo el espacio de memoria por el nuevo programa. El código original deja de existir en la RAM. Si la siguiente instrucción se llega a ejecutar, es la certeza absoluta de que la mutación ha fallado.

:::shellviz{command="./myPS alumne" suggestions="./myPS alumne,which ps,ps -u alumne" title="Terminal — Ejecución de myPS con mutación a ps"}
:::

---

## Bloque 4: Pseudo-sistema `/proc` (P31 a P36)

`/proc` es un sistema de archivos virtual en memoria RAM generado por el Kernel.

### Pregunta 31: Archivos en `/proc/[PID]/`
* Comando para listar enlaces y metadatos: `ls -la /proc/$$/` (`$$` = PID actual).
* **Archivos clave**:
  * `status`: Estado de planificación (`State:`), memoria (VmSize) y UIDs.
  * `cmdline`: Línea de órdenes de invocación separada por bytes nulos `\0`.
  * `environ`: Variables de entorno heredadas al iniciar el proceso.
  * `cwd`: Soft link que apunta al directorio de trabajo actual.
  * `exe`: Soft link que apunta al binario ejecutable en disco.

:::shellviz{command="ls -la /proc" suggestions="ls -la /proc,df -h" title="Terminal — Exploración del sistema de archivos /proc"}
:::

### Pregunta 32: Comparación de `environ` y estados
* `/proc/[PID]/environ` contiene exactamente la misma lista de variables que el comando `env`.
* **Estados en el campo `State`**:
  * Proceso en bucle activo `while(1);` $\rightarrow$ **`R (running)`**.
  * Proceso esperando en `waitpid()` $\rightarrow$ **`S (sleeping)`**.
* **Tiempo de CPU**: Campo 14 de `/proc/[PID]/stat` (*utime*).

### Preguntas 33 a 36: `cwd`, `exe` y mutación
* `cwd`: Se hereda del padre; `exec` **no** lo cambia.
* `exe`: En un proceso sin mutar (`myPS_v0`), apunta a `./myPS_v0`. Al mutar con `execlp("ps", ...)` (`myPS`), `exe` pasa a apuntar a `/usr/bin/ps`.

---

## Bloque 5: Ejecución secuencial (`myPS2.c`)

El padre crea los hijos **de uno en uno**, esperando a cada uno antes de crear el siguiente:

```c
for (int i = 0; i < num_fills; i++) {
    int pid = fork();
    if (pid < 0) error_y_exit("Error fork", 1);
    if (pid == 0) {
        muta_a_PS(argv[i + 1]);
    }
    // El padre ESPERA DENTRO del bucle: orden 100% garantizado
    waitpid(pid, NULL, 0);
}
```

:::shellviz{command="./myPS2 alumne root" suggestions="./myPS2 alumne root,./myPS2 alumne,ps" title="Terminal — Ejecución secuencial de procesos con myPS2"}
:::

---

## Bloque 6: Ejecución concurrente (`myPS3.c`)

El padre **crea todos los hijos inmediatamente** y después espera su finalización:

```c
// 1. Fase de creación concurrente
for (int i = 0; i < num_fills; i++) {
    int pid = fork();
    if (pid < 0) error_y_exit("Error fork", 1);
    if (pid == 0) {
        muta_a_PS(argv[i + 1]);
    }
    // El padre NO espera aquí
}

// 2. Fase de recogida de PCBs
while (waitpid(-1, NULL, 0) > 0);
```

### Pregunta 37: Estado del padre durante la espera
* El padre está en estado **`S (sleeping)`** porque `waitpid(-1, ...)` es una llamada **bloqueante** que libera la CPU.

### Pregunta 38: No determinismo
* Ejecutar `./myPS3 alumne root > sortida.txt` varias veces puede producir un orden de salida diferente porque depende de la planificación del kernel (*scheduler*).

:::shellviz{command="./myPS3 alumne root > sortida1.txt" suggestions="./myPS3 alumne root > sortida1.txt,cat sortida1.txt" title="Terminal — Redirección de salida concurrente a archivo"}
:::

---

## Bloque 7: Paso de argumentos con `execlp` (`parsExec.c`)

```c
// Ejemplo de invocación múltiple con execlp
pid = fork();
if (pid == 0) {
    execlp("./listaParametros", "listaParametros", "1024", "hola", (char *)NULL);
    error_y_exit("Error execlp", 1);
}
while (waitpid(-1, NULL, 0) > 0);
```

:::shellviz{command="./parsExec" suggestions="./parsExec,./listaParametros a b,ps" title="Terminal — Ejecución de parsExec con paso de argumentos"}
:::

---

## Resumen del paquete de entrega (`sessio03.tar.gz`)

| Archivo | Rol |
| :--- | :--- |
| `entrega.txt` | Respuestas a las preguntas 29 a 38. |
| `makefile` | Reglas `all` y `clean` para todos los binarios. |
| `myPS_v0.c` | Hijo sin mutar (ejecuta `while(1);`). |
| `myPS.c` | Hijo mutado a `ps -u username`. |
| `myPS2.c` | Esquema secuencial (waitpid dentro del bucle). |
| `myPS3.c` | Esquema concurrente (waitpid fuera del bucle). |
| `parsExec.c` | Ejecución de 4 hijos con argumentos diversos. |

:::shellviz{command="tar ztfv sessio03.tar.gz" suggestions="tar ztfv sessio03.tar.gz,ls -la" title="Terminal — Verificación del paquete de entrega de la Sesión 3"}
:::
