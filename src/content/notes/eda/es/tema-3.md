---
title: "Tema 3: Diccionarios"
description: "TAD diccionario, hash tables y colisiones, BST y AVL."
readTime: "35 min"
order: 3
draft: false
---

<!-- Un **diccionario** almacena pares **(clave, información)** y permite buscar, insertar y borrar elementos por su clave. La tabla compara todas las implementaciones estudiadas:

| Implementación | Búsqueda (medio / peor) | Inserción (medio / peor) | Borrado (medio / peor) | Requisito | C++ STL |
| :--- | :---: | :---: | :---: | :--- | :--- |
| **Vector no ordenado** | $\Theta(n) / \Theta(n)$ | $\Theta(n) / \Theta(n)$ | $\Theta(n) / \Theta(n)$ | Igualdad (`==`) | `vector<pair<K,I>>` |
| **Vector ordenado** | $\Theta(\log n) / \Theta(\log n)$ | $\Theta(n) / \Theta(n)$ | $\Theta(n) / \Theta(n)$ | Orden total (`<`) | Vector ordenado manual |
| **Hash (*Tabla de dispersión*)** | $\Theta(1) / \Theta(n)$ | $\Theta(1) / \Theta(n)$ | $\Theta(1) / \Theta(n)$ | Hash + igualdad | `unordered_map<K,I>` |
| **Árbol Binario de Búsqueda (ABB)** | $\Theta(\log n) / \Theta(n)$ | $\Theta(\log n) / \Theta(n)$ | $\Theta(\log n) / \Theta(n)$ | Orden total (`<`) | *(teórico)* |
| **Árbol AVL / RB** | $\Theta(\log n) / \Theta(\log n)$ | $\Theta(\log n) / \Theta(\log n)$ | $\Theta(\log n) / \Theta(\log n)$ | Orden total (`<`) | `map<K,I>` | 

---
-->

## 3.1. Tipos Abstractos de Datos (TAD)

Un **TAD** especifica el *comportamiento* de una estructura de datos de manera independiente de su implementación: **saber el *qué* sin saber el *cómo*.**
Formalmente, un TAD se define por tres elementos: los **valores** válidos, las **operaciones** (firmas), y las **propiedades** (axiomas ecuacionales) que relacionan las operaciones.

:::tadviz
:::
<!-- 
### Ejemplos de especificación formal de TADs

**TAD Booleanos** — Valores: $\text{Bool} = \{\text{cierto}, \text{falso}\}$; Operaciones: $\text{y}, \text{o}, \text{no}$; Axiomas:
$$\text{y}(\text{cierto}, x) = x, \quad \text{y}(\text{falso}, x) = \text{falso}, \quad \text{o}(\text{cierto}, x) = \text{cierto}, \quad \text{no}(\text{cierto}) = \text{falso}$$

**TAD Enteros** — Valores: $\mathbb{Z}$ (en hardware, $[-2^{31}, 2^{31}-1]$ en 32 bits con complemento a 2); Operaciones: $+, -, \times, /, \%$; Axiomas: $a + 0 = a$, $a \cdot 0 = 0$, definición del *overflow*, etc.

**TAD Naturales (Peano)** — Valores: $\mathbb{N}$ generado por $\text{cero}$ y $\text{suc}$; Axiomas:
$$\text{suma}(\text{cero}, x) = x, \quad \text{suma}(\text{suc}(x), y) = \text{suc}(\text{suma}(x, y))$$
$$\text{iguales?}(\text{cero}, \text{cero}) = \text{cierto}, \quad \text{iguales?}(\text{suc}(x), \text{cero}) = \text{falso}, \quad \text{iguales?}(\text{suc}(x), \text{suc}(y)) = \text{iguales?}(x, y)$$

> Observa que ningún axioma especifica cómo se representa el valor en memoria (1 bit, 1 byte, complemento a 2...). -->

---

## 3.2. El TAD Diccionario

Un diccionario almacena pares **(clave, valor)** ($k \in K$, $i \in I$) y permite gestionarlos eficientemente:

* **Claves únicas:** No puede haber claves repetidas; si se asigna una clave existente, el valor se sobrescribe.
* **Acceso por clave:** Todas las búsquedas y borrados se efectúan siempre por la clave, nunca por el valor.
* **Múltiples claves pueden tener el mismo valor asociado.**

:::dictviz
:::

