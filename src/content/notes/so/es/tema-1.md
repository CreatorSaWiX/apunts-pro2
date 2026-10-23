---
title: "Tema 1: SO y shell"
description: "Rol del SO, modos de ejecución, llamadas a sistema, shell, inodos, enlaces y permisos."
readTime: "15 min"
order: 1
draft: false
---

## 1.1 Introducción a SO

El **Sistema Operativo (SO)** es el programa que actúa como intermediario entre nuestras aplicaciones y el hardware del ordenador (la CPU, la memoria RAM, el disco duro, el teclado o la pantalla).

Sin el SO, cada programador tendría que escribir instrucciones de bajo nivel para controlar directamente los circuitos del disco o la tarjeta de red. El SO se encarga de este trabajo y persigue 3 objetivos:

1. **Fácil de usar (Usabilidad)**: Oculta los detalles complicados del hardware. En lugar de tener que gestionar pistas o sectores físicos de un disco, nosotros solo vemos archivos y carpetas.
2. **Seguro (Protección)**: Impide que un programa con errores o malicioso borre la memoria de otro programa o toque datos de otros usuarios.
3. **Eficiente**: Reparte el tiempo del procesador y la memoria para que podamos ejecutar muchos programas a la vez sin desperdiciar recursos.

:::osmediatorviz
:::

### El entorno de la asignatura: UNIX y POSIX

* **UNIX**: Familia de SO (años 70) que estableció el modelo moderno: jerarquía de raíz única (`/`), «todo es un archivo» y herramientas pequeñas encadenadas por tuberías. **Linux** y **macOS** siguen su diseño (*Unix-like*).
* **POSIX** (*Portable Operating System Interface*): Estándar formal (IEEE) que fija la API de un sistema UNIX:
  * Define qué llamadas a sistema existen (`fork`, `write`, `read`, `open`, etc.) y cómo deben responder.
  * **Objetivo**: Garantizar la **portabilidad** (el mismo código en C se compila en cualquier SO que cumpla POSIX).

---

## 1.2 Modos de ejecución

Para evitar que cualquier programa pueda colgar el ordenador o acceder a datos privados, el procesador físico (la CPU) tiene **dos modos de trabajo**:

1. **Modo usuario (*user mode*)**:
   * Es donde se ejecutan los programas que hacemos nosotros, el navegador, el editor o la Shell.
   * La CPU tiene **restringido el acceso**: no puede tocar el hardware directamente ni leer memoria que no sea la suya. Si lo intenta, la CPU se detiene y avisa al sistema.
2. **Modo kernel (*kernel mode* o modo privilegiado)**:
   * Es donde se ejecuta exclusivamente el núcleo del sistema operativo (*Kernel*).
   * La CPU tiene **acceso total**: puede ejecutar cualquier instrucción de la máquina, tocar toda la memoria RAM y hablar directamente con los dispositivos.

> **¿Cómo sabe la CPU en qué modo está?**  
> Tiene un bit interno (en el registro de estado de la CPU o PSW). Cuando vale 0 está en modo kernel y cuando vale 1 en modo usuario. Un programa de usuario tiene prohibido cambiar este bit por su cuenta.

---

## 1.3 ¿Cómo entramos al kernel?

El núcleo del sistema operativo (*Kernel*) es un código que está en reposo y solo se activa cuando ocurre un evento. Solo hay **3 maneras de entrar al Kernel**:

| Evento | ¿Quién lo genera? | Sincronismo | Qué es y Ejemplos |
| :--- | :--- | :--- | :--- |
| **Interrupción hardware** | Dispositivo externo | **Asíncrona** (puede llegar en cualquier momento, entre dos instrucciones) | El hardware avisa de que ha ocurrido algo: pulsas una tecla, llega un mensaje de red, el disco termina de leer datos, o salta el **reloj del sistema**. |
| **Excepción software** | La propia CPU | **Síncrona** (la provoca una instrucción concreta mientras se ejecuta) | Se ha producido un error en el código: división por cero, intentar acceder a memoria no permitida (*Segmentation Fault*), o un fallo de página (*page fault*). |
| **Llamada a sistema (*trap*)** | El programa de usuario | **Síncrona** (la solicita expresamente el código) | El programa pide un servicio al SO mediante una instrucción especial (`syscall`): abrir un archivo, escribir por pantalla (`write`), o crear un hijo (`fork`). |

