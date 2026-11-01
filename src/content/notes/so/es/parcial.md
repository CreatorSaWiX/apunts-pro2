---
title: "Parcial SO"
description: "Resumen clave de teoría para el parcial de Sistemas Operativos."
readTime: "25 min"
order: 5
draft: false
isNew: true
---

## 1. Arquitectura del SO, modos y llamadas al kernel

### Modes de la CPU: usuario vs. kernel
La CPU tiene un bit interno en el registro de estado (PSW) que indica el modo:
* **Modo usuario**: Los programas de usuario solo acceden a su espacio de memoria lógico y a instrucciones no privilegiadas. No pueden tocar hardware directamente.
* **Modo kernel (privilegiado)**: El SO tiene acceso a todo el hardware, toda la memoria física y a instrucciones privilegiadas.
* **¿Por qué una aplicación no puede llamar directamente a funciones del kernel?**
  1. El código del kernel está fuera del espacio de direcciones de la aplicación (es inaccesible).
  2. Ejecuta instrucciones privilegiadas prohibidas en modo usuario.

### ¿Cómo se entra al kernel?
Solo hay **3 vías de entrada**. El kernel nunca se ejecuta si no ocurre una de estas tres:

| Mecanismo | Voluntario / Involuntario | Síncrono / Asíncrono | Causa |
| :--- | :---: | :---: | :--- |
| **Interrupción HW** | Involuntario | **Asíncrono** | Dispositivo externo: tick de reloj (cada ~10 ms), teclado, red. |
| **Excepción SW** | Involuntario | **Síncrono** | Error de la CPU al ejecutar una instrucción: división por 0, acceso a memoria inválida (*SegFault*), fallo de página. |
| **Llamada a sistema (*trap*)** | **Voluntario** | **Síncrono** | El programa solicita un servicio al SO (`write`, `fork`, `sigsuspend`). |

### ¿Por qué la biblioteca de sistema (`libc`) depende del hardware y no es portable?
Porque contiene la instrucción máquina específica de esa CPU para saltar al kernel (`syscall` en x86_64, `svc` en ARM) y coloca los parámetros en los registros concretos fijados por la arquitectura. Un binario de `libc` para ARM no funciona en x86.

### Comandos de la shell: internos vs. externos
* **Interno (*built-in*, ej: `cd`, `exit`)**: Se ejecuta dentro del propio proceso de la shell. **No crea ningún proceso nuevo**.
* **Externo (ej: `ls`, `ps`)**: La shell crea un proceso hijo con `fork()` y carga el binario con `execlp()`.

### Salida por pantalla de bajo nivel (`sprintf` + `write`)
En SO no se usa `printf` porque tiene memoria intermedia (*buffer*). Se utiliza `write` en el descriptor 1 (`stdout`):
```c
char buf[80];
int len = sprintf(buf, "Hola desde el PID %d\n", getpid());
write(1, buf, len);
```

---

## 2. Gestión de procesos (PCB, ciclo de vida y llamadas)

### El PCB (*process control block*)
Ficha que el kernel guarda en su memoria para cada proceso: PID, PPID, estado, copia de registros de la CPU, memoria, tabla de descriptores abiertos (`fd`), 4 estructuras de señales y contadores de CPU.

### Ciclo de vida y cambios de estado
* **`RUN`**: Ejecutando instrucciones en la CPU física.
* **`READY`**: Listo para ejecutar, esperando turno en la cola de la CPU.
* **`BLOCKED`**: Esperando un evento externo (E/S, muerte de un hijo, señal). **No consume CPU**.
* **`STOPPED`**: Pausado expresamente por `SIGSTOP` o `Ctrl+Z`. Se reanuda únicamente con `SIGCONT`.
* **`ZOMBIE`**: Ha ejecutado `exit()`. Memoria liberada, pero el PCB sigue vivo en el kernel guardando el código de salida hasta que el padre haga `waitpid()`.

*¿Puede la interrupción de reloj pasar un proceso a `BLOCKED`?*  
**No.** El paso a `BLOCKED` es **siempre voluntario** del proceso cuando realiza una llamada a sistema bloqueante. El reloj solo puede pasar el proceso de `RUN` a `READY` (si agota su cuanto de tiempo).

---

### ¿Qué se hereda en `fork()` y qué cambia en `exec()`? (Imprescindible)

