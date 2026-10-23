---
title: "Tema 3: Procesos"
description: "Procesos"
readTime: "25 min"
order: 3
draft: false
---

## 3.1 ¿Qué es un Proceso?

Cuando haces doble clic en un programa o lo ejecutas en la terminal, el sistema operativo crea un proceso (un programa en marcha en la memoria). Cada proceso tiene un identificador único (un DNI o número entero) llamado PID (Process Identifier).

:::procoverviewviz
:::

### 1. Identidad, Entorno y Contexto
Cada proceso en ejecución cuenta con:
* **Identificadores únicos**:
  * **PID (*Process ID*)**: El DNI único del proceso en el sistema. Se consulta en C con la llamada `getpid()` (`man 2 getpid`).
  * **PPID (*Parent PID*)**: El PID del proceso padre que lo creó. Se consulta en C con la llamada `getppid()` (`man 2 getppid`).
* **Credenciales de acceso**: `UID` (usuario) y `GID` (grupo), que controlan qué archivos tiene permiso para leer/escribir y a qué otros procesos puede enviar señales.
* **Entorno**: Los argumentos que le pasamos al abrirlo (`argv`) y las variables de entorno del sistema (`HOME`, `PATH`...).
* **Contexto de ejecución**: Todo lo que refleja cómo está funcionando en ese mismo instante: los valores de los registros de la CPU, por qué línea de código va (*Program Counter*) y su espacio de memoria RAM.

### 2. Inspección de procesos desde la terminal
Podemos consultar la identidad y el estado de los procesos activos con comandos estándar de Linux:

:::shellviz{command="ps -ef" suggestions="ps -ef,ps -l,pstree,man ps" title="Terminal — Consultar los procesos en marcha (PID, PPID y árbol jerárquico)"}
:::

* **`ps -ef`** o **`ps aux`**: Muestra la lista completa de procesos en marcha, indicando el usuario (`UID`), el `PID`, el `PPID`, el consumo de recursos y la orden de ejecución.
* **`pstree`**: Dibuja el árbol jerárquico de procesos del sistema (donde se ve cómo el proceso `systemd` o `init` con PID 1 es la raíz de todos los procesos).

### 3. El PCB (*Process Control Block*)
El **PCB** es la **ficha de identidad** que el núcleo del sistema operativo (*Kernel*) guarda en su propia memoria para cada programa en marcha. Cuando un proceso deja de ejecutarse en la CPU para dejar paso a otro, el Kernel guarda todo lo que estaba haciendo dentro de esta ficha:

* **Identificación**: PID, PPID y credenciales de usuario/grupo.
* **Estado**: Qué está haciendo en ese instante (ejecutándose, listo en la cola, dormido o muerto).
* **Contexto de la CPU (Registros)**: Los valores de los registros generales, el puntero de la pila (*Stack Pointer*) y el *Program Counter* (la línea de código exacta por donde iba) cuando se le retira la CPU.
* **Espacio de memoria**: Rangos de memoria RAM asignados (segmento de código/texto, variables globales, heap y pila).
* **Archivos abiertos**: La tabla de descriptores de archivo (`fd = 0` para teclado, `fd = 1` para pantalla, `fd = 2` para errores, archivos de disco o tuberías).
* **Estructuras de señales (*Signals*)**: Tabla de acciones, bitmap de pendientes, máscara de bloqueo y alarma (estudiado a fondo en el [Tema 4: Signals](./tema-4)).
* **Contadores de tiempo (*Accounting*)**: Cuánto tiempo de procesador ha gastado y estadísticas de uso de recursos.

:::shellviz{command="cat /proc/self/status" suggestions="cat /proc/self/status,ls /proc,ls -l /proc/self,ls -l /proc/self/fd" title="Terminal — Radiografía del PCB en el Kernel (/proc y /proc/self)"}
:::

---

## 3.2 Ciclo de vida de un proceso y llamadas

Un proceso no está siempre trabajando en la CPU: a lo largo de su vida va transitando por diferentes estados. Este ciclo se gobierna mediante el planificador del Kernel y las llamadas al sistema que invocamos en nuestro código:

:::processviz
:::

