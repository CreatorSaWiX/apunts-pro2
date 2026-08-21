#include "data.hh"
#include <iostream>

using namespace std;

int main() {
  Data d;
  int n;

  d.llegeix();
  while (cin >> n) {
    Data resultat = d.suma_dies(n);
    resultat.escriu();
    cout << endl;
    
    d.llegeix();
  }
  return 0;
}