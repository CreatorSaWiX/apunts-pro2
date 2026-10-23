---
title: "Lab 1: Shell"
description: "Preguntas de laboratorio resueltas (Sesión 1)."
readTime: "7 min"
order: 1.5
draft: false
---

## Guía de la sesión 1: shell y comandos

Respuestas concisas a las preguntas del laboratorio (`entrega.txt`) para el examen SIMLAB.

Empaquetar la entrega:
:::shellviz{command="tar zcfv sessio01.tar.gz SO/entrega.txt" suggestions="tar zcfv sessio01.tar.gz SO/entrega.txt,tar ztfv sessio01.tar.gz" title="Terminal — Empaquetar la entrega con tar"}
:::

---

## Bloque 1: Navegación y directorios (P1 a P5)

### Pregunta 1: Crear directorios S1...S5
* **Comando:** `mkdir S1 S2 S3 S4 S5` o expansión de llaves `mkdir S{1..5}`.
* **Crear con padres:** `mkdir -p ~/Documents/S{1..5}` (no falla si ya existen).

:::shellviz{command="mkdir S1 S2 S3 S4 S5" suggestions="mkdir S1 S2 S3 S4 S5,ls,mkdir -p Documents/S{1..5}" title="Terminal — Crear múltiples directorios"}
:::

---

### Pregunta 2: Listar contenido y archivos ocultos
* **Comando:** `ls`
* **Archivos ocultos:** Empiezan por punto `.`.
  * `-a` (*all*): Muestra todo, incluyendo `.` (actual) y `..` (padre).
  * `-A` (*almost all*): Muestra ocultos pero omite `.` y `..`.

:::shellviz{command="ls -a" suggestions="ls -a,ls,ls -A" title="Terminal — Listar archivos ocultos con ls -a"}
:::

---

### Pregunta 3: Listado extendido (`ls -l`) y sus 7 campos
* **Opción:** `-l` (*long listing format*).

:::shellviz{command="ls -l" suggestions="ls -l,ls -lh,ls -li" title="Terminal — Formato de listado detallado con ls -l"}
:::

| # | Campo | Descripción | Ejemplo |
| :-: | :--- | :--- | :--- |
| 1 | **Tipo y permisos** | 1er carácter (`-` archivo, `d` dir, `l` soft link) + 3 tríadas `rwx` (u, g, o) | `-rwxr-xr--` |
| 2 | **Hard links** | Número de entradas que apuntan al mismo inodo | `1` |
| 3 | **Usuario** | Propietario (*owner*) | `alumno` |
| 4 | **Grupo** | Grupo de seguridad asociado | `estudiantes` |
| 5 | **Tamaño** | Bytes (con `-lh` formato humano K, M, G) | `4096` |
| 6 | **Fecha y hora** | Marca temporal de la última modificación de datos | `Oct 4 12:00` |
| 7 | **Nombre** | Nombre del archivo (o `enlace -> destino` si es soft link) | `main.c` |

---

### Pregunta 4: File Browser (GUI)
* **Vista de lista**: *Ver como lista* (*List view*).
* **Archivos ocultos**: `Ctrl + H` o casilla de preferencias.
* **Columnas extendidas**: Activar permisos, tamaño, tipo y fecha de modificación.

---

### Pregunta 5: Borrar directorio, comprobar y recrear
* `rmdir S5` → solo si el directorio está **vacío**.
* `ls` → comprobar que no existe.
* `mkdir S5` → recrear.
* *Directorio no vacío:* `rm -r S5` (o `rm -ri` interactivo).

:::shellviz{command="rmdir S5" suggestions="rmdir S5,ls,mkdir S5" title="Terminal — Borrar, verificar y recrear un directorio"}
:::

---

## Bloque 2: Acceso a archivos, procesos y alias (P6 a P8)

### Pregunta 6: `cat` vs `less`

| Característica | `cat` (*concatenate*) | `less` (*pager*) |
| :--- | :--- | :--- |
| **Paginación** | No paginado. Vuelca todo el contenido a stdout. | Pantalla a pantalla de forma interactiva. |
| **Navegación** | Ninguna (solo queda visible el final). | Flechas, `Espacio` (avanzar), `b` (retroceder), `q` (salir). |
| **Búsqueda** | No permite búsquedas. | Buscar `/patrón`, siguiente coincidencia con `n`. |
| **Archivos grandes** | Lee el archivo entero (bloquea memoria). | Carga solo lo que ves; instantáneo para archivos de GBs. |

---

### Pregunta 7: Opción `-i` de `cp` y alias
* **Función `-i`:** *Interactive*. Pide confirmación (`y/n`) antes de sobrescribir un archivo existente.
* **Alias:** `alias cp='cp -i'`

:::shellviz{command="alias cp='cp -i'" suggestions="alias cp='cp -i',alias" title="Terminal — Crear un alias interactivo para cp"}
:::

---

### Pregunta 8: Opción `-i` de `rm` y `mv`, y alias
* **`rm -i`:** Pide confirmación antes de borrar cada archivo.
* **`mv -i`:** Pide confirmación antes de sobrescribir un archivo existente en el destino.
* **Alias:** `alias rm='rm -i'`

