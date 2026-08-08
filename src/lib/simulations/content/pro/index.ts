import type { Simulation } from '../../engine/types';
import { punt_basic } from './implementations/punt_basic';
import { pila_cpp } from './implementations/pila_cpp';
import { cua_cpp } from './implementations/cua_cpp';
import { llista_iteradors } from './implementations/llista_iteradors';
import { convencions_cpp } from './implementations/convencions_cpp';
import { arbre_bintree_immersio } from './implementations/arbre_bintree_immersio';
import { projecte_sencer_oop } from './implementations/projecte_sencer_oop';
import { iteradors_reversos } from './implementations/iteradors_reversos';
import { data_class } from './implementations/data_class';
import { racional_class } from './implementations/racional_class';
import { stack_reverse } from './implementations/stack_reverse';
import { stack_parentesis } from './implementations/stack_parentesis';
import { stack_recursivitat } from './implementations/stack_recursivitat';
import { queue_patata } from './implementations/queue_patata';
import { queue_recents } from './implementations/queue_recents';

export const pro: Record<string, Simulation> = {
    punt_basic,
    pila_cpp,
    cua_cpp,
    llista_iteradors,
    convencions_cpp,
    arbre_bintree_immersio,
    projecte_sencer_oop,
    iteradors_reversos,
    data_class,
    racional_class,
    stack_reverse,
    stack_parentesis,
    stack_recursivitat,
    queue_patata,
    queue_recents
};
