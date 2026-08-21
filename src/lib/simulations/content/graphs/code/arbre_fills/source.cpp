void fills(Arbre &fe, Arbre &fd) {
    node_arbre* aux = primer_node;
    fe.primer_node = aux->segE;
    fd.primer_node = aux->segD;
    primer_node = NULL;
    delete aux;
}