:::shellviz{command="alias rm='rm -i'" suggestions="alias rm='rm -i',alias cp='cp -i',alias" title="Terminal — Crear un alias interactivo para rm"}
:::

---

## Bloque 3: Permisos de acceso y derechos (P9)

### Pregunta 9: `chmod`, errores de lectura y borrado
1. **Solo escritura:** `chmod ugo=w test.txt` o en octal `chmod 222 test.txt`.
2. **Intentar leer (`cat test.txt`):** Devuelve `cat: test.txt: Permission denied` (falta permiso `r`).
3. **Solo lectura:** `chmod ugo=r test.txt` o en octal `chmod 444 test.txt`.
4. **¿Se puede borrar (`rm test.txt`) sin permiso `w` sobre el archivo?** **SÍ**.

:::shellviz{command="chmod 222 test.txt" suggestions="chmod 222 test.txt,cat test.txt,chmod 644 test.txt,stat test.txt" title="Terminal — Comprobación práctica de permisos con chmod"}
:::

> **Regla de examen:** Borrar un archivo **NO** requiere permiso de escritura sobre el archivo. Eliminar un archivo es borrar su entrada `(nombre, inodo)` de la tabla del directorio padre; por lo tanto, solo hace falta permiso `w+x` sobre el **directorio padre**.

---

## Bloque 4: Inodos y enlaces (P10 a P16)

### Pregunta 10: Información de inodo (`stat`)
* **Comando:** `stat test.txt` (o `ls -li test.txt`).
* **Campos clave:** `Inode:` (identificador único), `Links:` (contador de enlaces duros), `Blocks:` (bloques asignados), `IO Block:` (tamaño de bloque del FS, típicamente 4096 bytes).

:::shellviz{command="stat test.txt" suggestions="stat test.txt,ls -li test.txt,ls -i test.txt" title="Terminal — Consultar información del inodo con stat"}
:::

---

### Pregunta 11: Contador de enlaces de un directorio
* Un directorio recién creado (`mkdir S1`) tiene exactamente **2 links**:
  1. Su nombre dentro del directorio padre (`Documents/S1`).
  2. La entrada `.` dentro de sí mismo (`Documents/S1/.`).
* **Fórmula con subdirectorios:**
  $$\text{Links de dir} = 2 + \text{número de subdirectorios hijos}$$
  *Si se crean 3 subdirectorios (`S1/a`, `S1/b`, `S1/c`), `S1` pasa a tener **5 links** (2 iniciales + 3 entradas `..` de los hijos).*

:::shellviz{command="stat Documents" suggestions="stat Documents,ls -ld Documents" title="Terminal — Comprobar el contador de enlaces de un directorio"}
:::

---

### Pregunta 12: Tipos de enlaces creados
* `ln test.txt hl_pr` → **Hard Link** (enlace duro). En `ls -l` tiene tipo `-` (archivo regular).
* `ln -s test.txt sl_pr` → **Symbolic Link** (soft link). En `ls -l` tiene tipo `l` y muestra `sl_pr -> test.txt`.

:::shellviz{command="ln test.txt hl_pr" suggestions="ln test.txt hl_pr,ln -s test.txt sl_pr,ls -li" title="Terminal — Crear enlaces duros y simbólicos"}
:::

---

### Pregunta 13: Número de enlaces e inodos compartidos

| Archivo | Tipo | Inodo | Links (`st_nlink`) |
| :--- | :--- | :--- | :---: |
| `test.txt` | Archivo original | **Inode X** (ej: 1441852) | **2** |
| `hl_pr` | Hard Link | **Inode X** (¡mismo inodo!) | **2** |
| `sl_pr` | Soft Link | **Inode Y** (nuevo inodo propio) | **1** |

* **Significado del valor Links:** Número de entradas de directorio que apuntan directamente a ese inodo. El contenido en disco solo se libera cuando este contador llega a 0.

---

### Pregunta 14: Comportamiento de `cat` y `readlink`
* **Con `cat`:** Ambos muestran el contenido de `test.txt` (transparencia total).
* **Con `readlink`:**
  * `readlink hl_pr`: **No devuelve nada** (es un archivo regular).
  * `readlink sl_pr`: **Devuelve `test.txt`** (el texto de la ruta de destino).
* **Comando de examen `namei`:** `namei -l <ruta>` sigue paso a paso todos los enlaces, permisos y directorios hasta el inodo real.

:::shellviz{command="cat hl_pr" suggestions="cat hl_pr,cat sl_pr,readlink sl_pr" title="Terminal — Comparación de enlaces con cat y readlink"}
:::

---

### Preguntas 15 y 16: Borrar el archivo original (`rm test.txt`)

| Operación | Sobre Hard Link (`hl_pr`) | Sobre Soft Link (`sl_pr`) |
| :--- | :--- | :--- |
| **`cat`** | **Funciona** (muestra el contenido intacto). | **Falla:** `No such file or directory`. |
| **`readlink`** | No devuelve nada. | Devuelve `test.txt` (ruta intacta). |
| **Estado** | Inodo sigue vivo; `Links` baja de 2 a 1. | Enlace roto (*dangling link*). Destino no existe. |
| **Motivo** | El bloque de datos solo se libera si `Links == 0`. | Solo guardaba el nombre de la ruta hacia el archivo borrado. |