### Operaciones 
* **`asignar(k, v)` / `insert`:** Añade el par $(k, v)$ o actualiza el valor si $k$ ya existe.
* **`borrar(k)` / `erase`:** Elimina el elemento con clave $k$.
* **`consultar(k)` / `find`:** Devuelve el valor asociado a $k$ (o indica que no existe).
* **`presente(k)` / `count`:** Comprueba si la clave $k$ está en el diccionario.
* **`tamano()` / `size`:** Devuelve el número de elementos.

---

## 3.3. Implementaciones elementales del diccionario

Sobre una colección de $n$ elementos, las estructuras lineales presentan cuellos de botella inevitables:

| Estructura | Asignar | Borrar | Consultar | Cuello de botella |
| :--- | :---: | :---: | :---: | :--- |
| **Vector no ordenado** | $\Theta(n)$ | $\Theta(n)$ | $\Theta(n)$ | Hay que recorrer todo el vector para verificar unicidad. |
| **Lista no ordenada** | $\Theta(n)$ | $\Theta(n)$ | $\Theta(n)$ | Sin acceso directo; búsqueda lineal obligatoria. |
| **Vector ordenado** | $\Theta(n)$ | $\Theta(n)$ | $\Theta(\log n)$ | Búsqueda binaria $\Theta(\log n)$, pero insertar desplaza $\Theta(n)$ elementos. |
| **Lista ordenada** | $\Theta(n)$ | $\Theta(n)$ | $\Theta(n)$ | Ordenada pero sin acceso por índice; no admite búsqueda binaria. |

**Truco de borrado en vector no ordenado ($\Theta(1)$):** copiar el último elemento al hueco del nodo borrado y hacer `pop_back()`. Evita desplazar elementos pero no preserva el orden.

---

## 3.4. Tablas de dispersión (*Hash Tables*)

Las **tablas de dispersión** logran búsqueda, inserción y borrado en **tiempo constante esperado $\Theta(1)$**, a cambio de un caso peor $\Theta(n)$ (cuando todo colisiona).

### Tablas de acceso directo

La forma más simple de guardar datos es usar la clave directamente como índice de un vector: `T[clave] = valor`. Esto da acceso inmediato en tiempo $\Theta(1)$.

Si las claves son números muy grandes (como el DNI, hasta 8 dígitos) y solo tenemos 300 usuarios, habría que reservar un vector de $10^8$ casillas (¡100 millones!) en la memoria RAM para usar solo 300. Es un desperdicio inasumible.

:::directaddressviz
:::

### La función de dispersión (*Hash function*)

Para solucionarlo, creamos una tabla $T$ de tamaño razonable $m$ (proporcional al número de elementos reales que tenemos) y usamos una **función hash $h$** para traducir cualquier clave (sea un número grande o una palabra) a una posición válida de la tabla:

$$
\text{posición} = h(\text{clave}) \quad (\text{entre } 0 \text{ y } m-1)
$$

El elemento se guarda en la casilla `T[h(clave)]`.

:::hashviz
:::

Una buena función hash debe ser:
1. **Consistente (determinista):** Para la misma clave, siempre debe devolver el mismo índice.
2. **Rápida:** Calcular $h(\text{clave})$ debe costar tiempo constante $\Theta(1)$.
3. **Uniforme:** Debe repartir los elementos por toda la tabla para evitar que se acumulen en las mismas casillas (por ejemplo, usar los últimos dígitos de un código en vez de los primeros, que suelen repetirse).

### Colisiones

Como tenemos infinitas claves posibles pero la tabla tiene un número limitado de casillas, es inevitable que tarde o temprano **dos claves distintas acaben dando el mismo índice** ($h(k_1) = h(k_2)$).

:::collisionviz
:::

Esto se llama una **colisión**, y cualquier tabla de dispersión necesita un método para gestionarlas (como veremos con el encadenamiento y el direccionamiento abierto).

---

### Resolución de colisiones por Encadenamiento (*Separate Chaining*)

Cada casilla $T[j]$ es una **lista enlazada** de todos los elementos con $h(k) = j$.

:::chainingviz
:::

El **factor de carga** $\alpha = n/m$ intuye el número medio de elementos por lista:

| Caso | Coste | Condición |
| :--- | :---: | :--- |
| **Peor** | $\Theta(n)$ | Todas las $n$ claves colisionan en la misma casilla. |
| **Medio** (dispersión uniforme simple) | $\Theta(1 + \alpha)$ | Cada clave cae uniformemente en cualquier posición. |
| **Medio con $m = \Theta(n)$** | $\Theta(1)$ | Si $m \propto n$, entonces $\alpha = \mathcal{O}(1)$. |

