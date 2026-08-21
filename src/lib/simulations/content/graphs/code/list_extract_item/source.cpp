void extractItem(Item *pitem) {
    pitem->next->prev = pitem->prev;
    pitem->prev->next = pitem->next;
    _size--;
}