| Datos del PCB | Después de `fork()` (hijo) | Después de `exec()` (mutación) |
| :--- | :--- | :--- |
| **PID** | **Nuevo y único** (no se hereda) | **Se mantiene idéntico** |
| **PPID** | Toma el PID del padre | **Se mantiene idéntico** |
| **Espacio de memoria** | Copia independiente (*copy-on-write*) | **Se destruye** y se carga el nuevo binario |
| **Descriptores abiertos (`fd`)**| Se heredan (apuntan a los mismos archivos) | Se mantienen (salvo que lleven `FD_CLOEXEC`) |
| **Máscara de señales** | **Se hereda idéntica** | **Se mantiene idéntica** |
| **Señales pendientes** | **Nace vacío (a 0)** | **Se mantienen** las señales pendientes |
| **Vector de tratamiento** | **Se hereda idéntico** | **Los capturados vuelven a `SIG_DFL`**; los `SIG_IGN` se mantienen |
| **Temporizador `alarm()`** | **Nace desactivado (a 0)** | **Se mantiene** el tiempo restante de la alarma |
| **Tiempo consumido de CPU** | **Nace a 0** | Se mantiene el acumulado |

---

### Ciclo de vida y llamadas fundamentales

### 1. Clonar un proceso: `fork()`
Clona el proceso actual creando uno nuevo idéntico:
```c
int pid = fork();
if (pid < 0) {
    perror("Error en fork");
    exit(1);
} else if (pid == 0) {
    // Código que solo ejecuta el hijo (retorno 0)
    exit(0);
} else {
    // Código que solo ejecuta el padre (retorno es el PID del hijo)
}
```

* **Aislamiento de memoria:** El padre y el hijo **no comparten memoria**. Las modificaciones del hijo nunca son visibles para el padre:
```c
int global = 100;
if (fork() == 0) {
    global = 200; // Solo cambia en la memoria privada del hijo
    exit(0);
}
waitpid(-1, NULL, 0);
// ¡Aquí en el padre, global sigue valiendo 100!
```

### 2. Mutar un proceso: `execlp()`
Sustituye la memoria del proceso por el nuevo binario, conservando el mismo PID. Solo retorna si falla (`-1`). Requiere centinela `(char *)NULL`:
```c
execlp("./programa", "programa", "arg1", (char *)NULL);
// Si se ejecuta esta línea, es que execlp ha fallado:
perror("Error cargando el binario");
exit(1);
```

### 3. Finalizar un proceso: `exit(status)`
Libera memoria RAM, cierra descriptores y deja el proceso en estado **`ZOMBIE`** guardando el código `status` en el PCB. Nunca retorna.

### 4. Recoger hijos y liberar PCB: `waitpid()`
El padre espera a que un hijo termine, extrae su causa de muerte y **libera su PCB del kernel**:
```c
int status;
int pid_fill = waitpid(-1, &status, 0); // -1 = cualquier hijo, 0 = bloqueante

if (WIFEXITED(status)) {
    // Ha terminado voluntariamente con exit(código) o return
    int codi = WEXITSTATUS(status);
} else if (WIFSIGNALED(status)) {
    // Ha muerto repentinamente por una señal no capturada
    int sig = WTERMSIG(status);
}
```

* **Comportamiento según opciones:**
  * `opciones = 0` (bloqueante): Si tiene hijos vivos se duerme en `BLOCKED`. Si ya tiene un hijo zombie, lo libera y retorna enseguida. Si **no tiene hijos**, retorna `-1` inmediatamente (`ECHILD`).
  * `opciones = WNOHANG` (no bloqueante): Si tiene hijos vivos pero ninguno zombie, **retorna `0` inmediatamente**.
  * **Alerta trampa:** `while(waitpid(-1, NULL, WNOHANG) >= 0);` sobre hijos vivos es una **espera activa** (quema 100% de CPU haciendo miles de llamadas inútiles por segundo).
* **¿Cuántas llamadas hace un bucle para limpiar hijos?**
```c
// Hace exactamente N_hijos + 1 llamadas (las N que liberan hijos y la última que retorna -1)
while (waitpid(-1, NULL, 0) > 0);
```