| Llamada | Sección `man` | Retorno | ¿Qué hace exactamente? |
| :--- | :---: | :--- | :--- |
| **`fork()`** | `man 2` | `0` al hijo, `PID_hijo` al padre, `-1` si error | Clona el proceso creando uno nuevo (nace en READY y pasa a RUN). |
| **`execlp(file, a0, ...)`** | `man 3` | Solo retorna si falla (`-1`) | Muta el proceso: borra su código y carga un programa nuevo (mantiene el mismo PID). |
| **`exit(status)`** | `man 3` | Nunca retorna | Finaliza el proceso, libera su memoria RAM y lo deja en estado ZOMBIE. |
| **`waitpid(pid, &st, opts)`**| `man 2` | PID del hijo recogido | Detiene al padre hasta que el hijo muere y libera su ficha (PCB) del Kernel. |

---

### 1. Cómo nace un proceso: Clonación con `fork()` (READY $\rightarrow$ RUN)
Cuando un proceso llama a `fork()`, el Kernel hace una **copia exacta** del proceso creador (proceso padre). El nuevo proceso (hijo) nace en el estado **READY** esperando su turno de CPU para pasar a **RUN**:

:::forkviz
:::

```c
int g = 10;
int main() {
    int l = 5;
    int pid = fork();
    if (pid == 0) {
        // Código exclusivo del hijo: ¡tiene su propia copia en su memoria!
        g++; l += 2;
        exit(0);
    }
    waitpid(pid, NULL, 0);
    // Código del padre: ¡sus variables NO han cambiado! g = 10 y l = 5.
    return 0;
}
```

| Se hereda (Copia idéntica) | NO se hereda (Valor nuevo / Reinicializado) |
| :--- | :--- |
| **Variables y memoria RAM** (copia privada independiente) | **PID** (identificador único nuevo para el hijo) |
| **Archivos abiertos** (descriptores `fd` 0, 1, 2, tuberías y offsets) | **PPID** (recibe el PID del proceso padre) |
| **Tabla de acciones de señales** (funciones/handlers definidos) | **Señales pendientes** (nace limpio, sin señales acumuladas) |
| **Máscara de bloqueo** (señales retenidas temporalmente) | **Temporizador de alarma** (reloj interno desactivado) |
| **Credenciales y entorno** (`UID`, `GID` y variables `environ`) | **Tiempos de ejecución** (contadores de CPU reiniciados a 0) |

* **Si los hijos NO hacen `exit()`**: Cada iteración duplica todos los procesos que hay vivos en ese momento:
  ```c
  for (int i = 0; i < N; i++) fork();
  ```
  * Procesos totales: **$2^N$**. Por ejemplo, para $N = 3 \rightarrow 2^3 = 8$ procesos.
  * Hijos nuevos creados: **$2^N - 1$** ($8 - 1 = 7$).
* **Si los hijos hacen `exit(0)`**: Solo el padre continúa dando vueltas al bucle:
  ```c
  for (int i = 0; i < N; i++) {
      if (fork() == 0) {
          ferFeina();
          exit(0); // El hijo muere aquí y no hace más forks
      }
  }
  ```
  * Se crean exactamente **$N$ hijos** en abanico (total: **$N + 1$ procesos**).

---

### 2. Cómo muta un proceso: sustitución de programa con `execlp()`

`execlp()` no crea ningún proceso: vacía la memoria del proceso actual y carga un binario nuevo desde su `main`. Mantiene el mismo PID.

:::execviz
:::

```c
// Formato: execlp(programa, arg0, arg1, ..., (char *)NULL);
execlp("ls", "ls", "-l", (char *)NULL);

// Solo se ejecuta si execlp falla (ej: comando inexistente):
perror("Error en execlp");
exit(1);
```

* **`"ls"` (programa)**: La `p` indica que lo busca automáticamente en el `PATH`.
* **`"ls"` (`arg0`)**: Conviene repetir el nombre del programa (`argv[0]`).
* **`"-l"` (`arg1...`)**: Argumentos del comando.
* **`(char *)NULL`**: Centinela obligatorio para indicar el final de los argumentos.

Qué cambia y qué se mantiene en `execlp()`:

