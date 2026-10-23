---
title: "Tema 4: Signals"
description: "Gestión avanzada de señales."
readTime: "25 min"
order: 4
draft: false
isNew: true
---
Las señales son el mecanismo básico de comunicación asíncrona entre procesos y el Kernel. Toda su gestión se integra directamente en la ficha de identidad de cada proceso ([PCB en Tema 3](./tema-3)), mediante la tabla de acciones, el bitmap de señales pendientes y la máscara de bloqueo.

## 4.1 Concepto de Signal

Un signal es una notificación asíncrona que el Sistema Operativo (o otro proceso) envía a un proceso. Cada signal tiene un número y un nombre (`SIGALRM`, `SIGKILL`, `SIGINT`, etc.).

:::shellviz{command="kill -l" suggestions="kill -l,man 7 signal" title="Terminal — Listar todas las señales disponibles con su número y nombre (kill -l)"}
:::

Cuando un proceso recibe un signal, puede ocurrir una de 3 cosas:
- **Acción por defecto:** Normalmente terminar el proceso (como hace `SIGKILL` o `SIGALRM`), ignorarlo (como `SIGCHLD`) o detenerlo (`SIGSTOP`).
- **Ignorarlo:** No hacer nada (cuidado: `SIGKILL` y `SIGSTOP` no se pueden ignorar).
- **Capturarlo/Reprogramarlo:** Ejecutar una función propia (función de tratamiento / signal handler) con `sigaction`.

**Máscara de signals:** Conjunto de signals que el proceso tiene bloqueados temporalmente. Si llega un signal bloqueado, queda pendiente hasta que se desbloquea.  
**`sigsuspend(&mask):`** Llamada atómica que cambia la máscara de signals del proceso por la nueva máscara y bloquea el proceso a la espera de que llegue un signal no bloqueado.

### Tabla de señales
| Señal | Código | ¿Qué hace por defecto? | ¿Qué la provoca? | ¿Se puede capturar o bloquear? |
| :--- | :---: | :---: | :--- | :---: |
| **`SIGINT`** | 2 | Termina el programa | Pulsas `Ctrl+C` en la terminal. | Sí |
| **`SIGKILL`** | 9 | Termina el programa inmediatamente | Orden de matar el proceso. | **NUNCA** (imparable) |
| **`SIGSTOP`** | 19 | Congela el proceso (STOPPED) | Orden de pausar el proceso. | **NUNCA** (imparable) |
| **`SIGCONT`** | 18 | Descongela el proceso | Reactiva un proceso pausado por `SIGSTOP`. | Sí |
| **`SIGALRM`** | 14 | Termina el programa | Se agota una cuenta atrás por software (`alarm(segundos)`). | Sí |
| **`SIGCHLD`** | 17 | **Ignorar (no hace nada)** | Un proceso hijo ha terminado o se ha detenido. | Sí |
| **`SIGSEGV`** | 11 | Termina el programa (*Dump*) | Has intentado acceder a memoria prohibida (puntero nulo). | Sí |
| **`SIGUSR1`** | 10 | Termina el programa | Señal libre para que el programador la use para lo que quiera. | Sí |
| **`SIGUSR2`** | 12 | Termina el programa | Segunda señal libre para el programador. | Sí |

---

## 4.2 ¿Cómo gestiona el proceso una señal?

:::signalpcbviz
:::

Cuando llega una señal, el Kernel consulta estas 4 estructuras guardadas en la ficha (PCB) del proceso siguiendo este orden:

1. **Filtro inicial $\rightarrow$ Máscara de bloqueo**:
   * Si la señal está en la máscara, está "retenida" temporalmente y **no se ejecuta ahora**.
2. **Buzón de espera $\rightarrow$ Bitmap de pendientes**:
   * Donde se apuntan las señales retenidas (bit a `1`).
   * **No es un contador**: si recibes 5 veces la misma señal mientras está bloqueada, las repetidas se descartan. Al desbloquearla solo se ejecutará **1 vez**.
3. **¿Qué hacemos cuando se atiende? $\rightarrow$ Tabla de acciones**:
   * Si la señal no está bloqueada (o en el momento de desbloquearse), se mira qué respuesta tiene configurada:
     * `SIG_DFL`: La acción por defecto de Linux (morir, congelarse o ignorar).
     * `SIG_IGN`: Ignorarla (se descarta).
     * Función propia: El Kernel salta a ejecutar la función de C (`handler`) que hemos programado.
