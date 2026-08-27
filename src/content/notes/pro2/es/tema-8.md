---
title: "Tema 8: Punteros y memoria dinámica"
description: "Gestión de memoria en C++, operadores, aliasing y gestión del 'heap'."
readTime: "20 min"
order: 9
draft: false
isUpdated: 2
---

## 8.1 La memoria en C++: Stack vs Heap

Para entender los punteros, primero debemos saber cómo se organiza la memoria RAM de un programa en C++:

| Característica | Stack (Pila) | Heap (Montículo) |
| :--- | :--- | :--- |
| **Gestión** | **Automática**: el compilador reserva y libera espacio. | **Manual**: el programador decide cuándo pedir (`new`) y liberar (`delete`). |
| **Velocidad** | Muy rápida (puntero de pila contiguo). | Más lenta (búsqueda de bloques libres en el sistema). |
| **Tamaño** | Limitado y fijo (unos pocos MB, riesgo de *Stack Overflow*). | Muy grande (toda la memoria RAM disponible). |
| **Ciclo de vida** | Ligado al ámbito (*scope*) entre llaves `{}`. | Persistente hasta que se ejecuta `delete`. |

```cpp
int f(int a, int b) {
    int n = a;      // Reserva espacio en la pila
    if (b > n) {
        int m = 2;  // 'm' nace en la pila al entrar al bloque if
        a = b;
    }               // 'm' se libera automáticamente aquí
    return a;
}                   // 'n', 'a' y 'b' se liberan automáticamente al terminar la función
```

---

## 8.2 ¿Qué es un puntero?

Un **puntero** es una variable que, en lugar de almacenar un valor directo (como `int` o `char`), almacena una **dirección de memoria** de otra variable.

### Los tres operadores fundamentales

| Operador | Nombre | Función | Ejemplo |
| :--- | :--- | :--- | :--- |
| **`&`** | **Dirección de** | Obtiene la dirección de memoria de una variable existente. | `int* p = &x;` |
| **`*`** | **Desreferencia** | Accede/modifica el valor situado en la dirección que guarda el puntero. | `*p = 20;` |
| **`->`** | **Acceso a miembro** | Accede directamente a un campo de un `struct`/`class`. Equivalente a `(*p).campo`. | `p_node->value = 5;` |

### Distinción fundamental: `p` vs `*p`

```cpp
int x = 10;
int y = 99;
int* p = &x; // 'p' guarda la dirección de 'x' (ej: 0x7ffd8)

// 1. Leer
cout << p;   // Imprime la dirección: 0x7ffd8
cout << *p;  // Imprime el contenido de x: 10

// 2. Modificar el contenido (*p)
*p = 25;     // ¡Cambia el valor de 'x' a 25!

// 3. Modificar la referencia (p)
p = &y;      // Ahora 'p' apunta a 'y'. 'x' se mantiene en 25 y *p vale 99.
```

### Trampas típicas de declaración

1. **Declaración múltiple de asteriscos:**
   ```cpp
   int *pa, *pb; // Correcto: dos punteros a entero
   int* pa, pb;  // Peligro: 'pa' es puntero, ¡pero 'pb' es un int normal!
   ```
2. **Punteros a miembros de contenedores o tuplas:**
   ```cpp
   vector<int> v = {10, 20, 30};
   int* pv = &v[1]; // Apunta al 20
   *pv += 5;        // v[1] ahora vale 25

   pair<string, int> persona = {"Anna", 21};
   int* pedad = &persona.second;
   *pedad = 22;     // persona.second ahora vale 22
   ```

:::warning
Un puntero no inicializado (`int* p;`) contiene **basura** (apunta a una dirección aleatoria de memoria). Intentar leer o escribir con `*p` provocará un **Segmentation Fault** o corrupción de datos. Si un puntero no apunta a ningún sitio inicialmente, asígnale siempre **`nullptr`**:
```cpp
int* p = nullptr; // Apunta de forma segura a "ninguna parte"
```
:::

## 8.3 Gestión dinámica de memoria: `new` y `delete`

La utilidad principal de los punteros es gestionar memoria en el **Heap** en tiempo de ejecución:

### 1. Objetos individuales
```cpp
int* p_int = new int(42);       // Reserva espacio para un int con valor 42
delete p_int;                   // Libera la memoria
p_int = nullptr;                // Evita dejar un puntero colgante (dangling pointer)
```

### 2. Bloques / Vectores dinámicos (`new[]` y `delete[]`)
```cpp
int* arr = new int[100];        // Reserva un bloque continuo de 100 enteros
delete[] arr;                   // Libera el bloque entero (siempre con [])
arr = nullptr;
```

:::warning
- **`delete` vs `delete[]`:** Liberar un bloque creado con `new[]` usando solo `delete` (sin corchetes) produce **comportamiento indefinido** y fugas de memoria.
- **Fuga de memoria (*Memory Leak*):** Se produce cuando se pierde el último puntero que apuntaba a un bloque del Heap antes de haber hecho `delete`:
  ```cpp
  int* p = new int(10);
  p = new int(20); // ERROR: ¡El entero inicial (10) queda huérfano en la RAM para siempre!
  ```
:::

---

## 8.4 Aliasing y Copia Superficial vs Profunda

El **aliasing** ocurre cuando dos o más punteros almacenan la **misma dirección de memoria**. Cualquier cambio realizado a través de un alias modifica el dato para todos los demás.

