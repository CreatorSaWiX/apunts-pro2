#include <iostream>
using namespace std;
#include "stack.hh"
using namespace pro2;

void reverse(istream& in, ostream& out) {
    Stack<int> s;
    int n;
    while (in >> n) {
        s.push(n);
    }
    
    // Anem desapilant i cridant el TOP per extreure en invers
    while (!s.empty()) {
        out << s.top();
        s.pop();
        if (!s.empty()) out << " ";
    }
    out << endl;
}