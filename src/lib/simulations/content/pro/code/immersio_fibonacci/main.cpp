#include <iostream>
using namespace std;

int i_fibonacci(int n, int a, int b) {
    if (n == 0) return a;
    return i_fibonacci(n - 1, b, a + b);
}

int fibonacci(int n) {
    return i_fibonacci(n, 0, 1);
}

int main() {
    int n = 4;
    int res = fibonacci(n);
    cout << res << endl;
    return 0;
}
