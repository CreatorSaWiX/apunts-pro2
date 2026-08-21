#include <iostream>
#include "Caixa.hh"
using namespace std;

int main() {
    Caixa c(10);
    
    c.afegir(5);
    
    cout << "Tenim: " << c.quantitat() << endl;
    
    // c.afegir(-3); // Descomentar faria petar l'assert
    return 0;
}