| Se mantiene (Sin cambios) | Cambia (Sustituido / Reinicializado) |
| :--- | :--- |
| **PID y PPID** (es el mismo proceso) | **Memoria RAM** (se vacía y se carga el nuevo binario) |
| **Descriptores de archivo** (`fd` y tuberías abiertas) | **Registros de CPU** (arrancan en el `main` del nuevo código) |
| **Máscara de señales bloqueadas** | **Tabla de señales** (las funciones de usuario se restablecen a la acción por defecto) |
| **Señales pendientes** | **Pila y memoria dinámica** (se reinician con los nuevos argumentos) |

---

### 3. Cómo se duerme un proceso (RUN $\rightarrow$ BLOCKED)
El estado **BLOCKED (Bloqueado / Dormido)** se produce cuando un proceso no puede continuar su ejecución porque está esperando una acción externa. **Mientras está bloqueado no consume nada de CPU.**

:::blockedviz
:::

Llamadas a sistema que hacen pasar de RUN a BLOCKED:
* `waitpid(pid, &st, 0)`: si el proceso hijo aún está en ejecución, el padre se detiene a esperar que termine.
* `read(0, buf, size)`: si espera que el usuario escriba por el teclado y aún no hay datos.

---

### 4. Cómo muere y cómo se recoge: `exit()`, estado ZOMBIE y `waitpid()`
Cuando un proceso termina con `exit(status)` o haciendo `return` desde el `main`:
1. El sistema libera toda su memoria RAM y cierra sus archivos abiertos.
2. El proceso pasa al estado **ZOMBIE (pendiente de recoger)**: su ficha (PCB) continúa en el Kernel guardando cómo ha muerto (el código de salida) hasta que su padre lo consulte con `waitpid()`.

:::zombieviz
:::

### Sincronización con `waitpid()` y diagnóstico de muerte
El padre utiliza `waitpid()` para esperar a que un hijo termine, recoger cómo ha muerto en la variable `status` y **eliminar definitivamente su PCB del Kernel**:

```c
int status;
int pid_hijo = waitpid(pid, &status, opciones);
```

* **`pid`**: PID concreto del hijo a esperar, o `-1` para esperar a cualquier hijo que termine primero.
* **`&status`**: Puntero a un entero donde el Kernel escribe codificada la causa de la muerte.
* **`opciones`**: `0` para esperar bloqueado, o `WNOHANG` para no bloquearse (si no hay ningún hijo muerto, devuelve `0` inmediatamente).

El entero `status` contiene información empaquetada en diferentes bits. Se utilizan estas macros para inspeccionarlo:

| Macro | ¿Qué comprueba o extrae? |
| :--- | :--- |
| **`WIFEXITED(status)`** | Devuelve cierto si el hijo ha terminado voluntariamente (`exit()` o `return`). |
| **`WEXITSTATUS(status)`** | Si ha terminado con `exit()`, obtiene su código de salida (ej: `0`, `1`...). |
| **`WIFSIGNALED(status)`** | Devuelve cierto si el hijo ha muerto repentinamente a causa de una señal no capturada. |
| **`WTERMSIG(status)`** | Si ha muerto por una señal, obtiene el número de la señal causante. |

Ejemplo práctico de diagnóstico:

```c
#include <sys/wait.h>

int status;
int pid_hijo = waitpid(-1, &status, 0); // Espera a que termine cualquier hijo

if (WIFEXITED(status)) {
    int codi = WEXITSTATUS(status);
    sprintf(buf, "Hijo %d ha terminado bien con codigo %d\n", pid_hijo, codi);
    write(1, buf, strlen(buf));
} else if (WIFSIGNALED(status)) {
    int senyal = WTERMSIG(status);
    sprintf(buf, "Hijo %d ha muerto por la senyal %d\n", pid_hijo, senyal);
    write(1, buf, strlen(buf));
}
```

:::oopviz{simulation="waitpid_diagnosi"}
:::

### ¿Qué pasa si un proceso queda huérfano? ¿Puede quedar Zombie para siempre?
**NO**. En Linux, cuando un padre muere, los hijos huérfanos son adoptados automáticamente por el proceso `init` (PID 1) o `systemd`. Este proceso se encarga de ir haciendo `waitpid()` periódicamente de todos los hijos adoptados, limpiando sus PCBs tan pronto como mueren.

