#include <iostream>
using namespace std;
#include "stack.hh"
using namespace pro2;

void escriu(int n, ostream& out) {
    Stack<int> s;
    s.push(n);

    // Iterant contínuament fins haver desapilat tota acció virtual
    while (!s.empty()) {
        int v = s.top();
        s.pop();
        
        if (v > 0) {
            out << ' ' << v;
            // El simulador real apila dreta i després esquerra. Aquí ho
            // adaptem a la recursivitat pura de dalt a baix iterativa.
            s.push(v - 1);
            s.push(v - 1);
        }
    }
}