---

### Resolución de colisiones por Direccionamiento Abierto (*Open Addressing*)

A diferencia del encadenamiento, aquí **no usamos listas externas**: todos los elementos se guardan directamente en las casillas de la tabla. Por tanto, nunca podemos tener más elementos que casillas ($n \le m$).

Cuando queremos insertar una clave y su casilla ya está ocupada (colisión), **buscamos la siguiente casilla vacía** según una estrategia de búsqueda (llamada *sondeo*):

:::openaddressviz
:::

| Estrategia | ¿Cómo busca una casilla libre? | Pros y contras |
| :--- | :--- | :--- |
| **Sondeo lineal** | Mira la casilla adyacente: prueba a $+1, +2, +3, \dots$ | **Muy simple**, pero sufre de **agrupamientos primarios** (se forman bloques grandes de casillas consecutivas ocupadas que ralentizan las búsquedas). |
| **Sondeo cuadrático** | Salta distancias cuadráticas: prueba a $+1^2, +2^2, +3^2, \dots$ | Evita los bloques de elementos consecutivos, aunque claves con el mismo hash hacen los mismos saltos. |
| **Doble dispersión** | El tamaño del salto lo calcula una segunda función hash: $+1 \cdot h_2(k), +2 \cdot h_2(k), \dots$ | **La mejor distribución**: incluso si dos claves colisionan de entrada, explorarán caminos completamente distintos. |

---

## 3.5. Árboles: Definiciones y terminología

Un **árbol** es una estructura jerárquica formada por nodos y aristas sin ciclos. En un **árbol enraizado**, un nodo destacado actúa como **raíz** $r$.

:::treeterviz
:::

* **Raíz:** El nodo superior (sin padre).
* **Padre e hijos:** Nodos conectados directamente en relación descendente.
* **Hojas:** Nodos que no tienen hijos.
* **Ancestros y descendientes:** Nodos en el camino hacia arriba (hacia la raíz) o hacia abajo (hacia las hojas).
* **Altura ($h$):** Distancia máxima (en aristas) desde la raíz hasta una hoja.

### Árboles binarios

Un **árbol binario** es aquel donde cada nodo tiene como máximo dos hijos: **hijo izquierdo** (`hizq`) e **hijo derecho** (`hder`).

---

## 3.6. Árboles Binarios de Búsqueda (ABB / BST)

Un **ABB** implementa el diccionario aprovechando un **orden total** sobre las claves.

### La Propiedad ABB

Para cualquier nodo $x$ con clave $k_x$:
* Todo nodo del **subárbol izquierdo** tiene clave $< k_x$.
* Todo nodo del **subárbol derecho** tiene clave $> k_x$.

:::abcviz
:::

> **Propiedad clave de examen:** El **recorrido en inorden** (Izquierda → Raíz → Derecha) de un ABB siempre visita las claves en **orden estrictamente creciente**.

:::oopviz{simulation="diccionari_abc"}
:::

---

### Operaciones básicas del ABB

* **Búsqueda ($\Theta(h)$):** Aprovecha la ordenación para comparar la clave con la raíz y descartar la mitad del árbol en cada paso (si es menor vamos a la izquierda, si es mayor a la derecha).
::algoviz{algorithm="abc_cerca"}

* **Inserción ($\Theta(h)$):** Se busca la clave; si ya existe se actualiza la información, y si se llega a un puntero vacío se enlaza un nuevo nodo hoja.
::algoviz{algorithm="abc_assignar"}

* **Mínimo y máximo ($\Theta(h)$):** El mínimo es el nodo más a la izquierda; el máximo es el más a la derecha.
::algoviz{algorithm="abc_minim_maxim"}

* **Borrado ($\Theta(h)$):** Depende de cuántos hijos tiene el nodo a eliminar:

| Caso | Acción |
| :--- | :--- |
| **0 hijos (hoja)** | Se elimina directamente (el puntero del padre pasa a `nullptr`). |
| **1 hijo** | El padre adopta directamente el único hijo existente. |
| **2 hijos** | Se sustituye por su **sucesor inorden** (el mínimo del subárbol derecho, que tiene $\le 1$ hijo). |

:::oopviz{simulation="diccionari_esborrar"}
:::