4. **¿Y las alarmas? $\rightarrow$ Temporizador de alarma**:
   * Una cuenta atrás interna que, al llegar a 0, envía una señal `SIGALRM` al propio proceso. Solo hay **1 alarma activa por proceso** (programar una nueva cancela la anterior).

---

## 4.3 Llamadas a sistema de señales

### 1. Enviar una señal: `kill(pid, señal)`

:::killviz
:::

Envía cualquier señal al proceso con identificador `pid_destino` (no solo sirve para matar, sirve para enviar cualquier señal):
```c
kill(pid_destino, SIGINT);  // Envía un Ctrl+C al proceso
kill(pid_destino, SIGKILL); // Mata el proceso forzosamente
kill(pid_destino, SIGUSR1); // Envía la señal de usuario 1 (definida por el programador)
```
* Desde la terminal:
  * **Comando `kill`**: `kill -KILL 1234` o por su código numérico `kill -9 1234`. Por convención en la línea de órdenes se quita el prefijo `SIG` (`-KILL`, `-ALRM`, `-INT`).
  * **Comando `killall`**: Envía la señal buscando por el nombre del ejecutable en lugar del PID: `killall -KILL alarm1` o `killall -9 alarm1`.
  * **¿Quién muestra los mensajes de muerte?**: Si un proceso se detiene o muere a causa de una señal no capturada (como `SIGALRM` o `SIGKILL`), el texto que aparece en pantalla (`Alarm clock`, `Killed` o `Segmentation fault`) lo muestra **el propio Shell** tras recoger el estado del hijo con `waitpid()`.

### 2. Cambiar la respuesta de una señal: `sigaction()`

:::sigactionviz
:::

Configura qué debe hacer el proceso cuando recibe una señal determinada (ej: cuando reciba `SIGINT` en lugar de morir):
```c
struct sigaction tratamiento;
tratamiento.sa_handler = mi_funcion; // La función en C que se ejecutará
sigemptyset(&tratamiento.sa_mask);    // No bloquees ninguna otra señal mientras se atiende
tratamiento.sa_flags = 0;

// Ahora, al pulsar Ctrl+C (SIGINT), se ejecutará mi_funcion en lugar de cerrar el programa:
sigaction(SIGINT, &tratamiento, NULL);
```

Los dos flags clave de `sa_flags`:
* **`SA_RESETHAND`**: Se atiende la señal una sola vez con tu función; inmediatamente después, la acción vuelve a la por defecto (`SIG_DFL`). Una segunda señal matará el programa.
* **`SA_RESTART`**: Si el programa estaba detenido en una lectura (`read`) o espera (`waitpid`) y llega la señal, una vez ejecutada tu función, **la lectura se reanuda automáticamente** sin devolver error.

### 3. Gestionar máscaras de bloqueo (`sigset_t`)

:::sigprocmaskviz
:::

`sigset_t` es el **tipo de datos que representa un conjunto (*set*) de señales**. Internamente, a nivel de sistema operativo, no es más que un **vector de bits (*bitmap*)**. Cada posición del bit corresponde al número de una señal concreta:

* Si el bit está a `1` $\rightarrow$ la señal está incluida en el conjunto.
* Si el bit está a `0` $\rightarrow$ la señal no está.

Como es un tipo opaco (no modificamos los bits manualmente con `|` o `&`), POSIX nos da una familia de funciones para gestionarlo:

| Función | ¿Qué hace? | Equivalente lógico |
| :--- | :--- | :--- |
| `sigemptyset(&mask)` | Vacía el conjunto (todos los bits a `0`) | Conjunto vacío $\emptyset$ |
| `sigfillset(&mask)` | Llena el conjunto con **todas** las señales posibles (todas a `1`) | Universo de señales |
| `sigaddset(&mask, SIGALRM)` | Añade una señal concreta al conjunto | Pone a `1` el bit de `SIGALRM` |
| `sigdelset(&mask, SIGALRM)` | Quita una señal del conjunto | Pone a `0` el bit de `SIGALRM` |
| `sigismember(&mask, SIGALRM)` | Comprueba si una señal está dentro del conjunto | Devuelve 1 si está, 0 si no |

