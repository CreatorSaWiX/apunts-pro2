void equilibrar_esq(Node*& p) {
    if (alcada(p->fdre) - alcada(p->fesq) == 2) {
        if (alcada(p->fdre->fesq) - alcada(p->fdre->fdre) == 1) RL(p);
        else RR(p);
    } else actualitzar_alcada(p);
}

void equilibrar_dre(Node*& p) {
    if (alcada(p->fesq) - alcada(p->fdre) == 2) {
        if (alcada(p->fesq->fdre) - alcada(p->fesq->fesq) == 1) LR(p);
        else LL(p);
    } else actualitzar_alcada(p);
}

void esborrar(Node*& p, const Clau& clau) {
    if (!p) return;
    if (clau < p->clau) { esborrar(p->fesq, clau); equilibrar_esq(p); }
    else if (clau > p->clau) { esborrar(p->fdre, clau); equilibrar_dre(p); }
    else {
        Node* old = p;
        if (p->alc == 0) p = nullptr;
        else if (!p->fesq) p = p->fdre;
        else if (!p->fdre) p = p->fesq;
        else {
            Node* q = esborrar_minim(p->fdre);
            q->fesq = p->fesq;
            q->fdre = p->fdre;
            p = q;
            equilibrar_dre(p);
        }
        delete old;
        --n;
    }
}