### Procesos huérfanos y zombies
* Si el padre muere antes que el hijo, el hijo pasa a ser **huérfano** y es adoptado inmediatamente por el proceso `init` / `systemd` (PID 1).
* **¿Puede un huérfano quedar zombie para siempre?** **No.** El proceso PID 1 ejecuta `waitpid()` periódicamente para limpiar cualquier proceso huérfano tan pronto como muere.

---

## 3. Jerarquías de procesos y concurrencia

### Esquema secuencial vs. concurrente
Describen cuándo espera el padre a sus hijos respecto a cuándo los crea.

### Esquema secuencial
El padre crea un hijo y espera su finalización antes de crear el siguiente. El `waitpid` va **dentro** del bucle:
```c
for (i = 0; i < N; i++) {
    ret = fork();
    if (ret == 0) {
        // Código del hijo
        exit(0);
    }
    waitpid(-1, NULL, 0); // Espera al hijo antes de crear el siguiente
}
```
* Solo hay un hijo vivo a la vez (más el padre).
* **Grado máximo de concurrencia = 2** (padre + 1 hijo).
* El orden de ejecución es **determinista**: hijo 0, luego hijo 1, etc.

### Esquema concurrente
El padre crea todos los hijos primero y luego los espera. El `waitpid` va **fuera** del bucle de creación:
```c
for (i = 0; i < N; i++) {
    ret = fork();
    if (ret == 0) {
        // Código del hijo
        exit(0);
    }
}
while (waitpid(-1, NULL, 0) > 0); // Espera a todos los hijos al final
```
* Todos los hijos pueden estar vivos al mismo tiempo.
* **Grado máximo de concurrencia = N + 1** (padre + N hijos).
* El orden de ejecución y finalización **no es determinista**: depende del planificador de la CPU.

---

### Árboles de procesos

### 1. Árbol en abanico (estrellado)
Un padre crea $N$ hijos directos que terminan con `exit()`:
```c
for (i = 0; i < 3; i++) {
    if (fork() == 0) {
        exit(0); // El hijo muere y no hace más forks
    }
}
while (waitpid(-1, NULL, 0) > 0);
```
```text
P0
├── P0.0
├── P0.1
└── P0.2
```

### 2. Árbol en cascada (cadena de mutación)
El hijo muta al mismo programa pasando un parámetro decrementado:
```c
// Ejecución: ./prog 3
int n = atoi(argv[1]);
if (n > 0) {
    if (fork() == 0) {
        char buf[10];
        sprintf(buf, "%d", n - 1);
        execlp("./prog", "prog", buf, (char *)NULL);
    }
    waitpid(-1, NULL, 0);
}
```
```text
P0 ──> P0.0 ──> P0.0.0 ──> P0.0.0.0
```

### 3. Árbol binario recursivo (`arbol.c` en QT 23-24)
Cada proceso con niveles $> 0$ crea 2 hijos, y estos mutan con `niveles - 1`:
```c
if (nivells > 0) {
    ret = fork();
    if (ret > 0) {
        ret = fork(); // El padre hace un segundo fork
    }
    if (ret == 0) {
        nivells--;
        sprintf(buf, "%d", nivells);
        execlp("./arbol", "arbol", buf, (char *)NULL);
    }
}
```
* Procesos totales: $2^{\text{niveles} + 1} - 1$. Para niveles = 3: $1 + 2 + 4 + 8 = 15$ procesos.

---

## 4. Gestión de señales (*signals*)

Una señal es una notificación asíncrona enviada por el kernel o por otro proceso.

### Las 4 estructuras de señales en el PCB
Cuando llega una señal, el kernel consulta estas 4 estructuras en este orden:
1. **Máscara de bloqueados (`sigset_t`)**: Señales retenidas temporalmente. Si la señal está en la máscara, no se entrega ahora.
2. **Bitmap de pendientes**: Bits que guardan las señales retenidas. **No se encolan**: si recibes 5 veces la misma señal mientras está bloqueada, al desbloquearla solo se atiende **1 vez**.
3. **Tabla de tratamiento (handlers)**: Qué hacer al recibirla:
   * `SIG_DFL`: Acción por defecto (morir, congelarse o ignorar).
   * `SIG_IGN`: Ignorarla (se descarta).
   * Función propia: Salta a ejecutar el handler en C.
4. **Temporizador de alarma**: Cuenta atrás interna gestionada por el kernel. Al llegar a 0, envía un `SIGALRM`. Solo hay 1 alarma por proceso.

