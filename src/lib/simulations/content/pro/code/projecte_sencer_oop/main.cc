#include <iostream>
#include "Punt.hpp"
using namespace std;

int main() {
    Punt p1(1, 2);
    Punt p2(5, 5);
    
    p1.moure(2, 2);
    
    cout << "X de p1: " << p1.get_x() << endl;
    cout << "Punts creats: " << Punt::quants_punts() << endl;
    
    return 0;
}