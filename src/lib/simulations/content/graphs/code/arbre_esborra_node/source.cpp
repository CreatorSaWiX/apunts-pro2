static void esborra_node_arbre(node_arbre* m) {
    if (m != NULL) {
        esborra_node_arbre(m->segE);
        esborra_node_arbre(m->segD);
        delete m;
    }
}