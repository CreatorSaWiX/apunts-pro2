---
title: "OS final"
description: "Comprehensive summary for the Operating Systems final exam (Theory and Lab): Topics 1–7, real patterns, traps, and model answers."
readTime: "40 min"
order: 99
draft: false
isNew: true
---

> **Golden rule in Theory finals:** *"Justify all answers. Unjustified answers are considered wrong."* Since QP24-25, the exam is taken on a PC with a plain text editor and **local `man` pages available** (exact prototypes and flags can be checked, so imprecisions are not forgiven).

## 1. OS architecture, CPU modes, and kernel transitions

### CPU modes: user vs. kernel
The CPU maintains an internal bit in its Program Status Word (PSW) indicating the active privilege level:
* **User Mode**: Application code executes with restricted privileges. It can only access its own logical memory address space and non-privileged instructions. Direct hardware access is forbidden.
* **Kernel Mode (Privileged)**: The operating system has unrestricted access to all hardware, all physical memory, and privileged instructions.
* **Why cannot an application call kernel functions directly?**
  1. Kernel code resides outside the application's address space (it is inaccessible).
  2. It executes privileged instructions prohibited in user mode.

### How do we enter the kernel?
There are only **3 entry mechanisms**. The kernel never executes unless one of these three occurs:

| Mechanism | Voluntary / Involuntary | Synchronous / Asynchronous | Cause |
| :--- | :---: | :---: | :--- |
| **Hardware Interrupt** | Involuntary | **Asynchronous** | External device: timer tick (every ~10 ms), keyboard, network. |
| **Software Exception** | Involuntary | **Synchronous** | CPU fault while executing an instruction: division by 0, invalid memory access (*SegFault*), page fault. |
| **System Call (*trap*)** | **Voluntary** | **Synchronous** | The program requests a service from the OS (`write`, `fork`, `sigsuspend`). |

### Why is the system library (`libc`) hardware-dependent and non-portable?
Because it contains the specific machine instruction for that CPU to jump into the kernel (`syscall` on x86_64, `svc` on ARM) and places parameters in the specific registers fixed by the architecture. A `libc` binary for ARM does not work on x86.

### Shell commands: built-in vs. external
* **Built-in (e.g., `cd`, `exit`)**: Executes inside the shell process itself. **It does not create any new process**.
* **External (e.g., `ls`, `ps`)**: The shell creates a child process with `fork()` and loads the binary with `execlp()`.

### Low-level terminal output (`sprintf` + `write`)
In OS courses we avoid `printf` because it uses user-space buffering. We use `write` on file descriptor 1 (`stdout`):
```c
char buf[80];
int len = sprintf(buf, "Hello from PID %d\n", getpid());
write(1, buf, len);
```

---

## 2. Process management (PCB, lifecycle, and system calls)

### The PCB (*Process Control Block*)
Record that the kernel stores in its memory for each process: PID, PPID, state, copy of CPU registers, memory, open file descriptor table (`fd`), 4 signal structures, and CPU counters.

### Lifecycle and state transitions
* **`RUN`**: Executing instructions on the physical CPU.
* **`READY`**: Ready to execute, waiting for its turn in the CPU queue.
* **`BLOCKED`**: Waiting for an external event (I/O, child termination, signal). **Consumes no CPU**.
* **`STOPPED`**: Explicitly paused by `SIGSTOP` or `Ctrl+Z`. Resumes only with `SIGCONT`.
* **`ZOMBIE`**: Has called `exit()`. Memory is freed, but the PCB remains alive in the kernel storing the exit code until the parent calls `waitpid()`.

*Can the timer interrupt move a process to `BLOCKED`?*  
**No.** Moving to `BLOCKED` is **always voluntary** by the process when it performs a blocking system call. The timer can only move a process from `RUN` to `READY` (if it exhausts its time quantum).

---

### What is inherited in `fork()` and what changes in `exec()`? (Essential)

| PCB Data | After `fork()` (child) | After `exec()` (mutation) |
| :--- | :--- | :--- |
| **PID** | **New and unique** (not inherited) | **Remains identical** |
| **PPID** | Takes the parent's PID | **Remains identical** |
| **Memory space** | Independent copy (*copy-on-write*) | **Destroyed** and the new binary is loaded |
| **Open descriptors (`fd`)** | Inherited (point to the same files) | Kept (unless marked `FD_CLOEXEC`) |
| **Signal mask** | **Inherited identically** | **Remains identical** |
| **Pending signals** | **Starts empty (at 0)** | Pending signals **are kept** |
| **Handler table** | **Inherited identically** | **Caught ones reset to `SIG_DFL`**; `SIG_IGN` are kept |
| **`alarm()` timer** | **Starts disabled (at 0)** | Remaining alarm time **is kept** |
| **CPU time consumed** | **Starts at 0** | Accumulated time is kept |

