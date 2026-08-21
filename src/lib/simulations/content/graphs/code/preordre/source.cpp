void preordre(BinTree<int> t) {
    if (!t.empty()) {
        cout << t.value() << ' ';
        preordre(t.left());
        preordre(t.right());
    }
}