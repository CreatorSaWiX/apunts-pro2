static node_arbre* copia_node_arbre(node_arbre* m) {
    node_arbre* n;
    if (m == NULL) n = NULL;
    else {
        n = new node_arbre;
        n->info = m->info;
        n->segE = copia_node_arbre(m->segE);
        n->segD = copia_node_arbre(m->segD);
    }
    return n;
}