---

### 5. Cómo se congela un proceso: estado STOPPED
El estado **STOPPED (Pausado / Congelado)** se produce cuando un proceso se detiene expresamente:
* Desde la terminal: pulsando **`Ctrl+Z`** o ejecutando `kill -STOP <PID>`.
* Desde código C: enviando `kill(pid, SIGSTOP)`.
* **¿Cómo se despierta?**: El proceso queda inmóvil sin gastar CPU hasta que alguien le envíe una señal de continuación: `kill -CONT <PID>` o llamando a `kill(pid, SIGCONT)`.

:::stoppedviz
:::

---

## 3.3 Secuencial vs concurrente

Combinando `fork()` y `waitpid()` podemos estructurar la ejecución de múltiples procesos de dos formas fundamentales:

```c
// 1. ESQUEMA SECUENCIAL: Uno detrás de otro
// El padre crea un hijo y espera a que termine ANTES de crear el siguiente
for (int i = 0; i < N; i++) {
    if ((pid = fork()) == 0) {
        ferFeina(i);
        exit(0);
    }
    waitpid(pid, NULL, 0); // ¡Espera DENTRO del bucle!
}
```

```c
// 2. ESQUEMA CONCURRENTE: Todos a la vez
// El padre crea todos los hijos a la vez y luego los recoge al final
for (int i = 0; i < N; i++) {
    if ((pid = fork()) == 0) {
        ferFeina(i);
        exit(0);
    }
    // ¡NO espera aquí! Continúa creando hijos en paralelo
}
// Ahora que todos están trabajando a la vez, el padre los espera a todos:
while (waitpid(-1, NULL, 0) > 0);
```

### Cómo ejecuta los comandos el Shell: Primer plano vs Segundo plano (`&`)

Cuando escribes un comando en el terminal, el Shell (`bash`, `zsh`) hace internamente un bucle con `fork()`, `exec()` y `waitpid()`:

```c
while (1) {
    comando = leer_comando();
    int pid = fork();
    if (pid == 0) {
        execlp(comando, comando, ..., NULL); // Ejecuta el programa
    }
    // Si es en PRIMER PLANO:
    waitpid(pid, &status, 0); // El Shell se bloquea hasta que el programa termine
}
```

* **Primer plano (*Foreground*, `./programa`)**: El Shell se bloquea a la espera de que el proceso hijo termine con `waitpid()`. Como el Shell está dormido, el teclado queda tomado por el programa y no puedes introducir nuevos comandos. Por eso, si el programa tarda o se duerme, hay que abrir otra pestaña o ventana de terminal para enviarle señales o consultar `ps`.
* **Segundo plano (*Background*, `./programa &`)**: Añadiendo un ampersand `&` al final, el Shell lanza el proceso hijo pero **no hace `waitpid()` bloqueante** de inmediato. Te devuelve el control del teclado al instante mostrando el número de trabajo y el PID (ej: `[1] 20226`), permitiéndote continuar ejecutando otros comandos en la misma terminal mientras el programa corre de fondo.

---

## 3.4 Cambio de contexto y planificación (*scheduling*)

¿Cómo consigue el sistema operativo que decenas de procesos funcionen a la vez en una misma CPU?

### 1. El cambio de contexto (*context switch*)

:::contextswitchviz
:::

Cuando la CPU deja de ejecutar el proceso A para ponerse a ejecutar el proceso B, se ejecuta un **cambio de contexto**:
1. La CPU salta a **modo Kernel** a causa de una interrupción de reloj o de una llamada al sistema bloqueante.
2. El Kernel copia todos los registros de la CPU del proceso A en su ficha (`PCB[A]`).
3. El Kernel actualiza el estado de A (lo pone en `READY` o en `BLOCKED`).
4. El **planificador (*scheduler*)** elige cuál será el siguiente proceso a ejecutar (por ejemplo, B).
5. El Kernel conmuta el espacio de memoria activa hacia el de B y carga los registros desde `PCB[B]` en la CPU física.
6. La CPU vuelve a **modo usuario** y reanuda el proceso B exactamente donde se había quedado.

