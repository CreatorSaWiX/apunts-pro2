#include <iostream>
#include <vector>
using namespace std;

int cerca_binaria(const vector<int>& a, int i, int j, int x) {
    if (i <= j) {
        int k = (i + j) / 2;
        if (x < a[k]) return cerca_binaria(a, i, k - 1, x);
        else if (x > a[k]) return cerca_binaria(a, k + 1, j, x);
        else return k;
    }
    else return -1;
}

int main() {
    vector<int> a = {1, 3, 5, 7, 9, 11, 13};
    int pos = cerca_binaria(a, 0, a.size() - 1, 9);
    cout << "Posicio: " << pos << endl;
}
