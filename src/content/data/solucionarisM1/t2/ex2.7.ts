import type { Solution } from '../../solutions';

export const ex2_7: Solution = {
    id: 'M1-T2-Ex2.7',
    title: 'Exercici 2.7: Extrems de Mida segons Components Connexos i Arbres',
    author: 'Profe',
    code: '',
    type: 'notebook',
    statement: `Sigui $G$ un graf d'ordre $n$ amb exactament $k$ components connexos. Demostreu que la mida de $G$ és més gran o igual que $n - k$.`,
    content: `
Recordem una dada vital de la Teoria fonamental:
Per a poder lligar i interconnectar d'unió tota informació en l'àmbit general de grups de vèrtexs que composen cadascun com a lliure unitat un "Component connex de mida particular" respectant a la reducció i manteniment d'estendre un cas ben minimalista global, l'estructura de ponts base complet objectius òptims segons la minimització total possible de cost lligat o quantitat total estricta d'arestes es nomena sempre **Arbre**.

En qualsevol *Arbre* independent formatiu de la base simple, un component connex particular d'una illa isolada s'uneix absolut amb el seu límit d'inferior on pretenem la fita estricte i exacta oficial per defecte on:  
$ m_{arbre} = n_{\\text{illa}} - 1 $

Doncs veient la teoria pel qual el nostre sencer complet absolut gràfic $G$ principal només formatiu a referències absolutes constants de grup tancant on consta no del general lliurat de tot referent o global exclus a unit o sencer de base de 1 només illa separada o absolut pur com components general, sinó just dividida literal a subregions d'illes pur formatiu estables components limitats pur objectivament aglutinats per natural format de constant lliurat a valor exclusiu total nombre $k$. Sabem amb fons teòric com el d'abans base fons per limit a subregions autònomes formades i independents en paral·lel de Boscos units autònom sense unificació (nom agrupant un Bosc base fons on formarien les variables on prenguéssim limit minimal exclus total d'elements illes tancats de fita limitades components):
* Component 1: format per $n_1$ vèrtexs. Per fer connectar tot l'equips pur sense separació al tancat es faran falta de limit teòric mínim un recurs sumatori predeterminat donant forces absolutes arestes sumades i lliurades a relacions base unitari d $\\ge n_1 - 1$
* Component 2: format de $n_2$ vèrtexs referents i base que suma un mínim a resultat global i total $\\ge n_2 - 1$
* I destacant directriu per darrer general pas exclus seguint unió fins tancat i passat referint fins extrem per omissió el final i llunyà general limit formant base extrema Component $k$: total $\\ge n_k - 1$.

Llavors tenint clar la via si aglutinem i lliurem directament agrupar la sumatòria al sumatori relatiu complet global sumari general base total del graf total unitari:
$$
m(G) = \\sum_{i=1}^k m_i \\ge \\sum_{i=1}^k (n_i - 1)
$$

Desglossem l'expressió pura en components relacional sumes extretes i obertes purament donant:
$$
\\ge (n_1 + n_2 + \\cdots + n_k) - (1 + 1 + \\cdots + 1 \\text{ un total absolut repetiu pur vegades segons } k \\text{ elements unitats sumats base})
$$

Com tenim en fons clars de condicions d'hipòtesis per bases fixades sumant que la agrupació general on ens sumatòria per elements lliurar cèl·lules internes base globals dels paràmetres suma l'estructura limit constant o universal i general on es declara que en tot graf sempre es fa la constat complet absolut unió per equacions generals donades que el pes del total de nodes a elements parcials i conjunts lliurats i llistats fa factor l'arrel original lliurant d: $(n_1 + \\dots + n_k) = n$, la nostra conversió d'incògnita obre base directa i substitueix pur del sistema generant sense pas a base més i directriu final que assoleix sent resoluble amb absolut garant en fita demostratiu de factor!!
$$
m(G) \\ge n - k
$$
$\\square$
  `,
    availableLanguages: ['ca']
};
