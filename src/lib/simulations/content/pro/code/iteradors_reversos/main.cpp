#include <iostream>
#include <list>
using namespace std;

int main() {
    list<int> L = {10, 20, 30};
    
    // Enfoc 1: Intentat recórrer endarrere manualment (Desaconsellat)
    auto it = L.end();
    it--; // Risc alt: L.end() apunta a la cel·la fora dels límits
    
    // Enfoc 2: L'ús de reverse_iterator (Estàndard)
    auto rit = L.rbegin();
    while (rit != L.rend()) {
        *rit += 5;
        rit++; // '++' avança de manera bidireccional automàtica a C++
    }
    
    return 0;
}