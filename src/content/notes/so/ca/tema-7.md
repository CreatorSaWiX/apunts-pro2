---
title: "Tema 7: Threads i Processos"
description: "Fils d'execució vs processos, API de Pthreads, memòria compartida, condicions de carrera i exclusió mútua amb mutexes."
readTime: "10 min"
order: 7
draft: true
---

## 7.1 Threads vs Processos

Un procés representa un programa en execució i, quan arrenca, té **un sol fil d'execució**. Un **thread (fil d'execució)** és un flux d'execució dins d'un procés i constitueix la **unitat mínima d'execució i planificació del SO** (la mínima unitat a la qual se li assigna temps de CPU).

Un mateix procés pot tenir múltiples threads executant parts independents del codi de manera concurrent o paral·lela. Segons qui els gestioni, n'hi ha dos models:

| Model | Qui els planifica? | Avantatge principal | Inconvenient clau |
| :--- | :--- | :--- | :--- |
| **User-Level Threads (ULT)** | Biblioteca a espai d'usuari (el Kernel només veu 1 procés) | Creació i canvi de thread **ultraràpids** (sense entrar al Kernel). | Una crida bloquejant (`read`, `wait`) **bloqueja tots els threads** i no aprofita múltiples nuclis. |
| **Kernel-Level Threads (KLT / *Sw threads*, ex. Pthreads)** | El **Kernel** planifica cada fil individualment | Si un fil es bloqueja en E/S, **la resta continuen corrent**; paral·lelisme real en múltiples nuclis. | Més cost de gestió (cal entrar al Kernel). |

:::threadmodelsviz
:::

### Què té cada thread i què comparteixen?

:::threadmemoryviz
:::

