void removeItem(Item *pitem) {
    extractItem(pitem);
    delete pitem;
}