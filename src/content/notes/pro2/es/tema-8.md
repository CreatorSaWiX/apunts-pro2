---
title: "Tema 8: Punteros y Memoria Dinámica"
description: "Gestión de memoria en C++, operadores, aliasing y gestión del 'heap'."
readTime: "20 min"
order: 9
draft: false
isUpdated: 1
---

## 1. La memoria en C++: Stack vs Heap

Para entender los punteros, primero debemos saber dónde se almacenan los datos. La memoria de un programa se divide principalmente en dos zonas:

| Característica | Stack (Pila) | Heap (Montículo) |
| :--- | :--- | :--- |
| **Gestión** | Automática (por el ordenador). | Manual (por el programador). |
| **Velocidad** | Muy rápida. | Más lenta. |
| **Tamaño** | Limitado y fijo. | Muy grande (memoria RAM disponible). |
| **Ciclo de vida** | Ligado a las llaves `{}` (pila de llamadas). | Decidimos cuándo nacen (`new`) y mueren (`delete`). |

**Ejemplo de scope (Pila)**:
```cpp
int f(int a, int b) {
    int n = a;
    if (b > n) {
        int m = 2; // Nace aquí
        a = b;
    } // m Muere aquí automáticamente
    return a;
} // n y a Mueren aquí
```

## 2. ¿Qué es un puntero?

Un **puntero** es una variable que, en lugar de almacenar un valor (como un `int` o `char`), almacena una **dirección de memoria**.

| Operador | Nombre | Función | Ejemplo |
| :--- | :--- | :--- | :--- |
| **`&`** | Dirección de | Obtiene la dirección de memoria de una variable. | `p = &x;` |
| **`*`** | Desreferencia | Accede al contenido de la dirección que guarda el puntero. | `cout << *p;` |
| **`->`** | Flecha | Acceso a miembro vía puntero. Equivalente a `(*p).miembro`. | `pp->first = "b";` |

### Trampas de declaración y sintaxis

- **Declaración múltiple**: El asterisco `*` debe ponerse por cada variable.
  ```cpp
  int *pb, *pc; // Dos punteros
  int* pb, pc;  // ¡pb es puntero, pc es un ENTERO normal! (Error típico)
  ```
- **Puntero a elementos de contenedores**:
  ```cpp
  vector<int> v = {1, 2, 3};
  int *p = &v[1]; // Apunta al '2'
  *p += 1;        // v[1] ahora es 3
  ```
- **Puntero a miembros de `pair` o `struct`**:
  ```cpp
  pair<string, int> a = {"a", 7};
  int *pi = &a.second;
  *pi = 0; // a.second ahora es 0
  ```

> **`nullptr` vs Inicialización**:
> - `int *p = nullptr;` -> El puntero apunta a "nada". Seguro.
> - `int *p;` -> El puntero apunta a una **dirección aleatoria** (basura). Muy peligroso.
> - `int *p = 5;` -> **ERROR**. Estás diciendo que la dirección de memoria es la número 5. Esto provocará un **SEGFAULT** seguro.

```cpp
int x = 10;
int* p = &x; // p apunta a x

cout << p;   // Imprime una dirección: 0x7ffe...
cout << *p;  // Imprime el valor de x: 10
```

## 3. Gestión dinámica de memoria

Esta es la utilidad real de los punteros: pedir memoria en tiempo de ejecución.

### Objetos vs vectores dinámicos

Podemos pedir un solo objeto o un bloque entero (vector) en el Heap usando `new`, y liberarlo con `delete`.

```cpp
// Objetos simples
Data *pd = new Data(2025, 4, 2);
pair<int, int> *pp = new pair<int, int>(1, 2);

// Vectores dinámicos (Muy común en C)
int *pv = new int[100]; 
char *pc = new char[100000];
```

**Memory Leak**: Se produce cuando pierdes la dirección y ya no puedes hacer `delete`.
```cpp
int *p = new int[100];
p = new int[100]; // ERROR: ¡Se ha perdido la dirección del primer vector! Fuga de memoria.
```

## 4. Aliasing y asignación

El **aliasing** ocurre cuando dos o más punteros apuntan a la misma dirección de memoria. Modificar el valor a través de un puntero afecta a todos los otros "alias".

```cpp
int x = 10;
int* p1 = &x;
int* p2 = p1; // Aliasing: p2 apunta a donde apunta p1

*p2 = 20;
cout << x; // ¡Imprimirá 20!
```

**Ejemplo avanzado**: Un vector de punteros apuntando al mismo objeto.
```cpp
int x = 3;
vector<int*> v(10, &x); // 10 punteros que apuntan TODOS a x

for (int i = 0; i < v.size(); ++i) {
    (*v[i])++; // ¡Incrementamos x 10 veces!
}
cout << x; // Imprimirá 13
```

## 5. El peligro de los punteros: errores comunes

El uso de punteros requiere mucha disciplina. Los errores más habituales en PRO2 son:

1.  **Segmentation Fault (SEGFAULT)**: Intentar acceder a una dirección que no te pertenece.
    - Desreferenciar `nullptr`: `int *p = nullptr; *p = 5;`.
    - Acceso fuera de rango en vectores: `vector<int> v; v[13] = 0;`
2.  **Memory Leak**: Destruir la única referencia a una memoria dinámica sin liberarla.
3.  **Dangling Pointer (Puntero colgante)**: Puntero que apunta a una dirección que ya ha sido liberada con `delete`.
4.  **Double-Delete**: Hacer `delete` dos veces sobre la misma dirección (corrompe el heap).

> En el `Makefile`, utiliza el flag `-D_GLIBCXX_DEBUG`. Esto activa comprobaciones de seguridad en los contenedores de la STL y te avisará de los accesos fuera de rango en lugar de darte un SEGFAULT silencioso o datos basura.

| Operación | Iterador (STL) | Punter (Bajo Nivel) |
| :--- | :--- | :--- |
| **Inicio** | `auto it = v.begin();` | `int *px = &x;` |
| **Acceso** | `*it = 5;` | `*px = 5;` |
| **Avanzar** | `it++;` | `px++;` (Avanza una dirección) |
| **Reasignar** | `it = v.erase(it);` | `px = &y;` |

> Un puntero puede ser visto como un iterador de un vector, pero un iterador de un `std::list` no es necesariamente un puntero (internamente puede ser más complejo).

---

## 6. Paso de parámetros 

| Tipo | Sintaxis | Efecto | Eficiencia |
| :--- | :--- | :--- | :--- |
| **Por valor** | `f(int x)` | Copia del valor. | Baja (si el objeto es grande). |
| **Por referencia** | `f(int& x)` | Alias directo. | Alta. |
| **Por puntero** | `f(int* pi)` | Pasa la dirección. Más rápido que por valor. |

**Ejemplo de incremento**:
```cpp
void inc(int *pi) {
    (*pi)++; // significa *pi += 1;
}

int i = 5;
inc(&i); // i ahora vale 6
```

En PRO2, preferimos **referencias constantes** (`const T& x`) para objetos grandes que no queremos modificar, y **punteros** solo cuando necesitamos que el parámetro pueda ser opcional (`nullptr`) o para estructuras dinámicas.
