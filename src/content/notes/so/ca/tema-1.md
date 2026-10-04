---
title: "Tema 1: Shell"
description: "Comandes, fitxers i permisos."
readTime: "15 min"
order: 1
draft: false
---

## 1.1 Shell i REPL

**Shell** = interfície text usuari ↔ Kernel. Per defecte: **Bash**.  Funciona en bucle infinit: llegeix → executa → espera.

```c [shell_loop.c]
while (1) {
    comanda = llegir_comanda();
    executar_comanda(comanda);
}
```

| Tipus | Execució | Exemples | Ajuda |
| :--- | :--- | :--- | :--- |
| **Interna** (*built-in*) | Dins el mateix procés Shell (sense `fork`) | `cd`, `export`, `alias`, `exit`, `echo` | `help <cmd>` |
| **Externa** | La Shell fa `fork` + `exec` per executar-la | `ls`, `mkdir`, `cp`, `rm`, `grep` | `man <cmd>` |

`type <cmd>` → diu si és interna o externa.

:::shellviz{command="type cd" suggestions="type cd,type ls" title="Terminal — Comprovar si una comanda és interna o externa"}
:::

---

## 1.2 Manual `man`

`man <N> <nom>` → cerca a la secció N. Seccions clau:

:::shellviz{command="man write" suggestions="man write,man 2 write" title="Terminal — Consultar el manual de write (secció 1 vs 2)"}
:::

| Secció | Contingut | Exemples |
| :---: | :--- | :--- |
| **1** | Comandes d'usuari | `ls`, `cp`, `man` |
| **2** | Crides a sistema (kernel) | `fork`, `write`, `open` |
| **3** | Funcions de biblioteca C | `printf`, `sprintf`, `strlen` |

`man write` → secció 1 (comanda). `man 2 write` → crida a sistema. Sempre especifica la secció!

**Navegació dins de `man`:** `Espai` avança · `b` retrocedeix · `/patró` cerca · `n` següent · `q` surt.

---

## 1.3 Sistema de Fitxers UNIX

Un únic arbre des de `/` (no hi ha lletres de disc com a Windows).

```text
/
├── etc/       configuració del sistema
├── home/      directoris d'usuaris ($HOME)
├── dev/       fitxers de dispositius
└── usr/bin/   programes d'usuari (ls, grep…)
```

* **Absolut**: comença per `/` → ex: `/home/alumne/S1`
* **Relatiu**: comença pel directori actual → ex: `../S2`, `Documents/S1`
* `.` = directori actual · `..` = directori pare
* Fitxers ocults = comencen per `.` (ex: `.bashrc`) → `ls -a` per veure'ls

**Comandes clau:**

| Comanda | Funció | Flags importants |
| :--- | :--- | :--- |
| `pwd` | Mostra ruta actual | — |
| `cd <dir>` | Canvia directori | `cd` → HOME · `cd -` → anterior |
| `ls` | Llista contingut | `-a` ocults · `-l` detall · `-i` inodes · `-h` mides |
| `mkdir` | Crea directori | `-p` crea pares intermedis |
| `rmdir` | Esborra dir buit | — |
| `cp <o> <d>` | Copia | `-i` confirma · `-r` recursiu |
| `mv <o> <d>` | Mou / reanomena | `-i` confirma |
| `rm <f>` | Elimina fitxer | `-i` confirma · `-r` recursiu · `-f` força |

---

## 1.4 Inodes i Blocs de Dades

Un fitxer = **Inode** (DNI del fitxer) + **contingut real** (el text, la foto, el programa).

**Inode conté:** mida, propietari, grup, permisos, dates, nombre d'enllaços, punters als blocs. **L'Inode NO sap com es diu el fitxer.** Per al sistema, una carpeta o directori és només una llibreta que associa noms amb números d'inode:
("apunts.txt" → Inode 1441852). El directori és una taula `(nom → nº inode)`.

`stat <fitxer>` → mostra tota la informació de l'inode (mida, blocs, inode nº, Links…).

