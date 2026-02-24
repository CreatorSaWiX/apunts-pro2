import type { Solution } from '../../solutions';

export const ex2_2: Solution = {
    id: 'M1-T2-Ex2.2',
    title: 'Exercici 2.2: Camí en Graf de Grau Mínim',
    author: 'Profe',
    code: '',
    type: 'notebook',
    statement: `Demostreu que si $G$ és un graf de grau mínim $d$, aleshores $G$ conté un camí de longitud $d$.`,
    content: `
:::info{title="Demostració Constructiva"}
Com que cada vèrtex té com a mínim $d$ veïns, sempre tindrem "via lliure" per moure'ns cap endavant abans de quedar sense opcions no visitades per formar un camí simple de longitud $d$.
:::

Sigui $P = v_0 v_1 v_2 \\dots v_k$ el camí més llarg que podem formar (de longitud màxima) dins el graf $G$. 

Com que és un camí màxim sense repetir vèrtexs (camí simple), sabem que des de l'últim vèrtex $v_k$, totes les seves arestes han d'anar a vèrtexs que **ja estan al camí $P$**. Si anessin cap a un element exterior $x$ que no fos al camí, podríem allargar el camí a $P' = v_0 \\dots v_k x$, cosa que contradiu que $P$ era "el més llarg possible" i danyaria el pressupòsit de camí màxim teòric.

Llavors, els veïns de $v_k$ pertanyen forçosament tots al conjunt $\\{v_0, v_1, \\dots, v_{k-1}\\}$.

Ara, per condició de l'enunciat, sabem que el grau mínim del graf és $d$ (és a dir, $\\delta(G) = d$). 
Això vol dir que $v_k$ té com a mínim $d$ veïns, per tant, el vèrtex final posseeix en direcció cap enrere cap als elements de $P$ no menys de $d$ connexions.

Això només pot ser possible si el conjunt de vèrtexs que hi ha just abans conté espai i places per donar lloc a tots i cadascun dels elements d'aquests $d$ veïns de $v_k$.
L'element veí més allunyat que hàgim de connectar cap endarrere ens obliga, purament com a requisit, a que el camí posseeixi la llargada equivalent cap aquest retrocès obligat!

Com $\\deg(v_k) \\ge d$, el camí original ha d'haver realitzat almenys $d$ "passos previs".
$ k \\ge \\deg(v_k) \\ge d $

Així doncs, observem que el camí com a mínim té assobre el factor llargada superant les expectatives en $d$.
$\\square$
  `,
    availableLanguages: ['ca']
};