### ¿Para qué sirve la interrupción de reloj?
Imagina un programa con un bucle infinito que no hace ninguna llamada a sistema: `while (1);`. ¿Cómo puede el sistema operativo recuperar el control si el programa no le pide nada?  
* Un chip temporizador de la placa base genera una **interrupción de reloj periódica** (por ejemplo cada 10 milisegundos).
* Cada 10 ms, la CPU se detiene, pasa a modo kernel y ejecuta la rutina de reloj del SO.
* El SO comprueba si el programa lleva demasiado tiempo ejecutándose. Si es así, le quita la CPU y se la da a otro programa. Esto impide que ningún proceso cuelgue la máquina.

---

## 1.4 ¿Cómo funciona una llamada a sistema?

Cuando un programa quiere pedir ayuda al Kernel (por ejemplo para escribir bytes con `write`), no puede saltar directamente a una dirección del Kernel porque está en modo usuario.

### 1. ¿Por qué la biblioteca de sistema (`libc`) depende del hardware?
Cuando en C escribes `write(1, buf, len)`, estás llamando a una función de usuario que viene con la biblioteca estándar de C (`libc`). Esta función actúa como puente:
1. Coloca los argumentos (`1`, `buf`, `len`) en los **registros concretos de la CPU** que pide la arquitectura.
2. Ejecuta la **instrucción máquina de cambio de modo** de la CPU.
3. Como cada familia de procesadores (Intel, AMD, ARM) tiene instrucciones y registros distintos, **el código de esta biblioteca debe estar escrito expresamente para el hardware donde se ejecuta**.

### 2. ¿Cómo se consigue que el código funcione entre diferentes versiones de Linux?
El Kernel no identifica los servicios por direcciones de memoria (que cambian entre actualizaciones), sino con una **tabla de números enteros fijos** (la *syscall table*):
* `SYS_write = 1`, `SYS_fork = 57`, etc.
* La biblioteca pone el número en el registro `%rax` y llama a `syscall`. El Kernel lee este número, busca la función en su tabla y la ejecuta.
* **Todas las llamadas siguen la misma regla**: si funcionan devuelven el resultado; si fallan devuelven `-1` y guardan el código del error en la variable `errno`.

---

## 1.5 La shell y comandos (internos vs externos)

La **Shell** (en Linux normalmente **Bash**) es el intérprete de comandos. Funciona con un bucle infinito sencillo: lee el texto que escribes, lo interpreta, ejecuta el comando y vuelve a mostrar el símbolo de espera (*prompt*).

Hay dos tipos de comandos:

| Tipo | ¿Dónde se ejecuta? | Ejemplos | Cómo ver la ayuda |
| :--- | :--- | :--- | :--- |
| **Interno (*built-in*)** | Dentro del mismo proceso de la Shell (**sin crear ningún proceso nuevo**) | `cd`, `pwd`, `export`, `alias`, `exit`, `echo` | `help <comando>` |
| **Externo** | La Shell crea un proceso hijo nuevo con `fork()` y carga el archivo binario desde el disco con `exec()` | `ls`, `mkdir`, `cp`, `rm`, `grep`, `cat` | `man <comando>` |

* `type <comando>`: te dice si un comando es interno o un archivo externo en disco.

:::shellviz{command="type cd" suggestions="type cd,type ls" title="Terminal — Comprobar si un comando es interno o externo"}
:::

---

## 1.6 El manual `man`

Cuando consultas `man nombre`, el manual está dividido en secciones numeradas:

| Sección | Contenido | Ejemplos |
| :---: | :--- | :--- |
| **1** | Comandos que escribes en la terminal | `ls`, `cp`, `bash`, `man` |
| **2** | **Llamadas a sistema del Kernel** | `fork`, `write`, `read`, `open`, `waitpid`, `kill` |
| **3** | **Funciones de la biblioteca de C** | `printf`, `sprintf`, `strlen`, `malloc`, `perror` |

* `man write` $\rightarrow$ muestra el comando de enviar mensajes a la terminal (sección 1).
* `man 2 write` $\rightarrow$ muestra la llamada a sistema de C para escribir bytes (sección 2).
* **Teclas de navegación**: `Espacio` (avanzar página), `b` (retroceder), `/texto` (buscar), `n` (siguiente coincidencia), `q` (salir).

