#include <iostream>
#include <queue>
#include "bintree.hh"
using namespace std;
// Imprimim (Pre-Ordre Arrel, Esquerre, Dret) per profunditat sense cua
void preordre(const BinTree<int>& t) {
    if (!t.empty()) {
        cout << t.value() << " ";
        preordre(t.left());
        preordre(t.right());
    }
}
// L'Amplada per Onades sense baixar infinit! Tema 2 a l'atac BFS
void amplada(BinTree<int> t) {
    if (t.empty()) return;
    queue<BinTree<int>> cua;
    cua.push(t);
    while (!cua.empty()) {
        BinTree<int> curr = cua.front(); 
        cua.pop();
        cout << curr.value() << " ";
        if (!curr.left().empty()) cua.push(curr.left());
        if (!curr.right().empty()) cua.push(curr.right());
    }
}
int main() {
    BinTree<int> fulla_Esq(2);
    BinTree<int> fulla_Der(3);
    BinTree<int> ArbreTotal(1, fulla_Esq, fulla_Der);
    cout << "Preorde: "; preordre(ArbreTotal);
    cout << "\nAmplada: "; amplada(ArbreTotal);
    return 0;
}