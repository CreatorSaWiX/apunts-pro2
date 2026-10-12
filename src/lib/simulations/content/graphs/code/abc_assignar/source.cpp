static void assignar(Node*& p, const Clau& clau, const Info& info, int& n) {
    if (p) {
        if (clau < p->clau) assignar(p->fesq, clau, info, n);
        else if (clau > p->clau) assignar(p->fdre, clau, info, n);
        else p->info = info;  // Clau existent: sobreescriure
    } else {
        p = new Node(clau, info);
        ++n;
    }
}
