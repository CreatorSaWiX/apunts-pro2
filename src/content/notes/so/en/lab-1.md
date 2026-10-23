---
title: "Lab 1: Shell"
description: "Solved laboratory questions (Session 1)."
readTime: "7 min"
order: 1.5
draft: false
---

## Session 1 Guide: Shell and Commands

Concise answers to laboratory questions (`entrega.txt`) for the SIMLAB exam.

Packaging the submission:
:::shellviz{command="tar zcfv sessio01.tar.gz SO/entrega.txt" suggestions="tar zcfv sessio01.tar.gz SO/entrega.txt,tar ztfv sessio01.tar.gz" title="Terminal — Packaging the submission with tar"}
:::

---

## Block 1: Navigation and Directories (Q1 to Q5)

### Question 1: Create directories S1...S5
* **Command:** `mkdir S1 S2 S3 S4 S5` or brace expansion `mkdir S{1..5}`.
* **Create with parents:** `mkdir -p ~/Documents/S{1..5}` (does not fail if they already exist).

:::shellviz{command="mkdir S1 S2 S3 S4 S5" suggestions="mkdir S1 S2 S3 S4 S5,ls,mkdir -p Documents/S{1..5}" title="Terminal — Create multiple directories"}
:::

---

### Question 2: List contents and hidden files
* **Command:** `ls`
* **Hidden files:** Start with a dot `.`.
  * `-a` (*all*): Shows everything, including `.` (current) and `..` (parent).
  * `-A` (*almost all*): Shows hidden files but omits `.` and `..`.

:::shellviz{command="ls -a" suggestions="ls -a,ls,ls -A" title="Terminal — List hidden files with ls -a"}
:::

---

### Question 3: Long listing (`ls -l`) and its 7 fields
* **Option:** `-l` (*long listing format*).

:::shellviz{command="ls -l" suggestions="ls -l,ls -lh,ls -li" title="Terminal — Detailed listing format with ls -l"}
:::

| # | Field | Description | Example |
| :-: | :--- | :--- | :--- |
| 1 | **Type and permissions** | 1st char (`-` regular file, `d` directory, `l` soft link) + 3 triads `rwx` (u, g, o) | `-rwxr-xr--` |
| 2 | **Hard links** | Number of directory entries pointing to the same inode | `1` |
| 3 | **User** | Owner | `student` |
| 4 | **Group** | Associated security group | `students` |
| 5 | **Size** | Bytes (with `-lh` human-readable K, M, G) | `4096` |
| 6 | **Date and time** | Last modification timestamp | `Oct 4 12:00` |
| 7 | **Name** | File name (or `link -> target` if it is a soft link) | `main.c` |

---

### Question 4: File Browser (GUI)
* **List view**: *View as list* (*List view*).
* **Hidden files**: `Ctrl + H` or preferences checkbox.
* **Extended columns**: Enable permissions, size, type, and modification date.

---

### Question 5: Delete directory, check and recreate
* `rmdir S5` → only if the directory is **empty**.
* `ls` → check that it no longer exists.
* `mkdir S5` → recreate.
* *Non-empty directory:* `rm -r S5` (or interactive `rm -ri`).

:::shellviz{command="rmdir S5" suggestions="rmdir S5,ls,mkdir S5" title="Terminal — Delete, verify, and recreate a directory"}
:::

---

## Block 2: File Access, Processes, and Aliases (Q6 to Q8)

### Question 6: `cat` vs `less`

| Feature | `cat` (*concatenate*) | `less` (*pager*) |
| :--- | :--- | :--- |
| **Pagination** | Non-paginated. Dumps the entire content to stdout. | Interactive screen-by-screen display. |
| **Navigation** | None (only the end remains visible). | Arrows, `Space` (forward), `b` (backward), `q` (quit). |
| **Search** | Does not allow searching. | Search `/pattern`, next match with `n`. |
| **Large files** | Reads the entire file (consumes memory). | Loads only what is viewed; instantaneous for multi-GB files. |

---

### Question 7: The `-i` option of `cp` and aliases
* **Function of `-i`:** *Interactive*. Prompts for confirmation (`y/n`) before overwriting an existing file.
* **Alias:** `alias cp='cp -i'`

:::shellviz{command="alias cp='cp -i'" suggestions="alias cp='cp -i',alias" title="Terminal — Create an interactive alias for cp"}
:::

---

### Question 8: The `-i` option of `rm` and `mv`, and aliases
* **`rm -i`:** Prompts for confirmation before deleting each file.
* **`mv -i`:** Prompts for confirmation before overwriting an existing destination file.
* **Alias:** `alias rm='rm -i'`

