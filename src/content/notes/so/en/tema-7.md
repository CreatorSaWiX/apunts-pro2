---
title: "Topic 7: Threads and Processes"
description: "Threads vs. processes, Pthreads API, shared memory, race conditions, and mutual exclusion with mutexes."
readTime: "10 min"
order: 7
draft: false
---

## 7.1 Threads vs. Processes

A process represents a running program and, when it starts, has **a single thread of execution**. A **thread** is a flow of execution within a process and constitutes the **OS's minimum unit of execution and scheduling** (the smallest unit to which CPU time is assigned).

A single process can have multiple threads executing independent parts of the code concurrently or in parallel. Depending on who manages them, there are two models:

| Model | Who schedules them? | Main advantage | Key drawback |
| :--- | :--- | :--- | :--- |
| **User-Level Threads (ULT)** | User-space library (the Kernel only sees 1 process) | **Ultra-fast** thread creation and switching (no Kernel entry). | A blocking call (`read`, `wait`) **blocks all threads** and does not take advantage of multiple cores. |
| **Kernel-Level Threads (KLT / *Sw threads*, e.g., Pthreads)** | The **Kernel** schedules each thread individually | If one thread blocks on I/O, **the rest keep running**; true parallelism across multiple cores. | Higher management overhead (requires entering the Kernel). |

:::threadmodelsviz
:::

### What does each thread have, and what do they share?

:::threadmemoryviz
:::

* **Private to each thread** (minimal execution context):
  * Identifier (**TID**, *Thread ID*).
  * Stack pointer (**Stack Pointer**) and its own *stack*.
  * Pointer to the next instruction (**PC**, *Program Counter*).
  * CPU registers (**Register File**).
  * Thread-local variables (for example, `errno`).
