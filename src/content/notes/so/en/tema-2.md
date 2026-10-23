---
title: "Topic 2: C Language"
description: "Makefiles, low-level calls, binary inspection tools, and error management."
readTime: "15 min"
order: 2
draft: false
---

## 2.1 Compilation Pipeline in UNIX

Transforming C source code into an executable binary proceeds through **3 sequential stages**:

:::compileviz
:::

| Stage | Tool | Exact Operation | Output Files |
| :--- | :--- | :--- | :--- |
| **1. Preprocessor** | `cpp` | Pure textual expansion: inlines `#include` directives, replaces `#define` macros with literal tokens, and strips all comments. | Expanded source (`.i`) |
| **2. Compiler** | `gcc -c` | Enforces syntax and type invariants, generating machine code instructions for the target processor. Leaves external symbol addresses unresolved. | Relocatable object file (`.o`) |
| **3. Linker (*Linker*)** | `ld` (via `gcc`) | Combines `.o` files with system libraries (such as `libc`), assigns definitive virtual memory addresses to symbols, and produces the binary executable. | Executable (`a.out` or specified name) |

:::shellviz{command="gcc --version" suggestions="gcc --version,which gcc" title="Terminal: Checking the GCC compiler version"}
:::

---

## 2.2 `sprintf` + `write`

`printf` and `cout` are buffered high-level abstractions that accumulate formatted output in user-space buffers prior to flushing. In Operating Systems, the unbuffered low-level idiom is strictly required:

1. **`sprintf(buf, format, ...)`** (`man 3 sprintf`, `<stdio.h>`): Converts numeric values or variables into an ASCII string buffer within array `buf`. **All terminal output must be explicitly rendered as ASCII text.**
2. **`write(fd, buf, nbytes)`** (`man 2 write`, `<unistd.h>`): System call transferring raw byte streams directly to the channel designated by `fd`.

`fd` (*file descriptor*) is an **integer index** maintained by the OS kernel per process to identify open I/O resources. Every process initializes with **3 default standard descriptors**:
* `fd = 0`: **`stdin`** (standard input, keyboard).
* `fd = 1`: **`stdout`** (standard output, display terminal).
* `fd = 2`: **`stderr`** (standard error stream, default terminal unbuffered).

```c
#include <stdio.h>
#include <string.h>
#include <unistd.h>

char buf[128];
int valor = 42;
// 1. Format text buffer in memory
int len = sprintf(buf, "The result is: %d\n", valor);
// 2. Transmit to standard output (channel 1)
write(1, buf, len);
```

:::shellviz{command="man 2 write" suggestions="man 2 write,man 3 sprintf,man 3 strlen" title="Terminal: Inspecting the write system call manual"}
:::

---

## 2.3 Makefiles

The `make` utility automates incremental builds, avoiding redundant recompilation by comparing modification timestamps between desired build artifacts (*targets*) and their prerequisites (*dependencies*).

### Strict Rule Syntax
```makefile
target: dependency1 dependency2 ... dependencyN
	recipe_command
```
The recipe line **MUST begin with a TAB character**. Spaces cause make to fail with the fatal error `missing separator. Stop.`

:::shellviz{command="make" suggestions="make,make clean" title="Terminal: Build automation with make"}
:::

### Why must header files (`.h`) be listed as dependencies?
Header files (`.h`) are not compiled directly into object files; however, the preprocessor copies their contents into `.c` translation units. If a rule specifies only `util.o: util.c`, modifying struct layouts or prototypes in `util.h` will **not trigger a rebuild** of `util.o`. The resulting application will suffer from stale memory layouts and silent runtime memory corruption.

```makefile
util.o: util.c util.h
	gcc -c util.c
```

### Complete Makefile Example:
```makefile
all: prog

prog: prog.o util.o
	gcc -o prog prog.o util.o

prog.o: prog.c util.h
	gcc -c prog.c

util.o: util.c util.h
	gcc -c util.c

clean:
	rm -f prog *.o
```

---

## 2.4 Fundamental `gcc` Flags

| Flag | Function | Usage Example |
| :--- | :--- | :--- |
| **`-c`** | Compiles source into relocatable object file (`.o`) without invoking the linker. | `gcc -c util.c` (generates `util.o`) |
| **`-o name`** | Designates the output binary filename (overriding default `a.out`). | `gcc -o prog prog.o` |
| **`-I dir`** | Adds directory path to the header inclusion search list (`#include`). | `gcc -c main.c -I./include` |
| **`-L dir`** | Adds directory path to the static/shared library search list. | `gcc -o prog prog.o -L./libs -lutil` |
| **`-l name`** | Links against library `lib<name>.a` or `.so` (omitting prefix `lib` and file extension). | `-lm` (links standard math library `libm.so`) |
| **`-Wall`** | Enables extensive compiler diagnostics and potential bug warnings. | `gcc -Wall -c prog.c` |
| **`-static`** | Performs **static linking**: copies library routines directly into the executable image. | `gcc -static -o prog_static prog.c` |

---

## 2.5 Static vs Dynamic Linking (`-static`)

A recurring core question in examination assessments:

| Property | Dynamic Linking (Default) | Static Linking (`gcc -static`) |
| :--- | :--- | :--- |
| **Binary Composition** | Contains only application-specific code and relocatable symbol references to system shared objects (`libc.so`). | **Full physical copy** of all referenced library functions embedded directly inside the binary file. |
| **Executable Footprint** | **Extremely lightweight** (e.g., 15 KB). | **Significantly larger** (e.g., 800 KB - 1 MB or higher). |
| **Runtime Loading** | OS dynamic linker loads shared libraries into memory on demand. | Binary is fully self-contained without external library dependencies. |
| **Memory Map (`maps`)** | Displays mappings for executable code, heap, stack, and mapped shared libraries (`libc.so`). | Clean memory mapping: strictly executable segments, heap, and thread stack. |
| **Symbol Table (`nm`)** | Standard library symbols are tagged **`U` (*undefined*)** pending dynamic resolution. | Library functions appear fully resolved with defined addresses in section **`T` (*text*)**. |

