---
title: "Tema 1: Clases y orientación a objetos"
description: "Clases y diseño modular"
readTime: "10 min"
order: 1
---

## 1.1 Repaso: structs y paso de parámetros

Una **struct** agrupa varios datos relacionados.

```cpp [main.cpp]
struct Rellotge {
    int h, m, s;
};  // Hay que poner el ';'
```

### Paso de parámetros a funciones
- **Por valor**: Se hace una copia. Lento y no modifica el original.
- **Por referencia (`&`)**:
    - **Lectura (`const` + `&`)**: Rápido y seguro. No hay copia. `void mostrar(const Rellotge& r);`
    - **Escritura (`&`)**: Modifica el original directamente. `void avançar(Rellotge& r);`

## 1.2 Tipos abstractos de datos (TAD) y clases

Un **TAD** agrupa datos (atributos) y las operaciones (métodos) para manipularlas. En C++, se implementa con **clases** para garantizar la consistencia de los datos.

### Encapsulación
Blinda los datos para evitar modificaciones incontroladas externas:
- **`private`**: Atributos ocultos al código externo. Solo accesibles por los métodos de la misma clase.
- **`public`**: Métodos accesibles desde fuera. Son la interfaz o única vía válida para interactuar con el objeto.

---

### Organización en ficheros

Separamos el "qué hace" del "cómo lo hace".

### 1. Especificación (`.hpp` o `.hh`)
Define la estructura de la clase. Incluye guardias (`#ifndef`) para evitar inclusiones múltiples y bucles de compilación.

```cpp [Punt.hpp]
#ifndef PUNT_HPP
#define PUNT_HPP

class Punt {
    double x, y; // Privado por defecto

public:
    Punt();                           // Constructor por defecto
    Punt(double a, double b);         // Constructor con parámetros
    Punt(const Punt& altre);          // Constructor de copia

    void moure(double dx, double dy); // Modificador
    double get_x() const;             // Consultor (const = no modifica)
};
#endif
```

### 2. Implementación (`.cpp` o `.cc`)
Contiene el código real de las funciones declaradas.
- **`#include "Punt.hpp"`**: Carga las definiciones de datos previas.
- **Operador `::`** (Resolución de ámbito): Indica a qué clase pertenece la función (ej: `Punt::moure`).

```cpp [Punt.cpp]
#include "Punt.hpp"

Punt::Punt() { x = 0; y = 0; }
Punt::Punt(double a, double b) { x = a; y = b; }
Punt::Punt(const Punt& altre) { x = altre.x; y = altre.y; }

void Punt::moure(double dx, double dy) {
    x += dx; y += dy; // Acceso a los atributos del objeto actual
}

double Punt::get_x() const { return x; }
```

### 3. Uso (`main.cc`)
Creación y uso de objetos.

```cpp [main.cpp]
#include <iostream>
#include "Punt.hpp"

int main() {
    Punt p(1, 2);       // Llamada al constructor con parámetros
    p.moure(3, 3);      // 'p' actúa como parámetro implícito
    
    // std::cout << p.x;   // ¡ERROR! 'x' es privado
    std::cout << p.get_x(); // Correcto
}
```

:::oopviz{simulation="punt_basic"}
:::

---

## 1.3 Conceptos adicionales de clases

- **Parámetro implícito (`this`)**: Es un puntero interno escondido que referencia el objeto sobre el que llamamos un método. Ejemplo: en `p.moure()`, `this` apunta a `p`.
- **Métodos `inline`**: Se escriben directamente dentro del `.hpp`. El compilador sustituye la llamada de esta función por sus instrucciones para evitar saltos y ganar rapidez.
- **Miembros `static`**: 
  - *Atributos*: Se comparten globalmente entre todos los objetos de la misma clase (ej: un contador de Puntos totales).
  - *Métodos*: No requieren instanciar ningún objeto para ejecutarse. Se llaman mediante la referencia absoluta `Punt::quants_punts()` y, por lo tanto, **no disponen de `this`**.

### Genericidad (`template`)
Permiten crear estructuras y funciones inteligentes indiferentes hacia el tipo de dato que almacenan (como `vector<int>` o `vector<string>`), ahorrando programar la misma clase mil veces.

```cpp
template <class T>
class Capsa {
    T contingut;
public:
    Capsa(T x) { contingut = x; } 
};
// Uso: Capsa<int> enter(5); Capsa<string> text("Hola");
```

---

## 1.4 Compilación con Makefile
Para gestionar proyectos eficientemente con muchos ficheros (`main.cc`, `Punt.hpp`, `Punt.cpp`), delegamos el trabajo a un fichero de comandos `Makefile`. Una vez programado, ejecutar simplemente `make` unificará los códigos `.o` solo si han sufrido cambios recientes.

```makefile [Makefile]
CXX = g++
CXXFLAGS = -Wall -std=c++17

program: main.o Punt.o
	$(CXX) -o program main.o Punt.o

main.o: main.cc Punt.hpp
	==(CXX) ==(CXXFLAGS) -c main.cc
```

---

## 1.5 Por si no te gusta leer teoría

Este simulador contiene un proyecto entero con clases, métodos, `this`, `inline`, `static` y un `Makefile`.

:::oopviz{simulation="projecte_sencer_oop"}
:::
