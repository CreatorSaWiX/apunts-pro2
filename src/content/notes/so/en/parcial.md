---
title: "OS Midterm"
description: "Key theory summary for the Operating Systems midterm exam."
readTime: "25 min"
order: 5
draft: false
isNew: true
---

## 1. OS Architecture, CPU Modes, and Kernel Transitions

### CPU Modes: User vs. Kernel
The CPU maintains an internal bit in its Program Status Word (PSW) indicating the active privilege level:
* **User Mode**: Application code executes with restricted privileges. It can only access its own logical memory address space and non-privileged instructions. Direct hardware access is forbidden.
* **Kernel Mode (Privileged)**: The operating system has unrestricted access to physical memory, CPU control registers, and privileged instructions.
* **Why cannot user applications call kernel functions directly?**
  1. Kernel code resides outside the application's logical address space (unmapped and inaccessible).
  2. Kernel functions execute privileged CPU instructions prohibited in user mode.

### How Do We Enter the Kernel?
There are only **3 entry mechanisms**. Kernel code remains dormant unless triggered by one of these:

| Mechanism | Voluntary / Involuntary | Synchronous / Asynchronous | Trigger |
| :--- | :---: | :---: | :--- |
| **Hardware Interrupt** | Involuntary | **Asynchronous** | External hardware: periodic timer tick (every ~10 ms), keyboard stroke, network packet. |
| **Software Exception** | Involuntary | **Synchronous** | CPU fault encountered while executing an instruction: division by zero, invalid memory access (*SegFault*), page fault. |
| **System Call (*trap*)** | **Voluntary** | **Synchronous** | User application explicitly requests an OS service (`write`, `fork`, `sigsuspend`). |

### Why Is the System Library (`libc`) Hardware-Dependent and Non-Portable?
Because `libc` wraps raw system calls by executing processor-specific assembly instructions to trigger mode switching (`syscall` on x86_64, `svc` on ARM) and places arguments into designated machine registers defined by the architecture's ABI. A `libc` binary built for ARM cannot run on x86.

### Shell Commands: Built-in vs. External
* **Built-in (e.g., `cd`, `exit`)**: Executes directly inside the shell process. **No new child process is spawned**.
* **External (e.g., `ls`, `ps`)**: The shell forks a new child process with `fork()` and replaces its memory space with `execlp()`.

### Low-Level Terminal Output (`sprintf` + `write`)
Operating systems courses avoid `printf` due to user-space buffering. Direct output uses `write` targeting file descriptor 1 (`stdout`):
```c
char buf[80];
int len = sprintf(buf, "Hello from PID %d\n", getpid());
write(1, buf, len);
```

---

## 2. Process Management (PCB, Lifecycle, and System Calls)

### The PCB (*Process Control Block*)
The kernel data structure allocated per active process, tracking: PID, PPID, process state, saved CPU register context, virtual memory mappings, open file descriptor table (`fd`), 4 signal handling structures, and CPU accounting stats.

### Process Lifecycle and State Transitions
* **`RUN`**: Currently executing instructions on a physical CPU core.
* **`READY`**: Ready to execute, waiting in the run queue for CPU dispatch.
* **`BLOCKED`**: Suspended waiting for an external event (I/O completion, child termination, signal delivery). **Consumes 0% CPU**.
* **`STOPPED`**: Frozen via `SIGSTOP` or `Ctrl+Z`. Only resumes upon receiving `SIGCONT`.
* **`ZOMBIE`**: Terminated via `exit()`. RAM and descriptors are freed, but the PCB persists in the kernel to preserve the exit status until reaped by the parent via `waitpid()`.

*Can the timer interrupt force a process into `BLOCKED`?*  
**No.** Transitioning to `BLOCKED` is **strictly voluntary**, triggered only when the process executes a blocking system call. The timer tick can only transition a process from `RUN` to `READY` (upon quantum expiration).

---

### What Is Inherited Across `fork()` and What Changes on `exec()`? (Essential)

| PCB Attribute | After `fork()` (Child) | After `exec()` (Mutation) |
| :--- | :--- | :--- |
| **PID** | **Brand new unique PID** | **Remains identical** |
| **PPID** | Assigned parent's PID | **Remains identical** |
| **Memory space** | Cloned copy (*copy-on-write*) | **Destroyed** and loaded with new binary |
| **Open descriptors (`fd`)**| Inherited (shared file table entries)| Preserved (unless flagged `FD_CLOEXEC`) |
| **Signal mask** | **Inherited identically** | **Preserved identically** |
| **Pending signals** | **Cleared (starts at 0)** | **Preserved** (pending signals remain) |
| **Signal handlers** | **Inherited identically** | **Caught signals reset to `SIG_DFL`**; `SIG_IGN` preserved |
| **Timer `alarm()`** | **Cleared (no active timer)** | **Preserved** (remaining countdown ticks) |
| **CPU execution time** | **Reset to 0** | Preserved (accumulated usage retained) |

