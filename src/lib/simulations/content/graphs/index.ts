import type { Simulation } from '../../engine/types';
import { eulerian_check } from './implementations/eulerian_check';
import { hamiltonian_backtrack } from './implementations/hamiltonian_backtrack';

import { height } from './implementations/height';
import { cerca_height } from './implementations/cerca_height';
import { dfs } from './implementations/dfs';
import { bfs } from './implementations/bfs';
import { bfs2 } from './implementations/bfs2';
import { preordre } from './implementations/preordre';
import { inordre } from './implementations/inordre';
import { postordre } from './implementations/postordre';
import { heap_push } from './implementations/heap_push';
import { heap_pop } from './implementations/heap_pop';
import { tree_general_search } from './implementations/tree_general_search';
import { bst_search } from './implementations/bst_search';
import { bst_insert } from './implementations/bst_insert';
import { list_insert_node } from './implementations/list_insert_node';
import { list_insert_value } from './implementations/list_insert_value';
import { list_extract_item } from './implementations/list_extract_item';
import { list_remove_item } from './implementations/list_remove_item';
import { list_remove_all } from './implementations/list_remove_all';
import { list_copy_items } from './implementations/list_copy_items';
import { arbre_copia_node } from './implementations/arbre_copia_node';
import { arbre_esborra_node } from './implementations/arbre_esborra_node';
import { arbre_plantar } from './implementations/arbre_plantar';
import { arbre_fills } from './implementations/arbre_fills';
import { arbgen_copia } from './implementations/arbgen_copia';
import { arbgen_esborra } from './implementations/arbgen_esborra';
import { arbgen_plantar } from './implementations/arbgen_plantar';
import { arbgen_fills } from './implementations/arbgen_fills';

export const graphs: Record<string, Simulation> = {
    eulerian_check,
    hamiltonian_backtrack,

    height,
    cerca_height,
    dfs,
    bfs,
    bfs2,
    preordre,
    inordre,
    postordre,
    heap_push,
    heap_pop,
    tree_general_search,
    bst_search,
    bst_insert,
    list_insert_node,
    list_insert_value,
    list_extract_item,
    list_remove_item,
    list_remove_all,
    list_copy_items,
    arbre_copia_node,
    arbre_esborra_node,
    arbre_plantar,
    arbre_fills,
    arbgen_copia,
    arbgen_esborra,
    arbgen_plantar,
    arbgen_fills
};
