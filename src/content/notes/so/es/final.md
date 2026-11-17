---
title: "Final SO"
description: "Resumen integral para el examen final de Sistemas Operativos (Teoría y Laboratorio): Temas 1–7, patrones reales, trampas y respuestas modelo."
readTime: "40 min"
order: 99
draft: false
isNew: true
---

> **Regla de oro en los finales de Teoría:** *"Justifica todas las respuestas. Las respuestas sin justificar se consideran erróneas."* Desde QP24-25 el examen se realiza en PC con editor de texto plano y **`man` local disponible** (se permite consultar prototipos y flags exactos, así que no se perdonan imprecisiones).

## 1. Arquitectura del SO, modos y llamadas al kernel

### Modos de la CPU: usuario vs. kernel
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
Ficha que el kernel guarda en su memoria para cada proceso: PID, PPID, estado, copia de registros de la CPU, memoria, tabla de ficheros abiertos (`fd`), 4 estructuras de señales y contadores de CPU.

### Ciclo de vida y cambios de estado
* **`RUN`**: Ejecutando instrucciones en la CPU física.
* **`READY`**: Listo para ejecutar, esperando turno en la cola de la CPU.
* **`BLOCKED`**: Esperando un evento externo (E/S, muerte de un hijo, señal). **No consume CPU**.
* **`STOPPED`**: Pausado expresamente por `SIGSTOP` o `Ctrl+Z`. Se reanuda solo con `SIGCONT`.
* **`ZOMBIE`**: Ha hecho `exit()`. Memoria liberada, pero el PCB sigue vivo en el kernel guardando el código de salida hasta que el padre haga `waitpid()`.

*¿Puede la interrupción de reloj pasar un proceso a `BLOCKED`?*  
**No.** El paso a `BLOCKED` es **siempre voluntario** del proceso cuando realiza una llamada a sistema bloqueante. El reloj solo puede pasar el proceso de `RUN` a `READY` (si agota su cuanto de tiempo).

---

### ¿Qué se hereda en `fork()` y qué cambia en `exec()`? (Imprescindible)

| Datos del PCB | Tras `fork()` (hijo) | Tras `exec()` (mutación) |
| :--- | :--- | :--- |
| **PID** | **Nuevo y único** (no se hereda) | **Se mantiene idéntico** |
| **PPID** | Toma el PID del padre | **Se mantiene idéntico** |
| **Espacio de memoria** | Copia independiente (*copy-on-write*) | **Se destruye** y se carga el nuevo binario |
| **Descriptores abiertos (`fd`)**| Se heredan (apuntan a los mismos ficheros) | Se mantienen (excepto si llevan `FD_CLOEXEC`) |
| **Máscara de señales** | **Se hereda idéntica** | **Se mantiene idéntica** |
| **Señales pendientes** | **Nace vacío (a 0)** | **Se mantienen** las señales pendientes |
| **Vector de tratamiento** | **Se hereda idéntico** | **Los capturados vuelven a `SIG_DFL`**; los `SIG_IGN` se mantienen |
| **Temporizador `alarm()`** | **Nace desactivado (a 0)** | **Se mantiene** el tiempo restante de la alarma |
| **Tiempo consumido CPU** | **Nace a 0** | Se mantiene el acumulado |

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
// Aquí en el padre, ¡global sigue valiendo 100!
```

### 2. Mutar un proceso: `execlp()`
Sustituye la memoria del proceso por el nuevo binario, manteniendo el mismo PID. Solo retorna si falla (`-1`). Requiere centinela `(char *)NULL`:
```c
execlp("./programa", "programa", "arg1", (char *)NULL);
// Si se ejecuta esta línea, es que execlp ha fallado:
perror("Error cargando el binario");
exit(1);
```

### 3. Finalizar un proceso: `exit(status)`
Libera memoria RAM, cierra descriptores y pone el proceso en estado **`ZOMBIE`** guardando el código `status` en el PCB. Nunca retorna.

### 4. Recoger hijos y liberar PCB: `waitpid()`
El padre espera a que un hijo termine, extrae su causa de muerte y **libera su PCB del kernel**:
```c
int status;
int pid_hijo = waitpid(-1, &status, 0); // -1 = cualquier hijo, 0 = bloqueante

