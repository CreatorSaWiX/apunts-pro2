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
                { activeFile: "main.cpp", line: 6, description: "Declaració de la variable p de tipus Punt. Això crida el constructor amb els valors 1, 2.", terminalOutput: ["> Executant main.cpp..."], variables: { "p": "Punt {x: -858993460, y: -858993460}" } },
                { activeFile: "Punt.cpp", line: 3, description: "Entrem al Punt.cpp: Som dins del constructor Punt::Punt. Rebem a=1, b=2.", terminalOutput: ["> Executant main.cpp..."], variables: { "p": "Punt {x: -858993460, y: -858993460}", "a": "1", "b": "2", "this": "0x7fffffffe410" } },
                { activeFile: "Punt.cpp", line: 4, description: "Assignem el paràmetre 'a' (1) a l'atribut privat 'x' de l'objecte actual (this->x = 1).", terminalOutput: ["> Executant main.cpp..."], variables: { "p": "Punt {x: 1, y: -858993460}", "a": "1", "b": "2", "this": "0x7fffffffe410" } },
                { activeFile: "Punt.cpp", line: 5, description: "Assignem el paràmetre 'b' (2) a l'atribut privat 'y' de l'objecte actual (this->y = 2).", terminalOutput: ["> Executant main.cpp..."], variables: { "p": "Punt {x: 1, y: 2}", "a": "1", "b": "2", "this": "0x7fffffffe410" } },
                { activeFile: "main.cpp", line: 6, description: "Tornem al main. L'objecte p ja està completament inicialitzat a memòria.", terminalOutput: ["> Executant main.cpp..."], variables: { "p": "Punt {x: 1, y: 2}" } },
                { activeFile: "main.cpp", line: 8, description: "Cridem el mètode moure() passant-hi 3 i 3. L'objecte 'p' es passa automàticament com a paràmetre implícit.", terminalOutput: ["> Executant main.cpp..."], variables: { "p": "Punt {x: 1, y: 2}" } },
                { activeFile: "Punt.cpp", line: 9, description: "Entrem a Punt::moure. Canviem el valor de x sumant-li dx (1 + 3 = 4).", terminalOutput: ["> Executant main.cpp..."], variables: { "p": "Punt {x: 4, y: 2}", "dx": "3", "dy": "3", "this": "0x7fffffffe410" } },
                { activeFile: "Punt.cpp", line: 10, description: "Canviem el valor de y sumant-li dy (2 + 3 = 5).", terminalOutput: ["> Executant main.cpp..."], variables: { "p": "Punt {x: 4, y: 5}", "dx": "3", "dy": "3", "this": "0x7fffffffe410" } },
                { activeFile: "main.cpp", line: 10, description: "Tornem al main. Cridem el mètode get_x() per obtenir la coordenada X protegida.", terminalOutput: ["> Executant main.cpp..."], variables: { "p": "Punt {x: 4, y: 5}" } },
                { activeFile: "Punt.cpp", line: 14, description: "La funció consultora llegeix l'atribut privat 'x' i en retorna el seu valor: 4.", terminalOutput: ["> Executant main.cpp..."], variables: { "p": "Punt {x: 4, y: 5}", "this": "0x7fffffffe410" } },
                { activeFile: "main.cpp", line: 10, description: "S'imprimeix pel terminal el resultat de la consulta.", terminalOutput: ["> Executant main.cpp...", "Coordenada X: 4"], variables: { "p": "Punt {x: 4, y: 5}" } },
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

void netejar_llista(list<int>& L) {
    auto it = L.begin();
    
    while (it != L.end()) {
        if (*it == 10) {
            it = L.erase(it); 
        } 
        else if (*it == -1) {
            it = L.insert(it, 0); 
            advance(it, 2); 
        } 
        else {
            it++;
        }
    }
}