---

### Lifecycle and fundamental system calls

### 1. Cloning a process: `fork()`
Clones the current process, creating a new identical one:
```c
int pid = fork();
if (pid < 0) {
    perror("Error in fork");
    exit(1);
} else if (pid == 0) {
    // Code executed only by the child (returns 0)
    exit(0);
} else {
    // Code executed only by the parent (returns the child's PID)
}
```

* **Memory isolation:** Parent and child **do not share memory**. Modifications by the child are never visible to the parent:
```c
int global = 100;
if (fork() == 0) {
    global = 200; // Only changes in the child's private memory
    exit(0);
}
waitpid(-1, NULL, 0);
// Here in the parent, global is still 100!
```

### 2. Mutating a process: `execlp()`
Replaces the process's memory with the new binary, keeping the same PID. Only returns if it fails (`-1`). Requires sentinel `(char *)NULL`:
```c
execlp("./program", "program", "arg1", (char *)NULL);
// If this line executes, execlp has failed:
perror("Error loading binary");
exit(1);
```

### 3. Terminating a process: `exit(status)`
Frees RAM, closes descriptors, and puts the process in **`ZOMBIE`** state storing `status` in the PCB. Never returns.

### 4. Reaping children and freeing PCB: `waitpid()`
The parent waits for a child to finish, retrieves its termination cause, and **frees its PCB from the kernel**:
```c
int status;
int child_pid = waitpid(-1, &status, 0); // -1 = any child, 0 = blocking

if (WIFEXITED(status)) {
    // Terminated voluntarily with exit(code) or return
    int code = WEXITSTATUS(status);
} else if (WIFSIGNALED(status)) {
    // Killed abruptly by an uncaught signal
    int sig = WTERMSIG(status);
}
```

* **Behavior according to options:**
  * `options = 0` (blocking): If it has living children, it sleeps in `BLOCKED`. If it has a zombie child, it frees it and returns immediately. If **it has no children**, it returns `-1` immediately (`ECHILD`).
  * `options = WNOHANG` (non-blocking): If it has living children but no zombies, **it returns `0` immediately**.
  * **Trap warning:** `while(waitpid(-1, NULL, WNOHANG) >= 0);` on living children is **busy waiting** (burns 100% CPU making thousands of useless calls per second).
* **How many calls does a loop make to reap children?**
```c
// Makes exactly N_children + 1 calls (the N calls that reap children plus the last one returning -1)
while (waitpid(-1, NULL, 0) > 0);
```

### Orphan and zombie processes
* If the parent dies before the child, the child becomes an **orphan** and is immediately adopted by the `init` / `systemd` process (PID 1).
* **Can an orphan remain a zombie forever?** **No.** Process PID 1 periodically runs `waitpid()` to reap any orphan process as soon as it dies.

---

## 3. Process hierarchies and concurrency

### Sequential vs. concurrent scheme
Describes when the parent waits for its children relative to when it creates them.

### Sequential scheme
The parent creates one child and waits for it to finish before creating the next. `waitpid` goes **inside** the loop:
```c
for (i = 0; i < N; i++) {
    ret = fork();
    if (ret == 0) {
        // Child code
        exit(0);
    }
    waitpid(-1, NULL, 0); // Wait for the child before creating another
}
```
* Only one child is alive at a time (plus the parent).
* **Maximum degree of concurrency = 2** (parent + 1 child).
* Execution order is **deterministic**: child 0, then child 1, etc.

### Concurrent scheme
The parent creates all children first and waits for them afterward. `waitpid` goes **outside** the creation loop:
```c
for (i = 0; i < N; i++) {
    ret = fork();
    if (ret == 0) {
        // Child code
        exit(0);
    }
}
while (waitpid(-1, NULL, 0) > 0); // Wait for all children at the end
```
* All children can be alive at the same time.
* **Maximum degree of concurrency = N + 1** (parent + N children).
* Execution and termination order is **non-deterministic**: it depends on the CPU scheduler.

---

### Process trees

### 1. Fan (star) tree
A parent creates $N$ direct children that terminate with `exit()`:
```c
for (i = 0; i < 3; i++) {
    if (fork() == 0) {
        exit(0); // Child dies and does not fork further
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

### 2. Cascade tree (mutation chain)
The child mutates into the same program passing a decremented parameter:
```c
// Execution: ./prog 3
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

