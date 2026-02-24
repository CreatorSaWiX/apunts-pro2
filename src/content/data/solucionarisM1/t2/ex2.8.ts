import type { Solution } from '../../solutions';

export const ex2_8: Solution = {
    id: 'M1-T2-Ex2.8',
    title: 'Exercici 2.8: Construcció Fita Superior (Mida i Connexió)',
    author: 'Profe',
    code: '',
    type: 'notebook',
    statement: `Sigui $G$ un graf d'ordre $n$ amb exactament $k+1$ components connexos. En aquest exercici volem trobar una fita superior per la mida de $G$. Per a fer-ho definim el graf auxiliar $H$ d'ordre $n$ amb $k+1$ components connexos, $k \\ge 1$: $k$ són isomorfs a $K_1$ i un component és isomorf a $K_{n-k}$.\n1) Calculeu la mida de $H$.\n2) Demostreu que la mida de $H$ és més gran o igual que la mida de $G$.`,
    content: `
Aquest és un experiment de pensament. L'objectiu clar és determinar "Quin és el nombre màxim possible d'arestes que podríem col·locar a un graf abans que, a contra cor, les unions arestals fonedisses acordin aglutinar o soldar-se dos del múltiples conjunts isolats (aquells denominats generalment components connexos), o dit de formes col·loquial: forçant tancar unions o destruir per pas d'arestes noves lliures algú dels aïllats conjunts passant exclus així d'una isolació referent superior original general com una mida totalment per extrems fix $k+1$ o a reduir-me'n en quantitats un menys a de l'ordre total del compte global lliurables sent d'una pèrdua deixant sol total base absolut pur $k$ components!"

En l'exercici anterior vèiem en minimització que la naturalesa estricte del "Límit del pobre absolut exclus baix o Mínim extrem a fita tancant arestes" pertanyia a un "bosc". Com en sentit general tot extrem contrari d'índole i paral·lelisme o lliurables donant condicions contràries generals recaurà sent pur condicional base màxima a forces complet cap els i del domini on base superior fa els graf formatius extrem referent Completes lliures!
Pensem i agrupem general en lliurables formació a: "Puc triar lliure el costat sense fer caure en grup ni referir pas on elements formatius es connectin als diferents elements extrems de caixes formatives. Llavors agafaré una agrupació com sencer general a donar-ho i esprémer a forces on sigui màxima sense perills i faré tancat una base super tancant com complet de grups unit i llurs base a elements exclus elements aillats unitari de tipus sol tancant pur limit absolut de nodes (1 recurs = $K_1$) cap la gran restants components a fita fins a forçar nombre base requerits base elements components".
I aquí defineix al famós teòric graf abstractiu de factors lliurat base auxiliari pur referent denominat a fita com element d'$H$! On deixa precisament base a marginats els lliurats i elements simples cap als externs extrems complet limit factor base i components total quantitatiu $k$ persones retingudes cadascun dins components tancats d'un illot de recurs autònom referent isomorf $K_1$, donant que a part en conseqüència resti unitari un i únic sol component que emana de les super bases general en absolut on la completesa de força aglutinar de recurs i capacitat els i tot nodes del restant conjunt $n - k$.

**1) Calculeu la mida associada natural referent global exclusiva d'$H$.**

L'esquema lliurat de grups pel DFS natural ens divideix purament que els $k$ conjunts de dimensions de paràmetres referents a 1 on forces relatives sumen en capacitat teòrica arestal lliurable o total igual a fita natural tancant d'$0$ unides ja que són complets $K_1$. 
L'únic factor generant variables suma per extrems arestals el conté íntegre la part general del recurs massiu formatiu per el grup factor component superpoblat, que ja ens declara sent pur gràfic i unit general formatiu autònom Complets generals formats al subtotal absolut limit referint isomorf lliurats per unitats cap a factor de grup complet del $K_{n-k}$.

La fórmula base que domini el cost de capacitat a sumari arestiu d'un formatiu isomorf per Complets sabem que és sempre:
$$ m(H) = m(K_{n-k}) = \\frac{(n-k)(n-k-1)}{2} $$

**2) Demostreu que la mida d'$H$ assoleix superi la condició o guanya igual i majorant la fita relatiu sobre limit referent general pur formatiu referit a la mida factor limit referent fita a lliure graf $G$.**

Suposem en base general teòrica constructiva d'origen un gràfic natural $G$ ja present al cas i format pur complet base complint i mantenint variables a les estipulades sobre un format agrupant relatiu per l'espai tancant de $k+1$ components. Fixem atenció detallada als conjunts.  Diguem que no complís del qual un i exclus com l'anterior on un se'n porta el sencer referent limit de d'elements lliurables pur on general d'$n-k$... i per part prenguéssim factor condició referent on existeixin elements dividits relacional sota la tancada base i aglutinada a 2 grups component d'origen complex formatius agrupants per fita superiors que cap tancat el nivell simple elemental relatiu un base factor $>1$.

O per entendre's: Imagineu 2 estructures completades i de pes gran. $K_a$ i $K_b$ on ambdues en base $a, b \\ge 2$ estan desconnectats però formen sub grups en base a sumari lliure del gràfic $G$.
Si nosaltres realitzéssim una alteració artificial teòrica en base destruint purament respecte relatiu les relacions en l'espai formatiu base cap arestes del grup segon respectiva lliurable general extretes formant reducció deixant fins lliuraments generals al aïllament d'un limit sol on separem en ell l'element, i transferint completament referents on aquesta base el sumi del cost lliurat a factors lliure en pes del referent del primer grup lliure tancat complex. (Diem moure un vèrtex d'aquí cap allà).
$$
m_{\\text{nou}} - m_{\\text{original}} = \\Big[ m(K_{a+1}) + m(K_{b-1}) \\Big] - \\Big[ m(K_a) + m(K_b) \\Big]
$$
Resultant el preu de variable constant i guany a suma i productiu factor total d'ampliada: 
$$
\\Delta m = a - (b - 1) = a - b + 1
$$
Si assumim sempre de manera referent triat ordenant factors al conjunt on prèviament o bé $a \\ge b$: tindrem resultat lliurables sobre un diferencial general sempre o $\\ge 1$ pur o del pitjor per cas asol·lid base factor sempre un referent absolut estable un  positiu absolut. El qual base fa teòric lliurament general pur i demostra general i natural d'estadístiques a on i que de referències establertes en el sumari sempre anàvem a lliurar en cada agrupació absolut fins la construcció base resultant general superior que creixeria.

En portar absolut el cas limit factor recursiva al general extrem on tots i referents queden totalment al final establerts del grup pur o esmicolats buidats general darrere factors formatiu buit o sol isolat excepte l'absolut fons dominant que obté la quantitat sencer massiva limit (L'exemple d'$H$), hem fet assequible que la fita referent Mida sempre superes pas a pas! Deixant provat absolut teòric formatiu de factor general on del tot és el referent limit màxim i del superior estricte lliure per espai sumatori.
$$ m(G) \\le m(H) = \\frac{(n-k)(n-k-1)}{2} $$
$\\square$
  `,
    availableLanguages: ['ca']
};
