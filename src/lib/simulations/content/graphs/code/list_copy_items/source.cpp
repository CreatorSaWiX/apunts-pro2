void copyItems(const List& l) {
    for (Item *pitem = l.itemsup.prev; pitem != &l.iteminf; pitem = pitem->prev) {
        insertItem(&iteminf, pitem->value);
    }
}