### 3. Recursive binary tree (`arbol.c` in QT 23-24)
Each process with `levels > 0` creates 2 children, and these mutate with `levels - 1`:
```c
if (levels > 0) {
    ret = fork();
    if (ret > 0) {
        ret = fork(); // Parent does a second fork
    }
    if (ret == 0) {
        levels--;
        sprintf(buf, "%d", levels);
        execlp("./arbol", "arbol", buf, (char *)NULL);
    }
}
```
* Total processes: $2^{\text{levels} + 1} - 1$. For `levels = 3`: $1 + 2 + 4 + 8 = 15$ processes.

---

## 4. Signal handling (*signals*)

A signal is an asynchronous notification sent by the kernel or by another process.

### The 4 signal structures in the PCB
When a signal arrives, the kernel checks these 4 structures in this order:
1. **Blocked mask (`sigset_t`)**: Temporarily held signals. If the signal is in the mask, it is not delivered now.
2. **Pending bitmap**: Bits storing held signals. **They are not queued**: if you receive the same signal 5 times while it is blocked, upon unblocking it is handled only **once**.
3. **Handler table**: What to do upon receiving it:
   * `SIG_DFL`: Default action (terminate, stop, or ignore).
   * `SIG_IGN`: Ignore it (discarded).
   * Custom function: Jumps to execute the C handler.
4. **Alarm timer**: Internal countdown managed by the kernel. When it reaches 0, it sends `SIGALRM`. There is only 1 alarm per process.

### Fundamental signals table

| Signal | Code | Default action | Can it be caught or blocked? |
| :--- | :---: | :---: | :---: |
| **`SIGKILL`** | 9 | Kills the process instantly | **Never (unstoppable)** |
| **`SIGSTOP`** | 19 | Freezes the process (`STOPPED`) | **Never (unstoppable)** |
| **`SIGCONT`** | 18 | Resumes the process | Yes |
| **`SIGALRM`** | 14 | Kills the process | Yes |
| **`SIGCHLD`** | 17 | **Ignore (does nothing)** | Yes |
| **`SIGINT`** | 2 | Kills the process (`Ctrl+C`) | Yes |
| **`SIGUSR1` / `SIGUSR2`** | 10 / 12 | Kills the process | Yes |

---

### Signal system calls

### 1. Sending a signal: `kill(pid, signal)`
Sends a signal to a process. Not only used to kill:
```c
kill(pid, SIGSTOP); // Pauses the process (moves to STOPPED)
kill(pid, SIGCONT); // Resumes the paused process
kill(pid, SIGKILL); // Forces immediate termination
kill(pid, SIGUSR1); // Sends user-defined signal
```

### 2. Configuring signal response: `sigaction()`
```c
void handle_signal(int s) {
    char msg[64];
    int len = sprintf(msg, "Received signal %d\n", s);
    write(1, msg, len);
}

// In main:
struct sigaction sa;
sa.sa_handler = handle_signal;       // Function to execute
sigemptyset(&sa.sa_mask);            // Signals to block ONLY during the handler
sa.sa_flags = 0;
sigaction(SIGUSR1, &sa, NULL);       // Associates SIGUSR1 with the handler
```

* **Key `sa_flags` flags:**
  * `sa.sa_flags = SA_RESETHAND;`: Executes the handler once; immediately afterward, the action resets to default (`SIG_DFL`).
  * `sa.sa_flags = SA_RESTART;`: If the process was blocked in a slow syscall (`read`, `waitpid`), automatically restarts it without returning `EINTR`.
* **The `sa.sa_mask` field:** Signals added to the mask **only while the handler is executing**. Upon leaving the handler, the previous mask is automatically restored:
```c
sigaddset(&sa.sa_mask, SIGUSR2); // During handle_signal, SIGUSR2 will also be blocked
```

### 3. Modifying the blocking mask: `sigprocmask()`
```c
sigset_t mask, oldmask;
sigemptyset(&mask);
sigaddset(&mask, SIGALRM);
sigaddset(&mask, SIGCHLD);

// 1. Block SIGALRM and SIGCHLD (adds them to the current mask):
sigprocmask(SIG_BLOCK, &mask, &oldmask);

// 2. Unblock:
sigprocmask(SIG_UNBLOCK, &mask, NULL);

// 3. Restore the mask as it was in oldmask:
sigprocmask(SIG_SETMASK, &oldmask, NULL);
```

