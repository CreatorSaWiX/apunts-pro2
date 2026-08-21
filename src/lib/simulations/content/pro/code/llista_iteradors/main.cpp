#include <iostream>
#include <list>
using namespace std;

void netejar_llista(list<int>& L) {
    auto it = L.begin();
    
    while (it != L.end()) {
        if (*it == 10) {
            it = L.erase(it); 
        } 
        else if (*it == -1) {
            it = L.insert(it, 0); 
            advance(it, 2); 
        } 
        else {
            it++;
        }
    }
}

int main() {
    list<int> L = {10, -1, 30};
    netejar_llista(L);
    return 0;
}