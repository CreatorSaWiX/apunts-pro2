---
title: "Lab 1: Shell"
description: "Preguntes de laboratori resoltes (Sessió 1)."
readTime: "7 min"
order: 1.5
draft: false
---

## Guia de la sessió 1: shell i comandes

Respostes concises a les preguntes del laboratori (`entrega.txt`) per a l'examen SIMLAB.

Empaquetar l'entrega:
:::shellviz{command="tar zcfv sessio01.tar.gz SO/entrega.txt" suggestions="tar zcfv sessio01.tar.gz SO/entrega.txt,tar ztfv sessio01.tar.gz" title="Terminal — Empaquetar l'entrega amb tar"}
:::

---

## Bloc 1: Navegació i directoris (P1 a P5)

### Pregunta 1: Crear directoris S1...S5
* **Comanda:** `mkdir S1 S2 S3 S4 S5` o expansió de claus `mkdir S{1..5}`.
* **Crear amb pares:** `mkdir -p ~/Documents/S{1..5}` (no falla si ja existeixen).

:::shellviz{command="mkdir S1 S2 S3 S4 S5" suggestions="mkdir S1 S2 S3 S4 S5,ls,mkdir -p Documents/S{1..5}" title="Terminal — Crear múltiples directoris"}
:::

---

### Pregunta 2: Llistar contingut i fitxers ocults
* **Comanda:** `ls`
* **Fitxers ocults:** Comencen per punt `.`.
  * `-a` (*all*): Mostra tot, incloent `.` (actual) i `..` (pare).
  * `-A` (*almost all*): Mostra ocults però omet `.` i `..`.

:::shellviz{command="ls -a" suggestions="ls -a,ls,ls -A" title="Terminal — Llistar fitxers ocults amb ls -a"}
:::

---

### Pregunta 3: Llistat estès (`ls -l`) i els seus 7 camps
* **Opció:** `-l` (*long listing format*).

:::shellviz{command="ls -l" suggestions="ls -l,ls -lh,ls -li" title="Terminal — Format de llistat detallat amb ls -l"}
:::

| # | Camp | Descripció | Exemple |
| :-: | :--- | :--- | :--- |
| 1 | **Tipus i permisos** | 1r caràcter (`-` fitxer, `d` dir, `l` soft link) + 3 tríades `rwx` (u, g, o) | `-rwxr-xr--` |
| 2 | **Hard links** | Nombre d'entrades que apunten al mateix inode | `1` |
| 3 | **Usuari** | Propietari (*owner*) | `alumne` |
| 4 | **Grup** | Grup de seguretat associat | `estudiants` |
| 5 | **Mida** | Bytes (amb `-lh` format humà K, M, G) | `4096` |
| 6 | **Data i hora** | Timestamp de l'última modificació de dades | `Oct 4 12:00` |
| 7 | **Nom** | Nom del fitxer (o `enllac -> desti` si és soft link) | `main.c` |

---

### Pregunta 4: File Browser (GUI)
* **Vista de llista**: *Veure com a llista* (*List view*).
* **Fitxers ocults**: `Ctrl + H` o casella de preferències.
* **Columnes exteses**: Activar permisos, mida, tipus i data de modificació.

---

### Pregunta 5: Esborrar directori, comprovar i recrear
* `rmdir S5` → només si el directori és **buit**.
* `ls` → comprovar que no existeix.
* `mkdir S5` → recrear.
* *Directori no buit:* `rm -r S5` (o `rm -ri` interactiu).

:::shellviz{command="rmdir S5" suggestions="rmdir S5,ls,mkdir S5" title="Terminal — Esborrar, verificar i recrear un directori"}
:::

---

## Bloc 2: Accés a fitxers, processos i àlies (P6 a P8)

### Pregunta 6: `cat` vs `less`

| Característica | `cat` (*concatenate*) | `less` (*pager*) |
| :--- | :--- | :--- |
| **Paginació** | No paginat. Aboca tot el contingut a stdout. | Pantalla a pantalla de forma interactiva. |
| **Navegació** | Cap (només queda visible el final). | Fletxes, `Espai` (avançar), `b` (retrocedir), `q` (sortir). |
| **Cerca** | No permet cerques. | Cercar `/patró`, següent coincidència amb `n`. |
| **Fitxers grans** | Llegeix el fitxer sencer (bloqueja memòria). | Carrega només el que veus; instantani per fitxers de GBs. |

---

### Pregunta 7: Opció `-i` de `cp` i àlies
* **Funció `-i`:** *Interactive*. Demana confirmació (`y/n`) abans de sobreescriure un fitxer existent.
* **Àlies:** `alias cp='cp -i'`

:::shellviz{command="alias cp='cp -i'" suggestions="alias cp='cp -i',alias" title="Terminal — Crear un àlies interactiu per a cp"}
:::

---

### Pregunta 8: Opció `-i` de `rm` i `mv`, i àlies
* **`rm -i`:** Demana confirmació abans d'esborrar cada fitxer.
* **`mv -i`:** Demana confirmació abans de sobreescriure un fitxer existent al destí.
* **Àlies:** `alias rm='rm -i'`

