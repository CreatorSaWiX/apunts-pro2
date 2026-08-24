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
            L.insert(it, 0); 
            it++;
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