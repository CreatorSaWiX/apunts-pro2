void plantar(const T &x, vector<ArbreGen> &v) {
    node_arbreGen* aux = new node_arbreGen;
    aux->info = x;
    int ari = v.size();
    aux->seg = vector<node_arbreGen*>(ari);
    for (int i = 0; i < ari; ++i) {
        aux->seg[i] = v[i].primer_node;
        v[i].primer_node = NULL;
    }
    primer_node = aux;
}