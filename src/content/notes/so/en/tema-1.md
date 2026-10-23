---
title: "Topic 1: OS and Shell"
description: "Role of the OS, execution modes, system calls, shell, inodes, links, and permissions."
readTime: "15 min"
order: 1
draft: false
---

## 1.1 Introduction to Operating Systems

The **Operating System (OS)** is the software that acts as an intermediary between user applications and the physical computer hardware (CPU, RAM, hard disk, keyboard, or screen).

Without an OS, each programmer would need to write low-level hardware routines to interface directly with disk controllers or network cards. The OS abstracts this complexity pursuing three main objectives:

1. **Ease of use (Usability)**: Hides intricate hardware details. Instead of dealing with physical disk tracks and sectors, developers and users interact with files and directories.
2. **Security (Protection)**: Prevents buggy or malicious programs from corrupting another program's address space or tampering with other users' data.
3. **Efficiency**: Manages processor scheduling and memory allocation so numerous programs run concurrently without resource exhaustion.

:::osmediatorviz
:::

### The Course Environment: UNIX and POSIX

* **UNIX**: An OS family dating back to the 1970s that pioneered the modern architectural paradigm: a single rooted hierarchical filesystem (`/`), the "everything is a file" philosophy, and small modular utilities chained by pipes. **Linux** and **macOS** follow this model (*Unix-like*).
* **POSIX** (*Portable Operating System Interface*): An IEEE standard specifying the formal API of a UNIX system:
  * Standardizes available system calls (`fork`, `write`, `read`, `open`, etc.) and their behavioral semantics.
  * **Objective**: Guarantees source-code **portability** (the same C code compiles across any POSIX-compliant OS).

---

## 1.2 Execution Modes

To ensure that rogue or crashing applications cannot destabilize the entire machine or access unauthorized memory, the physical CPU operates in **two execution modes**:

1. **User Mode (*user mode*)**:
   * The mode where user-space applications run: browsers, editors, user code, and the Shell.
   * Access is **strictly restricted**: direct hardware interaction and reading memory outside the process's address space are disallowed. Any violation triggers a hardware trap that halts execution and notifies the kernel.
2. **Kernel Mode (*kernel mode* or privileged mode)**:
   * The execution domain reserved exclusively for the OS core (*Kernel*).
   * The CPU operates with **unrestricted privileges**: all machine instructions are executable, any RAM location can be addressed, and hardware devices can be manipulated directly.

> **How does the CPU know its current mode?**  
> Through a dedicated status bit inside the Processor Status Word (PSW) register. When set to 0, the CPU runs in kernel mode; when 1, it runs in user mode. User-space programs are architecturally prevented from directly altering this flag.

---

## 1.3 How Do We Transition into the Kernel?

The operating system kernel remains passive in memory, waking only in response to specific triggers. There are only **3 entry mechanisms into the Kernel**:

| Event | Origin | Synchronicity | Definition and Examples |
| :--- | :--- | :--- | :--- |
| **Hardware Interrupt** | External device | **Asynchronous** (can occur between any two consecutive CPU instructions) | Hardware signals an event requiring attention: keystroke pressed, network packet arrival, disk I/O completion, or periodic **timer tick**. |
| **Software Exception** | CPU execution unit | **Synchronous** (triggered by the instruction currently executing) | An error or anomalous condition in user code: division by zero, invalid memory dereference (*Segmentation Fault*), or a page fault (*page fault*). |
| **System Call (*trap*)** | User program | **Synchronous** (explicitly requested by software) | Software purposefully invokes an OS service via a specialized trap instruction (`syscall`): opening a file, writing to terminal (`write`), or spawning a child process (`fork`). |

### Purpose of the Timer Interrupt
Consider a program stuck in an infinite CPU loop devoid of system calls: `while (1);`. How does the OS regain control if the program makes no requests?  
* A programmable motherboard timer chip generates periodic **clock interrupts** (e.g., every 10 milliseconds).
* Every 10 ms, the CPU halts current execution, switches to kernel mode, and executes the timer interrupt handler.
* The OS scheduler checks how long the current process has held the CPU. If its quantum has expired, the OS preempts it and assigns the CPU to another task, preventing any single program from locking the system.

---

## 1.4 How Does a System Call Work?

When a user program requires kernel assistance (e.g., transmitting bytes via `write`), it cannot branch directly to a kernel memory address while running in user mode.

### 1. Why does the standard C library (`libc`) depend on hardware?
Writing `write(1, buf, len)` in C executes a user-space wrapper provided by the standard library (`libc`). This wrapper acts as an architectural bridge:
1. It loads syscall parameters (`1`, `buf`, `len`) into **designated CPU registers** dictated by the target ABI.
2. It executes the CPU's specific **mode-switching machine instruction**.
3. Because each processor family (x86, ARM, RISC-V) defines different register conventions and trap instructions, **this wrapper code must be engineered specifically for the target processor architecture**.