### 4. Waiting safely for a signal: `sigsuspend()`
**Atomically** replaces the process's mask with `mask` and puts it in **`BLOCKED`** until an unblocked signal arrives:
```c
sigsuspend(&mask); // Always returns -1 (errno = EINTR)
```
* Upon returning from the handler, `sigsuspend` **automatically restores the previous mask**.
* **Which signals can always wake a process from `sigsuspend`?** Only `SIGKILL` and `SIGSTOP` (because they can never be blocked).

### 5. Scheduling a timer: `alarm(seconds)`
Schedules a `SIGALRM` in $N$ seconds. Does not stop the process:
```c
alarm(5); // In 5 seconds SIGALRM will arrive

// Cancel alarm and get remaining time:
int remaining = alarm(0);        // alarm(0) disables it and returns remaining seconds
int elapsed = 5 - remaining;     // Measures time consumed by the child
```

---

### Race conditions

Waiting for a signal with `sigsuspend` while avoiding race conditions.
If a parent wants to wait for a child to send it a signal (`SIGUSR1`), **it must block it before `fork()`**:
```c
sigset_t mask, wait_mask;
int received = 0;

void handler_usr1(int s) {
    received = 1;
}

// 1. Block BEFORE fork. If the child is ultra-fast, the signal is not lost
sigfillset(&mask);
sigprocmask(SIG_BLOCK, &mask, NULL);

// Associate the handler
struct sigaction sa;
sa.sa_handler = handler_usr1;
sigemptyset(&sa.sa_mask);
sa.sa_flags = 0;
sigaction(SIGUSR1, &sa, NULL);

if (fork() == 0) {
    // Child does quick work and notifies the parent
    kill(getppid(), SIGUSR1);
    exit(0);
}

// 2. Prepare mask for sigsuspend: everything blocked EXCEPT SIGUSR1
sigfillset(&wait_mask);
sigdelset(&wait_mask, SIGUSR1);

// 3. Passive wait (0% CPU): atomically unblocks and sleeps
while (!received) {
    sigsuspend(&wait_mask);
}
```
* **Why is it an error not to block before `fork()`?**  
  If the child sends `SIGUSR1` before the parent enters `sigsuspend()`, the signal is processed too early. When the parent finally executes `sigsuspend()`, **it stays frozen forever**.

### Who prints messages like `"Alarm clock"` or `"User defined signal 1"`?
The **shell** prints them, not the process. The shell calls `waitpid()` on the executed program and, upon detecting with `WIFSIGNALED(status)` that it died from an uncaught signal, prints the descriptive text to the console.

---

## 5. CPU scheduling (*scheduling*)

* **Non-preemptive (cooperative) scheduling:** The process only leaves the CPU voluntarily: calls `exit()`, makes a blocking syscall (`read`, `waitpid`), or dies from a signal.
* **Preemptive scheduling:** The kernel can forcibly take the CPU away when the process exhausts its time quantum (timer interrupt) or when a higher-priority process becomes `READY`.

### Round Robin (RR)
FIFO queue with a fixed time quantum:
* *With 3 processes and a 10 ms quantum, can one process execute twice in less than 30 ms?*  
  **Yes.** If any of the other processes makes a blocking call before exhausting its 10 ms, it releases the CPU early and the turn advances immediately.

### Completely Fair Scheduler (Linux CFS)
Orders processes by `vruntime` (virtual runtime). Favors interactive / I/O-bound processes because they spend a lot of time blocked, accumulate very little `vruntime`, and receive top priority when waking up.

---

## 6. Processes and Signals: classic Final twists

In the Final exam, 30–40% of the theory grade still comes from Processes and Signals, but with these 4 recurring traps:

### 1. The inverted `fork()` loop (when the PARENT mutates, `ret > 0`)
Read carefully whether the one calling `execlp()` or `exit()` is `ret == 0` or **`ret > 0`**:
```c
for (int i = 0; i < N; i++) {
    int ret = fork();
    if (ret > 0) execlp("compute", "compute", NULL); // PARENT mutates, CHILD continues the for!
}
while (waitpid(-1, NULL, 0) > 0);
```
* It does not create a fan, but a **linear chain** (`P0 -> P0.0 -> P0.0.0 -> ...`).
* The one reaching `waitpid` is **the last child** (which has **0 children**!), so `waitpid(-1, ...)` immediately returns `-1` (`ECHILD`). If instead of `waitpid` it had `while (procs > 0) sigsuspend(...)` waiting for `SIGCHLD`, it **hangs forever**.
* **Variant if `execlp` fails:** all unmutated processes keep iterating through the `for`, creating an exponential tree of size $2^N$.

