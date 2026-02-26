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
                { activeFile: "main.cc", line: 10, description: "L'objecte 'd' executa una captura prèvia `.llegeix()` per preparar condicions.", terminalOutput: ["(El sistema roman aturat demanant Console Input)"], variables: { "d": "1/1/0", "n": "?" } },
                { activeFile: "data.cc", line: 21, description: "Al mètode, 'cin' llegeix ignorant char '/' i omple les components de l'objecte 'this'.", terminalOutput: ["28/02/2024"], variables: { "this": "->d" } },
                { activeFile: "data.cc", line: 22, description: "L'element actualitza variables en memòria. Fi del mètode de lectura.", terminalOutput: ["28/02/2024"], variables: { "this": "->d", "dia": "28", "mes": "2", "any": "2024" } },
                { activeFile: "main.cc", line: 11, description: "Condicional 'while' avalúa cert al extraure de cin el desplaçament requerit ('n').", terminalOutput: ["28/02/2024 1"], variables: { "d": "28/02/2024", "n": "1" } },
                { activeFile: "main.cc", line: 12, description: "S'invoca el mètode 'suma_dies(n)', passant l'enter al context exclusiu de 'd'.", terminalOutput: ["28/02/2024 1"], variables: { "d": "28/02/2024", "n": "1" } },
                { activeFile: "data.cc", line: 32, description: "S'executa clonació d'estat (*this) creant l'entitat local asimptòtica 'res'.", terminalOutput: ["28/02/2024 1"], variables: { "this": "->d", "dies": "1", "res": "28/02/2024" } },
                { activeFile: "data.cc", line: 34, description: "Operació abstracta modificant directament el dia iteratiu de 'res' (+1).", terminalOutput: ["28/02/2024 1"], variables: { "this": "->d", "dies": "1", "res": "29/02/2024" } },
                { activeFile: "data.cc", line: 10, description: "Ús de mètode avaluador limitador d'anys traspàs retornant el topall d'estabilitat del mes (29).", terminalOutput: ["28/02/2024 1"], variables: { "this": "->res", "res_retorn_dies": "29" } },
                { activeFile: "data.cc", line: 34, description: "El camp 'res.dia' es troba dins rang operatiu. Tancament de salts al Bucle matemàtic.", terminalOutput: ["28/02/2024 1"], variables: { "this": "->d", "dies": "1", "res": "29/02/2024" } },
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
                { activeFile: "main.cc", line: 8, description: "Comanda d'execució `./calc_racionals` al local shell per iniciar simulació.", terminalOutput: ["./calc_racionals"], variables: {} },
                { activeFile: "main.cc", line: 9, description: "Inicialitzem recurs Racional actiu 'r' usat en fase de captures temporal.", terminalOutput: ["./calc_racionals"], variables: {} },
                { activeFile: "main.cc", line: 10, description: "Incorporem la declaració de l'acumulador persistint ('acum') de càlculs C++.", terminalOutput: ["./calc_racionals"], variables: { "r": "Ref?", "acum": "Ref?" } },
                { activeFile: "racional.cc", line: 23, description: "Salt d'scope a 'Racional::Racional()' delegant variables a simplificadors.", terminalOutput: ["./calc_racionals"], variables: { "this": "->acum" } },
                { activeFile: "racional.cc", line: 15, description: "Garantitzem memòries locals fixant elements abstractes en 0 num i 1 den segurant control.", terminalOutput: ["./calc_racionals"], variables: { "this": "->acum", "num": "0", "den": "1" } },
                { activeFile: "main.cc", line: 13, description: "Tornant, l'objecte 'acum' resol execució `.llegeix()` cridant lectura d'origen estàndard.", terminalOutput: ["(Mode Consola Cin demant input inicial: '1/2')"], variables: { "r": "0/1", "acum": "0/1" } },
                { activeFile: "racional.cc", line: 28, description: "Flux a mètode 'llegeix()' enclou format d'acció exclusiu. La variable drecera descarta `/` extra.", terminalOutput: ["1/2"], variables: { "this": "->acum" } },
                { activeFile: "racional.cc", line: 29, description: "Extracció de constants referenciant mòduls directes per filtratge d'operativitat interna.", terminalOutput: ["1/2"], variables: { "this": "->acum", "n": "1", "d": "2" } },
                { activeFile: "racional.cc", line: 19, description: "Pre-factoritzador llegeix i redueix errors matemàtics adaptant directes subrutinades i variables.", terminalOutput: ["1/2"], variables: { "this": "->acum", "num": "1", "den": "2" } },
                { activeFile: "main.cc", line: 14, description: "Tornament d'stream: 'acum.escriu()' imprimeix instància inicial sense modificadors de crida.", terminalOutput: ["1/2"], variables: { "r": "0/1", "acum": "1/2" } },
                { activeFile: "main.cc", line: 17, description: "Bucle while(cin >> op) actua sobre loop extreient el char relacional directament en cadena (string '+').", terminalOutput: ["1/2", "+"], variables: { "acum": "1/2", "op": "+" } },
                { activeFile: "main.cc", line: 18, description: "S'executa fons 'r.llegeix()' avaluant el paràmetre volàtil 'r' via operatiu stream darrera l'anàlisi.", terminalOutput: ["1/2", "+", "(Espera valor numèric complet)"], variables: { "acum": "1/2", "op": "+", "r": "0/1" } },
                { activeFile: "racional.cc", line: 29, description: "Variables lliures acoplen a capturació 3/4 introduint paràmetre cec dins de memòria temporal blindada.", terminalOutput: ["3/4"], variables: { "this": "->r", "n": "3", "d": "4" } },
                { activeFile: "main.cc", line: 20, description: "Condicional orientat resol base del mode de crida direccional sobre string pre-capturat de subrútina (+).", terminalOutput: ["3/4"], variables: { "acum": "1/2", "op": "+", "r": "3/4" } },
                { activeFile: "main.cc", line: 21, description: "Acció invocada. La base 'acum' (.suma(r)) llança execució directriu passant l'invasor passiu exclusivament via argument.", terminalOutput: ["3/4"], variables: { "acum": "1/2", "op": "+", "r": "3/4" } },
                { activeFile: "racional.cc", line: 37, description: "A aïllament d'operador privat de creuada (->acum). Les instàncies asimètriques calculen sense dany (1*4+3*2).", terminalOutput: ["3/4"], variables: { "this(->acum)": "1/2", "B(->r)": "3/4" } },
                { activeFile: "racional.cc", line: 38, description: "Retorn constructor passiu processa Racional(10, 8) resolent el forjament i sortint instànciada directa en emissió.", terminalOutput: ["3/4"], variables: { "this(->acum)": "1/2", "result": "Racional(10, 8)" } },
                { activeFile: "racional.cc", line: 20, description: "Subcomponents deleguen a rutines (MCD) reduint complexitas base 10 i 8 depurades lliurades i seguritzades a 5/4.", terminalOutput: ["3/4"], variables: { "this(->acum)": "1/2", "result": "5/4" } },
                { activeFile: "main.cc", line: 21, description: "Sobreescriptura original final de variable 'acum', on nodes s'identifiquen resolts de desmemòries i el return pur lligant resultats globals.", terminalOutput: ["3/4"], variables: { "acum": "5/4", "op": "+", "r": "3/4" } },
                { activeFile: "main.cc", line: 27, description: "Darreres seqüències mostren la consola resolt pur per a externalitat '.escriu()' demostrant pur d'etapa complet avaluació '5/4'.", terminalOutput: ["3/4", "5/4"], variables: { "acum": "5/4", "op": "+", "r": "3/4" } },
                { activeFile: "main.cc", line: 17, description: "Verificació en condicional if fallida. Stream es buida trencat pel loop a final tancant l'operació asimptòticament de memòria assolejada.", terminalOutput: ["... (EOF tancant)", "> Programa finalitzat i processaments alliberats."], variables: {} },
            ] as OOPStep[];
        }
    },
    stack_reverse: {
        id: "stack_reverse",
        files: {
            "Makefile": `CXX = g++
CXX_FLAGS = -std=c++17

test: test_reverse
	@./test_reverse -ni

test_reverse: test_reverse.cc reverse.cc
	$(CXX) $(CXX_FLAGS) -o test_reverse test_reverse.cc reverse.cc`,
            "test_reverse.cc": `#define DOCTEST_CONFIG_IMPLEMENT_WITH_MAIN
#include "doctest.h"
#include <iostream>
using namespace std;

void reverse(istream& in, ostream& out);

TEST_CASE("dos elements") {
    istringstream sin("7 3");
    ostringstream sout;

    reverse(sin, sout);

    CHECK(sout.str() == "3 7\\n");
}`,
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
                { activeFile: "Makefile", line: 4, description: "Introduïm 'make test' directament al terminal per automatitzar la comprovació.", terminalOutput: ["$ make test", "g++ -std=c++17 -o test_reverse test_reverse.cc reverse.cc"], variables: {} },
                { activeFile: "test_reverse.cc", line: 8, description: "L'executable interactiu arrenca en silenci avaluant el primer bloc autònom definint 'dos elements'.", terminalOutput: ["$ make test", "g++ -std=c++17 -o test_reverse test_reverse.cc reverse.cc", "[doctest] doctest version is 2.4.11"], variables: {} },
                { activeFile: "test_reverse.cc", line: 9, description: "Doctest fabrica una entrada de dades artificial ('7 3') simulant un teclat escrit per l'humà i prepara la sortida sintètica on capturar.", terminalOutput: [], variables: { "sin": "istringstream", "sout": "ostringstream" } },
                { activeFile: "test_reverse.cc", line: 12, description: "La prova crida la teva solució 'reverse()', lliurant falsos canals com 'in' de lectura i 'out' d'escriptura.", terminalOutput: [], variables: {} },
                { activeFile: "reverse.cc", line: 7, description: "Saltant al teu codi: Inicieu una Pila (Stack) buida per encabir-hi enters, costat a costat de variable passatgera 'n'.", terminalOutput: [], variables: { "s": "[]", "n": "?" } },
                { activeFile: "reverse.cc", line: 9, description: "Comença la lectura i en extreure el codi es rep el valor abocat primer de la prova, llegint-se el 7.", terminalOutput: [], variables: { "s": "[]", "n": "7" } },
                { activeFile: "reverse.cc", line: 10, description: "Immediat empilament damunt top (base).", terminalOutput: [], variables: { "s": "[7] <- top", "n": "7" } },
                { activeFile: "reverse.cc", line: 9, description: "La lectura contínua actua abans que faltin fluxos al teclat artificial. Entra l'últim proveït asimptòtic de seqüència: 3", terminalOutput: [], variables: { "s": "[7] <- top", "n": "3" } },
                { activeFile: "reverse.cc", line: 10, description: "Inicidem damunt d'anterior! Segon valor '3' trepitja directament col·locat en mode LIFO base format capdamunt.", terminalOutput: [], variables: { "s": "[7, 3] <- top", "n": "3" } },
                { activeFile: "reverse.cc", line: 9, description: "El validador doctest detecta absència i final de lectures. Sense paràmetres, el cicle col·lapsa ometent interrupció externa.", terminalOutput: [], variables: { "s": "[7, 3] <- top", "n": "3" } },
                { activeFile: "reverse.cc", line: 14, description: "A priori ens garantitzem d'entrar bucle mentre quedi memòria a extreure o elements retinguts vius.", terminalOutput: [], variables: { "s": "[7, 3] <- top" } },
                { activeFile: "reverse.cc", line: 15, description: "Enviat out captura dalt del cim (.top): L'emès element base 3 abandona l'habitació abocant el contingut!", terminalOutput: ["Sortiment passiu capturat externament: 3"], variables: { "s": "[7, 3] <- top" } },
                { activeFile: "reverse.cc", line: 16, description: "Executem depurador desmemoria i .pop() aniquila la presència viva d'un 3; assovistant el vell element!", terminalOutput: [], variables: { "s": "[7] <- top" } },
                { activeFile: "reverse.cc", line: 14, description: "Resta comprovada presència numèrica un cop validat.", terminalOutput: [], variables: { "s": "[7] <- top" } },
                { activeFile: "reverse.cc", line: 15, description: "Consum directe enviat a 'out' la presència activa '7'!", terminalOutput: ["Sortiment capturat concatenat: 3 7"], variables: { "s": "[7] <- top" } },
                { activeFile: "reverse.cc", line: 16, description: "Extirpat per .pop! Resolent el fons complet.", terminalOutput: [], variables: { "s": "[]" } },
                { activeFile: "reverse.cc", line: 14, description: "Ens constata .empty() satisfet absolut! Ja pur sense dades no ingressa de cap al següent passatge de C++.", terminalOutput: [], variables: { "s": "[]" } },
                { activeFile: "reverse.cc", line: 19, description: "La funció envia resolutiva asimètrica formatar el retorn del tab salt de línia '\\\\n' passiu complint.", terminalOutput: ["Sortiment capturat resolt al string: 3 7\\\\n"], variables: { "s": "[]" } },
                { activeFile: "test_reverse.cc", line: 14, description: "Retorn asimètric saltant a Doctest pur base! Emparella resposta calculada contra allò emmagatzemat estricnament correcte '3 7\\\\n'. Satisfà idènticament!", terminalOutput: [], variables: { "sout.str()": "3 7\\n" } },
                { activeFile: "test_reverse.cc", line: 15, description: "Success report. Terminat execució iterativa validat correctament i asimptòtic de dades d'entorn al teu favor.", terminalOutput: ["===============================================================================", "SUCCESS: reverse.cc passed 1 test cases.", "[doctest] Status: SUCCESS!"], variables: {} }
            ] as OOPStep[];
        }
    },
    stack_parentesis: {
        id: "stack_parentesis",
        files: {
            "Makefile": `CXX = g++
CXX_FLAGS = -std=c++17

test: test_parentesis
	@./test_parentesis -ni

test_parentesis: test_parentesis.cc parentesis.cc
	$(CXX) $(CXX_FLAGS) -o test_parentesis test_parentesis.cc parentesis.cc`,
            "test_parentesis.cc": `#define DOCTEST_CONFIG_IMPLEMENT_WITH_MAIN
#include "doctest.h"
#include <iostream>
using namespace std;

void parentesis(istream& in, ostream& out);

TEST_CASE("seqüència correcta amb claudàtors") {
    istringstream sin("(()[[]]).");
    ostringstream sout;

    parentesis(sin, sout);

    CHECK(sout.str() == "Correcte\\n");
}`,
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
                { activeFile: "Makefile", line: 4, description: "Introduïm 'make test' al terminal per verificar la solució automàticament.", terminalOutput: ["$ make test", "g++ -std=c++17 -o test_parentesis test_parentesis.cc parentesis.cc"], variables: {} },
                { activeFile: "test_parentesis.cc", line: 10, description: "Doctest inicia el robot avaluador pel cas 'seqüència correcta amb claudàtors'.", terminalOutput: ["$ make test", "g++ -std=c++17 -o test_parentesis test_parentesis.cc parentesis.cc", "[doctest] doctest version is 2.4.11"], variables: {} },
                { activeFile: "test_parentesis.cc", line: 11, description: "S'injecta la línia de caràcters '(()[[]]).' per l'stream d'entrada simulant un usuari i es prepara la sortida de captura.", terminalOutput: [], variables: { "sin": "istringstream", "sout": "ostringstream" } },
                { activeFile: "test_parentesis.cc", line: 14, description: "Es crida la nostra funció pare per validar si aprova el control automàtic de qualitat.", terminalOutput: [], variables: {} },
                { activeFile: "parentesis.cc", line: 7, description: "Aterrem al codi: Inicieu una Pila (Stack) buida dissenyada per encabir lletres de caràcter (char).", terminalOutput: [], variables: { "s": "[]", "pos": "1" } },
                { activeFile: "parentesis.cc", line: 11, description: "Mentre tinguem dades a llegir i no sigui la fi per delimitador de punt ('.'), extreiem el primer caràcter '('.", terminalOutput: [], variables: { "s": "[]", "c": "(", "pos": "1" } },
                { activeFile: "parentesis.cc", line: 12, description: "Operador comprova que estem tractant amb una obertura '('.", terminalOutput: [], variables: { "s": "[]", "c": "(", "pos": "1" } },
                { activeFile: "parentesis.cc", line: 13, description: "S'empeny (push) directament al fons actiu de la nostra Pila de memòria.", terminalOutput: [], variables: { "s": "[(] <- top", "c": "(", "pos": "1" } },
                { activeFile: "parentesis.cc", line: 28, description: "S'avança la instància d'índex per mesurar pas (pos = 2).", terminalOutput: [], variables: { "s": "[(]", "c": "(", "pos": "2" } },
                { activeFile: "parentesis.cc", line: 11, description: "Nova extracció iterativa pel teclat robot: Atrapat el segon paràntesi obridor '('.", terminalOutput: [], variables: { "s": "[(]", "c": "(", "pos": "2" } },
                { activeFile: "parentesis.cc", line: 13, description: "Més del mateix: S'apila immediatament dalt de tot previ.", terminalOutput: [], variables: { "s": "[(, (] <- top", "c": "(", "pos": "2" } },
                { activeFile: "parentesis.cc", line: 28, description: "El motor continua comptant l'historial (pos = 3).", terminalOutput: [], variables: { "s": "[(, (]", "c": "(", "pos": "3" } },
                { activeFile: "parentesis.cc", line: 11, description: "Reprenem el tercer caràcter entregat pel Doctest: ')'! (Tancador).", terminalOutput: [], variables: { "s": "[(, (] <- top", "c": ")", "pos": "3" } },
                { activeFile: "parentesis.cc", line: 16, description: "Aquest cop detectem tancament en el bloc else-if.", terminalOutput: [], variables: { "s": "[(, (] <- top", "c": ")" } },
                { activeFile: "parentesis.cc", line: 17, description: "La pila no està absolutament buida, així que evadem condició fallida per continuar resolent correctament.", terminalOutput: [], variables: { "s": "[(, (] <- top", "c": ")" } },
                { activeFile: "parentesis.cc", line: 21, description: "Mirem qui descansa a dalt de tot de l'Stack. El .top() ens recupera l'últim empilat '(' sense destruir-lo.", terminalOutput: [], variables: { "s": "[(, (] <- top", "top": "(" } },
                { activeFile: "parentesis.cc", line: 22, description: "L'esquema d'emparellament valida el Matching: Tenim caràcter entrada ')' i top '(' -> Parella detectada formalment!.", terminalOutput: [], variables: { "c": ")", "top": "(" } },
                { activeFile: "parentesis.cc", line: 23, description: "Per concloure la reconciliació asimètrica, usem el .pop() matant els residuals lliurats i fent minvar l'Stack!", terminalOutput: [], variables: { "s": "[(] <- top" } },
                { activeFile: "parentesis.cc", line: 28, description: "Evolucionem final i pugem instàncies amunt (pos = 4).", terminalOutput: [], variables: { "s": "[(] <- top", "pos": "4" } },
                { activeFile: "parentesis.cc", line: 11, description: "Fem pas ràpid obrint claudàtors simètrics de l'entrada '[[]]'. Les anidacions es destrueixen seguidament idèntiques als parentesis. Es va buidant ràpid.", terminalOutput: ["S'han llegit i tancat '[', '[', ']', ']' satisfactòriament i s'han fet pops"], variables: { "s": "[(] <- top", "pos": "8", "c": "]" } },
                { activeFile: "parentesis.cc", line: 11, description: "I el darrer caràcter recollit fora del claudàtor final és un ')', tancant literal la cadena base original d'arrel.", terminalOutput: ["Últim parell rebut per tancar l'expressió primària ')'"], variables: { "s": "[(] <- top", "pos": "9", "c": ")" } },
                { activeFile: "parentesis.cc", line: 23, description: "El .pop() s'aplica i resol per pur tot format llistat quedat com caduca abstracta buidada pura complet.", terminalOutput: [], variables: { "s": "[]", "pos": "9" } },
                { activeFile: "parentesis.cc", line: 11, description: "El bloc llegeix finalment i descobreix el '.' limitador, tallant d'arrel la condició de lectura del bucle cin de forma instintiva.", terminalOutput: [], variables: { "s": "[]", "c": "." } },
                { activeFile: "parentesis.cc", line: 31, description: "Testejos directius avalúen s.empty(); ja buida i assegurant absència d'elements col·lapsats oblidats i asimètrics!", terminalOutput: [], variables: { "s": "[]" } },
                { activeFile: "parentesis.cc", line: 31, description: "S'emiteix la línia de format correcte pur al corrent de captura out del robot Doctest.", terminalOutput: ["Sortiment passiu escriptura: 'Correcte\\n'"], variables: { "s": "[]" } },
                { activeFile: "test_parentesis.cc", line: 16, description: "El robot captura el flux. La teva funció respon: 'Correcte\\\\n'. Compara a les proves mestres de l'Avaluador, coincidència total.", terminalOutput: [], variables: { "sout.str()": "Correcte\\n" } },
                { activeFile: "test_parentesis.cc", line: 17, description: "Success report. Verificat idènticament pel marc! Es poden passar totes les altres 29 regles de joc superades per certs!", terminalOutput: ["===============================================================================", "SUCCESS: parentesis.cc passed tests.", "[doctest] Status: SUCCESS!"], variables: {} }
            ] as OOPStep[];
        }
    },
    stack_recursivitat: {
        id: "stack_recursivitat",
        files: {
            "Makefile": `CXX = g++
CXX_FLAGS = -std=c++17

test: test_recursivitat
	@./test_recursivitat -ni

test_recursivitat: test_recursivitat.cc recursivitat.cc
	$(CXX) $(CXX_FLAGS) -o test_recursivitat test_recursivitat.cc recursivitat.cc`,
            "test_recursivitat.cc": `#define DOCTEST_CONFIG_IMPLEMENT_WITH_MAIN
#include "doctest.h"
#include <iostream>
using namespace std;

void escriu(int n, ostream& out);

TEST_CASE("n = 2") {
    ostringstream sout;

    escriu(2, sout);

    CHECK(sout.str() == " 2 1 1");
}`,
            "recursivitat.cc": `#include <iostream>
using namespace std;
#include "stack.hh"
using namespace pro2;

void escriu(int n, ostream& out) {
    Stack<int> s;
    s.push(n);

    // Iterant contínuament fins haver desapilat tota acció virtual
    while (!s.empty()) {
        int v = s.top();
        s.pop();
        
        if (v > 0) {
            out << ' ' << v;
            // El simulador real apila dreta i després esquerra. Aquí ho
            // adaptem a la recursivitat pura de dalt a baix iterativa.
            s.push(v - 1);
            s.push(v - 1);
        }
    }
}`
        },
        generateSteps: () => {
            return [
                { activeFile: "Makefile", line: 4, description: "Introduïm 'make test' al terminal per automatitzar la comprovació iterativa.", terminalOutput: ["$ make test", "g++ -std=c++17 -o test_recursivitat test_recursivitat.cc recursivitat.cc"], variables: {} },
                { activeFile: "test_recursivitat.cc", line: 8, description: "S'inicia el programa ocult de prova avaluadora pel cas particular de 'n = 2'.", terminalOutput: ["$ make test", "g++ -std=c++17 -o test_recursivitat test_recursivitat.cc recursivitat.cc", "[doctest] doctest version is 2.4.11"], variables: {} },
                { activeFile: "test_recursivitat.cc", line: 9, description: "Aquest exercici no llegeix seqüències ('in') per dades, així que simplement creem un 'sout' on el nostre codi pugui escriure els números directament.", terminalOutput: [], variables: { "sout": "ostringstream" } },
                { activeFile: "test_recursivitat.cc", line: 11, description: "El validador crida la teva solució injectant directament un 2 i passant-li la línia de recollida de resultats 'sout'.", terminalOutput: [], variables: {} },
                { activeFile: "recursivitat.cc", line: 7, description: "Aterrem a la nostra funció escriu(2). Creem una Pila buida i al primer torn hi guardem per obligació el valor inicial!", terminalOutput: [], variables: { "n": "2", "s": "[]" } },
                { activeFile: "recursivitat.cc", line: 8, description: "Inicidem el número 2 (la primera crida recursiva virtual si la imaginem com l'OS del PC) a dins l'Stack.", terminalOutput: [], variables: { "s": "[2] <- top", "n": "2" } },
                { activeFile: "recursivitat.cc", line: 11, description: "Mentre l'Stack no quedi buit vol dir que encara tenim funcions recursives asimètriques programades i no resoltes pendents per processar.", terminalOutput: [], variables: { "s": "[2] <- top" } },
                { activeFile: "recursivitat.cc", line: 12, description: "Mirem el sostre .top(). És l'última fulla o instància que ens crida. Ara val '2'.", terminalOutput: [], variables: { "s": "[2] <- top", "v": "2" } },
                { activeFile: "recursivitat.cc", line: 13, description: "La descartem amb .pop() ja que ens en farem càrrec ara mateix nosaltres.", terminalOutput: [], variables: { "s": "[]", "v": "2" } },
                { activeFile: "recursivitat.cc", line: 15, description: "Com v és més gran que zero (2 > 0), el nostre programa continua viu i pot fer coses.", terminalOutput: [], variables: { "s": "[]", "v": "2" } },
                { activeFile: "recursivitat.cc", line: 16, description: "L'Ordre d'enunciat demana imprimir l'espai el propi número processat avui (v = 2). Ho bolquem a l'out.", terminalOutput: ["Captura robot: ' 2'"], variables: { "s": "[]", "v": "2" } },
                { activeFile: "recursivitat.cc", line: 19, description: "Atenció! Una funció f(2) al paper teòric obre Dues sub-branques cridant-se a si mateixa repetit com f(2-1).", terminalOutput: [], variables: { "s": "[]", "v": "2" } },
                { activeFile: "recursivitat.cc", line: 20, description: "Traduït iterativament com que fem pop(). Hi col·loquem DOS 1 a la base. Un darrere de l'altre simulats paral·lels de forma seqüencial.", terminalOutput: [], variables: { "s": "[1, 1] <- top", "v": "2" } },
                { activeFile: "recursivitat.cc", line: 11, description: "S'acaba el procés virtual de l'antic i desaparegut pare 2. Tornem al bucle observant quines peticions noves estan amuntegades a l'espera!", terminalOutput: [], variables: { "s": "[1, 1] <- top" } },
                { activeFile: "recursivitat.cc", line: 12, description: "Traiem només el capdamunt del top (representa la subrutina f(1) superior primera prioritària asimètrica de l'esquerra de branques teòriques iterades).", terminalOutput: [], variables: { "s": "[1, 1] <- top", "v": "1" } },
                { activeFile: "recursivitat.cc", line: 13, description: "Fem pop i extreiem aquest fill 1 fora lliurant accés asimptòtic base de treball.", terminalOutput: [], variables: { "s": "[1] <- top", "v": "1" } },
                { activeFile: "recursivitat.cc", line: 16, description: "Toca imprimir-lo. S'envia l'imprès concatenat: 1.", terminalOutput: ["Concatenació pas sortida: ' 2 1'"], variables: { "s": "[1] <- top", "v": "1" } },
                { activeFile: "recursivitat.cc", line: 20, description: "I compte que aquest node subrutina val 1 (v>0), pel que també li pertoca engendrar per simetria dos fills '0' de zeros! Així ho mana el paper (1-1).", terminalOutput: [], variables: { "s": "[1, 0, 0] <- top", "v": "1" } },
                { activeFile: "recursivitat.cc", line: 12, description: "Iterant de nou ràpid... Surt del top el primer '0' afegit frescament d'avaluació en silenci bucle...", terminalOutput: [], variables: { "s": "[1, 0, 0] <- top", "v": "0" } },
                { activeFile: "recursivitat.cc", line: 13, description: "El retirem. (v=0). El codi passa a mirar condicional > 0, falseja asimptòtic, i sense fer absolutament res salta de nou. La Pila neteja subrutines mortes instantàniament netes al Call OS sense palles mentals.", terminalOutput: [], variables: { "s": "[1, 0] <- top", "v": "0" } },
                { activeFile: "recursivitat.cc", line: 13, description: "Fem pas ràpid, treu i valida exactament la mateixa defacta història idèntica per l'altre bessó en silenci, morint tots dos zeros.", terminalOutput: [], variables: { "s": "[1] <- top" } },
                { activeFile: "recursivitat.cc", line: 12, description: "Súper netejat tot, reprenem on anàvem! Toca el torn a la llista d'activitats pendents reals de l'altre germà 1 original, arrel de tot el procés esperant adormida el seu torn respectiu a la base top!", terminalOutput: [], variables: { "s": "[1] <- top", "v": "1" } },
                { activeFile: "recursivitat.cc", line: 13, description: "Ho traiem asseverant memòria global pura absolut final cap avern de neteja.", terminalOutput: [], variables: { "s": "[]", "v": "1" } },
                { activeFile: "recursivitat.cc", line: 16, description: "L'imprimim per donar pas concatenat per últim cop. Tenim un full pur complet imprimit seqüencial ' 2 1 1'.", terminalOutput: ["Extracció final per Doctest enviada passiva: ' 2 1 1'"], variables: { "s": "[]", "v": "1" } },
                { activeFile: "recursivitat.cc", line: 20, description: "El germà posa en instint base dos nous '0', que automàticament seran consumits al top iterativament el·liminant memòria ràpida a condició v>0 tallada morta.", terminalOutput: [], variables: { "s": "[0, 0] -> []", "v": "1" } },
                { activeFile: "recursivitat.cc", line: 11, description: "A priori ens garantitzem haver completat cada branca i cada simulació de subrutines manuals virtualitzades! El buit resol el retorn final.", terminalOutput: [], variables: { "s": "[]" } },
                { activeFile: "test_recursivitat.cc", line: 13, description: "Emmagatzemant respostes el marc de l'arxiu salta de retorn al test mestre principal en C++ exterior local de crida inicial de programa original.", terminalOutput: [], variables: {} },
                { activeFile: "test_recursivitat.cc", line: 13, description: "Doctest valora igualtat: L'string atrapat per nosaltres calculat pur iteratiu s'iguala directament a l'oficial ' 2 1 1'. Clavat a la perfecció. Exit global asimètric complet.", terminalOutput: ["===============================================================================", "SUCCESS: recursivitat.cc passed 1 test cases.", "[doctest] Status: SUCCESS!"], variables: {} }
            ] as OOPStep[];
        }
    },
    queue_patata: {
        id: "queue_patata",
        files: {
            "Makefile": `CXX = g++
CXX_FLAGS = -std=c++17

test: test_patata_calenta
	@./test_patata_calenta -ni

test_patata_calenta: test_patata_calenta.cc patata_calenta.cc
	$(CXX) $(CXX_FLAGS) -o test_patata_calenta test_patata_calenta.cc patata_calenta.cc`,
            "test_patata_calenta.cc": `#define DOCTEST_CONFIG_IMPLEMENT_WITH_MAIN
#include "doctest.h"
#include <iostream>
using namespace std;

void patata_calenta(istream& in, ostream& out);

TEST_CASE("N=3, k=1") {
    istringstream sin("3 1");
    ostringstream sout;

    patata_calenta(sin, sout);

    CHECK(sout.str() == "2 1\\nSupervivent: 3\\n");
}`,
            "patata.cc": `#include <iostream>
using namespace std;
#include "queue.hh"
using namespace pro2;

void patata_calenta(istream& in, ostream& out) {
    int N, k;
    if (in >> N >> k) {
        Queue<int> q;
        for (int i = 1; i <= N; ++i) {
            q.push(i); // Noms i gent dins del joc
        }
        
        bool first = true;
        while (q.size() > 1) { // Fins que sobrevisqui només 1 individu
            // Fem K girs cap a fi de la cua
            for (int i = 0; i < k; ++i) {
                int front = q.front();
                q.pop();
                q.push(front);
            }
            
            if (!first) out << " ";
            // La pobra anima davantera rep l'expulsió immediata
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
                { activeFile: "Makefile", line: 4, description: "Introduïm 'make test' al terminal. La competició comença!", terminalOutput: ["$ make test", "g++ -std=c++17 -o test_patata_calenta test_patata_calenta.cc patata.cc"], variables: {} },
                { activeFile: "test_patata_calenta.cc", line: 8, description: "Doctest entra i busca el test case on hi haran 3 nens (N=3) i la patata farà 1 salt rotacional en cada volta (K=1).", terminalOutput: ["$ make test", "g++ -std=c++17 -o test_patata_calenta patata_calenta.cc test_patata_calenta.cc", "[doctest] doctest version is 2.4.11"], variables: {} },
                { activeFile: "test_patata_calenta.cc", line: 9, description: "Es genera la seqüència oculta de prova i s'estableix un recipient buit de sortida 'sout'.", terminalOutput: [], variables: { "sin": "istringstream", "sout": "ostringstream" } },
                { activeFile: "test_patata_calenta.cc", line: 12, description: "Cridem la teva solució 'patata_calenta()', passant-li la línia robòtica preparada.", terminalOutput: [], variables: {} },
                { activeFile: "patata.cc", line: 7, description: "Inici simulació DINS el teu codi! S'instancia el lector inicial amb N=3 i K=1 del flux.", terminalOutput: [], variables: { "N": "3", "k": "1", "q": "front [] back" } },
                { activeFile: "patata.cc", line: 10, description: "Els iteradors preparen el joc i afegeixen successivament els 3 nens cap a la cua en línia base.", terminalOutput: [], variables: { "q": "front [1, 2, 3] back", "N": "3", "k": "1" } },
                { activeFile: "patata.cc", line: 14, description: "El validador comprova quanten queden. Hi ha més d'un amic actiu? (size > 1). Sí, en són 3, per tant arrenca el bucle rodador d'estrés!", terminalOutput: [], variables: { "q": "front [1, 2, 3] back" } },
                { activeFile: "patata.cc", line: 16, description: "La patata farà tants salts com k (en el nostre cas només 1). Agafarem l'amic d'al davant, el retirarem temporalment...", terminalOutput: [], variables: { "q": "front [1, 2, 3] back" } },
                { activeFile: "patata.cc", line: 17, description: "Traiem l''1' del cap de cua...", terminalOutput: [], variables: { "q": "front [2, 3] back", "front": "1" } },
                { activeFile: "patata.cc", line: 19, description: "I corre cap enrere ràpid posant-se el final de la línia. El cercle s'ha mogut sencer!", terminalOutput: ["La patata fa 1 cop de salt..."], variables: { "q": "front [2, 3, 1] back" } },
                { activeFile: "patata.cc", line: 25, description: "Els girs ordenats K s'acaben. Tragèdia imminent asimetríca! Aquell pobre nen del capdavant ha estat atrapat per la patata final!", terminalOutput: [], variables: { "q": "front [2, 3, 1] back" } },
                { activeFile: "patata.cc", line: 26, description: "L'escupim per l'out: el jugador '2'. Ell mor!", terminalOutput: ["Sortiment actiu del primer eliminat!"], variables: { "q": "front [2, 3, 1] back" } },
                { activeFile: "patata.cc", line: 27, description: "Per descomptat el buidem amb depriment del grup (.pop) asseverant la seva aniquilació.", terminalOutput: [], variables: { "q": "front [3, 1] back" } },
                { activeFile: "patata.cc", line: 14, description: "Retorna cap a dalt, el size segueix asssent superior a 1 perquè encara viuen el 3 i l'1. Preparats de nou...", terminalOutput: [], variables: { "q": "front [3, 1] back" } },
                { activeFile: "patata.cc", line: 16, description: "Salt únic rotacional iteratiu pur!", terminalOutput: [], variables: { "q": "front [3, 1] back" } },
                { activeFile: "patata.cc", line: 17, description: "El 3 agafa el frontal per la retirada momentània...", terminalOutput: [], variables: { "q": "front [1] back", "front": "3" } },
                { activeFile: "patata.cc", line: 19, description: "Més del mateix. Torna a l'equador del darrere passant-se la patata un darrer torn més.", terminalOutput: [], variables: { "q": "front [1, 3] back" } },
                { activeFile: "patata.cc", line: 25, description: "I el que havia fugit a l'inici, esclata! La sortida ens crida l''1'.", terminalOutput: ["Expulsió del següent desgraciat: l' '1'"], variables: { "q": "front [1, 3] back" } },
                { activeFile: "patata.cc", line: 27, description: "Aquest abandona el món destruit literal per memòria del .pop!", terminalOutput: [], variables: { "q": "front [3] back" } },
                { activeFile: "patata.cc", line: 14, description: "Es valora (size() > 1)? FALS asimptòtic. Sol en queda UN. I trenca el bucle.", terminalOutput: ["Fi del joc. Un únic lluitador dret."], variables: { "q": "front [3] back" } },
                { activeFile: "patata.cc", line: 31, description: "Emet final la victòria assignda capturant base supervivència pur .front() absolut encertat de terminal!", terminalOutput: ["Emisari consolar tancament: respostes finals: 2 1", "Supervivent: 3\\\\n"], variables: { "q": "front [3]" } },
                { activeFile: "test_patata_calenta.cc", line: 14, description: "Finalitzem la fase del Doctest, verificant que estigui '2 1\\\\nSupervivent: 3\\\\n'. Èxit rodó rotacional! Complet amb bona nota el problema!", terminalOutput: ["===============================================================================", "SUCCESS: patata_calenta.cc passed 1 test cases.", "[doctest] Status: SUCCESS!"], variables: {} }
            ] as OOPStep[];
        }
    },
    queue_recents: {
        id: "queue_recents",
        files: {
            "Makefile": `CXX = g++
CXX_FLAGS = -std=c++17

test: test_compta_recents
	@./test_compta_recents -ni

test_compta_recents: test_compta_recents.cc compta_recents.cc
	$(CXX) $(CXX_FLAGS) -o test_compta_recents test_compta_recents.cc compta_recents.cc`,
            "test_compta_recents.cc": `#define DOCTEST_CONFIG_IMPLEMENT_WITH_MAIN
#include "doctest.h"
#include <iostream>
using namespace std;

void compta_recents(istream& in, ostream& out);

TEST_CASE("frontera exacta de la finestra") {
    istringstream sin("3 10\\n0 10 20");
    ostringstream sout;

    compta_recents(sin, sout);

    CHECK(sout.str() == "1 2 2\\n");
}`,
            "recents.cc": `#include <iostream>
using namespace std;
#include "queue.hh"
using namespace pro2;

void compta_recents(istream& in, ostream& out) {
    int N, T;
    if (in >> N >> T) {
        Queue<int> q;
        bool first = true;
        
        for (int i = 0; i < N; ++i) {
            int t;
            in >> t;
            q.push(t);
            
            // Evaluador extern caducant peticions antigues fora de la finestra
            while (!q.empty() && q.front() < t - T) {
                q.pop();
            }
            
            if (!first) out << " ";
            out << q.size(); // Mostra quants en queden de vius (size)
            first = false;
        }
        out << endl;
    }
}`
        },
        generateSteps: () => {
            return [
                { activeFile: "Makefile", line: 4, description: "Cridem l'automatització amb el 'make test'.", terminalOutput: ["$ make test", "g++ -std=c++17 -o test_compta_recents test_compta_recents.cc recents.cc"], variables: {} },
                { activeFile: "test_compta_recents.cc", line: 8, description: "Doctest obre el cas d'estudi preparat que emularà el teclat d'un humà i on la finestra (T) durarà 10, entrant N=3 elements: el '0', el '10' i el '20'.", terminalOutput: ["$ make test", "g++ -std=c++17 -o test_compta_recents recents.cc test_compta_recents.cc", "[doctest] doctest version is 2.4.11"], variables: {} },
                { activeFile: "test_compta_recents.cc", line: 9, description: "S'organitzen els fils falsos (sout, sin).", terminalOutput: [], variables: { "sin": "istringstream", "sout": "ostringstream" } },
                { activeFile: "test_compta_recents.cc", line: 12, description: "Es llança a executar el teu codi!", terminalOutput: [], variables: {} },
                { activeFile: "recents.cc", line: 7, description: "Inici Comptador Temporal (Sliding Window)! S'inicia amb compte de nens a N=3 i la finestra estricta de caducitat a T=10.", terminalOutput: [], variables: { "N": "3", "T": "10", "q": "front [] back" } },
                { activeFile: "recents.cc", line: 12, description: "S'inicia el bucle que iterarà exclusivament N cops (hi hauran 3 números al cin). Ara a per la t=0.", terminalOutput: [], variables: { "N": "3", "T": "10", "q": "front [] back" } },
                { activeFile: "recents.cc", line: 14, description: "Es llegeix el primer element d'arribada (t=0) i s'emmagatzema a base instint de Cua cap a dins.", terminalOutput: ["Arriba la primera connexió: t=0"], variables: { "t": "0", "q": "front [0] back" } },
                { activeFile: "recents.cc", line: 18, description: "Verificador front comprova si el més antic emmagatzemat hauria d'estar mort. Condició: front (0) < t(0) - T(10) -> (0 < -10)? No, per tant la petició 0 sobreviu en la finestra.", terminalOutput: [], variables: { "q": "front [0] back" } },
                { activeFile: "recents.cc", line: 23, description: "Quantes en tenim de vàlides recentment? Mirem quants queden actius vius un cop extirpats els morts, i ho publiquem = 1!", terminalOutput: ["Sortiment d'actius inicial encertat actiu: '1'"], variables: { "q": "front [0] back" } },
                { activeFile: "recents.cc", line: 12, description: "Torna a arrencar el segon pas del For. Ve un altre número en cua d'arribada!", terminalOutput: [], variables: { "q": "front [0] back" } },
                { activeFile: "recents.cc", line: 14, description: "Agafa l'entrada t=10! Apilem immediat.", terminalOutput: ["El segon número entra al tall: t=10"], variables: { "t": "10", "q": "front [0, 10] back" } },
                { activeFile: "recents.cc", line: 18, description: "Alerta Window evalua caducats mirant el rei de sota el front(). Mida frontera: t(10) - T(10) = 0 limit exclusiu abstracte. Avaluem: 0 < 0? No, és just igual a la frontera però inferior no pas! Es salva per un pèl!", terminalOutput: [], variables: { "q": "front [0, 10] back" } },
                { activeFile: "recents.cc", line: 23, description: "Escrivim quantes queden vives sense morir de forma activa. Són dues ara! En tenim 2.", terminalOutput: ["Mida actual de vius enviat concatenador cap a consola: ' 2'"], variables: { "q": "front [0, 10] back" } },
                { activeFile: "recents.cc", line: 12, description: "Darrer bloc! L'últim número espera ser processat. Iteració final!", terminalOutput: [], variables: { "q": "front [0, 10] back" } },
                { activeFile: "recents.cc", line: 14, description: "Entrada robada terminal darrera a t=20!", terminalOutput: ["Ultima connexió en salt abismal t=20"], variables: { "t": "20", "q": "front [0, 10, 20] back" } },
                { activeFile: "recents.cc", line: 18, description: "La validació Sliding mira antics. Ara el marge perillos caduc ha canviat dur a t(20) - T(10) = 10 asimètric local caduc. Mirem si hi ha morts pel front de la cua!", terminalOutput: ["Calculant neteja sobre < 10"], variables: { "q": "front [0, 10, 20] back" } },
                { activeFile: "recents.cc", line: 19, description: "Alarma! El front (0) compleix finalment que es vell i està fora comtal (< 10 absolutes local)! Es mor i pop!", terminalOutput: ["El nombre '0' ha passat els limitadors antics fora finestra, aplicat descart pur."], variables: { "q": "front [10, 20] back" } },
                { activeFile: "recents.cc", line: 18, description: "El while encara dura i mira el següent per si de cas! Lupa front a (10). Avalua si 10 < 10. FALS de front resistent. Es sobreviu!", terminalOutput: [], variables: { "q": "front [10, 20] back" } },
                { activeFile: "recents.cc", line: 23, description: "I compte quants queden actius realment un cop netejada l'antiguitat. L'anterior ens ha dit que només en queden vius 2 de les 3 vistes actives.", terminalOutput: ["Mida enviada pura com a darrer concatenat base: ' 2'"], variables: { "q": "front [10, 20] back" } },
                { activeFile: "recents.cc", line: 26, description: "El Bucle acaba. Tanquem el Joc net i segur enviant un salt de línia al validador final.", terminalOutput: ["Processament absolut d'assignacions iteradores satisfet."], variables: { "q": "front [10, 20] back" } },
                { activeFile: "test_compta_recents.cc", line: 14, description: "Validador comprova que efectivament doni '1 2 2\\\\n'. Resultat exitós asseverant OS respectiu emès sense interrupcions humanes d'EOF!", terminalOutput: ["===============================================================================", "SUCCESS: compta_recents.cc passed 1 test cases.", "[doctest] Status: SUCCESS!"], variables: {} }
            ] as OOPStep[];
        }
    }
}
