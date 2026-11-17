---
title: "Tema 7: Threads y Procesos"
description: "Hilos de ejecución vs. procesos, API de Pthreads, memoria compartida, condiciones de carrera y exclusión mutua con mutexes."
readTime: "10 min"
order: 7
draft: false
---

## 7.1 Threads vs. Procesos

Un proceso representa un programa en ejecución y, cuando arranca, tiene **un solo hilo de ejecución**. Un **thread (hilo de ejecución)** es un flujo de ejecución dentro de un proceso y constituye la **unidad mínima de ejecución y planificación del SO** (la mínima unidad a la que se le asigna tiempo de CPU).

Un mismo proceso puede tener múltiples threads ejecutando partes independientes del código de forma concurrente o paralela. Según quién los gestione, existen dos modelos:

| Modelo | ¿Quién los planifica? | Ventaja principal | Inconveniente clave |
| :--- | :--- | :--- | :--- |
| **User-Level Threads (ULT)** | Biblioteca en espacio de usuario (el Kernel solo ve 1 proceso) | Creación y cambio de thread **ultrarrápidos** (sin entrar al Kernel). | Una llamada bloqueante (`read`, `wait`) **bloquea todos los threads** y no aprovecha múltiples núcleos. |
| **Kernel-Level Threads (KLT / *Sw threads*, ej. Pthreads)** | El **Kernel** planifica cada hilo individualmente | Si un hilo se bloquea en E/S, **el resto continúan corriendo**; paralelismo real en múltiples núcleos. | Mayor coste de gestión (hay que entrar al Kernel). |

:::threadmodelsviz
:::

### ¿Qué tiene cada thread y qué comparten?

:::threadmemoryviz
:::

* **Propio de cada thread** (contexto mínimo de ejecución):
  * Identificador (**TID**, *Thread ID*).
  * Puntero a la pila (**Stack Pointer**) y su propia pila (*stack*).
  * Puntero a la siguiente instrucción (**PC**, *Program Counter*).
  * Registros de la CPU (**Register File**).
  * Variables locales del thread (por ejemplo, `errno`).
* **Compartido por todos los threads del proceso** (mismo PCB):
  * **Misma memoria**: código, datos globales y *heap*. *(Nota: aunque cada thread tenga su propio stack, nada impide técnicamente que un thread acceda a direcciones del stack de otro thread, ya que todo pertenece al mismo espacio de direcciones).*
  * **Mismos recursos del SO**: dispositivos de E/S, tabla de canales (ficheros abiertos), *signal handlers*, etc.

### Comparativa: Procesos vs. Threads

| Aspecto | Procesos (`fork`) | Threads (`pthread_create`) |
| :--- | :--- | :--- |
| **Memoria** | Aislada (copia privada con COW). | **Compartida** (mismo espacio de direcciones; stack propio). |
| **Descriptores (`TC / TFO / TI`)** | Duplica la `TC` y hace `TFO.refs++` (no toca `TI`). | **No modifica ninguna tabla**: todos usan la misma `TC` (cuidado con `posicio_le`; para lectura concurrente hace falta `pread`). |
| **Comunicación** | Requiere IPC y syscalls (*pipes*, ficheros, señales). | Directa por **memoria compartida** (sin syscalls). |
| **Coste (creación y cambio)** | Alto (nuevo espacio de direcciones y tablas). | **Muy bajo** (mismo PCB y memoria). |
| **Seguridad / Depuración** | Un proceso no corrompe la memoria de otro. | Riesgo de condiciones de carrera en variables compartidas. |

### ¿Para qué sirven?
Permiten aprovechar múltiples núcleos en paralelo y mantener buena capacidad de respuesta en programas interactivos o servidores (un *pool* de threads atiende peticiones en paralelo compartiendo directamente datos en memoria sin tener que montar IPCs entre procesos).

---

## 7.2 Gestión de threads con POSIX Threads (Pthreads)

El estándar más extendido en sistemas tipo UNIX/Linux es **POSIX Threads (`<pthread.h>`)**, que proporciona interfaces para crear/finalizar threads, sincronizarlos y definir regiones de exclusión mutua. *(Muchos lenguajes ofrecen APIs propias, como `std::thread` desde C++11, que a menudo se implementan sobre Pthreads por debajo).*

### Equivalencia con la gestión de procesos

| Operación | Procesos | Pthreads (`<pthread.h>`) |
| :--- | :--- | :--- |
| **Creación** | `fork()` | `pthread_create()` |
| **Identificación** | `getpid()` | `pthread_self()` |
| **Finalización** | `exit()` | `pthread_exit()` |
| **Sincronización final** | `waitpid()` | `pthread_join()` |

### Primitivas básicas de Pthreads

1. **`pthread_create`**: Inicia un nuevo thread que ejecuta `start_routine(arg)`.
   ```c
   int pthread_create(pthread_t *th, pthread_attr_t *attr,
                      void *(*start_routine)(void *), void *arg);
   ```
   * `th`: parámetro de salida donde se guarda el identificador del nuevo thread.
   * `attr`: atributos opcionales del thread (`NULL` por defecto).
   * `start_routine`: función de entrada que ejecutará el nuevo hilo.
   * `arg`: argumento único pasado a `start_routine` en formato `void *`.
   * Devuelve `0` si todo va bien, o un código de error en caso contrario.

2. **`pthread_self`**: Devuelve el `pthread_t` del thread actual (no falla nunca).
   ```c
   pthread_t pthread_self(void);
   ```

3. **`pthread_exit` vs. `exit()`**: `pthread_exit(retval)` (o `return retval;`) finaliza **solo el thread actual** y deja `retval` para `pthread_join`. En cambio, llamar a **`exit()` mata todo el proceso** (todos los threads se detienen de golpe). *(Si un thread hace `fork()`, el nuevo proceso hijo arranca con un solo thread).*
   ```c
   void pthread_exit(void *retval);
   ```