---

### Lifecycle System Calls

### 1. Cloning a Process: `fork()`
Duplicates the caller into a new child process:
```c
int pid = fork();
if (pid < 0) {
    perror("Fork failed");
    exit(1);
} else if (pid == 0) {
    // Child process only (fork returns 0)
    exit(0);
} else {
    // Parent process only (fork returns child's PID)
}
```

* **Memory Isolation:** Parent and child **do not share memory**. Modifications made by the child remain invisible to the parent:
```c
int global = 100;
if (fork() == 0) {
    global = 200; // Mutates only inside the child's private address space
    exit(0);
}
waitpid(-1, NULL, 0);
// In the parent, global still evaluates to 100!
```

### 2. Mutating a Process: `execlp()`
Overwrites the caller's virtual address space with a new executable while preserving the same PID. Returns only on failure (`-1`). Must terminate with sentinel `(char *)NULL`:
```c
execlp("./program", "program", "arg1", (char *)NULL);
// Reached only if execlp fails:
perror("Execution failed");
exit(1);
```

### 3. Terminating a Process: `exit(status)`
Releases user RAM, closes descriptors, and moves the process to **`ZOMBIE`** state while recording `status` in the PCB. Never returns.

### 4. Reaping Children and Releasing PCB: `waitpid()`
Blocks until a child terminates, inspects its termination cause, and **deallocates its PCB from the kernel**:
```c
int status;
int pid_child = waitpid(-1, &status, 0); // -1 = any child, 0 = blocking wait

if (WIFEXITED(status)) {
    // Normal termination via exit(code) or return
    int exit_code = WEXITSTATUS(status);
} else if (WIFSIGNALED(status)) {
    // Killed abnormally by an uncaught signal
    int term_sig = WTERMSIG(status);
}
```

* **Options Flag Semantics:**
  * `options = 0` (blocking): Suspends caller in `BLOCKED` if children are alive. If a zombie child exists, reaps it immediately. If the process **has no children**, returns `-1` immediately (`ECHILD`).
  * `options = WNOHANG` (non-blocking): If children are alive but none are zombies, **returns `0` immediately**.
  * **Trap Warning:** `while(waitpid(-1, NULL, WNOHANG) >= 0);` over running children causes **busy waiting / polling** (burns 100% CPU executing thousands of redundant system calls per second).
* **How many calls does a cleanup loop execute?**
```c
// Executes exactly N_children + 1 calls (N reaping calls + 1 returning -1)
while (waitpid(-1, NULL, 0) > 0);
```

### Orphan and Zombie Processes
* If a parent terminates before its children, the children become **orphans** and are automatically adopted by `init` / `systemd` (PID 1).
* **Can an orphan remain a Zombie permanently?** **No.** PID 1 regularly invokes `waitpid()` to clean up and deallocate any adopted process upon death.

---

## 3. Process Hierarchies and Concurrency

### Sequential vs. Concurrent Execution
Defines when the parent waits for its children relative to when it spawns them.

### Sequential Pattern
The parent spawns one child and blocks until it terminates before spawning the next. The `waitpid()` call sits **inside** the loop:
```c
for (i = 0; i < N; i++) {
    ret = fork();
    if (ret == 0) {
        // Child logic
        exit(0);
    }
    waitpid(-1, NULL, 0); // Waits for current child before creating the next
}
```
* At most one child is alive at any instant (plus the parent).
* **Maximum concurrency degree = 2** (parent + 1 child).
* Execution order is strictly **deterministic**: child 0, then child 1, etc.

### Concurrent Pattern
The parent spawns all children upfront and reaps them afterwards. The `waitpid()` call sits **outside** the creation loop:
```c
for (i = 0; i < N; i++) {
    ret = fork();
    if (ret == 0) {
        // Child logic
        exit(0);
    }
}
while (waitpid(-1, NULL, 0) > 0); // Waits for all children after the loop
```
* All children execute concurrently in parallel.
* **Maximum concurrency degree = N + 1** (parent + N children).
* Termination and execution order is **non-deterministic**: governed by the OS scheduler.

---

### Process Tree Patterns