* **Propi de cada thread** (context mínim d'execució):
  * Identificador (**TID**, *Thread ID*).
  * Punter a la pila (**Stack Pointer**) i la seva pròpia pila (*stack*).
  * Punter a la següent instrucció (**PC**, *Program Counter*).
  * Registres de la CPU (**Register File**).
  * Variables locals del thread (per exemple, `errno`).
* **Compartit per tots els threads del procés** (mateix PCB):
  * **Mateixa memòria**: codi, dades globals i *heap*. *(Nota: encara que cada thread tingui el seu propi stack, res impedeix tècnicament que un thread accedeixi a adreces del stack d'un altre thread, ja que tot pertany al mateix espai d'adreces).*
  * **Mateixos recursos del SO**: dispositius d'E/S, taula de canals (fitxers oberts), *signal handlers*, etc.

### Comparativa: Processos vs Threads

| Aspecte | Processos (`fork`) | Threads (`pthread_create`) |
| :--- | :--- | :--- |
| **Memòria** | Aïllada (còpia privada amb COW). | **Compartida** (mateix espai d'adreces; stack propi). |
| **Descriptors (`TC / TFO / TI`)** | Duplica la `TC` i fa `TFO.refs++` (no toca `TI`). | **No modifica cap taula**: tots usen la mateixa `TC` (compte amb `posicio_le`; per lectura concurrent cal `pread`). |
| **Comunicació** | Requereix IPC i syscalls (*pipes*, fitxers, senyals). | Directa per **memòria compartida** (sense syscalls). |
| **Cost (creació i canvi)** | Alt (nou espai d'adreces i taules). | **Molt baix** (mateix PCB i memòria). |
| **Seguretat / Depuració** | Un procés no corromp la memòria d'un altre. | Risc de condicions de carrera en variables compartides. |

### Per a què serveixen?
Permeten aprofitar múltiples nuclis en paral·lel i mantenir bona capacitat de resposta en programes interactius o servidors (un *pool* de threads atén peticions en paral·lel compartint directament dades en memòria sense haver de muntar IPCs entre processos).

---

## 7.2 Gestió de threads amb POSIX Threads (Pthreads)

L'estàndard més estès a sistemes tipus UNIX/Linux és **POSIX Threads (`<pthread.h>`)**, que proporciona interfícies per crear/finalitzar threads, sincronitzar-los i definir regions d'exclusió mútua. *(Molts llenguatges ofereixen APIs pròpies, com `std::thread` des de C++11, que sovint s'implementen sobre Pthreads per sota).*

### Equivalència amb la gestió de processos

| Operació | Processos | Pthreads (`<pthread.h>`) |
| :--- | :--- | :--- |
| **Creació** | `fork()` | `pthread_create()` |
| **Identificació** | `getpid()` | `pthread_self()` |
| **Finalització** | `exit()` | `pthread_exit()` |
| **Sincronització final** | `waitpid()` | `pthread_join()` |

### Primitives bàsiques de Pthreads

1. **`pthread_create`**: Inicia un nou thread que executa `start_routine(arg)`.
   ```c
   int pthread_create(pthread_t *th, pthread_attr_t *attr,
                      void *(*start_routine)(void *), void *arg);
   ```
   * `th`: paràmetre de sortida on es desa l'identificador del nou thread.
   * `attr`: atributs opcionals del thread (`NULL` per defecte).
   * `start_routine`: funció d'entrada que executarà el nou fil.
   * `arg`: argument únic passat a `start_routine` en format `void *`.
   * Retorna `0` si tot va bé, o un codi d'error en cas contrari.

2. **`pthread_self`**: Retorna el `pthread_t` del thread actual (no falla mai).
   ```c
   pthread_t pthread_self(void);
   ```

3. **`pthread_exit` vs `exit()`**: `pthread_exit(retval)` (o `return retval;`) finalitza **només el thread actual** i deixa `retval` per a `pthread_join`. En canvi, cridar **`exit()` mata tot el procés** (tots els threads s'aturen de cop). *(Si un thread fa `fork()`, el nou procés fill arrenca amb un sol thread).*
   ```c
   void pthread_exit(void *retval);
   ```

4. **`pthread_join`**: Bloqueja el thread que la crida fins que `thread` finalitza. Si `retval` no és `NULL`, hi desa el valor retornat (`*retval`). Retorna `0` o un error.
   ```c
   int pthread_join(pthread_t thread, void **retval);
   ```

:::pthreadviz
:::

### Exemple complet (execució concurrent)

```c
#include <pthread.h>
#include <stdio.h>

void *rutina(void *arg) {
    printf("Hola des del thread %ld (id: %p)\n", (long) arg, (void *) pthread_self());
    return arg; // Equivalent a pthread_exit(arg);
}

int main() {
    pthread_t threads[2];
    long ret;

    // 1. Creem tots els threads primer perquè treballin en paral·lel
    for (long i = 0; i < 2; ++i)
        pthread_create(&threads[i], NULL, rutina, (void *) (i + 1));

    // 2. Després els esperem a tots
    for (long i = 0; i < 2; ++i) {
        pthread_join(threads[i], (void **) &ret);
        printf("Thread finalitzat, retorna %ld\n", ret);
    }
    return 0;
}
```
* **Compilació**: Cal enllaçar la biblioteca de threads amb **`gcc -pthread programa.c -o programa`**.
* **Pas d'arguments en bucle**: No passis mai `&i` a tots els threads (compartirien la mateixa variable del *stack* mentre el bucle avança): passa el valor convertit a `(void *)(long)i` o reserva un enter propi al *heap* (`malloc`) per a cada thread.

---

## 7.3 Comunicació i condicions de carrera (*Race Conditions*)

Com que tots els threads comparteixen memòria, la comunicació és immediata llegint i escrivint variables compartides. Aquest avantatge introdueix un problema fonamental: les **condicions de carrera (*race conditions*)**.

Una **condició de carrera** passa quan dos o més threads accedeixen o modifiquen la mateixa posició de memòria simultàniament sense sincronització, de manera que el resultat depèn de l'ordre imprevisible en què el planificador executi les instruccions.

### Exemple clàssic (`primer` inicialitzat a `1`)

```c
// Codi executat simultàniament per Thread 1 i Thread 2
1. if (primer) {
2.     primer = 0;
3.     tasca_1();
4. } else {
5.     tasca_2();
6. }
```

* **Traça correcta**: T1 llegeix `primer == 1`, posa `primer = 0` i executa `tasca_1()`. Quan T2 comprova `if (primer)`, llegeix `0` i executa `tasca_2()`.
* **Traça errònia (condició de carrera)**: T1 llegeix `primer == 1` i perd la CPU abans d'executar `primer = 0` (o tots dos corren en nuclis diferents). T2 també llegeix `primer == 1`! Tots dos posen `primer = 0` i **tots dos executen `tasca_1()`**, mentre que `tasca_2()` no s'executa mai.

:::raceviz
:::

Per evitar-ho cal delimitar una **regió crítica**: un tros de codi on garantim que només hi pot haver **un sol thread executant-lo alhora**.

---

## 7.4 Exclusió mútua (`pthread_mutex`)

L'**exclusió mútua (*mutual exclusion*)** garanteix que cap segon thread entri a una regió crítica mentre un altre l'està executant, mitjançant dues operacions:
* **Lock (bloqueig)**: Marca l'inici de la regió crítica. Si està lliure, el thread entra; si està ocupada, queda bloquejat esperant.
* **Unlock (desbloqueig)**: Marca el final de la regió crítica i permet entrar a un dels threads que estaven esperant.

### Interfície `pthread_mutex` (`<pthread.h>`)

```c
int pthread_mutex_init(pthread_mutex_t *mutex, pthread_mutexattr_t *mutexattr);
int pthread_mutex_lock(pthread_mutex_t *mutex);
int pthread_mutex_unlock(pthread_mutex_t *mutex);
int pthread_mutex_destroy(pthread_mutex_t *mutex);
```

* Els *mutexes* s'han d'inicialitzar **abans del primer ús** amb `pthread_mutex_init(&m, NULL)` (o `PTHREAD_MUTEX_INITIALIZER`) i alliberar al final amb `pthread_mutex_destroy(&m)`.
* Si dos threads criden `pthread_mutex_lock(&m)` sobre el mateix mutex, només un avança i l'altre resta bloquejat fins que el primer faci `pthread_mutex_unlock(&m)`.

### Solució a l'exemple anterior

```c
pthread_mutex_init(&l, NULL);

pthread_mutex_lock(&l);
if (primer) {
    primer = 0;
    pthread_mutex_unlock(&l); // Alliberem ABANS de tasca_1()
    tasca_1();
} else {
    pthread_mutex_unlock(&l); // Cal alliberar també a la branca else!
    tasca_2();
}
```

### Regles d'or amb *mutexes*
* **Regions crítiques com més petites millor**: Allibera el mutex just després de tocar la dada compartida (com abans de `tasca_1()`/`tasca_2()`), i recorda desbloquejar a **totes les branques** (`else`, `return`).
* **Mort dins una regió crítica (*Deadlock*)**: Si un thread fa `pthread_exit()` (o mor) mentre manté un mutex tancat sense haver fet `unlock`, **el mutex no s'allibera sol** i la resta de threads que facin `lock` quedaran bloquejats per sempre.
* **Un mutex per recurs independent**: Evita serialitzar operacions que toquen dades diferents.

:::mutexviz
:::
