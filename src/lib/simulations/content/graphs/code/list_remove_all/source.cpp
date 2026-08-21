void removeItem() {
    while (_size > 0) {
        removeItem(iteminf.next);
    }
}