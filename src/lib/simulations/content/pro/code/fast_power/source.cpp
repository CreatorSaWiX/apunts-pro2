#include <iostream>
using namespace std;

double potencia(double x, int n) {
    if (n == 0) return 1;
    double y = potencia(x, n / 2);
    if (n % 2 == 0) return y * y;
    else return y * y * x;
}

int main() {
    double resultat = potencia(2.0, 10);
    cout << "2^10 = " << resultat << endl;
}