### 1. Fan Tree (Star Pattern)
A single parent spawns $N$ direct children that each terminate via `exit()`:
```c
for (i = 0; i < 3; i++) {
    if (fork() == 0) {
        exit(0); // Child terminates immediately
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

### 2. Cascade Tree (Mutation Chain)
Each child mutates into the same binary passing a decremented argument:
```c
// Run command: ./prog 3
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

### 3. Binary Recursive Tree (`arbol.c` pattern)
Each process with remaining levels $> 0$ forks twice, with children mutating at `levels - 1`:
```c
if (nivells > 0) {
    ret = fork();
    if (ret > 0) {
        ret = fork(); // Parent forks a second time
    }
    if (ret == 0) {
        nivells--;
        sprintf(buf, "%d", nivells);
        execlp("./arbol", "arbol", buf, (char *)NULL);
    }
}
```
* Total processes spawned: $2^{\text{levels} + 1} - 1$. For levels = 3: $1 + 2 + 4 + 8 = 15$ processes.

---

## 4. Signal Management

Signals provide asynchronous notifications sent by the kernel or peer processes.

### The 4 Signal Structures in the PCB
When delivering a signal, the kernel checks these structures in order:
1. **Signal Block Mask (`sigset_t`)**: Set of temporarily blocked signals. If blocked, the signal cannot interrupt the process right now.
2. **Pending Signal Bitmap**: Bit vector recording blocked signals awaiting delivery. **Signals do not queue**: receiving 5 identical signals while blocked results in only **1 delivery** upon unblocking.
3. **Signal Action Table (Handlers)**: Action taken upon delivery:
   * `SIG_DFL`: Default OS action (terminate, dump core, freeze, or ignore).
   * `SIG_IGN`: Discard the signal silently.
   * User function: Jumps into the user-defined C handler.
4. **Alarm Timer**: Kernel countdown timer. Upon reaching 0, the kernel generates `SIGALRM`. Only 1 alarm timer per process.

### Key Signals Reference Table

| Signal | Number | Default Action | Catchable / Blockable? |
| :--- | :---: | :---: | :---: |
| **`SIGKILL`** | 9 | Immediate unconditional termination | **Never (unstoppable)** |
| **`SIGSTOP`** | 19 | Freeze execution (`STOPPED`) | **Never (unstoppable)** |
| **`SIGCONT`** | 18 | Unfreeze stopped process | Yes |
| **`SIGALRM`** | 14 | Terminate process | Yes |
| **`SIGCHLD`** | 17 | **Ignore (no action)** | Yes |
| **`SIGINT`** | 2 | Terminate process (`Ctrl+C`) | Yes |
| **`SIGUSR1` / `SIGUSR2`** | 10 / 12 | Terminate process | Yes |

---

### Signal System Calls

### 1. Sending a Signal: `kill(pid, signal)`
Transmits any signal to a process (not just for termination):
```c
kill(pid, SIGSTOP); // Pauses the process (moves to STOPPED)
kill(pid, SIGCONT); // Resumes a paused process
kill(pid, SIGKILL); // Forces immediate termination
kill(pid, SIGUSR1); // Sends user-defined signal
```

### 2. Configuring Signal Handlers: `sigaction()`
```c
void signal_handler(int s) {
    char msg[64];
    int len = sprintf(msg, "Received signal %d\n", s);
    write(1, msg, len);
}

// In main:
struct sigaction sa;
sa.sa_handler = signal_handler;     // Function to invoke
sigemptyset(&sa.sa_mask);            // Signals blocked ONLY while handler runs
sa.sa_flags = 0;
sigaction(SIGUSR1, &sa, NULL);       // Attach SIGUSR1
```

* **Key `sa_flags` Options:**
  * `sa.sa_flags = SA_RESETHAND;`: Handler runs once, then automatically reverts to `SIG_DFL`.
  * `sa.sa_flags = SA_RESTART;`: Automatically restarts interrupted slow system calls (`read`, `waitpid`) instead of failing with `EINTR`.
* **The `sa.sa_mask` Field:** Mask added **exclusively during handler execution**. Upon returning from the handler, the original process mask is restored automatically:
```c
sigaddset(&sa.sa_mask, SIGUSR2); // SIGUSR2 is blocked while signal_handler runs
```

### 3. Modifying the Block Mask: `sigprocmask()`
```c
sigset_t mask, oldmask;
sigemptyset(&mask);
sigaddset(&mask, SIGALRM);
sigaddset(&mask, SIGCHLD);

// 1. Block SIGALRM and SIGCHLD (adds them to current mask):
sigprocmask(SIG_BLOCK, &mask, &oldmask);

// 2. Unblock:
sigprocmask(SIG_UNBLOCK, &mask, NULL);

// 3. Restore previous mask saved in oldmask:
sigprocmask(SIG_SETMASK, &oldmask, NULL);
```

