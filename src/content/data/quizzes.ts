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
                question: 'Ens trobem resolent l\'exercici "Don Camilo" (Inserir "Don" abans de "Camilo" en una `std::list`). A dins del bucle if detectes "Camilo" i fas `L.insert(it, "Don");`. Què ocorreria si després fas un simple `++it` convencional per continuar llegint?',
                options: [
                    { id: 'a', text: 'Saltaries el següent nom autèntic de la llista, ja que el `.insert()` desvia l\'iterador dues posicions asincrònicament.' },
                    { id: 'b', text: 'El programa continuaria correctament iterant el següent element original sense cap inconvenient, atès que insert posa l\'element ABANS i "it" continua lligat al "Camilo".' },
                    { id: 'c', text: 'Es genera un bucle infinit o error, perquè `insert` s\'incrusta just al te lloc actiu, deixant a "it" apuntant al de darrere asimptomàticament tancat.' },
                    { id: 'd', text: 'Una excepció de `Segmentation Fault` atès que tot element inserit causa que la llista es dispersi i l\'iterador quedi esclafat.' }
                ],
                correctOptionId: 'b',
                explanation: 'Enllaçat al problema T65668 del Jutge referent a "Camilo". En llistes de C++, `L.insert(it, valor)` s\'insereix **ABANS** de l\'element actiu. L\'afegiment no mata ni desplaça on apuntava el punter previ (el "Camilo" original). Llavors fer un pas iteratiu `++it` saltarà tranquil·lament a la paraula seqüent passat el "Camilo" evitant bucles infinits de revisar l\'element inserit!'
            },
            {
                id: 'q3-2',
                codeSnippet: 'void elimina_nombres(list<int>& L) {\n    auto it = L.begin();\n    while (it != L.end()) {\n        if (*it == 0) L.erase(it);\n        else it++;\n    }\n}',
                question: 'Identifica la gravíssima avaria present en aquest codi si l\'element actiu en avaluació iterativa arriba a ser pròpiament el número `0`.',
                options: [
                    { id: 'a', text: 'Compilació fallida. La paraula "auto" de C++11 és incompatible per declarar un `list<int>::iterator` de lectura dinàmica pura.' },
                    { id: 'b', text: 'Fallada d\'execució (`Segmentation Fault`). Fer `.erase(it)` foragita el node íntegre a l\'oblit de la RAM, destruint la base on residia l\'iterador i incapaç d\'enllaçar el següent cop a bucle general del while de temps on.' },
                    { id: 'c', text: 'L\'iterador tornarà a revisar el zero immediat com si fos el punt esborrat de darrera asimptomàtica passiva!' },
                    { id: 'd', text: 'Només provocarà saltar-se nodes consecutius en bucles for i while pur, mai fent Segfault donat que list resol bucle buit temporal a L.end() estricte c !' }
                ],
                correctOptionId: 'b',
                explanation: 'Apunts 3.3 El perill mortal! Mètodes destructors `erase()`. L\'esborrar allibera la petita casella física a la memòria destruint el punter virtual actiu. Un segon després el bucle general intente fer acció al node caigut. Obligatori és capturar el retorn: `it = L.erase(it);` (que s\'encarrega per tu de pescar enllaçar ja el bloc endavant pur de sobte)!'
            },
            {
                id: 'q3-3',
                question: 'Al resoldre seqüències controlades amb cursor asíncron virtual (Jutge S39735), tenim l\'iterador fixat just "ABANS" del primer passiu (`it = L.begin()`). Què passarà matemàticament pel pur C++ si l\'estudiant envia la comanda `it--` ?',
                options: [
                    { id: 'a', text: 'S\'allotjarà fora d\'abast a posicions darreres del final (emulant una espècie de xarxa en L.rbegin virtual pur generada c).' },
                    { id: 'b', text: 'Res dolent, `std::list` protegirà el gir donant una condició bucla "it == L.begin()" repetidament tancat per darrer bucle iterat.' },
                    { id: 'c', text: 'L\'iterador serà enllaçat literalment amb el node Sentinel actiu en el buit on retrocedirà sense avisar referint memòria aleatòria fora del rang (`Undefined Behavior`).' },
                    { id: 'd', text: 'Garanteix que el pas O(LogN) encadenat s converteixi iteratiu iterat al buit de rbegin asíncrona v !' }
                ],
                correctOptionId: 'c',
                explanation: 'Un error fatal dels estudiants (Tema 3.2). A diferència d\'usar limitadors de for segur i les instruccions d\'una reverse list (`rbegin`). Un iterador avançat que trenca el rang esquerrà absolut cap per avall explota al cap avall i acaba apuntant dades brossa no lligades del programa general sencer. Ens toca verificar un blindatge pur i dur abans: `if (it != L.begin()) --it;`'
            },
            {
                id: 'q3-4',
                question: 'Sincerament i segons l\'avís intern de Tema 3.1.. Si ambdues tenen O(1) al cost d\'afegir/llevar al punt final de base... perquè globalment ens faran prioritzar el temible `std::vector` en lloc de la flamant `std::list`?',
                options: [
                    { id: 'a', text: 'Perquè la Llista no pot allotjar mai struct i classes de dades abstractes d dins amagada.' },
                    { id: 'b', text: 'Perquè `std::vector` amaga una millor compatibilitat C++ general si programem pre-compiladors o pre .hh constants generats en f t s .' },
                    { id: 'c', text: 'El vector manté la memòria asíncrona pur c per bucle passiu donat temps O(N^2) l iterada s en la c u !' },
                    { id: 'd', text: 'La Llista no disposa d\'accés aleatori numèric indexat. I a causa de la fragmentació física aïllada d\'enllaços i punters, destrueix totalment el rendiment asimptomàtic de "Cache Locality" de la CPU vs un Vector contigu ràpid.' }
                ],
                correctOptionId: 'd',
                explanation: 'Sempre cau als exàmens. Els Vectors al ser Contigüus ocupen i descarreguen dades massives senceres als nivells memòria L1/L2 apropant els nodes per Cache Locality del Hardware general. Les Llistes pateixen a cada unió un perillós viatge (O(1) "lent") de CPU pel bus ja que els fragments són caòtics a la RAM desordenats amuntegat i separats on no s\'ofereix tampoc l\'indicador índex de v[i].'
            },
            {
                id: 'q3-5',
                codeSnippet: 'list<string>::const_iterator cercar(const list<string>& dades) {\n   for(auto it = dades.begin(); it != dades.end(); it++) {\n     /* ... */ ',
                question: 'En implementar l\'exercici del Jutge U61590 `Paraula més llarga`, es fa passar la matriu per referència constant `const list`. Quin detall iteratiu bloquejarà la pauta alçada i donarà un flagrant Error pur a Compilació de dades?',
                options: [
                    { id: 'a', text: 'Quan forcem llista pur Const c , els iteradors de `begin()` passen a retornar internament passivaments `const_iterator`, els quals el C++11 rebutja lligar al clàssic asíncrones if d de auto l it global v n.' },
                    { id: 'b', text: 'El problema és tractar `*it` a posteriori. Cap const_iterator deixa que demanis quin element tenen lligat (Són opacs pur cecs de temps f iterat e q d ).' },
                    { id: 'c', text: 'Tot l\'algorisme de base d\'afegir pas a l\'avanç i retrocés (El `it++` i `--it`) es bloqueja en read_only evitant asíncrons passos passiu b constants globals t h !' },
                    { id: 'd', text: 'L\'error amagat real és que no s\'usa `auto it = dades.cbegin()` de capçalera pura que obliga a complir regles C++ de bloqueig i de seguretat de cap mena per p constant o !' }
                ],
                correctOptionId: 'd',
                explanation: 'Apunts 3.2: Tot paràmetre d llista encapsulat constant c obliga exclusiu referir explorable iteradors constants passats. El problema de `dades.begin()` sota `const` és que encara pot cridar per error de compatibilitat lligams mutables i ser bloquejat pels IDEs de C++ rigorosos moderns referint `cbegin()` t i pass i constants!'
            },
            {
                id: 'q3-6',
                question: 'Com solucionaríem sota cost amagat pur constant l d d\'eficiència algorísmica abstracte O(1) de CPU voler adreçar i llegir per pura màniga l\'element ubicat just al davant del mig e en Llista on base l m p (`L[500]` en 1000 nodes n iterats n virtual l p )?',
                options: [
                    { id: 'a', text: 'Mitjançant e d la funció `std::advance(it, 500)` de la llibreria clàssica t general l c !' },
                    { id: 'b', text: 'Matemàticament utilitzant `auto it = L.begin() + 500`, que aplica les operacions logarítmiques s pre de suma t f n !' },
                    { id: 'c', text: 'És tècnicament impossible de fer matemàtic en e t O(1) donat referir f n l std::list no ofereix Accessos o constants base aleatoris n . Costarà l b de d temps h sempre d y asimptòtic O(N) c on i c f recórrer seqüencial u cada pas pur h it++ q !' },
                    { id: 'd', text: 'El m t l mètode `.middle()` a C++ amaga el x pointer c base passiu en q O(1) r virtual.' }
                ],
                correctOptionId: 'c',
                explanation: 'Fictici total error (Lliçó 3.1 r p d r) ! Ojo de l\'examen x on u! En el bucle abstracte p del iterat d i C++ list amagades d h k a v n s L g M f x les Double Ended o Linked list c no suporten f accés O(1). Les úniques mides d O(1) són `front()` i `back()`. Saltar a una b l c i d casella concreta w k j q s N sempre l requereix que u iteris amagat j el n d d temps amuntegat pass on m j N!'
            },
            {
                id: 'q3-7',
                question: 'Ens disposen la missió clàssica `S97463: Fusió de Llistes Ordenades`. Donades Llistes A i B (n i m) ordenades previament. Quina complexitat donarà crear la llista fusionada si programes una iteració purament lineal en paral·lel de punters iteradors?',
                options: [
                    { id: 'a', text: 'O(N * M) atès que l\'avançar un costat demana repassar el sencer cantó de B des de principi per comparar.' },
                    { id: 'b', text: 'O(N * Log(M)) utilitzant mètodes de cerca binària per punters.' },
                    { id: 'c', text: 'O(N^2) perquè cada std::list llança inserits constants a temps complet global.' },
                    { id: 'd', text: 'O(N + M) Temps lligat lineal de base garantizada. Avançar un element iterat i triar només ocupa O(1) constant.' }
                ],
                correctOptionId: 'd',
                explanation: 'Aquest comportament en C++ és conegut com el "Zipper". Obremallera d\'iteradorA i iteradorB.  Dins el loop es llegeixen O(1), es clonen O(1) i es fa ++it O(1). D\'això deduïm matemàticament un O(N+M) global sense haver de fer repesques ni recórrer cadenes múltiples de cerques!'
            },
            {
                id: 'q3-8',
                question: 'A Jutge vam fer l\'exercici Ajuntar Paraules `W84371` amb els Iteradors de Principi i Final. Per quina raó tècnica s\'ha de fer servir com a condició de bucle cert un `while (begin != end)` enlloc d\'un estàndard `>=` que sí que usem iterant nombres lliures C++ matemàtics?',
                options: [
                    { id: 'a', text: 'Perquè la mida dels vectors depèn de la versió del compilador amagat i el `end()` no podria sumar indexacions lliures.' },
                    { id: 'b', text: 'Els operadors relacionals en cru (<, >, <=, >=) NO existeixen abstractament per als Bidirectional Iterators (llevat que siguin Contigus com el Vector), el compilador C++ demanarà disseny estricte i invocarà l\'únic comparador segur de llistes deslligades: referents d\'Igualtat pur d\'adreces (!=, ==).' },
                    { id: 'c', text: 'Fer bucle While trenca el paradigma abstracte O(N) establint el retorn infinit constant general si comparem línies pures amagades.' },
                    { id: 'd', text: 'Es generen problemes asímptotes a memòria dinàmica atès que el C++ tanca les regles iteratives per defecte davant les instàncies generals del Heap global que puguin estar lliurement tancades a vectors dinàmics simples.' }
                ],
                correctOptionId: 'b',
                explanation: 'Una joia tècnica sota control! Si utilitzes un List Iterator `std::list::iterator`, la memòria viu completament escampada. El llenguatge C++ t\'impedirà fer i avaluar distàncies abstractes com `it < L.end()`. L\'enginyeria obliga usar única i rigorosament condició d\'igualtat: "Mentre un iterador cert sigui diferent referencialment al del Final `it != end()`".'
            },
            {
                id: 'q3-9',
                question: 'Donat un iterador Constant `const_iterator` de lectura C++11 pur o cridat via `cbegin()`. Què respondrà el nostre sistema informàtic si es crida l\'ordre forçada destructora al mig de la seqüència `L.erase(const_iterator)`?',
                options: [
                    { id: 'a', text: 'Error flagrant en temps de compilació abans d\'executar g++. El disseny lligat a `std::list::erase` només atén i rep signatures estrictes `iterator` pur mutables i rebutja paràmetres de llibreria blindats `const_iterator`.' },
                    { id: 'b', text: 'Acatarà destruint l\'instància modernament omplint l\'adreça re-acoblant en un estalvi de temps asíncron general O(1).' },
                    { id: 'c', text: 'L\'enrutament intern llençaria directament una advertència per paràmetre Constant generant un enllaç trencat que cal adreçar cap on la pila del programa operava memòria d\'excepció.' },
                    { id: 'd', text: 'Cap error visual de compilador, simplement ho executa destruint el node lliurement ja que C++ destrueix Nodes sense revisar la constant de punters locals a la funció externa.' }
                ],
                correctOptionId: 'a',
                explanation: 'A dades estructurades constants s\'aplica un blindatge impenetrable! Un "const iterator" et dóna permís únic i lliure només per observar, no pas destruir la matriu que el forma. Així, `.erase()` rebutjaria en compilació abans d\'executar atès el tipatge intern forçat de prevenció mútua C++.'
            },
            {
                id: 'q3-10',
                question: 'Respecte el Jutge de Matrius Esparses (convertir Matriu de zéros massiu a una llista `std::list<Casella>` recollint només elements no nuls). Si la matriu global tingués 5 Milions de zéros buits i només 2 elements útils! Quin gran guany d\'arquitectura suposa exactament referir-ho mitjançant llistes?',
                options: [
                    { id: 'a', text: 'La Matriu abstracte ocuparia idèntic espai, ja que les llistes guarden l\'índex de fila i columna que equival físicament als zéros omesos globalment en la representació.' },
                    { id: 'b', text: 'Les Matrius normals instanciades d\'array `vector<vector>` crearien memòria activa RAM per tots i cadascun dels 5 Milions de caselles causant un inútil malbaratament GBs. Mentrestant la `std::list` emmagatzemarà exclusivament aquells 2 únics elements gastant un pur parell de Bytes.' },
                    { id: 'c', text: 'C++ no permet llistes d\'objectes complexes propis `Casella`, pel que forçar una matriu a llistes O(N) farà créixer el temps local de recerca per la CPU rebotant excepció general.' },
                    { id: 'd', text: 'Les dues consumeixen memòria asimptòtica directa bastant similar donat que la llibreria lliga blocs pre-assignats de memòria a través de vectors interiors darrere el teló de les llistes std.' }
                ],
                correctOptionId: 'b',
                explanation: 'Aquesta és la clau de les Matrius esparses (Sparse Matrices) ensenyat al Tema. Si uses memòria per representar el buit `0`, un camp gegant (100k x 100k) farà esclatar la RAM! Una Llista en canvi pot estripar el buit emmagatzemant un gra d\'encapsulació només format de {i, j, value} on els únics bits vius formen llistes curtes assequibles.'
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
                question: 'Quina és la diferència tècnica i fonamental entre els conceptes de "Recorregut" i un "Camí" en relació als grafs?',
                options: [
                    { id: 'a', text: 'Un camí prohibeix estrictament repetir qualsevol vèrtex o aresta, mentre que el recorregut permet viatjar lliurement re-trepitjant dades i llocs per les connexions.' },
                    { id: 'b', text: 'Els "camins" exclusivament poden orientar-se d\'un costat simple lligat (vectors unidireccionals purs), on els "recorreguts" destaquen per faltar polaritat lògica i sentit estricte BFS.' },
                    { id: 'c', text: 'Matemàticament són completament idèntics formalment, ambdós atorgant purament la idea asimètrica d\'un viatge de connexions tancades constants.' },
                    { id: 'd', text: 'El Recorregut es genera a Pila DFS estretament paral·lel d\'origen LIFO, mentrestant un Camí defineix Cues BFS radial formatiu.' }
                ],
                correctOptionId: 'a',
                explanation: 'A la Secció 1 observem: El "Camí" representa una especialització prèmium exigible i tancada on absolutament estarà prohibit repetir ni elements vèrtexs ni trepitjar arestes visitades. Un "recorregut" general purament no discrimina.'
            },
            {
                id: 'm1-q2-2',
                question: 'Si analitzem geomètricament la relació establerta en un lligam per formar l\'arquitectura purament en condicions de ser d\'un entorn "Connex", quin mínim valor absolut d\'arestes estarà present de segur (m) dictaminant relació per assoleir un sistema de total vèrtexs pur genèric base donat (n) dades?',
                options: [
                    { id: 'a', text: 'Com a mínim absolut de forta m = n/2.' },
                    { id: 'b', text: 'Indefectiblement certifiquem establir una norma base i segura establint obligat mínim pur lligat m = n - 1.' },
                    { id: 'c', text: 'Ens demanen forçosament retenir constants sota m = n * (n -1).' },
                    { id: 'd', text: 'Seran referencials purs lligats estipulats general abstracte formal cèntric sota llistes m = 2n - 2.' }
                ],
                correctOptionId: 'b',
                explanation: 'Requisit clau per connectar tothom d\'una formació a "Components Connexos"! Matemàticament, el menor dispendi necessari de retenir una societat unida completament costa posar pures arestes i traços a mesura mínima que suposa pur d\'arbres (exactament m = n - 1). Inferior a això és trencament i caiguda desconnectada cèntrica.'
            },
            {
                id: 'm1-q2-3',
                question: 'Respecte certes clàssiques pífies de referència en proves o exàmens d\'enginyeria, asseverem abstracte pur... "És irrefutable que tot graf relacional en un domini unificat i Connex que posseeixi un poderós element -Vèrtex de Tall-, s\'encarregarà pur d\'albergar obligatori entre les connexions sempre d\'alguna o més -Arestes Pont-". Això últim és encertat o simple fals d\'acció logarítmica general?',
                options: [
                    { id: 'a', text: 'Del tot FALS asimptòtic. El contra-exemple ideal s\'anomena formal visualment "Graf Papallona" (Consta pur donat en lligam cèntric on 2 triangles oposats atrets asimètricament per igual punt en conjunt). Aquest cert mateix nus es constitueix en vèrtex destructor si l\'extrapoles, però gràcies que les "Ales" són circulars asimètriques completes per fora mai res posseeix pur de lligatura d\'Aresta pont.' },
                    { id: 'b', text: 'Fórmula Verídica al 100%. Teorema i Condició lògica BFS p p b DFS r d m base b j f l i Mètrica formal d de components.' },
                    { id: 'c', text: 'Només és matemàticament encertada i p forçadament pur general b s exclusivament r h c k v base q y G h DFS Cicles aïllats p i Bipartita D g u lligat BFS v x.' },
                    { id: 'd', text: 'M Fals com concepte, la excentricitat f de q e no dictaminarà n i m G pur base j u s r BFS generadors b Cicles DFS z t!' }
                ],
                correctOptionId: 'a',
                explanation: 'Típic "Parany"! Fal·làcia estricte de P1 d\'examen descrita de memòria apunts! En treure en efecte el node del mitg Papallona sí esbudella estètic l\'engranatge, considerat com "Element Tall"... Tanmateix per on treus exclusivitats arestes lliures pur en cada Triangle lateral... romanen cicles n purs que el pontet general r base lligant d n d no el tallaran (0 Ponts Reals referent global b!)'
            },
            {
                id: 'm1-q2-4',
                question: 'I al revés matemàticament lligat d\'Enginyeria? Ens adonem i deduïm absolut exclusivament fixat per la Mètrica que disposem ara al revés referint asimptòtic base de cert tenir exactes lligades reals unes veritables f "Arestes Pont". Analitzant complet en rigor pur referent extrem base asimètric on penja i aguanta formal lligat genèric i fita aquest pas d\'arestes referent al vèrtex en Qüestió. Quin estat obtenen aquestes mateixes fronteres de p?',
                options: [
                    { id: 'a', text: 'Generen l\'oblit exclusiu atorgant c DFS un DFS c o DFS z Graus Purs asimètrics D parells genèrics.' },
                    { id: 'b', text: 'A excepció exclusiva b evident f p g l "i d m s t a" s d s n q de m d a g si fossen p element de p d vèrtex "Fulla"... seran irremediablement declarats absoluts p i r f c g DFS elements categoritzats x j q f n pur per defectes de tall o - "Vèrtexs de r t DFS Tall".' },
                    { id: 'c', text: 'Acataran d pur i DFS n general x p q i D d r m b exclusiu t l c m u asimètric n formal D r "G Centric" purs d o n b C.' },
                    { id: 'd', text: 'S G t z BFS y q n D ! m g v f a g i i l asimètriques general l j u k n f w y r BFS s o D base C e !' }
                ],
                correctOptionId: 'b',
                explanation: 'Inversió Tècnica i asimètrica! Un Pont aguanta Mons de l\'Univers o DFS. Purament en treure r f n del m d sistema n d just s k r en ell la roca c n x formal d l (Un Vèrtex), obligatori el g w Pont perd r u f a suport, el pont s g v g w l x k h trencarà a ell mateix base BFS, desprenent els e y m d mons o components p c g g m purs asimètrics d c r u q formal c "Tall", u (Només h h D la "fulla" j f u c z de D p i n g s e cua e cau pur s f n exclusiu D asimètric sense s g r v b provocar p z o u talls r l e n g o b s grans D v).'
            },
            {
                id: 'm1-q2-5',
                question: 'Si determinem de manera estadística pur matemàtic de Cerca lligant el paràmetre anomenat com a referent exclusivament logarítmic de l\' -Excentricitat de cada m membre generador Node V-, quin r asimptòtic valor estarem observant genèric per trobar-hi general m f asimètric al recull DFS/BFS general s base?',
                options: [
                    { id: 'a', text: 'Ens col·loquem abstractament des del c d mateix c d n individu o membre referent e l f exclusivament per trobar-hi de viatge "Aquell element g pur b h a absolut BFS n a qui p triga amuntega j z d absolut a o b en Cicles e u h e s s e BFS z w pur s trobar p h p D i Mès M v f asimptòtic l h Allunyat absolut k genèric l f x (El c j Pitjor m l e a g o BFS i k b c p u cas m genèric f estricte possible e D m w u DFS d d b z DFS l w c p x g z s DFS e n h ) c y b j ".' },
                    { id: 'b', text: 'Resultat r l q e de mitjanar absoluts a D p s DFS pur per D g e z o k d x els h t n D k viatges.' },
                    { id: 'c', text: 'Genera h d k j a absolut j s d DFS D h p h p h BFS r f b d DFS D j j b j d de r DFS o i d s m p m n t w f x D f j u y h x . ' },
                    { id: 'd', text: 'L a r D q a v L z w y c BFS f m a BFS f n y c w n m l R p ' }
                ],
                correctOptionId: 'a',
                explanation: 'A l\'Apunts és clar pur referent d u: Excentricitat (e). És s e n g k z BFS g e "Asseu-te g s al c b s g G z G DFS w teu D q propi w l l e vèrtex. Des g v d q DFS j d g l m o b x f c de k tú... asimètrics j o Quin z t c c y node w c j estricte o m x u pur t del r w k q v f y g de D DFS i l b p d d e l map genèric h u g és z s i e a D k x r k qui q k w y BFS m x tens BFS a t m h g v O e b o O N m e a i y s u N g n T P c més I l h n l m Lluny k ? w w x ". a h l o BFS '
            },
            {
                id: 'm1-q2-6',
                question: 'Seguint el diccionari de mètriques del tema, com es defineix matemàticament l\'atribut "Excentricitat" d\'un vèrtex?',
                options: [
                    { id: 'a', text: 'És la suma literal de totes les distàncies acumulades recorregudes al graf complet.' },
                    { id: 'b', text: 'És calcular totes les rutes BFS des d\'ell i quedar-nos només amb el viatge més llunyà possible (el pitjor cas).' },
                    { id: 'c', text: 'Es mesura trobant la meitat exacta del diàmetre del graf.' },
                    { id: 'd', text: 'S\'obté seleccionant aleatòriament la connexió més propera al node.' }
                ],
                correctOptionId: 'b',
                explanation: 'L\'excentricitat és posicionar-nos al vèrtex i avaluar:quina és la distància de la persona que tinc literalment MÉS lluny de tot el graf? Ens quedem aquest valor extrem com la nostra excentricitat (e).'
            },
            {
                id: 'm1-q2-7',
                question: 'Baix els efectismes de la Cerca DFS en Profunditat, quin procedir informàtic natiu escorta i regeix la seva marxa enrere (backtracking)?',
                options: [
                    { id: 'a', text: 'Ús obligatori d\'una matriu booleana central.' },
                    { id: 'b', text: 'Amb un comportament rígid basat en Cues FIFO per atendre el primer en arribar.' },
                    { id: 'c', text: 'Sota la recursivitat d\'una Pila o Stack (LIFO), permetent desfer sobre l\'última ubicació amuntegada per explorar branques paral·leles.' },
                    { id: 'd', text: 'Amb taules de dispersió per emmagatzemar grafs connexos.' }
                ],
                correctOptionId: 'c',
                explanation: 'El DFS busca explorar forçosament el més profund. L\'estructura ideal darrere en memòria nativa és l\'apilament Stack actuant com a LIFO natural. Quan xoca sense camí nou, fa "pop" per marxar enrere.'
            },
            {
                id: 'm1-q2-8',
                question: 'Segons el Teorema 9 present als apunts de M1, de què és garant matemàtic un algorisme BFS (Cerca en Amplada) que guarda els passos de nivell fets (D)?',
                options: [
                    { id: 'a', text: 'Només val per extreure les fulles d\'un arbre.' },
                    { id: 'b', text: 'De calcular de forma irrefutable els Camins Mínims (distàncies més curtes) des de l\'arrel inicial a qualsevol node.' },
                    { id: 'c', text: 'De trobar immediatament l\'arbre hamiltonià d\'un components connex.' },
                    { id: 'd', text: 'Sempre assoleix construir un cercle d\'Euler.' }
                ],
                correctOptionId: 'b',
                explanation: 'BFS envia "onades paral·leles". Aquells nodes que contacta al pas N, ho han fet estrictament amb N arestes (la distància menor possible i més eficient cap a aquell veí!).'
            },
            {
                id: 'm1-q2-9',
                question: 'Què dictaminen els Lemes clàssics (Lema 10) si trobem amagat al mig d\'un paper un simple Recorregut Tancat basat en una Longitud (nombre d\'arestes) purament SENAR?',
                options: [
                    { id: 'a', text: 'Garanteix matemàticament l\'existència segura amagada a l\'interior de la forma d\'almenys un Cicle de longitud Senar innegable.' },
                    { id: 'b', text: 'Denota l\'existència de vèrtexs bipartits inconnexos.' },
                    { id: 'c', text: 'No confirma res, ja que qualsevol recorregut senar podria venir donat d\'una xarxa només composta per engranatges quadrats.' },
                    { id: 'd', text: 'Assegura que l\'algorisme de DFS s\'aturarà permanentment.' }
                ],
                correctOptionId: 'a',
                explanation: 'Principi bàsic de demostracions: Si a base de donar voltes a un tros del dibuix et dóna distància total 3 o 5 i has tornat... forçosament algun triangle de 3 cares o pentàgon de 5 està lligat de base causant la formació senar. (Lema 10).'
            },
            {
                id: 'm1-q2-10',
                question: 'Aplicant el rigorós i potent "Teorema 11: Caracterització Màxima", quina condició converteix directament un pur Graf qualsevol categoritzat absolutament en format "Bipartit"?',
                options: [
                    { id: 'a', text: 'Estar desproveït totalment de nodes fulla.' },
                    { id: 'b', text: 'Comportar cicles només circulars imparells inferiors al valor d\'n.' },
                    { id: 'c', text: 'Tenir un rigor i requisit on de genèric MAI contingui enmig cap existència o representació forma oculta de Cicle pur absolut lligat de Longitud SENAR.' },
                    { id: 'd', text: 'Que disposi d\'una matriu lligada completament Euleriana.' }
                ],
                correctOptionId: 'c',
                explanation: 'Reducció al Bipartit pur. El teorema 11 diu: Un graf és Bipartit <==> NO té absolutament CAP cicle de longitud SENAR. Si descobreixes un triangle al mig de l\'examen... acomiada automàtic el concepte de bipartit del costat.'
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