4. **`pthread_join`**: Bloquea el thread que la llama hasta que `thread` finaliza. Si `retval` no es `NULL`, guarda allí el valor devuelto (`*retval`). Devuelve `0` o un error.
   ```c
   int pthread_join(pthread_t thread, void **retval);
   ```

:::pthreadviz
:::

### Ejemplo completo (ejecución concurrente)

```c
#include <pthread.h>
#include <stdio.h>

void *rutina(void *arg) {
    printf("Hola desde el thread %ld (id: %p)\n", (long) arg, (void *) pthread_self());
    return arg; // Equivalente a pthread_exit(arg);
}

int main() {
    pthread_t threads[2];
    long ret;

    // 1. Creamos todos los threads primero para que trabajen en paralelo
    for (long i = 0; i < 2; ++i)
        pthread_create(&threads[i], NULL, rutina, (void *) (i + 1));

    // 2. Después los esperamos a todos
    for (long i = 0; i < 2; ++i) {
        pthread_join(threads[i], (void **) &ret);
        printf("Thread finalizado, devuelve %ld\n", ret);
    }
    return 0;
}
```
* **Compilación**: Hay que enlazar la biblioteca de threads con **`gcc -pthread programa.c -o programa`**.
* **Paso de argumentos en bucle**: No pases nunca `&i` a todos los threads (compartirían la misma variable del *stack* mientras el bucle avanza): pasa el valor convertido a `(void *)(long)i` o reserva un entero propio en el *heap* (`malloc`) para cada thread.

---

## 7.3 Comunicación y condiciones de carrera (*Race Conditions*)

Como todos los threads comparten memoria, la comunicación es inmediata leyendo y escribiendo variables compartidas. Esta ventaja introduce un problema fundamental: las **condiciones de carrera (*race conditions*)**.

Una **condición de carrera** ocurre cuando dos o más threads acceden o modifican la misma posición de memoria simultáneamente sin sincronización, de modo que el resultado depende del orden imprevisible en el que el planificador ejecute las instrucciones.

### Ejemplo clásico (`primero` inicializado a `1`)

```c
// Código ejecutado simultáneamente por Thread 1 y Thread 2
1. if (primero) {
2.     primero = 0;
3.     tarea_1();
4. } else {
5.     tarea_2();
6. }
```

* **Traza correcta**: T1 lee `primero == 1`, pone `primero = 0` y ejecuta `tarea_1()`. Cuando T2 comprueba `if (primero)`, lee `0` y ejecuta `tarea_2()`.
* **Traza errónea (condición de carrera)**: T1 lee `primero == 1` y pierde la CPU antes de ejecutar `primero = 0` (o ambos corren en núcleos distintos). ¡T2 también lee `primero == 1`! Ambos ponen `primero = 0` y **ambos ejecutan `tarea_1()`**, mientras que `tarea_2()` no se ejecuta nunca.

:::raceviz
:::

Para evitarlo hay que delimitar una **región crítica**: un trozo de código donde garantizamos que solo puede haber **un único thread ejecutándolo a la vez**.

---

## 7.4 Exclusión mutua (`pthread_mutex`)

La **exclusión mutua (*mutual exclusion*)** garantiza que ningún segundo thread entre en una región crítica mientras otro la está ejecutando, mediante dos operaciones:
* **Lock (bloqueo)**: Marca el inicio de la región crítica. Si está libre, el thread entra; si está ocupada, queda bloqueado esperando.
* **Unlock (desbloqueo)**: Marca el final de la región crítica y permite entrar a uno de los threads que estaban esperando.

### Interfaz `pthread_mutex` (`<pthread.h>`)

```c
int pthread_mutex_init(pthread_mutex_t *mutex, pthread_mutexattr_t *mutexattr);
int pthread_mutex_lock(pthread_mutex_t *mutex);
int pthread_mutex_unlock(pthread_mutex_t *mutex);
int pthread_mutex_destroy(pthread_mutex_t *mutex);
```

* Los *mutexes* deben inicializarse **antes del primer uso** con `pthread_mutex_init(&m, NULL)` (o `PTHREAD_MUTEX_INITIALIZER`) y liberarse al final con `pthread_mutex_destroy(&m)`.
* Si dos threads llaman a `pthread_mutex_lock(&m)` sobre el mismo mutex, solo uno avanza y el otro queda bloqueado hasta que el primero haga `pthread_mutex_unlock(&m)`.

### Solución al ejemplo anterior

```c
pthread_mutex_init(&l, NULL);

pthread_mutex_lock(&l);
if (primero) {
    primero = 0;
    pthread_mutex_unlock(&l); // Liberamos ANTES de tarea_1()
    tarea_1();
} else {
    pthread_mutex_unlock(&l); // ¡Hay que liberar también en la rama else!
    tarea_2();
}
```

### Reglas de oro con *mutexes*
* **Regiones críticas cuanto más pequeñas mejor**: Libera el mutex justo después de tocar el dato compartido (como antes de `tarea_1()`/`tarea_2()`), y recuerda desbloquear en **todas las ramas** (`else`, `return`).
* **Muerte dentro de una región crítica (*Deadlock*)**: Si un thread hace `pthread_exit()` (o muere) mientras mantiene un mutex cerrado sin haber hecho `unlock`, **el mutex no se libera solo** y el resto de threads que hagan `lock` quedarán bloqueados para siempre.
* **Un mutex por recurso independiente**: Evita serializar operaciones que tocan datos diferentes.

:::mutexviz
:::