### 2. Mandatory loop inside the `SIGCHLD` handler
Since the pending bitmap does not count repeated signals, if 3 children die almost simultaneously while `SIGCHLD` is blocked or being handled, the handler runs **only once**:
```c
void handle_sigchld(int s) {
    int st;
    while (waitpid(-1, &st, WNOHANG) > 0) { // Mandatory loop to avoid leaving zombies!
        living_children--;
    }
}
```

### 3. `SA_RESTART` vs `EINTR` on `waitpid` and `read`/`write`
If a caught signal arrives while the process is blocked in `waitpid()` or `read()`/`write()`:
* **With `sa_flags = 0`**: once the handler finishes, the syscall returns **`-1` with `errno == EINTR`**. Deadly trap: if you have `while (waitpid(-1, &st, 0) > 0);`, the `-1` exits the loop and leaves children as **zombies**!
* **With `sa_flags = SA_RESTART`**: the Kernel **automatically restarts** the slow syscall once the handler finishes.

### 4. Multiple `alarm()` calls and masks with `exec`
* **Single timer per process:** `for (i = 0; i < 32; i++) alarm(i);` only leaves the last alarm active (**31 seconds**).
* **`alarm()` is preserved after `exec`**, but if the mutated executable does not catch `SIGALRM`, it will die with `"Alarm clock"`. And watch out during mutations: after `fork()`, the child starts with **`alarm(0)`**!

---

## 7. Memory: physical frames, COW, `maps`, and Heap (Topic 5)

### Where each piece of data lives and the pointer trap

| C Code | Where does the variable live? | Where does the pointed data live? | If you do `p[0] = 5;`, does it break COW on the pointer's page? |
| :--- | :--- | :--- | :--- |
| `int v[10];` local / `int i;` | **Stack** (`[stack]`) | **Stack** (`[stack]`) | Yes (writes to the stack). |
| `int g = 1;` / `int *gp;` global | **Data** (`.data`/`.bss`) | `gp` in Data; `*gp` in Heap | **NO!** `gp[0] = 5` modifies the Heap; `gp`'s Data page remains shared via COW. |
| `int *p = sbrk(4096);` local | **Stack** (`[stack]`) | **Heap** (`[heap]`) | **NO!** Writes to the Heap; `p`'s value does not change. |
| `int *d = mmap(..., MAP_ANONYMOUS, ...);` | **Stack** (`[stack]`) | **`mmap` region** *(never in Heap!)* | **NO!** Writes to the `mmap` region. |

### The 4 rules for counting physical frames (4 KB pages)
1. **Strict isolation between regions:** Code, Data, Stack, Heap, and `mmap` **never share a physical frame** with each other (even if a global variable takes 4 B, it uses 1 full 4096 B frame $\Rightarrow 4092$ B of internal fragmentation).
2. **`ret = fork()` almost always breaks COW on the Stack:** upon returning from `fork()`, both parent and child write the `ret` value (and the loop counter `i`) to their *stack*, so the modified stack pages are duplicated immediately.
3. **`execlp()` destroys the COW space:** if the child mutates, it releases its inheritance from the parent and starts with a fresh space under *demand paging*.
4. **`mmap(..., MAP_SHARED | MAP_ANONYMOUS, -1, 0)` does not use COW:** parent and child write directly to the **same physical frames** (they are not duplicated!).

### How to read `/proc/[PID]/maps` in the exam
* **Neither `libc.so` nor any `.so` appears:** The binary was compiled **statically (`-static`)**. Advantage with *demand paging*: only the library pages actually executed are loaded into RAM.
* **`libc.so.6` and `ld-linux` appear:** **Dynamic** compilation; saves space **on disk** (smaller executables) and **in physical memory** (`r-xp` code is shared across all processes).
* **The `[heap]` line does not appear:** The process has not requested dynamic memory (`sbrk`/`malloc`) yet.
* **`sbrk(0)` alignment vs `maps`:** `sbrk(0)` returns the exact logical address (e.g., `0x883ed400`), whereas `maps` shows the physical limit rounded up to the next multiple of **4096 B** (`0x883ee000`).

