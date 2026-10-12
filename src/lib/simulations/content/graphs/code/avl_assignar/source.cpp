void assignar(Node*& p, const Clau& clau, const Info& info) {
    if (p) {
        if (clau < p->clau) {
            assignar(p->fesq, clau, info);
            if (alcada(p->fesq) - alcada(p->fdre) == 2) {
                if (clau < p->fesq->clau) LL(p);  // Cas LL
                else                       LR(p);  // Cas LR
            }
            actualitzar_alcada(p);
        } else if (clau > p->clau) {
            assignar(p->fdre, clau, info);
            if (alcada(p->fdre) - alcada(p->fesq) == 2) {
                if (clau > p->fdre->clau) RR(p);  // Cas RR
                else                      RL(p);  // Cas RL
            }
            actualitzar_alcada(p);
        } else {
            p->info = info;  // Clau existent: actualitzar
        }
    } else {
        p = new Node(clau, info, nullptr, nullptr, 0);
        ++n;
    }
}
