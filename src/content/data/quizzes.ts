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
        timeLimitSeconds: 600, // 10 min
        questions: [
            {
                id: 'q1-1',
                question: 'Què passa si no declares el constructor per defecte en una classe C++ on ja has definit un constructor amb paràmetres, i intentes fer `Classe obj;`?',
                options: [
                    { id: 'a', text: 'El compilador en generarà un per defecte i inicialitzarà els atributs a 0 o nullptr.' },
                    { id: 'b', text: 'Es generarà un error de compilació perquè el compilador ja no genera el constructor per defecte implícitament.' },
                    { id: 'c', text: 'S\'executarà el constructor amb paràmetres usant valors escombraries de la memòria.' },
                    { id: 'd', text: 'Produirà un error d\'execució (Runtime Error) al moment d\'ubicar la memòria.' }
                ],
                correctOptionId: 'b',
                explanation: 'En C++, si defineixes QUALSEVOL constructor, el compilador deixa de generar automàticament el constructor buit (default constructor). Si intentes instanciar sense paràmetres donarà error de compilació.'
            },
            {
                id: 'q1-2',
                question: 'Quina diferència tècnica hi ha entre passar un objecte per valor (`void f(Classe c)`) i per referència constant (`void f(const Classe& c)`)?',
                options: [
                    { id: 'a', text: 'Cap, a nivell de màquina ambdós ocupen la mateixa memòria a la pila (stack).' },
                    { id: 'b', text: 'Per valor sempre és més ràpid perquè evita la desreferenciació del punter constant a sota nivell.' },
                    { id: 'c', text: 'Per referència constant evita la crida al constructor de còpia (Copy Constructor), estalviant O(N) de memòria i CPU en objectes grans.' },
                    { id: 'd', text: 'El pas per valor crida el destructor original, eliminant l\'objecte existent.' }
                ],
                correctOptionId: 'c',
                explanation: 'Aquesta és la clàssica pregunta de Senioritat C++. Passar per referència no només "no copia", sinó que evita disparar O(N) operacions del constructor de còpia (com copiar vectors sencers a dins de l\'objecte). Evita memory leaks innecessaris i colls d\'ampolla de rendiment.'
            },
            {
                id: 'q1-3',
                question: 'En relació a l\'encapsulació, per què una classe de C++ sol declarar els atributs com a `private` i proporcionar `getters/setters`?',
                options: [
                    { id: 'a', text: 'Per obligació del compilador g++ en compilar amb la flag -Wall.' },
                    { id: 'b', text: 'Per protegir la integritat de l\'invariant de la classe, assegurant que els atributs només muten cap a estats consistents.' },
                    { id: 'c', text: 'Perquè fa que el codi s\'executi un 15% més ràpid al ser instanciat al heap.' },
                    { id: 'd', text: 'Evita que altres classes puguin llegir els valors sota cap concepte.' }
                ],
                correctOptionId: 'b',
                explanation: 'L\'invariant de la classe (la condició lògica que dóna sentit a l\'objecte, e.g. Data: dia < 32). El setter comprova això i impedeix introduir "escombraries", aconseguint programació "Bullet-proof" segura d\'errors.'
            },
            {
                id: 'q1-4',
                question: 'En el context de l\'herència a C++, què succeeix si una classe base no declara el seu destructor com a `virtual` i s\'elimina un objecte de la classe referenciada per un punter a la classe base (`Base* b = new Derived(); delete b;`)?',
                options: [
                    { id: 'a', text: 'El compilador detecta l\'error i impedeix la compilació.' },
                    { id: 'b', text: 'S\'executen ambdós destructors correctament per l\'ordre natural de destrucció.' },
                    { id: 'c', text: 'Només s\'executa el destructor de la classe Base, provocant un Memory Leak potencial dels atributs de Derived.' },
                    { id: 'd', text: 'L\'objecte es destrueix correctament però es corromp el VTable del programa.' }
                ],
                correctOptionId: 'c',
                explanation: 'Regla d\'or de C++ Senior: Si una classe pot ser heretada, el destructor HA DE SER virtual. Si no ho és, el `delete` sobre un punter de tipus Base només coneix la mida de Base i no cridarà el codi de neteja de Derived.'
            },
            {
                id: 'q1-5',
                question: 'Què és la "Regla dels Tres" (Rule of Three) en el disseny de classes de C++?',
                options: [
                    { id: 'a', text: 'Una classe ha de tenir màxim 3 atributs privats per mantenir la cohesió.' },
                    { id: 'b', text: 'Si una classe defineix un Destructor, un Copy Constructor o un Assignment Operator, probablement els ha de definir tots tres.' },
                    { id: 'c', text: 'Un objecte no pot ser instanciat més de 3 vegades en el mateix scope.' },
                    { id: 'd', text: 'Sempre s\'han de passar els objectes usant exactament 3 referències amigues.' }
                ],
                correctOptionId: 'b',
                explanation: 'Aquesta regla indica que si la teva classe gestiona un recurs manualment (com memòria dinàmica), la lògica de còpia i de destrucció estan lligades. Ignorar-ho causa dobles alliberaments de memòria (Double Free) o Memory Leaks.'
            }
        ]
    },
    {
        topicId: 'pro2-tema-2', // Piles i Cues
        timeLimitSeconds: 480, // 8 min
        questions: [
            {
                id: 'q2-1',
                question: 'Com resoldries de forma òptima O(1) obtenir el valor "Mínim" en qualsevol moment d\'una Pila (`stack`) mentre segueixes fent push i els elements canvien?',
                options: [
                    { id: 'a', text: 'Iterar per sota la pila amagada (vector) amb iteradors i buscar el min()' },
                    { id: 'b', text: 'Mantenir una variable global "minim" que s\'actualitzi fent min(minim, x). Tanmateix, requerirà iterar al fer pop.' },
                    { id: 'c', text: 'Crear una segona Pila "auxiliar" que només faci push(Mínim Actual) cada vegada que s\'insereix un element.' },
                    { id: 'd', text: 'No és possible fer en O(1) amb una Pila, s\'hauria d\'usar una Priority_Queue (B-Tree).' }
                ],
                correctOptionId: 'c',
                explanation: 'Aquest és el famós problema de LeetCode de "MinStack" . Mantenir una pila paral·lela que aliniada per dimensions guarda el mínim trobat FINS a aquell moment, permet consultar en O(1) i suportar pop en O(1) tirant pop a ambdues piles.'
            },
            {
                id: 'q2-2',
                question: 'Quin és el problema de dissenyar una Cua (Queue) en memòria usant simplement un tipus de dades genèric genèric com un `std::vector` (array dinàmic)?',
                options: [
                    { id: 'a', text: 'No hi ha problema, la STL actua convertint el vector en una cua directament a baix nivell.' },
                    { id: 'b', text: 'Fer .pop() (eliminar pel principi) en un array contigu requereix desplaçar tots els elements una posició (O(N)), fent ineficient l\'extracció.' },
                    { id: 'c', text: 'Els elements s\'emmagatzemen per referència, i per tant a l\'afegir una dada muta els altres.' },
                    { id: 'd', text: 'La complexitat de PushBack (inserir al darrere) passa temporalment a ser O(N^2).' }
                ],
                correctOptionId: 'b',
                explanation: 'Una Cua extrau pel davant i insereix pel darrere (FIFO). Si uses un vector per sota, l\'element "davant" és l\'índex 0. Per treure\'l, s\'han de desplaçar tots N elements. És per això que std::queue usa `std::deque` per sota (trossos no contigus i circulars), donant cost O(1).$$'
            },
            {
                id: 'q2-3',
                question: 'Tenim una funció recursiva extensa (a>100k crides). Llavors l\'aplicació es penja donant `Segfault (Core dumped)`. Quina estructura abstracta està implicada?',
                options: [
                    { id: 'a', text: 'Una cua FIFO asíncrona sobrecarregada.' },
                    { id: 'b', text: 'La Fragmentació de l\'Heap al realitzar moltes instanciacions dinàmiques consecutives amb "new".' },
                    { id: 'c', text: 'La Cola de missatges de Linux, on els IO/Sockets s\'han aturat temporalment.' },
                    { id: 'd', text: 'La Pila d\'execució (Call Stack), que pateix un Desbordament de Pila (Stack Overflow).' }
                ],
                correctOptionId: 'd',
                explanation: 'La recursivitat encesa massivament (sense cas base o gran profunditat) consumeix la "Pila Funcional/Callstack" limitada a pocs MBs per SO. Això causa literalment el teu clàssic Stack Overflow.'
            },
            {
                id: 'q2-4',
                question: 'Com implementaries una Cua (Queue) usant exclusivament dues Piles (Stacks)?',
                options: [
                    { id: 'a', text: 'No és possible, les piles són LIFO i les cues FIFO, els ordres són incompatibles.' },
                    { id: 'b', text: 'Inserint a la Pila A, i per extreure, passar-ho tot a la Pila B i treure el top de B. Això inverteix l\'ordre doblement.' },
                    { id: 'c', text: 'Alternant els Pushes entre la Pila A i la Pila B per equilibrar el pes.' },
                    { id: 'd', text: 'Usant la Pila A per guardar les dades i la Pila B per guardar els mínims.' }
                ],
                correctOptionId: 'b',
                explanation: 'AQUESTA ÉS LA PREGUNTA D\'ENTREVISTA PER EXCEL·LÈNCIA. El cost amortitzat és O(1). Passar elements d\'una pila a una altra inverteix l\'ordre: el que era l\'últim a entrar (LIFO) passa a ser el primer a sortir (FIFO). El "truc" és només moure dades de A a B quan B estigui buida.'
            },
            {
                id: 'q2-5',
                codeSnippet: 'stack<int> s; s.push(1); s.push(2); s.push(3); func(s); \nvoid func(stack<int> st) { st.pop(); }',
                question: 'Quin serà el valor de `s.top()` després d\'executar aquest codi?',
                options: [
                    { id: 'a', text: '2' },
                    { id: 'b', text: '3' },
                    { id: 'c', text: '1' },
                    { id: 'd', text: 'Error d\'execució perquè la pila s\'ha buidat.' }
                ],
                correctOptionId: 'b',
                explanation: 'Trrrrrampa! Fixa\'t en la capçalera de `func(stack<int> st)`. S\'està passant PER VALOR. S\'està creant una còpia sencera de la pila dins la funció. El pop només afecta la còpia. La pila original `s` roman intacta amb el 3 al top.'
            }
        ]
    },
    {
        topicId: 'pro2-tema-3', // Llistes i iteradors
        timeLimitSeconds: 720, // 12 mins
        questions: [
            {
                id: 'q3-1',
                question: 'Estàs iterant llista i decideixes fer un esborrat: \n`while(it != L.end()) { if(*it % 2 == 0) L.erase(it); ++it; }`\nPer què aquest codi provoca un error d\'execució massiu de Segmentació (Segfault)?',
                options: [
                    { id: 'a', text: 'El `++it` va dins l\'if i només l\'ha de moure quan *it sigui imparell.' },
                    { id: 'b', text: '`L.erase(it)` invalida l\'iterador corrent. Fer-li `++it` posteriorment referencia memòria morta (dangling pointer).' },
                    { id: 'c', text: 'L.end() al final no té un valor numèric definit retornant excepcions.' },
                    { id: 'd', text: 'No donarà cap error si usem c++11 o superior (std::list resol això de forma automàtica per compatibilitat).' }
                ],
                correctOptionId: 'b',
                explanation: 'L\'Erase allibera el node cap a l\'estratosfera, destruint `it`. Has der refer: `it = L.erase(it);` (Llegir sempre la següent ref vàlida retornada) o avançar a un iterador auxiliar just abans d\'esborrar.'
            },
            {
                id: 'q3-2',
                codeSnippet: 'void inserta_abans(list<int>& L, list<int>::iterator it, int val)',
                question: 'En C++, en quin cost computacional (Complexitat de Temps) l\'STL realitza un `insert` usant un iterador proporcionat, pel mig d\'una Llista Doblement Enllaçada?',
                options: [
                    { id: 'a', text: 'Θ(1) Temps limitat a crear el Node, reconduir el pair prev/next de l\'entorn, respectant Punter.' },
                    { id: 'b', text: 'O(N) Necessita iterar des del començament per re-cimentar el canvi numèric i estabilitzar la continuïtat.' },
                    { id: 'c', text: 'Θ(Log N) L\'algorisme usarà divideix i venceràs intern recollejant punters.' },
                    { id: 'd', text: 'Θ(1) Sempre, de la mateixa manera que Ho faria el vector.insert()' }
                ],
                correctOptionId: 'a',
                explanation: 'std::list de C++ és una Double-Linked List on la memòria va disjunta en trossos completament aleatoris. Si I JA TENS l\'iterador adreçat (on the spot), inserir abans es fa literalment redirigint 4 adreces fisiques en Constant Time O(1).'
            },
            {
                id: 'q3-3',
                question: 'Tens la capçalera (Node* head) d\'una LinkedList i vols detectar de forma super ràpida O(N) i constant de Memòria O(1) si conté un cicle (element apunta circularment endarrere):',
                options: [
                    { id: 'a', text: 'Afegir cada Node un HashSet o un set<Node*>, si l\'insert és denegat estem dins un cicle.' },
                    { id: 'b', text: 'Compilar l\'algoritme Dijkstra buscant els PathCosts positius i localitzar cicles d\'arestes.' },
                    { id: 'c', text: 'Usar "Floyd\'s Cycle Finding / Tortoise & Hare Algorythm": Dos punters iteren en paral·lel, u va +1 passes i el ràpid +2 passes cada bucle, si es solapen: Hi ha cicle.' },
                    { id: 'd', text: 'Modificant la matriu adjacent de Floyd-Warshall.' }
                ],
                correctOptionId: 'c',
                explanation: 'Algoritme "Llebre i tortuga". Un es mou a 2 nodes per pas i l\'ultre a 1. Si algun cop es toquen, matemàticament és perquè hi ha un "Llaç infinit" tancat. Memòria = O(1), màxim O(N) Iteracions.'
            },
            {
                id: 'q3-4',
                question: 'Què passa amb els iteradors d\'un std::vector quan fas un `push_back` que supera la seva `capacity` actual, comparat amb els iteradors d\'una std::list?',
                options: [
                    { id: 'a', text: 'En ambdós casos tots els iteradors existents segueixen sent vàlids.' },
                    { id: 'b', text: 'En el vector s\'invaliden tots perquè la memòria es reubica; en la llista es mantenen vàlids (exceptuant el que s\'esborraria).' },
                    { id: 'c', text: 'S\'invaliden només els iteradors que apunten al final de la llista.' },
                    { id: 'd', text: 'La llista no permet fer push_back si ja té iteradors actius.' }
                ],
                correctOptionId: 'b',
                explanation: 'El vector és un bloc contigu. Si creix i no hi ha espai, es mou TOT a una altra adreça de RAM, per tant els teus punters/iteradors antics apunten a "escombraries". La llista, al ser nodes dispersos, mai mou els nodes vells; només n\'afegeix de nous.'
            },
            {
                id: 'q3-5',
                question: 'Quin és el cost d\'accés aleatori (e.g. `L[500]`) en una `std::list` de 1000 elements?',
                options: [
                    { id: 'a', text: 'O(1) com en un array.' },
                    { id: 'b', text: 'O(log N) usant una cerca binària interna.' },
                    { id: 'c', text: 'O(N) ja que s\'ha de recórrer la cadena de punters node a node.' },
                    { id: 'd', text: 'La std::list no permet accés aleatori i donarà error de compilació.' }
                ],
                correctOptionId: 'c',
                explanation: 'L\'error típic és pensar que `std::list` és màgica. No té accés aleatori constant. De fet, en l\'STL, `std::list` ni tan sols té el `operator[]`. Has de fer `std::advance(it, 500)` que és O(N). Si necessites accés ràpid, usa `std::vector` o `std::deque`.'
            }
        ]
    }
];