:::shellviz{command="alias rm='rm -i'" suggestions="alias rm='rm -i',alias cp='cp -i',alias" title="Terminal — Create an interactive alias for rm"}
:::

---

## Block 3: Access Permissions and Rights (Q9)

### Question 9: `chmod`, read errors and deletion
1. **Write-only:** `chmod ugo=w test.txt` or in octal `chmod 222 test.txt`.
2. **Attempting to read (`cat test.txt`):** Returns `cat: test.txt: Permission denied` (missing `r` permission).
3. **Read-only:** `chmod ugo=r test.txt` or in octal `chmod 444 test.txt`.
4. **Can you delete (`rm test.txt`) without `w` permission on the file?** **YES**.

:::shellviz{command="chmod 222 test.txt" suggestions="chmod 222 test.txt,cat test.txt,chmod 644 test.txt,stat test.txt" title="Terminal — Practical permission check with chmod"}
:::

> **Exam Rule:** Deleting a file does **NOT** require write permission on the file itself. Deleting a file means removing its `(name, inode)` entry from the parent directory's table; hence, you only need `w+x` permissions on the **parent directory**.

---

## Block 4: Inodes and Links (Q10 to Q16)

### Question 10: Inode Information (`stat`)
* **Command:** `stat test.txt` (or `ls -li test.txt`).
* **Key fields:** `Inode:` (unique identifier), `Links:` (hard link counter), `Blocks:` (allocated blocks), `IO Block:` (FS block size, typically 4096 bytes).

:::shellviz{command="stat test.txt" suggestions="stat test.txt,ls -li test.txt,ls -i test.txt" title="Terminal — Inspect Inode information with stat"}
:::

---

### Question 11: Link count of a directory
* A newly created directory (`mkdir S1`) has exactly **2 links**:
  1. Its name in the parent directory (`Documents/S1`).
  2. The `.` entry inside itself (`Documents/S1/.`).
* **Formula with subdirectories:**
  $$\text{Directory links} = 2 + \text{number of child subdirectories}$$
  *If 3 subdirectories are created (`S1/a`, `S1/b`, `S1/c`), `S1` will have **5 links** (2 initial + 3 child `..` entries).*

:::shellviz{command="stat Documents" suggestions="stat Documents,ls -ld Documents" title="Terminal — Check directory link count"}
:::

---

### Question 12: Types of links created
* `ln test.txt hl_pr` → **Hard Link**. In `ls -l` it has type `-` (regular file).
* `ln -s test.txt sl_pr` → **Symbolic Link** (soft link). In `ls -l` it has type `l` and shows `sl_pr -> test.txt`.

:::shellviz{command="ln test.txt hl_pr" suggestions="ln test.txt hl_pr,ln -s test.txt sl_pr,ls -li" title="Terminal — Create hard and symbolic links"}
:::

---

### Question 13: Number of links and shared inodes

| File | Type | Inode | Links (`st_nlink`) |
| :--- | :--- | :--- | :---: |
| `test.txt` | Original file | **Inode X** (e.g., 1441852) | **2** |
| `hl_pr` | Hard Link | **Inode X** (same inode!) | **2** |
| `sl_pr` | Soft Link | **Inode Y** (own new inode) | **1** |

* **Meaning of the Links value:** Number of directory entries pointing directly to that inode. Content on disk is only freed when this counter reaches 0.

---

### Question 14: Behavior of `cat` and `readlink`
* **With `cat`:** Both display the contents of `test.txt` (completely transparent).
* **With `readlink`:**
  * `readlink hl_pr`: **Returns nothing** (it is a regular file).
  * `readlink sl_pr`: **Returns `test.txt`** (the target path string).
* **Exam command `namei`:** `namei -l <path>` traces step-by-step all symlinks, permissions, and directories to the destination inode.

:::shellviz{command="cat hl_pr" suggestions="cat hl_pr,cat sl_pr,readlink sl_pr" title="Terminal — Link comparison with cat and readlink"}
:::

---

### Questions 15 and 16: Deleting the original file (`rm test.txt`)

| Operation | On Hard Link (`hl_pr`) | On Soft Link (`sl_pr`) |
| :--- | :--- | :--- |
| **`cat`** | **Works** (displays intact contents). | **Fails:** `No such file or directory`. |
| **`readlink`** | Returns nothing. | Returns `test.txt` (path remains unchanged). |
| **Status** | Inode is still active; `Links` decreases from 2 to 1. | Broken link (*dangling link*). Target does not exist. |
| **Reason** | Data block is only freed when `Links == 0`. | Only stored the path string pointing to the deleted file. |