:::shellviz{command="alias rm='rm -i'" suggestions="alias rm='rm -i',alias cp='cp -i',alias" title="Terminal — Crear un àlies interactiu per a rm"}
:::

---

## Bloc 3: Permisos d'accés i drets (P9)

### Pregunta 9: `chmod`, errors de lectura i esborrat
1. **Només escriptura:** `chmod ugo=w test.txt` o en octal `chmod 222 test.txt`.
2. **Intentar llegir (`cat test.txt`):** Retorna `cat: test.txt: Permission denied` (falta permís `r`).
3. **Només lectura:** `chmod ugo=r test.txt` o en octal `chmod 444 test.txt`.
4. **Es pot esborrar (`rm test.txt`) sense permís `w` sobre el fitxer?** **SÍ**.

:::shellviz{command="chmod 222 test.txt" suggestions="chmod 222 test.txt,cat test.txt,chmod 644 test.txt,stat test.txt" title="Terminal — Comprovació pràctica de permisos amb chmod"}
:::

> **Regla d'examen:** Esborrar un fitxer **NO** demana permís d'escriptura sobre el fitxer. Eliminar un fitxer és esborrar la seva entrada `(nom, inode)` de la taula del directori pare; per tant, només cal permís `w+x` sobre el **directori pare**.

---

## Bloc 4: Inodes i enllaços (P10 a P16)

