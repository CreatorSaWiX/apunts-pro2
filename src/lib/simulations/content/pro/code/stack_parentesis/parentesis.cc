#include <iostream>
using namespace std;
#include "stack.hh"
using namespace pro2;

void parentesis(istream& in, ostream& out) {
    Stack<char> s;
    char c;
    int pos = 1;

    while (in >> c and c != '.') {
        if (c == '(' or c == '[') {
            s.push(c);
        } 
        else if (c == ')' or c == ']') {
            if (s.empty()) {
                out << "Incorrecte " << pos << endl;
                return;
            }
            char top = s.top();
            if ((c == ')' and top == '(') or (c == ']' and top == '[')) {
                s.pop();
            } else {
                out << "Incorrecte " << pos << endl;
                return;
            }
        }
        pos++;
    }

    if (s.empty()) out << "Correcte\n";
    else out << "Incorrecte " << pos << endl;
}