:::shellviz{command="man write" suggestions="man write,man 2 write" title="Terminal — Consultar el manual de write (sección 1 vs 2)"}
:::

---

## 1.7 Cómo organiza los archivos UNIX: inodos y carpetas

En UNIX todos los archivos cuelgan de un único árbol desde la raíz `/` (no hay letras de unidad como `C:` o `D:` de Windows).

### ¿Qué es un inodo?
**El DNI del archivo**. Una ficha interna de datos que guarda la información de gestión: tamaño en bytes, a qué usuario pertenece, permisos (`rwx`), fechas de creación/modificación, número de enlaces (*links*), y los punteros a los bloques del disco donde está el contenido real. **El inodo NO sabe cómo se llama el archivo.** El nombre del archivo se guarda dentro de las carpetas. Una carpeta es simplemente una lista de pares `(nombre_del_archivo, número_inodo)`.

| Nombre del archivo (en `/home/usuario`) | Núm. Inodo | Descripción |
| :--- | :---: | :--- |
| `.` | `1001` | La propia carpeta actual (*ella misma*) |
| `..` | `1000` | La carpeta padre |
| `apunts.txt` | `50421` | El archivo real |

* `stat archivo`: muestra todos los datos guardados en el inodo (tamaño, bloques, enlaces, fechas).
* **Contador de links de una carpeta**: Una carpeta nueva tiene siempre **2 links**: su propio nombre en la carpeta padre y el punto `.` que contiene dentro. Cada subcarpeta que crees dentro sumará $+1$ link (por el `..` de la hija).

:::shellviz{command="stat test.txt" suggestions="stat test.txt,stat Documents" title="Terminal — Consultar los metadatos del inodo con stat"}
:::

---

## 1.8 Hard links vs soft links (enlaces)

| Característica | Hard Link (`ln archivo enlace`) | Soft Link (`ln -s archivo enlace`) |
| :--- | :--- | :--- |
| **¿Qué es en realidad?** | Un **segundo nombre** añadido a la carpeta que apunta al **mismo número de inodo**. | Un **archivo nuevo e independiente** con un **inodo nuevo** que dentro contiene escrita la ruta del original (como un acceso directo). |
| **Número de Inodo** | **El mismo** que el original. | **Diferente** (tiene su propio inodo). |
| **Contador de enlaces (*Links*)** | Suma $+1$ al inodo original. | No afecta al original (tiene contador 1 propio). |
| **Si borras el original con `rm`** | El contenido **no se pierde**. El contador baja en 1, pero mientras quede un hard link vivo, los datos continúan en disco. | El enlace queda **roto (*dangling*)**. Si intentas abrirlo da error: `No such file or directory`. |
| **¿Puede enlazar carpetas?** | No (para evitar bucles infinitos en el árbol). | **Sí**. |
| **¿Puede cruzar discos/particiones?** | **No** (los números de inodo solo tienen sentido dentro de su disco). | **Sí** (guarda una ruta de texto). |

* `readlink enlace_soft`: muestra el texto de la ruta que guarda el soft link en su interior.
* `namei -l ruta`: recorre paso a paso toda la ruta comprobando cada carpeta, enlace y permiso.

---

## 1.9 Permisos de acceso y comando `chmod`

Los permisos se organizan en 1 carácter para el tipo de elemento y 3 grupos de 3 caracteres (`rwx`):

| Tipo | Propietario (`u` - *user*) | Grupo (`g` - *group*) | Otros (`o` - *others*) |
| :---: | :---: | :---: | :---: |
| `-` | `r w x` | `r - x` | `r - -` |

* **Tipo**: `-` archivo normal · `d` directorio/carpeta · `l` enlace simbólico (*soft link*).
* `u` (*user*): Propietario del archivo.
* `g` (*group*): Usuarios del mismo grupo.
* `o` (*others*): El resto de usuarios del sistema.

### Significado de cada permiso
| Letra | Valor Octal | Sobre un archivo | Sobre una carpeta |
| :---: | :---: | :--- | :--- |
| **`r`** (read) | 4 | Leer el texto o datos | Ver los nombres de los archivos que contiene (`ls`) |
| **`w`** (write) | 2 | Modificar o sobrescribir el archivo | **Crear, borrar o cambiar de nombre** archivos dentro |
| **`x`** (execute) | 1 | Ejecutar el programa o script | **Entrar con `cd`** y acceder a los archivos de dentro |

