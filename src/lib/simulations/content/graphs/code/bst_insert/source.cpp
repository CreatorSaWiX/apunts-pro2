BinTree<int> bst_insert(const BinTree<int>& a, int x) {
    if (a.empty()) return BinTree<int>(x);
    if (x == a.value()) return a; // ja existeix
    if (x < a.value()) return BinTree<int>(a.value(), bst_insert(a.left(), x), a.right());
    return BinTree<int>(a.value(), a.left(), bst_insert(a.right(), x));
}