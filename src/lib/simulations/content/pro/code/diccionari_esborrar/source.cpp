#include <iostream>
#include <string>
#include <stdexcept>
using namespace std;

template <typename Clau, typename Info>
class Diccionari {
private:
    struct Node {
        Clau clau;
        Info info;
        Node* fesq;
        Node* fdre;
        Node(const Clau& c, const Info& i, Node* fe = nullptr, Node* fd = nullptr)
            : clau(c), info(i), fesq(fe), fdre(fd) { }
    };

    int n;
    Node* arrel;

    static void assignar(Node*& p, const Clau& clau, const Info& info, int& n) {
        if (p) {
            if (clau < p->clau) assignar(p->fesq, clau, info, n);
            else if (clau > p->clau) assignar(p->fdre, clau, info, n);
            else p->info = info;
        } else {
            p = new Node(clau, info);
            ++n;
        }
    }

    static Node* esborrar_minim(Node*& p) {
        if (p->fesq) return esborrar_minim(p->fesq);
        Node* q = p;
        p = p->fdre;
        return q;
    }

    static void esborrar(Node*& p, const Clau& clau, int& n) {
        if (!p) return;
        if (clau < p->clau) esborrar(p->fesq, clau, n);
        else if (clau > p->clau) esborrar(p->fdre, clau, n);
        else {
            Node* q = p;
            if (!p->fesq) p = p->fdre;
            else if (!p->fdre) p = p->fesq;
            else {
                Node* m = esborrar_minim(p->fdre);
                m->fesq = p->fesq;
                m->fdre = p->fdre;
                p = m;
            }
            delete q;
            --n;
        }
    }

    static Node* cerca(Node* p, const Clau& clau) {
        if (!p) return nullptr;
        if (clau < p->clau) return cerca(p->fesq, clau);
        if (clau > p->clau) return cerca(p->fdre, clau);
        return p;
    }

    static void alliberar(Node* p) {
        if (p) {
            alliberar(p->fesq);
            alliberar(p->fdre);
            delete p;
        }
    }

public:
    Diccionari() : n(0), arrel(nullptr) { }
    ~Diccionari() { alliberar(arrel); }

    int talla() const {
        return n;
    }

    bool present(const Clau& clau) const {
        return cerca(arrel, clau) != nullptr;
    }

    Info& consulta(const Clau& clau) {
        Node* p = cerca(arrel, clau);
        if (!p) throw runtime_error("La clau no era present");
        return p->info;
    }

    void assigna(const Clau& clau, const Info& info) {
        assignar(arrel, clau, info, n);
    }

    void esborra(const Clau& clau) {
        esborrar(arrel, clau, n);
    }
};

int main() {
    Diccionari<int, string> D;
    D.assigna(5, "cinc");
    D.assigna(2, "dos");
    D.assigna(8, "vuit");
    D.assigna(6, "sis");
    D.assigna(9, "nou");

    cout << "Talla inicial: " << D.talla() << endl;

    // Esborrem la clau 5 (arrel amb 2 fills: 2 i 8)
    D.esborra(5);

    cout << "Present 5? " << (D.present(5) ? "Si" : "No") << endl;
    cout << "Nova arrel: " << D.consulta(6) << endl;
    cout << "Talla final: " << D.talla() << endl;

    return 0;
}
