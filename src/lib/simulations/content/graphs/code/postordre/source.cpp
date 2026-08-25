void postordre(const BinTree<int>& t) {
    if (!t.empty()) {
        postordre(t.left());
        postordre(t.right());
        cout << t.value() << ' ';
    }
}