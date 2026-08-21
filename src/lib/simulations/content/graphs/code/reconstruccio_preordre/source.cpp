// Input cin: "10 5 # # 14 # #"
template <typename T>
pro2::BinTree<T> build_preorder(istream& cin) {
    string token;
    cin >> token;
    
    if (token == "#" || !cin) return pro2::BinTree<T>(); 
    
    T value = read_value<T>(token);
    auto left = build_preorder<T>(cin);
    auto right = build_preorder<T>(cin);
    
    return pro2::BinTree<T>(value, left, right);
}