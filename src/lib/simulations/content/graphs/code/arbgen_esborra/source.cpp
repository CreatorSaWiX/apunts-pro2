static void esborra_node_arbreGen(node_arbreGen* m) {  
    if (m != NULL) {
        int ari = m->seg.size();
        for (int i = 0; i < ari; ++i) 
            esborra_node_arbreGen(m->seg[i]);
        delete m;
    }
}