### 2. How is binary compatibility achieved across Linux kernel versions?
The Kernel does not expose syscall entry points via volatile memory addresses; rather, it uses a stable **vector of integer indices** (the *syscall table*):
* `SYS_write = 1`, `SYS_fork = 57`, etc.
* The C library places the syscall index into register `%rax` and executes `syscall`. The Kernel reads `%rax`, looks up the corresponding routine in its dispatch table, and runs it.
* **Standard syscall convention**: on success, the return value is provided; on failure, `-1` is returned and an error code is stored in the global variable `errno`.

---

## 1.5 The Shell and Commands (Built-in vs External)

The **Shell** (standardly **Bash** on Linux) is a command-line interpreter. It operates in an endless read-eval-print loop: reads user input, parses arguments, executes the specified command, and re-renders the input prompt (*prompt*).

Commands fall into two distinct categories:

| Category | Execution Domain | Examples | How to view help |
| :--- | :--- | :--- | :--- |
| **Built-in (*built-in*)** | Directly within the running Shell process (**without spawning a new process**) | `cd`, `pwd`, `export`, `alias`, `exit`, `echo` | `help <command>` |
| **External** | Shell invokes `fork()` to create a child process and loads the executable binary via `exec()` | `ls`, `mkdir`, `cp`, `rm`, `grep`, `cat` | `man <command>` |

* `type <command>`: reveals whether a command is a shell built-in or an external disk binary.

:::shellviz{command="type cd" suggestions="type cd,type ls" title="Terminal — Inspecting whether a command is built-in or external"}
:::

---

## 1.6 The `man` Manual Pages

When issuing `man name`, the manual system references distinct numbered sections:

| Section | Content | Examples |
| :---: | :--- | :--- |
| **1** | User shell commands and executables | `ls`, `cp`, `bash`, `man` |
| **2** | **Kernel System Calls** | `fork`, `write`, `read`, `open`, `waitpid`, `kill` |
| **3** | **C Standard Library Functions** | `printf`, `sprintf`, `strlen`, `malloc`, `perror` |

* `man write` $\rightarrow$ documents the terminal message transmission utility (Section 1).
* `man 2 write` $\rightarrow$ documents the C low-level byte output system call (Section 2).
* **Navigation shortcuts**: `Space` (page down), `b` (page up), `/pattern` (search forward), `n` (next match), `q` (quit).

:::shellviz{command="man write" suggestions="man write,man 2 write" title="Terminal — Inspecting the manual for write (Section 1 vs 2)"}
:::

---

## 1.7 Filesystem Organization in UNIX: Inodes and Directories

UNIX structures all storage devices under a single unified hierarchical tree rooted at `/` (devoid of drive letters such as `C:` or `D:`).

### What is an Inode?
**The identity record of a file**. An internal operating system data structure storing file metadata: byte size, owner UID, permission bits (`rwx`), timestamp records (access, modification, status change), link count (*links*), and block pointers to physical disk data. **The Inode DOES NOT know the file's name.** File names reside strictly inside directories. A directory is simply a table mapping pairs of `(file_name, inode_number)`.

| File name (inside `/home/user`) | Inode No. | Description |
| :--- | :---: | :--- |
| `.` | `1001` | Self reference (*the current directory*) |
| `..` | `1000` | Parent directory reference |
| `notes.txt` | `50421` | Actual regular file |

* `stat file`: prints all metadata fields stored in the file's inode (size, blocks, links, timestamps).
* **Directory Link Counting**: A newly initialized directory starts with exactly **2 links**: its entry in its parent directory and its self-referencing `.` entry. Each created subdirectory increments this counter by $+1$ (via its child `..` entry).

:::shellviz{command="stat test.txt" suggestions="stat test.txt,stat Documents" title="Terminal — Inspecting Inode metadata with stat"}
:::

---

## 1.8 Hard Links vs Soft Links

| Property | Hard Link (`ln file link`) | Soft Link (`ln -s file link`) |
| :--- | :--- | :--- |
| **Underlying nature** | A **second directory entry** pointing to the **identical inode number**. | An **independent new file** possessing its **own unique inode** whose data payload contains the text path of the target. |
| **Inode Number** | **Identical** to the target file. | **Distinct** (allocates a new inode). |
| **Link Count (*Links*)** | Increments the target inode's counter by $+1$. | Does not affect target inode (link count is 1 for the link itself). |
| **Deleting original via `rm`** | Content **persists**. Link count decrements by 1; data blocks remain allocated until link count reaches 0. | Link becomes **dangling (*broken*)**. Attempting to access it yields: `No such file or directory`. |
| **Directory targets allowed?** | No (prohibited to prevent filesystem cycles). | **Yes**. |
| **Cross-filesystem capability?** | **No** (inode numbers are only unique per filesystem partition). | **Yes** (stores an arbitrary text path string). |

