template <typename T>
void Heap<T>::pop() {
    elems_[1] = elems_[size_];
    resize_(-1);
    flow_down_(1);
}

template <typename T>
void Heap<T>::flow_down_(int i) {
    int left = 2 * i, right = 2 * i + 1;
    int max = i;
    if (left <= size_ && elems_[left] > elems_[max]) max = left;
    if (right <= size_ && elems_[right] > elems_[max]) max = right;
    
    if (max != i) {
        std::swap(elems_[i], elems_[max]);
        flow_down_(max);
    }
}