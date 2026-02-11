---
title: "Tema 1: Programació orientada a objectes"
description: "Fonaments de classes, disseny modular i gestió de memòria."
readTime: "3 min"
order: 1
---

## 1.1 Repàs: Structs i pas de paràmetres

Una **struct** és un tipus definit per l'usuari que agrupa diverses dades relacionades.

```cpp
struct Rellotge {
    int h, m, s;
};  //Important posar ';'!
```

### Com passar structs a funcions?

- **Per valor**: Es fa una còpia. Lent i no modifica l'original.
- **Per referència (`&`)**:
    - **Lectura (`const` + `&`)**: Ràpid i segur. `void mostrar(const Rellotge& r);`
    - **Escriptura (`&`)**: Modifica l'original. `void avançar(Rellotge& r);`

## 1.2 Classes i objectes

Una **classe** és com una struct però conté les funcions que les manipulen anomenades **mètodes**.

### L'encapsulació

Volem protegir les dades perquè ningú les toqui incorrectament (ex: hores = 25).

1. **`private`**: Els atributs (dades) són secrets. Només la pròpia classe hi pot accedir.
2. **`public`**: Els mètodes (funcions) són públics. És **l'única forma** que tenim de comunicar-nos amb l'objecte.

---

### Organització en fitxers

Per mantenir l'ordre, separem el "què fa" del "com ho fa".

### 1. Especificació (`.hpp` o `.hh`)
És el "menú" de la classe. Diu què pots fer, però no com.
*Cal protegir-ho amb guàrdies (`#ifndef`) perquè no es copiï dos cops.*

```cpp
#ifndef PUNT_HPP
#define PUNT_HPP

class Punt {
    // Per defecte tot és privat
    double x, y;

public:
    // Constructors (inicialitzen l'objecte)
    Punt();
    Punt(double a, double b);

    // Mètodes modificadors (canvien valors)
    void moure(double dx, double dy);

    // Mètodes consultors (només llegeixen, porten 'const')
    double get_x() const;
    double get_y() const;
};
#endif
```

### 2. Implementació (`.cpp` o `.cc`)
Aquí escrivim el codi real de les funcions.

> **Nota sobre `::`**
>
> Com que estem fora de la classe, hem de dir a qui pertany cada funció.
> `Punt::moure` significa "la funció `moure` que pertany a la classe `Punt`".

```cpp
#include "Punt.hpp"
#include <cmath>

// Constructor buit: inicialitza a 0
Punt::Punt() {
    x = 0; y = 0;
}

// Constructor amb paràmetres
Punt::Punt(double a, double b) {
    x = a; y = b;
}

// Fixa't que NO posem p.x, accedim directament a x
// Això és el "paràmetre implícit": som dins l'objecte!
void Punt::moure(double dx, double dy) {
    x += dx; y += dy;
}

double Punt::get_x() const {
    return x;
}
```

### 3. Ús (`main.cc`)
Així es crea i s'utilitza un objecte.

```cpp
#include <iostream>
#include "Punt.hpp"

int main() {
    Punt p(1, 2);   // Crea objecte (crida constructor)
    p.moure(3, 3);  // Crida mètode (l'objecte p és l'implícit)
    
    // cout << p.x; // ERROR! x és privat
    cout << p.get_x(); // Correcte: accés via mètode públic
}
```
