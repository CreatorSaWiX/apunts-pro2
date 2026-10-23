---
title: "Topic 4: Signals"
description: "Advanced signal handling and management."
readTime: "25 min"
order: 4
draft: false
isNew: true
---
Signals represent the core primitive mechanism for asynchronous notifications between processes and the Kernel. All signal state is directly maintained inside each process's descriptor table ([PCB in Topic 3](./tema-3)), comprising the signal action table, pending signal bitmask, and blocked signal mask.

## 4.1 Concept of a Signal

A signal is an asynchronous software notification delivered by the Operating System (or another process) to a target process. Each signal is identified by an integer index and a symbolic identifier (`SIGALRM`, `SIGKILL`, `SIGINT`, etc.).

:::shellviz{command="kill -l" suggestions="kill -l,man 7 signal" title="Terminal — Listing all available signals with numbers and identifiers (kill -l)"}
:::

When a process receives a signal, one of 3 outcomes occurs:
- **Default Action:** Typically process termination (as with `SIGKILL` or `SIGALRM`), ignoring (as with `SIGCHLD`), or freezing (`SIGSTOP`).
- **Ignore:** Discard without action (caution: `SIGKILL` and `SIGSTOP` cannot be ignored).
- **Catch/Handle:** Execute an application-defined routine (signal handler function) configured via `sigaction`.

**Signal Mask:** The set of signals currently held in a blocked state for the process. If a blocked signal is delivered, it remains pending until unblocked.  
**`sigsuspend(&mask):`** An atomic system call that temporarily replaces the process's signal mask with the supplied set and blocks execution until receipt of an unblocked signal.

### Signal Table
| Signal | Code | Default Action | Trigger Source | Catchable or Blockable? |
| :--- | :---: | :---: | :--- | :---: |
| **`SIGINT`** | 2 | Terminate process | User presses `Ctrl+C` in terminal. | Yes |
| **`SIGKILL`** | 9 | Terminate immediately | Kernel forced termination command. | **NEVER** (unblockable) |
| **`SIGSTOP`** | 19 | Pause process (STOPPED) | Kernel forced execution suspension. | **NEVER** (unblockable) |
| **`SIGCONT`** | 18 | Resume process | Resumes a process paused via `SIGSTOP`. | Yes |
| **`SIGALRM`** | 14 | Terminate process | Software interval timer expires (`alarm(seconds)`). | Yes |
| **`SIGCHLD`** | 17 | **Ignore (no-op)** | A child process terminates or stops. | Yes |
| **`SIGSEGV`** | 11 | Terminate (*Core Dump*) | Invalid memory access (null pointer dereference). | Yes |
| **`SIGUSR1`** | 10 | Terminate process | User-defined custom signal for application logic. | Yes |
| **`SIGUSR2`** | 12 | Terminate process | Second user-defined custom application signal. | Yes |

---

## 4.2 How Does a Process Handle Signals?

:::signalpcbviz
:::

When a signal arrives, the Kernel inspects these 4 descriptor structures in the process PCB in strict sequence:

1. **Initial Filter $\rightarrow$ Block Mask**:
   * If the signal is present in the mask, it is deferred and **not dispatched now**.
2. **Pending Queue $\rightarrow$ Pending Bitmask**:
   * Marks blocked signals awaiting delivery (bit set to `1`).
   * **Not a counter**: receiving a blocked signal 5 times sets the single bit once. Upon unblocking, the handler executes **only once**.
3. **Dispatch Action $\rightarrow$ Action Table**:
   * When unblocked or directly delivered, the kernel looks up the configured handler:
     * `SIG_DFL`: Default POSIX behavior (terminate, freeze, or ignore).
     * `SIG_IGN`: Discard silently.
     * User Handler: Kernel switches context to execute the designated C handler function.
4. **Alarm Tracking $\rightarrow$ Alarm Timer**:
   * An interval countdown that generates `SIGALRM` upon reaching zero. Exactly **1 active alarm timer per process** is supported (setting a new alarm cancels previous alarms).

---

## 4.3 Signal System Calls

### 1. Sending a Signal: `kill(pid, signal)`

:::killviz
:::

Transmits any signal to the process specified by `pid_target` (contrary to its name, `kill` sends arbitrary signals):
```c
kill(pid_desti, SIGINT);  // Sends Ctrl+C interrupt
kill(pid_desti, SIGKILL); // Unconditionally kills target process
kill(pid_desti, SIGUSR1); // Sends user-defined signal 1
```
* From the command line:
  * **Command `kill`**: `kill -KILL 1234` or numeric code `kill -9 1234`. Command syntax drops the `SIG` prefix (`-KILL`, `-ALRM`, `-INT`).
  * **Command `killall`**: Targets processes by executable name rather than PID: `killall -KILL alarm1` or `killall -9 alarm1`.
  * **Who prints death diagnostics?**: If an unhandled terminating signal kills a child (like `SIGALRM` or `SIGKILL`), terminal status messages (`Alarm clock`, `Killed`, or `Segmentation fault`) are printed by **the parent Shell** upon reaping the child via `waitpid()`.

