#include <iostream>
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
}