> Para **borrar un archivo**, ¿necesitas permiso `w` sobre el mismo archivo?  
> **NO**. Borrar un archivo es quitar su nombre de la lista de la carpeta donde se encuentra. Por lo tanto, solo necesitas permisos **`w` y `x` sobre la carpeta padre**. Aunque un archivo sea de solo lectura (`r--r--r--`), si tienes permiso `w` en la carpeta, ¡lo puedes borrar!

* **Cambiar permisos con `chmod`**:
  * Con letras: `chmod u+x script.sh` (añade ejecución al propietario), `chmod go-w archivo` (quita escritura a grupo y otros).
  * Con números octales: `chmod 755 script.sh` (`rwxr-xr-x`), `chmod 644 documento.txt` (`rw-r--r--`).

:::shellviz{command="chmod u+x SO/lab1.sh" suggestions="chmod u+x SO/lab1.sh,chmod 755 SO/lab1.sh,ls -l SO" title="Terminal — Prueba a cambiar permisos con chmod"}
:::

---

## 1.10 Variables de entorno y `$PATH`

Las **variables de entorno** son datos en formato `NOMBRE=VALOR` que se pasan automáticamente de padres a hijos cuando se crea un proceso.
* `env`: muestra todas las variables definidas.
* `echo $NOMBRE`: muestra el valor de una variable concreta.
* `export NOMBRE="valor"`: define una variable y asegura que los programas que abras a partir de ahora también puedan leerla.

### La variable `$PATH`
Es una lista de carpetas (separadas por dos puntos `:`) donde la Shell busca los binarios cuando escribes un comando como `ls` o `gcc`:
* La Shell busca de izquierda a derecha y ejecuta el primero que encuentra.
* Si pones `export PATH=.:$PATH`, la Shell buscará primero en tu carpeta actual (`.`). Si descargas un proyecto de Internet que tenga un programa fraudulento llamado `ls`, la Shell lo ejecutará antes que el `ls` del sistema.
* `which <comando>`: te dice la ruta exacta del archivo que se ejecutará.

---

## 1.11 Redirecciones de entrada/salida

* `>` : Envía la salida hacia un archivo. Si el archivo ya existía, **vacía su contenido anterior**.
* `>>` : Envía la salida hacia un archivo, pero **añadiendo las líneas al final**, sin borrar lo que había.
* `<` : Hace que el programa lea los datos desde un archivo en lugar del teclado.
* `&` : Pone el comando en segundo plano (*background*); la Shell te devuelve el control inmediatamente.
* **Comodines (*Globbing*)**: `*` (cualquier grupo de letras) y `?` (una sola letra).  
  **La expansión del comodín la hace la Shell antes de ejecutar el programa**. Si haces `grep hola *.c`, tu programa no recibe el asterisco; recibe directamente `argv = ["grep", "hola", "a.c", "b.c"]`.

---

## 1.12 Preguntas típicas de examen resueltas (Tema 1)

### 1. ¿Por qué la biblioteca de sistema (`libc`) depende del hardware?
Porque para cambiar de modo de usuario a modo kernel hay que ejecutar una instrucción máquina específica de la CPU (`syscall`, `sysenter`, `int 0x80`), y hay que colocar los parámetros en los registros concretos que pide la arquitectura del procesador.

### 2. ¿Qué tres tipos de eventos hacen que la CPU entre al Kernel?
1. **Interrupción de hardware**: asíncrona, la genera un dispositivo externo (teclado, disco, reloj).  
2. **Excepción de software**: síncrona, la causa una instrucción del programa con error (división por cero, violación de memoria).  
3. **Llamada a sistema (*trap*)**: síncrona, la solicita expresamente el código para pedir un servicio al sistema operativo.

### 3. Ejecutamos `ln A B`. Sabemos que `A` existe, `B` no existe, tenemos permisos en la carpeta y hay espacio en disco, pero el comando falla. ¿Por qué?
Por uno de estos dos motivos:  
1. `A` es una **carpeta/directorio**, y UNIX no permite crear *hard links* sobre carpetas para evitar ciclos en el árbol de archivos.  
2. `A` y `B` están en **particiones o discos diferentes**, y un *hard link* solo puede compartir inodos dentro del mismo sistema de archivos.
