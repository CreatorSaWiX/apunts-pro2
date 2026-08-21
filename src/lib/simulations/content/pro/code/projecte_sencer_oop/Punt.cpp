#include "Punt.hpp"

// Inicialitzem l'atribut static
int Punt::comptador = 0;

Punt::Punt(double a, double b) {
    this->x = a; 
    this->y = b;
    comptador++;
}

void Punt::moure(double dx, double dy) {
    // Utilitzem 'this->' explícitament (paràmetre implícit)
    this->x += dx; 
    this->y += dy;
}

int Punt::quants_punts() {
    return comptador; // Accés a variable static
}