Ejemplo de uso:
```c
sigset_t mascara;
sigemptyset(&mascara);         // Inicializa la máscara vacía
sigaddset(&mascara, SIGINT);   // Añade SIGINT a la lista de bloqueados
sigdelset(&mascara, SIGINT);   // Quita SIGINT de la lista
```

### 4. **Modificar la máscara con `sigprocmask()`**:
  ```c
  int sigprocmask(int how, const sigset_t *set, sigset_t *oldset);
  ```

  Parámetros:
  * **`how`**: La operación que queremos hacer sobre la máscara actual del proceso:

    | Opción (`how`) | Comportamiento | Operación sobre la máscara |
    | :--- | :--- | :---: |
    | **`SIG_BLOCK`** | Añade las señales de `set` a las que ya estaban bloqueadas. | $\text{máscara} \cup \text{set}$ |
    | **`SIG_UNBLOCK`** | Desbloquea las señales de `set` (las quita de la máscara). | $\text{máscara} \setminus \text{set}$ |
    | **`SIG_SETMASK`** | **Sobrescribe** toda la máscara del proceso con `set` tal cual. | $\text{máscara} = \text{set}$ |

  * **`set`**: Puntero al conjunto de señales con el que queremos operar (si es `NULL`, no se modifica nada, solo sirve para consultar).
  * **`oldset`**: Si no es `NULL`, el Kernel copia la **máscara anterior** que tenía el proceso justo antes del cambio (muy útil para guardarla y restaurarla después). Si no nos interesa guardarla, se pasa `NULL`.

  ```c
  sigset_t mask, old_mask;
  sigemptyset(&mask);
  sigaddset(&mask, SIGALRM);

  // Bloquea SIGALRM y guarda la máscara anterior en old_mask:
  sigprocmask(SIG_BLOCK, &mask, &old_mask);

  // ... sección crítica donde no queremos ser interrumpidos por SIGALRM ...

  // Restaura la máscara tal como estaba antes:
  sigprocmask(SIG_SETMASK, &old_mask, NULL);
  ```

### 5. Esperar una señal de forma segura: `sigsuspend()`

:::sigsuspendviz
:::

```c
sigsuspend(&mascara);
```
Detiene el proceso y lo duerme hasta que llega una señal que **no esté en `mascara`**.  
Cuando llega la señal, se ejecuta la función de atención, y acto seguido `sigsuspend` termina y **restaura automáticamente la máscara que el proceso tenía antes**.

### 6. Programar un temporizador: `alarm(segundos)`

:::alarmviz
:::

`alarm(N)` programa una cuenta atrás de $N$ segundos en el Kernel.

* **El programa NO se detiene a esperar**: Continúa ejecutando las siguientes líneas de código al instante mientras el Kernel cuenta en segundo plano.
* **¿Qué pasa cuando pasan los $N$ segundos?** El Kernel envía una señal `SIGALRM` al proceso:
  1. **Por defecto (sin capturar)**: La señal `SIGALRM` **mata el proceso** (`exit`). Se utiliza como límite de tiempo (*timeout*) para que el programa no se quede colgado.
  2. **Si la has capturado con `sigaction`**: Al cumplirse los segundos, se interrumpe momentáneamente el programa, se ejecuta tu función (*handler*) y después el programa **continua trabajando normalmente**.

```c
alarm(5); // Programa el SIGALRM para dentro de 5 segundos
alarm(0); // Desactiva cualquier alarma pendiente antes de que suene
```

---

## 4.4 Ejemplo completo procesos y signals (Previo lab-SO 4)

Aquí tenemos un escenario completo paso a paso:
* **El Padre**: Proceso principal. Crea 10 hijos, les da un límite de tiempo de 2 segundos y comprueba cómo mueren. Si alguno se duerme demasiado tiempo (> 2s), lo mata con `SIGKILL`.
* **Los 10 Hijos**: Procesos creados con `fork()`. Cada uno espera exactamente 1 segundo con un temporizador (`alarm(1)`) y luego termina educadamente con `exit(0)`.

:::oopviz{simulation="fork_alarm_timeout"}
:::

<!-- ## 4.4 Trucos y patrones con señales

### Patrón 1: ¿Cómo detener un proceso y reanudarlo cuando quieras?
* **Para detenerse a sí mismo**:
  ```c
  kill(getpid(), SIGSTOP); // Se pone en estado STOPPED al instante
  ```
