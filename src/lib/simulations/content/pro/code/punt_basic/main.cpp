#include <iostream>
#include "Punt.hpp"
using namespace std;

int main() {
    Punt p(1, 2);
    
    p.moure(3, 3);
    
    cout << "Coordenada X: " << p.get_x() << endl;
    return 0;
}