* **Shared by all threads in the process** (same PCB):
  * **Same memory**: code, global data, and *heap*. *(Note: even though each thread has its own stack, nothing technically prevents a thread from accessing addresses on another thread's stack, since everything belongs to the same address space.)*
  * **Same OS resources**: I/O devices, channel table (open files), *signal handlers*, etc.

### Comparison: Processes vs. Threads

| Aspect | Processes (`fork`) | Threads (`pthread_create`) |
| :--- | :--- | :--- |
| **Memory** | Isolated (private copy with COW). | **Shared** (same address space; own stack). |
| **Descriptors (`TC / TFO / TI`)** | Duplicates `TC` and does `TFO.refs++` (does not touch `TI`). | **Modifies no table**: all use the same `TC` (watch out for `posicio_le`; concurrent reads require `pread`). |
| **Communication** | Requires IPC and syscalls (*pipes*, files, signals). | Direct via **shared memory** (no syscalls). |
| **Cost (creation and switching)** | High (new address space and tables). | **Very low** (same PCB and memory). |
| **Safety / Debugging** | One process cannot corrupt another's memory. | Risk of race conditions on shared variables. |

### What are they used for?
They allow taking advantage of multiple cores in parallel and maintaining good responsiveness in interactive programs or servers (a thread *pool* handles requests in parallel, sharing data directly in memory without having to set up IPCs between processes).

---

## 7.2 Thread Management with POSIX Threads (Pthreads)

The most widespread standard on UNIX/Linux-like systems is **POSIX Threads (`<pthread.h>`)**, which provides interfaces to create/terminate threads, synchronize them, and define mutual exclusion regions. *(Many languages offer their own APIs, such as `std::thread` since C++11, which are often implemented on top of Pthreads underneath.)*

### Equivalence with Process Management

| Operation | Processes | Pthreads (`<pthread.h>`) |
| :--- | :--- | :--- |
| **Creation** | `fork()` | `pthread_create()` |
| **Identification** | `getpid()` | `pthread_self()` |
| **Termination** | `exit()` | `pthread_exit()` |
| **Final synchronization** | `waitpid()` | `pthread_join()` |

### Basic Pthreads Primitives

1. **`pthread_create`**: Starts a new thread that executes `start_routine(arg)`.
   ```c
   int pthread_create(pthread_t *th, pthread_attr_t *attr,
                      void *(*start_routine)(void *), void *arg);
   ```
   * `th`: output parameter where the new thread's identifier is stored.
   * `attr`: optional thread attributes (`NULL` by default).
   * `start_routine`: entry function that the new thread will execute.
   * `arg`: single argument passed to `start_routine` as `void *`.
   * Returns `0` on success, or an error code otherwise.

2. **`pthread_self`**: Returns the `pthread_t` of the calling thread (never fails).
   ```c
   pthread_t pthread_self(void);
   ```

3. **`pthread_exit` vs. `exit()`**: `pthread_exit(retval)` (or `return retval;`) terminates **only the current thread** and leaves `retval` for `pthread_join`. By contrast, calling **`exit()` kills the entire process** (all threads stop immediately). *(If a thread calls `fork()`, the new child process starts with a single thread.)*
   ```c
   void pthread_exit(void *retval);
   ```

4. **`pthread_join`**: Blocks the calling thread until `thread` terminates. If `retval` is not `NULL`, it stores the returned value there (`*retval`). Returns `0` or an error.
   ```c
   int pthread_join(pthread_t thread, void **retval);
   ```

:::pthreadviz
:::

### Complete Example (Concurrent Execution)

```c
#include <pthread.h>
#include <stdio.h>

void *routine(void *arg) {
    printf("Hello from thread %ld (id: %p)\n", (long) arg, (void *) pthread_self());
    return arg; // Equivalent to pthread_exit(arg);
}

int main() {
    pthread_t threads[2];
    long ret;

    // 1. Create all threads first so they work in parallel
    for (long i = 0; i < 2; ++i)
        pthread_create(&threads[i], NULL, routine, (void *) (i + 1));

    // 2. Then wait for all of them
    for (long i = 0; i < 2; ++i) {
        pthread_join(threads[i], (void **) &ret);
        printf("Thread finished, returns %ld\n", ret);
    }
    return 0;
}
```
* **Compilation**: You must link the threads library with **`gcc -pthread program.c -o program`**.
* **Passing arguments in a loop**: Never pass `&i` to all threads (they would share the same *stack* variable as the loop advances): pass the value cast to `(void *)(long)i` or allocate a separate integer on the *heap* (`malloc`) for each thread.

---

## 7.3 Communication and Race Conditions

Because all threads share memory, communication is immediate by reading and writing shared variables. This advantage introduces a fundamental problem: **race conditions**.

A **race condition** occurs when two or more threads access or modify the same memory location simultaneously without synchronization, so the result depends on the unpredictable order in which the scheduler executes the instructions.

### Classic Example (`first` initialized to `1`)

```c
// Code executed simultaneously by Thread 1 and Thread 2
1. if (first) {
2.     first = 0;
3.     task_1();
4. } else {
5.     task_2();
6. }
```

* **Correct trace**: T1 reads `first == 1`, sets `first = 0`, and executes `task_1()`. When T2 checks `if (first)`, it reads `0` and executes `task_2()`.
* **Erroneous trace (race condition)**: T1 reads `first == 1` and loses the CPU before executing `first = 0` (or both run on different cores). T2 also reads `first == 1`! Both set `first = 0` and **both execute `task_1()`**, while `task_2()` never executes.

:::raceviz
:::

To prevent this, we must delimit a **critical region**: a piece of code where we guarantee that only **a single thread can execute it at a time**.

---

## 7.4 Mutual Exclusion (`pthread_mutex`)

**Mutual exclusion** guarantees that no second thread enters a critical region while another is executing it, through two operations:
* **Lock**: Marks the start of the critical region. If it is free, the thread enters; if it is busy, the thread blocks and waits.
* **Unlock**: Marks the end of the critical region and allows one of the waiting threads to enter.

### `pthread_mutex` Interface (`<pthread.h>`)

```c
int pthread_mutex_init(pthread_mutex_t *mutex, pthread_mutexattr_t *mutexattr);
int pthread_mutex_lock(pthread_mutex_t *mutex);
int pthread_mutex_unlock(pthread_mutex_t *mutex);
int pthread_mutex_destroy(pthread_mutex_t *mutex);
```

* *Mutexes* must be initialized **before first use** with `pthread_mutex_init(&m, NULL)` (or `PTHREAD_MUTEX_INITIALIZER`) and destroyed at the end with `pthread_mutex_destroy(&m)`.
* If two threads call `pthread_mutex_lock(&m)` on the same mutex, only one proceeds and the other remains blocked until the first calls `pthread_mutex_unlock(&m)`.

### Solution to the Previous Example

```c
pthread_mutex_init(&l, NULL);

pthread_mutex_lock(&l);
if (first) {
    first = 0;
    pthread_mutex_unlock(&l); // Release BEFORE task_1()
    task_1();
} else {
    pthread_mutex_unlock(&l); // Must also release in the else branch!
    task_2();
}
```

### Golden Rules with *Mutexes*
* **Keep critical regions as small as possible**: Release the mutex right after touching the shared data (as before `task_1()`/`task_2()`), and remember to unlock in **all branches** (`else`, `return`).
* **Dying inside a critical region (*Deadlock*)**: If a thread calls `pthread_exit()` (or dies) while holding a locked mutex without calling `unlock`, **the mutex is not released automatically** and the remaining threads that call `lock` will stay blocked forever.
* **One mutex per independent resource**: Avoid serializing operations that touch different data.

:::mutexviz
:::
