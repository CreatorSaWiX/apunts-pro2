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
    }
}