### Tabla de señales fundamentales

| Señal | Código | Acción por defecto | ¿Se puede capturar o bloquear? |
| :--- | :---: | :---: | :---: |
| **`SIGKILL`** | 9 | Mata el proceso al instante | **Nunca (imparable)** |
| **`SIGSTOP`** | 19 | Congela el proceso (`STOPPED`) | **Nunca (imparable)** |
| **`SIGCONT`** | 18 | Descongela el proceso | Sí |
| **`SIGALRM`** | 14 | Mata el proceso | Sí |
| **`SIGCHLD`** | 17 | **Ignorar (no hace nada)** | Sí |
| **`SIGINT`** | 2 | Mata el proceso (`Ctrl+C`) | Sí |
| **`SIGUSR1` / `SIGUSR2`** | 10 / 12 | Mata el proceso | Sí |

---

### Llamadas de señales

### 1. Enviar una señal: `kill(pid, señal)`
Envía una señal a un proceso. No solo sirve para matar:
```c
kill(pid, SIGSTOP); // Pausa el proceso (pasa a STOPPED)
kill(pid, SIGCONT); // Descongela el proceso pausado
kill(pid, SIGKILL); // Fuerza la muerte inmediata
kill(pid, SIGUSR1); // Envía señal de usuario
```

### 2. Configurar la respuesta a una señal: `sigaction()`
```c
void tracta_senyal(int s) {
    char msg[64];
    int len = sprintf(msg, "Recibida señal %d\n", s);
    write(1, msg, len);
}

// En el main:
struct sigaction sa;
sa.sa_handler = tracta_senyal;       // Función que se ejecutará
sigemptyset(&sa.sa_mask);            // Señales a bloquear SOLO durante el handler
sa.sa_flags = 0;
sigaction(SIGUSR1, &sa, NULL);       // Asocia SIGUSR1 al handler
```

* **Flags clave de `sa_flags`:**
  * `sa.sa_flags = SA_RESETHAND;`: Ejecuta el handler 1 sola vez; inmediatamente después, la acción vuelve a la por defecto (`SIG_DFL`).
  * `sa.sa_flags = SA_RESTART;`: Si el proceso estaba bloqueado en una syscall lenta (`read`, `waitpid`), la reinicia automáticamente sin retornar error `EINTR`.
* **El campo `sa.sa_mask`:** Señales que se añaden a la máscara **únicamente mientras se está ejecutando el handler**. Al salir del handler, la máscara previa se restaura sola:
```c
sigaddset(&sa.sa_mask, SIGUSR2); // Durante tracta_senyal, SIGUSR2 también estará bloqueada
```

### 3. Modificar la máscara de bloqueo: `sigprocmask()`
```c
sigset_t mask, oldmask;
sigemptyset(&mask);
sigaddset(&mask, SIGALRM);
sigaddset(&mask, SIGCHLD);

// 1. Bloquea SIGALRM y SIGCHLD (los añade a la máscara actual):
sigprocmask(SIG_BLOCK, &mask, &oldmask);

// 2. Desbloquea:
sigprocmask(SIG_UNBLOCK, &mask, NULL);

// 3. Restaura la máscara tal como estaba en oldmask:
sigprocmask(SIG_SETMASK, &oldmask, NULL);
```

### 4. Esperar una señal de forma segura: `sigsuspend()`
Sustituye de forma **atómica** la máscara del proceso por `mask` y lo pone en **`BLOCKED`** hasta que llega una señal no bloqueada:
```c
sigsuspend(&mask); // Siempre retorna -1 (errno = EINTR)
```
* Al retornar del handler, `sigsuspend` **restaura automáticamente la máscara anterior**.
* **¿Qué señales pueden sacar siempre a un proceso de `sigsuspend`?** Únicamente `SIGKILL` y `SIGSTOP` (porque nunca se pueden bloquear).

### 5. Programar un temporizador: `alarm(segundos)`
Programa un `SIGALRM` para dentro de $N$ segundos. No detiene el proceso:
```c
alarm(5); // Dentro de 5 segundos llegará SIGALRM

// Cancelar alarma y obtener el tiempo restante:
int restantes = alarm(0);       // alarm(0) desactiva y retorna los segundos que faltaban
int tiempo_pasado = 5 - restantes; // Mide el tiempo consumido por el hijo
```

