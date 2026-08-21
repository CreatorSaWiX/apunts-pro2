static node_arbreGen* copia_node_arbreGen(node_arbreGen* m) { 
    if (m == NULL) return NULL;
    node_arbreGen* n = new node_arbreGen;
    n->info = m->info;
    int ari = m->seg.size();
    n->seg = vector<node_arbreGen*>(ari);
    for (int i = 0; i < ari; ++i) 
        n->seg[i] = copia_node_arbreGen(m->seg[i]);        
    return n;
}