int main() {
    list<int> L = {10, -1, 30};
    netejar_llista(L);
    return 0;
}`
        },
        generateSteps: () => {
            return [
                { activeFile: "main.cpp", line: 22, description: "Declaració inicial. Instanciem una llista d'enters genèrica amb tres elements naturals.", terminalOutput: ["> Compilant binari..."], variables: {} },
                { activeFile: "main.cpp", line: 23, description: "S'alloca a memòria la Llista amb '[10] <-> [-1] <-> [30]'. A deferència d'un std::vector, aquests allotjaments romanen en la memòria de forma esparsa.", terminalOutput: ["> Assignació de nodes"], variables: { "L": "[10] <-> [-1] <-> [30]" } },
                { activeFile: "main.cpp", line: 24, description: "Procedim a invocar la funció 'netejar_llista(L)' passant la referència ampersand de memòria base que manté en poder la L global.", terminalOutput: ["> Execució: netejar_llista(L)"], variables: { "L": "[10] <-> [-1] <-> [30]" } },
                { activeFile: "main.cpp", line: 6, description: "S'inicia sobre el paràmetre un 'wrapper' referencial (l'Iterador) ancorat directament a la direcció física resolta del primer node existencial, originat mitjançant 'begin()'.", terminalOutput: ["> Adreça base obtinguda"], variables: { "L": "[10] <-> [-1] <-> [30]", "it": "-> 10 (0x7ffe10)" } },
                { activeFile: "main.cpp", line: 8, description: "Procedim a escanejar la instància fins a rebotar frontalment contra l'abisme virtual 'L.end()'.", terminalOutput: ["> Comprovant it != end()"], variables: { "L": "[10] <-> [-1] <-> [30]", "it": "-> 10 (0x7ffe10)" } },
                { activeFile: "main.cpp", line: 9, description: "Primera desreferenciació (*it). Traiem per avaluació condicional el '10' allotjat directament dins la memòria referenciada.", terminalOutput: ["> Validació (*it == 10) : TRUE"], variables: { "L": "[10] <-> [-1] <-> [30]", "it": "-> 10 (0x7ffe10)" } },
                { activeFile: "main.cpp", line: 10, description: "PERILL d'Enginyeria: Invocar L.erase(it) allibera el node fïsic sencer [10] de l'Heap. L'iterador 'it' esdevindria un Punter Penjant corromput. Com ho resolem? C++ exigeix el re-assignament: 'it = L.erase(it)' que ens retorna matemàticament la referència al node adjacent pur posterior (-1) com a rescat.", terminalOutput: ["> Destruït: 0x7ffe10", "> Retornat Succesor:"], variables: { "L": "[-1] <-> [30]", "it": "-> -1 (0x7ffe2C)" } },
                { activeFile: "main.cpp", line: 8, description: "Bucle en fase de re-evaluació. El punter reactivat sobre (-1) demostra legitimitat i marge referencial davant del L.end() final.", terminalOutput: ["> Comprovant it != end()"], variables: { "L": "[-1] <-> [30]", "it": "-> -1 (0x7ffe2C)" } },
                { activeFile: "main.cpp", line: 9, description: "La comprovació actual es denega (el valor referit en target és -1). Saltem la clàusula inicial if condicional.", terminalOutput: ["> Validació (*it == 10) : FALSE"], variables: { "L": "[-1] <-> [30]", "it": "-> -1 (0x7ffe2C)" } },
                { activeFile: "main.cpp", line: 12, description: "S'avalua com a cert que l'adreça activa conté el negatiu enter establert (-1). Intervenim la xarxa estructural.", terminalOutput: ["> Validació (*it == -1) : TRUE"], variables: { "L": "[-1] <-> [30]", "it": "-> -1 (0x7ffe2C)" } },
                { activeFile: "main.cpp", line: 13, description: "Instruccions de L.insert() en operacions lineals O(1). Es construeix la inserció d'un [0] absolutament ABANS del nostre node objectiu. Una vegada més, capturem l'adreça d'aquest 0 retingut tornant a assignar-hi 'it'.", terminalOutput: ["> Inserted node: 0"], variables: { "L": "[0] <-> [-1] <-> [30]", "it": "-> 0 (0x7ffe3D)" } },
                { activeFile: "main.cpp", line: 14, description: "ATENCIÓ Crítica: Si reiniciessim ara bucle sobre [0], a la pròxima volta l'ordinador avançaria it++, tornaria a llegir [-1] i injectaria un altre zero infinitament! Executem un robust salt doble pur std::advance(it, 2) esquivant per complet [0] i [-1].", terminalOutput: ["> advance(it, 2) executada"], variables: { "L": "[0] <-> [-1] <-> [30]", "it": "-> 30 (0x7ffe4F)" } },
                { activeFile: "main.cpp", line: 8, description: "Tercera fase condicional avaluada cert, el punter sà roman sobre l'última entitat natural: el [30].", terminalOutput: ["> Comprovant it != end()"], variables: { "L": "[0] <-> [-1] <-> [30]", "it": "-> 30 (0x7ffe4F)" } },
                { activeFile: "main.cpp", line: 9, description: "El node contingut 30 decau per qualsevol procés d'extracció.", terminalOutput: ["> Validació (*it == 10) : FALSE"], variables: { "L": "[0] <-> [-1] <-> [30]", "it": "-> 30 (0x7ffe4F)" } },
                { activeFile: "main.cpp", line: 12, description: "En denegar cap propietat en sentència if, decau en l'esglaó final iteratiu corrent.", terminalOutput: ["> Validació (*it == -1) : FALSE"], variables: { "L": "[0] <-> [-1] <-> [30]", "it": "-> 30 (0x7ffe4F)" } },
                { activeFile: "main.cpp", line: 17, description: "La sentència else tanca purament atorgant l'incrent ordinal directe ++. Resseguint el 'next' des de [30], C++ traslada la boia d'arrel cap a terreny indefinit (0xNULL / L.end() target).", terminalOutput: ["> ++ Adreça nul·la generada"], variables: { "L": "[0] <-> [-1] <-> [30]", "it": "-> L.end() (0xNULL)" } },
                { activeFile: "main.cpp", line: 8, description: "Condició d'acabament resolta: Igualat oficial contra la fosca asimptòtica d'it != L.end() (Tanca seqüència de control com a Fal·laç).", terminalOutput: ["> False iteratiu resolt"], variables: { "L": "[0] <-> [-1] <-> [30]", "it": "-> L.end() (0xNULL)" } },
                { activeFile: "main.cpp", line: 25, description: "Programa Main finalitzant amb codi pur. De nou, un netejador destructiu d'scope global procedirà a enderrocar la desordenada dispersió O(n) lliurement deixant res més que cendra i bones llistes als apunts.", terminalOutput: ["> Sortida processador completada", "> Programa finalitzat amb codi 0."], variables: {} },
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

program: main.o Punt.o
	$(CXX) -o program main.o Punt.o

main.o: main.cc Punt.hpp
	$(CXX) $(CXXFLAGS) -c main.cc
	
Punt.o: Punt.cpp Punt.hpp
	$(CXX) $(CXXFLAGS) -c Punt.cpp`,
            "main.cc": `#include <iostream>
#include "Punt.hpp"
using namespace std;

int main() {
    Punt p1(1, 2);
    Punt p2(5, 5);
    
    p1.moure(2, 2);
    
    cout << "X de p1: " << p1.get_x() << endl;
    cout << "Punts creats: " << Punt::quants_punts() << endl;
    
    return 0;
}`,
            "Punt.hpp": `#ifndef PUNT_HPP
#define PUNT_HPP

class Punt {
    double x, y;
    static int comptador; // Compartit per tots els Punts
public:
    Punt(double a, double b);
    void moure(double dx, double dy);
    
    inline double get_x() const { 
        // inline estalvia la crida de funció
        return x; 
    }
    
    static int quants_punts();
};
#endif`,
            "Punt.cpp": `#include "Punt.hpp"

// Inicialitzem l'atribut static
int Punt::comptador = 0;

Punt::Punt(double a, double b) {
    this->x = a; 
    this->y = b;
    comptador++;
}

void Punt::moure(double dx, double dy) {
    // Utilitzem 'this->' explícitament (paràmetre implícit)
    this->x += dx; 
    this->y += dy;
}

int Punt::quants_punts() {
    return comptador; // Accés a variable static
}`
        },
        generateSteps: () => {
            return [
                { activeFile: "Makefile", line: 4, description: "Executem '$ make' a la terminal. El Makefile automatitzarà la compilació dels múltiples fitxers (Modular).", terminalOutput: ["> $ make"], variables: {} },
                { activeFile: "Makefile", line: 11, description: "Primer compila 'Punt.cpp' per generar 'Punt.o' aplicant els flags de C++17.", terminalOutput: ["> $ make", "g++ -Wall -std=c++17 -c Punt.cpp"], variables: {} },
                { activeFile: "Makefile", line: 8, description: "Després compila 'main.cc' per generar 'main.o'.", terminalOutput: ["> $ make", "g++ -Wall -std=c++17 -c Punt.cpp", "g++ -Wall -std=c++17 -c main.cc"], variables: {} },
                { activeFile: "Makefile", line: 5, description: "Finalment, enllaça (links) els dos fitxers '.o' per produir l'executable 'program'.", terminalOutput: ["> $ make", "g++ -Wall -std=c++17 -c Punt.cpp", "g++ -Wall -std=c++17 -c main.cc", "g++ -o program main.o Punt.o"], variables: {} },
                { activeFile: "main.cc", line: 6, description: "L'usuari executa el seu codi (./program) i l'execució entra al main. L'atribut static 'comptador' ja val 0 des del principi.", terminalOutput: ["> ./program"], variables: { "Punt::comptador": "0" } },
                { activeFile: "main.cc", line: 6, description: "Es declararà i emmagatzemarà la instància p1. Això saltarà al constructor de Punt.", terminalOutput: ["> ./program"], variables: { "Punt::comptador": "0", "p1": "Punt {x: -858993460, y: -858993460}" } },
                { activeFile: "Punt.cpp", line: 6, description: "Ens trobem a dintre del constructor. Gràcies a què sabem sobre qui cridem aquest constructor, 'this' apunta la memòria de l'objecte original p1 automàticament.", terminalOutput: ["> ./program"], variables: { "Punt::comptador": "0", "p1": "Punt {x: -858993460, y: -858993460}", "this": "0x7ffe1020" } },
                { activeFile: "Punt.cpp", line: 9, description: "S'han assignat els paràmetres a l'objecte amb this->. Ara sumem 1 al comptador global i únic compartit.", terminalOutput: ["> ./program"], variables: { "Punt::comptador": "1", "p1": "Punt {x: 1, y: 2}", "this": "0x7ffe1020" } },
                { activeFile: "main.cc", line: 7, description: "Tornem al main. Creem un segon Punt de diferent naturalesa: p2.", terminalOutput: ["> ./program"], variables: { "Punt::comptador": "1", "p1": "Punt {x: 1, y: 2}", "p2": "Punt {x: -858993460, y: -858993460}" } },
                { activeFile: "Punt.cpp", line: 6, description: "El paràmetre implícit 'this' ara no apunta a p1, per naturalesa apunta al qui l'ha cridat (p2).", terminalOutput: ["> ./program"], variables: { "Punt::comptador": "1", "p1": "Punt {x: 1, y: 2}", "p2": "Punt {x: -858993460, y: -858993460}", "this": "0x7ffe1030" } },
                { activeFile: "Punt.cpp", line: 9, description: "Si bé els Punts de p2 acaben de ser assignats independentment, el comptador global va pujant i ara ascendeix a 2 actius.", terminalOutput: ["> ./program"], variables: { "Punt::comptador": "2", "p1": "Punt {x: 1, y: 2}", "p2": "Punt {x: 5, y: 5}", "this": "0x7ffe1030" } },
                { activeFile: "main.cc", line: 9, description: "Toca moure p1 usant dx=2 i dy=2. Invocació de mètode simple amb prefix explícit a l'objecte base.", terminalOutput: ["> ./program"], variables: { "Punt::comptador": "2", "p1": "Punt {x: 1, y: 2}", "p2": "Punt {x: 5, y: 5}" } },
                { activeFile: "Punt.cpp", line: 14, description: "A dintre el moure(), usem explícitament 'this->' per ensenyar-vos quin 'x' o 'y' exactament canvien al pas de fer +=. Evidentment p2(5, 5) queda 100% lliure.", terminalOutput: ["> ./program"], variables: { "Punt::comptador": "2", "p1": "Punt {x: 3, y: 4}", "p2": "Punt {x: 5, y: 5}", "dx": "2", "dy": "2", "this": "0x7ffe1020" } },
                { activeFile: "main.cc", line: 11, description: "Fem una crida i impressió pel 'get_x()' del p1.", terminalOutput: ["> ./program"], variables: { "Punt::comptador": "2", "p1": "Punt {x: 3, y: 4}", "p2": "Punt {x: 5, y: 5}" } },
                { activeFile: "Punt.hpp", line: 11, description: "Aquest viatge ràpid no executa un autèntic 'call function' a la CPU sinó que resol eficaç inline, llegint que p1.x és 3 directament dins l'etapa compilada.", terminalOutput: ["> ./program"], variables: { "Punt::comptador": "2", "p1": "Punt {x: 3, y: 4}", "p2": "Punt {x: 5, y: 5}", "this": "0x7ffe1020" } },
                { activeFile: "main.cc", line: 12, description: "Com podeu veure val 3! Llavors finalment, comprovarem en temps real quants objectes s'han encriptat cridant Punt::quants_punts(). És un mètode static.", terminalOutput: ["> ./program", "X de p1: 3"], variables: { "Punt::comptador": "2", "p1": "Punt {x: 3, y: 4}", "p2": "Punt {x: 5, y: 5}" } },
                { activeFile: "Punt.cpp", line: 18, description: "Evidentment al mètode static se'n porta exclusivament i retorna una sortida a variables que tampoc tenen context original particular (com el comptador de tots elements). No hi ha 'this'.", terminalOutput: ["> ./program", "X de p1: 3"], variables: { "Punt::comptador": "2", "p1": "Punt {x: 3, y: 4}", "p2": "Punt {x: 5, y: 5}" } },
                { activeFile: "main.cc", line: 15, description: "Ja ho haureu vist! Es tanca amb resums finals on quants punts acaba determinant de l'ús general en 2. El programa conclou amb èxit desat i tots els elements s'alliberen.", terminalOutput: ["> ./program", "X de p1: 3", "Punts creats: 2", "> Programa finalitzat amb codi 0."], variables: { "Punt::comptador": "2" } },
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
    
    // Enfoc 1: Intentat recórrer endarrere manualment (Desaconsellat)
    auto it = L.end();
    it--; // Risc alt: L.end() apunta a la cel·la fora dels límits
    
    // Enfoc 2: L'ús de reverse_iterator (Estàndard)
    auto rit = L.rbegin();
    while (rit != L.rend()) {
        *rit += 5;
        rit++; // '++' avança de manera bidireccional automàtica a C++
    }
    
    return 0;
}`
        },
        generateSteps: () => {
            return [
                { activeFile: "main.cpp", line: 6, description: "Inicialitzem una llista d'enters a memòria representada per l'adreça d'enllaços bidireccionals amb [10, 20, 30].", terminalOutput: ["> Compilant binari..."], variables: { "L": "[10, 20, 30]" } },
                { activeFile: "main.cpp", line: 9, description: "Demostrem per què programar un bucle manual tradicional és perillós. En sol·licitar `L.end()`, es retorna un iterador que queda localitzat fora del límit existencial de la llista (com un forat negre indicatiu).", terminalOutput: ["> Demanant Punter Base..."], variables: { "L": "[10, 20, 30] ∅", "it": "0xNULL (Fora de rang)" } },
                { activeFile: "main.cpp", line: 10, description: "L'enginyer està obligat d'entrada a realitzar de seguida el canvi pur d'adreça en retoc matemàtic (it--) per arrelar el punt de nou dins el domini memòria. Una dinàmica propensa al temible Segmentation Fault.", terminalOutput: ["> Demanant Punter Base..."], variables: { "L": "[10, 20, 30]", "it": "-> 30 (0x7ffe1A)" } },
                { activeFile: "main.cpp", line: 13, description: "Deixem enrere aquest patró confús. C++ incorpora directament a std::list el tipus especial `reverse_iterator` (generat invocant `rbegin()`). Aquest obre instintivament el primer node virtual per la banda del darrere.", terminalOutput: ["> Inicilitzant rbegin()..."], variables: { "L_virtual_inv": "[30, 20, 10]", "rit": "-> 30 (0x7ffe1A)" } },
                { activeFile: "main.cpp", line: 14, description: "El disseny de C++ converteix la travessia abstracta directament per l'eix lineal del `while (rit != L.rend())` atès que `rend()` actua ara com una seguretat equivalent al buit, però ubicat inversament!", terminalOutput: ["> Bucle d'iterador invers segur actiu..."], variables: { "L_virtual_inv": "[30, 20, 10]", "rit": "-> 30 (0x7ffe1A)" } },
                { activeFile: "main.cpp", line: 15, description: "Desreferenciem el contigut iterat (`*rit`) i procedim al càlcul afegint enter positiu (+5), transformant l'adreça original transparent al 35 resultant.", terminalOutput: ["> Sobreescriptura 30 + 5"], variables: { "L_virtual_inv": "[35, 20, 10]", "rit": "-> 35 (0x7ffe1A)", "L_real": "[10, 20, 35]" } },
                { activeFile: "main.cpp", line: 16, description: "Aquí rau la flexibilitat real: procedim fent una suma sintàctica clàssica (`rit++`). L'iterador sobreescrit realitza orgànicament el decrement per nosaltres i llisca naturalment al segment del costat (Valor: 20).", terminalOutput: ["> ++ Avaluat amb èxit"], variables: { "L_virtual_inv": "[35, 20, 10]", "rit": "-> 20 (0x7ffe2C)", "L_real": "[10, 20, 35]" } },
                { activeFile: "main.cpp", line: 15, description: "Es repeteix l'evaluació abstracta sobre ell assignant +5 per referència en contacte al segon element endarrerit i procedim al salt iteratiu clàssic.", terminalOutput: ["> Sobreescriptura 20 + 5"], variables: { "L_virtual_inv": "[35, 25, 10]", "rit": "-> 25 (0x7ffe2C)", "L_real": "[10, 25, 35]" } },
                { activeFile: "main.cpp", line: 15, description: "Finalitzem la seqüenciació amb l'assignament a l'últim node visual (primer de referència global originària). Processament garantitzat i robust.", terminalOutput: ["> Sobreescriptura 10 + 5"], variables: { "L_virtual_inv": "[35, 25, 15]", "rit": "-> 15 (0x7ffe3F)", "L_real": "[15, 25, 35]" } },
                { activeFile: "main.cpp", line: 20, description: "La travessa reversa es topa per fi contra el límit segur estricte de `L.rend()`, acabant el bloqueig de cicle purament i complet a memòria real. Codi finalitzat!", terminalOutput: ["> Sortida de cicle completada", "> Programa finalitzat amb codi 0."], variables: { "L_real": "[15, 25, 35]" } },
            ] as OOPStep[];
        }
    },
    data_class: {
        id: "data_class",
        files: {
            "Makefile": `CXX = g++
CXXFLAGS = -D_JUDGE_ -D_GLIBCXX_DEBUG -O2 -Wall -Wextra -Werror -Wno-sign-compare -std=c++11

TARGET = demo_data

all: $(TARGET)

$(TARGET): data.o main.o
	$(CXX) $(CXXFLAGS) -o $(TARGET) data.o main.o

data.o: data.cc data.hh
	$(CXX) $(CXXFLAGS) -c data.cc

main.o: main.cc data.hh
	$(CXX) $(CXXFLAGS) -c main.cc

clean:
	rm -f *.o $(TARGET)`,
            "main.cc": `#include "data.hh"
#include <iostream>

using namespace std;

int main() {
  Data d;
  int n;

  d.llegeix();
  while (cin >> n) {
    Data resultat = d.suma_dies(n);
    resultat.escriu();
    cout << endl;
    
    d.llegeix();
  }
  return 0;
}`,
            "data.hh": `#ifndef DATA_HH
#define DATA_HH

class Data {
private:
  int dia, mes, any;

  bool es_de_traspas(int any) const;
  int dies_mes(int mes, int any) const;

public:
  Data();
  Data(int dia, int mes, int any);

  void llegeix();
  void escriu() const;
  Data suma_dies(int dies) const;
  bool menor(const Data &b) const;

  static Data actual();
};

#endif`,
            "data.cc": `#include "data.hh"
#include <iostream>
#include <iomanip>
using namespace std;

Data::Data() {
  dia = 1; mes = 1; any = 0;
}

int Data::dies_mes(int mes, int any) const {
  if (mes == 2) {
    return ((any % 4 == 0 && any % 100 != 0) || any % 400 == 0) ? 29 : 28;
  } else if (mes == 4 || mes == 6 || mes == 9 || mes == 11) {
    return 30;
  } else {
    return 31;
  }
}

void Data::llegeix() {
  char _; 
  cin >> dia >> _ >> mes >> _ >> any;
}

void Data::escriu() const {
  cout << setfill('0') << setw(2) << dia << '/' 
       << setfill('0') << setw(2) << mes << '/' 
       << setfill('0') << setw(4) << any;
}

Data Data::suma_dies(int dies) const {
  Data res = *this; 
  res.dia += dies;
  while (res.dia > res.dies_mes(res.mes, res.any)) {
    res.dia -= res.dies_mes(res.mes, res.any);
    res.mes++;
    if (res.mes > 12) {
      res.mes = 1;
      res.any++;
    }
  }
  return res;
}`
        },
        generateSteps: () => {
            return [
                { activeFile: "Makefile", line: 6, description: "Executem 'make' per iniciar la compilació del programa i dependències.", terminalOutput: ["make"], variables: {} },
                { activeFile: "Makefile", line: 11, description: "Es compila el mòdul Data ('data.cc') a codi objecte ('data.o') separadament.", terminalOutput: ["make", "g++ -D_JUDGE_... -c data.cc"], variables: {} },
                { activeFile: "Makefile", line: 14, description: "Es compila també l'algorisime principal ('main.cc') al seu propi bloc objecte.", terminalOutput: ["make", "g++ -D_JUDGE_... -c data.cc", "g++ -D_JUDGE_... -c main.cc"], variables: {} },
                { activeFile: "Makefile", line: 9, description: "S'enllacen ('link') els fitxers '.o', generant l'executable final 'demo_data'.", terminalOutput: ["make", "g++ -D_JUDGE_... -c data.cc", "g++ -D_JUDGE_... -c main.cc", "g++ -D_JUDGE_... -o demo_data data.o main.o"], variables: {} },
                { activeFile: "main.cc", line: 6, description: "Invocació nativa `./demo_data`. El flux entra al 'main()'.", terminalOutput: ["./demo_data"], variables: {} },
                { activeFile: "main.cc", line: 7, description: "Instanciació local de l'objecte 'd' a l'Stack. El compilador invoca automàticament el constructor.", terminalOutput: ["./demo_data"], variables: { "d": "Data{?.?.?}" } },
                { activeFile: "data.cc", line: 6, description: "Saltem al constructor buit de Data. El paràmetre ocult 'this' apunta a l'instància 'd'.", terminalOutput: ["./demo_data"], variables: { "this": "->d" } },
                { activeFile: "data.cc", line: 7, description: "Assignació dels paràmetres ('1', '1', '0') en l'àmbit de d.", terminalOutput: ["./demo_data"], variables: { "this": "->d", "dia": "1", "mes": "1", "any": "0" } },
                { activeFile: "main.cc", line: 8, description: "El flux torna a la funció principal declarant la variable enter 'n'.", terminalOutput: ["./demo_data"], variables: { "d": "1/1/0", "n": "?" } },
                { activeFile: "main.cc", line: 10, description: "L'objecte 'd' executa una captura prèvia `.llegeix()` seguint l'estàndard Jutge per preparar condicions.", terminalOutput: ["(El sistema roman aturat demanant Console Input)"], variables: { "d": "1/1/0", "n": "?" } },
                { activeFile: "data.cc", line: 20, description: "Al mètode, 'cin' llegeix ignorant char '/' i omple les components de l'objecte 'this'.", terminalOutput: ["28/02/2024"], variables: { "this": "->d" } },
                { activeFile: "data.cc", line: 21, description: "L'element actualitza variables en memòria. Fi del mètode de lectura.", terminalOutput: ["28/02/2024"], variables: { "this": "->d", "dia": "28", "mes": "2", "any": "2024" } },
                { activeFile: "main.cc", line: 11, description: "Condicional 'while' avalúa veritat al extraure de cin el desplaçament requerit ('n').", terminalOutput: ["28/02/2024 1"], variables: { "d": "28/02/2024", "n": "1" } },
                { activeFile: "main.cc", line: 12, description: "S'invoca el mètode 'suma_dies(n)', passant l'enter al context exclusiu de 'd'.", terminalOutput: ["28/02/2024 1"], variables: { "d": "28/02/2024", "n": "1" } },
                { activeFile: "data.cc", line: 31, description: "S'executa clonació d'estat (*this) creant l'entitat local asimptòtica 'res'.", terminalOutput: ["28/02/2024 1"], variables: { "this": "->d", "dies": "1", "res": "28/02/2024" } },
                { activeFile: "data.cc", line: 32, description: "Operació abstracta modificant directament el dia iteratiu de 'res' (+1).", terminalOutput: ["28/02/2024 1"], variables: { "this": "->d", "dies": "1", "res": "29/02/2024" } },
                { activeFile: "data.cc", line: 10, description: "Ús de mètode avaluador limitador d'anys traspàs retornant el topall d'estabilitat del mes (29).", terminalOutput: ["28/02/2024 1"], variables: { "this": "->res", "res_retorn_dies": "29" } },
                { activeFile: "data.cc", line: 33, description: "El camp 'res.dia' es troba dins rang operatiu. Tancament de salts al Bucle matemàtic.", terminalOutput: ["28/02/2024 1"], variables: { "this": "->d", "dies": "1", "res": "29/02/2024" } },
                { activeFile: "data.cc", line: 42, description: "Sortida valor de mètode. L'entorn local es destrueix i passem el bloc sencer resultant.", terminalOutput: ["28/02/2024 1"], variables: { "this": "->d", "res": "29/02/2024" } },
                { activeFile: "main.cc", line: 12, description: "A Main la variable receptora 'resultat' captura l'assignació estructurada d'origen.", terminalOutput: ["28/02/2024 1"], variables: { "d": "28/02/2024", "n": "1", "resultat": "29/02/2024" } },
                { activeFile: "main.cc", line: 13, description: "Invocació directa a sortida genèrica C++ usant el '.escriu()' del bloc resultant.", terminalOutput: ["28/02/2024 1"], variables: { "d": "28/02/2024", "n": "1", "resultat": "29/02/2024" } },
                { activeFile: "data.cc", line: 25, description: "'cout' projecta formatacions fixes encadenant en bloc l'estat localitzat de 'this' (->resultat).", terminalOutput: ["29/02/2024"], variables: { "this": "->resultat", "dia": "29" } },
                { activeFile: "main.cc", line: 16, description: "Es repeteix pas previ a condicional tornant a obrir stream 'd.llegeix()' iterant format per pròximes captures.", terminalOutput: ["29/02/2024"], variables: { "d": "28/02/2024", "n": "1", "resultat": "29/02/2024" } },
                { activeFile: "main.cc", line: 11, description: "Reenganxament iteratiu. Flux stream entra cap a EOF. Resulta en fals, trenca loop, memòria es buida purament. Procés Completat.", terminalOutput: ["29/02/2024", "> End Of Process."], variables: {} }
            ] as OOPStep[];
        }
    },
    racional_class: {
        id: "racional_class",
        files: {
            "Makefile": `CXX = g++
CXXFLAGS = -D_JUDGE_ -D_GLIBCXX_DEBUG -O2 -Wall -Wextra -Werror -Wno-sign-compare -std=c++11

TARGET = calc_racionals

all: $(TARGET)

$(TARGET): racional.o main.o
	$(CXX) $(CXXFLAGS) -o $(TARGET) racional.o main.o

racional.o: racional.cc racional.hh
	$(CXX) $(CXXFLAGS) -c racional.cc

main.o: main.cc racional.hh
	$(CXX) $(CXXFLAGS) -c main.cc

clean:
	rm -f *.o $(TARGET)`,
            "main.cc": `#include "racional.hh"
#include <iostream>
#include <string>

using namespace std;

// Solució al laboratori Racionals
int main() {
  Racional r;
  Racional acum;
  
  acum.llegeix();
  acum.escriu();
  cout << endl;

  string op;
  while (cin >> op) {
    r.llegeix();

    if (op == "+") {
      acum = acum.suma(r);
    } else if (op == "-") {
      acum = acum.resta(r);
    }

    acum.escriu();
    cout << endl;
  }
}`,
            "racional.hh": `#ifndef RACIONAL_HH
#define RACIONAL_HH

class Racional {
private:
  int num, den;

  int mcd(int a, int b) const;
  int signe(int n) const;
  void simplifica_intern(int n, int d);

public:
  Racional();
  Racional(int n, int d);

  void llegeix();
  void escriu() const;

  Racional suma(const Racional &b) const;
  Racional resta(const Racional &b) const;
  // ... (multiplica i divideix fets iguals)
};

#endif`,
            "racional.cc": `#include "racional.hh"
#include <cstdlib>
#include <iostream>

using namespace std;

int Racional::signe(int n) const { return n < 0 ? -1 : 1; }

int Racional::mcd(int a, int b) const {
  while (b != 0) { int aux = b; b = a % b; a = aux; }
  return a;
}

void Racional::simplifica_intern(int n, int d) {
  if (n == 0) { num = 0; den = 1; }
  else {
    int m = mcd(abs(n), abs(d));
    num = (signe(n) * signe(d)) * (abs(n) / m);
    den = abs(d) / m;
  }
}

Racional::Racional() { simplifica_intern(0, 1); }
Racional::Racional(int n, int d) { simplifica_intern(n, d); }

void Racional::llegeix() {
  char _; int n, d;
  cin >> n >> _ >> d;
  simplifica_intern(n, d);
}

void Racional::escriu() const {
  cout << num;
  if (den > 1) { cout << '/' << den; }
}

Racional Racional::suma(const Racional &b) const {
  return Racional(num * b.den + b.num * den, den * b.den);
}`
        },
        generateSteps: () => {
            return [
                { activeFile: "Makefile", line: 6, description: "Executem 'make' per compilar Racionals. Les eines processen les dependències.", terminalOutput: ["make"], variables: {} },
                { activeFile: "Makefile", line: 12, description: "Compilació de 'racional.cc' cap a codi objecte '.o', aïllant complexitats.", terminalOutput: ["make", "g++ -D_JUDGE_... -c racional.cc"], variables: {} },
                { activeFile: "Makefile", line: 15, description: "L'escriptura procedeix compilant la matriu de 'main.cc' sense vinculació final.", terminalOutput: ["make", "g++ -D_JUDGE_... -c racional.cc", "g++ -D_JUDGE_... -c main.cc"], variables: {} },
                { activeFile: "Makefile", line: 9, description: "S'invoca l'enllaç de C++ produint l'executable 'calc_racionals' resolut.", terminalOutput: ["make", "g++ -D_JUDGE_... -c racional.cc", "g++ -D_JUDGE_... -c main.cc", "g++ -D_JUDGE_... -o calc_racionals racional.o main.o"], variables: {} },
                { activeFile: "main.cc", line: 9, description: "Comanda d'execució `./calc_racionals` al local shell per iniciar simulació.", terminalOutput: ["./calc_racionals"], variables: {} },
                { activeFile: "main.cc", line: 10, description: "Inicialitzem recurs Racional actiu 'r' usat en fase de captures temporal.", terminalOutput: ["./calc_racionals"], variables: {} },
                { activeFile: "main.cc", line: 11, description: "Incorporem la declaració de l'acumulador persistint ('acum') de càlculs C++.", terminalOutput: ["./calc_racionals"], variables: { "r": "Ref?", "acum": "Ref?" } },
                { activeFile: "racional.cc", line: 24, description: "Salt d'scope a 'Racional::Racional()' delegant variables a simplificadors.", terminalOutput: ["./calc_racionals"], variables: { "this": "->acum" } },
                { activeFile: "racional.cc", line: 19, description: "Garantitzem memòries locals fixant elements abstractes en 0 num i 1 den segurant control.", terminalOutput: ["./calc_racionals"], variables: { "this": "->acum", "num": "0", "den": "1" } },
                { activeFile: "main.cc", line: 13, description: "Tornant, l'objecte 'acum' resol execució `.llegeix()` cridant lectura d'origen estàndard.", terminalOutput: ["(Mode Consola Cin demant input inicial: '1/2')"], variables: { "r": "0/1", "acum": "0/1" } },
                { activeFile: "racional.cc", line: 28, description: "Flux a mètode 'llegeix()' enclou format d'acció exclusiu. La variable drecera descarta `/` extra.", terminalOutput: ["1/2"], variables: { "this": "->acum" } },
                { activeFile: "racional.cc", line: 29, description: "Extracció de constants referenciant mòduls directes per filtratge d'operativitat interna.", terminalOutput: ["1/2"], variables: { "this": "->acum", "n": "1", "d": "2" } },
                { activeFile: "racional.cc", line: 19, description: "Pre-factoritzador llegeix i redueix errors matemàtics adaptant directes subrutinades i variables.", terminalOutput: ["1/2"], variables: { "this": "->acum", "num": "1", "den": "2" } },
                { activeFile: "main.cc", line: 14, description: "Tornament d'stream: 'acum.escriu()' imprimeix instància inicial sense modificadors de crida.", terminalOutput: ["1/2"], variables: { "r": "0/1", "acum": "1/2" } },
                { activeFile: "main.cc", line: 18, description: "Bucle while(cin >> op) actua sobre loop extreient el char relacional directament en cadena (string '+').", terminalOutput: ["1/2", "+"], variables: { "acum": "1/2", "op": "+" } },
                { activeFile: "main.cc", line: 19, description: "S'executa fons 'r.llegeix()' avaluant el paràmetre volàtil 'r' via operatiu stream darrera l'anàlisi.", terminalOutput: ["1/2", "+", "(Espera valor numèric complet)"], variables: { "acum": "1/2", "op": "+", "r": "0/1" } },
                { activeFile: "racional.cc", line: 29, description: "Variables lliures acoplen a capturació 3/4 introduint paràmetre cec dins de memòria temporal blindada.", terminalOutput: ["3/4"], variables: { "this": "->r", "n": "3", "d": "4" } },
                { activeFile: "main.cc", line: 21, description: "Condicional orientat resol base del mode de crida direccional sobre string pre-capturat de subrútina (+).", terminalOutput: ["3/4"], variables: { "acum": "1/2", "op": "+", "r": "3/4" } },
                { activeFile: "main.cc", line: 22, description: "Acció invocada. La base 'acum' (.suma(r)) llança execució directriu passant l'invasor passiu exclusivament via argument.", terminalOutput: ["3/4"], variables: { "acum": "1/2", "op": "+", "r": "3/4" } },
                { activeFile: "racional.cc", line: 36, description: "A aïllament d'operador privat de creuada (->acum). Les instàncies asimètriques calculen sense dany (1*4+3*2).", terminalOutput: ["3/4"], variables: { "this(->acum)": "1/2", "B(->r)": "3/4" } },
                { activeFile: "racional.cc", line: 37, description: "Retorn constructor passiu processa Racional(10, 8) resolent el forjament i sortint instànciada directa en emissió.", terminalOutput: ["3/4"], variables: { "this(->acum)": "1/2", "result": "Racional(10, 8)" } },
                { activeFile: "racional.cc", line: 20, description: "Subcomponents deleguen a rutines (MCD) reduint complexitas base 10 i 8 depurades lliurades i seguritzades a 5/4.", terminalOutput: ["3/4"], variables: { "this(->acum)": "1/2", "result": "5/4" } },
                { activeFile: "main.cc", line: 22, description: "Sobreescriptura original final de variable 'acum', on nodes s'identifiquen resolts de desmemòries i el return pur lligant resultats globals.", terminalOutput: ["3/4"], variables: { "acum": "5/4", "op": "+", "r": "3/4" } },
                { activeFile: "main.cc", line: 27, description: "Darreres seqüències mostren la consola resolt pur per a externalitat '.escriu()' demostrant pur d'etapa complet avaluació '5/4'.", terminalOutput: ["3/4", "5/4"], variables: { "acum": "5/4", "op": "+", "r": "3/4" } },
                { activeFile: "main.cc", line: 18, description: "Verificació en condicional if fallida. Stream es buida trencat pel loop a final tancant l'operació asimptòticament de memòria assolejada.", terminalOutput: ["... (EOF tancant)", "> Programa finalitzat i processaments alliberats."], variables: {} },
            ] as OOPStep[];
        }
    },
    stack_reverse: {
        id: "stack_reverse",
        files: {
            "reverse.cc": `#include <iostream>
using namespace std;
#include "stack.hh"
using namespace pro2;

void reverse(istream& in, ostream& out) {
    Stack<int> s;
    int n;
    while (in >> n) {
        s.push(n);
    }
    
    // Anem desapilant i cridant el TOP per extreure en invers
    while (!s.empty()) {
        out << s.top();
        s.pop();
        if (!s.empty()) out << " ";
    }
    out << endl;
}`
        },
        generateSteps: () => {
            return [
                { activeFile: "reverse.cc", line: 7, description: "Instanciació d'una Pila (Stack) de tipus enter, inicialment buida. Mantenim estat `n` lliure.", terminalOutput: [], variables: { "s": "[]", "n": "?" } },
                { activeFile: "reverse.cc", line: 9, description: "El bucle cin entra l'entrada des de la consola pur iteratiu. Llegim el primer enter: 3.", terminalOutput: ["S'han llegit dades d'entrada: 3"], variables: { "s": "[]", "n": "3" } },
                { activeFile: "reverse.cc", line: 10, description: "Cridem `s.push(n)`. S'incorpora l'element al cim (top) de la Pila actual abstractament instanciant.", terminalOutput: [], variables: { "s": "[3] <- top", "n": "3" } },
                { activeFile: "reverse.cc", line: 9, description: "El bucle rep una segona instància al vol entrant a format d'anàlisi de cua base de seqüències: Llegim 4.", terminalOutput: ["Lectura contínua: 4"], variables: { "s": "[3] <- top", "n": "4" } },
                { activeFile: "reverse.cc", line: 10, description: "S'apila el 4, directament situat damunt del valor anterior ja respectat sense interrupcions.", terminalOutput: [], variables: { "s": "[3, 4] <- top", "n": "4" } },
                { activeFile: "reverse.cc", line: 9, description: "Simulem que l'arxiu/entrada no entrega més resultats pur de seqüència, assolit fi de paràmetres (EOF).", terminalOutput: ["Entrada: EOF tancant lectura"], variables: { "s": "[3, 4] <- top", "n": "4" } },
                { activeFile: "reverse.cc", line: 14, description: "Ara validem bucles fins que la Pila es vacüi processant els valors a l'invers a base d'escriure el cim actual.", terminalOutput: [], variables: {} },
                { activeFile: "reverse.cc", line: 15, description: "La sortida avalua instància local pel valor extret del top de l'objecte: 4 (va ser l'últim a entrar, pel principi LIFO).", terminalOutput: ["Sortida extreta: 4"], variables: { "s": "[3, 4] <- top" } },
                { activeFile: "reverse.cc", line: 16, description: "Límit destructiu: Desemparem valor consumit mitjançant `.pop()`, el cim actual rellisca i actualitza cap a baix.", terminalOutput: [], variables: { "s": "[3] <- top" } },
                { activeFile: "reverse.cc", line: 14, description: "Processant bucle en cas d'estrès asimptòtic: la condició assevera Pila no empty().", terminalOutput: [], variables: { "s": "[3] <- top" } },
                { activeFile: "reverse.cc", line: 15, description: "Cridant consultora s.top() que subministra l'antic inicialment entrat 3 directament entregat a instància impresa terminal purament al llarg de cadena resolta.", terminalOutput: ["Sortides concatenades completades: 4 3"], variables: {} },
                { activeFile: "reverse.cc", line: 16, description: "S.pop() pur final destrueix contingut i ens entrega una Pila resolta idèntica com buidada original abstracta respectiva i assecurant pur limit.", terminalOutput: [], variables: { "s": "[]" } },
                { activeFile: "reverse.cc", line: 14, description: "Fallida lògica empty(): L'estructura ha escopit tot al revés instintivament iteratiu lineal asimptòticament de solució complerta.", terminalOutput: ["Escriptura invers emesa resolutiva!"], variables: {} }
            ] as OOPStep[];
        }
    },
    stack_parentesis: {
        id: "stack_parentesis",
        files: {
            "parentesis.cc": `#include <iostream>
using namespace std;
#include "stack.hh"
using namespace pro2;

void parentesis(istream& in, ostream& out) {
    Stack<char> s;
    char c;
    int pos = 1;

    while (in >> c and c != '.') {
        if (c == '(' or c == '[') {
            s.push(c);
        } 
        else if (c == ')' or c == ']') {
            if (s.empty()) {
                out << "Incorrecte " << pos << endl;
                return;
            }
            char top = s.top();
            if ((c == ')' and top == '(') or (c == ']' and top == '[')) {
                s.pop();
            } else {
                out << "Incorrecte " << pos << endl;
                return;
            }
        }
        pos++;
    }

    if (s.empty()) out << "Correcte\\n";
    else out << "Incorrecte " << pos << endl;
}`
        },
        generateSteps: () => {
            return [
                { activeFile: "parentesis.cc", line: 7, description: "S'inicia el programa apilador instanciant objecte Stack destinat a paràmetres locals char abstractes buidats. Còpia exemple d'entrada usat simulat: '([])'", terminalOutput: [], variables: { "s": "[]", "pos": "1" } },
                { activeFile: "parentesis.cc", line: 11, description: "Avaluació contínua capturant primers símbols evitant buidat o espais via directiva. Caràcter llegit actualment: '(' pur respectat.", terminalOutput: ["Llegit element d'instància formativa: '('"], variables: { "s": "[]", "c": "(", "pos": "1" } },
                { activeFile: "parentesis.cc", line: 13, description: "Operador d'avaluació es troba ser Obertura! Inyectem al mur iteratiu lliure (Push emès localment i absolut format top intern).", terminalOutput: [], variables: { "s": "[(]", "c": "(" } },
                { activeFile: "parentesis.cc", line: 28, description: "Inicidem posició analítica i retornem darrer asimptòtic salt avaluant base local respectiu directament linealitzat de crida d'avanç.", terminalOutput: [], variables: { "s": "[(]", "pos": "2" } },
                { activeFile: "parentesis.cc", line: 11, description: "Segment segon pur d'instàncies llegeix del mur de seqüències entrant a subrútina següent: Captació claudàtor pur '['", terminalOutput: ["Element atrapat en posició asimètica 2: '['"], variables: { "s": "[(]", "c": "[" } },
                { activeFile: "parentesis.cc", line: 13, description: "L'entitat segueix representant tipus obridor de fletxa amunt apilada dalt sobre anterior pur i resolt local de referència top base tancada.", terminalOutput: [], variables: { "s": "[(, [] <- top", "c": "[" } },
                { activeFile: "parentesis.cc", line: 11, description: "Després del respectiu ++, el sistema engoleix ara un tercer símbol: L'extret tancament claudàtor ']'. Inici dualitat test d'equitat base!", terminalOutput: ["Tercer caràcter extret corrent instància: ']'"], variables: { "s": "[(, [] <- top", "c": "]", "pos": "3" } },
                { activeFile: "parentesis.cc", line: 15, description: "Assolim bloc Else-If: Ens plantem a mode destructor verificant asimetries absolutes d'entrada externa directrius contra mur de bloc apilat respectat", terminalOutput: [], variables: {} },
                { activeFile: "parentesis.cc", line: 20, description: "Consulta passiva al magatzem de variables actual emmagatzemat s.top() que extreu per simple informació local pur limit el top '[' a comparar i resoldre asimètriques constants.", terminalOutput: [], variables: { "top": "[" } },
                { activeFile: "parentesis.cc", line: 21, description: "Miracle matching respectiu. Validació creuada (']==[') satisfà identitats igualant naturaleses resoltes correctament.", terminalOutput: ["Subavaluació respectiva local asseverada d'èxit: parella asimètrica encert"], variables: {} },
                { activeFile: "parentesis.cc", line: 22, description: "Executem destructor intern lliurant desmemorat pop(). Deslliura darrer claudàtor destruït, retrocedint en posició base cim deixat lliurat només l'obertura '( mur extern.", terminalOutput: [], variables: { "s": "[(] <- top" } },
                { activeFile: "parentesis.cc", line: 11, description: "S'atrapen elements de base successora restants d'avaluar tancament pur del bucle amb caràcter finalista llegit: ')'", terminalOutput: ["Final element entrat directe: ')'"], variables: { "c": ")" } },
                { activeFile: "parentesis.cc", line: 22, description: "Anàlogament com testejador l'evalua idèntic s.top()==='(' contra extret darrerament lliurat i llença el consumidor local destruint parell pur abstracte intern complet asimètricament resolt.", terminalOutput: ["Validacions completades de successió paràmetres locals!"], variables: { "s": "[]", "c": ")" } },
                { activeFile: "parentesis.cc", line: 31, description: "L'esquema for finalitza a priori. Testejos directius evaluan s.empty() de memòria viva comprovant cap parell solitari amagat actiu restat intern i donant Ok global per sortida!", terminalOutput: ["Anàlisi Resoluta Pila = OK", "Correcte"], variables: { "s": "[]" } }
            ] as OOPStep[];
        }
    },
    stack_recursivitat: {
        id: "stack_recursivitat",
        files: {
            "recursivitat.cc": `#include <iostream>
using namespace std;
#include "stack.hh"
using namespace pro2;

void escriu(int n, ostream& out) {
    Stack<int> s;
    s.push(n);

    // Iterant contínuament fins haver desapilat per pur tota acció virtual
    while (!s.empty()) {
        int v = s.top();
        s.pop();
        
        if (v > 0) {
            out << ' ' << v;
            // Instanciem instint base C++, cap endarrere ja que el següent pas voldrà 
            // fer 'pop' i consumir el "MÉS NOU"
            s.push(v - 1);
            s.push(v - 1);
        }
    }
}`
        },
        generateSteps: () => {
            return [
                { activeFile: "recursivitat.cc", line: 7, description: "Inici d'Escriu! Disenyant un stack manual limit base de sistema en local processant n=2 com a exemple de la simulació de funcionament recursiu.", terminalOutput: [], variables: { "n": "2", "s": "[]" } },
                { activeFile: "recursivitat.cc", line: 8, description: "Pre-crida paral·lela original d'inici respectant instint stack OS empeny factor pur inicial (2) dins al top. Crida base apilada preparativa inici", terminalOutput: [], variables: { "s": "[2] <- top" } },
                { activeFile: "recursivitat.cc", line: 11, description: "Mentrestant resten peticions actives resoludes OS abstraç, iterador d'activitats de context entra a lliurar funcions pendents de l'arbre abstracte empaquetades per Pila", terminalOutput: [], variables: {} },
                { activeFile: "recursivitat.cc", line: 12, description: "Dalt cim Pila resol dóna prioritat constant darrera d'activitat V=2 de procediment local abstracte lliure completament i l'apressa a base d'utilitzar local. ", terminalOutput: [], variables: { "v": "2" } },
                { activeFile: "recursivitat.cc", line: 13, description: "Pila desmembra d'actitud el Top llistant procediments i crides ja asseverades (simula extracció per treball present local en actiu complet base i fora pur de memòria viva)", terminalOutput: [], variables: { "s": "[]" } },
                { activeFile: "recursivitat.cc", line: 16, description: "Escriu lliurement i processa base d'acció de nivell actual del full. Element imprimit: '2' pur respectant lògiques asimètiques de branca abstracta recursiva de teoria C++ pures.", terminalOutput: ["Simulació externa imprès pur consolida resultat abstracte actiu: 2"], variables: {} },
                { activeFile: "recursivitat.cc", line: 19, description: "Preparant bifurcacions de fulls inferiors: apilem full n-1 crida dual recursiva dual primera crida (Push d'escenificació d'ordre abstracte cap endarrere simulat OS asimètric).", terminalOutput: [], variables: { "s": "[1]" } },
                { activeFile: "recursivitat.cc", line: 20, description: "I una altra crida subratllada simulat igualada apresa en profunditat asseverada empaquetant germà com full complet dual virtual de descendiment apilada lliure al Top absolut iteratiu", terminalOutput: [], variables: { "s": "[1, 1] <- top" } },
                { activeFile: "recursivitat.cc", line: 11, description: "Torna asimetria principal a buscar fons actiu, Top absolut actualitza memòria crida priorita profunditat de recursivitat com PC.", terminalOutput: [], variables: { "s": "[1, 1] <- top" } },
                { activeFile: "recursivitat.cc", line: 12, description: "Treu per pur funcionament full esquerra actiu respectitiu, V passa en ser subrutina de 1 constant apilada, pop buidant local actual per processació interna asimètica de memòries.", terminalOutput: ["Recepció darrer node branca lliurada a procés"], variables: { "s": "[1]", "v": "1" } },
                { activeFile: "recursivitat.cc", line: 16, description: "S'entreguen ordres bases de sistema pur respectant funcio abstracta escurant instint asimptòtic: Imprès valor 1 per seqüència lineal base pre-order de lliurament format consolar pur.", terminalOutput: ["Imprimint consolar pre-order simulació resolt OS: 2, 1"], variables: {} },
                { activeFile: "recursivitat.cc", line: 19, description: "Aquesta funció v=1 afegeix zeros morts! Simula apilar branca de condicional trencat asimptòticament amb duplicador línia abstracte push 0 per dalt OS lligant condicional mort", terminalOutput: [], variables: { "s": "[1, 0, 0] <- top" } },
                { activeFile: "recursivitat.cc", line: 12, description: "El bloc en silenci iteratiu consumeix i vacua tots dos 0, on condicional (v>0) purament fallit base asimptòtica talla cap branca descendents. El top OS queda pur format solitari germanal 1 local restat del node antic arrel primer...", terminalOutput: ["Zeros morts destruïts pel if de base local instanciada"], variables: { "s": "[1] <- top" } },
                { activeFile: "recursivitat.cc", line: 12, description: "Consolida instància germana 1 que finalment treu cap a terminal acabant asimetria completa imprimint-s'hi format resolut", terminalOutput: ["Impressió final tancament OS: 2, 1, 1"], variables: { "s": "[]" } },
                { activeFile: "recursivitat.cc", line: 11, description: "Memòria buida. L'arbre ha processat branques. Execució iterativa fi per simular retorns infinits call-stack d'OS absoluts instància completa.", terminalOutput: ["Alliberant crida de memòries Call-Stack PC pur a resolució d'èxits globals."], variables: {} }
            ] as OOPStep[];
        }
    },
    queue_patata: {
        id: "queue_patata",
        files: {
            "patata.cc": `void patata_calenta(istream& in, ostream& out) {
    int N, k;
    if (in >> N >> k) {
        Queue<int> q;
        for (int i = 1; i <= N; ++i) {
            q.push(i); // Noms i gent dins del joc
        }
        
        bool first = true;
        while (q.size() > 1) { // Fins que sobrevisqui només pur 1 individu
            // Fem K girs o "passos de patates calents" cap a fi del cicle
            for (int i = 0; i < k; ++i) {
                int front = q.front();
                q.pop();
                q.push(front);
            }
            
            if (!first) out << " ";
            // La pobra anima davantera que acaba tocant rep l'expulsió immediata
            out << q.front();
            q.pop(); 
            first = false;
        }
        
        if (!first) out << endl;
        if (q.size() == 1) {
            out << "Supervivent: " << q.front() << endl;
        }
    }
}`
        },
        generateSteps: () => {
            return [
                { activeFile: "patata.cc", line: 3, description: "Inici simulaciò Patata Calenta prenent exemple de paràmetres asimètrics locals d'avaluació externa N=3 nens inscrits saltant K=1 cops bomba explosivitat rotatori", terminalOutput: ["Cua pre-assolida instanciada. Exemple local 3 persones i bomba 1 salt de K exclusiu de respectar llistats purs."], variables: { "N": "3", "k": "1", "q": "front [] back" } },
                { activeFile: "patata.cc", line: 6, description: "Iteradors inseridors afegeixen els diferents participants nens d'enrere cap a davant asimètricament al joc", terminalOutput: [], variables: { "q": "front [1, 2, 3] back" } },
                { activeFile: "patata.cc", line: 10, description: "Validador assevera la mida. Com es > 1 i hi juguen nens vius de competivitat s'entra l'espera lliscant natural asimptòtic base exclusiu purament!", terminalOutput: [], variables: {} },
                { activeFile: "patata.cc", line: 14, description: "S'activa procediment cíclic de moviment rotacional que aïlla valors de front a back desprès d'esperes base completades en temps instint linear limit actiu! Traiem el front '1' de reubicant instàncies ràpides i efectives a Cua llunyana abstracta.", terminalOutput: ["Bomba roda passant per primer salt cap endavant esquivant cap a esquerra rotatori..."], variables: { "q": "front [2, 3, 1] back" } },
                { activeFile: "patata.cc", line: 20, description: "Assoleix bomba k cops pur respectat tall d'animació limitat i explota en posició frontal per extracció externa fatal cap de jugador!", terminalOutput: [], variables: { "q": "front [2, 3, 1] back" } },
                { activeFile: "patata.cc", line: 21, description: "Tragèdia emesa terminal asimètric emetent expulsador pur. Nen número '2' resulta destruït perdut asseverant respectant sistema lineal", terminalOutput: ["Bum! Jugador expulsat destruït sortida patata lliurada: 2"], variables: { "q": "front [3, 1] back" } },
                { activeFile: "patata.cc", line: 10, description: "La nova ronda avalua mides de cues limit i procedeix amb salt asimètric i exclusivament iterador a base de K passades front rotat respectiu (nen 3 extret al final abstractament asseverant i guardat localment instint)...", terminalOutput: ["Bomba segona ronda torna rotant"], variables: { "q": "front [1, 3] back" } },
                { activeFile: "patata.cc", line: 21, description: "Eliminació mort de front resol el company asseverant pop a nen '1', directament mostrat a esquerides sortides externes directrius...", terminalOutput: ["Bum local encertat: jugador perdut 1 empaquetant..."], variables: { "q": "front [3] back" } },
                { activeFile: "patata.cc", line: 10, description: "Bucles desmuntats! Validador de mort assegura el sistema compeletat i només en queda l'únic integrant exclusiu asimètric abstractiu limit base viu a joc de la Cua: size == 1 tanca bloc Battle!", terminalOutput: [], variables: { "q": "front [3] back" } },
                { activeFile: "patata.cc", line: 27, description: "Últim print resolut entregant l'èxit de prova pur al respectat Supervívencia en base a front asimètric lliure al top!", terminalOutput: ["Bum! Sortides de resultats globals: 2 1", "Supervivent: 3"], variables: { "q": "front [3]" } }
            ] as OOPStep[];
        }
    },
    queue_recents: {
        id: "queue_recents",
        files: {
            "recents.cc": `void compta_recents(istream& in, ostream& out) {
    int N, T;
    if (in >> N >> T) {
        Queue<int> q;
        bool first = true;
        
        for (int i = 0; i < N; ++i) {
            int t;
            in >> t;
            q.push(t);
            
            // Evaluador extern caducant antics vells emmagatzemats d'espant 
            // que queden enlloc pel rang de temps i de Cua fora:
            while (!q.empty() && q.front() < t - T) {
                q.pop();
            }
            
            if (!first) out << " ";
            out << q.size(); // Mostra base actius vius
            first = false;
        }
        out << endl;
    }
}`
        },
        generateSteps: () => {
            return [
                { activeFile: "recents.cc", line: 3, description: "Inici Comptador Temporal (Sliding Window)! Provem configurant N=3 peticions limit i Temps T=10 lliure asimètric referencial de mostra.", terminalOutput: [], variables: { "N": "3", "T": "10", "q": "front [] back" } },
                { activeFile: "recents.cc", line: 8, description: "Es produeix primera petició en relleu temporal t=5 extret des del cin purament referencial enlligant directiu a variables i cap a push cua abstracte!", terminalOutput: ["Arriba connexió emesa seqüencial amb crides asimptòtiques: T=5"], variables: { "t": "5", "q": "front [5] back" } },
                { activeFile: "recents.cc", line: 14, description: "Verificador front < 5 - 10 (-5). Asimètric no es dispara en haver instància valides i empaquetada amb èxit totalment! Base intacta de Window viva asseveradora locals respectant temps caduca.", terminalOutput: [], variables: {} },
                { activeFile: "recents.cc", line: 19, description: "Processament size envia compte absolut viu! Cua acull una integrant d'actitud correcta instint iteratiu actuant pur extern respectiu de format consolar i resolut d'apunts.", terminalOutput: ["Elements en validesa històrica activa emesos: 1 completades"], variables: {} },
                { activeFile: "recents.cc", line: 8, description: "Entra segon temps local a t=10 referenciat per cua a esquemes històrics actius de back push...", terminalOutput: ["Arribada t=10 apunts respectius d'entrada passades..."], variables: { "t": "10", "q": "front [5, 10] back" } },
                { activeFile: "recents.cc", line: 14, description: "Test Window evalua: l'antiga sota lupa front(5). El tall màxim per T=10 referència 10-10 = 0 base abstractiva. Com no queda inferior, es passa a pur respectat sense pop completament actiu", terminalOutput: [], variables: {} },
                { activeFile: "recents.cc", line: 19, description: "Escriu mida actúal assolejant i verificant el size directiu d'èxit de temps respectat complet respecte local lliure a 2 instàncies actives absolutes pures", terminalOutput: ["Extracció actual 2 vius"], variables: {} },
                { activeFile: "recents.cc", line: 8, description: "Enorme assalt extern: salt abismal arribant al t=20 al terminal base de recents cua absolut instaurant-se endarrere actiu darrer element viu abstractiu formatiu d'exemples!", terminalOutput: ["Irrupció massiva entrada T=20 asimètica!"], variables: { "t": "20", "q": "front [5, 10, 20] back" } },
                { activeFile: "recents.cc", line: 14, description: "Alarma! La validació Sliding processa temps màxim legal darrer 20 - 10 = 10 asimètric local caduc absolut limit viu.", terminalOutput: ["Validant fons neteja caducitats front!"], variables: { "T_Mort": "< 10" } },
                { activeFile: "recents.cc", line: 15, description: "El front (5) compleix que es vell (és < 10 absolutes local)! L'empaquetem per netejar i consumim asseverant el `pop()`", terminalOutput: ["Emmagatzemant 5, descart pur a fora per limit! Netejant i passant al 10 asseverat."], variables: { "q": "front [10, 20] back" } },
                { activeFile: "recents.cc", line: 14, description: "Treu següent lupa front(10). El límit per rebuig <10 és abstracte fals! Resistent respecta viu referencial sencer. Simulacio tall bucle while lliscament...", terminalOutput: [], variables: {} },
                { activeFile: "recents.cc", line: 19, description: "Sol·licitud extreu final total d'actius Q.size() resolut darrer actual limit encertat amb restat de valors! Asimptotic resultat 2 respecte a l'emès llarg local.", terminalOutput: ["Estat respost absoluts vius recents locals = 2. Cadenes completes extretes: 1 2 2", "> Neteja OS desmemoria Pura instint."], variables: {} }
            ] as OOPStep[];
        }
    }
}