* **Para reanudarlo**: Desde otra terminal u otro proceso:
  ```bash
  kill -SIGCONT <PID>
  ```

---

### Patrón 2: ¿Cómo evitar el peligro de la "señal perdida"? (condición de carrera)
Imagina que un padre quiere esperar a que su hijo le envíe `SIGUSR1`.  
Si el padre hace simplemente `sigsuspend(&vacio)` sin bloquear nada antes, puede ocurrir que el hijo termine tan rápido que envíe la señal **antes** de que el padre haya tenido tiempo de llegar a la línea de `sigsuspend`. La señal llega, se ejecuta, y cuando el padre finalmente entra a `sigsuspend`, **se queda dormido para siempre** ¡porque la señal ya ha pasado!

**¿Cómo se resuelve en el examen?**
1. **Bloqueas la señal ANTES de hacer el `fork`**:
   ```c
   sigset_t mask, mask_suspend;
   sigemptyset(&mask);
   sigaddset(&mask, SIGUSR1);
   sigprocmask(SIG_BLOCK, &mask, NULL); // ¡SIGUSR1 queda bloqueado!
   ```
2. Creas el hijo con `fork()`. Si el hijo envía la señal ahora, no se pierde: se queda retenida en el bitmap de pendientes.
3. El padre se duerme con `sigsuspend(&mask_suspend)`, donde `mask_suspend` tiene `SIGUSR1` desbloqueado. `sigsuspend` desbloquea la señal y se duerme en una única acción atómica: ¡la señal pendiente se procesa y el padre se despierta correctamente!

---

### Patrón 3: ¿Cómo recoger los hijos muertos en segundo plano sin bloquear al padre?
Si el padre está trabajando y no quiere detenerse con `waitpid()`, programa la señal `SIGCHLD`:

```c
void trata_muerte_hijo(int s) {
    int status;
    // ¡Bucle obligatorio con WNOHANG!
    while (waitpid(-1, &status, WNOHANG) > 0) {
        // Recoge el cadáver de cada hijo que haya muerto
    }
}
```
**¿Por qué hace falta el bucle `while (waitpid(-1, &st, WNOHANG) > 0)`?**  
Porque si mueren 3 hijos a la vez mientras se está ejecutando la función, el sistema solo pone a 1 el bit de `SIGCHLD`. Si hicieras un solo `waitpid`, solo recogerías uno y los otros dos se quedarían como Zombies para siempre. El bucle `while` con `WNOHANG` recoge todos los hijos que hayan muerto hasta que no queda ninguno (devuelve 0) y no bloquea al padre.

---

## 4.5 Preguntas de examen resueltas (Tema 4: Signals)

### 1. Un proceso huérfano recibe `SIGKILL`. ¿Puede quedarse en estado Zombie para siempre?
**NO**. Cuando un proceso se queda huérfano, es adoptado inmediatamente por el proceso `init` (PID 1). Este proceso tiene la función de ir haciendo `waitpid()` de todos los procesos que adopta, de modo que libera su PCB tan pronto como mueren.

### 2. ¿Qué le pasa a las estructuras de señales de un padre cuando hace `fork()`?
**Absolutamente nada**. La ejecución de `fork()` crea un proceso hijo nuevo y no modifica ninguno de los datos del proceso padre (su tabla de señales, su bitmap de pendientes, su máscara de bloqueo y su alarma se quedan exactamente igual).

### 3. ¿Qué cambia y qué se mantiene en las estructuras de señales cuando un proceso hace `execlp()`?
* **Cambia**: La tabla de acciones se restablece a la acción por defecto (`SIG_DFL`) para todas las funciones de usuario (porque el código nuevo ya no contiene las funciones viejas).  
* **Se mantiene**: La máscara de señales bloqueadas, la lista de señales pendientes y la alarma se mantienen intactas.

### 4. Con Round Robin, 3 procesos y un cuanto de 10 ms, ¿puede un proceso ejecutarse dos veces en menos de 30 ms?
**SÍ**. Si cualquiera de los otros dos procesos hace una llamada bloqueante (como leer del teclado con `read`, hacer `waitpid` o esperar una señal) antes de agotar sus 10 ms, libera la CPU inmediatamente y el turno pasa al siguiente antes de tiempo. -->