**Comptador de Links d'un directori:** Un directori nou té **2 links** (l'entrada al pare + `.` intern). Cada subdirectori fill afegeix +1 (per l'entrada `..` del fill).

:::shellviz{command="stat test.txt" suggestions="stat test.txt,stat Documents" title="Terminal — Consultar les metadades de l'Inode amb stat"}
:::

---

## 1.5 Hard links vs soft links

`ln fitxer enllac` → Hard link · `ln -s fitxer enllac` → soft link (o symbolic link)

Quan crees un **Hard Link** (`ln document.txt copia_hl`), no es crea cap fitxer nou ni es dupliquen les dades al disc. Només s'escriu una segona línia a la llibreta del directori:

```text
"document.txt" → Inode 1441852
"copia_hl"     → Inode 1441852
```

El comptador d'enllaços (Links) de l'inode passa de 1 a 2. Si fas `rm document.txt`, només esborres el primer nom de la llibreta. El comptador baixa a 1. Com que encara no és 0, les dades NO s'esborren. Si fas `cat copia_hl`, el fitxer segueix perfectament viu i intacte.

Quan crees un **Soft Link** (ln -s document.txt `drecera_sl`) es crea un fitxer nou, amb un Inode nou i diferent (ex: 1441999). Dins aquest fitxer nou només guarda un text amb la ruta: "document.txt". Quan obres `drecera_sl`, el sistema llegeix la ruta que té escrita i diu: "D'acord, vaig a buscar document.txt".
Si fas `rm document.txt`, el fitxer original desapareix. `drecera_sl` continua existint, però el seu text apunta a un nom que ja no existeix al disc.
És un enllaç trencat (dangling link): si fas cat `drecera_sl`, et donarà error cat: `drecera_sl`: No such file or directory.

| | **Hard Link** | **Soft Link** |
| :--- | :--- | :--- |
| **Inode** | Igual que l'original (compartit) | Inode propi i diferent |
| **Links count** | Incrementa en 1 el de l'inode compartit | Sempre 1 (propi) |
| **Si s'esborra l'original** | Les dades **sobreviuen** (comptador baixa a 1, no a 0) | Queda **trencat** (*dangling*) → `No such file or directory` |
| **Pot apuntar a directoris?** | ❌ No | ✅ Sí |
| **Pot creuar particions?** | ❌ No (inodes locals) | ✅ Sí |

```text
[ pr.txt ] ──> [ Inode 1441852 ] <── [ hl_pr ]
                      │
                 [ Dades disc ]
                      ▲
[ sl_pr ] ────────────┘  (inode propi, dades="pr.txt")
```

**Eines d'inspecció:**
* `readlink <sl>` → mostra el text de la ruta destí (no retorna res si és hard link).
* `namei -l <ruta>` → desglossa pas a pas la ruta (dirs, links, permisos) fins a l'inode final.

---

## 1.6 Permisos d'Accés

```text
- r w x r - x r - -
┬ ─u─ ─g─ ─o─
└── Tipus: '-' fitxer · 'd' directori · 'l' soft link
```

| Permís | Octal | Sobre fitxer | Sobre directori |
| :---: | :---: | :--- | :--- |
| `r` | 4 | Llegir contingut | `ls` (llistar noms) |
| `w` | 2 | Modificar contingut | Crear/esborrar/reanomenar fitxers dins |
| `x` | 1 | Executar | `cd` (entrar/travessar) |

> **Esborrar un fitxer** no requereix `w` sobre el fitxer sinó `w+x` sobre el **directori pare** (esborrar = treure l'entrada `(nom,inode)` de la llista del directori).

**`chmod`:**
* Simbòlic: `chmod u=rw,go=r fitxer` · `chmod a-x fitxer`
* Octal: `chmod 755 fitxer` → `rwxr-xr-x` · `chmod 644` → `rw-r--r--`

:::shellviz{command="chmod u+x SO/lab1.sh" suggestions="chmod u+x SO/lab1.sh,chmod 755 SO/lab1.sh,ls -l SO" title="Terminal — Prova canviar permisos amb chmod"}
:::

---

## 1.7 Variables d'Entorn i `$PATH`

Variables d'entorn = parells clau-valor heretats de pare a fill en cada `fork`.

* `env` / `printenv` → llistar totes · `echo $VAR` → valor concret
* `export VAR="valor"` → disponible als processos fills · `source ~/.bashrc` → recarrega configuració

**Variables clau:**

| Variable | Significat |
| :--- | :--- |
| `$HOME` | Ruta directori personal (`/home/alumne`) |
| `$PWD` | Directori de treball actual |
| `$USER` | Nom d'usuari de la sessió |
| `$PATH` | Llista de dirs (separats per `:`) on cercar binaris |

**`$PATH` i ordre de cerca** (d'esquerra a dreta, s'atura al primer binari trobat):
* `export PATH=.:$PATH` → `.` al principi: **PERILL** → un atacant podria posar un binari fals `ls` al directori actual.
* `export PATH=$PATH:.` → `.` al final: el `ls` del sistema s'executa sempre primer.
* `which <cmd>` → mostra el path exacte del binari que s'executarà.

:::shellviz{command="echo $PATH" suggestions="echo $PATH,echo $USER,env" title="Terminal — Consultar variables d'entorn"}
:::

---

## 1.8 Redireccions, Background i Globbing

**Redireccions I/O:**
* `>` → **sobreescriu** (trunca a 0 bytes o crea el fitxer)
* `>>` → **afegeix** al final (conserva el contingut previ)

**Background:**
* `gedit test &` → executa en segon pla; Shell retorna el prompt immediatament mostrant el PID.

**Globbing (comodins):**
* `*` → zero o més caràcters · `?` → exactament un caràcter
* **L'expansió la fa la Shell ABANS de cridar la comanda.** El programa mai veu el `*`; rep la llista de fitxers expandida per `argv`.
  * Ex: `grep hola t*` → Shell substitueix `t*` per `t1.txt t2.c` → `grep` rep `hola t1.txt t2.c`.
  * Si cap fitxer coincideix → la Shell passa la cadena literal `"t*"`.

**Espai en disc / inodes:**
* `df -h` → espai lliure de cada partició (columna `Avail`).
* `df -i` → inodes lliures (columna `IFree`).
* `mount` → sistemes de fitxers muntats i el seu punt de muntatge.

:::shellviz{command="ls -l > llista.txt" suggestions="ls -l > llista.txt,cat llista.txt,echo 'Nova línia' >> llista.txt" title="Terminal — Prova les redireccions > i >>"}
:::