#include <iostream>
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
}