---

## Bloque 5: Sistemas de archivos montados y espacio (P17 a P19)

### Pregunta 17: Sistemas de archivos montados
* **Comando:** `df -h` (o `mount`, o `df -T` para ver el tipo).
* **Columnas principales:**
  * `Filesystem`: Dispositivo fuente (ej: `/dev/sda1`, `tmpfs`).
  * `Type`: Tipo de FS (ej: `ext4`, `vfat`, `xfs`).
  * `Mounted on`: Punto de montaje en el árbol (ej: `/`, `/home`).

:::shellviz{command="df -h" suggestions="df -h,df -i,mount" title="Terminal — Consultar sistemas de archivos montados"}
:::

---

### Pregunta 18: Número de inodos libres
* **Comando:** `df -i` (o `df -ih`).
* **Columna clave:** **`IFree`** (*Inodes Free*). Indica cuántos inodos quedan para crear archivos.

:::shellviz{command="df -i" suggestions="df -i,df -h" title="Terminal — Inodos libres con df -i"}
:::

---

### Pregunta 19: Espacio libre en disco
* **Comando:** `df -h` (`-h` = unidades humanas K, M, G).
* **Columna clave:** **`Avail`** (*Available*). Bytes libres disponibles para usuarios.

---

## Bloque 6: Variables de entorno y el PATH (P20 a P26)

### Pregunta 20: Significado de PATH, HOME y PWD
* **`HOME`**: Ruta absoluta al directorio personal del usuario (`~`).
* **`PWD`**: Directorio de trabajo actual (*Print Working Directory*). Se actualiza con `cd`.
* **`PATH`**: Lista de directorios donde la Shell busca los binarios de comandos externos.

---

### Pregunta 21: Carácter separador del PATH
* El separador es el **dos puntos (`:`)**.

:::shellviz{command="echo $PATH" suggestions="echo $PATH,echo $HOME,echo $PWD" title="Terminal — Consultar la variable PATH"}
:::

---

### Pregunta 22: Definir y consultar variables
* **Definir y exportar:** `export VAR1="valor1"`
* **Consultar:** `echo $VAR1`
* **Listar todas:** `env`

:::shellviz{command="export VAR1=\"valor1\"" suggestions="export VAR1=\"valor1\",echo $VAR1,env" title="Terminal — Definir y consultar variables de entorno"}
:::

---

### Preguntas 23 a 26: Orden de búsqueda del PATH y seguridad

Suponiendo un ejecutable propio `./ls` en el directorio actual y PATH original `/usr/bin:/bin`:

| Comando / Configuración | ¿Qué `ls` se ejecuta? | Comprobación `which ls` | Motivo |
| :--- | :--- | :--- | :--- |
| **`ls`** (original) | Sistema (`/usr/bin/ls`) | `/usr/bin/ls` | `.` no está en el PATH original. |
| **`./ls`** | Local | (ejecución explícita) | Ruta explícita: no se consulta el PATH. |
| **`export PATH=.:$PATH`** | **Local (`./ls`)** | `./ls` | La Shell busca de izquierda a derecha; encuentra `.` antes que `/usr/bin`. |
| **`export PATH=$PATH:.`** | **Sistema (`/usr/bin/ls`)** | `/usr/bin/ls` | Encuentra `/usr/bin/ls` antes de llegar al final `.` del PATH. |

:::shellviz{command="which ls" suggestions="which ls,type ls" title="Terminal — Resolución de comandos con which"}
:::

> **Pregunta 24 (Riesgo de seguridad):** Poner `.` en el PATH es un peligro grave de **Troyano / Spoofing**. Si un atacante coloca un binario malicioso llamado `ls` o `cd` en un directorio público (como `/tmp`), un administrador que entre y teclee `ls` ejecutaría código malicioso sin darse cuenta.

---

## Bloque 7: Redirecciones de salida (P27)

### Pregunta 27: Diferencia entre `>` y `>>`

| Operador | Nombre | Si el archivo ya existe | Si el archivo NO existe |
| :---: | :--- | :--- | :--- |
| **`>`** | Sobrescritura (*Truncate*) | **Trunca a 0 bytes** y escribe desde el inicio. | Crea el archivo y escribe. |
| **`>>`** | Añadir (*Append*) | **Conserva el contenido previo** y escribe al final. | Crea el archivo y escribe. |

:::shellviz{command="ls -l > llista.txt" suggestions="ls -l > llista.txt,cat llista.txt,echo 'Nova línia' >> llista.txt" title="Terminal — Prueba las redirecciones > y >>"}
:::

* **Ejemplo clásico de examen:**
  ```bash
  ls > out
  date > out
  echo fin >> out
  ```
  *¿Qué contiene `out` al final?* La salida de `date` y la línea `fin`. La salida de `ls` se ha perdido completamente por el segundo `>`.
