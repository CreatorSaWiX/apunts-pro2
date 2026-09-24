#include <iostream>
#include <vector>
using namespace std;

int posicio_maxim(const vector<int>& v, int n) {
    int k = 0;
    for (int i = 1; i <= n; ++i)
        if (v[i] > v[k]) k = i;
    return k;
}

void ordena_seleccio(vector<int>& v, int n) {
    for (int i = n - 1; i >= 1; --i) {
        int k = posicio_maxim(v, i);
        swap(v[k], v[i]);
    }
}

int main() {
    vector<int> v = {3, 8, 5, 1, 4};
    ordena_seleccio(v, v.size());
    for (int x : v) cout << x << " ";
    cout << endl;
}
