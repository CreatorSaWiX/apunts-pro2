static void RR(Node*& p) {
    Node* q = p;
    p = p->fdre;
    q->fdre = p->fesq;
    p->fesq = q;
    actualitzar_alcada(q);
    actualitzar_alcada(p);
}

static void LL(Node*& p) {
    Node* q = p;
    p = p->fesq;
    q->fesq = p->fdre;
    p->fdre = q;
    actualitzar_alcada(q);
    actualitzar_alcada(p);
}

static void LR(Node*& p) {
    RR(p->fesq);
    LL(p);
}