### 4. Safely Awaiting Signals: `sigsuspend()`
**Atomically** swaps the caller's mask with `mask` and transitions the process to **`BLOCKED`** until an unmasked signal arrives:
```c
sigsuspend(&mask); // Always returns -1 (errno = EINTR)
```
* After the handler finishes, `sigsuspend` **automatically restores the mask that was active beforehand**.
* **Which signals always unblock `sigsuspend`?** Only `SIGKILL` and `SIGSTOP` (since they can never be blocked).

### 5. Scheduling Timers: `alarm(seconds)`
Schedules `SIGALRM` delivery in $N$ seconds without blocking execution:
```c
alarm(5); // SIGALRM arrives in 5 seconds

// Cancel alarm and read remaining time:
int remaining = alarm(0);         // alarm(0) cancels and returns unexpired seconds
int elapsed = 5 - remaining;      // Calculates child execution duration
```

---

### Race Conditions

Awaiting signals with `sigsuspend` while preventing race conditions.  
If a parent must await a child's signal (`SIGUSR1`), **the signal must be blocked before `fork()`**:
```c
sigset_t mask, wait_mask;
int received = 0;

void handler_usr1(int s) {
    received = 1;
}

// 1. Block BEFORE fork: guarantees no signal loss even if child runs instantly
sigfillset(&mask);
sigprocmask(SIG_BLOCK, &mask, NULL);

// Configure handler
struct sigaction sa;
sa.sa_handler = handler_usr1;
sigemptyset(&sa.sa_mask);
sa.sa_flags = 0;
sigaction(SIGUSR1, &sa, NULL);

if (fork() == 0) {
    // Child finishes fast work and notifies parent
    kill(getppid(), SIGUSR1);
    exit(0);
}

// 2. Prepare sigsuspend mask: block everything EXCEPT SIGUSR1
sigfillset(&wait_mask);
sigdelset(&wait_mask, SIGUSR1);

// 3. Passive wait (0% CPU): atomically unblocks and sleeps
while (!received) {
    sigsuspend(&wait_mask);
}
```
* **Why is unblocked `fork()` a bug?**  
  If the child delivers `SIGUSR1` before the parent enters `sigsuspend()`, the signal is processed prematurely. When the parent finally reaches `sigsuspend()`, **it remains stuck sleeping indefinitely**.

### Who Prints Messages Like `"Alarm clock"` or `"User defined signal 1"`?
Printed by **the shell**, not the process. The shell awaits termination via `waitpid()` and, upon detecting abnormal death via `WIFSIGNALED(status)`, outputs the default signal description.

---

## 5. CPU Scheduling

* **Non-Preemptive (Cooperative) Scheduling:** The process relinquishes the CPU only by its own action: calling `exit()`, making a blocking system call (`read`, `waitpid`), or being killed by a signal.
* **Preemptive Scheduling:** The kernel forcibly revokes CPU access upon quantum expiration (timer interrupt) or when a higher-priority process becomes `READY`.

### Round Robin (RR)
FIFO queue with a fixed time quantum:
* *With 3 processes and a 10 ms quantum, can a process be scheduled twice in under 30 ms?*  
  **Yes.** If other processes block on I/O or wait calls before consuming their full 10 ms, they yield the CPU early, immediately advancing the round.

### Completely Fair Scheduler (Linux CFS)
Orders processes by `vruntime` (virtual runtime). Prioritizes interactive / I/O-bound tasks because they sleep frequently, accumulating minimal `vruntime` and gaining immediate CPU preemption upon waking.

---

## Frequently Asked Midterm Exam Questions

Model justifications for full points:

1. **Why does an array/variable modified by a child remain unchanged in the parent?**  
   *"Because parent and child operate in completely isolated virtual address spaces; memory mutations in the child are never visible to the parent."*
2. **Why does a custom signal handler stop working after `execlp`?**  
   *"Because `exec` replaces the process address space with a new executable, resetting all user-defined signal handlers back to their default action (`SIG_DFL`)."*
3. **Why does this `waitpid` cleanup loop execute $N+1$ times?**  
   *"Because it executes $N$ iterations to reap each of the $N$ zombie children, plus one final iteration returning `-1` (`ECHILD`) once no children remain."*
4. **Why does `sigsuspend` receive the signal reliably without race conditions?**  
   *"Because the signal was blocked prior to fork, ensuring it remains pending, and `sigsuspend` atomically swaps the mask and halts the process."*

