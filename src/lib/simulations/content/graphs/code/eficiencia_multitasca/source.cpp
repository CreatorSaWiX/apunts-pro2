pair<double, int> sum_and_size__(BinTree<double> t) {
    if (t.empty()) return {0.0, 0};
    
    auto L = sum_and_size__(t.left());
    auto R = sum_and_size__(t.right());
    
    return {
        t.value() + L.first + R.first, 
        1 + L.second + R.second
    };
}