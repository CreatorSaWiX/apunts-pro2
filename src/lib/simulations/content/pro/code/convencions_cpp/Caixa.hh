#ifndef CAIXA_HH
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

#endif