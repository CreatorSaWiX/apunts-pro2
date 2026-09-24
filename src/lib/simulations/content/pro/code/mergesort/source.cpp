#include <iostream>
#include <vector>
using namespace std;

void merge(vector<int>& T, int e, int m, int d) {
    vector<int> B(d - e + 1);
    int i = e, j = m + 1, k = 0;
    while (i <= m and j <= d) {
        if (T[i] <= T[j]) B[k++] = T[i++];
        else B[k++] = T[j++];
    }
    while (i <= m) B[k++] = T[i++];
    while (j <= d) B[k++] = T[j++];
    for (k = 0; k <= d - e; ++k) T[e + k] = B[k];
}

void mergesort(vector<int>& T, int e, int d) {
    if (e < d) {
        int m = (e + d) / 2;
        mergesort(T, e, m);
        mergesort(T, m + 1, d);
        merge(T, e, m, d);
    }
}

int main() {
    vector<int> T = {8, 2, 5, 1};
    mergesort(T, 0, T.size() - 1);
    for (int x : T) cout << x << " ";
    cout << endl;
}
