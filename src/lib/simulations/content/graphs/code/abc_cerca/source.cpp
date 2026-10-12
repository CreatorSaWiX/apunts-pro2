static Node* cerca(Node* p, const Clau& clau) {
    if (!p) return nullptr;
    if (clau < p->clau) return cerca(p->fesq, clau);
    if (clau > p->clau) return cerca(p->fdre, clau);
    return p;
}
