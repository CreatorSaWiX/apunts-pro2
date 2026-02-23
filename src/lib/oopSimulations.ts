export interface OOPStep {
    activeFile: string;
    line: number;
    description: string;
    terminalOutput: string[];
    variables: Record<string, string>;
}

export interface OOPSimulation {
    id: string;
    files: Record<string, string>;
    generateSteps: () => OOPStep[];
}

export const oopSimulations: Record<string, OOPSimulation> = {
    punt_basic: {
        id: "punt_basic",
        files: {
            "main.cpp": `#include <iostream>
#include "Punt.hpp"
using namespace std;

int main() {
    Punt p(1, 2);
    
    p.moure(3, 3);
    
    cout << "Coordenada X: " << p.get_x() << endl;
    return 0;
}`,
            "Punt.hpp": `class Punt {
    double x, y;
public:
    Punt(double a, double b);
    void moure(double dx, double dy);
    double get_x() const;
};`,
            "Punt.cpp": `#include "Punt.hpp"

Punt::Punt(double a, double b) {
    x = a; 
    y = b;
}

void Punt::moure(double dx, double dy) {
    x += dx; 
    y += dy;
}

double Punt::get_x() const {
    return x;
}`
        },
        generateSteps: () => {
            return [
                { activeFile: "main.cpp", line: 5, description: "Iniciem el programa al main. L'execució comença aquí.", terminalOutput: ["> Executant main.cpp..."], variables: {} },
                { activeFile: "main.cpp", line: 6, description: "Declaració de la variable p de tipus Punt. Això crida el constructor amb els valors 1, 2.", terminalOutput: ["> Executant main.cpp..."], variables: { "p": "Creant objecte (buit)" } },
                { activeFile: "Punt.cpp", line: 3, description: "Entrem al Punt.cpp: Som dins del constructor Punt::Punt. Rebem a=1, b=2.", terminalOutput: ["> Executant main.cpp..."], variables: { "p.x": "?", "p.y": "?", "a": "1", "b": "2" } },
                { activeFile: "Punt.cpp", line: 4, description: "Assignem el paràmetre 'a' (1) a l'atribut privat 'x' de l'objecte actual (this->x = 1).", terminalOutput: ["> Executant main.cpp..."], variables: { "p.x": "1", "p.y": "?", "a": "1", "b": "2" } },
                { activeFile: "Punt.cpp", line: 5, description: "Assignem el paràmetre 'b' (2) a l'atribut privat 'y' de l'objecte actual (this->y = 2).", terminalOutput: ["> Executant main.cpp..."], variables: { "p.x": "1", "p.y": "2" } },
                { activeFile: "main.cpp", line: 8, description: "Tornem al main. L'objecte p ja està completament inicialitzat a memòria.", terminalOutput: ["> Executant main.cpp..."], variables: { "p.x": "1", "p.y": "2" } },
                { activeFile: "main.cpp", line: 8, description: "Cridem el mètode moure() passant-hi 3 i 3. L'objecte 'p' es passa automàticament com a paràmetre implícit.", terminalOutput: ["> Executant main.cpp..."], variables: { "p.x": "1", "p.y": "2" } },
                { activeFile: "Punt.cpp", line: 9, description: "Entrem a Punt::moure. Canviem el valor de x sumant-li dx (1 + 3 = 4).", terminalOutput: ["> Executant main.cpp..."], variables: { "p.x": "4", "p.y": "2", "dx": "3", "dy": "3" } },
                { activeFile: "Punt.cpp", line: 10, description: "Canviem el valor de y sumant-li dy (2 + 3 = 5).", terminalOutput: ["> Executant main.cpp..."], variables: { "p.x": "4", "p.y": "5" } },
                { activeFile: "main.cpp", line: 10, description: "Tornem al main. Cridem el mètode get_x() per obtenir la coordenada X protegida.", terminalOutput: ["> Executant main.cpp..."], variables: { "p.x": "4", "p.y": "5" } },
                { activeFile: "Punt.cpp", line: 14, description: "La funció consultora llegeix l'atribut privat 'x' i en retorna el seu valor: 4.", terminalOutput: ["> Executant main.cpp..."], variables: { "p.x": "4", "p.y": "5" } },
                { activeFile: "main.cpp", line: 10, description: "S'imprimeix pel terminal el resultat de la consulta.", terminalOutput: ["> Executant main.cpp...", "Coordenada X: 4"], variables: { "p.x": "4", "p.y": "5" } },
                { activeFile: "main.cpp", line: 11, description: "Fi de l'execució. Es crida implícitament al destructor de p i la memòria de l'objecte s'allibera.", terminalOutput: ["> Executant main.cpp...", "Coordenada X: 4", "> Programa finalitzat amb codi 0."], variables: {} },
            ] as OOPStep[];
        }
    },
    pila_cpp: {
        id: "pila_cpp",
        files: {
            "main.cpp": `#include <iostream>
#include <stack>
using namespace std;

int main() {
    stack<int> S;
    
    S.push(10);
    S.push(20);
    S.push(30);
    
    int top = S.top();
    cout << "Cim actual: " << top << endl;
    
    S.pop();
    cout << "Nou cim: " << S.top() << endl;
    
    return 0;
}`
        },
        generateSteps: () => {
            return [
                { activeFile: "main.cpp", line: 5, description: "L'execució comença al main.", terminalOutput: ["> Executant main.cpp..."], variables: {} },
                { activeFile: "main.cpp", line: 6, description: "Creem una Pila d'enters buida (S). Acaba d'inicialitzar-se a memòria.", terminalOutput: ["> Executant main.cpp..."], variables: { "S": "[]", "S.size()": "0" } },
                { activeFile: "main.cpp", line: 8, description: "Cridem a push(10). L'element 10 s'arxiva a la base (cim).", terminalOutput: ["> Executant main.cpp..."], variables: { "S": "[10] <- dalt", "S.size()": "1" } },
                { activeFile: "main.cpp", line: 9, description: "Cridem a push(20). S'afegeix el 20 DALT del 10. LIFO ha entrat en acció.", terminalOutput: ["> Executant main.cpp..."], variables: { "S": "[10, 20] <- dalt", "S.size()": "2" } },
                { activeFile: "main.cpp", line: 10, description: "Cridem a push(30). S'afegeix un altre element per sobre de tots.", terminalOutput: ["> Executant main.cpp..."], variables: { "S": "[10, 20, 30] <- dalt", "S.size()": "3" } },
                { activeFile: "main.cpp", line: 12, description: "La funció top() consulta qui hi ha a dalt de tot de la pila sense extreure'l.", terminalOutput: ["> Executant main.cpp..."], variables: { "S": "[10, 20, 30] <- dalt", "top": "30" } },
                { activeFile: "main.cpp", line: 13, description: "Imprimim aquest valor consultat a la terminal.", terminalOutput: ["> Executant main.cpp...", "Cim actual: 30"], variables: { "S": "[10, 20, 30] <- dalt", "top": "30" } },
                { activeFile: "main.cpp", line: 15, description: "La funció pop() extreu (elimina) exclusivament l'últim que va entrar (el de dalt). El 30 desapareix.", terminalOutput: ["> Executant main.cpp...", "Cim actual: 30"], variables: { "S": "[10, 20] <- dalt", "top": "30" } },
                { activeFile: "main.cpp", line: 16, description: "Ara fem un top() directe a la impressió. Qui està dalt de tot ara? El 20.", terminalOutput: ["> Executant main.cpp...", "Cim actual: 30", "Nou cim: 20"], variables: { "S": "[10, 20] <- dalt", "top": "30" } },
                { activeFile: "main.cpp", line: 18, description: "Fi de l'execució. Es crida automàticament al destructor de S i la memòria de l'objecte s'esborra.", terminalOutput: ["> Executant main.cpp...", "Cim actual: 30", "Nou cim: 20", "> Programa finalitzat amb codi 0."], variables: {} },
            ] as OOPStep[];
        }
    },
    cua_cpp: {
        id: "cua_cpp",
        files: {
            "main.cpp": `#include <iostream>
#include <queue>
using namespace std;

int main() {
    queue<int> Q;
    
    Q.push(10);
    Q.push(20);
    Q.push(30);
    
    int processar = Q.front();
    cout << "Atenent al primer: " << processar << endl;
    
    Q.pop();
    cout << "Següent del torn: " << Q.front() << endl;
    
    return 0;
}`
        },
        generateSteps: () => {
            return [
                { activeFile: "main.cpp", line: 5, description: "Comencem el curs del programa main().", terminalOutput: ["> Executant main.cpp..."], variables: {} },
                { activeFile: "main.cpp", line: 6, description: "Creem una Cua d'enters (Q) inicialitzada buida. S'utilitza FIFO.", terminalOutput: ["> Executant main.cpp..."], variables: { "Q": "[]", "Q.size()": "0" } },
                { activeFile: "main.cpp", line: 8, description: "push() encua un valor al final (push_back interne). El 10 és el primer a la fila.", terminalOutput: ["> Executant main.cpp..."], variables: { "Q": "[10]", "Q.size()": "1" } },
                { activeFile: "main.cpp", line: 9, description: "push(20) es col·loca just a la línia DARRERE del 10.", terminalOutput: ["> Executant main.cpp..."], variables: { "Q": "dav[10, 20]dar", "Q.size()": "2" } },
                { activeFile: "main.cpp", line: 10, description: "push(30) es posa a la darrera posició del darrere.", terminalOutput: ["> Executant main.cpp..."], variables: { "Q": "dav[10, 20, 30]dar", "Q.size()": "3" } },
                { activeFile: "main.cpp", line: 12, description: "Consultem qui està primer a la cua ('front'). En cap moment treiem ningú.", terminalOutput: ["> Executant main.cpp..."], variables: { "Q": "dav[10, 20, 30]dar", "processar": "10" } },
                { activeFile: "main.cpp", line: 13, description: "Simulació d'atenció per terminal d'aquest element inicial.", terminalOutput: ["> Executant main.cpp...", "Atenent al primer: 10"], variables: { "Q": "dav[10, 20, 30]dar", "processar": "10" } },
                { activeFile: "main.cpp", line: 15, description: "La funció pop() esborra EXCLUSIVAMENT el qui està primer a la vora de dalt (esquerra). El 10 marxa.", terminalOutput: ["> Executant main.cpp...", "Atenent al primer: 10"], variables: { "Q": "dav[20, 30]dar", "processar": "10" } },
                { activeFile: "main.cpp", line: 16, description: "L'índex front s'ha reassignat. El 20 ara ocupa el lideratge.", terminalOutput: ["> Executant main.cpp...", "Atenent al primer: 10", "Següent del torn: 20"], variables: { "Q": "dav[20, 30]dar", "processar": "10" } },
                { activeFile: "main.cpp", line: 18, description: "Fi de l'execució. Es crida automàticament al destructor de Q iterant tots els elements residuals.", terminalOutput: ["> Executant main.cpp...", "Atenent al primer: 10", "Següent del torn: 20", "> Programa finalitzat amb codi 0."], variables: {} },
            ] as OOPStep[];
        }
    },
    llista_iteradors: {
        id: "llista_iteradors",
        files: {
            "main.cpp": `#include <iostream>
#include <list>
using namespace std;

int main() {
    list<int> L = {10, 30};
    
    auto it = L.begin();
    
    it++;
    it = L.insert(it, 20);
    
    it = L.begin();
    while (it != L.end()) {
        if (*it == 10) {
            it = L.erase(it);
        } else {
            it++;
        }
    }
    
    return 0;
}`
        },
        generateSteps: () => {
            return [
                { activeFile: "main.cpp", line: 5, description: "L'execució comença al main. Veurem com funcionen les Llistes i els Iteradors en un exemple real.", terminalOutput: ["> Executant main.cpp..."], variables: {} },
                { activeFile: "main.cpp", line: 6, description: "S'inicialitza la Llista amb els elements 10 i 30. No tenen certesa de memòria contigua com a vector, sinó que cada baula enllaçada assenyala a l'altra des de localitzacions disperses.", terminalOutput: ["> Executant main.cpp..."], variables: { "L": "[10] <-> [30]" } },
                { activeFile: "main.cpp", line: 8, description: "Es crea la referència intel·ligent o marcador (it) i s'assigna com a posició a L.begin() (es situa sobre el primer lloc existent avaluable).", terminalOutput: ["> Executant main.cpp..."], variables: { "L": "[10] <-> [30]", "*it": "10" } },
                { activeFile: "main.cpp", line: 10, description: "S'avança aquest marcador de referència un pas en endavant amb it++. Canvia sense reestructuracions de targeta al valor de 30.", terminalOutput: ["> Executant main.cpp..."], variables: { "L": "[10] <-> [30]", "*it": "30" } },
                { activeFile: "main.cpp", line: 11, description: "Gràcies al benefici i rapidesa de les llistes O(1), no desplacem la memòria quan introduïm (insert). Es reobre pel mig un nou integrant de valor 20 JUST ABANS de l'iterador.", terminalOutput: ["> Executant main.cpp..."], variables: { "L": "[10] <-> [20] <-> [30]", "*it": "30" } },
                { activeFile: "main.cpp", line: 11, description: "El valor nou retingut dins el pas insert es retorna explícitament i assignat on ara nosaltres el reciclem al mateix 'it'", terminalOutput: ["> Executant main.cpp..."], variables: { "L": "[10] <-> [20] <-> [30]", "*it": "20" } },
                { activeFile: "main.cpp", line: 13, description: "Reajustem 'it' al lloc de partida primerenc a L.begin() perquè ho puguem revisar tot.", terminalOutput: ["> Executant main.cpp..."], variables: { "L": "[10] <-> [20] <-> [30]", "*it": "10" } },
                { activeFile: "main.cpp", line: 14, description: "Entrem al bucle. Verificació d'iteració: 'it' no ha arribat i igualat virtualment i fosca darrere de l'índex final L.end().", terminalOutput: ["> Executant main.cpp..."], variables: { "L": "[10] <-> [20] <-> [30]", "*it": "10", "it!=L.end()": "true" } },
                { activeFile: "main.cpp", line: 15, description: "El valor en '*it' actual és 10, de manera que executem L.erase(it) de darrere en el sentit.", terminalOutput: ["> Executant main.cpp..."], variables: { "L": "[10] <-> [20] <-> [30]", "*it": "10", "it!=L.end()": "true" } },
                { activeFile: "main.cpp", line: 16, description: "ATENCIÓ (Gotcha de memòria)! El 10 desapareix d'internet completament mort! Era indispensable per no perdre'ns referenciar el paràmetre caigut on es destrueixa. it = L.erase l'ha reposat correctament cap al posterior present (20).", terminalOutput: ["> Executant main.cpp..."], variables: { "L": "[20] <-> [30]", "*it": "20", "it!=L.end()": "true" } },
                { activeFile: "main.cpp", line: 14, description: "Avaluem d'incògnita de nou el cas de control. Encara tenim marge.", terminalOutput: ["> Executant main.cpp..."], variables: { "L": "[20] <-> [30]", "*it": "20", "it!=L.end()": "true" } },
                { activeFile: "main.cpp", line: 18, description: "Com no equival (*it == 10), anem per false al canal else augmentador natural de passes.", terminalOutput: ["> Executant main.cpp..."], variables: { "L": "[20] <-> [30]", "*it": "20", "it!=L.end()": "true" } },
                { activeFile: "main.cpp", line: 14, description: "Bucle final on queda l'element 30 posat de cara.", terminalOutput: ["> Executant main.cpp..."], variables: { "L": "[20] <-> [30]", "*it": "30", "it!=L.end()": "true" } },
                { activeFile: "main.cpp", line: 18, description: "Avançem l'iterador una última i cega vegada perquè ja no entra dins l'else del false per no ser un 10 constant.", terminalOutput: ["> Executant main.cpp..."], variables: { "L": "[20] <-> [30]", "*it": "L.end()", "it!=L.end()": "false" } },
                { activeFile: "main.cpp", line: 14, description: "Aquí és quan col·lapsa segur de forma sana! 'it' i l'hipotètic post-final buit de L.end() es fonen igualats al costat, acabant tota sentència del bucle i tancant amb false l'it!=L.end() de seqüència general.", terminalOutput: ["> Executant main.cpp..."], variables: { "L": "[20] <-> [30]", "*it": "L.end()", "it!=L.end()": "false" } },
                { activeFile: "main.cpp", line: 22, description: "Aquest format ho ensenya tot de lluny de ser un array clàssic. El propi destruïdor encarregat esborra totes les baules presents sol gràcies als valors automàtics de C++ en clausurar el cos del programa.", terminalOutput: ["> Executant main.cpp...", "> Programa finalitzat amb codi 0."], variables: {} },
            ] as OOPStep[];
        }
    },
    arbre_bintree_immersio: {
        id: "arbre_bintree_immersio",
        files: {
            "main.cpp": `#include <iostream>
#include <queue>
#include "bintree.hh"
using namespace std;
// Imprimim (Pre-Ordre Arrel, Esquerre, Dret) per profunditat sense cua
void preordre(const BinTree<int>& t) {
    if (!t.empty()) {
        cout << t.value() << " ";
        preordre(t.left());
        preordre(t.right());
    }
}
// L'Amplada per Onades sense baixar infinit! Tema 2 a l'atac BFS
void amplada(const BinTree<int>& t) {
    queue<BinTree<int>> cua;
    cua.push(t);
    while (!cua.empty()) {
        BinTree<int> c = cua.front(); cua.pop();
        if (!c.empty()) {
            cout << c.value() << " ";
            cua.push(c.left());
            cua.push(c.right());
        }
    }
}
int main() {
    BinTree<int> fulla_Esq(2);
    BinTree<int> fulla_Der(3);
    BinTree<int> ArbreTotal(1, fulla_Esq, fulla_Der);
    cout << "Preorde: "; preordre(ArbreTotal);
    cout << "\\nAmplada: "; amplada(ArbreTotal);
    return 0;
}`
        },
        generateSteps: () => {
            return [
                { activeFile: "main.cpp", line: 26, description: "Inicia el constructor general creant fulles aïllades en els diferents espais buits on després hauran de dependre. Creem la filla Num. 2", terminalOutput: ["> Executant main.cpp..."], variables: {} },
                { activeFile: "main.cpp", line: 28, description: "Les agrupem dins l'autèntic arbre general, ell es crea a una instància Pare de Num. 1 i agafa com d'extrems els altres 2 lligats", terminalOutput: ["> Executant main.cpp..."], variables: { "ArbreTotal": "  1  \\n / \\ \\n2   3" } },
                { activeFile: "main.cpp", line: 29, description: "Llamem a executar l'ordenació clàssica per Profunditat de temps recursiu descendent: Preordre DFS.", terminalOutput: ["> Executant main.cpp..."], variables: { "ArbreTotal": "  1  \\n / \\ \\n2   3" } },
                { activeFile: "main.cpp", line: 8, description: "L'arrel del top (1) no és Nul·la! L'escrivim la primera d'acord amb el protocol de lectura Arrel pre.", terminalOutput: ["> Executant main.cpp...", "Preorde: 1"], variables: { "t": "[1]" } },
                { activeFile: "main.cpp", line: 9, description: "ATENCIÓ: La Recursivitat frena en sec l'execució temporal dreta principal. Fa un salt cego absolut enviant cap avall NOMÉS el paquet de l'esquerra t.left() cap a una vida paral·lela de memòria d'arrel única on '1' o el dret queden pausats i morits de contacte de variables! ", terminalOutput: ["> Executant main.cpp...", "Preorde: 1"], variables: { "t": "[2]" } },
                { activeFile: "main.cpp", line: 8, description: "Dins la pròpia nova dimensió filla aïllada només formada de l'objecte tallat esquerre [2], no és nul, i el preordre demana imprimir-se ell ràpid primer abans the baixar.", terminalOutput: ["> Executant main.cpp...", "Preorde: 1 2"], variables: { "t": "[2]" } },
                { activeFile: "main.cpp", line: 9, description: "Torna a fallar, cridant l'esquerre d'ell mateix que ja sabem virtualment que val null/buit absolut en crear abans el constructor amb '2' simple. Això fa que 'empty' detecti l'error evitant crash retornant buit a la línia de vida general del segon pla on estavem i resola com acabada la ordre de baixar!", terminalOutput: ["> Executant main.cpp...", "Preorde: 1 2"], variables: { "t": "[2]" } },
                { activeFile: "main.cpp", line: 10, description: "Llavors processa a cridar igual forma recursiva tallada dret [buit mort]. Resol i la branca 2 tanca la vida paral·lela donant llum verda al gran Pare '1' amunt congelat de continuar executant el que li falto...!", terminalOutput: ["> Executant main.cpp...", "Preorde: 1 2"], variables: { "t": "[2]" } },
                { activeFile: "main.cpp", line: 10, description: "Tornem al cos viu! Ja varem visualitzar l'ordre esquerra general de la peli (1-2), crida tallant el recurs dret absolut baix al viatge paral·lel dretari del pare principal. (Ens dona una arrel on cau '3')", terminalOutput: ["> Executant main.cpp...", "Preorde: 1 2"], variables: { "t": "[3]" } },
                { activeFile: "main.cpp", line: 8, description: "Dimensió dreta on es compleix amb el seu imprimir 3 local", terminalOutput: ["> Executant main.cpp...", "Preorde: 1 2 3"], variables: { "t": "[3]" } },
                { activeFile: "main.cpp", line: 30, description: "Bucle Pre-Ordre totalment finalitzat amb retornats constants! Acabem d'imprimir tots els nodes recursivament profunds sense problemes, procedim amb l'extensió per a onades Cua [Amplada iterada de pis únic].", terminalOutput: ["> Executant main.cpp...", "Preorde: 1 2 3"], variables: { "ArbreTotal": "  1  \\n / \\ \\n2   3" } },
                { activeFile: "main.cpp", line: 16, description: "Fiquem l'Abre sencer gegant exclusivament a la cua de rebot general amagada on viuran les tasques constants BFS. (El pis inicial de formació, el pis '0')", terminalOutput: ["> Executant main.cpp...", "Preorde: 1 2 3"], variables: { "ArbreTotal": "  1  \\n / \\ \\n2   3", "cua": "->|[1]|->" } },
                { activeFile: "main.cpp", line: 18, description: "Al bucle, extraiem forçosament literal de la instància Cua el primer 'arribat' de cap (És l'arrel general). Analitzarem només d'ell.", terminalOutput: ["> Executant main.cpp...", "Preorde: 1 2 3"], variables: { "c": "[1]", "cua": "buit" } },
                { activeFile: "main.cpp", line: 20, description: "Escrivim al terra l'Element Central. Com nosaltres no podem saltar baixant per sempre com l'altra fòrmula per trobar les onades: Invoquem la posició deixant-les apuntades segures de futur darrere la cua esperant el torn darrere meu amb respecte a ordre FIFO temporal!", terminalOutput: ["> Executant main.cpp...", "Preorde: 1 2 3", "Amplada: 1"], variables: { "c": "[1]", "cua": "buit" } },
                { activeFile: "main.cpp", line: 21, description: "Fiquem l'estància Esquerra retallada [2] i darrere directament l'estància de la dreta [3] al fons de la Cua i completem bucle iterat i deixem oblidat per sempre ja la base esborrada '1'. En aquest moment concret, si mires la Cua virtual per fi ja tenim recarregats per ordre literal tota la línia horitzontal i única col·lectiva separada del pis de sota! Tècnica Cua perfecte.", terminalOutput: ["> Executant main.cpp...", "Preorde: 1 2 3", "Amplada: 1"], variables: { "c": "[1]", "cua": "->|[3], [2]|->" } },
                { activeFile: "main.cpp", line: 18, description: "Seguiment segona i tercera tirada on es repeteix pas previ iterat, esborrant, imprimint '2' i '3' seguidament. Es tracta d'imprimir natural sense tornar cridar fons amunt com un boig perdent recursos.", terminalOutput: ["> Executant main.cpp...", "Preorde: 1 2 3", "Amplada: 1 2 3", "Programa finalitzat amb codi 0."], variables: { "cua": "buit" } },
            ] as OOPStep[];
        }
    }
}
