import type { Solution } from '../../solutions';

export const ex2_3: Solution = {
    id: 'M1-T2-Ex2.3',
    title: 'Exercici 2.3: Components Connexos i Vèrtexs',
    author: 'Profe',
    code: '',
    type: 'notebook',
    statement: `Un graf té ordre 13 i 3 components connexos. Demostreu que un dels components té un mínim de 5 vèrtexs.`,
    content: `
Tenim determinades variables generals basades en variables discretes de càlcul:
*   $n = 13$ vèrtexs en total.
*   $k = 3$ components connexos lliures.

Volem encabir $13$ persones (vèrtexs) dins de només $3$ agrupaments (components), per tant, utilitzem l'eina teòrica clàssica anomenada **Principi de Dirichlet (del Colomar o les Caixes)**.

Si intentem distribuir la gent per omplir els conjunts de la manera més uniformada i repartida possible (repartir-ho igual):
$ \\frac{13}{3} = 4.333 \\dots $

Com que el nombre de vèrtexs per grup intern és un comptador individual i indivisible només pot ser un valor sencer positiu o nombre natural $\\in \\mathbb{N}$, la quantitat d'una caixa sempre acabarà agafant un recarrega equivalent a arrodonir la fracció per excés al factor de "quota completa pròxima":

$$
\\text{Vèrtexs al grup més poblat} \\ge \\lceil \\frac{13}{3} \\rceil = \\lceil 4.333 \\dots \\rceil = 5
$$

**Conclusió:**
És materialment impossible formar tres components tancats repartint 13 elements sense que com a mínim un dels tres s'emporti un total d'entre els altres a un grup i no sigui el que l'altri ha recollit per acabar creant la col·lecció de recanvi on tenim $5$ vèrtexs! 

L'estratègia de repartiment forçat on aconseguim que ningú guanyi més seria $(4, 4, 5)$, i allà, demostrem que un d'ells adoba al mínim els $\\ge 5$. $\\square$
  `,
    availableLanguages: ['ca']
};
