void insertItem(Item *pitemprev, const T &value) {
    Item *pitem = new Item;
    pitem->value = value;
    insertItem(pitemprev, pitem);
}