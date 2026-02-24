import type { Solution } from '../../solutions';

export const ex2_4: Solution = {
    id: 'M1-T2-Ex2.4',
    title: 'Exercici 2.4: Algorisme DFS',
    author: 'Profe',
    code: '',
    type: 'notebook',
    statement: `Useu l'algorisme DFS per esbrinar si els grafs següents, representats mitjançant la seva llista d'adjacències, són connexos, i en cas contrari determineu-ne els components connexos. Considereu que el conjunt de vèrtexs està ordenat alfabèticament.`,
    content: `
Recordem que el **DFS (Búsqueda en Profunditat)** explora l'arbre d'un en un saltant al costat dels seus propis amics en preferència al fill més proper descendent de l'alfabet (prioritat cap la cèl·lula que tingui índex menor segons la llista). Ens guiem pas per pas per la jerarquia.

### Graf 1

Llista d'adjacències i seguiment del recorregut ordenat. Comencem el recorregut actiu per la \`a\`:

1.  De l'\`a\` accedim a la \`d\` (el menor dels seus veïns \`d, e, f\`).
2.  De la \`d\`, tenim les possibilitats \`a, b, e, f\`. \`a\` ja està vist i marcat! Així que entrem respecte al pròxim menor que és \`b\`.
3.  Des de la \`b\`, tenim \`d, g, i, j\`. Marquem el menor \`d\` però com que \`d\` ja està explorat anteriorment en la pila i viscuts anteriorment saltem i passem, en endavant buscant \`g\`.
4.  Ens movem en \`g\`. Les nostres vies són \`b, i, j\`. El menor no vist és \`i\`.
5.  Actualment som a \`i\`. Els seus veïns només recollits aquí són \`b, g\`. Com que **aquests vèrtexs on apunta ja s'han reprès com a visitats lliurement tots**, aquí l'agència de cerca s'atura i es congela! Torna l'estat en pas o procés de retirada automàtica (*backtrack*) cap a l'ancestre que l'havia anomenat, o sigui, anem \`g\`.
6.  De nou un cop retirat som des d'origen de \`g\`. Què ens faltava per veure d'ell en el punt 4? Teníem vista fins a \`i\`, per tant li segueix la lletra lliure restant anomenada \`j\`.
7.  A \`j\`, veiem de nou només direccions conegudes cap a \`b\` i cap a \`g\`. Tot observat i utilitzat de nou per a bloqueig. Retrocés absolut *Backtrack* fins a la \`g\`. Res més pendents a l'àmbit propi global que donen des de l'interior! Tot en \`g\` donat acabat! Llavors cau també la seva tasca de funcions i torna retrocedida fins a la \`b\`. Llavors retrocedida des d'avall també ho farà a final base quan la feina finalitza s'amaga rumb cap a \`d\`! 
8.  I compte! Abans no estàvem en pas a la \`d\`, la qual deia " \`a, e, f\` ens restava"! Doncs de \`d\` agafem pas obrint capficada per la lletra \`e\`. Les opcions i portes amigues respecte a la recerca particular on té d'\`e\` ens porten a només \`a\` , i \`d\`. Totalment Vistos! Retrocés general tancant l'\`e\`.
9.  Queda a la mateixa d'última i exclusa la variant de pas o unió \`f\`. Adjacències \`a\` i \`d\`. Bloquejades per procés visitats! Així, s'empassen retorn fins inicial de via llista: tancat! Retrocedim globalment fins la de referent la cèl·lula líder \`a\`.
10. Final Base i absolut del processament per al component relatiu relacional. Mai s'apareix en procés enllestiment algú que obri de forma directa \`h\` o \`c\`.

**Resultats recollits pel Component 1:** \`{a, b, d, e, f, g, i, j}\`.

Què passa ara si mirem tots els membres originals inicials dels elements globals que tenim a dalt llistars i verifiquem els restants oblidats del conjunt base per complet del qual abans hi estem ometen completament del nostre procés sense referències adjacents entre si de DFS? Parlem clar, d'agafar restes buides i de fer proves cap respecte el node aïllat de \`c\` junt amb el tancat pur i aïllat per tancament node de pas complet i sol \`h\`:
Fem un nou cridar a un procés d'estructura lliure nou neteja *DFS* i començarem per ser net lliurat nou líder actiu en la lletra superior el node \`c\`:
\`c\` avança i accedeix cap el seu únic pont que te relació al camp de contactes de connexió cap a \`h\`. Ara com que ja som a la localitat d'\`h\`, ens dóna directrius cap a... l'única i esmentada base original, la ciutat o punt conegut \`c\`. En conseqüència tanca com atur.
**Resultats recollit extern Componencial 2:** \`{c, h}\`.

**Resposta Objectiva real Graf 1:** Estem parlant d'un Graf **NO Connex** de varietat de llistats desfassats, disjunts compost formatiu total en exactament **2 components fets en línia diferenciats**: 
1) $\\{a, b, d, e, f, g, i, j\\}$  
2) $\\{c, h\\}$

---

### Graf 2
*(El processarem pel vol guiat utilitzant paràmetres igualatoris, observant salts on el DFS creï a cada volta com avança pas fix previ.)*

1.  \`a\` accedeix al seu menor directament des del node arrel o líder via DFS principal o porta prioritària: \`b\`.
2.  Des de del nucli relatiu de \`b\` l'entrada obrint a les fronteres següent passa a donar com la prioritat del menor general d'\`a, d, e, g, h, j\` just agafant i travessant rumb a la \`d\`.
3.  Establir pas ferm sobre \`d\` ens obre camp on les opcions del diccionari són pur \`b\` com vista ja en procés actiu, per tant el DFS ignora \`b\` ràpid pel pas relatiu vist i viatja pel nom següents de passadís estret lliurables sent sol el nom exclus a \`h\`.
4.  Rumb establerta a donar un sol al node lliurat d'\`h\`, demanem els directrius i pas relatius: "\`b, d\`". Ops! Els dos camins i passadissos venen absolutament exhaurits i travessats i en procés actual d'esquema relatiu del arbre. Aquesta porta tanca per mur i topa un extrem de camí cec! Executa ara mateix procés recursiu en desfet del camí, pas invers cap endarrere com ja tenim familiaritzat (*backtrack*) i ens dóna re-situa com base fins l'última base origen creador pare original sense acabar rumb ometida directament sobre al gran grup respectiva anterior en la qual teníem llibertat decisió múltiple oberta base darrere d'\`b\`.
5.  Recordant com anava tot al pas de situació anterior en temps base de la línia del node múltiple on l'última opció usada recaurà damunt l'obertura direcció feta sota eix respectiva llançada la variant al cap final \`d\` de punt num: ens dona el camp següent, ens obre la porta tancada directament la llera cap el pròxim de llista pur sota dret a l'obertura lliurable base superior abecedari menor desplaçant base via el node **\`e\`**.
6.  Donant a accés o portó i viatge dins on dona nom propi i actiu de **\`e\`**, fa de porta lliuradora cap la via més rumb base del procés \`g\` perquè del llistat d'ella que teníem prèviament obert i preparats en base de nom "\`b, g\`", es reitera pas per vist el ja recorregut base origen superior abans processat de l'\`b\`!
7.  Moguts sota paràmetres i ordres relatius via passatemps i de control operatiu directriu d'\`g\` només pas de vista general no obrint direcció vista ja amb retrocessos (\`"b, e"\`), només dóna marge lliure pur final en passadís com salt exclus capaç a \`m\`!
8.  I en arribar doncs en espai reduït sense variants possibles dins la cel·la per el nom únic i pur lliurat absolut a nom limit \`m\`, i trobant només entrada ja en bloc del origen \`g\`... es bloqueja complet l'agència complet global respectiva unida del nucli formatiu de fil! Tot un gran cadenat constant de cadenat per retrocediments acumulatius base generals continus globals pur sense fi des d'\`m $	\\to$ g $	\\to$ e $	\\to$ b\`. 
    Recuperats de nou sense problemes sobre els passos base operatius d'origen o arrel de cèl·lules mares principal directriu la múltiple en creacions \`b\`. Li resten, finalment per abeces les lletres per omissió del conjunt d'\`a,d,e,g,h...\` on salta l'altre únic lliure total rellevant que recau pur d'un extrem directe per \`j\`.
9.  Rumb al punt final exterior en extrem absolut de camí rumb ràpid, via unió per passadís rumb de viatge directament a un \`j\` on a dins no dóna de sí espai només portes conegudes en \`a\`, \`b\`! Punt de tancament bloquejat absolutament des de on es desfà del punt final relatiu acabant les forces sense res superior. Omet per total cèl·lules base principal d''a' del DFS absolut general per donar com tancat per extrem complet com exhaurit els passadissos de llera interior de component connex pur absolut generat principal!!

Tot ha quedat net un gran "Món i llistat sencer Illa gran de components principal pur!" on tot relatiu porta per agrupament de noms un components relatius a: $\\{a,b,d,h,e,g,m,j\\}$. Llistats generals separats externament d'índex per recollits d'orígens sense referents:
Les lletres esporàdiques desconegudes oblidades general i aïlladament sota control que no han sigut afectades pel nucli mare pur absolut han estat i estarien només format la llera dels elements $\\to$ $\\{c, f, i, k, l\\}$.
El segon procés de crida del DFS respecte dels nodes d'entrada menors per ordre abecedari comença i viatja sol sota els llistat i elements:
* DFS secundari de components menors:  El vèrtex de base original arrel de DFS recau per llei de pes d'\`c\` on genera portes al \`f\` directes $\\to$ d'\`f\` a \`k\` $\\to$ de \`k\` salta en prioritat menor relativa directa a la base passadís rumb \`i\` $\\to$ d'\`i\` sense menors opcions directament ens queda darrere donar un pas cap  base tancada porta cap de l'exterior de l'element d'\`l\`! L'illa queda perfectament segellada d'orígens d'arbre per complet entre el seu sistema de parella global unit i sense elements viables per pas fora de regió limit extern absolut!

**Resposta Analítica total sobre l'exercici del Graf 2:** Un altre llistat pertany al dret relacional com gràfic teòric no lliurat ni integrat i es defineix total en general per condició estricta per definició pròpia d'un  **NO Connex complet general**, ja que consta complet sobre grups de formacions disjuntes dividit literalment de $2$ Componentals principals per unitats estables autònomes separables:
$\\implies$ Illa Gran 1: $\\{a, b, d, e, g, h, j, m\\}$
$\\implies$ Illa Secundària 2: $\\{c, f, i, k, l\\}$
$\\square$
  `,
    availableLanguages: ['ca']
};
