#include <iostream>
#include <vector>
using namespace std;

int partition(vector<int>& T, int e, int d) {
    int x = T[e];
    int i = e - 1;
    int j = d + 1;
    for (;;) {
        while (x < T[--j]);
        while (T[++i] < x);
        if (i >= j) return j;
        swap(T[i], T[j]);
    }
}

void quicksort(vector<int>& T, int e, int d) {
    if (e < d) {
        int q = partition(T, e, d);
        quicksort(T, e, q);
        quicksort(T, q + 1, d);
    }
}

int main() {
    vector<int> T = {5, 3, 1, 4};
    quicksort(T, 0, T.size() - 1);
    for (int x : T) cout << x << " ";
    cout << endl;
}