```cpp
int x = 10;
int* p1 = &x;
int* p2 = p1; // Aliasing: p2 apunta exactamente a la misma casilla que p1

*p2 = 99;
cout << *p1;  // ¡Imprime 99!
```

### Copia superficial vs profunda
- **Copia superficial:** Copia las direcciones de los punteros. Ambos objetos comparten la misma memoria.
- **Copia profunda:** Reserva nueva memoria en el Heap y duplica el contenido.

---

## 8.5 Errores críticos con punteros

| Error | Causa | Consecuencia | Solución |
| :--- | :--- | :--- | :--- |
| **Segmentation Fault** | Desreferenciar `nullptr` o direcciones basura/fuera de rango. | El programa se detiene inmediatamente (*crash*). | Comprobar siempre `if (p != nullptr)` antes de usar `*p` o `p->`. |
| **Memory Leak** | Perder la referencia a un bloque del Heap sin `delete`. | Consumo continuo e innecesario de memoria RAM. | Asegurar un `delete` por cada `new`. |
| **Dangling Pointer** | Puntero que sigue guardando una dirección que ya ha sido liberada. | Datos corruptos o SEGFAULT al acceder. | Asignar `p = nullptr;` inmediatamente tras el `delete`. |
| **Double Delete** | Hacer `delete` dos veces sobre el mismo bloque de memoria. | Corrupción del administrador del Heap (*crash*). | Hacer `p = nullptr;` (en C++, `delete nullptr;` no hace nada y es seguro). |

> **Consejo para el Jutge/Compilación:** Utiliza el flag `-D_GLIBCXX_DEBUG` al compilar para que los contenedores de la STL avisen de cualquier acceso fuera de rango en lugar de producir errores silenciosos.

---

## 8.6 Paso de parámetros en funciones

| Tipo de paso | Sintaxis | Cuándo utilizarlo en PRO2 |
| :--- | :--- | :--- |
| **Por valor** | `void f(int x)` | Tipos primitivos pequeños (`int`, `char`, `bool`, `double`). |
| **Por referencia constante** | `void f(const string& s)` | **El estándar en PRO2** para estructuras grandes (`vector`, `list`, `BinTree`, `string`) que solo queremos leer sin coste de copia. |
| **Por referencia** | `void f(int& x)` | Cuando la función debe **modificar directamente** el objeto original. |
| **Por puntero** | `void f(Node* p)` | Cuando el parámetro es **opcional** (puede ser `nullptr`) o en estructuras enlazadas. |

---

## 8.7 Aplicación: Estructuras Enlazadas (Nodos)

La utilidad principal de los punteros en PRO2 es crear estructuras de datos dinámicas que crecen y decrecen nodo a nodo en memoria. Cada elemento se almacena en un **Nodo** (o `Item`):

```cpp
template <typename T>
struct Node {
    T value;        // Dato almacenado
    Node* next;     // Puntero hacia el siguiente nodo (o nullptr si es el último)
};
```

### 8.7.1 La Pila enlazada (Stack — LIFO)
En una pila dinámica, solo es necesario mantener un puntero a la cima (`top` o `p_top`):
- **`push(x)`**: Se crea un nuevo nodo que apunta a la antigua cima, y se actualiza la cima.
- **`pop()`**: Se guarda la cima temporalmente, se avanza la cima al siguiente nodo (`top = top->next`) y se libera la memoria de la antigua cima.

:::stackviz
:::

> **Reenlace (`swap2Topmost`):** Para intercambiar los dos primeros nodos sin copiar sus valores:
> 1. `Node* p2 = top->next;` (guardamos el segundo nodo)
> 2. `top->next = p2->next;` (el primero ahora apunta al tercero)
> 3. `p2->next = top;` (el segundo ahora apunta a la antigua cima)
> 4. `top = p2;` (la nueva cima es p2)

---

### 8.7.2 La Cola enlazada (Queue — FIFO)
En una cola dinámica se necesitan dos punteros: **`first`** (para extraer por delante) y **`last`** (para añadir por el final):

:::queueviz
:::

> **Casos especiales:**
> - Insertar en cola vacía: tanto `first` como `last` pasan a apuntar al nuevo nodo.
> - Extraer el último elemento: si tras el `pop` la cola queda vacía (`first == nullptr`), hay que hacer también `last = nullptr;`.

---

### 8.7.3 Borrado de nodos por el medio
Para borrar un nodo situado en el interior de una secuencia enlazada:

1. Localizar el nodo **anterior** (`ant`) al que queremos eliminar.
2. Guardar el nodo a borrar: `Node* p_del = ant->next;`
3. Saltar el nodo: `ant->next = p_del->next;`
4. Liberar la memoria: `delete p_del;`

:::pointerviz
:::

---

## 8.8 Checklist para problemas de punteros en el Juez

- **Comprobación de `nullptr`:** Asegúrate de no hacer nunca `p->next` o `p->value` si `p == nullptr`.
- **Liberación con `delete`:** Cada `new` debe tener su `delete` correspondiente (o en el destructor de la clase).
- **Gestión de los casos límite:**
  - Estructura completamente vacía (`top == nullptr` o `first == nullptr`).
  - Estructura con un solo elemento (donde eliminarlo requiere actualizar tanto `first` como `last` a `nullptr`).
  - Borrado del primer nodo vs un nodo intermedio.
- **Control de autoasignación:** Al sobrecargar el `operator=`, comprueba siempre `if (this != &other)` antes de borrar la memoria propia.
