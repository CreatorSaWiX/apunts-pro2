export interface QuizQuestion {
    id: string;
    question: string;
    codeSnippet?: string;
    options: {
        id: string;
        text: string;
    }[];
    correctOptionId: string;
    explanation: string;
}

export interface TopicQuiz {
    topicId: string;
    timeLimitSeconds: number; // e.g. 600 for 10 minutes
    questions: QuizQuestion[];
}

export const quizzes: TopicQuiz[] = [
    {
        topicId: 'pro2-tema-1', // Classes
        timeLimitSeconds: 600, // 10 min (15 preguntes * 1.6m c/u)
        questions: [
            {
                id: 'q1-1',
                question: 'Per què és vital utilitzar les guàrdies de preprocessador (`#ifndef`, `#define`, `#endif`) quan es crea l\'arxiu d\'especificació `.hpp` d\'una classe?',
                options: [
                    { id: 'a', text: 'Per indicar al compilador que el codi està escrit en C++17 i aplicar filtres de warning automàtics.' },
                    { id: 'b', text: 'Per evitar excepcions de Segmentació durant la descàrrega asíncrona dels Mètodes.' },
                    { id: 'c', text: 'Per protegir blindadament els atributs declarats com a `private` davant les lectures del codi extern.' },
                    { id: 'd', text: 'Per evitar problemes mecànics d\'inclusions múltiples (bucles circulars quan diversos arxius .cc demanen la mateixa classe).' },
                ],
                correctOptionId: 'd',
                explanation: 'A la secció 1.2 "Organització en fitxers" ho hem vist. En projectes grans on múltiples fitxers inclouen alhora `#include "Punt.hpp"`, les "guàrdies" prevenen que C++ intenti llegir i re-definir l\'estructura repetidament, fet que provocaria un letal error Error de Redeclaració de classe.'
            },
            {
                id: 'q1-2',
                question: 'Quina diferència tècnica hi ha entre passar un objecte per valor (`void f(Classe c)`) i per referència constant (`void f(const Classe& c)`)?',
                options: [
                    { id: 'a', text: 'Cap, a nivell de màquina ambdós ocupen la mateixa memòria a la pila (stack).' },
                    { id: 'b', text: 'Per valor sempre és més ràpid perquè evita la desreferenciació del punter constant a sota nivell.' },
                    { id: 'c', text: 'Per referència constant evita la crida al constructor de còpia, estalviant O(N) de memòria i operacions innecessàries, però mantenint la inviolabilitat.' },
                    { id: 'd', text: 'El pas per valor crida el destructor original, eliminant l\'objecte existent just quan acaba la funció petant codi extern.' }
                ],
                correctOptionId: 'c',
                explanation: 'Aquesta és la clàssica diferència descrita al punt 1.1 per als paràmetres struct. Passar per referència no només "no copia", sinó que el `const` blinda els paràmetres interns d\'escriptura errònia (evita pèrdua de velocitat per còpia i aporta seguretat).'
            },
            {
                id: 'q1-3',
                question: 'En relació a l\'encapsulació de variables (OOP), per què una classe de C++ sol declarar els atributs directament com a `private` i després programar `getters/setters` per fora?',
                options: [
                    { id: 'a', text: 'Per obligació algorítmica del compilador g++ quan invoquem Makefile amb la flag -Wall.' },
                    { id: 'b', text: 'Per protegir la integritat de l\'invariant de la classe, assegurant que qualsevol nova manipulació des de l\'exterior passi filtres i no trenqui la classe.' },
                    { id: 'c', text: 'Perquè fa que el codi s\'executi un 15% més ràpid al ser allotjat directament en la memòria de Heap.' },
                    { id: 'd', text: 'Fa obligatori llegir els valors només fent crides indirectes per seguretat.' }
                ],
                correctOptionId: 'b',
                explanation: 'Això mateix es defineix a l\'apartat teòric 1.2 (L\'encapsulació). Els atributs "són amagats i blindats", assegurant controls als setters. Impel·leixes a qui usi el mètode no assignar valors trencats (E.j no posar Dia 32 a una classe Data en el Lab 1!).'
            },
            {
                id: 'q1-4',
                codeSnippet: 'template <class T>\nclass Capsa { T contingut; };',
                question: 'Quina relació abstracta C++ demostren aportar l\'addició màgica dels `template`s (Genericitat) col·locats normalment directament dins dels headers arxius globals?',
                options: [
                    { id: 'a', text: 'Afavoreix només a llegir codi, obligant però els programadors base resciure tots els .cpp repetidament pels Tipus Float, Double o Caracter.' },
                    { id: 'b', text: 'Deshabilita l\'ús del Makefile ja que els templates només operen per instàncies dinàmiques.' },
                    { id: 'c', text: 'Permeten construir una sola classe agnòstica que el generador del compilador C substitueix automàticament fent "versions reals" depenent exclusivament del paràmetre `<int>` o `<string>` al·locat per tu instintivament.' },
                    { id: 'd', text: 'El template fa de seguretat forçosa i evita errors si un usuari introdueix nombres naturals allà on anirien bools lògics, fent segfault d\'acció immediata contra execucions i pèrdues asimptòtiques.' }
                ],
                correctOptionId: 'c',
                explanation: 'Secció 1.3 de teories generades - En C++ tu com a dissenyador no fas codi infinit per llistes d\'Enters o Llistes de Lletres. El codi Template dicta el Model Matriu `class T`. Al Main tu demanes usar `<string>`, doncs automàticament allà pel background del compilador ell obre un generador creant un nou codi on posa `string` a totes les referències `T` i ho munta! Programació superior O(1) humà.'
            },
            {
                id: 'q1-5',
                question: 'Quina de les següents afirmacions sobre els membres (atributs o mètodes) marcats expícitament com a `static` és certa segons els nostres apunts?',
                options: [
                    { id: 'a', text: 'Els mètodes static només funcionen si operem per valor, no per referència de forma simultània.' },
                    { id: 'b', text: 'Cada nou objecte instanciat rep la seva pròpia còpia aïllada i privada dels atributs static de forma amagada.' },
                    { id: 'c', text: 'Els atributs static es comparteixen globalment entre tots els objectes de la mateixa classe. I els mètodes s\'invoquen sense disposar mai del punter implícit `this`.' },
                    { id: 'd', text: 'Els atributs static queden emmascarats en la memòria principal impedit fer return de qualsevol número.' }
                ],
                correctOptionId: 'c',
                explanation: 'Demostrat al punt 1.3: Un membre static (com el comptador de "quants_punts" del Simulador) pertany a la classe general. No s\'allotja independentment per cada instància d\'Objecte! I als mètodes static (Punt::quants_punts()), atès que criden a la matriu central, no pot existir accés al concepte amagat `this` (perquè no representen cap "objecte instanciat de carrer").'
            },
            {
                id: 'q1-6',
                question: 'Quan implementem una Classe, sovint escrivim els consultors simples com `inline` sota el fitxer públic. Quina finalitat tenen?',
                options: [
                    { id: 'a', text: 'L\'`inline` incrusta les instruccions directament en el punt on s\'invoca la crida durant la compilació per saltar-se viatges llargs a subrutines de memòria (estalvia Frame de CPU).' },
                    { id: 'b', text: 'L\'`inline` fa obligatori exportar tota la classe completa dins els arxius de tipus `.cpp` reduint l\'estructura a la meitat de memòria.' },
                    { id: 'c', text: 'Converteix els valors abstractes a variables asimptòtiques de procés que operen sense const constant obligatori ni problemes O(N^2).' },
                    { id: 'd', text: 'C++17 prohibeix estrictament aquesta escriptura perquè afavoreix problemes massius a l\'Scope del Main.' }
                ],
                correctOptionId: 'a',
                explanation: 'Conceptes de classes avançades (Punt 1.3). Definint un mètode get_x() com a `inline` al `.hpp`, ometes crear un salt a una altre rutina en temps d\'execució .cc. El programa escriu el valor x substituït directament dins la fórmula al Main!, actuant com una expansió macros amb beneficis extrems en velocitat si són petits (getter).'
            },
            {
                id: 'q1-7',
                codeSnippet: 'class Caio { public: Caio() { } void pauta() const { /*...*/ } };\nint main() { const Caio a; a.pauta(); }',
                question: 'Quina rellevància tècnica demostra haver integrat la paraula condicional `const` AL FINAL del mètode `pauta() const`?',
                options: [
                    { id: 'a', text: 'Impedeix declarar o instanciar arguments passats referencials locals cap enrere sota certs límits interns inestables.' },
                    { id: 'b', text: 'Només permet extreure memòria virtual pura que s\'acaba d\'inicialitzar per funcions heretades en C++11.' },
                    { id: 'c', text: 'Certifica fortament que aquest mètode NO modificarà (ni per accident) CAP dels atributs interns de l\'objecte.' },
                    { id: 'd', text: 'L\'`inline` la sobreesciu automàticament fent aquesta clàusula obsoleta completament al main quan es declara una a const.' }
                ],
                correctOptionId: 'c',
                explanation: 'Tal i com es reflecteix a les funcions del `.hpp` (ex: `double get_x() const`), el const final serveix perquè l\'operador tingui la certesa del Contracte C++: Un consultor serà invulnerable i mai trencarà l\'interior de dades per error. Afegit addicional: com l\'objecte `a` de main s\'ha creat `const`, només podrà fer cridades exclusivament a les funcions marcades `const`! (si no posessis const al mètode, fallaria compilar).'
            },
            {
                id: 'q1-8',
                codeSnippet: 'int main() { \n    Punt p(2, 4); \n    Punt q = p; \n    return 0; \n}',
                question: 'Quan crees un objecte C++ `q` igualant-lo en cascada directament cap a un altre `p` que ja existeix totalment ple, què executarà el compilador?',
                options: [
                    { id: 'a', text: 'Fallarà la compilació si no programes un operador assignment explícit directament a dins de la capçalera (.hpp).' },
                    { id: 'b', text: 'Es dispararà internament per C++ el "Constructor de Còpia", clonant cada tribut automàticament sense caldre que el defineixis tu (això és per defecte).' },
                    { id: 'c', text: 'Es cridarà el Constructor regular vuit () seguit d\'una destrucció d\'interferència.' },
                    { id: 'd', text: 'No donarà cap error, però ambdós objectes estaran units, qualsevol modificació de "q" alterarà a "p".' }
                ],
                correctOptionId: 'b',
                explanation: 'A PRO2 fem esment que sempre s\'exposa un `Punt(const Punt& altre)` (Còpia). En crear una definició immediatament amb = es diu Copy Initialization i utilitza el constructor de còpies automàtic natiu que la màquina proveeix i omple l\'estat exactament igual. Descartem opcions de vinculació ja que no s\'està usant una referència C (&).'
            },
            {
                id: 'q1-9',
                question: 'Quins són en ordre els passos formals clàssics dissenyats sota un Make per realitzar els dos blocs base modèlics? (`Punt` vs `main` executable terminal)?',
                options: [
                    { id: 'a', text: 'La compilació conjunta (-o) a un objecte pur seguit d\'un llançament a .cpp via un header de target.' },
                    { id: 'b', text: 'Primer convertir `Punt.cpp` en un Objecte Compilat local (`-c Punt.o`), idèntic en el `main.cc`, per posteriorment ajuntar amb l\'estratègia general usant un procés `Link` (-o) contra tot l\'espai.' },
                    { id: 'c', text: 'Acatar exclusivament les indicacions referenciades a Main, demanant a .hpp compilar-se juntament sense fer pas .o previ.' },
                    { id: 'd', text: 'Forçar els arxius -c perquè modifiquin un arxiu DLL a Windows creant un Makefile de variables pures -Wall de tipus T.' }
                ],
                correctOptionId: 'b',
                explanation: 'Punt de curs! (Lliçó 1.4). `Makefile` automatitza la compilació multi-fitxer separada (Mòdul `-c`). Acaprant el procés, agafa codis font cap a codis binari sense connectar (.o / Object). Finalment genera el link (Vinculador) al "muntador virtual absolut executador final".'
            },
            {
                id: 'q1-10',
                codeSnippet: 'void Punt::moure(double dx, double dy) {\n    x += dx;\n    y += dy;\n}',
                question: 'Si analitzem tècnicament dins l\'interior exclusiu d\'aquesta implementació des de `.cpp`, qui o què gestiona secretament com s\'accedeixen explícitament a la "x" i "y" privades?',
                options: [
                    { id: 'a', text: 'La instrucció nativa `::` col·loca una referència `this->` estirant per omissió implícita referent a l\'objecte activat darrera qui l\'emmarca.' },
                    { id: 'b', text: 'Els operadors static modifiquen el sentit dels paràmetres x i y i ho traspassen sense restricció public.' },
                    { id: 'c', text: 'Crea una copia oculta a l\'àmbit general extern (O(1)) sense usar punters perquè és assequible fer-ho dins c++17.' },
                    { id: 'd', text: 'El programa detecta el Header directament modificant els globals com es faria amb Struct de Python o Go paral·lels de referencial virtual.' }
                ],
                correctOptionId: 'a',
                explanation: 'Concepte vital (1.3 Tècnic) - Encara que no s\'escrigui directament a l\'script realitzat pel llibre de text. L\'abstracció compila com (this->x) apuntant exactament el paràmetre implícit invisible d\'instància C++. Si hi haviessin Més de mil Punts a la memòria, aquest `this` és l\'encarregat absolut intern per encertar a quina coordenada cal afegir els `dx`.'
            }
        ]
    },
    {
        topicId: 'pro2-tema-2', // Piles i Cues
        timeLimitSeconds: 600, // 10 min
        questions: [
            {
                id: 'q2-1',
                question: 'Per què s\'utilitza la sintaxi de llista d\'inicialitzadors (`: valor_(valor_inicial)`) als constructors dels .cpp en comptes d\'assignar les variables d\'estat directament entre claus `{ }`?',
                options: [
                    { id: 'a', text: 'Per construir directament l\'atribut físic amb el valor en un sol pas abstracte i lligat, millorant lleugerament el rendiment de cpu instanciador envers reassignacions posteriors inútils.' },
                    { id: 'b', text: 'Perquè el framework C++17 impedeix forçosament fer instruccions de declaració manual dins dels objectes dinàmics de Heap generats.' },
                    { id: 'c', text: 'És precisament la via exclusiva de capçalera C++ per invocar l\'invariant d\'instàncies privades (identificades amb l\'atribut previ genèric `_`) donat que no es pot usar `.this` global a l\'Stack.' },
                    { id: 'd', text: 'Permet encapsular encriptadament el procés abstracte del constructor constant davant blocs externs o classes sub-mítiques amagades que n\'intentin fer dumps globals en memòria.' }
                ],
                correctOptionId: 'a',
                explanation: 'Apunts Secció 2.1 (Convencions). Tot atribut programari per classes encadenat i inicialitzat lliure dins `{ valor_ = 5; }` ja s\'ha creat forçadament buit en fals d\'inici "per defecte" prèviament per c++, i ha patit "una segona reassignació". Amb els dos punts `:` al .cpp construeixes d\'ofici literalment amb el bloc donat asíncron directe en 1 pas.'
            },
            {
                id: 'q2-2',
                codeSnippet: 'Caixa::Caixa(int vol) : v_(vol) {\n    assert(vol >= 0);\n}',
                question: 'Què succeeix a la teva màquina en execució si al main s\'invoca `Caixa c(-5);` trencant la precondició lògica de seguretat (l\'assert)?',
                options: [
                    { id: 'a', text: 'L\'assert dispararà un simple Missatge teòric warning `cerr` per la línia de Terminal permetent però continuar l\'execució C++ en mode Tolerant.' },
                    { id: 'b', text: 'Aturarà la tasca immediatament i de forma brusca esclatant l\'execució del programa sencer (Core dumped), avisant de la línia on s\'ha donat i evitant que l\'error s\'estengui més avall per la RAM.' },
                    { id: 'c', text: 'Invertirà el paràmetre de negatiu a positiu aplicant el valor absolut matemàtic abans de l\'assignació per salvar el constructor.' },
                    { id: 'd', text: 'Tornarà un tipus `void` asíncron o llançarà una excepció try/catch que el compilador obviarà lliurement.' }
                ],
                correctOptionId: 'b',
                explanation: 'Apunts Senior 2.1: El guardià `assert(condició)`. O el Contracte pur de C++ es compleix perfectament, o avorta instantàniament tot el programa mostrant literalment on i per què s\'acaba tot.'
            },
            {
                id: 'q2-3',
                question: 'Quina peculiaritat funcional estricta té programar i fer una crida al mètode `.pop()` pertanyent a the Standard Template Library clàssiques (`std::stack` o `std::queue`) respecte altres idiomes?',
                options: [
                    { id: 'a', text: 'Només permet utilitzar el paràmetre temporal a l\'encapsular STL si els Nodes passen per referència constant al main.' },
                    { id: 'b', text: 'Físicament pre-compila i retorna al main un true/false intern booleà dictant si hi ha hagut error en desencolar.' },
                    { id: 'c', text: 'El retorn de la funció `.pop()` és de tipus pur `"void"`. En C++ el `pop()` es limita exclusivament a eliminar i triturar, MAI retorna l\'element que acabes de desencolar per usar-lo.' },
                    { id: 'd', text: 'Obliga a fer una assignació tancada en temps d\'execució per re-ordenar el Stack internament a O(1).' }
                ],
                correctOptionId: 'c',
                explanation: 'Tema 2.2 / 2.3 `C++ Standard Library`! És la clàssica caiguda universal d\'estudiants: NO pots fer `int a = p.pop();`. En C++ és obligatori consultar-lo primer amb `.front()`/.`top()` per llegir-lo, i només posteriorment eliminar-lo amb la crida lliure a `.pop()` que retornarà "void".'
            },
            {
                id: 'q2-4',
                question: 'Per quina raó tècnica i d\'eficiència es desaconsella totalment utilitzar el C++ `std::vector` de forma subjacent per simular el comportament d\'una Cua FIFO (`Queue`) real?',
                options: [
                    { id: 'a', text: 'L\'assignació de tuples vectorials és il·legal com a genèric constant instantiat al Queue.' },
                    { id: 'b', text: 'Perquè en una cua s\'extreu sempre per la posició d\'inici (`[0]`). Fer el pop de l\'element indexat al front en un vector de bloc massiu requereix desplaçar tots els milers de nodes darrers cap a l\'esquerra forçant una operació massiva de temps O(N).' },
                    { id: 'c', text: 'El vector està limitat teòric a operacions només de la part posterior. El compilador donaria excepcions de llibreria asíncrones.' },
                    { id: 'd', text: 'Un paràmetre emmagatzemat per a encadenaments de vectors contigus patiria una constant generació Null de valors brossa si intentem reduir mides.' }
                ],
                correctOptionId: 'b',
                explanation: 'Apunts 2.3: Les Queues FIFO requereixen constants extraccions del davant. Treure el primer element del vector contigu provoca que s\'hagin de bellugar totes i cadascuna de les restants caselles a l\'esquerra de forma massiva consumint temps en logaritme O(N) si es fa en bucle repetitiu!'
            },
            {
                id: 'q2-5',
                question: 'Donada precisament l\'explicació on vector fa aigües al davant, per tant quina estructura subjacent C++ amaga el `std::queue` estandaritzada oficialment dins la seva arquitectura per garantir alta eficiència constants O(1) en treure pel davant?',
                options: [
                    { id: 'a', text: 'Instància un Tree en Node de prioritat contigus encadenats als nodes per optimitzar cost algorítmic.' },
                    { id: 'b', text: 'S\'utilitza la tàctica de la `std::deque` (La llaminera Double Ended Queue de C++ circular array). La seva enginyeria per talls permet inserir al darrer i extreure al principi mantenint temps invariant de registre purament O(1) constant.' },
                    { id: 'c', text: 'L\'STL encadena i simula sempre asimptòticament una autèntica `std::list` lineal pura O(N).' },
                    { id: 'd', text: 'Estructures asíncrones genèriques compilant una taula abstracta dinàmica de Stack giratori per extreure passivament els vectors.' }
                ],
                correctOptionId: 'b',
                explanation: 'Apunts 2.3: La llibreria de C++ `<queue>` utilitza com a eix vertebrador de classe interna el `deque` (una estructura circular fraccionària dissenyada per encertar a les dues bandes). Ofereix un passiu per treure i posar instantani evitant completament tota fragmentació de la RAM!'
            },
            {
                id: 'q2-6',
                codeSnippet: 'void func(stack<int> s) {\n    s.pop();\n}\n\nint main() {\n    stack<int> S; S.push(4); S.push(8);\n    func(S);\n    cout << S.top();\n}',
                question: 'Ens trobem un estudiant intentant apenditzar mètodes amb Piles Stack C++. Quin resultat visual mostrarà el terminal sota aquesta dinàmica d\'execució al .cpp i per què?',
                options: [
                    { id: 'a', text: 'Dona Segfault immediat abans d\'imprimir, atès el pas de void actuant asíncronament i donant esborrades constants buides al paràmetre.' },
                    { id: 'b', text: 'Imprimirà el nombre "4". La funció func() retalla el top eliminant el "8" darrer ingressat de la cúpula temporalment.' },
                    { id: 'c', text: 'Imprimeix invariable un "8". En no usar símbol de referència (com el `&`) s\'ha procedit a construir tota una Pila Clon independent al invocar la crida i el .pop purgarà directament d\'aquella memòria còpia paral·lela que caurà a l\'oblit global posteriorment.' },
                    { id: 'd', text: 'Donarà un error asimptòtic abstracte degut a passar una classe complexa a una funció lliurement i obligarà fer-ho com referència const Pila.' }
                ],
                correctOptionId: 'c',
                explanation: 'Costós però essencial de lliçons prèvies! Sense encapçalar com a referència (no usar `&`), el llenguatge C++ va clonant totalment l\'estructura rebuda per valor, emmagatzema milions de còpies si fa falta a un altre costat de la Lògica CPU. El Pop ho esborrarà allà però l\'S original main manté el seu Top `8` inamovible i invulnerable.'
            },
            {
                id: 'q2-7',
                question: 'Donada la pràctica de Laboratori de revisar Equilibris de Parèntesis "()[{}]", quina verificació mental O(1) ens demostrarà infal·liblement la victòria, acabada d\'avaluar si tenen una simetria de claus finalitza perfectament correcte?',
                options: [
                    { id: 'a', text: 'Si el nombre pur generat a .size() assoleix exactament un valor dividit per 2 tancat lligat.' },
                    { id: 'b', text: 'En sortir, mirarem amb ifs condicionals si la nostra capçalera top estipula caràcter de tancament passiu sense errors.' },
                    { id: 'c', text: 'L\'estructura final: un cop tot l\'string s\'ha completat totalment, com hem anul·lat parèntesis tancats esborrant els oberts actius parella de l\'stack...la pila obligatòriament per força ha de resultar `empty()` estricta total!' },
                    { id: 'd', text: 'Sempre que el darrer índex abstracte general no generi desfasaments de tipificacions Null.' }
                ],
                correctOptionId: 'c',
                explanation: 'Lab 2 Exercici de Jutge: Com vas apilar oberts, la paràbola estava perfecta un a un al desapilar per contrarestar cada tancament. Al darrer moment del bucle l\'Stack general ja no contindrà ni un element orfe ni tancaments oberts solts, resultant "Cert i Victòria" essent Pila completament buida!'
            },
            {
                id: 'q2-8',
                question: 'En el curs vam explicar d\'on sorgia precisament el temible Error de "Stack Overflow" quan operem Funcions de Recursivitat d\'alta fondària en C++. Quin procediment n\'és el real causant físic als nostres PCs?',
                options: [
                    { id: 'a', text: 'Fer bucles iterats asimptòtics tipus "while" provoca generacions escombraria abstractes a cada node.' },
                    { id: 'b', text: 'Cada cop que una funció fa "Crida a sí mateixa", enllaça un "Bloc Lògic nou complet (Amb paràmetres, retorn local)" dalt del "Call Stack" amagat controlat del propi OS. Al repetir-se de manera finita i acumular-ne massivament l\'esclata per falta de capacitat plena!' },
                    { id: 'c', text: 'Utilitzar vectors per memòries que només generen excepcions abstractes si tenim N dades iteratives tancades.' },
                    { id: 'd', text: 'La recursivitat abstracte del bucle main amuntona els punters asíncrons fins lliurar iteracions infinites.' }
                ],
                correctOptionId: 'b',
                explanation: 'Els misteris del curs (Secció teòrica)! Les crides dins de crides ocupen un Frame amuntegat sencer apilant informació i memòria passiva constant dins de memòria CPU (A Linux freqüentment 8 MB predefinits). Superar aquesta Pila interna provoca StackOverflow assassinant l\'execució de sistema de sobrecàrrega.'
            },
            {
                id: 'q2-9',
                question: 'Com resoldria el `std::queue` en C++ el clàssic problema circular de la Patata Calenta (Lab 2), on cada K-èssim participant d\'un anell rotatiu és extirpat fins restar un únic integrant?',
                options: [
                    { id: 'a', text: 'Usaria un vector global d`struct` empaquetat on els bools passarien a caducats fins donar false general intern.' },
                    { id: 'b', text: 'Agafa el jugador al front (`x = q.front()`), l\'elimina (`q.pop()`) i l\'envia immediatament a posar-se darrer fila a la mateixa Cua mitjançant un (`q.push(x)`). Condiciona així una "nòria simulada" infinitament giratòria.' },
                    { id: 'c', text: 'Manejant una Double Ended Queue `std::deque` es pot llegir forçadament i iterar iteradors lliures dins on el bucle if detecti `k` i fer `erase(it)`. L\'STL ho proveeix per defecte.' },
                    { id: 'd', text: 'Genera variables de tipus abstractes per iterar punters `Queue[n] = Queue[n+1]` esborrant el Node següent directament!' }
                ],
                correctOptionId: 'b',
                explanation: 'Apunts d\'enginyeria del Laboratori 2: Utilitzar `.front()` seguit de `.pop()` seguit de `.push(mateix element)` és un dels patrons d\'arquitectura amb Queue més coneguts internacionalment a C++. Crea bucles rotatius infinits on mai s\'esborra l\'element sinó que passa al final de la fila evitant punters circulars complexos.'
            },
            {
                id: 'q2-10',
                question: 'Com és possible aconseguir i simular el comportament pur d\'una *CUA FIFO* (`queue`), inclús atorgant el seu rendiment de temps amortitzat O(1), utilitzant irrefutablement i com a úniques estructures DUES *PILES LIFO* (`A i B`) auxiliars en C++?',
                options: [
                    { id: 'a', text: 'És matemàticament i algorísmicament impossible ja que un Stack no posseeix el punter amagat cap al final de memòria independent inferior.' },
                    { id: 'b', text: 'Només és viable fer-ho generant un temps constant ineficient d\'ordre O(N^2) que iteri movent d\'A a B cada vegada exclusivament per un top i torni completament.' },
                    { id: 'c', text: 'Rebríem injeccions noves cap al Stack A. Per avaluar o extreure el front, si B es troba buit, s\'extreuen un per un els d\'A amb .pop() insertant-los a *B*. Aquesta operació els inverteix de dalt a baix deixant l\'element més antic perfecte dalt del cim de B pel proper O(1) lliure!' },
                    { id: 'd', text: 'Fent extreure nodes lliures d\'A i enganxar els darreres a la base de B donat temps constant temporal i emmagatzemament circular LIFO.' }
                ],
                correctOptionId: 'c',
                explanation: 'La Llegenda d\'Entrevista Científica! Un Stack tanca l\'entrada dalt (LIFO). Si agafes les dades i fas push d\'A cap a B. L\'últim d\'haver entrat a *A* caurà com la peça més profunda al forat de *B*! I el MÉS ANTIC entrat a A en buidar-se quedarà precisament exposat del revés a dalt del cim lliure de B com a candidat FIFO!'
            }
        ]
    },
    {
        topicId: 'pro2-tema-3', // Llistes i iteradors
        timeLimitSeconds: 600, // 10 min
        questions: [
            {
                id: 'q3-1',
                question: 'Quina és l\'avantatge principal de les llistes (`list`) sobre els vectors pel que fa a la inserció d\'elements?',
                options: [
                    { id: 'a', text: 'Permeten accés directe a qualsevol posició en temps O(1).' },
                    { id: 'b', text: 'Afegir o esborrar un element en una posició intermèdia té un cost de O(1).' },
                    { id: 'c', text: 'Ocupen menys memòria perquè no necessiten enllaços entre nodes.' },
                    { id: 'd', text: 'Són més ràpides de recórrer seqüencialment que un vector.' }
                ],
                correctOptionId: 'b',
                explanation: 'A la secció 3.1 s\'explica que, a diferència dels vectors (cost O(n)), les llistes permeten inserir o esborrar en qualsevol punt amb cost constant O(1).'
            },
            {
                id: 'q3-2',
                question: 'Què succeeix si intentem utilitzar l\'operador de claudàtors (ex: `L[i]`) en una llista de C++?',
                options: [
                    { id: 'a', text: 'Funciona correctament i retorna l\'element en temps O(1).' },
                    { id: 'b', text: 'Funciona però té un cost de O(n).' },
                    { id: 'c', text: 'Produeix un error de compilació perquè les llistes no tenen accés directe per posició.' },
                    { id: 'd', text: 'Sempre retorna el primer element de la llista.' }
                ],
                correctOptionId: 'c',
                explanation: 'Com s\'indica als desavantatges (3.1), l\'accés directe `L[i]` genera un error de compilació. Cal utilitzar iteradors per moure\'s per la llista.'
            },
            {
                id: 'q3-3',
                question: 'A què apunta exactament l\'iterador obtingut mitjançant `L.end()`?',
                options: [
                    { id: 'a', text: 'A l\'últim element real de la llista.' },
                    { id: 'b', text: 'Al primer element de la llista.' },
                    { id: 'c', text: 'A una cel·la virtual situada just després de l\'últim element real.' },
                    { id: 'd', text: 'Al node que conté la mida total de la llista.' }
                ],
                correctOptionId: 'c',
                explanation: 'Segons la secció 3.2, `L.end()` assenyala la posició virtual "després de l\'últim" element, marcant el final del rang vàlid.'
            },
            {
                id: 'q3-4',
                question: 'Com s\'accedeix al valor d\'un element de la llista un cop tenim un iterador `it` apuntant-hi?',
                options: [
                    { id: 'a', text: 'Utilitzant l\'asterisc com a desreferenciació: `*it`.' },
                    { id: 'b', text: 'Mitjançant el mètode `it.get_value()`.' },
                    { id: 'c', text: 'Simplement escrivint el nom de l\'iterador `it`.' },
                    { id: 'd', text: 'Llegint la posició `L[it]`.' }
                ],
                correctOptionId: 'a',
                explanation: 'L\'iterador actua com un punter conceptual; per accedir o modificar el valor del node cal usar `*it` (3.2).'
            },
            {
                id: 'q3-5',
                question: 'Si estem recorrent una llista amb un iterador `it` i volem passar al següent element, quina operació hem de fer?',
                options: [
                    { id: 'a', text: '`it = it + 1;`' },
                    { id: 'b', text: '`it++;`' },
                    { id: 'c', text: '`L.next(it);`' },
                    { id: 'd', text: '`it = L.begin() + 1;`' }
                ],
                correctOptionId: 'b',
                explanation: 'El pas al següent element es fa amb l\'operador d\'increment `it++` (3.2). Atenció: en llistes no es pot sumar un enter directament (ex: `it + 5` fallaria).'
            },
            {
                id: 'q3-6',
                question: 'Per què és necessari utilitzar `const_iterator` (o `cbegin`/`cend`) en algunes funcions?',
                options: [
                    { id: 'a', text: 'Perquè és un 15% més ràpid que l\'iterador normal.' },
                    { id: 'b', text: 'Per poder recórrer la llista en sentit invers.' },
                    { id: 'c', text: 'Quan la llista és constant (`const`), per assegurar que només podem llegir i no modificar les dades.' },
                    { id: 'd', text: 'Per evitar l\'ús de la paraula clau `auto`.' }
                ],
                correctOptionId: 'c',
                explanation: 'La secció 3.2 detalla que el `const_iterator` és obligatori si la llista està blindada com a `const`, impedint mutacions accidentals.'
            },
            {
                id: 'q3-7',
                question: 'Quin és el risc principal d\'esborrar un element (`L.erase(it)`) mentre recorrem una llista?',
                options: [
                    { id: 'a', text: 'La llista es buida completament de forma accidental.' },
                    { id: 'b', text: 'L\'iterador `it` queda invalidat ("mort") i intentar usar-lo (ex: `it++`) provocarà un Segmentation Fault.' },
                    { id: 'c', text: 'L\'element següent a l\'esborrat també s\'elimina automàticament.' },
                    { id: 'd', text: 'Cap, C++ gestiona la reubicació de l\'iterador de forma automàtica.' }
                ],
                correctOptionId: 'b',
                explanation: 'La secció 3.3 avisa que esborrar el node on està l\'iterador el deixa apuntant a memòria alliberada, perdent l\'enllaç al següent.'
            },
            {
                id: 'q3-8',
                question: 'Com s\'ha de gestionar correctament l\'esborrat d\'un element en un bucle per no perdre l\'orientació?',
                options: [
                    { id: 'a', text: '`L.erase(it); it = L.begin();`' },
                    { id: 'b', text: '`it = L.erase(it);` aprofitant que `erase` retorna l\'iterador al següent element vàlid.' },
                    { id: 'c', text: '`delete it; it++;`' },
                    { id: 'd', text: 'No es pot esborrar elements mentre es recorre; cal crear una llista nova.' }
                ],
                correctOptionId: 'b',
                explanation: 'Tal com mostra l\'exemple de codi a la secció 3.3, és vital capturar el retorn de `erase()` per reengantxar l\'iterador a la seqüència correctament.'
            },
            {
                id: 'q3-9',
                question: 'On col·loca el nou element la funció `L.insert(it, valor)` i on queda situat l\'iterador `it` després de la crida?',
                options: [
                    { id: 'a', text: 'El col·loca DESPRÉS de `it`, i `it` passa a apuntar al nou element.' },
                    { id: 'b', text: 'El col·loca ABANS de `it`, i `it` continua apuntant al mateix element original.' },
                    { id: 'c', text: 'El col·loca al final de la llista independentment de `it`.' },
                    { id: 'd', text: 'Substitueix l\'element on apuntava `it` pel nou valor.' }
                ],
                correctOptionId: 'b',
                explanation: 'Segons la secció 3.3, la inserció es fa ABANS de la posició actual i l\'iterador original es manté ancorat on estava, sense patir danys.'
            },
            {
                id: 'q3-10',
                question: 'Tot i que les llistes tenen cost O(1) d\'inserció, per què se sol preferir el `std::vector` en termes d\'eficiència general?',
                options: [
                    { id: 'a', text: 'Perquè el vector utilitza menys variables internes.' },
                    { id: 'b', text: 'Pel "Cache Locality": el vector emmagatzema dades en blocs contigus que la CPU llegeix molt més ràpid.' },
                    { id: 'c', text: 'Perquè les llistes només poden guardar enters.' },
                    { id: 'd', text: 'Perquè el vector és estructuralment més modern que la llista.' }
                ],
                correctOptionId: 'b',
                explanation: 'L\'apartat d\'info (3.1) destaca que la memòria contigua del vector el fa molt més eficient per a recorreguts a causa de com funciona el hardware del processador.'
            }
        ]
    },
    {
        topicId: 'm1-tema-1',
        timeLimitSeconds: 600,
        questions: [
            {
                id: 'm1-q1-1',
                question: 'Quina afirmació és sempre certa segons el Lema de les Encaixades per a un graf no dirigit?',
                options: [
                    { id: 'a', text: 'El nombre de vèrtexs amb un grau senar ha de ser obligatòriament parell.' },
                    { id: 'b', text: 'La suma del grau de tots els vèrtexs és igual a la meitat del total de les arestes.' },
                    { id: 'c', text: 'Tot graf ha de constar invariablement d\'almenys un element de grau parell.' },
                    { id: 'd', text: 'Si l\'ordre del graf és un nombre parell, llavors la seva mida també ho és.' }
                ],
                correctOptionId: 'a',
                explanation: 'La suma dels graus equival a 2m (sempre parell). Una suma només pot donar parell si hi ha una quantitat parella de nombres senars sumats. Les altres respostes poden ser ocasionalment mitges veritats depenent de G.'
            },
            {
                id: 'm1-q1-2',
                question: 'Tenim un graf k-regular i sabem que tota fila de la seva matriu d\'adjacència suma 4. Si el graf és d\'ordre 6, quantes arestes l\'enllacen?',
                options: [
                    { id: 'a', text: '24' },
                    { id: 'b', text: '12' },
                    { id: 'c', text: '10' },
                    { id: 'd', text: '6' }
                ],
                correctOptionId: 'b',
                explanation: 'La suma de cada fila indica el grau (4). Grau sumat universal = 6 vèrtexs * 4 = 24. Pel Lema, m = sum(g) / 2 = 24 / 2 = 12 arestes.'
            },
            {
                id: 'm1-q1-3',
                question: 'Quin és el nombre d\'arestes present al graf complementari (G^c) referent d\'un Cicle de mida 5 (C_5)?',
                options: [
                    { id: 'a', text: '0' },
                    { id: 'b', text: '10' },
                    { id: 'c', text: '5' },
                    { id: 'd', text: '15' }
                ],
                correctOptionId: 'c',
                explanation: 'L\'ordre es manté (5). El graf complet K_5 alberga n(n-1)/2 = 10 arestes. Atès que C_5 usa 5 arestes seues pròpies, G^c es conformarà amb les que hi falten per omplir: 10 - 5 = 5 arestes. Com a curiositat, el seu complementari és isomorf i idèntic!'
            },
            {
                id: 'm1-q1-4',
                question: 'En un graf complet K_10, esborrem únicament UNA aresta qualsevol per obtenir un nou graf G. Quin serà el grau màxim d\'algun vèrtex al seu graf complementari G^c?',
                options: [
                    { id: 'a', text: '0' },
                    { id: 'b', text: '9' },
                    { id: 'c', text: '2' },
                    { id: 'd', text: '1' }
                ],
                correctOptionId: 'd',
                explanation: 'El graf complet té totes les possibles enceses. El seu complementari K_10^c és el graf Nul (Sense arestes i 0 graus per a tots). Com hem tret 1 sola aresta a u i v (no són veïns), la rebran exclusiva l\'equip de G^c. Conclusió u i v ara passen a tenir grau 1.'
            },
            {
                id: 'm1-q1-5',
                question: 'Si construïm la potència G^2 d\'un graf de model cicle de 6 elements (C_6), quin acabarà per ser el grau exacte de cadascun dels seus vèrtexs?',
                options: [
                    { id: 'a', text: '3' },
                    { id: 'b', text: '4' },
                    { id: 'c', text: '2' },
                    { id: 'd', text: '5' }
                ],
                correctOptionId: 'b',
                explanation: 'Un Cicle C_6 és 2-regular pròpiament (2 arestes cada membre a distància 1). La potència G² agrega nous ponts amb tots els allunyats "saltant-se a distància 2" pel G lligat, que en són 2 més addicionals. Total sumat: dist 1 (2 veïns) + dist 2 (2 veïns) = 4.'
            },
            {
                id: 'm1-q1-6',
                question: 'Siguem rigorosos avaluant un graf abstracte G inicial ja "connex" dotat d\'un diàmetre D. Quines característiques garanteix retenir el seu format quadrat potenciat (G^2)?',
                options: [
                    { id: 'a', text: 'Pot esbotzar la connectivitat del mapa dividint-lo.' },
                    { id: 'b', text: 'Segueix connex immòbil, on el seu Diàmetre s\'eleva a D multiplicat per 2.' },
                    { id: 'c', text: 'Reté l\'essència connexa pura i lliga un Diàmetre òptimament tallat a ⌈D/2⌉.' },
                    { id: 'd', text: 'Roman connex, i adopta un diàmetre igual a log(D).' }
                ],
                correctOptionId: 'c',
                explanation: 'Com hereta els marges originals cap node acaba fora, de manera que romandrà 100% connex. Com G² posa noves "dreceres de 2 salts directes", reduirà gairebé la distància màxima de creuar la xarxa a la meitat superior ⌈D/2⌉.'
            },
            {
                id: 'm1-q1-7',
                question: 'Ens ordenen analitzar el Producte Cartesià G = C_4 x P_3. Sense arribar a graficar-lo, quin és el seu ordre (vèrtexs) i la seva mida (arestes)?',
                options: [
                    { id: 'a', text: 'Ordre 12 i Mida 20' },
                    { id: 'b', text: 'Ordre 7 i Mida 14' },
                    { id: 'c', text: 'Ordre 12 i Mida 24' },
                    { id: 'd', text: 'Ordre 7 i Mida 7' }
                ],
                correctOptionId: 'a',
                explanation: 'Ordre general: V(C_4) * V(P_3) = 4 * 3 = 12 vèrtexs. Per arestes la deducció és: n1*m2 + n2*m1. Sabiendo que m(C_4) = 4 i m(P_3) = 2, calculem 4*2 + 3*4 = 8 + 12 = 20 arestes.'
            },
            {
                id: 'm1-q1-8',
                question: 'A què equivaldrà la distància suprema (Diàmetre global) del graf obtingut mitjançant el producte cartesià C_5 x P_4?',
                options: [
                    { id: 'a', text: 'Multiplicant el Diàmetre de C_5 * P_4, serà 6.' },
                    { id: 'b', text: 'L\'addició matemàtica D(C_5) + D(P_4), deixant 5.' },
                    { id: 'c', text: 'Al valor màxim, serà 3.' },
                    { id: 'd', text: 'Iterant amb BFS crearem un diàmetre atzarós de 8.' }
                ],
                correctOptionId: 'b',
                explanation: 'En productes Descartes / representacions reticulars rectes (GxH), el recorregut d\'extrem a extrem D(u,v) sempre s\'executa de viatge sumat entre D(G) més D(H). En el cas (2) + (3) fa lligam exclusiu = 5.'
            },
            {
                id: 'm1-q1-9',
                question: 'Quina condició és completament NECESSÀRIA per establir inicialment que dos grafs poden ser considerats isomorfs?',
                options: [
                    { id: 'a', text: 'Estar indexades idènticament per etiquetatge alfabètic seqüencial en ambdós dibuixos.' },
                    { id: 'b', text: 'Donar un arbre generador BFS de l\'arrel al full idèntic en els dos objectes.' },
                    { id: 'c', text: 'Tenir el Diàmetre exacte i matrius totalment iguals asimètriques des del node numèric original 1.' },
                    { id: 'd', text: 'Disposar ineludible de la mateixa seqüència de graus idènticament ordenada.' }
                ],
                correctOptionId: 'd',
                explanation: 'Ser requires Invariants Tècnics ineludibles. Diferent seqüència = Garantit No Isomorfs absolut al 100%. Mateixa seqüència no és motiu suficient (es pot dubtar plets complexos) però no ho pots denegar directament i continua viu per la demostració final.'
            },
            {
                id: 'm1-q1-10',
                question: 'Avaluem el Graf composat referent G ∘ H, on el graf pare G és un Triangle (C_3) de fons arrel, i per a cada vèrtex pengem la clàssica composició clònica lliurada H que tracta ser (P_2). Trobeu quin nou ascens gaudirà en el grau referencial original un antic representat vèrtex central que provenia de G.',
                options: [
                    { id: 'a', text: 'Romandrà 2 idèntic sense interacció aïllada.' },
                    { id: 'b', text: 'Es suma g(v) + |V_H|. (Resultant exactament = 4).' },
                    { id: 'c', text: 'El grau inicial referent del node v multiplicarà exclusiu a l\'ordre de vèrtexs V_H resultants (donant valor atzar associat = 6).' },
                    { id: 'd', text: 'Es restarà ja que assumeixen i comparteixen la llosa i densitat de connexions per aïllar ponts.' }
                ],
                correctOptionId: 'b',
                explanation: 'A l\'operador Composició asimètrica "Genèrica i lliurada" G ∘ H, per a cadascun membre arrel cèntric G, la llei enuncia que obligat establirà línies pròpies amb absoulotament cadascú de l\'equip complet encarregat sota ell! O sigui, Grau prèvi 2 + 2 lligams de pont actiu envers V_H = Grau ascendit 4 asimptòtic absolut de final.'
            }
        ]
    },
    {
        topicId: 'm1-tema-2',
        timeLimitSeconds: 600,
        questions: [
            {
                id: 'm1-q2-1',
                question: 'Quina és la diferència fonamental entre un "Recorregut" i un "Camí" segons la secció 1 dels apunts?',
                options: [
                    { id: 'a', text: 'Un recorregut és més curt que un camí.' },
                    { id: 'b', text: 'En un camí no es pot repetir cap vèrtex (i per tant cap aresta), mentre que en un recorregut sí.' },
                    { id: 'c', text: 'Els camins només es donen en grafs dirigits.' },
                    { id: 'd', text: 'Un recorregut ha de ser obligatòriament tancat.' }
                ],
                correctOptionId: 'b',
                explanation: 'A la secció 1 es detalla que el Camí és un tipus especial de recorregut restrictiu on està prohibit tornar a passar per un mateix vèrtex.'
            },
            {
                id: 'm1-q2-2',
                question: 'Quin és el nombre mínim d\'arestes ($m$) necessari per a que un graf de $n$ vèrtexs pugui ser connex?',
                options: [
                    { id: 'a', text: 'm = n' },
                    { id: 'b', text: 'm = n + 1' },
                    { id: 'c', text: 'm = n - 1' },
                    { id: 'd', text: 'm = 2n' }
                ],
                correctOptionId: 'c',
                explanation: 'Com s\'indica a la secció 2, l\'estructura mínima de connexió és l\'arbre, que té exactament $n-1$ arestes.'
            },
            {
                id: 'm1-q2-3',
                question: 'Què és un "Vèrtex de tall"?',
                options: [
                    { id: 'a', text: 'Un vèrtex que té un grau superior a la mitjana del graf.' },
                    { id: 'b', text: 'Un vèrtex que, si s\'esborra, augmenta el nombre de components connexos del graf.' },
                    { id: 'c', text: 'Un vèrtex situat exactament al centre del graf.' },
                    { id: 'd', text: 'L\'extrem d\'una aresta pont que té grau 1.' }
                ],
                correctOptionId: 'b',
                explanation: 'La definició (secció 2) estableix que esborrar un vèrtex de tall fragmenta el graf en més peces (components) de les que hi havia originalment.'
            },
            {
                id: 'm1-q2-4',
                question: 'Analitza l\'afirmació: "Un graf connex amb vèrtexs de tall sempre conté alguna aresta pont". És certa?',
                options: [
                    { id: 'a', text: 'Sí, és un teorema fonamental dels grafs.' },
                    { id: 'b', text: 'No. El graf papallona (dos triangles units per un vèrtex) té un vèrtex de tall però cap aresta pont.' },
                    { id: 'c', text: 'Només és cert si el graf no té cicles.' },
                    { id: 'd', text: 'Sí, sempre que el diàmetre del graf sigui superior a 2.' }
                ],
                correctOptionId: 'b',
                explanation: 'El tip "La fal·làcia d\'arestes i vèrtexs" aclareix que el graf papallona és el contraexemple ideal: el nus central és de tall però cap aresta és pont perquè totes estan en cicles.'
            },
            {
                id: 'm1-q2-5',
                question: 'Com es defineix l\'Excentricitat $e(u)$ d\'un vèrtex?',
                options: [
                    { id: 'a', text: 'És la suma de totes les distàncies des de $u$.' },
                    { id: 'b', text: 'És la distància al vèrtex més proper.' },
                    { id: 'c', text: 'És la distància al vèrtex que està més lluny de $u$ (el pitjor dels casos).' },
                    { id: 'd', text: 'És el nombre de cicles als quals pertany $u$.' }
                ],
                correctOptionId: 'c',
                explanation: 'L\'excentricitat mesura la "distància màxima" des d\'un punt, avaluant quin és el node més allunyat d\'ell (Secció 3).'
            },
            {
                id: 'm1-q2-6',
                question: 'Quina relació hi ha entre el Diàmetre $D(G)$ i el Radi $r(G)$ d\'un graf?',
                options: [
                    { id: 'a', text: 'El diàmetre és sempre exactament el doble del radi.' },
                    { id: 'b', text: 'El diàmetre és la màxima excentricitat del graf, i el radi és la mínima.' },
                    { id: 'c', text: 'El radi sempre és més gran que el diàmetre.' },
                    { id: 'd', text: 'Són valors independents que no tenen res a veure amb l\'excentricitat.' }
                ],
                correctOptionId: 'b',
                explanation: 'A la secció 3 es defineix el diàmetre com el màxim de les excentricitats i el radi com el mínim.'
            },
            {
                id: 'm1-q2-7',
                question: 'Quina estructura de dades utilitza l\'ordinador per gestionar una cerca DFS (en profunditat) i el seu backtracking?',
                options: [
                    { id: 'a', text: 'Una Cua (Queue - FIFO).' },
                    { id: 'b', text: 'Una Pila (Stack - LIFO).' },
                    { id: 'c', text: 'Una taula hash.' },
                    { id: 'd', text: 'Un arbre binari balancejat.' }
                ],
                correctOptionId: 'b',
                explanation: 'El DFS (Secció 4) utilitza la recursivitat d\'una Pila (LIFO) per enfonsar-se i després desfer el camí (pop) quan troba un cul de sac.'
            },
            {
                id: 'm1-q2-8',
                question: 'Quina garantia ofereix l\'algorisme BFS (Cerca en amplada) respecte a les distàncies recorregudes?',
                options: [
                    { id: 'a', text: 'Garanteix trobar el camí més llarg del graf.' },
                    { id: 'b', text: 'Troba tots els cicles hamiltonians.' },
                    { id: 'c', text: 'Garanteix que el valor $D[y]$ és la distància més curta (mínim d\'arestes) des de l\'arrel al node $y$.' },
                    { id: 'd', text: 'No ofereix cap garantia de distància mínimes.' }
                ],
                correctOptionId: 'c',
                explanation: 'El benefici principal del BFS (Secció 5) és que, en propagar-se per capes, sempre arriba a cada node per la ruta més curta possible.'
            },
            {
                id: 'm1-q2-9',
                question: 'Quina és la "Regla d\'or" per saber si un graf és Bipartit sense haver d\'intentar pintar-lo?',
                options: [
                    { id: 'a', text: 'El graf ha de tenir un nombre parell de vèrtexs.' },
                    { id: 'b', text: 'El graf no ha de tenir cap cicle de longitud SENAR.' },
                    { id: 'c', text: 'El graf ha de ser un cicle $C_n$.' },
                    { id: 'd', text: 'Totes les excentricitats han de ser iguals.' }
                ],
                correctOptionId: 'b',
                explanation: 'Com diu la secció 6, un graf és bipartit $\iff$ no té cap cicle de longitud senar (triangles, pentàgons, etc.).'
            },
            {
                id: 'm1-q2-10',
                question: 'En un graf camí $a - b - c - d - e$, quin és el Diàmetre?',
                options: [
                    { id: 'a', text: '2' },
                    { id: 'b', text: '5' },
                    { id: 'c', text: '4' },
                    { id: 'd', text: '10' }
                ],
                correctOptionId: 'c',
                explanation: 'El diàmetre és la distància més llarga entre dues puntes ($a$ i $e$). Hi ha 4 arestes de distància, per tant $D(G) = 4$.'
            }
        ]
    },
    {
        topicId: 'm1-tema-3',
        timeLimitSeconds: 600,
        questions: [
            {
                id: 'm1-q3-1',
                question: 'Segons el Teorema d\'Euler, quina condició ha de complir un graf connex per ser considerat Eulerià (és a dir, que contingui un circuit eulerià)?',
                options: [
                    { id: 'a', text: 'Ha de tenir exactament dos vèrtexs de grau senar.' },
                    { id: 'b', text: 'Tots els seus vèrtexs han de tenir grau parell.' },
                    { id: 'c', text: 'Ha de ser un graf complet de mida mínima 4.' },
                    { id: 'd', text: 'El seu diàmetre ha de ser menor o igual a 2.' }
                ],
                correctOptionId: 'b',
                explanation: 'Teorema d\'Euler (Secció 1 dels apunts): Un graf connex és Eulerià ⟺ tots els seus vèrtexs tenen grau parell. El raonament és que en un circuit tancat, cada cop que arribes a un vèrtex per una aresta, necessites una altra per sortir-ne, de manera que les arestes incidentes van sempre en parelles (entrada + sortida).'
            },
            {
                id: 'm1-q3-2',
                question: 'Un graf connex té exactament 2 vèrtexs de grau senar. Què podem assegurar sobre aquest graf?',
                options: [
                    { id: 'a', text: 'Conté un circuit eulerià tancat.' },
                    { id: 'b', text: 'No és possible recórrer totes les arestes sense repetir-ne cap.' },
                    { id: 'c', text: 'Conté un senderó eulerià (obert), que comença en un vèrtex de grau senar i acaba a l\'altre.' },
                    { id: 'd', text: 'És necessàriament un graf hamiltonià.' }
                ],
                correctOptionId: 'c',
                explanation: 'Corol·lari del Teorema d\'Euler (Secció 1): Un graf connex amb exactament 2 vèrtexs de grau senar admet un senderó eulerià (recorregut obert que passa per totes les arestes sense repetir-ne cap). Aquest senderó comença obligatòriament en un dels dos vèrtexs de grau senar i acaba a l\'altre.'
            },
            {
                id: 'm1-q3-3',
                question: 'Volem determinar per a quins valors de n el graf complementari $C_n^c$ d\'un cicle $C_n$ és eulerià. Quina condició hem de verificar?',
                options: [
                    { id: 'a', text: 'Que el diàmetre de $C_n^c$ sigui parell.' },
                    { id: 'b', text: 'Que $C_n^c$ sigui connex i bipartit alhora.' },
                    { id: 'c', text: 'Que el grau de cada vèrtex al complementari, $(n - 1) - g_{C_n}(v) = n - 3$, sigui parell. Per tant, cal que $n$ sigui senar.' },
                    { id: 'd', text: 'Que el nombre d\'arestes de $C_n^c$ sigui una potència de 2.' }
                ],
                correctOptionId: 'c',
                explanation: 'Truc d\'Examen dels apunts (Secció 1): El grau al complementari és $g_{C_n^c}(v) = (n-1) - g_{C_n}(v)$. Com $C_n$ és 2-regular, obtenim $g_{C_n^c}(v) = n - 3$. Perquè sigui eulerià, cal que $n - 3$ sigui parell, és a dir, $n$ ha de ser senar (i $n \\ge 5$ perquè sigui connex).'
            },
            {
                id: 'm1-q3-4',
                question: 'Per què els arbres no poden ser mai grafs hamiltonians?',
                options: [
                    { id: 'a', text: 'Perquè un arbre sempre conté cicles de longitud senar.' },
                    { id: 'b', text: 'Perquè tot arbre té fulles (vèrtexs de grau 1), i un cicle hamiltonià requereix que tot vèrtex tingui grau ≥ 2.' },
                    { id: 'c', text: 'Perquè els arbres no són connexos.' },
                    { id: 'd', text: 'Perquè el nombre d\'arestes d\'un arbre és massa gran per tancar un cicle.' }
                ],
                correctOptionId: 'b',
                explanation: 'Condició necessària per ser hamiltonià (Secció 2.1 dels apunts): tot vèrtex ha de tenir grau ≥ 2 per poder entrar i sortir en un cicle. Els arbres tenen per definició fulles (nodes de grau 1), que són culs de sac impossibles de travessar en un circuit.'
            },
            {
                id: 'm1-q3-5',
                question: 'Tenim un graf connex G d\'ordre n. Suprimim un conjunt de vèrtexs S, i el graf resultant G − S té k components connexes. Quina relació entre |S| i k ha de complir-se perquè G pugui ser hamiltonià?',
                options: [
                    { id: 'a', text: 'k ≤ |S| (el nombre de components no pot superar el nombre de vèrtexs suprimits).' },
                    { id: 'b', text: 'k = |S| + 1 sempre.' },
                    { id: 'c', text: 'k ≥ 2|S| és la condició mínima.' },
                    { id: 'd', text: '|S| ≤ n/2 independentment de k.' }
                ],
                correctOptionId: 'a',
                explanation: 'Condició necessària de Vèrtexs-Components (la més forta, Secció 2.1): Si G és hamiltonià, per a tot conjunt S de vèrtexs, el nombre de components connexes de G − S no pot superar |S|. Si trobes un S tal que k > |S|, llavors G NO és hamiltonià. Exemple clàssic: el graf papallona on suprimir 1 vèrtex central crea 2 components (2 > 1 → no hamiltonià).'
            },
            {
                id: 'm1-q3-6',
                question: 'Què estableix el Teorema de Dirac sobre la condició suficient per a que un graf sigui hamiltonià?',
                options: [
                    { id: 'a', text: 'Si tot vèrtex té grau ≥ n/2 (on n ≥ 3 és l\'ordre del graf), aleshores el graf és hamiltonià.' },
                    { id: 'b', text: 'Si la suma de graus de tot parell de vèrtexs adjacents és ≥ n, el graf és hamiltonià.' },
                    { id: 'c', text: 'Si el graf té més de n²/4 arestes, aleshores conté un cicle hamiltonià.' },
                    { id: 'd', text: 'Si el graf és 2-connex i bipartit, aleshores és hamiltonià.' }
                ],
                correctOptionId: 'a',
                explanation: 'Teorema de Dirac (Secció 2.2 dels apunts): és un corol·lari del Teorema d\'Ore. Si tots els vèrtexs d\'un graf simple d\'ordre n ≥ 3 tenen grau ≥ n/2, el graf és hamiltonià. La idea és que una densitat alta d\'arestes garanteix la possibilitat de tancar un cicle passant per tots els vèrtexs.'
            },
            {
                id: 'm1-q3-7',
                question: 'El Teorema d\'Ore diu: si per a tota parella de vèrtexs NO adjacents $(u, v)$ es compleix $g(u) + g(v) \\ge n$, aleshores G és hamiltonià. Quin graf clàssic exemplifica que aquesta condició és suficient però NO necessària?',
                options: [
                    { id: 'a', text: 'Un cicle $C_n$ amb $n \\ge 3$: és hamiltonià però els seus vèrtexs tenen grau 2, de manera que $g(u)+g(v) = 4 < n$ per $n \\ge 5$.' },
                    { id: 'b', text: 'Un graf complet $K_n$: compleix Ore i és hamiltonià, demostrant que la condició és necessària.' },
                    { id: 'c', text: 'Un arbre: no compleix Ore i no és hamiltonià, demostrant que és necessària.' },
                    { id: 'd', text: 'El graf buit (sense arestes): no compleix Ore i no és hamiltonià.' }
                ],
                correctOptionId: 'a',
                explanation: 'Un cicle $C_n$ (n ≥ 5) és clarament hamiltonià (el propi cicle recorre tots els vèrtexs), però cada vèrtex té grau 2 i per tant $g(u)+g(v) = 4$, que no arriba a $n$ si $n \\ge 5$. Això demostra que la condició d\'Ore és suficient, però no necessària: hi ha grafs hamiltonians que no la compleixen.'
            },
            {
                id: 'm1-q3-8',
                question: 'El graf bipartit complet $K_{r,s}$ (amb $r \\le s$). Per a quins valors de $r$ i $s$ és hamiltonià?',
                options: [
                    { id: 'a', text: 'Sempre que $r + s$ sigui parell.' },
                    { id: 'b', text: 'Només quan $r = s$ (i $r \\ge 2$).' },
                    { id: 'c', text: 'Sempre que $r \\ge 2$ i $s \\ge 2$, independentment de si són iguals.' },
                    { id: 'd', text: 'Mai, els bipartits complets no poden ser hamiltonians.' }
                ],
                correctOptionId: 'b',
                explanation: 'Un cicle hamiltonià en un bipartit alterna obligatòriament vèrtexs de cada part (A → B → A → B...). Per tancar el cicle visitant tots els vèrtexs, calen exactament el mateix nombre de vèrtexs a cada banda: $r = s$. Si $r \\ne s$, sobren vèrtexs d\'una banda que mai es podran visitar dins un cicle tancat.'
            },
            {
                id: 'm1-q3-9',
                question: 'Considerem el producte cartesià $G \\times H$ de dos grafs. Si $G$ i $H$ són eulerians, què podem dir del producte $G \\times H$?',
                options: [
                    { id: 'a', text: 'No és necessàriament eulerià, depèn de la mida dels grafs.' },
                    { id: 'b', text: 'És eulerià, ja que el grau de cada vèrtex $(u,v)$ al producte cartesià és $g_G(u) + g_H(v)$, suma de dos parells, que és parell.' },
                    { id: 'c', text: 'Només és eulerià si els dos grafs tenen el mateix ordre.' },
                    { id: 'd', text: 'Mai és eulerià perquè el producte cartesià no preserva la connectivitat.' }
                ],
                correctOptionId: 'b',
                explanation: 'Al producte cartesià, el grau de cada vèrtex $(u,v)$ és $g_G(u) + g_H(v)$. Si $G$ i $H$ són eulerians, tots els seus vèrtexs tenen grau parell. La suma de dos nombres parells és sempre parell, i el producte cartesià de grafs connexos és connex. Per tant, $G \\times H$ és eulerià.'
            },
            {
                id: 'm1-q3-10',
                question: 'Volem demostrar que un cert graf G NO és hamiltonià. Quina és l\'estratègia més efectiva d\'entre les següents?',
                options: [
                    { id: 'a', text: 'Verificar que el graf no compleix el Teorema de Dirac (no tots els graus són ≥ n/2).' },
                    { id: 'b', text: 'Buscar un conjunt de vèrtexs S tal que en suprimir-lo, G − S tingui més de |S| components connexes.' },
                    { id: 'c', text: 'Comprovar que el graf no és eulerià.' },
                    { id: 'd', text: 'Verificar que el graf no compleix el Teorema d\'Ore.' }
                ],
                correctOptionId: 'b',
                explanation: 'Truc d\'examen (Secció 2.1): Dirac i Ore són condicions SUFICIENTS, no necessàries. Que no es compleixin no demostra que G no sigui hamiltonià. En canvi, la condició de Vèrtexs-Components és NECESSÀRIA: si trobes un S on el nombre de components > |S|, llavors G amb certesa absoluta no és hamiltonià. Aquesta és l\'eina per negar.'
            }
        ]
    },
    {
        topicId: 'm1-tema-4',
        timeLimitSeconds: 600,
        questions: [
            {
                id: 'm1-q4-1',
                question: 'Quantes arestes té un arbre d\'ordre $n$?',
                options: [
                    { id: 'a', text: '$n$' },
                    { id: 'b', text: '$n - 1$' },
                    { id: 'c', text: '$n(n-1)/2$' },
                    { id: 'd', text: '$2n - 2$' }
                ],
                correctOptionId: 'b',
                explanation: 'Propietat fonamental dels arbres (Secció 1): Un arbre d\'ordre $n$ té exactament $m = n - 1$ arestes. Aquesta relació és clau i apareix en gairebé tots els exercicis d\'arbres. L\'opció d és $\\sum g(v)$, no el nombre d\'arestes.'
            },
            {
                id: 'm1-q4-2',
                question: 'L\'"Equació d\'Or" dels arbres és $\\sum g(v) = 2n - 2$. Un arbre té 3 vèrtexs interiors de graus 4, 3 i 2 respectivament, i la resta són fulles (grau 1). Quantes fulles té?',
                options: [
                    { id: 'a', text: '4' },
                    { id: 'b', text: '5' },
                    { id: 'c', text: '6' },
                    { id: 'd', text: '7' }
                ],
                correctOptionId: 'b',
                explanation: 'Apliquem l\'Equació d\'Or: $4 + 3 + 2 + f \\cdot 1 = 2(f + 3) - 2$. Simplifiquem: $9 + f = 2f + 4$, d\'on $f = 5$. L\'arbre té 5 fulles i ordre $n = 8$. Aquest és exactament el tipus de problema que es resol en menys d\'un minut a l\'examen.'
            },
            {
                id: 'm1-q4-3',
                question: 'Quina de les següents NO és una caracterització equivalent d\'un arbre?',
                options: [
                    { id: 'a', text: 'Graf connex amb $m = n - 1$ arestes.' },
                    { id: 'b', text: 'Graf acíclic amb $m = n - 1$ arestes.' },
                    { id: 'c', text: 'Graf connex on existeix un únic camí entre cada parella de vèrtexs.' },
                    { id: 'd', text: 'Graf connex on tots els vèrtexs tenen grau parell.' }
                ],
                correctOptionId: 'd',
                explanation: 'Les opcions a, b i c són les tres caracteritzacions equivalents del Teorema de Caracterització d\'Arbres (Secció 1). En canvi, l\'opció d descriu un graf Eulerià, no un arbre. De fet, un arbre ha de tenir fulles (grau 1, senar), pel que MAI pot tenir tots els graus parells.'
            },
            {
                id: 'm1-q4-4',
                question: 'Què passa si esborrem un vèrtex $u$ de grau 3 d\'un arbre $T$?',
                options: [
                    { id: 'a', text: 'El graf resultant segueix sent un arbre amb $n - 1$ vèrtexs.' },
                    { id: 'b', text: 'Es generen exactament 3 components connexos (un bosc de 3 arbres).' },
                    { id: 'c', text: 'Es generen 2 components connexos.' },
                    { id: 'd', text: 'El resultat depèn de la posició del vèrtex dins l\'arbre.' }
                ],
                correctOptionId: 'b',
                explanation: 'Propietat de vèrtexs de tall (Secció 1): En un arbre, esborrar un vèrtex $u$ de grau $g(u) \\ge 2$ separa l\'arbre en exactament $g(u)$ components connexos. Com $g(u) = 3$, s\'obtenen 3 components (un bosc de 3 arbres).'
            },
            {
                id: 'm1-q4-5',
                question: 'Per què podem afirmar que tota aresta d\'un arbre és una aresta pont?',
                options: [
                    { id: 'a', text: 'Perquè els arbres no contenen cicles: si esborrem una aresta, no hi ha cap ruta alternativa per mantenir la connexió.' },
                    { id: 'b', text: 'Perquè tots els vèrtexs d\'un arbre tenen grau ≥ 2.' },
                    { id: 'c', text: 'Perquè un arbre sempre és bipartit.' },
                    { id: 'd', text: 'Només és cert si l\'arbre té diàmetre ≥ 3.' }
                ],
                correctOptionId: 'a',
                explanation: 'Caracterització dels arbres: entre cada parella de vèrtexs hi ha un ÚNIC camí. Si esborrem qualsevol aresta, els dos vèrtexs que connectava perden la seva única via de comunicació, desconnectant l\'arbre en 2 components. Per tant, tota aresta és pont.'
            },
            {
                id: 'm1-q4-6',
                question: 'Segons el Teorema de Cayley, quants arbres etiquetats (amb vèrtexs numerats) diferents es poden construir amb $n = 4$ vèrtexs?',
                options: [
                    { id: 'a', text: '4' },
                    { id: 'b', text: '8' },
                    { id: 'c', text: '16' },
                    { id: 'd', text: '12' }
                ],
                correctOptionId: 'c',
                explanation: 'Teorema de Cayley (Secció 3): El nombre d\'arbres etiquetats amb $n$ vèrtexs és $n^{n-2}$. Per $n = 4$: $4^{4-2} = 4^2 = 16$ arbres possibles.'
            },
            {
                id: 'm1-q4-7',
                question: 'La seqüència de Prüfer d\'un arbre d\'ordre 7 és $(3, 3, 1, 5, 3)$. Quin és el grau del vèrtex 3 a l\'arbre original?',
                options: [
                    { id: 'a', text: '3' },
                    { id: 'b', text: '4' },
                    { id: 'c', text: '2' },
                    { id: 'd', text: '5' }
                ],
                correctOptionId: 'b',
                explanation: 'Truc de Prüfer (Secció 3): El grau d\'un vèrtex a l\'arbre = (nombre de cops que apareix a la seqüència) + 1. El vèrtex 3 apareix 3 vegades a $(3, 3, 1, 5, 3)$, per tant $g(3) = 3 + 1 = 4$.'
            },
            {
                id: 'm1-q4-8',
                question: 'Donada la seqüència de Prüfer $(2, 5, 5)$ d\'un arbre d\'ordre 5, quins vèrtexs són fulles (grau 1)?',
                options: [
                    { id: 'a', text: 'Vèrtexs 2 i 5.' },
                    { id: 'b', text: 'Vèrtexs 1, 3 i 4.' },
                    { id: 'c', text: 'Vèrtexs 1 i 3.' },
                    { id: 'd', text: 'Només el vèrtex 4.' }
                ],
                correctOptionId: 'b',
                explanation: 'Com les fulles no apareixen mai a la seqüència de Prüfer (perquè tenen grau 1 = 0 aparicions + 1), els vèrtexs que NO surten a $(2, 5, 5)$ són fulles. Amb vèrtexs $\\{1, 2, 3, 4, 5\\}$, els absents són $\\{1, 3, 4\\}$: tres fulles.'
            },
            {
                id: 'm1-q4-9',
                question: 'Apliquem BFS a un graf roda $W_n$ per obtenir un arbre generador. Si comencem pel vèrtex central (hub), quin arbre resultant obtenim?',
                options: [
                    { id: 'a', text: 'Un camí $P_n$ que recorre tots els vèrtexs en línia.' },
                    { id: 'b', text: 'Una estrella $K_{1,n-1}$: el hub connectat directament a tots els vèrtexs perifèrics.' },
                    { id: 'c', text: 'Un arbre binari equilibrat.' },
                    { id: 'd', text: 'Un cicle $C_n$ sense el hub.' }
                ],
                correctOptionId: 'b',
                explanation: 'Truc d\'examen (Secció 2): El hub de $W_n$ és adjacent a tots els vèrtexs perifèrics. BFS des del hub els descobreix tots en un sol salt d\'onada, formant una estrella $K_{1,n-1}$. En canvi, si comencem per un vèrtex exterior, l\'arbre resultant serà NO isomorf a l\'estrella.'
            },
            {
                id: 'm1-q4-10',
                question: 'Un bosc té $n = 12$ vèrtexs i $k = 3$ components connexos. Quantes arestes té?',
                options: [
                    { id: 'a', text: '11' },
                    { id: 'b', text: '12' },
                    { id: 'c', text: '9' },
                    { id: 'd', text: '10' }
                ],
                correctOptionId: 'c',
                explanation: 'Teorema de la Secció 1: Un bosc de $n$ vèrtexs i $k$ components connexos té exactament $m = n - k$ arestes. Amb $n = 12$ i $k = 3$: $m = 12 - 3 = 9$ arestes.'
            }
        ]
    }
];
