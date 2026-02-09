---
title: "Tema 1: Programació Orientada a Objectes"
description: "Fonaments de classes, disseny modular i gestió de memòria."
readTime: "3 min"
order: 1
---

## 1.1 Repàs: Structs i Pas de Paràmetres

Una **struct** és un tipus de dades definit per l'usuari que permet agrupar diverses variables.

```cpp
struct Estudiant {
    int dni;
    string nom;
    double nota;
};
```

### Pas de paràmetres

- **Pas per valor**: Es fa una còpia. És lent i si modifiques no afecta l'original.
- **Pas per referència (&)**: No es copia (ràpid). Si modifiques, canvies l'original.
- **Lectura (const &)**: `void mostrar(const Estudiant& e);` (Ràpid i segur).
- **Escriptura (&)**: `void actualitzar(Estudiant& e);` (Permet modificar).

## 1.2 Disseny Modular i Classes

El **disseny modular** consisteix a descompondre un programa en peces independents (mòduls). Això millora l'organització i la reutilització.

- **Especificació (.hpp)**: Declaracions de funcions, classes i tipus (el *què*).
- **Implementació (.cpp)**: El codi de les funcions (el *com*).

Una **Classe** és com una struct, però amb una diferència clau: la visibilitat per defecte. En POO, protegim les dades.

- **Private**: Els atributs. SEMPRE privats. Ningú de fora els pot tocar directament.
- **Public**: Els mètodes. És l'única manera d'interactuar amb els objectes.

### Comparació: Struct vs Class

:::grid{cols=2}

```cpp
// Punt.hpp (Especificació)
class Punt {
private:
    double x, y;    // Atributs (Privats)

public:
    // Constructors
    Punt();
    Punt(double a, double b);

    // Modificadors
    void moure(double dx, double dy);

    // Consultors (const!)
    double get_x() const;
    double get_y() const;
    double distancia() const;
};
```

```cpp
// Punt.cpp (Implementació)
#include "Punt.hpp"
#include <cmath>

Punt::Punt() {
    x = 0; y = 0;
}

Punt::Punt(double a, double b) {
    x = a; y = b;
}

void Punt::moure(double dx, double dy) {
    x += dx; y += dy;
}

double Punt::get_x() const {
    return x;
}

double Punt::distancia() const {
    return sqrt(x*x + y*y);
}
```

:::
