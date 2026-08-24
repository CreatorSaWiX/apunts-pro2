#include <iostream>
#include <list>
using namespace std;

int main() {
    list<int> L = {10, 20, 30};
    
    auto it = L.end();
    it--;
    
    auto rit = L.rbegin();
    while (rit != L.rend()) {
        *rit += 5;
        rit++;
    }
    
    return 0;
}