---
title: "Topic 3: Processes"
description: "Processes"
readTime: "25 min"
order: 3
draft: false
---

## 3.1 What is a Process?

When you double-click an executable application or run a command in the terminal, the operating system instantiates a process (a program actively loaded and running in memory). Every process receives a system-wide unique identifier (an integer token) called the PID (Process Identifier).

:::procoverviewviz
:::

### 1. Identity, Environment, and Context
Every executing process maintains:
* **Unique Identifiers**:
  * **PID (*Process ID*)**: Unique system-level integer ID of the process. Queried in C via `getpid()` (`man 2 getpid`).
  * **PPID (*Parent PID*)**: PID of the creator parent process. Queried in C via `getppid()` (`man 2 getppid`).
* **Access Credentials**: `UID` (user) and `GID` (group), determining filesystem read/write privileges and inter-process signal permissions.
* **Environment**: Invocation command-line argument vector (`argv`) and inherited environment variables (`HOME`, `PATH`...).
* **Execution Context**: The exact state of CPU registers, the instruction pointer (*Program Counter*), stack pointers, and assigned virtual memory address space.

### 2. Process Inspection from the Terminal
Active processes and their states can be examined using standard Linux command utilities:

:::shellviz{command="ps -ef" suggestions="ps -ef,ps -l,pstree,man ps" title="Terminal — Inspecting active processes (PID, PPID, and process hierarchy)"}
:::

* **`ps -ef`** or **`ps aux`**: Formats a complete listing of active processes, showing user identity (`UID`), `PID`, `PPID`, resource consumption, and start commands.
* **`pstree`**: Renders the complete hierarchical tree of processes, highlighting `systemd` or `init` (PID 1) as the universal root ancestor.

### 3. The PCB (*Process Control Block*)
The **PCB** is the central kernel descriptor structure allocated in kernel memory for every live process. When the scheduler suspends a process to grant CPU time to another task, the kernel saves its complete execution context inside this structure:

* **Identification**: PID, PPID, and credential tokens (`UID`, `GID`).
* **State**: Current scheduling status (executing, runnable in queue, blocked/sleeping, or zombie).
* **CPU Context (Registers)**: Hardware register states, stack pointer (*Stack Pointer*), and instruction pointer (*Program Counter*).
* **Virtual Address Space**: Assigned virtual memory regions (text/code segment, initialized data, BSS, heap, and call stack).
* **Open File Descriptors**: File descriptor array (`fd = 0` for stdin, `fd = 1` for stdout, `fd = 2` for stderr, open file streams, and IPC pipes).
* **Signal Subsystems**: Handler function tables, pending signal bitmask, blocked signal mask, and timer alarms (detailed in [Topic 4: Signals](./tema-4)).
* **Accounting Information**: Accumulated CPU runtime, execution statistics, and process limits.

:::shellviz{command="cat /proc/self/status" suggestions="cat /proc/self/status,ls /proc,ls -l /proc/self,ls -l /proc/self/fd" title="Terminal — Inspecting the kernel PCB representation (/proc and /proc/self)"}
:::

---

## 3.2 Process Lifecycle and System Calls

A process does not monopolize CPU execution indefinitely; it transitions through multiple operational states throughout its lifetime. This cycle is orchestrated by the kernel scheduler alongside explicit system calls invoked in source code:

:::processviz
:::

| Call | `man` Section | Return Value | Exact Functionality |
| :--- | :---: | :--- | :--- |
| **`fork()`** | `man 2` | `0` to child, `child_PID` to parent, `-1` on error | Clones current process, creating a new child (instantiated in READY, moves to RUN). |
| **`execlp(file, a0, ...)`** | `man 3` | Returns only on failure (`-1`) | Mutates process: replaces address space with a new program image (retains original PID). |
| **`exit(status)`** | `man 3` | Never returns | Terminates process, frees RAM mappings, and transitions to ZOMBIE state. |
| **`waitpid(pid, &st, opts)`**| `man 2` | Terminated child PID | Blocks parent until child terminates and reaps child's PCB from the kernel. |

---

### 1. Process Creation: Cloning with `fork()` (READY $\rightarrow$ RUN)
When `fork()` is called, the kernel creates an **exact duplicate** of the calling process (the parent). The new process (the child) is placed into the **READY** state awaiting its CPU scheduling quantum to transition to **RUN**:

:::forkviz
:::

