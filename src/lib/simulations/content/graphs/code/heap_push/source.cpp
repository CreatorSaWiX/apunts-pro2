template <typename T>
void Heap<T>::push(const T& x) {
    resize_(1);
    elems_[size_] = x;
    flow_up_(size_);
}

template <typename T>
void Heap<T>::flow_up_(int i) {
    while (i > 1 && elems_[i] > elems_[i / 2]) {
        std::swap(elems_[i], elems_[i / 2]);
        i /= 2;
    }
}