---

## Block 5: Mounted Filesystems and Storage Space (Q17 to Q19)

### Question 17: Mounted filesystems
* **Command:** `df -h` (or `mount`, or `df -T` to see filesystem types).
* **Main columns:**
  * `Filesystem`: Source device (e.g., `/dev/sda1`, `tmpfs`).
  * `Type`: FS type (e.g., `ext4`, `vfat`, `xfs`).
  * `Mounted on`: Mount point in the tree (e.g., `/`, `/home`).

:::shellviz{command="df -h" suggestions="df -h,df -i,mount" title="Terminal — Inspect mounted filesystems"}
:::

---

### Question 18: Free inodes count
* **Command:** `df -i` (or `df -ih`).
* **Key column:** **`IFree`** (*Inodes Free*). Indicates how many inodes are available to create new files.

:::shellviz{command="df -i" suggestions="df -i,df -h" title="Terminal — Free inodes with df -i"}
:::

---

### Question 19: Free disk space
* **Command:** `df -h` (`-h` = human-readable units K, M, G).
* **Key column:** **`Avail`** (*Available*). Free bytes available for regular users.

---

## Block 6: Environment Variables and PATH (Q20 to Q26)

### Question 20: Meaning of PATH, HOME, and PWD
* **`HOME`**: Absolute path to the user's home directory (`~`).
* **`PWD`**: Current working directory (*Print Working Directory*). Updated via `cd`.
* **`PATH`**: Ordered list of directories searched by the Shell to find external command binaries.

---

### Question 21: Separator character in PATH
* The separator is the **colon (`:`)**.

:::shellviz{command="echo $PATH" suggestions="echo $PATH,echo $HOME,echo $PWD" title="Terminal — Inspect the PATH variable"}
:::

---

### Question 22: Defining and inspecting variables
* **Define and export:** `export VAR1="valor1"`
* **Inspect:** `echo $VAR1`
* **List all:** `env`

:::shellviz{command="export VAR1=\"valor1\"" suggestions="export VAR1=\"valor1\",echo $VAR1,env" title="Terminal — Define and inspect environment variables"}
:::

---

### Questions 23 to 26: Search order in PATH and security

Assuming a custom executable `./ls` in the current directory and an original PATH `/usr/bin:/bin`:

| Command / Configuration | Which `ls` is executed? | Verification `which ls` | Reason |
| :--- | :--- | :--- | :--- |
| **`ls`** (original) | System (`/usr/bin/ls`) | `/usr/bin/ls` | `.` is not in the original PATH. |
| **`./ls`** | Local | (explicit execution) | Explicit path: PATH is not consulted. |
| **`export PATH=.:$PATH`** | **Local (`./ls`)** | `./ls` | The Shell searches left to right; finds `.` before `/usr/bin`. |
| **`export PATH=$PATH:.`** | **System (`/usr/bin/ls`)** | `/usr/bin/ls` | Finds `/usr/bin/ls` before reaching trailing `.` in PATH. |

:::shellviz{command="which ls" suggestions="which ls,type ls" title="Terminal — Command resolution with which"}
:::

> **Question 24 (Security Risk):** Adding `.` to PATH poses a critical **Trojan / Spoofing** vulnerability. If an attacker places a malicious binary named `ls` or `cd` in a world-writable directory (like `/tmp`), an administrator entering that folder and running `ls` would unknowingly execute malicious code.

---

## Block 7: Output Redirections (Q27)

### Question 27: Difference between `>` and `>>`

| Operator | Name | If file already exists | If file does NOT exist |
| :---: | :--- | :--- | :--- |
| **`>`** | Overwrite (*Truncate*) | **Truncates to 0 bytes** and writes from the beginning. | Creates file and writes. |
| **`>>`** | Append (*Append*) | **Preserves previous content** and appends to end. | Creates file and writes. |

:::shellviz{command="ls -l > llista.txt" suggestions="ls -l > llista.txt,cat llista.txt,echo 'Nova línia' >> llista.txt" title="Terminal — Testing > and >> redirections"}
:::

* **Classic exam example:**
  ```bash
  ls > out
  date > out
  echo fin >> out
  ```
  *What does `out` contain at the end?* The output of `date` followed by the line `fin`. The output of `ls` was completely lost due to the second `>`.