---

### Condiciones de carrera

Esperar una señal con `sigsuspend` evitando carreras.  
Si un padre quiere esperar a que el hijo le envíe una señal (`SIGUSR1`), **es obligatorio bloquearla antes del `fork()`**:
```c
sigset_t mask, mask_espera;
int recibido = 0;

void handler_usr1(int s) {
    recibido = 1;
}

// 1. Bloqueamos ANTES del fork. Si el hijo es ultra rápido, la señal no se pierde
sigfillset(&mask);
sigprocmask(SIG_BLOCK, &mask, NULL);

// Asociamos el handler
struct sigaction sa;
sa.sa_handler = handler_usr1;
sigemptyset(&sa.sa_mask);
sa.sa_flags = 0;
sigaction(SIGUSR1, &sa, NULL);

if (fork() == 0) {
    // El hijo realiza un cálculo rápido y avisa al padre
    kill(getppid(), SIGUSR1);
    exit(0);
}

// 2. Preparamos máscara para sigsuspend: todo bloqueado EXCEPTO SIGUSR1
sigfillset(&mask_espera);
sigdelset(&mask_espera, SIGUSR1);

// 3. Espera pasiva (0% CPU): desbloquea atómicamente y se duerme
while (!recibido) {
    sigsuspend(&mask_espera);
}
```
* **¿Por qué es un error no bloquear antes del `fork()`?**  
  Si el hijo envía `SIGUSR1` antes de que el padre llegue a `sigsuspend()`, la señal se atiende antes de tiempo. Cuando el padre finalmente ejecuta `sigsuspend()`, **se queda congelado para siempre**.

### ¿Quién escribe mensajes como `"Alarm clock"` o `"User defined signal 1"`?
Los escribe la **shell**, no el proceso. La shell ejecuta `waitpid()` sobre el programa y, al detectar mediante `WIFSIGNALED(status)` que ha muerto por una señal no capturada, imprime el texto descriptivo por la consola.

---

## 5. Planificación de la CPU (*scheduling*)

* **Planificación no apropiativa (cooperativa):** El proceso solo abandona la CPU por voluntad propia: ejecuta `exit()`, realiza una syscall bloqueante (`read`, `waitpid`), o muere por una señal.
* **Planificación apropiativa:** El kernel puede retirarle la CPU forzosamente al agotar su cuanto de tiempo (interrupción de reloj) o cuando un proceso más prioritario pasa a `READY`.

### Round Robin (RR)
Cola FIFO con cuanto fijo de tiempo:
* *Con 3 procesos y un cuanto de 10 ms, ¿puede un proceso llegar a ejecutarse dos veces en menos de 30 ms?*  
  **Sí.** Si cualquiera de los otros procesos realiza una llamada bloqueante antes de agotar sus 10 ms, libera la CPU antes de tiempo y el turno avanza inmediatamente.

### Completely Fair Scheduler (CFS de Linux)
Ordena los procesos por `vruntime` (tiempo virtual de ejecución). Favorece a los procesos interactivos / de E/S intensiva porque pasan mucho tiempo bloqueados, acumulan muy poco `vruntime` y reciben máxima prioridad al despertar.

---

## Preguntas frecuentes de los parciales

Para obtener la máxima puntuación en cada respuesta:

1. **¿Por qué la salida de un vector/variable no cambia en el padre?**  
   *"Porque padre e hijo tienen espacios de direcciones lógicos totalmente independientes; las modificaciones de memoria del hijo nunca son visibles para el padre."*
2. **¿Por qué falla el tratamiento de la señal después de un `execlp`?**  
   *"Porque la mutación con `exec` destruye el código del espacio de direcciones y restablece todos los handlers capturados a la acción por defecto (`SIG_DFL`)."*
3. **¿Por qué este bucle `waitpid` realiza $N+1$ iteraciones?**  
   *"Porque realiza $N$ iteraciones para liberar a cada uno de los $N$ hijos zombies y una última iteración que retorna `-1` (`ECHILD`) al no quedar más hijos."*
4. **¿Por qué `sigsuspend` recibe la señal sin perderla?**  
   *"Porque la señal se bloqueó previamente antes del fork, manteniéndola pendiente, y `sigsuspend` sustituye la máscara y suspende el proceso de forma atómica."*

