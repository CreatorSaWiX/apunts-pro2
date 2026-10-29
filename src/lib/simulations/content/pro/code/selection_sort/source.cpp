#include <iostream>
#include <vector>
using namespace std;

int posicio_minim(const vector<int>& v, int d, int n) {
    int k = d;
    for (int i = d + 1; i < n; ++i)
        if (v[i] < v[k]) k = i;
    return k;
}

void ordena_seleccio(vector<int>& v, int n) {
    for (int i = 0; i < n - 1; ++i) {
        int k = posicio_minim(v, i, n);
        swap(v[k], v[i]);
    }
}

int main() {
    vector<int> v = {3, 8, 5, 1, 4};
    ordena_seleccio(v, v.size());
    for (int x : v) cout << x << " ";
    cout << endl;
}