Durante el cambio de contexto, la CPU solo guarda y carga estructuras internas del Kernel; **ningún proceso de usuario está avanzando en su trabajo**. Es un gasto inevitable de gestión del sistema que hay que minimizar.

### 2. Planificación de la CPU (*scheduling*)

:::schedulerviz
:::

El **planificador (*scheduler*)** es la parte del Kernel que decide quién toma la CPU, en qué orden y durante cuánto tiempo:

* **Tiempo de retorno (*Turnaround Time*)**: El tiempo total que transcurre desde que un programa se abre hasta que termina por completo (incluye el tiempo que está corriendo, el que pasa esperando en la cola y el que está bloqueado).
* **Tiempo de espera (*Waiting Time*)**: El tiempo total que el proceso pasa haciendo cola en el estado `READY` esperando a que le toque el turno de CPU.
* **Planificación no apropiativa (*Non-preemptive* / Cooperativa)**: El sistema es "educado": una vez un programa entra en la CPU, **nadie se la puede quitar**. Solo se va si termina voluntariamente (`exit`) o si se duerme para hacer una lectura (`read`).
* **Planificación apropiativa (*Preemptive*)**: El sistema tiene autoridad: si se termina su tiempo de turno o llega un proceso más importante, el Kernel le quita la CPU por la fuerza.

### 3. Algoritmos de planificación clave

### Round Robin (RR)

:::roundrobinviz
:::

Funciona como un turno de palabra en círculo:
* Cada proceso tiene derecho a utilizar la CPU durante un tiempo máximo llamado **cuanto ($Q$)**, por ejemplo 10 milisegundos.
* Si el proceso agota los 10 ms y aún no ha terminado, la interrupción de reloj lo saca de la CPU y lo pone en la cola de `READY`.
* **Tamaño del cuanto**:
  * Si el cuanto es **gigante**: se convierte en un orden por orden de llegada (*First-Come First-Served*, FCFS).
  * Si el cuanto es **demasiado pequeño** (p. ej. 0,1 ms): la CPU pasa más tiempo haciendo cambios de contexto que ejecutando programas útiles.
* ¿Qué pasa si un proceso se bloquea antes de agotar los 10 ms?  
  Libera la CPU inmediatamente (pasa a `BLOCKED`) y **el planificador avanza el turno al siguiente proceso al instante**, sin tener que esperar a que pasen los 10 ms.

### Completely Fair Scheduler (CFS de Linux)

:::cfsviz
:::

Es el planificador real de Linux:
* Busca que todos los programas reciban una parte justa del tiempo de CPU.
* Lleva un contador para cada proceso llamado **tiempo virtual de ejecución (`vruntime`)**. Cuanta menos CPU ha gastado un programa hasta ahora, más prioridad tiene para entrar en la CPU.
* Gracias a esto, los programas interactivos (como el ratón, el teclado o el editor de texto, que pasan casi todo el tiempo dormidos en `BLOCKED`) entran en la CPU de forma inmediata en cuanto el usuario toca una tecla, dando una respuesta instantánea.

### Resumen rápido: ¿cómo cambia de estado un proceso?

| Transición | De $\rightarrow$ A | Causa principal |
| :--- | :---: | :--- |
| **Creación** | `Nuevo` $\rightarrow$ `READY` | El padre llama a **`fork()`**. |
| **Asignación CPU** | `READY` $\rightarrow$ `RUN` | El planificador le da el turno de CPU. |
| **Fin de turno** | `RUN` $\rightarrow$ `READY` | Se agota el tiempo de CPU (**cuanto**). |
| **Espera externa** | `RUN` $\rightarrow$ `BLOCKED` | Llamada bloqueante: esperar hijo (**`waitpid`**) o datos (**`read`**). |
| **Evento listo** | `BLOCKED` $\rightarrow$ `READY` | Llegan los datos o muere el hijo esperado. |
| **Finalización** | `RUN` $\rightarrow$ `ZOMBIE` | El proceso termina (**`exit()`**); mantiene PCB hasta que el padre haga `waitpid`. |
| **Liberación** | `ZOMBIE` $\rightarrow$ `Eliminado` | El padre lo recoge con **`waitpid()`** y el Kernel borra su PCB. |