### 2. Configuring Signal Responses: `sigaction()`

:::sigactionviz
:::

Specifies custom handling when receiving a particular signal (e.g., catching `SIGINT` to avoid program termination):
```c
struct sigaction tractament;
tractament.sa_handler = my_handler; // The C function to execute
sigemptyset(&tractament.sa_mask);    // Mask no additional signals during handler execution
tractament.sa_flags = 0;

// Now pressing Ctrl+C (SIGINT) invokes my_handler instead of terminating:
sigaction(SIGINT, &tractament, NULL);
```

Key configuration flags in `sa_flags`:
* **`SA_RESETHAND`**: Handles the signal once with your custom function, then automatically resets disposition to `SIG_DFL`. A second arrival terminates the program.
* **`SA_RESTART`**: If a slow system call (`read`, `waitpid`) was interrupted by the signal, the call **automatically restarts** upon handler completion rather than failing with `EINTR`.

### 3. Managing Signal Sets (`sigset_t`)

:::sigprocmaskviz
:::

`sigset_t` is the **POSIX type representing a collection of signals**. Internally within kernel space, it is implemented as a **bitmask array (*bitmap*)**. Each bit position indexes a specific signal:

* Bit set to `1` $\rightarrow$ signal is present in the set.
* Bit set to `0` $\rightarrow$ signal is absent.

Because it is an opaque structure, POSIX provides dedicated manipulation primitives:

| Function | Purpose | Logical Equivalent |
| :--- | :--- | :--- |
| `sigemptyset(&mask)` | Clears the set (all bits set to `0`) | Empty set $\emptyset$ |
| `sigfillset(&mask)` | Adds **all** supported signals to the set (all bits `1`) | Universal set of signals |
| `sigaddset(&mask, SIGALRM)` | Adds a specific signal to the set | Sets bit for `SIGALRM` to `1` |
| `sigdelset(&mask, SIGALRM)` | Removes a specific signal from the set | Clears bit for `SIGALRM` to `0` |
| `sigismember(&mask, SIGALRM)` | Queries presence of a signal in the set | Returns 1 if present, 0 otherwise |

Usage example:
```c
sigset_t mask;
sigemptyset(&mask);         // Initialize empty set
sigaddset(&mask, SIGINT);   // Add SIGINT to blocked set
sigdelset(&mask, SIGINT);   // Remove SIGINT from set
```

### 4. **Modifying the Signal Mask with `sigprocmask()`**:
  ```c
  int sigprocmask(int how, const sigset_t *set, sigset_t *oldset);
  ```

  Parameters:
  * **`how`**: Operation performed on the calling thread's signal mask:

    | Option (`how`) | Behavior | Mask Equation |
    | :--- | :--- | :---: |
    | **`SIG_BLOCK`** | Appends signals in `set` to the currently blocked set. | $\text{mask} \cup \text{set}$ |
    | **`SIG_UNBLOCK`** | Unblocks signals in `set` (removes them from current mask). | $\text{mask} \setminus \text{set}$ |
    | **`SIG_SETMASK`** | **Overwrites** the current mask with `set`. | $\text{mask} = \text{set}$ |

  * **`set`**: Pointer to the desired signal set (passing `NULL` leaves mask unaltered, allowing inspection).
  * **`oldset`**: If non-NULL, the previous signal mask is stored here (useful for restoring previous states).

  ```c
  sigset_t mask, old_mask;
  sigemptyset(&mask);
  sigaddset(&mask, SIGALRM);

  // Block SIGALRM, saving current mask in old_mask:
  sigprocmask(SIG_BLOCK, &mask, &old_mask);

  // ... critical section protected from SIGALRM ...

  // Restore previous signal mask:
  sigprocmask(SIG_SETMASK, &old_mask, NULL);
  ```

### 5. Atomic Signal Waiting: `sigsuspend()`

:::sigsuspendviz
:::

```c
sigsuspend(&mascara);
```
Suspends execution, replacing the active mask with `mascara` until delivery of an unblocked signal.  
Upon signal handler execution, `sigsuspend` returns and **automatically restores the original pre-call signal mask**.

### 6. Scheduling Timer Alarms: `alarm(seconds)`

:::alarmviz
:::

