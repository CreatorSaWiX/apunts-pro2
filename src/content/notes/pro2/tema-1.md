---
title: "Tema 1: Classes i orientació a objectes"
description: "Classes i disseny modular"
readTime: "4 min"
order: 1
---

## 1.1 Repàs: Structs i pas de paràmetres

Una **struct** és un tipus definit per l'usuari que agrupa diverses dades relacionades.

```cpp [main.cpp]
struct Rellotge {
    int h, m, s;
};  //Important posar ';'!
```

### Com passar structs a funcions?

- **Per valor**: Es fa una còpia. Lent i no modifica l'original.
- **Per referència (`&`)**:
    - **Lectura (`const` + `&`)**: Ràpid i segur. `void mostrar(const Rellotge& r);`
    - **Escriptura (`&`)**: Modifica l'original. `void avançar(Rellotge& r);`

## 1.2 Tipus Abstractes de Dades (TAD) i Classes

Un **TAD** agrupa dades (atributs) i les operacions (mètodes) per manipular-les, garantint la consistència interna i ocultant detalls innecessaris a l'usuari. En C++, això s'implementa amb una **classe**, que és com una *struct* però conté les pròpies funcions de manipulació integrades.

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

```cpp [Punt.hpp]
#ifndef PUNT_HPP
#define PUNT_HPP

class Punt {
    // Per defecte tot és privat
    double x, y;

public:
    // Constructors (inicialitzen l'objecte)
    Punt();                           // Constructor per defecte
    Punt(double a, double b);         // Constructor amb paràmetres
    Punt(const Punt& altre);          // Constructor de còpia

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

```cpp [Punt.cpp]
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

// Constructor de còpia: Crea un objecte idèntic a un altre existent
Punt::Punt(const Punt& altre) {
    x = altre.x; y = altre.y;
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

```cpp [main.cpp]
#include <iostream>
#include "Punt.hpp"

int main() {
    Punt p(1, 2);       // Crea objecte (crida constructor)
    Punt p_copia(p);    // Crea objecte idèntic (crida constructor de còpia)
    
    p.moure(3, 3);      // Crida mètode (l'objecte p és l'implícit)
    
    // cout << p.x; // ERROR! x és privat
    cout << p.get_x(); // Correcte: accés via mètode públic
}
```

---

## 1.3 Conceptes addicionals de classes

- **Paràmetre implícit (`this`)**: Als mètodes (`Punt::moure`), l'objecte sobre el qual es crida la funció passa de forma automàtica. Tu no envies l'objecte; la funció ja hi és dins!
- **Mètodes `inline`**: S'escriuen directament dins de l'`.hpp`. Permeten estalviar temps d'execució en mètodes molt petits i cridats freqüentment.
- **Mètodes `static`**: Pertanyen a la classe general i no a un objecte concret (ex: `Dates::avui()`). Es poden cridar sense haver creat cap variable, però no tenen paràmetre implícit.

### Genericitat (`template`)
Els *templates* permeten que una classe funcioni de forma genèrica i independent per a diferents tipus de dades (ex: `vector<int>` o `vector<string>`), sense haver de repetir codi per a cada tipus.

```cpp
template <class T> // La 'T' es fixa quan l'usuari declara la variable
class Capsa {
    T contingut;
public:
    Capsa(T x) { contingut = x; } // El paràmetre 'x' depèn de 'T'
};

// Ús: Capsa<int> de_enters(5); Capsa<string> de_text("Hola");
```

---

## 1.4 Compilació amb Makefile
A PRO2 organitzem els programes en múltiples fitxers (`main.cc`, `Punt.hpp`...). Per evitar compilar manualment tots els fitxers a mà, creem un arxiu d'instruccions anomenat `Makefile` per establir-ne les regles i dependències (fitxers objecte `.o`).

L'ordre `make` executa aquest fitxer de forma automàtica i eficient (només compila els fitxers modificats!).

```makefile [Makefile]
CXX = g++
CXXFLAGS = -Wall -std=c++17

# Regla final
program: main.o Punt.o
	$(CXX) -o program main.o Punt.o

# Regles individuals de compilació modular
main.o: main.cc Punt.hpp
	$(CXX) $(CXXFLAGS) -c main.cc
```

---

## 1.5 Simulació: Classes a Memòria

Un exemple complet per veure què passa quan s'instancia i manipula un objecte interactuant en diferents fitxers. Prem el *Play* per explorar la construcció de l'objecte:

:::oopviz{simulation="punt_basic"}
:::
