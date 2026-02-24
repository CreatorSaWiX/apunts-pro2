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
    convencions_cpp: {
        id: "convencions_cpp",
        files: {
            "main.cpp": `#include <iostream>
#include "Caixa.hh"
using namespace std;

int main() {
    Caixa c(10);
    
    c.afegir(5);
    
    cout << "Tenim: " << c.quantitat() << endl;
    
    // c.afegir(-3); // Descomentar faria petar l'assert
    return 0;
}`,
            "Caixa.hh": `#ifndef CAIXA_HH
#define CAIXA_HH

class Caixa {
    int valor_; // Convenció: membre privat porta '_' final.
    
public:
    Caixa(int valor_inicial);
    void afegir(int extra);
    
    // Mètode inline integrat:
    inline int quantitat() const {
        return valor_;
    }
};

#endif`,
            "Caixa.cpp": `#include "Caixa.hh"
#include <cassert>

// Usant la llista d'inicialitzadors (:)
Caixa::Caixa(int valor_inicial) : valor_(valor_inicial) {
    assert(valor_inicial >= 0);
}

void Caixa::afegir(int extra) {
    // Control de qualitat intern amb l'assert
    assert(extra >= 0); 
    valor_ += extra;
}`
        },
        generateSteps: () => {
            return [
                { activeFile: "main.cpp", line: 6, description: "Iniciem el programa. Creem un objecte Caixa anomenat 'c', passant el paràmetre 10.", terminalOutput: ["> Executant main.cpp..."], variables: {} },
                { activeFile: "Caixa.cpp", line: 5, description: "Entrem al constructor de Caixa! IMPORTANT: Gràcies a la llista d'inicialitzadors (el ':' després del mètode), la variable interna es col·loca i assigna immediatament a memòria sense ni tan sols tocar el cos de la funció.", terminalOutput: ["> Executant main.cpp..."], variables: { "valor_inicial": "10", "c.valor_": "10" } },
                { activeFile: "Caixa.cpp", line: 6, description: "Un cop el valor ja està preparat, obrim claus! Ara l'assert() revisa agressivament que l'ingrès fos superior a zero. Falla i cau si el número no fos correcte.", terminalOutput: ["> Executant main.cpp..."], variables: { "valor_inicial": "10", "c.valor_": "10" } },
                { activeFile: "Caixa.hh", line: 5, description: "El valor ha quedat gravat a 'valor_'. El guió baix no afecta el codi compilat, ens serveix psicològicament purament per detectar d'un esguard que estem mirant atributs privats de la classe intocables des de fora.", terminalOutput: ["> Executant main.cpp..."], variables: { "c.valor_": "10" } },
                { activeFile: "main.cpp", line: 8, description: "Tornem amb main, s'ha creat correctament sense cap 'crash'. Enviarem l'ordre de afegir 5!", terminalOutput: ["> Executant main.cpp..."], variables: { "c.valor_": "10" } },
                { activeFile: "Caixa.cpp", line: 11, description: "El paràmetre rebut (extra=5) travessa a la seguretat en sec. Ens hem lliurat de l'if-return. L'assert diu que procedim tranquils perque tot compleix les matemàtiques assumides!", terminalOutput: ["> Executant main.cpp..."], variables: { "c.valor_": "10", "extra": "5" } },
                { activeFile: "Caixa.cpp", line: 12, description: "S'efectua la modificació del valor central passant de tenir 10 a 15 de manera completament blindada.", terminalOutput: ["> Executant main.cpp..."], variables: { "c.valor_": "15" } },
                { activeFile: "main.cpp", line: 10, description: "Tornant novament, invocarem la consulta 'quantitat()' i imprimirem a la terminal per llegir. Ves a on es troba el mètode!", terminalOutput: ["> Executant main.cpp..."], variables: { "c.valor_": "15" } },
                { activeFile: "Caixa.hh", line: 12, description: "SORPRESA! El mètode quantitat està codificat literalment en l'interface de les capçaleres públiques .hh . Això es diu ser INLINE, un truc que incrustarà les instruccions en memòria sense gastar viatges de salt al mètode d'origen.", terminalOutput: ["> Executant main.cpp..."], variables: { "c.valor_": "15" } },
                { activeFile: "main.cpp", line: 10, description: "Aconseguim imprimir formalment el valor blindat i tancat del guió baix! Fi pràctic de les convencions C++.", terminalOutput: ["> Executant main.cpp...", "Tenim: 15"], variables: { "c.valor_": "15" } },
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
void amplada(BinTree<int> t) {
    if (t.empty()) return;
    queue<BinTree<int>> cua;
    cua.push(t);
    while (!cua.empty()) {
        BinTree<int> curr = cua.front(); 
        cua.pop();
        cout << curr.value() << " ";
        if (!curr.left().empty()) cua.push(curr.left());
        if (!curr.right().empty()) cua.push(curr.right());
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
                { activeFile: "main.cpp", line: 29, description: "Cridem a executar l'ordenació clàssica per Profunditat de temps recursiu descendent: Preordre DFS.", terminalOutput: ["> Executant main.cpp..."], variables: { "ArbreTotal": "  1  \\n / \\ \\n2   3" } },
                { activeFile: "main.cpp", line: 8, description: "L'arrel del top (1) no és Nul·la! L'escrivim la primera d'acord amb el protocol de lectura Arrel pre.", terminalOutput: ["> Executant main.cpp...", "Preorde: 1"], variables: { "t": "[1]" } },
                { activeFile: "main.cpp", line: 9, description: "ATENCIÓ: La Recursivitat frena en sec l'execució temporal dreta principal. Fa un salt cego absolut enviant cap avall NOMÉS el paquet de l'esquerra t.left() cap a una vida paral·lela de memòria d'arrel única on '1' o el dret queden pausats i morits de contacte de variables! ", terminalOutput: ["> Executant main.cpp...", "Preorde: 1"], variables: { "t": "[2]" } },
                { activeFile: "main.cpp", line: 7, description: "Dins la pròpia nova dimensió filla aïllada només formada de l'objecte tallat esquerre [2], no és nul, i el preordre demana imprimir-se ell ràpid primer abans the baixar.", terminalOutput: ["> Executant main.cpp...", "Preorde: 1 2"], variables: { "t": "[2]" } },
                { activeFile: "main.cpp", line: 9, description: "Torna a fallar, cridant l'esquerre d'ell mateix que ja sabem virtualment que val null/buit absolut en crear abans el constructor amb '2' simple. Això fa que 'empty' detecti l'error evitant crash retornant buit a la línia de vida general del segon pla on estavem i resola com acabada la ordre de baixar!", terminalOutput: ["> Executant main.cpp...", "Preorde: 1 2"], variables: { "t": "[2]" } },
                { activeFile: "main.cpp", line: 10, description: "Llavors processa a cridar igual forma recursiva tallada dret [buit mort]. Resol i la branca 2 tanca la vida paral·lela donant llum verda al gran Pare '1' amunt congelat de continuar executant el que li falto...!", terminalOutput: ["> Executant main.cpp...", "Preorde: 1 2"], variables: { "t": "[2]" } },
                { activeFile: "main.cpp", line: 10, description: "Tornem al cos viu! Ja varem visualitzar l'ordre esquerra general de la peli (1-2), crida tallant el recurs dret absolut baix al viatge paral·lel dretari del pare principal. (Ens dona una arrel on cau '3')", terminalOutput: ["> Executant main.cpp...", "Preorde: 1 2"], variables: { "t": "[3]" } },
                { activeFile: "main.cpp", line: 8, description: "Dimensió dreta on es compleix amb el seu imprimir 3 local", terminalOutput: ["> Executant main.cpp...", "Preorde: 1 2 3"], variables: { "t": "[3]" } },
                { activeFile: "main.cpp", line: 30, description: "Bucle Pre-Ordre totalment finalitzat amb retornats constants! Acabem d'imprimir tots els nodes recursivament profunds sense problemes, procedim amb l'extensió per a onades Cua [Amplada iterada de pis únic].", terminalOutput: ["> Executant main.cpp...", "Preorde: 1 2 3"], variables: { "ArbreTotal": "  1  \\n / \\ \\n2   3" } },
                { activeFile: "main.cpp", line: 17, description: "Fiquem l'Abre sencer gegant exclusivament a la cua de rebot general amagada on viuran les tasques constants BFS. (El pis inicial de formació, el pis '0')", terminalOutput: ["> Executant main.cpp...", "Preorde: 1 2 3"], variables: { "ArbreTotal": "  1  \\n / \\ \\n2   3", "cua": "->|[1]|->" } },
                { activeFile: "main.cpp", line: 19, description: "Al bucle, extraiem forçosament de la cua el primer 'arribat' (És l'arrel general). L'anomenem 'curr' com vol el professorat!", terminalOutput: ["> Executant main.cpp...", "Preorde: 1 2 3"], variables: { "curr": "[1]", "cua": "buit" } },
                { activeFile: "main.cpp", line: 20, description: "Escrivim al terra l'Element de l'onada que tenim central!", terminalOutput: ["> Executant main.cpp...", "Preorde: 1 2 3", "Amplada: 1"], variables: { "curr": "[1]", "cua": "buit" } },
                { activeFile: "main.cpp", line: 21, description: "I aquí la perfecció: Mirem de debò que no estiguin buits (-!empty-) abans de reobrir la Cua i llavors entrem el 2 i el 3 assegurant seguretat tècnica al sistema iteratiu.", terminalOutput: ["> Executant main.cpp...", "Preorde: 1 2 3", "Amplada: 1"], variables: { "curr": "[1]", "cua": "->|[3], [2]|->" } },
                { activeFile: "main.cpp", line: 18, description: "Seguiment segona i tercera tirada on es repeteix pas previ iterat, esborrant, imprimint '2' i '3' seguidament. Sense entrar cridades invàlides nul·les gràcies als condicionals curr.left(), acabem el projecte per sencer!", terminalOutput: ["> Executant main.cpp...", "Preorde: 1 2 3", "Amplada: 1 2 3", "Programa finalitzat amb codi 0."], variables: { "cua": "buit" } },
            ] as OOPStep[];
        }
    },
    projecte_sencer_oop: {
        id: "projecte_sencer_oop",
        files: {
            "Makefile": `CXX = g++
CXXFLAGS = -Wall -std=c++17

program: main.o
	$(CXX) -o program main.o

main.o: main.cc Capsa.hpp
	$(CXX) $(CXXFLAGS) -c main.cc`,
            "main.cc": `#include <iostream>
#include "Capsa.hpp"

using namespace std;

int main() {
    Capsa<int> c_entera(42);
    Capsa<string> c_text("Hola!");
    
    cout << c_entera.llegir() << endl;
    cout << c_text.llegir() << endl;
    
    return 0;
}`,
            "Capsa.hpp": `#ifndef CAPSA_HPP
#define CAPSA_HPP

template <class T>
class Capsa {
    T contingut_;
public:
    Capsa(T x) : contingut_(x) {}
    
    inline T llegir() const { 
        return contingut_; 
    }
};

#endif`
        },
        generateSteps: () => {
            return [
                { activeFile: "Makefile", line: 4, description: "Cridem a la terminal: '$ make'. El programa Makefile agafa el control per empaquetar tot aquest projecte de Múltiples Fitxers (Modular).", terminalOutput: ["> $ make"], variables: {} },
                { activeFile: "Makefile", line: 8, description: "Muntem i compilem el fitxer c++ (main.cc) sabent que inclou Capsa.hpp, respectant el dialecte C++17 preparant '.o'", terminalOutput: ["> $ make", "g++ -Wall -std=c++17 -c main.cc"], variables: {} },
                { activeFile: "Makefile", line: 5, description: "Finalment genera l'executable total unint tots els '.o' recollits. Codi font a punt per funcionar independent!", terminalOutput: ["> $ make", "g++ -Wall -std=c++17 -c main.cc", "g++ -o program main.o"], variables: {} },
                { activeFile: "main.cc", line: 6, description: "L'usuari executa el seu codi (./program) i la traça comença dins del int main()", terminalOutput: ["> ./program"], variables: {} },
                { activeFile: "main.cc", line: 7, description: "Creem un objecte abstracte tipus Capsa passant entre clàusules '< >' que aquesta variant de Capsa guardarà dades tipus int amb valor de 42.", terminalOutput: ["> ./program"], variables: { "c_entera": "buit" } },
                { activeFile: "Capsa.hpp", line: 8, description: "Entrem al constructor on gràcies a T=int, C++ sap que haurà de traduir tot això creant memòria per a Enters. Es crida l'assignació automàtica del colon ':'", terminalOutput: ["> ./program"], variables: { "x": "42", "c_entera.contingut_": "42" } },
                { activeFile: "main.cc", line: 8, description: "Al main, instanciem completament a la vegada una segona classe de tipus string. La Template T s'encarregarà per ell de crear exclusivament codi compilat per al 'hola'", terminalOutput: ["> ./program"], variables: { "c_text": "buit" } },
                { activeFile: "Capsa.hpp", line: 8, description: "Aquest segon pas constructor llegeix i rep T=string al ser cridat, col·locant al ': continugut_' les referències per caràcters passats.", terminalOutput: ["> ./program"], variables: { "x": "Hola!", "c_text.contingut_": "Hola!" } },
                { activeFile: "main.cc", line: 10, description: "Tornem! Les variables independents no competeixen per espai. Cridem al mètode d'extracció llegir() del primer contenidor.", terminalOutput: ["> ./program"], variables: {} },
                { activeFile: "Capsa.hpp", line: 10, description: "Com ha estat guardat l'atribut privat _, ho retornem fora de l'àmbit public utilitzant memòries de procés curtes Inline O(1).", terminalOutput: ["> ./program"], variables: {} },
                { activeFile: "main.cc", line: 11, description: "Rebem valor directament imprès. Llavors cridem analògicament i passem objectiu a la capsa número 2 de strings.", terminalOutput: ["> ./program", "42"], variables: {} },
                { activeFile: "Capsa.hpp", line: 10, description: "Com haviem forjat una capsa amb una paraula, llegir resol en mode text de paraula! Genericitat complida a C++.", terminalOutput: ["> ./program", "42"], variables: {} },
                { activeFile: "main.cc", line: 13, description: "Finalment, els canvis finalitzen programa donant imprès tant enter com text i buidant instàncies cridant Destructors.", terminalOutput: ["> ./program", "42", "Hola!", "> Programa finalitzat amb codi 0."], variables: {} }
            ] as OOPStep[];
        }
    },
    iteradors_reversos: {
        id: "iteradors_reversos",
        files: {
            "main.cpp": `#include <iostream>
#include <list>
using namespace std;

int main() {
    list<int> L = {10, 20, 30};
    
    // Malament: intent manual amb base normal
    auto it = L.end();
    it--; 
    
    // Bé: iteradors inversos (reverse_iterator)
    auto rit = L.rbegin();
    while (rit != L.rend()) {
        *rit += 5;
        rit++; // Avancem amb suma positiva (endarrere visual!)
    }
    
    return 0;
}`
        },
        generateSteps: () => {
            return [
                { activeFile: "main.cpp", line: 6, description: "Inicialitzem una llista d'enters senzilla [10, 20, 30]", terminalOutput: ["> Executant main.cpp..."], variables: { "L": " [10, 20, 30] " } },
                { activeFile: "main.cpp", line: 9, description: "L'esquema de pensar de tothom... si vull anar endarrere demano final: L.end(). (Compte, end és BUIT absolut de memòria fora de llista).", terminalOutput: ["> Executant main.cpp..."], variables: { "L": " [10, 20, 30] |X|", "*it": "BUIT LAL" } },
                { activeFile: "main.cpp", line: 10, description: "Retrocedim it-- per col·locar-nos just a l'últim existent. Quin horror per començar, no?", terminalOutput: ["> Executant main.cpp..."], variables: { "L": " [10, 20, 30] |X|", "*it": "30" } },
                { activeFile: "main.cpp", line: 13, description: "Oblidat-t'hen! C++ et regala un de millor. Declarem L.rbegin() com a Reverse Iterator. Fica el cap del tren recte orientat a l'inreves.", terminalOutput: ["> Executant main.cpp..."], variables: { "L": " (Invers) <-[30, 20, 10]", "*rit": "30" } },
                { activeFile: "main.cpp", line: 14, description: "Podem iterar netament com a l'exemple 1 comparant fins l'últim (creuat) rend()!", terminalOutput: ["> Executant main.cpp..."], variables: { "L": "<-[30, 20, 10]", "*rit": "30" } },
                { activeFile: "main.cpp", line: 15, description: "Desreferenciem sumant +5 a la referència posicional real [30+5 = 35]", terminalOutput: ["> Executant main.cpp..."], variables: { "L": "<-[35, 20, 10]", "*rit": "35" } },
                { activeFile: "main.cpp", line: 16, description: "I atenció, s'avança sumant! Demanar rit++ mou la fletxa en línia de la seva visió de conductor. Cap al 20 real.", terminalOutput: ["> Executant main.cpp..."], variables: { "L": "<-[35, 20, 10]", "*rit": "20" } },
                { activeFile: "main.cpp", line: 15, description: "Sumem el 5 sobre el 20 i seguim avançant (rit++).", terminalOutput: ["> Executant main.cpp..."], variables: { "L": "<-[35, 25, 10]", "*rit": "25" } },
                { activeFile: "main.cpp", line: 15, description: "Sumem el 5 sobre l'últim (de nom real index=0, però endavant de conductor).", terminalOutput: ["> Executant main.cpp..."], variables: { "L": "<-[35, 25, 15]", "*rit": "15" } },
                { activeFile: "main.cpp", line: 20, description: "La llista inversa xoca feliç contra el buit de rend() al final de la línia, acabant el while de forma super orgànica. L= 15, 25, 35 reals.", terminalOutput: ["> Executant main.cpp...", "> Programa finalitzat amb codi 0."], variables: {} },
            ] as OOPStep[];
        }
    }
}