### `sbrk(4096)` vs `malloc(4096)` and *Major Page Fault*
* **`p[4100]` out of bounds:** With `sbrk(4096)` it falls outside the assigned page $\Rightarrow$ the MMU has no translation $\Rightarrow$ **`SIGSEGV`**. With `malloc(4096)` it might **not fail** because `libc` over-allocates with `sbrk` and the page is still valid for the MMU.
* **MMU exception $\neq$ always `SIGSEGV`:** The MMU raises the exception and the Kernel checks the PCB. It only sends `SIGSEGV` if the access is illegal or lacks permissions; if it is COW or a *page fault*, it resolves it and **restarts the instruction**.
* **The 3 causes of a *Major Page Fault* in `*a = 1;`:** The page not in RAM could be **(1) code** (the instruction), **(2) data/stack** (where pointer `a` lives), or **(3) heap/stack** (where `*a` lives).

---

## 8. Kernel Tables (`TC`, `TFA`, `TI`) and Pipes (Topic 6)

*(Note: `TC` = Channel Table / PCB fd table, `TFA` = Open File Table, `TI` = Inode Table.)*

### Exact rules for tracking the 3 tables on each call

```text
TC (1 per process in PCB) ───> TFA / TFO (system-wide) ───> TI (system-wide)
[fd 0, 1, 2, ...]              [refs | mode | pos_rw | TI]  [refs | inode]
```

| Call | Effect on `TC` | Effect on `TFA` (Open File) | Effect on `TI` (Inodes) |
| :--- | :--- | :--- | :--- |
| **`open(f, flags)`** | Uses the **lowest free `fd`** | **Always creates a new entry** (`refs=1`, `pos=0`) | Creates entry (`refs=1`) or does **`refs++`** if already present |
| **`dup2(old, new)`** | `TC[new]` points to the same TFA as `old` *(closes `new` if needed)* | **`TFA.refs++`** | Unchanged |
| **`fork()`** | Child inherits **exact copy of `TC`** | **`TFA.refs++`** for each pointed channel | Unchanged |
| **`pipe(p)`** | Uses 2 channels (`p[0]` read, `p[1]` write) | Creates **2 entries** (`r` and `w`), with **`pos = '-'`** | Creates **1 temporary inode** with **`refs = 2`** |
| **`pthread_create()`** | **Does nothing** (all threads use the same `TC`) | **Does nothing** | **Does nothing** |
| **`close(fd)`** | Frees `TC[fd]` | `TFA.refs--`; if it reaches `0`, freed | If `TFA` is freed $\Rightarrow$ `TI.refs--` (and if 0, freed) |

* **`read`/`write` on file vs pipe:** on a regular file they modify `pos_rw` (`pos_le`) in `TFA` (and `write` may update size/blocks/timestamp in `TI`); on a pipe **`pos_rw` is `'-'` and does NOT change in `TFA`** *(exams usually consider that a `write` updates the access timestamp in `TI`)*.

### The 3 deadly traps of Pipes and FIFOs (Deadlocks and EOF)
1. **EOF never arrives (`read()` hangs forever):** After `fork()`, the parent or reader process forgot to close the write channel `p[1]`. As long as 1 write channel remains open in the system, the pipe **does not send EOF**.
2. **Opening a FIFO with `O_RDWR`:** The same process becomes both reader and **potential writer**! This prevents it from receiving EOF when the other process closes, or causes a writer-only process to block when the pipe fills up without receiving `SIGPIPE`.
3. **Opening a FIFO before `fork()`:** `open("fifo", O_RDONLY)` blocks until someone opens it with `O_WRONLY` (and vice versa). If you do this **before** creating the other process, the program blocks before calling `fork()`.
* **Concurrency vs determinism in pipes:** Multiple children writing simultaneously to the same pipe interleave bytes **non-deterministically**; a parent reading sequentially from two different pipes maintains deterministic order.

---

## 9. Physical File System (Inodes, Blocks, Links, and Buffer Cache)

When the exam asks for inode tables and disk data blocks or counting `open()` accesses:

1. **`#links` counter of a directory:** Always equals **`2 + number_of_subdirectories`** (the `.` entry inside it + its name in the parent directory + the `..` entry of each immediate child).
2. **Hard links vs Soft links:**
   * **Hard link (`ln`)**: same inode number (`#links++`). Forbidden on directories and across partitions.
   * **Soft link (`ln -s`)**: new inode of type `l` (`#links = 1`). If the path is short it is stored *inline* inside the inode (**`0` data blocks**); if it is long it takes **`1` data block**.
   * **`chmod` on a *soft link*:** Changes the permissions of the **target file**, never of the link itself!
3. **Path resolution + *Buffer Cache*:**
   * Each step in a path alternates `Directory Inode -> Directory Data Block`.
   * If while resolving a *soft link* its path starts with **`/` (absolute path)**, the Kernel restarts from the root inode `/` (`I0`). If there is a **Buffer Cache**, subsequent visits to `I0` and its block are **memory hits** (they do not touch disk).
