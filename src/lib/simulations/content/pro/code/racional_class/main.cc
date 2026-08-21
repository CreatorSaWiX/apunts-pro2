#include "racional.hh"
#include <iostream>
#include <string>

using namespace std;

// Solució al laboratori Racionals
int main() {
  Racional r;
  Racional acum;
  
  acum.llegeix();
  acum.escriu();
  cout << endl;

  string op;
  while (cin >> op) {
    r.llegeix();

    if (op == "+") {
      acum = acum.suma(r);
    } else if (op == "-") {
      acum = acum.resta(r);
    }

    acum.escriu();
    cout << endl;
  }
}