### Pregunta 10: Informació d'inode (`stat`)
* **Comanda:** `stat test.txt` (o `ls -li test.txt`).
* **Camps claus:** `Inode:` (identificador únic), `Links:` (comptador d'enllaços durs), `Blocks:` (blocs assignats), `IO Block:` (mida de bloc del FS, típicament 4096 bytes).

:::shellviz{command="stat test.txt" suggestions="stat test.txt,ls -li test.txt,ls -i test.txt" title="Terminal — Consultar informació de l'Inode amb stat"}
:::

---

### Pregunta 11: Comptador d'enllaços d'un directori
* Un directori acabat de crear (`mkdir S1`) té exactament **2 links**:
  1. El seu nom dins del directori pare (`Documents/S1`).
  2. L'entrada `.` dins d'ell mateix (`Documents/S1/.`).
* **Fórmula amb subdirectoris:**
  $$\text{Links de dir} = 2 + \text{número de subdirectoris fills}$$
  *Si es creen 3 subdirectoris (`S1/a`, `S1/b`, `S1/c`), `S1` passa a tenir **5 links** (2 inicials + 3 entrades `..` dels fills).*

:::shellviz{command="stat Documents" suggestions="stat Documents,ls -ld Documents" title="Terminal — Comprovar el comptador d'enllaços d'un directori"}
:::

---

### Pregunta 12: Tipus d'enllaços creats
* `ln test.txt hl_pr` → **Hard Link** (enllaç dur). A `ls -l` té tipus `-` (fitxer regular).
* `ln -s test.txt sl_pr` → **Symbolic Link** (soft link). A `ls -l` té tipus `l` i mostra `sl_pr -> test.txt`.

:::shellviz{command="ln test.txt hl_pr" suggestions="ln test.txt hl_pr,ln -s test.txt sl_pr,ls -li" title="Terminal — Crear enllaços durs i simbòlics"}
:::

---

### Pregunta 13: Nombre d'enllaços i inodes compartits

| Fitxer | Tipus | Inode | Links (`st_nlink`) |
| :--- | :--- | :--- | :---: |
| `test.txt` | Fitxer original | **Inode X** (ex: 1441852) | **2** |
| `hl_pr` | Hard Link | **Inode X** (mateix inode!) | **2** |
| `sl_pr` | Soft Link | **Inode Y** (nou inode propi) | **1** |

* **Significat del valor Links:** Nombre d'entrades de directori que apunten directament a aquell inode. El contingut a disc només s'allibera quan aquest comptador arriba a 0.

---

### Pregunta 14: Comportament de `cat` i `readlink`
* **Amb `cat`:** Ambdós mostren el contingut de `test.txt` (transparència total).
* **Amb `readlink`:**
  * `readlink hl_pr`: **No retorna res** (és un fitxer regular).
  * `readlink sl_pr`: **Retorna `test.txt`** (el text de la ruta de destí).
* **Comanda d'examen `namei`:** `namei -l <ruta>` ressegueix pas a pas tots els enllaços, permisos i directoris fins a l'inode real.

:::shellviz{command="cat hl_pr" suggestions="cat hl_pr,cat sl_pr,readlink sl_pr" title="Terminal — Comparació d'enllaços amb cat i readlink"}
:::

---

### Preguntes 15 i 16: Esborrar el fitxer original (`rm test.txt`)

| Operació | Sobre Hard Link (`hl_pr`) | Sobre Soft Link (`sl_pr`) |
| :--- | :--- | :--- |
| **`cat`** | **Funciona** (mostra el contingut intacte). | **Falla:** `No such file or directory`. |
| **`readlink`** | No retorna res. | Retorna `test.txt` (ruta intacta). |
| **Estat** | Inode segueix viu; `Links` baixa de 2 a 1. | Enllaç trencat (*dangling link*). Destí no existeix. |
| **Motiu** | El bloc de dades només s'allibera si `Links == 0`. | Només guardava el nom de la ruta cap a l'arxiu esborrat. |

---

## Bloc 5: Sistemes de fitxers muntats i espai (P17 a P19)

### Pregunta 17: Sistemes de fitxers muntats
* **Comanda:** `df -h` (o `mount`, o `df -T` per veure el tipus).
* **Columnes principals:**
  * `Filesystem`: Dispositiu font (ex: `/dev/sda1`, `tmpfs`).
  * `Type`: Tipus de FS (ex: `ext4`, `vfat`, `xfs`).
  * `Mounted on`: Punt de muntatge a l'arbre (ex: `/`, `/home`).

:::shellviz{command="df -h" suggestions="df -h,df -i,mount" title="Terminal — Consultar sistemes de fitxers muntats"}
:::

---

### Pregunta 18: Nombre d'inodes lliures
* **Comanda:** `df -i` (o `df -ih`).
* **Columna clau:** **`IFree`** (*Inodes Free*). Indica quants inodes queden per crear fitxers.

:::shellviz{command="df -i" suggestions="df -i,df -h" title="Terminal — Inodes lliures amb df -i"}
:::

---

### Pregunta 19: Espai lliure a disc
* **Comanda:** `df -h` (`-h` = unitats humanes K, M, G).
* **Columna clau:** **`Avail`** (*Available*). Bytes lliures disponibles per a usuaris.

---

## Bloc 6: Variables d'entorn i el PATH (P20 a P26)

### Pregunta 20: Significat de PATH, HOME i PWD
* **`HOME`**: Ruta absoluta al directori personal de l'usuari (`~`).
* **`PWD`**: Directori de treball actual (*Print Working Directory*). S'actualitza amb `cd`.
* **`PATH`**: Llista de directoris on la Shell busca els binaris de comandes externes.

---

### Pregunta 21: Caràcter separador del PATH
* El separador és el **dos punts (`:`)**.

:::shellviz{command="echo $PATH" suggestions="echo $PATH,echo $HOME,echo $PWD" title="Terminal — Consultar la variable PATH"}
:::

---

### Pregunta 22: Definir i consultar variables
* **Definir i exportar:** `export VAR1="valor1"`
* **Consultar:** `echo $VAR1`
* **Llistar totes:** `env`

:::shellviz{command="export VAR1=\"valor1\"" suggestions="export VAR1=\"valor1\",echo $VAR1,env" title="Terminal — Definir i consultar variables d'entorn"}
:::

---

### Preguntes 23 a 26: Ordre de cerca del PATH i seguretat

Suposant un executable propi `./ls` al directori actual i PATH original `/usr/bin:/bin`:

| Comanda / Configuració | Quin `ls` s'executa? | Comprovació `which ls` | Motiu |
| :--- | :--- | :--- | :--- |
| **`ls`** (original) | Sistema (`/usr/bin/ls`) | `/usr/bin/ls` | `.` no és al PATH original. |
| **`./ls`** | Local | (execució explícita) | Ruta explícita: no es consulta el PATH. |
| **`export PATH=.:$PATH`** | **Local (`./ls`)** | `./ls` | La Shell cerca d'esquerra a dreta; troba `.` abans que `/usr/bin`. |
| **`export PATH=$PATH:.`** | **Sistema (`/usr/bin/ls`)** | `/usr/bin/ls` | Troba `/usr/bin/ls` abans d'arribar al final `.` del PATH. |

:::shellviz{command="which ls" suggestions="which ls,type ls" title="Terminal — Resolució de comandes amb which"}
:::

> **Pregunta 24 (Risc de seguretat):** Posar `.` al PATH és un perill greu de **Trojan / Spoofing**. Si un atacant col·loca un binari maliciós anomenat `ls` o `cd` en un directori públic (com `/tmp`), un administrador que hi entri i teclegi `ls` executaria codi maliciós sense adonar-se'n.

---

## Bloc 7: Redireccions de sortida (P27)

### Pregunta 27: Diferència entre `>` i `>>`

| Operador | Nom | Si el fitxer ja existeix | Si el fitxer NO existeix |
| :---: | :--- | :--- | :--- |
| **`>`** | Sobreescriptura (*Truncate*) | **Trunca a 0 bytes** i escriu des de l'inici. | Crea el fitxer i escriu. |
| **`>>`** | Afegir (*Append*) | **Conserva el contingut previ** i escriu al final. | Crea el fitxer i escriu. |

:::shellviz{command="ls -l > llista.txt" suggestions="ls -l > llista.txt,cat llista.txt,echo 'Nova línia' >> llista.txt" title="Terminal — Prova les redireccions > i >>"}
:::

* **Exemple clàssic d'examen:**
  ```bash
  ls > out
  date > out
  echo fin >> out
  ```
  *Què conté `out` al final?* La sortida de `date` i la línia `fin`. La sortida de `ls` s'ha perdut completament pel segon `>`.