if (WIFEXITED(status)) {
    // Ha terminado voluntariamente con exit(codigo) o return
    int codigo = WEXITSTATUS(status);
} else if (WIFSIGNALED(status)) {
    // Ha muerto de golpe a causa de una señal no capturada
    int sig = WTERMSIG(status);
}
```

* **Comportamiento según opciones:**
  * `opciones = 0` (bloqueante): Si tiene hijos vivos se duerme en `BLOCKED`. Si tiene un hijo zombi, lo libera y retorna enseguida. Si **no tiene ningún hijo**, retorna `-1` inmediatamente (`ECHILD`).
  * `opciones = WNOHANG` (no bloqueante): Si tiene hijos vivos pero ningún zombi, **retorna `0` inmediatamente**.
  * **Alerta trampa:** `while(waitpid(-1, NULL, WNOHANG) >= 0);` sobre hijos vivos es una **espera activa** (quema 100% de CPU haciendo miles de llamadas inútiles por segundo).
* **¿Cuántas llamadas hace un bucle para limpiar hijos?**
```c
// Hace exactamente N_hijos + 1 llamadas (las N que liberan hijos y la última que retorna -1)
while (waitpid(-1, NULL, 0) > 0);
```

### Procesos huérfanos y zombis
* Si el padre muere antes que el hijo, el hijo pasa a ser **huérfano** y es adoptado inmediatamente por el proceso `init` / `systemd` (PID 1).
* **¿Puede un huérfano quedarse zombi para siempre?** **No.** El proceso PID 1 ejecuta `waitpid()` periódicamente para limpiar cualquier proceso huérfano tan pronto como muere.

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
    waitpid(-1, NULL, 0); // Espera al hijo antes de crear otro
}
```
* Solo hay un hijo vivo a la vez (más el padre).
* **Grado máximo de concurrencia = 2** (padre + 1 hijo).
* El orden de ejecución es **determinista**: hijo 0, después hijo 1, etc.