```c
int g = 10;
int main() {
    int l = 5;
    int pid = fork();
    if (pid == 0) {
        // Child-exclusive code: operates on an isolated memory copy!
        g++; l += 2;
        exit(0);
    }
    waitpid(pid, NULL, 0);
    // Parent code: its local and global variables remain untouched! g = 10 and l = 5.
    return 0;
}
```

| Inherited (Identical Duplicate) | NOT Inherited (New / Reset Value) |
| :--- | :--- |
| **Variables and RAM Memory** (independent private address space) | **PID** (unique new integer identifier assigned to child) |
| **Open File Descriptors** (`fd` 0, 1, 2, open pipes, seek offsets) | **PPID** (assigned the parent's PID) |
| **Signal Action Table** (installed signal handlers) | **Pending Signals** (cleared; child starts with zero pending signals) |
| **Signal Block Mask** (temporarily blocked signal set) | **Alarm Timer** (interval timers and alarms reset) |
| **Credentials & Environment** (`UID`, `GID`, and `environ` variables) | **CPU Time Accounting** (execution statistics reset to 0) |

* **If children DO NOT call `exit()`**: Each loop iteration exponentially doubles all active processes:
  ```c
  for (int i = 0; i < N; i++) fork();
  ```
  * Total surviving processes: **$2^N$**. For $N = 3 \rightarrow 2^3 = 8$ processes.
  * Newly spawned children: **$2^N - 1$** ($8 - 1 = 7$).
* **If children call `exit(0)`**: Only the parent continues executing the loop:
  ```c
  for (int i = 0; i < N; i++) {
      if (fork() == 0) {
          doWork();
          exit(0); // Child terminates immediately and does not fork further!
      }
  }
  ```
  * Exactly **$N$ children** are created in a fan-out topology (Total: **$N + 1$ processes**).

---

### 2. Process Mutation: Program Replacement with `execlp()`

`execlp()` does not create a new process: it completely discards the current process's address space and loads a new executable starting from its `main`. The existing PID is preserved.

:::execviz
:::

```c
// Syntax: execlp(program, arg0, arg1, ..., (char *)NULL);
execlp("ls", "ls", "-l", (char *)NULL);

// Executed strictly if execlp encounters a failure (e.g., binary not found):
perror("Error in execlp");
exit(1);
```

* **`"ls"` (program)**: The `p` variant automatically searches directories in the `$PATH`.
* **`"ls"` (`arg0`)**: By standard convention, matches the program binary name (`argv[0]`).
* **`"-l"` (`arg1...`)**: User arguments passed to the program.
* **`(char *)NULL`**: Mandatory sentinel marking the end of the argument vector.

State modifications during `execlp()`:

| Preserved (Unchanged) | Altered (Replaced / Reset) |
| :--- | :--- |
| **PID and PPID** (retains original process identity) | **Address Space (RAM)** (cleared; new binary image loaded) |
| **File Descriptors** (open `fd` handles and pipes persist) | **CPU Registers** (reset to start at the new program's `main`) |
| **Blocked Signal Mask** | **Signal Handlers** (user handlers revert to `SIG_DFL`) |
| **Pending Signals** | **Stack and Heap** (reallocated with new arguments and environment) |

---

### 3. Process Suspension (RUN $\rightarrow$ BLOCKED)
The **BLOCKED (Sleeping / Waiting)** state occurs when a process cannot make forward progress because it requires an external asynchronous completion. **While blocked, a process consumes zero CPU time.**

:::blockedviz
:::

System calls inducing a transition from RUN to BLOCKED:
* `waitpid(pid, &st, 0)`: blocks the parent until the targeted child terminates.
* `read(0, buf, size)`: blocks waiting for input characters if the stdin buffer is empty.

---

### 4. Process Termination and Reaping: `exit()`, ZOMBIE State, and `waitpid()`
When a process finishes via `exit(status)` or returning from `main`:
1. The kernel releases its mapped virtual memory and closes its file descriptors.
2. The process enters the **ZOMBIE** state: its descriptor (PCB) remains in the kernel process table retaining its termination status code until the parent harvests it with `waitpid()`.

:::zombieviz
:::

### Synchronization with `waitpid()` and Exit Status Inspection
The parent invokes `waitpid()` to suspend execution until a child completes, retrieving its exit status in `status` and **permanently removing its PCB from kernel memory**:

```c
int status;
int child_pid = waitpid(pid, &status, options);
```

* **`pid`**: Concrete child PID to wait for, or `-1` to wait for whichever child terminates first.
* **`&status`**: Pointer to integer where the kernel encodes termination details.
* **`options`**: `0` for blocking wait, or `WNOHANG` for non-blocking poll (returns `0` immediately if no child has exited).

The `status` bitmask encodes exit diagnostics inspected via standard POSIX macros:

| Macro | Check / Value Extracted |
| :--- | :--- |
| **`WIFEXITED(status)`** | Evaluates to true if the child terminated normally (`exit()` or `return`). |
| **`WEXITSTATUS(status)`** | Extracts the 8-bit return code passed to `exit()` (e.g., `0`, `1`...). |
| **`WIFSIGNALED(status)`** | Evaluates to true if the child was terminated prematurely by an unhandled signal. |
| **`WTERMSIG(status)`** | Extracts the numeric signal identifier that caused the process termination. |

Practical exit diagnostic snippet:

```c
#include <sys/wait.h>

int status;
int child_pid = waitpid(-1, &status, 0); // Await any terminating child

if (WIFEXITED(status)) {
    int code = WEXITSTATUS(status);
    sprintf(buf, "Child %d exited normally with code %d\n", child_pid, code);
    write(1, buf, strlen(buf));
} else if (WIFSIGNALED(status)) {
    int signum = WTERMSIG(status);
    sprintf(buf, "Child %d killed by signal %d\n", child_pid, signum);
    write(1, buf, strlen(buf));
}
```

:::oopviz{simulation="waitpid_diagnosi"}
:::

### What happens if a process is orphaned? Can it remain Zombie indefinitely?
**NO**. On Linux, when a parent process terminates, its orphan children are immediately adopted by `systemd` or `init` (PID 1). This root process runs continuous reaping routines (`waitpid()`), immediately cleaning up PCBs of terminated orphans.

---

### 5. Process Freezing: The STOPPED State
The **STOPPED** state occurs when a process is intentionally paused by external signal intervention:
* From the interactive terminal: pressing **`Ctrl+Z`** or executing `kill -STOP <PID>`.
* In C source code: invoking `kill(pid, SIGSTOP)`.
* **Resuming execution**: The process remains suspended consuming zero CPU until receipt of a resume signal: `kill -CONT <PID>` or `kill(pid, SIGCONT)`.

:::stoppedviz
:::

---

## 3.3 Sequential vs Concurrent Execution

Orchestrating `fork()` and `waitpid()` patterns yields two primary multiprocessing models:

```c
// 1. SEQUENTIAL PATTERN: One process after another
// The parent spawns a single child and WAITS for its completion before spawning the next
for (int i = 0; i < N; i++) {
    if ((pid = fork()) == 0) {
        doWork(i);
        exit(0);
    }
    waitpid(pid, NULL, 0); // Blocks INSIDE the loop iteration!
}
```

```c
// 2. CONCURRENT PATTERN: Parallel execution
// The parent spawns all children immediately, deferring reaping until all are launched
for (int i = 0; i < N; i++) {
    if ((pid = fork()) == 0) {
        doWork(i);
        exit(0);
    }
    // Does NOT wait here! Continues spawning sibling processes
}
// Once all workers are active, the parent reaps all children:
while (waitpid(-1, NULL, 0) > 0);
```

### Shell Command Execution: Foreground vs Background (`&`)

When entering commands into an interactive Shell (`bash`, `zsh`), the shell executes an internal loop combining `fork()`, `exec()`, and `waitpid()`:

```c
while (1) {
    command = read_command();
    int pid = fork();
    if (pid == 0) {
        execlp(command, command, ..., NULL); // Execute target program
    }
    // If running in FOREGROUND:
    waitpid(pid, &status, 0); // Shell blocks until child completes
}
```

* **Foreground (*Foreground*, `./program`)**: The shell blocks via `waitpid()`. Because the shell process is suspended in `BLOCKED`, the terminal keyboard stream is monopolized by the child. To interact with the system, the user must wait or open another terminal window.
* **Background (*Background*, `./program &`)**: By appending the `&` operator, the shell launches the child without invoking a blocking `waitpid()`. The interactive prompt is returned immediately displaying the job number and child PID (e.g., `[1] 20226`), allowing concurrent command execution while the background task runs.

---

## 3.4 Context Switching and CPU Scheduling

How does an operating system maintain the illusion of simultaneous execution for dozens of processes on a shared CPU core?

### 1. The Context Switch (*context switch*)

:::contextswitchviz
:::

When the CPU transitions execution from process A to process B, the kernel performs a **context switch**:
1. The CPU transitions into **Kernel mode** triggered by a timer interrupt or a blocking system call.
2. The kernel saves hardware registers for process A into its descriptor structure (`PCB[A]`).
3. The kernel transitions process A's status flag to `READY` or `BLOCKED`.
4. The **scheduler (*scheduler*)** chooses the next candidate process to dispatch (e.g., process B).
5. The kernel adjusts active page directory mappings to process B's virtual address space and restores saved registers from `PCB[B]` into the physical CPU.
6. The CPU switches back to **User mode**, resuming execution of process B at its saved instruction pointer.

During a context switch, the CPU performs purely internal kernel bookkeeping; **no user program code advances**. This represents unavoidable administrative overhead that must be minimized.

### 2. CPU Scheduling (*scheduling*)

:::schedulerviz
:::

The **scheduler (*scheduler*)** is the kernel subsystem determining processor allocation across runnable threads:

* **Turnaround Time (*Turnaround Time*)**: Total wall-clock time elapsed from initial submission/launch to final termination (encompassing run, wait, and blocked intervals).
* **Waiting Time (*Waiting Time*)**: Cumulative duration a process spends idling in the `READY` queue waiting for CPU assignment.
* **Non-preemptive Scheduling (*Non-preemptive* / Cooperative)**: A running process retains CPU control until it voluntarily yields via termination (`exit`) or a blocking system call (`read`).
* **Preemptive Scheduling (*Preemptive*)**: The kernel enforces execution limits: if a time quantum expires or a higher-priority task enters `READY`, the kernel forcibly preempts the running process.

### 3. Key Scheduling Algorithms

### Round Robin (RR)

:::roundrobinviz
:::

Implements circular time-sharing execution:
* Every process receives a maximum continuous execution allowance called a **time quantum ($Q$)**, e.g., 10 milliseconds.
* If a process depletes its quantum without terminating, a hardware timer interrupt preempts it, appending it to the tail of the `READY` queue.
* **Quantum Sizing Trade-offs**:
  * An **infinitely large** quantum degrades RR into First-Come First-Served (FCFS).
  * An **overly tiny** quantum (e.g., 0.1 ms) causes context switch overhead to dominate CPU cycles over useful user instructions.
* What happens if a process blocks before quantum expiration?  
  It yields the CPU immediately (transitions to `BLOCKED`), and the scheduler **instantly dispatches the next runnable task** without idling for the remainder of the quantum.

### Completely Fair Scheduler (Linux CFS)

:::cfsviz
:::

The production CPU scheduler of the Linux kernel:
* Aims to provide an equitable share of processor capacity to all active processes.
* Tracks execution time via a per-process metric termed **virtual runtime (`vruntime`)**. Processes with lower accumulated `vruntime` are prioritized for subsequent CPU allocation.
* Consequently, I/O-bound interactive applications (text editors, window managers, terminals) that spend most of their existence suspended in `BLOCKED` accumulate very little `vruntime`. When awakened by an input event, CFS dispatches them with near-zero latency.

### State Transition Summary

| Transition | From $\rightarrow$ To | Primary Trigger |
| :--- | :---: | :--- |
| **Creation** | `New` $\rightarrow$ `READY` | Parent process invokes **`fork()`**. |
| **CPU Dispatch** | `READY` $\rightarrow$ `RUN` | Scheduler allocates processor quantum. |
| **Quantum Expiration** | `RUN` $\rightarrow$ `READY` | Time slice consumed (**quantum expired**). |
| **I/O Wait** | `RUN` $\rightarrow$ `BLOCKED` | Blocking call: awaiting child (**`waitpid`**) or stream I/O (**`read`**). |
| **Event Ready** | `BLOCKED` $\rightarrow$ `READY` | I/O data arrives or awaited child terminates. |
| **Termination** | `RUN` $\rightarrow$ `ZOMBIE` | Process exits (**`exit()`**); PCB retained until parent calls `waitpid`. |
| **Reaping** | `ZOMBIE` $\rightarrow$ `Freed` | Parent harvests status via **`waitpid()`**; PCB deleted by kernel. |