---

### La problemática de la altura en un ABB

El coste de todas las operaciones de un ABB depende directamente de su altura:

$$
T_{\text{buscar}},\; T_{\text{insertar}},\; T_{\text{borrar}} \in \Theta(h)
$$

* **Caso medio (orden aleatorio):** El árbol crece balanceado con $h = \Theta(\log n)$.
* **Caso peor (claves ordenadas $1, 2, 3 \dots$):** El árbol degenera en una lista de altura $h = n-1$, haciendo caer todas las operaciones a tiempo lineal **$\Theta(n)$**.

:::abcdegenviz
:::

---

## 3.7. Árboles Equilibrados: Árboles AVL

Para evitar que un ABB degenere a $\Theta(n)$, los **árboles AVL** imponen una condición de equilibrio que se autorregula en cada inserción y borrado.

### Definición de Árbol AVL

Un **árbol AVL** es un ABB donde, **para cada nodo**, la diferencia de alturas entre sus dos subárboles es como máximo 1:

$$
|\text{altura}(\text{hizq}) - \text{altura}(\text{hder})| \le 1
$$

> **Garantía de altura:** Esta propiedad asegura que la altura máxima es $h \le 1.44 \log_2 n$. Por tanto, la altura es siempre **$h = \Theta(\log n)$ en el caso peor**.

:::oopviz{simulation="diccionari_avl"}
:::

---

### Rotaciones en el Árbol AVL

Cuando una inserción o un borrado provoca un desequilibrio ($\text{diferencia} = \pm 2$), se aplica una **rotación local en tiempo constante $\Theta(1)$** para restaurar el equilibrio sin romper el orden del ABB:

| Caso | Situación del desequilibrio | Rotación aplicada |
| :--- | :--- | :--- |
| **LL** | Inserción a la izquierda del hijo izquierdo | **Simple a la derecha** (`LL`) |
| **RR** | Inserción a la derecha del hijo derecho | **Simple a la izquierda** (`RR`) |
| **LR** | Inserción a la derecha del hijo izquierdo | **Doble:** `RR` al hijo izquierdo + `LL` al nodo |
| **RL** | Inserción a la izquierda del hijo derecho | **Doble:** `LL` al hijo derecho + `RR` al nodo |

:::avlrotviz
:::

::algoviz{algorithm="avl_ll"}

::algoviz{algorithm="avl_rr"}

::algoviz{algorithm="avl_lr"}

---

### Inserción vs. Borrado en AVL 
* **Inserción ($\Theta(\log n)$):** Se inserta el nodo como en un ABB y, en el retorno hacia la raíz, se reequilibra si es necesario. **Como máximo 1 rotación** (simple o doble) es necesaria para reequilibrar todo el árbol.
::algoviz{algorithm="avl_assignar"}

* **Borrado ($\Theta(\log n)$):** Se elimina el nodo como en un ABB. En el retorno hacia arriba, puede requerir **hasta $\mathcal{O}(\log n)$ rotaciones** propagadas hacia la raíz.
::algoviz{algorithm="avl_esborrar"}

---

## 3.8. Tabla comparativa final de complejidades

| Estructura de datos | Búsqueda | Inserción | Borrado | Recorrido ordenado | Notas |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **Vector no ordenado** | $\Theta(n)$ | $\Theta(n)$ | $\Theta(n)$ | $\Theta(n \log n)$ | Útil para colecciones pequeñas ($n < 20$). |
| **Vector ordenado** | $\Theta(\log n)$ | $\Theta(n)$ | $\Theta(n)$ | $\Theta(n)$ | Óptimo si los datos son estáticos y las búsquedas frecuentes. |
| **Hash (*Tabla de dispersión*)** | $\Theta(1)$\* | $\Theta(1)$\* | $\Theta(1)$\* | No disponible | La más rápida en la práctica si no se requiere orden. \*Caso peor $\Theta(n)$. |
| **ABB (*BST*)** | $\Theta(\log n)$\* | $\Theta(\log n)$\* | $\Theta(\log n)$\* | $\Theta(n)$ | Puede degenerar a $\Theta(n)$ con entradas ordenadas. \*Caso medio. |
| **AVL / RB (`std::map`)** | $\Theta(\log n)$ | $\Theta(\log n)$ | $\Theta(\log n)$ | $\Theta(n)$ | **Garantiza $\Theta(\log n)$ en el caso peor** e iteración en orden creciente. |
