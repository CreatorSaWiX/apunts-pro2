void inordre(const BinTree<int>& t) {
    if (!t.empty()) {
        inordre(t.left());
        cout << t.value() << ' ';
        inordre(t.right());
    }
}