* `readlink soft_link`: outputs the destination path string stored inside the symlink.
* `namei -l path`: systematically traces path resolution across directories, symlinks, and permissions.

---

## 1.9 Access Permissions and `chmod`

POSIX permissions consist of 1 leading character defining item type followed by 3 trios of `rwx` bits:

| Type | Owner (`u` - *user*) | Group (`g` - *group*) | Others (`o` - *others*) |
| :---: | :---: | :---: | :---: |
| `-` | `r w x` | `r - x` | `r - -` |

* **Type**: `-` regular file · `d` directory · `l` symbolic link (*soft link*).
* `u` (*user*): File owner.
* `g` (*group*): Members of the owning group.
* `o` (*others*): All other system users.

### Bit Semantics by Context
| Character | Octal Value | On a Regular File | On a Directory |
| :---: | :---: | :--- | :--- |
| **`r`** (read) | 4 | Read content bytes | List entries within the directory (`ls`) |
| **`w`** (write) | 2 | Modify or truncate file content | **Create, delete, or rename** directory entries |
| **`x`** (execute) | 1 | Execute file as program/script | **Traverse directory (`cd`)** and resolve child paths |

> Does **deleting a file** require `w` permission on the file itself?  
> **NO**. Deletion removes the file's entry from the parent directory's table. Consequently, deletion requires only **`w` and `x` permissions on the parent directory**. Even if a file is marked strictly read-only (`r--r--r--`), any user with `w` access on the parent directory can remove it!

* **Modifying Permissions with `chmod`**:
  * Symbolic mode: `chmod u+x script.sh` (grants execute to owner), `chmod go-w file` (removes write from group and others).
  * Octal mode: `chmod 755 script.sh` (`rwxr-xr-x`), `chmod 644 document.txt` (`rw-r--r--`).

:::shellviz{command="chmod u+x SO/lab1.sh" suggestions="chmod u+x SO/lab1.sh,chmod 755 SO/lab1.sh,ls -l SO" title="Terminal — Experimenting with chmod permissions"}
:::

---

## 1.10 Environment Variables and `$PATH`

**Environment variables** are key-value string pairs (`KEY=VALUE`) inherited across processes during execution creation.
* `env`: dumps all active environment variables.
* `echo $KEY`: prints the value of a specific variable.
* `export KEY="value"`: sets a variable and ensures child processes inherit it.

### The `$PATH` Variable
An ordered colon-delimited list of directories searched by the Shell when resolving commands like `ls` or `gcc`:
* Search occurs strictly from left to right; the first matching binary is executed.
* Prepending `export PATH=.:$PATH` forces the shell to prioritize current directory binaries (`.`). If a directory contains an untrusted script named `ls`, typing `ls` executes the rogue script instead of `/usr/bin/ls`.
* `which <command>`: resolves and outputs the absolute path of the command binary.

---

## 1.11 I/O Redirections and Globbing

* `>` : Redirects standard output to a file, **truncating any pre-existing contents**.
* `>>` : Redirects standard output to a file, **appending new data** to the end.
* `<` : Redirects standard input, sourcing stream data from a file instead of the terminal keyboard.
* `&` : Launches a command in the background, promptly returning the interactive prompt.
* **Wildcards (*Globbing*)**: `*` (matches zero or more characters) and `?` (matches exactly one character).  
  **Glob expansion is handled by the Shell prior to process execution**. Running `grep pattern *.c` passes expanded arguments into `argv = ["grep", "pattern", "a.c", "b.c"]`, never a literal asterisk.

---

## 1.12 Common Exam Questions Solved (Topic 1)

### 1. Why does the standard C library (`libc`) depend on hardware architecture?
Because entering kernel mode requires issuing specific processor machine instructions (`syscall`, `sysenter`, `int 0x80`), with arguments placed into exact architecture-mandated hardware registers.

### 2. Which three event types force a CPU transition into Kernel mode?
1. **Hardware Interrupt**: asynchronous event emitted by external hardware controllers (keyboard, disk controller, system timer).  
2. **Software Exception**: synchronous fault generated directly by an executing instruction (division by zero, memory segmentation violation).  
3. **System Call (*trap*)**: synchronous request issued deliberately by user code to solicit operating system services.

### 3. We run `ln A B`. `A` exists, `B` does not, directory permissions are valid, and disk space is sufficient, yet the command fails. Why?
One of two reasons:  
1. `A` is a **directory**, and UNIX forbids creating hard links to directories to prevent cycles in the filesystem hierarchy.  
2. `A` and `B` reside on **different filesystems/partitions**, and hard links cannot bridge independent filesystem boundaries since inode numbers are local to their specific volume.
