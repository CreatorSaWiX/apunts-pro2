#include <iostream>
#include <string>
#include <algorithm>
#include <stdexcept>
using namespace std;

template <typename Clau, typename Info>
class DiccionariAVL {
private:
    struct Node {
        Clau clau;
        Info info;
        Node* fesq;
        Node* fdre;
        int alc;
        Node(const Clau& c, const Info& i, Node* fe = nullptr, Node* fd = nullptr, int a = 0)
            : clau(c), info(i), fesq(fe), fdre(fd), alc(a) { }
    };

    int n;
    Node* arrel;

    static int alcada(Node* p) {
        return p ? p->alc : -1;
    }

    static void actualitzar_alcada(Node* p) {
        if (p) p->alc = 1 + max(alcada(p->fesq), alcada(p->fdre));
    }

    static void LL(Node*& p) {
        Node* q = p;
        p = p->fesq;
        q->fesq = p->fdre;
        p->fdre = q;
        actualitzar_alcada(q);
        actualitzar_alcada(p);
    }

    static void RR(Node*& p) {
        Node* q = p;
        p = p->fdre;
        q->fdre = p->fesq;
        p->fesq = q;
        actualitzar_alcada(q);
        actualitzar_alcada(p);
    }

    static void LR(Node*& p) {
        RR(p->fesq);
        LL(p);
    }

    static void RL(Node*& p) {
        LL(p->fdre);
        RR(p);
    }

    static void assignar(Node*& p, const Clau& clau, const Info& info, int& n) {
        if (p) {
            if (clau < p->clau) {
                assignar(p->fesq, clau, info, n);
                if (alcada(p->fesq) - alcada(p->fdre) == 2) {
                    if (clau < p->fesq->clau) LL(p);
                    else LR(p);
                }
                actualitzar_alcada(p);
            } else if (clau > p->clau) {
                assignar(p->fdre, clau, info, n);
                if (alcada(p->fdre) - alcada(p->fesq) == 2) {
                    if (clau > p->fdre->clau) RR(p);
                    else RL(p);
                }
                actualitzar_alcada(p);
            } else {
                p->info = info;
            }
        } else {
            p = new Node(clau, info, nullptr, nullptr, 0);
            ++n;
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
    DiccionariAVL() : n(0), arrel(nullptr) { }
    ~DiccionariAVL() { alliberar(arrel); }

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
};

int main() {
    DiccionariAVL<int, string> D;
    D.assigna(10, "deu");
    D.assigna(20, "vint");
    D.assigna(30, "trenta");

    cout << "Present 20? " << (D.present(20) ? "Si" : "No") << endl;
    cout << "Consulta 10: " << D.consulta(10) << endl;
    cout << "Talla AVL: " << D.talla() << endl;

    return 0;
}
