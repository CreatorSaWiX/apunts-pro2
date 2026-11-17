---
title: "Topic 6: Input and Output"
description: "3-layer architecture, kernel tables (CT, OFT, IT), basic syscalls, pipes, redirections, and concurrency."
readTime: "18 min"
order: 6
draft: false
---

## 6.1 Basic concepts and 3-layer architecture

**Input/Output (I/O)** is the transfer of data between a process and the outside world (always from the process's point of view): **input** (outside $\rightarrow$ process) and **output** (process $\rightarrow$ outside). Unlike high-level libraries (`cin`/`cout`, `printf`/`scanf`), system calls (`read`/`write`) move **raw bytes**: converting to ASCII text or data types is the programmer's responsibility.

### HW view and device independence
* **Hardware**: The CPU communicates with the peripheral's **controller** over the bus via **ports** (control, status, and data registers, using `in`/`out` instructions or memory-mapped addresses) and receives **interrupts (`int`)** when the device finishes an operation.
* **Device independence**: User code must work identically whether reading from a keyboard, a file, or a pipe. To achieve this, the OS provides **uniform operations** (`open`, `read`, `write`, `close`), **virtual devices** (integer identifiers), and **redirection** capability (`program < file1 > file2`).

### 3-layer design

:::iolayersviz
:::

| Layer | What does it represent? | Main responsibility | In Linux, identified by... |
| :--- | :--- | :--- | :--- |
| **1. Virtual** | Device in use within a process | Isolates the program from real hardware. | **Channel / `fd`** (integer: `0` `stdin`, `1` `stdout`, `2` `stderr`). |
| **2. Logical** | Uniform interface and sharing | Permissions, device-independent blocks, and concurrent access. | **File name / path** (`/dev/tty0`, `data.txt`). |
| **3. Physical** | Implementation in the controller (*Device Driver*) | Translates logical operations into physical commands (tracks, sectors, motors). | **Type** (`b`/`c`) + **`major` / `minor`** pair. |

* **`major`**: Indicates the device type (which *Device Driver* manages it).
* **`minor`**: Indicates the specific instance within that type (e.g., partition 1 vs partition 2 of the same disk).

### File types in Linux and the `mknod` command
In Linux, almost everything is identified as a file in the VFS (*Virtual File System*):
* **Regular file**: Conventional data file.
* **Special files**: Directory (`d`), Symbolic link (`l`), Block device (`b`, e.g., disks), Character device (`c`, e.g., keyboard, `/dev/null`), Named pipe (`p` / FIFO), and Socket (`s`).

The **`mknod`** syscall/command creates special files (it cannot create regular files, directories, or symlinks):
```bash
mknod file_name c major minor   # Character device
mknod file_name b major minor   # Block device
mknod pipe_name p               # Named pipe / FIFO (no major/minor)
```

---

## 6.2 Kernel data structures: CT, OFT, and IT

To connect the virtual layer (process) with the physical layer (device or disk), the Kernel maintains **three linked tables**:

:::kerneltablesviz
:::

1. **Channel Table (CT) — *One per process (inside the PCB)***:
   * Integer index (`0, 1, 2...`): the **channel** or file descriptor (`fd`).
   * Each occupied entry stores the index to an entry in the OFT.
2. **Open File Table (OFT) — *Global (one for the entire system)***:
   * Represents each active logical "open" instance.
   * **`refs`**: Number of CT entries (from the same process or others) pointing to it.
   * **`mode`**: Access mode (`r`, `w`, `rw`).
   * **`rw_pos`**: Current read/write pointer in bytes (on sequential devices like terminals or pipes, it is `-`).
   * **`it_entry`**: Index into the Inode Table.
3. **Inode Table (IT) — *Global (one for the entire system)***:
   * In-RAM copy of the on-disk physical inode to speed up accesses (stores size, type, permissions, timestamps, link count, indices to data blocks, and pointers to *Device Driver* routines).
   * **`refs`**: Number of OFT entries pointing to it.

> **The Inode does NOT store the file name:**  
> A directory is simply a file containing `(name, inode_number)` pairs. All other metadata lives in the inode.

---

## 6.3 Basic I/O system calls

### Blocking vs non-blocking operations

:::ioblockingviz
:::

* **Blocking I/O (default)**: If there is no data to read (or no space to write), the process transitions from `RUN` $\rightarrow$ `BLOCKED`, yields the CPU, and enters a wait queue. When data arrives, the device generates an interrupt; the ISR collects the data and moves the process to `READY`.
* **Non-blocking I/O**: Transfers only whatever is immediately available and returns right away (can be enabled with `fcntl` / `O_NONBLOCK` flag).

### Summary of main system calls

| System call | Main function | Effect on the tables (CT / OFT / IT) |
| :--- | :--- | :--- |
| **`open`** | Opens (or creates) a file and returns an `fd`. | Allocates the **first free channel** in the CT, creates a **new OFT entry** (`rw_pos = 0`), and links to the IT. |
| **`read`** | Reads up to `count` bytes from `fd` into memory. | Advances `rw_pos += bytes_read` in the OFT. Returns `0` on reaching EOF. |
| **`write`** | Writes up to `count` bytes from memory to `fd`. | Advances `rw_pos += bytes_written` in the OFT. |
| **`lseek`** | Manually moves the `rw_pos` pointer. | Directly modifies `rw_pos` in the OFT (only for random-access files). |
| **`dup` / `dup2`** | Duplicates an existing channel. | The new channel points to the **same OFT entry** (`refs++` in the OFT). |
| **`close`** | Closes channel `fd`. | Frees the CT entry, does `refs--` in the OFT. If it reaches `0`, frees the OFT entry and does `refs--` in the IT. |
| **`pipe`** | Creates an unnamed pipe (`fd[0]`, `fd[1]`). | Creates 2 CT entries (`r`/`w`), 2 OFT entries (`r`/`w`), and 1 temporary inode in the IT. |

### 1. `open(name, flags [, permissions])`
Checks access permissions **only once** when executed (subsequent `read`/`write` calls do not re-validate them):
* **Mandatory mode** (one of the three): `O_RDONLY`, `O_WRONLY`, `O_RDWR`.
* **Creation/truncation flags**:
  * `O_CREAT`: Creates the regular file if it does not exist (requires passing the 3rd permissions parameter, e.g., `S_IRUSR | S_IWUSR` or `0644`). If it already exists, does nothing.
  * `O_TRUNC`: If the file already existed, frees its data and truncates it to **0 bytes**.
  * *(Note: Special files like FIFOs or devices must already exist; `O_CREAT` does not create them).*

### 2. `read()` and `write()`: Byte-by-byte access, buffering, and binary format
```c
// Inefficient: makes N system calls (N user <-> kernel mode switches)
while ((n = read(0, &c, 1)) > 0)
    write(1, &c, 1);

// Efficient: reads whole blocks and drastically reduces syscalls
char buf[1024];
while ((n = read(0, buf, sizeof(buf))) > 0)
    write(1, buf, n); // IMPORTANT: write 'n' bytes (those actually read), NOT sizeof(buf)!
```
* **ASCII text vs machine binary**: `read`/`write` move raw bytes. You can transfer ASCII text (`"42"`) or raw binary data directly from memory (`int x = 42; write(fd, &x, sizeof(int));` $\rightarrow$ 4 bytes exactly as stored in RAM, inspectable with `xxd` or `hexdump`).

### 3. `lseek(fd, offset, whence)`
Allows jumping to any position in a regular file (**fails with `ESPIPE` on pipes, FIFOs, or terminals**):
* `SEEK_SET`: `rw_pos = offset` (from the beginning).
* `SEEK_CUR`: `rw_pos = rw_pos + offset` (from the current position).
* `SEEK_END`: `rw_pos = file_size + offset` (from the end).
* **OFT vs IT**: `SEEK_SET` and `SEEK_CUR` only modify the **OFT**; **`SEEK_END` queries the size in the IT (inode)**.
* **Trick to compute a file's size**: `off_t size = lseek(fd, 0, SEEK_END);`.

### 4. `dup()`, `dup2()`, and `close()`

:::dup2viz
:::

* **`newfd = dup(fd)`**: Finds the **first free channel** in the CT and makes it point to the same OFT entry as `fd`.
* **`dup2(fd, newfd)`**: Forces the target channel to be `newfd`. If `newfd` was previously open, it closes it automatically and atomically. Foundation for redirections:
  ```c
  int fd = open("output.txt", O_WRONLY | O_CREAT | O_TRUNC, 0644);
  dup2(fd, 1); // Now every write(1, ...) or printf writes to output.txt!
  close(fd);   // Free the auxiliary channel 'fd'; channel 1 keeps the OFT entry alive
  ```

### 5. Advanced control and namespace operations
* **`pread(fd, buf, count, offset)` / `pwrite(...)`**: Reads or writes directly at `offset` **without modifying `rw_pos` in the OFT** (very useful when multiple *threads* read the same `fd` without stepping on each other).
* **`ioctl(fd, cmd [, ptr])`**: Modifies specific parameters of the **logical device / driver** (e.g., terminal or network configuration).
* **`fcntl(fd, cmd [, args])`**: Modifies properties of the **virtual channel** (e.g., switching `fd` to non-blocking mode `O_NONBLOCK`).
* **Metadata and links**: `link` / `unlink` (removes the name from the directory; only frees inode and blocks when `#links == 0` **and** `IT.refs == 0`), `symlink`, `chmod`, `chown` / `chgrp`, and inode queries with `stat` (follows symlinks), `lstat` (does not follow symlinks), and `fstat` (from an open `fd`).

---

## 6.4 Pipes and Terminals

### Unnamed pipes (`pipe`) vs Named pipes (FIFO)

| Feature | Unnamed pipe (`pipe(fd)`) | Named pipe / FIFO (`mknod` + `open`) |
| :--- | :--- | :--- |
| **Name in the File System?** | **NO** (exists only in RAM, temporary inode). | **YES** (has a directory entry, type `p`). |
| **Who can use it?** | Only the creating process and its **descendants** (inherited via `fork`). | **Any process** on the system that knows the path and has permissions. |
| **How is it opened?** | `pipe(fd)` already returns both channels open (`fd[0]` read, `fd[1]` write). | Created in C with `mkfifo("p", 0660)` (or `mknod`) and each process calls `open("p", ...)`. |

> **Blocking on `open` and retries:**  
> Opening a named pipe with `O_RDONLY` **blocks** the process until another process opens it with `O_WRONLY` (and vice versa). Opening with `O_RDWR` does not block, but the same process becomes registered as a potential writer! If the FIFO already existed, `mkfifo` fails with `errno == EEXIST`.

### Golden rules of blocking and synchronization in pipes

:::pipeviz
:::

The Kernel automatically synchronizes readers and writers (and in the OFT, `rw_pos` is always `-`):
* **Reading (`read`)**:
  * If data is available $\rightarrow$ returns up to `count` available bytes.
  * If empty and **at least 1 write channel remains open** $\rightarrow$ the reader **blocks**.
  * If empty and **all write channels are closed** $\rightarrow$ returns `0` (**EOF**).
* **Writing (`write`)**:
  * If the pipe is full $\rightarrow$ the writer **blocks** until the reader frees space.
  * If **all read channels are closed** $\rightarrow$ the process receives the **`SIGPIPE`** signal (terminates the process by default; if ignored with `SIG_IGN`, `write` returns `-1` with `errno == EPIPE`).

> **Critical rule — Always close unused channels:**  
> After a `fork()`, both parent and children inherit all pipe channels. If the reader process (or the parent that only calls `waitpid`) leaves the write channel `fd[1]` open, the pipe still has a live "potential writer" and **the reader will block forever without ever receiving EOF**.

```c
// Shell-style redirection: program1 | program2
int fd[2];
pipe(fd);
if (fork() == 0) { // CHILD 1 (writer)
    dup2(fd[1], 1);
    close(fd[0]); close(fd[1]); // Close both original channels
    execlp("program1", "program1", NULL);
}
if (fork() == 0) { // CHILD 2 (reader)
    dup2(fd[0], 0);
    close(fd[0]); close(fd[1]); // Close both original channels
    execlp("program2", "program2", NULL);
}
close(fd[0]); close(fd[1]);     // ESSENTIAL: the parent closes both channels!
while (waitpid(-1, NULL, 0) > 0);
```

### Terminals (Canonical Mode by default)
* **Reading**: The driver maintains a line *buffer*. Characters are not sent to the process until Enter (`CR`) is pressed, allowing prior editing with `^H` (erase character) and `^U` (erase line).
* **`^D` (EOF)**: Forces flushing the *buffer* to `read()`. If the *buffer* was empty, `read()` returns `0` (interpreted as end-of-file).

---

## 6.5 I/O in concurrent execution: `fork`, `exec`, and signals

### 1. `fork()`: Sharing vs independence of the `rw_pos` pointer
The child inherits an **exact copy of the parent's CT**, so both point to the **same OFT entry** (`refs` is incremented):

:::forkioviz
:::

* **Opened BEFORE `fork()` $\rightarrow$ Shared pointer**:
  ```c
  int fd = open("file.txt", O_RDONLY);
  fork();
  // Parent and child share the OFT entry: if the parent reads byte 0,
  // the child will read byte 1! They split the file between them.
  ```
* **Opened AFTER `fork()` $\rightarrow$ Independent pointers**:
  ```c
  fork();
  int fd = open("file.txt", O_RDONLY);
  // Each creates its own OFT entry (independent rw_pos = 0).
  // Both parent and child will read the entire file from the beginning.
  ```

### 2. `exec()`: Why do redirections work?
When a process mutates with `exec()`, its RAM memory is replaced by the new program, but **its I/O structures (the CT) remain intact**.
That is why the canonical redirection pattern is:
1. `fork()` (the child inherits the parent's channels).
2. The child closes/duplicates channels (`close(0); open(...)` or `dup2(fd, 1); close(fd);`).
3. The child executes `exec()`: the new program starts with input or output already redirected completely transparently.

### 3. Interruption of I/O calls by signals (`EINTR` vs `SA_RESTART`)
If a signal arrives while a process is `BLOCKED` in a `read()`, `write()`, or `open()`:
* **With the `SA_RESTART` flag** in `sigaction`: Once the *handler* finishes, the Kernel **automatically restarts** the I/O call (except for specific operations like sockets or `sigsuspend`).
* **Without `SA_RESTART`**: The call returns an error (`-1`) and `errno` is set to **`EINTR`**. To prevent a legitimate read from failing due to a signal, it is protected with a loop:
  ```c
  while ((n = read(fd, buf, size)) == -1 && errno == EINTR);
  ```

---

## 6.6 Physical model of the File System on disk

A UNIX file system on disk is organized into **three main zones**:

:::unixfsviz
:::

1. **Superblock**: Global metadata of the partition (block size, bitmaps/lists of free inodes and blocks, and address of the root inode `/`).
2. **Inode Table**: Each inode contains the file's metadata (`type`, `permissions`, `#links`, `size`, timestamps) and **pointers to its data blocks**:
   * **Direct pointers**: Point directly to data blocks (immediate access for small files).
   * **Indirect pointers (single, double, triple)**: Point to blocks containing addresses of other blocks, enabling huge files *(though the maximum effective size is also bounded by the type of `rw_pos` in the OFT, e.g., 4 GiB if 32-bit)*.
3. **Data Blocks (DB)**: Store the contents of regular files and the `(name, inode)` tables of directories (always including `.` and `..`).
   * **Soft links**: If the target path is short, it is stored *inline* inside the inode itself (`0` DB); if long, it occupies `1` DB with the path text.
4. **Path resolution and *Buffer Cache***:
   * To open `/dir/f.txt`, the Kernel starts from `/` and alternates **Directory Inode $\rightarrow$ Directory DB** until finding the final inode (if it encounters a *soft link* with an absolute path, it restarts from `/`).
   * The **Buffer Cache** keeps recently read/modified blocks and inodes in RAM: subsequent reads hit memory without touching disk, and writes are flushed lazily.

### What happens in each system call?

| System call | What does it query or modify in the File System? | Does it access the target file's DBs? |
| :--- | :--- | :---: |
| **`open` (existing)** | Traverses the path from `/` (or `.`) alternating Inode $\rightarrow$ Directory DB (or cache). If it hits a *soft link*, reads its path and re-resolves. Checks permissions on the final inode. | **NO** |
| **`open` (`O_CREAT`)** | All of the above + requests a **new free inode from the Superblock**, adds `(name, new_inode)` to the parent directory's DB, and updates its size/timestamps. | **NO** |
| **`mkdir`** | Requests **1 free inode + 1 free DB** from the Superblock for the new directory (with `.` and `..`), adds the entry to the parent, and increments the parent's `#links`. | **YES (creates its DB)** |
| **`unlink`** | Removes `(name, inode)` from the parent's DB and decrements `#links` by 1. Only frees the inode and DBs in the Superblock if **`#links == 0` and `IT.refs == 0`**. | **NO** |
| **`read`** | Checks in the OFT if `rw_pos == size` (EOF). Computes the block, queries the inode's indices, and reads from *Buffer Cache* or disk. | **YES** |
| **`write`** | Same as `read`; if extending the file, requests **free DBs from the Superblock** and updates indices and size in the inode. | **YES** |
| **`mmap`** | Queries the inode (size, permissions, blocks) and creates the logical region. DBs are not read until the first memory access (**Page Fault**). | **NO (at `mmap` time)** |
| **`close`** | When `OFT.refs` reaches 0, frees OFT and does `IT.refs--`; if `IT.refs == 0`, updates final inode metadata (does not touch `CT/OFT` on `unlink`). | **NO** |
