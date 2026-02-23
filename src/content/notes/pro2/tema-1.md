---
title: "Tema 1: Classes i orientació a objectes"
description: "Classes i disseny modular"
readTime: "4 min"
order: 1
---

## 1.1 Repàs: structs i pas de paràmetres

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

## 1.2 Tipus abstractes de dades (TAD) i classes

Un **TAD** agrupa dades (atributs) i les operacions (mètodes) per manipular-les, garantint la consistència interna i ocultant detalls innecessaris a l'usuari. En C++, això s'implementa amb una **classe**, que és com una *struct* però conté les pròpies funcions de manipulació integrades.

### L'encapsulació i responsabilitat de consistència

Volem protegir les dades internament absolutament enfrontant dades corrompudes. Si tinguéssim un Rellotge sense restriccions, qualsevol entorn podria equivocar-se i escriure `hores = 43`, destruint silenciosament la lògica pel resta del programa. Un **TAD garanteix la consistència**: blinda les dades darrere restriccions privades i restringeix a què només aquelles poques operacions que hem repassat, validat i acceptat prèviament per l'enginyer com segures hagin de ser capaçes d'inserir novetats internes.

1. **`private`**: Els atributs queden blindats. Ocultar-los evita que codi aliè introdueixi errors fora d'estudi previ. Si la consistència final un dia falla per error, se sap de cert que el culpable amaga codi obligatòriament aquí dins a les pròpies mètodologies acceptades com bones, i no es farà recerca general al llarg de 400 fitxers infinits extrems.
2. **`public`**: Els mètodes seran les exclusives sortides (funcions globals). Constitueixen **l'única porta "legal i validada"** transmesa per poder enviar intencions i extreure missatges de la xarxa des d'objectiu d'ús.

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

> **Nota d'enllaç i requeriment `#include`**
>
> Quan fem `#include "Punt.hpp"`, estem lliurant simplement i pur un "menú d'aprovació d'elements" per establir si a un futur utilitzarà i cridarà noms vàlids en sintaxi lliurement programada pel "main.cc". El programa principal no descodifica la funció "com ho fa" en fer `include`, sinó serà després durant l'execució compilacional via un *Makefile*  que unirà tots la massa dels blocs de regles realitzats del .cpp.

> **Nota referent a `::`**
>
> Com establim condicions allunyades de les claus originàries físiques de l'existència `class`, identifiquem què el que pretenem executar pertany justament a sota algun domini superior mitjançant dos dos punts absoluts: `Punt::moure` ("sunt el metode moure vinculat de l'agrupament de nom relatiu previ `Punt`").

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
:::oopviz{simulation="punt_basic"}
:::

---

## 1.3 Conceptes addicionals de classes

- **Paràmetre implícit (`this`)**: Als mètodes originats (`Punt::moure`), on va anar a parar la incògnita explícita de la classe en memòria pura a introduir per la funció? A la resolució d'objectes orientats, nosaltres cridarem indicant un encàrrec des d'un originant com `p.moure(x, y)`. En el moment d'activar, l'etiqueta objectiva prèvia de `p` referent a abans de posar un el punt, viatja màgica i amagadament oculta enviant com element implicit intern l'essència a reescriure o resoldre de canvis interns. Els dominis `x` i `y` de manera interna descodificaran les accions absolutes reajustant el paràmetre de l'exclusiu `p` passat directament fins la funció.
- **Mètodes `inline`**: S'escriuen directament dins de l'`.hpp`. Permeten estalviar temps d'execució incrustant regles curtes evitant grans seqüències perdudes a enrere o endavant sobre la terminal de procés memori.
- **Mètodes `static`**: Pertanyen a la referència absoluta de classe general com el nom dictat `Dates`, no pertanyien i no cal crear l'element sota un objecte absolut com la instància clàssica per cridar funcions genèricament usant-hi: pot ser per exemple el recurs global (`Dates::avui()`). El gran canvi rellevant recau precisament a la sentència primera darrera mencionada: En mai necessitar i deure una referència originaria d'un element per actuar, resultaran desemparats completament abstractes d'incorporar paràmetres auto-implícits de base interna resolucions on basar les pròpies variables no derivades!.

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

## 1.5 Simulació global: Compilació modular amb Make i templates

Més enllà d'escriure codi, saber dominar un repte complet d'organització com es demanarà requereix l'habilitat suprema i completa sobre *Templates*, com el motor pot construir-lo usant ordres amb seqüències i fitxers múltiples sota arxius programats de l'origen autèntic on mana l'ordre `Makefile`. Observa-ho!

:::oopviz{simulation="projecte_sencer_oop"}
:::
