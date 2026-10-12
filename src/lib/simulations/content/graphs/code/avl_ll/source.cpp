static void LL(Node*& p) {
    Node* q = p;
    p = p->fesq;
    q->fesq = p->fdre;
    p->fdre = q;
    actualitzar_alcada(q);
    actualitzar_alcada(p);
}
