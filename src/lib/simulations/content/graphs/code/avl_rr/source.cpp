static void RR(Node*& p) {
    Node* q = p;
    p = p->fdre;
    q->fdre = p->fesq;
    p->fesq = q;
    actualitzar_alcada(q);
    actualitzar_alcada(p);
}