4. **Block calculation, `lseek`, and real maximum size:**
   * Blocks occupied by a file: $\lceil \text{size} / \text{block\_size} \rceil$.
   * `lseek(fd, 0, SEEK_END)` **queries the inode** to read its size; `SEEK_SET`/`SEEK_CUR` only touch `TFA`.
   * **Maximum size trap:** Even if the inode pointers (direct + single/double/triple indirect) allow several TiB, if the `pos_rw` field in **`TFA`** is **32 bits (4 bytes)**, the real maximum size is limited to **$2^{32}$ bytes (4 GiB)**.
5. **`unlink` (`rm`) vs `close()`:**
   * `unlink` only modifies the parent directory block and does `#links--`. **It does not touch `TC`, `TFA`, or `TI`!**
   * Blocks and the inode are not freed until **`#links == 0` and `TI.refs == 0`** (if any process has it open, it can still read until it calls `close`).

---

## 10. Threads and Mutexes (Topic 7 — new in QP25-26)

* **ULT vs KLT (*Sw threads*):** With *User-Level Threads*, the Kernel only sees 1 process $\Rightarrow$ if a ULT makes a blocking call (`read`, `waitpid`), **it blocks the entire process**. With *Kernel-Level Threads* (Pthreads on Linux), each thread is scheduled and blocks independently.
* **`fork()` vs `pthread_create()` on `TC / TFA / TI`:** `fork()` duplicates `TC` and does `TFA.refs++`; **`pthread_create()` modifies nothing** in any of the three tables (all threads share the same `TC`; to read the same `fd` without overwriting `pos_rw`, use **`pread()`**).
* **Dying inside a mutex (*Deadlock*):** If a thread dies or calls `pthread_exit()` while holding a `pthread_mutex_lock` without having called `unlock`, **the mutex remains locked forever** and any other thread trying to enter it gets stuck indefinitely.
* **`exit()` vs `pthread_exit()`:** `exit()` kills **the entire process** (all threads); `pthread_exit()` terminates only the calling thread. In a multithreaded process, `fork()` only clones the calling thread into the child.

---

## 11. Quick guide for the Lab Final

In almost all recent exams, the structure and rubric of the Lab Final are fixed:
* **`Makefile` (0.5 pts):** Must build all programs at once (`all`), each one separately, have `clean` (leaving only `.c`/`.h`), and recompile **only if sources have changed**.
* **Error handling and `Usage()` (0.5 pts):** Validate arguments with `Usage()` (to `stderr`, fd `2`) and check `< 0` (or `MAP_FAILED`) return values of **all** system calls **except `write` to stdout**.
* **Critical rule in Exercise 1 (24-25 / 25-26):** Execution output is graded (**100% / 75% if non-OS error / 0% directly if there is any OS error**).

### 1. Multi-program `Makefile` and `Usage()` template
```makefile
all: prog1 prog2

prog1: prog1.c
	gcc -Wall -o prog1 prog1.c

prog2: prog2.c
	gcc -Wall -pthread -o prog2 prog2.c

clean:
	rm -f prog1 prog2 *.o
```
*(Important: lines under each rule must start with a **TAB**, never spaces.)*

```c
void Usage(char *name) {
    char b[128];
    int len = sprintf(b, "Usage: %s <arg1>\n", name);
    write(2, b, len);
    exit(1);
}
void error_y_exit(char *msg, int code) { perror(msg); exit(code); }
```

### 2. Safe Signal skeleton (no `sleep()` and no race conditions)
* **Typical prohibition:** `sleep()` is almost always forbidden. Replace it with **`alarm(sec)` + `sigsuspend(&mask)`** (passive wait) or `volatile sig_atomic_t` if explicit busy waiting is requested.
* **Single handler for multiple signals:** receives `int sig` and uses `switch (sig)` or `if (sig == SIGALRM) ...`.
* **Ignore `SIGPIPE` and detect `EPIPE`:**
  ```c
  struct sigaction sa = {0};
  sa.sa_handler = SIG_IGN;
  sigaction(SIGPIPE, &sa, NULL);
  // Later on write to pipe with no readers:
  if (write(fd, &val, sizeof(int)) == -1) {
      if (errno == EPIPE) break; // All readers closed
      error_y_exit("write pipe", 2);
  }
  ```
* **Protect `read()` from `EINTR` (when `Ctrl+C` / `SIGALRM` occur):**
  ```c
  while ((n = read(0, buf, sizeof(buf))) == -1 && errno == EINTR);
  ```

