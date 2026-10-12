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

    static Node* cerca(Node* p, const Clau& clau) {
        if (!p) return nullptr;
        if (clau < p->clau) return cerca(p->fesq, clau);
        if (clau > p->clau) return cerca(p->fdre, clau);
        return p;
    }

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

    bool present(const Clau& clau) const {
        return cerca(arrel, clau) != nullptr;
    }

    int talla() const {
        return n;
    }

    Info& consulta(const Clau& clau) {
        Node* p = cerca(arrel, clau);
        if (!p) throw runtime_error("La clau no era present");
        return p->info;
    }

    void assigna(const Clau& clau, const Info& info) {
        assignar(arrel, clau, info, n);
    }
};

int main() {
    Diccionari<int, string> D;
    D.assigna(8, "vuit");
    D.assigna(3, "tres");
    D.assigna(10, "deu");

    cout << "Present 3? " << (D.present(3) ? "Si" : "No") << endl;
    cout << "Consulta 8: " << D.consulta(8) << endl;
    cout << "Talla total: " << D.talla() << endl;

    return 0;
}
