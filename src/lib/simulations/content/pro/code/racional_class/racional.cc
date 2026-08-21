#include "racional.hh"
#include <cstdlib>
#include <iostream>

using namespace std;

int Racional::signe(int n) const { return n < 0 ? -1 : 1; }

int Racional::mcd(int a, int b) const {
  while (b != 0) { int aux = b; b = a % b; a = aux; }
  return a;
}

void Racional::simplifica_intern(int n, int d) {
  if (n == 0) { num = 0; den = 1; }
  else {
    int m = mcd(abs(n), abs(d));
    num = (signe(n) * signe(d)) * (abs(n) / m);
    den = abs(d) / m;
  }
}

Racional::Racional() { simplifica_intern(0, 1); }
Racional::Racional(int n, int d) { simplifica_intern(n, d); }

void Racional::llegeix() {
  char _; int n, d;
  cin >> n >> _ >> d;
  simplifica_intern(n, d);
}

void Racional::escriu() const {
  cout << num;
  if (den > 1) { cout << '/' << den; }
}

Racional Racional::suma(const Racional &b) const {
  return Racional(num * b.den + b.num * den, den * b.den);
}