`alarm(N)` sets an asynchronous kernel timer for $N$ seconds.

* **Non-blocking call**: Execution continues immediately to the next statement while the kernel timer runs concurrently.
* **Expiration behavior**: Upon timeout, the kernel sends `SIGALRM` to the process:
  1. **Default (uncaught)**: `SIGALRM` **terminates the process** (`exit`), providing a fail-safe timeout guard.
  2. **Caught with `sigaction`**: The signal interrupts execution, runs the custom handler, and then **resumes normal execution**.

```c
alarm(5); // Schedule SIGALRM 5 seconds from now
alarm(0); // Cancel any pending alarm timer
```

---

## 4.4 Complete Multiprocessing and Signals Example (Lab SO 4 Prep)

Step-by-step complete scenario:
* **Parent Process**: Main driver. Forks 10 children, establishes a 2-second timeout window, and monitors exit codes. If any child exceeds 2s, it forcibly kills it using `SIGKILL`.
* **10 Child Processes**: Forked workers. Each waits 1 second using `alarm(1)` and exits cleanly with `exit(0)`.

:::oopviz{simulation="fork_alarm_timeout"}
:::

<!-- ## 4.4 Patterns and Idioms with Signals

### Pattern 1: Freezing and Resuming a Process
* **Self-suspension**:
  ```c
  kill(getpid(), SIGSTOP); // Immediately enters STOPPED state
  ```
* **Resuming execution**: From another shell or process:
  ```bash
  kill -SIGCONT <PID>
  ```

---

### Pattern 2: Mitigating the Lost Signal Race Condition
Suppose a parent process awaits a `SIGUSR1` notification from a child.  
If the parent simply calls `sigsuspend(&empty)` without preliminary blocking, a fast child might send `SIGUSR1` **before** the parent reaches the `sigsuspend` call. The signal arrives, executes, and when the parent subsequently enters `sigsuspend`, it **hangs indefinitely** waiting for a signal that has already fired!

**Standard Exam Solution:**
1. **Block the signal PRIOR to calling `fork()`**:
   ```c
   sigset_t mask, mask_suspend;
   sigemptyset(&mask);
   sigaddset(&mask, SIGUSR1);
   sigprocmask(SIG_BLOCK, &mask, NULL); // SIGUSR1 is blocked!
   ```
2. Spawn child via `fork()`. If the child fires the signal immediately, it is safely latched in the parent's pending bitmask.
3. The parent waits via `sigsuspend(&mask_suspend)`, where `mask_suspend` has `SIGUSR1` unblocked. `sigsuspend` atomically unblocks the signal and suspends: the pending signal triggers, the handler runs, and the parent awakens reliably!

---

### Pattern 3: Asynchronous Child Reaping via `SIGCHLD`
To avoid blocking on `waitpid()`, the parent installs a `SIGCHLD` handler:

```c
void trata_muerte_hijo(int s) {
    int status;
    // Mandatory non-blocking loop with WNOHANG!
    while (waitpid(-1, &status, WNOHANG) > 0) {
        // Harvest each terminated child PCB
    }
}
```
**Why is the `while (waitpid(-1, &st, WNOHANG) > 0)` loop required?**  
Because if multiple children exit concurrently during handler invocation, signals do not queue; the single pending `SIGCHLD` bit is asserted once. A single `waitpid` would reap only one child, leaving sibling processes as zombies. The `while` loop reaps all available terminated children until no more uncollected zombies remain (returning 0).

---

## 4.5 Solved Exam Questions (Topic 4: Signals)

### 1. An orphaned process receives `SIGKILL`. Can it remain a Zombie forever?
**NO**. When a process is orphaned, it is automatically adopted by `init` (PID 1). This root process continuously calls `waitpid()` for its adopted children, freeing their PCBs immediately upon termination.

### 2. What happens to a parent's signal structures when calling `fork()`?
**Nothing at all**. Calling `fork()` instantiates an independent child process and leaves parent signal structures (action table, pending bitmask, block mask, and alarm timer) entirely unmodified.

### 3. What is modified and what is preserved in signal structures upon `execlp()`?
* **Modified**: The signal action table resets all user-defined handlers to default action (`SIG_DFL`) because user function addresses no longer exist in the new binary address space.  
* **Preserved**: The blocked signal mask, pending signals, and active alarm timer remain intact across `exec`.

### 4. Under Round Robin with 3 processes and a 10 ms quantum, can a process run twice in less than 30 ms?
**YES**. If any of the other two processes performs a blocking system call (e.g., keyboard `read`, `waitpid`, or waiting for a signal) before consuming its 10 ms quantum, it immediately yields the CPU, passing the schedule turn forward prematurely. -->