### Esquema concurrente
El padre crea todos los hijos primero y después los espera. El `waitpid` va **fuera** del bucle de creación:
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
* El orden de ejecución y de finalización **no es determinista**: depende del planificador de la CPU.

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
if (niveles > 0) {
    ret = fork();
    if (ret > 0) {
        ret = fork(); // El padre hace un segundo fork
    }
    if (ret == 0) {
        niveles--;
        sprintf(buf, "%d", niveles);
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
1. **Máscara de bloqueados (`sigset_t`)**: Señales retenidas temporalmente. Si la señal está en ella, no se entrega ahora.
2. **Bitmap de pendientes**: Bits que guardan las señales retenidas. **No se encolan**: si recibes 5 veces la misma señal mientras está bloqueada, al desbloquearla solo se atiende **1 vez**.
3. **Tabla de tratamiento (handlers)**: Qué hacer al recibirla:
   * `SIG_DFL`: Acción por defecto (morir, congelarse o ignorar).
   * `SIG_IGN`: Ignorarla (se descarta).
   * Función propia: Salta a ejecutar el handler en C.
4. **Temporizador de alarma**: Cuenta atrás interna gestionada por el kernel. Cuando llega a 0, envía un `SIGALRM`. Solo hay 1 alarma por proceso.

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

### 1. Enviar una señal: `kill(pid, senyal)`
Envía una señal a un proceso. No solo sirve para matar:
```c
kill(pid, SIGSTOP); // Pausa el proceso (pasa a STOPPED)
kill(pid, SIGCONT); // Descongela el proceso pausado
kill(pid, SIGKILL); // Fuerza la muerte inmediata
kill(pid, SIGUSR1); // Envía señal de usuario
```

### 2. Configurar la respuesta a una señal: `sigaction()`
```c
void trata_senyal(int s) {
    char msg[64];
    int len = sprintf(msg, "Recibida señal %d\n", s);
    write(1, msg, len);
}

// En el main:
struct sigaction sa;
sa.sa_handler = trata_senyal;        // Función que se ejecutará
sigemptyset(&sa.sa_mask);            // Señales a bloquear SOLO durante el handler
sa.sa_flags = 0;
sigaction(SIGUSR1, &sa, NULL);       // Asocia SIGUSR1 al handler
```

* **Flags clave de `sa_flags`:**
  * `sa.sa_flags = SA_RESETHAND;`: Ejecuta el handler 1 sola vez; inmediatamente después, la acción vuelve a la por defecto (`SIG_DFL`).
  * `sa.sa_flags = SA_RESTART;`: Si el proceso estaba bloqueado en una syscall lenta (`read`, `waitpid`), la reinicia automáticamente sin dar error `EINTR`.
* **El campo `sa.sa_mask`:** Señales que se añaden a la máscara **únicamente mientras se está ejecutando el handler**. Al salir del handler, la máscara previa se restaura sola:
```c
sigaddset(&sa.sa_mask, SIGUSR2); // Durante trata_senyal, SIGUSR2 también estará bloqueada
```

### 3. Modificar la máscara de bloqueo: `sigprocmask()`
```c
sigset_t mask, oldmask;
sigemptyset(&mask);
sigaddset(&mask, SIGALRM);
sigaddset(&mask, SIGCHLD);

// 1. Bloquea SIGALRM y SIGCHLD (las añade a la máscara actual):
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
* **¿Qué señales pueden sacar siempre a un proceso de `sigsuspend`?** Solo `SIGKILL` y `SIGSTOP` (porque no se pueden bloquear nunca).

### 5. Programar un temporizador: `alarm(segundos)`
Programa un `SIGALRM` dentro de $N$ segundos. No detiene el proceso:
```c
alarm(5); // Dentro de 5 segundos llegará SIGALRM

// Cancelar alarma y obtener el tiempo restante:
int restantes = alarm(0);        // alarm(0) desactiva y retorna los segundos que faltaban
int tiempo_pasado = 5 - restantes; // Mide el tiempo consumido por el hijo
```

---

### Condiciones de carrera

Esperar una señal con `sigsuspend` evitando carreras.
Si un padre quiere esperar a que el hijo le envíe una señal (`SIGUSR1`), **hay que bloquearla antes del `fork()`**:
```c
sigset_t mask, mask_espera;
int recibido = 0;

void handler_usr1(int s) {
    recibido = 1;
}

// 1. Bloqueamos ANTES del fork. Si el hijo es ultrarrápido, la señal no se pierde
sigfillset(&mask);
sigprocmask(SIG_BLOCK, &mask, NULL);

// Asociamos el handler
struct sigaction sa;
sa.sa_handler = handler_usr1;
sigemptyset(&sa.sa_mask);
sa.sa_flags = 0;
sigaction(SIGUSR1, &sa, NULL);

if (fork() == 0) {
    // Hijo hace un trabajo rápido y avisa al padre
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
  Si el hijo envía `SIGUSR1` antes de que el padre entre en `sigsuspend()`, la señal se procesa antes de tiempo. Cuando el padre finalmente ejecuta `sigsuspend()`, **se queda congelado para siempre**.

### ¿Quién escribe mensajes como `"Alarm clock"` o `"User defined signal 1"`?
Los escribe la **shell**, no el proceso. La shell hace `waitpid()` sobre el programa ejecutado y, al detectar con `WIFSIGNALED(status)` que ha muerto por una señal no capturada, imprime el texto descriptivo por la consola.

---

## 5. Planificación de la CPU (*scheduling*)

* **Planificación no apropiativa (cooperativa):** El proceso solo deja la CPU si quiere: hace `exit()`, hace una syscall bloqueante (`read`, `waitpid`), o muere por una señal.
* **Planificación apropiativa:** El kernel le puede quitar la CPU por la fuerza cuando agota su cuanto de tiempo (interrupción de reloj) o cuando un proceso más prioritario pasa a `READY`.

### Round Robin (RR)
Cola FIFO con cuanto fijo de tiempo:
* *Con 3 procesos y un cuanto de 10 ms, ¿puede un proceso ejecutarse dos veces en menos de 30 ms?*  
  **Sí.** Si cualquiera de los otros procesos hace una llamada bloqueante antes de agotar sus 10 ms, libera la CPU antes de tiempo y el turno avanza inmediatamente.

### Completely Fair Scheduler (CFS de Linux)
Ordena los procesos por `vruntime` (tiempo virtual de ejecución). Favorece a los procesos interactivos / de E/S intensiva porque pasan mucho tiempo bloqueados, acumulan muy poco `vruntime` y reciben máxima prioridad al despertarse.

---

## 6. Procesos y Signals: giros clásicos del Final

En el Final, el 30–40% de la nota de teoría sigue siendo de Procesos y Signals, pero con estas 4 trampas recurrentes:

### 1. El bucle `fork()` invertido (cuando muta el PADRE, `ret > 0`)
Lee con lupa si quien hace `execlp()` o `exit()` es `ret == 0` o **`ret > 0`**:
```c
for (int i = 0; i < N; i++) {
    int ret = fork();
    if (ret > 0) execlp("compute", "compute", NULL); // ¡Muta el PADRE, el HIJO sigue el for!
}
while (waitpid(-1, NULL, 0) > 0);
```
* No crea un abanico, sino una **cadena lineal** (`P0 -> P0.0 -> P0.0.0 -> ...`).
* Quien llega al `waitpid` es **el último hijo** (¡que tiene **0 hijos**!), así que `waitpid(-1, ...)` retorna `-1` (`ECHILD`) de golpe. Si en lugar de `waitpid` tenía `while (procs > 0) sigsuspend(...)` esperando `SIGCHLD`, se queda **colgado para siempre**.
* **Variante si `execlp` falla:** todos los procesos que no han mutado siguen dando vueltas al `for`, creando un árbol exponencial tipo $2^N$.

### 2. Bucle obligatorio dentro del handler de `SIGCHLD`
Como el bitmap de pendientes no cuenta señales repetidas, si mueren 3 hijos casi a la vez mientras `SIGCHLD` está bloqueada o atendiéndose, el handler se ejecuta **1 sola vez**:
```c
void trata_sigchld(int s) {
    int st;
    while (waitpid(-1, &st, WNOHANG) > 0) { // ¡Bucle obligatorio para no dejar zombis!
        hijos_vivos--;
    }
}
```

### 3. `SA_RESTART` vs `EINTR` sobre `waitpid` y `read`/`write`
Si llega una señal capturada mientras el proceso está bloqueado en `waitpid()` o en `read()`/`write()`:
* **Con `sa_flags = 0`**: una vez termina el handler, la syscall retorna **`-1` con `errno == EINTR`**. Trampa mortal: si tienes `while (waitpid(-1, &st, 0) > 0);`, ¡el `-1` le hace salir del bucle y deja los hijos **zombis**!
* **Con `sa_flags = SA_RESTART`**: el Kernel **reinicia automáticamente** la syscall lenta una vez termina el handler.

### 4. Múltiples `alarm()` y máscaras con `exec`
* **Un solo temporizador por proceso:** `for (i = 0; i < 32; i++) alarm(i);` solo deja activa la última alarma (**31 segundos**).
* **`alarm()` se mantiene tras `exec`**, pero si el ejecutable mutado no captura `SIGALRM`, morirá con `"Alarm clock"`. Y cuidado en las mutaciones: en `fork()`, ¡el hijo nace con **`alarm(0)`**!

---

## 7. Memoria: marcos físicos, COW, `maps` y Heap (Tema 5)

### Dónde vive cada dato y la trampa del puntero

| Código en C | ¿Dónde vive la variable? | ¿Dónde vive el dato apuntado? | Si haces `p[0] = 5;`, ¿rompe COW en la página del puntero? |
| :--- | :--- | :--- | :--- |
| `int v[10];` local / `int i;` | **Pila** (`[stack]`) | **Pila** (`[stack]`) | Sí (escribe en la pila). |
| `int g = 1;` / `int *gp;` global | **Datos** (`.data`/`.bss`) | `gp` en Datos; `*gp` en el Heap | **¡NO!** `gp[0] = 5` modifica el Heap; la página de Datos de `gp` sigue compartida por COW. |
| `int *p = sbrk(4096);` local | **Pila** (`[stack]`) | **Heap** (`[heap]`) | **¡NO!** Escribe en el Heap; `p` no cambia de valor. |
| `int *d = mmap(..., MAP_ANONYMOUS, ...);` | **Pila** (`[stack]`) | **Región `mmap`** *(¡nunca en el Heap!)* | **¡NO!** Escribe en la región `mmap`. |

### Las 4 reglas para contar marcos físicos (páginas de 4 KB)
1. **Aislamiento absoluto entre regiones:** Código, Datos, Pila, Heap y `mmap` **nunca comparten marco físico** entre sí (aunque una variable global ocupe 4 B, gasta 1 marco entero de 4096 B $\Rightarrow 4092$ B de fragmentación interna).
2. **`ret = fork()` casi siempre rompe COW en la Pila:** al volver del `fork()`, tanto el padre como el hijo escriben el valor `ret` (y el contador `i` del bucle) en su *stack*, así que las páginas de pila modificadas se duplican enseguida.
3. **`execlp()` destruye el espacio COW:** si el hijo muta, libera su herencia del padre y empieza con un espacio nuevo bajo *demand paging*.
4. **`mmap(..., MAP_SHARED | MAP_ANONYMOUS, -1, 0)` no hace COW:** padre e hijo escriben directamente sobre los **mismos marcos físicos** (¡no se duplican!).

### Cómo leer `/proc/[PID]/maps` en el examen
* **No aparece `libc.so` ni ningún `.so`:** El binario se ha compilado **estáticamente (`-static`)**. Ventaja con *demand paging*: solo se cargan en RAM las páginas de biblioteca que realmente se ejecutan.
* **Aparecen `libc.so.6` y `ld-linux`:** Compilación **dinámica**; ahorra espacio **en disco** (ejecutables pequeños) y **en memoria física** (el código `r-xp` se comparte entre todos los procesos).
* **No aparece la línea `[heap]`:** El proceso todavía no ha pedido memoria dinámica (`sbrk`/`malloc`).
* **Alineamiento de `sbrk(0)` vs `maps`:** `sbrk(0)` retorna la dirección lógica exacta (ej. `0x883ed400`), mientras que `maps` muestra el límite físico redondeado al siguiente múltiplo de **4096 B** (`0x883ee000`).

### `sbrk(4096)` vs `malloc(4096)` y *Major Page Fault*
* **`p[4100]` fuera de rango:** Con `sbrk(4096)` cae fuera de la página asignada $\Rightarrow$ la MMU no tiene traducción $\Rightarrow$ **`SIGSEGV`**. Con `malloc(4096)` puede **no fallar** porque `libc` hace reserva en exceso con `sbrk` y la página sigue siendo válida para la MMU.
* **Excepción de MMU $\neq$ siempre `SIGSEGV`:** La MMU lanza la excepción y el Kernel consulta el PCB. Solo envía `SIGSEGV` si el acceso es ilegal o sin permisos; si es COW o *page fault*, lo resuelve y **reinicia la instrucción**.
* **Las 3 causas de un *Major Page Fault* en `*a = 1;`:** Puede no estar en RAM la página de **(1) código** (instrucción), **(2) datos/pila** (donde vive el puntero `a`), o **(3) heap/pila** (donde vive `*a`).

---

## 8. Tablas del Kernel (`TC`, `TFA`, `TI`) y Pipes (Tema 6)

### Reglas exactas para seguir las 3 tablas en cada llamada

```text
TC (1 por proceso en PCB) ───> TFA / TFO (global sistema) ───> TI (global sistema)
[fd 0, 1, 2, ...]              [refs | modo | pos_le | TI]     [refs | inodo]
```

| Llamada | Efecto en `TC` | Efecto en `TFA` (Abierta) | Efecto en `TI` (Inodos) |
| :--- | :--- | :--- | :--- |
| **`open(f, flags)`** | Ocupa el **menor `fd` libre** | Crea **siempre una nueva entrada** (`refs=1`, `pos=0`) | Crea entrada (`refs=1`) o hace **`refs++`** si ya existía |
| **`dup2(old, new)`** | `TC[new]` apunta a la misma TFA que `old` *(cierra `new` si hace falta)* | **`TFA.refs++`** | No cambia |
| **`fork()`** | El hijo hereda **copia exacta de `TC`** | **`TFA.refs++`** por cada canal apuntado | No cambia |
| **`pipe(p)`** | Ocupa 2 canales (`p[0]` lectura, `p[1]` escritura) | Crea **2 entradas** (`r` y `w`), con **`pos = '-'`** | Crea **1 inodo temporal** con **`refs = 2`** |
| **`pthread_create()`** | **No hace nada** (todos los threads usan la misma `TC`) | **No hace nada** | **No hace nada** |
| **`close(fd)`** | Libera `TC[fd]` | `TFA.refs--`; si llega a `0`, se libera | Si `TFA` se libera $\Rightarrow$ `TI.refs--` (y si es 0, se libera) |

* **`read`/`write` en fichero vs pipe:** en fichero regular modifican `pos_le` en la `TFA` (y `write` puede actualizar tamaño/bloques/fecha en `TI`); en una pipe **`pos_le` vale `'-'` y NO cambia en la `TFA`** *(los exámenes suelen considerar que un `write` actualiza la fecha de acceso en la `TI`)*.

### Las 3 trampas mortales de Pipes y FIFOs (Deadlocks y EOF)
1. **No llega nunca EOF (`read()` colgado para siempre):** Tras `fork()`, el padre o el proceso lector ha olvidado cerrar el canal de escritura `p[1]`. Mientras quede 1 canal de escritura abierto en el sistema, la pipe **no envía EOF**.
2. **Abrir una FIFO con `O_RDWR`:** ¡El mismo proceso pasa a constar a la vez como lector y **posible escritor**! Esto impide que reciba EOF cuando el otro proceso cierre, o hace que un proceso que solo escribe se bloquee al llenarse sin recibir `SIGPIPE`.
3. **Abrir una FIFO antes del `fork()`:** `open("fifo", O_RDONLY)` bloquea hasta que alguien la abra en `O_WRONLY` (y viceversa). Si lo haces **antes** de crear el otro proceso, el programa se bloquea antes de hacer el `fork()`.
* **Concurrencia vs determinismo en pipes:** Múltiples hijos escribiendo a la vez en la misma pipe mezclan bytes de forma **no determinista**; un padre leyendo secuencialmente de dos pipes distintas mantiene orden determinista.

---

## 9. Sistema de Ficheros físico (Inodos, Bloques, Links y Buffer Cache)

Cuando el examen pide tablas de inodos y bloques de datos en disco o contar accesos de `open()`:

1. **Contador `#enlaces` de un directorio:** Siempre vale **`2 + número_de_subdirectorios`** (la entrada `.` dentro de sí mismo + su nombre en el directorio padre + la entrada `..` de cada hijo inmediato).
2. **Hard links vs Soft links:**
   * **Hard link (`ln`)**: mismo número de inodo (`#enlaces++`). Prohibido sobre directorios y entre particiones.
   * **Soft link (`ln -s`)**: nuevo inodo tipo `l` (`#enlaces = 1`). Si la ruta es corta se guarda *inline* dentro del inodo (**`0` bloques de datos**); si es larga ocupa **`1` bloque de datos**.
   * **`chmod` sobre un *soft link*:** ¡Cambia los permisos del **fichero destino**, nunca del propio link!
3. **Resolución de caminos + *Buffer Cache*:**
   * Cada salto de un path alterna `Inodo directorio -> Bloque de Datos del directorio`.
   * Si al resolver un *soft link* su ruta empieza por **`/` (ruta absoluta)**, el Kernel vuelve a empezar desde el inodo raíz `/` (`I0`). Si hay **Buffer Cache**, las segundas visitas a `I0` y a su bloque son **hits de memoria** (no tocan disco).
4. **Cálculo de bloques, `lseek` y tamaño máximo real:**
   * Bloques ocupados por un fichero: $\lceil \text{tamaño} / \text{tamaño\_bloque} \rceil$.
   * `lseek(fd, 0, SEEK_END)` **consulta el inodo** para leer su tamaño; `SEEK_SET`/`SEEK_CUR` solo tocan la `TFA`.
   * **Trampa de tamaño máximo:** Aunque los índices del inodo (directos + indirectos simples/dobles/triples) den para varios TiB, si el campo `pos_le` de la **`TFA`** es de **32 bits (4 bytes)**, el tamaño máximo real queda limitado a **$2^{32}$ bytes (4 GiB)**.
5. **`unlink` (`rm`) vs `close()`:**
   * `unlink` solo modifica el bloque de directorio padre y hace `#enlaces--`. **¡No toca `TC`, `TFA` ni `TI`!**
   * Los bloques y el inodo no se liberan hasta que **`#enlaces == 0` y `TI.refs == 0`** (si algún proceso lo tiene abierto, sigue pudiendo leer hasta que haga `close`).

---

## 10. Threads y Mutexes (Tema 7 — novedad en QP25-26)

* **ULT vs KLT (*Sw threads*):** Con *User-Level Threads*, el Kernel solo ve 1 proceso $\Rightarrow$ si un ULT hace una llamada bloqueante (`read`, `waitpid`), **bloquea todo el proceso**. Con *Kernel-Level Threads* (Pthreads en Linux), cada hilo se planifica y se bloquea de forma independiente.
* **`fork()` vs `pthread_create()` sobre `TC / TFA / TI`:** `fork()` duplica la `TC` y hace `TFA.refs++`; **`pthread_create()` no modifica nada** en ninguna de las tres tablas (todos los threads comparten la misma `TC`; para leer un mismo `fd` sin pisar `pos_le`, usa **`pread()`**).
* **Muerte dentro de un mutex (*Deadlock*):** Si un thread muere o hace `pthread_exit()` manteniendo un `pthread_mutex_lock` sin haber hecho `unlock`, **el mutex queda bloqueado para siempre** y cualquier otro thread que intente entrar se queda atascado infinitamente.
* **`exit()` vs `pthread_exit()`:** `exit()` mata **todo el proceso** (todos los threads); `pthread_exit()` termina solo el thread que lo llama. En un proceso multihilo, `fork()` solo clona al hijo el thread que lo ha llamado.

---

## 11. Guía rápida para el Final de Laboratorio

En casi todas las convocatorias recientes, la estructura y rúbrica del Lab Final son fijas:
* **`Makefile` (0,5 pts):** Debe generar todos los programas a la vez (`all`), cada uno por separado, tener `clean` (dejando solo los `.c`/`.h`), y recompilar **solo si han cambiado las fuentes**.
* **Control de errores y `Usage()` (0,5 pts):** Valida argumentos con `Usage()` (a `stderr`, fd `2`) y comprueba el retorno `< 0` (o `MAP_FAILED`) de **todas** las llamadas a sistema **excepto `write` por pantalla**.
* **Regla crítica en el Ejercicio 1 (24-25 / 25-26):** Se valora el resultado de ejecución (**100% / 75% si error no-SO / 0% directo si hay algún error de SO**).

### 1. Plantilla de `Makefile` multiprograma y `Usage()`
```makefile
all: prog1 prog2

prog1: prog1.c
	gcc -Wall -o prog1 prog1.c

prog2: prog2.c
	gcc -Wall -pthread -o prog2 prog2.c

clean:
	rm -f prog1 prog2 *.o
```
*(Importante: las líneas bajo cada regla deben empezar con **TABULADOR**, nunca con espacios.)*

```c
void Usage(char *nom) {
    char b[128];
    int len = sprintf(b, "Usage: %s <arg1>\n", nom);
    write(2, b, len);
    exit(1);
}
void error_y_exit(char *msg, int code) { perror(msg); exit(code); }
```

### 2. Esqueleto seguro de Signals (sin `sleep()` ni carreras)
* **Prohibición típica:** casi siempre prohíben `sleep()`. Se sustituye con **`alarm(seg)` + `sigsuspend(&mask)`** (espera pasiva) o `volatile sig_atomic_t` si piden espera activa explícita.
* **Un solo handler para múltiples señales:** recibe `int sig` y hace `switch (sig)` o `if (sig == SIGALRM) ...`.
* **Ignorar `SIGPIPE` y detectar `EPIPE`:**
  ```c
  struct sigaction sa = {0};
  sa.sa_handler = SIG_IGN;
  sigaction(SIGPIPE, &sa, NULL);
  // Después en el write en pipe sin lectores:
  if (write(fd, &val, sizeof(int)) == -1) {
      if (errno == EPIPE) break; // Todos los lectores han cerrado
      error_y_exit("write pipe", 2);
  }
  ```
* **Proteger `read()` de `EINTR` (cuando hay `Ctrl+C` / `SIGALRM`):**
  ```c
  while ((n = read(0, buf, sizeof(buf))) == -1 && errno == EINTR);
  ```

### 3. E/S binaria, `lseek`, pipes/FIFOs y redirecciones
* **Escribir/leer enteros en binario y acceso directo:**
  ```c
  int v = 42;
  write(fd, &v, sizeof(int));                  // Escritura binaria (comprobable con xxd / hexdump)
  off_t bytes = lseek(fd, 0, SEEK_END);        // Tamaño total -> elementos = bytes / sizeof(int)
  lseek(fd, idx * sizeof(int), SEEK_SET);      // Salto directo al elemento 'idx'
  ```
* **Creación y truncado de fichero:** `open(nom, O_WRONLY | O_CREAT | O_TRUNC, 0640)` *(revisa permisos octales en el enunciado: `0600` = `rw-------`, `0640` = `rw-r-----`, `0644` = `rw-r--r--`, `0660` = `rw-rw----`)*.
* **Redirección a cualquier canal (`1`, `4`, `10`):** `dup2(fd, 10); close(fd);` (desde bash: `./prog 10> out.bin`).
* **FIFO en C tolerante si ya existe:**
  ```c
  if (mkfifo("MIPIPE", 0660) == -1 && errno != EEXIST) error_y_exit("mkfifo", 2);
  ```
* **Pipes sin nombre:** cierra **siempre** `p[0]` y `p[1]` sobrantes en padre e hijos justo después de `dup2` y antes de `exec`/`waitpid`.

### 4. Memoria dinámica (`malloc`/`realloc`/`mmap`) y Pthreads en el Lab
* **`mmap` anónimo privado vs `malloc`:**
  ```c
  int *buf = mmap(NULL, n * sizeof(int), PROT_READ | PROT_WRITE,
                  MAP_PRIVATE | MAP_ANONYMOUS, -1, 0);
  if (buf == MAP_FAILED) error_y_exit("mmap", 2);
  // ... read / write con buf ...
  if (munmap(buf, n * sizeof(int)) == -1) error_y_exit("munmap", 2);
  ```
* **Redimensionar sin `realloc` (cuando lo prohíben):** crea un vector nuevo con `malloc(nuevo_tam)`, copia con un `for`, y haz `free(viejo)`.
* **Pthreads + `pread` + argumento en el heap:**
  ```c
  int *id = malloc(sizeof(int)); *id = i; // Cada thread tiene su propio puntero (después hace free(arg))
  pthread_create(&th[i], NULL, worker, id);
  // ¡Dentro de worker(): usar pread(fd, &c, 1, offset) y acumular en variable local antes de pthread_mutex_lock!
  ```

---

## Preguntas frecuentes y respuestas modelo del Final

1. **¿Por qué la salida de un vector/variable no cambia en el padre?**  
   *"Porque padre e hijo tienen espacios de direcciones lógicos totalmente independientes; las modificaciones de memoria del hijo nunca son visibles para el padre."*
2. **¿Por qué falla el tratamiento de la señal después de un `execlp`?**  
   *"Porque la mutación con `exec` destruye el código del espacio de direcciones y restablece todos los handlers capturados a la acción por defecto (`SIG_DFL`)."*
3. **¿Por qué este bucle `waitpid` hace $N+1$ iteraciones?**  
   *"Porque hace $N$ iteraciones para liberar a cada uno de los $N$ hijos zombis y una última iteración que retorna `-1` (`ECHILD`) al no quedar más hijos."*
4. **¿Por qué `sigsuspend` recibe la señal sin perderla?**  
   *"Porque la señal se ha bloqueado previamente antes del fork, manteniéndola pendiente, y `sigsuspend` sustituye la máscara y suspende el proceso de forma atómica."*
5. **¿Por qué `p[0] = 5;` no rompe el COW de la página donde vive `p`?**  
   *"Porque `p[0] = 5` modifica el bloque de memoria del Heap (o `mmap`), no el valor de la variable puntero `p` (en la Pila o Datos), así que la página del puntero sigue sin escribirse y compartida por COW."*
6. **¿Por qué `maps` no muestra `libc.so` y cómo ayuda el *demand paging*?**  
   *"El binario se ha compilado estáticamente (`-static`). Gracias al *demand paging*, el Kernel solo carga en RAM las páginas de código de biblioteca realmente ejecutadas, ahorrando memoria física y tiempo de arranque."*
7. **¿Por qué este programa queda bloqueado al leer de una pipe/FIFO?**  
   *"O bien el padre/lector no ha cerrado el descriptor de escritura, o bien se ha abierto la FIFO con `O_RDWR`, de modo que el Kernel detecta un escritor vivo y `read()` se bloquea indefinidamente sin recibir nunca EOF."*
8. **¿Qué diferencia hay en `TC/TFA/TI` entre `fork()` y `pthread_create()`?**  
   *"`fork()` duplica la `TC` del padre e incrementa las `refs` de la `TFA` apuntadas (sin tocar `TI`); en cambio, `pthread_create()` no añade ni modifica nada en ninguna de las tres tablas porque todos los threads comparten la misma `TC` del proceso."*
9. **¿Qué ocurre si uno de dos *Sw threads* muere dentro de una región crítica protegida por un `pthread_mutex`?**  
   *"El mutex queda bloqueado y no se libera automáticamente al morir el thread, de modo que el otro thread quedará bloqueado indefinidamente al intentar hacer `pthread_mutex_lock()`."*
