void plantar(const T &x, Arbre &a1, Arbre &a2) {
    node_arbre* aux = new node_arbre;
    aux->info = x;
    aux->segE = a1.primer_node;
    aux->segD = a2.primer_node;
    primer_node = aux;
    a1.primer_node = NULL;
    a2.primer_node = NULL;
}