void fills(vector<ArbreGen> &v) {
    node_arbreGen* aux = primer_node;
    int ari = aux->seg.size();
    v = vector<ArbreGen>(ari);
    for (int i = 0; i < ari; ++i) {
        v[i].primer_node = aux->seg[i];
    }
    primer_node = NULL;
    delete aux;
}