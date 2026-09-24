#include <iostream>
#include <vector>
using namespace std;

void ordena_insercio(vector<int>& v, int n) {
    for (int k = 1; k <= n - 1; ++k) {
        int j = k - 1;
        while (j >= 0 and v[j+1] < v[j]) {
            swap(v[j], v[j+1]);
            --j;
        }
    }
}

int main() {
    vector<int> v = {3, 8, 5, 1, 4};
    ordena_insercio(v, v.size());
    for (int x : v) cout << x << " ";
    cout << endl;
}
