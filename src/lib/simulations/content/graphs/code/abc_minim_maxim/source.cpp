static Node* minim(Node* p) {
    return p->fesq ? minim(p->fesq) : p;
}

static Node* maxim(Node* p) {
    while (p->fdre) p = p->fdre;
    return p;
}