### 3. Binary I/O, `lseek`, pipes/FIFOs, and redirections
* **Writing/reading integers in binary and random access:**
  ```c
  int v = 42;
  write(fd, &v, sizeof(int));                  // Binary write (verifiable with xxd / hexdump)
  off_t bytes = lseek(fd, 0, SEEK_END);        // Total size -> elements = bytes / sizeof(int)
  lseek(fd, idx * sizeof(int), SEEK_SET);      // Direct jump to element 'idx'
  ```
* **Creating and truncating a file:** `open(name, O_WRONLY | O_CREAT | O_TRUNC, 0640)` *(check octal permissions in the prompt: `0600` = `rw-------`, `0640` = `rw-r-----`, `0644` = `rw-r--r--`, `0660` = `rw-rw----`)*.
* **Redirection to any channel (`1`, `4`, `10`):** `dup2(fd, 10); close(fd);` (from bash: `./prog 10> out.bin`).
* **FIFO in C tolerant if it already exists:**
  ```c
  if (mkfifo("MIPIPE", 0660) == -1 && errno != EEXIST) error_y_exit("mkfifo", 2);
  ```
* **Unnamed pipes:** **always** close unused `p[0]` and `p[1]` in parent and children right after `dup2` and before `exec`/`waitpid`.

### 4. Dynamic memory (`malloc`/`realloc`/`mmap`) and Pthreads in the Lab
* **Private anonymous `mmap` vs `malloc`:**
  ```c
  int *buf = mmap(NULL, n * sizeof(int), PROT_READ | PROT_WRITE,
                  MAP_PRIVATE | MAP_ANONYMOUS, -1, 0);
  if (buf == MAP_FAILED) error_y_exit("mmap", 2);
  // ... read / write with buf ...
  if (munmap(buf, n * sizeof(int)) == -1) error_y_exit("munmap", 2);
  ```
* **Resizing without `realloc` (when forbidden):** allocate a new array with `malloc(new_size)`, copy with a `for` loop, and `free(old)`.
* **Pthreads + `pread` + heap-allocated argument:**
  ```c
  int *id = malloc(sizeof(int)); *id = i; // Each thread gets its own pointer (then calls free(arg))
  pthread_create(&th[i], NULL, worker, id);
  // Inside worker(): use pread(fd, &c, 1, offset) and accumulate in a local variable before pthread_mutex_lock!
  ```

---

## Frequently asked questions and model answers for the Final

1. **Why does the output of an array/variable not change in the parent?**  
   *"Because parent and child have completely independent logical address spaces; memory modifications in the child are never visible to the parent."*
2. **Why does signal handling fail after an `execlp`?**  
   *"Because the `exec` mutation destroys the code in the address space and resets all caught handlers to the default action (`SIG_DFL`)."*
3. **Why does this `waitpid` loop perform $N+1$ iterations?**  
   *"Because it performs $N$ iterations to reap each of the $N$ zombie children and one final iteration that returns `-1` (`ECHILD`) when no children remain."*
4. **Why does `sigsuspend` receive the signal without losing it?**  
   *"Because the signal was previously blocked before the fork, keeping it pending, and `sigsuspend` atomically replaces the mask and suspends the process."*
5. **Why does `p[0] = 5;` not break COW on the page where `p` lives?**  
   *"Because `p[0] = 5` modifies the memory block in the Heap (or `mmap`), not the value of the pointer variable `p` (in the Stack or Data), so the pointer's page remains unwritten and shared via COW."*
6. **Why does `maps` not show `libc.so` and how does *demand paging* help?**  
   *"The binary was compiled statically (`-static`). Thanks to *demand paging*, the Kernel only loads into RAM the library code pages that are actually executed, saving physical memory and startup time."*
7. **Why does this program block when reading from a pipe/FIFO?**  
   *"Either the parent/reader did not close the write descriptor, or the FIFO was opened with `O_RDWR`, so the Kernel detects a live writer and `read()` blocks indefinitely without ever receiving EOF."*
8. **What is the difference in `TC/TFA/TI` between `fork()` and `pthread_create()`?**  
   *"`fork()` duplicates the parent's `TC` and increments the `refs` of the pointed `TFA` entries (without touching `TI`); in contrast, `pthread_create()` adds or modifies nothing in any of the three tables because all threads share the same process `TC`."*
9. **What happens if one of two *Sw threads* dies inside a critical section protected by a `pthread_mutex`?**  
   *"The mutex remains locked and is not automatically released when the thread dies, so the other thread will block indefinitely when trying to call `pthread_mutex_lock()`."*