---

## 2.6 Binary Inspection Utilities: `nm`, `objdump`, and `strace`

### 1. `nm <executable>`: Symbol Table Analysis
Dumps the table of exported functions and global memory identifiers:
* **`T` / `t`**: Text / Code segment (functions like `main`).
* **`D` / `d`**: Initialized data segment (globals with non-zero initializers: `int x = 5;`).
* **`B` / `b`**: BSS segment (uninitialized globals: `int y;`). Zero-initialized by the kernel on process load.
* **`R` / `r`**: Read-only data segment (constants like `const int c = 1;` or string literals).
* **`U`**: Undefined symbols (external functions to be bound dynamically at runtime).

*Why are local function variables absent from `nm`?*  
Because local automatic variables are not statically mapped into binary file segments. They are allocated dynamically on the execution **call stack (*stack*)** during function entry and destroyed upon return.

### 2. `objdump -d <executable>`
Disassembles the executable image, displaying raw machine instructions alongside processor assembly opcodes.

### 3. `strace <executable>`
Executes a target binary, intercepting and printing **every kernel system call invoked at runtime**, including parameter arguments and return codes.
* `strace -e read ./prog < file`: filters trace to display only `read` calls.
* `strace -o trace.log ./prog`: writes trace output to a file.

Reading a 1024-byte file byte-by-byte (`read(0, &c, 1)`) incurs **1024 discrete system calls**. Each call forces a CPU transition from user to kernel mode, register saving, and scheduling overhead. In contrast, buffering with chunks of 256 bytes (`read(0, buf, 256)`) requires only **4 system calls**, executing significantly faster.

---

## 2.7 `main` Parameters: `argc` and `argv`

```c
int main(int argc, char *argv[])
```

* **`argc`**: Total count of command-line arguments provided (always $\ge 1$).
* **`argv`**: Array of null-terminated C string pointers (`char *`):
  * `argv[0]`: Invocation string or binary path (`./prog`).
  * `argv[1]` through `argv[argc - 1]`: User-supplied command parameters.
  * `argv[argc]`: Guaranteed to hold `NULL`.
* **Important**: Command arguments are **ALWAYS passed as text strings**. Calling `./prog 42` populates `argv[1]` with the ASCII string `"42"`. Explicit conversion using `atoi(argv[1])` is necessary for numeric processing.

### The Standard `Usage()` Pattern
All exam assignments require immediate parameter validation prior to performing functional logic:

```c
#include <unistd.h>
#include <stdlib.h>
#include <string.h>
#include <stdio.h>

void Usage(char *nom_prog) {
    char buf[128];
    int len = sprintf(buf, "Usage: %s <num_elements> <filename>\n", nom_prog);
    write(2, buf, len); // Channel 2: stderr (error reporting)
    exit(1);
}

int main(int argc, char *argv[]) {
    if (argc != 3) {
        Usage(argv[0]);
    }
    // Proceed with program execution...
    return 0;
}
```

---

## 2.8 Error Handling with `perror()`

POSIX system calls return `-1` upon failure, storing the exact diagnostic error code inside global variable `errno`.

* The standard function `perror(message)` (`man 3 perror`) outputs to channel 2 (`stderr`) the given string prefix followed by a human-readable description of the error corresponding to `errno`:

```c
void error_y_exit(char *msg, int exit_code) {
    perror(msg);
    exit(exit_code);
}

// Example when opening a file:
int fd = open("data.txt", O_RDONLY);
if (fd < 0) {
    error_y_exit("Failed to open file", 1);
}
```

---

## 2.9 Pointers and Memory Addresses

A **pointer** is a typed scalar variable storing a physical or virtual memory address:
* `&variable`: Retrieves the address in memory where `variable` resides.
* `*pointer`: Dereferences the pointer, accessing or mutating the value stored at that address.

```c
int a = 10;
int *p = &a; // p stores the memory address of 'a'
*p = 25;     // Modifies the value of 'a' to 25 through the pointer
```

* **Critical Pointer Pitfalls**:
  1. Dereferencing `NULL` (`int *p = NULL; *p = 5;`): generates an unhandled page fault leading to an immediate **`Segmentation Fault` (signal `SIGSEGV`)**.
  2. Dereferencing uninitialized pointers (*wild pointers*): points to arbitrary memory locations, causing non-deterministic crashes or silent data corruption.

---

## 2.10 Solved Exam Questions (Topic 2)

### 1. Why does an executable linked with `-static` occupy vastly more disk space than a dynamic binary?
Because `-static` physically embeds the compiled machine code for all referenced standard library functions (e.g., `sprintf`, `strlen`, `write`) into the binary itself. Under dynamic linking, the binary contains only lightweight relocatable stubs, with library code dynamically mapped into RAM from shared system files at launch.

### 2. To which binary segment do the following symbols belong according to `nm`: a global constant, a global initialized to 0, a global initialized to 100, and a local variable inside `main`?
* Global constant: section **`R` / `r` (*rodata*)** (read-only data).  
* Global initialized to 0: section **`B` / `b` (*bss*)** (uninitialized data segment, zeroed at process load).  
* Global initialized to 100: section **`D` / `d` (*data*)** (initialized writable data).  
* Local variable inside `main`: **Does not appear in `nm`**, as it is dynamically allocated on the execution stack (*stack*) during runtime.
